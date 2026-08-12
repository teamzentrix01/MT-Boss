import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { ensurePackageSchema, getPackageById } from '@/lib/packages';
import { cleanText, normalizePhone, isValidEmail, isValidIndianMobile } from '@/lib/validation';
import { cleanCity, ensureServiceCitiesSchema } from '@/lib/service-cities';
import { resolveManagedCity } from '@/lib/cities';
import { verifyOtp } from '@/lib/otp';
import { createPayURequest } from '@/lib/payu';
import { createPayUIntent, getPayUCallbackUrl, newPayUTxnId } from '@/lib/payu-intents';

export async function POST(req) {
  let client;
  let retryVendorId = null;
  try {
    let email, password, phone, city, state, country, postal_code,
        aadhar_number, services, profilePhotoBuffer, profilePhotoMime,
        aadharImageBuffer, aadharImageMime, package_id, registration_otp;

    const contentType = req.headers.get('content-type') || '';

    console.log('📨 [SIGNUP] Request received');
    console.log('📨 [SIGNUP] Content-Type:', contentType);

    // ════════════════════════════════════════════════════════════════
    // PARSE REQUEST DATA
    // ════════════════════════════════════════════════════════════════

    if (contentType.includes('multipart/form-data')) {
      console.log('📨 [SIGNUP] Parsing FormData with file uploads...');
      
      const fd = await req.formData();
      email         = fd.get('email');
      password      = fd.get('password');
      phone         = fd.get('phone');
      city          = fd.get('city');
      state         = fd.get('state');
      country       = fd.get('country') || 'India';
      postal_code   = fd.get('postal_code');
      aadhar_number = (fd.get('aadhar_number') || '').replace(/\s/g, '');
      services      = JSON.parse(fd.get('services') || '[]');
      package_id    = fd.get('package_id');
      registration_otp = fd.get('registration_otp');

      const profileFile = fd.get('profile_photo');
      const aadharFile  = fd.get('aadhar_image');

      if (profileFile?.size > 0) {
        profilePhotoBuffer = Buffer.from(await profileFile.arrayBuffer());
        profilePhotoMime   = profileFile.type;
        console.log('📷 [SIGNUP] Profile photo received:', profilePhotoMime);
      }
      if (aadharFile?.size > 0) {
        aadharImageBuffer = Buffer.from(await aadharFile.arrayBuffer());
        aadharImageMime   = aadharFile.type;
        console.log('🪪 [SIGNUP] Aadhaar image received:', aadharImageMime);
      }
    } else {
      console.log('📨 [SIGNUP] Parsing JSON request...');
      const body = await req.json();
      email         = body.email;
      password      = body.password;
      phone         = body.phone;
      city          = body.city;
      state         = body.state;
      country       = body.country || 'India';
      postal_code   = body.postal_code;
      aadhar_number = (body.aadhar_number || '').replace(/\s/g, '');
      services      = body.services || [];
      package_id    = body.package_id;
      registration_otp = body.registration_otp;
    }

    email = cleanText(email).toLowerCase();
    phone = normalizePhone(phone);
    postal_code = cleanText(postal_code);
    city = cleanCity(city);
    const canonicalManagedCity = await resolveManagedCity(city);

    console.log('✅ [SIGNUP] Data parsed:', { email, phone, city, services: services.length });

    // ════════════════════════════════════════════════════════════════
    // VALIDATION
    // ════════════════════════════════════════════════════════════════

    if (!email || !password || !phone || !canonicalManagedCity || !state || !postal_code) {
      console.warn('❌ [SIGNUP] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: email, password, phone, city, state, postal_code' },
        { status: 400 }
      );
    }
    if (!/^\d{6}$/.test(String(registration_otp || '').trim())) {
      return NextResponse.json({ error: 'Enter the 6-digit email verification OTP.' }, { status: 400 });
    }
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vendor_signup_otps (
        id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL, otp_hash TEXT NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0, expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    const signupOtp = await pool.query(
      `SELECT id, otp_hash, attempts FROM vendor_signup_otps
       WHERE email = $1 AND used = FALSE AND attempts < 5 AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [email]
    );
    if (!signupOtp.rows[0] || !verifyOtp(String(registration_otp).trim(), signupOtp.rows[0].otp_hash)) {
      if (signupOtp.rows[0]) {
        await pool.query(`UPDATE vendor_signup_otps SET attempts = attempts + 1 WHERE id = $1`, [signupOtp.rows[0].id]);
      }
      return NextResponse.json({ error: 'Invalid or expired registration OTP.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }
    if (!isValidIndianMobile(phone)) {
      return NextResponse.json({ error: 'Phone number must be 10 digits and start with 6, 7, 8 or 9' }, { status: 400 });
    }
    if (!/^\d{6}$/.test(postal_code)) {
      return NextResponse.json({ error: 'Postal code must be exactly 6 digits' }, { status: 400 });
    }

    if (!aadhar_number || !/^\d{12}$/.test(aadhar_number)) {
      console.warn('❌ [SIGNUP] Invalid Aadhaar number:', aadhar_number);
      return NextResponse.json(
        { error: 'Invalid Aadhaar number — must be 12 digits' },
        { status: 400 }
      );
    }

    if (!Array.isArray(services) || services.length === 0) {
      console.warn('❌ [SIGNUP] No services selected');
      return NextResponse.json(
        { error: 'Please select at least one service' },
        { status: 400 }
      );
    }

    const serviceIds = [...new Set(
      services
        .map((serviceId) => Number(serviceId))
        .filter((serviceId) => Number.isInteger(serviceId) && serviceId > 0)
    )];
    if (serviceIds.length !== services.length) {
      return NextResponse.json({ error: 'Invalid service selection' }, { status: 400 });
    }

    await ensureServiceCitiesSchema();
    const coveredServices = await pool.query(
      `SELECT qs.id, qs.label, $1::TEXT AS canonical_city
       FROM quick_services qs
       WHERE qs.id = ANY($2::int[])
         AND COALESCE(qs.is_service_active, TRUE) = TRUE`,
      [canonicalManagedCity, serviceIds]
    );
    if (coveredServices.rows.length !== serviceIds.length) {
      return NextResponse.json(
        { error: 'Every selected service must be available in the selected city. Please select the city again.' },
        { status: 400 }
      );
    }

    city = canonicalManagedCity;
    services = serviceIds;
    const selectedPackageId = String(package_id || 'free');
    const isFreeRegistration = selectedPackageId === 'free';
    const pkg = isFreeRegistration ? null : getPackageById(selectedPackageId);

    if (!isFreeRegistration && !pkg) {
      return NextResponse.json({ error: 'Select a valid subscription plan' }, { status: 400 });
    }

    // ════════════════════════════════════════════════════════════════
    // CHECK DUPLICATE EMAIL
    // ════════════════════════════════════════════════════════════════

    console.log('🔍 [SIGNUP] Checking for duplicate email...');
    const existsResult = await pool.query(
      `SELECT id, password_hash, verification_status, is_approved, package_status
       FROM vendors WHERE email = $1`,
      [email]
    );

    if (existsResult.rows.length > 0) {
      const existingVendor = existsResult.rows[0];
      const canRetryPayment = !isFreeRegistration
        && !existingVendor.is_approved
        && existingVendor.verification_status === 'payment_pending'
        && !['pending', 'active'].includes(existingVendor.package_status);
      const passwordMatches = canRetryPayment
        ? await bcrypt.compare(password, existingVendor.password_hash)
        : false;

      if (passwordMatches) {
        retryVendorId = existingVendor.id;
      }
    }

    if (existsResult.rows.length > 0 && !retryVendorId) {
      console.warn('❌ [SIGNUP] Email already registered:', email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    console.log('✅ [SIGNUP] Email is unique');

    // ════════════════════════════════════════════════════════════════
    // HASH PASSWORD
    // ════════════════════════════════════════════════════════════════

    console.log('🔐 [SIGNUP] Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ [SIGNUP] Password hashed successfully');

    // ════════════════════════════════════════════════════════════════
    // START DATABASE TRANSACTION
    // ════════════════════════════════════════════════════════════════

    await ensurePackageSchema();

    console.log('💾 [SIGNUP] Getting database connection...');
    client = await pool.connect();
    console.log('✅ [SIGNUP] Connected to database');

    console.log('🔄 [SIGNUP] Starting transaction...');
    await client.query('BEGIN');
    console.log('✅ [SIGNUP] Transaction started');

    // ════════════════════════════════════════════════════════════════
    // DETECT DATABASE COLUMNS
    // ════════════════════════════════════════════════════════════════

    console.log('📋 [SIGNUP] Checking available columns...');
    const colCheck = await client.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'vendors'
       ORDER BY ordinal_position`
    );
    const cols = new Set(colCheck.rows.map(r => r.column_name));
    console.log('✅ [SIGNUP] Available columns:', Array.from(cols).join(', '));

    // ════════════════════════════════════════════════════════════════
    // BUILD INSERT FIELDS
    // ════════════════════════════════════════════════════════════════

    console.log('🏗️ [SIGNUP] Building insert fields...');
    
    const fields = {
      email,
      password_hash: hashedPassword,
      phone,
      city,
      state,
      country,
      postal_code,
      status: 'inactive',
      verification_status: isFreeRegistration ? 'pending' : 'payment_pending',
      is_approved: false,
    };

    if (cols.has('package_id')) {
      fields.package_id = null;
      fields.package_name = null;
      fields.package_price = 0;
      fields.package_duration_months = 0;
      fields.package_purchased_at = null;
      fields.package_status = 'none';
    }

    if (cols.has('shop_name'))     fields.shop_name     = email.split('@')[0];
    if (cols.has('business_name')) fields.business_name = email.split('@')[0];

    if (cols.has('aadhar_number') && aadhar_number)
      fields.aadhar_number = aadhar_number;
    
    if (cols.has('profile_photo') && profilePhotoBuffer)
      fields.profile_photo = profilePhotoBuffer;
    
    if (cols.has('profile_photo_mime') && profilePhotoMime)
      fields.profile_photo_mime = profilePhotoMime;
    
    if (cols.has('aadhar_image') && aadharImageBuffer)
      fields.aadhar_image = aadharImageBuffer;
    
    if (cols.has('aadhar_image_mime') && aadharImageMime)
      fields.aadhar_image_mime = aadharImageMime;

    console.log('✅ [SIGNUP] Fields prepared:', Object.keys(fields).join(', '));

    // ════════════════════════════════════════════════════════════════
    // BUILD AND EXECUTE INSERT QUERY
    // ════════════════════════════════════════════════════════════════

    const colNames     = Object.keys(fields);
    const paramValues  = Object.values(fields);
    const placeholders = paramValues.map((_, i) => `$${i + 1}`);

    const insertSQL = `
      INSERT INTO vendors (${colNames.join(', ')}, created_at, updated_at)
      VALUES (${placeholders.join(', ')}, NOW(), NOW())
      RETURNING id, email, phone, city, state, country, postal_code, 
                status, verification_status, is_approved, created_at
    `;
    const updateSQL = `
      UPDATE vendors
      SET ${colNames.map((columnName, i) => `${columnName} = $${i + 1}`).join(', ')},
          updated_at = NOW()
      WHERE id = $${paramValues.length + 1}
      RETURNING id, email, phone, city, state, country, postal_code,
                status, verification_status, is_approved, created_at
    `;

    console.log('📝 [SIGNUP] Insert SQL prepared');
    console.log('🔢 [SIGNUP] Number of fields:', colNames.length);

    console.log('⚙️ [SIGNUP] Executing INSERT query...');
    const vendorResult = retryVendorId
      ? await client.query(updateSQL, [...paramValues, retryVendorId])
      : await client.query(insertSQL, paramValues);
    
    if (!vendorResult.rows[0]) {
      await client.query('ROLLBACK');
      console.error('❌ [SIGNUP] Insert failed - no rows returned');
      return NextResponse.json(
        { error: 'Failed to create vendor account - database error' },
        { status: 500 }
      );
    }

    const vendor = vendorResult.rows[0];
    console.log('✅ [SIGNUP] Vendor inserted successfully!');
    console.log('✅ [SIGNUP] Vendor ID:', vendor.id);
    console.log('✅ [SIGNUP] Email:', vendor.email);

    // ════════════════════════════════════════════════════════════════
    // ASSIGN SERVICES
    // ════════════════════════════════════════════════════════════════

    if (services.length > 0) {
      console.log('⚙️ [SIGNUP] Assigning services...');
      if (retryVendorId) {
        await client.query(`UPDATE vendor_services SET is_active = FALSE WHERE vendor_id = $1`, [vendor.id]);
      }
      for (const serviceId of services) {
        try {
          await client.query(
            `INSERT INTO vendor_services (vendor_id, quick_service_id, is_active)
             VALUES ($1, $2, TRUE)
             ON CONFLICT (vendor_id, quick_service_id) 
             DO UPDATE SET is_active = TRUE`,
            [vendor.id, serviceId]
          );
          console.log('✅ [SIGNUP] Service assigned:', serviceId);
        } catch (e) {
          console.warn('⚠️ [SIGNUP] Service assignment failed for', serviceId, ':', e.message);
        }
      }
      console.log('✅ [SIGNUP] All services assigned');
    }

    // ════════════════════════════════════════════════════════════════
    // CREATE VENDOR STATS (NON-CRITICAL - DON'T FAIL ON THIS)
    // ════════════════════════════════════════════════════════════════

    console.log('⚙️ [SIGNUP] Creating vendor stats...');
    try {
      // ✅ FIX: Try simple INSERT without ON CONFLICT first
      await client.query(
        
        `INSERT INTO vendor_stats (vendor_id)
         VALUES ($1)`,
        [vendor.id]
      );
      console.log('✅ [SIGNUP] Vendor stats created');
    } catch (e) {
      // If vendor_stats already exists or constraint fails, just log and continue
      // This is non-critical - don't fail the whole signup
      console.warn('⚠️ [SIGNUP] Stats creation note:', e.message);
      console.warn('⚠️ [SIGNUP] Continuing anyway - stats are non-critical');
    }

    // ════════════════════════════════════════════════════════════════
    // COMMIT TRANSACTION
    // ════════════════════════════════════════════════════════════════

    console.log('🔄 [SIGNUP] Committing transaction...');
    await client.query(`UPDATE vendor_signup_otps SET used = TRUE WHERE email = $1 AND used = FALSE`, [email]);

    let payment = null;
    if (!isFreeRegistration) {
      const txnid = newPayUTxnId('VRG');
      await createPayUIntent({
        txnid,
        purpose: 'vendor_registration',
        entityId: vendor.id,
        packageId: pkg.id,
        amount: pkg.price,
        client,
      });
      const callbackUrl = getPayUCallbackUrl(req);
      payment = createPayURequest({
        txnid,
        amount: pkg.price,
        productinfo: `MTBOSS vendor registration - ${pkg.label}`,
        firstname: String(fields.shop_name || fields.business_name || email).trim().split(/\s+/)[0],
        email,
        phone,
        surl: callbackUrl,
        furl: callbackUrl,
        udf1: String(vendor.id),
        udf2: pkg.id,
        udf3: 'vendor_registration',
      });
    }

    await client.query('COMMIT');
    console.log('✅ [SIGNUP] Transaction committed successfully');

    // ════════════════════════════════════════════════════════════════
    // RETURN SUCCESS RESPONSE
    // ════════════════════════════════════════════════════════════════

    console.log('🎉 [SIGNUP] Signup complete! Vendor is pending approval.');

    return NextResponse.json({
      success: true,
      message: payment
        ? 'Registration saved. Redirecting to PayU for subscription payment.'
        : 'Account created! Waiting for admin approval. You will receive an email once approved.',
      token: null,
      vendor: {
        id: vendor.id,
        email: vendor.email,
        phone: vendor.phone,
        city: vendor.city,
        state: vendor.state,
        country: vendor.country,
        postal_code: vendor.postal_code,
        status: vendor.status,
        verification_status: vendor.verification_status,
        is_approved: vendor.is_approved,
        role: 'vendor',
      },
      payment,
      redirectTo: '/vendor/pending-approval',
    }, { status: 201 });

  } catch (error) {
    console.error('❌ [SIGNUP] CRITICAL ERROR:', error.message);
    console.error('❌ [SIGNUP] Error Stack:', error.stack);

    if (client) {
      try {
        await client.query('ROLLBACK');
        console.log('✅ [SIGNUP] Transaction rolled back');
      } catch (rollbackErr) {
        console.error('❌ [SIGNUP] Rollback failed:', rollbackErr.message);
      }
    }

    return NextResponse.json(
      { 
        error: error.message || 'Server error occurred',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        client.release();
        console.log('✅ [SIGNUP] Database connection released');
      } catch (releaseErr) {
        console.error('❌ [SIGNUP] Connection release failed:', releaseErr.message);
      }
    }
  }
}
