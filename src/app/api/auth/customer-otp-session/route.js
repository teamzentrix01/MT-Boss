import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { clearOtherAuthCookies, setAuthCookie, getJwtSecret } from '@/lib/auth';
import { requireActiveUser } from '@/lib/user-moderation';

/**
 * After client-side OTP login, persist the JWT in an httpOnly auth cookie for SSR routes.
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const token = String(body?.token || body?.accessToken || '').trim();
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token required.' }, { status: 400 });
    }

    let payload;
    try {
      payload = jwt.verify(token, getJwtSecret());
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid or expired token.' }, { status: 401 });
    }

    if (String(payload.role || '').toLowerCase() !== 'user') {
      return NextResponse.json({ success: false, error: 'Customer token required.' }, { status: 403 });
    }

    const fakeReq = { headers: new Headers({ authorization: `Bearer ${token}` }) };
    const { user, blocked } = await requireActiveUser(fakeReq);
    if (blocked || !user) {
      return NextResponse.json({ success: false, error: 'Account not active.' }, { status: 403 });
    }

    const response = NextResponse.json({ success: true, user });
    clearOtherAuthCookies(response, 'auth-token');
    return setAuthCookie(response, 'auth-token', token);
  } catch (error) {
    console.error('[customer-otp-session] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 });
  }
}
