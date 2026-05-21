import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendEnquiryAcceptedEmail } from '@/lib/email';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS material_enquiries (
      id SERIAL PRIMARY KEY,
      user_name VARCHAR(255) NOT NULL,
      user_phone VARCHAR(20) NOT NULL,
      user_email VARCHAR(255),
      category_name VARCHAR(255) NOT NULL,
      category_emoji VARCHAR(10) DEFAULT '',
      quantity_text VARCHAR(255),
      delivery_address TEXT,
      latitude DECIMAL(10,8),
      longitude DECIMAL(11,8),
      message TEXT,
      status VARCHAR(50) DEFAULT 'open',
      accepted_by_supplier_id INTEGER,
      accepted_at TIMESTAMP,
      fulfilled_at TIMESTAMP,
      amount_received NUMERIC(10,2),
      admin_commission NUMERIC(10,2),
      supplier_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

// POST — submit enquiry from ShopNow page
export async function POST(req) {
  try {
    await ensureTable();

    const { user_name, user_phone, user_email, category_name, category_emoji, quantity_text, delivery_address, latitude, longitude, message } = await req.json();

    if (!user_name || !user_phone || !category_name) {
      return NextResponse.json({ success: false, error: 'Name, phone, and category are required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO material_enquiries
        (user_name, user_phone, user_email, category_name, category_emoji, quantity_text, delivery_address, latitude, longitude, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, status, created_at`,
      [user_name, user_phone, user_email || null, category_name, category_emoji || '', quantity_text || null, delivery_address || null, latitude || null, longitude || null, message || null]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST material-enquiries error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET — admin can view all enquiries
export async function GET(req) {
  try {
    await ensureTable();
    const result = await pool.query(
      `SELECT me.*, s.shop_name AS accepted_by_shop
       FROM material_enquiries me
       LEFT JOIN suppliers s ON s.id = me.accepted_by_supplier_id
       ORDER BY me.created_at DESC`
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
