import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensurePackageSchema, getPackageById } from '@/lib/packages';
import { cleanText, normalizePhone, isValidEmail, isValidIndianMobile } from '@/lib/validation';

export async function POST(request) {
  try {
    const body = await request.json();
    let { email, password, shop_name, phone, city, state, country, postal_code, aadhaar_number, product_categories, package_id } = body;
    email = cleanText(email).toLowerCase();
    phone = normalizePhone(phone);
    postal_code = cleanText(postal_code);

    if (!email || !password || !shop_name || !phone) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }
    if (!isValidIndianMobile(phone)) {
      return NextResponse.json({ error: 'Phone number must be 10 digits and start with 6, 7, 8 or 9' }, { status: 400 });
    }
    if (postal_code && !/^\d{6}$/.test(postal_code)) {
      return NextResponse.json({ error: 'Postal code must be exactly 6 digits' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    if (!aadhaar_number || !/^\d{12}$/.test(aadhaar_number.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Valid 12-digit Aadhaar number is required' }, { status: 400 });
    }
    if (!product_categories || product_categories.length === 0) {
      return NextResponse.json({ error: 'Select at least one product category' }, { status: 400 });
    }

    await ensurePackageSchema();
    await pool.query(`ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS product_categories TEXT[] DEFAULT '{}'`);

    const existing = await pool.query('SELECT id FROM suppliers WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const pkg = getPackageById(package_id || 'pkg_6m') || getPackageById('pkg_6m');

    // $4 = business_name (same as shop_name — column has NOT NULL constraint)
    const result = await pool.query(
      `INSERT INTO suppliers (
        email, password_hash,
        shop_name, business_name, phone,
        city, state, country, postal_code,
        aadhaar_number, product_categories, status,
        package_id, package_name, package_price, package_duration_months,
        package_purchased_at, package_status
      ) VALUES (
        $1, crypt($2, gen_salt('bf')),
        $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, 'pending',
        $12, $13, $14, $15,
        NOW(), 'pending'
      )
      RETURNING id, email, shop_name, phone, status, created_at`,
      [
        email, password,
        shop_name, shop_name, phone,
        city || null, state || null, country || 'India', postal_code || null,
        aadhaar_number.replace(/\s/g, ''),
        product_categories,
        pkg.id, pkg.name, pkg.price, pkg.duration_months
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please wait for admin approval before logging in.',
      supplier: { id: result.rows[0].id, email: result.rows[0].email, shop_name: result.rows[0].shop_name, status: 'pending' },
    }, { status: 201 });

  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
