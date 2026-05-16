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

    // ── Query vendor from vendors table ──
    const result = await pool.query(
      'SELECT id, email, password, shop_name, business_name FROM vendors WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found or incorrect credentials' }, { status: 401 });
    }

    const vendor = result.rows[0];
    
    // ── Verify password ──
    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Vendor not found or incorrect credentials' }, { status: 401 });
    }

    // ── Check vendor status (optional) ──
    const statusResult = await pool.query(
      'SELECT status FROM vendors WHERE id = $1',
      [vendor.id]
    );

    if (statusResult.rows.length > 0 && statusResult.rows[0].status === 'inactive') {
      return NextResponse.json({ error: 'Your vendor account is inactive. Contact support.' }, { status: 403 });
    }

    // ── Generate JWT token ──
    const token = jwt.sign(
      { id: vendor.id, email: vendor.email, role: 'vendor' },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    return NextResponse.json({
      token,
      vendor: {
        id: vendor.id,
        email: vendor.email,
        shop_name: vendor.shop_name,
        business_name: vendor.business_name,
        role: 'vendor',
      },
      redirectTo: '/vendor/dashboard',
    }, { status: 200 });

  } catch (error) {
    console.error('Vendor login error:', error);
    return NextResponse.json({ error: 'Server error occurred.' }, { status: 500 });
  }
}