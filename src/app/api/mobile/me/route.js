import { NextResponse } from 'next/server';
import { requireMobileAuth } from '@/lib/mobile-auth';

export async function GET(req) {
  const authResult = await requireMobileAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      mobile: user.mobile,
      name: user.name,
      email: user.email || null,
      role: user.role,
      status: user.status,
      phone: user.phone || user.mobile,
    },
  });
}
