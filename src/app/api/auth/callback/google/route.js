import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_failed`);
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
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
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
    const role = user.email === 'admin@gmail.com' ? 'admin' : 'user';
    const redirectTo = role === 'admin' ? '/dashboard' : '/userdashboard';

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to a client page that stores token and redirects
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    return NextResponse.redirect(
      `${appUrl}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({ ...user, role }))}&redirect=${redirectTo}`
    );
  } catch (err) {
    console.error('Google OAuth error:', err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_failed`);
  }
}