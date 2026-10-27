import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

const VALID_ADJUSTMENT_TYPES = [
  'wastage',
  'damage',
  'return_to_supplier',
  'return_material',
  'scrap_material',
  'scrap',
  'transfer_out'
];

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const projectId = Number(s.get('projectId'));

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, 'construction');
    if (!auth.allowed) return auth.response;

    const materialId = s.get('materialId') ? Number(s.get('materialId')) : null;
    const startDate = s.get('startDate') || null;
    const endDate = s.get('endDate') || null;
    const adjTypeQuery = s.get('type') || null;

    let where = 'a.project_id = $1 AND NOT a.is_deleted';
    const params = [projectId];

    if (materialId) {
      params.push(materialId);
      where += ` AND a.material_id = $${params.length}`;
    }
    if (startDate) {
      params.push(startDate);
      where += ` AND a.adjustment_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      where += ` AND a.adjustment_date <= $${params.length}`;
    }
    if (adjTypeQuery) {
      if (adjTypeQuery === 'wastage') {
        where += ` AND a.adjustment_type IN ('wastage', 'damage', 'transfer_out')`;
      } else if (adjTypeQuery === 'return' || adjTypeQuery === 'return_material') {
        where += ` AND a.adjustment_type IN ('return_to_supplier', 'return_material')`;
      } else if (adjTypeQuery === 'scrap' || adjTypeQuery === 'scrap_material') {
        where += ` AND a.adjustment_type IN ('scrap_material', 'scrap')`;
      } else {
        params.push(adjTypeQuery);
        where += ` AND a.adjustment_type = $${params.length}`;
      }
    }

    params.push(pageSize, offset);

    const r = await pool.query(
      `SELECT a.*, m.name AS material_name, m.unit AS material_unit,
              tp.name AS to_project_name, COUNT(*) OVER()::int AS total_count
       FROM pm_material_adjustments a
       JOIN pm_materials m ON m.id = a.material_id
       LEFT JOIN pm_projects tp ON tp.id = a.to_project_id
       WHERE ${where}
       ORDER BY a.adjustment_date DESC, a.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
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
  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const p = Number(b.project_id);
    const m = Number(b.material_id);
    const q = Number(b.quantity);
    const adjType = String(b.adjustment_type || '').trim();
    const toProjId = b.to_project_id ? Number(b.to_project_id) : null;
    let supplierId = b.supplier_id ? Number(b.supplier_id) : null;
    const supplierName = b.supplier_name ? String(b.supplier_name).trim() : null;
    let amount = b.amount !== undefined && b.amount !== null && b.amount !== '' ? Number(b.amount) : null;

    if (
      !Number.isInteger(p) ||
      !Number.isInteger(m) ||
      !Number.isFinite(q) ||
      q <= 0 ||
      !VALID_ADJUSTMENT_TYPES.includes(adjType) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.adjustment_date || '') ||
      (adjType === 'transfer_out' && (!Number.isInteger(toProjId) || toProjId === p))
    ) {
      return NextResponse.json({ success: false, error: 'Invalid adjustment parameters' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, p, 'construction');
    if (!auth.allowed) return auth.response;

    try {
      await pool.query(`
        ALTER TABLE pm_material_adjustments 
        ADD COLUMN IF NOT EXISTS bill_url text,
        ADD COLUMN IF NOT EXISTS bill_filename text,
        ADD COLUMN IF NOT EXISTS amount NUMERIC(14,2),
        ADD COLUMN IF NOT EXISTS supplier_name text,
        ADD COLUMN IF NOT EXISTS supplier_id BIGINT REFERENCES suppliers(id) ON DELETE SET NULL
      `);
    } catch {}

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const actor = actorFromAdmin(auth.user);

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
          [p, m, supplierId, supplierName || '']
        );
        const foundRate = Number(rateRes.rows[0]?.rate || 0);
        if (foundRate > 0) {
          amount = Number((q * foundRate).toFixed(2));
        }
      }

      // Check current stock in source project
      const stockRes = await c.query(
        `SELECT
           COALESCE((SELECT SUM(quantity) FROM pm_material_received WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted), 0) -
           COALESCE((SELECT SUM(quantity) FROM pm_material_used WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted), 0) -
           COALESCE((SELECT SUM(quantity) FROM pm_material_adjustments WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted), 0) AS current_stock`,
        [p, m]
      );
      const currentStock = Number(stockRes.rows[0]?.current_stock || 0);
      const isOverUsed = (currentStock - q) < 0;

      // Insert adjustment
      const adjRes = await c.query(
        `INSERT INTO pm_material_adjustments(
           project_id, material_id, adjustment_type, quantity,
           adjustment_date, to_project_id, note, bill_url, bill_filename, created_by, over_used,
           amount, supplier_name, supplier_id
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         RETURNING *`,
        [p, m, adjType, q, b.adjustment_date, toProjId, b.note || null, b.bill_url || null, b.bill_filename || null, actor, isOverUsed, amount, supplierName, supplierId]
      );
      const adjRow = adjRes.rows[0];

      // If transfer_out with to_project_id, create matching pm_material_received in destination project
      if (adjType === 'transfer_out' && toProjId) {
        const srcProjRes = await c.query(`SELECT name FROM pm_projects WHERE id = $1`, [p]);
        const srcProjName = srcProjRes.rows[0]?.name || `Project #${p}`;

        const avgRes = await c.query(
          `SELECT CASE WHEN SUM(quantity) > 0 THEN SUM(amount)/SUM(quantity) ELSE 0 END AS avg_rate
           FROM pm_material_received
           WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted`,
          [p, m]
        );
        const avgRate = Number(avgRes.rows[0]?.avg_rate || 0);
        const transferAmount = q * avgRate;

        await c.query(
          `INSERT INTO pm_material_received(
             project_id, material_id, supplier_name, quantity, rate, amount,
             received_date, note, created_by, transfer_in
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,TRUE)`,
          [
            toProjId, m, `Transfer from ${srcProjName}`, q, avgRate, transferAmount,
            b.adjustment_date, `Transferred from ${srcProjName} (Adj #${adjRow.id})`, actor
          ]
        );
      }

      await writePmPhase2Audit(c, 'pm_material_adjustments', adjRow.id, 'created', actor, null, adjRow);
      await c.query('COMMIT');

      return NextResponse.json({
        success: true,
        data: adjRow,
        over_used: isOverUsed,
        warning: isOverUsed ? `Warning: Stock is now negative (${(currentStock - q).toFixed(2)}). Entry marked as Over-used.` : null
      }, { status: 201 });
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
