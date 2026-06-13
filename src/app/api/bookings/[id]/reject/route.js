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
 
    // Delete notification for this vendor
    await pool.query(
      'DELETE FROM service_notifications WHERE booking_id = $1 AND vendor_id = $2',
      [bookingId, vendorId]
    );
 
    return NextResponse.json({
      success: true,
      message: 'Booking rejected. Notification removed.'
    });
 
  } catch (error) {
    console.error('Booking reject error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
