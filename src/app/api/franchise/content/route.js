import { NextResponse } from 'next/server';
import { getFranchisePublicContent, invalidateFranchiseContentCache } from '@/lib/franchise-settings';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get('refresh') === '1') {
      invalidateFranchiseContentCache();
    }
    const content = await getFranchisePublicContent();
    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Franchise public content error:', error);
    return NextResponse.json(
      { success: false, error: 'Could not load franchise page content' },
      { status: 500 }
    );
  }
}

