import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementPhase5Schema } from '@/lib/project-management';

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const sp = new URL(req.url).searchParams;
    const materialId = sp.get('materialId') || '';
    const city = sp.get('city') || '';
    const supplier = sp.get('supplier') || '';

    // 1. Fetch options for dropdown filters
    const [materialsRes, citiesRes, suppliersRes] = await Promise.all([
      pool.query(`SELECT id, name, unit, benchmark_key FROM pm_materials ORDER BY name`),
      pool.query(`SELECT DISTINCT city FROM pm_projects WHERE city IS NOT NULL AND city != '' ORDER BY city`),
      pool.query(`SELECT DISTINCT supplier_name FROM pm_material_received WHERE supplier_name IS NOT NULL AND supplier_name != '' AND NOT is_deleted ORDER BY supplier_name`),
    ]);

    // 2. Fetch monthly trend
    // Last 12 months by default
    const trendsRes = await pool.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', mr.received_date), 'YYYY-MM') AS month_key,
         TO_CHAR(DATE_TRUNC('month', mr.received_date), 'Mon YYYY') AS month_label,
         m.id AS material_id,
         m.name AS material_name,
         m.unit,
         m.benchmark_key,
         SUM(mr.quantity) AS total_quantity,
         SUM(mr.amount) AS total_amount,
         ROUND((SUM(mr.amount) / NULLIF(SUM(mr.quantity), 0))::numeric, 2) AS avg_rate
       FROM pm_material_received mr
       JOIN pm_materials m ON m.id = mr.material_id
       JOIN pm_projects p ON p.id = mr.project_id
       WHERE NOT mr.is_deleted
         AND NOT mr.transfer_in
         AND mr.received_date >= CURRENT_DATE - INTERVAL '12 months'
         AND ($1 = '' OR mr.material_id = $1::bigint)
         AND ($2 = '' OR p.city ILIKE '%'||$2||'%')
         AND ($3 = '' OR mr.supplier_name ILIKE '%'||$3||'%')
       GROUP BY DATE_TRUNC('month', mr.received_date), m.id, m.name, m.unit, m.benchmark_key
       ORDER BY month_key ASC, m.name ASC`,
      [materialId, city, supplier]
    );

    return NextResponse.json({
      success: true,
      filters: {
        materials: materialsRes.rows,
        cities: citiesRes.rows.map((r) => r.city),
        suppliers: suppliersRes.rows.map((r) => r.supplier_name),
      },
      data: trendsRes.rows,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
