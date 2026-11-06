import { queryRaw } from '@/lib/db';

/**
 * Neon cold starts can be slow, but login must not hang forever.
 * Prefer a direct query (no nested retry wrapper) so timeouts are deterministic.
 */
export const AUTH_LOGIN_QUERY_MS = 25_000;

export async function authLoginQuery(text, params = [], timeoutMs = AUTH_LOGIN_QUERY_MS) {
  let timer;
  const queryPromise = queryRaw(text, params);
  queryPromise.catch(() => {});

  try {
    return await Promise.race([
      queryPromise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Query timeout')), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Best-effort lookups that must never fail a successful user login. */
export async function softAuthLoginQuery(text, params = [], timeoutMs = 5_000) {
  try {
    return await authLoginQuery(text, params, timeoutMs);
  } catch {
    return { rows: [] };
  }
}

/** Non-blocking — login should not wait on analytics timestamps. */
export function touchUserLastLogin(userId) {
  queryRaw('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId]).catch(() => {});
}

export function touchAgentLastLogin(agentId) {
  queryRaw('UPDATE agents SET last_login_at = NOW() WHERE id = $1', [agentId]).catch(() => {});
}
