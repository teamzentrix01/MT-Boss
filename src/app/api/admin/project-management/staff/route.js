import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureStaffSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

export async function GET(req) {
  try {
    await ensureStaffSchema();
    const s = new URL(req.url).searchParams;
    const projectId = Number(s.get('projectId') || s.get('project_id'));
    const search = String(s.get('search') || '').trim();
    const activeOnly = s.get('activeOnly') !== 'false';
    const roleFilter = String(s.get('role') || '').trim();
    const { page, pageSize, offset } = pageParams(s);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, null);
    if (!auth.allowed) return auth.response;

    const r = await pool.query(
      `WITH att_stats AS (
         SELECT sa.staff_id,
                COUNT(*) FILTER (WHERE sa.status = 'present') AS days_present,
                COUNT(*) FILTER (WHERE sa.status = 'half_day') AS days_half_day,
                COUNT(*) FILTER (WHERE sa.status = 'absent') AS days_absent,
                COALESCE(SUM(sa.wage_amount), 0) AS att_wages,
                COALESCE(SUM(sa.overtime_amount), 0) AS overtime_earned
         FROM pm_staff_attendance sa
         JOIN pm_project_staff st ON st.id = sa.staff_id
         WHERE st.project_id = $1
         GROUP BY sa.staff_id
       ),
       pay_stats AS (
         SELECT sp.staff_id,
                COALESCE(SUM(sp.amount), 0) AS total_paid,
                COALESCE(SUM(sp.amount) FILTER (WHERE sp.payment_type IN ('salary', 'advance')), 0) AS salary_paid,
                COALESCE(SUM(sp.amount) FILTER (WHERE sp.payment_type = 'commission'), 0) AS commission_paid,
                COALESCE(SUM(sp.amount) FILTER (WHERE sp.payment_type = 'bonus'), 0) AS bonus_paid
         FROM pm_staff_payments sp
         JOIN pm_project_staff st ON st.id = sp.staff_id
         WHERE st.project_id = $1 AND NOT sp.is_deleted
         GROUP BY sp.staff_id
       ),
       paged AS (
         SELECT st.*,
                COALESCE(att.days_present, 0)::int AS days_present,
                COALESCE(att.days_half_day, 0)::int AS days_half_day,
                COALESCE(att.days_absent, 0)::int AS days_absent,
                COALESCE(att.att_wages, 0)::numeric AS att_wages,
                COALESCE(att.overtime_earned, 0)::numeric AS overtime_earned,
                -- Total earned calculation based on pay_type
                CASE
                  WHEN st.pay_type = 'per_day' THEN (COALESCE(att.att_wages, 0) + COALESCE(att.overtime_earned, 0))
                  WHEN st.pay_type = 'monthly' THEN (st.salary_rate + COALESCE(att.overtime_earned, 0))
                  ELSE st.salary_rate
                END::numeric AS total_salary_earned,
                st.commission_rate AS total_commission_earned,
                COALESCE(p.total_paid, 0)::numeric AS total_paid,
                COALESCE(p.salary_paid, 0)::numeric AS salary_paid,
                COALESCE(p.commission_paid, 0)::numeric AS commission_paid,
                COALESCE(p.bonus_paid, 0)::numeric AS bonus_paid,
                (
                  (CASE
                    WHEN st.pay_type = 'per_day' THEN (COALESCE(att.att_wages, 0) + COALESCE(att.overtime_earned, 0))
                    WHEN st.pay_type = 'monthly' THEN (st.salary_rate + COALESCE(att.overtime_earned, 0))
                    ELSE st.salary_rate
                  END)
                  + COALESCE(st.commission_rate, 0)
                  - COALESCE(p.total_paid, 0)
                )::numeric AS balance_due,
                COUNT(*) OVER()::int AS total_count
         FROM pm_project_staff st
         LEFT JOIN att_stats att ON att.staff_id = st.id
         LEFT JOIN pay_stats p ON p.staff_id = st.id
         WHERE st.project_id = $1
           AND ($2 = '' OR st.name ILIKE '%'||$2||'%' OR COALESCE(st.phone,'') ILIKE '%'||$2||'%' OR st.role ILIKE '%'||$2||'%')
           AND ($3 = false OR st.is_active = TRUE)
           AND ($4 = '' OR st.role ILIKE '%'||$4||'%')
         ORDER BY st.is_active DESC, st.created_at DESC
         LIMIT $5 OFFSET $6
       )
       SELECT * FROM paged`,
      [projectId, search, activeOnly, roleFilter, pageSize, offset]
    );

    const total = Number(r.rows[0]?.total_count || 0);

    // Calculate project-level staff summary
    const summaryRes = await pool.query(
      `WITH att_tot AS (
         SELECT COUNT(*) FILTER (WHERE sa.status = 'present') AS total_present,
                COUNT(*) FILTER (WHERE sa.status = 'half_day') AS total_half_day
         FROM pm_staff_attendance sa
         JOIN pm_project_staff st ON st.id = sa.staff_id
         WHERE st.project_id = $1
       ),
       pay_tot AS (
         SELECT COALESCE(SUM(amount), 0) AS total_paid,
                COALESCE(SUM(amount) FILTER (WHERE payment_type = 'commission'), 0) AS total_commission_paid
         FROM pm_staff_payments
         WHERE project_id = $1 AND NOT is_deleted
       ),
       staff_tot AS (
         SELECT COUNT(*) AS total_staff,
                COALESCE(SUM(commission_rate), 0) AS total_commission_allocated
         FROM pm_project_staff
         WHERE project_id = $1 AND is_active = TRUE
       )
       SELECT staff_tot.total_staff,
              att_tot.total_present,
              att_tot.total_half_day,
              pay_tot.total_paid,
              pay_tot.total_commission_paid,
              staff_tot.total_commission_allocated
       FROM staff_tot, att_tot, pay_tot`,
      [projectId]
    );

    const summary = summaryRes.rows[0] || {
      total_staff: 0,
      total_present: 0,
      total_half_day: 0,
      total_paid: 0,
      total_commission_paid: 0,
      total_commission_allocated: 0
    };

    return NextResponse.json({
      success: true,
      data: r.rows,
      summary,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
    });
  } catch (e) {
    console.error("PROJECT STAFF GET ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not load project staff' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureStaffSchema();
    const b = await req.json();
    const projectId = Number(b.project_id || b.projectId);
    const name = String(b.name || '').trim();
    const phone = b.phone ? String(b.phone).trim() : null;
    const role = b.role ? String(b.role).trim() : 'Site Supervisor';
    const payType = ['monthly', 'per_day', 'fixed_fee'].includes(b.pay_type) ? b.pay_type : 'monthly';
    const salaryRate = Number(b.salary_rate || 0);
    const commissionRate = Number(b.commission_rate || 0);
    const commissionNotes = b.commission_notes ? String(b.commission_notes).trim() : null;
    const isActive = b.is_active !== undefined ? Boolean(b.is_active) : true;

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid project_id is required' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ success: false, error: 'Staff name is required' }, { status: 400 });
    }
    if (!Number.isFinite(salaryRate) || salaryRate < 0) {
      return NextResponse.json({ success: false, error: 'Valid salary/rate (>= 0) is required' }, { status: 400 });
    }
    if (!Number.isFinite(commissionRate) || commissionRate < 0) {
      return NextResponse.json({ success: false, error: 'Valid commission rate (>= 0) is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, null);
    if (!auth.allowed) return auth.response;

    const actor = actorFromAdmin(auth.user || auth.agent);

    const c = await pool.connect();
    try {
      await c.query('BEGIN');

      // Duplicate prevention: check if active staff member with same name exists in this project
      const dup = await c.query(
        `SELECT id, name FROM pm_project_staff
         WHERE project_id = $1 AND is_active = TRUE AND LOWER(TRIM(name)) = LOWER($2)`,
        [projectId, name]
      );
      if (dup.rows[0]) {
        await c.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: `Staff member "${dup.rows[0].name}" is already assigned to this project.`
        }, { status: 400 });
      }

      const ins = await c.query(
        `INSERT INTO pm_project_staff(
           project_id, name, phone, role, pay_type, salary_rate,
           commission_rate, commission_notes, is_active, created_by
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [projectId, name, phone, role, payType, salaryRate, commissionRate, commissionNotes, isActive, actor]
      );

      await writePmPhase2Audit(c, 'pm_project_staff', ins.rows[0].id, 'created', actor, null, ins.rows[0]);
      await c.query('COMMIT');

      return NextResponse.json({ success: true, data: ins.rows[0] }, { status: 201 });
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
  } catch (e) {
    console.error("PROJECT STAFF POST ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not save staff member' }, { status: 500 });
  }
}

