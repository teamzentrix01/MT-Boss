// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/bookings/[id]/accept/route.js
// VENDOR ACCEPTS BOOKING
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
 
export async function POST(req, { params }) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    let vendorId;
    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
      vendorId = decoded.id;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
 
    const { id: bookingId } = await params;
 
    // Update booking
    const result = await pool.query(
      `UPDATE service_bookings 
       SET vendor_id = $1, status = 'VENDOR_ACCEPTED', vendor_status = 'ACCEPTED', accepted_at = NOW()
       WHERE id = $2
       RETURNING id, booking_reference, total_amount, user_id`,
      [vendorId, bookingId]
    );
 
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
 
    const booking = result.rows[0];
 
    // Remove notification for this vendor
    await pool.query(
      'DELETE FROM service_notifications WHERE booking_id = $1 AND vendor_id = $2',
      [bookingId, vendorId]
    );
 
    // Expire notifications for other vendors
    await pool.query(
      'UPDATE service_notifications SET expires_at = NOW() WHERE booking_id = $1 AND vendor_id != $2',
      [bookingId, vendorId]
    );
 
    return NextResponse.json({
      success: true,
      message: 'Booking accepted. You can now start the journey.',
      booking
    });
 
  } catch (error) {
    console.error('Booking accept error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
 