import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import {
  resolvePartnerByMobile,
  signPartnerAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  upsertMobileUserSession,
  ensureMobileUsersEntityColumn,
  verifyAndConsumeMobileOtp,
  signMobileSignupToken,
  VALID_MOBILE_ROLES,
} from '@/lib/mobile-auth';
import { createInitializationGuard } from '@/lib/api-utils';
import { isOtpDevMode, verifyOtpViaMsg91 } from '@/lib/msg91';
import { setAuthCookie, clearOtherAuthCookies } from '@/lib/auth';

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const OTP_REGEX = /^\d{6}$/;

const ensureSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.mobile_users (
      id SERIAL PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL UNIQUE,
      name VARCHAR(255),
      role VARCHAR(20) NOT NULL DEFAULT 'vendor' CHECK (role IN ('agent','vendor','supplier','user','franchise')),
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
      CHECK (role IN ('agent','vendor','supplier','user','franchise'))
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
    const createIfMissing = body?.create_if_missing === true;

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

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const otpCheck = isOtpDevMode()
        ? await verifyAndConsumeMobileOtp(client, mobile, otp)
        : await verifyOtpViaMsg91(mobile, otp);
      if (!otpCheck.ok) {
        await client.query('COMMIT');
        return NextResponse.json({ success: false, error: otpCheck.error }, { status: otpCheck.status });
      }

      const partner = await resolvePartnerByMobile(role, mobile, { createIfMissing });

      if (!partner.ok) {
        await client.query('COMMIT');
        if (role === 'user' && partner.code === 'NEEDS_SIGNUP') {
          return NextResponse.json({
            success: true,
            needsSignup: true,
            mobile,
            mobileSignupToken: signMobileSignupToken(mobile),
            message: partner.error,
          });
        }
        return NextResponse.json(
          { success: false, error: partner.error, code: partner.code || null },
          { status: partner.status },
        );
      }

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

      if (role === 'agent') {
        await client.query(`UPDATE agents SET last_login_at = NOW() WHERE id = $1`, [partner.entity.id]).catch(() => {});
      } else if (role === 'supplier') {
        await client.query(`UPDATE suppliers SET last_login_at = NOW() WHERE id = $1`, [partner.entity.id]).catch(() => {});
      } else if (role === 'user') {
        await client.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [partner.entity.id]).catch(() => {});
      } else if (role === 'franchise') {
        await client.query(`UPDATE franchises SET last_login_at = NOW() WHERE id = $1`, [partner.entity.id]).catch(() => {});
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

      const response = NextResponse.json({
        success: true,
        token: accessToken,
        accessToken,
        refreshToken,
        user,
        [role]: { ...partner.entity, role, password_hash: undefined },
      });

      const roleCookieMap = {
        agent: 'agent-auth-token',
        franchise: 'franchise-auth-token',
        vendor: 'vendor-auth-token',
        supplier: 'supplier-auth-token',
        user: 'auth-token',
      };
      const cookieName = roleCookieMap[role] || 'auth-token';
      clearOtherAuthCookies(response, cookieName);
      setAuthCookie(response, cookieName, accessToken);

      return response;
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
