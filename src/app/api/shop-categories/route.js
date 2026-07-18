import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard, handleApiError, isDatabaseConnectionError } from '@/lib/api-utils';
import { fallbackResponse, fallbackShopCategories } from '@/lib/public-fallbacks';

// No `ready` flag — all DDL statements are idempotent (IF NOT EXISTS).
// This makes the route resilient to dev hot-reloads and out-of-band DB resets.
const ensureTable = createInitializationGuard(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS shop_categories (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(200) NOT NULL,
        image       TEXT,
        emoji       VARCHAR(20)  DEFAULT '🛒',
        emoji_image TEXT,
        label       VARCHAR(100) DEFAULT '',
        label_color VARCHAR(50)  DEFAULT 'yellow',
        price_range VARCHAR(100) DEFAULT '',
        unit        VARCHAR(100) DEFAULT '',
        sort_order  INTEGER      DEFAULT 0,
        is_active   BOOLEAN      DEFAULT TRUE,
        created_at  TIMESTAMP    DEFAULT NOW(),
        updated_at  TIMESTAMP    DEFAULT NOW()
      )
    `);
    // Column migrations — idempotent
    await pool.query(`ALTER TABLE shop_categories ADD COLUMN IF NOT EXISTS types         JSONB DEFAULT '[]'`);
    await pool.query(`ALTER TABLE shop_categories ADD COLUMN IF NOT EXISTS subcategories JSONB DEFAULT '[]'`);
    await pool.query(`ALTER TABLE shop_categories ADD COLUMN IF NOT EXISTS city_prices   JSONB DEFAULT '{}'`);
    await pool.query(`ALTER TABLE shop_categories ADD COLUMN IF NOT EXISTS emoji_image   TEXT`);
  } catch (error) {
    console.error('ensureTable error:', error.message);
    throw error;
  }
});

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';
    if (isAdmin && !requireRole(req, 'admin')) return unauthorized();

    const result = isAdmin
      ? await pool.query(`SELECT * FROM shop_categories ORDER BY sort_order ASC, id ASC`)
      : await pool.query(`SELECT * FROM shop_categories WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC`);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET shop-categories error:', error.message);
    if (isDatabaseConnectionError(error)) {
      const { searchParams } = new URL(req.url);
      if (searchParams.get('admin') === 'true') {
        return handleApiError(error);
      }
      return NextResponse.json(fallbackResponse(fallbackShopCategories));
    }
    return handleApiError(error);
  }
}

// ── POST (create) ─────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    await ensureTable();
    if (!requireRole(req, 'admin')) return unauthorized();

    const { name, image, emoji, emoji_image, label, label_color, price_range, unit, types, subcategories, city_prices } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const { rows: [{ max }] } = await pool.query(`SELECT COALESCE(MAX(sort_order),0) AS max FROM shop_categories`);

    const result = await pool.query(
      `INSERT INTO shop_categories
         (name, image, emoji, emoji_image, label, label_color, price_range, unit, sort_order,
          is_active, types, subcategories, city_prices, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,TRUE,$10::jsonb,$11::jsonb,$12::jsonb,NOW(),NOW())
       RETURNING *`,
      [
        name, image || null, emoji || '🛒', emoji_image || null, label || '', label_color || 'yellow',
        price_range || '', unit || '', parseInt(max) + 1,
        JSON.stringify(Array.isArray(types) ? types : []),
        JSON.stringify(Array.isArray(subcategories) ? subcategories : []),
        JSON.stringify(city_prices && typeof city_prices === 'object' ? city_prices : {}),
      ]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (e) {
    console.error('POST shop-categories error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── PUT (update single) ───────────────────────────────────────────────────────
export async function PUT(req) {
  try {
    await ensureTable();
    if (!requireRole(req, 'admin')) return unauthorized();

    const {
      id, name, image, emoji, emoji_image, label, label_color,
      price_range, unit, is_active, types, subcategories, city_prices,
    } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const result = await pool.query(
      `UPDATE shop_categories
       SET name=$1, image=$2, emoji=$3, emoji_image=$4, label=$5, label_color=$6,
           price_range=$7, unit=$8, is_active=$9,
           types=$10::jsonb, subcategories=$11::jsonb,
           city_prices=$12::jsonb, updated_at=NOW()
       WHERE id=$13 RETURNING *`,
      [
        name, image || null, emoji || '🛒', emoji_image || null, label || '', label_color || 'yellow',
        price_range || '', unit || '', is_active ?? true,
        JSON.stringify(Array.isArray(types) ? types : []),
        JSON.stringify(Array.isArray(subcategories) ? subcategories : []),
        JSON.stringify(city_prices && typeof city_prices === 'object' ? city_prices : {}),
        id,
      ]
    );
    if (result.rows.length === 0)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (e) {
    console.error('PUT shop-categories error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── PATCH (reorder bulk) ──────────────────────────────────────────────────────
export async function PATCH(req) {
  try {
    await ensureTable();
    if (!requireRole(req, 'admin')) return unauthorized();

    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: 'items array required' }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const { id, sort_order } of items) {
        await client.query(`UPDATE shop_categories SET sort_order=$1 WHERE id=$2`, [sort_order, id]);
      }
      await client.query('COMMIT');
    } catch (e) { await client.query('ROLLBACK'); throw e; }
    finally { client.release(); }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('PATCH shop-categories error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(req) {
  try {
    await ensureTable();
    if (!requireRole(req, 'admin')) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const result = await pool.query(`DELETE FROM shop_categories WHERE id=$1 RETURNING id`, [id]);
    if (result.rows.length === 0)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('DELETE shop-categories error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
