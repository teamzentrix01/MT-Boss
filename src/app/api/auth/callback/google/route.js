import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { getJwtSecret, setAuthCookie } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function appUrl(req) {
  const configured = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || '').trim();
  if (configured && !configured.includes('localhost')) {
    return configured.replace(/\/$/, '');
  }

  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  return host ? `${proto}://${host}` : new URL(req.url).origin;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const baseUrl = appUrl(req);

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_failed`);
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${baseUrl}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenRes.json();

    // Get user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const googleUser = await userRes.json();

    // Upsert user in DB
    const result = await pool.query(
      `INSERT INTO users (email, name, password)
       VALUES ($1, $2, '')
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, email, name`,
      [googleUser.email, googleUser.name]
    );

    const user = result.rows[0];
    const role = ADMIN_EMAIL && user.email === ADMIN_EMAIL ? 'admin' : 'user';
    const redirectTo = role === 'admin' ? '/dashboard' : '/userdashboard';

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    const response = NextResponse.redirect(
      `${baseUrl}/auth/success?user=${encodeURIComponent(JSON.stringify({ ...user, role }))}&redirect=${encodeURIComponent(redirectTo)}`
    );
    return setAuthCookie(response, 'auth-token', token);
  } catch (err) {
    console.error('Google OAuth error:', err);
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_failed`);
  }
}
