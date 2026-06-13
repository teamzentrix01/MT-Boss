import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req, { params }) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let vendorId;
    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
      vendorId = decoded.id;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id: bookingId } = await params;
    const { is_quick_job, extra_amount, vendor_note } = await req.json();

    const bookingRow = await pool.query(
      `SELECT base_amount, status, finish_otp_verified
       FROM service_bookings
       WHERE id = $1 AND vendor_id = $2`,
      [bookingId, vendorId]
    );
    if (bookingRow.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found or unauthorized' }, { status: 404 });
    }

    if (bookingRow.rows[0].status !== 'AWAITING_PAYMENT' || bookingRow.rows[0].finish_otp_verified !== true) {
      return NextResponse.json(
        { error: 'Finish OTP verification is required before completing this booking.' },
        { status: 400 }
      );
    }

    const base = parseFloat(bookingRow.rows[0].base_amount);
    const finalAmount = is_quick_job ? base : base + parseFloat(extra_amount || 0);

    const result = await pool.query(
      `UPDATE service_bookings
       SET final_amount   = $1,
           extra_amount   = $2,
           is_quick_job   = $3,
           vendor_notes   = $4,
           status         = 'AWAITING_PAYMENT',
           vendor_status  = 'COMPLETED'
       WHERE id = $5 AND vendor_id = $6
       RETURNING id, user_id, base_amount, final_amount, is_quick_job`,
      [finalAmount, is_quick_job ? 0 : parseFloat(extra_amount || 0), is_quick_job, vendor_note, bookingId, vendorId]
    );

    return NextResponse.json({
      success: true,
      message: 'Work marked complete. Awaiting payment confirmation.',
      booking: result.rows[0],
    });

  } catch (error) {
    console.error('Booking complete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
