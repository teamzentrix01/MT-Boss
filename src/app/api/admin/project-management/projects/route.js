import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementPhase5Schema, pageParams, actorFromAdmin, writePmAudit } from '@/lib/project-management';
import { recomputeProjectBenchmark } from '@/lib/pm-benchmarks';

function projectValues(body) {
  const name = String(body.name || '').trim();
  const partyId = Number(body.party_id);
  const contract = Number(body.contract_value);
  if (!name || !Number.isInteger(partyId) || !body.start_date || !Number.isFinite(contract) || contract < 0) return null;
  const area = body.built_up_area === '' || body.built_up_area == null ? null : Number(body.built_up_area);
  if (area !== null && (!Number.isFinite(area) || area < 0)) return null;
  const status = String(body.status || 'running');
  if (!['running', 'completed', 'on_hold'].includes(status)) return null;

  const projectType = body.project_type || null;
  const floors = body.floors ? Number(body.floors) : null;
  const qualityTier = body.quality_tier || null;
  const city = body.city?.trim() || null;
  const foundationType = body.foundation_type?.trim() || null;
  const includeInBenchmark = Boolean(body.include_in_benchmark);
  const completedDate = body.completed_date || null;
  const progressPercent = Number(body.progress_percent || 0);

  return [
    partyId,
    name,
    body.site_address?.trim() || null,
    body.start_date,
    body.expected_end_date || null,
    contract,
    area,
    status,
    projectType,
    floors,
    qualityTier,
    city,
    foundationType,
    includeInBenchmark,
    completedDate,
    progressPercent,
  ];
}

export async function GET(req) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const { searchParams } = new URL(req.url);
    const { page, pageSize, offset } = pageParams(searchParams);
    const partyId = searchParams.get('partyId') || '';
    const search = String(searchParams.get('search') || '').trim();
    const status = String(searchParams.get('status') || 'all');

    const result = await pool.query(
      `WITH paged AS (
         SELECT p.*, COUNT(*) OVER()::int total_count
         FROM pm_projects p
         WHERE ($1 = '' OR p.party_id = $1::bigint)
           AND ($2 = '' OR p.name ILIKE '%'||$2||'%' OR COALESCE(p.site_address,'') ILIKE '%'||$2||'%')
           AND ($3 = 'all' OR p.status = $3)
         ORDER BY p.created_at DESC
         LIMIT $4 OFFSET $5
       ),
       totals AS (
         SELECT project_id, SUM(amount) received
         FROM pm_party_payments
         WHERE NOT is_deleted AND project_id IN (SELECT id FROM paged)
         GROUP BY project_id
       )
       SELECT p.*, pa.name party_name, COALESCE(t.received, 0) received, p.contract_value - COALESCE(t.received, 0) pending
       FROM paged p
       JOIN pm_parties pa ON pa.id = p.party_id
       LEFT JOIN totals t ON t.project_id = p.id
       ORDER BY p.created_at DESC`,
      [partyId, search, status, pageSize, offset]
    );

    const total = Number(result.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load projects' }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const values = projectValues(await req.json());
    if (!values) return NextResponse.json({ success: false, error: 'Provide valid project details' }, { status: 400 });

    const client = await pool.connect();
    let newProject;
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `INSERT INTO pm_projects(
           party_id, name, site_address, start_date, expected_end_date, contract_value, built_up_area, status,
           project_type, floors, quality_tier, city, foundation_type, include_in_benchmark, completed_date, progress_percent
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
         RETURNING *`,
        values
      );
      newProject = result.rows[0];
      await writePmAudit(client, 'project', newProject.id, 'created', actorFromAdmin(admin), null, newProject);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    // Automatically trigger benchmark calculation
    try {
      await recomputeProjectBenchmark(newProject.id);
    } catch (e) {
      console.warn('Initial benchmark computation failed:', e.message);
    }

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not create project' }, { status: 500 });
  }
}
