// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/vendor/location/update/route.js
// UPDATE VENDOR LIVE LOCATION
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
 
export async function POST(req) {
  try {
    const vendor = requireRole(req, 'vendor');
    if (!vendor) return unauthorized();
 
    const { booking_id, latitude, longitude, address, accuracy_meters } = await req.json();
 
    if (!booking_id || !latitude || !longitude) {
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
      [booking_id, vendor.id, latitude, longitude, address, accuracy_meters]
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
 
