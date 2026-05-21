import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS supplier_materials (
      id SERIAL PRIMARY KEY,
      supplier_id INTEGER NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price NUMERIC(10,2),
      unit VARCHAR(100),
      quantity INTEGER DEFAULT 0,
      image_url TEXT,
      category VARCHAR(255),
      is_available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

function getSupplierFromToken(req) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// GET — list materials for this supplier
export async function GET(req) {
  try {
    const decoded = getSupplierFromToken(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await ensureTable();

    const result = await pool.query(
      `SELECT id, name, description, price, unit, quantity, image_url, category, is_available, created_at
       FROM supplier_materials
       WHERE supplier_id = $1
       ORDER BY created_at DESC`,
      [decoded.id]
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('GET materials error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST — add a material
export async function POST(req) {
  try {
    const decoded = getSupplierFromToken(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await ensureTable();

    const { name, description, price, unit, quantity, image_url, category } = await req.json();

    if (!name) return NextResponse.json({ success: false, error: 'Material name is required' }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO supplier_materials
        (supplier_id, name, description, price, unit, quantity, image_url, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, description, price, unit, quantity, image_url, category, is_available, created_at`,
      [decoded.id, name, description || null, price || null, unit || null, quantity || 0, image_url || null, category || null]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST material error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
