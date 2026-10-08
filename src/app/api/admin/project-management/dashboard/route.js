import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase4Schema } from '@/lib/project-management';

// In-process cache: key → { data, at }
const cache = new Map();
const CACHE_TTL = 60_000; // 60 s

export async function GET(req) {
  const admin = await requirePmAccess(req);
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementPhase4Schema();
    const sp = new URL(req.url).searchParams;
    const partyId  = sp.get('partyId')  || '';
    const status   = sp.get('status')   || 'all';
    const dateFrom = sp.get('dateFrom') || null;
    const dateTo   = sp.get('dateTo')   || null;
    const bust     = sp.get('bust') === '1';

    const cacheKey = JSON.stringify({ partyId, status, dateFrom, dateTo });
    const now = Date.now();
    const cached = cache.get(cacheKey);
    if (!bust && cached && now - cached.at < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Single CTE query: every child table aggregated in its own subquery
    const [main, monthly] = await Promise.all([
      pool.query(`
        WITH projects AS (
          SELECT p.id, p.name, p.party_id, p.start_date, p.expected_end_date,
                 p.contract_value, p.status, p.created_at,
                 GREATEST(0, CURRENT_DATE - p.start_date::date) AS days_running,
                 pa.name AS party_name
          FROM pm_projects p
          JOIN pm_parties pa ON pa.id = p.party_id
          ${admin.role === 'agent' ? `JOIN pm_project_agents pa_agent ON pa_agent.project_id = p.id AND pa_agent.agent_id = ${admin.id}` : ''}
          WHERE ($1 = ''  OR p.party_id = $1::bigint)
            AND ($2 = 'all' OR p.status  = $2)
            AND ($3::date IS NULL OR p.start_date >= $3::date)
            AND ($4::date IS NULL OR p.start_date <= $4::date)
        ),
        party_rcv AS (
          SELECT project_id, COALESCE(SUM(amount), 0) AS received
          FROM pm_party_payments
          WHERE NOT is_deleted AND project_id IN (SELECT id FROM projects)
          GROUP BY project_id
        ),
        labour AS (
          SELECT pv.project_id, COALESCE(SUM(a.wage_amount), 0) AS amount
          FROM pm_project_vendors pv
          JOIN pm_attendance a ON a.project_vendor_id = pv.id
          WHERE pv.project_id IN (SELECT id FROM projects)
          GROUP BY pv.project_id
        ),
        ind_labour AS (
          SELECT l.project_id, COALESCE(SUM(la.wage_amount), 0) AS amount
          FROM pm_labor l
          JOIN pm_labor_attendance la ON la.labor_id = l.id
          WHERE l.project_id IN (SELECT id FROM projects)
          GROUP BY l.project_id
        ),
        vmat AS (
          SELECT pv.project_id, COALESCE(SUM(s.amount), 0) AS amount
          FROM pm_project_vendors pv
          JOIN pm_vendor_material_supply s ON s.project_vendor_id = pv.id
          WHERE NOT s.is_deleted AND pv.project_id IN (SELECT id FROM projects)
          GROUP BY pv.project_id
        ),
        mrcv AS (
          SELECT project_id, COALESCE(SUM(amount), 0) AS amount
          FROM pm_material_received
          WHERE NOT is_deleted AND project_id IN (SELECT id FROM projects)
          GROUP BY project_id
        ),
        other_exp AS (
          SELECT project_id, COALESCE(SUM(amount), 0) AS amount
          FROM pm_other_expenses
          WHERE NOT is_deleted AND project_id IN (SELECT id FROM projects)
          GROUP BY project_id
        )
        SELECT pr.*,
          COALESCE(rc.received, 0)                                                      AS received,
          pr.contract_value - COALESCE(rc.received, 0)                                  AS pending,
          COALESCE(l.amount,  0) + COALESCE(il.amount, 0)                                AS labour_cost,
          COALESCE(l.amount,  0)                                                         AS vendor_labour_cost,
          COALESCE(il.amount, 0)                                                         AS individual_labour_cost,
          COALESCE(vm.amount, 0) + COALESCE(mr.amount, 0)                               AS material_cost,
          COALESCE(oe.amount, 0)                                                         AS other_cost,
          COALESCE(l.amount, 0) + COALESCE(il.amount, 0) + COALESCE(vm.amount,0) + COALESCE(mr.amount,0) + COALESCE(oe.amount,0) AS total_expense,
          COALESCE(rc.received,0) - (COALESCE(l.amount,0)+COALESCE(il.amount, 0)+COALESCE(vm.amount,0)+COALESCE(mr.amount,0)+COALESCE(oe.amount,0)) AS profit
        FROM projects pr
        LEFT JOIN party_rcv  rc ON rc.project_id = pr.id
        LEFT JOIN labour     l  ON l.project_id  = pr.id
        LEFT JOIN ind_labour il ON il.project_id = pr.id
        LEFT JOIN vmat       vm ON vm.project_id = pr.id
        LEFT JOIN mrcv       mr ON mr.project_id = pr.id
        LEFT JOIN other_exp  oe ON oe.project_id = pr.id
        ORDER BY
          CASE pr.status WHEN 'running' THEN 0 WHEN 'on_hold' THEN 1 WHEN 'completed' THEN 2 ELSE 3 END,
          pr.start_date DESC
      `, [partyId, status, dateFrom, dateTo]),

      // Monthly trend (last 6 months) – independent of filters for a cross-portfolio view
      pool.query(`
        WITH months AS (
          SELECT generate_series(
            date_trunc('month', CURRENT_DATE - interval '5 months'),
            date_trunc('month', CURRENT_DATE),
            interval '1 month'
          )::date AS mo
        ),
        m_rcv  AS (SELECT date_trunc('month',payment_date)::date mo, SUM(amount) v FROM pm_party_payments        WHERE NOT is_deleted AND payment_date >= CURRENT_DATE-interval '6 months' GROUP BY 1),
        m_lab  AS (
          SELECT mo, SUM(v) v FROM (
            SELECT date_trunc('month',attendance_date)::date mo, SUM(wage_amount) v FROM pm_attendance WHERE attendance_date >= CURRENT_DATE-interval '6 months' GROUP BY 1
            UNION ALL
            SELECT date_trunc('month',attendance_date)::date mo, SUM(wage_amount) v FROM pm_labor_attendance WHERE attendance_date >= CURRENT_DATE-interval '6 months' GROUP BY 1
          ) t GROUP BY 1
        ),
        m_vmat AS (SELECT date_trunc('month',supply_date)::date mo, SUM(amount) v FROM pm_vendor_material_supply WHERE NOT is_deleted AND supply_date >= CURRENT_DATE-interval '6 months' GROUP BY 1),
        m_mrcv AS (SELECT date_trunc('month',received_date)::date mo, SUM(amount) v FROM pm_material_received    WHERE NOT is_deleted AND received_date >= CURRENT_DATE-interval '6 months' GROUP BY 1),
        m_oth  AS (SELECT date_trunc('month',expense_date)::date mo, SUM(amount) v FROM pm_other_expenses        WHERE NOT is_deleted AND expense_date >= CURRENT_DATE-interval '6 months' GROUP BY 1)
        SELECT m.mo AS month_start,
          COALESCE(r.v,0) AS received,
          COALESCE(l.v,0)+COALESCE(vm.v,0)+COALESCE(mr.v,0)+COALESCE(oe.v,0) AS expense
        FROM months m
        LEFT JOIN m_rcv  r  ON r.mo  = m.mo
        LEFT JOIN m_lab  l  ON l.mo  = m.mo
        LEFT JOIN m_vmat vm ON vm.mo = m.mo
        LEFT JOIN m_mrcv mr ON mr.mo = m.mo
        LEFT JOIN m_oth  oe ON oe.mo = m.mo
        ORDER BY m.mo ASC
      `),
    ]);

    const hasPayments = admin.role === 'admin' || admin.role === 'site_supervisor' || (admin.specializations || []).includes('payments');
    const hasLabor = admin.role === 'admin' || admin.role === 'site_supervisor' || (admin.specializations || []).includes('labor');
    const hasConstruction = admin.role === 'admin' || admin.role === 'site_supervisor' || (admin.specializations || []).includes('construction');

    const rows = main.rows.map(r => {
      const copy = { ...r };
      if (!hasPayments) {
        copy.contract_value = null;
        copy.received = null;
        copy.pending = null;
        copy.total_expense = null;
        copy.profit = null;
      }
      if (!hasLabor) {
        copy.labour_cost = null;
        copy.vendor_labour_cost = null;
        copy.individual_labour_cost = null;
      }
      if (!hasConstruction) {
        copy.material_cost = null;
        copy.other_cost = null;
      }
      return copy;
    });

    const totals = rows.reduce((acc, r) => {
      if (r.status === 'running') acc.running++;
      if (hasPayments) {
        acc.contract  += Number(r.contract_value  || 0);
        acc.received  += Number(r.received        || 0);
        acc.pending   += Number(r.pending         || 0);
        acc.expense   += Number(r.total_expense   || 0);
        acc.profit    += Number(r.profit          || 0);
      }
      if (hasLabor) {
        acc.labour    += Number(r.labour_cost     || 0);
      }
      if (hasConstruction) {
        acc.material  += Number(r.material_cost   || 0);
        acc.other     += Number(r.other_cost      || 0);
      }
      acc.total++;
      return acc;
    }, {
      total: 0,
      running: 0,
      contract: hasPayments ? 0 : null,
      received: hasPayments ? 0 : null,
      pending: hasPayments ? 0 : null,
      labour: hasLabor ? 0 : null,
      material: hasConstruction ? 0 : null,
      other: hasConstruction ? 0 : null,
      expense: hasPayments ? 0 : null,
      profit: hasPayments ? 0 : null
    });

    const data = { success: true, totals, projects: rows, monthly: hasPayments ? monthly.rows : [], generatedAt: new Date().toISOString() };
    cache.set(cacheKey, { data, at: now });
    return NextResponse.json(data);
  } catch (error) {
    console.error('PM dashboard error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
