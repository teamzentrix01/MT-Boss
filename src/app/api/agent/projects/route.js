import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAgent } from '@/lib/agent-auth';
import {
  ensureProjectOpsSchema,
  getProjectOps,
  getProjectSummaries,
  projectBelongsToAgent,
} from '@/lib/project-ops';

const PROJECT_STATUSES = new Set(['lead', 'estimate_sent', 'final', 'started', 'running', 'completed', 'cancelled', 'lost']);

async function getAssignedProject(projectId, agentId) {
  const rows = await getProjectSummaries('WHERE p.id = $1 AND p.assigned_agent_id = $2', [projectId, agentId]);
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

    const projects = await getProjectSummaries('WHERE p.assigned_agent_id = $1', [agent.id]);
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

    const { project_id, project_status, deal_amount, client_name, client_phone, client_email, project_notes } = await req.json();
    if (!project_id) {
      return NextResponse.json({ success: false, error: 'Project id is required' }, { status: 400 });
    }

    const current = await getAssignedProject(project_id, agent.id);
    if (!current || !projectBelongsToAgent(current, agent.id)) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const nextStatus = PROJECT_STATUSES.has(project_status) ? project_status : current.project_status || 'lead';
    const result = await pool.query(
      `UPDATE projects
       SET project_status = $1,
           deal_amount = COALESCE($2, deal_amount),
           client_name = COALESCE($3, client_name),
           client_phone = COALESCE($4, client_phone),
           client_email = COALESCE($5, client_email),
           project_notes = COALESCE($6, project_notes),
           started_at = CASE WHEN $1 IN ('started', 'running') THEN COALESCE(started_at, NOW()) ELSE started_at END,
           completed_at = CASE WHEN $1 = 'completed' THEN COALESCE(completed_at, NOW()) ELSE completed_at END
       WHERE id = $7 AND assigned_agent_id = $8
       RETURNING *`,
      [
        nextStatus,
        deal_amount === '' || deal_amount === undefined ? null : Number(deal_amount),
        client_name || null,
        client_phone || null,
        client_email || null,
        project_notes || null,
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
      if (amount <= 0) return NextResponse.json({ success: false, error: 'Payment amount is required' }, { status: 400 });
      result = await pool.query(
        `INSERT INTO project_payments (project_id, agent_id, amount, payment_date, payment_mode, notes)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [project_id, agent.id, amount, body.payment_date || new Date(), body.payment_mode || null, body.notes || null]
      );
    } else if (entry_type === 'labour') {
      if (!body.labour_name) return NextResponse.json({ success: false, error: 'Labour name is required' }, { status: 400 });
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
          Number(body.wage_amount || 0),
          Number(body.paid_amount || 0),
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
      if (!body.expense_type || amount <= 0) {
        return NextResponse.json({ success: false, error: 'Expense type and amount are required' }, { status: 400 });
      }
      result = await pool.query(
        `INSERT INTO project_expenses (project_id, agent_id, expense_type, amount, expense_date, notes)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [project_id, agent.id, body.expense_type, amount, body.expense_date || new Date(), body.notes || null]
      );
    } else if (entry_type === 'media') {
      if (!body.media_url) return NextResponse.json({ success: false, error: 'Media URL is required' }, { status: 400 });
      result = await pool.query(
        `INSERT INTO project_media (project_id, agent_id, media_type, media_url, caption, media_date)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [project_id, agent.id, body.media_type || 'photo', body.media_url, body.caption || null, body.media_date || new Date()]
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
