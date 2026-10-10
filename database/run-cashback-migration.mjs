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
    const sqlPath = path.resolve('database/migrations/20261008_cashback_wallet_system.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying Cashback & Wallet System migration...');
    await pool.query(sql);
    console.log('✅ Cashback & Wallet migration applied successfully!');

    // Verify cashback_settings
    const settingsRes = await pool.query('SELECT * FROM cashback_settings');
    console.log('Verified cashback_settings:', settingsRes.rows[0]);

    // Verify tables created
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('cashback_settings', 'cashback_rules', 'wallets', 'wallet_transactions')
    `);
    console.log('Verified tables:', tablesRes.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
