/**
 * Shared post-OTP session issuance for web + mobile.
 * OTP itself is verified via Twilio before these helpers run.
 */

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { setAuthCookie, clearOtherAuthCookies } from '@/lib/auth';
import {
  resolvePartnerByMobile,
  signPartnerAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  upsertMobileUserSession,
  ensureMobileUsersEntityColumn,
  signMobileSignupToken,
  VALID_MOBILE_ROLES,
} from '@/lib/mobile-auth';
import { createInitializationGuard } from '@/lib/api-utils';

export const ensureMobileUsersSchema = createInitializationGuard(async () => {
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
}, 24 * 60 * 60 * 1000, 'mobile_users_schema_otp');

const ROLE_COOKIE_MAP = {
  agent: 'agent-auth-token',
  franchise: 'franchise-auth-token',
  vendor: 'vendor-auth-token',
  supplier: 'supplier-auth-token',
  user: 'auth-token',
};

/**
 * After Twilio OTP success: resolve partner, issue JWT + refresh, set cookies.
 * @param {{ mobileDigits: string, role: string, createIfMissing?: boolean }} opts
 */
export async function issueSessionAfterOtp({ mobileDigits, role, createIfMissing = false }) {
  await ensureMobileUsersSchema();

  if (!VALID_MOBILE_ROLES.includes(role)) {
    return {
      response: NextResponse.json(
        { success: false, error: `Invalid role. Must be one of: ${VALID_MOBILE_ROLES.join(', ')}.` },
        { status: 400 },
      ),
    };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const partner = await resolvePartnerByMobile(role, mobileDigits, { createIfMissing });

    if (!partner.ok) {
      await client.query('COMMIT');
      if (role === 'user' && partner.code === 'NEEDS_SIGNUP') {
        return {
          response: NextResponse.json({
            success: true,
            verified: true,
            needsSignup: true,
            mobile: mobileDigits,
            phone: `+91${mobileDigits}`,
            mobileSignupToken: signMobileSignupToken(mobileDigits),
            message: partner.error,
          }),
        };
      }
      return {
        response: NextResponse.json(
          { success: false, error: partner.error, code: partner.code || null },
          { status: partner.status },
        ),
      };
    }

    let mobileUser;
    try {
      mobileUser = await upsertMobileUserSession(client, {
        mobile: mobileDigits,
        role,
        entityId: partner.entity.id,
        name: partner.profile.name,
        status: 'active',
      });
    } catch (upsertErr) {
      await client.query('ROLLBACK');
      return {
        response: NextResponse.json(
          {
            success: false,
            error: upsertErr.message || 'Unable to create session.',
            code: upsertErr.code || null,
          },
          { status: upsertErr.status || 403 },
        ),
      };
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
      verified: true,
      token: accessToken,
      accessToken,
      refreshToken,
      user,
      [role]: { ...partner.entity, role, password_hash: undefined },
    });

    const cookieName = ROLE_COOKIE_MAP[role] || 'auth-token';
    clearOtherAuthCookies(response, cookieName);
    setAuthCookie(response, cookieName, accessToken);

    return { response };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
