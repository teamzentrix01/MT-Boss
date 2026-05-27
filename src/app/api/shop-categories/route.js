import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// No `ready` flag — all DDL statements are idempotent (IF NOT EXISTS).
// This makes the route resilient to dev hot-reloads and out-of-band DB resets.
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shop_categories (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(200) NOT NULL,
      image       TEXT,
      emoji       VARCHAR(20)  DEFAULT '🛒',
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
}

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    const result = isAdmin
      ? await pool.query(`SELECT * FROM shop_categories ORDER BY sort_order ASC, id ASC`)
      : await pool.query(`SELECT * FROM shop_categories WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC`);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (e) {
    console.error('GET shop-categories error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── POST (create) ─────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    await ensureTable();
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, image, emoji, label, label_color, price_range, unit, types, subcategories } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const { rows: [{ max }] } = await pool.query(`SELECT COALESCE(MAX(sort_order),0) AS max FROM shop_categories`);

    const result = await pool.query(
      `INSERT INTO shop_categories
         (name, image, emoji, label, label_color, price_range, unit, sort_order,
          is_active, types, subcategories, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE,$9::jsonb,$10::jsonb,NOW(),NOW())
       RETURNING *`,
      [
        name, image || null, emoji || '🛒', label || '', label_color || 'yellow',
        price_range || '', unit || '', parseInt(max) + 1,
        JSON.stringify(Array.isArray(types) ? types : []),
        JSON.stringify(Array.isArray(subcategories) ? subcategories : []),
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
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      id, name, image, emoji, label, label_color,
      price_range, unit, is_active, types, subcategories,
    } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const result = await pool.query(
      `UPDATE shop_categories
       SET name=$1, image=$2, emoji=$3, label=$4, label_color=$5,
           price_range=$6, unit=$7, is_active=$8,
           types=$9::jsonb, subcategories=$10::jsonb, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [
        name, image || null, emoji || '🛒', label || '', label_color || 'yellow',
        price_range || '', unit || '', is_active ?? true,
        JSON.stringify(Array.isArray(types) ? types : []),
        JSON.stringify(Array.isArray(subcategories) ? subcategories : []),
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
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
