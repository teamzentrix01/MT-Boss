
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      email, password,
      shop_name, business_name, phone,
      city, state, country, postal_code,
      business_type, description,
    } = body;

    // Basic validation
    if (!email || !password || !shop_name || !business_name || !phone) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await pool.query(
      'SELECT id FROM suppliers WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Insert new supplier — bank details & aadhaar saved later via Profile Edit
    const result = await pool.query(
      `INSERT INTO suppliers (
        email, password_hash,
        shop_name, business_name, phone,
        city, state, country, postal_code,
        business_type, description,
        status
      ) VALUES (
        $1, crypt($2, gen_salt('bf')),
        $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11,
        'pending'
      )
      RETURNING id, email, shop_name, business_name, phone, status, created_at`,
      [
        email, password,
        shop_name, business_name, phone,
        city || null, state || null, country || 'India', postal_code || null,
        business_type || null, description || null,
      ]
    );

    const supplier = result.rows[0];

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please wait for admin approval before logging in.',
      supplier: {
        id: supplier.id,
        email: supplier.email,
        shop_name: supplier.shop_name,
        status: supplier.status,
      },
    }, { status: 201 });

  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}