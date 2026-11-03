import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requirePmAccess, ensureProjectManagementSchema, assertAgentAccess } from '@/lib/project-management';
import { unauthorized } from '@/lib/auth';

export async function GET(req) {
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();

  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const q = (s.get('q') || '').trim();

    if (!q || q.length < 1) {
      return NextResponse.json({
        success: true,
        query: '',
        results: {
          labor: [],
          vendors: [],
          projects: [],
          materials: [],
          parties: [],
          agents: []
        },
        counts: { labor: 0, vendors: 0, projects: 0, materials: 0, parties: 0, agents: 0 }
      });
    }

    const searchPattern = `%${q}%`;

    // ── 1. Search Labor & Workers (with cross-project aggregation) ───────────────
    const laborQuery = await pool.query(
      `WITH att AS (
         SELECT la.labor_id,
                COUNT(*) FILTER (WHERE la.status = 'present') AS days_present,
                COUNT(*) FILTER (WHERE la.status = 'half_day') AS days_half,
                COALESCE(SUM(la.wage_amount), 0) AS total_earned
         FROM pm_labor_attendance la
         GROUP BY la.labor_id
       ),
       pay AS (
         SELECT lp.labor_id, COALESCE(SUM(lp.amount), 0) AS total_paid
         FROM pm_labor_payments lp
         WHERE NOT lp.is_deleted
         GROUP BY lp.labor_id
       )
       SELECT
         l.id AS labor_id,
         l.name AS labor_name,
         COALESCE(l.phone, '—') AS phone,
         COALESCE(l.trade, 'Labor') AS trade,
         l.daily_rate,
         l.is_active,
         p.id AS project_id,
         p.name AS project_name,
         p.status AS project_status,
         COALESCE(att.days_present, 0) AS days_present,
         COALESCE(att.days_half, 0) AS days_half,
         COALESCE(att.total_earned, 0) AS earned_amount,
         COALESCE(pay.total_paid, 0) AS paid_amount,
         COALESCE(att.total_earned, 0) - COALESCE(pay.total_paid, 0) AS balance_due
       FROM pm_labor l
       JOIN pm_projects p ON p.id = l.project_id
       LEFT JOIN att ON att.labor_id = l.id
       LEFT JOIN pay ON pay.labor_id = l.id
       WHERE l.name ILIKE $1 OR l.phone ILIKE $1 OR l.trade ILIKE $1
       ORDER BY l.name, p.name
       LIMIT 30`,
      [searchPattern]
    );

    // Group labor records by unique identity (phone or name) to show cross-project rollups
    const laborGroupMap = new Map();
    for (const row of laborQuery.rows) {
      const key = (row.phone && row.phone !== '—') ? `phone:${row.phone}` : `name:${row.labor_name.trim().toLowerCase()}`;
      if (!laborGroupMap.has(key)) {
        laborGroupMap.set(key, {
          worker_key: key,
          name: row.labor_name,
          phone: row.phone,
          trade: row.trade,
          daily_rate: row.daily_rate,
          total_days_present: 0,
          total_earned: 0,
          total_paid: 0,
          total_balance: 0,
          projects: []
        });
      }
      const group = laborGroupMap.get(key);
      group.total_days_present += Number(row.days_present) || 0;
      group.total_earned += Number(row.earned_amount) || 0;
      group.total_paid += Number(row.paid_amount) || 0;
      group.total_balance += Number(row.balance_due) || 0;
      group.projects.push({
        labor_id: row.labor_id,
        project_id: row.project_id,
        project_name: row.project_name,
        project_status: row.project_status,
        daily_rate: row.daily_rate,
        days_present: Number(row.days_present) || 0,
        days_half: Number(row.days_half) || 0,
        earned: Number(row.earned_amount) || 0,
        paid: Number(row.paid_amount) || 0,
        balance: Number(row.balance_due) || 0,
      });
    }
    const laborResults = Array.from(laborGroupMap.values());

    // ── 2. Search Vendors & Contractors ─────────────────────────────────────────
    const vendorQuery = await pool.query(
      `WITH dw AS (
         SELECT pv.vendor_id, pv.project_id, SUM(a.wage_amount) AS amt
         FROM pm_project_vendors pv
         JOIN pm_attendance a ON a.project_vendor_id = pv.id
         WHERE pv.pay_type = 'daily_wage'
         GROUP BY pv.vendor_id, pv.project_id
       ),
       ct AS (
         SELECT pv.vendor_id, pv.project_id, SUM(pv.contract_amount) AS amt
         FROM pm_project_vendors pv
         WHERE pv.pay_type = 'contract'
         GROUP BY pv.vendor_id, pv.project_id
       ),
       ms AS (
         SELECT pv.vendor_id, pv.project_id, SUM(m.amount) AS amt
         FROM pm_project_vendors pv
         JOIN pm_vendor_material_supply m ON m.project_vendor_id = pv.id
         WHERE NOT m.is_deleted
         GROUP BY pv.vendor_id, pv.project_id
       ),
       pd AS (
         SELECT pv.vendor_id, pv.project_id, SUM(vp.amount) AS amt
         FROM pm_project_vendors pv
         JOIN pm_vendor_payments vp ON vp.project_vendor_id = pv.id
         WHERE NOT vp.is_deleted
         GROUP BY pv.vendor_id, pv.project_id
       )
       SELECT
         v.id AS vendor_id,
         v.name AS vendor_name,
         COALESCE(v.phone, '—') AS phone,
         COALESCE(v.trade, 'Vendor') AS trade,
         p.id AS project_id,
         p.name AS project_name,
         p.status AS project_status,
         pv.id AS project_vendor_id,
         pv.work_description,
         pv.pay_type,
         COALESCE(dw.amt, 0) + COALESCE(ct.amt, 0) + COALESCE(ms.amt, 0) AS earned_amount,
         COALESCE(pd.amt, 0) AS paid_amount,
         (COALESCE(dw.amt, 0) + COALESCE(ct.amt, 0) + COALESCE(ms.amt, 0)) - COALESCE(pd.amt, 0) AS balance_due
       FROM pm_vendors v
       JOIN pm_project_vendors pv ON pv.vendor_id = v.id
       JOIN pm_projects p ON p.id = pv.project_id
       LEFT JOIN dw ON dw.vendor_id = v.id AND dw.project_id = p.id
       LEFT JOIN ct ON ct.vendor_id = v.id AND ct.project_id = p.id
       LEFT JOIN ms ON ms.vendor_id = v.id AND ms.project_id = p.id
       LEFT JOIN pd ON pd.vendor_id = v.id AND pd.project_id = p.id
       WHERE v.name ILIKE $1 OR v.phone ILIKE $1 OR v.trade ILIKE $1 OR pv.work_description ILIKE $1
       ORDER BY v.name, p.name
       LIMIT 30`,
      [searchPattern]
    );

    const vendorGroupMap = new Map();
    for (const row of vendorQuery.rows) {
      const vid = row.vendor_id;
      if (!vendorGroupMap.has(vid)) {
        vendorGroupMap.set(vid, {
          vendor_id: vid,
          name: row.vendor_name,
          phone: row.phone,
          trade: row.trade,
          total_earned: 0,
          total_paid: 0,
          total_balance: 0,
          projects: []
        });
      }
      const group = vendorGroupMap.get(vid);
      group.total_earned += Number(row.earned_amount) || 0;
      group.total_paid += Number(row.paid_amount) || 0;
      group.total_balance += Number(row.balance_due) || 0;
      group.projects.push({
        project_vendor_id: row.project_vendor_id,
        project_id: row.project_id,
        project_name: row.project_name,
        project_status: row.project_status,
        work_description: row.work_description,
        pay_type: row.pay_type,
        earned: Number(row.earned_amount) || 0,
        paid: Number(row.paid_amount) || 0,
        balance: Number(row.balance_due) || 0,
      });
    }
    const vendorResults = Array.from(vendorGroupMap.values());

    // ── 3. Search Projects ──────────────────────────────────────────────────────
    const projectQuery = await pool.query(
      `WITH exp AS (
         SELECT project_id, COALESCE(SUM(amount), 0) AS other_amt FROM pm_other_expenses WHERE NOT is_deleted GROUP BY project_id
       ),
       mat AS (
         SELECT project_id, COALESCE(SUM(amount), 0) AS mat_amt FROM pm_material_received WHERE NOT is_deleted AND vendor_supply_id IS NULL AND NOT transfer_in GROUP BY project_id
       ),
       rcv AS (
         SELECT project_id, COALESCE(SUM(amount), 0) AS rcv_amt FROM pm_party_payments WHERE NOT is_deleted GROUP BY project_id
       )
       SELECT
         p.id, p.name, p.status, p.contract_value, p.start_date,
         pa.name AS party_name, COALESCE(pa.phone, '—') AS party_phone,
         COALESCE(rcv.rcv_amt, 0) AS received,
         (SELECT COUNT(*) FROM pm_labor WHERE project_id = p.id) AS workers_count,
         (SELECT COUNT(*) FROM pm_project_vendors WHERE project_id = p.id) AS vendors_count
       FROM pm_projects p
       JOIN pm_parties pa ON pa.id = p.party_id
       LEFT JOIN rcv ON rcv.project_id = p.id
       WHERE p.name ILIKE $1 OR pa.name ILIKE $1 OR pa.phone ILIKE $1 OR p.site_address ILIKE $1
       ORDER BY p.name
       LIMIT 15`,
      [searchPattern]
    );

    // ── 4. Search Materials (Stock & Consumption) ──────────────────────────────
    const materialQuery = await pool.query(
      `WITH rcv AS (
         SELECT material_id, SUM(quantity) qty, SUM(amount) amt
         FROM pm_material_received WHERE NOT is_deleted GROUP BY material_id
       ),
       used AS (
         SELECT material_id, SUM(quantity) qty
         FROM pm_material_used WHERE NOT is_deleted GROUP BY material_id
       ),
       adj AS (
         SELECT material_id, SUM(quantity) qty
         FROM pm_material_adjustments WHERE NOT is_deleted GROUP BY material_id
       )
       SELECT
         m.id, m.name, m.unit, m.category, m.min_stock_level,
         COALESCE(rcv.qty, 0) AS total_received,
         COALESCE(used.qty, 0) AS total_used,
         COALESCE(rcv.qty, 0) - COALESCE(used.qty, 0) - COALESCE(adj.qty, 0) AS current_stock,
         CASE WHEN COALESCE(rcv.qty, 0) > 0 THEN ROUND(rcv.amt / rcv.qty, 2) ELSE 0 END AS avg_rate,
         (
           SELECT json_agg(json_build_object(
             'project_id', p2.id,
             'project_name', p2.name,
             'used_qty', COALESCE(u2.qty, 0)
           ))
           FROM (
             SELECT project_id, SUM(quantity) AS qty
             FROM pm_material_used
             WHERE material_id = m.id AND NOT is_deleted
             GROUP BY project_id
           ) u2
           JOIN pm_projects p2 ON p2.id = u2.project_id
         ) AS project_usage
       FROM pm_materials m
       LEFT JOIN rcv ON rcv.material_id = m.id
       LEFT JOIN used ON used.material_id = m.id
       LEFT JOIN adj ON adj.material_id = m.id
       WHERE m.name ILIKE $1 OR m.category ILIKE $1
       ORDER BY m.name
       LIMIT 15`,
      [searchPattern]
    );

    // ── 5. Search Clients / Parties ─────────────────────────────────────────────
    const partyQuery = await pool.query(
      `SELECT
         pa.id, pa.name, COALESCE(pa.phone, '—') AS phone, pa.address,
         COUNT(p.id) AS projects_count,
         COALESCE(SUM(p.contract_value), 0) AS total_contract_value,
         COALESCE((
           SELECT SUM(pay.amount)
           FROM pm_party_payments pay
           JOIN pm_projects pr ON pr.id = pay.project_id
           WHERE pr.party_id = pa.id AND NOT pay.is_deleted
         ), 0) AS total_received
       FROM pm_parties pa
       LEFT JOIN pm_projects p ON p.party_id = pa.id
       WHERE pa.name ILIKE $1 OR pa.phone ILIKE $1 OR pa.address ILIKE $1
       GROUP BY pa.id, pa.name, pa.phone, pa.address
       ORDER BY pa.name
       LIMIT 15`,
      [searchPattern]
    );

    // ── 6. Search Agents ────────────────────────────────────────────────────────
    let agentResults = [];
    try {
      const agentQuery = await pool.query(
        `SELECT u.id, u.name, u.email, COALESCE(u.phone, '—') AS phone,
                COUNT(DISTINCT pa.project_id) AS assigned_projects
         FROM users u
         LEFT JOIN pm_project_agents pa ON pa.agent_id = u.id
         WHERE u.role = 'agent' AND (u.name ILIKE $1 OR u.email ILIKE $1 OR u.phone ILIKE $1)
         GROUP BY u.id, u.name, u.email, u.phone
         LIMIT 10`,
        [searchPattern]
      );
      agentResults = agentQuery.rows;
    } catch {}

    return NextResponse.json({
      success: true,
      query: q,
      results: {
        labor: laborResults,
        vendors: vendorResults,
        projects: projectQuery.rows,
        materials: materialQuery.rows,
        parties: partyQuery.rows,
        agents: agentResults,
      },
      counts: {
        labor: laborResults.length,
        vendors: vendorResults.length,
        projects: projectQuery.rows.length,
        materials: materialQuery.rows.length,
        parties: partyQuery.rows.length,
        agents: agentResults.length,
      }
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

