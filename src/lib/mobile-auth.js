/**
 * Mobile OTP authentication utilities.
 * Issues the same JWT_SECRET partner tokens used by email/password login,
 * so existing vendor/agent/supplier APIs accept OTP sessions.
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getJwtSecret } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin-email';
import { signAgentToken } from '@/lib/agent-auth';
import { normalizePhone } from '@/lib/validation';
import { BLOCKED_ACCOUNT_MESSAGE, ensureUserModerationSchema } from '@/lib/user-moderation';
import { ensureFranchiseAccessColumns } from '@/lib/franchise-access';
import { normalizeFranchisePermissions } from '@/lib/franchise-permissions';

export const VALID_MOBILE_ROLES = ['agent', 'vendor', 'supplier', 'user', 'franchise'];

// ─── Secrets ────────────────────────────────────────────────────────────────

export function getRefreshSecret() {
  const s = process.env.REFRESH_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV !== 'production') return 'dev-refresh-secret-change-me';
  throw new Error('REFRESH_SECRET is required in production');
}

function getOtpSecret() {
  const s = process.env.OTP_SECRET;
  if (s) return s;
  return process.env.JWT_SECRET || 'dev-otp-secret-change-me';
}

// ─── OTP hashing ────────────────────────────────────────────────────────────

export function hashMobileOtp(otp) {
  return crypto
    .createHmac('sha256', getOtpSecret())
    .update(String(otp).trim())
    .digest('hex');
}

export function verifyMobileOtp(otp, storedHash) {
  if (!otp || !storedHash) return false;
  const suppliedHash = hashMobileOtp(otp);
  if (storedHash.length !== suppliedHash.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(storedHash, 'hex'),
      Buffer.from(suppliedHash, 'hex'),
    );
  } catch {
    return false;
  }
}

export function generateSecureOtp() {
  return String(crypto.randomInt(100000, 999999));
}

// ─── Phone matching ─────────────────────────────────────────────────────────

const PHONE_MATCH_SQL = `RIGHT(regexp_replace(COALESCE(phone, ''), '\\D', '', 'g'), 10) = $1`;

/**
 * Resolve an existing approved partner account by mobile + role.
 * Does not create accounts — OTP login is only for registered partners.
 * @returns {{ ok: true, entity: object, profile: object } | { ok: false, status: number, error: string, code?: string }}
 */
async function resolveCustomerByMobile(mobile, { createIfMissing = false } = {}) {
  await ensureUserModerationSchema();
  const result = await pool.query(
    `SELECT id, email, name, phone, is_blocked
       FROM users
      WHERE ${PHONE_MATCH_SQL}
      ORDER BY id DESC
      LIMIT 1`,
    [mobile],
  );

  let user = result.rows[0];
  if (!user) {
    if (!createIfMissing) {
      return {
        ok: false,
        status: 404,
        code: 'NEEDS_SIGNUP',
        error: 'No account found for this mobile number. Please create an account.',
      };
    }
    const email = `m${mobile}@otp.mtboss.local`;
    const emailTaken = await pool.query(`SELECT id FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM($1)) LIMIT 1`, [email]);
    if (emailTaken.rows.length > 0) {
      return {
        ok: false,
        status: 409,
        code: 'PHONE_EMAIL_CONFLICT',
        error: 'This mobile number could not be linked. Please contact support.',
      };
    }
    const passwordHash = await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 10);
    const inserted = await pool.query(
      `INSERT INTO users (name, email, password, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, phone, is_blocked`,
      [`User ${mobile.slice(-4)}`, email, passwordHash, mobile],
    );
    user = inserted.rows[0];
  }

  if (user.is_blocked) {
    return { ok: false, status: 403, code: 'BLOCKED', error: BLOCKED_ACCOUNT_MESSAGE };
  }
  if (isAdminEmail(user.email)) {
    return {
      ok: false,
      status: 403,
      code: 'ADMIN_USE_PASSWORD',
      error: 'Admin accounts must sign in with email and password on Admin login.',
    };
  }

  return {
    ok: true,
    entity: user,
    profile: {
      id: user.id,
      mobile,
      name: user.name,
      email: user.email,
      role: 'user',
      status: 'active',
      phone: user.phone || mobile,
    },
  };
}

export async function resolvePartnerByMobile(role, mobileRaw, options = {}) {
  const mobile = normalizePhone(mobileRaw);
  if (!VALID_MOBILE_ROLES.includes(role)) {
    return { ok: false, status: 400, error: `Invalid role. Must be one of: ${VALID_MOBILE_ROLES.join(', ')}.` };
  }
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return { ok: false, status: 400, error: 'Invalid mobile number.' };
  }

  if (role === 'user') {
    return resolveCustomerByMobile(mobile, options);
  }

  if (role === 'agent') {
    let result;
    try {
      result = await pool.query(
        `SELECT id, name, email, phone, city, state, occupation, agent_type,
                status, login_enabled, auth_version,
                COALESCE(has_project_management_access, FALSE) AS has_project_management_access,
                COALESCE(is_manager, FALSE) AS is_manager, manager_id
           FROM agents
          WHERE ${PHONE_MATCH_SQL}
          ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC, id DESC
          LIMIT 1`,
        [mobile],
      );
    } catch (queryErr) {
      if (!String(queryErr?.message || '').toLowerCase().includes('has_project_management_access')
        && !String(queryErr?.message || '').toLowerCase().includes('is_manager')) {
        throw queryErr;
      }
      result = await pool.query(
        `SELECT id, name, email, phone, city, state, occupation, agent_type,
                status, login_enabled, auth_version,
                FALSE AS has_project_management_access,
                FALSE AS is_manager, NULL::INTEGER AS manager_id
           FROM agents
          WHERE ${PHONE_MATCH_SQL}
          ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC, id DESC
          LIMIT 1`,
        [mobile],
      );
    }
    const agent = result.rows[0];
    if (!agent) {
      return {
        ok: false,
        status: 404,
        code: 'NOT_FOUND',
        error: 'No agent account found for this mobile number. Contact admin to provision your account.',
      };
    }
    if (agent.status !== 'Approved') {
      return {
        ok: false,
        status: 403,
        code: 'PENDING_APPROVAL',
        error: agent.status === 'Rejected'
          ? 'Your agent application was not approved. Please contact support.'
          : 'Your agent application is under review. Please wait for admin approval.',
      };
    }
    if (!agent.login_enabled) {
      return {
        ok: false,
        status: 403,
        code: 'LOGIN_DISABLED',
        error: 'Agent login is not enabled for this account. Please contact admin.',
      };
    }
    return {
      ok: true,
      entity: agent,
      profile: {
        id: agent.id,
        mobile,
        name: agent.name,
        email: agent.email,
        role: 'agent',
        status: 'active',
        phone: agent.phone,
      },
    };
  }

  if (role === 'vendor') {
    let result;
    try {
      result = await pool.query(
        `SELECT id, email,
                COALESCE(shop_name, business_name, vendor_name, email) AS shop_name,
                business_name, vendor_name, phone, city, state,
                status, verification_status, is_approved, package_status
           FROM vendors
          WHERE ${PHONE_MATCH_SQL}
          ORDER BY (COALESCE(is_approved, FALSE) IS TRUE) DESC, id DESC
          LIMIT 1`,
        [mobile],
      );
    } catch {
      // Older schemas may miss vendor_name / business_name
      result = await pool.query(
        `SELECT id, email,
                COALESCE(shop_name, email) AS shop_name,
                phone, city, state,
                status, verification_status, is_approved, package_status
           FROM vendors
          WHERE ${PHONE_MATCH_SQL}
          ORDER BY (COALESCE(is_approved, FALSE) IS TRUE) DESC, id DESC
          LIMIT 1`,
        [mobile],
      );
    }
    const vendor = result.rows[0];
    if (!vendor) {
      return {
        ok: false,
        status: 404,
        code: 'NOT_FOUND',
        error: 'No vendor account found for this mobile number. Complete vendor registration first.',
      };
    }
    if (!vendor.is_approved && vendor.verification_status === 'payment_pending') {
      return {
        ok: false,
        status: 403,
        code: 'PAYMENT_PENDING',
        error: 'Your payment was not completed. Complete payment from vendor registration, or contact admin.',
      };
    }
    if (!vendor.is_approved) {
      return {
        ok: false,
        status: 403,
        code: 'PENDING_APPROVAL',
        error: 'Your vendor account is pending admin approval.',
      };
    }
    if (vendor.status === 'inactive') {
      return {
        ok: false,
        status: 403,
        code: 'ACCOUNT_INACTIVE',
        error: 'Your vendor account is inactive. Please contact support.',
      };
    }
    const name = vendor.shop_name || vendor.business_name || vendor.vendor_name || vendor.email;
    return {
      ok: true,
      entity: vendor,
      profile: {
        id: vendor.id,
        mobile,
        name,
        email: vendor.email,
        role: 'vendor',
        status: 'active',
        phone: vendor.phone,
      },
    };
  }

  if (role === 'franchise') {
    await ensureFranchiseAccessColumns();
    const result = await pool.query(
      `SELECT id, name, email, phone, city, state, status, login_enabled, permissions
         FROM franchises
        WHERE ${PHONE_MATCH_SQL}
        ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC, id DESC
        LIMIT 1`,
      [mobile],
    );
    const franchise = result.rows[0];
    if (!franchise) {
      return {
        ok: false,
        status: 404,
        code: 'NOT_FOUND',
        error: 'No franchise account found for this mobile number. Contact admin after approval.',
      };
    }
    if (franchise.status !== 'Approved') {
      return {
        ok: false,
        status: 403,
        code: 'PENDING_APPROVAL',
        error: 'Your franchise application is not approved yet. Please contact admin.',
      };
    }
    if (!franchise.login_enabled) {
      return {
        ok: false,
        status: 403,
        code: 'LOGIN_DISABLED',
        error: 'Franchise login is not enabled. Contact admin.',
      };
    }
    const permissions = normalizeFranchisePermissions(franchise.permissions);
    return {
      ok: true,
      entity: { ...franchise, permissions },
      profile: {
        id: franchise.id,
        mobile,
        name: franchise.name,
        email: franchise.email,
        role: 'franchise',
        status: 'active',
        phone: franchise.phone,
      },
    };
  }

  // supplier
  const result = await pool.query(
    `SELECT id, email, shop_name, phone, city, state, status, is_active, rejection_reason
       FROM suppliers
      WHERE ${PHONE_MATCH_SQL}
      ORDER BY (status = 'approved') DESC, id DESC
      LIMIT 1`,
    [mobile],
  );
  const supplier = result.rows[0];
  if (!supplier) {
    return {
      ok: false,
      status: 404,
      code: 'NOT_FOUND',
      error: 'No supplier account found for this mobile number. Complete supplier registration first.',
    };
  }
  if (supplier.status === 'pending') {
    return {
      ok: false,
      status: 403,
      code: 'PENDING_APPROVAL',
      error: 'Your supplier account is pending admin approval.',
    };
  }
  if (supplier.status === 'rejected') {
    return {
      ok: false,
      status: 403,
      code: 'REJECTED',
      error: supplier.rejection_reason
        ? `Your supplier account was not approved: ${supplier.rejection_reason}`
        : 'Your supplier account was not approved.',
    };
  }
  if (supplier.status !== 'approved' || supplier.is_active === false) {
    return {
      ok: false,
      status: 403,
      code: 'ACCOUNT_INACTIVE',
      error: 'Your supplier account is inactive. Please contact support.',
    };
  }
  return {
    ok: true,
    entity: supplier,
    profile: {
      id: supplier.id,
      mobile,
      name: supplier.shop_name || supplier.email,
      email: supplier.email,
      role: 'supplier',
      status: 'active',
      phone: supplier.phone,
    },
  };
}

/**
 * Issue the same access JWT used by email/password partner login.
 */
export function signPartnerAccessToken(role, entity) {
  if (role === 'agent') {
    return signAgentToken(entity);
  }
  if (role === 'vendor') {
    return jwt.sign(
      { id: entity.id, email: entity.email, role: 'vendor' },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRY || '7d' },
    );
  }
  if (role === 'user') {
    return jwt.sign(
      { id: entity.id, email: entity.email, role: 'user' },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRY || '7d' },
    );
  }
  if (role === 'franchise') {
    return jwt.sign(
      {
        id: entity.id,
        email: entity.email,
        name: entity.name,
        city: entity.city,
        role: 'franchise',
      },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRY || '7d' },
    );
  }
  return jwt.sign(
    {
      id: entity.id,
      email: entity.email,
      shop_name: entity.shop_name,
      role: 'supplier',
    },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRY || '7d' },
  );
}

/** Refresh token bound to mobile_users row (not the business entity id). */
export function generateRefreshToken(mobileUser) {
  return jwt.sign(
    {
      sub: String(mobileUser.id),
      userId: mobileUser.id,
      mobile: mobileUser.mobile,
      role: mobileUser.role,
      entityId: mobileUser.entity_id,
      type: 'refresh',
      jti: crypto.randomUUID(),
    },
    getRefreshSecret(),
    { expiresIn: '30d' },
  );
}

export function hashRefreshToken(refreshToken) {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
}

/**
 * Ensure mobile_users has entity_id linkage column.
 */
export async function ensureMobileUsersEntityColumn(client = pool) {
  await client.query(`
    ALTER TABLE mobile_users
      ADD COLUMN IF NOT EXISTS entity_id INTEGER
  `);
}

/**
 * Upsert mobile_users linked to the business entity for refresh-token tracking.
 */
export async function upsertMobileUserSession(client, { mobile, role, entityId, name, status = 'active' }) {
  await ensureMobileUsersEntityColumn(client);
  const existing = await client.query(
    `SELECT id, mobile, name, role, status, entity_id FROM mobile_users WHERE mobile = $1`,
    [mobile],
  );

  if (existing.rows.length === 0) {
    const inserted = await client.query(
      `INSERT INTO mobile_users (mobile, name, role, status, entity_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, mobile, name, role, status, entity_id`,
      [mobile, name || null, role, status, entityId],
    );
    return inserted.rows[0];
  }

  const row = existing.rows[0];
  if (row.status === 'blocked') {
    const err = new Error('Account blocked. Contact support.');
    err.status = 403;
    err.code = 'BLOCKED';
    throw err;
  }
  if (row.role !== role) {
    const err = new Error(`This mobile number is registered as ${row.role}. Please select the correct role.`);
    err.status = 403;
    err.code = 'ROLE_MISMATCH';
    throw err;
  }

  const updated = await client.query(
    `UPDATE mobile_users
        SET name = COALESCE($1, name),
            entity_id = $2,
            status = $3,
            updated_at = NOW()
      WHERE id = $4
      RETURNING id, mobile, name, role, status, entity_id`,
    [name || null, entityId, status, row.id],
  );
  return updated.rows[0];
}

/**
 * Reload partner entity for refresh / me using linked mobile_users row.
 */
function getMobileSignupSecret() {
  const s = process.env.MOBILE_SIGNUP_SECRET || process.env.OTP_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV !== 'production') return 'dev-mobile-signup-secret';
  return process.env.JWT_SECRET || 'dev-mobile-signup-secret';
}

/** Short-lived proof that a mobile number passed OTP verification (web signup after OTP). */
export function signMobileSignupToken(mobile) {
  const normalized = normalizePhone(mobile);
  return jwt.sign(
    { type: 'mobile_signup', mobile: normalized, role: 'user' },
    getMobileSignupSecret(),
    { expiresIn: '20m' },
  );
}

export function verifyMobileSignupToken(token) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getMobileSignupSecret());
    if (payload?.type !== 'mobile_signup' || !payload.mobile) return null;
    return { mobile: normalizePhone(payload.mobile), role: 'user' };
  } catch {
    return null;
  }
}

const MAX_OTP_ATTEMPTS = 5;

/**
 * Verify and consume a mobile OTP inside an open transaction (client must BEGIN).
 * @returns {Promise<{ ok: true } | { ok: false, status: number, error: string }>}
 */
export async function verifyAndConsumeMobileOtp(client, mobile, otp) {
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
    return { ok: false, status: 400, error: 'No valid OTP found. Please request a new one.' };
  }

  const otpRecord = otpResult.rows[0];

  if (new Date() > new Date(otpRecord.valid_till)) {
    await client.query(`UPDATE mobile_otps SET used = TRUE WHERE id = $1`, [otpRecord.id]);
    return { ok: false, status: 400, error: 'OTP has expired. Please request a new one.' };
  }

  if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
    await client.query(`UPDATE mobile_otps SET used = TRUE WHERE id = $1`, [otpRecord.id]);
    return { ok: false, status: 400, error: 'Maximum OTP attempts exceeded. Request a new OTP.' };
  }

  await client.query(`UPDATE mobile_otps SET attempts = attempts + 1 WHERE id = $1`, [otpRecord.id]);

  if (!verifyMobileOtp(otp, otpRecord.otp_hash)) {
    const remaining = MAX_OTP_ATTEMPTS - (otpRecord.attempts + 1);
    return {
      ok: false,
      status: 400,
      error: `Incorrect OTP. ${remaining > 0 ? `${remaining} attempt(s) remaining.` : 'Request a new OTP.'}`,
    };
  }

  await client.query(`UPDATE mobile_otps SET used = TRUE WHERE id = $1`, [otpRecord.id]);
  return { ok: true };
}

export async function loadPartnerEntity(role, entityId) {
  if (!entityId) return null;
  if (role === 'user') {
    await ensureUserModerationSchema();
    const result = await pool.query(
      `SELECT id, email, name, phone, is_blocked FROM users WHERE id = $1`,
      [entityId],
    );
    return result.rows[0] || null;
  }
  if (role === 'agent') {
    const result = await pool.query(
      `SELECT id, name, email, phone, city, state, occupation, agent_type,
              status, login_enabled, auth_version,
              COALESCE(has_project_management_access, FALSE) AS has_project_management_access,
              COALESCE(is_manager, FALSE) AS is_manager, manager_id
         FROM agents WHERE id = $1`,
      [entityId],
    );
    return result.rows[0] || null;
  }
  if (role === 'vendor') {
    const result = await pool.query(
      `SELECT id, email, shop_name, business_name, vendor_name, phone, city, state,
              status, verification_status, is_approved, package_status
         FROM vendors WHERE id = $1`,
      [entityId],
    );
    return result.rows[0] || null;
  }
  if (role === 'franchise') {
    await ensureFranchiseAccessColumns();
    const result = await pool.query(
      `SELECT id, name, email, phone, city, state, status, login_enabled, permissions
         FROM franchises WHERE id = $1`,
      [entityId],
    );
    const row = result.rows[0];
    if (!row) return null;
    return { ...row, permissions: normalizeFranchisePermissions(row.permissions) };
  }
  const result = await pool.query(
    `SELECT id, email, shop_name, phone, city, state, status, is_active, rejection_reason
       FROM suppliers WHERE id = $1`,
    [entityId],
  );
  return result.rows[0] || null;
}

function partnerStillActive(role, entity) {
  if (!entity) return false;
  if (role === 'user') return !entity.is_blocked;
  if (role === 'agent') return entity.status === 'Approved' && entity.login_enabled;
  if (role === 'vendor') return Boolean(entity.is_approved) && entity.status !== 'inactive';
  if (role === 'franchise') return entity.status === 'Approved' && entity.login_enabled;
  return entity.status === 'approved' && entity.is_active !== false;
}

/**
 * Auth guard for /api/mobile/* routes.
 * Accepts partner JWT_SECRET tokens issued by OTP (or email login).
 */
export async function requireMobileAuth(req, allowedRoles) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';

  if (!token || token === 'null' || token === 'undefined') {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  let payload;
  try {
    payload = jwt.verify(token, getJwtSecret());
  } catch (err) {
    const msg = err?.name === 'TokenExpiredError' ? 'Session expired' : 'Invalid token';
    return NextResponse.json({ success: false, error: msg }, { status: 401 });
  }

  const role = String(payload.role || '').toLowerCase();
  if (!VALID_MOBILE_ROLES.includes(role)) {
    return NextResponse.json({ success: false, error: 'Invalid token role' }, { status: 401 });
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return NextResponse.json({ success: false, error: 'Forbidden: insufficient role' }, { status: 403 });
  }

  const entityId = payload.id;
  const entity = await loadPartnerEntity(role, entityId);
  if (!partnerStillActive(role, entity)) {
    return NextResponse.json({ success: false, error: 'Account not found or inactive' }, { status: 401 });
  }

  const mobile = normalizePhone(entity.phone) || '';
  const name = role === 'user' || role === 'agent' || role === 'franchise'
    ? entity.name
    : (entity.shop_name || entity.business_name || entity.vendor_name || entity.name || entity.email);

  return {
    user: {
      id: entity.id,
      mobile,
      name,
      email: entity.email,
      role,
      status: 'active',
      phone: entity.phone,
    },
  };
}

/** @deprecated kept for any callers expecting the old ACCESS_SECRET helper name */
export function generateAccessToken(user) {
  // Fallback shape — prefer signPartnerAccessToken with the real entity
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, mobile: user.mobile },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRY || '7d' },
  );
}
