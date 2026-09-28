import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

export async function GET(req) {
  const admin = requireRole(req, ['admin', 'site_supervisor']);
  if (!admin) return unauthorized();

  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const projectId = Number(s.get('projectId'));

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const materialId = s.get('materialId') ? Number(s.get('materialId')) : null;
    const startDate = s.get('startDate') || null;
    const endDate = s.get('endDate') || null;

    let where = 'u.project_id = $1 AND NOT u.is_deleted';
    const params = [projectId];

    if (materialId) {
      params.push(materialId);
      where += ` AND u.material_id = $${params.length}`;
    }
    if (startDate) {
      params.push(startDate);
      where += ` AND u.used_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      where += ` AND u.used_date <= $${params.length}`;
    }

    params.push(pageSize, offset);

    const r = await pool.query(
      `SELECT u.*, m.name AS material_name, m.unit AS material_unit, COUNT(*) OVER()::int AS total_count
       FROM pm_material_used u
       JOIN pm_materials m ON m.id = u.material_id
       WHERE ${where}
       ORDER BY u.used_date DESC, u.created_at DESC
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
  const admin = requireRole(req, ['admin', 'site_supervisor']);
  if (!admin) return unauthorized();

  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const p = Number(b.project_id);
    const m = Number(b.material_id);
    const q = Number(b.quantity);

    if (
      !Number.isInteger(p) ||
      !Number.isInteger(m) ||
      !Number.isFinite(q) ||
      q <= 0 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.used_date || '')
    ) {
      return NextResponse.json({ success: false, error: 'Invalid used entry' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const actor = actorFromAdmin(admin);

      // Check current stock
      const stockRes = await c.query(
        `SELECT
           COALESCE((SELECT SUM(quantity) FROM pm_material_received WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted), 0) -
           COALESCE((SELECT SUM(quantity) FROM pm_material_used WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted), 0) -
           COALESCE((SELECT SUM(quantity) FROM pm_material_adjustments WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted), 0) AS current_stock`,
        [p, m]
      );
      const currentStock = Number(stockRes.rows[0]?.current_stock || 0);
      const isOverUsed = (currentStock - q) < 0;

      const r = await c.query(
        `INSERT INTO pm_material_used(
           project_id, material_id, quantity, used_date, used_for, note, created_by, over_used
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING *`,
        [p, m, q, b.used_date, b.used_for || null, b.note || null, actor, isOverUsed]
      );

      await writePmPhase2Audit(c, 'pm_material_used', r.rows[0].id, 'created', actor, null, r.rows[0]);
      await c.query('COMMIT');

      return NextResponse.json({
        success: true,
        data: r.rows[0],
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
