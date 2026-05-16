import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, password, shop_name, business_name, phone, city, state } = await req.json();

    // ── Validation ──
    if (!email || !password || !shop_name || !business_name) {
      return NextResponse.json(
        { error: 'Email, password, shop name, and business name are required' },
        { status: 400 }
      );
    }

    // ── Check if vendor already exists ──
    const existsResult = await pool.query(
      'SELECT id FROM vendors WHERE email = $1',
      [email]
    );

    if (existsResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Vendor with this email already exists' },
        { status: 400 }
      );
    }

    // ── Hash password ──
    const hashedPassword = await bcrypt.hash(password, 10);

    // ── Insert new vendor ──
    const insertResult = await pool.query(
      `INSERT INTO vendors (email, password, shop_name, business_name, phone, city, state, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING id, email, shop_name, business_name`,
      [email, hashedPassword, shop_name, business_name, phone || null, city || null, state || null, 'active']
    );

    const vendor = insertResult.rows[0];

    // ── Generate JWT token ──
    const token = jwt.sign(
      { id: vendor.id, email: vendor.email, role: 'vendor' },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    return NextResponse.json({
      message: 'Vendor account created successfully',
      token,
      vendor: {
        id: vendor.id,
        email: vendor.email,
        shop_name: vendor.shop_name,
        business_name: vendor.business_name,
        role: 'vendor',
      },
      redirectTo: '/vendor/dashboard',
    }, { status: 201 });

  } catch (error) {
    console.error('Vendor signup error:', error);
    return NextResponse.json({ error: 'Server error occurred.' }, { status: 500 });
  }
}