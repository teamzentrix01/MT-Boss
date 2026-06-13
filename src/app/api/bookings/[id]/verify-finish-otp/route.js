import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureOtpSchema, SERVICE_OTP_EXPIRY_MINUTES, SERVICE_OTP_MAX_ATTEMPTS, verifyOtp } from '@/lib/otp';
import { requireRole } from '@/lib/auth';

// POST - Vendor enters finish OTP to mark service as complete → goes to AWAITING_PAYMENT
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

    const booking = await pool.query(
      `SELECT id, finish_otp, finish_otp_verified, finish_otp_generated_at, COALESCE(finish_otp_attempts, 0) AS finish_otp_attempts, status
       FROM service_bookings
       WHERE id = $1
         AND vendor_id = $2
         AND status = 'IN_PROGRESS'
         AND start_otp_verified = TRUE`,
      [bookingId, vendorId]
    );

    if (booking.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found or not ready for finish OTP' }, { status: 404 });
    }

    const row = booking.rows[0];

    if (!row.finish_otp) {
      return NextResponse.json({ error: 'Finish OTP not yet generated. Ask customer to generate it.' }, { status: 400 });
    }

    if (!row.finish_otp_generated_at || new Date(row.finish_otp_generated_at).getTime() < Date.now() - SERVICE_OTP_EXPIRY_MINUTES * 60 * 1000) {
      await pool.query(
        `UPDATE service_bookings SET finish_otp = NULL, finish_otp_attempts = 0 WHERE id = $1`,
        [bookingId]
      );
      return NextResponse.json({ error: 'Finish OTP expired. Ask customer to generate a new OTP.' }, { status: 400 });
    }

    if (Number(row.finish_otp_attempts) >= SERVICE_OTP_MAX_ATTEMPTS) {
      return NextResponse.json({ error: 'Too many incorrect attempts. Ask customer to generate a new OTP.' }, { status: 429 });
    }

    if (!verifyOtp(String(otp).trim(), row.finish_otp)) {
      const attempts = Number(row.finish_otp_attempts) + 1;
      await pool.query(
        `UPDATE service_bookings SET finish_otp_attempts = $1 WHERE id = $2`,
        [attempts, bookingId]
      );
      return NextResponse.json({
        error: 'Invalid OTP. Please check with customer.',
        attempts_remaining: Math.max(SERVICE_OTP_MAX_ATTEMPTS - attempts, 0),
      }, { status: 400 });
    }

    // Verify finish OTP → move to AWAITING_PAYMENT
    const result = await pool.query(
      `UPDATE service_bookings
       SET finish_otp_verified = TRUE,
           finish_otp = NULL,
           service_finished_at = NOW(),
           final_amount = COALESCE(final_amount, total_amount, base_amount),
           extra_amount = COALESCE(extra_amount, 0),
           is_quick_job = COALESCE(is_quick_job, TRUE),
           status = 'AWAITING_PAYMENT',
           vendor_status = 'COMPLETED',
           user_status = 'AWAITING_PAYMENT'
       WHERE id = $1
       RETURNING id, status, service_finished_at`,
      [bookingId]
    );

    return NextResponse.json({
      success: true,
      message: 'Finish OTP verified! Work complete. Awaiting customer payment confirmation.',
      booking: result.rows[0],
    });
  } catch (error) {
    console.error('Verify finish OTP error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
