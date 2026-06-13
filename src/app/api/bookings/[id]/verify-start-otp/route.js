import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureOtpSchema, SERVICE_OTP_EXPIRY_MINUTES, SERVICE_OTP_MAX_ATTEMPTS, verifyOtp } from '@/lib/otp';
import { requireRole } from '@/lib/auth';

// POST - Vendor enters start OTP to confirm service start
export async function POST(req, { params }) {
  try {
    await ensureOtpSchema();
    const { id: bookingId } = await params;

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let vendorId;
    try {
      const decoded = requireRole(req, 'vendor');
      if (!decoded) throw new Error('Invalid role');
      vendorId = decoded.id;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { otp } = await req.json();
    if (!otp) {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
    }

    // Check booking exists, vendor matches, and OTP is correct
    const booking = await pool.query(
      `SELECT id, start_otp, start_otp_verified, start_otp_generated_at, COALESCE(start_otp_attempts, 0) AS start_otp_attempts, status
       FROM service_bookings
       WHERE id = $1
         AND vendor_id = $2
         AND status IN ('VENDOR_ACCEPTED', 'VENDOR_ON_WAY')`,
      [bookingId, vendorId]
    );

    if (booking.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found or already started' }, { status: 404 });
    }

    const row = booking.rows[0];

    if (!row.start_otp) {
      return NextResponse.json({ error: 'Start OTP not yet generated. Ask customer to generate it.' }, { status: 400 });
    }

    if (!row.start_otp_generated_at || new Date(row.start_otp_generated_at).getTime() < Date.now() - SERVICE_OTP_EXPIRY_MINUTES * 60 * 1000) {
      await pool.query(
        `UPDATE service_bookings SET start_otp = NULL, start_otp_attempts = 0 WHERE id = $1`,
        [bookingId]
      );
      return NextResponse.json({ error: 'Start OTP expired. Ask customer to generate a new OTP.' }, { status: 400 });
    }

    if (Number(row.start_otp_attempts) >= SERVICE_OTP_MAX_ATTEMPTS) {
      return NextResponse.json({ error: 'Too many incorrect attempts. Ask customer to generate a new OTP.' }, { status: 429 });
    }

    if (!verifyOtp(String(otp).trim(), row.start_otp)) {
      const attempts = Number(row.start_otp_attempts) + 1;
      await pool.query(
        `UPDATE service_bookings SET start_otp_attempts = $1 WHERE id = $2`,
        [attempts, bookingId]
      );
      return NextResponse.json({
        error: 'Invalid OTP. Please check with customer.',
        attempts_remaining: Math.max(SERVICE_OTP_MAX_ATTEMPTS - attempts, 0),
      }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE service_bookings
       SET start_otp_verified = TRUE,
           start_otp = NULL,
           service_started_at = NOW(),
           status = 'IN_PROGRESS',
           vendor_status = 'IN_PROGRESS'
       WHERE id = $1
       RETURNING id, status, service_started_at`,
      [bookingId]
    );

    return NextResponse.json({
      success: true,
      message: 'Start OTP verified! Service is now in progress.',
      booking: result.rows[0],
    });
  } catch (error) {
    console.error('Verify start OTP error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
