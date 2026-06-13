import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyOtp } from '@/lib/otp';
import { requireRole } from '@/lib/auth';
const AADHAAR_OTP_MAX_ATTEMPTS = 5;

async function ensureAadhaarOtpSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS aadhaar_otp_log (
      id SERIAL PRIMARY KEY,
      supplier_id INTEGER NOT NULL,
      aadhaar_number VARCHAR(12) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'sent',
      sent_at TIMESTAMP DEFAULT NOW(),
      verified_at TIMESTAMP
    )
  `);
  await pool.query(`ALTER TABLE aadhaar_otp_log ADD COLUMN IF NOT EXISTS otp_hash TEXT`);
  await pool.query(`ALTER TABLE aadhaar_otp_log ADD COLUMN IF NOT EXISTS provider_request_id TEXT`);
  await pool.query(`ALTER TABLE aadhaar_otp_log ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0`);
}

function verifySupplierToken(request, supplierId) {
  const decoded = requireRole(request, 'supplier');
  return Number(decoded?.id) === Number(supplierId) ? decoded : null;
}

export async function POST(request) {
  try {
    await ensureAadhaarOtpSchema();

    const body = await request.json();
    const { aadhaar_number, otp, supplierId } = body;

    if (!/^\d{12}$/.test(aadhaar_number || '') || !otp || !supplierId) {
      return NextResponse.json({ success: false, error: 'aadhaar_number, otp and supplierId are required.' }, { status: 400 });
    }

    if (!verifySupplierToken(request, supplierId)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const logResult = await pool.query(
      `SELECT id, otp_hash, provider_request_id, COALESCE(attempts, 0) AS attempts
       FROM aadhaar_otp_log
       WHERE supplier_id    = $1
         AND aadhaar_number = $2
         AND status         = 'sent'
         AND sent_at        > NOW() - INTERVAL '10 minutes'
       ORDER BY sent_at DESC
       LIMIT 1`,
      [Number(supplierId), aadhaar_number]
    );

    if (logResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'OTP expired or not found. Please request a new OTP.' },
        { status: 400 }
      );
    }

    const log = logResult.rows[0];

    if (Number(log.attempts) >= AADHAAR_OTP_MAX_ATTEMPTS) {
      await pool.query(`UPDATE aadhaar_otp_log SET status = 'failed' WHERE id = $1`, [log.id]);
      return NextResponse.json({ success: false, error: 'Too many invalid attempts. Please request a new OTP.' }, { status: 429 });
    }

    const allowFakeOtp = process.env.ALLOW_FAKE_AADHAAR_OTP === 'true';
    const providerUrl = process.env.AADHAAR_OTP_VERIFY_URL;
    const apiKey = process.env.AADHAAR_OTP_API_KEY;
    let verified = false;

    if (allowFakeOtp) {
      verified = verifyOtp(String(otp).trim(), log.otp_hash);
    } else {
      if (!providerUrl) {
        return NextResponse.json(
          { success: false, error: 'Aadhaar OTP provider is not configured.' },
          { status: 503 }
        );
      }

      const providerRes = await fetch(providerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          aadhaar_number,
          otp: String(otp).trim(),
          request_id: log.provider_request_id,
        }),
      });
      const providerData = await providerRes.json().catch(() => ({}));

      if (!providerRes.ok && providerRes.status >= 500) {
        return NextResponse.json(
          { success: false, error: providerData.error || 'Aadhaar OTP verification failed. Please try again.' },
          { status: 502 }
        );
      }

      verified = providerRes.ok && providerData.success !== false;
    }

    if (!verified) {
      const attempts = Number(log.attempts) + 1;
      await pool.query(
        `UPDATE aadhaar_otp_log
         SET attempts = $1,
             status = CASE WHEN $1 >= $2 THEN 'failed' ELSE status END
         WHERE id = $3`,
        [attempts, AADHAAR_OTP_MAX_ATTEMPTS, log.id]
      );
      return NextResponse.json({
        success: false,
        error: 'Invalid OTP. Please try again.',
        attempts_remaining: Math.max(AADHAAR_OTP_MAX_ATTEMPTS - attempts, 0),
      }, { status: 400 });
    }

    await pool.query(
      `UPDATE aadhaar_otp_log
       SET status = 'verified', verified_at = NOW()
       WHERE id = $1`,
      [log.id]
    );

    await pool.query(
      `UPDATE suppliers
       SET aadhaar_status = 'verified',
           aadhaar_number = $1,
           updated_at     = NOW()
       WHERE id = $2`,
      [aadhaar_number, Number(supplierId)]
    );

    return NextResponse.json({ success: true, message: 'Aadhaar verified successfully!' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
