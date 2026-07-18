import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { requireRole } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';

const ensureFranchiseColumns = createInitializationGuard(async () => {
  await pool.query(`
    ALTER TABLE franchises
      ADD COLUMN IF NOT EXISTS password_hash TEXT,
      ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS login_enabled BOOLEAN DEFAULT FALSE
  `);
});

export async function PATCH(req) {
  try {
    const franchiseUser = requireRole(req, 'franchise');
    if (!franchiseUser) {
      return NextResponse.json({ success: false, error: 'Franchise access required' }, { status: 403 });
    }

    await ensureFranchiseColumns();
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ success: false, error: 'All password fields are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'New password and confirm password do not match' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id, password_hash, status, login_enabled
       FROM franchises
       WHERE id = $1
       LIMIT 1`,
      [franchiseUser.id]
    );

    const franchise = result.rows[0];
    if (!franchise || franchise.status !== 'Approved' || !franchise.login_enabled) {
      return NextResponse.json({ success: false, error: 'Franchise account is not active' }, { status: 403 });
    }

    const currentOk = await bcrypt.compare(currentPassword, franchise.password_hash || '');
    if (!currentOk) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 401 });
    }

    const samePassword = await bcrypt.compare(newPassword, franchise.password_hash || '');
    if (samePassword) {
      return NextResponse.json({ success: false, error: 'New password must be different from current password' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE franchises SET password_hash = $1 WHERE id = $2',
      [passwordHash, franchiseUser.id]
    );

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Franchise password change error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
