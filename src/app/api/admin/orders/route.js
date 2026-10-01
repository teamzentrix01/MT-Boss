import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { getAdminOrders, formatDateDDMMYYYY, formatINR } from '@/lib/orders-history';

export async function GET(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const orderId = searchParams.get('order_id') || searchParams.get('search') || '';
    const customerName = searchParams.get('customer_name') || '';
    const phone = searchParams.get('phone') || '';
    const status = searchParams.get('status') || '';
    const city = searchParams.get('city') || '';
    const createdFrom = searchParams.get('created_from') || '';
    const createdTo = searchParams.get('created_to') || '';
    const deliveryFrom = searchParams.get('delivery_from') || '';
    const deliveryTo = searchParams.get('delivery_to') || '';
    const type = searchParams.get('type') || 'all';
    const isExport = searchParams.get('export') === 'csv';

    const result = await getAdminOrders({
      page,
      limit,
      orderId,
      customerName,
      phone,
      status,
      city,
      createdFrom,
      createdTo,
      deliveryFrom,
      deliveryTo,
      type,
      exportCsv: isExport,
    });

    if (isExport) {
      const csvHeader = [
        'Order / Booking ID',
        'Type',
        'Customer Name',
        'Mobile Number',
        'Customer Email',
        'Product / Service Summary',
        'Quantity',
        'Grand Total (INR)',
        'Created Date',
        'Delivery / Booking Date',
        'Delivery City',
        'Status',
        'Delivery Address',
        'Notes',
      ];

      const escapeCsvCell = (cell) => {
        if (cell === null || cell === undefined) return '""';
        const str = String(cell).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = result.orders.map((o) => [
        escapeCsvCell(o.order_id),
        escapeCsvCell(o.type_label || o.type),
        escapeCsvCell(o.customer_name),
        escapeCsvCell(o.customer_phone && o.customer_phone !== 'N/A' ? o.customer_phone : '—'),
        escapeCsvCell(o.customer_email),
        escapeCsvCell(o.product_name),
        escapeCsvCell(o.quantity_text),
        escapeCsvCell(o.grand_total !== null && o.grand_total !== undefined ? Number(o.grand_total).toFixed(2) : 'N/A'),
        escapeCsvCell(formatDateDDMMYYYY(o.created_at)),
        escapeCsvCell(formatDateDDMMYYYY(o.delivery_date)),
        escapeCsvCell(o.delivery_city),
        escapeCsvCell(o.status),
        escapeCsvCell(o.delivery_address),
        escapeCsvCell(o.notes),
      ]);

      const csvContent = [csvHeader.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

      return new Response(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="orders-history-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      orders: result.orders,
      summary: result.summary,
      pagination: result.pagination,
    });
  } catch (err) {
    console.error('Error fetching admin orders:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch orders history' },
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
