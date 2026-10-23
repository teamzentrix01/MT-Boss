import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const projectId = Number(s.get('projectId') || s.get('project_id'));
    const contractorId = s.get('contractorId') || s.get('contractor_id') || s.get('projectVendorId') || s.get('project_vendor_id') || s.get('vendorId') || '';
    const type = String(s.get('type') || '').toLowerCase().trim(); // 'independent' | 'contractor' | ''
    const search = String(s.get('search') || '').trim();
    const activeOnly = s.get('activeOnly') !== 'false';
    const { page, pageSize, offset } = pageParams(s);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, 'labor');
    if (!auth.allowed) return auth.response;

    const r = await pool.query(
      `WITH earnings AS (
         SELECT la.labor_id, COALESCE(SUM(la.wage_amount), 0) AS total_earned,
                COUNT(*) FILTER (WHERE la.status = 'present') AS days_present,
                COUNT(*) FILTER (WHERE la.status = 'half_day') AS days_half_day
         FROM pm_labor_attendance la
         JOIN pm_labor l ON l.id = la.labor_id
         WHERE l.project_id = $1
         GROUP BY la.labor_id
       ),
       payments AS (
         SELECT lp.labor_id, COALESCE(SUM(lp.amount), 0) AS total_paid
         FROM pm_labor_payments lp
         JOIN pm_labor l ON l.id = lp.labor_id
         WHERE l.project_id = $1 AND NOT lp.is_deleted
         GROUP BY lp.labor_id
       ),
       paged AS (
         SELECT l.*,
                COALESCE(v.name, pv_v.name) AS vendor_name,
                COALESCE(v.name, pv_v.name) AS contractor_name,
                pv.work_description AS contractor_work_description,
                COALESCE(pv_v.trade, v.trade) AS contractor_trade,
                COALESCE(e.total_earned, 0) AS total_earned,
                COALESCE(e.days_present, 0) AS days_present,
                COALESCE(e.days_half_day, 0) AS days_half_day,
                COALESCE(p.total_paid, 0) AS total_paid,
                COALESCE(e.total_earned, 0) - COALESCE(p.total_paid, 0) AS balance_due,
                COUNT(*) OVER()::int AS total_count
         FROM pm_labor l
         LEFT JOIN pm_project_vendors pv ON pv.id = l.project_vendor_id
         LEFT JOIN pm_vendors pv_v ON pv_v.id = pv.vendor_id
         LEFT JOIN pm_vendors v ON v.id = l.vendor_id
         LEFT JOIN earnings e ON e.labor_id = l.id
         LEFT JOIN payments p ON p.labor_id = l.id
         WHERE l.project_id = $1
           AND ($2 = '' OR l.project_vendor_id = $2::bigint OR l.contractor_id = $2::bigint OR l.vendor_id = $2::bigint)
           AND ($3 = '' OR l.name ILIKE '%'||$3||'%' OR COALESCE(l.phone,'') ILIKE '%'||$3||'%' OR COALESCE(l.trade,'') ILIKE '%'||$3||'%')
           AND ($4 = false OR l.is_active = TRUE)
           AND (
             $5 = '' OR
             ($5 = 'independent' AND l.project_vendor_id IS NULL AND l.contractor_id IS NULL AND l.vendor_id IS NULL) OR
             ($5 = 'contractor' AND (l.project_vendor_id IS NOT NULL OR l.contractor_id IS NOT NULL OR l.vendor_id IS NOT NULL))
           )
         ORDER BY l.is_active DESC, l.name ASC
         LIMIT $6 OFFSET $7
       )
       SELECT * FROM paged`,
      [projectId, contractorId, search, activeOnly, type, pageSize, offset]
    );

    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: r.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (e) {
    console.error("LABOR GET ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not load labor list' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    console.log("LABOR POST PAYLOAD:", b);

    const projectId = Number(b.project_id ?? b.projectId);

    // Normalize contractor/vendor dropdown: "independent", "none", "", "null" -> null
    let rawContractor = b.project_vendor_id ?? b.projectVendorId ?? b.contractor_id ?? b.contractorId ?? b.vendor_id ?? b.vendorId;
    if (rawContractor === 'independent' || rawContractor === 'none' || rawContractor === 'null' || rawContractor === '' || rawContractor === undefined) {
      rawContractor = null;
    }
    const projectVendorId = rawContractor ? Number(rawContractor) : null;

    const name = String(b.name || '').trim();
    const phone = b.phone ? String(b.phone).trim() : null;
    const trade = b.trade ? String(b.trade).trim() : null;
    const rawRate = b.daily_rate ?? b.dailyRate ?? 0;
    const dailyRate = Number(rawRate);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid project_id is required' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ success: false, error: 'Worker name is required' }, { status: 400 });
    }
    if (!Number.isFinite(dailyRate) || dailyRate < 0) {
      return NextResponse.json({ success: false, error: 'Valid daily_rate (>= 0) is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, 'labor');
    if (!auth.allowed) return auth.response;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const actor = actorFromAdmin(auth.user);
      let linkedVendorId = null;

      if (projectVendorId) {
        const assignment = (await client.query(
          `SELECT vendor_id FROM pm_project_vendors WHERE id = $1 AND project_id = $2`,
          [projectVendorId, projectId]
        )).rows[0];
        if (!assignment) {
          await client.query('ROLLBACK');
          return NextResponse.json({ success: false, error: 'Selected contractor is not assigned to this project' }, { status: 400 });
        }
        linkedVendorId = Number(assignment.vendor_id);
      }

      if (phone) {
        const existing = await client.query(
          `SELECT id, name FROM pm_labor WHERE project_id = $1 AND phone = $2 AND is_active = TRUE`,
          [projectId, phone]
        );
        if (existing.rows[0]) {
          await client.query('ROLLBACK');
          return NextResponse.json({
            success: false,
            error: `Ye worker (${existing.rows[0].name}) already is project me added hai (Phone: ${phone})`
          }, { status: 400 });
        }
      }

      const r = await client.query(
        `INSERT INTO pm_labor(project_id, vendor_id, project_vendor_id, contractor_id, name, phone, trade, daily_rate, is_active)
         VALUES($1, $2, $3, $3, $4, $5, $6, $7, TRUE)
         RETURNING *`,
        [projectId, linkedVendorId, projectVendorId, name, phone, trade, dailyRate]
      );

      await writePmPhase2Audit(client, 'pm_labor', r.rows[0].id, 'created', actor, null, r.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: r.rows[0] }, { status: 201 });
    } catch (e) {
      await client.query('ROLLBACK');
      if (e.code === '23505') {
        return NextResponse.json({
          success: false,
          error: `Ye worker phone number (${phone}) already is project me registered hai.`
        }, { status: 400 });
      }
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    console.error("LABOR POST ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not create laborer' }, { status: 500 });
  }
}
