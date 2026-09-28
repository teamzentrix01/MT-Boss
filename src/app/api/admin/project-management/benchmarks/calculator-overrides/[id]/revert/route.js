import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementPhase5Schema, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

export async function POST(req, { params }) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid override ID' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const oldRes = await client.query(
        `SELECT * FROM pm_calculator_rate_overrides WHERE id = $1 FOR UPDATE`,
        [id]
      );
      if (!oldRes.rows[0]) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Override not found' }, { status: 404 });
      }
      const old = oldRes.rows[0];

      const updRes = await client.query(
        `UPDATE pm_calculator_rate_overrides
         SET reverted_at = NOW()
         WHERE id = $1 RETURNING *`,
        [id]
      );

      // Audit log
      await writePmPhase2Audit(
        client,
        'pm_calculator_rate_overrides',
        id,
        'revert_override',
        actorFromAdmin(admin),
        old,
        updRes.rows[0]
      );

      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: updRes.rows[0] });
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
