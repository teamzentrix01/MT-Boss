import { NextResponse } from 'next/server';
import pool from '@/lib/db';

async function ensureFreeSlotsColumns() {
  await pool.query(`ALTER TABLE free_time_slots ADD COLUMN IF NOT EXISTS current_bookings INTEGER DEFAULT 0`);
  await pool.query(`ALTER TABLE free_time_slots ADD COLUMN IF NOT EXISTS max_bookings INTEGER DEFAULT 1`);
  await pool.query(`ALTER TABLE free_time_slots ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE`);
  await pool.query(`UPDATE free_time_slots SET current_bookings = 0 WHERE current_bookings IS NULL`);
  await pool.query(`UPDATE free_time_slots SET max_bookings = 1 WHERE max_bookings IS NULL`);
}

function hasToken(req) {
  return Boolean(req.headers.get('Authorization')?.split(' ')[1]);
}

// GET — user mode: city + service_id; admin mode: no params
export async function GET(req) {
  try {
    await ensureFreeSlotsColumns();

    const { searchParams } = new URL(req.url);
    const city      = searchParams.get('city');
    const serviceId = searchParams.get('service_id');
    const date      = searchParams.get('date');
    const today     = date || new Date().toISOString().split('T')[0];

    // Common SELECT with service label join
    const baseSelect = `
      SELECT fts.id, fts.quick_service_id, qs.label AS service_label, qs.icon AS service_icon,
             fts.slot_start, fts.slot_end,
             TO_CHAR(fts.slot_date::DATE, 'YYYY-MM-DD') AS slot_date,
             fts.city, fts.is_available, fts.max_bookings,
             COALESCE(fts.current_bookings, 0) AS current_bookings
      FROM free_time_slots fts
      LEFT JOIN quick_services qs ON qs.id = fts.quick_service_id`;

    let query, params;

    if (city && serviceId) {
      // User mode: only admin-open, upcoming, same-city, same-service slots.
      query = `${baseSelect}
        WHERE LOWER(TRIM(fts.city)) = LOWER(TRIM($1))
          AND fts.quick_service_id = $2
          AND fts.is_available = TRUE
          AND COALESCE(fts.current_bookings, 0) < COALESCE(fts.max_bookings, 1)
          AND fts.slot_date::DATE >= $3::DATE
        ORDER BY fts.slot_date ASC, fts.slot_start ASC
        LIMIT 10`;
      params = [city, serviceId, today];
    } else if (city && city !== 'all') {
      if (!hasToken(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      query = `${baseSelect}
        WHERE LOWER(TRIM(fts.city)) = LOWER(TRIM($1))
        ORDER BY fts.slot_date DESC, fts.slot_start ASC`;
      params = [city];
    } else {
      if (!hasToken(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      query = `${baseSelect}
        ORDER BY fts.slot_date DESC, fts.slot_start ASC`;
      params = [];
    }

    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Free slots GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — admin creates a new free slot
export async function POST(req) {
  try {
    if (!hasToken(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await ensureFreeSlotsColumns();

    const { quick_service_id, slot_date, slot_start, slot_end, city, max_bookings = 1 } = await req.json();

    if (!quick_service_id || !slot_date || !slot_start || !slot_end || !city) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO free_time_slots
         (quick_service_id, slot_date, slot_start, slot_end, city, max_bookings, current_bookings, is_available, created_at)
       VALUES ($1, $2::DATE, $3, $4, $5, $6, 0, TRUE, NOW())
       RETURNING *, TO_CHAR(slot_date::DATE, 'YYYY-MM-DD') AS slot_date`,
      [quick_service_id, slot_date, slot_start, slot_end, city.trim(), Math.max(Number(max_bookings) || 1, 1)]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Free slots POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
