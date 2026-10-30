import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';

export const TASK_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
};

export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed', 'Overdue', 'Cancelled'];

export const ensureAgentTasksSchema = createInitializationGuard(async function ensureAgentTasksSchemaV2() {
  const check = await pool.query(`
    SELECT (SELECT to_regclass('public.agent_tasks') IS NOT NULL) AS has_tasks
  `);

  if (check.rows[0]?.has_tasks) {
    await pool.query(`
      ALTER TABLE agent_tasks ADD COLUMN IF NOT EXISTS created_by_agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL;
      ALTER TABLE agent_tasks ADD COLUMN IF NOT EXISTS assigned_by_name VARCHAR(150) DEFAULT 'Admin';
      CREATE INDEX IF NOT EXISTS agent_tasks_agent_status_idx ON agent_tasks (agent_id, status);
      CREATE INDEX IF NOT EXISTS agent_tasks_due_date_idx ON agent_tasks (due_date);
      CREATE INDEX IF NOT EXISTS agent_tasks_created_by_agent_idx ON agent_tasks (created_by_agent_id);
    `);
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS agent_tasks (
      id SERIAL PRIMARY KEY,
      agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
      created_by_agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
      assigned_by_name VARCHAR(150) DEFAULT 'Admin',
      title VARCHAR(255) NOT NULL,
      description TEXT,
      task_type VARCHAR(50) NOT NULL DEFAULT 'daily',
      priority VARCHAR(30) NOT NULL DEFAULT 'Medium',
      status VARCHAR(30) NOT NULL DEFAULT 'Pending',
      due_date TIMESTAMPTZ NOT NULL,
      agent_remark TEXT,
      completed_at TIMESTAMPTZ,
      created_by VARCHAR(120) DEFAULT 'Admin',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS agent_tasks_agent_status_idx ON agent_tasks (agent_id, status);
    CREATE INDEX IF NOT EXISTS agent_tasks_due_date_idx ON agent_tasks (due_date);
    CREATE INDEX IF NOT EXISTS agent_tasks_created_by_agent_idx ON agent_tasks (created_by_agent_id);
  `);
});

/**
 * Compute due_date based on task_type if not manually supplied.
 * - 'daily': end of the current day (23:59:59.999 local/server) or 24h
 * - 'weekly': 7 days from now
 * - 'monthly': 30 days from now
 */
export function calculateDueDate(taskType, customDueDate) {
  if (customDueDate) {
    const parsed = new Date(customDueDate);
    if (!isNaN(parsed.getTime())) return parsed.toISOString();
  }

  const now = new Date();
  if (taskType === TASK_TYPES.DAILY || taskType === 'per_day') {
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.toISOString();
  }
  if (taskType === TASK_TYPES.WEEKLY || taskType === 'one_week') {
    const weekly = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    weekly.setHours(23, 59, 59, 999);
    return weekly.toISOString();
  }
  if (taskType === TASK_TYPES.MONTHLY || taskType === 'one_month') {
    const monthly = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    monthly.setHours(23, 59, 59, 999);
    return monthly.toISOString();
  }

  // Default fallback 24h
  return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
}
