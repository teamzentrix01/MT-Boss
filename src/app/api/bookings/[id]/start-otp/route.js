import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureOtpSchema, generateOtp, hashOtp } from '@/lib/otp';
import { requireRole } from '@/lib/auth';
import { sendMail } from '@/lib/email';

// POST - Customer requests start OTP (booking must be VENDOR_ACCEPTED)
// The OTP is generated and stored — customer sees it, vendor must enter it
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
      `SELECT id, booking_reference, user_id, user_email, status, start_otp, start_otp_generated_at, start_otp_verified
       FROM service_bookings
       WHERE id = $1
         AND status IN ('VENDOR_ACCEPTED', 'VENDOR_ON_WAY')
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

    const customerEmail = row.user_email || userEmail;
    if (customerEmail) {
      try {
        await sendMail({
          to: customerEmail,
          subject: `Start OTP for ${row.booking_reference || 'your MTBoss booking'}`,
          text: `Your MTBoss start OTP is ${otp}. Share it with the vendor only after they reach your location.`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111;">
              <h2 style="margin:0 0 12px;">MTBoss Start OTP</h2>
              <p style="margin:0 0 16px;line-height:1.5;">Share this OTP with the vendor only after they reach your location.</p>
              <div style="font-size:34px;font-weight:700;letter-spacing:10px;padding:18px 20px;background:#f4f7fb;border:1px solid #dbe7f5;text-align:center;">${otp}</div>
              <p style="margin:16px 0 0;font-size:13px;color:#555;">This code expires soon. Do not share it before the vendor arrives.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Start OTP email failed:', emailError.message);
        if (vendor) {
          await pool.query(
            `UPDATE service_bookings
             SET start_otp = NULL,
                 start_otp_generated_at = NULL,
                 start_otp_attempts = 0
             WHERE id = $1`,
            [bookingId]
          );
          return NextResponse.json({ error: 'Failed to send OTP email. Please try again.' }, { status: 502 });
        }
      }
    } else if (vendor) {
      await pool.query(
        `UPDATE service_bookings
         SET start_otp = NULL,
             start_otp_generated_at = NULL,
             start_otp_attempts = 0
         WHERE id = $1`,
        [bookingId]
      );
      return NextResponse.json({ error: 'Customer email is missing for this booking.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: vendor ? 'Start OTP sent to customer email.' : 'Start OTP generated. Share this with the vendor when they arrive.',
      ...(vendor ? {} : { otp }),
    });
  } catch (error) {
    console.error('Start OTP generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
