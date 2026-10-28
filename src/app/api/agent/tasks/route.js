import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAgent } from '@/lib/agent-auth';
import { ensureAgentTasksSchema, TASK_STATUSES } from '@/lib/agent-tasks';

function passwordGate(agent) {
  if (!agent?.must_change_password) return null;
  return NextResponse.json(
    { success: false, error: 'Change your temporary password before accessing your tasks.', mustChangePassword: true },
    { status: 428 }
  );
}

export async function GET(req) {
  try {
    await ensureAgentSchema();
    await ensureAgentTasksSchema();

    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

    // Auto-mark overdue tasks for this agent
    await pool.query(`
      UPDATE agent_tasks
         SET status = 'Overdue', updated_at = NOW()
       WHERE agent_id = $1
         AND status IN ('Pending', 'In Progress')
         AND due_date < NOW()
    `, [agent.id]);

    const { searchParams } = new URL(req.url);
    const taskType = searchParams.get('task_type');
    const status = searchParams.get('status');

    const conditions = ['agent_id = $1'];
    const values = [agent.id];

    if (taskType && taskType !== 'all') {
      values.push(taskType);
      conditions.push(`task_type = $${values.length}`);
    }

    if (status && status !== 'all') {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    const query = `
      SELECT t.*,
             m.name AS creator_name,
             m.city AS creator_city
        FROM agent_tasks t
        LEFT JOIN agents m ON m.id = t.created_by_agent_id
       WHERE ${conditions.map(c => 't.' + c).join(' AND ')}
       ORDER BY 
         CASE WHEN t.status = 'Pending' THEN 1
              WHEN t.status = 'In Progress' THEN 2
              WHEN t.status = 'Overdue' THEN 3
              ELSE 4 END ASC,
         t.due_date ASC,
         t.created_at DESC
    `;

    const result = await pool.query(query, values);

    // Agent's stats
    const statsRes = await pool.query(`
      SELECT 
        COUNT(*) AS total_tasks,
        COUNT(*) FILTER (WHERE task_type = 'daily') AS daily_tasks,
        COUNT(*) FILTER (WHERE task_type = 'weekly') AS weekly_tasks,
        COUNT(*) FILTER (WHERE task_type = 'monthly') AS monthly_tasks,
        COUNT(*) FILTER (WHERE status = 'Pending') AS pending_tasks,
        COUNT(*) FILTER (WHERE status = 'In Progress') AS in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'Completed') AS completed_tasks,
        COUNT(*) FILTER (WHERE status = 'Overdue') AS overdue_tasks,
        COUNT(*) FILTER (WHERE status IN ('Pending', 'In Progress')) AS active_tasks
      FROM agent_tasks
      WHERE agent_id = $1
    `, [agent.id]);

    return NextResponse.json({
      success: true,
      data: result.rows,
      stats: statsRes.rows[0] || {},
    });
  } catch (error) {
    console.error('Agent Tasks GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error fetching tasks' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await ensureAgentSchema();
    await ensureAgentTasksSchema();

    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

    const body = await req.json();
    const { id, status, agent_remark } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    const taskCheck = await pool.query(`
      SELECT * FROM agent_tasks WHERE id = $1 AND agent_id = $2
    `, [id, agent.id]);

    if (!taskCheck.rows.length) {
      return NextResponse.json({ success: false, error: 'Task not found or access denied' }, { status: 404 });
    }

    const current = taskCheck.rows[0];
    const allowedStatuses = ['In Progress', 'Completed'];

    const newStatus = status && allowedStatuses.includes(status) ? status : current.status;
    const newRemark = agent_remark !== undefined ? agent_remark : current.agent_remark;

    let completedAt = current.completed_at;
    if (newStatus === 'Completed') {
      completedAt = new Date().toISOString();
    }

    const result = await pool.query(`
      UPDATE agent_tasks
         SET status = $1,
             agent_remark = $2,
             completed_at = $3,
             updated_at = NOW()
       WHERE id = $4 AND agent_id = $5
       RETURNING *
    `, [newStatus, newRemark, completedAt, id, agent.id]);

    // If completed and assigned by a manager, notify that manager
    if (newStatus === 'Completed' && current.created_by_agent_id) {
      try {
        await pool.query(`
          INSERT INTO agent_notifications (agent_id, type, title, message, entity_type, entity_id, dedupe_key)
          VALUES ($1, 'task_completed', $2, $3, 'task', $4, $5)
          ON CONFLICT (agent_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING
        `, [
          current.created_by_agent_id,
          `Team Task Completed by ${agent.name}`,
          `Task "${current.title}" marked Completed. Remark: ${newRemark || 'None'}`,
          current.id,
          `task_comp_${current.id}_${Date.now()}`,
        ]);
      } catch (notifErr) {
        console.warn('Manager completion notification warning:', notifErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: newStatus === 'Completed' ? 'Task marked as completed!' : 'Task status updated.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Agent Tasks PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Server error updating task' }, { status: 500 });
  }
}
