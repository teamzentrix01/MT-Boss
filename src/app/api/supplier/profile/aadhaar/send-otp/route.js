

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { aadhaar_number, supplierId } = body;

    if (!/^\d{12}$/.test(aadhaar_number) || !supplierId) {
      return NextResponse.json({ success: false, error: 'Valid Aadhaar number and supplierId are required.' }, { status: 400 });
    }

    // ── Rate limit: max 3 OTPs per hour ─────────────────────
    const recentOtps = await pool.query(
      `SELECT COUNT(*) FROM aadhaar_otp_log
       WHERE supplier_id = $1
         AND sent_at > NOW() - INTERVAL '1 hour'`,
      [parseInt(supplierId)]
    );

    if (parseInt(recentOtps.rows[0].count) >= 3) {
      return NextResponse.json(
        { success: false, error: 'Too many OTP requests. Please try after 1 hour.' },
        { status: 429 }
      );
    }

    // ── TODO: Replace with real Aadhaar OTP provider ─────────
    // e.g. Digio / Signzy / UIDAI sandbox
    // const otpResponse = await sendAadhaarOtp(aadhaar_number);
    const otpSent = true; // simulated

    if (!otpSent) {
      return NextResponse.json({ success: false, error: 'Failed to send OTP. Try again.' }, { status: 502 });
    }

    // ── Log OTP send ─────────────────────────────────────────
    await pool.query(
      `INSERT INTO aadhaar_otp_log (supplier_id, aadhaar_number, status)
       VALUES ($1, $2, 'sent')`,
      [parseInt(supplierId), aadhaar_number]
    );

    // ── Mark aadhaar as pending ───────────────────────────────
    await pool.query(
      `UPDATE suppliers
       SET aadhaar_number = $1, aadhaar_status = 'pending', updated_at = NOW()
       WHERE id = $2`,
      [aadhaar_number, parseInt(supplierId)]
    );

    return NextResponse.json({ success: true, message: 'OTP sent to Aadhaar-linked mobile number.' });

  } catch (err) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}