import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ensureAgentSchema } from '@/lib/agent-auth';

const STATUSES = new Set(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost']);
const STAGES = new Set(['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost']);

async function ensureSchema() {
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
}

export async function GET(req) {
  try {
    const franchise = requireRole(req, 'franchise');
    if (!franchise) {
      return NextResponse.json({ success: false, error: 'Franchise access required' }, { status: 403 });
    }
    await ensureSchema();

    const [leads, agents] = await Promise.all([
      pool.query(
        `SELECT l.*, a.name AS agent_name
         FROM agent_leads l
         LEFT JOIN agents a ON a.id = l.agent_id
         WHERE l.assigned_franchise_id = $1
         ORDER BY l.created_at DESC`,
        [franchise.id]
      ),
      pool.query(
        `SELECT id, name, email, phone, city, state
         FROM agents
         WHERE status = 'Approved'
         ORDER BY name ASC`
      ),
    ]);

    return NextResponse.json({ success: true, data: leads.rows, agents: agents.rows });
  } catch (error) {
    console.error('Franchise lead management GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const franchise = requireRole(req, 'franchise');
    if (!franchise) {
      return NextResponse.json({ success: false, error: 'Franchise access required' }, { status: 403 });
    }
    await ensureSchema();

    const { id, agent_id, status, lead_stage, follow_up_date, notes } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead id is required' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE agent_leads
          SET agent_id = CASE WHEN $1::TEXT = '__clear__' THEN NULL ELSE COALESCE($1::INTEGER, agent_id) END,
              status = COALESCE($2, status),
              lead_stage = COALESCE($3, lead_stage),
              follow_up_date = COALESCE($4, follow_up_date),
              notes = COALESCE($5, notes),
              assigned_by_role = 'franchise',
              updated_at = NOW()
        WHERE id = $6 AND assigned_franchise_id = $7
        RETURNING *`,
      [
        agent_id === '' ? '__clear__' : agent_id || null,
        STATUSES.has(status) ? status : null,
        STAGES.has(lead_stage) ? lead_stage : null,
        follow_up_date || null,
        notes || null,
        id,
        franchise.id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Franchise lead management PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
