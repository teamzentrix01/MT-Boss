import { NextResponse } from 'next/server';

const AUTH_COOKIES = [
  'auth-token',
  'vendor-auth-token',
  'supplier-auth-token',
  'franchise-auth-token',
  'agent-auth-token',
];

export async function POST() {
  const response = NextResponse.json({ success: true });

  for (const name of AUTH_COOKIES) {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  }

  return response;
}
