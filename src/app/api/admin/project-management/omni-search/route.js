import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requirePmAccess, ensureProjectManagementSchema } from '@/lib/project-management';
import { unauthorized } from '@/lib/auth';

function makeSearchFilter(columnExpr, rawQuery) {
  const q = (rawQuery || '').trim();
  const tokens = q.split(/\s+/).filter(Boolean);
  const params = [`%${q}%`];
  if (tokens.length <= 1) {
    return { sql: `${columnExpr} ILIKE $1`, params };
  }
  const tokenClauses = tokens.map((t) => {
    params.push(`%${t}%`);
    return `${columnExpr} ILIKE $${params.length}`;
  });
  return {
    sql: `(${columnExpr} ILIKE $1 OR (${tokenClauses.join(' AND ')}))`,
    params,
  };
}

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
          contractors: [],
          vendors: [],
          projects: [],
          materials: [],
          parties: [],
          agents: []
        },
        counts: { labor: 0, contractors: 0, vendors: 0, projects: 0, materials: 0, parties: 0, agents: 0 }
      });
    }

    // ── 1. Search Labor & Workers (with cross-project aggregation) ───────────────
    const laborFilter = makeSearchFilter("CONCAT_WS(' ', l.name, l.phone, l.trade, p.name)", q);
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
       WHERE ${laborFilter.sql}
       ORDER BY l.name, p.name
       LIMIT 30`,
      laborFilter.params
    );

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

    // ── 2. Search Service Providers & Contractors ────────────────────────────────
    const contractorFilter = makeSearchFilter('search_text', q);
    const contractorQuery = await pool.query(
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
       ),
       all_contractors AS (
         SELECT
           v.id::text AS vendor_id,
           v.name AS vendor_name,
           COALESCE(v.phone, '—') AS phone,
           COALESCE(v.trade, 'Contractor') AS trade,
           'contractor' AS entity_kind,
           p.id AS project_id,
           COALESCE(p.name, '—') AS project_name,
           COALESCE(p.status, 'running') AS project_status,
           COALESCE(pv.id, 0) AS project_vendor_id,
           COALESCE(pv.work_description, 'Service Provider / Contractor') AS work_description,
           COALESCE(pv.pay_type, 'contract') AS pay_type,
           COALESCE(dw.amt, 0) + COALESCE(ct.amt, 0) + COALESCE(ms.amt, 0) AS earned_amount,
           COALESCE(pd.amt, 0) AS paid_amount,
           (COALESCE(dw.amt, 0) + COALESCE(ct.amt, 0) + COALESCE(ms.amt, 0)) - COALESCE(pd.amt, 0) AS balance_due,
           CONCAT_WS(' ', v.name, v.phone, v.trade, pv.work_description, p.name, 'Service Provider Contractor') AS search_text
         FROM pm_vendors v
         LEFT JOIN pm_project_vendors pv ON pv.vendor_id = v.id
         LEFT JOIN pm_projects p ON p.id = pv.project_id
         LEFT JOIN dw ON dw.vendor_id = v.id AND dw.project_id = p.id
         LEFT JOIN ct ON ct.vendor_id = v.id AND ct.project_id = p.id
         LEFT JOIN ms ON ms.vendor_id = v.id AND ms.project_id = p.id
         LEFT JOIN pd ON pd.vendor_id = v.id AND pd.project_id = p.id
       )
       SELECT * FROM all_contractors
       WHERE ${contractorFilter.sql}
       ORDER BY vendor_name, project_name
       LIMIT 40`,
      contractorFilter.params
    );

    const contractorGroupMap = new Map();
    for (const row of contractorQuery.rows) {
      const key = (row.phone && row.phone !== '—') ? `phone:${row.phone}` : `name:${row.vendor_name.trim().toLowerCase()}`;
      if (!contractorGroupMap.has(key)) {
        contractorGroupMap.set(key, {
          vendor_id: row.vendor_id,
          name: row.vendor_name,
          phone: row.phone,
          trade: row.trade,
          entity_kind: 'contractor',
          total_earned: 0,
          total_paid: 0,
          total_balance: 0,
          projects: []
        });
      }
      const group = contractorGroupMap.get(key);
      group.total_earned += Number(row.earned_amount) || 0;
      group.total_paid += Number(row.paid_amount) || 0;
      group.total_balance += Number(row.balance_due) || 0;
      if (row.project_id && row.project_vendor_id && Number(row.project_vendor_id) > 0) {
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
    }
    const contractorResults = Array.from(contractorGroupMap.values());

    // ── 3. Search Material Vendors & Suppliers ──────────────────────────────────
    const vendorFilter = makeSearchFilter('search_text', q);
    const vendorQuery = await pool.query(
      `WITH supp_paid AS (
         SELECT
           project_id,
           LOWER(TRIM(supplier_name)) AS supp_key,
           COALESCE(SUM(amount), 0) AS total_paid
         FROM pm_supplier_payments
         WHERE NOT is_deleted AND supplier_name IS NOT NULL
         GROUP BY project_id, LOWER(TRIM(supplier_name))
       ),
       all_mat_vendors AS (
         -- Material Deliveries from pm_material_received
         SELECT
           ('supp_' || md5(LOWER(TRIM(mr.supplier_name)))) AS vendor_id,
           TRIM(mr.supplier_name) AS vendor_name,
           '—' AS phone,
           'Material Supplier' AS trade,
           'supplier' AS entity_kind,
           p.id AS project_id,
           p.name AS project_name,
           p.status AS project_status,
           STRING_AGG(DISTINCT (m.name || ' (' || mr.quantity || ' ' || COALESCE(mr.unit, m.unit, 'units') || ')'), ', ') AS work_description,
           'material_supply' AS pay_type,
           SUM(mr.amount) AS earned_amount,
           COALESCE(sp.total_paid, 0) AS paid_amount,
           SUM(mr.amount) - COALESCE(sp.total_paid, 0) AS balance_due,
           CONCAT_WS(' ', mr.supplier_name, STRING_AGG(DISTINCT m.name, ' '), p.name, 'Material Vendor Supplier') AS search_text
         FROM pm_material_received mr
         JOIN pm_projects p ON p.id = mr.project_id
         JOIN pm_materials m ON m.id = mr.material_id
         LEFT JOIN supp_paid sp ON sp.project_id = mr.project_id AND sp.supp_key = LOWER(TRIM(mr.supplier_name))
         WHERE NOT mr.is_deleted AND mr.supplier_name IS NOT NULL AND TRIM(mr.supplier_name) <> ''
         GROUP BY mr.supplier_name, p.id, p.name, p.status, sp.total_paid

         UNION ALL

         -- Local Project Site Vendors
         SELECT
           ('local_' || plv.id) AS vendor_id,
           plv.name AS vendor_name,
           COALESCE(plv.phone, '—') AS phone,
           COALESCE(plv.material_type, 'Local Vendor') AS trade,
           'supplier' AS entity_kind,
           p.id AS project_id,
           p.name AS project_name,
           p.status AS project_status,
           COALESCE(plv.material_type, 'Local Site Vendor') AS work_description,
           'local_vendor' AS pay_type,
           0 AS earned_amount,
           0 AS paid_amount,
           0 AS balance_due,
           CONCAT_WS(' ', plv.name, plv.phone, plv.city, plv.material_type, p.name, 'Local Vendor Material Supplier') AS search_text
         FROM pm_project_local_vendors plv
         JOIN pm_projects p ON p.id = plv.project_id
       )
       SELECT * FROM all_mat_vendors
       WHERE ${vendorFilter.sql}
       ORDER BY vendor_name, project_name
       LIMIT 40`,
      vendorFilter.params
    );

    const vendorGroupMap = new Map();
    for (const row of vendorQuery.rows) {
      const key = (row.phone && row.phone !== '—') ? `phone:${row.phone}` : `name:${row.vendor_name.trim().toLowerCase()}`;
      if (!vendorGroupMap.has(key)) {
        vendorGroupMap.set(key, {
          vendor_id: row.vendor_id,
          name: row.vendor_name,
          supplier_name: row.vendor_name,
          phone: row.phone,
          trade: row.trade,
          entity_kind: 'supplier',
          total_earned: 0,
          total_paid: 0,
          total_balance: 0,
          projects: []
        });
      }
      const group = vendorGroupMap.get(key);
      group.total_earned += Number(row.earned_amount) || 0;
      group.total_paid += Number(row.paid_amount) || 0;
      group.total_balance += Number(row.balance_due) || 0;
      if (row.project_id) {
        group.projects.push({
          project_id: row.project_id,
          project_name: row.project_name,
          project_status: row.project_status,
          supplier_name: row.vendor_name,
          work_description: row.work_description,
          pay_type: row.pay_type,
          earned: Number(row.earned_amount) || 0,
          paid: Number(row.paid_amount) || 0,
          balance: Number(row.balance_due) || 0,
        });
      }
    }
    const vendorResults = Array.from(vendorGroupMap.values());

    // ── 3. Search Projects ──────────────────────────────────────────────────────
    const projFilter = makeSearchFilter("CONCAT_WS(' ', p.name, pa.name, pa.phone, p.site_address)", q);
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
       WHERE (${projFilter.sql})
          OR EXISTS (
            SELECT 1 FROM pm_project_vendors pv
            JOIN pm_vendors v ON v.id = pv.vendor_id
            WHERE pv.project_id = p.id AND (v.name ILIKE $1 OR v.phone ILIKE $1 OR v.trade ILIKE $1)
          )
          OR EXISTS (
            SELECT 1 FROM pm_material_received mr
            WHERE mr.project_id = p.id AND mr.supplier_name ILIKE $1
          )
          OR EXISTS (
            SELECT 1 FROM pm_project_local_vendors plv
            WHERE plv.project_id = p.id AND (plv.name ILIKE $1 OR plv.phone ILIKE $1)
          )
          OR EXISTS (
            SELECT 1 FROM pm_labor l
            WHERE l.project_id = p.id AND (l.name ILIKE $1 OR l.phone ILIKE $1)
          )
       ORDER BY p.name
       LIMIT 15`,
      projFilter.params
    );

    // ── 4. Search Materials (Stock & Consumption) ──────────────────────────────
    const matFilter = makeSearchFilter("CONCAT_WS(' ', m.name, m.category, COALESCE(supp.names, ''))", q);
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
       ),
       supp AS (
         SELECT material_id, STRING_AGG(DISTINCT supplier_name, ' ') AS names
         FROM pm_material_received
         WHERE NOT is_deleted AND supplier_name IS NOT NULL
         GROUP BY material_id
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
       LEFT JOIN supp ON supp.material_id = m.id
       WHERE ${matFilter.sql}
       ORDER BY m.name
       LIMIT 15`,
      matFilter.params
    );

    // ── 5. Search Clients / Parties ─────────────────────────────────────────────
    const partyFilter = makeSearchFilter("CONCAT_WS(' ', pa.name, pa.phone, pa.address)", q);
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
       WHERE ${partyFilter.sql}
       GROUP BY pa.id, pa.name, pa.phone, pa.address
       ORDER BY pa.name
       LIMIT 15`,
      partyFilter.params
    );

    // ── 6. Search Agents ────────────────────────────────────────────────────────
    let agentResults = [];
    try {
      const agentFilter = makeSearchFilter("CONCAT_WS(' ', u.name, u.email, u.phone)", q);
      const agentQuery = await pool.query(
        `SELECT u.id, u.name, u.email, COALESCE(u.phone, '—') AS phone,
                COUNT(DISTINCT pa.project_id) AS assigned_projects
         FROM users u
         LEFT JOIN pm_project_agents pa ON pa.agent_id = u.id
         WHERE u.role = 'agent' AND (${agentFilter.sql})
         GROUP BY u.id, u.name, u.email, u.phone
         LIMIT 10`,
        agentFilter.params
      );
      agentResults = agentQuery.rows;
    } catch {}

    return NextResponse.json({
      success: true,
      query: q,
      results: {
        labor: laborResults,
        contractors: contractorResults,
        vendors: vendorResults,
        projects: projectQuery.rows,
        materials: materialQuery.rows,
        parties: partyQuery.rows,
        agents: agentResults,
      },
      counts: {
        labor: laborResults.length,
        contractors: contractorResults.length,
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
