import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET single primary service by slug — public
export async function GET(req, { params }) {
  try {
    const { slug } = params;

    const result = await pool.query(
      `SELECT * FROM primary_services WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching primary service:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}