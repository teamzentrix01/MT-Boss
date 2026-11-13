import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashMobileOtp } from '@/lib/mobile-auth';
import { sendOtpViaMsg91, isOtpDevMode, DEV_FIXED_OTP } from '@/lib/msg91';
import { createInitializationGuard } from '@/lib/api-utils';

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const OTP_VALID_MINUTES = 5;
const OTP_EXPIRES_HOURS = 1;
const RATE_LIMIT_MAX_PER_HOUR = 5;

const ensureSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.mobile_otps (
      id SERIAL PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL,
      otp_hash TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      used BOOLEAN NOT NULL DEFAULT FALSE,
      valid_till TIMESTAMPTZ NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_mobile_otps_mobile ON public.mobile_otps(mobile)`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.mobile_otp_rate_limits (
      id SERIAL PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL,
      requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_mobile_otp_rate_limits_mobile ON public.mobile_otp_rate_limits(mobile)`);
}, 24 * 60 * 60 * 1000, 'mobile_otp_schema');

export async function POST(req) {
  try {
    await ensureSchema();

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }

    const mobile = String(body?.mobile || '').trim().replace(/\s/g, '');

    if (!MOBILE_REGEX.test(mobile)) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid 10-digit Indian mobile number (starting with 6-9).' },
        { status: 400 },
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Serialize OTP requests per mobile (prevents concurrent rate-limit bypass)
      const lockKey = mobile.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
      await client.query(`SELECT pg_advisory_xact_lock($1)`, [lockKey]);

      const isDev = isOtpDevMode();

      // Temporary: skip rate limits in dev so OTP flow can be retested quickly
      if (!isDev) {
        const recentRow = await client.query(
          `SELECT COUNT(*)::INT AS cnt
           FROM mobile_otp_rate_limits
           WHERE mobile = $1 AND requested_at > NOW() - INTERVAL '60 seconds'`,
          [mobile],
        );
        if (Number(recentRow.rows[0]?.cnt) >= 1) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            { success: false, error: 'Please wait 60 seconds before requesting another OTP.' },
            { status: 429 },
          );
        }

        const hourlyRow = await client.query(
          `SELECT COUNT(*)::INT AS cnt
           FROM mobile_otp_rate_limits
           WHERE mobile = $1 AND requested_at > NOW() - INTERVAL '1 hour'`,
          [mobile],
        );
        if (Number(hourlyRow.rows[0]?.cnt) >= RATE_LIMIT_MAX_PER_HOUR) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            { success: false, error: 'Too many OTP requests. Try again in an hour.' },
            { status: 429 },
          );
        }
      }

      await client.query(
        `INSERT INTO mobile_otp_rate_limits (mobile) VALUES ($1)`,
        [mobile],
      );

      if (isDev) {
        await client.query(
          `UPDATE mobile_otps SET used = TRUE WHERE mobile = $1 AND used = FALSE`,
          [mobile],
        );

        const otpHash = hashMobileOtp(DEV_FIXED_OTP);
        await client.query(
          `INSERT INTO mobile_otps (mobile, otp_hash, valid_till, expires_at)
           VALUES ($1, $2, NOW() + INTERVAL '${OTP_VALID_MINUTES} minutes', NOW() + INTERVAL '${OTP_EXPIRES_HOURS} hours')`,
          [mobile, otpHash],
        );
      }

      await client.query('COMMIT');

      try {
        // Dev: local hash only (no SMS). Prod: MSG91 generates and sends OTP.
        await sendOtpViaMsg91(mobile);
      } catch (smsErr) {
        if (isDev) {
          await pool.query(
            `UPDATE mobile_otps
                SET used = TRUE
              WHERE mobile = $1
                AND used = FALSE
                AND created_at > NOW() - INTERVAL '5 seconds'`,
            [mobile],
          );
        }
        console.error('[send-otp] SMS delivery failed:', smsErr.message);
        return NextResponse.json(
          { success: false, error: 'Failed to send OTP. Please try again.' },
          { status: 502 },
        );
      }

      pool.query(`DELETE FROM mobile_otp_rate_limits WHERE requested_at < NOW() - INTERVAL '2 hours'`).catch(() => {});
      pool.query(`DELETE FROM mobile_otps WHERE expires_at < NOW()`).catch(() => {});

      // Never return the OTP value — in dev clients know the fixed code is 123456
      return NextResponse.json({
        success: true,
        message: isDev
          ? 'Dev OTP ready. Use 123456 to verify (no SMS sent).'
          : 'OTP sent successfully',
        ...(isDev ? { dev: true } : {}),
      });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[send-otp] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
