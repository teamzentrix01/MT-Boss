import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ensureOtpSchema } from '@/lib/otp';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || process.env.JWT_SECRET || 'fallback-secret';

// POST - Vendor enters finish OTP to mark service as complete → goes to AWAITING_PAYMENT
export async function POST(req, { params }) {
  try {
    await ensureOtpSchema();
    const { id: bookingId } = await params;

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let vendorId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      vendorId = decoded.id;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { otp } = await req.json();
    if (!otp) {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
    }

    const booking = await pool.query(
      `SELECT id, finish_otp, finish_otp_verified, status
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

    if (row.finish_otp !== String(otp).trim()) {
      return NextResponse.json({ error: 'Invalid OTP. Please check with customer.' }, { status: 400 });
    }

    // Verify finish OTP → move to AWAITING_PAYMENT
    const result = await pool.query(
      `UPDATE service_bookings
       SET finish_otp_verified = TRUE,
           service_finished_at = NOW(),
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
