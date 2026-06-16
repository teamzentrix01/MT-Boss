import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJwtSecret, setAuthCookie } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    if (
      ADMIN_EMAIL &&
      ADMIN_PASSWORD &&
      normalizedEmail === ADMIN_EMAIL.trim().toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { id: 0, email: ADMIN_EMAIL, role: 'admin' },
        getJwtSecret(),
        { expiresIn: process.env.JWT_EXPIRY || '7d' }
      );
      const response = NextResponse.json({
        token,
        user: { id: 0, email: ADMIN_EMAIL, name: 'Admin', role: 'admin' },
        redirectTo: '/dashboard',
      }, { status: 200 });
      return setAuthCookie(response, 'auth-token', token);
    }

    const vendorResult = await pool.query(
      'SELECT id FROM vendors WHERE LOWER(email) = $1',
      [normalizedEmail]
    );

    if (vendorResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'This email is registered as a vendor. Please use vendor login at /vendor/login' },
        { status: 401 }
      );
    }

    const result = await pool.query(
      'SELECT id, email, password, name FROM users WHERE LOWER(email) = $1',
      [normalizedEmail]
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
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    const response = NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: 'user' },
      redirectTo: '/userdashboard',
    }, { status: 200 });
    return setAuthCookie(response, 'auth-token', token);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error occurred.' }, { status: 500 });
  }
}
