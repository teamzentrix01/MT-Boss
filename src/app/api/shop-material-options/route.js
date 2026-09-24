import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS supplier_materials (
      id SERIAL PRIMARY KEY,
      supplier_id INTEGER NOT NULL,
    vendor_id INTEGER,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      quote_price_range VARCHAR(100),
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
    ADD COLUMN IF NOT EXISTS vendor_id INTEGER,
    ADD COLUMN IF NOT EXISTS brand VARCHAR(120),
    ADD COLUMN IF NOT EXISTS quote_price_range VARCHAR(100),
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
      `SELECT m.id, m.supplier_id, m.vendor_id, m.name, m.description, m.quote_price_range, m.price, m.unit, m.quantity, m.image_url, m.category,
              m.brand, m.compare_at_price, m.images, m.specifications, m.bulk_pricing,
              CASE
                WHEN jsonb_array_length(COALESCE(m.available_cities, '[]'::jsonb)) > 0 THEN m.available_cities
                WHEN m.vendor_id IS NOT NULL AND v.city IS NOT NULL THEN jsonb_build_array(v.city)
                WHEN m.supplier_id <> 0 AND s.city IS NOT NULL THEN jsonb_build_array(s.city)
                ELSE '[]'::jsonb
              END AS available_cities,
              m.created_at
       FROM supplier_materials m
       LEFT JOIN suppliers s ON s.id = m.supplier_id
       LEFT JOIN vendors v ON v.id = m.vendor_id
       WHERE m.is_available = TRUE
         AND (
           (m.vendor_id IS NOT NULL AND v.is_approved = TRUE AND v.status = 'active')
           OR (m.vendor_id IS NULL AND (m.supplier_id = 0 OR (s.status = 'approved' AND s.is_active = TRUE)))
         )
         AND ($1 = '' OR LOWER(TRIM(m.category)) = LOWER(TRIM($1)))
       ORDER BY m.name ASC, m.id ASC`,
      [category]
    );

    const products = result.rows.map((row) => ({
      id: row.id,
      supplier_id: row.supplier_id,
      vendor_id: row.vendor_id,
      name: row.name,
      description: row.description || '',
      quote_price_range: row.quote_price_range || '',
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
      created_at: row.created_at,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          products,
          types: uniq(products.map((p) => p.name)),
          units: uniq(products.map((p) => p.unit)),
        },
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('GET shop-material-options error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
