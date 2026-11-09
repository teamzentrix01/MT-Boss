import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureStaffSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

const okDate = (x) => /^\d{4}-\d{2}-\d{2}$/.test(String(x || '')) && !Number.isNaN(Date.parse(x));

export async function GET(req) {
  try {
    await ensureStaffSchema();
    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const projectId = Number(s.get('projectId') || s.get('project_id'));
    const staffId = s.get('staffId') || '';
    const paymentType = s.get('paymentType') || '';
    const from = s.get('from') || null;
    const to = s.get('to') || null;

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, null);
    if (!auth.allowed) return auth.response;

    const r = await pool.query(
      `SELECT sp.*, st.name AS staff_name, st.role, st.phone, st.pay_type,
              COUNT(*) OVER()::int AS total_count
       FROM pm_staff_payments sp
       JOIN pm_project_staff st ON st.id = sp.staff_id
       WHERE sp.project_id = $1
         AND NOT sp.is_deleted
         AND ($2 = '' OR sp.staff_id = $2::bigint)
         AND ($3 = '' OR sp.payment_type = $3)
         AND ($4::date IS NULL OR sp.payment_date >= $4)
         AND ($5::date IS NULL OR sp.payment_date <= $5)
       ORDER BY sp.payment_date DESC, sp.created_at DESC
       LIMIT $6 OFFSET $7`,
      [projectId, staffId, paymentType, from, to, pageSize, offset]
    );

    const total = Number(r.rows[0]?.total_count || 0);

    // Payments summary
    const sumRes = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_amount,
              COALESCE(SUM(amount) FILTER (WHERE payment_type IN ('salary', 'advance')), 0) AS salary_amount,
              COALESCE(SUM(amount) FILTER (WHERE payment_type = 'commission'), 0) AS commission_amount,
              COALESCE(SUM(amount) FILTER (WHERE payment_type = 'bonus'), 0) AS bonus_amount
       FROM pm_staff_payments
       WHERE project_id = $1 AND NOT is_deleted
         AND ($2 = '' OR staff_id = $2::bigint)`,
      [projectId, staffId]
    );

    return NextResponse.json({
      success: true,
      data: r.rows,
      summary: sumRes.rows[0] || { total_amount: 0, salary_amount: 0, commission_amount: 0, bonus_amount: 0 },
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
    });
  } catch (e) {
    console.error("STAFF PAYMENTS GET ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not load staff payments' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureStaffSchema();
    const b = await req.json();
    const staffId = Number(b.staff_id || b.staffId);
    const amount = Number(b.amount);
    const paymentDate = String(b.payment_date || '');
    const paymentType = ['salary', 'advance', 'commission', 'bonus', 'reimbursement'].includes(b.payment_type) ? b.payment_type : 'salary';
    const mode = b.mode ? String(b.mode).trim() : 'bank';
    const note = b.note ? String(b.note).trim() : null;
    const transactionReference = b.transaction_reference ? String(b.transaction_reference).trim() : null;

    if (!Number.isInteger(staffId) || staffId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid staff_id is required' }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Valid payment amount (> 0) is required' }, { status: 400 });
    }
    if (!okDate(paymentDate)) {
      return NextResponse.json({ success: false, error: 'Valid payment_date (YYYY-MM-DD) is required' }, { status: 400 });
    }

    const stRes = await pool.query('SELECT project_id, name FROM pm_project_staff WHERE id = $1', [staffId]);
    if (!stRes.rows[0]) {
      return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
    }

    const projectId = stRes.rows[0].project_id;
    const auth = await assertAgentAccess(req, projectId, null);
    if (!auth.allowed) return auth.response;

    const actor = actorFromAdmin(auth.user || auth.agent);

    const c = await pool.connect();
    try {
      await c.query('BEGIN');

      // Duplicate guard: prevent saving identical active payment within 30 seconds
      const dupCheck = await c.query(
        `SELECT id FROM pm_staff_payments
         WHERE staff_id = $1
           AND amount = $2
           AND payment_date = $3
           AND payment_type = $4
           AND NOT is_deleted
           AND created_at > NOW() - INTERVAL '30 seconds'`,
        [staffId, amount, paymentDate, paymentType]
      );
      if (dupCheck.rows[0]) {
        await c.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: 'A payment with identical details was just recorded. Duplicate prevented.'
        }, { status: 400 });
      }

      const ins = await c.query(
        `INSERT INTO pm_staff_payments(
           project_id, staff_id, amount, payment_date, payment_type,
           mode, transaction_reference, note, created_by
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [projectId, staffId, amount, paymentDate, paymentType, mode, transactionReference, note, actor]
      );

      await writePmPhase2Audit(c, 'pm_staff_payments', ins.rows[0].id, 'created', actor, null, ins.rows[0]);
      await c.query('COMMIT');

      return NextResponse.json({ success: true, data: ins.rows[0] }, { status: 201 });
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
  } catch (e) {
    console.error("STAFF PAYMENTS POST ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not record staff payment' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await ensureStaffSchema();
    const s = new URL(req.url).searchParams;
    const paymentId = Number(s.get('id'));

    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid payment id is required' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query('SELECT * FROM pm_staff_payments WHERE id = $1 FOR UPDATE', [paymentId])).rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
      }

      const auth = await assertAgentAccess(req, old.project_id, null);
      if (!auth.allowed) {
        await c.query('ROLLBACK');
        return auth.response;
      }

      const actor = actorFromAdmin(auth.user || auth.agent);
      await c.query('UPDATE pm_staff_payments SET is_deleted = TRUE, updated_at = NOW() WHERE id = $1', [paymentId]);
      await writePmPhase2Audit(c, 'pm_staff_payments', paymentId, 'deleted', actor, old, null);
      await c.query('COMMIT');

      return NextResponse.json({ success: true, message: 'Payment deleted successfully' });
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
  } catch (e) {
    console.error("STAFF PAYMENTS DELETE ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not delete staff payment' }, { status: 500 });
  }
}

