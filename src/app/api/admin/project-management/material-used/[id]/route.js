import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

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
      const old = (await c.query(`SELECT * FROM pm_material_used WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Used entry not found' }, { status: 404 });
      }

      const auth = await assertAgentAccess(req, old.project_id, 'construction');
      if (!auth.allowed) {
        await c.query('ROLLBACK');
        return auth.response;
      }

      const b = await req.json();
      const q = Number(b.quantity);

      if (
        !Number.isFinite(q) ||
        q <= 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(b.used_date || '')
      ) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Invalid used entry' }, { status: 400 });
      }

      // Recheck stock
      const stockRes = await c.query(
        `SELECT
           COALESCE((SELECT SUM(quantity) FROM pm_material_received WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted), 0) -
           COALESCE((SELECT SUM(quantity) FROM pm_material_used WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted AND id <> $3), 0) -
           COALESCE((SELECT SUM(quantity) FROM pm_material_adjustments WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted), 0) AS current_stock`,
        [old.project_id, old.material_id, id]
      );
      const currentStock = Number(stockRes.rows[0]?.current_stock || 0);
      const isOverUsed = (currentStock - q) < 0;

      const r = await c.query(
        `UPDATE pm_material_used
         SET quantity = $1, used_date = $2, used_for = $3, note = $4,
             over_used = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [q, b.used_date, b.used_for || null, b.note || null, isOverUsed, id]
      );

      const actor = actorFromAdmin(auth.user);
      await writePmPhase2Audit(c, 'pm_material_used', id, 'updated', actor, old, r.rows[0]);
      await c.query('COMMIT');

      return NextResponse.json({
        success: true,
        data: r.rows[0],
        over_used: isOverUsed,
        warning: isOverUsed ? `Warning: Stock is now negative (${(currentStock - q).toFixed(2)}). Entry marked as Over-used.` : null
      });
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
      const old = (await c.query(`SELECT * FROM pm_material_used WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Used entry not found' }, { status: 404 });
      }

      const r = await c.query(
        `UPDATE pm_material_used
         SET is_deleted = TRUE, updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      const actor = actorFromAdmin(admin);
      await writePmPhase2Audit(c, 'pm_material_used', id, 'soft_deleted', actor, old, r.rows[0]);
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
