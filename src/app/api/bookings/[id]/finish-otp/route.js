import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ensureOtpSchema, generateOtp } from '@/lib/otp';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || process.env.JWT_SECRET || 'fallback-secret';

// POST - Customer generates finish OTP when vendor completes work
export async function POST(req, { params }) {
  try {
    await ensureOtpSchema();
    const { id: bookingId } = await params;

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let userId, userEmail;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
      userEmail = decoded.email;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const booking = await pool.query(
      `SELECT id, user_id, user_email, status, start_otp_verified
       FROM service_bookings
       WHERE id = $1
         AND status = 'IN_PROGRESS'
         AND start_otp_verified = TRUE
         AND (
           ($2::INTEGER IS NOT NULL AND user_id = $2)
           OR ($3::TEXT IS NOT NULL AND LOWER(user_email) = LOWER($3))
           OR ($2::INTEGER IS NULL AND user_id IS NULL)
         )`,
      [bookingId, userId || null, userEmail || null]
    );

    if (booking.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found or service not in progress' }, { status: 404 });
    }

    const otp = generateOtp();

    await pool.query(
      `UPDATE service_bookings
       SET finish_otp = $1,
           finish_otp_verified = FALSE,
           finish_otp_generated_at = NOW()
       WHERE id = $2`,
      [otp, bookingId]
    );

    return NextResponse.json({
      success: true,
      message: 'Finish OTP generated. Share this with the vendor to complete the service.',
      otp: otp,
    });
  } catch (error) {
    console.error('Finish OTP generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
