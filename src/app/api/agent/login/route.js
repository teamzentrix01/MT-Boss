import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { setAuthCookie } from '@/lib/auth';
import { ensureAgentSchema, signAgentToken } from '@/lib/agent-auth';

export async function POST(req) {
  try {
    await ensureAgentSchema();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id, name, email, phone, city, state, occupation, agent_type,
              status, login_enabled, password_hash, must_change_password
         FROM agents
        WHERE email = $1
        ORDER BY id DESC
        LIMIT 1`,
      [email]
    );

    const agent = result.rows[0];
    if (!agent?.password_hash) {
      return NextResponse.json({ error: 'Agent login is not active for this email.' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, agent.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (agent.status !== 'Approved' || !agent.login_enabled) {
      return NextResponse.json({ error: 'Your agent account is not approved yet.' }, { status: 403 });
    }

    await pool.query('UPDATE agents SET last_login_at = NOW() WHERE id = $1', [agent.id]);

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
    return NextResponse.json({ error: 'Server error occurred.' }, { status: 500 });
  }
}
