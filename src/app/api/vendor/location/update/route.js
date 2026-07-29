// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/vendor/location/update/route.js
// UPDATE VENDOR LIVE LOCATION
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';

async function ensureVendorLocationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vendor_locations (
      id BIGSERIAL PRIMARY KEY,
      booking_id INTEGER NOT NULL REFERENCES service_bookings(id) ON DELETE CASCADE,
      vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
      latitude DECIMAL(10,8) NOT NULL,
      longitude DECIMAL(11,8) NOT NULL,
      address TEXT,
      accuracy_meters DECIMAL(10,2),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS vendor_locations_booking_created_idx ON vendor_locations (booking_id, created_at DESC)`);
}
 
export async function POST(req) {
  try {
    const vendor = requireRole(req, 'vendor');
    if (!vendor) return unauthorized();
    await ensureVendorLocationsTable();
 
    const { booking_id, latitude, longitude, address, accuracy_meters } = await req.json();
 
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    if (!booking_id || !Number.isFinite(parsedLatitude) || !Number.isFinite(parsedLongitude)
      || parsedLatitude < -90 || parsedLatitude > 90 || parsedLongitude < -180 || parsedLongitude > 180) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const assignedBooking = await pool.query(
      `SELECT id FROM service_bookings
       WHERE id = $1 AND vendor_id = $2
         AND status IN ('VENDOR_ACCEPTED', 'VENDOR_ON_WAY', 'IN_PROGRESS')`,
      [booking_id, vendor.id]
    );
    if (!assignedBooking.rows[0]) {
      return NextResponse.json({ error: 'This active booking is not assigned to the vendor.' }, { status: 403 });
    }
 
    // Insert location update
    await pool.query(
      `INSERT INTO vendor_locations (booking_id, vendor_id, latitude, longitude, address, accuracy_meters, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [booking_id, vendor.id, parsedLatitude, parsedLongitude, address || null, Number.isFinite(Number(accuracy_meters)) ? Number(accuracy_meters) : null]
    );
 
    // Update booking status if not already in progress
    await pool.query(
      `UPDATE service_bookings 
       SET status = 'VENDOR_ON_WAY', vendor_status = 'ON_WAY', started_at = NOW()
       WHERE id = $1 AND vendor_id = $2 AND status = 'VENDOR_ACCEPTED'`,
      [booking_id, vendor.id]
    );
 
    return NextResponse.json({
      success: true,
      message: 'Location updated'
    });
 
  } catch (error) {
    console.error('Location update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
 
