import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createInitializationGuard, isDatabaseConnectionError } from '@/lib/api-utils';

const productCache = new Map();
const PRODUCT_CACHE_TTL_MS = 15000;

const ensureTable = createInitializationGuard(async() => {
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
      is_featured_deal BOOLEAN DEFAULT FALSE,
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
    ADD COLUMN IF NOT EXISTS is_featured_deal BOOLEAN DEFAULT FALSE,
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
        const bypassCache = searchParams.get('fresh') === '1';
        const cacheKey = category.toLowerCase();
        const cached = productCache.get(cacheKey);
        if (!bypassCache && cached?.expiresAt > Date.now()) {
            return NextResponse.json(cached.payload, {
                headers: { 'Cache-Control': 'public, max-age=15, s-maxage=30, stale-while-revalidate=120' },
            });
        }

        const result = await pool.query(
            `SELECT m.id, m.supplier_id, m.vendor_id, m.name, m.description, m.quote_price_range, m.price, m.unit, m.quantity, m.image_url, m.category,
              m.brand, m.compare_at_price, m.is_featured_deal, m.images, m.specifications, m.bulk_pricing,
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
       ORDER BY m.name ASC, m.id ASC`, [category]
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
            is_featured_deal: row.is_featured_deal === true,
            images: Array.isArray(row.images) ? row.images : [],
            specifications: row.specifications || {},
            bulk_pricing: Array.isArray(row.bulk_pricing) ? row.bulk_pricing : [],
            available_cities: Array.isArray(row.available_cities) ? row.available_cities : [],
            created_at: row.created_at,
        }));

        const payload = {
            success: true,
            data: {
                products,
                types: uniq(products.map((p) => p.name)),
                units: uniq(products.map((p) => p.unit)),
            },
        };
        productCache.set(cacheKey, { expiresAt: Date.now() + PRODUCT_CACHE_TTL_MS, payload });
        return NextResponse.json(payload, {
            headers: { 'Cache-Control': 'public, max-age=15, s-maxage=30, stale-while-revalidate=120' },
        });
    } catch (error) {
        console.error('GET shop-material-options error:', error);
        const isConnectionError = isDatabaseConnectionError(error);
        return NextResponse.json({ success: false, error: isConnectionError ? 'Database connection unavailable' : error.message }, { status: isConnectionError ? 503 : 500 });
    }
}
