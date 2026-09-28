import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { updateAdminOrderStatus } from '@/lib/orders-history';

export async function PATCH(req, { params }) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const { id } = await params;
    const body = await req.json();
    const { status, type = 'shop_order', notes = '' } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const updated = await updateAdminOrderStatus({
      orderId: id,
      type,
      newStatus: status,
      notes,
      adminUser: admin,
    });

    return NextResponse.json({
      success: true,
      message: `Order status successfully updated to ${updated.newStatus}`,
      data: updated,
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update order status' },
      { status: 400 }
    );
  }
}
