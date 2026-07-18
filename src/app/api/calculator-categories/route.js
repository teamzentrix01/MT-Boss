import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';

let readyPromise;

function hasAuth(req) {
  return Boolean(requireRole(req, 'admin'));
}

async function initializeCategoryTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS calculator_products (
      id SERIAL PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      badge VARCHAR(50) DEFAULT 'Recommended',
      name VARCHAR(200) NOT NULL,
      description TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      unit VARCHAR(50) DEFAULT 'unit',
      price NUMERIC(12,2) NOT NULL DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS calculator_categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      badge VARCHAR(50) DEFAULT 'Recommended',
      image_url TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    INSERT INTO calculator_categories (name, badge, image_url, sort_order, is_active)
    SELECT
      category,
      COALESCE(NULLIF((ARRAY_AGG(badge ORDER BY sort_order ASC, id ASC))[1], ''), 'Recommended') AS badge,
      COALESCE(NULLIF((ARRAY_AGG(image_url ORDER BY sort_order ASC, id ASC))[1], ''), '') AS image_url,
      MIN(sort_order) AS sort_order,
      TRUE
    FROM calculator_products
    GROUP BY category
    ON CONFLICT (name) DO NOTHING
  `);
}

function ensureCategoryTables() {
  if (!readyPromise) {
    readyPromise = initializeCategoryTables().catch((error) => {
      readyPromise = undefined;
      throw error;
    });
  }
  return readyPromise;
}

export async function GET() {
  try {
    await ensureCategoryTables();
    const result = await pool.query(`
      SELECT c.*,
        COUNT(p.id)::INTEGER AS product_count
      FROM calculator_categories c
      LEFT JOIN calculator_products p ON LOWER(p.category) = LOWER(c.name)
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.id ASC
    `);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET calculator-categories error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureCategoryTables();
    if (!hasAuth(req)) return unauthorized();

    const body = await req.json();
    const { name, badge, image_url, is_active } = body;
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const { rows: [{ max }] } = await pool.query('SELECT COALESCE(MAX(sort_order),0) AS max FROM calculator_categories');
    const result = await pool.query(
      `INSERT INTO calculator_categories
        (name, badge, image_url, sort_order, is_active, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW())
       RETURNING *`,
      [
        name.trim(),
        badge || 'Recommended',
        image_url || '',
        parseInt(max) + 1,
        is_active ?? true,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }
    console.error('POST calculator-categories error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await ensureCategoryTables();
    if (!hasAuth(req)) return unauthorized();

    const body = await req.json();
    const { id, name, badge, image_url, is_active } = body;
    if (!id || !name?.trim()) {
      return NextResponse.json({ error: 'ID and category name are required' }, { status: 400 });
    }

    const current = await pool.query('SELECT name FROM calculator_categories WHERE id=$1 LIMIT 1', [id]);
    if (current.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const oldName = current.rows[0].name;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `UPDATE calculator_categories
         SET name=$1, badge=$2, image_url=$3, is_active=$4, updated_at=NOW()
         WHERE id=$5
         RETURNING *`,
        [name.trim(), badge || 'Recommended', image_url || '', is_active ?? true, id]
      );
      await client.query(
        `UPDATE calculator_products
         SET category=$1, badge=$2, updated_at=NOW()
         WHERE LOWER(category)=LOWER($3)`,
        [name.trim(), badge || 'Recommended', oldName]
      );
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: result.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }
    console.error('PUT calculator-categories error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await ensureCategoryTables();
    if (!hasAuth(req)) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const category = await pool.query('SELECT name FROM calculator_categories WHERE id=$1 LIMIT 1', [id]);
    if (category.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const products = await pool.query(
      'SELECT COUNT(*)::INTEGER AS count FROM calculator_products WHERE LOWER(category)=LOWER($1)',
      [category.rows[0].name]
    );
    if (products.rows[0].count > 0) {
      return NextResponse.json({ error: 'Move or delete products in this category first' }, { status: 409 });
    }

    await pool.query('DELETE FROM calculator_categories WHERE id=$1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE calculator-categories error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
