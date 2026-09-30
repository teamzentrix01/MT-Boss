import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';

const ensureOffersTable = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shop_offers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(255),
      subcategory VARCHAR(255),
      brand VARCHAR(255),
      discount_type VARCHAR(50) NOT NULL DEFAULT 'percent',
      discount_value NUMERIC(12,2) NOT NULL,
      badge_text VARCHAR(100),
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      starts_at TIMESTAMP WITH TIME ZONE,
      ends_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
  await pool.query('ALTER TABLE shop_offers ADD COLUMN IF NOT EXISTS category VARCHAR(255)');
  await pool.query('ALTER TABLE shop_offers ADD COLUMN IF NOT EXISTS subcategory VARCHAR(255)');
  await pool.query('ALTER TABLE shop_offers ADD COLUMN IF NOT EXISTS brand VARCHAR(255)');
  await pool.query('ALTER TABLE shop_offers ADD COLUMN IF NOT EXISTS discount_type VARCHAR(50) DEFAULT \'percent\'');
  await pool.query('ALTER TABLE shop_offers ADD COLUMN IF NOT EXISTS discount_value NUMERIC(12,2)');
  await pool.query('ALTER TABLE shop_offers ADD COLUMN IF NOT EXISTS badge_text VARCHAR(100)');
  await pool.query('ALTER TABLE shop_offers ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0');
  await pool.query('ALTER TABLE shop_offers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE');
  await pool.query('ALTER TABLE shop_offers ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP WITH TIME ZONE');
  await pool.query('ALTER TABLE shop_offers ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE');
});

function serializeOffer(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category || '',
    subcategory: row.subcategory || '',
    brand: row.brand || '',
    discount_type: row.discount_type || 'percent',
    discount_value: Number(row.discount_value) || 0,
    badge_text: row.badge_text || '',
    sort_order: Number(row.sort_order) || 0,
    is_active: Boolean(row.is_active),
    starts_at: row.starts_at || null,
    ends_at: row.ends_at || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
  };
}

function validateOffer(body) {
  const name = String(body.name || '').trim();
  if (!name) throw new Error('Offer name is required');

  const discountType = body.discount_type === 'fixed' ? 'fixed' : 'percent';
  const discountValue = Number(body.discount_value);
  if (!Number.isFinite(discountValue) || discountValue <= 0) {
    throw new Error('Valid discount value is required');
  }
  if (discountType === 'percent' && discountValue > 100) {
    throw new Error('Percentage discount cannot exceed 100%');
  }

  const startsAt = body.starts_at ? new Date(body.starts_at) : null;
  const endsAt = body.ends_at ? new Date(body.ends_at) : null;
  if (startsAt && Number.isNaN(startsAt.getTime())) throw new Error('Invalid start date');
  if (endsAt && Number.isNaN(endsAt.getTime())) throw new Error('Invalid end date');
  if (startsAt && endsAt && endsAt < startsAt) throw new Error('End date cannot be before start date');

  return {
    name,
    category: String(body.category || '').trim() || null,
    subcategory: String(body.subcategory || '').trim() || null,
    brand: String(body.brand || '').trim() || null,
    discount_type: discountType,
    discount_value: discountValue,
    badge_text: String(body.badge_text || '').trim() || null,
    sort_order: Number.isInteger(Number(body.sort_order)) ? Number(body.sort_order) : 0,
    is_active: body.is_active !== false,
    starts_at: startsAt ? startsAt.toISOString() : null,
    ends_at: endsAt ? endsAt.toISOString() : null,
  };
}

export async function GET(req) {
  try {
    await ensureOffersTable();
    const url = new URL(req.url);
    const wantsAdmin = url.searchParams.get('admin') === 'true';

    if (wantsAdmin) {
      if (!requireRole(req, 'admin')) {
        return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
      }
      const result = await pool.query('SELECT * FROM shop_offers ORDER BY sort_order ASC, id DESC');
      return NextResponse.json({ success: true, data: result.rows.map(serializeOffer) });
    }

    const result = await pool.query(`
      SELECT * FROM shop_offers
      WHERE is_active = TRUE
        AND (starts_at IS NULL OR starts_at <= NOW())
        AND (ends_at IS NULL OR ends_at >= NOW())
      ORDER BY sort_order ASC, id DESC
    `);
    return NextResponse.json({
      success: true,
      data: result.rows.map(serializeOffer),
    }, {
      headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error('Error fetching shop offers:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not load offers' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!requireRole(req, 'admin')) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }
  try {
    await ensureOffersTable();
    const body = await req.json();
    const offer = validateOffer(body);

    const result = await pool.query(
      `INSERT INTO shop_offers (
        name, category, subcategory, brand, discount_type, discount_value,
        badge_text, sort_order, is_active, starts_at, ends_at, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *`,
      [
        offer.name,
        offer.category,
        offer.subcategory,
        offer.brand,
        offer.discount_type,
        offer.discount_value,
        offer.badge_text,
        offer.sort_order,
        offer.is_active,
        offer.starts_at,
        offer.ends_at,
      ]
    );

    return NextResponse.json({ success: true, data: serializeOffer(result.rows[0]) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not create offer' }, { status: 400 });
  }
}

export async function PUT(req) {
  if (!requireRole(req, 'admin')) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }
  try {
    await ensureOffersTable();
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid offer ID');

    const offer = validateOffer(body);
    const result = await pool.query(
      `UPDATE shop_offers SET
        name = $1,
        category = $2,
        subcategory = $3,
        brand = $4,
        discount_type = $5,
        discount_value = $6,
        badge_text = $7,
        sort_order = $8,
        is_active = $9,
        starts_at = $10,
        ends_at = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *`,
      [
        offer.name,
        offer.category,
        offer.subcategory,
        offer.brand,
        offer.discount_type,
        offer.discount_value,
        offer.badge_text,
        offer.sort_order,
        offer.is_active,
        offer.starts_at,
        offer.ends_at,
        id,
      ]
    );

    if (!result.rows[0]) throw new Error('Offer not found');
    return NextResponse.json({ success: true, data: serializeOffer(result.rows[0]) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not update offer' }, { status: 400 });
  }
}

export async function DELETE(req) {
  if (!requireRole(req, 'admin')) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }
  try {
    await ensureOffersTable();
    const url = new URL(req.url);
    const id = Number(url.searchParams.get('id'));
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid offer ID');

    await pool.query('DELETE FROM shop_offers WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not delete offer' }, { status: 400 });
  }
}
