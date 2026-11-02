import pool from '../src/lib/db.js';

async function run() {
  console.log('Running migration for pm_project_local_vendors...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_project_local_vendors (
      id BIGSERIAL PRIMARY KEY,
      project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
      name VARCHAR(200) NOT NULL,
      phone VARCHAR(30),
      city VARCHAR(100),
      address TEXT,
      material_type VARCHAR(100),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(project_id, name)
    );
  `);
  console.log('pm_project_local_vendors table created / verified.');

  await pool.query(`
    CREATE INDEX IF NOT EXISTS pm_project_local_vendors_proj_idx 
    ON pm_project_local_vendors(project_id);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS pm_project_local_vendors_proj_active_idx 
    ON pm_project_local_vendors(project_id, is_active) WHERE is_active;
  `);

  console.log('Indexes created successfully.');

  const res = await pool.query(`
    SELECT to_regclass('public.pm_project_local_vendors') AS table_exists;
  `);
  console.log('Verification:', res.rows[0]);

  await pool.end();
  console.log('Migration finished successfully.');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

