import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAdmin } from '@/lib/agent-auth';
import { sendMail } from '@/lib/email';

const AGENT_STATUSES = ['Pending', 'Reviewing', 'Approved', 'Rejected'];

function makeTemporaryPassword() {
  return `Agent@${Math.random().toString(36).slice(2, 8)}${Math.floor(10 + Math.random() * 90)}`;
}

function quoteIdent(name) {
  return `"${String(name).replace(/"/g, '""')}"`;
}

async function ensureAgentPatchSchema() {
  const patchAlters = [
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS login_enabled BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS password_hash TEXT`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255)`,
    `ALTER TABLE agents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`,
    `ALTER TABLE agents ALTER COLUMN password_hash DROP NOT NULL`,
    `ALTER TABLE agents ALTER COLUMN approved_at DROP NOT NULL`,
    `ALTER TABLE agents ALTER COLUMN approved_by DROP NOT NULL`,
  ];

  for (const sql of patchAlters) {
    try {
      await pool.query(sql);
    } catch (error) {
      console.warn('Agent PATCH schema warning:', error.message);
    }
  }

  try {
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
  } catch (error) {
    console.warn('Agent status constraint warning:', error.message);
  }
}

export async function GET(req) {
  try {
    await ensureAgentSchema();
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT
        a.*,
        COUNT(DISTINCT l.id)::INT AS leads_count,
        COUNT(DISTINCT s.id)::INT AS schedule_count
       FROM agents a
       LEFT JOIN agent_leads l ON l.agent_id = a.id
       LEFT JOIN agent_schedule s ON s.agent_id = a.id
       GROUP BY a.id
       ORDER BY a.created_at DESC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Agents fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureAgentSchema();
    const body = await req.json();
    const { name, email, phone, city, state, occupation, agentType, experience, network, message } = body;

    if (!name || !email || !phone || !city || !state || !agentType) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO agents (name, email, phone, city, state, occupation, agent_type, experience, network, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [name, email, phone, city, state, occupation, agentType, experience || null, network || null, message || null]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Agent submit error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await ensureAgentPatchSchema();
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, createLogin } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Agent id and status are required' }, { status: 400 });
    }

    if (!AGENT_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid agent status' }, { status: 400 });
    }

    const agentResult = await pool.query('SELECT * FROM agents WHERE id = $1', [id]);
    const agent = agentResult.rows[0];
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    if (agent.status === 'Approved' && status !== 'Approved') {
      return NextResponse.json({
        success: false,
        error: 'Approved agent is locked. No further status changes are allowed.',
      }, { status: 409 });
    }

    if (createLogin || (status === 'Approved' && !agent.login_enabled)) {
      if (!agent.city) {
        return NextResponse.json({ success: false, error: 'Agent city is required before approval' }, { status: 400 });
      }

      const temporaryPassword = makeTemporaryPassword();
      const passwordHash = await bcrypt.hash(temporaryPassword, 10);
      const result = await pool.query(
        `UPDATE agents
            SET status = 'Approved',
                login_enabled = TRUE,
                password_hash = $1,
                must_change_password = TRUE,
                approved_at = NOW(),
                approved_by = $2,
                updated_at = NOW()
          WHERE id = $3
          RETURNING *`,
        [passwordHash, admin.email || 'admin', id]
      );

      try {
        await sendMail({
          to: agent.email,
          subject: 'Your MT-BOSS Agent Login',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fff;border:1px solid #eee;">
              <h2 style="margin:0 0 12px;color:#111;">Welcome to MT-BOSS Agent Network</h2>
              <p style="color:#444;line-height:1.6;">Your agent application has been approved for <strong>${agent.city}, ${agent.state || ''}</strong>.</p>
              <div style="background:#f8f8f8;padding:16px;margin:18px 0;border-radius:6px;">
                <p style="margin:0 0 8px;"><strong>Login URL:</strong> /agent/login</p>
                <p style="margin:0 0 8px;"><strong>Email:</strong> ${agent.email}</p>
                <p style="margin:0;"><strong>Temporary Password:</strong> ${temporaryPassword}</p>
              </div>
              <p style="color:#666;font-size:13px;">Please change your password after first login.</p>
            </div>
          `,
        });
      } catch (mailError) {
        console.error('Agent approval email error:', mailError);
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        temporaryPassword,
        message: 'Agent approved and login created.',
      });
    }

    const result = await pool.query(
      `UPDATE agents
          SET status = $1,
              login_enabled = CASE WHEN $1 = 'Rejected' THEN FALSE ELSE login_enabled END,
              password_hash = CASE WHEN $1 = 'Rejected' THEN NULL ELSE password_hash END,
              must_change_password = CASE WHEN $1 = 'Rejected' THEN FALSE ELSE must_change_password END,
              approved_at = CASE WHEN $1 = 'Rejected' THEN NULL ELSE approved_at END,
              approved_by = CASE WHEN $1 = 'Rejected' THEN NULL ELSE approved_by END,
              updated_at = NOW()
        WHERE id = $2
        RETURNING *`,
      [status, id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Agent update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Server error',
        code: error.code || null,
        detail: error.detail || null,
      },
      { status: 500 }
    );
  }
}
