import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { getCustomerOrdersHistory } from '@/lib/orders-history';

export async function GET(req, { params }) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    const result = await getCustomerOrdersHistory(id, phone);

    return NextResponse.json({
      success: true,
      orders: result.orders,
      total_orders: result.total_orders,
      lifetime_spend: result.lifetime_spend,
      coupons_used: result.coupons_used,
      query_duration_ms: result.query_duration_ms,
    });
  } catch (err) {
    console.error('Error fetching customer orders history:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch customer orders' },
      { status: 500 }
    );
  }
}
