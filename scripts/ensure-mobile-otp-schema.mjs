import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config({ path: '.env.local', override: false });
dotenv.config({ path: '.env', override: false });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.mobile_users (
      id SERIAL PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL UNIQUE,
      name VARCHAR(255),
      role VARCHAR(20) NOT NULL DEFAULT 'vendor' CHECK (role IN ('agent','vendor','supplier')),
      status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','blocked')),
      refresh_token_hash TEXT,
      entity_id INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE public.mobile_users ADD COLUMN IF NOT EXISTS entity_id INTEGER`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_mobile_users_entity ON public.mobile_users(role, entity_id)`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.mobile_otps (
      id SERIAL PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL,
      otp_hash TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      used BOOLEAN NOT NULL DEFAULT FALSE,
      valid_till TIMESTAMPTZ NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.mobile_otp_rate_limits (
      id SERIAL PRIMARY KEY,
      mobile VARCHAR(15) NOT NULL,
      requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  console.log('mobile_otp_schema_ok');
} catch (error) {
  console.error('mobile_otp_schema_failed', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
