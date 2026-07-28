import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import {
  LEGACY_FRANCHISE_PERMISSIONS,
  normalizeFranchisePermissions,
} from '@/lib/franchise-permissions';

const legacyPermissionsSql = JSON.stringify(LEGACY_FRANCHISE_PERMISSIONS).replace(/'/g, "''");

export async function ensureFranchiseAccessColumns() {
  await pool.query(`
    ALTER TABLE franchises
      ADD COLUMN IF NOT EXISTS password_hash TEXT,
      ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS approved_by_email TEXT,
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS login_enabled BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS permissions JSONB NOT NULL DEFAULT '${legacyPermissionsSql}'::jsonb
  `);

  // New applications start without feature access. The initial ADD COLUMN
  // default above preserves the capabilities of franchises created before
  // permissions existed.
  await pool.query(`
    ALTER TABLE franchises
      ALTER COLUMN permissions SET DEFAULT '{}'::jsonb
  `);
}

export async function getFranchiseAccess(req, permission = null) {
  const tokenUser = requireRole(req, 'franchise');
  if (!tokenUser) {
    return { allowed: false, status: 401, error: 'Franchise authentication required' };
  }

  await ensureFranchiseAccessColumns();
  const result = await pool.query(
    `SELECT id, name, email, phone, city, state, status, login_enabled, permissions
       FROM franchises
      WHERE id = $1
      LIMIT 1`,
    [tokenUser.id]
  );
  const franchise = result.rows[0];

  if (!franchise || franchise.status !== 'Approved' || !franchise.login_enabled) {
    return { allowed: false, status: 403, error: 'Franchise account is not active' };
  }

  const permissions = normalizeFranchisePermissions(franchise.permissions);
  if (permission && permissions[permission] !== true) {
    return {
      allowed: false,
      status: 403,
      error: `Permission denied: ${permission}`,
      permission,
    };
  }

  return {
    allowed: true,
    user: { ...tokenUser, city: franchise.city },
    franchise: { ...franchise, permissions },
    permissions,
  };
}

export function franchiseAccessResponse(access) {
  return NextResponse.json(
    {
      success: false,
      error: access.error || 'Franchise access denied',
      permission: access.permission || null,
    },
    { status: access.status || 403 }
  );
}
