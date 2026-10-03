import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase5Schema, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';
import { recomputeProjectBenchmark } from '@/lib/pm-benchmarks';

export async function PATCH(req, { params }) {
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const pid = Number((await params).id);
    if (!Number.isInteger(pid) || pid <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid project ID' }, { status: 400 });
    }

    const body = await req.json();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const oldRes = await client.query('SELECT * FROM pm_projects WHERE id = $1 FOR UPDATE', [pid]);
      if (!oldRes.rows[0]) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
      }
      const old = oldRes.rows[0];

      const updates = [];
      const values = [];
      let i = 1;

      if (body.include_in_benchmark !== undefined) {
        updates.push(`include_in_benchmark = $${i++}`);
        values.push(Boolean(body.include_in_benchmark));
      }
      if (body.project_type !== undefined) {
        updates.push(`project_type = $${i++}`);
        values.push(body.project_type || null);
      }
      if (body.floors !== undefined) {
        updates.push(`floors = $${i++}`);
        values.push(body.floors ? Number(body.floors) : null);
      }
      if (body.quality_tier !== undefined) {
        updates.push(`quality_tier = $${i++}`);
        values.push(body.quality_tier || null);
      }
      if (body.city !== undefined) {
        updates.push(`city = $${i++}`);
        values.push(body.city || null);
      }
      if (body.foundation_type !== undefined) {
        updates.push(`foundation_type = $${i++}`);
        values.push(body.foundation_type || null);
      }
      if (body.progress_percent !== undefined) {
        updates.push(`progress_percent = $${i++}`);
        values.push(Number(body.progress_percent || 0));
      }
      if (body.completed_date !== undefined) {
        updates.push(`completed_date = $${i++}`);
        values.push(body.completed_date || null);
      }
      if (body.status !== undefined) {
        updates.push(`status = $${i++}`);
        values.push(body.status);
      }

      if (updates.length > 0) {
        values.push(pid);
        const updRes = await client.query(
          `UPDATE pm_projects SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
          values
        );
        await writePmPhase2Audit(
          client,
          'pm_projects',
          pid,
          'benchmark_update',
          actorFromAdmin(admin),
          old,
          updRes.rows[0]
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    // Recompute benchmark after update
    const recomputed = await recomputeProjectBenchmark(pid);

    return NextResponse.json({ success: true, data: recomputed });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
