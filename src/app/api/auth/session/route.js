import { NextResponse } from 'next/server';
import { BLOCKED_ACCOUNT_MESSAGE, requireActiveUser } from '@/lib/user-moderation';

export async function GET(req) {
  const { user, blocked } = await requireActiveUser(req);
  if (blocked) {
    const response = NextResponse.json({ success: false, error: BLOCKED_ACCOUNT_MESSAGE }, { status: 403 });
    response.cookies.set('auth-token', '', { httpOnly: true, path: '/', maxAge: 0 });
    return response;
  }
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}
