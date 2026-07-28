import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJwtSecret, setAuthCookie } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';
import { ensureFranchiseAccessColumns } from '@/lib/franchise-access';
import { normalizeFranchisePermissions } from '@/lib/franchise-permissions';

const ensureFranchiseColumns = createInitializationGuard(async () => {
  await ensureFranchiseAccessColumns();
});

export async function POST(req) {
  try {
    await ensureFranchiseColumns();
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id, name, email, phone, city, state, status, login_enabled, password_hash, permissions
       FROM franchises
       WHERE LOWER(email) = LOWER($1)
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );

    const franchise = result.rows[0];
    if (!franchise || !franchise.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, franchise.password_hash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (franchise.status !== 'Approved' || !franchise.login_enabled) {
      return NextResponse.json({
        error: 'This franchise account is not approved for login.',
        status: franchise.status,
      }, { status: 403 });
    }

    const token = jwt.sign(
      {
        id: franchise.id,
        email: franchise.email,
        name: franchise.name,
        city: franchise.city,
        role: 'franchise',
      },
      getJwtSecret(),
      { expiresIn: rememberMe ? '30d' : '7d' }
    );

    await pool.query('UPDATE franchises SET last_login_at = NOW() WHERE id = $1', [franchise.id]);

    const response = NextResponse.json({
      success: true,
      token,
      franchise: {
        id: franchise.id,
        name: franchise.name,
        email: franchise.email,
        phone: franchise.phone,
        city: franchise.city,
        state: franchise.state,
        status: franchise.status,
        permissions: normalizeFranchisePermissions(franchise.permissions),
        role: 'franchise',
      },
    });
    return setAuthCookie(response, 'franchise-auth-token', token, rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7);
  } catch (error) {
    console.error('Franchise login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
