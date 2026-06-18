import { NextResponse } from 'next/server';

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
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${appUrl(req)}/api/auth/callback/google`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}
