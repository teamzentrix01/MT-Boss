import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { requireAdmin } from '@/lib/agent-auth';

function verifyAdminToken(req) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
    if (decoded.role === 'admin' || decoded.email === 'admin@gmail.com') return decoded;
    return null;
  } catch {
    return null;
  }
}

async function ensureIsActiveColumn() {
  await pool.query(`ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`);
}

// GET — list all suppliers with earnings summary
export async function GET(req) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await ensureIsActiveColumn();
    await pool.query(`ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS product_categories TEXT[] DEFAULT '{}'`);

    const result = await pool.query(
      `SELECT
        s.id, s.email, s.shop_name, s.phone,
        s.city, s.state, s.country, s.postal_code,
        s.aadhaar_number, s.aadhaar_status,
        s.product_categories,
        s.status, s.is_active,
        s.rejection_reason,
        s.created_at, s.updated_at,
        COALESCE(e.total_earned, 0)      AS total_earned,
        COALESCE(e.total_commission, 0)  AS total_commission,
        COALESCE(e.total_fulfilled, 0)   AS total_fulfilled
       FROM suppliers s
       LEFT JOIN (
         SELECT accepted_by_supplier_id AS sid,
                SUM(amount_received)    AS total_earned,
                SUM(admin_commission)   AS total_commission,
                COUNT(*)                AS total_fulfilled
         FROM material_enquiries
         WHERE status = 'fulfilled'
         GROUP BY accepted_by_supplier_id
       ) e ON e.sid = s.id
       ORDER BY s.created_at DESC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT — approve / reject / activate / deactivate
export async function PUT(req) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await ensureIsActiveColumn();

    const { supplier_id, action, rejection_reason } = await req.json();
    if (!supplier_id || !action) {
      return NextResponse.json({ error: 'supplier_id and action are required' }, { status: 400 });
    }

    let query, values;

    if (action === 'approve') {
      query = `UPDATE suppliers SET status = 'approved', is_active = TRUE, rejection_reason = NULL, updated_at = NOW() WHERE id = $1 RETURNING id, email, shop_name, status, is_active`;
      values = [supplier_id];
    } else if (action === 'reject') {
      query = `UPDATE suppliers SET status = 'rejected', is_active = FALSE, rejection_reason = $2, updated_at = NOW() WHERE id = $1 RETURNING id, email, shop_name, status, is_active`;
      values = [supplier_id, rejection_reason || 'Application rejected by admin'];
    } else if (action === 'activate') {
      query = `UPDATE suppliers SET is_active = TRUE, updated_at = NOW() WHERE id = $1 AND status = 'approved' RETURNING id, email, shop_name, status, is_active`;
      values = [supplier_id];
    } else if (action === 'deactivate') {
      query = `UPDATE suppliers SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id, email, shop_name, status, is_active`;
      values = [supplier_id];
    } else {
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    const result = await pool.query(query, values);
    if (result.rows.length === 0) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: `Supplier ${action}d`, data: result.rows[0] });
  } catch (error) {
    console.error('Error managing supplier:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET commission summary for admin overview
export async function PATCH(req) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const today = new Date().toISOString().split('T')[0];

    const result = await pool.query(
      `SELECT
         COALESCE(SUM(admin_commission), 0)                                                    AS total_commission,
         COALESCE(SUM(CASE WHEN DATE(fulfilled_at) = $1 THEN admin_commission ELSE 0 END), 0)  AS today_commission,
         COUNT(*) FILTER (WHERE status = 'fulfilled')                                           AS total_fulfilled,
         COUNT(*) FILTER (WHERE status = 'open')                                                AS open_enquiries
       FROM material_enquiries`,
      [today]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
