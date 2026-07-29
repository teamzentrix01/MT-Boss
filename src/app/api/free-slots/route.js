import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';
import { addServiceCity, resolveServiceCity } from '@/lib/service-cities';
import { franchiseAccessResponse, getFranchiseAccess } from '@/lib/franchise-access';

const ensureFreeSlotsColumns = createInitializationGuard(async () => {
  await pool.query(`ALTER TABLE free_time_slots ADD COLUMN IF NOT EXISTS current_bookings INTEGER DEFAULT 0`);
  await pool.query(`ALTER TABLE free_time_slots ADD COLUMN IF NOT EXISTS max_bookings INTEGER DEFAULT 1`);
  await pool.query(`ALTER TABLE free_time_slots ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE`);
  await pool.query(`UPDATE free_time_slots SET current_bookings = 0 WHERE current_bookings IS NULL`);
  await pool.query(`UPDATE free_time_slots SET max_bookings = 1 WHERE max_bookings IS NULL`);
});

const FREE_SLOT_WINDOWS = new Set(['08:00-10:00', '16:00-18:00']);

async function getSlotManager(req, permission) {
  const admin = requireRole(req, 'admin');
  if (admin) return { allowed: true, isAdmin: true, user: admin };

  const access = await getFranchiseAccess(req, permission);
  if (!access.allowed) return access;
  return { ...access, isAdmin: false };
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
          AND CONCAT(TO_CHAR(fts.slot_start, 'HH24:MI'), '-', TO_CHAR(fts.slot_end, 'HH24:MI')) IN ('08:00-10:00', '16:00-18:00')
        ORDER BY fts.slot_date ASC, fts.slot_start ASC
        LIMIT 2`;
      params = [city, serviceId, today];
    } else if (city && city !== 'all') {
      const manager = await getSlotManager(req, 'slots.view');
      if (!manager.allowed) return franchiseAccessResponse(manager);
      const managedCity = manager.isAdmin ? city : manager.franchise.city;
      query = `${baseSelect}
        WHERE LOWER(TRIM(fts.city)) = LOWER(TRIM($1))
        ORDER BY fts.slot_date DESC, fts.slot_start ASC`;
      params = [managedCity];
    } else {
      const manager = await getSlotManager(req, 'slots.view');
      if (!manager.allowed) return franchiseAccessResponse(manager);
      if (manager.isAdmin) {
        query = `${baseSelect}
          ORDER BY fts.slot_date DESC, fts.slot_start ASC`;
        params = [];
      } else {
        query = `${baseSelect}
          WHERE LOWER(TRIM(fts.city)) = LOWER(TRIM($1))
          ORDER BY fts.slot_date DESC, fts.slot_start ASC`;
        params = [manager.franchise.city];
      }
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
    const manager = await getSlotManager(req, 'slots.free.create');
    if (!manager.allowed) return franchiseAccessResponse(manager);
    await ensureFreeSlotsColumns();

    const { quick_service_id, slot_date, slot_end_date, slot_start, slot_end, city, max_bookings = 1 } = await req.json();

    if (!quick_service_id || !slot_date || !slot_start || !slot_end || !city) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const requestedWindow = `${String(slot_start).slice(0, 5)}-${String(slot_end).slice(0, 5)}`;
    if (!FREE_SLOT_WINDOWS.has(requestedWindow)) {
      return NextResponse.json({ error: 'Free slots are fixed to Morning (08:00-10:00) or Evening (16:00-18:00).' }, { status: 400 });
    }
    const requestedCity = manager.isAdmin ? city : manager.franchise.city;
    if (!manager.isAdmin && String(city).trim().toLowerCase() !== String(manager.franchise.city).trim().toLowerCase()) {
      return NextResponse.json({ error: 'Slots can only be managed in the franchise city' }, { status: 403 });
    }

    let canonicalCity = await resolveServiceCity(quick_service_id, requestedCity);
    if (!canonicalCity && manager.isAdmin) {
      canonicalCity = await addServiceCity(quick_service_id, city);
    }
    if (!canonicalCity) {
      return NextResponse.json({ error: 'This city is not configured for the selected service' }, { status: 400 });
    }

    const endDate = slot_end_date || slot_date;
    if (endDate < slot_date) {
      return NextResponse.json({ error: 'End date cannot be before start date' }, { status: 400 });
    }
    const result = await pool.query(
      `INSERT INTO free_time_slots
         (quick_service_id, slot_date, slot_start, slot_end, city, max_bookings, current_bookings, is_available, created_at)
       SELECT $1, day::DATE, $3, $4, $5, $6, 0, TRUE, NOW()
       FROM GENERATE_SERIES($2::DATE, $7::DATE, INTERVAL '1 day') day
       WHERE NOT EXISTS (
         SELECT 1 FROM free_time_slots existing
          WHERE existing.quick_service_id = $1
            AND existing.slot_date::DATE = day::DATE
            AND existing.slot_start = $3
            AND existing.slot_end = $4
            AND LOWER(TRIM(existing.city)) = LOWER(TRIM($5))
       )
       RETURNING *, TO_CHAR(slot_date::DATE, 'YYYY-MM-DD') AS slot_date`,
      [quick_service_id, slot_date, slot_start, slot_end, canonicalCity, Math.max(Number(max_bookings) || 1, 1), endDate]
    );

    return NextResponse.json({ success: true, data: result.rows[0] || null, count: result.rows.length }, { status: 201 });
  } catch (error) {
    console.error('Free slots POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
