import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase4Schema, actorFromAdmin, loadPmSettings } from '@/lib/project-management';

export async function GET(req) {
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase4Schema();
    const cfg = await loadPmSettings();
    const gapDays = cfg.party_payment_gap_days  ?? 30;
    const warnPct = cfg.contract_paid_warning_percent ?? 90;

    // Active dismissals (most-recent per key)
    const dismissedRows = await pool.query(`
      SELECT DISTINCT ON (alert_key) alert_key, dismissed_until
      FROM pm_alert_dismissals ORDER BY alert_key, created_at DESC
    `);
    const now = new Date();
    const dismissed = new Set(
      dismissedRows.rows
        .filter(r => !r.dismissed_until || new Date(r.dismissed_until) > now)
        .map(r => r.alert_key)
    );

    // Run all alert queries in parallel — each is a single aggregated pass, no per-row loops
    const [stockQ, vendorQ, partyQ, lateQ, attQ] = await Promise.all([
      // Stock: low + negative
      pool.query(`
        WITH used_agg AS (
          SELECT project_id, material_id, SUM(quantity) AS qty
          FROM pm_material_used WHERE NOT is_deleted GROUP BY project_id, material_id
        ),
        adj_agg AS (
          SELECT project_id, material_id, SUM(quantity) AS qty
          FROM pm_material_adjustments WHERE NOT is_deleted GROUP BY project_id, material_id
        ),
        rcv_agg AS (
          SELECT project_id, material_id, SUM(CASE WHEN NOT is_deleted THEN quantity ELSE 0 END) AS qty
          FROM pm_material_received GROUP BY project_id, material_id
        ),
        stock_calc AS (
          SELECT r.project_id, r.material_id, m.name AS material_name, m.min_stock_level,
                 r.qty - COALESCE(u.qty,0) - COALESCE(a.qty,0) AS stock
          FROM rcv_agg r
          JOIN pm_materials m ON m.id = r.material_id
          LEFT JOIN used_agg u ON u.material_id = r.material_id AND u.project_id = r.project_id
          LEFT JOIN adj_agg  a ON a.material_id = r.material_id AND a.project_id = r.project_id
        )
        SELECT project_id, material_id, material_name, stock, min_stock_level,
               CASE WHEN stock < 0 THEN 'negative_stock' ELSE 'low_stock' END AS alert_type
        FROM stock_calc WHERE stock <= min_stock_level
      `),

      // Vendor: overpaid + contract warning
      pool.query(`
        WITH att_agg AS (
          SELECT project_vendor_id, SUM(wage_amount) AS wage FROM pm_attendance GROUP BY project_vendor_id
        ),
        vpay_agg AS (
          SELECT project_vendor_id, SUM(amount) AS paid FROM pm_vendor_payments WHERE NOT is_deleted GROUP BY project_vendor_id
        )
        SELECT pv.id AS project_vendor_id, pv.project_id, v.name AS vendor_name,
               pv.pay_type, pv.contract_amount, pv.status AS pv_status,
               CASE WHEN pv.pay_type='daily_wage' THEN COALESCE(aa.wage,0) ELSE pv.contract_amount END AS earned,
               COALESCE(vp.paid,0) AS paid
        FROM pm_project_vendors pv
        JOIN pm_vendors v ON v.id = pv.vendor_id
        LEFT JOIN att_agg  aa ON aa.project_vendor_id = pv.id
        LEFT JOIN vpay_agg vp ON vp.project_vendor_id = pv.id
        WHERE (pv.pay_type='daily_wage' AND COALESCE(aa.wage,0) > 0 AND COALESCE(vp.paid,0) > COALESCE(aa.wage,0))
           OR (pv.pay_type='contract' AND pv.contract_amount > 0
               AND COALESCE(vp.paid,0) >= pv.contract_amount * $1 / 100.0
               AND pv.status = 'active')
      `, [warnPct]),

      // Party payment gap
      pool.query(`
        WITH last_pay AS (
          SELECT project_id, MAX(payment_date) AS last_date
          FROM pm_party_payments WHERE NOT is_deleted GROUP BY project_id
        ),
        rcv AS (
          SELECT project_id, COALESCE(SUM(amount),0) AS received
          FROM pm_party_payments WHERE NOT is_deleted GROUP BY project_id
        )
        SELECT p.id AS project_id, p.name AS project_name, pa.name AS party_name,
               p.contract_value - COALESCE(r.received,0) AS pending,
               lp.last_date,
               (CURRENT_DATE - COALESCE(lp.last_date, p.start_date))::int AS gap_days
        FROM pm_projects p
        JOIN pm_parties pa ON pa.id = p.party_id
        LEFT JOIN last_pay lp ON lp.project_id = p.id
        LEFT JOIN rcv      r  ON r.project_id  = p.id
        WHERE p.status = 'running'
          AND p.contract_value - COALESCE(r.received,0) > 0
          AND (CURRENT_DATE - COALESCE(lp.last_date, p.start_date))::int >= $1
      `, [gapDays]),

      // Late projects
      pool.query(`
        SELECT p.id AS project_id, p.name AS project_name, p.expected_end_date,
               (CURRENT_DATE - p.expected_end_date)::int AS days_late
        FROM pm_projects p
        WHERE p.status = 'running'
          AND p.expected_end_date IS NOT NULL
          AND p.expected_end_date < CURRENT_DATE
      `),

      // Missing attendance today
      pool.query(`
        SELECT pv.id AS project_vendor_id, pv.project_id, v.name AS vendor_name, p.name AS project_name
        FROM pm_project_vendors pv
        JOIN pm_vendors  v ON v.id = pv.vendor_id
        JOIN pm_projects p ON p.id = pv.project_id
        WHERE pv.pay_type='daily_wage' AND pv.status='active' AND p.status='running'
          AND NOT EXISTS (
            SELECT 1 FROM pm_attendance a
            WHERE a.project_vendor_id = pv.id AND a.attendance_date = CURRENT_DATE
          )
      `),
    ]);

    const makeKey = (type, projectId, subId) => `${type}:${projectId}:${subId}`;
    const alerts = [];

    for (const r of stockQ.rows) {
      const k = makeKey(r.alert_type, r.project_id, r.material_id);
      if (dismissed.has(k)) continue;
      alerts.push({ alert_key: k, type: r.alert_type, severity: r.alert_type === 'negative_stock' ? 'high' : 'medium', project_id: r.project_id,
        title: r.material_name, detail: `Stock: ${Number(r.stock).toFixed(2)} (min: ${r.min_stock_level})` });
    }
    for (const r of vendorQ.rows) {
      const type = r.paid > r.earned ? 'vendor_overpaid' : 'contract_warning';
      const k = makeKey(type, r.project_id, r.project_vendor_id);
      if (dismissed.has(k)) continue;
      alerts.push({ alert_key: k, type, severity: type === 'contract_warning' ? 'high' : 'medium',
        project_id: r.project_id, project_vendor_id: r.project_vendor_id,
        title: r.vendor_name, detail: `Paid ₹${Number(r.paid).toLocaleString('en-IN')} / Earned ₹${Number(r.earned).toLocaleString('en-IN')}` });
    }
    for (const r of partyQ.rows) {
      const k = makeKey('party_pending', r.project_id, r.project_id);
      if (dismissed.has(k)) continue;
      alerts.push({ alert_key: k, type: 'party_pending', severity: 'medium',
        project_id: r.project_id, title: `${r.project_name} (${r.party_name})`,
        detail: `${r.gap_days} days since last payment, ₹${Number(r.pending).toLocaleString('en-IN')} pending` });
    }
    for (const r of lateQ.rows) {
      const k = makeKey('project_late', r.project_id, r.project_id);
      if (dismissed.has(k)) continue;
      alerts.push({ alert_key: k, type: 'project_late', severity: 'high',
        project_id: r.project_id, title: r.project_name, detail: `${r.days_late} days overdue` });
    }
    for (const r of attQ.rows) {
      const k = makeKey('attendance_missing', r.project_id, r.project_vendor_id);
      if (dismissed.has(k)) continue;
      alerts.push({ alert_key: k, type: 'attendance_missing', severity: 'low',
        project_id: r.project_id, project_vendor_id: r.project_vendor_id,
        title: r.vendor_name, detail: `No attendance today at ${r.project_name}` });
    }

    const counts = alerts.reduce((a, x) => { a[x.severity] = (a[x.severity] || 0) + 1; return a; }, { high: 0, medium: 0, low: 0 });
    return NextResponse.json({ success: true, alerts, counts, total: alerts.length });
  } catch (error) {
    console.error('PM alerts error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  // POST body: { alert_key, snooze: '7d' | 'permanent' }
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase4Schema();
    const { alert_key, snooze } = await req.json();
    if (!alert_key) return NextResponse.json({ success: false, error: 'alert_key required' }, { status: 400 });
    const actor = actorFromAdmin(admin);
    const until = snooze === 'permanent' ? null
      : snooze === '7d' ? new Date(Date.now() + 7 * 86400_000)
      : (() => { throw new Error('snooze must be "7d" or "permanent"'); })();
    await pool.query(
      `INSERT INTO pm_alert_dismissals(alert_key,dismissed_by,dismissed_until) VALUES($1,$2,$3)`,
      [alert_key, actor, until]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
