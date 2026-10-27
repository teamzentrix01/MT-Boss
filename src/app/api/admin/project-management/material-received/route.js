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
      `SELECT r.*, m.name AS material_name, COALESCE(r.unit, m.unit, 'units') AS material_unit,
              COALESCE(s.shop_name, r.supplier_name) AS supplier_display, COUNT(*) OVER()::int AS total_count
       FROM pm_material_received r
       JOIN pm_materials m ON m.id = r.material_id
       LEFT JOIN suppliers s ON s.id = r.supplier_id
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
    let m = b.material_id ? Number(b.material_id) : null;
    const q = Number(b.quantity);
    const manualMatName = String(b.material_name || '').trim();
    const selectedUnit = b.unit ? String(b.unit).trim() : null;

    const auth = await assertAgentAccess(req, p, 'construction');
    if (!auth.allowed) return auth.response;

    const isSupervisor = auth.role === 'site_supervisor';
    const rate = isSupervisor ? 0 : Number(b.rate || 0);

    if (
      !Number.isInteger(p) ||
      (!Number.isInteger(m) && !manualMatName) ||
      !Number.isFinite(q) ||
      q <= 0 ||
      (!isSupervisor && (!Number.isFinite(rate) || rate < 0)) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.received_date || '')
    ) {
      return NextResponse.json({ success: false, error: 'Invalid received entry' }, { status: 400 });
    }

    try {
      await pool.query(`
        ALTER TABLE pm_material_received 
        ADD COLUMN IF NOT EXISTS bill_url text,
        ADD COLUMN IF NOT EXISTS bill_filename text,
        ADD COLUMN IF NOT EXISTS unit VARCHAR(50)
      `);
    } catch {}

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const actor = actorFromAdmin(auth.user || auth.agent);

      // If material_id is not provided, resolve or create in pm_materials by manualMatName
      if (!Number.isInteger(m) || m <= 0) {
        const findMat = await c.query('SELECT id, unit FROM pm_materials WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))', [manualMatName]);
        if (findMat.rows[0]) {
          m = Number(findMat.rows[0].id);
          if (selectedUnit && findMat.rows[0].unit !== selectedUnit) {
            await c.query('UPDATE pm_materials SET unit = $1 WHERE id = $2', [selectedUnit, m]);
          }
        } else {
          const unit = selectedUnit || 'bags';
          const createMat = await c.query(
            'INSERT INTO pm_materials (name, unit, category) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET is_active = TRUE, unit = EXCLUDED.unit RETURNING id',
            [manualMatName, unit, 'General']
          );
          m = Number(createMat.rows[0].id);
        }
      } else if (selectedUnit) {
        // Update pm_materials unit if provided and differs
        await c.query('UPDATE pm_materials SET unit = $1 WHERE id = $2 AND (unit IS NULL OR unit = \'\' OR unit <> $1)', [selectedUnit, m]);
      }

      // Resolve supplier name if supplier_id passed but supplier_name blank
      let resolvedSupplierName = String(b.supplier_name || '').trim() || null;
      const supplierId = b.supplier_id ? Number(b.supplier_id) : null;
      if (supplierId && !resolvedSupplierName) {
        const sRes = await c.query('SELECT shop_name, business_name FROM suppliers WHERE id = $1', [supplierId]);
        if (sRes.rows[0]) {
          resolvedSupplierName = sRes.rows[0].shop_name || sRes.rows[0].business_name || `Supplier #${supplierId}`;
        }
      }

      const amount = q * rate;
      const r = await c.query(
        `INSERT INTO pm_material_received(
           project_id, material_id, supplier_name, supplier_id, supplier_vendor_id, vendor_supply_id,
           quantity, rate, amount, received_date, challan_no, note, bill_url, bill_filename, created_by, unit
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         RETURNING *`,
        [
          p, m, resolvedSupplierName, supplierId, b.supplier_vendor_id || null, b.vendor_supply_id || null,
          q, rate, amount, b.received_date, b.challan_no || null, b.note || null,
          b.bill_url || null, b.bill_filename || null, actor, selectedUnit
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
