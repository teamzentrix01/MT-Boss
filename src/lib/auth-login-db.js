import { Client } from 'pg';
import { normalizePostgresUrl } from './pg-url.js';

/**
 * Login uses a dedicated one-shot Client (not the shared pool).
 * Timed-out homepage/API queries often leave the shared pool exhausted in
 * `next dev`, which made real DB-user sign-in look "unreachable".
 */

export const AUTH_LOGIN_QUERY_MS = 20_000;
export const AUTH_LOGIN_ATTEMPTS = 3;

function buildLoginClient() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const databasePassword = process.env.DB_PASSWORD;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  return new Client({
    connectionString: normalizePostgresUrl(databaseUrl),
    ...(databasePassword?.trim() ? { password: databasePassword } : {}),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: AUTH_LOGIN_QUERY_MS,
    query_timeout: AUTH_LOGIN_QUERY_MS,
  });
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryable(error) {
  const message = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '');
  return (
    code === 'ETIMEDOUT'
    || code === 'ECONNRESET'
    || code === 'ECONNREFUSED'
    || code === 'ENOTFOUND'
    || code === '57P01'
    || message.includes('timeout')
    || message.includes('terminat')
    || message.includes('connect')
    || message.includes('does not exist')
  );
}

/**
 * Run a login SQL statement on a fresh connection with retries for Neon wake-up.
 */
export async function authLoginQuery(text, params = []) {
  let lastError;

  for (let attempt = 1; attempt <= AUTH_LOGIN_ATTEMPTS; attempt += 1) {
    const client = buildLoginClient();
    try {
      await client.connect();
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt >= AUTH_LOGIN_ATTEMPTS) break;
      console.warn('Auth login DB attempt failed; retrying.', {
        attempt,
        code: error?.code,
        message: error?.message,
      });
      await wait(1000 * attempt);
    } finally {
      try {
        await client.end();
      } catch {
        /* ignore close errors */
      }
    }
  }

  throw lastError || new Error('Query timeout');
}

/** Best-effort lookups that must never fail a successful user login. */
export async function softAuthLoginQuery(text, params = []) {
  try {
    return await authLoginQuery(text, params);
  } catch {
    return { rows: [] };
  }
}

/** Non-blocking last-login touch using a short-lived client. */
export function touchUserLastLogin(userId) {
  const client = buildLoginClient();
  client
    .connect()
    .then(() => client.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId]))
    .catch(() => {})
    .finally(() => client.end().catch(() => {}));
}

export function touchAgentLastLogin(agentId) {
  const client = buildLoginClient();
  client
    .connect()
    .then(() => client.query('UPDATE agents SET last_login_at = NOW() WHERE id = $1', [agentId]))
    .catch(() => {})
    .finally(() => client.end().catch(() => {}));
}
