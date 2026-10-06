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
    const sqlPath = path.resolve('database/migrations/20261006_shop_vendor_commissions.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying Shop Vendor Commissions migration...');
    await pool.query(sql);
    console.log('✅ Shop Vendor Commissions migration applied successfully!');

    // Verify pm_settings contains shop_vendor_commission_percent
    const settingRes = await pool.query("SELECT key, value FROM pm_settings WHERE key = 'shop_vendor_commission_percent'");
    console.log('Verified setting:', settingRes.rows[0]);

    // Verify shop_vendor_commissions table columns
    const colsRes = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'shop_vendor_commissions'
      ORDER BY ordinal_position
    `);
    console.log('Verified shop_vendor_commissions columns:');
    console.log(colsRes.rows.map(r => `  - ${r.column_name}: ${r.data_type} (nullable: ${r.is_nullable})`).join('\n'));

  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
