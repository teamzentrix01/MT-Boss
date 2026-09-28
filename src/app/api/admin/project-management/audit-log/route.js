import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementPhase4Schema, pageParams } from '@/lib/project-management';

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementPhase4Schema();
    const sp = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(sp);
    const user       = sp.get('user')       || '';
    const recordType = sp.get('recordType') || '';
    const action     = sp.get('action')     || '';
    const dateFrom   = sp.get('dateFrom')   || null;
    const dateTo     = sp.get('dateTo')     || null;

    // UNION both audit tables (Phase 1 = pm_audit_logs, Phase 2 = pm_audit_log)
    const r = await pool.query(`
      WITH combined AS (
        SELECT id, 'phase1'::text AS src,
               entity_type AS record_type, entity_id::bigint AS record_id,
               action, changed_by, before_data AS old_data, after_data AS new_data, created_at
        FROM pm_audit_logs
        UNION ALL
        SELECT id, 'phase2'::text,
               table_name, record_id, action, changed_by, old_data, new_data, created_at
        FROM pm_audit_log
      )
      SELECT *, COUNT(*) OVER()::int AS total_count
      FROM combined
      WHERE ($1 = '' OR changed_by ILIKE '%' || $1 || '%')
        AND ($2 = '' OR record_type ILIKE '%' || $2 || '%')
        AND ($3 = '' OR action = $3)
        AND ($4::date IS NULL OR created_at::date >= $4::date)
        AND ($5::date IS NULL OR created_at::date <= $5::date)
      ORDER BY created_at DESC
      LIMIT $6 OFFSET $7
    `, [user, recordType, action, dateFrom, dateTo, pageSize, offset]);

    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({ success: true, data: r.rows, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
