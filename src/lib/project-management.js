import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';
import { verifyBearer } from '@/lib/auth';

export async function requirePmAccess(req, projectId = null) {
  // Check if they have an admin or site_supervisor token
  const adminOrSupervisor = verifyBearer(req, 'admin') || verifyBearer(req, 'site_supervisor');
  if (adminOrSupervisor && (adminOrSupervisor.role === 'admin' || adminOrSupervisor.role === 'site_supervisor')) {
    return adminOrSupervisor;
  }
  
  // Check if they have an agent token
  const agent = verifyBearer(req, 'agent');
  if (agent && agent.role === 'agent') {
    const res = await pool.query(
      `SELECT id, name, email, phone, city, status, login_enabled,
              has_project_management_access, specializations
         FROM agents
        WHERE id = $1 AND login_enabled = TRUE AND status = 'Approved'`,
      [agent.id]
    );
    const dbAgent = res.rows[0];
    if (dbAgent?.has_project_management_access) {
      if (projectId) {
        const assignmentRes = await pool.query(
          'SELECT 1 FROM pm_project_agents WHERE project_id = $1 AND agent_id = $2',
          [projectId, agent.id]
        );
        if (assignmentRes.rows.length === 0) return null; // Not assigned to this project
      }
      const rawSpecs = dbAgent.specializations;
      const specializations = Array.isArray(rawSpecs)
        ? rawSpecs
        : (typeof rawSpecs === 'string' ? JSON.parse(rawSpecs || '[]') : []);
      return { ...agent, ...dbAgent, specializations, role: 'agent' };
    }
  }
  
  return null;
}

export async function assertAgentAccess(userOrReq, projectId = null, category = null) {
  let user = userOrReq;
  if (user && typeof user.headers?.get === 'function') {
    user = (await requirePmAccess(user, null)) || verifyBearer(user, 'admin') || verifyBearer(user, 'agent');
  }

  if (!user) {
    return {
      allowed: false,
      status: 401,
      error: 'Unauthorized',
      response: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }),
    };
  }

  // Admin and site supervisor always allowed
  if (user.role === 'admin' || user.role === 'site_supervisor') {
    return {
      allowed: true,
      user,
      role: user.role,
      status: 200,
      error: null,
      response: null,
    };
  }

  if (user.role === 'agent') {
    // Fetch agent fresh from DB on each request
    const freshRes = await pool.query(
      `SELECT id, name, email, phone, city, status, login_enabled,
              has_project_management_access, specializations
         FROM agents
        WHERE id = $1`,
      [user.id]
    );
    const agent = freshRes.rows[0];

    if (!agent || agent.status !== 'Approved' || !agent.login_enabled || !agent.has_project_management_access) {
      return {
        allowed: false,
        status: 403,
        error: 'Forbidden: Project Management access required',
        response: NextResponse.json({ success: false, error: 'Forbidden: Project Management access required' }, { status: 403 }),
      };
    }

    if (projectId) {
      const projIdNum = Number(projectId);
      if (Number.isInteger(projIdNum) && projIdNum > 0) {
        const assignmentRes = await pool.query(
          'SELECT 1 FROM pm_project_agents WHERE project_id = $1 AND agent_id = $2',
          [projIdNum, agent.id]
        );
        if (assignmentRes.rows.length === 0) {
          return {
            allowed: false,
            status: 403,
            error: 'Forbidden: Agent is not assigned to this project',
            response: NextResponse.json({ success: false, error: 'Forbidden: Agent is not assigned to this project' }, { status: 403 }),
          };
        }
      }
    }

    const rawSpecs = agent.specializations;
    const specializations = Array.isArray(rawSpecs)
      ? rawSpecs
      : (typeof rawSpecs === 'string' ? JSON.parse(rawSpecs || '[]') : []);

    if (category) {
      const categoriesToCheck = Array.isArray(category) ? category : [category];
      const hasMatch = categoriesToCheck.some((c) => specializations.includes(c));
      if (!hasMatch) {
        const needed = Array.isArray(category) ? category.join(' or ') : category;
        return {
          allowed: false,
          status: 403,
          error: `Forbidden: '${needed}' specialization required`,
          response: NextResponse.json({ success: false, error: `Forbidden: '${needed}' specialization required` }, { status: 403 }),
        };
      }
    }

    const merged = { ...user, ...agent, specializations, role: 'agent' };
    return {
      allowed: true,
      user: merged,
      agent: merged,
      role: 'agent',
      status: 200,
      error: null,
      response: null,
    };
  }

  return {
    allowed: false,
    status: 403,
    error: 'Forbidden: Access denied',
    response: NextResponse.json({ success: false, error: 'Forbidden: Access denied' }, { status: 403 }),
  };
}

// Migrations are the source of truth. This guarded bootstrap makes fresh Neon
// previews usable before the deployment migration runner has executed.
export const ensureProjectManagementSchema = createInitializationGuard(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_parties (id BIGSERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL, phone VARCHAR(30), email VARCHAR(255), gst_no VARCHAR(30), address TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_projects (id BIGSERIAL PRIMARY KEY, party_id BIGINT NOT NULL REFERENCES pm_parties(id) ON DELETE RESTRICT, name VARCHAR(250) NOT NULL, site_address TEXT, start_date DATE NOT NULL, expected_end_date DATE, contract_value NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (contract_value >= 0), built_up_area NUMERIC(14,2), status VARCHAR(20) NOT NULL DEFAULT 'running' CHECK (status IN ('running','completed','on_hold')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_party_payments (id BIGSERIAL PRIMARY KEY, project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT, amount NUMERIC(14,2) NOT NULL CHECK (amount > 0), payment_date DATE NOT NULL DEFAULT CURRENT_DATE, mode VARCHAR(50), note TEXT, created_by TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_by TEXT, updated_at TIMESTAMPTZ, is_deleted BOOLEAN NOT NULL DEFAULT FALSE, deleted_by TEXT, deleted_at TIMESTAMPTZ)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_audit_logs (id BIGSERIAL PRIMARY KEY, entity_type VARCHAR(40) NOT NULL, entity_id BIGINT NOT NULL, action VARCHAR(30) NOT NULL, changed_by TEXT NOT NULL, before_data JSONB, after_data JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await pool.query(`CREATE INDEX IF NOT EXISTS pm_projects_party_id_idx ON pm_projects(party_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS pm_party_payments_project_id_idx ON pm_party_payments(project_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS pm_party_payments_active_project_date_idx ON pm_party_payments(project_id, payment_date DESC) WHERE NOT is_deleted`);
  await pool.query(`CREATE INDEX IF NOT EXISTS pm_audit_logs_entity_idx ON pm_audit_logs(entity_type, entity_id, created_at DESC)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_vendors (id BIGSERIAL PRIMARY KEY,name VARCHAR(200) NOT NULL,phone VARCHAR(30),trade VARCHAR(120),address TEXT,is_active BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_project_vendors (id BIGSERIAL PRIMARY KEY,project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,vendor_id BIGINT NOT NULL REFERENCES pm_vendors(id) ON DELETE RESTRICT,work_description TEXT NOT NULL,pay_type VARCHAR(20) NOT NULL CHECK(pay_type IN ('daily_wage','contract')),daily_rate NUMERIC(14,2),contract_amount NUMERIC(14,2),status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed')),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),UNIQUE(project_id,vendor_id,work_description))`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_attendance (id BIGSERIAL PRIMARY KEY,project_vendor_id BIGINT NOT NULL REFERENCES pm_project_vendors(id) ON DELETE RESTRICT,attendance_date DATE NOT NULL,status VARCHAR(20) NOT NULL CHECK(status IN ('present','absent','half_day')),workers_count NUMERIC(10,2) NOT NULL DEFAULT 1 CHECK(workers_count>0),rate_per_worker NUMERIC(14,2) NOT NULL CHECK(rate_per_worker>=0),wage_amount NUMERIC(14,2) NOT NULL CHECK(wage_amount>=0),note TEXT,created_by TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),UNIQUE(project_vendor_id,attendance_date))`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_vendor_payments (id BIGSERIAL PRIMARY KEY,project_vendor_id BIGINT NOT NULL REFERENCES pm_project_vendors(id) ON DELETE RESTRICT,amount NUMERIC(14,2) NOT NULL CHECK(amount>0),payment_date DATE NOT NULL,mode VARCHAR(50),payment_type VARCHAR(20) NOT NULL CHECK(payment_type IN ('advance','labour','material','contract')),note TEXT,is_deleted BOOLEAN NOT NULL DEFAULT FALSE,created_by TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_vendor_material_supply (id BIGSERIAL PRIMARY KEY,project_vendor_id BIGINT NOT NULL REFERENCES pm_project_vendors(id) ON DELETE RESTRICT,item_name VARCHAR(250) NOT NULL,unit VARCHAR(40),quantity NUMERIC(14,3) NOT NULL CHECK(quantity>0),rate NUMERIC(14,2) NOT NULL CHECK(rate>=0),amount NUMERIC(14,2) NOT NULL CHECK(amount>0),supply_date DATE NOT NULL,material_id BIGINT NULL,note TEXT,is_deleted BOOLEAN NOT NULL DEFAULT FALSE,created_by TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_audit_log (id BIGSERIAL PRIMARY KEY,table_name VARCHAR(80) NOT NULL,record_id BIGINT NOT NULL,action VARCHAR(30) NOT NULL,changed_by TEXT NOT NULL,old_data JSONB,new_data JSONB,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  for (const sql of [`CREATE INDEX IF NOT EXISTS pm_project_vendors_project_id_idx ON pm_project_vendors(project_id)`,`CREATE INDEX IF NOT EXISTS pm_project_vendors_vendor_id_idx ON pm_project_vendors(vendor_id)`,`CREATE INDEX IF NOT EXISTS pm_attendance_project_vendor_id_idx ON pm_attendance(project_vendor_id)`,`CREATE INDEX IF NOT EXISTS pm_attendance_vendor_date_idx ON pm_attendance(project_vendor_id,attendance_date)`,`CREATE INDEX IF NOT EXISTS pm_vendor_payments_project_vendor_id_idx ON pm_vendor_payments(project_vendor_id)`,`CREATE INDEX IF NOT EXISTS pm_vendor_material_supply_project_vendor_id_idx ON pm_vendor_material_supply(project_vendor_id)`]) await pool.query(sql);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_materials(id BIGSERIAL PRIMARY KEY,name VARCHAR(200) NOT NULL UNIQUE,unit VARCHAR(40),category VARCHAR(100),min_stock_level NUMERIC(14,3) NOT NULL DEFAULT 0,is_active BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_material_received(id BIGSERIAL PRIMARY KEY,project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,material_id BIGINT NOT NULL REFERENCES pm_materials(id) ON DELETE RESTRICT,supplier_name TEXT,supplier_vendor_id BIGINT REFERENCES pm_vendors(id) ON DELETE SET NULL,vendor_supply_id BIGINT REFERENCES pm_vendor_material_supply(id) ON DELETE SET NULL,quantity NUMERIC(14,3) NOT NULL CHECK(quantity>0),rate NUMERIC(14,2) NOT NULL CHECK(rate>=0),amount NUMERIC(14,2) NOT NULL,received_date DATE NOT NULL,challan_no VARCHAR(100),note TEXT,is_deleted BOOLEAN NOT NULL DEFAULT FALSE,created_by TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ,transfer_in BOOLEAN NOT NULL DEFAULT FALSE)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_material_used(id BIGSERIAL PRIMARY KEY,project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,material_id BIGINT NOT NULL REFERENCES pm_materials(id) ON DELETE RESTRICT,quantity NUMERIC(14,3) NOT NULL CHECK(quantity>0),used_date DATE NOT NULL,used_for TEXT,note TEXT,is_deleted BOOLEAN NOT NULL DEFAULT FALSE,created_by TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ,over_used BOOLEAN NOT NULL DEFAULT FALSE)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_material_adjustments(id BIGSERIAL PRIMARY KEY,project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,material_id BIGINT NOT NULL REFERENCES pm_materials(id) ON DELETE RESTRICT,adjustment_type VARCHAR(30) NOT NULL CHECK(adjustment_type IN ('wastage','damage','return_to_supplier','transfer_out')),quantity NUMERIC(14,3) NOT NULL CHECK(quantity>0),adjustment_date DATE NOT NULL,to_project_id BIGINT REFERENCES pm_projects(id) ON DELETE RESTRICT,note TEXT,is_deleted BOOLEAN NOT NULL DEFAULT FALSE,created_by TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),over_used BOOLEAN NOT NULL DEFAULT FALSE)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_other_expenses(id BIGSERIAL PRIMARY KEY,project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,category VARCHAR(30) NOT NULL CHECK(category IN ('transport','machine_rent','electricity_water','permit','misc')),amount NUMERIC(14,2) NOT NULL CHECK(amount>0),expense_date DATE NOT NULL,note TEXT,is_deleted BOOLEAN NOT NULL DEFAULT FALSE,created_by TEXT NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  // Agent Specializations Column
  await pool.query(`ALTER TABLE agents ADD COLUMN IF NOT EXISTS specializations JSONB NOT NULL DEFAULT '[]'::jsonb`);
  
  // Phase 4: Multiple Agents per Project
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_project_agents (
      id BIGSERIAL PRIMARY KEY,
      project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
      agent_id BIGINT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
      assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      assigned_by TEXT,
      UNIQUE(project_id, agent_id)
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS pm_project_agents_project_id_idx ON pm_project_agents(project_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS pm_project_agents_agent_id_idx ON pm_project_agents(agent_id)`);

  // Phase 5: Lead to Project Conversion Link
  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pm_projects' AND column_name='source_lead_id') THEN
        ALTER TABLE pm_projects ADD COLUMN source_lead_id BIGINT REFERENCES agent_leads(id) ON DELETE SET NULL;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='agent_leads' AND column_name='converted_project_id') THEN
        ALTER TABLE agent_leads ADD COLUMN converted_project_id BIGINT REFERENCES pm_projects(id) ON DELETE SET NULL;
      END IF;
    END $$;
  `);
  
  // Phase 3 FK and indexes
  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pm_vendor_material_supply_material_id_fkey') THEN
        ALTER TABLE pm_vendor_material_supply
        ADD CONSTRAINT pm_vendor_material_supply_material_id_fkey
        FOREIGN KEY (material_id) REFERENCES pm_materials(id) ON DELETE SET NULL;
      END IF;
    END $$;
  `);

  for (const sql of [
    `CREATE INDEX IF NOT EXISTS pm_material_received_proj_idx ON pm_material_received(project_id)`,
    `CREATE INDEX IF NOT EXISTS pm_material_received_mat_idx ON pm_material_received(material_id)`,
    `CREATE INDEX IF NOT EXISTS pm_material_received_vendor_idx ON pm_material_received(supplier_vendor_id)`,
    `CREATE INDEX IF NOT EXISTS pm_material_received_supply_idx ON pm_material_received(vendor_supply_id)`,
    `CREATE INDEX IF NOT EXISTS pm_material_received_proj_mat_date_idx ON pm_material_received(project_id, material_id, received_date)`,
    `CREATE INDEX IF NOT EXISTS pm_material_used_proj_idx ON pm_material_used(project_id)`,
    `CREATE INDEX IF NOT EXISTS pm_material_used_mat_idx ON pm_material_used(material_id)`,
    `CREATE INDEX IF NOT EXISTS pm_material_used_proj_mat_date_idx ON pm_material_used(project_id, material_id, used_date)`,
    `CREATE INDEX IF NOT EXISTS pm_material_adj_proj_idx ON pm_material_adjustments(project_id)`,
    `CREATE INDEX IF NOT EXISTS pm_material_adj_mat_idx ON pm_material_adjustments(material_id)`,
    `CREATE INDEX IF NOT EXISTS pm_material_adj_to_proj_idx ON pm_material_adjustments(to_project_id)`,
    `CREATE INDEX IF NOT EXISTS pm_material_adj_proj_mat_date_idx ON pm_material_adjustments(project_id, material_id, adjustment_date)`,
    `CREATE INDEX IF NOT EXISTS pm_other_expenses_proj_idx ON pm_other_expenses(project_id)`,
    `CREATE INDEX IF NOT EXISTS pm_other_expenses_proj_date_idx ON pm_other_expenses(project_id, expense_date)`
  ]) {
    await pool.query(sql);
  }

  // Individual Labor Management tables
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_labor (
      id BIGSERIAL PRIMARY KEY,
      project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
      vendor_id BIGINT NULL REFERENCES pm_vendors(id) ON DELETE SET NULL,
      name VARCHAR(200) NOT NULL,
      phone VARCHAR(30),
      trade VARCHAR(120),
      daily_rate NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK(daily_rate >= 0),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_labor_attendance (
      id BIGSERIAL PRIMARY KEY,
      labor_id BIGINT NOT NULL REFERENCES pm_labor(id) ON DELETE RESTRICT,
      attendance_date DATE NOT NULL,
      status VARCHAR(20) NOT NULL CHECK(status IN ('present','absent','half_day')),
      wage_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK(wage_amount >= 0),
      note TEXT,
      created_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(labor_id, attendance_date)
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_labor_payments (
      id BIGSERIAL PRIMARY KEY,
      labor_id BIGINT NOT NULL REFERENCES pm_labor(id) ON DELETE RESTRICT,
      amount NUMERIC(14,2) NOT NULL CHECK(amount > 0),
      payment_date DATE NOT NULL,
      mode VARCHAR(50),
      note TEXT,
      is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
      created_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ
    );
  `);
  for (const sql of [
    `CREATE INDEX IF NOT EXISTS pm_labor_proj_idx ON pm_labor(project_id)`,
    `CREATE INDEX IF NOT EXISTS pm_labor_vendor_idx ON pm_labor(vendor_id)`,
    `CREATE INDEX IF NOT EXISTS pm_labor_att_labor_idx ON pm_labor_attendance(labor_id)`,
    `CREATE INDEX IF NOT EXISTS pm_labor_att_date_idx ON pm_labor_attendance(attendance_date)`,
    `CREATE INDEX IF NOT EXISTS pm_labor_pay_labor_idx ON pm_labor_payments(labor_id)`,
    `CREATE INDEX IF NOT EXISTS pm_labor_pay_date_idx ON pm_labor_payments(payment_date)`
  ]) {
    await pool.query(sql);
  }
});

export function pageParams(searchParams) {
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(searchParams.get('pageSize') || '25', 10) || 25));
  return { page, pageSize, offset: (page - 1) * pageSize };
}

export function actorFromAdmin(admin) {
  if (admin?.role === 'agent') {
    const name = admin?.name ? `${admin.name} ` : '';
    return `Agent ${name}(ID: ${admin.id})`;
  }
  return `${admin?.email || 'admin'}${admin?.id !== undefined ? ` (#${admin.id})` : ''}`;
}

export async function writePmAudit(client, entityType, entityId, action, actor, beforeData = null, afterData = null) {
  await client.query(`INSERT INTO pm_audit_logs (entity_type, entity_id, action, changed_by, before_data, after_data) VALUES ($1,$2,$3,$4,$5,$6)`, [entityType, entityId, action, actor, beforeData, afterData]);
  try {
    await client.query(`INSERT INTO pm_audit_log (table_name, record_id, action, changed_by, old_data, new_data) VALUES ($1,$2,$3,$4,$5,$6)`, [entityType, entityId, action, actor, beforeData, afterData]);
  } catch {}
}

export async function writePmPhase2Audit(client, tableName, recordId, action, actor, oldData = null, newData = null) {
  await client.query(`INSERT INTO pm_audit_log(table_name,record_id,action,changed_by,old_data,new_data) VALUES($1,$2,$3,$4,$5,$6)`,[tableName,recordId,action,actor,oldData,newData]);
  try {
    await client.query(`INSERT INTO pm_audit_logs(entity_type,entity_id,action,changed_by,before_data,after_data) VALUES($1,$2,$3,$4,$5,$6)`,[tableName,recordId,action,actor,oldData,newData]);
  } catch {}
}

export function money(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

// Phase 4: alert dismissals + settings schema guard
export const ensureProjectManagementPhase4Schema = createInitializationGuard(async () => {
  await ensureProjectManagementSchema(); // phases 1-3
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_alert_dismissals(id BIGSERIAL PRIMARY KEY,alert_key TEXT NOT NULL,dismissed_by TEXT NOT NULL,dismissed_until TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_settings(key VARCHAR(100) PRIMARY KEY,value TEXT NOT NULL,updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
  await pool.query(`INSERT INTO pm_settings(key,value) VALUES('party_payment_gap_days','30'),('contract_paid_warning_percent','90') ON CONFLICT(key) DO NOTHING`);
  await pool.query(`CREATE INDEX IF NOT EXISTS pm_alert_dismissals_key_until_idx ON pm_alert_dismissals(alert_key,dismissed_until DESC NULLS FIRST)`);
});

// Phase 5: benchmarks, rate summary, calculator overrides schema guard
export const ensureProjectManagementPhase5Schema = createInitializationGuard(async () => {
  await ensureProjectManagementPhase4Schema();
  // 1. Alter pm_projects
  await pool.query(`
    ALTER TABLE pm_projects
      ADD COLUMN IF NOT EXISTS project_type VARCHAR(40) NULL,
      ADD COLUMN IF NOT EXISTS floors INT NULL,
      ADD COLUMN IF NOT EXISTS quality_tier VARCHAR(40) NULL,
      ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL,
      ADD COLUMN IF NOT EXISTS foundation_type VARCHAR(40) NULL,
      ADD COLUMN IF NOT EXISTS include_in_benchmark BOOLEAN NOT NULL DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS completed_date DATE NULL,
      ADD COLUMN IF NOT EXISTS progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0;
  `);
  // 2. Alter pm_materials
  await pool.query(`
    ALTER TABLE pm_materials
      ADD COLUMN IF NOT EXISTS benchmark_key VARCHAR(40) NULL;
  `);
  // 3. pm_project_benchmarks
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_project_benchmarks (
      id BIGSERIAL PRIMARY KEY,
      project_id BIGINT NOT NULL UNIQUE REFERENCES pm_projects(id) ON DELETE CASCADE,
      built_up_area NUMERIC(14,2),
      labour_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
      vendor_material_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
      direct_material_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
      other_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
      total_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
      cost_per_sqft NUMERIC(14,2),
      labour_per_sqft NUMERIC(14,2),
      material_per_sqft NUMERIC(14,2),
      other_per_sqft NUMERIC(14,2),
      computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      data_quality_flags JSONB NOT NULL DEFAULT '[]'::jsonb
    );
  `);
  // 4. pm_project_material_benchmarks
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_project_material_benchmarks (
      id BIGSERIAL PRIMARY KEY,
      project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
      material_id BIGINT NOT NULL REFERENCES pm_materials(id) ON DELETE CASCADE,
      benchmark_key VARCHAR(40),
      net_quantity NUMERIC(14,3) NOT NULL DEFAULT 0,
      quantity_per_sqft NUMERIC(14,4),
      avg_rate NUMERIC(14,2),
      cost_per_sqft NUMERIC(14,2),
      computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(project_id, material_id)
    );
  `);
  // 5. pm_rate_summary
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_rate_summary (
      id BIGSERIAL PRIMARY KEY,
      segment_key VARCHAR(120) NOT NULL,
      project_type VARCHAR(40),
      quality_tier VARCHAR(40),
      floors_bucket VARCHAR(40),
      city VARCHAR(100),
      metric VARCHAR(60) NOT NULL,
      median NUMERIC(14,2),
      min NUMERIC(14,2),
      max NUMERIC(14,2),
      sample_count INT NOT NULL DEFAULT 0,
      confidence VARCHAR(20) NOT NULL DEFAULT 'low',
      computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  // 6. pm_calculator_rate_overrides
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_calculator_rate_overrides (
      id BIGSERIAL PRIMARY KEY,
      metric_key VARCHAR(60) NOT NULL,
      quality_tier VARCHAR(40),
      old_value NUMERIC(14,2) NOT NULL,
      new_value NUMERIC(14,2) NOT NULL,
      applied_by TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      reverted_at TIMESTAMPTZ NULL,
      note TEXT
    );
  `);
  // 7. Seed settings
  await pool.query(`
    INSERT INTO pm_settings (key, value)
    VALUES ('use_real_rates', 'false')
    ON CONFLICT (key) DO NOTHING;
  `);
  // 8. Indexes
  const indices = [
    `CREATE INDEX IF NOT EXISTS pm_projects_benchmark_idx ON pm_projects(include_in_benchmark, status, progress_percent)`,
    `CREATE INDEX IF NOT EXISTS pm_project_benchmarks_proj_idx ON pm_project_benchmarks(project_id)`,
    `CREATE INDEX IF NOT EXISTS pm_project_mat_bm_proj_key_idx ON pm_project_material_benchmarks(project_id, benchmark_key)`,
    `CREATE INDEX IF NOT EXISTS pm_project_mat_bm_mat_idx ON pm_project_material_benchmarks(material_id)`,
    `CREATE INDEX IF NOT EXISTS pm_rate_summary_segment_metric_idx ON pm_rate_summary(segment_key, metric)`,
    `CREATE INDEX IF NOT EXISTS pm_calc_overrides_metric_tier_active_idx ON pm_calculator_rate_overrides(metric_key, quality_tier) WHERE reverted_at IS NULL`
  ];
  for (const sql of indices) {
    await pool.query(sql);
  }
});

// Formatting helpers (server-side, used by export routes)
export function inr(v) {
  const n = Number(v || 0);
  return '\u20B9' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
export function ddmmyyyy(d) {
  if (!d) return '\u2014';
  const dt = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d).slice(0, 10);
  return [String(dt.getDate()).padStart(2, '0'), String(dt.getMonth() + 1).padStart(2, '0'), dt.getFullYear()].join('-');
}

// Load settings as a plain object { key: numericValue }
export async function loadPmSettings() {
  const r = await pool.query(`SELECT key, value FROM pm_settings`);
  return Object.fromEntries(r.rows.map(row => [row.key, row.value]));
}

