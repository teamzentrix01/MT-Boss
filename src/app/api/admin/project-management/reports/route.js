import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess, ensureProjectManagementSchema, assertAgentAccess } from '@/lib/project-management';

function toCsvString(headers, rows) {
  const escapeCell = (val) => {
    if (val == null) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(h => escapeCell(h.label)).join(',');
  const rowLines = rows.map(row => headers.map(h => escapeCell(row[h.key])).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

export async function GET(req) {
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();

  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const type = s.get('type') || 'cost_summary';
    const projectId = s.get('projectId') ? Number(s.get('projectId')) : null;
    const materialId = s.get('materialId') ? Number(s.get('materialId')) : null;
    const projectStatus = s.get('projectStatus') || 'all'; // 'all', 'running', 'completed', 'on_hold'
    const search = s.get('search') ? s.get('search').trim() : '';
    const entityType = s.get('entityType') || 'all'; // 'all', 'labor', 'contractor', 'vendor', 'service_provider', 'party'
    const frequency = s.get('frequency') || 'all'; // 'all', 'daily', 'weekly', 'monthly', 'yearly'
    const startDate = s.get('startDate') || null;
    const endDate = s.get('endDate') || null;
    const format = s.get('format') || 'json';

    if (admin.role === 'agent') {
      if (!projectId) {
        return NextResponse.json({ success: false, error: 'ProjectId is required for agent reports' }, { status: 400 });
      }
      const reportCatMap = {
        material_consumption: 'construction',
        stock_running: 'construction',
        labor_summary: 'labor',
        vendor_balance: 'vendor',
        cost_summary: 'payments',
        party_summary: 'payments',
        cross_project_entity: 'payments'
      };
      const neededCat = reportCatMap[type] || 'payments';
      const auth = await assertAgentAccess(req, projectId, neededCat);
      if (!auth.allowed) return auth.response;
    }

    let data = [];
    let headers = [];
    let reportTitle = 'Report';
    let summary = null;

    if (type === 'cross_project_entity') {
      reportTitle = 'Cross-Project Entity Ledger (Labor, Contractor, Vendor, Client)';
      headers = [
        { key: 'entity_type', label: 'Type' },
        { key: 'entity_name', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'trade_or_role', label: 'Trade / Role' },
        { key: 'project_name', label: 'Project' },
        { key: 'project_status', label: 'Project Status' },
        { key: 'work_summary', label: 'Activity / Summary' },
        { key: 'earned_amount', label: 'Total Billed / Earned (₹)' },
        { key: 'paid_amount', label: 'Total Paid (₹)' },
        { key: 'balance_due', label: 'Balance Due (₹)' },
      ];

      const r = await pool.query(
        `WITH unified_entities AS (
           -- 1. Labor & Workers
           SELECT
             'Labor / Worker' AS entity_type,
             l.id AS entity_record_id,
             l.daily_rate,
             l.name AS entity_name,
             COALESCE(l.phone, '—') AS phone,
             COALESCE(l.trade, 'Labor') AS trade_or_role,
             p.id AS project_id,
             p.name AS project_name,
             p.status AS project_status,
             COALESCE(att.days_present, 0) || ' Days Present' ||
               CASE WHEN COALESCE(att.days_half, 0) > 0 THEN ', ' || att.days_half || ' Half-Days' ELSE '' END AS work_summary,
             COALESCE(att.total_earned, 0) AS earned_amount,
             COALESCE(pay.total_paid, 0) AS paid_amount,
             COALESCE(att.total_earned, 0) - COALESCE(pay.total_paid, 0) AS balance_due
           FROM pm_labor l
           JOIN pm_projects p ON p.id = l.project_id
           LEFT JOIN (
             SELECT labor_id,
                    COUNT(*) FILTER (WHERE status = 'present') AS days_present,
                    COUNT(*) FILTER (WHERE status = 'half_day') AS days_half,
                    COALESCE(SUM(wage_amount), 0) AS total_earned
             FROM pm_labor_attendance
             WHERE ($4::date IS NULL OR attendance_date >= $4::date)
               AND ($5::date IS NULL OR attendance_date <= $5::date)
             GROUP BY labor_id
           ) att ON att.labor_id = l.id
           LEFT JOIN (
             SELECT labor_id, COALESCE(SUM(amount), 0) AS total_paid
             FROM pm_labor_payments
             WHERE NOT is_deleted
               AND ($4::date IS NULL OR payment_date >= $4::date)
               AND ($5::date IS NULL OR payment_date <= $5::date)
             GROUP BY labor_id
           ) pay ON pay.labor_id = l.id

           UNION ALL

           -- 2. Vendors, Contractors & Service Providers
           SELECT
             CASE
               WHEN v.trade ILIKE '%contract%' OR pv.pay_type = 'contract' THEN 'Contractor'
               WHEN v.trade ILIKE '%service%' THEN 'Service Provider'
               ELSE 'Vendor / Supplier'
             END AS entity_type,
             pv.id AS entity_record_id,
             NULL::numeric AS daily_rate,
             v.name AS entity_name,
             COALESCE(v.phone, '—') AS phone,
             COALESCE(v.trade, pv.work_description, 'Vendor') AS trade_or_role,
             p.id AS project_id,
             p.name AS project_name,
             p.status AS project_status,
             pv.work_description || ' (' || pv.pay_type || ')' AS work_summary,
             (
               CASE WHEN pv.pay_type = 'contract' THEN COALESCE(pv.contract_amount, 0) ELSE COALESCE(att.wages, 0) END
               + COALESCE(mat.amt, 0)
             ) AS earned_amount,
             COALESCE(pay.total_paid, 0) AS paid_amount,
             (
               (CASE WHEN pv.pay_type = 'contract' THEN COALESCE(pv.contract_amount, 0) ELSE COALESCE(att.wages, 0) END + COALESCE(mat.amt, 0))
               - COALESCE(pay.total_paid, 0)
             ) AS balance_due
           FROM pm_project_vendors pv
           JOIN pm_vendors v ON v.id = pv.vendor_id
           JOIN pm_projects p ON p.id = pv.project_id
           LEFT JOIN (
             SELECT project_vendor_id, COALESCE(SUM(wage_amount), 0) AS wages
             FROM pm_attendance
             WHERE ($4::date IS NULL OR attendance_date >= $4::date)
               AND ($5::date IS NULL OR attendance_date <= $5::date)
             GROUP BY project_vendor_id
           ) att ON att.project_vendor_id = pv.id
           LEFT JOIN (
             SELECT project_vendor_id, COALESCE(SUM(amount), 0) AS amt
             FROM pm_vendor_material_supply
             WHERE NOT is_deleted
               AND ($4::date IS NULL OR supply_date >= $4::date)
               AND ($5::date IS NULL OR supply_date <= $5::date)
             GROUP BY project_vendor_id
           ) mat ON mat.project_vendor_id = pv.id
           LEFT JOIN (
             SELECT project_vendor_id, COALESCE(SUM(amount), 0) AS total_paid
             FROM pm_vendor_payments
             WHERE NOT is_deleted
               AND ($4::date IS NULL OR payment_date >= $4::date)
               AND ($5::date IS NULL OR payment_date <= $5::date)
             GROUP BY project_vendor_id
           ) pay ON pay.project_vendor_id = pv.id

           UNION ALL

           -- 3. Party / Clients
           SELECT
             'Client / Party' AS entity_type,
             p.id AS entity_record_id,
             NULL::numeric AS daily_rate,
             pa.name AS entity_name,
             COALESCE(pa.phone, '—') AS phone,
             'Client' AS trade_or_role,
             p.id AS project_id,
             p.name AS project_name,
             p.status AS project_status,
             'Project: ' || p.name AS work_summary,
             COALESCE(p.contract_value, 0) AS earned_amount,
             COALESCE(pay.amt, 0) AS paid_amount,
             COALESCE(p.contract_value, 0) - COALESCE(pay.amt, 0) AS balance_due
           FROM pm_projects p
           JOIN pm_parties pa ON pa.id = p.party_id
           LEFT JOIN (
             SELECT project_id, COALESCE(SUM(amount), 0) AS amt
             FROM pm_party_payments
             WHERE NOT is_deleted
               AND ($4::date IS NULL OR payment_date >= $4::date)
               AND ($5::date IS NULL OR payment_date <= $5::date)
             GROUP BY project_id
           ) pay ON pay.project_id = p.id
         )
         SELECT * FROM unified_entities
         WHERE ($1::bigint IS NULL OR project_id = $1::bigint)
           AND ($2::text IS NULL OR $2 = 'all' OR project_status = $2)
           AND ($3::text IS NULL OR $3 = '' OR entity_name ILIKE '%' || $3 || '%' OR phone ILIKE '%' || $3 || '%' OR trade_or_role ILIKE '%' || $3 || '%')
           AND (
             $6::text IS NULL OR $6 = 'all' OR
             ($6 = 'labor' AND entity_type = 'Labor / Worker') OR
             ($6 = 'contractor' AND entity_type = 'Contractor') OR
             ($6 = 'vendor' AND entity_type IN ('Vendor / Supplier', 'Contractor', 'Service Provider')) OR
             ($6 = 'service_provider' AND entity_type = 'Service Provider') OR
             ($6 = 'party' AND entity_type = 'Client / Party')
           )
         ORDER BY entity_name, project_name`,
        [projectId, projectStatus, search, startDate, endDate, entityType]
      );
      data = r.rows;

      summary = {
        total_billed: data.reduce((acc, row) => acc + (Number(row.earned_amount) || 0), 0),
        total_paid: data.reduce((acc, row) => acc + (Number(row.paid_amount) || 0), 0),
        total_balance: data.reduce((acc, row) => acc + (Number(row.balance_due) || 0), 0),
        projects_count: new Set(data.map(row => row.project_id)).size,
        entities_count: new Set(data.map(row => `${row.entity_type}::${row.entity_name}::${row.phone}`)).size,
      };

    } else if (type === 'material_consumption') {
      reportTitle = 'Material Consumption Report';

      if (frequency && frequency !== 'all') {
        // Periodic breakdown (daily, weekly, monthly, yearly)
        headers = [
          { key: 'period_label', label: `Period (${frequency.toUpperCase()})` },
          { key: 'project_name', label: 'Project' },
          { key: 'project_status', label: 'Status' },
          { key: 'material_name', label: 'Material' },
          { key: 'unit', label: 'Unit' },
          { key: 'used_qty', label: 'Quantity Used' },
          { key: 'avg_rate', label: 'Avg Rate (₹)' },
          { key: 'consumed_cost', label: 'Consumed Value (₹)' },
        ];

        const r = await pool.query(
          `WITH rcv_rates AS (
             SELECT project_id, material_id,
                    CASE WHEN SUM(quantity) > 0 THEN ROUND(SUM(amount) / SUM(quantity), 2) ELSE 0 END AS avg_rate
             FROM pm_material_received
             WHERE NOT is_deleted
             GROUP BY project_id, material_id
           )
           SELECT
             CASE
               WHEN $6 = 'daily' THEN TO_CHAR(u.used_date, 'YYYY-MM-DD')
               WHEN $6 = 'weekly' THEN 'Week ' || TO_CHAR(DATE_TRUNC('week', u.used_date), 'YYYY-MM-DD')
               WHEN $6 = 'monthly' THEN TO_CHAR(DATE_TRUNC('month', u.used_date), 'YYYY-Mon')
               WHEN $6 = 'yearly' THEN TO_CHAR(DATE_TRUNC('year', u.used_date), 'YYYY')
               ELSE TO_CHAR(u.used_date, 'YYYY-MM-DD')
             END AS period_label,
             p.name AS project_name,
             p.status AS project_status,
             m.name AS material_name,
             COALESCE(u.unit, m.unit) AS unit,
             SUM(u.quantity) AS used_qty,
             COALESCE(rr.avg_rate, 0) AS avg_rate,
             ROUND(SUM(u.quantity) * COALESCE(rr.avg_rate, 0), 2) AS consumed_cost
           FROM pm_material_used u
           JOIN pm_projects p ON p.id = u.project_id
           JOIN pm_materials m ON m.id = u.material_id
           LEFT JOIN rcv_rates rr ON rr.project_id = u.project_id AND rr.material_id = u.material_id
           WHERE NOT u.is_deleted
             AND ($1::bigint IS NULL OR p.id = $1::bigint)
             AND ($2::bigint IS NULL OR m.id = $2::bigint)
             AND ($3::text IS NULL OR $3 = 'all' OR p.status = $3)
             AND ($4::date IS NULL OR u.used_date >= $4::date)
             AND ($5::date IS NULL OR u.used_date <= $5::date)
             AND ($7::text IS NULL OR $7 = '' OR m.name ILIKE '%' || $7 || '%' OR p.name ILIKE '%' || $7 || '%')
           GROUP BY 1, p.name, p.status, m.name, COALESCE(u.unit, m.unit), rr.avg_rate
           ORDER BY 1 DESC, p.name, m.name`,
          [projectId, materialId, projectStatus, startDate, endDate, frequency, search]
        );
        data = r.rows;
      } else {
        // Aggregate summary view
        headers = [
          { key: 'project_name', label: 'Project' },
          { key: 'project_status', label: 'Status' },
          { key: 'material_name', label: 'Material' },
          { key: 'unit', label: 'Unit' },
          { key: 'received', label: 'Total Received' },
          { key: 'used', label: 'Total Used' },
          { key: 'adjusted', label: 'Adjusted/Wastage' },
          { key: 'stock', label: 'Current Stock' },
          { key: 'avg_rate', label: 'Avg Rate (₹)' },
          { key: 'consumed_cost', label: 'Consumed Value (₹)' },
        ];

        const r = await pool.query(
          `WITH rcv AS (
             SELECT project_id, material_id, SUM(quantity) qty, SUM(amount) amt
             FROM pm_material_received
             WHERE NOT is_deleted
               AND ($4::date IS NULL OR received_date >= $4::date)
               AND ($5::date IS NULL OR received_date <= $5::date)
             GROUP BY project_id, material_id
           ),
           used AS (
             SELECT project_id, material_id, SUM(quantity) qty
             FROM pm_material_used
             WHERE NOT is_deleted
               AND ($4::date IS NULL OR used_date >= $4::date)
               AND ($5::date IS NULL OR used_date <= $5::date)
             GROUP BY project_id, material_id
           ),
           adj AS (
             SELECT project_id, material_id, SUM(quantity) qty
             FROM pm_material_adjustments
             WHERE NOT is_deleted
               AND ($4::date IS NULL OR adjustment_date >= $4::date)
               AND ($5::date IS NULL OR adjustment_date <= $5::date)
             GROUP BY project_id, material_id
           )
           SELECT
             p.id AS project_id, p.name AS project_name, p.status AS project_status,
             m.id AS material_id, m.name AS material_name, m.unit,
             COALESCE(rcv.qty, 0) AS received,
             COALESCE(used.qty, 0) AS used,
             COALESCE(adj.qty, 0) AS adjusted,
             COALESCE(rcv.qty, 0) - COALESCE(used.qty, 0) - COALESCE(adj.qty, 0) AS stock,
             CASE WHEN COALESCE(rcv.qty, 0) > 0 THEN ROUND(rcv.amt / rcv.qty, 2) ELSE 0 END AS avg_rate,
             ROUND(COALESCE(used.qty, 0) * (CASE WHEN COALESCE(rcv.qty, 0) > 0 THEN rcv.amt / rcv.qty ELSE 0 END), 2) AS consumed_cost
           FROM pm_projects p
           CROSS JOIN pm_materials m
           LEFT JOIN rcv ON rcv.project_id = p.id AND rcv.material_id = m.id
           LEFT JOIN used ON used.project_id = p.id AND used.material_id = m.id
           LEFT JOIN adj ON adj.project_id = p.id AND adj.material_id = m.id
           WHERE ($1::bigint IS NULL OR p.id = $1::bigint)
             AND ($2::bigint IS NULL OR m.id = $2::bigint)
             AND ($3::text IS NULL OR $3 = 'all' OR p.status = $3)
             AND ($6::text IS NULL OR $6 = '' OR m.name ILIKE '%' || $6 || '%' OR p.name ILIKE '%' || $6 || '%')
             AND (COALESCE(rcv.qty, 0) > 0 OR COALESCE(used.qty, 0) > 0 OR COALESCE(adj.qty, 0) > 0)
           ORDER BY p.name, m.name`,
          [projectId, materialId, projectStatus, startDate, endDate, search]
        );
        data = r.rows;
      }

      summary = {
        total_consumed_cost: data.reduce((acc, row) => acc + (Number(row.consumed_cost) || 0), 0),
        total_used_qty: data.reduce((acc, row) => acc + (Number(row.used_qty || row.used) || 0), 0),
        materials_count: new Set(data.map(row => row.material_name)).size,
        projects_count: new Set(data.map(row => row.project_name)).size,
      };

    } else if (type === 'stock_running') {
      reportTitle = 'Stock Across Running Projects';
      headers = [
        { key: 'project_name', label: 'Project' },
        { key: 'project_status', label: 'Status' },
        { key: 'material_name', label: 'Material' },
        { key: 'unit', label: 'Unit' },
        { key: 'min_stock_level', label: 'Min Level' },
        { key: 'stock', label: 'Stock Balance' },
        { key: 'avg_rate', label: 'Avg Rate (₹)' },
        { key: 'stock_value', label: 'Stock Value (₹)' },
        { key: 'status', label: 'Stock Status' },
      ];

      const r = await pool.query(
        `WITH rcv AS (
           SELECT project_id, material_id, SUM(quantity) qty, SUM(amount) amt
           FROM pm_material_received WHERE NOT is_deleted GROUP BY project_id, material_id
         ),
         used AS (
           SELECT project_id, material_id, SUM(quantity) qty
           FROM pm_material_used WHERE NOT is_deleted GROUP BY project_id, material_id
         ),
         adj AS (
           SELECT project_id, material_id, SUM(quantity) qty
           FROM pm_material_adjustments WHERE NOT is_deleted GROUP BY project_id, material_id
         )
         SELECT
           p.name AS project_name, p.status AS project_status, m.name AS material_name, m.unit, m.min_stock_level,
           COALESCE(rcv.qty, 0) - COALESCE(used.qty, 0) - COALESCE(adj.qty, 0) AS stock,
           CASE WHEN COALESCE(rcv.qty, 0) > 0 THEN ROUND(rcv.amt / rcv.qty, 2) ELSE 0 END AS avg_rate,
           ROUND((COALESCE(rcv.qty, 0) - COALESCE(used.qty, 0) - COALESCE(adj.qty, 0)) * (CASE WHEN COALESCE(rcv.qty, 0) > 0 THEN rcv.amt / rcv.qty ELSE 0 END), 2) AS stock_value,
           CASE
             WHEN (COALESCE(rcv.qty, 0) - COALESCE(used.qty, 0) - COALESCE(adj.qty, 0)) < 0 THEN 'OVER_USED'
             WHEN (COALESCE(rcv.qty, 0) - COALESCE(used.qty, 0) - COALESCE(adj.qty, 0)) <= m.min_stock_level THEN 'LOW_STOCK'
             ELSE 'ADEQUATE'
           END AS status
         FROM pm_projects p
         CROSS JOIN pm_materials m
         LEFT JOIN rcv ON rcv.project_id = p.id AND rcv.material_id = m.id
         LEFT JOIN used ON used.project_id = p.id AND used.material_id = m.id
         LEFT JOIN adj ON adj.project_id = p.id AND adj.material_id = m.id
         WHERE ($1::bigint IS NULL OR p.id = $1::bigint)
           AND ($2::bigint IS NULL OR m.id = $2::bigint)
           AND ($3::text IS NULL OR $3 = 'all' OR p.status = $3)
           AND ($4::text IS NULL OR $4 = '' OR m.name ILIKE '%' || $4 || '%' OR p.name ILIKE '%' || $4 || '%')
           AND (COALESCE(rcv.qty, 0) > 0 OR COALESCE(used.qty, 0) > 0 OR COALESCE(adj.qty, 0) > 0)
         ORDER BY p.name, m.name`,
        [projectId, materialId, projectStatus === 'all' ? null : projectStatus, search]
      );
      data = r.rows;

      summary = {
        total_stock_value: data.reduce((acc, row) => acc + (Number(row.stock_value) || 0), 0),
        low_stock_count: data.filter(row => row.status === 'LOW_STOCK' || row.status === 'OVER_USED').length,
        projects_count: new Set(data.map(row => row.project_name)).size,
      };

    } else if (type === 'cost_summary') {
      reportTitle = 'Project Cost Summary';
      headers = [
        { key: 'project_name', label: 'Project' },
        { key: 'project_status', label: 'Status' },
        { key: 'party_name', label: 'Client / Party' },
        { key: 'party_phone', label: 'Phone' },
        { key: 'contract_value', label: 'Contract Value (₹)' },
        { key: 'vendor_labour_cost', label: 'Vendor Labour (₹)' },
        { key: 'individual_labour_cost', label: 'Individual Labour (₹)' },
        { key: 'labour_cost', label: 'Total Labour (₹)' },
        { key: 'material_cost', label: 'Material Cost (₹)' },
        { key: 'other_expenses', label: 'Other Expenses (₹)' },
        { key: 'total_expense', label: 'Total Expense (₹)' },
        { key: 'received', label: 'Received (₹)' },
        { key: 'profit_or_loss', label: 'Profit / Loss (₹)' },
      ];

      const r = await pool.query(
        `WITH labour AS (
           SELECT pv.project_id,
                  COALESCE(SUM(a.wage_amount), 0) + COALESCE(SUM(pv.contract_amount) FILTER (WHERE pv.pay_type = 'contract'), 0) AS cost
           FROM pm_project_vendors pv
           LEFT JOIN pm_attendance a ON a.project_vendor_id = pv.id
             AND ($4::date IS NULL OR a.attendance_date >= $4::date)
             AND ($5::date IS NULL OR a.attendance_date <= $5::date)
           GROUP BY pv.project_id
         ),
         ind_labour AS (
           SELECT l.project_id, COALESCE(SUM(la.wage_amount), 0) AS cost
           FROM pm_labor l
           JOIN pm_labor_attendance la ON la.labor_id = l.id
             AND ($4::date IS NULL OR la.attendance_date >= $4::date)
             AND ($5::date IS NULL OR la.attendance_date <= $5::date)
           GROUP BY l.project_id
         ),
         vendor_mat AS (
           SELECT pv.project_id, SUM(m.amount) AS cost
           FROM pm_project_vendors pv
           JOIN pm_vendor_material_supply m ON m.project_vendor_id = pv.id
           WHERE NOT m.is_deleted
             AND ($4::date IS NULL OR m.supply_date >= $4::date)
             AND ($5::date IS NULL OR m.supply_date <= $5::date)
           GROUP BY pv.project_id
         ),
         direct_mat AS (
           SELECT project_id, SUM(amount) AS cost
           FROM pm_material_received
           WHERE NOT is_deleted AND vendor_supply_id IS NULL AND NOT transfer_in
             AND ($4::date IS NULL OR received_date >= $4::date)
             AND ($5::date IS NULL OR received_date <= $5::date)
           GROUP BY project_id
         ),
         other_exp AS (
           SELECT project_id, SUM(amount) AS cost
           FROM pm_other_expenses
           WHERE NOT is_deleted
             AND ($4::date IS NULL OR expense_date >= $4::date)
             AND ($5::date IS NULL OR expense_date <= $5::date)
           GROUP BY project_id
         ),
         rcv AS (
           SELECT project_id, SUM(amount) AS amt
           FROM pm_party_payments
           WHERE NOT is_deleted
             AND ($4::date IS NULL OR payment_date >= $4::date)
             AND ($5::date IS NULL OR payment_date <= $5::date)
           GROUP BY project_id
         )
         SELECT
           p.id AS project_id, p.name AS project_name, p.status AS project_status, pa.name AS party_name, COALESCE(pa.phone, '—') AS party_phone,
           p.contract_value,
           COALESCE(l.cost, 0) AS vendor_labour_cost,
           COALESCE(il.cost, 0) AS individual_labour_cost,
           COALESCE(l.cost, 0) + COALESCE(il.cost, 0) AS labour_cost,
           COALESCE(vm.cost, 0) + COALESCE(dm.cost, 0) AS material_cost,
           COALESCE(oe.cost, 0) AS other_expenses,
           COALESCE(l.cost, 0) + COALESCE(il.cost, 0) + COALESCE(vm.cost, 0) + COALESCE(dm.cost, 0) + COALESCE(oe.cost, 0) AS total_expense,
           COALESCE(rcv.amt, 0) AS received,
           COALESCE(rcv.amt, 0) - (COALESCE(l.cost, 0) + COALESCE(il.cost, 0) + COALESCE(vm.cost, 0) + COALESCE(dm.cost, 0) + COALESCE(oe.cost, 0)) AS profit_or_loss
         FROM pm_projects p
         JOIN pm_parties pa ON pa.id = p.party_id
         LEFT JOIN labour l ON l.project_id = p.id
         LEFT JOIN ind_labour il ON il.project_id = p.id
         LEFT JOIN vendor_mat vm ON vm.project_id = p.id
         LEFT JOIN direct_mat dm ON dm.project_id = p.id
         LEFT JOIN other_exp oe ON oe.project_id = p.id
         LEFT JOIN rcv ON rcv.project_id = p.id
         WHERE ($1::bigint IS NULL OR p.id = $1::bigint)
           AND ($2::text IS NULL OR $2 = 'all' OR p.status = $2)
           AND ($3::text IS NULL OR $3 = '' OR p.name ILIKE '%' || $3 || '%' OR pa.name ILIKE '%' || $3 || '%' OR pa.phone ILIKE '%' || $3 || '%')
         ORDER BY p.name`,
        [projectId, projectStatus, search, startDate, endDate]
      );
      data = r.rows;

      summary = {
        total_contract_value: data.reduce((acc, row) => acc + (Number(row.contract_value) || 0), 0),
        total_expense: data.reduce((acc, row) => acc + (Number(row.total_expense) || 0), 0),
        total_received: data.reduce((acc, row) => acc + (Number(row.received) || 0), 0),
        total_profit_or_loss: data.reduce((acc, row) => acc + (Number(row.profit_or_loss) || 0), 0),
        projects_count: data.length,
      };

    } else if (type === 'labor_summary') {
      reportTitle = 'Labor & Worker Summary';
      headers = [
        { key: 'labor_name', label: 'Worker Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'trade', label: 'Trade' },
        { key: 'vendor_name', label: 'Linked Vendor / Contractor' },
        { key: 'project_name', label: 'Project' },
        { key: 'project_status', label: 'Status' },
        { key: 'daily_rate', label: 'Daily Rate (₹)' },
        { key: 'days_present', label: 'Days Present' },
        { key: 'days_half_day', label: 'Days Half-Day' },
        { key: 'total_earned', label: 'Total Earned (₹)' },
        { key: 'total_paid', label: 'Total Paid (₹)' },
        { key: 'balance_due', label: 'Balance Due (₹)' },
        { key: 'status', label: 'Worker Status' },
      ];

      const r = await pool.query(
        `WITH att AS (
           SELECT la.labor_id,
                  COUNT(*) FILTER (WHERE la.status = 'present') AS days_present,
                  COUNT(*) FILTER (WHERE la.status = 'half_day') AS days_half_day,
                  COALESCE(SUM(la.wage_amount), 0) AS total_earned
           FROM pm_labor_attendance la
           WHERE ($3::date IS NULL OR la.attendance_date >= $3::date)
             AND ($4::date IS NULL OR la.attendance_date <= $4::date)
           GROUP BY la.labor_id
         ),
         pay AS (
           SELECT lp.labor_id, COALESCE(SUM(lp.amount), 0) AS total_paid
           FROM pm_labor_payments lp
           WHERE NOT lp.is_deleted
             AND ($3::date IS NULL OR lp.payment_date >= $3::date)
             AND ($4::date IS NULL OR lp.payment_date <= $4::date)
           GROUP BY lp.labor_id
         )
         SELECT
           l.id AS labor_id, l.project_id,
           l.name AS labor_name, COALESCE(l.phone, '—') AS phone, COALESCE(l.trade, '—') AS trade,
           COALESCE(v.name, 'Independent') AS vendor_name,
           p.name AS project_name, p.status AS project_status,
           l.daily_rate,
           COALESCE(att.days_present, 0) AS days_present,
           COALESCE(att.days_half_day, 0) AS days_half_day,
           COALESCE(att.total_earned, 0) AS total_earned,
           COALESCE(pay.total_paid, 0) AS total_paid,
           COALESCE(att.total_earned, 0) - COALESCE(pay.total_paid, 0) AS balance_due,
           CASE WHEN l.is_active THEN 'Active' ELSE 'Inactive' END AS status
         FROM pm_labor l
         JOIN pm_projects p ON p.id = l.project_id
         LEFT JOIN pm_vendors v ON v.id = l.vendor_id
         LEFT JOIN att ON att.labor_id = l.id
         LEFT JOIN pay ON pay.labor_id = l.id
         WHERE ($1::bigint IS NULL OR l.project_id = $1)
           AND ($2::text IS NULL OR $2 = 'all' OR p.status = $2)
           AND ($5::text IS NULL OR $5 = '' OR l.name ILIKE '%' || $5 || '%' OR l.phone ILIKE '%' || $5 || '%' OR v.name ILIKE '%' || $5 || '%' OR l.trade ILIKE '%' || $5 || '%')
         ORDER BY p.name, l.name`,
        [projectId, projectStatus, startDate, endDate, search]
      );
      data = r.rows;

      summary = {
        total_earned: data.reduce((acc, row) => acc + (Number(row.total_earned) || 0), 0),
        total_paid: data.reduce((acc, row) => acc + (Number(row.total_paid) || 0), 0),
        total_balance_due: data.reduce((acc, row) => acc + (Number(row.balance_due) || 0), 0),
        workers_count: data.length,
      };

    } else if (type === 'vendor_balance') {
      reportTitle = 'Vendor & Contractor Balance Summary';
      headers = [
        { key: 'vendor_name', label: 'Vendor / Contractor' },
        { key: 'phone', label: 'Phone' },
        { key: 'trade', label: 'Trade' },
        { key: 'projects_count', label: 'Projects' },
        { key: 'daily_earned', label: 'Daily Wage Earned (₹)' },
        { key: 'contract_earned', label: 'Contract Earned (₹)' },
        { key: 'material_earned', label: 'Material Supplied (₹)' },
        { key: 'total_earned', label: 'Total Earned (₹)' },
        { key: 'total_paid', label: 'Total Paid (₹)' },
        { key: 'balance_due', label: 'Balance Due (₹)' },
      ];

      const r = await pool.query(
        `WITH dw AS (
           SELECT pv.vendor_id, SUM(a.wage_amount) AS amt
           FROM pm_project_vendors pv
           JOIN pm_projects p ON p.id = pv.project_id
           JOIN pm_attendance a ON a.project_vendor_id = pv.id
           WHERE pv.pay_type = 'daily_wage'
             AND ($1::bigint IS NULL OR p.id = $1::bigint)
             AND ($2::text IS NULL OR $2 = 'all' OR p.status = $2)
             AND ($3::date IS NULL OR a.attendance_date >= $3::date)
             AND ($4::date IS NULL OR a.attendance_date <= $4::date)
           GROUP BY pv.vendor_id
         ),
         ct AS (
           SELECT pv.vendor_id, SUM(pv.contract_amount) AS amt
           FROM pm_project_vendors pv
           JOIN pm_projects p ON p.id = pv.project_id
           WHERE pv.pay_type = 'contract'
             AND ($1::bigint IS NULL OR p.id = $1::bigint)
             AND ($2::text IS NULL OR $2 = 'all' OR p.status = $2)
           GROUP BY pv.vendor_id
         ),
         ms AS (
           SELECT pv.vendor_id, SUM(m.amount) AS amt
           FROM pm_project_vendors pv
           JOIN pm_projects p ON p.id = pv.project_id
           JOIN pm_vendor_material_supply m ON m.project_vendor_id = pv.id
           WHERE NOT m.is_deleted
             AND ($1::bigint IS NULL OR p.id = $1::bigint)
             AND ($2::text IS NULL OR $2 = 'all' OR p.status = $2)
             AND ($3::date IS NULL OR m.supply_date >= $3::date)
             AND ($4::date IS NULL OR m.supply_date <= $4::date)
           GROUP BY pv.vendor_id
         ),
         pd AS (
           SELECT pv.vendor_id, SUM(vp.amount) AS amt
           FROM pm_project_vendors pv
           JOIN pm_projects p ON p.id = pv.project_id
           JOIN pm_vendor_payments vp ON vp.project_vendor_id = pv.id
           WHERE NOT vp.is_deleted
             AND ($1::bigint IS NULL OR p.id = $1::bigint)
             AND ($2::text IS NULL OR $2 = 'all' OR p.status = $2)
             AND ($3::date IS NULL OR vp.payment_date >= $3::date)
             AND ($4::date IS NULL OR vp.payment_date <= $4::date)
           GROUP BY pv.vendor_id
         ),
         proj_cnt AS (
           SELECT pv.vendor_id, COUNT(DISTINCT pv.project_id) AS cnt
           FROM pm_project_vendors pv
           JOIN pm_projects p ON p.id = pv.project_id
           WHERE ($1::bigint IS NULL OR p.id = $1::bigint)
             AND ($2::text IS NULL OR $2 = 'all' OR p.status = $2)
           GROUP BY pv.vendor_id
         )
         SELECT
           v.name AS vendor_name, COALESCE(v.phone, '—') AS phone, COALESCE(v.trade, '—') AS trade,
           COALESCE(proj_cnt.cnt, 0) AS projects_count,
           COALESCE(dw.amt, 0) AS daily_earned,
           COALESCE(ct.amt, 0) AS contract_earned,
           COALESCE(ms.amt, 0) AS material_earned,
           COALESCE(dw.amt, 0) + COALESCE(ct.amt, 0) + COALESCE(ms.amt, 0) AS total_earned,
           COALESCE(pd.amt, 0) AS total_paid,
           (COALESCE(dw.amt, 0) + COALESCE(ct.amt, 0) + COALESCE(ms.amt, 0)) - COALESCE(pd.amt, 0) AS balance_due
         FROM pm_vendors v
         LEFT JOIN dw ON dw.vendor_id = v.id
         LEFT JOIN ct ON ct.vendor_id = v.id
         LEFT JOIN ms ON ms.vendor_id = v.id
         LEFT JOIN pd ON pd.vendor_id = v.id
         LEFT JOIN proj_cnt ON proj_cnt.vendor_id = v.id
         WHERE ($5::text IS NULL OR $5 = '' OR v.name ILIKE '%' || $5 || '%' OR v.phone ILIKE '%' || $5 || '%' OR v.trade ILIKE '%' || $5 || '%')
           AND (COALESCE(dw.amt, 0) > 0 OR COALESCE(ct.amt, 0) > 0 OR COALESCE(ms.amt, 0) > 0 OR COALESCE(pd.amt, 0) > 0 OR COALESCE(proj_cnt.cnt, 0) > 0)
         ORDER BY v.name`,
        [projectId, projectStatus, startDate, endDate, search]
      );
      data = r.rows;

      summary = {
        total_earned: data.reduce((acc, row) => acc + (Number(row.total_earned) || 0), 0),
        total_paid: data.reduce((acc, row) => acc + (Number(row.total_paid) || 0), 0),
        total_balance_due: data.reduce((acc, row) => acc + (Number(row.balance_due) || 0), 0),
        vendors_count: data.length,
      };

    } else if (type === 'party_summary') {
      reportTitle = 'Party-wise Contract & Payment Summary';
      headers = [
        { key: 'party_name', label: 'Party / Client' },
        { key: 'phone', label: 'Phone' },
        { key: 'projects_count', label: 'Projects' },
        { key: 'contract_value', label: 'Contract Value (₹)' },
        { key: 'received', label: 'Received (₹)' },
        { key: 'pending', label: 'Pending (₹)' },
        { key: 'total_expense', label: 'Total Expense (₹)' },
        { key: 'net_profit', label: 'Net Profit (₹)' },
      ];

      const r = await pool.query(
        `SELECT
           pa.id AS party_id, pa.name AS party_name, COALESCE(pa.phone, '—') AS phone,
           COUNT(p.id) AS projects_count,
           COALESCE(SUM(p.contract_value), 0) AS contract_value,
           COALESCE((SELECT SUM(pay.amount) FROM pm_party_payments pay JOIN pm_projects pr ON pr.id = pay.project_id WHERE pr.party_id = pa.id AND NOT pay.is_deleted), 0) AS received,
           COALESCE(SUM(p.contract_value), 0) - COALESCE((SELECT SUM(pay.amount) FROM pm_party_payments pay JOIN pm_projects pr ON pr.id = pay.project_id WHERE pr.party_id = pa.id AND NOT pay.is_deleted), 0) AS pending,
           (
             COALESCE((SELECT SUM(a.wage_amount) FROM pm_attendance a JOIN pm_project_vendors pv ON pv.id = a.project_vendor_id JOIN pm_projects p2 ON p2.id = pv.project_id WHERE p2.party_id = pa.id AND pv.pay_type = 'daily_wage'), 0) +
             COALESCE((SELECT SUM(pv.contract_amount) FROM pm_project_vendors pv JOIN pm_projects p2 ON p2.id = pv.project_id WHERE p2.party_id = pa.id AND pv.pay_type = 'contract'), 0) +
             COALESCE((SELECT SUM(m.amount) FROM pm_vendor_material_supply m JOIN pm_project_vendors pv ON pv.id = m.project_vendor_id JOIN pm_projects p2 ON p2.id = pv.project_id WHERE p2.party_id = pa.id AND NOT m.is_deleted), 0) +
             COALESCE((SELECT SUM(mr.amount) FROM pm_material_received mr JOIN pm_projects p2 ON p2.id = mr.project_id WHERE p2.party_id = pa.id AND NOT mr.is_deleted AND mr.vendor_supply_id IS NULL AND NOT mr.transfer_in), 0) +
             COALESCE((SELECT SUM(oe.amount) FROM pm_other_expenses oe JOIN pm_projects p2 ON p2.id = oe.project_id WHERE p2.party_id = pa.id AND NOT oe.is_deleted), 0)
           ) AS total_expense,
           (
             COALESCE((SELECT SUM(pay.amount) FROM pm_party_payments pay JOIN pm_projects pr ON pr.id = pay.project_id WHERE pr.party_id = pa.id AND NOT pay.is_deleted), 0) -
             (
               COALESCE((SELECT SUM(a.wage_amount) FROM pm_attendance a JOIN pm_project_vendors pv ON pv.id = a.project_vendor_id JOIN pm_projects p2 ON p2.id = pv.project_id WHERE p2.party_id = pa.id AND pv.pay_type = 'daily_wage'), 0) +
               COALESCE((SELECT SUM(pv.contract_amount) FROM pm_project_vendors pv JOIN pm_projects p2 ON p2.id = pv.project_id WHERE p2.party_id = pa.id AND pv.pay_type = 'contract'), 0) +
               COALESCE((SELECT SUM(m.amount) FROM pm_vendor_material_supply m JOIN pm_project_vendors pv ON pv.id = m.project_vendor_id JOIN pm_projects p2 ON p2.id = pv.project_id WHERE p2.party_id = pa.id AND NOT m.is_deleted), 0) +
               COALESCE((SELECT SUM(mr.amount) FROM pm_material_received mr JOIN pm_projects p2 ON p2.id = mr.project_id WHERE p2.party_id = pa.id AND NOT mr.is_deleted AND mr.vendor_supply_id IS NULL AND NOT mr.transfer_in), 0) +
               COALESCE((SELECT SUM(oe.amount) FROM pm_other_expenses oe JOIN pm_projects p2 ON p2.id = oe.project_id WHERE p2.party_id = pa.id AND NOT oe.is_deleted), 0)
             )
           ) AS net_profit
         FROM pm_parties pa
         LEFT JOIN pm_projects p ON p.party_id = pa.id AND ($1::text IS NULL OR $1 = 'all' OR p.status = $1)
         WHERE ($2::text IS NULL OR $2 = '' OR pa.name ILIKE '%' || $2 || '%' OR pa.phone ILIKE '%' || $2 || '%')
         GROUP BY pa.id, pa.name, pa.phone
         ORDER BY pa.name`,
        [projectStatus, search]
      );
      data = r.rows;

      summary = {
        total_contract_value: data.reduce((acc, row) => acc + (Number(row.contract_value) || 0), 0),
        total_received: data.reduce((acc, row) => acc + (Number(row.received) || 0), 0),
        total_pending: data.reduce((acc, row) => acc + (Number(row.pending) || 0), 0),
        total_expense: data.reduce((acc, row) => acc + (Number(row.total_expense) || 0), 0),
        total_profit: data.reduce((acc, row) => acc + (Number(row.net_profit) || 0), 0),
        parties_count: data.length,
      };

    } else {
      return NextResponse.json({ success: false, error: 'Unknown report type' }, { status: 400 });
    }

    if (format === 'csv') {
      const csv = toCsvString(headers, data);
      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${type}_report.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      type,
      title: reportTitle,
      headers,
      data,
      summary,
      generated_at: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
