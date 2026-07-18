import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createPayURequest } from '@/lib/payu';
import { createPayUIntent, getPayUCallbackUrl, newPayUTxnId } from '@/lib/payu-intents';

export async function POST(req, { params }) {
  try {
    const user = requireRole(req, 'user');
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const result = await pool.query(
      `SELECT sb.id, sb.booking_reference, sb.user_name, sb.user_email, sb.user_phone,
              COALESCE(sb.final_amount, sb.total_amount) AS payable_amount
       FROM service_bookings sb
       WHERE sb.id = $1 AND sb.status = 'AWAITING_PAYMENT'
         AND (($2::INTEGER IS NOT NULL AND sb.user_id = $2)
              OR ($3::TEXT IS NOT NULL AND LOWER(sb.user_email) = LOWER($3)))`,
      [id, user.id || null, user.email || null]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Booking is not ready for payment' }, { status: 404 });
    }

    const booking = result.rows[0];
    const amount = Number(booking.payable_amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'The payable amount is invalid' }, { status: 400 });
    }

    const txnid = newPayUTxnId('BFP');
    await createPayUIntent({ txnid, purpose: 'booking_final', entityId: booking.id, amount });
    const callbackUrl = getPayUCallbackUrl(req);
    const payment = createPayURequest({
      txnid, amount, productinfo: `MTBOSS final payment ${booking.booking_reference}`,
      firstname: booking.user_name.split(/\s+/)[0], email: booking.user_email,
      phone: booking.user_phone, surl: callbackUrl, furl: callbackUrl,
      udf1: String(booking.id), udf2: booking.booking_reference, udf3: 'booking_final',
    });

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('PayU final booking payment error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
