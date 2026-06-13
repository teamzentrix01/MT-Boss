import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureOtpSchema, generateOtp, hashOtp } from '@/lib/otp';
import { requireRole } from '@/lib/auth';

// POST - Customer requests start OTP (booking must be VENDOR_ACCEPTED)
// The OTP is generated and stored — customer sees it, vendor must enter it
export async function POST(req, { params }) {
  try {
    await ensureOtpSchema();
    const { id: bookingId } = await params;

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let userId, userEmail;
    try {
      const decoded = requireRole(req, 'user');
      if (!decoded) throw new Error('Invalid role');
      userId = decoded.id;
      userEmail = decoded.email;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const booking = await pool.query(
      `SELECT id, user_id, user_email, status, start_otp, start_otp_generated_at, start_otp_verified
       FROM service_bookings
       WHERE id = $1
         AND status IN ('VENDOR_ACCEPTED', 'VENDOR_ON_WAY')
         AND (
           ($2::INTEGER IS NOT NULL AND user_id = $2)
           OR ($3::TEXT IS NOT NULL AND LOWER(user_email) = LOWER($3))
           OR ($2::INTEGER IS NULL AND user_id IS NULL)
         )`,
      [bookingId, userId || null, userEmail || null]
    );

    if (booking.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found or not ready for start OTP' }, { status: 404 });
    }

    const row = booking.rows[0];
    const generatedAt = row.start_otp_generated_at ? new Date(row.start_otp_generated_at).getTime() : 0;
    if (row.start_otp && !row.start_otp_verified && Date.now() - generatedAt < 60 * 1000) {
      return NextResponse.json(
        { error: 'Please wait a minute before regenerating the start OTP.' },
        { status: 429 }
      );
    }

    const otp = generateOtp();

    await pool.query(
      `UPDATE service_bookings
       SET start_otp = $1,
           start_otp_verified = FALSE,
           start_otp_generated_at = NOW(),
           start_otp_attempts = 0
       WHERE id = $2`,
      [hashOtp(otp), bookingId]
    );

    return NextResponse.json({
      success: true,
      message: 'Start OTP generated. Share this with the vendor when they arrive.',
      otp: otp,
    });
  } catch (error) {
    console.error('Start OTP generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
