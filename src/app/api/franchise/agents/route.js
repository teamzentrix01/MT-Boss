import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req) {
  try {
    const franchise = requireRole(req, 'franchise');
    if (!franchise) {
      return NextResponse.json({ success: false, error: 'Franchise access required' }, { status: 403 });
    }

    const result = await pool.query(
      `SELECT id, name, email, phone, city, state, agent_type
       FROM agents
       WHERE status = 'Approved'
       ORDER BY name ASC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Franchise agents fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
