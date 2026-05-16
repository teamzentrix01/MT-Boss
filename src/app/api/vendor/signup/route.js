import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  let client;
  try {
    let email, password, phone, city, state, country, postal_code,
        aadhar_number, services, profilePhotoBuffer, profilePhotoMime,
        aadharImageBuffer, aadharImageMime;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
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

      const profileFile = fd.get('profile_photo');
      const aadharFile  = fd.get('aadhar_image');
      if (profileFile?.size > 0) {
        profilePhotoBuffer = Buffer.from(await profileFile.arrayBuffer());
        profilePhotoMime   = profileFile.type;
      }
      if (aadharFile?.size > 0) {
        aadharImageBuffer = Buffer.from(await aadharFile.arrayBuffer());
        aadharImageMime   = aadharFile.type;
      }
    } else {
      const body    = await req.json();
      email         = body.email;
      password      = body.password;
      phone         = body.phone;
      city          = body.city;
      state         = body.state;
      country       = body.country || 'India';
      postal_code   = body.postal_code;
      aadhar_number = (body.aadhar_number || '').replace(/\s/g, '');
      services      = body.services || [];
    }

    console.log('=== Vendor Signup ===', { email, phone, city });

    // Validation
    if (!email || !password || !phone || !city || !state || !postal_code) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, phone, city, state, postal_code' },
        { status: 400 }
      );
    }
    if (!aadhar_number || aadhar_number.length !== 12) {
      return NextResponse.json({ error: 'Invalid Aadhaar number — must be 12 digits' }, { status: 400 });
    }
    if (!Array.isArray(services) || services.length === 0) {
      return NextResponse.json({ error: 'Please select at least one service' }, { status: 400 });
    }

    // Check duplicate email
    const exists = await pool.query('SELECT id FROM vendors WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    client = await pool.connect();
    await client.query('BEGIN');

    // Detect which columns exist to stay compatible with current schema
    const colCheck = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'vendors'`
    );
    const cols = new Set(colCheck.rows.map(r => r.column_name));

    // Build INSERT fields dynamically
    const fields = {
      email,
      password: hashedPassword,
      phone,
      city,
      state,
      country,
      postal_code,
      status: 'active',
      verification_status: 'pending',
    };

    // Old schema compat — fill required NOT NULL columns with defaults
    if (cols.has('shop_name'))     fields.shop_name     = email.split('@')[0];
    if (cols.has('business_name')) fields.business_name = email.split('@')[0];

    // New identity columns — only insert if column exists in DB
    if (cols.has('aadhar_number'))     fields.aadhar_number     = aadhar_number;
    if (cols.has('profile_photo') && profilePhotoBuffer)
      fields.profile_photo = profilePhotoBuffer;
    if (cols.has('profile_photo_mime') && profilePhotoMime)
      fields.profile_photo_mime = profilePhotoMime;
    if (cols.has('aadhar_image') && aadharImageBuffer)
      fields.aadhar_image = aadharImageBuffer;
    if (cols.has('aadhar_image_mime') && aadharImageMime)
      fields.aadhar_image_mime = aadharImageMime;

    const colNames     = Object.keys(fields);
    const paramValues  = Object.values(fields);
    const placeholders = paramValues.map((_, i) => `$${i + 1}`);

    const insertSQL = `
      INSERT INTO vendors (${colNames.join(', ')}, created_at, updated_at)
      VALUES (${placeholders.join(', ')}, NOW(), NOW())
      RETURNING id, email, phone, city, state, country, postal_code, status, verification_status
    `;

    const vendorResult = await client.query(insertSQL, paramValues);
    if (!vendorResult.rows[0]) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Failed to create vendor account' }, { status: 500 });
    }

    const vendor = vendorResult.rows[0];
    console.log('✓ Vendor created:', vendor.id);

    // Assign services
    for (const serviceId of services) {
      try {
        await client.query(
          `INSERT INTO vendor_services (vendor_id, quick_service_id, is_active)
           VALUES ($1, $2, TRUE)
           ON CONFLICT (vendor_id, quick_service_id) DO UPDATE SET is_active = TRUE`,
          [vendor.id, serviceId]
        );
      } catch (e) {
        console.warn('⚠ Service assign failed for', serviceId, e.message);
      }
    }
    console.log('✓ Services assigned:', services.length);

    // Vendor stats — only insert vendor_id, no timestamps
    try {
      await client.query(
        `INSERT INTO vendor_stats (vendor_id) VALUES ($1) ON CONFLICT (vendor_id) DO NOTHING`,
        [vendor.id]
      );
    } catch (e) {
      console.warn('⚠ Stats creation failed (non-critical):', e.message);
    }

    await client.query('COMMIT');

    const token = jwt.sign(
      { id: vendor.id, email: vendor.email, role: 'vendor' },
      process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Vendor account created successfully',
      token,
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
        role: 'vendor',
      },
      redirectTo: '/vendor/dashboard',
    }, { status: 201 });

  } catch (error) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch (_) {}
    }
    console.error('Signup error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}