import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { getDistinctDeliveryCities } from '@/lib/orders-history';

export async function GET(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const cities = await getDistinctDeliveryCities();
    return NextResponse.json({ success: true, cities });
  } catch (error) {
    console.error('GET /api/admin/orders/cities error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch distinct cities' }, { status: 500 });
  }
}
