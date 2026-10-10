import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';
import { requireRole } from '@/lib/auth';

export const BLOCKED_ACCOUNT_MESSAGE = 'Your account has been suspended. Contact support for assistance.';

export const ensureUserModerationSchema = createInitializationGuard(async () => {
  await pool.query(`ALTER TABLE users
    ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
    ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS delivery_city VARCHAR(120)`);
  await pool.query(`CREATE TABLE IF NOT EXISTS user_moderation_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL CHECK (action IN ('blocked', 'unblocked')),
    reason TEXT,
    admin_id INTEGER,
    admin_name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query('CREATE INDEX IF NOT EXISTS user_moderation_logs_user_created_idx ON user_moderation_logs (user_id, created_at DESC)');
});

// Re-checks the database on protected customer actions, so a block invalidates an
// already-issued JWT at the next request without changing normal user sessions.
export async function requireActiveUser(req) {
  const tokenUser = requireRole(req, 'user') || requireRole(req, 'admin');
  if (!tokenUser || tokenUser.id === undefined || tokenUser.id === null) {
    return { user: null, blocked: false };
  }
  await ensureUserModerationSchema();

  // If token is from admin (e.g. root admin id: 0)
  if (tokenUser.role === 'admin' && Number(tokenUser.id) === 0) {
    return { user: { ...tokenUser, name: tokenUser.name || 'Admin' }, blocked: false };
  }

  const result = await pool.query(
    'SELECT id, email, name, is_blocked FROM users WHERE id = $1',
    [tokenUser.id]
  );
  const user = result.rows[0];
  if (!user) {
    // If user is admin with non-zero id not yet in users table
    if (tokenUser.role === 'admin') {
      return { user: { ...tokenUser, name: tokenUser.name || 'Admin' }, blocked: false };
    }
    return { user: null, blocked: false };
  }
  if (user.is_blocked) return { user: null, blocked: true };
  return { user: { ...tokenUser, name: user.name }, blocked: false };
}
