/**
 * Standalone Neon/pg connectivity check using the same URL normalizer as the app.
 *
 * Usage (from MT-Boss folder):
 *   node --use-system-ca scripts/db-check.js
 */
const path = require('path');
const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config({ path: path.join(__dirname, '..', '.env'), quiet: true });
dotenv.config({ path: path.join(__dirname, '..', 'src', '.env'), quiet: true });

function normalizePostgresUrl(url) {
  if (!url) return url;
  const parsed = new URL(url);
  parsed.searchParams.delete('channel_binding');
  parsed.searchParams.set('uselibpqcompat', 'true');
  parsed.searchParams.set('sslmode', 'require');
  return parsed.toString();
}

function maskHost(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//***:***@${u.hostname}:${u.port || '5432'}${u.pathname}`;
  } catch {
    return '(invalid DATABASE_URL)';
  }
}

async function main() {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const connectionString = normalizePostgresUrl(raw);
  const host = new URL(raw).hostname;
  const kind = /neon\.tech/i.test(host)
    ? (/-pooler\./i.test(host) ? 'Neon serverless (pooled / PgBouncer-style)' : 'Neon serverless (direct)')
    : 'Other Postgres';

  console.log('Host kind:', kind);
  console.log('Masked URL:', maskHost(connectionString));
  console.log('---');

  for (let i = 1; i <= 5; i += 1) {
    const started = Date.now();
    const client = new Client({
      connectionString,
      ...(process.env.DB_PASSWORD?.trim() ? { password: process.env.DB_PASSWORD } : {}),
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    try {
      await client.connect();
      const connectMs = Date.now() - started;
      const q0 = Date.now();
      const result = await client.query('SELECT 1 AS ok');
      const queryMs = Date.now() - q0;
      console.log(`#${i} connect=${connectMs}ms query=${queryMs}ms ok=${result.rows[0]?.ok}`);
    } catch (error) {
      console.error(`#${i} FAIL after ${Date.now() - started}ms:`, error.message);
    } finally {
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
