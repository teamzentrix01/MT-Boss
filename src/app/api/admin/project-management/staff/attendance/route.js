import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureStaffSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

const validDate = (x) => /^\d{4}-\d{2}-\d{2}$/.test(String(x || '')) && !Number.isNaN(Date.parse(x));

export async function GET(req) {
  try {
    await ensureStaffSchema();
    const s = new URL(req.url).searchParams;
    const staffId = Number(s.get('staffId'));
    const projectId = Number(s.get('projectId') || s.get('project_id'));
    const date = s.get('date');
    const month = s.get('month') || '';

    // Mode 1: Individual staff attendance history
    if (Number.isInteger(staffId) && staffId > 0) {
      const staffRes = await pool.query('SELECT project_id, name, role, pay_type, salary_rate FROM pm_project_staff WHERE id = $1', [staffId]);
      if (!staffRes.rows[0]) {
        return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
      }

      const auth = await assertAgentAccess(req, staffRes.rows[0].project_id, null);
      if (!auth.allowed) return auth.response;

      const r = await pool.query(
        `SELECT sa.*, st.name AS staff_name, st.role, st.pay_type, st.salary_rate
         FROM pm_staff_attendance sa
         JOIN pm_project_staff st ON st.id = sa.staff_id
         WHERE sa.staff_id = $1
           AND ($2 = '' OR TO_CHAR(sa.attendance_date, 'YYYY-MM') = $2)
         ORDER BY sa.attendance_date DESC`,
        [staffId, month]
      );

      return NextResponse.json({ success: true, data: r.rows, staff: staffRes.rows[0] });
    }

    // Mode 2: Project-wide attendance for a specific date or recent list
    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, null);
    if (!auth.allowed) return auth.response;

    // Load recent history (last 100 entries)
    const hist = await pool.query(
      `SELECT sa.*, st.name AS staff_name, st.role, st.phone, st.pay_type, st.salary_rate
       FROM pm_staff_attendance sa
       JOIN pm_project_staff st ON st.id = sa.staff_id
       WHERE sa.project_id = $1
         AND ($2 = '' OR TO_CHAR(sa.attendance_date, 'YYYY-MM') = $2)
       ORDER BY sa.attendance_date DESC, sa.created_at DESC
       LIMIT 100`,
      [projectId, month]
    );

    if (validDate(date)) {
      // Return all active staff with their attendance record for this date
      const r = await pool.query(
        `SELECT st.id AS staff_id, st.name AS staff_name, st.role, st.phone, st.pay_type, st.salary_rate,
                sa.id AS attendance_id,
                COALESCE(sa.status, 'unmarked') AS status,
                COALESCE(sa.shift_type, 'day') AS shift_type,
                sa.attendance_date,
                COALESCE(sa.wage_amount, 0) AS wage_amount,
                COALESCE(sa.overtime_hours, 0) AS overtime_hours,
                COALESCE(sa.overtime_amount, 0) AS overtime_amount,
                sa.note,
                sa.created_by,
                (sa.status IS NOT NULL) AS is_marked
         FROM pm_project_staff st
         LEFT JOIN pm_staff_attendance sa ON sa.staff_id = st.id AND sa.attendance_date = $2
         WHERE st.project_id = $1 AND st.is_active = TRUE
         ORDER BY st.name ASC`,
        [projectId, date]
      );
      return NextResponse.json({ success: true, data: r.rows, history: hist.rows, date });
    }

    return NextResponse.json({ success: true, data: hist.rows, history: hist.rows });
  } catch (e) {
    console.error("STAFF ATTENDANCE GET ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not load staff attendance' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureStaffSchema();
    const b = await req.json();

    const rawList = Array.isArray(b) ? b : (Array.isArray(b.entries) ? b.entries : (Array.isArray(b.records) ? b.records : null));
    const items = rawList || [b];

    if (!items.length) {
      return NextResponse.json({ success: false, error: 'No attendance records provided' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const results = [];

      for (const item of items) {
        const staffId = Number(item.staff_id || item.staffId);
        const attendanceDate = String(item.attendance_date || item.date || b.attendance_date || '');
        const status = String(item.status || 'present').toLowerCase().trim();
        const shiftType = String(item.shift_type || 'day').toLowerCase().trim();
        const note = item.note ? String(item.note).trim() : null;
        const overtimeHours = Number(item.overtime_hours || 0);

        if (!Number.isInteger(staffId) || staffId <= 0 || !validDate(attendanceDate) || !['present', 'absent', 'half_day'].includes(status)) {
          continue;
        }

        const stRes = await c.query('SELECT project_id, pay_type, salary_rate FROM pm_project_staff WHERE id = $1', [staffId]);
        if (!stRes.rows[0]) continue;
        const staff = stRes.rows[0];

        const auth = await assertAgentAccess(req, staff.project_id, null);
        if (!auth.allowed) {
          await c.query('ROLLBACK');
          return auth.response;
        }
        const actor = actorFromAdmin(auth.user || auth.agent);

        const shiftMultiplier = shiftType === 'double' ? 2 : 1;
        let wageAmount = 0;
        if (staff.pay_type === 'per_day') {
          const dailyRate = Number(staff.salary_rate || 0);
          if (status === 'present') wageAmount = dailyRate * shiftMultiplier;
          else if (status === 'half_day') wageAmount = dailyRate * 0.5;
        } else {
          // Monthly or fixed fee: pro-rated daily wage
          const dailyApprox = Number(staff.salary_rate || 0) / 30;
          if (status === 'present') wageAmount = Math.round(dailyApprox * shiftMultiplier);
          else if (status === 'half_day') wageAmount = Math.round(dailyApprox * 0.5);
        }

        let overtimeAmount = 0;
        if (overtimeHours > 0) {
          const hourlyRate = staff.salary_rate > 0 ? (Number(staff.salary_rate) / (staff.pay_type === 'monthly' ? 240 : 8)) : 0;
          overtimeAmount = Math.round(hourlyRate * overtimeHours);
        }

        const r = await c.query(
          `INSERT INTO pm_staff_attendance(
             project_id, staff_id, attendance_date, status, shift_type, wage_amount,
             overtime_hours, overtime_amount, note, created_by
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (staff_id, attendance_date)
           DO UPDATE SET
             status = EXCLUDED.status,
             shift_type = EXCLUDED.shift_type,
             wage_amount = EXCLUDED.wage_amount,
             overtime_hours = EXCLUDED.overtime_hours,
             overtime_amount = EXCLUDED.overtime_amount,
             note = EXCLUDED.note,
             created_by = EXCLUDED.created_by
           RETURNING *`,
          [staff.project_id, staffId, attendanceDate, status, shiftType, wageAmount, overtimeHours, overtimeAmount, note, actor]
        );

        await writePmPhase2Audit(c, 'pm_staff_attendance', r.rows[0].id, 'upsert', actor, null, r.rows[0]);
        results.push(r.rows[0]);
      }

      await c.query('COMMIT');
      return NextResponse.json({ success: true, data: results.length === 1 ? results[0] : results, count: results.length });
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
  } catch (e) {
    console.error("STAFF ATTENDANCE POST ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not mark staff attendance' }, { status: 500 });
  }
}
