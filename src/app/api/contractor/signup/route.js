import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJwtSecret, setAuthCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name,
      email,
      password,
      phone,
      company_name,
      city,
      state,
      vendor_type,
      experience,
      gst,
      pan,
      message,
    } = body;

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(name || '').trim();
    const cleanPhone = String(phone || '').trim();
    const cleanCompany = String(company_name || cleanName || 'Contractor').trim();
    const cleanCity = String(city || '').trim();
    const cleanType = String(vendor_type || 'Civil Contractor').trim();
    const rawPassword = String(password || '').trim();

    if (!cleanEmail || !cleanPhone || !cleanName) {
      return NextResponse.json(
        { error: 'Name, email, and phone number are required.' },
        { status: 400 }
      );
    }

    if (!rawPassword || rawPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Check if email already exists in vendors
    const existingVendor = await pool.query(
      'SELECT id FROM vendors WHERE LOWER(TRIM(email)) = $1 LIMIT 1',
      [cleanEmail]
    );

    if (existingVendor.rows.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please login instead.' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Insert into vendors table
    const vendorRes = await pool.query(
      `INSERT INTO vendors (
        vendor_name,
        shop_name,
        business_name,
        email,
        phone,
        city,
        state,
        country,
        business_type,
        description,
        gst_number,
        pan_number,
        status,
        verification_status,
        is_approved,
        approval_date,
        password_hash,
        created_at,
        updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active', 'verified', true, NOW(), $13, NOW(), NOW()
      ) RETURNING id, vendor_name, shop_name, email, phone, city, state, business_type, status, is_approved, created_at`,
      [
        cleanName,
        cleanCompany,
        cleanCompany,
        cleanEmail,
        cleanPhone,
        cleanCity,
        state || 'Uttar Pradesh',
        'India',
        cleanType.toLowerCase().includes('contractor') ? cleanType : `${cleanType} Contractor`,
        message || `Specialization: ${cleanType}. Experience: ${experience || 'Experienced'}.`,
        gst || null,
        pan || null,
        passwordHash,
      ]
    );

    const createdContractor = vendorRes.rows[0];

    // Ensure corresponding record in users table with role = 'Contractor'
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE LOWER(TRIM(email)) = $1 LIMIT 1',
      [cleanEmail]
    );

    if (existingUser.rows.length === 0) {
      await pool.query(
        `INSERT INTO users (name, email, phone, delivery_city, password, role, is_blocked, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 'Contractor', false, NOW(), NOW())`,
        [cleanName, cleanEmail, cleanPhone, cleanCity, passwordHash]
      ).catch(() => {});
    } else {
      await pool.query(
        `UPDATE users SET role = 'Contractor', phone = COALESCE(phone, $2), delivery_city = COALESCE(delivery_city, $3) WHERE id = $1`,
        [existingUser.rows[0].id, cleanPhone, cleanCity]
      ).catch(() => {});
    }

    // Generate JWT token so contractor is immediately authenticated
    const token = jwt.sign(
      {
        id: createdContractor.id,
        email: createdContractor.email,
        role: 'contractor',
        name: createdContractor.vendor_name || createdContractor.shop_name,
        business_type: createdContractor.business_type,
      },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    const safeData = {
      id: createdContractor.id,
      name: createdContractor.vendor_name,
      shop_name: createdContractor.shop_name,
      business_name: createdContractor.shop_name,
      email: createdContractor.email,
      phone: createdContractor.phone,
      city: createdContractor.city,
      state: createdContractor.state,
      business_type: createdContractor.business_type,
      status: createdContractor.status,
      is_approved: createdContractor.is_approved,
      created_at: createdContractor.created_at,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Contractor account registered successfully!',
      token,
      contractor: safeData,
      user: {
        ...safeData,
        role: 'Contractor',
      }
    }, { status: 201 });

    try {
      setAuthCookie(response, token, { maxAge: 7 * 24 * 60 * 60 });
    } catch {}

    return response;
  } catch (error) {
    console.error('Contractor signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Could not register contractor account.' },
      { status: 500 }
    );
  }
}
