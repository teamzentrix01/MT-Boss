import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // ✅ FIXED: Changed "password" to "password_hash" on this line
    const result = await pool.query(
      'SELECT id, email, password_hash, shop_name, business_name, phone, city, state, country, postal_code, status, verification_status, is_approved, created_at FROM vendors WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found or incorrect credentials' }, { status: 401 });
    }

    const vendor = result.rows[0];
    
    // ✅ FIXED: Changed "vendor.password" to "vendor.password_hash" on this line
    const isPasswordValid = await bcrypt.compare(password, vendor.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Vendor not found or incorrect credentials' }, { status: 401 });
    }

    // ── Check vendor status (optional) ──
    if (vendor.status === 'inactive') {
      return NextResponse.json({ error: 'Your vendor account is inactive. Contact support.' }, { status: 403 });
    }

    // ── Check if vendor is approved ──
    if (!vendor.is_approved) {
      return NextResponse.json({ error: 'Your account is pending admin approval. Please wait.' }, { status: 403 });
    }

    // ── Generate JWT token ──
    const token = jwt.sign(
      { id: vendor.id, email: vendor.email, role: 'vendor' },
      process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    return NextResponse.json({
      success: true,
      token,
      vendor: {
        id: vendor.id,
        email: vendor.email,
        phone: vendor.phone,
        shop_name: vendor.shop_name,
        business_name: vendor.business_name,
        city: vendor.city,
        state: vendor.state,
        country: vendor.country,
        postal_code: vendor.postal_code,
        status: vendor.status,
        verification_status: vendor.verification_status,
        is_approved: vendor.is_approved,
        role: 'vendor',
      },
      redirectTo: '/vendor/dashboard',
    }, { status: 200 });

  } catch (error) {
    console.error('Vendor login error:', error);
    return NextResponse.json({ error: 'Server error occurred.' }, { status: 500 });
  }
}