import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

const validDate = (x) => /^\d{4}-\d{2}-\d{2}$/.test(String(x || '')) && !Number.isNaN(Date.parse(x));

function getTodayIST() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const laborId = Number(s.get('laborId'));

    // Mode 1: Labor-specific attendance history (for calendar & detail view)
    if (Number.isInteger(laborId) && laborId > 0) {
      const laborRes = await pool.query('SELECT project_id FROM pm_labor WHERE id = $1', [laborId]);
      if (!laborRes.rows[0]) {
        return NextResponse.json({ success: false, error: 'Laborer not found' }, { status: 404 });
      }
      const auth = await assertAgentAccess(req, laborRes.rows[0].project_id, 'labor');
      if (!auth.allowed) return auth.response;

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
    const projectId = Number(s.get('projectId') || s.get('project_id'));
    const date = s.get('date');
    const history = s.get('history') === '1' || s.get('all') === '1';
    const contractorId = s.get('contractorId') || s.get('contractor_id') || s.get('projectVendorId') || s.get('project_vendor_id') || s.get('vendorId') || '';
    const type = String(s.get('type') || '').toLowerCase().trim(); // 'independent' | 'contractor' | ''

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, 'labor');
    if (!auth.allowed) return auth.response;

    if (history || !validDate(date)) {
      const month = s.get('month') || '';
      const r = await pool.query(
        `SELECT la.*, l.name AS labor_name, l.phone, l.trade, l.daily_rate,
                COALESCE(v.name, pv_v.name) AS vendor_name,
                COALESCE(v.name, pv_v.name) AS contractor_name,
                pv.work_description AS contractor_work_description
         FROM pm_labor_attendance la
         JOIN pm_labor l ON l.id = la.labor_id
         LEFT JOIN pm_project_vendors pv ON pv.id = l.project_vendor_id
         LEFT JOIN pm_vendors pv_v ON pv_v.id = pv.vendor_id
         LEFT JOIN pm_vendors v ON v.id = l.vendor_id
         WHERE l.project_id = $1
           AND ($2 = '' OR TO_CHAR(la.attendance_date, 'YYYY-MM') = $2)
           AND ($3 = '' OR l.project_vendor_id = $3::bigint OR l.contractor_id = $3::bigint OR l.vendor_id = $3::bigint)
           AND (
             $4 = '' OR
             ($4 = 'independent' AND l.project_vendor_id IS NULL AND l.contractor_id IS NULL AND l.vendor_id IS NULL) OR
             ($4 = 'contractor' AND (l.project_vendor_id IS NOT NULL OR l.contractor_id IS NOT NULL OR l.vendor_id IS NOT NULL))
           )
         ORDER BY la.attendance_date DESC, la.created_at DESC
         LIMIT 100`,
        [projectId, month, contractorId, type]
      );
      return NextResponse.json({ success: true, data: r.rows });
    }

    const r = await pool.query(
      `SELECT l.id AS labor_id, l.name, l.name AS labor_name, l.phone, l.trade, l.daily_rate,
              l.vendor_id, l.project_vendor_id, l.contractor_id,
              COALESCE(v.name, pv_v.name) AS vendor_name,
              COALESCE(v.name, pv_v.name) AS contractor_name,
              pv.work_description AS contractor_work_description,
              COALESCE(pv_v.trade, v.trade) AS contractor_trade,
              la.id AS attendance_id,
              COALESCE(la.status, 'present') AS attendance_status,
              COALESCE(la.wage_amount, l.daily_rate) AS wage_amount,
              COALESCE(la.overtime_hours, 0) AS overtime_hours,
              la.note,
              la.created_by,
              la.created_at
       FROM pm_labor l
       LEFT JOIN pm_project_vendors pv ON pv.id = l.project_vendor_id
       LEFT JOIN pm_vendors pv_v ON pv_v.id = pv.vendor_id
       LEFT JOIN pm_vendors v ON v.id = l.vendor_id
       LEFT JOIN pm_labor_attendance la ON la.labor_id = l.id AND la.attendance_date = $2
       WHERE l.project_id = $1 AND l.is_active = TRUE
         AND ($3 = '' OR l.project_vendor_id = $3::bigint OR l.contractor_id = $3::bigint OR l.vendor_id = $3::bigint)
         AND (
           $4 = '' OR
           ($4 = 'independent' AND l.project_vendor_id IS NULL AND l.contractor_id IS NULL AND l.vendor_id IS NULL) OR
           ($4 = 'contractor' AND (l.project_vendor_id IS NOT NULL OR l.contractor_id IS NOT NULL OR l.vendor_id IS NOT NULL))
         )
       ORDER BY COALESCE(v.name, pv_v.name, 'Independent'), l.name ASC`,
      [projectId, date, contractorId, type]
    );

    return NextResponse.json({ success: true, data: r.rows });
  } catch (e) {
    console.error("LABOR ATTENDANCE GET ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not load labor attendance' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const rawList = Array.isArray(b.entries) ? b.entries : Array.isArray(b.records) ? b.records : [];
    const globalDate = b.attendance_date || '';
    const entries = rawList.map((e) => ({
      ...e,
      attendance_date: e.attendance_date || globalDate,
      status: e.status || 'present',
      overtime_hours: Number(e.overtime_hours ?? e.overtimeHours ?? 0),
    }));

    if (!entries.length) {
      return NextResponse.json({ success: false, error: 'Attendance entries are required' }, { status: 400 });
    }

    const firstLabor = await pool.query('SELECT project_id FROM pm_labor WHERE id = $1', [Number(entries[0].labor_id)]);
    if (!firstLabor.rows[0]) {
      return NextResponse.json({ success: false, error: 'Laborer not found' }, { status: 404 });
    }
    const auth = await assertAgentAccess(req, firstLabor.rows[0].project_id, 'labor');
    if (!auth.allowed) return auth.response;

    const todayIST = getTodayIST();
    const isSuperAdmin = auth.user?.role === 'admin' || auth.user?.role === 'super_admin';
    const adminOverride = Boolean(b.admin_override && isSuperAdmin);

    for (const e of entries) {
      const attDate = String(e.attendance_date || '');
      if (attDate !== todayIST && !adminOverride) {
        return NextResponse.json({
          success: false,
          error: `Back date ya future date ki attendance allowed nahi hai. Sirf aaj ki date (${todayIST}) ki attendance mark ki ja sakti hai.`
        }, { status: 400 });
      }
    }

    const client = await pool.connect();
    const actor = actorFromAdmin(auth.user);
    try {
      await client.query('BEGIN');

      // Fetch labor details (daily_rate, project_id, project_vendor_id)
      const laborIds = entries.map((e) => Number(e.labor_id)).filter((id) => Number.isInteger(id) && id > 0);
      const laborInfoRes = await client.query(
        `SELECT id, daily_rate, project_id, project_vendor_id, contractor_id FROM pm_labor WHERE id = ANY($1)`,
        [laborIds]
      );
      const laborMap = new Map(laborInfoRes.rows.map((r) => [Number(r.id), r]));

      const saved = [];
      for (const e of entries) {
        const laborId = Number(e.labor_id);
        const status = String(e.status || 'absent');
        const attDate = String(e.attendance_date || '');
        const note = e.note ? String(e.note).trim() : null;
        const overtime = Number(e.overtime_hours || 0);

        if (!Number.isInteger(laborId) || !validDate(attDate) || !['present', 'absent', 'half_day'].includes(status)) {
          throw new Error(`Invalid attendance entry for labor ${laborId} on date ${attDate}`);
        }

        const laborRow = laborMap.get(laborId);
        const dailyRate = Number(laborRow?.daily_rate || 0);
        const projId = Number(laborRow?.project_id || firstLabor.rows[0].project_id);
        const pvId = laborRow?.project_vendor_id ? Number(laborRow.project_vendor_id) : (laborRow?.contractor_id ? Number(laborRow.contractor_id) : null);

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
          `INSERT INTO pm_labor_attendance(labor_id, attendance_date, status, wage_amount, note, created_by, project_id, project_vendor_id, contractor_id, overtime_hours)
           VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8, $9)
           ON CONFLICT (labor_id, attendance_date)
           DO UPDATE SET status = EXCLUDED.status, wage_amount = EXCLUDED.wage_amount, note = EXCLUDED.note, overtime_hours = EXCLUDED.overtime_hours, project_vendor_id = EXCLUDED.project_vendor_id, contractor_id = EXCLUDED.contractor_id
           RETURNING *`,
          [laborId, attDate, status, wage, note, actor, projId, pvId, overtime]
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
    console.error("LABOR ATTENDANCE ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not save labor attendance' }, { status: 500 });
  }
}

export async function POST(req) {
  return PUT(req);
}
