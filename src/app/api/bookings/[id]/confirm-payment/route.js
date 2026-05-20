// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/bookings/[id]/confirm-payment/route.js
// USER CONFIRMS PAYMENT AND BOOKING CLOSES
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
 
export async function POST(req, { params }) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
 
    const { id: bookingId } = await params;
    const { user_paid_amount, user_note } = await req.json();
 
    // Update booking
    const result = await pool.query(
      `UPDATE service_bookings 
       SET status = 'COMPLETED', user_status = 'COMPLETED', payment_status = 'CONFIRMED',
           user_paid_amount = $1, user_notes = $2, completed_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING id, vendor_id, total_amount`,
      [user_paid_amount, user_note, bookingId, userId]
    );
 
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
 
    return NextResponse.json({
      success: true,
      message: 'Booking completed! You can now rate the vendor.',
      booking: result.rows[0]
    });
 
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
 