import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAgent } from '@/lib/agent-auth';
import { ensureAgentTasksSchema, calculateDueDate, TASK_TYPES, TASK_PRIORITIES, TASK_STATUSES } from '@/lib/agent-tasks';
import { ensureAgentNotificationsSchema } from '@/lib/agent-notifications';

function passwordGate(agent) {
  if (!agent?.must_change_password) return null;
  return NextResponse.json(
    { success: false, error: 'Change your temporary password before accessing team management.', mustChangePassword: true },
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

    if (!agent.is_manager) {
      return NextResponse.json(
        { success: false, error: 'Manager access required. Contact admin to be designated as Head Agent.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agent_id');
    const agentIds = searchParams.get('agent_ids');
    const status = searchParams.get('status');
    const taskType = searchParams.get('task_type');
    const search = searchParams.get('search');

    // 1. Fetch team agents (agents assigned to this manager, OR if none, all approved active agents)
    const specificTeamRes = await pool.query(`
      SELECT id, name, email, phone, city, state, occupation, is_manager, created_at
        FROM agents
       WHERE manager_id = $1 AND status = 'Approved' AND login_enabled = TRUE
       ORDER BY name ASC
    `, [agent.id]);

    let teamAgents = specificTeamRes.rows;
    const isGlobalTeam = teamAgents.length === 0;

    if (isGlobalTeam) {
      // If Admin hasn't partitioned agents specifically, Manager can assign to any approved field agent
      const allRes = await pool.query(`
        SELECT id, name, email, phone, city, state, occupation, is_manager, created_at
          FROM agents
         WHERE status = 'Approved' AND login_enabled = TRUE AND id <> $1
         ORDER BY name ASC
      `, [agent.id]);
      teamAgents = allRes.rows;
    }

    const teamAgentIds = teamAgents.map((a) => a.id);

    // Auto-mark overdue tasks
    if (teamAgentIds.length > 0) {
      await pool.query(`
        UPDATE agent_tasks
           SET status = 'Overdue', updated_at = NOW()
         WHERE (created_by_agent_id = $1 OR agent_id = ANY($2::int[]))
           AND status IN ('Pending', 'In Progress')
           AND due_date < NOW()
      `, [agent.id, teamAgentIds]);
    }

    // 2. Build task filters
    const conditions = [];
    const values = [];

    // Scope to tasks either created by this manager OR for agents in this manager's team
    if (isGlobalTeam) {
      values.push(agent.id);
      conditions.push(`t.created_by_agent_id = $${values.length}`);
    } else {
      values.push(agent.id, teamAgentIds);
      conditions.push(`(t.created_by_agent_id = $1 OR t.agent_id = ANY($2::int[]))`);
    }

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

    const tasksRes = await pool.query(query, values);

    // Compute stats
    const statsQuery = isGlobalTeam
      ? `SELECT 
          COUNT(*) AS total_tasks,
          COUNT(*) FILTER (WHERE task_type = 'daily') AS daily_tasks,
          COUNT(*) FILTER (WHERE task_type = 'weekly') AS weekly_tasks,
          COUNT(*) FILTER (WHERE task_type = 'monthly') AS monthly_tasks,
          COUNT(*) FILTER (WHERE status = 'Pending') AS pending_tasks,
          COUNT(*) FILTER (WHERE status = 'In Progress') AS in_progress_tasks,
          COUNT(*) FILTER (WHERE status = 'Completed') AS completed_tasks,
          COUNT(*) FILTER (WHERE status = 'Overdue') AS overdue_tasks
         FROM agent_tasks
        WHERE created_by_agent_id = $1`
      : `SELECT 
          COUNT(*) AS total_tasks,
          COUNT(*) FILTER (WHERE task_type = 'daily') AS daily_tasks,
          COUNT(*) FILTER (WHERE task_type = 'weekly') AS weekly_tasks,
          COUNT(*) FILTER (WHERE task_type = 'monthly') AS monthly_tasks,
          COUNT(*) FILTER (WHERE status = 'Pending') AS pending_tasks,
          COUNT(*) FILTER (WHERE status = 'In Progress') AS in_progress_tasks,
          COUNT(*) FILTER (WHERE status = 'Completed') AS completed_tasks,
          COUNT(*) FILTER (WHERE status = 'Overdue') AS overdue_tasks
         FROM agent_tasks
        WHERE created_by_agent_id = $1 OR agent_id = ANY($2::int[])`;

    const statsParams = isGlobalTeam ? [agent.id] : [agent.id, teamAgentIds];
    const statsRes = await pool.query(statsQuery, statsParams);

    return NextResponse.json({
      success: true,
      team_agents: teamAgents,
      is_global_team: isGlobalTeam,
      data: tasksRes.rows,
      stats: statsRes.rows[0] || {},
    });
  } catch (error) {
    console.error('Manager Team Tasks GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error fetching team tasks' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureAgentSchema();
    await ensureAgentTasksSchema();
    await ensureAgentNotificationsSchema();

    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

    if (!agent.is_manager) {
      return NextResponse.json({ success: false, error: 'Manager access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { agent_ids, agent_id, title, description, task_type, priority, due_date, assign_to_all } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Task title is required' }, { status: 400 });
    }

    const finalType = Object.values(TASK_TYPES).includes(task_type) ? task_type : TASK_TYPES.DAILY;
    const finalPriority = TASK_PRIORITIES.includes(priority) ? priority : 'Medium';
    const finalDueDate = calculateDueDate(finalType, due_date);

    let targetAgentIds = [];

    if (assign_to_all || agent_id === 'all') {
      // Find team agents
      const teamRes = await pool.query(`
        SELECT id FROM agents
         WHERE (manager_id = $1 OR status = 'Approved')
           AND login_enabled = TRUE
           AND id <> $1
      `, [agent.id]);
      targetAgentIds = teamRes.rows.map((r) => r.id);
    } else if (Array.isArray(agent_ids) && agent_ids.length > 0) {
      targetAgentIds = agent_ids.map(Number).filter(Boolean);
    } else if (agent_id) {
      const parsed = parseInt(agent_id, 10);
      if (parsed) targetAgentIds = [parsed];
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

    let assignedCount = 0;
    const createdTasks = [];

    for (const targetAg of agentsRes.rows) {
      const insRes = await pool.query(`
        INSERT INTO agent_tasks (
          agent_id,
          created_by_agent_id,
          assigned_by_name,
          title,
          description,
          task_type,
          priority,
          status,
          due_date,
          created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending', $8, $9)
        RETURNING *
      `, [
        targetAg.id,
        agent.id,
        `${agent.name} (Manager)`,
        title.trim(),
        description?.trim() || null,
        finalType,
        finalPriority,
        finalDueDate,
        `${agent.name} (Manager)`,
      ]);

      createdTasks.push(insRes.rows[0]);
      assignedCount++;

      // Send notification to the field agent
      try {
        await pool.query(`
          INSERT INTO agent_notifications (agent_id, type, title, message, entity_type, entity_id, dedupe_key)
          VALUES ($1, 'new_task', $2, $3, 'task', $4, $5)
          ON CONFLICT (agent_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING
        `, [
          targetAg.id,
          `New Task from Manager ${agent.name}`,
          `Task: "${title.trim()}". Deadline: ${new Date(finalDueDate).toLocaleDateString('en-IN')}`,
          insRes.rows[0].id,
          `mgr_task_${insRes.rows[0].id}`,
        ]);
      } catch (notifErr) {
        console.warn('Manager notif warning:', notifErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${assignedCount} team task(s).`,
      count: assignedCount,
      data: createdTasks,
    }, { status: 201 });
  } catch (error) {
    console.error('Manager Team Tasks POST error:', error);
    return NextResponse.json({ success: false, error: 'Server error assigning team task' }, { status: 500 });
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

    if (!agent.is_manager) {
      return NextResponse.json({ success: false, error: 'Manager access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, title, description, task_type, priority, due_date, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    // Verify task was created by this manager or is within manager's scope
    const taskCheck = await pool.query(`
      SELECT * FROM agent_tasks WHERE id = $1 AND (created_by_agent_id = $2 OR created_by = $3)
    `, [id, agent.id, `${agent.name} (Manager)`]);

    if (!taskCheck.rows.length) {
      return NextResponse.json({ success: false, error: 'Task not found or permission denied' }, { status: 404 });
    }

    const current = taskCheck.rows[0];
    const newTitle = title?.trim() || current.title;
    const newDesc = description !== undefined ? description?.trim() : current.description;
    const newType = task_type && Object.values(TASK_TYPES).includes(task_type) ? task_type : current.task_type;
    const newPriority = priority && TASK_PRIORITIES.includes(priority) ? priority : current.priority;
    const newStatus = status && TASK_STATUSES.includes(status) ? status : current.status;
    const newDueDate = due_date ? calculateDueDate(newType, due_date) : current.due_date;

    const result = await pool.query(`
      UPDATE agent_tasks
         SET title = $1,
             description = $2,
             task_type = $3,
             priority = $4,
             due_date = $5,
             status = $6,
             updated_at = NOW()
       WHERE id = $7
       RETURNING *
    `, [newTitle, newDesc, newType, newPriority, newDueDate, newStatus, id]);

    return NextResponse.json({
      success: true,
      message: 'Task updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Manager Team Tasks PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Server error updating task' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await ensureAgentSchema();
    await ensureAgentTasksSchema();

    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const gate = passwordGate(agent);
    if (gate) return gate;

    if (!agent.is_manager) {
      return NextResponse.json({ success: false, error: 'Manager access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    const result = await pool.query(`
      DELETE FROM agent_tasks
       WHERE id = $1 AND (created_by_agent_id = $2 OR created_by = $3)
       RETURNING id
    `, [id, agent.id, `${agent.name} (Manager)`]);

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, error: 'Task not found or you cannot delete this task' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Team task deleted successfully' });
  } catch (error) {
    console.error('Manager Team Tasks DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Server error deleting task' }, { status: 500 });
  }
}
