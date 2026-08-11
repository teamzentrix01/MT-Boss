import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureOtpSchema, generateOtp, hashOtp } from '@/lib/otp';
import { requireRole } from '@/lib/auth';
import { sendMail } from '@/lib/email';

// POST - Customer or assigned vendor generates finish OTP when work is done.
export async function POST(req, { params }) {
  try {
    await ensureOtpSchema();
    const { id: bookingId } = await params;

    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = requireRole(req, 'user');
    const vendor = requireRole(req, 'vendor');
    if (!user && !vendor) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = user?.id;
    const userEmail = user?.email;
    const booking = await pool.query(
      `SELECT id, booking_reference, user_id, user_email, status, start_otp_verified, finish_otp, finish_otp_generated_at, finish_otp_verified
       FROM service_bookings
       WHERE id = $1
         AND status = 'IN_PROGRESS'
         AND start_otp_verified = TRUE
         AND (
           ($2::TEXT = 'user' AND (
             ($3::INTEGER IS NOT NULL AND user_id = $3)
             OR ($4::TEXT IS NOT NULL AND LOWER(user_email) = LOWER($4))
             OR ($3::INTEGER IS NULL AND user_id IS NULL)
           ))
           OR ($2::TEXT = 'vendor' AND vendor_id = $5::INTEGER)
         )`,
      [bookingId, vendor ? 'vendor' : 'user', userId || null, userEmail || null, vendor?.id || null]
    );

    if (booking.rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found or service not in progress' }, { status: 404 });
    }

    const row = booking.rows[0];
    const generatedAt = row.finish_otp_generated_at ? new Date(row.finish_otp_generated_at).getTime() : 0;
    if (row.finish_otp && !row.finish_otp_verified && Date.now() - generatedAt < 60 * 1000) {
      return NextResponse.json(
        { error: 'Please wait a minute before regenerating the finish OTP.' },
        { status: 429 }
      );
    }

    const otp = generateOtp();

    await pool.query(
      `UPDATE service_bookings
       SET finish_otp = $1,
           finish_otp_verified = FALSE,
           finish_otp_generated_at = NOW(),
           finish_otp_attempts = 0
       WHERE id = $2`,
      [hashOtp(otp), bookingId]
    );

    const customerEmail = row.user_email || userEmail;
    if (customerEmail) {
      try {
        await sendMail({
          to: customerEmail,
          subject: `Finish OTP for ${row.booking_reference || 'your MTBoss booking'}`,
          text: `Your MTBoss finish OTP is ${otp}. Share it with the vendor only after the work is completed.`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111;">
              <h2 style="margin:0 0 12px;">MTBoss Finish OTP</h2>
              <p style="margin:0 0 16px;line-height:1.5;">Share this OTP with the vendor only after the service work is completed.</p>
              <div style="font-size:34px;font-weight:700;letter-spacing:10px;padding:18px 20px;background:#fff7ed;border:1px solid #fed7aa;text-align:center;">${otp}</div>
              <p style="margin:16px 0 0;font-size:13px;color:#555;">This code expires soon. Do not share it before the work is done.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Finish OTP email failed:', emailError.message);
        if (vendor) {
          await pool.query(
            `UPDATE service_bookings
             SET finish_otp = NULL,
                 finish_otp_generated_at = NULL,
                 finish_otp_attempts = 0
             WHERE id = $1`,
            [bookingId]
          );
          return NextResponse.json({ error: 'Failed to send OTP email. Please try again.' }, { status: 502 });
        }
      }
    } else if (vendor) {
      await pool.query(
        `UPDATE service_bookings
         SET finish_otp = NULL,
             finish_otp_generated_at = NULL,
             finish_otp_attempts = 0
         WHERE id = $1`,
        [bookingId]
      );
      return NextResponse.json({ error: 'Customer email is missing for this booking.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: vendor ? 'Finish OTP sent to customer email.' : 'Finish OTP generated. Share this with the vendor to complete the service.',
      ...(vendor ? {} : { otp }),
    });
  } catch (error) {
    console.error('Finish OTP generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
