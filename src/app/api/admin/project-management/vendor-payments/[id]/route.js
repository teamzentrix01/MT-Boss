import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

export async function PATCH(req, { params }) {
  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const id = Number((await params).id);
    const amount = Number(b.amount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.payment_date || '') ||
      !['advance', 'labour', 'material', 'contract'].includes(b.payment_type)
    ) {
      return NextResponse.json({ success: false, error: 'Invalid payment' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const oldRes = await c.query(
        `SELECT vp.*, pv.project_id
         FROM pm_vendor_payments vp
         JOIN pm_project_vendors pv ON pv.id = vp.project_vendor_id
         WHERE vp.id = $1 FOR UPDATE`,
        [id]
      );
      const old = oldRes.rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
      }

      const auth = await assertAgentAccess(req, old.project_id, 'payments');
      if (!auth.allowed) {
        await c.query('ROLLBACK');
        return auth.response;
      }

      const actor = actorFromAdmin(auth.user);
      const r = await c.query(
        `UPDATE pm_vendor_payments
         SET amount = $1, payment_date = $2, mode = $3, payment_type = $4, note = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [amount, b.payment_date, b.mode || null, b.payment_type, b.note || null, id]
      );
      await writePmPhase2Audit(c, 'pm_vendor_payments', id, 'updated', actor, old, r.rows[0]);
      await c.query('COMMIT');
      return NextResponse.json({ success: true, data: r.rows[0] });
    } catch (e) {
      await c.query('ROLLBACK');
      return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    } finally {
      c.release();
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
    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_vendor_payments WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
      }

      const actor = actorFromAdmin(admin);
      const r = await c.query(
        `UPDATE pm_vendor_payments SET is_deleted = TRUE, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id]
      );
      await writePmPhase2Audit(c, 'pm_vendor_payments', id, 'soft_deleted', actor, old, r.rows[0]);
      await c.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (e) {
      await c.query('ROLLBACK');
      return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    } finally {
      c.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
