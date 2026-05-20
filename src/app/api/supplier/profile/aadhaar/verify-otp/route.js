

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { aadhaar_number, otp, supplierId } = body;

    if (!aadhaar_number || !otp || !supplierId) {
      return NextResponse.json({ success: false, error: 'aadhaar_number, otp and supplierId are required.' }, { status: 400 });
    }

    // ── Check latest sent OTP log (valid for 10 mins) ────────
    const logResult = await pool.query(
      `SELECT id FROM aadhaar_otp_log
       WHERE supplier_id    = $1
         AND aadhaar_number = $2
         AND status         = 'sent'
         AND sent_at        > NOW() - INTERVAL '10 minutes'
       ORDER BY sent_at DESC
       LIMIT 1`,
      [parseInt(supplierId), aadhaar_number]
    );

    if (logResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'OTP expired or not found. Please request a new OTP.' },
        { status: 400 }
      );
    }

    const logId = logResult.rows[0].id;

    // ── TODO: Replace with real Aadhaar OTP verify API ───────
    // const verified = await verifyAadhaarOtp(aadhaar_number, otp);
    const verified = true; // simulated

    if (!verified) {
      await pool.query(
        `UPDATE aadhaar_otp_log SET status = 'failed' WHERE id = $1`,
        [logId]
      );
      return NextResponse.json({ success: false, error: 'Invalid OTP. Please try again.' }, { status: 400 });
    }

    // ── Mark log as verified ─────────────────────────────────
    await pool.query(
      `UPDATE aadhaar_otp_log
       SET status = 'verified', verified_at = NOW()
       WHERE id = $1`,
      [logId]
    );

    // ── Update supplier ──────────────────────────────────────
    await pool.query(
      `UPDATE suppliers
       SET aadhaar_status = 'verified',
           aadhaar_number = $1,
           updated_at     = NOW()
       WHERE id = $2`,
      [aadhaar_number, parseInt(supplierId)]
    );

    return NextResponse.json({ success: true, message: 'Aadhaar verified successfully!' });

  } catch (err) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}