import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ensureAgentSchema } from '@/lib/agent-auth';
import { createXlsxWorkbook } from '@/lib/xlsx';
import { createInitializationGuard } from '@/lib/api-utils';
import { convertFinalLeadToProject, ensureProjectOpsSchema } from '@/lib/project-ops';
import { ensureAgentNotificationsSchema } from '@/lib/agent-notifications';

const STATUSES = new Set(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost']);
const STAGES = new Set(['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost']);

const ensureLeadManagementSchema = createInitializationGuard(async () => {
  await ensureAgentSchema();
  try { await pool.query(`ALTER TABLE agent_leads ALTER COLUMN agent_id DROP NOT NULL`); } catch { /* older db may already allow null */ }
  const alters = [
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS assigned_franchise_id INTEGER`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS assigned_by_role VARCHAR(40) DEFAULT 'admin'`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS source_ref_table VARCHAR(80)`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS source_ref_id INTEGER`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS priority VARCHAR(30) DEFAULT 'Normal'`,
  ];
  for (const sql of alters) await pool.query(sql);
});

async function syncExternalLeads() {
  const syncs = [
    `INSERT INTO agent_leads
       (city, client_name, client_phone, client_email, service_type, lead_type, status,
        notes, client_requirement, lead_source, source_ref_table, source_ref_id, assigned_by_role)
     SELECT
       COALESCE(NULLIF(address, ''), 'Unassigned') AS city,
       name,
       phone,
       email,
       service_title,
       'Primary Service',
       'New',
       message,
       CONCAT_WS(' | ', NULLIF(budget, ''), CASE WHEN carpet_area IS NOT NULL THEN CONCAT(carpet_area, ' sqft') END),
       'primary-service',
       'primary_service_enquiries',
       id,
       'system'
     FROM primary_service_enquiries p
     WHERE NOT EXISTS (
       SELECT 1 FROM agent_leads l
       WHERE l.source_ref_table = 'primary_service_enquiries' AND l.source_ref_id = p.id
     )`,
    `INSERT INTO agent_leads
       (city, client_name, client_phone, client_email, service_type, lead_type, status,
        notes, client_requirement, lead_source, source_ref_table, source_ref_id, assigned_by_role)
     SELECT
       COALESCE(NULLIF(service_city, ''), NULLIF(city, ''), 'Unassigned'),
       COALESCE(NULLIF(user_name, ''), 'Customer'),
       COALESCE(NULLIF(user_phone, ''), '-'),
       user_email,
       COALESCE(NULLIF(service_name, ''), NULLIF(service_title, ''), 'Quick Service'),
       'Quick Service',
       'New',
       service_address,
       COALESCE(NULLIF(description, ''), NULLIF(notes, '')),
       'quick-service',
       'service_bookings',
       id,
       'system'
     FROM service_bookings s
     WHERE NOT EXISTS (
       SELECT 1 FROM agent_leads l
       WHERE l.source_ref_table = 'service_bookings' AND l.source_ref_id = s.id
     )`,
    `INSERT INTO agent_leads
       (city, client_name, client_phone, client_email, service_type, lead_type, status,
        notes, client_requirement, lead_source, source_ref_table, source_ref_id, assigned_by_role)
     SELECT
       COALESCE(estimate->'project'->>'city', 'Unassigned'),
       name,
       phone,
       email,
       'Budget Calculator',
       'Calculator Quote',
       CASE WHEN verified THEN 'Contacted' ELSE 'New' END,
       address,
       CONCAT('Estimated budget: Rs ', COALESCE(estimate->'totals'->>'grandTotal', '0')),
       'calculator',
       'calculator_quote_otps',
       id,
       'system'
     FROM calculator_quote_otps c
     WHERE NOT EXISTS (
       SELECT 1 FROM agent_leads l
       WHERE l.source_ref_table = 'calculator_quote_otps' AND l.source_ref_id = c.id
     )`,
    `INSERT INTO agent_leads
       (city, client_name, client_phone, client_email, service_type, lead_type, status,
        notes, client_requirement, lead_source, source_ref_table, source_ref_id, assigned_by_role)
     SELECT
       'Unassigned',
       name,
       phone,
       email,
       department,
       'Contact Form',
       COALESCE(status, 'New'),
       message,
       subject,
       'contact',
       'contact_submissions',
       id,
       'system'
     FROM contact_submissions c
     WHERE NOT EXISTS (
       SELECT 1 FROM agent_leads l
       WHERE l.source_ref_table = 'contact_submissions' AND l.source_ref_id = c.id
     )`,
  ];

  for (const sql of syncs) {
    try { await pool.query(sql); } catch (error) { console.warn('Lead sync skipped:', error.message); }
  }
}

function csvCell(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

async function getLeadRows({ search = '', status = '', source = '', city = '' } = {}) {
  const params = [];
  const filters = [];

  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    filters.push(`(
      LOWER(l.client_name) LIKE $${params.length}
      OR LOWER(l.client_phone) LIKE $${params.length}
      OR LOWER(COALESCE(l.client_email,'')) LIKE $${params.length}
      OR LOWER(COALESCE(l.city,'')) LIKE $${params.length}
      OR LOWER(COALESCE(l.service_type,'')) LIKE $${params.length}
    )`);
  }
  if (status) {
    params.push(status);
    filters.push(`l.status = $${params.length}`);
  }
  if (source) {
    params.push(source);
    filters.push(`l.lead_source = $${params.length}`);
  }
  if (city) {
    params.push(city);
    filters.push(`LOWER(TRIM(COALESCE(l.city, ''))) = LOWER(TRIM($${params.length}::TEXT))`);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT
       l.*,
       a.name AS agent_name,
       a.email AS agent_email,
       a.phone AS agent_phone,
       f.name AS franchise_name,
       f.email AS franchise_email,
       f.phone AS franchise_phone
     FROM agent_leads l
     LEFT JOIN agents a ON a.id = l.agent_id
     LEFT JOIN franchises f ON f.id = l.assigned_franchise_id
     ${where}
     ORDER BY l.created_at DESC`,
    params
  );
  return result.rows;
}

export async function GET(req) {
  try {
    if (!requireRole(req, 'admin')) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }
    await ensureLeadManagementSchema();
    await syncExternalLeads();

    const { searchParams } = new URL(req.url);
    const exportType = searchParams.get('export');
    const rows = await getLeadRows({
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || '',
      source: searchParams.get('source') || '',
      city: searchParams.get('city') || '',
    });

    if (exportType === 'csv' || exportType === 'xlsx' || exportType === 'excel') {
      const headers = [
        'ID', 'Client Name', 'Phone', 'Email', 'City', 'Service Type', 'Lead Type',
        'Source', 'Status', 'Stage', 'Agent', 'Franchise', 'Follow Up', 'Final Amount',
        'Requirement', 'Notes', 'Created At',
      ];
      const values = rows.map((row) => [
        row.id, row.client_name, row.client_phone, row.client_email, row.city,
        row.service_type, row.lead_type, row.lead_source, row.status, row.lead_stage,
        row.agent_name || '', row.franchise_name || '', row.follow_up_date || '',
        row.final_amount || 0, row.client_requirement || '', row.notes || '', row.created_at,
      ]);

      if (exportType === 'xlsx' || exportType === 'excel') {
        const xlsx = createXlsxWorkbook([headers, ...values], 'Leads');
        return new Response(xlsx, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="mtboss-leads.xlsx"',
            'Cache-Control': 'no-store',
          },
        });
      }

      const csv = [
        headers.map(csvCell).join(','),
        ...values.map((row) => row.map(csvCell).join(',')),
      ].join('\n');

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="mtboss-leads.csv"',
        },
      });
    }

    const [agents, franchises] = await Promise.all([
      pool.query(`SELECT id, name, email, phone, city, state FROM agents WHERE status = 'Approved' ORDER BY name ASC`),
      pool.query(`SELECT id, name, email, phone, city, state FROM franchises WHERE status = 'Approved' ORDER BY name ASC`),
    ]);

    return NextResponse.json({
      success: true,
      data: rows,
      agents: agents.rows,
      franchises: franchises.rows,
    });
  } catch (error) {
    console.error('Lead management GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }
    await ensureLeadManagementSchema();
    await ensureAgentNotificationsSchema();

    const body = await req.json();
    const {
      client_name, client_phone, client_email, city, service_type, lead_type,
      agent_id, assigned_franchise_id, notes, client_requirement, lead_source,
      priority, follow_up_date,
    } = body;

    if (!client_name || !client_phone || !city) {
      return NextResponse.json({ success: false, error: 'Client name, phone and city are required' }, { status: 400 });
    }
    if (agent_id) {
      const approvedAgent = await pool.query(
        `SELECT id FROM agents
          WHERE id = $1
            AND status = 'Approved'
            AND login_enabled = TRUE
            AND must_change_password = FALSE
            AND LOWER(TRIM(COALESCE(city, ''))) = LOWER(TRIM($2))`,
        [agent_id, city]
      );
      if (!approvedAgent.rows[0]) {
        return NextResponse.json({ success: false, error: 'Select an active approved agent from the lead city.' }, { status: 400 });
      }
    }

    const result = await pool.query(
      `INSERT INTO agent_leads
        (agent_id, assigned_franchise_id, city, client_name, client_phone, client_email,
         service_type, lead_type, status, follow_up_date, notes, client_requirement,
         lead_source, priority, assigned_by_role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'New',$9,$10,$11,$12,$13,'admin')
       RETURNING *`,
      [
        agent_id || null,
        assigned_franchise_id || null,
        city,
        client_name,
        client_phone,
        client_email || null,
        service_type || null,
        lead_type || null,
        follow_up_date || null,
        notes || null,
        client_requirement || null,
        lead_source || 'manual',
        priority || 'Normal',
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Lead management POST error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  let client;
  try {
    if (!requireRole(req, 'admin')) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }
    await ensureLeadManagementSchema();
    await ensureProjectOpsSchema();
    await ensureAgentNotificationsSchema();

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
        WHERE l.id = $1
        FOR UPDATE OF l`,
      [id]
    );
    const current = currentResult.rows[0];
    if (!current) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
    const nextStage = has('lead_stage') ? body.lead_stage : current.lead_stage;
    const requestedStatus = has('status') ? body.status : current.status;
    const nextStatus = nextStage === 'Final' ? 'Converted' : requestedStatus;
    if (has('lead_stage') && !STAGES.has(body.lead_stage)) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Invalid lead stage.' }, { status: 400 });
    }
    if (has('status') && !STATUSES.has(body.status)) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Invalid lead status.' }, { status: 400 });
    }
    if (current.project_id && (
      nextStage !== 'Final'
      || (has('status') && body.status !== 'Converted')
    )) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Finalized leads must remain Final / Converted.' }, { status: 409 });
    }
    if (nextStatus === 'Converted' && nextStage !== 'Final') {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Only a Final-stage lead can be converted.' }, { status: 400 });
    }

    if (has('agent_id') && body.agent_id) {
      const approvedAgent = await client.query(
        `SELECT id FROM agents
          WHERE id = $1
            AND status = 'Approved'
            AND login_enabled = TRUE
            AND must_change_password = FALSE
            AND LOWER(TRIM(COALESCE(city, ''))) = LOWER(TRIM($2))`,
        [body.agent_id, current.city]
      );
      if (!approvedAgent.rows[0]) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Select an active approved agent from the lead city.' }, { status: 400 });
      }
    }

    const sets = [];
    const values = [];
    const add = (column, value) => {
      values.push(value);
      sets.push(`${column} = $${values.length}`);
    };
    if (has('agent_id')) add('agent_id', body.agent_id || null);
    if (has('assigned_franchise_id')) add('assigned_franchise_id', body.assigned_franchise_id || null);
    if (has('lead_stage')) add('lead_stage', body.lead_stage);
    if (has('status') || nextStage === 'Final') add('status', nextStatus);
    if (has('follow_up_date')) add('follow_up_date', body.follow_up_date || null);
    if (has('notes')) add('notes', String(body.notes || '').trim() || null);
    if (has('client_requirement')) add('client_requirement', String(body.client_requirement || '').trim() || null);
    if (has('priority')) add('priority', String(body.priority || '').trim() || null);
    if (has('final_amount')) {
      const amount = body.final_amount === '' || body.final_amount === null ? 0 : Number(body.final_amount);
      if (!Number.isFinite(amount) || amount < 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Final amount must be a valid non-negative number.' }, { status: 400 });
      }
      add('final_amount', amount);
    }
    if (has('meeting_done')) add('meeting_done', body.meeting_done === true);
    if (has('estimate_sent')) add('estimate_sent', body.estimate_sent === true);
    sets.push('updated_at = NOW()');
    values.push(id);

    const result = await client.query(
      `UPDATE agent_leads SET ${sets.join(', ')}
        WHERE id = $${values.length}
        RETURNING *`,
      values
    );
    const project = await convertFinalLeadToProject(client, id);
    await client.query('COMMIT');
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      project: project || undefined,
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('Lead management PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  } finally {
    client?.release();
  }
}
