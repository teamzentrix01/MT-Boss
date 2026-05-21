import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

function getSupplier(req) {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try { return jwt.verify(auth.slice(7), JWT_SECRET); } catch { return null; }
}

export async function GET(req) {
  try {
    const decoded = getSupplier(req);
    if (!decoded) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const today = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `SELECT
         COALESCE(SUM(amount_received), 0)                                                AS total_earned,
         COALESCE(SUM(admin_commission), 0)                                               AS total_commission,
         COALESCE(SUM(CASE WHEN DATE(fulfilled_at) = $2 THEN amount_received ELSE 0 END), 0) AS today_earned,
         COALESCE(SUM(CASE WHEN DATE(fulfilled_at) = $2 THEN admin_commission ELSE 0 END), 0) AS today_commission,
         COUNT(*) FILTER (WHERE status = 'fulfilled')                                     AS total_fulfilled,
         COUNT(*) FILTER (WHERE status = 'accepted')                                      AS active_orders
       FROM material_enquiries
       WHERE accepted_by_supplier_id = $1`,
      [decoded.id, today]
    );

    const row = result.rows[0];
    const totalEarned = parseFloat(row.total_earned);
    const todayEarned = parseFloat(row.today_earned);
    const totalCommission = parseFloat(row.total_commission);
    const todayCommission = parseFloat(row.today_commission);

    return NextResponse.json({
      success: true,
      data: {
        total_earned: totalEarned,
        today_earned: todayEarned,
        total_net: totalEarned - totalCommission,
        today_net: todayEarned - todayCommission,
        total_commission: totalCommission,
        today_commission: todayCommission,
        total_fulfilled: parseInt(row.total_fulfilled),
        active_orders: parseInt(row.active_orders),
      },
    });
  } catch (err) {
    console.error('GET supplier/earnings error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
