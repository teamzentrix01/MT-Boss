import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ensurePackageSchema, getPackageById } from '@/lib/packages';
import { cleanText, normalizePhone, isValidEmail, isValidIndianMobile } from '@/lib/validation';

export async function POST(req) {
  let client;
  try {
    let email, password, phone, city, state, country, postal_code,
        aadhar_number, services, profilePhotoBuffer, profilePhotoMime,
        aadharImageBuffer, aadharImageMime, package_id;

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
    }

    email = cleanText(email).toLowerCase();
    phone = normalizePhone(phone);
    postal_code = cleanText(postal_code);

    console.log('✅ [SIGNUP] Data parsed:', { email, phone, city, services: services.length });

    // ════════════════════════════════════════════════════════════════
    // VALIDATION
    // ════════════════════════════════════════════════════════════════

    if (!email || !password || !phone || !city || !state || !postal_code) {
      console.warn('❌ [SIGNUP] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: email, password, phone, city, state, postal_code' },
        { status: 400 }
      );
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

    // ════════════════════════════════════════════════════════════════
    // CHECK DUPLICATE EMAIL
    // ════════════════════════════════════════════════════════════════

    console.log('🔍 [SIGNUP] Checking for duplicate email...');
    const existsResult = await pool.query(
      'SELECT id FROM vendors WHERE email = $1',
      [email]
    );

    if (existsResult.rows.length > 0) {
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
    
    const pkg = getPackageById(package_id || 'pkg_6m') || getPackageById('pkg_6m');

    const fields = {
      email,
      password_hash: hashedPassword,
      phone,
      city,
      state,
      country,
      postal_code,
      status: 'inactive',
      verification_status: 'pending',
      is_approved: false,
    };

    if (cols.has('package_id')) {
      fields.package_id = pkg.id;
      fields.package_name = pkg.name;
      fields.package_price = pkg.price;
      fields.package_duration_months = pkg.duration_months;
      fields.package_purchased_at = new Date().toISOString();
      fields.package_status = 'pending';
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

    console.log('📝 [SIGNUP] Insert SQL prepared');
    console.log('🔢 [SIGNUP] Number of fields:', colNames.length);

    console.log('⚙️ [SIGNUP] Executing INSERT query...');
    const vendorResult = await client.query(insertSQL, paramValues);
    
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
    await client.query('COMMIT');
    console.log('✅ [SIGNUP] Transaction committed successfully');

    // ════════════════════════════════════════════════════════════════
    // RETURN SUCCESS RESPONSE
    // ════════════════════════════════════════════════════════════════

    console.log('🎉 [SIGNUP] Signup complete! Vendor is pending approval.');

    return NextResponse.json({
      success: true,
      message: 'Account created! Waiting for admin approval. You will receive an email once approved.',
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
