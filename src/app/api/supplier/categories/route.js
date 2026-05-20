import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// ── GET /api/supplier/categories?supplierId=X ──
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplierId');

    let result;
    if (supplierId) {
      result = await pool.query(
        `SELECT
          id, supplier_id,
          name, emoji, label,
          label_color   AS "labelColor",
          price_range   AS "priceRange",
          unit, created_at, updated_at
        FROM supplier_categories
        WHERE supplier_id = $1
        ORDER BY created_at DESC`,
        [parseInt(supplierId)]
      );
    } else {
      result = await pool.query(
        `SELECT
          id, supplier_id,
          name, emoji, label,
          label_color   AS "labelColor",
          price_range   AS "priceRange",
          unit, created_at, updated_at
        FROM supplier_categories
        ORDER BY created_at DESC`
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });

  } catch (err) {
    console.error('GET categories error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ── POST /api/supplier/categories ──
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, emoji, label, labelColor, priceRange, unit, supplierId } = body;

    if (!name || !label || !supplierId) {
      return NextResponse.json(
        { success: false, error: 'name, label and supplierId are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO supplier_categories
        (supplier_id, name, emoji, label, label_color, price_range, unit)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING
         id, supplier_id,
         name, emoji, label,
         label_color  AS "labelColor",
         price_range  AS "priceRange",
         unit, created_at`,
      [
        parseInt(supplierId),
        name,
        emoji || '🧱',
        label,
        labelColor || 'blue',
        priceRange || null,
        unit || null,
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );

  } catch (err) {
    console.error('POST category error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}