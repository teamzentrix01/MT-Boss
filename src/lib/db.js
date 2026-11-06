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

// `pg` emits the opaque SCRAM "password must be a string" error when the
// password variable is absent. Validate it here so deployments fail with the
// actionable configuration error instead of making every database route look
// broken.
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
const isProductionBuild = process.env.NEXT_PHASE === 'phase-production-build';
const connectionTimeoutMillis = isProductionBuild
  ? 8000
  : (isNeonHost ? 60000 : 30000);

const poolConfig = cleanDatabaseUrl
  ? {
      connectionString: cleanDatabaseUrl,
      // Permit deployment systems to keep the password in a separate secret
      // even when the host/database details are supplied through DATABASE_URL.
      ...(databasePassword?.trim() ? { password: databasePassword } : {}),
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      // Neon can take 20–40s to resume after scale-to-zero; parallel route boot
      // must not fail at 30s while the compute is still waking up.
      connectionTimeoutMillis,
      query_timeout: connectionTimeoutMillis,
      statement_timeout: connectionTimeoutMillis,
    }
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER,
      password: databasePassword,
      database: process.env.DB_NAME,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis,
      query_timeout: connectionTimeoutMillis,
      statement_timeout: connectionTimeoutMillis,
    };

const globalForDb = globalThis;
const pool = globalForDb.__MTBOSS_pg_pool__ || new Pool(poolConfig);
if (!globalForDb.__MTBOSS_pg_pool__) {
  globalForDb.__MTBOSS_pg_pool__ = pool;
}
if (!globalForDb.__MTBOSS_pg_run_query__) {
  globalForDb.__MTBOSS_pg_run_query__ = pool.query.bind(pool);
  globalForDb.__MTBOSS_pg_run_connect__ = pool.connect.bind(pool);
}

const runQuery = globalForDb.__MTBOSS_pg_run_query__;
const runConnect = globalForDb.__MTBOSS_pg_run_connect__;

/** Unpatched pg query — use for auth/login where outer timeouts must not stack with retries. */
export function queryRaw(text, values) {
  return runQuery(text, values);
}

const transientConnectionError = (error) => {
  if (!error) return false;

  const codes = new Set(
    [error?.code, error?.cause?.code]
      .concat(Array.isArray(error?.errors) ? error.errors.map((entry) => entry?.code) : [])
      .filter(Boolean)
  );
  if (['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED', 'EHOSTUNREACH', 'ENOTFOUND'].some((code) => codes.has(code))) {
    return true;
  }

  const message = String(error?.message || error?.cause?.message || '').toLowerCase();
  const nestedMessages = Array.isArray(error?.errors)
    ? error.errors.map((entry) => String(entry?.message || '').toLowerCase()).join(' ')
    : '';

  const combined = `${message} ${nestedMessages}`;
  return (
    /connection terminated due to connection timeout/i.test(combined)
    || /connection.*timed?\s*out/i.test(combined)
    || /connect etimedout/i.test(combined)
    || /econnrefused/i.test(combined)
    || /enotfound/i.test(combined)
  );
};

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function startDbWarmup() {
  if (!globalForDb.__MTBOSS_db_warmup__) {
    globalForDb.__MTBOSS_db_warmup__ = runConnect()
      .then((client) => {
        client.release();
        return true;
      })
      .catch((error) => {
        globalForDb.__MTBOSS_db_warmup__ = null;
        console.warn('Database warmup failed; routes will retry on demand.', {
          code: error?.code,
          message: error?.message,
        });
        return false;
      });
  }
  return globalForDb.__MTBOSS_db_warmup__;
}

// Do not eagerly open Neon connections on module load — parallel warmups during
// `next dev` compile storms exhaust the pool and break login with connect timeouts.
// Routes warm the pool on first real query instead.

async function connectWithRetry() {
  if (isProductionBuild) {
    return runConnect();
  }

  const retryDelaysMs = [500, 1500, 3000];

  let lastError;
  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    try {
      return await runConnect();
    } catch (error) {
      lastError = error;
      if (!transientConnectionError(error) || attempt >= retryDelaysMs.length) throw error;
      console.warn('Transient database connect failure; retrying.', {
        attempt: attempt + 1,
        code: error?.code,
        message: error?.message,
      });
      globalForDb.__MTBOSS_db_warmup__ = null;
      await wait(retryDelaysMs[attempt]);
    }
  }
  throw lastError;
}

// A just-resumed Neon compute can reject the first TCP connection while it is
// becoming available. Retry a few times; do not retry SQL failures.
export async function queryWithConnectionRetry(query, values) {
  if (isProductionBuild) {
    return runQuery(query, values);
  }

  const retryDelaysMs = [500, 1500, 3000];

  let lastError;
  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    try {
      return await runQuery(query, values);
    } catch (error) {
      lastError = error;
      if (!transientConnectionError(error) || attempt >= retryDelaysMs.length) throw error;

      console.warn('Transient database connection failure; retrying.', {
        attempt: attempt + 1,
        code: error?.code,
        message: error?.message,
      });
      // Clear a failed warmup so the next attempt opens a fresh connection.
      globalForDb.__MTBOSS_db_warmup__ = null;
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

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// pool.on('connect', () => {
//   console.log('Connected to PostgreSQL database');
// });

// Health check function
export async function checkPoolHealth() {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (err) {
    console.error('Pool health check failed:', err.message);
    return false;
  }
}

export default pool;
