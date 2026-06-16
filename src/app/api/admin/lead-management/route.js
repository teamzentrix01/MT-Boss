import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ensureAgentSchema } from '@/lib/agent-auth';

const STATUSES = new Set(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost']);
const STAGES = new Set(['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost']);

async function ensureLeadManagementSchema() {
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
}

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

async function getLeadRows({ search = '', status = '', source = '' } = {}) {
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
    });

    if (exportType === 'csv') {
      const headers = [
        'ID', 'Client Name', 'Phone', 'Email', 'City', 'Service Type', 'Lead Type',
        'Source', 'Status', 'Stage', 'Agent', 'Franchise', 'Follow Up', 'Final Amount',
        'Requirement', 'Notes', 'Created At',
      ];
      const csv = [
        headers.map(csvCell).join(','),
        ...rows.map((row) => [
          row.id, row.client_name, row.client_phone, row.client_email, row.city,
          row.service_type, row.lead_type, row.lead_source, row.status, row.lead_stage,
          row.agent_name || '', row.franchise_name || '', row.follow_up_date || '',
          row.final_amount || 0, row.client_requirement || '', row.notes || '', row.created_at,
        ].map(csvCell).join(',')),
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

    const body = await req.json();
    const {
      client_name, client_phone, client_email, city, service_type, lead_type,
      agent_id, assigned_franchise_id, notes, client_requirement, lead_source,
      priority, follow_up_date,
    } = body;

    if (!client_name || !client_phone || !city) {
      return NextResponse.json({ success: false, error: 'Client name, phone and city are required' }, { status: 400 });
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
  try {
    if (!requireRole(req, 'admin')) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }
    await ensureLeadManagementSchema();

    const body = await req.json();
    const {
      id, agent_id, assigned_franchise_id, status, lead_stage, follow_up_date,
      notes, client_requirement, priority, final_amount, meeting_done, estimate_sent,
    } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead id is required' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE agent_leads
          SET agent_id = CASE WHEN $1::TEXT = '__clear__' THEN NULL ELSE COALESCE($1::INTEGER, agent_id) END,
              assigned_franchise_id = CASE WHEN $2::TEXT = '__clear__' THEN NULL ELSE COALESCE($2::INTEGER, assigned_franchise_id) END,
              status = COALESCE($3, status),
              lead_stage = COALESCE($4, lead_stage),
              follow_up_date = COALESCE($5, follow_up_date),
              notes = COALESCE($6, notes),
              client_requirement = COALESCE($7, client_requirement),
              priority = COALESCE($8, priority),
              final_amount = COALESCE($9, final_amount),
              meeting_done = COALESCE($10, meeting_done),
              estimate_sent = COALESCE($11, estimate_sent),
              updated_at = NOW()
        WHERE id = $12
        RETURNING *`,
      [
        agent_id === '' ? '__clear__' : agent_id || null,
        assigned_franchise_id === '' ? '__clear__' : assigned_franchise_id || null,
        STATUSES.has(status) ? status : null,
        STAGES.has(lead_stage) ? lead_stage : null,
        follow_up_date || null,
        notes || null,
        client_requirement || null,
        priority || null,
        final_amount !== undefined && final_amount !== '' ? Number(final_amount) : null,
        meeting_done === true || meeting_done === false ? meeting_done : null,
        estimate_sent === true || estimate_sent === false ? estimate_sent : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Lead management PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
