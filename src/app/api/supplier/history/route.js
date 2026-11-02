import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(req) {
  try {
    const decoded = requireRole(req, 'supplier');
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    // Fetch fulfilled material enquiries (supplier's accepted & fulfilled orders)
    const enquiriesRes = await pool.query(
      `SELECT
         me.id,
         'enquiry' AS history_type,
         me.category_name AS product_name,
         me.material_name,
         me.quantity,
         me.unit,
         me.amount_received AS amount,
         me.admin_commission AS commission,
         me.selected_city AS city,
         me.user_name AS customer_name,
         me.user_phone AS customer_phone,
         me.fulfilled_at AS completed_at,
         me.created_at,
         me.status
       FROM material_enquiries me
       WHERE me.accepted_by_supplier_id = $1
         AND me.status = 'fulfilled'
       ORDER BY me.fulfilled_at DESC NULLS LAST
       LIMIT 100`,
      [decoded.id]
    );

    // Fetch shop product order commissions (from platform commission tracking)
    let shopCommissions = [];
    try {
      const commRes = await pool.query(
        `SELECT
           svc.id,
           'shop_product' AS history_type,
           svc.product_name,
           NULL AS material_name,
           svc.order_qty AS quantity,
           svc.product_unit AS unit,
           svc.order_amount AS amount,
           svc.commission_amount AS commission,
           svc.city,
           svc.customer_name,
           svc.customer_phone,
           svc.created_at AS completed_at,
           svc.created_at,
           svc.settlement_status AS status
         FROM shop_vendor_commissions svc
         WHERE svc.supplier_id = $1
         ORDER BY svc.created_at DESC
         LIMIT 100`,
        [decoded.id]
      );
      shopCommissions = commRes.rows;
    } catch (_) {
      // shop_vendor_commissions table may not exist or supplier_id column may not exist yet
      shopCommissions = [];
    }

    // Combine and sort by completed_at descending
    const combined = [...enquiriesRes.rows, ...shopCommissions].sort(
      (a, b) => new Date(b.completed_at || b.created_at) - new Date(a.completed_at || a.created_at)
    );

    // Summary stats
    const totalEarned = combined.reduce((s, r) => s + parseFloat(r.amount || 0), 0);
    const totalCommission = combined.reduce((s, r) => s + parseFloat(r.commission || 0), 0);
    const totalNet = totalEarned - totalCommission;

    return NextResponse.json({
      success: true,
      data: {
        history: combined,
        summary: {
          total_earned: Math.round(totalEarned),
          total_commission: Math.round(totalCommission),
          total_net: Math.round(totalNet),
          total_orders: combined.length,
        },
      },
    });
  } catch (err) {
    console.error('GET supplier/history error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

