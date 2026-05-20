import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// PATCH — toggle availability
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { is_available } = await req.json();

    const result = await pool.query(
      `UPDATE free_time_slots SET is_available = $1
       WHERE id = $2 RETURNING *`,
      [is_available, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Free slot PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — remove slot
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const result = await pool.query(
      `DELETE FROM free_time_slots WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Slot deleted' });
  } catch (error) {
    console.error('Free slot DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
