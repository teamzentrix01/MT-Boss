import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { resolveServiceCity } from '@/lib/service-cities';
import { franchiseAccessResponse, getFranchiseAccess } from '@/lib/franchise-access';

async function getSlotManager(req) {
  const admin = requireRole(req, 'admin');
  if (admin) return { allowed: true, isAdmin: true, user: admin };

  const access = await getFranchiseAccess(req, 'slots.manage');
  if (!access.allowed) return access;
  return { ...access, isAdmin: false };
}

// PATCH - admin edits slot details and opens/closes availability.
export async function PATCH(req, { params }) {
  try {
    const manager = await getSlotManager(req);
    if (!manager.allowed) return franchiseAccessResponse(manager);

    const { id } = await params;
    const body = await req.json();
    const current = await pool.query(
      `SELECT quick_service_id, city FROM free_time_slots WHERE id = $1`,
      [id]
    );
    if (current.rows.length === 0) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }
    if (!manager.isAdmin
      && String(current.rows[0].city).trim().toLowerCase() !== String(manager.franchise.city).trim().toLowerCase()) {
      return NextResponse.json({ error: 'Slots can only be managed in the franchise city' }, { status: 403 });
    }
    const serviceId = body.quick_service_id || current.rows[0].quick_service_id;
    const requestedCity = manager.isAdmin
      ? body.city || current.rows[0].city
      : manager.franchise.city;
    const canonicalCity = await resolveServiceCity(serviceId, requestedCity);
    if (!canonicalCity) {
      return NextResponse.json({ error: 'This city is not configured for the selected service' }, { status: 400 });
    }

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
        canonicalCity,
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
    const manager = await getSlotManager(req);
    if (!manager.allowed) return franchiseAccessResponse(manager);

    const { id } = await params;

    const current = await pool.query(
      `SELECT city FROM free_time_slots WHERE id = $1`,
      [id]
    );
    if (!current.rows[0]) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }
    if (!manager.isAdmin
      && String(current.rows[0].city).trim().toLowerCase() !== String(manager.franchise.city).trim().toLowerCase()) {
      return NextResponse.json({ error: 'Slots can only be managed in the franchise city' }, { status: 403 });
    }

    const booked = await pool.query(
      `SELECT COUNT(*)::INT AS count FROM service_bookings WHERE time_slot_id = $1`,
      [id]
    );

    if ((booked.rows[0]?.count || 0) > 0) {
      const closed = await pool.query(
        `UPDATE free_time_slots
            SET is_available = FALSE
          WHERE id = $1
          RETURNING id`,
        [id]
      );

      if (closed.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Slot not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Slot has bookings, so it was closed instead of deleted.',
        closedInstead: true,
      });
    }

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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
