import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ensureAgentSchema } from '@/lib/agent-auth';
import { createXlsxWorkbook } from '@/lib/xlsx';
import { createInitializationGuard } from '@/lib/api-utils';
import { convertFinalLeadToProject, ensureProjectOpsSchema } from '@/lib/project-ops';
import { ensureAgentNotificationsSchema } from '@/lib/agent-notifications';
import { ensurePackageSchema } from '@/lib/packages';

const STATUSES = new Set(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost']);
const STAGES = new Set(['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost']);

const SYNC_TTL_MS = 5 * 60 * 1000;
const ASSIGNEE_TTL_MS = 60 * 1000;
let lastLeadSyncAt = 0;
let assigneeCache = { expiresAt: 0, agents: null, franchises: null, vendors: null };

const ensureLeadManagementSchema = createInitializationGuard(async () => {
  await ensureAgentSchema();
  await ensurePackageSchema();
  try { await pool.query(`ALTER TABLE agent_leads ALTER COLUMN agent_id DROP NOT NULL`); } catch { /* older db may already allow null */ }
  const alters = [
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS assigned_franchise_id INTEGER`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS assigned_vendor_id INTEGER`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS assigned_by_role VARCHAR(40) DEFAULT 'admin'`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS source_ref_table VARCHAR(80)`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS source_ref_id INTEGER`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS priority VARCHAR(30) DEFAULT 'Normal'`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS assigned_agent_ids JSONB DEFAULT '[]'::jsonb`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS specializations JSONB NOT NULL DEFAULT '[]'::jsonb`,
    `CREATE INDEX IF NOT EXISTS idx_agent_leads_source_ref ON agent_leads (source_ref_table, source_ref_id)`,
    `CREATE INDEX IF NOT EXISTS idx_agent_leads_created_at ON agent_leads (created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_agent_leads_status ON agent_leads (status)`,
    `CREATE INDEX IF NOT EXISTS idx_agent_leads_agent_id ON agent_leads (agent_id)`,
  ];
  for (const sql of alters) await pool.query(sql);
});

async function syncExternalLeads({ force = false } = {}) {
  if (!force && lastLeadSyncAt && Date.now() - lastLeadSyncAt < SYNC_TTL_MS) return;
  const syncs = [
    `INSERT INTO agent_leads
       (city, client_name, client_phone, client_email, service_type, lead_type, status,
        notes, client_requirement, lead_source, source_ref_table, source_ref_id, assigned_by_role)
     SELECT
       COALESCE(NULLIF(city, ''), 'Unassigned') AS city,
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
       COALESCE(NULLIF(city, ''), 'Unassigned'),
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
  lastLeadSyncAt = Date.now();
}

async function getAssignableDirectories() {
  if (assigneeCache.agents && assigneeCache.expiresAt > Date.now()) {
    return {
      agents: assigneeCache.agents,
      franchises: assigneeCache.franchises,
      vendors: assigneeCache.vendors,
    };
  }
  const [agents, franchises, vendors] = await Promise.all([
    pool.query(`SELECT id, name, email, phone, city, state, specializations FROM agents WHERE status = 'Approved' ORDER BY name ASC`),
    pool.query(`SELECT id, name, email, phone, city, state FROM franchises WHERE status = 'Approved' ORDER BY name ASC`),
    pool.query(`SELECT id, shop_name, email, phone, city, state
                  FROM vendors
                 WHERE is_approved = TRUE
                   AND status = 'active'
                   AND package_status = 'active'
                   AND (package_expires_at IS NULL OR package_expires_at > NOW())
                 ORDER BY shop_name ASC`),
  ]);
  assigneeCache = {
    expiresAt: Date.now() + ASSIGNEE_TTL_MS,
    agents: agents.rows,
    franchises: franchises.rows,
    vendors: vendors.rows,
  };
  return assigneeCache;
}

function csvCell(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

async function getLeadRows({
  search = '',
  status = '',
  source = '',
  city = '',
  page = 1,
  limit = 100,
  unbounded = false,
} = {}) {
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
  const orderSql = `
     ORDER BY
       CASE
         WHEN l.status = 'Lost' OR l.lead_stage = 'Lost' THEN 2
         WHEN l.status = 'New' OR l.lead_stage = 'New' THEN 0
         ELSE 1
       END ASC,
       l.created_at DESC`;

  if (unbounded) {
    const result = await pool.query(
      `SELECT
         l.*,
         a.name AS agent_name,
         a.email AS agent_email,
         a.phone AS agent_phone,
         f.name AS franchise_name,
         f.email AS franchise_email,
         f.phone AS franchise_phone,
         v.shop_name AS vendor_name,
         v.phone AS vendor_phone
       FROM agent_leads l
       LEFT JOIN agents a ON a.id = l.agent_id
       LEFT JOIN franchises f ON f.id = l.assigned_franchise_id
       LEFT JOIN vendors v ON v.id = l.assigned_vendor_id
       ${where}
       ${orderSql}`,
      params
    );
    return { rows: result.rows, total: result.rows.length };
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(200, Math.max(1, parseInt(limit, 10) || 100));
  const offset = (safePage - 1) * safeLimit;
  const countRes = await pool.query(`SELECT COUNT(*)::INT AS total FROM agent_leads l ${where}`, params);
  const total = countRes.rows[0]?.total || 0;
  params.push(safeLimit, offset);
  const result = await pool.query(
    `SELECT
       l.*,
       CASE WHEN l.status = 'Converted' THEN COALESCE(l.converted_project_id, pm.id, op.id) ELSE NULL END AS converted_project_id,
       a.name AS agent_name,
       a.email AS agent_email,
       a.phone AS agent_phone,
       f.name AS franchise_name,
       f.email AS franchise_email,
       f.phone AS franchise_phone,
       v.shop_name AS vendor_name,
       v.phone AS vendor_phone
     FROM agent_leads l
     LEFT JOIN agents a ON a.id = l.agent_id
     LEFT JOIN franchises f ON f.id = l.assigned_franchise_id
     LEFT JOIN vendors v ON v.id = l.assigned_vendor_id
     LEFT JOIN pm_projects pm ON (pm.id = l.converted_project_id OR pm.source_lead_id = l.id)
     LEFT JOIN projects op ON (op.source_lead_id = l.id AND op.project_kind = 'operational')
     ${where}
     ${orderSql}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return { rows: result.rows, total, page: safePage, limit: safeLimit };
}

export async function GET(req) {
  try {
    if (!requireRole(req, 'admin')) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }
    await ensureLeadManagementSchema();

    const { searchParams } = new URL(req.url);
    const singleLeadId = searchParams.get('leadId');
    if (singleLeadId) {
      const leadRes = await pool.query(
        `SELECT
           l.*,
           a.name AS agent_name,
           a.email AS agent_email,
           a.phone AS agent_phone,
           f.name AS franchise_name,
           f.email AS franchise_email,
           f.phone AS franchise_phone,
           v.shop_name AS vendor_name,
           v.phone AS vendor_phone,
           CASE WHEN l.status = 'Converted' THEN COALESCE(p.name, op.title) ELSE NULL END AS project_name,
           CASE WHEN l.status = 'Converted' THEN COALESCE(p.site_address, op.location) ELSE NULL END AS project_site_address,
           CASE WHEN l.status = 'Converted' THEN COALESCE(p.status, op.status, op.project_status) ELSE NULL END AS project_status,
           CASE WHEN l.status = 'Converted' THEN COALESCE(p.contract_value, op.deal_amount::numeric, 0) ELSE 0 END AS project_contract_value,
           CASE WHEN l.status = 'Converted' THEN COALESCE(l.converted_project_id, p.id, op.id) ELSE NULL END AS converted_project_id,
           CASE WHEN l.status = 'Converted' THEN COALESCE(p.id, op.id) ELSE NULL END AS project_id
         FROM agent_leads l
         LEFT JOIN agents a ON a.id = l.agent_id
         LEFT JOIN franchises f ON f.id = l.assigned_franchise_id
         LEFT JOIN vendors v ON v.id = l.assigned_vendor_id
         LEFT JOIN pm_projects p ON (p.id = l.converted_project_id OR p.source_lead_id = l.id)
         LEFT JOIN projects op ON (op.source_lead_id = l.id AND op.project_kind = 'operational')
         WHERE l.id = $1`,
        [singleLeadId]
      );
      const lead = leadRes.rows[0];
      if (!lead) {
        return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
      }

      let history = [];
      try {
        const historyRes = await pool.query(
          `SELECT id, entity_type, action, changed_by, before_data, after_data, created_at
           FROM pm_audit_logs
           WHERE (entity_type = 'lead' OR entity_type = 'agent_leads') AND entity_id = $1
           UNION ALL
           SELECT id, table_name AS entity_type, action, changed_by, old_data AS before_data, new_data AS after_data, created_at
           FROM pm_audit_log
           WHERE (table_name = 'lead' OR table_name = 'agent_leads') AND record_id = $1
           ORDER BY created_at DESC
           LIMIT 50`,
          [singleLeadId]
        );
        history = historyRes.rows;
      } catch (err) {
        console.warn('Could not load lead audit history:', err.message);
      }

      let assignedAgents = [];
      try {
        const agentIdsSet = new Set();
        if (lead.agent_id) agentIdsSet.add(Number(lead.agent_id));
        if (Array.isArray(lead.assigned_agent_ids)) {
          lead.assigned_agent_ids.forEach((aid) => agentIdsSet.add(Number(aid)));
        } else if (typeof lead.assigned_agent_ids === 'string') {
          try {
            const parsed = JSON.parse(lead.assigned_agent_ids);
            if (Array.isArray(parsed)) parsed.forEach((aid) => agentIdsSet.add(Number(aid)));
          } catch {}
        }
        const pId = lead.converted_project_id || lead.project_id;
        if (pId) {
          const projAgentsRes = await pool.query(
            `SELECT agent_id FROM pm_project_agents WHERE project_id = $1`,
            [pId]
          );
          projAgentsRes.rows.forEach((r) => agentIdsSet.add(Number(r.agent_id)));
        }
        if (agentIdsSet.size > 0) {
          const ids = Array.from(agentIdsSet).filter(Boolean);
          const agentsRes = await pool.query(
            `SELECT id, name, email, phone, city, specializations FROM agents WHERE id = ANY($1::bigint[])`,
            [ids]
          );
          assignedAgents = agentsRes.rows;
        }
      } catch (err) {
        console.warn('Could not load assigned agents:', err.message);
      }

      return NextResponse.json({
        success: true,
        data: {
          ...lead,
          assigned_agents: assignedAgents,
        },
        history,
      });
    }

    const exportType = searchParams.get('export');
    const assigneesOnly = searchParams.get('assigneesOnly') === '1' || searchParams.get('assignees_only') === '1';
    const lite = searchParams.get('lite') === '1';
    const forceSync = searchParams.get('sync') === '1';

    // Project screens only need the agent directory — skip sync + full lead dump.
    if (assigneesOnly) {
      const dirs = await getAssignableDirectories();
      return NextResponse.json({
        success: true,
        data: [],
        agents: dirs.agents,
        franchises: dirs.franchises,
        vendors: dirs.vendors,
      });
    }

    if (!lite) {
      await syncExternalLeads({ force: forceSync });
    }

    const filters = {
      search: searchParams.get('search') || searchParams.get('q') || '',
      status: searchParams.get('status') || '',
      source: searchParams.get('source') || '',
      city: searchParams.get('city') || '',
    };

    if (exportType === 'csv' || exportType === 'xlsx' || exportType === 'excel') {
      const { rows } = await getLeadRows({ ...filters, unbounded: true });
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
            'Content-Disposition': 'attachment; filename="MTBoss-leads.xlsx"',
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
          'Content-Disposition': 'attachment; filename="MTBoss-leads.csv"',
        },
      });
    }

    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '100';
    const { rows, total, page: p, limit: l } = await getLeadRows({ ...filters, page, limit });
    const dirs = lite
      ? { agents: [], franchises: [], vendors: [] }
      : await getAssignableDirectories();

    return NextResponse.json({
      success: true,
      data: rows,
      agents: dirs.agents,
      franchises: dirs.franchises,
      vendors: dirs.vendors,
      pagination: { page: p, limit: l, total, pages: Math.ceil(total / l) || 1 },
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
      agent_id, assigned_franchise_id, assigned_vendor_id, notes, client_requirement, lead_source,
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
    if (assigned_franchise_id) {
      const match = await pool.query(`SELECT id FROM franchises WHERE id = $1 AND status = 'Approved' AND LOWER(TRIM(COALESCE(city,''))) = LOWER(TRIM($2))`, [assigned_franchise_id, city]);
      if (!match.rows[0]) return NextResponse.json({ success: false, error: 'Select an approved franchise from the lead city.' }, { status: 400 });
    }
    if (assigned_vendor_id) {
      const match = await pool.query(`SELECT id FROM vendors WHERE id = $1 AND is_approved = TRUE AND status = 'active' AND package_status = 'active' AND (package_expires_at IS NULL OR package_expires_at > NOW()) AND LOWER(TRIM(COALESCE(city,''))) = LOWER(TRIM($2))`, [assigned_vendor_id, city]);
      if (!match.rows[0]) return NextResponse.json({ success: false, error: 'Select a paid active approved vendor from the lead city.' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO agent_leads
        (agent_id, assigned_franchise_id, assigned_vendor_id, city, client_name, client_phone, client_email,
         service_type, lead_type, status, follow_up_date, notes, client_requirement,
         lead_source, priority, assigned_by_role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'New',$10,$11,$12,$13,$14,'admin')
       RETURNING *`,
      [
        agent_id || null,
        assigned_franchise_id || null,
        assigned_vendor_id || null,
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
    let nextStage = has('lead_stage') ? body.lead_stage : current.lead_stage;
    const requestedStatus = has('status') ? body.status : current.status;
    let nextStatus = requestedStatus;

    if (requestedStatus === 'Converted' && !has('lead_stage')) {
      nextStage = 'Final';
    }
    if (nextStage === 'Final') {
      nextStatus = 'Converted';
    }

    if (has('lead_stage') && !STAGES.has(body.lead_stage)) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'Invalid lead stage.' }, { status: 400 });
    }
    if (has('agent_id') && body.agent_id) {
      const approvedAgent = await client.query(
        `SELECT id FROM agents
          WHERE id = $1
            AND status = 'Approved'
            AND login_enabled = TRUE
            AND must_change_password = FALSE`,
        [body.agent_id]
      );
      if (!approvedAgent.rows[0]) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Select an active approved agent.' }, { status: 400 });
      }
    }
    if (has('assigned_franchise_id') && body.assigned_franchise_id) {
      const match = await client.query(`SELECT id FROM franchises WHERE id = $1 AND status = 'Approved'`, [body.assigned_franchise_id]);
      if (!match.rows[0]) { await client.query('ROLLBACK'); return NextResponse.json({ success: false, error: 'Select an approved franchise.' }, { status: 400 }); }
    }
    if (has('assigned_vendor_id') && body.assigned_vendor_id) {
      const match = await client.query(`SELECT id FROM vendors WHERE id = $1 AND is_approved = TRUE AND status = 'active'`, [body.assigned_vendor_id]);
      if (!match.rows[0]) { await client.query('ROLLBACK'); return NextResponse.json({ success: false, error: 'Select an active approved vendor.' }, { status: 400 }); }
    }

    const sets = [];
    const values = [];
    const add = (column, value) => {
      values.push(value);
      sets.push(`${column} = $${values.length}`);
    };

    if (has('agent_id') && !has('assigned_agent_ids')) {
      const aId = body.agent_id ? Number(body.agent_id) : null;
      add('agent_id', aId);
      const existingIds = Array.isArray(current.assigned_agent_ids)
        ? current.assigned_agent_ids.map(Number).filter(Boolean)
        : (current.agent_id ? [Number(current.agent_id)] : []);
      let updatedIds = [...existingIds];
      if (aId) {
        if (!updatedIds.includes(aId)) {
          updatedIds = [aId, ...updatedIds];
        }
      } else {
        updatedIds = [];
      }
      add('assigned_agent_ids', JSON.stringify(updatedIds));
      const pId = current.converted_project_id || current.project_id;
      if (pId) {
        try {
          if (updatedIds.length > 0) {
            await client.query(
              `DELETE FROM pm_project_agents WHERE project_id = $1 AND agent_id != ALL($2::bigint[])`,
              [pId, updatedIds]
            );
            for (const aid of updatedIds) {
              await client.query(
                `INSERT INTO pm_project_agents (project_id, agent_id, assigned_by)
                 VALUES ($1, $2, 'admin')
                 ON CONFLICT (project_id, agent_id) DO NOTHING`,
                [pId, aid]
              );
            }
          } else {
            await client.query(`DELETE FROM pm_project_agents WHERE project_id = $1`, [pId]);
          }
        } catch (e) {
          console.warn('Sync pm_project_agents failed:', e.message);
        }
      }
    }
    if (has('assigned_franchise_id')) add('assigned_franchise_id', body.assigned_franchise_id || null);
    if (has('assigned_vendor_id')) add('assigned_vendor_id', body.assigned_vendor_id || null);
    if (has('lead_stage')) add('lead_stage', nextStage);
    if (has('status')) add('status', nextStatus);
    if (nextStatus !== 'Converted' && nextStage !== 'Final') {
      add('converted_project_id', null);
      try {
        await client.query(`UPDATE projects SET source_lead_id = NULL WHERE source_lead_id = $1`, [id]);
        await client.query(`UPDATE pm_projects SET source_lead_id = NULL WHERE source_lead_id = $1`, [id]);
      } catch (e) {
        console.warn('Sync unlink project source_lead_id failed:', e.message);
      }
    }
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

    if (has('assigned_agent_ids')) {
      const ids = Array.isArray(body.assigned_agent_ids)
        ? body.assigned_agent_ids.map(Number).filter(Boolean)
        : [];
      add('assigned_agent_ids', JSON.stringify(ids));
      add('agent_id', ids[0] || null);

      const pId = current.converted_project_id || current.project_id;
      if (pId) {
        try {
          if (ids.length > 0) {
            await client.query(
              `DELETE FROM pm_project_agents WHERE project_id = $1 AND agent_id != ALL($2::bigint[])`,
              [pId, ids]
            );
            for (const aid of ids) {
              await client.query(
                `INSERT INTO pm_project_agents (project_id, agent_id, assigned_by)
                 VALUES ($1, $2, 'admin')
                 ON CONFLICT (project_id, agent_id) DO NOTHING`,
                [pId, aid]
              );
            }
          } else {
            await client.query(`DELETE FROM pm_project_agents WHERE project_id = $1`, [pId]);
          }
        } catch (e) {
          console.warn('Sync pm_project_agents failed:', e.message);
        }
      }
    }

    if (has('agent_specializations')) {
      const { agent_id: specAgentId, specializations: specs } = body.agent_specializations || {};
      if (specAgentId && Array.isArray(specs)) {
        await client.query(
          `UPDATE agents SET specializations = $1::jsonb WHERE id = $2`,
          [JSON.stringify(specs), specAgentId]
        );
      }
    }

    sets.push('updated_at = NOW()');
    values.push(id);

    const result = await client.query(
      `UPDATE agent_leads SET ${sets.join(', ')}
        WHERE id = $${values.length}
        RETURNING *`,
      values
    );

    const project = nextStage === 'Final' || nextStatus === 'Converted'
      ? await convertFinalLeadToProject(client, id)
      : undefined;

    try {
      await client.query(
        `INSERT INTO pm_audit_logs (entity_type, entity_id, action, changed_by, before_data, after_data)
         VALUES ('lead', $1, 'update', 'admin', $2, $3)`,
        [id, JSON.stringify(current), JSON.stringify(result.rows[0])]
      );
    } catch (e) {
      // Audit log error shouldn't abort transaction
    }

    // Refresh assigned agents
    let refreshedAssignedAgents = [];
    try {
      const agentIdsSet = new Set();
      if (result.rows[0].agent_id) agentIdsSet.add(Number(result.rows[0].agent_id));
      const leadAgentIds = result.rows[0].assigned_agent_ids;
      if (Array.isArray(leadAgentIds)) {
        leadAgentIds.forEach((aid) => agentIdsSet.add(Number(aid)));
      } else if (typeof leadAgentIds === 'string') {
        try {
          const parsed = JSON.parse(leadAgentIds);
          if (Array.isArray(parsed)) parsed.forEach((aid) => agentIdsSet.add(Number(aid)));
        } catch {}
      }
      const pId = result.rows[0].converted_project_id || current.project_id;
      if (pId) {
        const projAgentsRes = await client.query(
          `SELECT agent_id FROM pm_project_agents WHERE project_id = $1`,
          [pId]
        );
        projAgentsRes.rows.forEach((r) => agentIdsSet.add(Number(r.agent_id)));
      }
      if (agentIdsSet.size > 0) {
        const ids = Array.from(agentIdsSet).filter(Boolean);
        const agentsRes = await client.query(
          `SELECT id, name, email, phone, city, specializations FROM agents WHERE id = ANY($1::bigint[])`,
          [ids]
        );
        refreshedAssignedAgents = agentsRes.rows;
      }
    } catch {}

    await client.query('COMMIT');
    return NextResponse.json({
      success: true,
      data: {
        ...result.rows[0],
        assigned_agents: refreshedAssignedAgents,
      },
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
