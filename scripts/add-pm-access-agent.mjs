import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Add to agents
    await client.query(`
      ALTER TABLE agents 
      ADD COLUMN IF NOT EXISTS has_project_management_access BOOLEAN DEFAULT false;
    `);

    await client.query('COMMIT');
    console.log('Migration successful: Added has_project_management_access to agents');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
