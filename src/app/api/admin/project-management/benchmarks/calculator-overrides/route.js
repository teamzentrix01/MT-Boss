import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase5Schema, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

export async function GET(req) {
  if (!await requirePmAccess(req)) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const res = await pool.query(
      `SELECT id, metric_key, quality_tier, old_value, new_value, applied_by, applied_at, reverted_at, note
       FROM pm_calculator_rate_overrides
       ORDER BY applied_at DESC
       LIMIT 100`
    );
    return NextResponse.json({ success: true, data: res.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const body = await req.json();
    const { metric_key, quality_tier, old_value, new_value, note } = body;

    if (!metric_key || new_value === undefined || new_value === null) {
      return NextResponse.json({ success: false, error: 'metric_key and new_value required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Revert any currently active override for this metric + tier
      await client.query(
        `UPDATE pm_calculator_rate_overrides
         SET reverted_at = NOW()
         WHERE metric_key = $1 AND (quality_tier = $2 OR (quality_tier IS NULL AND $2 IS NULL)) AND reverted_at IS NULL`,
        [metric_key, quality_tier || null]
      );

      // Insert new override
      const insertRes = await client.query(
        `INSERT INTO pm_calculator_rate_overrides (
           metric_key, quality_tier, old_value, new_value, applied_by, applied_at, note
         ) VALUES ($1, $2, $3, $4, $5, NOW(), $6)
         RETURNING *`,
        [metric_key, quality_tier || null, Number(old_value || 0), Number(new_value), actorFromAdmin(admin), note || null]
      );

      const created = insertRes.rows[0];

      // Audit log
      await writePmPhase2Audit(
        client,
        'pm_calculator_rate_overrides',
        created.id,
        'apply_override',
        actorFromAdmin(admin),
        null,
        created
      );

      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: created });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
