import pool from '@/lib/db';

export async function ensureProjectOpsSchema() {
  await pool.query(`
    ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS franchise_id INTEGER,
      ADD COLUMN IF NOT EXISTS assigned_agent_id INTEGER,
      ADD COLUMN IF NOT EXISTS created_by_role TEXT DEFAULT 'admin',
      ADD COLUMN IF NOT EXISTS project_notes TEXT,
      ADD COLUMN IF NOT EXISTS client_name TEXT,
      ADD COLUMN IF NOT EXISTS client_phone TEXT,
      ADD COLUMN IF NOT EXISTS client_email TEXT,
      ADD COLUMN IF NOT EXISTS deal_amount NUMERIC DEFAULT 0,
      ADD COLUMN IF NOT EXISTS project_status TEXT DEFAULT 'lead',
      ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_payments (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
      amount NUMERIC NOT NULL DEFAULT 0,
      payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
      payment_mode TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_labour_entries (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
      labour_name TEXT NOT NULL,
      labour_role TEXT,
      work_date DATE NOT NULL DEFAULT CURRENT_DATE,
      attendance_status TEXT DEFAULT 'present',
      wage_amount NUMERIC DEFAULT 0,
      paid_amount NUMERIC DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_material_entries (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
      material_name TEXT NOT NULL,
      quantity NUMERIC NOT NULL DEFAULT 0,
      unit TEXT,
      rate NUMERIC DEFAULT 0,
      total_amount NUMERIC DEFAULT 0,
      supplier_name TEXT,
      vehicle_number TEXT,
      bill_url TEXT,
      entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_expenses (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
      expense_type TEXT NOT NULL,
      amount NUMERIC NOT NULL DEFAULT 0,
      expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_media (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      agent_id INTEGER REFERENCES agents(id) ON DELETE SET NULL,
      media_type TEXT DEFAULT 'photo',
      media_url TEXT NOT NULL,
      caption TEXT,
      media_date DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

export async function getProjectSummaries(whereSql = '', params = []) {
  await ensureProjectOpsSchema();
  const result = await pool.query(
    `
    SELECT
      p.*,
      f.name AS franchise_name,
      a.name AS assigned_agent_name,
      a.email AS assigned_agent_email,
      a.phone AS assigned_agent_phone,
      COALESCE(pay.total_received, 0) AS total_received,
      COALESCE(pay.payment_count, 0) AS payment_count,
      COALESCE(lab.labour_cost, 0) AS labour_cost,
      COALESCE(lab.labour_paid, 0) AS labour_paid,
      COALESCE(mat.material_cost, 0) AS material_cost,
      COALESCE(exp.extra_expense, 0) AS extra_expense,
      COALESCE(media.media_count, 0) AS media_count,
      ROUND(COALESCE(pay.total_received, 0) * 0.02, 2) AS agent_commission,
      ROUND(
        COALESCE(pay.total_received, 0)
        - COALESCE(lab.labour_cost, 0)
        - COALESCE(mat.material_cost, 0)
        - COALESCE(exp.extra_expense, 0)
        - (COALESCE(pay.total_received, 0) * 0.02),
        2
      ) AS profit_loss
    FROM projects p
    LEFT JOIN franchises f ON f.id = p.franchise_id
    LEFT JOIN agents a ON a.id = p.assigned_agent_id
    LEFT JOIN (
      SELECT project_id, SUM(amount) AS total_received, COUNT(*) AS payment_count
      FROM project_payments
      GROUP BY project_id
    ) pay ON pay.project_id = p.id
    LEFT JOIN (
      SELECT project_id, SUM(wage_amount) AS labour_cost, SUM(paid_amount) AS labour_paid
      FROM project_labour_entries
      GROUP BY project_id
    ) lab ON lab.project_id = p.id
    LEFT JOIN (
      SELECT project_id, SUM(total_amount) AS material_cost
      FROM project_material_entries
      GROUP BY project_id
    ) mat ON mat.project_id = p.id
    LEFT JOIN (
      SELECT project_id, SUM(amount) AS extra_expense
      FROM project_expenses
      GROUP BY project_id
    ) exp ON exp.project_id = p.id
    LEFT JOIN (
      SELECT project_id, COUNT(*) AS media_count
      FROM project_media
      GROUP BY project_id
    ) media ON media.project_id = p.id
    ${whereSql}
    ORDER BY p.created_at DESC
    `,
    params
  );

  return result.rows;
}

export async function getProjectOps(projectId) {
  await ensureProjectOpsSchema();
  const [payments, labour, materials, expenses, media] = await Promise.all([
    pool.query('SELECT * FROM project_payments WHERE project_id = $1 ORDER BY payment_date DESC, created_at DESC', [projectId]),
    pool.query('SELECT * FROM project_labour_entries WHERE project_id = $1 ORDER BY work_date DESC, created_at DESC', [projectId]),
    pool.query('SELECT * FROM project_material_entries WHERE project_id = $1 ORDER BY entry_date DESC, created_at DESC', [projectId]),
    pool.query('SELECT * FROM project_expenses WHERE project_id = $1 ORDER BY expense_date DESC, created_at DESC', [projectId]),
    pool.query('SELECT * FROM project_media WHERE project_id = $1 ORDER BY media_date DESC, created_at DESC', [projectId]),
  ]);

  return {
    payments: payments.rows,
    labour: labour.rows,
    materials: materials.rows,
    expenses: expenses.rows,
    media: media.rows,
  };
}

export function projectBelongsToAgent(project, agentId) {
  return Number(project.assigned_agent_id) === Number(agentId);
}

export function projectBelongsToFranchise(project, franchiseId) {
  return Number(project.franchise_id) === Number(franchiseId);
}
