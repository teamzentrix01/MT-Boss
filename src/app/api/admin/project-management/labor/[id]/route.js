import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit } from '@/lib/project-management';

export async function GET(req, { params }) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid laborer id' }, { status: 400 });
    }

    const r = await pool.query(
      `WITH earnings AS (
         SELECT la.labor_id, COALESCE(SUM(la.wage_amount), 0) AS total_earned,
                COUNT(*) FILTER (WHERE la.status = 'present') AS days_present,
                COUNT(*) FILTER (WHERE la.status = 'half_day') AS days_half_day,
                COUNT(*) FILTER (WHERE la.status = 'absent') AS days_absent
         FROM pm_labor_attendance la
         WHERE la.labor_id = $1
         GROUP BY la.labor_id
       ),
       payments AS (
         SELECT lp.labor_id, COALESCE(SUM(lp.amount), 0) AS total_paid
         FROM pm_labor_payments lp
         WHERE lp.labor_id = $1 AND NOT lp.is_deleted
         GROUP BY lp.labor_id
       )
       SELECT l.*, v.name AS vendor_name, p.name AS project_name,
              COALESCE(e.total_earned, 0) AS total_earned,
              COALESCE(e.days_present, 0) AS days_present,
              COALESCE(e.days_half_day, 0) AS days_half_day,
              COALESCE(e.days_absent, 0) AS days_absent,
              COALESCE(p.total_paid, 0) AS total_paid,
              COALESCE(e.total_earned, 0) - COALESCE(p.total_paid, 0) AS balance_due
       FROM pm_labor l
       JOIN pm_projects p ON p.id = l.project_id
       LEFT JOIN pm_vendors v ON v.id = l.vendor_id
       LEFT JOIN earnings e ON e.labor_id = l.id
       LEFT JOIN payments p ON p.labor_id = l.id
       WHERE l.id = $1`,
      [id]
    );

    if (!r.rows[0]) {
      return NextResponse.json({ success: false, error: 'Laborer not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: r.rows[0] });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Could not load laborer' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid laborer id' }, { status: 400 });
    }

    const b = await req.json();
    const name = b.name !== undefined ? String(b.name).trim() : null;
    const phone = b.phone !== undefined ? (b.phone ? String(b.phone).trim() : null) : undefined;
    const trade = b.trade !== undefined ? (b.trade ? String(b.trade).trim() : null) : undefined;
    const vendorId = b.vendor_id !== undefined ? (b.vendor_id ? Number(b.vendor_id) : null) : undefined;
    const dailyRate = b.daily_rate !== undefined ? Number(b.daily_rate) : undefined;
    const isActive = b.is_active !== undefined ? Boolean(b.is_active) : undefined;

    if (name !== null && !name) {
      return NextResponse.json({ success: false, error: 'Name cannot be empty' }, { status: 400 });
    }
    if (dailyRate !== undefined && (!Number.isFinite(dailyRate) || dailyRate < 0)) {
      return NextResponse.json({ success: false, error: 'Valid daily_rate is required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const old = (await client.query(`SELECT * FROM pm_labor WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Laborer not found' }, { status: 404 });
      }

      const updated = await client.query(
        `UPDATE pm_labor
         SET name = COALESCE($1, name),
             phone = CASE WHEN $2::text IS NOT NULL OR $3 = true THEN $2 ELSE phone END,
             trade = CASE WHEN $4::text IS NOT NULL OR $5 = true THEN $4 ELSE trade END,
             vendor_id = CASE WHEN $6::bigint IS NOT NULL OR $7 = true THEN $6::bigint ELSE vendor_id END,
             daily_rate = COALESCE($8, daily_rate),
             is_active = COALESCE($9, is_active)
         WHERE id = $10
         RETURNING *`,
        [
          name,
          phone ?? null,
          phone !== undefined,
          trade ?? null,
          trade !== undefined,
          vendorId ?? null,
          vendorId !== undefined,
          dailyRate ?? null,
          isActive ?? null,
          id,
        ]
      );

      const actor = actorFromAdmin(admin);
      await writePmPhase2Audit(client, 'pm_labor', id, 'updated', actor, old, updated.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: updated.rows[0] });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Could not update laborer' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid laborer id' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const old = (await client.query(`SELECT * FROM pm_labor WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Laborer not found' }, { status: 404 });
      }

      // Check if attendance or payments exist
      const att = await client.query(`SELECT 1 FROM pm_labor_attendance WHERE labor_id = $1 LIMIT 1`, [id]);
      const pay = await client.query(`SELECT 1 FROM pm_labor_payments WHERE labor_id = $1 AND NOT is_deleted LIMIT 1`, [id]);

      let res;
      const actor = actorFromAdmin(admin);
      if (att.rows.length > 0 || pay.rows.length > 0) {
        // Soft deactivate
        res = await client.query(`UPDATE pm_labor SET is_active = FALSE WHERE id = $1 RETURNING *`, [id]);
        await writePmPhase2Audit(client, 'pm_labor', id, 'deactivated', actor, old, res.rows[0]);
      } else {
        // Hard delete
        res = await client.query(`DELETE FROM pm_labor WHERE id = $1 RETURNING *`, [id]);
        await writePmPhase2Audit(client, 'pm_labor', id, 'deleted', actor, old, null);
      }

      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: res.rows[0] });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message || 'Could not delete laborer' }, { status: 500 });
  }
}
