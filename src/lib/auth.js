import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const DEV_JWT_SECRET = 'development-only-change-me';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV !== 'production') return DEV_JWT_SECRET;

  throw new Error('JWT_SECRET is required in production');
}

const ROLE_COOKIE_NAMES = {
  admin: 'auth-token',
  user: 'auth-token',
  vendor: 'vendor-auth-token',
  supplier: 'supplier-auth-token',
  franchise: 'franchise-auth-token',
  agent: 'agent-auth-token',
};

export function getBearerToken(req, role) {
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);

  const cookieName = ROLE_COOKIE_NAMES[role] || 'auth-token';
  const cookieToken = req.cookies?.get?.(cookieName)?.value;
  if (cookieToken) return cookieToken;

  return null;
}

export function verifyBearer(req, role) {
  const token = getBearerToken(req, role);
  if (!token) return null;

  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}

export function requireRole(req, role) {
  const user = verifyBearer(req, role);
  if (!user || user.role !== role) return null;
  return user;
}

export function requireAnyRole(req, roles) {
  for (const role of roles) {
    const user = requireRole(req, role);
    if (user) return user;
  }
  return null;
}

export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function setAuthCookie(response, name, token, maxAge = 60 * 60 * 24 * 7) {
  response.cookies.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
  return response;
}

export function randomPassword(length = 12) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
