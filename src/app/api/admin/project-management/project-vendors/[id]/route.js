import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

export async function PATCH(req, { params }) {
  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    const pvRes = await pool.query('SELECT project_id FROM pm_project_vendors WHERE id = $1', [id]);
    if (!pvRes.rows[0]) {
      return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
    }

    const auth = await assertAgentAccess(req, pvRes.rows[0].project_id, 'vendor');
    if (!auth.allowed) return auth.response;

    const b = await req.json();
    const type = String(b.pay_type);
    if (!['daily_wage', 'contract'].includes(type) || !String(b.work_description || '').trim()) {
      return NextResponse.json({ success: false, error: 'Invalid assignment' }, { status: 400 });
    }

    const rate = Number(b.daily_rate);
    const contract = Number(b.contract_amount);
    if (
      (type === 'daily_wage' && (!Number.isFinite(rate) || rate < 0)) ||
      (type === 'contract' && (!Number.isFinite(contract) || contract < 0))
    ) {
      return NextResponse.json({ success: false, error: 'Invalid rate' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const old = (await client.query(`SELECT * FROM pm_project_vendors WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      const r = await client.query(
        `UPDATE pm_project_vendors
         SET work_description = $1, pay_type = $2, daily_rate = $3, contract_amount = $4, status = $5
         WHERE id = $6
         RETURNING *`,
        [
          b.work_description.trim(),
          type,
          type === 'daily_wage' ? rate : null,
          type === 'contract' ? contract : null,
          b.status === 'completed' ? 'completed' : 'active',
          id,
        ]
      );
      const actor = actorFromAdmin(auth.user);
      await writePmPhase2Audit(client, 'pm_project_vendors', id, 'updated', actor, old, r.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: r.rows[0] });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = requireRole(req, 'admin');
  if (!admin) {
    const auth = await assertAgentAccess(req, null, null);
    if (auth.role === 'agent') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Agents cannot delete records (admin only)' }, { status: 403 });
    }
    return unauthorized();
  }

  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    const child = await pool.query(
      `SELECT 1 FROM pm_attendance WHERE project_vendor_id = $1
       UNION ALL SELECT 1 FROM pm_vendor_payments WHERE project_vendor_id = $1
       UNION ALL SELECT 1 FROM pm_vendor_material_supply WHERE project_vendor_id = $1
       LIMIT 1`,
      [id]
    );
    if (child.rows.length) {
      return NextResponse.json({ success: false, error: 'Assignment has history and cannot be deleted' }, { status: 409 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const old = (await client.query(`SELECT * FROM pm_project_vendors WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      await client.query(`DELETE FROM pm_project_vendors WHERE id = $1`, [id]);
      const actor = actorFromAdmin(admin);
      await writePmPhase2Audit(client, 'pm_project_vendors', id, 'deleted', actor, old, null);
      await client.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
