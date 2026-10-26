import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

const okDate = (x) => /^\d{4}-\d{2}-\d{2}$/.test(x || '') && !Number.isNaN(Date.parse(x));

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const projectId = Number(s.get('projectId'));
    const supplierId = s.get('supplierId') ? Number(s.get('supplierId')) : null;
    const supplierName = (s.get('supplierName') || '').trim();
    const from = s.get('from') || null;
    const to = s.get('to') || null;

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, 'payments');
    if (!auth.allowed) return auth.response;

    let where = 'p.project_id = $1 AND NOT p.is_deleted';
    const params = [projectId];

    if (supplierId && Number.isInteger(supplierId)) {
      params.push(supplierId);
      where += ` AND p.supplier_id = $${params.length}`;
    } else if (supplierName) {
      params.push(supplierName.toLowerCase());
      where += ` AND (p.supplier_id IS NULL AND LOWER(TRIM(COALESCE(p.supplier_name, ''))) = $${params.length})`;
    }

    if (from && okDate(from)) {
      params.push(from);
      where += ` AND p.payment_date >= $${params.length}`;
    }
    if (to && okDate(to)) {
      params.push(to);
      where += ` AND p.payment_date <= $${params.length}`;
    }

    params.push(pageSize, offset);

    const r = await pool.query(
      `SELECT 
        p.*,
        COALESCE(s.shop_name, p.supplier_name) AS supplier_display,
        s.phone AS supplier_phone,
        COUNT(*) OVER()::int AS total_count
       FROM pm_supplier_payments p
       LEFT JOIN suppliers s ON s.id = p.supplier_id
       WHERE ${where}
       ORDER BY p.payment_date DESC, p.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: r.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (e) {
    console.error('Error fetching supplier payments:', e);
    return NextResponse.json({ success: false, error: e.message || 'Failed to fetch supplier payments' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const projectId = Number(b.project_id);
    const amount = Number(b.amount);
    const supplierId = b.supplier_id ? Number(b.supplier_id) : null;
    const supplierName = (b.supplier_name || '').trim();
    const paymentDate = b.payment_date;
    const mode = String(b.mode || 'bank').trim();
    const txRef = String(b.transaction_reference || '').trim() || null;
    const note = String(b.note || '').trim() || null;

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ success: false, error: 'Valid projectId is required' }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Amount must be greater than 0' }, { status: 400 });
    }
    if (!okDate(paymentDate)) {
      return NextResponse.json({ success: false, error: 'Valid payment_date (YYYY-MM-DD) is required' }, { status: 400 });
    }
    if (!supplierId && !supplierName) {
      return NextResponse.json({ success: false, error: 'Supplier ID or Supplier Name is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, 'payments');
    if (!auth.allowed) return auth.response;

    const actor = actorFromAdmin(auth.user || auth.agent);

    // Compute current balance for validation / advance warning
    let delivWhere = 'project_id = $1 AND NOT is_deleted';
    let payWhere = 'project_id = $1 AND NOT is_deleted';
    const balanceParams = [projectId];

    if (supplierId) {
      balanceParams.push(supplierId);
      delivWhere += ` AND supplier_id = $2`;
      payWhere += ` AND supplier_id = $2`;
    } else {
      balanceParams.push(supplierName.toLowerCase());
      delivWhere += ` AND (supplier_id IS NULL AND LOWER(TRIM(COALESCE(supplier_name, ''))) = $2)`;
      payWhere += ` AND (supplier_id IS NULL AND LOWER(TRIM(COALESCE(supplier_name, ''))) = $2)`;
    }

    const delivRes = await pool.query(`SELECT COALESCE(SUM(amount), 0) AS total_supplied FROM pm_material_received WHERE ${delivWhere}`, balanceParams);
    const payRes = await pool.query(`SELECT COALESCE(SUM(amount), 0) AS total_paid FROM pm_supplier_payments WHERE ${payWhere}`, balanceParams);

    const totalSupplied = Number(delivRes.rows[0]?.total_supplied || 0);
    const totalPaid = Number(payRes.rows[0]?.total_paid || 0);
    const currentBalance = Number((totalSupplied - totalPaid).toFixed(2));

    const isAdvance = amount > currentBalance;
    const advanceAmount = isAdvance ? Number((amount - currentBalance).toFixed(2)) : 0;

    // Resolve final supplier_name if registered supplier was chosen
    let resolvedSupplierName = supplierName;
    if (supplierId) {
      const supRes = await pool.query('SELECT shop_name, business_name FROM suppliers WHERE id = $1', [supplierId]);
      if (supRes.rows[0]) {
        resolvedSupplierName = supRes.rows[0].shop_name || supRes.rows[0].business_name || `Supplier #${supplierId}`;
      }
    }

    const r = await pool.query(
      `INSERT INTO pm_supplier_payments (
        project_id, supplier_id, supplier_name, amount, payment_date, mode, transaction_reference, note, created_by
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [projectId, supplierId, resolvedSupplierName, amount, paymentDate, mode, txRef, note, actor]
    );

    const newPayment = r.rows[0];
    await writePmPhase2Audit(pool, 'pm_supplier_payments', newPayment.id, 'CREATE', actor, null, newPayment);

    return NextResponse.json({
      success: true,
      payment: newPayment,
      is_advance: isAdvance,
      advance_amount: advanceAmount,
      current_balance: currentBalance,
    });
  } catch (e) {
    console.error('Error creating supplier payment:', e);
    return NextResponse.json({ success: false, error: e.message || 'Failed to record supplier payment' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const id = Number(s.get('id'));

    if (!Number.isInteger(id)) {
      return NextResponse.json({ success: false, error: 'Valid id is required' }, { status: 400 });
    }

    const existing = await pool.query('SELECT * FROM pm_supplier_payments WHERE id = $1 AND NOT is_deleted', [id]);
    if (!existing.rows[0]) {
      return NextResponse.json({ success: false, error: 'Supplier payment not found or already deleted' }, { status: 404 });
    }

    const oldRow = existing.rows[0];
    const auth = await assertAgentAccess(req, oldRow.project_id, 'payments');
    if (!auth.allowed) return auth.response;

    const actor = actorFromAdmin(auth.user || auth.agent);

    const r = await pool.query(
      'UPDATE pm_supplier_payments SET is_deleted = TRUE, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );

    const newRow = r.rows[0];
    await writePmPhase2Audit(pool, 'pm_supplier_payments', id, 'DELETE', actor, oldRow, newRow);

    return NextResponse.json({ success: true, message: 'Supplier payment deleted successfully' });
  } catch (e) {
    console.error('Error deleting supplier payment:', e);
    return NextResponse.json({ success: false, error: e.message || 'Failed to delete supplier payment' }, { status: 500 });
  }
}
