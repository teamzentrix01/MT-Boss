import { readFileSync } from 'fs';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

dotenv.config({ path: '.env', override: false });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, 'migrations', '20261030_mobile_otp_auth.sql'), 'utf8');

async function run() {
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('✅ Mobile OTP auth migration applied successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
