import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';

function getSupplier(req) {
  return requireRole(req, 'supplier');
}

export async function PUT(req) {
  try {
    const decoded = getSupplier(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { product_categories } = await req.json();

    if (!Array.isArray(product_categories) || product_categories.length === 0) {
      return NextResponse.json({ success: false, error: 'Select at least one product category' }, { status: 400 });
    }

    await pool.query(`ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS product_categories TEXT[] DEFAULT '{}'`);

    const result = await pool.query(
      `UPDATE suppliers SET product_categories = $1, updated_at = NOW() WHERE id = $2 RETURNING id, product_categories`,
      [product_categories, decoded.id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('PUT supplier categories error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
