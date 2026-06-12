import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || process.env.JWT_SECRET || 'fallback-secret';

export function getBearerToken(req) {
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export function verifyBearer(req) {
  const token = getBearerToken(req);
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function requireRole(req, role) {
  const user = verifyBearer(req);
  if (!user || user.role !== role) return null;
  return user;
}

export function randomPassword(length = 12) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
