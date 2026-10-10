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
    const sqlPath = path.resolve('database/migrations/20261008_agent_specializations.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying agent specializations migration...');
    await pool.query(sql);
    console.log('✅ Agent specializations migration applied successfully!');

    const colRes = await pool.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'agents' AND column_name = 'specializations'
    `);
    console.log('Verified column:', JSON.stringify(colRes.rows));

    const sampleRes = await pool.query(`
      SELECT id, name, email, has_project_management_access, specializations 
      FROM agents 
      LIMIT 5
    `);
    console.log('Sample agents:', JSON.stringify(sampleRes.rows, null, 2));

  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
