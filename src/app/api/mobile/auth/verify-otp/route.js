import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import {
  verifyMobileOtp,
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from '@/lib/mobile-auth';
import { createInitializationGuard } from '@/lib/api-utils';

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const OTP_REGEX = /^\d{6}$/;
const VALID_ROLES = ['agent', 'vendor', 'supplier'];
const MAX_OTP_ATTEMPTS = 5;

const ALLOW_AGENT_SELF_SIGNUP = process.env.ALLOW_AGENT_SELF_SIGNUP === 'true';

const ensureSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.mobile_users (
      id SERIAL PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL UNIQUE,
      name VARCHAR(255),
      role VARCHAR(20) NOT NULL DEFAULT 'vendor' CHECK (role IN ('agent','vendor','supplier')),
      status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','blocked')),
      refresh_token_hash TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_mobile_users_mobile ON public.mobile_users(mobile)`);
}, 24 * 60 * 60 * 1000, 'mobile_users_schema');

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
    const otp = String(body?.otp || '').trim();
    const role = String(body?.role || '').trim().toLowerCase();

    // Validate inputs
    if (!MOBILE_REGEX.test(mobile)) {
      return NextResponse.json({ success: false, error: 'Invalid mobile number.' }, { status: 400 });
    }
    if (!OTP_REGEX.test(otp)) {
      return NextResponse.json({ success: false, error: 'OTP must be 6 digits.' }, { status: 400 });
    }
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ success: false, error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}.` }, { status: 400 });
    }

    // Agent self-signup restriction
    if (role === 'agent' && !ALLOW_AGENT_SELF_SIGNUP) {
      return NextResponse.json(
        { success: false, error: 'Agent accounts must be provisioned by an administrator.' },
        { status: 403 },
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Find the latest valid, unused OTP (lock for atomic update)
      const otpResult = await client.query(
        `SELECT id, otp_hash, attempts, valid_till
         FROM mobile_otps
         WHERE mobile = $1 AND used = FALSE AND expires_at > NOW()
         ORDER BY created_at DESC
         LIMIT 1
         FOR UPDATE`,
        [mobile],
      );

      if (otpResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'No valid OTP found. Please request a new one.' }, { status: 400 });
      }

      const otpRecord = otpResult.rows[0];

      // Check OTP validity window (5 min)
      if (new Date() > new Date(otpRecord.valid_till)) {
        await client.query(`UPDATE mobile_otps SET used = TRUE WHERE id = $1`, [otpRecord.id]);
        await client.query('COMMIT');
        return NextResponse.json({ success: false, error: 'OTP has expired. Please request a new one.' }, { status: 400 });
      }

      // Check max attempts
      if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
        await client.query(`UPDATE mobile_otps SET used = TRUE WHERE id = $1`, [otpRecord.id]);
        await client.query('COMMIT');
        return NextResponse.json({ success: false, error: 'Maximum OTP attempts exceeded. Request a new OTP.' }, { status: 400 });
      }

      // Increment attempts atomically before verifying
      await client.query(`UPDATE mobile_otps SET attempts = attempts + 1 WHERE id = $1`, [otpRecord.id]);

      // Verify OTP hash
      if (!verifyMobileOtp(otp, otpRecord.otp_hash)) {
        const remaining = MAX_OTP_ATTEMPTS - (otpRecord.attempts + 1);
        await client.query('COMMIT');
        return NextResponse.json(
          { success: false, error: `Incorrect OTP. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'Request a new OTP.'}` },
          { status: 400 },
        );
      }

      // Mark OTP as used
      await client.query(`UPDATE mobile_otps SET used = TRUE WHERE id = $1`, [otpRecord.id]);

      // ── User upsert ─────────────────────────────────────────────────────
      const existingUser = await client.query(
        `SELECT id, mobile, name, role, status FROM mobile_users WHERE mobile = $1`,
        [mobile],
      );

      let user;
      if (existingUser.rows.length === 0) {
        // New user — create with role-appropriate default status
        const defaultStatus = role === 'agent' ? 'active' : 'pending';
        const insertResult = await client.query(
          `INSERT INTO mobile_users (mobile, role, status) VALUES ($1, $2, $3) RETURNING id, mobile, name, role, status`,
          [mobile, role, defaultStatus],
        );
        user = insertResult.rows[0];
      } else {
        user = existingUser.rows[0];

        // Reject blocked users
        if (user.status === 'blocked') {
          await client.query('ROLLBACK');
          return NextResponse.json({ success: false, error: 'Account blocked. Contact support.' }, { status: 403 });
        }

        // Role mismatch: never silently change role
        if (user.role !== role) {
          await client.query('ROLLBACK');
          return NextResponse.json(
            {
              success: false,
              error: `This mobile number is registered as ${user.role}. Please select the correct role.`,
            },
            { status: 403 },
          );
        }
      }

      // ── Generate tokens ─────────────────────────────────────────────────
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      const refreshTokenHash = hashRefreshToken(refreshToken);

      // Store refresh token hash
      await client.query(
        `UPDATE mobile_users SET refresh_token_hash = $1, updated_at = NOW() WHERE id = $2`,
        [refreshTokenHash, user.id],
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          mobile: user.mobile,
          name: user.name,
          role: user.role,
          status: user.status,
        },
      });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[verify-otp] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
