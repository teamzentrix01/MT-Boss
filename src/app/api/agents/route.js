import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET — fetch all agents (admin)
export async function GET(req) {
  try {
    const result = await pool.query(
      'SELECT * FROM agents ORDER BY created_at DESC'
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Agents fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST — submit agent application (public)
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, city, state, occupation, agentType, experience, network, message } = body;

    if (!name || !email || !phone || !agentType) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO agents (name, email, phone, city, state, occupation, agent_type, experience, network, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [name, email, phone, city, state, occupation, agentType, experience || null, network || null, message || null]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Agent submit error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// PATCH — update agent status
export async function PATCH(req) {
  try {
    const { id, status } = await req.json();
    const result = await pool.query(
      'UPDATE agents SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}