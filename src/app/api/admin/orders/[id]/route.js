import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { getAdminOrderById } from '@/lib/orders-history';

export async function GET(req, { params }) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const { id } = await params;
    const order = await getAdminOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error('Error fetching admin order details:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Deleting orders from this screen is strictly prohibited.' },
    { status: 405 }
  );
}
