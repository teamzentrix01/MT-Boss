import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

function val(b) {
  const project = Number(b.project_id ?? b.projectId);
  const vendor = Number(b.vendor_id ?? b.vendorId);
  const type = String(b.pay_type ?? b.payType ?? '');
  const daily = b.daily_rate !== undefined && b.daily_rate !== null && b.daily_rate !== '' ? Number(b.daily_rate) : null;
  const contract = b.contract_amount !== undefined && b.contract_amount !== null && b.contract_amount !== '' ? Number(b.contract_amount) : null;
  const workDesc = String(b.work_description ?? b.workDescription ?? '').trim();

  if (!Number.isInteger(project) || project <= 0) return { error: 'Valid project_id is required' };
  if (!Number.isInteger(vendor) || vendor <= 0) return { error: 'Please select a contractor' };
  if (!workDesc) return { error: 'Work description is required' };
  if (!['daily_wage', 'contract'].includes(type)) return { error: 'Pay type must be daily_wage or contract' };
  if (type === 'daily_wage' && (!Number.isFinite(daily) || daily < 0)) return { error: 'Valid daily rate is required' };
  if (type === 'contract' && (!Number.isFinite(contract) || contract < 0)) return { error: 'Valid contract amount is required' };

  return {
    values: [
      project,
      vendor,
      workDesc,
      type,
      type === 'daily_wage' ? daily : null,
      type === 'contract' ? contract : null,
      b.status === 'completed' ? 'completed' : 'active',
    ],
  };
}

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const project = Number(s.get('projectId') || s.get('project_id'));

    if (!Number.isInteger(project)) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, project, 'vendor');
    if (!auth.allowed) return auth.response;

    const r = await pool.query(
      `WITH paged AS (
         SELECT pv.*, COUNT(*) OVER()::int total_count
         FROM pm_project_vendors pv
         WHERE project_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3
       ),
       labour AS (
         SELECT p.id AS project_vendor_id,
                COALESCE(SUM(a.wage_amount), 0) + COALESCE(MAX(la_sum.amount), 0) amount
         FROM paged p
         LEFT JOIN pm_attendance a ON a.project_vendor_id = p.id
         LEFT JOIN (
           SELECT COALESCE(l.project_vendor_id, l.contractor_id) AS project_vendor_id,
                  COALESCE(SUM(la.wage_amount), 0) AS amount
           FROM pm_labor_attendance la
           JOIN pm_labor l ON l.id = la.labor_id
           WHERE COALESCE(l.project_vendor_id, l.contractor_id) IS NOT NULL
           GROUP BY COALESCE(l.project_vendor_id, l.contractor_id)
         ) la_sum ON la_sum.project_vendor_id = p.id
         GROUP BY p.id
       ),
       materials AS (
         SELECT m.project_vendor_id, SUM(m.amount) amount
         FROM pm_vendor_material_supply m
         JOIN paged p ON p.id = m.project_vendor_id
         WHERE NOT m.is_deleted
         GROUP BY m.project_vendor_id
       ),
       payments AS (
         SELECT x.project_vendor_id, SUM(x.amount) amount
         FROM pm_vendor_payments x
         JOIN paged p ON p.id = x.project_vendor_id
         WHERE NOT x.is_deleted
         GROUP BY x.project_vendor_id
       )
       SELECT p.*, v.name vendor_name, v.trade,
              COALESCE(l.amount, 0) labour_earned,
              COALESCE(m.amount, 0) material_earned,
              COALESCE(x.amount, 0) paid,
              COALESCE(x.amount, 0) total_paid,
              CASE WHEN p.pay_type = 'contract' THEN p.contract_amount ELSE COALESCE(l.amount, 0) END + COALESCE(m.amount, 0) earned,
              CASE WHEN p.pay_type = 'contract' THEN p.contract_amount ELSE COALESCE(l.amount, 0) END + COALESCE(m.amount, 0) total_earned,
              (CASE WHEN p.pay_type = 'contract' THEN p.contract_amount ELSE COALESCE(l.amount, 0) END + COALESCE(m.amount, 0)) - COALESCE(x.amount, 0) balance,
              (CASE WHEN p.pay_type = 'contract' THEN p.contract_amount ELSE COALESCE(l.amount, 0) END + COALESCE(m.amount, 0)) - COALESCE(x.amount, 0) balance_due
       FROM paged p
       JOIN pm_vendors v ON v.id = p.vendor_id
       LEFT JOIN labour l ON l.project_vendor_id = p.id
       LEFT JOIN materials m ON m.project_vendor_id = p.id
       LEFT JOIN payments x ON x.project_vendor_id = p.id
       ORDER BY p.created_at DESC`,
      [project, pageSize, offset]
    );

    const hasPayments = auth.role === 'admin' || auth.role === 'site_supervisor' || (auth.user?.specializations || []).includes('payments');
    const rows = hasPayments
      ? r.rows
      : r.rows.map((row) => ({
          ...row,
          labour_earned: null,
          material_earned: null,
          paid: null,
          total_paid: null,
          earned: null,
          total_earned: null,
          balance: null,
          balance_due: null,
          daily_rate: null,
          contract_amount: null,
        }));

    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (e) {
    console.error("PROJECT VENDORS GET ERROR:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureProjectManagementSchema();
    const body = await req.json();
    console.log("PROJECT VENDOR ASSIGN POST PAYLOAD:", body);
    const validation = val(body);
    if (validation.error) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const projectId = validation.values[0];
    const auth = await assertAgentAccess(req, projectId, 'vendor');
    if (!auth.allowed) return auth.response;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const actor = actorFromAdmin(auth.user);
      const r = await client.query(
        `INSERT INTO pm_project_vendors(project_id, vendor_id, work_description, pay_type, daily_rate, contract_amount, status)
         VALUES($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        validation.values
      );
      await writePmPhase2Audit(client, 'pm_project_vendors', r.rows[0].id, 'created', actor, null, r.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: r.rows[0] }, { status: 201 });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    console.error("CONTRACTOR ASSIGN POST ERROR:", e);
    return NextResponse.json(
      { success: false, error: e.code === '23505' ? 'This vendor/work assignment already exists' : (e.message || 'Could not assign contractor') },
      { status: e.code === '23505' ? 409 : 500 }
    );
  }
}
