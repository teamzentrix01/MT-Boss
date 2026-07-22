import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { getJwtSecret, requireRole } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';

export function signAgentToken(agent) {
  return jwt.sign(
    { id: agent.id, email: agent.email, role: 'agent', city: agent.city },
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
            status, login_enabled, must_change_password, last_login_at, created_at
       FROM agents
      WHERE id = $1 AND login_enabled = TRUE AND status = 'Approved'`,
    [payload.id]
  );

  return result.rows[0] || null;
}

export function requireAdmin(req) {
  return requireRole(req, 'admin');
}

function quoteIdent(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
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

  const statusChecks = await pool.query(`
    SELECT conname
      FROM pg_constraint
     WHERE conrelid = 'agents'::regclass
       AND contype = 'c'
       AND pg_get_constraintdef(oid) ILIKE '%status%'
  `);

  for (const row of statusChecks.rows) {
    await pool.query(`ALTER TABLE agents DROP CONSTRAINT IF EXISTS ${quoteIdent(row.conname)}`);
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

  // Older deployments may still have a restrictive status CHECK that does not
  // include the newer Follow-up value. The API validates allowed statuses, so
  // remove stale database constraints that otherwise make the dropdown fail.
  const leadStatusChecks = await pool.query(`
    SELECT conname
      FROM pg_constraint
     WHERE conrelid = 'agent_leads'::regclass
       AND contype = 'c'
       AND pg_get_constraintdef(oid) ILIKE '%status%'
  `);
  for (const row of leadStatusChecks.rows) {
    await pool.query(`ALTER TABLE agent_leads DROP CONSTRAINT IF EXISTS ${quoteIdent(row.conname)}`);
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
});
