import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { getJwtSecret, getBearerToken } from '@/lib/auth';

function getContractorFromReq(req) {
  try {
    const token = getBearerToken(req, 'contractor');
    if (token) {
      const decoded = jwt.verify(token, getJwtSecret());
      if (decoded && (decoded.role === 'contractor' || decoded.role === 'vendor' || decoded.id)) {
        return decoded;
      }
    }
  } catch {}
  return null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const authContractor = getContractorFromReq(req);
    const queryEmail = searchParams.get('email');
    const queryPhone = searchParams.get('phone');
    const queryId = searchParams.get('id');

    let contractor = null;

    // 1. Fetch contractor details
    if (authContractor?.id || queryId) {
      const targetId = authContractor?.id || queryId;
      const vRes = await pool.query(
        `SELECT id, email, vendor_name, shop_name, business_name, phone, city, state, country,
                business_type, description, gst_number, pan_number, bank_account_holder, bank_account_number,
                bank_name, bank_ifsc_code, status, verification_status, is_approved, created_at
         FROM vendors WHERE id = $1`,
        [targetId]
      );
      if (vRes.rows.length > 0) {
        contractor = vRes.rows[0];
      }
    }

    if (!contractor && (authContractor?.email || queryEmail)) {
      const targetEmail = String(authContractor?.email || queryEmail).trim().toLowerCase();
      const vRes = await pool.query(
        `SELECT id, email, vendor_name, shop_name, business_name, phone, city, state, country,
                business_type, description, gst_number, pan_number, bank_account_holder, bank_account_number,
                bank_name, bank_ifsc_code, status, verification_status, is_approved, created_at
         FROM vendors WHERE LOWER(TRIM(email)) = $1`,
        [targetEmail]
      );
      if (vRes.rows.length > 0) {
        contractor = vRes.rows[0];
      } else {
        const uRes = await pool.query(
          `SELECT id, name as vendor_name, name as shop_name, name as business_name,
                  email, phone, delivery_city as city, '' as state, 'India' as country,
                  'contractor' as business_type, '' as description, null as gst_number, null as pan_number,
                  'active' as status, 'verified' as verification_status, true as is_approved, created_at
           FROM users WHERE LOWER(TRIM(email)) = $1 AND LOWER(role) = 'contractor'`,
          [targetEmail]
        );
        if (uRes.rows.length > 0) {
          contractor = uRes.rows[0];
        }
      }
    }

    const contractorPhone = contractor?.phone || queryPhone || '';
    const contractorName = contractor?.vendor_name || contractor?.shop_name || '';

    // 2. Fetch Work Orders for this contractor
    let workOrders = [];
    try {
      let woQuery = `
        SELECT pce.id, pce.project_id, pce.agent_id, pce.contractor_name, pce.company_name,
               pce.work_description, pce.contract_amount, pce.paid_amount, pce.payment_date,
               pce.payment_mode, pce.invoice_number, pce.notes, pce.created_at, pce.contractor_phone,
               COALESCE(p.title, pp.name, 'Site Project #' || pce.project_id) AS project_title,
               COALESCE(p.location, pp.site_address, pp.city, 'Site Location') AS site_location,
               COALESCE(p.project_status, pp.status, 'In Progress') AS project_status
        FROM project_contractor_entries pce
        LEFT JOIN projects p ON p.id = pce.project_id
        LEFT JOIN pm_projects pp ON pp.id = pce.project_id
      `;
      let woParams = [];

      if (contractorPhone || contractorName) {
        woQuery += ` WHERE (pce.contractor_phone = $1 OR LOWER(pce.contractor_name) LIKE $2)`;
        woParams = [contractorPhone, `%${contractorName.toLowerCase()}%`];
      }

      woQuery += ` ORDER BY pce.created_at DESC, pce.id DESC LIMIT 50`;
      const woRes = await pool.query(woQuery, woParams);
      workOrders = woRes.rows;
    } catch (e) {
      console.warn('Dashboard workOrders fetch warning:', e.message);
    }

    // 3. Fetch Projects assigned or relevant
    let projects = [];
    try {
      const pRes = await pool.query(`
        SELECT p.id, p.title, p.category, p.location, p.description, p.image_url,
               p.project_status, p.deal_amount, p.started_at, p.completed_at,
               p.client_name, p.client_phone, p.created_at
        FROM projects p
        ORDER BY p.id DESC
        LIMIT 20
      `);
      projects = pRes.rows;
    } catch (e) {
      console.warn('Dashboard projects fetch warning:', e.message);
    }

    // 4. Fetch Daily Labor Attendance entries
    let labourEntries = [];
    try {
      const lRes = await pool.query(`
        SELECT ple.id, ple.project_id, ple.labour_name, ple.labour_role, ple.work_date,
               ple.attendance_status, ple.wage_amount, ple.paid_amount, ple.notes, ple.created_at,
               COALESCE(p.title, 'Project #' || ple.project_id) AS project_title
        FROM project_labour_entries ple
        LEFT JOIN projects p ON p.id = ple.project_id
        ORDER BY ple.work_date DESC, ple.id DESC
        LIMIT 50
      `);
      labourEntries = lRes.rows;
    } catch (e) {
      console.warn('Dashboard labourEntries fetch warning:', e.message);
    }

    // 5. Calculate KPIs
    let totalContractValue = 0;
    let totalPaidAmount = 0;
    let completedWorkOrdersCount = 0;

    for (const wo of workOrders) {
      const cVal = Number(wo.contract_amount) || 0;
      const pVal = Number(wo.paid_amount) || 0;
      totalContractValue += cVal;
      totalPaidAmount += pVal;
      if (pVal >= cVal && cVal > 0) completedWorkOrdersCount++;
    }

    const pendingBalance = Math.max(0, totalContractValue - totalPaidAmount);

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayLaborers = labourEntries.filter(
      (l) => String(l.work_date).slice(0, 10) === todayStr && l.attendance_status !== 'Absent'
    ).length;

    const stats = {
      total_projects: projects.length,
      active_projects: projects.filter(p => !['Completed', 'Cancelled'].includes(p.project_status)).length,
      total_work_orders: workOrders.length,
      completed_work_orders: completedWorkOrdersCount,
      total_contract_value: totalContractValue,
      total_paid_amount: totalPaidAmount,
      pending_balance: pendingBalance,
      total_labor_entries: labourEntries.length,
      today_workers_count: todayLaborers || labourEntries.length,
    };

    return NextResponse.json({
      success: true,
      contractor: contractor || {
        name: authContractor?.name || 'Contractor Partner',
        email: authContractor?.email || '',
        business_type: 'Civil & Construction Contractor',
      },
      stats,
      workOrders,
      projects,
      labourEntries,
    });
  } catch (error) {
    console.error('Contractor dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Could not load dashboard data' },
      { status: 500 }
    );
  }
}
