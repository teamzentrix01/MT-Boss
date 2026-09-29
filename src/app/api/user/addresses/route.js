import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard, handleApiError } from '@/lib/api-utils';
import { cleanText } from '@/lib/validation';
import { resolveManagedCity } from '@/lib/cities';

const ensureAddressSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_addresses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      label VARCHAR(60) NOT NULL,
      address_line TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      pincode VARCHAR(10),
      latitude NUMERIC(10, 7),
      longitude NUMERIC(10, 7),
      is_default BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query('CREATE INDEX IF NOT EXISTS user_addresses_user_idx ON user_addresses (user_id)');
});

const COLUMNS = 'id, label, address_line, city, pincode, latitude, longitude, is_default, created_at';

function coordinate(value, limit) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && Math.abs(parsed) <= limit ? parsed : undefined;
}

export async function GET(req) {
  const user = requireRole(req, 'user');
  if (!user) return unauthorized();

  try {
    await ensureAddressSchema();
    const result = await pool.query(
      `SELECT ${COLUMNS} FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC`,
      [user.id]
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req) {
  const user = requireRole(req, 'user');
  if (!user) return unauthorized();

  try {
    const body = await req.json().catch(() => ({}));
    const label = cleanText(body.label).slice(0, 60);
    const addressLine = cleanText(body.address_line);
    const pincode = cleanText(body.pincode).replace(/\D/g, '');
    const latitude = coordinate(body.latitude, 90);
    const longitude = coordinate(body.longitude, 180);

    if (!label || addressLine.length < 8) {
      return NextResponse.json({ success: false, error: 'Add a label and a full address.' }, { status: 400 });
    }
    if (pincode && !/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ success: false, error: 'Pincode must be 6 digits.' }, { status: 400 });
    }
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json({ success: false, error: 'Invalid location coordinates.' }, { status: 400 });
    }

    const city = await resolveManagedCity(body.city);
    if (!city) {
      return NextResponse.json({ success: false, error: 'Select a city we currently serve.' }, { status: 400 });
    }

    await ensureAddressSchema();
    const existing = await pool.query('SELECT COUNT(*)::int AS count FROM user_addresses WHERE user_id = $1', [user.id]);
    const makeDefault = body.is_default === true || existing.rows[0].count === 0;
    if (makeDefault) {
      await pool.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [user.id]);
    }

    const result = await pool.query(
      `INSERT INTO user_addresses (user_id, label, address_line, city, pincode, latitude, longitude, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING ${COLUMNS}`,
      [user.id, label, addressLine, city, pincode || null, latitude, longitude, makeDefault]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req) {
  const user = requireRole(req, 'user');
  if (!user) return unauthorized();

  try {
    const body = await req.json().catch(() => ({}));
    const id = Number(body.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Address id is required.' }, { status: 400 });
    }

    await ensureAddressSchema();
    const owned = await pool.query('SELECT id FROM user_addresses WHERE id = $1 AND user_id = $2', [id, user.id]);
    if (owned.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Address not found.' }, { status: 404 });
    }

    await pool.query('UPDATE user_addresses SET is_default = (id = $1), updated_at = NOW() WHERE user_id = $2', [id, user.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req) {
  const user = requireRole(req, 'user');
  if (!user) return unauthorized();

  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Address id is required.' }, { status: 400 });
    }

    await ensureAddressSchema();
    const deleted = await pool.query(
      'DELETE FROM user_addresses WHERE id = $1 AND user_id = $2 RETURNING is_default',
      [id, user.id]
    );
    if (deleted.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Address not found.' }, { status: 404 });
    }
    if (deleted.rows[0].is_default) {
      await pool.query(
        `UPDATE user_addresses SET is_default = TRUE
          WHERE id = (SELECT id FROM user_addresses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1)`,
        [user.id]
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
