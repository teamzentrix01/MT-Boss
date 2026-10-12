import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { getAdminOrderById, generateOrderInvoicePdf } from '@/lib/orders-history';

export async function GET(req, { params }) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const orderType = type === 'shop_order' || type === 'service_booking' ? type : undefined;
    const order = await getAdminOrderById(id, orderType ? { type: orderType } : {});

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const pdfBuffer = await generateOrderInvoicePdf(order);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="invoice-${order.order_id || id}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    console.error('Error generating order invoice PDF:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
