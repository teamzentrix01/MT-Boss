import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

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

// PUT — update a material
export async function PUT(req, { params }) {
  try {
    const decoded = getSupplierFromToken(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { name, description, price, unit, quantity, image_url, category, is_available } = await req.json();

    const result = await pool.query(
      `UPDATE supplier_materials
       SET name = $1, description = $2, price = $3, unit = $4,
           quantity = $5, image_url = $6, category = $7,
           is_available = $8, updated_at = NOW()
       WHERE id = $9 AND supplier_id = $10
       RETURNING id, name, description, price, unit, quantity, image_url, category, is_available`,
      [name, description || null, price || null, unit || null, quantity || 0,
       image_url || null, category || null, is_available !== false, id, decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Material not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('PUT material error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE — remove a material
export async function DELETE(req, { params }) {
  try {
    const decoded = getSupplierFromToken(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const result = await pool.query(
      `DELETE FROM supplier_materials WHERE id = $1 AND supplier_id = $2 RETURNING id`,
      [id, decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Material not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Material deleted' });
  } catch (err) {
    console.error('DELETE material error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
