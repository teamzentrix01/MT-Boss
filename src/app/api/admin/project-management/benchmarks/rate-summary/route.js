import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase5Schema } from '@/lib/project-management';
import { recomputeAllRateSummaries } from '@/lib/pm-benchmarks';

export async function GET(req) {
  if (!await requirePmAccess(req)) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const sp = new URL(req.url).searchParams;
    const projectType = sp.get('type') || '';
    const qualityTier = sp.get('quality') || '';
    const city = sp.get('city') || '';

    const res = await pool.query(
      `SELECT
         id, segment_key, project_type, quality_tier, floors_bucket, city,
         metric, median, min, max, sample_count, confidence, computed_at
       FROM pm_rate_summary
       WHERE ($1 = '' OR project_type = $1 OR project_type IS NULL)
         AND ($2 = '' OR quality_tier = $2 OR quality_tier IS NULL)
         AND ($3 = '' OR city = $3 OR city IS NULL)
       ORDER BY segment_key, metric`,
      [projectType, qualityTier, city]
    );

    // Also get overall counts of benchmarked projects
    const statsRes = await pool.query(
      `SELECT
         COUNT(*)::int AS total_projects,
         COUNT(*) FILTER (WHERE include_in_benchmark = true)::int AS benchmark_included,
         COUNT(*) FILTER (WHERE status = 'completed')::int AS completed_projects,
         COUNT(*) FILTER (WHERE include_in_benchmark = true AND (status = 'completed' OR progress_percent >= 90))::int AS active_sample_pool
       FROM pm_projects`
    );

    return NextResponse.json({
      success: true,
      stats: statsRes.rows[0] || {},
      data: res.rows,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!await requirePmAccess(req)) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const result = await recomputeAllRateSummaries();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
