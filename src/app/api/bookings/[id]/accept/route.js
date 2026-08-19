// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/bookings/[id]/accept/route.js
// VENDOR ACCEPTS BOOKING
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ensurePackageSchema } from '@/lib/packages';
import { ensureOtpSchema, generateOtp, hashOtp } from '@/lib/otp';
import { sendMail } from '@/lib/email';
 
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
    await ensurePackageSchema();
    await ensureOtpSchema();
 
    const client = await pool.connect();
    let booking;

    try {
      await client.query('BEGIN');

      const startOtp = generateOtp();
      const result = await client.query(
        `UPDATE service_bookings sb
         SET vendor_id = $1,
             status = 'VENDOR_ACCEPTED',
             vendor_status = 'ACCEPTED',
             accepted_at = NOW(),
             start_otp = $3,
             start_otp_verified = FALSE,
             start_otp_generated_at = NOW(),
             start_otp_attempts = 0
         WHERE sb.id = $2
           AND sb.status = 'WAITING_FOR_VENDOR_ACCEPTANCE'
           AND sb.vendor_id IS NULL
           AND EXISTS (
             SELECT 1
             FROM vendors v
             JOIN vendor_services vs
               ON vs.vendor_id = v.id
              AND vs.quick_service_id = sb.quick_service_id
              AND vs.is_active = TRUE
             WHERE v.id = $1
               AND LOWER(TRIM(v.city)) = LOWER(TRIM(sb.service_city))
               AND v.is_approved = TRUE
               AND LOWER(COALESCE(v.status, 'active')) IN ('active', 'approved')
               AND COALESCE(v.verification_status, 'verified') IN ('verified', 'approved')
               AND v.package_status = 'active'
               AND (v.package_expires_at IS NULL OR v.package_expires_at > NOW())
           )
         RETURNING id, booking_reference, total_amount, user_id, user_email`,
        [vendorId, bookingId, hashOtp(startOtp)]
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
      booking.start_otp_plain = startOtp;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
 
    if (booking.user_email) {
      try {
        await sendMail({
          to: booking.user_email,
          subject: `Vendor assigned - start OTP for ${booking.booking_reference}`,
          text: `Your vendor has accepted the service. Share start OTP ${booking.start_otp_plain} only when the vendor reaches your location.`,
        });
      } catch (emailError) {
        console.error('Accepted booking OTP email failed:', emailError.message);
      }
    }
    delete booking.start_otp_plain;

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
 
