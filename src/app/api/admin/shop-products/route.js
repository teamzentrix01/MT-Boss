import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS supplier_materials (
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
  )`);
  await pool.query(`ALTER TABLE supplier_materials
    ADD COLUMN IF NOT EXISTS brand VARCHAR(120),
    ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS bulk_pricing JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS available_cities JSONB DEFAULT '[]'::jsonb`);
});

const unauthorized = () => NextResponse.json({ success: false, error: 'Admin access required' }, { status: 401 });

async function validProduct(body, { allowUnassigned = false } = {}) {
  const name = String(body.name || '').trim();
  const category = String(body.category || '').trim();
  if (!name || name.length > 255 || (!category && !allowUnassigned)) return { error: 'Product name and category are required' };
  const categoryResult = category ? await pool.query(
    'SELECT name, unit FROM shop_categories WHERE LOWER(TRIM(name)) = LOWER(TRIM($1)) LIMIT 1',
    [category]
  ) : { rows: [{ name: '', unit: body.unit || 'pcs' }] };
  if (!categoryResult.rows.length) return { error: 'Choose an existing Shop Now category' };
  const rawPrice = body.price === '' || body.price === null || body.price === undefined ? null : Number(body.price);
  if (rawPrice !== null && (!Number.isFinite(rawPrice) || rawPrice <= 0 || rawPrice > 99999999.99)) {
    return { error: 'Enter a positive selling price, or leave it blank for Get Quote' };
  }
  const quantity = Number(body.quantity ?? 0);
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 100000000) {
    return { error: 'Quantity must be a non-negative whole number' };
  }
  const compareAtPrice = body.compare_at_price === '' || body.compare_at_price == null ? null : Number(body.compare_at_price);
  if (compareAtPrice !== null && (!Number.isFinite(compareAtPrice) || compareAtPrice < 0 || compareAtPrice > 99999999.99)) return { error: 'Enter a valid original price' };
  const images = Array.isArray(body.images) ? body.images : [];
  const specifications = body.specifications && typeof body.specifications === 'object' && !Array.isArray(body.specifications) ? body.specifications : {};
  const bulkPricing = Array.isArray(body.bulk_pricing) ? body.bulk_pricing : [];
  const availableCities = Array.isArray(body.available_cities) ? body.available_cities : [];
  if (images.length > 8 || images.some((url) => typeof url !== 'string' || url.length > 1000)) return { error: 'Add up to 8 image URLs' };
  if (Object.keys(specifications).length > 20 || Object.entries(specifications).some(([key, value]) => key.length > 100 || typeof value !== 'string' || value.length > 500)) return { error: 'Add up to 20 short specifications' };
  if (bulkPricing.length > 10 || bulkPricing.some((tier) => !Number.isInteger(Number(tier.min_quantity)) || Number(tier.min_quantity) < 2 || !Number.isFinite(Number(tier.price)) || Number(tier.price) <= 0)) return { error: 'Bulk tiers need a minimum quantity and positive price' };
  if (bulkPricing.length && !(rawPrice > 0)) return { error: 'Set a selling price before adding bulk tiers' };
  if (availableCities.length > 100 || availableCities.some((city) => typeof city !== 'string' || city.length > 120)) return { error: 'Choose valid delivery cities' };
  return { value: {
    name,
    category: categoryResult.rows[0].name,
    description: String(body.description || '').trim().slice(0, 2000),
    price: rawPrice,
    unit: String(body.unit || categoryResult.rows[0].unit || 'pcs').trim().slice(0, 100),
    quantity,
    image_url: String(body.image_url || '').trim().slice(0, 1000),
    brand: String(body.brand || '').trim().slice(0, 120),
    compare_at_price: compareAtPrice,
    images: images.map((url) => url.trim()).filter(Boolean),
    specifications,
    bulk_pricing: bulkPricing.map((tier) => ({ min_quantity: Number(tier.min_quantity), price: Number(tier.price) })).sort((a, b) => a.min_quantity - b.min_quantity),
    available_cities: [...new Set(availableCities.map((city) => city.trim()).filter(Boolean))],
    is_available: body.is_available !== false,
  } };
}

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureTable();
    const result = await pool.query(`SELECT id, supplier_id, name, description, price, unit,
      quantity, image_url, category, brand, compare_at_price, images, specifications, bulk_pricing, available_cities, is_available, created_at
      FROM supplier_materials ORDER BY created_at DESC, id DESC`);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET admin shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not load products' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureTable();
    const parsed = await validProduct(await req.json());
    if (parsed.error) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    const p = parsed.value;
    const result = await pool.query(`INSERT INTO supplier_materials
      (supplier_id, name, description, price, unit, quantity, image_url, category, brand, compare_at_price, images, specifications, bulk_pricing, available_cities, is_available)
      VALUES (0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12::jsonb, $13::jsonb, $14) RETURNING *`,
      [p.name, p.description, p.price, p.unit, p.quantity, p.image_url, p.category, p.brand, p.compare_at_price, JSON.stringify(p.images), JSON.stringify(p.specifications), JSON.stringify(p.bulk_pricing), JSON.stringify(p.available_cities), p.is_available]);
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST admin shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not add product' }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureTable();
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ success: false, error: 'Valid product ID required' }, { status: 400 });
    const parsed = await validProduct(body, { allowUnassigned: true });
    if (parsed.error) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    const p = parsed.value;
    const result = await pool.query(`UPDATE supplier_materials SET name=$1, description=$2,
      price=$3, unit=$4, quantity=$5, image_url=$6, category=$7,
      brand=$8, compare_at_price=$9, images=$10::jsonb, specifications=$11::jsonb,
      bulk_pricing=$12::jsonb, available_cities=$13::jsonb, is_available=$14, updated_at=NOW() WHERE id=$15 RETURNING *`,
      [p.name, p.description, p.price, p.unit, p.quantity, p.image_url, p.category, p.brand, p.compare_at_price, JSON.stringify(p.images), JSON.stringify(p.specifications), JSON.stringify(p.bulk_pricing), JSON.stringify(p.available_cities), p.is_available, id]);
    if (!result.rows.length) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PUT admin shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not update product' }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureTable();
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ success: false, error: 'Valid product ID required' }, { status: 400 });
    const result = await pool.query('DELETE FROM supplier_materials WHERE id=$1 RETURNING id', [id]);
    if (!result.rows.length) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE admin shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not delete product' }, { status: 500 });
  }
}
