import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS supplier_materials (
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
  )`);
  await pool.query(`ALTER TABLE supplier_materials
    ADD COLUMN IF NOT EXISTS vendor_id INTEGER,
    ADD COLUMN IF NOT EXISTS brand VARCHAR(120),
    ADD COLUMN IF NOT EXISTS quote_price_range VARCHAR(100),
    ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS bulk_pricing JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS available_cities JSONB DEFAULT '[]'::jsonb`);
  await pool.query('CREATE INDEX IF NOT EXISTS supplier_materials_vendor_id_idx ON supplier_materials(vendor_id)');
});

const unauthorized = () => NextResponse.json({ success: false, error: 'Vendor access required' }, { status: 401 });

async function getActiveVendor(req) {
  const decoded = requireRole(req, 'vendor');
  if (!decoded) return null;
  const result = await pool.query(
    `SELECT id FROM vendors
     WHERE id=$1 AND is_approved=TRUE AND status='active'
     LIMIT 1`,
    [decoded.id]
  );
  return result.rows[0] || null;
}

async function validProduct(body) {
  const name = String(body.name || '').trim();
  const category = String(body.category || '').trim();
  if (!name || name.length > 255 || !category) return { error: 'Product name and category are required' };

  const categoryResult = await pool.query(
    `SELECT name, unit FROM shop_categories
     WHERE LOWER(TRIM(name))=LOWER(TRIM($1)) AND is_active=TRUE
     LIMIT 1`,
    [category]
  );
  if (!categoryResult.rows.length) return { error: 'Choose an active Shop Now category' };

  const quotePriceRange = String(body.quote_price_range || '').trim();
  const rangeMatch = quotePriceRange.match(/^(?:₹\s*|rs\.?\s*)?(\d+(?:\.\d{1,2})?)\s*[-–]\s*(?:₹\s*|rs\.?\s*)?(\d+(?:\.\d{1,2})?)$/i);
  if (!rangeMatch) return { error: 'Enter the required Get Quote price range like 40-80' };
  const quoteMinimum = Number(rangeMatch[1]);
  const quoteMaximum = Number(rangeMatch[2]);
  if (!(quoteMinimum > 0) || quoteMaximum <= quoteMinimum || quoteMaximum > 99999999.99) {
    return { error: 'Get Quote maximum price must be greater than its minimum, e.g. 40-80' };
  }

  const price = Number(body.price);
  if (!Number.isFinite(price) || price <= 0 || price > 99999999.99) {
    return { error: 'Enter the required positive Buy Now fixed price' };
  }
  const quantity = Number(body.quantity ?? 0);
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 100000000) {
    return { error: 'Quantity must be a non-negative whole number' };
  }
  const compareAtPrice = body.compare_at_price === '' || body.compare_at_price == null ? null : Number(body.compare_at_price);
  if (compareAtPrice !== null && (!Number.isFinite(compareAtPrice) || compareAtPrice < 0 || compareAtPrice > 99999999.99)) {
    return { error: 'Enter a valid original price' };
  }

  const images = Array.isArray(body.images) ? body.images : [];
  const specifications = body.specifications && typeof body.specifications === 'object' && !Array.isArray(body.specifications) ? body.specifications : {};
  const bulkPricing = Array.isArray(body.bulk_pricing) ? body.bulk_pricing : [];
  const availableCities = Array.isArray(body.available_cities) ? body.available_cities : [];
  if (images.length > 8 || images.some((url) => typeof url !== 'string' || url.length > 1000)) return { error: 'Add up to 8 image URLs' };
  if (Object.keys(specifications).length > 20 || Object.entries(specifications).some(([key, value]) => key.length > 100 || typeof value !== 'string' || value.length > 500)) return { error: 'Add up to 20 short specifications' };
  if (bulkPricing.length > 10 || bulkPricing.some((tier) => !Number.isInteger(Number(tier.min_quantity)) || Number(tier.min_quantity) < 2 || !Number.isFinite(Number(tier.price)) || Number(tier.price) <= 0)) return { error: 'Bulk tiers need a minimum quantity and positive price' };
  if (availableCities.length > 100 || availableCities.some((city) => typeof city !== 'string' || city.length > 120)) return { error: 'Choose valid delivery cities' };

  return { value: {
    name,
    category: categoryResult.rows[0].name,
    description: String(body.description || '').trim().slice(0, 2000),
    quote_price_range: `${quoteMinimum}-${quoteMaximum}`,
    price,
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
  try {
    await ensureTable();
    const vendor = await getActiveVendor(req);
    if (!vendor) return unauthorized();
    const result = await pool.query(
      `SELECT id, supplier_id, vendor_id, name, description, quote_price_range, price, unit,
              quantity, image_url, category, brand, compare_at_price, images, specifications,
              bulk_pricing, available_cities, is_available, created_at
       FROM supplier_materials
       WHERE vendor_id=$1
       ORDER BY created_at DESC, id DESC`,
      [vendor.id]
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET vendor shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not load products' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureTable();
    const vendor = await getActiveVendor(req);
    if (!vendor) return unauthorized();
    const parsed = await validProduct(await req.json());
    if (parsed.error) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    const p = parsed.value;
    const result = await pool.query(
      `INSERT INTO supplier_materials
       (supplier_id, vendor_id, name, description, quote_price_range, price, unit, quantity,
        image_url, category, brand, compare_at_price, images, specifications, bulk_pricing,
        available_cities, is_available)
       VALUES (0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb,
               $13::jsonb, $14::jsonb, $15::jsonb, $16)
       RETURNING *`,
      [vendor.id, p.name, p.description, p.quote_price_range, p.price, p.unit, p.quantity,
        p.image_url, p.category, p.brand, p.compare_at_price, JSON.stringify(p.images),
        JSON.stringify(p.specifications), JSON.stringify(p.bulk_pricing),
        JSON.stringify(p.available_cities), p.is_available]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST vendor shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not add product' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await ensureTable();
    const vendor = await getActiveVendor(req);
    if (!vendor) return unauthorized();
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ success: false, error: 'Valid product ID required' }, { status: 400 });

    if (body.action === 'toggle') {
      const result = await pool.query(
        `UPDATE supplier_materials SET is_available=$1, updated_at=NOW()
         WHERE id=$2 AND vendor_id=$3 RETURNING *`,
        [body.is_available === true, id, vendor.id]
      );
      if (!result.rows.length) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: result.rows[0] });
    }

    const parsed = await validProduct(body);
    if (parsed.error) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    const p = parsed.value;
    const result = await pool.query(
      `UPDATE supplier_materials SET name=$1, description=$2, quote_price_range=$3, price=$4,
        unit=$5, quantity=$6, image_url=$7, category=$8, brand=$9, compare_at_price=$10,
        images=$11::jsonb, specifications=$12::jsonb, bulk_pricing=$13::jsonb,
        available_cities=$14::jsonb, is_available=$15, updated_at=NOW()
       WHERE id=$16 AND vendor_id=$17 RETURNING *`,
      [p.name, p.description, p.quote_price_range, p.price, p.unit, p.quantity, p.image_url,
        p.category, p.brand, p.compare_at_price, JSON.stringify(p.images),
        JSON.stringify(p.specifications), JSON.stringify(p.bulk_pricing),
        JSON.stringify(p.available_cities), p.is_available, id, vendor.id]
    );
    if (!result.rows.length) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PUT vendor shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not update product' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await ensureTable();
    const vendor = await getActiveVendor(req);
    if (!vendor) return unauthorized();
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ success: false, error: 'Valid product ID required' }, { status: 400 });
    const result = await pool.query(
      'DELETE FROM supplier_materials WHERE id=$1 AND vendor_id=$2 RETURNING id',
      [id, vendor.id]
    );
    if (!result.rows.length) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE vendor shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not delete product' }, { status: 500 });
  }
}
