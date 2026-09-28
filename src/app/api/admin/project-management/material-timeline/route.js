import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema } from '@/lib/project-management';

export async function GET(req) {
  const admin = requireRole(req, ['admin', 'site_supervisor']);
  if (!admin) return unauthorized();

  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const projectId = Number(s.get('projectId'));
    const materialId = Number(s.get('materialId'));

    if (!Number.isInteger(projectId) || !Number.isInteger(materialId)) {
      return NextResponse.json({ success: false, error: 'projectId and materialId are required' }, { status: 400 });
    }

    const matRes = await pool.query(`SELECT * FROM pm_materials WHERE id = $1`, [materialId]);
    if (!matRes.rows[0]) {
      return NextResponse.json({ success: false, error: 'Material not found' }, { status: 404 });
    }

    const txRes = await pool.query(
      `SELECT 
         'received' AS type,
         id,
         received_date AS tx_date,
         quantity,
         rate,
         amount,
         supplier_name,
         challan_no,
         note,
         NULL AS used_for,
         NULL AS adjustment_type,
         NULL AS to_project_name,
         transfer_in,
         created_at
       FROM pm_material_received
       WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted

       UNION ALL

       SELECT
         'used' AS type,
         id,
         used_date AS tx_date,
         -quantity AS quantity,
         NULL AS rate,
         NULL AS amount,
         NULL AS supplier_name,
         NULL AS challan_no,
         note,
         used_for,
         NULL AS adjustment_type,
         NULL AS to_project_name,
         FALSE AS transfer_in,
         created_at
       FROM pm_material_used
       WHERE project_id = $1 AND material_id = $2 AND NOT is_deleted

       UNION ALL

       SELECT
         'adjustment' AS type,
         a.id,
         a.adjustment_date AS tx_date,
         -a.quantity AS quantity,
         NULL AS rate,
         NULL AS amount,
         NULL AS supplier_name,
         NULL AS challan_no,
         a.note,
         NULL AS used_for,
         a.adjustment_type,
         tp.name AS to_project_name,
         FALSE AS transfer_in,
         a.created_at
       FROM pm_material_adjustments a
       LEFT JOIN pm_projects tp ON tp.id = a.to_project_id
       WHERE a.project_id = $1 AND a.material_id = $2 AND NOT a.is_deleted

       ORDER BY tx_date ASC, created_at ASC`,
      [projectId, materialId]
    );

    const isSupervisor = admin.role === 'site_supervisor';
    let runningBalance = 0;
    const timeline = txRes.rows.map(tx => {
      runningBalance += Number(tx.quantity);
      return {
        ...tx,
        rate: isSupervisor ? null : tx.rate,
        amount: isSupervisor ? null : tx.amount,
        running_stock: Number(runningBalance.toFixed(3)),
      };
    });

    return NextResponse.json({
      success: true,
      material: matRes.rows[0],
      current_stock: Number(runningBalance.toFixed(3)),
      timeline: timeline.reverse(), // most recent first for display
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
