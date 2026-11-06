import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { clearOtherAuthCookies, getJwtSecret, setAuthCookie } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin-email';

export const dynamic = 'force-dynamic';

function readEnv(name, fallback = '') {
  const value = process.env[name];
  if (value == null || value === '') return fallback;
  // Trim BOM/CRLF/spaces that Windows editors often leave in .env values.
  return String(value).replace(/^\uFEFF/, '').trim();
}

const ADMIN_EMAIL =
  readEnv('ADMIN_EMAIL') ||
  (process.env.NODE_ENV !== 'production' ? 'admin@gmail.com' : '');
const ADMIN_PASSWORD =
  readEnv('ADMIN_PASSWORD') ||
  (process.env.NODE_ENV !== 'production' ? '123456' : '');

function matchesEnvAdmin(email, password) {
  if (!ADMIN_PASSWORD) return false;
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '').trim();
  if (!normalizedEmail || !normalizedPassword) return false;
  if (normalizedPassword !== ADMIN_PASSWORD) return false;
  if (ADMIN_EMAIL && normalizedEmail === ADMIN_EMAIL.toLowerCase()) return true;
  return isAdminEmail(normalizedEmail);
}

function issueAdminToken(email, name = 'Admin', id = 0) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const token = jwt.sign(
    { id, email: normalizedEmail, role: 'admin' },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
  const response = NextResponse.json({
    success: true,
    token,
    user: { id, email: normalizedEmail, name, role: 'admin' },
    redirectTo: '/dashboard',
  }, { status: 200 });
  clearOtherAuthCookies(response, 'auth-token');
  return setAuthCookie(response, 'auth-token', token);
}

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Env admin must succeed without importing/touching the database module.
    if (matchesEnvAdmin(normalizedEmail, password)) {
      return issueAdminToken(ADMIN_EMAIL || normalizedEmail);
    }

    // Lazy-load DB helpers only for customer/DB-backed accounts.
    const { isDatabaseConnectionError } = await import('@/lib/api-utils');
    const { BLOCKED_ACCOUNT_MESSAGE } = await import('@/lib/user-moderation');
    const {
      authLoginQuery,
      softAuthLoginQuery,
      touchUserLastLogin,
    } = await import('@/lib/auth-login-db');

    let userResult;
    try {
      userResult = await authLoginQuery(
        `SELECT id, email, password, name, is_blocked
           FROM users
          WHERE LOWER(email) = $1
          LIMIT 1`,
        [normalizedEmail]
      );
    } catch (error) {
      if (!String(error?.message || '').toLowerCase().includes('is_blocked')) throw error;
      userResult = await authLoginQuery(
        `SELECT id, email, password, name, FALSE AS is_blocked
           FROM users
          WHERE LOWER(email) = $1
          LIMIT 1`,
        [normalizedEmail]
      );
    }

    if (userResult.rows.length === 0) {
      const [vendorResult, agentResult] = await Promise.all([
        softAuthLoginQuery('SELECT id FROM vendors WHERE LOWER(email) = $1 LIMIT 1', [normalizedEmail]),
        softAuthLoginQuery(
          `SELECT id FROM agents
            WHERE LOWER(TRIM(email)) = $1
              AND status = 'Approved'
              AND login_enabled IS TRUE
            LIMIT 1`,
          [normalizedEmail]
        ),
      ]);

      if (vendorResult.rows.length > 0) {
        return NextResponse.json(
          { error: 'This email is registered as a vendor. Please use vendor login at /vendor/login' },
          { status: 401 }
        );
      }
      if (agentResult.rows.length > 0) {
        return NextResponse.json(
          { error: 'This email is registered as an agent. Please use Agent login at /agent/login' },
          { status: 401 }
        );
      }
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    if (user.is_blocked) {
      return NextResponse.json({ error: BLOCKED_ACCOUNT_MESSAGE }, { status: 403 });
    }

    const userRole = isAdminEmail(user.email) ? 'admin' : 'user';
    touchUserLastLogin(user.id);

    if (userRole === 'admin') {
      return issueAdminToken(user.email, user.name || 'Admin', user.id);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole },
      getJwtSecret(),
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    const response = NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: userRole },
      redirectTo: '/userdashboard',
    }, { status: 200 });
    clearOtherAuthCookies(response, 'auth-token');
    return setAuthCookie(response, 'auth-token', token);
  } catch (error) {
    console.error('Login error:', error);
    const message = String(error?.message || '');
    if (message.includes('Query timeout') || message.includes('login_timeout')) {
      return NextResponse.json(
        {
          error:
            'Database is slow or unreachable right now. For admin panel login use the exact ADMIN_EMAIL and ADMIN_PASSWORD from .env (no database needed).',
        },
        { status: 504 }
      );
    }
    try {
      const { isDatabaseConnectionError } = await import('@/lib/api-utils');
      if (isDatabaseConnectionError(error)) {
        return NextResponse.json(
          {
            error:
              'Database is temporarily unavailable. For admin panel login use the exact ADMIN_EMAIL and ADMIN_PASSWORD from .env.',
          },
          { status: 503 }
        );
      }
    } catch {
      /* ignore */
    }
    return NextResponse.json({ error: 'Server error occurred.' }, { status: 500 });
  }
}
