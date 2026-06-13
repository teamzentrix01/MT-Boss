import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { generateSixDigitOtp, hashOtp } from '@/lib/otp';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret';

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
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return Number(decoded.id) === Number(supplierId) && decoded.role === 'supplier' ? decoded : null;
  } catch {
    return null;
  }
}

export async function POST(request) {
  try {
    await ensureAadhaarOtpSchema();

    const body = await request.json();
    const { aadhaar_number, supplierId } = body;

    if (!/^\d{12}$/.test(aadhaar_number) || !supplierId) {
      return NextResponse.json({ success: false, error: 'Valid Aadhaar number and supplierId are required.' }, { status: 400 });
    }

    if (!verifySupplierToken(request, supplierId)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const recentOtps = await pool.query(
      `SELECT COUNT(*) FROM aadhaar_otp_log
       WHERE supplier_id = $1
         AND sent_at > NOW() - INTERVAL '1 hour'`,
      [Number(supplierId)]
    );

    if (Number(recentOtps.rows[0].count) >= 3) {
      return NextResponse.json(
        { success: false, error: 'Too many OTP requests. Please try after 1 hour.' },
        { status: 429 }
      );
    }

    const allowFakeOtp = process.env.ALLOW_FAKE_AADHAAR_OTP === 'true';
    const providerUrl = process.env.AADHAAR_OTP_SEND_URL;
    const apiKey = process.env.AADHAAR_OTP_API_KEY;
    let providerRequestId = null;
    let devOtp = null;

    if (allowFakeOtp) {
      devOtp = generateSixDigitOtp();
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
        body: JSON.stringify({ aadhaar_number }),
      });
      const providerData = await providerRes.json().catch(() => ({}));

      if (!providerRes.ok || providerData.success === false) {
        return NextResponse.json(
          { success: false, error: providerData.error || 'Failed to send Aadhaar OTP. Try again.' },
          { status: 502 }
        );
      }

      providerRequestId = providerData.request_id || providerData.requestId || providerData.data?.request_id || null;
    }

    await pool.query(
      `INSERT INTO aadhaar_otp_log (supplier_id, aadhaar_number, status, otp_hash, provider_request_id)
       VALUES ($1, $2, 'sent', $3, $4)`,
      [Number(supplierId), aadhaar_number, devOtp ? hashOtp(devOtp) : null, providerRequestId]
    );

    await pool.query(
      `UPDATE suppliers
       SET aadhaar_number = $1, aadhaar_status = 'pending', updated_at = NOW()
       WHERE id = $2`,
      [aadhaar_number, Number(supplierId)]
    );

    return NextResponse.json({
      success: true,
      message: 'OTP sent to Aadhaar-linked mobile number.',
      ...(allowFakeOtp && process.env.NODE_ENV !== 'production' ? { dev_otp: devOtp } : {}),
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
