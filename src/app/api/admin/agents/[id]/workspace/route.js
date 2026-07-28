import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAdmin } from '@/lib/agent-auth';
import { ensureProjectOpsSchema, getProjectSummaries } from '@/lib/project-ops';

export async function GET(req, { params }) {
  try {
    await ensureAgentSchema();
    await ensureProjectOpsSchema();
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const [agentResult, leadsResult, scheduleResult, projects] = await Promise.all([
      pool.query(
        `SELECT id, name, email, phone, city, state, occupation, agent_type,
                status, login_enabled, must_change_password, approved_at, last_login_at, created_at
           FROM agents
          WHERE id = $1`,
        [id]
      ),
      pool.query('SELECT * FROM agent_leads WHERE agent_id = $1 ORDER BY created_at DESC', [id]),
      pool.query('SELECT * FROM agent_schedule WHERE agent_id = $1 ORDER BY schedule_date ASC, schedule_time ASC NULLS LAST', [id]),
      getProjectSummaries(
        "WHERE p.assigned_agent_id = $1 AND p.project_kind = 'operational'",
        [id]
      ),
    ]);

    if (agentResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      agent: agentResult.rows[0],
      leads: leadsResult.rows,
      schedule: scheduleResult.rows,
      projects,
    });
  } catch (error) {
    console.error('Admin agent workspace error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
