import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { getJwtSecret, requireRole } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';

export function signAgentToken(agent) {
  return jwt.sign(
    {
      id: agent.id,
      email: agent.email,
      role: 'agent',
      city: agent.city,
      authVersion: Number(agent.auth_version || 0),
    },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
}

export function verifyBearerToken(req, expectedRole) {
  const header = req.headers.get('authorization') || '';
  const cookieName =
    expectedRole === 'agent' ? 'agent-auth-token' : 'auth-token';
  const cookieToken = req.cookies?.get?.(cookieName)?.value || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : cookieToken;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (expectedRole && payload.role !== expectedRole) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function requireAgent(req) {
  const payload = verifyBearerToken(req, 'agent');
  if (!payload?.id) return null;

  const result = await pool.query(
    `SELECT id, name, email, phone, city, state, occupation, agent_type,
            status, login_enabled, must_change_password, auth_version, last_login_at, created_at
       FROM agents
      WHERE id = $1 AND login_enabled = TRUE AND status = 'Approved'`,
    [payload.id]
  );

  const agent = result.rows[0];
  if (!agent || Number(payload.authVersion) !== Number(agent.auth_version || 0)) return null;
  return agent;
}

export function requireAdmin(req) {
  return requireRole(req, 'admin');
}

export const ensureAgentSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS agents (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      city VARCHAR(100),
      state VARCHAR(100),
      occupation VARCHAR(150),
      agent_type VARCHAR(100),
      experience VARCHAR(100),
      network VARCHAR(100),
      message TEXT,
      status VARCHAR(30) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const alters = [
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS login_enabled BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS password_hash TEXT`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255)`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS auth_version INTEGER NOT NULL DEFAULT 0`,
  ];

  for (const sql of alters) {
    await pool.query(sql);
  }

  const nullableAlters = [
    `ALTER TABLE agents ALTER COLUMN password_hash DROP NOT NULL`,
    `ALTER TABLE agents ALTER COLUMN approved_at DROP NOT NULL`,
    `ALTER TABLE agents ALTER COLUMN approved_by DROP NOT NULL`,
    `ALTER TABLE agents ALTER COLUMN last_login_at DROP NOT NULL`,
  ];

  for (const sql of nullableAlters) {
    try {
      await pool.query(sql);
    } catch {
      // Column may not exist in very old partial schemas; ADD COLUMN above handles normal cases.
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS agent_leads (
      id SERIAL PRIMARY KEY,
      agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
      city VARCHAR(100) NOT NULL,
      client_name VARCHAR(150) NOT NULL,
      client_phone VARCHAR(30) NOT NULL,
      client_email VARCHAR(255),
      service_type VARCHAR(120),
      lead_type VARCHAR(120),
      status VARCHAR(30) DEFAULT 'New',
      follow_up_date DATE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // CRM expansion columns
  const leadAlters = [
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS lead_stage VARCHAR(50) DEFAULT 'New'`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS meeting_done BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS estimate_sent BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS final_amount NUMERIC DEFAULT 0`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS daily_visit_notes TEXT`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS client_requirement TEXT`,
    `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS lead_source VARCHAR(120) DEFAULT 'offline'`,
  ];
  for (const sql of leadAlters) {
    await pool.query(sql);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS agent_schedule (
      id SERIAL PRIMARY KEY,
      agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
      city VARCHAR(100) NOT NULL,
      title VARCHAR(180) NOT NULL,
      schedule_date DATE NOT NULL,
      schedule_time VARCHAR(30),
      type VARCHAR(80),
      status VARCHAR(30) DEFAULT 'Planned',
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Keep city-scoped work aligned with the agent's current assigned city.
  await pool.query(`
    UPDATE agent_leads l
       SET city = a.city, updated_at = NOW()
      FROM agents a
     WHERE l.agent_id = a.id
       AND LOWER(TRIM(COALESCE(l.city, ''))) IS DISTINCT FROM LOWER(TRIM(COALESCE(a.city, '')))
  `);
  await pool.query(`
    UPDATE agent_schedule s
       SET city = a.city, updated_at = NOW()
      FROM agents a
     WHERE s.agent_id = a.id
       AND LOWER(TRIM(COALESCE(s.city, ''))) IS DISTINCT FROM LOWER(TRIM(COALESCE(a.city, '')))
  `);

  // Consolidate legacy duplicate active emails without deleting history. The
  // newest usable approved account wins, and work is moved to that account.
  await pool.query(`
    WITH ranked AS (
      SELECT id,
             FIRST_VALUE(id) OVER (
               PARTITION BY LOWER(TRIM(email))
               ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC,
                        created_at DESC, id DESC
             ) AS winner_id,
             ROW_NUMBER() OVER (
               PARTITION BY LOWER(TRIM(email))
               ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC,
                        created_at DESC, id DESC
             ) AS row_number
        FROM agents
       WHERE status <> 'Rejected'
    )
    UPDATE agent_leads l
       SET agent_id = r.winner_id, updated_at = NOW()
      FROM ranked r
     WHERE r.row_number > 1 AND l.agent_id = r.id
  `);
  await pool.query(`
    WITH ranked AS (
      SELECT id,
             FIRST_VALUE(id) OVER (
               PARTITION BY LOWER(TRIM(email))
               ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC,
                        created_at DESC, id DESC
             ) AS winner_id,
             ROW_NUMBER() OVER (
               PARTITION BY LOWER(TRIM(email))
               ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC,
                        created_at DESC, id DESC
             ) AS row_number
        FROM agents
       WHERE status <> 'Rejected'
    )
    UPDATE agent_schedule s
       SET agent_id = r.winner_id, updated_at = NOW()
      FROM ranked r
     WHERE r.row_number > 1 AND s.agent_id = r.id
  `);
  await pool.query(`
    DO $$
    BEGIN
      IF to_regclass('public.projects') IS NOT NULL
         AND EXISTS (
           SELECT 1
             FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'projects'
              AND column_name = 'assigned_agent_id'
         ) THEN
        WITH ranked AS (
          SELECT id,
                 FIRST_VALUE(id) OVER (
                   PARTITION BY LOWER(TRIM(email))
                   ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC,
                            created_at DESC, id DESC
                 ) AS winner_id,
                 ROW_NUMBER() OVER (
                   PARTITION BY LOWER(TRIM(email))
                   ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC,
                            created_at DESC, id DESC
                 ) AS row_number
            FROM agents
           WHERE status <> 'Rejected'
        )
        UPDATE projects p
           SET assigned_agent_id = r.winner_id
          FROM ranked r
         WHERE r.row_number > 1 AND p.assigned_agent_id = r.id;
      END IF;
    END $$;
  `);
  await pool.query(`
    WITH ranked AS (
      SELECT id,
             ROW_NUMBER() OVER (
               PARTITION BY LOWER(TRIM(email))
               ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC,
                        created_at DESC, id DESC
             ) AS row_number
        FROM agents
       WHERE status <> 'Rejected'
    )
    UPDATE agents a
       SET status = 'Rejected',
           login_enabled = FALSE,
           password_hash = NULL,
           must_change_password = FALSE,
           approved_at = NULL,
           approved_by = NULL,
           updated_at = NOW()
      FROM ranked r
     WHERE r.row_number > 1 AND a.id = r.id
  `);

  // Replace legacy status checks with the complete current sets below.
  await pool.query(`
    DO $$
    DECLARE constraint_row RECORD;
    BEGIN
      FOR constraint_row IN
        SELECT conname, conrelid::regclass AS table_name
          FROM pg_constraint
         WHERE conrelid IN ('agents'::regclass, 'agent_leads'::regclass, 'agent_schedule'::regclass)
           AND contype = 'c'
           AND conname NOT IN (
             'agents_status_valid',
             'agent_leads_status_valid',
             'agent_leads_stage_valid',
             'agent_schedule_status_valid'
           )
           AND (
             pg_get_constraintdef(oid) ILIKE '%status%'
             OR pg_get_constraintdef(oid) ILIKE '%lead_stage%'
           )
      LOOP
        EXECUTE format(
          'ALTER TABLE %s DROP CONSTRAINT IF EXISTS %I',
          constraint_row.table_name,
          constraint_row.conname
        );
      END LOOP;
    END $$;
  `);

  await pool.query(`
    UPDATE agents
       SET email = LOWER(TRIM(email)),
           status = CASE
             WHEN status IN ('Pending', 'Reviewing', 'Approved', 'Rejected') THEN status
             ELSE 'Pending'
           END
  `);
  await pool.query(`
    UPDATE agent_leads
       SET status = CASE
             WHEN status IN ('New', 'Contacted', 'Follow-up', 'Converted', 'Lost') THEN status
             ELSE 'New'
           END,
           lead_stage = CASE
             WHEN lead_stage IN ('New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost') THEN lead_stage
             ELSE 'New'
           END
  `);
  await pool.query(`
    UPDATE agent_schedule
       SET status = CASE
             WHEN status IN ('Planned', 'Done', 'Cancelled') THEN status
             ELSE 'Planned'
           END
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS agents_active_email_unique
      ON agents (LOWER(TRIM(email)))
      WHERE status <> 'Rejected'
  `);
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agents_status_valid') THEN
        ALTER TABLE agents ADD CONSTRAINT agents_status_valid
          CHECK (status IN ('Pending', 'Reviewing', 'Approved', 'Rejected'));
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agent_leads_status_valid') THEN
        ALTER TABLE agent_leads ADD CONSTRAINT agent_leads_status_valid
          CHECK (status IN ('New', 'Contacted', 'Follow-up', 'Converted', 'Lost'));
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agent_leads_stage_valid') THEN
        ALTER TABLE agent_leads ADD CONSTRAINT agent_leads_stage_valid
          CHECK (lead_stage IN ('New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost'));
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agent_schedule_status_valid') THEN
        ALTER TABLE agent_schedule ADD CONSTRAINT agent_schedule_status_valid
          CHECK (status IN ('Planned', 'Done', 'Cancelled'));
      END IF;
    END $$;
  `);
});
