import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

function val(b) {
  const project = Number(b.project_id);
  const vendor = Number(b.vendor_id);
  const type = String(b.pay_type);
  const daily = Number(b.daily_rate);
  const contract = Number(b.contract_amount);

  if (
    !Number.isInteger(project) ||
    !Number.isInteger(vendor) ||
    !String(b.work_description || '').trim() ||
    !['daily_wage', 'contract'].includes(type) ||
    (type === 'daily_wage' && (!Number.isFinite(daily) || daily < 0)) ||
    (type === 'contract' && (!Number.isFinite(contract) || contract < 0))
  ) {
    return null;
  }

  return [
    project,
    vendor,
    String(b.work_description).trim(),
    type,
    type === 'daily_wage' ? daily : null,
    type === 'contract' ? contract : null,
    b.status === 'completed' ? 'completed' : 'active',
  ];
}

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const project = Number(s.get('projectId'));

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
         SELECT a.project_vendor_id, SUM(a.wage_amount) amount
         FROM pm_attendance a
         JOIN paged p ON p.id = a.project_vendor_id
         GROUP BY a.project_vendor_id
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
              CASE WHEN p.pay_type = 'contract' THEN p.contract_amount ELSE COALESCE(l.amount, 0) END + COALESCE(m.amount, 0) earned,
              (CASE WHEN p.pay_type = 'contract' THEN p.contract_amount ELSE COALESCE(l.amount, 0) END + COALESCE(m.amount, 0)) - COALESCE(x.amount, 0) balance
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
          earned: null,
          balance: null,
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
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureProjectManagementSchema();
    const body = await req.json();
    const v = val(body);
    if (!v) {
      return NextResponse.json({ success: false, error: 'Invalid vendor assignment' }, { status: 400 });
    }

    const projectId = v[0];
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
        v
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
    return NextResponse.json(
      { success: false, error: e.code === '23505' ? 'This vendor/work assignment already exists' : e.message },
      { status: e.code === '23505' ? 409 : 500 }
    );
  }
}
