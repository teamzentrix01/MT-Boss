import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAnyRole, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

async function ensurePaidSlotsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS paid_time_slot_availability (
      id SERIAL PRIMARY KEY,
      quick_service_id INTEGER NOT NULL REFERENCES quick_services(id) ON DELETE CASCADE,
      slot_date DATE NOT NULL,
      city VARCHAR(120) NOT NULL,
      time_slot VARCHAR(80) NOT NULL,
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      updated_by_role VARCHAR(30),
      updated_by_id INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (quick_service_id, slot_date, city, time_slot)
    )
  `);
}

function normalizeTimeSlot(slot) {
  return String(slot || '').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
}

function manager(req) {
  return requireAnyRole(req, ['admin', 'franchise']);
}

export async function GET(req) {
  try {
    await ensurePaidSlotsTable();
    const { searchParams } = new URL(req.url);
    const quickServiceId = searchParams.get('service_id');
    const city = searchParams.get('city');
    const date = searchParams.get('date');
    const mode = searchParams.get('mode');

    if (quickServiceId && city && date) {
      const result = await pool.query(
        `SELECT time_slot, is_available
         FROM paid_time_slot_availability
         WHERE quick_service_id = $1
           AND slot_date = $2::DATE
           AND LOWER(TRIM(city)) = LOWER(TRIM($3))`,
        [quickServiceId, date, city]
      );
      const map = new Map(result.rows.map((row) => [normalizeTimeSlot(row.time_slot), row.is_available]));
      const slots = TIME_SLOTS.map((slot) => ({
        time_slot: slot,
        is_available: map.get(slot) !== false,
      }));
      return NextResponse.json({ success: true, data: slots }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    if (!manager(req)) return unauthorized();

    const clauses = [];
    const params = [];
    if (quickServiceId) {
      params.push(quickServiceId);
      clauses.push(`p.quick_service_id = $${params.length}`);
    }
    if (city && city !== 'all') {
      params.push(city);
      clauses.push(`LOWER(TRIM(p.city)) = LOWER(TRIM($${params.length}))`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT p.id, p.quick_service_id, qs.label AS service_label, qs.icon AS service_icon,
              TO_CHAR(p.slot_date::DATE, 'YYYY-MM-DD') AS slot_date,
              p.city, p.time_slot, p.is_available, p.updated_by_role, p.updated_at
       FROM paid_time_slot_availability p
       LEFT JOIN quick_services qs ON qs.id = p.quick_service_id
       ${where}
       ORDER BY p.slot_date DESC, p.city ASC, qs.label ASC, p.time_slot ASC`,
      params
    );

    return NextResponse.json({ success: true, data: result.rows }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Paid slots GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = manager(req);
    if (!user) return unauthorized();
    await ensurePaidSlotsTable();

    const { quick_service_id, slot_date, city, time_slot, is_available = true } = await req.json();
    const normalizedSlot = normalizeTimeSlot(time_slot);

    if (!quick_service_id || !slot_date || !city || !normalizedSlot) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (Boolean(is_available)) {
      const result = await pool.query(
        `DELETE FROM paid_time_slot_availability
          WHERE quick_service_id = $1
            AND slot_date = $2::DATE
            AND LOWER(TRIM(city)) = LOWER(TRIM($3))
            AND TRIM(REGEXP_REPLACE(REGEXP_REPLACE(time_slot, '[–—]', '-', 'g'), '\\s+', ' ', 'g')) = $4
          RETURNING id`,
        [quick_service_id, slot_date, city, normalizedSlot]
      );

      return NextResponse.json({
        success: true,
        data: {
          quick_service_id,
          slot_date,
          city: city.trim(),
          time_slot: normalizedSlot,
          is_available: true,
          removedOverride: result.rows.length > 0,
        },
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    const result = await pool.query(
      `INSERT INTO paid_time_slot_availability
         (quick_service_id, slot_date, city, time_slot, is_available, updated_by_role, updated_by_id, created_at, updated_at)
       VALUES ($1, $2::DATE, TRIM($3), $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT (quick_service_id, slot_date, city, time_slot)
       DO UPDATE SET is_available = EXCLUDED.is_available,
                     updated_by_role = EXCLUDED.updated_by_role,
                     updated_by_id = EXCLUDED.updated_by_id,
                     updated_at = NOW()
       RETURNING *, TO_CHAR(slot_date::DATE, 'YYYY-MM-DD') AS slot_date`,
      [quick_service_id, slot_date, city, normalizedSlot, Boolean(is_available), user.role, user.id || null]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Paid slots POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
