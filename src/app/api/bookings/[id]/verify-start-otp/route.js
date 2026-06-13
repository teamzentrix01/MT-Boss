import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ensureOtpSchema } from '@/lib/otp';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || process.env.JWT_SECRET || 'fallback-secret';

// POST - Vendor enters start OTP to confirm service start
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

    // Check booking exists, vendor matches, and OTP is correct
    const booking = await pool.query(
      `SELECT id, start_otp, start_otp_verified, status
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

    if (row.start_otp !== String(otp).trim()) {
      return NextResponse.json({ error: 'Invalid OTP. Please check with customer.' }, { status: 400 });
    }

    // Verify OTP and start service
    const result = await pool.query(
      `UPDATE service_bookings
       SET start_otp_verified = TRUE,
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
