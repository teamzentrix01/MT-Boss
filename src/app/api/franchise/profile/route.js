import { NextResponse } from 'next/server';
import { franchiseAccessResponse, getFranchiseAccess } from '@/lib/franchise-access';

export async function GET(req) {
  try {
    const access = await getFranchiseAccess(req);
    if (!access.allowed) return franchiseAccessResponse(access);

    return NextResponse.json({
      success: true,
      data: {
        ...access.franchise,
        role: 'franchise',
      },
    });
  } catch (error) {
    console.error('Franchise profile GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
