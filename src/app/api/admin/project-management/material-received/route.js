import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

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

    let where = 'r.project_id = $1 AND NOT r.is_deleted';
    const params = [projectId];

    if (materialId) {
      params.push(materialId);
      where += ` AND r.material_id = $${params.length}`;
    }
    if (startDate) {
      params.push(startDate);
      where += ` AND r.received_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      where += ` AND r.received_date <= $${params.length}`;
    }

    params.push(pageSize, offset);

    const r = await pool.query(
      `SELECT r.*, m.name AS material_name, m.unit AS material_unit, COUNT(*) OVER()::int AS total_count
       FROM pm_material_received r
       JOIN pm_materials m ON m.id = r.material_id
       WHERE ${where}
       ORDER BY r.received_date DESC, r.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const isSupervisor = auth.role === 'site_supervisor';
    const rows = r.rows.map(row => {
      if (isSupervisor) {
        return { ...row, rate: null, amount: null };
      }
      return row;
    });

    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: rows,
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

    const auth = await assertAgentAccess(req, p, 'construction');
    if (!auth.allowed) return auth.response;

    const isSupervisor = auth.role === 'site_supervisor';
    const rate = isSupervisor ? 0 : Number(b.rate || 0);

    if (
      !Number.isInteger(p) ||
      !Number.isInteger(m) ||
      !Number.isFinite(q) ||
      q <= 0 ||
      (!isSupervisor && (!Number.isFinite(rate) || rate < 0)) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.received_date || '')
    ) {
      return NextResponse.json({ success: false, error: 'Invalid received entry' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const actor = actorFromAdmin(auth.user);
      const amount = q * rate;
      const r = await c.query(
        `INSERT INTO pm_material_received(
           project_id, material_id, supplier_name, supplier_vendor_id, vendor_supply_id,
           quantity, rate, amount, received_date, challan_no, note, bill_url, bill_filename, created_by
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         RETURNING *`,
        [
          p, m, b.supplier_name || null, b.supplier_vendor_id || null, b.vendor_supply_id || null,
          q, rate, amount, b.received_date, b.challan_no || null, b.note || null,
          b.bill_url || null, b.bill_filename || null, actor
        ]
      );

      await writePmPhase2Audit(c, 'pm_material_received', r.rows[0].id, 'created', actor, null, r.rows[0]);
      await c.query('COMMIT');
      return NextResponse.json({ success: true, data: r.rows[0] }, { status: 201 });
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
