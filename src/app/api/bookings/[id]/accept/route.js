// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/bookings/[id]/accept/route.js
// VENDOR ACCEPTS BOOKING
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
 
    const client = await pool.connect();
    let booking;

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE service_bookings sb
         SET vendor_id = $1,
             status = 'VENDOR_ACCEPTED',
             vendor_status = 'ACCEPTED',
             accepted_at = NOW()
         WHERE sb.id = $2
           AND sb.status = 'WAITING_FOR_VENDOR_ACCEPTANCE'
           AND sb.vendor_id IS NULL
           AND EXISTS (
             SELECT 1
             FROM service_notifications sn
             JOIN vendors v ON v.id = sn.vendor_id
             JOIN vendor_services vs
               ON vs.vendor_id = v.id
              AND vs.quick_service_id = sb.quick_service_id
              AND vs.is_active = TRUE
             WHERE sn.booking_id = sb.id
               AND sn.vendor_id = $1
               AND sn.is_read = FALSE
               AND (sn.expires_at IS NULL OR sn.expires_at > NOW())
               AND LOWER(TRIM(v.city)) = LOWER(TRIM(sb.service_city))
               AND v.is_approved = TRUE
               AND v.status = 'active'
               AND COALESCE(v.verification_status, 'verified') IN ('verified', 'approved')
           )
         RETURNING id, booking_reference, total_amount, user_id`,
        [vendorId, bookingId]
      );
   
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: 'Booking is not available for this vendor or has already been accepted' },
          { status: 409 }
        );
      }
   
      booking = result.rows[0];
   
      // Remove notification for this vendor
      await client.query(
        'DELETE FROM service_notifications WHERE booking_id = $1 AND vendor_id = $2',
        [bookingId, vendorId]
      );
   
      // Expire notifications for other vendors
      await client.query(
        'UPDATE service_notifications SET expires_at = NOW() WHERE booking_id = $1 AND vendor_id != $2',
        [bookingId, vendorId]
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
 
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
 
