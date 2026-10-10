import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard, handleApiError } from '@/lib/api-utils';
import { isValidIndianMobile, isValidPersonName, normalizePhone } from '@/lib/validation';

const ensureUserProfileColumns = createInitializationGuard(async () => {
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)');
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()');
  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT');
});

const PROFILE_COLUMNS = 'id, email, name, phone, avatar_url, created_at';

export async function GET(req) {
  const decoded = requireRole(req, 'user');
  if (!decoded) return unauthorized();

  try {
    await ensureUserProfileColumns();
    const result = await pool.query(`SELECT ${PROFILE_COLUMNS} FROM users WHERE id = $1`, [decoded.id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { ...result.rows[0], role: 'user' } });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req) {
  const decoded = requireRole(req, 'user');
  if (!decoded) return unauthorized();

  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name || '').trim();
    const phone = normalizePhone(body.phone);

    if (!isValidPersonName(name)) {
      return NextResponse.json({ success: false, error: 'Enter a valid name (letters only).' }, { status: 400 });
    }
    if (phone && !isValidIndianMobile(phone)) {
      return NextResponse.json({ success: false, error: 'Enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    await ensureUserProfileColumns();
    const result = await pool.query(
      `UPDATE users
          SET name = $1, phone = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING ${PROFILE_COLUMNS}`,
      [name, phone || null, decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { ...result.rows[0], role: 'user' } });
  } catch (error) {
    return handleApiError(error);
  }
}
