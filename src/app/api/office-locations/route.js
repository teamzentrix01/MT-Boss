import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { COMPANY_CONTACT } from '../../lib/company';

const DEFAULT_OFFICES = [
  'Moradabad',
  'Bareilly',
  'Meerut',
  'Noida',
  'Delhi',
  'Gurgaon',
  'Haldwani',
  'Dehradun',
].map((city, index) => ({
  city,
  address: `MTBOSS Office, ${city}, India`,
  phone: COMPANY_CONTACT.phone,
  email: `${city.toLowerCase()}@mtboss.com`,
  hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
  map_url: `https://www.google.com/maps?q=${encodeURIComponent(`${city}, India`)}&output=embed`,
  sort_order: index,
}));

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS office_locations (
      id         SERIAL PRIMARY KEY,
      city       VARCHAR(150) NOT NULL UNIQUE,
      address    TEXT NOT NULL,
      phone      VARCHAR(80),
      email      VARCHAR(255),
      hours      VARCHAR(255),
      map_url    TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active  BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const count = await pool.query('SELECT COUNT(*)::int AS total FROM office_locations');
  if (count.rows[0]?.total > 0) return;

  for (const office of DEFAULT_OFFICES) {
    await pool.query(
      `INSERT INTO office_locations (city, address, phone, email, hours, map_url, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,true)
       ON CONFLICT (city) DO NOTHING`,
      [office.city, office.address, office.phone, office.email, office.hours, office.map_url, office.sort_order]
    );
  }
}

function hasToken(req) {
  return Boolean(requireRole(req, 'admin'));
}

export async function GET(req) {
  try {
    await ensureTable();

    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get('all') === '1';
    if (includeAll && !hasToken(req)) {
      return unauthorized();
    }

    const result = await pool.query(
      `SELECT id, city, address, phone, email, hours, map_url, sort_order, is_active, created_at, updated_at
       FROM office_locations
       ${includeAll ? '' : 'WHERE is_active = true'}
       ORDER BY sort_order ASC, city ASC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET office-locations error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!hasToken(req)) return unauthorized();

    const { city, address, phone, email, hours, map_url, sort_order, is_active } = await req.json();
    if (!city?.trim() || !address?.trim()) {
      return NextResponse.json({ success: false, error: 'City and address are required' }, { status: 400 });
    }

    await ensureTable();
    const result = await pool.query(
      `INSERT INTO office_locations (city, address, phone, email, hours, map_url, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        city.trim(),
        address.trim(),
        phone || null,
        email || null,
        hours || null,
        map_url || null,
        sort_order ?? 0,
        is_active ?? true,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST office-locations error:', error);
    const isDuplicate = error.code === '23505';
    return NextResponse.json(
      { success: false, error: isDuplicate ? 'That city already has an office record' : 'Server error' },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    if (!hasToken(req)) return unauthorized();

    const { id, city, address, phone, email, hours, map_url, sort_order, is_active } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    if (!city?.trim() || !address?.trim()) {
      return NextResponse.json({ success: false, error: 'City and address are required' }, { status: 400 });
    }

    await ensureTable();
    const result = await pool.query(
      `UPDATE office_locations
       SET city=$1, address=$2, phone=$3, email=$4, hours=$5, map_url=$6,
           sort_order=$7, is_active=$8, updated_at=NOW()
       WHERE id=$9
       RETURNING *`,
      [
        city.trim(),
        address.trim(),
        phone || null,
        email || null,
        hours || null,
        map_url || null,
        sort_order ?? 0,
        is_active ?? true,
        id,
      ]
    );

    if (!result.rows.length) {
      return NextResponse.json({ success: false, error: 'Office not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PATCH office-locations error:', error);
    const isDuplicate = error.code === '23505';
    return NextResponse.json(
      { success: false, error: isDuplicate ? 'That city already has an office record' : 'Server error' },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    if (!hasToken(req)) return unauthorized();

    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    await ensureTable();
    await pool.query('DELETE FROM office_locations WHERE id=$1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE office-locations error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
