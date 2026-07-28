import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAdmin } from '@/lib/agent-auth';
import { sendMail } from '@/lib/email';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { resolveManagedCity } from '@/lib/cities';
import { ensureAgentNotificationsSchema } from '@/lib/agent-notifications';

const AGENT_STATUSES = ['Pending', 'Reviewing', 'Approved', 'Rejected'];
const AGENT_SAFE_COLUMNS = `
  id, name, email, phone, city, state, occupation, agent_type, experience,
  network, message, status, login_enabled, must_change_password, approved_at,
  approved_by, auth_version, last_login_at, created_at, updated_at
`;

function makeTemporaryPassword() {
  return `Agent@${Math.random().toString(36).slice(2, 8)}${Math.floor(10 + Math.random() * 90)}`;
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
        ${AGENT_SAFE_COLUMNS.split(',').map((column) => `a.${column.trim()}`).join(', ')},
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
    const cleanName = cleanText(name);
    const cleanEmail = cleanText(email).toLowerCase();
    const cleanPhone = normalizePhone(phone);
    const canonicalCity = await resolveManagedCity(city);

    if (!cleanName || !cleanEmail || !cleanPhone || !canonicalCity || !state || !agentType) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }
    const contactError = validateContactFields({ name: cleanName, email: cleanEmail, phone: cleanPhone });
    if (contactError) {
      return NextResponse.json({ success: false, error: contactError }, { status: 400 });
    }

    const existing = await pool.query(
      `SELECT id FROM agents
        WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))
          AND status <> 'Rejected'
        LIMIT 1`,
      [cleanEmail]
    );
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An active agent application already exists for this email.' },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `INSERT INTO agents (name, email, phone, city, state, occupation, agent_type, experience, network, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING ${AGENT_SAFE_COLUMNS}`,
      [cleanName, cleanEmail, cleanPhone, canonicalCity, state, occupation, agentType, experience || null, network || null, message || null]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Agent submit error:', error);
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'An active agent application already exists for this email.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await ensureAgentSchema();
    await ensureAgentNotificationsSchema();
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, createLogin, action } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Agent id and status are required' }, { status: 400 });
    }

    if (!AGENT_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid agent status' }, { status: 400 });
    }

    const agentResult = await pool.query(
      `SELECT ${AGENT_SAFE_COLUMNS}, password_hash FROM agents WHERE id = $1`,
      [id]
    );
    const agent = agentResult.rows[0];
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    const resetPassword = action === 'reset_password';
    if (resetPassword && agent.status !== 'Approved') {
      return NextResponse.json(
        { success: false, error: 'Only an approved agent password can be reset.' },
        { status: 409 }
      );
    }

    if (resetPassword || createLogin || (status === 'Approved' && !agent.login_enabled)) {
      if (!agent.city) {
        return NextResponse.json({ success: false, error: 'Agent city is required before approval' }, { status: 400 });
      }
      const duplicateActive = await pool.query(
        `SELECT id FROM agents
          WHERE id <> $1
            AND LOWER(TRIM(email)) = LOWER(TRIM($2))
            AND status <> 'Rejected'
          LIMIT 1`,
        [id, agent.email]
      );
      if (duplicateActive.rows[0]) {
        return NextResponse.json(
          { success: false, error: 'Another active agent account already uses this email.' },
          { status: 409 }
        );
      }

      const temporaryPassword = makeTemporaryPassword();
      const passwordHash = await bcrypt.hash(temporaryPassword, 10);
      const result = await pool.query(
        `UPDATE agents
            SET status = 'Approved',
                login_enabled = TRUE,
                password_hash = $1,
                must_change_password = TRUE,
                auth_version = auth_version + 1,
                approved_at = NOW(),
                approved_by = $2,
                updated_at = NOW()
          WHERE id = $3
          RETURNING ${AGENT_SAFE_COLUMNS}`,
        [passwordHash, admin.email || 'admin', id]
      );

      let emailSent = true;
      try {
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
        await sendMail({
          to: agent.email,
          subject: resetPassword ? 'Your MTBoss Agent Password Was Reset' : 'Your MTBoss Agent Login',
          html: `
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fff;border:1px solid #eee;">
              <h2 style="margin:0 0 12px;color:#111;">${resetPassword ? 'Agent password reset' : 'Welcome to MTBoss Agent Network'}</h2>
              <p style="color:#444;line-height:1.6;">Your agent access is active for <strong>${agent.city}, ${agent.state || ''}</strong>.</p>
              <div style="background:#f8f8f8;padding:16px;margin:18px 0;border-radius:6px;">
                <p style="margin:0 0 8px;"><strong>Login URL:</strong> <a href="${appUrl}/agent/login">${appUrl}/agent/login</a></p>
                <p style="margin:0 0 8px;"><strong>Email:</strong> ${agent.email}</p>
                <p style="margin:0;"><strong>Temporary Password:</strong> ${temporaryPassword}</p>
              </div>
              <p style="color:#666;font-size:13px;">Please change your password after first login.</p>
            </div>
          `,
        });
      } catch (mailError) {
        console.error('Agent approval email error:', mailError);
        emailSent = false;
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0],
        temporaryPassword,
        emailSent,
        message: resetPassword ? 'Agent password reset.' : 'Agent approved and login created.',
      });
    }

    const result = await pool.query(
      `UPDATE agents
          SET status = $1::VARCHAR,
              login_enabled = CASE WHEN $1::VARCHAR = 'Approved' THEN login_enabled ELSE FALSE END,
              password_hash = CASE WHEN $1::VARCHAR = 'Approved' THEN password_hash ELSE NULL END,
              must_change_password = CASE WHEN $1::VARCHAR = 'Approved' THEN must_change_password ELSE FALSE END,
              auth_version = CASE WHEN $1::VARCHAR = 'Approved' THEN auth_version ELSE auth_version + 1 END,
              approved_at = CASE WHEN $1::VARCHAR = 'Approved' THEN approved_at ELSE NULL END,
              approved_by = CASE WHEN $1::VARCHAR = 'Approved' THEN approved_by ELSE NULL END,
              updated_at = NOW()
        WHERE id = $2
        RETURNING ${AGENT_SAFE_COLUMNS}`,
      [status, id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Agent update error:', error);
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Another active agent account already uses this email.' },
        { status: 409 }
      );
    }
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
