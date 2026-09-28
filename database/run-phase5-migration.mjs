import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error('No database connection string found in environment variables.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function run() {
  try {
    const sqlPath = path.resolve('database/migrations/20260928_project_management_phase5.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying Phase 5 migration...');
    await pool.query(sql);
    console.log('✅ Phase 5 migration applied successfully!');

    // Verify tables
    const tableRes = await pool.query(`
      SELECT tablename FROM pg_tables
      WHERE tablename IN (
        'pm_project_benchmarks',
        'pm_project_material_benchmarks',
        'pm_rate_summary',
        'pm_calculator_rate_overrides'
      )
    `);
    console.log('Verified tables:', tableRes.rows.map((r) => r.tablename).join(', '));

    // Verify pm_projects new columns
    const colRes = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'pm_projects'
        AND column_name IN ('project_type', 'floors', 'quality_tier', 'city', 'foundation_type', 'include_in_benchmark', 'completed_date', 'progress_percent')
    `);
    console.log('Verified pm_projects columns:', colRes.rows.map((r) => r.column_name).join(', '));

    // Verify pm_materials new column
    const matColRes = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'pm_materials'
        AND column_name = 'benchmark_key'
    `);
    console.log('Verified pm_materials column:', matColRes.rows.map((r) => r.column_name).join(', '));

    // Verify pm_settings
    const settingsRes = await pool.query(`SELECT key, value FROM pm_settings WHERE key = 'use_real_rates'`);
    console.log('Verified pm_settings:', JSON.stringify(settingsRes.rows));

  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
