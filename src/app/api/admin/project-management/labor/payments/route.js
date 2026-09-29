import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

const okDate = (x) => /^\d{4}-\d{2}-\d{2}$/.test(String(x || '')) && !Number.isNaN(Date.parse(x));

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const projectId = Number(s.get('projectId'));
    const laborId = s.get('laborId') || '';
    const from = s.get('from') || null;
    const to = s.get('to') || null;

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const r = await pool.query(
      `SELECT lp.*, l.name AS labor_name, l.trade, l.vendor_id, v.name AS vendor_name,
              COUNT(*) OVER()::int AS total_count
       FROM pm_labor_payments lp
       JOIN pm_labor l ON l.id = lp.labor_id
       LEFT JOIN pm_vendors v ON v.id = l.vendor_id
       WHERE l.project_id = $1
         AND NOT lp.is_deleted
         AND ($2 = '' OR lp.labor_id = $2::bigint)
         AND ($3::date IS NULL OR lp.payment_date >= $3)
         AND ($4::date IS NULL OR lp.payment_date <= $4)
       ORDER BY lp.payment_date DESC, lp.created_at DESC
       LIMIT $5 OFFSET $6`,
      [projectId, laborId, from, to, pageSize, offset]
    );

    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: r.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Could not load labor payments' }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const laborId = Number(b.labor_id);
    const amount = Number(b.amount);
    const paymentDate = String(b.payment_date || '');
    const mode = b.mode ? String(b.mode).trim() : 'cash';
    const note = b.note ? String(b.note).trim() : null;

    if (!Number.isInteger(laborId) || laborId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid labor_id is required' }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Valid payment amount (> 0) is required' }, { status: 400 });
    }
    if (!okDate(paymentDate)) {
      return NextResponse.json({ success: false, error: 'Valid payment_date (YYYY-MM-DD) is required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const actor = actorFromAdmin(admin);
      const r = await client.query(
        `INSERT INTO pm_labor_payments(labor_id, amount, payment_date, mode, note, created_by)
         VALUES($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [laborId, amount, paymentDate, mode, note, actor]
      );
      await writePmPhase2Audit(client, 'pm_labor_payments', r.rows[0].id, 'created', actor, null, r.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: r.rows[0] }, { status: 201 });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Could not create labor payment' }, { status: 500 });
  }
}
