import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

export async function PATCH(req, { params }) {
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();

  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const b = await req.json();
    const q = Number(b.quantity);

    if (
      !Number.isFinite(q) ||
      q <= 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.used_date || '')
    ) {
      return NextResponse.json({ success: false, error: 'Invalid used entry' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_material_used WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) throw new Error('Used entry not found');

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

      await writePmPhase2Audit(c, 'pm_material_used', id, 'updated', actorFromAdmin(admin), old, r.rows[0]);
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
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();

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
      if (!old || old.is_deleted) throw new Error('Used entry not found');

      const r = await c.query(
        `UPDATE pm_material_used
         SET is_deleted = TRUE, updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      await writePmPhase2Audit(c, 'pm_material_used', id, 'soft_deleted', actorFromAdmin(admin), old, r.rows[0]);
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
