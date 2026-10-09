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
    const sqlPath = path.resolve('database/migrations/20261008_wallet_redemption_system.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying Wallet Redemption migration...');
    await pool.query(sql);
    console.log('✅ Wallet Redemption migration applied successfully!');

    const settingsRes = await pool.query('SELECT redeem_enabled, max_redeem_percent_of_order, min_order_for_redeem, min_redeem_amount, allow_redeem_with_coupon, cashback_on_wallet_paid_amount FROM cashback_settings WHERE id = 1');
    console.log('Verified cashback_settings redemption cols:', settingsRes.rows[0]);

    const txRes = await pool.query('SELECT id, type, status, amount, remaining_amount FROM wallet_transactions LIMIT 5');
    console.log('Verified wallet_transactions remaining_amount:', txRes.rows);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
