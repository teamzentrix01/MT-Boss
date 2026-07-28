import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAgent } from '@/lib/agent-auth';

const STATUSES = new Set(['Planned', 'Done', 'Cancelled']);

function passwordGate(agent) {
  if (!agent?.must_change_password) return null;
  return NextResponse.json(
    { success: false, error: 'Change your temporary password before accessing your schedule.', mustChangePassword: true },
    { status: 428 }
  );
}

export async function GET(req) {
  try {
    await ensureAgentSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

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
    const gate = passwordGate(agent);
    if (gate) return gate;

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
    const gate = passwordGate(agent);
    if (gate) return gate;

    const body = await req.json();
    const { id, title, scheduleDate, scheduleTime, type, status, notes } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Schedule id is required' }, { status: 400 });
    }

    if (Object.prototype.hasOwnProperty.call(body, 'title') && !String(title || '').trim()) {
      return NextResponse.json({ success: false, error: 'Schedule title is required.' }, { status: 400 });
    }
    if (Object.prototype.hasOwnProperty.call(body, 'scheduleDate') && !scheduleDate) {
      return NextResponse.json({ success: false, error: 'Schedule date is required.' }, { status: 400 });
    }
    if (Object.prototype.hasOwnProperty.call(body, 'status') && !STATUSES.has(status)) {
      return NextResponse.json({ success: false, error: 'Invalid schedule status.' }, { status: 400 });
    }

    const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
    const result = await pool.query(
      `UPDATE agent_schedule
          SET title = CASE WHEN $1::BOOLEAN THEN $2 ELSE title END,
              schedule_date = CASE WHEN $3::BOOLEAN THEN $4 ELSE schedule_date END,
              schedule_time = CASE WHEN $5::BOOLEAN THEN $6 ELSE schedule_time END,
              type = CASE WHEN $7::BOOLEAN THEN $8 ELSE type END,
              status = CASE WHEN $9::BOOLEAN THEN $10 ELSE status END,
              notes = CASE WHEN $11::BOOLEAN THEN $12 ELSE notes END,
              city = $13,
              updated_at = NOW()
        WHERE id = $14 AND agent_id = $15
        RETURNING *`,
      [
        has('title'), String(title || '').trim(),
        has('scheduleDate'), scheduleDate || null,
        has('scheduleTime'), scheduleTime || null,
        has('type'), String(type || '').trim() || null,
        has('status'), status || null,
        has('notes'), String(notes || '').trim() || null,
        agent.city, id, agent.id,
      ]
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

export async function DELETE(req) {
  try {
    await ensureAgentSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Valid schedule id is required.' }, { status: 400 });
    }

    const result = await pool.query(
      `DELETE FROM agent_schedule
        WHERE id = $1 AND agent_id = $2
        RETURNING id`,
      [id, agent.id]
    );
    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Schedule item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deleted_id: result.rows[0].id });
  } catch (error) {
    console.error('Agent schedule delete error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
