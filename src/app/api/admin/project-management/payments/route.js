import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmAudit, assertAgentAccess } from '@/lib/project-management';

function values(b) {
  const project = Number(b.project_id);
  const amount = Number(b.amount);
  return Number.isInteger(project) && Number.isFinite(amount) && amount > 0 && b.payment_date
    ? [project, amount, b.payment_date, String(b.mode || '').trim() || null, String(b.note || '').trim() || null, String(b.transaction_reference || '').trim() || null]
    : null;
}

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const { searchParams } = new URL(req.url);
    const projectId = Number(searchParams.get('projectId'));
    const { page, pageSize, offset } = pageParams(searchParams);

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, 'payments');
    if (!auth.allowed) return auth.response;

    const result = await pool.query(
      `WITH paged AS (
         SELECT pay.*, COUNT(*) OVER()::int total_count 
         FROM pm_party_payments pay 
         WHERE pay.project_id = $1 AND NOT pay.is_deleted 
         ORDER BY pay.payment_date DESC, pay.created_at DESC 
         LIMIT $2 OFFSET $3
       ) 
       SELECT * FROM paged ORDER BY payment_date DESC, created_at DESC`,
      [projectId, pageSize, offset]
    );

    const total = Number(result.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load payments' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureProjectManagementSchema();
    const body = await req.json();
    const v = values(body);
    if (!v) {
      return NextResponse.json({ success: false, error: 'Provide valid payment details' }, { status: 400 });
    }

    const projectId = v[0];
    const auth = await assertAgentAccess(req, projectId, 'payments');
    if (!auth.allowed) return auth.response;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const actor = actorFromAdmin(auth.user);
      const result = await client.query(
        `INSERT INTO pm_party_payments(project_id, amount, payment_date, mode, note, transaction_reference, created_by) 
         VALUES($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [...v, actor]
      );
      await writePmAudit(client, 'party_payment', result.rows[0].id, 'created', actor, null, result.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not create payment' }, { status: 500 });
  }
}
