import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema } from '@/lib/project-management';

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
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();

  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const type = s.get('type') || 'cost_summary';
    const projectId = s.get('projectId') ? Number(s.get('projectId')) : null;
    const format = s.get('format') || 'json';

    let data = [];
    let headers = [];
    let reportTitle = 'Report';

    if (type === 'material_consumption') {
      reportTitle = 'Material Consumption Report';
      headers = [
        { key: 'project_name', label: 'Project' },
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
           p.id AS project_id, p.name AS project_name,
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
           AND (COALESCE(rcv.qty, 0) > 0 OR COALESCE(used.qty, 0) > 0 OR COALESCE(adj.qty, 0) > 0)
         ORDER BY p.name, m.name`,
        [projectId]
      );
      data = r.rows;

    } else if (type === 'stock_running') {
      reportTitle = 'Stock Across Running Projects';
      headers = [
        { key: 'project_name', label: 'Project' },
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
           p.name AS project_name, m.name AS material_name, m.unit, m.min_stock_level,
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
         WHERE p.status = 'running'
           AND (COALESCE(rcv.qty, 0) > 0 OR COALESCE(used.qty, 0) > 0 OR COALESCE(adj.qty, 0) > 0)
         ORDER BY p.name, m.name`
      );
      data = r.rows;

    } else if (type === 'cost_summary') {
      reportTitle = 'Project Cost Summary';
      headers = [
        { key: 'project_name', label: 'Project' },
        { key: 'party_name', label: 'Client / Party' },
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
           GROUP BY pv.project_id
         ),
         ind_labour AS (
           SELECT l.project_id, COALESCE(SUM(la.wage_amount), 0) AS cost
           FROM pm_labor l
           JOIN pm_labor_attendance la ON la.labor_id = l.id
           GROUP BY l.project_id
         ),
         vendor_mat AS (
           SELECT pv.project_id, SUM(m.amount) AS cost
           FROM pm_project_vendors pv
           JOIN pm_vendor_material_supply m ON m.project_vendor_id = pv.id
           WHERE NOT m.is_deleted
           GROUP BY pv.project_id
         ),
         direct_mat AS (
           SELECT project_id, SUM(amount) AS cost
           FROM pm_material_received
           WHERE NOT is_deleted AND vendor_supply_id IS NULL AND NOT transfer_in
           GROUP BY project_id
         ),
         other_exp AS (
           SELECT project_id, SUM(amount) AS cost
           FROM pm_other_expenses
           WHERE NOT is_deleted
           GROUP BY project_id
         ),
         rcv AS (
           SELECT project_id, SUM(amount) AS amt
           FROM pm_party_payments
           WHERE NOT is_deleted
           GROUP BY project_id
         )
         SELECT
           p.id AS project_id, p.name AS project_name, pa.name AS party_name,
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
         ORDER BY p.name`
      );
      data = r.rows;

    } else if (type === 'labor_summary') {
      reportTitle = 'Labor & Worker Summary';
      headers = [
        { key: 'labor_name', label: 'Worker Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'trade', label: 'Trade' },
        { key: 'vendor_name', label: 'Linked Vendor' },
        { key: 'project_name', label: 'Project' },
        { key: 'daily_rate', label: 'Daily Rate (₹)' },
        { key: 'days_present', label: 'Days Present' },
        { key: 'days_half_day', label: 'Days Half-Day' },
        { key: 'total_earned', label: 'Total Earned (₹)' },
        { key: 'total_paid', label: 'Total Paid (₹)' },
        { key: 'balance_due', label: 'Balance Due (₹)' },
        { key: 'status', label: 'Status' },
      ];

      const r = await pool.query(
        `WITH att AS (
           SELECT la.labor_id,
                  COUNT(*) FILTER (WHERE la.status = 'present') AS days_present,
                  COUNT(*) FILTER (WHERE la.status = 'half_day') AS days_half_day,
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
           l.name AS labor_name, COALESCE(l.phone, '—') AS phone, COALESCE(l.trade, '—') AS trade,
           COALESCE(v.name, 'Independent') AS vendor_name,
           p.name AS project_name,
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
         ORDER BY p.name, l.name`,
        [projectId]
      );
      data = r.rows;

    } else if (type === 'vendor_balance') {
      reportTitle = 'Vendor Balance Summary';
      headers = [
        { key: 'vendor_name', label: 'Vendor' },
        { key: 'trade', label: 'Trade' },
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
           JOIN pm_attendance a ON a.project_vendor_id = pv.id
           WHERE pv.pay_type = 'daily_wage'
           GROUP BY pv.vendor_id
         ),
         ct AS (
           SELECT pv.vendor_id, SUM(pv.contract_amount) AS amt
           FROM pm_project_vendors pv
           WHERE pv.pay_type = 'contract'
           GROUP BY pv.vendor_id
         ),
         ms AS (
           SELECT pv.vendor_id, SUM(m.amount) AS amt
           FROM pm_project_vendors pv
           JOIN pm_vendor_material_supply m ON m.project_vendor_id = pv.id
           WHERE NOT m.is_deleted
           GROUP BY pv.vendor_id
         ),
         pd AS (
           SELECT pv.vendor_id, SUM(vp.amount) AS amt
           FROM pm_project_vendors pv
           JOIN pm_vendor_payments vp ON vp.project_vendor_id = pv.id
           WHERE NOT vp.is_deleted
           GROUP BY pv.vendor_id
         )
         SELECT
           v.name AS vendor_name, v.trade,
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
         ORDER BY v.name`
      );
      data = r.rows;

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
           pa.id AS party_id, pa.name AS party_name, pa.phone,
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
         LEFT JOIN pm_projects p ON p.party_id = pa.id
         GROUP BY pa.id, pa.name, pa.phone
         ORDER BY pa.name`
      );
      data = r.rows;
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
      generated_at: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
