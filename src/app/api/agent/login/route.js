import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { setAuthCookie } from '@/lib/auth';
import { ensureAgentSchema, signAgentToken } from '@/lib/agent-auth';

export async function POST(req) {
  try {
    try {
      await ensureAgentSchema();
    } catch (schemaError) {
      console.warn('ensureAgentSchema non-fatal warning during agent login:', schemaError?.message);
    }

    const body = await req.json().catch(() => ({}));
    const { email, password } = body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    let result;
    try {
      result = await pool.query(
        `SELECT id, name, email, phone, city, state, occupation, agent_type,
                status, login_enabled, password_hash, must_change_password, auth_version,
                has_project_management_access
           FROM agents
          WHERE LOWER(TRIM(email)) = $1
          ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC, id DESC
          LIMIT 1`,
        [normalizedEmail]
      );
    } catch (queryErr) {
      // Graceful fallback if has_project_management_access column hasn't been migrated yet
      if (String(queryErr?.message || '').toLowerCase().includes('has_project_management_access')) {
        result = await pool.query(
          `SELECT id, name, email, phone, city, state, occupation, agent_type,
                  status, login_enabled, password_hash, must_change_password, auth_version,
                  FALSE AS has_project_management_access
             FROM agents
            WHERE LOWER(TRIM(email)) = $1
            ORDER BY (status = 'Approved' AND login_enabled IS TRUE) DESC, id DESC
            LIMIT 1`,
          [normalizedEmail]
        );
      } else {
        throw queryErr;
      }
    }

    const agent = result.rows[0];
    if (!agent) {
      return NextResponse.json({ error: 'No agent account found for this email address.' }, { status: 401 });
    }

    if (agent.status !== 'Approved') {
      const statusMsg = agent.status === 'Rejected'
        ? 'Your agent application was not approved. Please contact support.'
        : 'Your agent application is under review. Please wait for admin approval.';
      return NextResponse.json({ error: statusMsg }, { status: 403 });
    }

    if (!agent.login_enabled) {
      return NextResponse.json({ error: 'Agent login is not enabled for this account. Please contact admin.' }, { status: 403 });
    }

    if (!agent.password_hash) {
      return NextResponse.json({ error: 'No password set for this agent account. Please contact admin.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, agent.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    try {
      await pool.query('UPDATE agents SET last_login_at = NOW() WHERE id = $1', [agent.id]);
    } catch (updateErr) {
      console.warn('Could not update last_login_at:', updateErr?.message);
    }

    const token = signAgentToken(agent);
    delete agent.password_hash;

    const response = NextResponse.json({
      success: true,
      token,
      agent: { ...agent, role: 'agent' },
      redirectTo: '/agent/dashboard',
    });
    return setAuthCookie(response, 'agent-auth-token', token);
  } catch (error) {
    console.error('Agent login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Server error occurred during sign-in.' },
      { status: 500 }
    );
  }
}
