// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/bookings/[id]/reject/route.js
// VENDOR REJECTS BOOKING
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
 
export async function POST(req, { params }) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    let vendorId;
    try {
      const decoded = requireRole(req, 'vendor');
      if (!decoded) throw new Error('Invalid role');
      vendorId = decoded.id;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
 
    const { id: bookingId } = await params;
 
    const updateResult = await pool.query(
      `UPDATE service_notifications
       SET is_read = TRUE, expires_at = NOW()
       WHERE booking_id = $1 AND vendor_id = $2`,
      [bookingId, vendorId]
    );

    if (updateResult.rowCount === 0) {
      await pool.query(
        `INSERT INTO service_notifications (
          booking_id, vendor_id, notification_type, title, message, is_read, expires_at, created_at
        )
        SELECT $1, $2, 'new_booking', 'Rejected Service Request', 'Vendor rejected this request', TRUE, NOW(), NOW()
        WHERE NOT EXISTS (
          SELECT 1
          FROM service_notifications
          WHERE booking_id = $1 AND vendor_id = $2
        )`,
        [bookingId, vendorId]
      );
    }
 
    return NextResponse.json({
      success: true,
      message: 'Booking rejected. Notification removed.'
    });
 
  } catch (error) {
    console.error('Booking reject error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
