import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin, ensureAgentSchema } from '@/lib/agent-auth';
import { ensureAgentTasksSchema, calculateDueDate, TASK_PRIORITIES, TASK_STATUSES } from '@/lib/agent-tasks';
import { ensureAgentNotificationsSchema } from '@/lib/agent-notifications';

export async function GET(req) {
  try {
    await ensureAgentSchema();
    await ensureAgentTasksSchema();

    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Auto-mark overdue tasks
    await pool.query(`
      UPDATE agent_tasks
         SET status = 'Overdue', updated_at = NOW()
       WHERE status IN ('Pending', 'In Progress')
         AND due_date < NOW()
    `);

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agent_id');
    const agentIds = searchParams.get('agent_ids');
    const status = searchParams.get('status');
    const taskType = searchParams.get('task_type');
    const search = searchParams.get('search');

    const conditions = [];
    const values = [];

    if (agentIds && agentIds !== 'all') {
      const ids = agentIds.split(',').map((id) => parseInt(id.trim(), 10)).filter(Boolean);
      if (ids.length > 0) {
        values.push(ids);
        conditions.push(`t.agent_id = ANY($${values.length}::int[])`);
      }
    } else if (agentId && agentId !== 'all') {
      values.push(parseInt(agentId, 10));
      conditions.push(`t.agent_id = $${values.length}`);
    }

    if (status && status !== 'all') {
      values.push(status);
      conditions.push(`t.status = $${values.length}`);
    }

    if (taskType && taskType !== 'all') {
      values.push(taskType);
      conditions.push(`t.task_type = $${values.length}`);
    }

    if (search) {
      values.push(`%${search.trim()}%`);
      conditions.push(`(t.title ILIKE $${values.length} OR t.description ILIKE $${values.length} OR a.name ILIKE $${values.length} OR a.city ILIKE $${values.length})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT t.*,
             a.name AS agent_name,
             a.city AS agent_city,
             a.phone AS agent_phone,
             a.email AS agent_email
        FROM agent_tasks t
        JOIN agents a ON a.id = t.agent_id
       ${whereClause}
       ORDER BY 
         CASE WHEN t.status = 'Pending' THEN 1
              WHEN t.status = 'In Progress' THEN 2
              WHEN t.status = 'Overdue' THEN 3
              ELSE 4 END ASC,
         t.due_date ASC,
         t.created_at DESC
    `;

    const result = await pool.query(query, values);

    // Compute stats
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) AS total_tasks,
        COUNT(*) FILTER (WHERE task_type = 'daily') AS daily_tasks,
        COUNT(*) FILTER (WHERE task_type = 'weekly') AS weekly_tasks,
        COUNT(*) FILTER (WHERE task_type = 'monthly') AS monthly_tasks,
        COUNT(*) FILTER (WHERE status = 'Pending') AS pending_tasks,
        COUNT(*) FILTER (WHERE status = 'In Progress') AS in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'Completed') AS completed_tasks,
        COUNT(*) FILTER (WHERE status = 'Overdue') AS overdue_tasks
      FROM agent_tasks
    `);

    return NextResponse.json({
      success: true,
      data: result.rows,
      stats: statsResult.rows[0] || {},
    });
  } catch (error) {
    console.error('Admin Agent Tasks GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error fetching tasks' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureAgentSchema();
    await ensureAgentTasksSchema();
    await ensureAgentNotificationsSchema();

    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { agent_id, agent_ids, title, description, task_type, priority, due_date, assign_to_all } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Task title is required' }, { status: 400 });
    }

    const finalType = task_type || 'daily';
    const finalPriority = TASK_PRIORITIES.includes(priority) ? priority : 'Medium';
    const finalDueDate = calculateDueDate(finalType, due_date);

    let assignedCount = 0;
    const createdTasks = [];

    let targetAgentIds = [];

    if (assign_to_all || agent_id === 'all') {
      const allAgentsRes = await pool.query(`
        SELECT id FROM agents WHERE status = 'Approved' AND login_enabled = TRUE
      `);
      targetAgentIds = allAgentsRes.rows.map((r) => r.id);
    } else if (Array.isArray(agent_ids) && agent_ids.length > 0) {
      targetAgentIds = agent_ids.map(Number).filter(Boolean);
    } else if (agent_id) {
      const parsedId = parseInt(agent_id, 10);
      if (parsedId) targetAgentIds = [parsedId];
    }

    if (targetAgentIds.length === 0) {
      return NextResponse.json({ success: false, error: 'Please select at least one agent' }, { status: 400 });
    }

    const agentsRes = await pool.query(`
      SELECT id, name FROM agents WHERE id = ANY($1::int[]) AND status = 'Approved'
    `, [targetAgentIds]);

    if (agentsRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'No approved agents found to assign tasks to' }, { status: 404 });
    }

    for (const ag of agentsRes.rows) {
      const insRes = await pool.query(`
        INSERT INTO agent_tasks (agent_id, title, description, task_type, priority, status, due_date, created_by)
        VALUES ($1, $2, $3, $4, $5, 'Pending', $6, $7)
        RETURNING *
      `, [ag.id, title.trim(), description?.trim() || null, finalType, finalPriority, finalDueDate, admin.email || 'Admin']);

      createdTasks.push(insRes.rows[0]);
      assignedCount++;

      // Add notification
      try {
        await pool.query(`
          INSERT INTO agent_notifications (agent_id, type, title, message, entity_type, entity_id, dedupe_key)
          VALUES ($1, 'new_task', $2, $3, 'task', $4, $5)
          ON CONFLICT (agent_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING
        `, [
          ag.id,
          `New ${finalType.toUpperCase()} Task Assigned`,
          `Task: "${title.trim()}". Deadline: ${new Date(finalDueDate).toLocaleDateString('en-IN')}`,
          insRes.rows[0].id,
          `task_${insRes.rows[0].id}`,
        ]);
      } catch (notifErr) {
        console.warn('Notification insert warning:', notifErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${assignedCount} task(s).`,
      count: assignedCount,
      data: createdTasks,
    }, { status: 201 });
  } catch (error) {
    console.error('Admin Agent Tasks POST error:', error);
    return NextResponse.json({ success: false, error: 'Server error assigning task' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await ensureAgentSchema();
    await ensureAgentTasksSchema();

    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, description, task_type, priority, due_date, status, agent_remark } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    const taskCheck = await pool.query(`SELECT * FROM agent_tasks WHERE id = $1`, [id]);
    if (!taskCheck.rows.length) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    const current = taskCheck.rows[0];

    const newTitle = title !== undefined ? title.trim() : current.title;
    const newDesc = description !== undefined ? description : current.description;
    const newType = task_type !== undefined ? task_type : current.task_type;
    const newPriority = priority !== undefined && TASK_PRIORITIES.includes(priority) ? priority : current.priority;
    const newStatus = status !== undefined && TASK_STATUSES.includes(status) ? status : current.status;
    const newDueDate = due_date ? new Date(due_date).toISOString() : current.due_date;
    const newRemark = agent_remark !== undefined ? agent_remark : current.agent_remark;

    let completedAt = current.completed_at;
    if (newStatus === 'Completed' && current.status !== 'Completed') {
      completedAt = new Date().toISOString();
    } else if (newStatus !== 'Completed') {
      completedAt = null;
    }

    const result = await pool.query(`
      UPDATE agent_tasks
         SET title = $1,
             description = $2,
             task_type = $3,
             priority = $4,
             status = $5,
             due_date = $6,
             agent_remark = $7,
             completed_at = $8,
             updated_at = NOW()
       WHERE id = $9
       RETURNING *
    `, [newTitle, newDesc, newType, newPriority, newStatus, newDueDate, newRemark, completedAt, id]);

    return NextResponse.json({
      success: true,
      message: 'Task updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Admin Agent Tasks PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Server error updating task' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await ensureAgentSchema();
    await ensureAgentTasksSchema();

    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    const del = await pool.query(`DELETE FROM agent_tasks WHERE id = $1 RETURNING id`, [id]);
    if (!del.rows.length) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Admin Agent Tasks DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Server error deleting task' }, { status: 500 });
  }
}
