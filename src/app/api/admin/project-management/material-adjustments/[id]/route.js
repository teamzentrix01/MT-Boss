import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

const VALID_ADJUSTMENT_TYPES = ['wastage', 'damage', 'return_to_supplier', 'transfer_out'];

export async function PATCH(req, { params }) {
  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_material_adjustments WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Adjustment entry not found' }, { status: 404 });
      }

      const auth = await assertAgentAccess(req, old.project_id, 'construction');
      if (!auth.allowed) {
        await c.query('ROLLBACK');
        return auth.response;
      }

      const b = await req.json();
      const q = Number(b.quantity);
      const adjType = String(b.adjustment_type || '').trim();

      if (
        !Number.isFinite(q) ||
        q <= 0 ||
        !VALID_ADJUSTMENT_TYPES.includes(adjType) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(b.adjustment_date || '')
      ) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Invalid adjustment parameters' }, { status: 400 });
      }

      const r = await c.query(
        `UPDATE pm_material_adjustments
         SET quantity = $1, adjustment_type = $2, adjustment_date = $3, note = $4
         WHERE id = $5
         RETURNING *`,
        [q, adjType, b.adjustment_date, b.note || null, id]
      );

      const actor = actorFromAdmin(auth.user);
      await writePmPhase2Audit(c, 'pm_material_adjustments', id, 'updated', actor, old, r.rows[0]);
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
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_material_adjustments WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Adjustment entry not found' }, { status: 404 });
      }

      const r = await c.query(
        `UPDATE pm_material_adjustments
         SET is_deleted = TRUE
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      const actor = actorFromAdmin(admin);
      await writePmPhase2Audit(c, 'pm_material_adjustments', id, 'soft_deleted', actor, old, r.rows[0]);
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
