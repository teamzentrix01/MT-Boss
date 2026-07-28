import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { franchiseAccessResponse, getFranchiseAccess } from '@/lib/franchise-access';

async function getSlotManager(req) {
  const admin = requireRole(req, 'admin');
  if (admin) return { allowed: true, isAdmin: true, user: admin };

  const access = await getFranchiseAccess(req, 'slots.manage');
  if (!access.allowed) return access;
  return { ...access, isAdmin: false };
}

// GET - Fetch free time slots
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const service_id = searchParams.get('service_id');
    const date = searchParams.get('date');
    const city = searchParams.get('city');

    if (!service_id || !date || !city) {
      return NextResponse.json(
        { error: 'service_id, date, and city are required' },
        { status: 400 }
      );
    }

    // Fetch available free time slots
    const result = await pool.query(
      `SELECT 
        id,
        quick_service_id,
        slot_start,
        slot_end,
        slot_date,
        city,
        is_available,
        max_bookings,
        COALESCE(current_bookings, 0) AS current_bookings,
        CONCAT(TO_CHAR(slot_start, 'HH12:MI AM'), ' – ', TO_CHAR(slot_end, 'HH12:MI AM')) as slot_display
       FROM free_time_slots
       WHERE quick_service_id = $1 
       AND slot_date = $2 
       AND city = $3 
       AND is_available = TRUE
       AND COALESCE(current_bookings, 0) < COALESCE(max_bookings, 1)
       ORDER BY slot_start ASC`,
      [service_id, date, city]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching free time slots:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}

// POST - Create free time slot (Admin only)
export async function POST(req) {
  try {
    const manager = await getSlotManager(req);
    if (!manager.allowed) return franchiseAccessResponse(manager);

    const {
      quick_service_id,
      slot_start,
      slot_end,
      slot_date,
      city,
      max_bookings = 1
    } = await req.json();

    if (!quick_service_id || !slot_start || !slot_end || !slot_date || !city) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!manager.isAdmin
      && String(city).trim().toLowerCase() !== String(manager.franchise.city).trim().toLowerCase()) {
      return NextResponse.json({ error: 'Slots can only be managed in the franchise city' }, { status: 403 });
    }

    const managedCity = manager.isAdmin ? city : manager.franchise.city;
    const result = await pool.query(
      `INSERT INTO free_time_slots (
        quick_service_id, slot_start, slot_end, slot_date, city, max_bookings, current_bookings, is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, 0, TRUE)
      RETURNING 
        id,
        quick_service_id,
        slot_start,
        slot_end,
        slot_date,
        city,
        is_available,
        max_bookings,
        current_bookings,
        CONCAT(TO_CHAR(slot_start, 'HH12:MI AM'), ' – ', TO_CHAR(slot_end, 'HH12:MI AM')) as slot_display`,
      [quick_service_id, slot_start, slot_end, slot_date, managedCity, max_bookings]
    );

    return NextResponse.json({
      success: true,
      message: 'Free slot created successfully',
      data: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating free slot:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}

// DELETE - Delete free time slot
export async function DELETE(req) {
  try {
    const manager = await getSlotManager(req);
    if (!manager.allowed) return franchiseAccessResponse(manager);

    const { searchParams } = new URL(req.url);
    const slot_id = searchParams.get('slot_id');

    if (!slot_id) {
      return NextResponse.json(
        { error: 'slot_id is required' },
        { status: 400 }
      );
    }

    const result = manager.isAdmin
      ? await pool.query(
        `DELETE FROM free_time_slots WHERE id = $1 RETURNING id`,
        [slot_id]
      )
      : await pool.query(
        `DELETE FROM free_time_slots
          WHERE id = $1
            AND LOWER(TRIM(city)) = LOWER(TRIM($2))
          RETURNING id`,
        [slot_id, manager.franchise.city]
      );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Free slot deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting free slot:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
