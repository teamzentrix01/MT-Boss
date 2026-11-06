import dotenv from 'dotenv';
import { Pool, types } from 'pg';
import { normalizePostgresUrl } from './pg-url.js';

// Parse PostgreSQL DATE (OID 1082) as exact YYYY-MM-DD string to prevent UTC date shift
types.setTypeParser(1082, (val) => val);

dotenv.config({ path: '.env', override: false, quiet: true });
dotenv.config({ path: 'src/.env', override: false, quiet: true });

const databaseUrl = process.env.DATABASE_URL?.trim();
const databasePassword = process.env.DB_PASSWORD;
let databaseUrlHasPassword = false;

if (databaseUrl) {
  try {
    databaseUrlHasPassword = new URL(databaseUrl).password.length > 0;
  } catch {
    throw new Error('Database is not configured: DATABASE_URL must be a valid PostgreSQL connection URL.');
  }
}

if (
  (!databaseUrl || !databaseUrlHasPassword)
  && (typeof databasePassword !== 'string' || !databasePassword.trim())
) {
  throw new Error(
    'Database is not configured: set a password in DATABASE_URL or set DB_PASSWORD alongside the DB connection settings.'
  );
}

const cleanDatabaseUrl = normalizePostgresUrl(databaseUrl);
const isNeonHost = /neon\.tech/i.test(cleanDatabaseUrl || process.env.DB_HOST || '');
const isNeonPooler = /-pooler\./i.test(cleanDatabaseUrl || '');
const isProductionBuild = process.env.NEXT_PHASE === 'phase-production-build';
const debugPool = process.env.DEBUG_DB_POOL === '1' || process.env.DEBUG_DB_POOL === 'true';

function envInt(name, fallback) {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;
  const n = Number.parseInt(String(raw), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// Neon pooler plans are connection-limited; keep max modest unless overridden.
const poolMax = envInt('DB_POOL_MAX', isNeonPooler ? 5 : isNeonHost ? 8 : 10);
const connectionTimeoutMillis = envInt(
  'DB_CONNECTION_TIMEOUT_MS',
  isProductionBuild ? 10000 : 15000
);
const idleTimeoutMillis = envInt('DB_IDLE_TIMEOUT_MS', 30000);

const poolConfig = cleanDatabaseUrl
  ? {
      connectionString: cleanDatabaseUrl,
      ...(databasePassword?.trim() ? { password: databasePassword } : {}),
      ssl: { rejectUnauthorized: false },
      max: poolMax,
      idleTimeoutMillis,
      connectionTimeoutMillis,
      allowExitOnIdle: true,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    }
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER,
      password: databasePassword,
      database: process.env.DB_NAME,
      max: poolMax,
      idleTimeoutMillis,
      connectionTimeoutMillis,
      allowExitOnIdle: true,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    };

const globalForDb = globalThis;

function createPool() {
  const next = new Pool(poolConfig);
  next.on('error', (err) => {
    // Idle client errors must not crash the Next.js process.
    console.error('[db] idle client error:', err?.message || err);
  });
  return next;
}

const pool = globalForDb.__MTBOSS_pg_pool__ || createPool();
if (!globalForDb.__MTBOSS_pg_pool__) {
  globalForDb.__MTBOSS_pg_pool__ = pool;
}

if (!globalForDb.__MTBOSS_pg_run_query__) {
  globalForDb.__MTBOSS_pg_run_query__ = pool.query.bind(pool);
  globalForDb.__MTBOSS_pg_run_connect__ = pool.connect.bind(pool);
}

const runQuery = globalForDb.__MTBOSS_pg_run_query__;
const runConnect = globalForDb.__MTBOSS_pg_run_connect__;

export function getPoolStats() {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
    max: poolMax,
  };
}

function logPool(event, extra = {}) {
  if (!debugPool) return;
  const stats = getPoolStats();
  console.log('[db-pool]', event, { ...stats, ...extra });
}

/** Unpatched pg query — for callers that manage their own timeout/retry. */
export function queryRaw(text, values) {
  return runQuery(text, values);
}

export function isTransientConnectionError(error) {
  if (!error) return false;

  const codes = new Set(
    [error?.code, error?.cause?.code]
      .concat(Array.isArray(error?.errors) ? error.errors.map((entry) => entry?.code) : [])
      .filter(Boolean)
  );
  if (['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED', 'EHOSTUNREACH', 'ENOTFOUND', '57P01', '53300'].some((code) => codes.has(code))) {
    return true;
  }

  const message = String(error?.message || error?.cause?.message || '').toLowerCase();
  const nestedMessages = Array.isArray(error?.errors)
    ? error.errors.map((entry) => String(entry?.message || '').toLowerCase()).join(' ')
    : '';

  const combined = `${message} ${nestedMessages}`;
  return (
    /timeout exceeded when trying to connect/i.test(combined)
    || /connection terminated due to connection timeout/i.test(combined)
    || /connection.*timed?\s*out/i.test(combined)
    || /connect etimedout/i.test(combined)
    || /econnrefused/i.test(combined)
    || /enotfound/i.test(combined)
    || /too many connections/i.test(combined)
  );
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function connectWithRetry() {
  const retryDelaysMs = isProductionBuild ? [] : [400, 1200];
  const started = Date.now();
  let lastError;

  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    try {
      logPool('connect:wait', { attempt: attempt + 1 });
      const client = await runConnect();
      logPool('connect:ok', { attempt: attempt + 1, waitMs: Date.now() - started });
      return client;
    } catch (error) {
      lastError = error;
      logPool('connect:fail', {
        attempt: attempt + 1,
        waitMs: Date.now() - started,
        message: error?.message,
      });
      if (!isTransientConnectionError(error) || attempt >= retryDelaysMs.length) {
        throw error;
      }
      console.warn('[db] transient connect failure; retrying', {
        attempt: attempt + 1,
        message: error?.message,
      });
      await wait(retryDelaysMs[attempt]);
    }
  }
  throw lastError;
}

export async function queryWithConnectionRetry(query, values) {
  const retryDelaysMs = isProductionBuild ? [] : [400, 1200];
  const started = Date.now();
  let lastError;

  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    try {
      logPool('query:start', { attempt: attempt + 1 });
      const result = await runQuery(query, values);
      logPool('query:ok', { attempt: attempt + 1, waitMs: Date.now() - started });
      return result;
    } catch (error) {
      lastError = error;
      logPool('query:fail', {
        attempt: attempt + 1,
        waitMs: Date.now() - started,
        message: error?.message,
      });
      if (!isTransientConnectionError(error) || attempt >= retryDelaysMs.length) {
        throw error;
      }
      console.warn('[db] transient query failure; retrying', {
        attempt: attempt + 1,
        message: error?.message,
      });
      await wait(retryDelaysMs[attempt]);
    }
  }
  throw lastError;
}

if (!globalForDb.__MTBOSS_pg_query_patched__) {
  pool.query = queryWithConnectionRetry;
  pool.connect = connectWithRetry;
  globalForDb.__MTBOSS_pg_query_patched__ = true;
}

export async function checkPoolHealth() {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    return true;
  } catch (err) {
    console.error('[db] pool health check failed:', err.message);
    return false;
  } finally {
    if (client) {
      try {
        client.release();
      } catch {
        /* ignore */
      }
    }
  }
}

export default pool;
