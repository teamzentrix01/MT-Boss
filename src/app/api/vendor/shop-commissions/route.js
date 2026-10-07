import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getVendorOwnCommissionSummary } from '@/lib/shop-commissions';

export async function GET(req) {
  try {
    const decoded = requireRole(req, 'vendor');
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, error: 'Vendor authentication required' },
        { status: 401 }
      );
    }

    const data = await getVendorOwnCommissionSummary(decoded.id);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error('Error fetching vendor own commission summary:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch vendor commissions' },
      { status: 500 }
    );
  }
}
