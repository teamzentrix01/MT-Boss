import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

const validDate = (x) => /^\d{4}-\d{2}-\d{2}$/.test(String(x || '')) && !Number.isNaN(Date.parse(x));

export async function GET(req) {
  if (!await requirePmAccess(req)) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const laborId = Number(s.get('laborId'));

    // Mode 1: Labor-specific attendance history (for calendar & detail view)
    if (Number.isInteger(laborId) && laborId > 0) {
      const month = s.get('month') || ''; // 'YYYY-MM'
      const r = await pool.query(
        `SELECT la.*, l.name AS labor_name, l.trade, l.daily_rate, v.name AS vendor_name
         FROM pm_labor_attendance la
         JOIN pm_labor l ON l.id = la.labor_id
         LEFT JOIN pm_vendors v ON v.id = l.vendor_id
         WHERE la.labor_id = $1
           AND ($2 = '' OR TO_CHAR(la.attendance_date, 'YYYY-MM') = $2)
         ORDER BY la.attendance_date ASC`,
        [laborId, month]
      );
      return NextResponse.json({ success: true, data: r.rows });
    }

    // Mode 2: Project-wide daily labor attendance for bulk marking
    const projectId = Number(s.get('projectId'));
    const date = s.get('date');
    if (!Number.isInteger(projectId) || !validDate(date)) {
      return NextResponse.json({ success: false, error: 'projectId and valid date (or laborId) are required' }, { status: 400 });
    }

    const r = await pool.query(
      `SELECT l.id AS labor_id, l.name, l.name AS labor_name, l.phone, l.trade, l.daily_rate,
              l.vendor_id, v.name AS vendor_name,
              la.id AS attendance_id,
              COALESCE(la.status, 'present') AS attendance_status,
              COALESCE(la.wage_amount, l.daily_rate) AS wage_amount,
              la.note
       FROM pm_labor l
       LEFT JOIN pm_vendors v ON v.id = l.vendor_id
       LEFT JOIN pm_labor_attendance la ON la.labor_id = l.id AND la.attendance_date = $2
       WHERE l.project_id = $1 AND l.is_active = TRUE
       ORDER BY COALESCE(v.name, 'Independent'), l.name ASC`,
      [projectId, date]
    );

    return NextResponse.json({ success: true, data: r.rows });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Could not load labor attendance' }, { status: 500 });
  }
}

export async function PUT(req) {
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const rawList = Array.isArray(b.entries) ? b.entries : Array.isArray(b.records) ? b.records : [];
    const globalDate = b.attendance_date || '';
    const entries = rawList.map((e) => ({
      ...e,
      attendance_date: e.attendance_date || globalDate,
      status: e.status || 'present',
    }));

    if (!entries.length) {
      return NextResponse.json({ success: false, error: 'Attendance entries are required' }, { status: 400 });
    }

    const client = await pool.connect();
    const actor = actorFromAdmin(admin);
    try {
      await client.query('BEGIN');

      // Fetch daily rates for all laborers in entries
      const laborIds = entries.map((e) => Number(e.labor_id)).filter((id) => Number.isInteger(id) && id > 0);
      const ratesRes = await client.query(
        `SELECT id, daily_rate FROM pm_labor WHERE id = ANY($1)`,
        [laborIds]
      );
      const rateMap = new Map(ratesRes.rows.map((r) => [Number(r.id), Number(r.daily_rate || 0)]));

      const saved = [];
      for (const e of entries) {
        const laborId = Number(e.labor_id);
        const status = String(e.status || 'absent');
        const attDate = String(e.attendance_date || '');
        const note = e.note ? String(e.note).trim() : null;

        if (!Number.isInteger(laborId) || !validDate(attDate) || !['present', 'absent', 'half_day'].includes(status)) {
          throw new Error(`Invalid attendance entry for labor ${laborId} on date ${attDate}`);
        }

        const dailyRate = rateMap.get(laborId) ?? 0;
        let wage = 0;
        if (status === 'present') wage = dailyRate * 1.0;
        else if (status === 'half_day') wage = Math.round(dailyRate * 0.5 * 100) / 100;
        else wage = 0;

        const old = (
          await client.query(
            `SELECT * FROM pm_labor_attendance WHERE labor_id = $1 AND attendance_date = $2 FOR UPDATE`,
            [laborId, attDate]
          )
        ).rows[0];

        const r = await client.query(
          `INSERT INTO pm_labor_attendance(labor_id, attendance_date, status, wage_amount, note, created_by)
           VALUES($1, $2, $3, $4, $5, $6)
           ON CONFLICT (labor_id, attendance_date)
           DO UPDATE SET status = EXCLUDED.status, wage_amount = EXCLUDED.wage_amount, note = EXCLUDED.note
           RETURNING *`,
          [laborId, attDate, status, wage, note, actor]
        );

        await writePmPhase2Audit(
          client,
          'pm_labor_attendance',
          r.rows[0].id,
          old ? 'updated' : 'created',
          actor,
          old,
          r.rows[0]
        );
        saved.push(r.rows[0]);
      }

      await client.query('COMMIT');
      return NextResponse.json({ success: true, count: saved.length });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Could not save labor attendance' }, { status: 500 });
  }
}

export async function POST(req) {
  return PUT(req);
}
