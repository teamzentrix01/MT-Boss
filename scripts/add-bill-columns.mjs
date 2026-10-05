import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Add to pm_material_received
    await client.query(`
      ALTER TABLE pm_material_received 
      ADD COLUMN IF NOT EXISTS bill_url text,
      ADD COLUMN IF NOT EXISTS bill_filename text;
    `);

    // Add to pm_material_adjustments
    await client.query(`
      ALTER TABLE pm_material_adjustments 
      ADD COLUMN IF NOT EXISTS bill_url text,
      ADD COLUMN IF NOT EXISTS bill_filename text;
    `);

    await client.query('COMMIT');
    console.log('Migration successful: Added bill_url and bill_filename to pm_material_received and pm_material_adjustments');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
