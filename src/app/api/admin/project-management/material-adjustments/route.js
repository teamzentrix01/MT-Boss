import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

const VALID_ADJUSTMENT_TYPES = ['wastage', 'damage', 'return_to_supplier', 'transfer_out'];

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

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const actor = actorFromAdmin(auth.user);

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
           adjustment_date, to_project_id, note, bill_url, bill_filename, created_by, over_used
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING *`,
        [p, m, adjType, q, b.adjustment_date, toProjId, b.note || null, b.bill_url || null, b.bill_filename || null, actor, isOverUsed]
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
