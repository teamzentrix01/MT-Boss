import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const pv = Number(s.get('projectVendorId'));

    if (!Number.isInteger(pv)) {
      return NextResponse.json({ success: false, error: 'projectVendorId is required' }, { status: 400 });
    }

    const r = await pool.query(
      `SELECT ms.*, m.name AS linked_material_name, COUNT(*) OVER()::int AS total_count
       FROM pm_vendor_material_supply ms
       LEFT JOIN pm_materials m ON m.id = ms.material_id
       WHERE ms.project_vendor_id = $1 AND NOT ms.is_deleted
       ORDER BY ms.supply_date DESC, ms.created_at DESC
       LIMIT $2 OFFSET $3`,
      [pv, pageSize, offset]
    );

    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: r.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  const a = requireRole(req, 'admin');
  if (!a) return unauthorized();

  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const pv = Number(b.project_vendor_id);
    const q = Number(b.quantity);
    const rate = Number(b.rate);
    const matId = b.material_id ? Number(b.material_id) : null;

    if (
      !Number.isInteger(pv) ||
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
      const actor = actorFromAdmin(a);
      const amount = q * rate;

      // 1. Insert pm_vendor_material_supply
      const r = await c.query(
        `INSERT INTO pm_vendor_material_supply(
           project_vendor_id, item_name, unit, quantity, rate, amount,
           supply_date, material_id, note, created_by
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
        [pv, b.item_name.trim(), b.unit || null, q, rate, amount, b.supply_date, matId, b.note || null, actor]
      );
      const supplyRow = r.rows[0];

      // 2. If material_id is linked, automatically create linked pm_material_received in same transaction
      if (matId) {
        const pvInfo = await c.query(
          `SELECT pv.project_id, pv.vendor_id, v.name AS vendor_name
           FROM pm_project_vendors pv
           JOIN pm_vendors v ON v.id = pv.vendor_id
           WHERE pv.id = $1`,
          [pv]
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
              supplyRow.id, q, rate, amount, b.supply_date,
              b.note ? `Vendor supply: ${b.note}` : 'Vendor supplied material', actor
            ]
          );
        }
      }

      await writePmPhase2Audit(c, 'pm_vendor_material_supply', supplyRow.id, 'created', actor, null, supplyRow);
      await c.query('COMMIT');

      return NextResponse.json({ success: true, data: supplyRow }, { status: 201 });
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
