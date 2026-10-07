import dotenv from 'dotenv';
import { Pool } from 'pg';

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

// Suppress node pg/pg-connection-string v3 security warning:
// explicitly normalize sslmode=require|prefer|verify-ca to sslmode=verify-full
const cleanDatabaseUrl = databaseUrl
  ? databaseUrl.replace(/sslmode=(?:require|prefer|verify-ca)(?=&|$)/gi, 'sslmode=verify-full')
  : databaseUrl;

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
      // A Neon compute can need time to resume after scaling to zero. Keep
      // this above the normal cold-start window rather than failing at 15s.
      connectionTimeoutMillis: 30000,
      query_timeout: 30000,
      statement_timeout: 30000,
    }
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER,
      password: databasePassword,
      database: process.env.DB_NAME,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000,
      query_timeout: 30000,
      statement_timeout: 30000,
    };

const pool = new Pool(poolConfig);

const transientConnectionError = (error) => {
  const message = String(error?.message || '');
  return (
    /connection terminated due to connection timeout/i.test(message)
    || /connection.*timed?\s*out/i.test(message)
    || ['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'].includes(error?.code)
  );
};

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// A just-resumed Neon compute can reject the first TCP connection while it is
// becoming available. Retry that request once; do not retry SQL failures.
export async function queryWithConnectionRetry(query, values) {
  try {
    return await pool.query(query, values);
  } catch (error) {
    if (!transientConnectionError(error)) throw error;

    console.warn('Transient database connection failure; retrying once.', {
      code: error.code,
      message: error.message,
    });
    await wait(500);
    return pool.query(query, values);
  }
}

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

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
