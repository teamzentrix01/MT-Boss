import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAgent } from '@/lib/agent-auth';
import { convertFinalLeadToProject, ensureProjectOpsSchema } from '@/lib/project-ops';

const STATUSES = new Set(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost']);
const LEAD_STAGES = new Set(['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost']);

export async function GET(req) {
  try {
    await ensureAgentSchema();
    await ensureProjectOpsSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT l.*, p.id AS project_id
         FROM agent_leads l
         LEFT JOIN projects p ON p.source_lead_id = l.id
        WHERE l.agent_id = $1
        ORDER BY COALESCE(l.follow_up_date, l.created_at::date) ASC, l.created_at DESC`,
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

    const {
      clientName, clientPhone, clientEmail, serviceType, leadType,
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
        agent.city,
        clientName,
        clientPhone,
        clientEmail || null,
        serviceType || null,
        leadType || null,
        STATUSES.has(status) ? status : 'New',
        followUpDate || null,
        notes || null,
        LEAD_STAGES.has(lead_stage) ? lead_stage : 'New',
        meeting_done === true || meeting_done === 'true' ? true : false,
        estimate_sent === true || estimate_sent === 'true' ? true : false,
        Number(final_amount || 0),
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

    const {
      id, clientName, clientPhone, clientEmail, serviceType, leadType,
      status, followUpDate, notes,
      lead_stage, meeting_done, estimate_sent, final_amount,
      daily_visit_notes, client_requirement, lead_source,
    } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead id is required' }, { status: 400 });
    }

    client = await pool.connect();
    await client.query('BEGIN');
    const result = await client.query(
      `UPDATE agent_leads
          SET client_name = COALESCE($1, client_name),
              client_phone = COALESCE($2, client_phone),
              client_email = COALESCE($3, client_email),
              service_type = COALESCE($4, service_type),
              lead_type = COALESCE($5, lead_type),
              status = COALESCE($6, status),
              follow_up_date = COALESCE($7, follow_up_date),
              notes = COALESCE($8, notes),
              city = $9,
              lead_stage = COALESCE($12, lead_stage),
              meeting_done = COALESCE($13, meeting_done),
              estimate_sent = COALESCE($14, estimate_sent),
              final_amount = COALESCE($15, final_amount),
              daily_visit_notes = COALESCE($16, daily_visit_notes),
              client_requirement = COALESCE($17, client_requirement),
              lead_source = COALESCE($18, lead_source),
              updated_at = NOW()
        WHERE id = $10 AND agent_id = $11
        RETURNING *`,
      [
        clientName || null,
        clientPhone || null,
        clientEmail || null,
        serviceType || null,
        leadType || null,
        STATUSES.has(status) ? status : null,
        followUpDate || null,
        notes || null,
        agent.city,
        id,
        agent.id,
        LEAD_STAGES.has(lead_stage) ? lead_stage : null,
        meeting_done === true || meeting_done === 'true' ? true : meeting_done === false || meeting_done === 'false' ? false : null,
        estimate_sent === true || estimate_sent === 'true' ? true : estimate_sent === false || estimate_sent === 'false' ? false : null,
        final_amount !== undefined && final_amount !== '' ? Number(final_amount) : null,
        daily_visit_notes || null,
        client_requirement || null,
        lead_source || null,
      ]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

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
