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
      brand VARCHAR(120),
      compare_at_price NUMERIC(10,2),
      images JSONB DEFAULT '[]'::jsonb,
      specifications JSONB DEFAULT '{}'::jsonb,
      bulk_pricing JSONB DEFAULT '[]'::jsonb,
      available_cities JSONB DEFAULT '[]'::jsonb,
      is_available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE supplier_materials
    ADD COLUMN IF NOT EXISTS brand VARCHAR(120),
    ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS bulk_pricing JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS available_cities JSONB DEFAULT '[]'::jsonb`);
});

function uniq(values) {
  return [...new Set(values.map((v) => String(v || '').trim()).filter(Boolean))];
}

export async function GET(req) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const category = String(searchParams.get('category') || '').trim();

    const result = await pool.query(
      `SELECT id, supplier_id, name, description, price, unit, quantity, image_url, category,
              brand, compare_at_price, images, specifications, bulk_pricing, available_cities
       FROM supplier_materials
       WHERE is_available = TRUE
         AND ($1 = '' OR LOWER(TRIM(category)) = LOWER(TRIM($1)))
       ORDER BY name ASC, id ASC`,
      [category]
    );

    const products = result.rows.map((row) => ({
      id: row.id,
      supplier_id: row.supplier_id,
      name: row.name,
      description: row.description || '',
      price: row.price,
      unit: row.unit || '',
      quantity: row.quantity,
      image_url: row.image_url || '',
      category: row.category || '',
      brand: row.brand || '',
      compare_at_price: row.compare_at_price,
      images: Array.isArray(row.images) ? row.images : [],
      specifications: row.specifications || {},
      bulk_pricing: Array.isArray(row.bulk_pricing) ? row.bulk_pricing : [],
      available_cities: Array.isArray(row.available_cities) ? row.available_cities : [],
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
