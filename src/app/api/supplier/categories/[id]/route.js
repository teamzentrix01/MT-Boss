

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// ── PUT /api/supplier/categories/[id] ──
export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    const body = await request.json();
    const { name, emoji, label, labelColor, priceRange, unit, supplierId } = body;

    const result = await pool.query(
      `UPDATE supplier_categories
       SET
         name        = $1,
         emoji       = $2,
         label       = $3,
         label_color = $4,
         price_range = $5,
         unit        = $6
       WHERE id = $7 AND supplier_id = $8
       RETURNING
         id, supplier_id,
         name, emoji, label,
         label_color  AS "labelColor",
         price_range  AS "priceRange",
         unit, updated_at`,
      [name, emoji, label, labelColor, priceRange, unit, id, parseInt(supplierId)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error('PUT category error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ── DELETE /api/supplier/categories/[id] ──
export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplierId');

    const result = await pool.query(
      `DELETE FROM supplier_categories
       WHERE id = $1 AND supplier_id = $2
       RETURNING id`,
      [id, parseInt(supplierId)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { id } });

  } catch (err) {
    console.error('DELETE category error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}