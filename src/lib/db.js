import path from 'path';
import dotenv from 'dotenv';
import { Pool, types } from 'pg';
import { normalizePostgresUrl } from './pg-url.js';

// Parse PostgreSQL DATE (OID 1082) as exact YYYY-MM-DD string to prevent UTC date shift
types.setTypeParser(1082, (val) => val);

// Env load order (override: false): never clobber values Next already loaded from
// `.env.local`. Only fill gaps from `.env` then optional `src/.env`.
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: false, quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), 'src', '.env'), override: false, quiet: true });

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

/**
 * Neon pooler multiplexes clients; keep app-side max modest.
 * Override with DB_POOL_MAX when the Neon plan allows more.
 */
const poolMax = envInt('DB_POOL_MAX', isNeonPooler ? 4 : isNeonHost ? 6 : 10);
const connectionTimeoutMillis = envInt(
  'DB_CONNECTION_TIMEOUT_MS',
  isProductionBuild ? 10000 : 12000
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

/**
 * Hot-reload safe singleton.
 * Store the Pool AND its unbound native methods together so HMR never leaves
 * stale `bind()` pointers aimed at a disposed pool instance.
 */
const GLOBAL_POOL_KEY = '__MTBOSS_pg_singleton_v3__';

function createPoolSingleton() {
  const next = new Pool(poolConfig);
  next.on('error', (err) => {
    // Idle client errors must not crash the Next.js process.
    console.error('[db] idle client error:', err?.code || '', err?.message || err);
  });
  return {
    pool: next,
    nativeQuery: next.query.bind(next),
    nativeConnect: next.connect.bind(next),
    config: {
      max: poolMax,
      connectionTimeoutMillis,
      idleTimeoutMillis,
      neonPooler: isNeonPooler,
    },
  };
}

const globalForDb = globalThis;
if (!globalForDb[GLOBAL_POOL_KEY]) {
  globalForDb[GLOBAL_POOL_KEY] = createPoolSingleton();
}

const singleton = globalForDb[GLOBAL_POOL_KEY];
const pool = singleton.pool;
const nativeQuery = singleton.nativeQuery;
const nativeConnect = singleton.nativeConnect;

export function getPoolStats() {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
    max: singleton.config.max,
  };
}

function logPool(event, extra = {}) {
  if (!debugPool) return;
  console.log('[db-pool]', event, { ...getPoolStats(), ...extra });
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
    || /remaining connection slots/i.test(combined)
  );
}

function backoffMs(attempt, base = 250, cap = 2000) {
  const exp = Math.min(cap, base * (2 ** attempt));
  const jitter = Math.floor(Math.random() * 150);
  return exp + jitter;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Acquire a client with bounded retries for transient connect failures only.
 * Callers MUST release the client in finally.
 */
export async function connectWithRetry(options = {}) {
  const maxAttempts = Math.max(1, Number(options.maxAttempts) || (isProductionBuild ? 1 : 3));
  const started = Date.now();
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      logPool('connect:wait', { attempt, code: undefined });
      const client = await nativeConnect();
      logPool('connect:ok', { attempt, waitMs: Date.now() - started });
      return client;
    } catch (error) {
      lastError = error;
      logPool('connect:fail', {
        attempt,
        waitMs: Date.now() - started,
        code: error?.code || null,
        message: error?.message,
      });
      if (!isTransientConnectionError(error) || attempt >= maxAttempts) {
        throw error;
      }
      console.warn('[db] transient connect failure; retrying', {
        attempt,
        code: error?.code || null,
        message: error?.message,
      });
      await wait(backoffMs(attempt - 1));
    }
  }
  throw lastError;
}

/**
 * Direct query through the native pool (NO automatic retry).
 * Automatic query retry is unsafe: PostgreSQL may have already applied writes.
 */
export function queryRaw(text, values) {
  const started = Date.now();
  logPool('query:start');
  const pending = nativeQuery(text, values);
  return pending.then(
    (result) => {
      logPool('query:ok', { waitMs: Date.now() - started });
      return result;
    },
    (error) => {
      logPool('query:fail', {
        waitMs: Date.now() - started,
        code: error?.code || null,
        message: error?.message,
      });
      throw error;
    }
  );
}

/**
 * Idempotent READ helper only. Retries only when the failure is a transient
 * connection error (never for SQL / auth / constraint errors).
 * Do NOT use for INSERT/UPDATE/DELETE/DDL.
 */
export async function queryReadWithRetry(text, values, options = {}) {
  const maxAttempts = Math.max(1, Number(options.maxAttempts) || (isProductionBuild ? 1 : 3));
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await queryRaw(text, values);
    } catch (error) {
      lastError = error;
      if (!isTransientConnectionError(error) || attempt >= maxAttempts) {
        throw error;
      }
      console.warn('[db] transient read failure; retrying', {
        attempt,
        code: error?.code || null,
        message: error?.message,
      });
      await wait(backoffMs(attempt - 1));
    }
  }
  throw lastError;
}

/**
 * @deprecated Prefer queryRaw / pool.query for writes. Kept as an alias that
 * does NOT retry, so existing imports cannot duplicate side effects.
 */
export async function queryWithConnectionRetry(query, values) {
  return queryRaw(query, values);
}

/**
 * Borrow a client for a transaction / multi-statement unit of work.
 * Always releases, including on throw.
 */
export async function withClient(fn) {
  const client = await connectWithRetry();
  try {
    return await fn(client);
  } finally {
    try {
      client.release();
    } catch (releaseError) {
      console.error('[db] client release failed:', releaseError?.message || releaseError);
    }
  }
}

export async function checkPoolHealth() {
  try {
    await queryRaw('SELECT 1 AS ok');
    return true;
  } catch (err) {
    console.error('[db] pool health check failed:', err.message);
    return false;
  }
}

// Default export: native Pool. Callers use pool.query / pool.connect as usual.
// We intentionally do NOT monkey-patch pool.query with retries (duplicate writes risk)
// and do NOT replace pool.connect with a wrapper that can leave orphan TCP attempts
// unhandled after a timed-out waiter gives up.
export default pool;
