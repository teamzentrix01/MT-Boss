import pool, { isTransientConnectionError } from '@/lib/db';

/**
 * Login uses the shared pool (singleton) with a small retry budget.
 * Avoids opening extra one-shot Clients that competed with dashboard traffic
 * for Neon pooler slots.
 */

export const AUTH_LOGIN_QUERY_MS = 20_000;
export const AUTH_LOGIN_ATTEMPTS = 3;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function withTimeout(promise, timeoutMs, label) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label || 'Query'} timeout`)), timeoutMs);
  });
  // Prevent unhandledRejection if the underlying query loses the race.
  promise.catch(() => {});
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function authLoginQuery(text, params = []) {
  let lastError;

  for (let attempt = 1; attempt <= AUTH_LOGIN_ATTEMPTS; attempt += 1) {
    try {
      return await withTimeout(pool.query(text, params), AUTH_LOGIN_QUERY_MS, 'Query');
    } catch (error) {
      lastError = error;
      const retryable =
        isTransientConnectionError(error)
        || String(error?.message || '').includes('timeout');
      if (!retryable || attempt >= AUTH_LOGIN_ATTEMPTS) break;
      console.warn('[auth-login] DB attempt failed; retrying', {
        attempt,
        message: error?.message,
      });
      await wait(800 * attempt);
    }
  }

  throw lastError || new Error('Query timeout');
}

export async function softAuthLoginQuery(text, params = []) {
  try {
    return await authLoginQuery(text, params);
  } catch {
    return { rows: [] };
  }
}

export function touchUserLastLogin(userId) {
  pool
    .query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId])
    .catch(() => {});
}

export function touchAgentLastLogin(agentId) {
  pool
    .query('UPDATE agents SET last_login_at = NOW() WHERE id = $1', [agentId])
    .catch(() => {});
}
