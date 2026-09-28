import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementPhase5Schema, pageParams } from '@/lib/project-management';
import { recomputeProjectBenchmark, recomputeAllRateSummaries } from '@/lib/pm-benchmarks';

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const sp = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(sp);
    const search = (sp.get('search') || '').trim();
    const type = sp.get('type') || '';
    const quality = sp.get('quality') || '';
    const benchmarkOnly = sp.get('benchmarkOnly') === 'true';

    const countRes = await pool.query(
      `SELECT COUNT(*)::int AS total FROM pm_projects p
       WHERE ($1 = '' OR p.name ILIKE '%'||$1||'%' OR COALESCE(p.site_address,'') ILIKE '%'||$1||'%')
         AND ($2 = '' OR p.project_type = $2)
         AND ($3 = '' OR p.quality_tier = $3)
         AND ($4 = false OR p.include_in_benchmark = true)`,
      [search, type, quality, benchmarkOnly]
    );
    const total = countRes.rows[0]?.total || 0;

    const result = await pool.query(
      `SELECT
         p.id, p.name, p.status, p.project_type, p.floors, p.quality_tier, p.city,
         p.foundation_type, p.include_in_benchmark, p.progress_percent, p.completed_date,
         p.start_date, p.expected_end_date, p.contract_value, p.built_up_area,
         pa.name AS party_name,
         pb.labour_cost, pb.vendor_material_cost, pb.direct_material_cost, pb.other_cost,
         pb.total_cost, pb.cost_per_sqft, pb.labour_per_sqft, pb.material_per_sqft,
         pb.other_per_sqft, pb.computed_at AS benchmark_computed_at,
         pb.data_quality_flags
       FROM pm_projects p
       JOIN pm_parties pa ON pa.id = p.party_id
       LEFT JOIN pm_project_benchmarks pb ON pb.project_id = p.id
       WHERE ($1 = '' OR p.name ILIKE '%'||$1||'%' OR COALESCE(p.site_address,'') ILIKE '%'||$1||'%')
         AND ($2 = '' OR p.project_type = $2)
         AND ($3 = '' OR p.quality_tier = $3)
         AND ($4 = false OR p.include_in_benchmark = true)
       ORDER BY p.include_in_benchmark DESC, p.created_at DESC
       LIMIT $5 OFFSET $6`,
      [search, type, quality, benchmarkOnly, pageSize, offset]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const body = await req.json().catch(() => ({}));
    const projectId = body.projectId ? Number(body.projectId) : null;

    if (projectId) {
      const res = await recomputeProjectBenchmark(projectId);
      return NextResponse.json({ success: true, data: res });
    }

    const res = await recomputeAllRateSummaries();
    return NextResponse.json({ success: true, data: res });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
