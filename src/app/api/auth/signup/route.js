import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    // Validate input
    if (!normalizedEmail || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email, name',
      [String(name || '').trim(), normalizedEmail, hashedPassword]
    );

    return NextResponse.json(
      {
        user: result.rows[0],
        message: 'Account created successfully! Please login.'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);

    // Handle duplicate email error (PostgreSQL error code 23505)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Email already exists. Please use a different email.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
