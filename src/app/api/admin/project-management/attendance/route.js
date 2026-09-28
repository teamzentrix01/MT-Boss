import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

const validDate = (x) => /^\d{4}-\d{2}-\d{2}$/.test(String(x || '')) && !Number.isNaN(Date.parse(x));

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const projectVendorId = Number(s.get('projectVendorId'));

    // Mode 1: Vendor-specific attendance history (for calendar & detail view)
    if (Number.isInteger(projectVendorId) && projectVendorId > 0) {
      const month = s.get('month') || ''; // 'YYYY-MM'
      const r = await pool.query(
        `SELECT a.*, pv.daily_rate, v.name AS vendor_name, v.trade
         FROM pm_attendance a
         JOIN pm_project_vendors pv ON pv.id = a.project_vendor_id
         JOIN pm_vendors v ON v.id = pv.vendor_id
         WHERE a.project_vendor_id = $1
           AND ($2 = '' OR TO_CHAR(a.attendance_date, 'YYYY-MM') = $2)
         ORDER BY a.attendance_date ASC`,
        [projectVendorId, month]
      );
      return NextResponse.json({ success: true, data: r.rows });
    }

    // Mode 2: Project-wide daily attendance for bulk marking
    const { page, pageSize, offset } = pageParams(s);
    const project = Number(s.get('projectId'));
    const date = s.get('date');
    if (!Number.isInteger(project) || !validDate(date)) {
      return NextResponse.json({ success: false, error: 'projectId and valid date (or projectVendorId) are required' }, { status: 400 });
    }

    const r = await pool.query(
      `WITH paged AS (
         SELECT pv.*, COUNT(*) OVER()::int total_count
         FROM pm_project_vendors pv
         WHERE pv.project_id = $1 AND pv.pay_type = 'daily_wage' AND pv.status = 'active'
         ORDER BY pv.id
         LIMIT $2 OFFSET $3
       )
       SELECT p.*, v.name vendor_name, v.trade, a.id attendance_id,
              COALESCE(a.status, 'absent') attendance_status,
              COALESCE(a.workers_count, 1) workers_count,
              COALESCE(a.rate_per_worker, p.daily_rate) rate_per_worker,
              COALESCE(a.wage_amount, 0) wage_amount,
              a.note
       FROM paged p
       JOIN pm_vendors v ON v.id = p.vendor_id
       LEFT JOIN pm_attendance a ON a.project_vendor_id = p.id AND a.attendance_date = $4
       ORDER BY p.id`,
      [project, pageSize, offset, date]
    );

    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: r.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const entries = Array.isArray(b.entries) ? b.entries : [];
    if (!entries.length) {
      return NextResponse.json({ success: false, error: 'Attendance entries are required' }, { status: 400 });
    }

    const client = await pool.connect();
    const actor = actorFromAdmin(admin);
    try {
      await client.query('BEGIN');
      for (const e of entries) {
        const id = Number(e.project_vendor_id);
        const workers = Number(e.workers_count ?? 1);
        const rate = e.rate_per_worker === '' || e.rate_per_worker == null ? null : Number(e.rate_per_worker);
        const status = String(e.status);
        if (
          !Number.isInteger(id) ||
          !validDate(e.attendance_date) ||
          !['present', 'absent', 'half_day'].includes(status) ||
          !Number.isFinite(workers) ||
          workers <= 0 ||
          (rate !== null && (!Number.isFinite(rate) || rate < 0))
        ) {
          throw new Error('Invalid attendance entry');
        }

        const pv = (
          await client.query(`SELECT daily_rate FROM pm_project_vendors WHERE id = $1 AND pay_type = 'daily_wage'`, [id])
        ).rows[0];
        if (!pv) throw new Error('Daily-wage vendor assignment not found');

        const snapshot = rate ?? Number(pv.daily_rate);
        const wage = status === 'present' ? workers * snapshot : status === 'half_day' ? workers * snapshot * 0.5 : 0;
        const old = (
          await client.query(`SELECT * FROM pm_attendance WHERE project_vendor_id = $1 AND attendance_date = $2 FOR UPDATE`, [
            id,
            e.attendance_date,
          ])
        ).rows[0];

        const r = await client.query(
          `INSERT INTO pm_attendance(project_vendor_id, attendance_date, status, workers_count, rate_per_worker, wage_amount, note, created_by)
           VALUES($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT(project_vendor_id, attendance_date)
           DO UPDATE SET status = EXCLUDED.status, workers_count = EXCLUDED.workers_count, rate_per_worker = EXCLUDED.rate_per_worker, wage_amount = EXCLUDED.wage_amount, note = EXCLUDED.note
           RETURNING *`,
          [id, e.attendance_date, status, workers, snapshot, wage, e.note || null, actor]
        );

        await writePmPhase2Audit(
          client,
          'pm_attendance',
          r.rows[0].id,
          old ? 'updated' : 'created',
          actor,
          old,
          r.rows[0]
        );
      }
      await client.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (e) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    } finally {
      client.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
