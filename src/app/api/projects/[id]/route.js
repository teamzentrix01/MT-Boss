import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectOpsSchema, getProjectOps, getProjectSummaries } from '@/lib/project-ops';
import { ensureAgentSchema } from '@/lib/agent-auth';
import { ensureAgentNotificationsSchema } from '@/lib/agent-notifications';
import { fallbackProjects } from '@/lib/public-fallbacks';
import { isDatabaseConnectionError } from '@/lib/api-utils';

const PROJECT_STATUSES = new Set([
  'lead',
  'estimate_sent',
  'final',
  'started',
  'ongoing',
  'running',
  'on_hold',
  'completed',
  'cancelled',
  'lost',
]);

const ENTRY_TABLES = {
  payment: 'project_payments',
  labour: 'project_labour_entries',
  material: 'project_material_entries',
  expense: 'project_expenses',
  transport: 'project_transport_entries',
  contractor: 'project_contractor_entries',
};

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const manage = searchParams.get('manage') === '1';

    if (manage || searchParams.get('details') === '1' || searchParams.get('operational') === '1') {
      const pmAccess = await requirePmAccess(req);
      if (!pmAccess) return unauthorized();
      await ensureAgentSchema();

      // Check if it's an unconverted lead
      if (String(id).startsWith('lead_')) {
        const leadNumericId = String(id).replace('lead_', '');
        const leadRes = await pool.query(`SELECT * FROM agent_leads WHERE id = $1`, [leadNumericId]);
        const lead = leadRes.rows[0];
        if (!lead) return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
        return NextResponse.json({
          success: true,
          project: {
            id: `lead_${lead.id}`,
            lead_id: lead.id,
            name: lead.service_type || lead.client_requirement || 'Lead Project',
            party_name: lead.client_name,
            party_phone: lead.client_phone,
            party_email: lead.client_email,
            party_address: lead.city,
            site_address: lead.city,
            project_city: lead.city,
            start_date: lead.created_at,
            status: 'lead_not_converted',
            contract_value: lead.final_amount || 0,
            received: 0,
            pending: lead.final_amount || 0,
            total_expense: 0,
            profit: 0,
            lead_client_name: lead.client_name,
            lead_client_phone: lead.client_phone,
            lead_client_email: lead.client_email,
            lead_service_type: lead.service_type,
            lead_client_requirement: lead.client_requirement,
            lead_notes: lead.notes,
            lead_daily_visit_notes: lead.daily_visit_notes,
            lead_city: lead.city,
            lead_stage: lead.lead_stage,
            lead_status: lead.status,
            vendor_count: 0,
            total_vendor_cost: 0,
            labor_count: 0,
            total_labor_cost: 0,
            material_received_count: 0,
            total_material_cost: 0,
            total_other_expenses: 0,
            is_lead_only: true,
          },
          agents: [],
          is_pm: false,
        });
      }

      // Check if it's a pm_projects project
      if (Number.isInteger(Number(id)) && Number(id) > 0) {
        const pmDetailQuery = `
          SELECT 
            p.*,
            pa.name AS party_name,
            pa.phone AS party_phone,
            pa.email AS party_email,
            pa.address AS party_address,
            pa.gst_no AS party_gst_no,
            al.id AS lead_id,
            al.client_name AS lead_client_name,
            al.client_phone AS lead_client_phone,
            al.client_email AS lead_client_email,
            al.service_type AS lead_service_type,
            al.client_requirement AS lead_client_requirement,
            al.notes AS lead_notes,
            al.daily_visit_notes AS lead_daily_visit_notes,
            al.city AS lead_city,
            al.lead_stage AS lead_stage,
            al.status AS lead_status,
            COALESCE(pt.received, 0) AS received,
            (p.contract_value - COALESCE(pt.received, 0)) AS pending,
            COALESCE(v.vendor_count, 0) AS vendor_count,
            COALESCE(v.total_vendor_cost, 0) AS total_vendor_cost,
            COALESCE(v.total_vendor_paid, 0) AS total_vendor_paid,
            COALESCE(lb.labor_count, 0) AS labor_count,
            COALESCE(lb.total_labor_cost, 0) AS total_labor_cost,
            COALESCE(m.material_received_count, 0) AS material_received_count,
            COALESCE(m.total_material_cost, 0) AS total_material_cost,
            COALESCE(oe.total_other_expenses, 0) AS total_other_expenses,
            (COALESCE(lb.total_labor_cost, 0) + COALESCE(m.total_material_cost, 0) + COALESCE(oe.total_other_expenses, 0)) AS total_expense,
            (COALESCE(pt.received, 0) - (COALESCE(lb.total_labor_cost, 0) + COALESCE(m.total_material_cost, 0) + COALESCE(oe.total_other_expenses, 0))) AS profit
          FROM pm_projects p
          JOIN pm_parties pa ON pa.id = p.party_id
          LEFT JOIN agent_leads al ON (al.id = p.source_lead_id OR al.converted_project_id = p.id)
          LEFT JOIN (
            SELECT project_id, SUM(amount) AS received
            FROM pm_party_payments
            WHERE NOT is_deleted
            GROUP BY project_id
          ) pt ON pt.project_id = p.id
          LEFT JOIN (
            SELECT 
              pv.project_id,
              COUNT(DISTINCT pv.id) AS vendor_count,
              COALESCE(SUM(CASE WHEN pv.pay_type = 'daily_wage' THEN a.wage_amount ELSE 0 END), 0) +
              COALESCE(SUM(CASE WHEN pv.pay_type = 'contract' THEN pv.contract_amount ELSE 0 END), 0) AS total_vendor_cost,
              COALESCE(SUM(vp.paid_amount), 0) AS total_vendor_paid
            FROM pm_project_vendors pv
            LEFT JOIN pm_attendance a ON a.project_vendor_id = pv.id
            LEFT JOIN (
              SELECT project_vendor_id, SUM(amount) AS paid_amount
              FROM pm_vendor_payments WHERE NOT is_deleted GROUP BY project_vendor_id
            ) vp ON vp.project_vendor_id = pv.id
            GROUP BY pv.project_id
          ) v ON v.project_id = p.id
          LEFT JOIN (
            SELECT 
              l.project_id,
              COUNT(DISTINCT l.id) AS labor_count,
              COALESCE(SUM(la.wage_amount), 0) AS total_labor_cost
            FROM pm_labor l
            LEFT JOIN pm_labor_attendance la ON la.labor_id = l.id
            GROUP BY l.project_id
          ) lb ON lb.project_id = p.id
          LEFT JOIN (
            SELECT 
              mr.project_id,
              COUNT(mr.id) AS material_received_count,
              COALESCE(SUM(mr.amount), 0) AS total_material_cost
            FROM pm_material_received mr
            WHERE NOT mr.is_deleted AND NOT mr.transfer_in
            GROUP BY mr.project_id
          ) m ON m.project_id = p.id
          LEFT JOIN (
            SELECT project_id, SUM(amount) AS total_other_expenses
            FROM pm_other_expenses
            WHERE NOT is_deleted
            GROUP BY project_id
          ) oe ON oe.project_id = p.id
          WHERE p.id = $1
        `;
        const pmRes = await pool.query(pmDetailQuery, [id]);
        if (pmRes.rows[0]) {
          const agentsRes = await pool.query(
            `SELECT a.id, a.name, a.email, a.phone, a.city, pa.assigned_at
             FROM pm_project_agents pa
             JOIN agents a ON a.id = pa.agent_id
             WHERE pa.project_id = $1
             ORDER BY pa.assigned_at ASC`,
            [id]
          );
          return NextResponse.json({
            success: true,
            project: pmRes.rows[0],
            agents: agentsRes.rows,
            is_pm: true,
          });
        }
      }

      const rows = await getProjectSummaries("WHERE p.id = $1 AND p.project_kind = 'operational'", [id]);
      const project = rows[0];
      if (!project) {
        return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
      }

      const [ops, agents] = await Promise.all([
        getProjectOps(id),
        pool.query(
          `SELECT id, name, city
            FROM agents
            WHERE status = 'Approved'
              AND login_enabled = TRUE
              AND must_change_password = FALSE
              AND ($1 = '' OR LOWER(TRIM(COALESCE(city, ''))) = LOWER(TRIM($1)))
            ORDER BY name ASC`,
          [String(project.location || '').trim()]
        ),
      ]);
      return NextResponse.json({ success: true, project, agents: agents.rows, ...ops });
    }

    await ensureProjectOpsSchema();
    const result = await pool.query(
      `SELECT id, title, category, location, description, image_url,
              cloudinary_public_id, size, status, created_at, additional_images
         FROM projects
        WHERE id = $1 AND project_kind = 'portfolio' AND status = 'published'`,
      [id]
    );
    if (result.rows.length === 0) {
      const fallback = fallbackProjects.find((p) => String(p.id) === String(id));
      if (fallback) {
        return NextResponse.json({ success: true, data: fallback });
      }
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Project fetch error:', error);
    if (isDatabaseConnectionError(error)) {
      const fallback = fallbackProjects.find((p) => String(p.id) === String(id));
      if (fallback) {
        return NextResponse.json({ success: true, data: fallback });
      }
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const pmAccess = await requirePmAccess(req);
    if (!pmAccess) return unauthorized();
    await ensureProjectOpsSchema();
    await ensureAgentNotificationsSchema();

    const { id } = await params;
    const body = await req.json();
    const nextStatus = PROJECT_STATUSES.has(body.project_status) ? body.project_status : null;
    const assignmentProvided = Object.prototype.hasOwnProperty.call(body, 'assigned_agent_id');
    const dealAmountProvided = Object.prototype.hasOwnProperty.call(body, 'deal_amount');
    const parsedDealAmount = body.deal_amount === '' || body.deal_amount === null ? 0 : Number(body.deal_amount);
    if (dealAmountProvided && (!Number.isFinite(parsedDealAmount) || parsedDealAmount < 0)) {
      return NextResponse.json({ success: false, error: 'Deal amount must be a valid non-negative number' }, { status: 400 });
    }
    // Check if project exists in pm_projects
    if (Number.isInteger(Number(id)) && Number(id) > 0) {
      const pmRes = await pool.query(
        `SELECT p.id, COALESCE(p.city, p.site_address, pa.address, '') AS location,
                (SELECT pa_inner.agent_id FROM pm_project_agents pa_inner WHERE pa_inner.project_id = p.id LIMIT 1) AS assigned_agent_id
         FROM pm_projects p
         JOIN pm_parties pa ON pa.id = p.party_id
         WHERE p.id = $1`,
        [id]
      );
      if (pmRes.rows[0]) {
        const pmProject = pmRes.rows[0];
        const targetAgentId = assignmentProvided && body.assigned_agent_id ? Number(body.assigned_agent_id) : null;
        let selectedAgent = null;

        if (assignmentProvided && body.assigned_agent_id) {
          const agentRes = await pool.query(
            `SELECT id, name, city FROM agents WHERE id = $1 AND status = 'Approved' AND login_enabled = TRUE AND must_change_password = FALSE`,
            [targetAgentId]
          );
          selectedAgent = agentRes.rows[0];
          if (!selectedAgent) {
            return NextResponse.json({ success: false, error: 'Select a valid approved agent' }, { status: 400 });
          }
          const projectCity = String(pmProject.location || '').trim().toLowerCase();
          const agentCity = String(selectedAgent.city || '').trim().toLowerCase();
          if (projectCity && agentCity && projectCity !== agentCity && !projectCity.includes(agentCity) && !agentCity.includes(projectCity)) {
            return NextResponse.json(
              { success: false, error: `Agent city must match project city (${pmProject.location})` },
              { status: 400 }
            );
          }
        }

        if (assignmentProvided) {
          await pool.query('DELETE FROM pm_project_agents WHERE project_id = $1', [id]);
          if (targetAgentId) {
            await pool.query(
              `INSERT INTO pm_project_agents (project_id, agent_id, assigned_by)
               VALUES ($1, $2, $3)
               ON CONFLICT (project_id, agent_id) DO NOTHING`,
              [id, targetAgentId, pmAccess?.email || 'admin']
            );
          }
          await pool.query('UPDATE agent_leads SET agent_id = $1 WHERE converted_project_id = $2', [targetAgentId, id]);
        }

        const updatedRes = await pool.query(
          `SELECT 
            p.id::text AS id,
            p.party_id::text AS party_id,
            p.name AS title,
            p.name AS project_name,
            COALESCE(p.site_address, pa.address, '') AS site_address,
            COALESCE(p.city, p.site_address, pa.address, '') AS location,
            p.start_date,
            p.expected_end_date,
            COALESCE(p.contract_value, 0)::numeric AS deal_amount,
            COALESCE(p.contract_value, 0)::numeric AS contract_value,
            p.built_up_area,
            p.status AS project_status,
            p.status,
            COALESCE(al.service_type, p.project_type, 'General') AS category,
            p.city AS project_city,
            p.source_lead_id::text AS source_lead_id,
            p.created_at,
            pa.name AS client_name,
            pa.name AS party_name,
            pa.phone AS client_phone,
            pa.phone AS party_phone,
            pa.email AS client_email,
            pa.email AS party_email,
            pa.address AS party_address,
            $2::integer AS assigned_agent_id,
            $3::text AS assigned_agent_name,
            CASE WHEN p.source_lead_id IS NOT NULL OR al.id IS NOT NULL THEN 'Lead' ELSE 'Manual' END AS source,
            false AS is_lead_only
          FROM pm_projects p
          JOIN pm_parties pa ON pa.id = p.party_id
          LEFT JOIN agent_leads al ON (al.id = p.source_lead_id OR al.converted_project_id = p.id)
          WHERE p.id = $1`,
          [id, targetAgentId, selectedAgent ? selectedAgent.name : null]
        );

        return NextResponse.json({
          success: true,
          data: updatedRes.rows[0],
          message: targetAgentId ? 'Project assigned successfully.' : 'Project is now unassigned.'
        });
      }
    }

    const currentResult = await pool.query(
      "SELECT id, location, assigned_agent_id FROM projects WHERE id = $1 AND project_kind = 'operational'",
      [id]
    );
    const current = currentResult.rows[0];
    if (!current) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    if (assignmentProvided && body.assigned_agent_id) {
      const agent = await pool.query(
        `SELECT id, name, city FROM agents WHERE id = $1 AND status = 'Approved' AND login_enabled = TRUE AND must_change_password = FALSE`,
        [body.assigned_agent_id]
      );
      const selectedAgent = agent.rows[0];
      if (!selectedAgent) {
        return NextResponse.json({ success: false, error: 'Select a valid approved agent' }, { status: 400 });
      }
      const projectCity = String(current.location || '').trim().toLowerCase();
      const agentCity = String(selectedAgent.city || '').trim().toLowerCase();
      if (projectCity && projectCity !== agentCity) {
        return NextResponse.json(
          { success: false, error: `Agent city must match project city (${current.location})` },
          { status: 400 }
        );
      }
    }

    const result = await pool.query(
      `UPDATE projects
       SET project_status = COALESCE($1, project_status),
           deal_amount = COALESCE($2, deal_amount),
           client_name = CASE WHEN $3::BOOLEAN THEN $4 ELSE client_name END,
           client_phone = CASE WHEN $5::BOOLEAN THEN $6 ELSE client_phone END,
           client_email = CASE WHEN $7::BOOLEAN THEN $8 ELSE client_email END,
           project_notes = CASE WHEN $9::BOOLEAN THEN $10 ELSE project_notes END,
           assigned_agent_id = CASE
             WHEN $11::BOOLEAN THEN NULLIF($12::TEXT, '')::INTEGER
             ELSE assigned_agent_id
           END,
           assigned_by_role = CASE WHEN $11::BOOLEAN THEN 'admin' ELSE assigned_by_role END,
           assigned_by_id = CASE WHEN $11::BOOLEAN THEN $13 ELSE assigned_by_id END,
           assigned_at = CASE WHEN $11::BOOLEAN AND assigned_agent_id IS DISTINCT FROM NULLIF($12::TEXT, '')::INTEGER THEN NOW() ELSE assigned_at END,
           started_at = CASE WHEN $1 IN ('started', 'ongoing', 'running') THEN COALESCE(started_at, NOW()) ELSE started_at END,
           completed_at = CASE WHEN $1 = 'completed' THEN COALESCE(completed_at, NOW()) ELSE completed_at END
       WHERE id = $14 AND project_kind = 'operational'
       RETURNING *`,
      [
        nextStatus,
        dealAmountProvided ? parsedDealAmount : null,
        Object.prototype.hasOwnProperty.call(body, 'client_name'),
        body.client_name ?? null,
        Object.prototype.hasOwnProperty.call(body, 'client_phone'),
        body.client_phone ?? null,
        Object.prototype.hasOwnProperty.call(body, 'client_email'),
        body.client_email ?? null,
        Object.prototype.hasOwnProperty.call(body, 'project_notes'),
        body.project_notes ?? '',
        assignmentProvided,
        body.assigned_agent_id ?? '',
        Number(pmAccess?.id || 0) || null,
        id,
      ]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const rows = await getProjectSummaries("WHERE p.id = $1 AND p.project_kind = 'operational'", [id]);
    return NextResponse.json({ success: true, data: rows[0] || result.rows[0] });
  } catch (error) {
    console.error('Admin project update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const pmAccess = await requirePmAccess(req);
    if (!pmAccess) return unauthorized();
    await ensureProjectOpsSchema();

    const { id } = await params;
    const body = await req.json();
    const entryType = body.entry_type;

    const exists = await pool.query(
      "SELECT id, assigned_agent_id FROM projects WHERE id = $1 AND project_kind = 'operational'",
      [id]
    );
    const project = exists.rows[0];
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    let result;
    if (entryType === 'payment') {
      const amount = Number(body.amount || 0);
      if (amount <= 0) return NextResponse.json({ success: false, error: 'Payment amount is required' }, { status: 400 });
      result = await pool.query(
        `INSERT INTO project_payments (project_id, agent_id, amount, payment_date, payment_mode, notes)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [id, project.assigned_agent_id || null, amount, body.payment_date || new Date(), body.payment_mode || null, body.notes || null]
      );
    } else if (entryType === 'labour') {
      if (!body.labour_name) return NextResponse.json({ success: false, error: 'Labour name is required' }, { status: 400 });
      result = await pool.query(
        `INSERT INTO project_labour_entries
          (project_id, agent_id, labour_name, labour_role, work_date, attendance_status, wage_amount, paid_amount, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          id,
          project.assigned_agent_id || null,
          body.labour_name,
          body.labour_role || null,
          body.work_date || new Date(),
          body.attendance_status || 'present',
          Number(body.wage_amount || 0),
          Number(body.paid_amount || 0),
          body.notes || null,
        ]
      );
    } else if (entryType === 'material') {
      if (!body.material_name) return NextResponse.json({ success: false, error: 'Material name is required' }, { status: 400 });
      const quantity = Number(body.quantity || 0);
      const rate = Number(body.rate || 0);
      const total = body.total_amount === undefined || body.total_amount === ''
        ? quantity * rate
        : Number(body.total_amount || 0);
      result = await pool.query(
        `INSERT INTO project_material_entries
          (project_id, agent_id, material_name, quantity, unit, rate, total_amount, supplier_name, vehicle_number, bill_url, entry_date, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
        [
          id,
          project.assigned_agent_id || null,
          body.material_name,
          quantity,
          body.unit || null,
          rate,
          total,
          body.supplier_name || null,
          body.vehicle_number || null,
          body.bill_url || null,
          body.entry_date || new Date(),
          body.notes || null,
        ]
      );
    } else if (entryType === 'expense') {
      const amount = Number(body.amount || 0);
      if (!body.expense_type || amount <= 0) {
        return NextResponse.json({ success: false, error: 'Expense type and amount are required' }, { status: 400 });
      }
      result = await pool.query(
        `INSERT INTO project_expenses (project_id, agent_id, expense_type, amount, expense_date, notes)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [id, project.assigned_agent_id || null, body.expense_type, amount, body.expense_date || new Date(), body.notes || null]
      );
    } else if (entryType === 'transport') {
      const amount = Number(body.amount || 0);
      if (!body.transport_type) {
        return NextResponse.json({ success: false, error: 'Transport type is required' }, { status: 400 });
      }
      result = await pool.query(
        `INSERT INTO project_transport_entries
          (project_id, agent_id, transport_type, vehicle_number, driver_name, driver_phone,
           from_location, to_location, amount, transport_date, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [
          id,
          project.assigned_agent_id || null,
          body.transport_type,
          body.vehicle_number || null,
          body.driver_name || null,
          body.driver_phone || null,
          body.from_location || null,
          body.to_location || null,
          amount,
          body.transport_date || new Date(),
          body.notes || null,
        ]
      );
    } else if (entryType === 'contractor') {
      const contractAmount = Number(body.contract_amount || 0);
      const paidAmount = Number(body.paid_amount || 0);
      const contractorPhone = String(body.contractor_phone || '').replace(/\D/g, '');
      if (!body.contractor_name || !/^[6-9]\d{9}$/.test(contractorPhone) || paidAmount <= 0) {
        return NextResponse.json(
          { success: false, error: 'Contractor name, valid 10-digit mobile number, and payment amount are required' },
          { status: 400 }
        );
      }
      if (!Number.isFinite(contractAmount) || contractAmount < 0 || !Number.isFinite(paidAmount)) {
        return NextResponse.json({ success: false, error: 'Enter valid non-negative contractor amounts' }, { status: 400 });
      }

      // A contractor is identified by their mobile number within a project. The
      // contract value belongs to the contractor, not to every instalment. Older
      // records may have repeated it, so the ledger reads the highest value; new
      // instalments intentionally store zero to prevent further double counting.
      const existingContractor = await pool.query(
        `SELECT contractor_name, contractor_phone, company_name, work_description,
                MAX(contract_amount) AS contract_amount
           FROM project_contractor_entries
          WHERE project_id = $1
            AND REGEXP_REPLACE(COALESCE(contractor_phone, ''), '\\D', '', 'g') = $2
          GROUP BY contractor_name, contractor_phone, company_name, work_description
          ORDER BY MAX(created_at) DESC
          LIMIT 1`,
        [id, contractorPhone]
      );
      const existing = existingContractor.rows[0];
      if (!existing && contractAmount <= 0) {
        return NextResponse.json(
          { success: false, error: 'Contract value is required when adding a new contractor' },
          { status: 400 }
        );
      }
      result = await pool.query(
        `INSERT INTO project_contractor_entries (
          project_id, agent_id, contractor_name, contractor_phone, company_name, work_description,
          contract_amount, paid_amount, payment_date, payment_mode, invoice_number, notes
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
        [
          id,
          project.assigned_agent_id || null,
          body.contractor_name || existing?.contractor_name,
          contractorPhone,
          body.company_name || existing?.company_name || null,
          body.work_description || existing?.work_description || null,
          existing ? 0 : contractAmount,
          paidAmount,
          body.payment_date || new Date(),
          body.payment_mode || null,
          body.invoice_number || null,
          body.notes || null,
        ]
      );
    } else {
      return NextResponse.json({ success: false, error: 'Unknown entry type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Admin project entry error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const pmAccess = await requirePmAccess(req);
    if (!pmAccess) return unauthorized();
    await ensureProjectOpsSchema();

    const { id: projectId } = await params;
    const { entry_type, id } = await req.json();
    const table = ENTRY_TABLES[entry_type];
    if (!table || !id) {
      return NextResponse.json({ success: false, error: 'Entry type and id are required' }, { status: 400 });
    }

    const project = await pool.query(
      "SELECT id FROM projects WHERE id = $1 AND project_kind = 'operational'",
      [projectId]
    );
    if (!project.rows[0]) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 AND project_id = $2 RETURNING id`,
      [id, projectId]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin project entry delete error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
