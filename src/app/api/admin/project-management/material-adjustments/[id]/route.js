import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

const VALID_ADJUSTMENT_TYPES = [
  'wastage',
  'damage',
  'return_to_supplier',
  'return_material',
  'scrap_material',
  'scrap',
  'transfer_out'
];

export async function PATCH(req, { params }) {
  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    try {
      await pool.query(`
        ALTER TABLE pm_material_adjustments 
        ADD COLUMN IF NOT EXISTS bill_url text,
        ADD COLUMN IF NOT EXISTS bill_filename text,
        ADD COLUMN IF NOT EXISTS amount NUMERIC(14,2),
        ADD COLUMN IF NOT EXISTS supplier_name text
      `);
    } catch {}

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
      let supplierId = b.supplier_id !== undefined ? (b.supplier_id ? Number(b.supplier_id) : null) : old.supplier_id;
      const supplierName = b.supplier_name !== undefined ? (b.supplier_name ? String(b.supplier_name).trim() : null) : old.supplier_name;
      let amount = b.amount !== undefined && b.amount !== null && b.amount !== '' ? Number(b.amount) : null;

      if (!supplierId && supplierName) {
        const supMatch = await c.query(
          `SELECT id FROM suppliers WHERE LOWER(TRIM(COALESCE(shop_name, business_name, ''))) = LOWER(TRIM($1)) LIMIT 1`,
          [supplierName]
        );
        if (supMatch.rows.length > 0) {
          supplierId = Number(supMatch.rows[0].id);
        }
      }

      if ((amount === null || amount <= 0) && (adjType === 'return_material' || adjType === 'return_to_supplier')) {
        const rateRes = await c.query(
          `SELECT rate FROM pm_material_received 
           WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted 
             AND ($3::bigint IS NULL OR supplier_id = $3 OR LOWER(TRIM(COALESCE(supplier_name, ''))) = LOWER(TRIM($4)))
           ORDER BY received_date DESC, id DESC LIMIT 1`,
          [old.project_id, old.material_id, supplierId, supplierName || '']
        );
        const foundRate = Number(rateRes.rows[0]?.rate || 0);
        if (foundRate > 0) {
          amount = Number((q * foundRate).toFixed(2));
        }
      }

      if (
        !Number.isFinite(q) ||
        q <= 0 ||
        !VALID_ADJUSTMENT_TYPES.includes(adjType) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(b.adjustment_date || '')
      ) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Invalid adjustment parameters' }, { status: 400 });
      }

      const unit = b.unit !== undefined ? (b.unit ? String(b.unit).trim() : null) : old.unit;
      const r = await c.query(
        `UPDATE pm_material_adjustments
         SET quantity = $1, adjustment_type = $2, adjustment_date = $3, note = $4,
             amount = $5, supplier_name = $6, supplier_id = $7, unit = $8
         WHERE id = $9
         RETURNING *`,
        [q, adjType, b.adjustment_date, b.note || null, amount, supplierName, supplierId, unit, id]
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
