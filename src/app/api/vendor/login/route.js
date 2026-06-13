import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJwtSecret, setAuthCookie } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT 
        id, email, password_hash, shop_name, business_name, 
        phone, city, state, country, postal_code, 
        status, verification_status, is_approved, created_at 
       FROM vendors 
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Vendor not found or incorrect credentials' }, 
        { status: 401 }
      );
    }

    const vendor = result.rows[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, vendor.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Vendor not found or incorrect credentials' }, 
        { status: 401 }
      );
    }

    // ✅ CHECK 1: Account pending approval
    if (!vendor.is_approved) {
      return NextResponse.json(
        { 
          error: 'Your vendor account is pending admin approval.',
          code: 'PENDING_APPROVAL',
          message: 'Your registration is under review. You will receive an email once approved. This usually takes 24-48 hours.'
        }, 
        { status: 403 }
      );
    }

    // ✅ CHECK 2: Account inactive (rejected or deactivated)
    if (vendor.status === 'inactive') {
      return NextResponse.json(
        { 
          error: 'Your vendor account is inactive.',
          code: 'ACCOUNT_INACTIVE',
          message: 'Your account has been deactivated. Please contact support.'
        }, 
        { status: 403 }
      );
    }

    // ✅ Account is approved and active - generate token
    const token = jwt.sign(
      { id: vendor.id, email: vendor.email, role: 'vendor' },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    const response = NextResponse.json({
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
    return setAuthCookie(response, 'vendor-auth-token', token);

  } catch (error) {
    console.error('Vendor login error:', error);
    return NextResponse.json({ error: 'Server error occurred.' }, { status: 500 });
  }
}
