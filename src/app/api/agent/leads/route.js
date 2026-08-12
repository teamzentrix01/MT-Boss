import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAgent } from '@/lib/agent-auth';
import { convertFinalLeadToProject, ensureProjectOpsSchema } from '@/lib/project-ops';

const STATUSES = new Set(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost']);
const LEAD_STAGES = new Set(['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost']);

function passwordGate(agent) {
  if (!agent?.must_change_password) return null;
  return NextResponse.json(
    { success: false, error: 'Change your temporary password before accessing leads.', mustChangePassword: true },
    { status: 428 }
  );
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

    const result = await pool.query(
      `SELECT l.*, p.id AS project_id
         FROM agent_leads l
         LEFT JOIN projects p ON p.source_lead_id = l.id
        WHERE l.agent_id = $1
        ORDER BY
          CASE
            WHEN l.status = 'Lost' OR l.lead_stage = 'Lost' THEN 2
            WHEN l.status = 'New' OR l.lead_stage = 'New' THEN 0
            ELSE 1
          END ASC,
          l.created_at DESC`,
      [agent.id]
    );

    return NextResponse.json({ success: true, data: result.rows, city: agent.city });
  } catch (error) {
    console.error('Agent leads fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  let client;
  try {
    await ensureAgentSchema();
    await ensureProjectOpsSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

    const {
      clientName, clientPhone, clientEmail, serviceType, leadType,
      city,
      status, followUpDate, notes,
      lead_stage, meeting_done, estimate_sent, final_amount,
      daily_visit_notes, client_requirement, lead_source,
    } = await req.json();
    if (!clientName || !clientPhone) {
      return NextResponse.json({ success: false, error: 'Client name and phone are required' }, { status: 400 });
    }

    client = await pool.connect();
    await client.query('BEGIN');

    // Serialize rapid submissions for the same agent/customer. This prevents
    // double-clicks or network retries from creating duplicate lead rows.
    const normalizedPhone = String(clientPhone).replace(/\D/g, '');
    await client.query(
      `SELECT pg_advisory_xact_lock(hashtext($1))`,
      [`agent-lead:${agent.id}:${normalizedPhone}`]
    );
    const duplicate = await client.query(
      `SELECT l.*, p.id AS project_id
         FROM agent_leads l
         LEFT JOIN projects p ON p.source_lead_id = l.id
        WHERE l.agent_id = $1
          AND REGEXP_REPLACE(l.client_phone, '[^0-9]', '', 'g') = $2
          AND LOWER(TRIM(l.client_name)) = LOWER(TRIM($3))
          AND l.created_at > NOW() - INTERVAL '5 minutes'
        ORDER BY l.created_at DESC
        LIMIT 1`,
      [agent.id, normalizedPhone, clientName]
    );
    if (duplicate.rows.length > 0) {
      await client.query('COMMIT');
      return NextResponse.json({
        success: true,
        data: duplicate.rows[0],
        duplicate: true,
        message: 'This lead was already saved.',
      });
    }

    const parsedFinalAmount = Number(final_amount || 0);
    if (!Number.isFinite(parsedFinalAmount) || parsedFinalAmount < 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Final amount must be a valid non-negative number.' }, { status: 400 });
    }
    const requestedStage = LEAD_STAGES.has(lead_stage) ? lead_stage : 'New';
    const requestedStatus = requestedStage === 'Final'
      ? 'Converted'
      : STATUSES.has(status) ? status : 'New';
    if (requestedStatus === 'Converted' && requestedStage !== 'Final') {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'A lead can be converted only after its stage is Final.' }, { status: 400 });
    }

    const result = await client.query(
      `INSERT INTO agent_leads
        (agent_id, city, client_name, client_phone, client_email, service_type, lead_type,
         status, follow_up_date, notes,
         lead_stage, meeting_done, estimate_sent, final_amount,
         daily_visit_notes, client_requirement, lead_source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [
        agent.id,
        String(city || agent.city).trim() || agent.city,
        clientName,
        clientPhone,
        clientEmail || null,
        serviceType || null,
        leadType || null,
        requestedStatus,
        followUpDate || null,
        notes || null,
        requestedStage,
        meeting_done === true || meeting_done === 'true' ? true : false,
        estimate_sent === true || estimate_sent === 'true' ? true : false,
        parsedFinalAmount,
        daily_visit_notes || null,
        client_requirement || null,
        lead_source || 'offline',
      ]
    );

    const project = await convertFinalLeadToProject(client, result.rows[0].id);
    await client.query('COMMIT');
    return NextResponse.json({
      success: true,
      data: { ...result.rows[0], ...(project ? { status: 'Converted', project_id: project.id } : {}) },
      project: project || undefined,
    }, { status: 201 });
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('Agent lead create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  } finally {
    client?.release();
  }
}

export async function PATCH(req) {
  let client;
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
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead id is required' }, { status: 400 });
    }

    client = await pool.connect();
    await client.query('BEGIN');

    const currentResult = await client.query(
      `SELECT l.*, p.id AS project_id
         FROM agent_leads l
         LEFT JOIN projects p ON p.source_lead_id = l.id AND p.project_kind = 'operational'
        WHERE l.id = $1 AND l.agent_id = $2
        FOR UPDATE OF l`,
      [id, agent.id]
    );
    const current = currentResult.rows[0];
    if (!current) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
    const requestedStage = has('lead_stage') ? body.lead_stage : current.lead_stage;
    const requestedStatus = has('status') ? body.status : current.status;
    const effectiveStatus = requestedStage === 'Final' ? 'Converted' : requestedStatus;
    if (has('lead_stage') && !LEAD_STAGES.has(body.lead_stage)) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Invalid lead stage.' }, { status: 400 });
    }
    if (has('status') && !STATUSES.has(body.status)) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Invalid lead status.' }, { status: 400 });
    }
    if (current.project_id && (
      requestedStage !== 'Final'
      || (has('status') && body.status !== 'Converted')
    )) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, error: 'A finalized lead is locked to Final / Converted because its project already exists.' },
        { status: 409 }
      );
    }
    if (!current.project_id && effectiveStatus === 'Converted' && requestedStage !== 'Final') {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { success: false, error: 'A lead can be converted only after its stage is Final.' },
        { status: 400 }
      );
    }

    const sets = [];
    const values = [];
    const add = (column, value) => {
      values.push(value);
      sets.push(`${column} = $${values.length}`);
    };

    if (has('clientName')) {
      if (!String(body.clientName || '').trim()) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Client name is required.' }, { status: 400 });
      }
      add('client_name', String(body.clientName).trim());
    }
    if (has('clientPhone')) {
      if (!String(body.clientPhone || '').trim()) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Client phone is required.' }, { status: 400 });
      }
      add('client_phone', String(body.clientPhone).trim());
    }

    const nullableTextFields = {
      clientEmail: 'client_email',
      serviceType: 'service_type',
      leadType: 'lead_type',
      notes: 'notes',
      daily_visit_notes: 'daily_visit_notes',
      client_requirement: 'client_requirement',
      lead_source: 'lead_source',
    };
    for (const [key, column] of Object.entries(nullableTextFields)) {
      if (has(key)) add(column, String(body[key] || '').trim() || null);
    }
    if (has('followUpDate')) add('follow_up_date', body.followUpDate || null);
    if (has('meeting_done')) add('meeting_done', body.meeting_done === true || body.meeting_done === 'true');
    if (has('estimate_sent')) add('estimate_sent', body.estimate_sent === true || body.estimate_sent === 'true');
    if (has('final_amount')) {
      const amount = body.final_amount === '' || body.final_amount === null ? 0 : Number(body.final_amount);
      if (!Number.isFinite(amount) || amount < 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Final amount must be a valid non-negative number.' }, { status: 400 });
      }
      add('final_amount', amount);
    }
    if (has('lead_stage')) add('lead_stage', body.lead_stage);
    if (has('status') || requestedStage === 'Final') add('status', effectiveStatus);
    if (requestedStage === 'Final') {
      if (!has('lead_stage')) add('lead_stage', 'Final');
    }
    add('city', agent.city);
    sets.push('updated_at = NOW()');
    values.push(id, agent.id);

    const result = await client.query(
      `UPDATE agent_leads
          SET ${sets.join(', ')}
        WHERE id = $${values.length - 1} AND agent_id = $${values.length}
        RETURNING *`,
      values
    );

    const project = await convertFinalLeadToProject(client, result.rows[0].id);
    await client.query('COMMIT');
    return NextResponse.json({
      success: true,
      data: { ...result.rows[0], ...(project ? { status: 'Converted', project_id: project.id } : {}) },
      project: project || undefined,
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('Agent lead update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  } finally {
    client?.release();
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

    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Valid lead id is required' }, { status: 400 });
    }

    const project = await pool.query(
      `SELECT id FROM projects WHERE source_lead_id = $1 LIMIT 1`,
      [id]
    );
    if (project.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Finalized lead cannot be deleted because its project already exists.' },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `DELETE FROM agent_leads
        WHERE id = $1 AND agent_id = $2
        RETURNING id`,
      [id, agent.id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted_id: result.rows[0].id });
  } catch (error) {
    console.error('Agent lead delete error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
