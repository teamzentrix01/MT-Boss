import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '123456';
const JWT_SECRET =
  process.env.NEXT_PUBLIC_JWT_SECRET ||
  process.env.JWT_SECRET ||
  'fallback-secret';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // ── Admin hardcoded check ──
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: 0, email: ADMIN_EMAIL, role: 'admin' },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      );
      return NextResponse.json({
        token,
        user: { id: 0, email: ADMIN_EMAIL, name: 'Admin', role: 'admin' },
        redirectTo: '/dashboard',
      }, { status: 200 });
    }

    // ── Check if vendor exists with this email ──
    const vendorResult = await pool.query(
      'SELECT id FROM vendors WHERE email = $1',
      [email]
    );

    if (vendorResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'This email is registered as a vendor. Please use vendor login at /vendor/login' },
        { status: 401 }
      );
    }

    // ── Regular users from DB ──
    const result = await pool.query(
      'SELECT id, email, password, name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: 'user' },
      redirectTo: '/userdashboard',
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error occurred.' }, { status: 500 });
  }
}
