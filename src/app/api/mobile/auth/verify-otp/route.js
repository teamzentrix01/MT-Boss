import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import {
  verifyMobileOtp,
  resolvePartnerByMobile,
  signPartnerAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  upsertMobileUserSession,
  ensureMobileUsersEntityColumn,
  VALID_MOBILE_ROLES,
} from '@/lib/mobile-auth';
import { createInitializationGuard } from '@/lib/api-utils';

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const OTP_REGEX = /^\d{6}$/;
const MAX_OTP_ATTEMPTS = 5;

const ensureSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.mobile_users (
      id SERIAL PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL UNIQUE,
      name VARCHAR(255),
      role VARCHAR(20) NOT NULL DEFAULT 'vendor' CHECK (role IN ('agent','vendor','supplier','user')),
      status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','blocked')),
      refresh_token_hash TEXT,
      entity_id INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_mobile_users_mobile ON public.mobile_users(mobile)`);
  await ensureMobileUsersEntityColumn();
  await pool.query(`
    DO $$ BEGIN
      ALTER TABLE mobile_users DROP CONSTRAINT IF EXISTS mobile_users_role_check;
    EXCEPTION WHEN undefined_object THEN NULL;
    END $$;
  `);
  await pool.query(`
    ALTER TABLE mobile_users
      ADD CONSTRAINT mobile_users_role_check
      CHECK (role IN ('agent','vendor','supplier','user'))
  `).catch(() => {});
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

    if (!MOBILE_REGEX.test(mobile)) {
      return NextResponse.json({ success: false, error: 'Invalid mobile number.' }, { status: 400 });
    }
    if (!OTP_REGEX.test(otp)) {
      return NextResponse.json({ success: false, error: 'OTP must be 6 digits.' }, { status: 400 });
    }
    if (!VALID_MOBILE_ROLES.includes(role)) {
      return NextResponse.json(
        { success: false, error: `Invalid role. Must be one of: ${VALID_MOBILE_ROLES.join(', ')}.` },
        { status: 400 },
      );
    }

    // Resolve existing business account BEFORE consuming OTP attempts for role/account errors
    const partner = await resolvePartnerByMobile(role, mobile);
    if (!partner.ok) {
      return NextResponse.json(
        { success: false, error: partner.error, code: partner.code || null },
        { status: partner.status },
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

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
        return NextResponse.json(
          { success: false, error: 'No valid OTP found. Please request a new one.' },
          { status: 400 },
        );
      }

      const otpRecord = otpResult.rows[0];

      if (new Date() > new Date(otpRecord.valid_till)) {
        await client.query(`UPDATE mobile_otps SET used = TRUE WHERE id = $1`, [otpRecord.id]);
        await client.query('COMMIT');
        return NextResponse.json(
          { success: false, error: 'OTP has expired. Please request a new one.' },
          { status: 400 },
        );
      }

      if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
        await client.query(`UPDATE mobile_otps SET used = TRUE WHERE id = $1`, [otpRecord.id]);
        await client.query('COMMIT');
        return NextResponse.json(
          { success: false, error: 'Maximum OTP attempts exceeded. Request a new OTP.' },
          { status: 400 },
        );
      }

      await client.query(`UPDATE mobile_otps SET attempts = attempts + 1 WHERE id = $1`, [otpRecord.id]);

      if (!verifyMobileOtp(otp, otpRecord.otp_hash)) {
        const remaining = MAX_OTP_ATTEMPTS - (otpRecord.attempts + 1);
        await client.query('COMMIT');
        return NextResponse.json(
          {
            success: false,
            error: `Incorrect OTP. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'Request a new OTP.'}`,
          },
          { status: 400 },
        );
      }

      await client.query(`UPDATE mobile_otps SET used = TRUE WHERE id = $1`, [otpRecord.id]);

      let mobileUser;
      try {
        mobileUser = await upsertMobileUserSession(client, {
          mobile,
          role,
          entityId: partner.entity.id,
          name: partner.profile.name,
          status: 'active',
        });
      } catch (upsertErr) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: upsertErr.message || 'Unable to create session.', code: upsertErr.code || null },
          { status: upsertErr.status || 403 },
        );
      }

      const accessToken = signPartnerAccessToken(role, partner.entity);
      const refreshToken = generateRefreshToken(mobileUser);
      const refreshTokenHash = hashRefreshToken(refreshToken);

      await client.query(
        `UPDATE mobile_users SET refresh_token_hash = $1, updated_at = NOW() WHERE id = $2`,
        [refreshTokenHash, mobileUser.id],
      );

      // Best-effort last_login bump
      if (role === 'agent') {
        await client.query(`UPDATE agents SET last_login_at = NOW() WHERE id = $1`, [partner.entity.id]).catch(() => {});
      } else if (role === 'supplier') {
        await client.query(`UPDATE suppliers SET last_login_at = NOW() WHERE id = $1`, [partner.entity.id]).catch(() => {});
      } else if (role === 'user') {
        await client.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [partner.entity.id]).catch(() => {});
      }

      await client.query('COMMIT');

      const user = {
        id: partner.profile.id,
        mobile: partner.profile.mobile,
        name: partner.profile.name,
        email: partner.profile.email,
        role: partner.profile.role,
        status: partner.profile.status,
        phone: partner.profile.phone,
      };

      return NextResponse.json({
        success: true,
        // Compatible with existing mobile + email login clients
        token: accessToken,
        accessToken,
        refreshToken,
        user,
        [role]: { ...partner.entity, role, password_hash: undefined },
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
