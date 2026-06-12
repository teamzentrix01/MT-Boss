import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAgent } from '@/lib/agent-auth';

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

    const { phone, occupation, currentPassword, newPassword } = await req.json();

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
      }

      const authResult = await pool.query('SELECT password_hash FROM agents WHERE id = $1', [agent.id]);
      const valid = await bcrypt.compare(currentPassword || '', authResult.rows[0]?.password_hash || '');
      if (!valid) {
        return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await pool.query(
        `UPDATE agents
            SET phone = COALESCE($1, phone),
                occupation = COALESCE($2, occupation),
                password_hash = $3,
                must_change_password = FALSE,
                updated_at = NOW()
          WHERE id = $4`,
        [phone || null, occupation || null, passwordHash, agent.id]
      );
    } else {
      await pool.query(
        `UPDATE agents
            SET phone = COALESCE($1, phone),
                occupation = COALESCE($2, occupation),
                updated_at = NOW()
          WHERE id = $3`,
        [phone || null, occupation || null, agent.id]
      );
    }

    const updated = await pool.query(
      `SELECT id, name, email, phone, city, state, occupation, agent_type,
              status, login_enabled, must_change_password, last_login_at, created_at
         FROM agents
        WHERE id = $1`,
      [agent.id]
    );

    return NextResponse.json({ success: true, agent: updated.rows[0] });
  } catch (error) {
    console.error('Agent profile update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
