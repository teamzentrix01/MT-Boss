import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';

function hasToken(req) {
  return Boolean(requireRole(req, 'admin'));
}

// PATCH - admin edits slot details and opens/closes availability.
export async function PATCH(req, { params }) {
  try {
    if (!hasToken(req)) {
      return unauthorized();
    }

    const { id } = await params;
    const body = await req.json();

    const result = await pool.query(
      `UPDATE free_time_slots
       SET quick_service_id = COALESCE($1, quick_service_id),
           slot_date = COALESCE($2::DATE, slot_date),
           slot_start = COALESCE($3, slot_start),
           slot_end = COALESCE($4, slot_end),
           city = COALESCE(NULLIF(TRIM($5), ''), city),
           max_bookings = GREATEST(COALESCE($6, max_bookings), 1),
           is_available = COALESCE($7, is_available)
       WHERE id = $8
       RETURNING *, TO_CHAR(slot_date::DATE, 'YYYY-MM-DD') AS slot_date`,
      [
        body.quick_service_id || null,
        body.slot_date || null,
        body.slot_start || null,
        body.slot_end || null,
        body.city || null,
        body.max_bookings === undefined ? null : Number(body.max_bookings),
        body.is_available,
        id,
      ]
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

// DELETE - admin removes slot.
export async function DELETE(req, { params }) {
  try {
    if (!hasToken(req)) {
      return unauthorized();
    }

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
