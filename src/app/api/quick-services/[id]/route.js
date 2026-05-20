import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updates = [];
    const values = [];
    let i = 1;

    if (body.admin_base_price !== undefined) {
      updates.push(`admin_base_price = $${i++}`);
      values.push(body.admin_base_price);
    }
    if (body.is_service_active !== undefined) {
      updates.push(`is_service_active = $${i++}`);
      values.push(body.is_service_active);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE quick_services SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Quick service PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const result = await pool.query(
      `DELETE FROM quick_services WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    console.error('Quick service DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
