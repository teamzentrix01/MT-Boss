import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema } from '@/lib/agent-auth';
import { createInitializationGuard } from '@/lib/api-utils';
import { franchiseAccessResponse, getFranchiseAccess } from '@/lib/franchise-access';
import { convertFinalLeadToProject, ensureProjectOpsSchema } from '@/lib/project-ops';
import { ensureAgentNotificationsSchema } from '@/lib/agent-notifications';

const STATUSES = new Set(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost']);
const STAGES = new Set(['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost']);

function filterLead(lead, permissions) {
  const visible = { ...lead };
  const can = (...keys) => keys.some((key) => permissions[key]);
  if (!can('leads.view_contact_details')) {
    delete visible.client_phone;
    delete visible.client_email;
  }
  if (!can('leads.view_service_details')) {
    delete visible.service_type;
    delete visible.lead_type;
    delete visible.city;
  }
  if (!can('leads.view_source')) delete visible.lead_source;
  if (!can('leads.view_notes', 'leads.edit_notes', 'leads.manage')) delete visible.notes;
  if (!can('financials.view', 'financials.view_deal', 'financials.edit_deal')) delete visible.final_amount;
  if (!can('leads.view_assigned_agent', 'agents.assign', 'agents.assign_leads')) {
    delete visible.agent_name;
    delete visible.agent_id;
  }
  return visible;
}

const ensureSchema = createInitializationGuard(async () => {
  await ensureAgentSchema();
  try { await pool.query(`ALTER TABLE agent_leads ALTER COLUMN agent_id DROP NOT NULL`); } catch { /* ok */ }
  const alters = [
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS assigned_franchise_id INTEGER`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS assigned_by_role VARCHAR(40) DEFAULT 'admin'`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS source_ref_table VARCHAR(80)`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS source_ref_id INTEGER`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS priority VARCHAR(30) DEFAULT 'Normal'`,
  ];
  for (const sql of alters) await pool.query(sql);
});

export async function GET(req) {
  try {
    const access = await getFranchiseAccess(req, 'leads.view');
    if (!access.allowed) return franchiseAccessResponse(access);
    const franchise = access.user;
    await ensureSchema();

    const leads = await pool.query(
        `SELECT l.*, a.name AS agent_name
         FROM agent_leads l
         LEFT JOIN agents a ON a.id = l.agent_id
         WHERE l.assigned_franchise_id = $1
         ORDER BY l.created_at DESC`,
        [franchise.id]
      );

    const data = leads.rows.map((lead) => filterLead(lead, access.permissions));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Franchise lead management GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  let client;
  try {
    const access = await getFranchiseAccess(req, 'leads.view');
    if (!access.allowed) return franchiseAccessResponse(access);
    const franchise = access.user;
    await ensureSchema();
    await ensureProjectOpsSchema();
    await ensureAgentNotificationsSchema();

    const body = await req.json();
    const { id, agent_id, status, lead_stage, follow_up_date, notes } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead id is required' }, { status: 400 });
    }

    const permits = (...keys) => keys.some((key) => access.permissions[key]);
    const denied = (permission) => NextResponse.json(
      { success: false, error: `Permission denied: ${permission}` },
      { status: 403 }
    );
    if (Object.prototype.hasOwnProperty.call(body, 'agent_id')
      && !permits('agents.assign', 'agents.assign_leads')) return denied('agents.assign_leads');
    if (Object.prototype.hasOwnProperty.call(body, 'status')
      && !permits('leads.manage', 'leads.update_status')) return denied('leads.update_status');
    if (Object.prototype.hasOwnProperty.call(body, 'lead_stage')
      && !permits('leads.manage', 'leads.update_stage')) return denied('leads.update_stage');
    if (Object.prototype.hasOwnProperty.call(body, 'follow_up_date')
      && !permits('leads.manage', 'leads.update_follow_up')) return denied('leads.update_follow_up');
    if (Object.prototype.hasOwnProperty.call(body, 'notes')
      && !permits('leads.manage', 'leads.edit_notes')) return denied('leads.edit_notes');

    client = await pool.connect();
    await client.query('BEGIN');
    const currentResult = await client.query(
      `SELECT l.*, p.id AS project_id
         FROM agent_leads l
         LEFT JOIN projects p ON p.source_lead_id = l.id AND p.project_kind = 'operational'
        WHERE l.id = $1 AND l.assigned_franchise_id = $2
        FOR UPDATE OF l`,
      [id, franchise.id]
    );
    const current = currentResult.rows[0];
    if (!current) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
    const nextStage = has('lead_stage') ? lead_stage : current.lead_stage;
    const requestedStatus = has('status') ? status : current.status;
    const nextStatus = nextStage === 'Final' ? 'Converted' : requestedStatus;
    if (((has('lead_stage') && lead_stage === 'Final') || (has('status') && status === 'Converted'))
      && !permits('leads.manage', 'leads.convert')) {
      await client.query('ROLLBACK');
      return denied('leads.convert');
    }
    if (has('lead_stage') && !STAGES.has(lead_stage)) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Invalid lead stage.' }, { status: 400 });
    }
    if (has('status') && !STATUSES.has(status)) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Invalid lead status.' }, { status: 400 });
    }
    if (current.project_id && (
      nextStage !== 'Final'
      || (has('status') && status !== 'Converted')
    )) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Finalized leads must remain Final / Converted.' }, { status: 409 });
    }
    if (nextStatus === 'Converted' && nextStage !== 'Final') {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Only a Final-stage lead can be converted.' }, { status: 400 });
    }

    if (agent_id) {
      const approvedAgent = await client.query(
        `SELECT id
           FROM agents
          WHERE id = $1
            AND status = 'Approved'
            AND login_enabled = TRUE
            AND must_change_password = FALSE
            AND LOWER(TRIM(COALESCE(city, ''))) = LOWER(TRIM($2))`,
        [agent_id, access.franchise.city]
      );
      if (!approvedAgent.rows[0]) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Select an approved agent from the franchise city' }, { status: 400 });
      }
    }

    const result = await client.query(
      `UPDATE agent_leads
          SET agent_id = CASE WHEN $1::BOOLEAN THEN $2 ELSE agent_id END,
              status = CASE WHEN $3::BOOLEAN THEN $4 ELSE status END,
              lead_stage = CASE WHEN $5::BOOLEAN THEN $6 ELSE lead_stage END,
              follow_up_date = CASE WHEN $7::BOOLEAN THEN $8 ELSE follow_up_date END,
              notes = CASE WHEN $9::BOOLEAN THEN $10 ELSE notes END,
              assigned_by_role = 'franchise',
              updated_at = NOW()
        WHERE id = $11 AND assigned_franchise_id = $12
        RETURNING *`,
      [
        has('agent_id'), agent_id || null,
        has('status') || nextStage === 'Final', nextStatus,
        has('lead_stage'), lead_stage || null,
        has('follow_up_date'), follow_up_date || null,
        has('notes'), String(notes || '').trim() || null,
        id,
        franchise.id,
      ]
    );

    const project = await convertFinalLeadToProject(client, id);
    await client.query('COMMIT');
    return NextResponse.json({
      success: true,
      data: filterLead(result.rows[0], access.permissions),
      project: project ? { id: project.id } : undefined,
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('Franchise lead management PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  } finally {
    client?.release();
  }
}
