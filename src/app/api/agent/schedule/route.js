import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAgent } from '@/lib/agent-auth';

const STATUSES = new Set(['Planned', 'Done', 'Cancelled']);

export async function GET(req) {
  try {
    await ensureAgentSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT * FROM agent_schedule
        WHERE agent_id = $1
        ORDER BY schedule_date ASC, schedule_time ASC NULLS LAST, created_at DESC`,
      [agent.id]
    );

    return NextResponse.json({ success: true, data: result.rows, city: agent.city });
  } catch (error) {
    console.error('Agent schedule fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureAgentSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { title, scheduleDate, scheduleTime, type, status, notes } = await req.json();
    if (!title || !scheduleDate) {
      return NextResponse.json({ success: false, error: 'Title and date are required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO agent_schedule
        (agent_id, city, title, schedule_date, schedule_time, type, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [agent.id, agent.city, title, scheduleDate, scheduleTime || null, type || null, STATUSES.has(status) ? status : 'Planned', notes || null]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Agent schedule create error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await ensureAgentSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, scheduleDate, scheduleTime, type, status, notes } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Schedule id is required' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE agent_schedule
          SET title = COALESCE($1, title),
              schedule_date = COALESCE($2, schedule_date),
              schedule_time = COALESCE($3, schedule_time),
              type = COALESCE($4, type),
              status = COALESCE($5, status),
              notes = COALESCE($6, notes),
              city = $7,
              updated_at = NOW()
        WHERE id = $8 AND agent_id = $9
        RETURNING *`,
      [title || null, scheduleDate || null, scheduleTime || null, type || null, STATUSES.has(status) ? status : null, notes || null, agent.city, id, agent.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Schedule item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Agent schedule update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
