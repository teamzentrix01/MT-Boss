import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
const ADMIN_COMMISSION_RATE = 0.15;

function getSupplier(req) {
  return requireRole(req, 'supplier');
}

// PUT — mark enquiry as fulfilled and record amount received
export async function PUT(req, { params }) {
  try {
    const decoded = getSupplier(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { amount_received, supplier_notes } = await req.json();

    if (!amount_received || isNaN(parseFloat(amount_received))) {
      return NextResponse.json({ success: false, error: 'Amount received is required' }, { status: 400 });
    }

    const amount = parseFloat(amount_received);
    const commission = Math.round(amount * ADMIN_COMMISSION_RATE * 100) / 100;

    const result = await pool.query(
      `UPDATE material_enquiries
       SET status = 'fulfilled',
           amount_received = $1,
           admin_commission = $2,
           supplier_notes = $3,
           fulfilled_at = NOW(),
           updated_at = NOW()
       WHERE id = $4 AND accepted_by_supplier_id = $5
       RETURNING *`,
      [amount, commission, supplier_notes || null, id, decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Enquiry not found or not yours' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order marked as fulfilled',
      data: result.rows[0],
      commission_due: commission,
    });
  } catch (err) {
    console.error('Fulfill enquiry error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
