import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS supplier_materials (
      id SERIAL PRIMARY KEY,
      supplier_id INTEGER NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price NUMERIC(10,2),
      unit VARCHAR(100),
      quantity INTEGER DEFAULT 0,
      image_url TEXT,
      category VARCHAR(255),
      is_available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
});

function uniq(values) {
  return [...new Set(values.map((v) => String(v || '').trim()).filter(Boolean))];
}

export async function GET(req) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const category = String(searchParams.get('category') || '').trim();

    if (!category) {
      return NextResponse.json({ success: true, data: { products: [], types: [], units: [] } });
    }

    const result = await pool.query(
      `SELECT DISTINCT name, unit
       FROM supplier_materials
       WHERE is_available = TRUE
         AND LOWER(TRIM(category)) = LOWER(TRIM($1))
       ORDER BY name ASC`,
      [category]
    );

    const products = result.rows.map((row) => ({
      name: row.name,
      unit: row.unit || '',
    }));

    return NextResponse.json({
      success: true,
      data: {
        products,
        types: uniq(products.map((p) => p.name)),
        units: uniq(products.map((p) => p.unit)),
      },
    });
  } catch (error) {
    console.error('GET shop-material-options error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
