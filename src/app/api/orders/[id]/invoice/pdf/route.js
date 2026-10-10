import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { generateOrderInvoicePdf, getOrderForInvoiceRequest } from '@/lib/orders-history';

function resolveInvoiceActor(req) {
  for (const role of ['admin', 'user']) {
    const account = requireRole(req, role);
    if (account) return { ...account, role };
  }
  return null;
}

export async function GET(req, { params }) {
  try {
    const actor = resolveInvoiceActor(req);
    if (!actor) return unauthorized();

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const disposition = searchParams.get('disposition') === 'attachment' ? 'attachment' : 'inline';

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Query parameter type is required (shop_order or service_booking).' },
        { status: 400 }
      );
    }

    let result;
    try {
      result = await getOrderForInvoiceRequest(id, type, actor);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: err.message || 'Invalid request' },
        { status: 400 }
      );
    }

    if (result?.forbidden) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    if (!result) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const pdfBuffer = await generateOrderInvoicePdf(result.order);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="invoice-${result.order.order_id || id}.pdf"`,
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
