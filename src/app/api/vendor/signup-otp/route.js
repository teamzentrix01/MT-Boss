import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendMail } from '@/lib/email';
import { generateSixDigitOtp, hashOtp, PASSWORD_RESET_OTP_EXPIRY_MINUTES } from '@/lib/otp';
import { isValidEmail } from '@/lib/validation';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vendor_signup_otps (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      otp_hash TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ success: false, error: 'Enter a valid email address.' }, { status: 400 });
    }

    await ensureTable();
    const existing = await pool.query(`SELECT id FROM vendors WHERE LOWER(TRIM(email)) = $1`, [normalizedEmail]);
    if (existing.rows[0]) {
      return NextResponse.json({ success: false, error: 'Email already registered.' }, { status: 409 });
    }
    const recent = await pool.query(
      `SELECT COUNT(*)::INT AS count FROM vendor_signup_otps WHERE email = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
      [normalizedEmail]
    );
    if (Number(recent.rows[0]?.count || 0) >= 5) {
      return NextResponse.json({ success: false, error: 'Too many OTP requests. Try again later.' }, { status: 429 });
    }

    const otp = generateSixDigitOtp();
    await pool.query(`UPDATE vendor_signup_otps SET used = TRUE WHERE email = $1 AND used = FALSE`, [normalizedEmail]);
    await pool.query(
      `INSERT INTO vendor_signup_otps (email, otp_hash, expires_at) VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 minute'))`,
      [normalizedEmail, hashOtp(otp), PASSWORD_RESET_OTP_EXPIRY_MINUTES]
    );

    const smtpConfigured = Boolean(
      (process.env.SMTP_HOST || process.env.EMAIL_HOST)
      && (process.env.SMTP_USER || process.env.EMAIL_USER)
      && (process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD)
    );
    if (!smtpConfigured && process.env.NODE_ENV === 'production') {
      await pool.query(`UPDATE vendor_signup_otps SET used = TRUE WHERE email = $1 AND used = FALSE`, [normalizedEmail]);
      return NextResponse.json({ success: false, error: 'Email service is not configured.' }, { status: 503 });
    }
    if (smtpConfigured) {
      try {
        await sendMail({
          to: normalizedEmail,
          subject: 'Verify your MTBoss vendor registration',
          text: `Your MTBoss vendor registration OTP is ${otp}. It expires in ${PASSWORD_RESET_OTP_EXPIRY_MINUTES} minutes.`,
        });
      } catch (error) {
        await pool.query(`UPDATE vendor_signup_otps SET used = TRUE WHERE email = $1 AND used = FALSE`, [normalizedEmail]);
        return NextResponse.json({ success: false, error: 'Failed to send OTP email. Please retry.' }, { status: 502 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registration OTP sent.',
      ...(!smtpConfigured && process.env.NODE_ENV !== 'production' ? { dev_otp: otp } : {}),
    });
  } catch (error) {
    console.error('Vendor signup OTP error:', error);
    return NextResponse.json({ success: false, error: 'Unable to send registration OTP.' }, { status: 500 });
  }
}
