import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

export async function PATCH(req, { params }) {
  const a = await requirePmAccess(req);
  if (!a) return unauthorized();

  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const id = Number((await params).id);
    const q = Number(b.quantity);
    const rate = Number(b.rate);
    const matId = b.material_id ? Number(b.material_id) : null;

    if (
      !String(b.item_name || '').trim() ||
      !Number.isFinite(q) ||
      q <= 0 ||
      !Number.isFinite(rate) ||
      rate < 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.supply_date || '')
    ) {
      return NextResponse.json({ success: false, error: 'Invalid supply parameters' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_vendor_material_supply WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) throw new Error('Supply not found');

      const amount = q * rate;
      const r = await c.query(
        `UPDATE pm_vendor_material_supply
         SET item_name = $1, unit = $2, quantity = $3, rate = $4,
             amount = $5, supply_date = $6, material_id = $7, note = $8
         WHERE id = $9
         RETURNING *`,
        [b.item_name.trim(), b.unit || null, q, rate, amount, b.supply_date, matId, b.note || null, id]
      );
      const updatedRow = r.rows[0];

      // Sync linked pm_material_received row
      const linkedRec = await c.query(`SELECT id FROM pm_material_received WHERE vendor_supply_id = $1`, [id]);
      if (linkedRec.rows[0]) {
        if (matId) {
          await c.query(
            `UPDATE pm_material_received
             SET material_id = $1, quantity = $2, rate = $3, amount = $4,
                 received_date = $5, note = $6, updated_at = NOW(), is_deleted = FALSE
             WHERE vendor_supply_id = $7`,
            [matId, q, rate, amount, b.supply_date, b.note || null, id]
          );
        } else {
          // Unlinked material_id -> soft-delete received row
          await c.query(
            `UPDATE pm_material_received SET is_deleted = TRUE, updated_at = NOW() WHERE vendor_supply_id = $1`,
            [id]
          );
        }
      } else if (matId) {
        // Create new linked row if previously unlinked
        const pvInfo = await c.query(
          `SELECT pv.project_id, pv.vendor_id, v.name AS vendor_name
           FROM pm_project_vendors pv
           JOIN pm_vendors v ON v.id = pv.vendor_id
           WHERE pv.id = $1`,
          [old.project_vendor_id]
        );
        if (pvInfo.rows[0]) {
          const { project_id, vendor_id, vendor_name } = pvInfo.rows[0];
          await c.query(
            `INSERT INTO pm_material_received(
               project_id, material_id, supplier_name, supplier_vendor_id,
               vendor_supply_id, quantity, rate, amount, received_date, note, created_by
             ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [
              project_id, matId, vendor_name, vendor_id,
              id, q, rate, amount, b.supply_date,
              b.note || 'Vendor supplied material', actorFromAdmin(a)
            ]
          );
        }
      }

      await writePmPhase2Audit(c, 'pm_vendor_material_supply', id, 'updated', actorFromAdmin(a), old, updatedRow);
      await c.query('COMMIT');
      return NextResponse.json({ success: true, data: updatedRow });
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
  const a = await requirePmAccess(req);
  if (!a) return unauthorized();

  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_vendor_material_supply WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) throw new Error('Supply not found');

      const r = await c.query(
        `UPDATE pm_vendor_material_supply SET is_deleted = TRUE WHERE id = $1 RETURNING *`,
        [id]
      );

      // Also soft-delete linked pm_material_received
      await c.query(
        `UPDATE pm_material_received SET is_deleted = TRUE, updated_at = NOW() WHERE vendor_supply_id = $1`,
        [id]
      );

      await writePmPhase2Audit(c, 'pm_vendor_material_supply', id, 'soft_deleted', actorFromAdmin(a), old, r.rows[0]);
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
