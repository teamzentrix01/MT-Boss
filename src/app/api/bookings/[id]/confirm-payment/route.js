import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req, { params }) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userId = null;
    let userEmail = null;
    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
      const rawId = decoded.id;
      userEmail = decoded.email || null;

      if (rawId && rawId !== 0) {
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [rawId]);
        userId = userCheck.rows.length > 0 ? rawId : null;
      }
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id: bookingId } = await params;
    const { user_paid_amount, user_note } = await req.json();
    const paidAmount = parseFloat(user_paid_amount);

    if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
      return NextResponse.json({ error: 'Valid paid amount is required' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE service_bookings
       SET status = 'COMPLETED',
           user_status = 'COMPLETED',
           payment_status = 'CONFIRMED',
           user_paid_amount = $1,
           user_notes = $2,
           completed_at = NOW()
       WHERE id = $3
         AND status = 'AWAITING_PAYMENT'
         AND (
           ($4::INTEGER IS NOT NULL AND user_id = $4)
           OR ($5::TEXT IS NOT NULL AND LOWER(user_email) = LOWER($5))
           OR ($4::INTEGER IS NULL AND user_id IS NULL)
         )
       RETURNING id, vendor_id, total_amount, final_amount, user_paid_amount, status, completed_at`,
      [paidAmount, user_note || null, bookingId, userId, userEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found, already completed, or not ready for payment' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking completed! You can now rate the vendor.',
      booking: result.rows[0],
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
