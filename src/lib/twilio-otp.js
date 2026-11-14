/**
 * Twilio Verify OTP — server-side only.
 * OTPs are generated/verified by Twilio; we never store OTP codes.
 */

import twilio from 'twilio';
import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';

/** Fixed OTP for local/dev flow testing when OTP_DEV_MODE skips Twilio. */
export const DEV_FIXED_OTP = '123456';

export const OTP_LENGTH = 6;
export const OTP_VALID_MINUTES = 5;
export const RESEND_COOLDOWN_SECONDS = 60;
export const RATE_LIMIT_MAX_PER_HOUR = 5;
export const VERIFY_ATTEMPTS_MAX_PER_HOUR = 15;

/**
 * Skip real Twilio outside production (or when OTP_DEV_MODE=true).
 */
export function isOtpDevMode() {
  if (process.env.OTP_DEV_MODE === 'true') return true;
  if (process.env.OTP_DEV_MODE === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

/**
 * Parse Indian mobile input into 10-digit local + E.164 (+91…).
 * Accepts: "9876543210", "+919876543210", "919876543210", "91 98765 43210".
 * @returns {{ ok: true, digits: string, e164: string } | { ok: false, error: string }}
 */
export function parseIndianPhone(input) {
  const raw = String(input ?? '').trim();
  if (!raw) {
    return { ok: false, error: 'Phone number is required.' };
  }

  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }

  if (!/^[6-9]\d{9}$/.test(digits)) {
    return {
      ok: false,
      error: 'Enter a valid Indian mobile number in E.164 format (+91XXXXXXXXXX).',
    };
  }

  return { ok: true, digits, e164: `+91${digits}` };
}

export function getClientIp(req) {
  const forwarded = req?.headers?.get?.('x-forwarded-for') || req?.headers?.get?.('x-real-ip') || '';
  const first = String(forwarded).split(',')[0].trim();
  if (first) return first.slice(0, 64);
  return 'unknown';
}

function getTwilioConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID?.trim();

  if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error(
      'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID must be configured for OTP delivery.',
    );
  }

  return { accountSid, authToken, verifyServiceSid };
}

function getTwilioClient() {
  const { accountSid, authToken } = getTwilioConfig();
  return twilio(accountSid, authToken);
}

export const ensureOtpRateLimitSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.mobile_otp_rate_limits (
      id SERIAL PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL,
      requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_mobile_otp_rate_limits_mobile ON public.mobile_otp_rate_limits(mobile)`,
  );
  await pool.query(`
    ALTER TABLE public.mobile_otp_rate_limits
      ADD COLUMN IF NOT EXISTS ip VARCHAR(64)
  `).catch(() => {});
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_mobile_otp_rate_limits_ip ON public.mobile_otp_rate_limits(ip)`,
  ).catch(() => {});

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.mobile_otp_verify_attempts (
      id SERIAL PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL,
      ip VARCHAR(64),
      attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_mobile_otp_verify_attempts_mobile ON public.mobile_otp_verify_attempts(mobile)`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS idx_mobile_otp_verify_attempts_ip ON public.mobile_otp_verify_attempts(ip)`,
  );
}, 24 * 60 * 60 * 1000, 'twilio_otp_rate_schema');

/**
 * Phone + IP rate limits for send/resend. Does not store OTP codes.
 * @returns {Promise<{ ok: true } | { ok: false, status: number, error: string }>}
 */
export async function assertAndRecordOtpSend({ mobileDigits, ip }) {
  await ensureOtpRateLimitSchema();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const lockKey = mobileDigits.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
    await client.query(`SELECT pg_advisory_xact_lock($1)`, [lockKey]);

    const isDev = isOtpDevMode();
    if (!isDev) {
      const recentPhone = await client.query(
        `SELECT COUNT(*)::INT AS cnt
           FROM mobile_otp_rate_limits
          WHERE mobile = $1 AND requested_at > NOW() - INTERVAL '60 seconds'`,
        [mobileDigits],
      );
      if (Number(recentPhone.rows[0]?.cnt) >= 1) {
        await client.query('ROLLBACK');
        return {
          ok: false,
          status: 429,
          error: 'Please wait 60 seconds before requesting another OTP.',
        };
      }

      const hourlyPhone = await client.query(
        `SELECT COUNT(*)::INT AS cnt
           FROM mobile_otp_rate_limits
          WHERE mobile = $1 AND requested_at > NOW() - INTERVAL '1 hour'`,
        [mobileDigits],
      );
      if (Number(hourlyPhone.rows[0]?.cnt) >= RATE_LIMIT_MAX_PER_HOUR) {
        await client.query('ROLLBACK');
        return {
          ok: false,
          status: 429,
          error: 'Too many OTP requests. Try again in an hour.',
        };
      }

      if (ip && ip !== 'unknown') {
        const hourlyIp = await client.query(
          `SELECT COUNT(*)::INT AS cnt
             FROM mobile_otp_rate_limits
            WHERE ip = $1 AND requested_at > NOW() - INTERVAL '1 hour'`,
          [ip],
        );
        if (Number(hourlyIp.rows[0]?.cnt) >= RATE_LIMIT_MAX_PER_HOUR * 3) {
          await client.query('ROLLBACK');
          return {
            ok: false,
            status: 429,
            error: 'Too many OTP requests from this network. Try again later.',
          };
        }
      }
    }

    await client.query(
      `INSERT INTO mobile_otp_rate_limits (mobile, ip) VALUES ($1, $2)`,
      [mobileDigits, ip || null],
    );
    await client.query('COMMIT');

    pool
      .query(`DELETE FROM mobile_otp_rate_limits WHERE requested_at < NOW() - INTERVAL '2 hours'`)
      .catch(() => {});

    return { ok: true };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Brute-force guard for verify attempts (phone + IP). OTP codes are never stored.
 */
export async function assertAndRecordOtpVerifyAttempt({ mobileDigits, ip }) {
  await ensureOtpRateLimitSchema();

  if (isOtpDevMode()) {
    return { ok: true };
  }

  const hourlyPhone = await pool.query(
    `SELECT COUNT(*)::INT AS cnt
       FROM mobile_otp_verify_attempts
      WHERE mobile = $1 AND attempted_at > NOW() - INTERVAL '1 hour'`,
    [mobileDigits],
  );
  if (Number(hourlyPhone.rows[0]?.cnt) >= VERIFY_ATTEMPTS_MAX_PER_HOUR) {
    return {
      ok: false,
      status: 429,
      error: 'Too many verification attempts. Please request a new OTP later.',
    };
  }

  if (ip && ip !== 'unknown') {
    const hourlyIp = await pool.query(
      `SELECT COUNT(*)::INT AS cnt
         FROM mobile_otp_verify_attempts
        WHERE ip = $1 AND attempted_at > NOW() - INTERVAL '1 hour'`,
      [ip],
    );
    if (Number(hourlyIp.rows[0]?.cnt) >= VERIFY_ATTEMPTS_MAX_PER_HOUR * 3) {
      return {
        ok: false,
        status: 429,
        error: 'Too many verification attempts from this network. Try again later.',
      };
    }
  }

  await pool.query(
    `INSERT INTO mobile_otp_verify_attempts (mobile, ip) VALUES ($1, $2)`,
    [mobileDigits, ip || null],
  );
  pool
    .query(`DELETE FROM mobile_otp_verify_attempts WHERE attempted_at < NOW() - INTERVAL '2 hours'`)
    .catch(() => {});

  return { ok: true };
}

/**
 * Send OTP via Twilio Verify (or log fixed OTP in dev mode).
 * @param {string} e164Phone - e.g. +919876543210
 */
export async function sendTwilioOtp(e164Phone) {
  if (isOtpDevMode()) {
    console.log(`\n[DEV MODE] OTP for ${e164Phone}: ${DEV_FIXED_OTP} (Twilio skipped)\n`);
    return { sid: null, status: 'dev', to: e164Phone };
  }

  const { verifyServiceSid } = getTwilioConfig();
  const client = getTwilioClient();

  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: e164Phone, channel: 'sms' });

    return {
      sid: verification.sid,
      status: verification.status,
      to: e164Phone,
    };
  } catch (err) {
    console.error('[twilio-otp] send failed:', {
      message: err?.message,
      code: err?.code,
      status: err?.status,
      moreInfo: err?.moreInfo,
    });
    const userError = mapTwilioSendError(err);
    const wrapped = new Error(userError);
    wrapped.status = err?.status >= 400 && err?.status < 500 ? 400 : 502;
    wrapped.code = err?.code;
    throw wrapped;
  }
}

/**
 * Verify OTP exclusively via Twilio Verify (or fixed code in dev).
 * @returns {Promise<{ ok: true } | { ok: false, status: number, error: string }>}
 */
export async function verifyTwilioOtp(e164Phone, code) {
  const otp = String(code ?? '').trim();
  if (!/^\d{6}$/.test(otp)) {
    return { ok: false, status: 400, error: 'OTP must be 6 digits.' };
  }

  if (isOtpDevMode()) {
    if (otp === DEV_FIXED_OTP) return { ok: true };
    return { ok: false, status: 400, error: 'Incorrect OTP. Please check and try again.' };
  }

  const { verifyServiceSid } = getTwilioConfig();
  const client = getTwilioClient();

  try {
    const check = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: e164Phone, code: otp });

    if (check.status === 'approved') {
      return { ok: true };
    }

    return {
      ok: false,
      status: 400,
      error: 'Incorrect OTP. Please check and try again.',
    };
  } catch (err) {
    console.error('[twilio-otp] verify failed:', err?.message || err);
    return mapTwilioVerifyError(err);
  }
}

function mapTwilioSendError(err) {
  const code = Number(err?.code);
  const status = err?.status;
  const message = String(err?.message || '').toLowerCase();

  if (code === 20003 || status === 401 || message.includes('authenticate')) {
    return 'Twilio authentication failed. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.';
  }
  if (code === 20404 || message.includes('not found')) {
    return 'Twilio Verify service not found. Check TWILIO_VERIFY_SERVICE_SID.';
  }
  if (code === 60200 || (status === 400 && message.includes('invalid'))) {
    return 'Invalid phone number. Use E.164 format (+91XXXXXXXXXX).';
  }
  if (code === 60203) {
    return 'Maximum OTP send attempts reached. Try again later.';
  }
  if (code === 60212) {
    return 'Too many OTP requests. Please wait before trying again.';
  }
  // Trial accounts can only SMS verified numbers
  if (code === 21608 || message.includes('unverified') || message.includes('trial')) {
    return 'Trial Twilio accounts can only send OTP to verified numbers. Verify this phone in Twilio Console, or upgrade the account.';
  }
  if (process.env.NODE_ENV !== 'production' && err?.message) {
    return `Failed to send OTP: ${err.message}`;
  }
  return 'Failed to send OTP. Please try again.';
}

function mapTwilioVerifyError(err) {
  const code = err?.code;
  const message = String(err?.message || '').toLowerCase();

  if (code === 20404 || message.includes('not found')) {
    return {
      ok: false,
      status: 400,
      error: 'No valid OTP found. Please request a new one.',
    };
  }
  if (code === 60202 || message.includes('max check')) {
    return {
      ok: false,
      status: 400,
      error: 'Maximum OTP attempts exceeded. Request a new OTP.',
    };
  }
  if (message.includes('expired')) {
    return {
      ok: false,
      status: 400,
      error: 'OTP has expired. Please request a new one.',
    };
  }
  return {
    ok: false,
    status: 502,
    error: 'Unable to verify OTP. Please try again.',
  };
}
