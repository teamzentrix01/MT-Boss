

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { getJwtSecret, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verify email + password + get status — ek hi query mein
    const result = await pool.query(
      `SELECT
        id, email, shop_name, phone,
        city, state, status, rejection_reason,
        is_active,
        COALESCE(product_categories, '{}') AS product_categories,
        (password_hash = crypt($2, password_hash)) AS password_match
      FROM suppliers
      WHERE email = $1`,
      [email, password]
    );

    // Email nahi mila
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const supplier = result.rows[0];

    // Wrong password
    if (!supplier.password_match) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // ── Admin approval checks ──

    if (supplier.status === 'pending') {
      return NextResponse.json(
        {
          status: 'pending',
          error: 'Your account is pending admin approval. Please check back later.',
        },
        { status: 403 }
      );
    }

    if (supplier.status === 'rejected') {
      return NextResponse.json(
        {
          status: 'rejected',
          error: 'Your account was not approved.',
          reason: supplier.rejection_reason || null,
        },
        { status: 403 }
      );
    }

    // ── Approved — issue JWT token ──

    const tokenExpiry = rememberMe ? '30d' : '7d';

    const token = jwt.sign(
      {
        id: supplier.id,
        email: supplier.email,
        shop_name: supplier.shop_name,
        role: 'supplier',
      },
      getJwtSecret(),
      { expiresIn: tokenExpiry }
    );

    // Update last_login_at
    await pool.query(
      'UPDATE suppliers SET last_login_at = NOW() WHERE id = $1',
      [supplier.id]
    );

    const response = NextResponse.json({
      success: true,
      token,
      supplier: {
        id: supplier.id,
        email: supplier.email,
        shop_name: supplier.shop_name,
        phone: supplier.phone,
        city: supplier.city,
        state: supplier.state,
        status: supplier.status,
        is_active: supplier.is_active,
        product_categories: supplier.product_categories || [],
      },
    });
    return setAuthCookie(response, 'supplier-auth-token', token, rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7);

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
