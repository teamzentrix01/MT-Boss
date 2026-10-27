import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, assertAgentAccess } from '@/lib/project-management';

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const query = new URL(req.url).searchParams;
    const projectId = Number(query.get('projectId'));

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, ['construction', 'payments']);
    if (!auth.allowed) return auth.response;

    const supplierId = query.get('supplierId') ? Number(query.get('supplierId')) : null;
    const supplierName = (query.get('supplierName') || '').trim();

    let deliveryWhere = 'r.project_id = $1 AND NOT r.is_deleted';
    let paymentWhere = 'p.project_id = $1 AND NOT p.is_deleted';
    let returnWhere = "a.project_id = $1 AND NOT a.is_deleted AND a.adjustment_type IN ('return_to_supplier', 'return_material')";
    const deliveryParams = [projectId];
    const paymentParams = [projectId];
    const returnParams = [projectId];

    if (supplierId && Number.isInteger(supplierId)) {
      deliveryParams.push(supplierId);
      deliveryWhere += ` AND (r.supplier_id = $${deliveryParams.length} OR (r.supplier_id IS NULL AND LOWER(TRIM(COALESCE(r.supplier_name, ''))) = (SELECT LOWER(TRIM(COALESCE(shop_name, business_name, ''))) FROM suppliers WHERE id = $${deliveryParams.length} LIMIT 1)))`;

      paymentParams.push(supplierId);
      paymentWhere += ` AND (p.supplier_id = $${paymentParams.length} OR (p.supplier_id IS NULL AND LOWER(TRIM(COALESCE(p.supplier_name, ''))) = (SELECT LOWER(TRIM(COALESCE(shop_name, business_name, ''))) FROM suppliers WHERE id = $${paymentParams.length} LIMIT 1)))`;

      returnParams.push(supplierId);
      returnWhere += ` AND (a.supplier_id = $${returnParams.length} OR (a.supplier_id IS NULL AND LOWER(TRIM(COALESCE(a.supplier_name, ''))) = (SELECT LOWER(TRIM(COALESCE(shop_name, business_name, ''))) FROM suppliers WHERE id = $${returnParams.length} LIMIT 1)))`;
    } else if (supplierName) {
      deliveryParams.push(supplierName.toLowerCase());
      deliveryWhere += ` AND (LOWER(TRIM(COALESCE(r.supplier_name, ''))) = $${deliveryParams.length} OR r.supplier_id IN (SELECT id FROM suppliers WHERE LOWER(TRIM(COALESCE(shop_name, business_name, ''))) = $${deliveryParams.length}))`;

      paymentParams.push(supplierName.toLowerCase());
      paymentWhere += ` AND (LOWER(TRIM(COALESCE(p.supplier_name, ''))) = $${paymentParams.length} OR p.supplier_id IN (SELECT id FROM suppliers WHERE LOWER(TRIM(COALESCE(shop_name, business_name, ''))) = $${paymentParams.length}))`;

      returnParams.push(supplierName.toLowerCase());
      returnWhere += ` AND (LOWER(TRIM(COALESCE(a.supplier_name, ''))) = $${returnParams.length} OR a.supplier_id IN (SELECT id FROM suppliers WHERE LOWER(TRIM(COALESCE(shop_name, business_name, ''))) = $${returnParams.length}))`;
    }

    const deliveriesRes = await pool.query(
      `SELECT 
        r.id,
        r.project_id,
        r.material_id,
        COALESCE(m.name, r.note, 'Material') AS material_name,
        COALESCE(m.unit, 'units') AS material_unit,
        COALESCE(s.shop_name, r.supplier_name) AS supplier_name,
        r.supplier_id,
        r.quantity,
        r.rate,
        r.amount,
        r.received_date,
        r.challan_no,
        r.bill_url,
        r.bill_filename,
        r.note,
        r.transfer_in,
        r.created_by,
        r.created_at
       FROM pm_material_received r
       LEFT JOIN pm_materials m ON m.id = r.material_id
       LEFT JOIN suppliers s ON s.id = r.supplier_id
       WHERE ${deliveryWhere}
       ORDER BY r.received_date DESC, r.created_at DESC`,
      deliveryParams
    );

    const paymentsRes = await pool.query(
      `SELECT 
        p.id,
        p.project_id,
        p.supplier_id,
        COALESCE(s.shop_name, p.supplier_name) AS supplier_name,
        p.amount,
        p.payment_date,
        p.mode,
        p.transaction_reference,
        p.note,
        p.created_by,
        p.created_at
       FROM pm_supplier_payments p
       LEFT JOIN suppliers s ON s.id = p.supplier_id
       WHERE ${paymentWhere}
       ORDER BY p.payment_date DESC, p.created_at DESC`,
      paymentParams
    );

    const returnsRes = await pool.query(
      `SELECT 
        a.id,
        a.project_id,
        a.material_id,
        COALESCE(m.name, 'Material') AS material_name,
        COALESCE(m.unit, 'units') AS material_unit,
        COALESCE(s.shop_name, a.supplier_name) AS supplier_name,
        a.supplier_id,
        a.quantity,
        a.amount,
        a.adjustment_date,
        a.note,
        a.bill_url,
        a.bill_filename,
        a.created_by,
        a.created_at
       FROM pm_material_adjustments a
       LEFT JOIN pm_materials m ON m.id = a.material_id
       LEFT JOIN suppliers s ON s.id = a.supplier_id
       WHERE ${returnWhere}
       ORDER BY a.adjustment_date DESC, a.created_at DESC`,
      returnParams
    );

    const isSupervisor = auth.role === 'site_supervisor';
    const deliveries = deliveriesRes.rows.map(row => {
      if (isSupervisor) {
        return { ...row, rate: null, amount: null };
      }
      return row;
    });

    const returns = returnsRes.rows.map(row => {
      if (isSupervisor) {
        return { ...row, amount: null };
      }
      return row;
    });

    const totalSupplied = deliveriesRes.rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    const totalReturned = returnsRes.rows.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
    const totalPaid = paymentsRes.rows.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    // Net balance due = (Total Supplied - Total Returned) - Total Paid
    const balance = Number((totalSupplied - totalReturned - totalPaid).toFixed(2));

    return NextResponse.json({
      success: true,
      deliveries,
      payments: paymentsRes.rows,
      returns,
      summary: {
        total_supplied: Number(totalSupplied.toFixed(2)),
        total_returned: Number(totalReturned.toFixed(2)),
        total_paid: Number(totalPaid.toFixed(2)),
        balance,
        is_advance: balance < 0,
        balance_due: balance > 0 ? balance : 0,
        advance_amount: balance < 0 ? Math.abs(balance) : 0,
      }
    });
  } catch (error) {
    console.error('Error in supplier-ledger route:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch supplier ledger' }, { status: 500 });
  }
}
