import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
const pool = new Pool({ connectionString });

async function addTxRef() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query('ALTER TABLE pm_party_payments ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR(255);');
    console.log('Added transaction_reference to pm_party_payments');
    
    await client.query('ALTER TABLE pm_vendor_payments ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR(255);');
    console.log('Added transaction_reference to pm_vendor_payments');
    
    await client.query('ALTER TABLE pm_labor_payments ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR(255);');
    console.log('Added transaction_reference to pm_labor_payments');
    
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

addTxRef();
