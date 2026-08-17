import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAgent } from '@/lib/agent-auth';
import {
  ensureProjectOpsSchema,
  getProjectOps,
  getProjectSummaries,
  projectBelongsToAgent,
} from '@/lib/project-ops';

const PROJECT_STATUSES = new Set(['lead', 'estimate_sent', 'final', 'started', 'ongoing', 'running', 'on_hold', 'completed', 'cancelled', 'lost']);

function passwordGate(agent) {
  if (!agent?.must_change_password) return null;
  return NextResponse.json(
    { success: false, error: 'Change your temporary password before accessing projects.', mustChangePassword: true },
    { status: 428 }
  );
}

const ENTRY_TABLES = {
  payment: 'project_payments',
  labour: 'project_labour_entries',
  contractor: 'project_contractor_entries',
  material: 'project_material_entries',
  expense: 'project_expenses',
  transport: 'project_transport_entries',
};

async function getAssignedProject(projectId, agentId) {
  const rows = await getProjectSummaries(
    "WHERE p.id = $1 AND p.assigned_agent_id = $2 AND p.project_kind = 'operational'",
    [projectId, agentId]
  );
  return rows[0] || null;
}

export async function GET(req) {
  try {
    await ensureAgentSchema();
    await ensureProjectOpsSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');

    if (projectId) {
      const project = await getAssignedProject(projectId, agent.id);
      if (!project) {
        return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
      }
      const ops = await getProjectOps(projectId);
      return NextResponse.json({ success: true, project, ...ops });
    }

    const projects = await getProjectSummaries(
      "WHERE p.assigned_agent_id = $1 AND p.project_kind = 'operational'",
      [agent.id]
    );
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Agent projects fetch error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await ensureAgentSchema();
    await ensureProjectOpsSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

    const body = await req.json();
    const { project_id, project_status, deal_amount, client_name, client_phone, client_email, project_notes } = body;
    if (!project_id) {
      return NextResponse.json({ success: false, error: 'Project id is required' }, { status: 400 });
    }

    const current = await getAssignedProject(project_id, agent.id);
    if (!current || !projectBelongsToAgent(current, agent.id)) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const nextStatus = PROJECT_STATUSES.has(project_status) ? project_status : current.project_status || 'lead';
    const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
    if (has('project_status') && !PROJECT_STATUSES.has(project_status)) {
      return NextResponse.json({ success: false, error: 'Invalid project status.' }, { status: 400 });
    }
    const nextDealAmount = !has('deal_amount') || deal_amount === '' || deal_amount === null ? 0 : Number(deal_amount);
    if (has('deal_amount') && (!Number.isFinite(nextDealAmount) || nextDealAmount < 0)) {
      return NextResponse.json({ success: false, error: 'Deal amount must be a valid non-negative number.' }, { status: 400 });
    }
    const result = await pool.query(
      `UPDATE projects
       SET project_status = $1,
           deal_amount = CASE WHEN $2::BOOLEAN THEN $3 ELSE deal_amount END,
           client_name = CASE WHEN $4::BOOLEAN THEN $5 ELSE client_name END,
           client_phone = CASE WHEN $6::BOOLEAN THEN $7 ELSE client_phone END,
           client_email = CASE WHEN $8::BOOLEAN THEN $9 ELSE client_email END,
           project_notes = CASE WHEN $10::BOOLEAN THEN $11 ELSE project_notes END,
           started_at = CASE WHEN $1 IN ('started', 'ongoing', 'running') THEN COALESCE(started_at, NOW()) ELSE started_at END,
           completed_at = CASE WHEN $1 = 'completed' THEN COALESCE(completed_at, NOW()) ELSE completed_at END
       WHERE id = $12 AND assigned_agent_id = $13 AND project_kind = 'operational'
       RETURNING *`,
      [
        nextStatus,
        has('deal_amount'), nextDealAmount,
        has('client_name'), String(client_name || '').trim() || null,
        has('client_phone'), String(client_phone || '').trim() || null,
        has('client_email'), String(client_email || '').trim() || null,
        has('project_notes'), String(project_notes || '').trim() || null,
        project_id,
        agent.id,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Agent project update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureAgentSchema();
    await ensureProjectOpsSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

    const body = await req.json();
    const { project_id, entry_type } = body;
    if (!project_id || !entry_type) {
      return NextResponse.json({ success: false, error: 'Project id and entry type are required' }, { status: 400 });
    }

    const project = await getAssignedProject(project_id, agent.id);
    if (!project || !projectBelongsToAgent(project, agent.id)) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    let result;
    if (entry_type === 'payment') {
      const amount = Number(body.amount || 0);
      if (!Number.isFinite(amount) || amount <= 0) return NextResponse.json({ success: false, error: 'Payment amount is required' }, { status: 400 });
      result = await pool.query(
        `INSERT INTO project_payments (project_id, agent_id, amount, payment_date, payment_mode, notes)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [project_id, agent.id, amount, body.payment_date || new Date(), body.payment_mode || null, body.notes || null]
      );
    } else if (entry_type === 'labour') {
      if (!body.labour_name) return NextResponse.json({ success: false, error: 'Labour name is required' }, { status: 400 });
      const wageAmount = Number(body.wage_amount || 0);
      const paidAmount = Number(body.paid_amount || 0);
      if (!Number.isFinite(wageAmount) || wageAmount < 0 || !Number.isFinite(paidAmount) || paidAmount < 0) {
        return NextResponse.json({ success: false, error: 'Labour amounts must be valid non-negative numbers.' }, { status: 400 });
      }
      result = await pool.query(
        `INSERT INTO project_labour_entries
          (project_id, agent_id, labour_name, labour_role, work_date, attendance_status, wage_amount, paid_amount, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          project_id,
          agent.id,
          body.labour_name,
          body.labour_role || null,
          body.work_date || new Date(),
          body.attendance_status || 'present',
          wageAmount,
          paidAmount,
          body.notes || null,
        ]
      );
    } else if (entry_type === 'contractor') {
    const contractAmount = Number(body.contract_amount || 0);
    const paidAmount = Number(body.paid_amount || 0);
    const contractorPhone = String(body.contractor_phone || '').replace(/\D/g, '');
    if (!body.contractor_name || !/^[6-9]\d{9}$/.test(contractorPhone) || paidAmount <= 0) {
      return NextResponse.json({ success: false, error: 'Contractor name, valid 10-digit mobile number, and payment amount are required' }, { status: 400 });
      }
      if (!Number.isFinite(contractAmount) || contractAmount < 0 || !Number.isFinite(paidAmount)) {
        return NextResponse.json({ success: false, error: 'Enter valid non-negative contractor amounts' }, { status: 400 });
      }
      result = await pool.query(
        `INSERT INTO project_contractor_entries (
          project_id, agent_id, contractor_name, contractor_phone, company_name, work_description,
          contract_amount, paid_amount, payment_date, payment_mode, invoice_number, notes
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
        [
          project_id,
          agent.id,
          body.contractor_name,
          contractorPhone,
          body.company_name || null,
          body.work_description || null,
          contractAmount,
          paidAmount,
          body.payment_date || new Date(),
          body.payment_mode || null,
          body.invoice_number || null,
          body.notes || null,
        ]
      );
    } else if (entry_type === 'material') {
      if (!body.material_name) return NextResponse.json({ success: false, error: 'Material name is required' }, { status: 400 });
      const quantity = Number(body.quantity || 0);
      const rate = Number(body.rate || 0);
      const total = body.total_amount === undefined || body.total_amount === ''
        ? quantity * rate
        : Number(body.total_amount || 0);
      if (![quantity, rate, total].every(Number.isFinite) || quantity < 0 || rate < 0 || total < 0) {
        return NextResponse.json({ success: false, error: 'Material amounts must be valid non-negative numbers.' }, { status: 400 });
      }
      result = await pool.query(
        `INSERT INTO project_material_entries
          (project_id, agent_id, material_name, quantity, unit, rate, total_amount, supplier_name, vehicle_number, bill_url, entry_date, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
        [
          project_id,
          agent.id,
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
    } else if (entry_type === 'expense') {
      const amount = Number(body.amount || 0);
      if (!body.expense_type || !Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json({ success: false, error: 'Expense type and amount are required' }, { status: 400 });
      }
      result = await pool.query(
        `INSERT INTO project_expenses (project_id, agent_id, expense_type, amount, expense_date, notes)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [project_id, agent.id, body.expense_type, amount, body.expense_date || new Date(), body.notes || null]
      );
    } else if (entry_type === 'transport') {
      const amount = Number(body.amount || 0);
      if (!body.transport_type) {
        return NextResponse.json({ success: false, error: 'Transport type is required' }, { status: 400 });
      }
      if (!Number.isFinite(amount) || amount < 0) {
        return NextResponse.json({ success: false, error: 'Transport amount must be a valid non-negative number.' }, { status: 400 });
      }
      result = await pool.query(
        `INSERT INTO project_transport_entries
          (project_id, agent_id, transport_type, vehicle_number, driver_name, driver_phone,
           from_location, to_location, amount, transport_date, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [
          project_id,
          agent.id,
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
    } else {
      return NextResponse.json({ success: false, error: 'Unknown entry type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Agent project entry error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await ensureAgentSchema();
    await ensureProjectOpsSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

    const { searchParams } = new URL(req.url);
    const projectId = Number(searchParams.get('project_id'));
    const entryId = Number(searchParams.get('entry_id'));
    const entryType = searchParams.get('entry_type');
    const table = ENTRY_TABLES[entryType];
    if (!Number.isInteger(projectId) || !Number.isInteger(entryId) || !table) {
      return NextResponse.json({ success: false, error: 'Valid project, entry and entry type are required.' }, { status: 400 });
    }

    const project = await getAssignedProject(projectId, agent.id);
    if (!project || !projectBelongsToAgent(project, agent.id)) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const result = await pool.query(
      `DELETE FROM ${table}
        WHERE id = $1 AND project_id = $2 AND agent_id = $3
        RETURNING id`,
      [entryId, projectId, agent.id]
    );
    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Project entry not found or belongs to another agent.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deleted_id: result.rows[0].id });
  } catch (error) {
    console.error('Agent project entry delete error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
