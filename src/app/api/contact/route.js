import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';

export async function POST(req) {
  try {
    const { name, email, phone, department, subject, message } = await req.json();

    // Validate required fields
    if (!name || !email || !phone || !department || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Insert into database
    const result = await pool.query(
      `INSERT INTO contact_submissions (name, email, phone, department, subject, message, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id, name, email, created_at`,
      [name, email, phone, department, subject, message, 'New']
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!',
        data: result.rows[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch submissions (for dashboard)
export async function GET(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const result = await pool.query(
      `SELECT id, name, email, phone, department, subject, message, status, created_at
       FROM contact_submissions
       ORDER BY created_at DESC
       LIMIT 100`
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
