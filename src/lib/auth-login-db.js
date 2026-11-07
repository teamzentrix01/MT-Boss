import { isTransientConnectionError, queryRaw, queryReadWithRetry } from '@/lib/db';

/**
 * Login reads go through the shared singleton pool.
 * Writes (last_login touch) are fire-and-forget and must never reject unhandled.
 */

export const AUTH_LOGIN_ATTEMPTS = 3;

export async function authLoginQuery(text, params = []) {
  return queryReadWithRetry(text, params, { maxAttempts: AUTH_LOGIN_ATTEMPTS });
}

export async function softAuthLoginQuery(text, params = []) {
  try {
    return await authLoginQuery(text, params);
  } catch {
    return { rows: [] };
  }
}

export function touchUserLastLogin(userId) {
  queryRaw('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId]).catch((error) => {
    if (!isTransientConnectionError(error)) {
      console.warn('[auth-login] last_login update failed:', error?.message);
    }
  });
}

export function touchAgentLastLogin(agentId) {
  queryRaw('UPDATE agents SET last_login_at = NOW() WHERE id = $1', [agentId]).catch((error) => {
    if (!isTransientConnectionError(error)) {
      console.warn('[auth-login] agent last_login update failed:', error?.message);
    }
  });
}
