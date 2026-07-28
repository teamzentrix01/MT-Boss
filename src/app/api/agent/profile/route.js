import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { setAuthCookie } from '@/lib/auth';
import { ensureAgentSchema, requireAgent, signAgentToken } from '@/lib/agent-auth';

export async function GET(req) {
  try {
    await ensureAgentSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    console.error('Agent profile error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await ensureAgentSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { phone, occupation, currentPassword, newPassword } = body;
    const hasPhone = Object.prototype.hasOwnProperty.call(body, 'phone');
    const hasOccupation = Object.prototype.hasOwnProperty.call(body, 'occupation');
    if (hasPhone && !String(phone || '').trim()) {
      return NextResponse.json({ success: false, error: 'Phone cannot be empty' }, { status: 400 });
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
      }

      const authResult = await pool.query('SELECT password_hash FROM agents WHERE id = $1', [agent.id]);
      const valid = await bcrypt.compare(currentPassword || '', authResult.rows[0]?.password_hash || '');
      if (!valid) {
        return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await pool.query(
        `UPDATE agents
            SET phone = CASE WHEN $1::BOOLEAN THEN $2 ELSE phone END,
                occupation = CASE WHEN $3::BOOLEAN THEN $4 ELSE occupation END,
                password_hash = $5,
                must_change_password = FALSE,
                auth_version = auth_version + 1,
                updated_at = NOW()
          WHERE id = $6`,
        [
          hasPhone, String(phone || '').trim(),
          hasOccupation, String(occupation || '').trim() || null,
          passwordHash, agent.id,
        ]
      );
    } else {
      await pool.query(
        `UPDATE agents
            SET phone = CASE WHEN $1::BOOLEAN THEN $2 ELSE phone END,
                occupation = CASE WHEN $3::BOOLEAN THEN $4 ELSE occupation END,
                updated_at = NOW()
          WHERE id = $5`,
        [
          hasPhone, String(phone || '').trim(),
          hasOccupation, String(occupation || '').trim() || null,
          agent.id,
        ]
      );
    }

    const updated = await pool.query(
      `SELECT id, name, email, phone, city, state, occupation, agent_type,
              status, login_enabled, must_change_password, auth_version, last_login_at, created_at
         FROM agents
        WHERE id = $1`,
      [agent.id]
    );

    const updatedAgent = updated.rows[0];
    if (newPassword) {
      const token = signAgentToken(updatedAgent);
      const response = NextResponse.json({ success: true, agent: updatedAgent, token });
      return setAuthCookie(response, 'agent-auth-token', token);
    }
    return NextResponse.json({ success: true, agent: updatedAgent });
  } catch (error) {
    console.error('Agent profile update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
