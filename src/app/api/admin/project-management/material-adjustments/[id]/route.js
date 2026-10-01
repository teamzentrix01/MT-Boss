import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

const VALID_ADJUSTMENT_TYPES = ['wastage', 'damage', 'return_to_supplier', 'transfer_out'];

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
    const adjType = String(b.adjustment_type || '').trim();

    if (
      !Number.isFinite(q) ||
      q <= 0 ||
      !VALID_ADJUSTMENT_TYPES.includes(adjType) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.adjustment_date || '')
    ) {
      return NextResponse.json({ success: false, error: 'Invalid adjustment parameters' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_material_adjustments WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) throw new Error('Adjustment entry not found');

      const r = await c.query(
        `UPDATE pm_material_adjustments
         SET quantity = $1, adjustment_type = $2, adjustment_date = $3, note = $4
         WHERE id = $5
         RETURNING *`,
        [q, adjType, b.adjustment_date, b.note || null, id]
      );

      await writePmPhase2Audit(c, 'pm_material_adjustments', id, 'updated', actorFromAdmin(admin), old, r.rows[0]);
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
      const old = (await c.query(`SELECT * FROM pm_material_adjustments WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) throw new Error('Adjustment entry not found');

      const r = await c.query(
        `UPDATE pm_material_adjustments
         SET is_deleted = TRUE
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      await writePmPhase2Audit(c, 'pm_material_adjustments', id, 'soft_deleted', actorFromAdmin(admin), old, r.rows[0]);
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
