/**
 * Mobile OTP authentication utilities.
 * Separate from the existing web auth.js to avoid conflicts.
 */

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// ─── Secrets ────────────────────────────────────────────────────────────────

function getAccessSecret() {
  const s = process.env.ACCESS_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV !== 'production') return 'dev-access-secret-change-me';
  throw new Error('ACCESS_SECRET is required in production');
}

function getRefreshSecret() {
  const s = process.env.REFRESH_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV !== 'production') return 'dev-refresh-secret-change-me';
  throw new Error('REFRESH_SECRET is required in production');
}

function getOtpSecret() {
  const s = process.env.OTP_SECRET;
  if (s) return s;
  // Fall back to existing JWT_SECRET so existing OTP infrastructure is compatible
  return process.env.JWT_SECRET || 'dev-otp-secret-change-me';
}

// ─── OTP hashing ────────────────────────────────────────────────────────────

/** Hash a 6-digit OTP with HMAC-SHA256 */
export function hashMobileOtp(otp) {
  return crypto
    .createHmac('sha256', getOtpSecret())
    .update(String(otp).trim())
    .digest('hex');
}

/** Timing-safe OTP hash comparison */
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

/** Generate a cryptographically random 6-digit OTP */
export function generateSecureOtp() {
  return String(crypto.randomInt(100000, 999999));
}

// ─── JWT tokens ─────────────────────────────────────────────────────────────

/** Generate a 15-minute access token */
export function generateAccessToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      userId: user.id,
      mobile: user.mobile,
      role: user.role,
      type: 'access',
    },
    getAccessSecret(),
    { expiresIn: '15m' },
  );
}

/** Generate a 30-day refresh token with a unique jti */
export function generateRefreshToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      userId: user.id,
      mobile: user.mobile,
      role: user.role,
      type: 'refresh',
      jti: crypto.randomUUID(),
    },
    getRefreshSecret(),
    { expiresIn: '30d' },
  );
}

/** Hash a refresh token for storage (SHA-256) */
export function hashRefreshToken(refreshToken) {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
}

// ─── requireMobileAuth middleware ────────────────────────────────────────────

/**
 * App Router-compatible auth guard for mobile API routes.
 * Returns { user } on success or NextResponse 401/403 on failure.
 * @param {Request} req
 * @param {string[]} [allowedRoles]
 * @returns {Promise<{ user: object } | NextResponse>}
 */
export async function requireMobileAuth(req, allowedRoles) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';

  if (!token || token === 'null' || token === 'undefined') {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  let payload;
  try {
    payload = jwt.verify(token, getAccessSecret());
  } catch (err) {
    const msg = err?.name === 'TokenExpiredError' ? 'Session expired' : 'Invalid token';
    return NextResponse.json({ success: false, error: msg }, { status: 401 });
  }

  if (payload.type !== 'access') {
    return NextResponse.json({ success: false, error: 'Invalid token type' }, { status: 401 });
  }

  const result = await pool.query(
    `SELECT id, mobile, name, role, status FROM mobile_users WHERE id = $1`,
    [payload.userId],
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 });
  }

  const user = result.rows[0];

  if (user.status === 'blocked') {
    return NextResponse.json({ success: false, error: 'Account blocked. Contact support.' }, { status: 403 });
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return NextResponse.json({ success: false, error: 'Forbidden: insufficient role' }, { status: 403 });
  }

  return { user };
}
