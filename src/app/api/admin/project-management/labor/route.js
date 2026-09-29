import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const projectId = Number(s.get('projectId'));
    const vendorId = s.get('vendorId') || '';
    const search = String(s.get('search') || '').trim();
    const activeOnly = s.get('activeOnly') !== 'false';
    const { page, pageSize, offset } = pageParams(s);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

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
         SELECT l.*, v.name AS vendor_name,
                COALESCE(e.total_earned, 0) AS total_earned,
                COALESCE(e.days_present, 0) AS days_present,
                COALESCE(e.days_half_day, 0) AS days_half_day,
                COALESCE(p.total_paid, 0) AS total_paid,
                COALESCE(e.total_earned, 0) - COALESCE(p.total_paid, 0) AS balance_due,
                COUNT(*) OVER()::int AS total_count
         FROM pm_labor l
         LEFT JOIN pm_vendors v ON v.id = l.vendor_id
         LEFT JOIN earnings e ON e.labor_id = l.id
         LEFT JOIN payments p ON p.labor_id = l.id
         WHERE l.project_id = $1
           AND ($2 = '' OR l.vendor_id = $2::bigint)
           AND ($3 = '' OR l.name ILIKE '%'||$3||'%' OR COALESCE(l.phone,'') ILIKE '%'||$3||'%' OR COALESCE(l.trade,'') ILIKE '%'||$3||'%')
           AND ($4 = false OR l.is_active = TRUE)
         ORDER BY l.is_active DESC, l.name ASC
         LIMIT $5 OFFSET $6
       )
       SELECT * FROM paged`,
      [projectId, vendorId, search, activeOnly, pageSize, offset]
    );

    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: r.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Could not load labor list' }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const projectId = Number(b.project_id);
    const vendorId = b.vendor_id ? Number(b.vendor_id) : null;
    const name = String(b.name || '').trim();
    const phone = b.phone ? String(b.phone).trim() : null;
    const trade = b.trade ? String(b.trade).trim() : null;
    const dailyRate = Number(b.daily_rate ?? 0);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ success: false, error: 'Valid project_id is required' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ success: false, error: 'Laborer name is required' }, { status: 400 });
    }
    if (!Number.isFinite(dailyRate) || dailyRate < 0) {
      return NextResponse.json({ success: false, error: 'Valid daily_rate (>= 0) is required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const actor = actorFromAdmin(admin);
      const r = await client.query(
        `INSERT INTO pm_labor(project_id, vendor_id, name, phone, trade, daily_rate, is_active)
         VALUES($1, $2, $3, $4, $5, $6, TRUE)
         RETURNING *`,
        [projectId, vendorId, name, phone, trade, dailyRate]
      );
      await writePmPhase2Audit(client, 'pm_labor', r.rows[0].id, 'created', actor, null, r.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: r.rows[0] }, { status: 201 });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Could not create laborer' }, { status: 500 });
  }
}
