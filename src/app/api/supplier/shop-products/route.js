import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';
import { QUALITY_TIER_COLUMN_SQL, normalizeQualityTier } from '@/lib/quality-tier';

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
    subcategory VARCHAR(255),
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
  )`);
  await pool.query(`ALTER TABLE supplier_materials
    ADD COLUMN IF NOT EXISTS vendor_id INTEGER,
    ADD COLUMN IF NOT EXISTS brand VARCHAR(120),
    ADD COLUMN IF NOT EXISTS subcategory VARCHAR(255),
    ADD COLUMN IF NOT EXISTS quote_price_range VARCHAR(100),
    ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS is_featured_deal BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS bulk_pricing JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS available_cities JSONB DEFAULT '[]'::jsonb`);
  await pool.query(QUALITY_TIER_COLUMN_SQL);
});

const unauthorized = () =>
  NextResponse.json({ success: false, error: 'Supplier access required' }, { status: 401 });

async function getActiveSupplier(req) {
  const user = requireRole(req, 'supplier');
  if (!user || !user.id) return null;
  const result = await pool.query(
    'SELECT id, email, shop_name, status, is_active FROM suppliers WHERE id = $1',
    [user.id]
  );
  if (!result.rows.length) return null;
  const supplier = result.rows[0];
  if (!supplier.is_active || supplier.status === 'blocked') return null;
  return supplier;
}

async function validProduct(body, { allowUnassigned = false } = {}) {
  const name = String(body.name || '').trim();
  const category = String(body.category || '').trim();
  if (!name || name.length > 255 || (!category && !allowUnassigned)) {
    return { error: 'Product name and category are required' };
  }

  let categoryUnit = 'pcs';
  if (category) {
    const existingCategory = await pool.query(
      'SELECT name, unit FROM shop_categories WHERE LOWER(TRIM(name)) = LOWER(TRIM($1)) LIMIT 1',
      [category]
    );
    if (existingCategory.rows.length) {
      categoryUnit = existingCategory.rows[0].unit || 'pcs';
    } else {
      const inserted = await pool.query(
        `INSERT INTO shop_categories (name, slug, unit, is_active)
         VALUES ($1, $2, $3, TRUE)
         ON CONFLICT (name) DO UPDATE SET is_active = TRUE
         RETURNING name, unit`,
        [category, category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), body.unit || 'pcs']
      );
      categoryUnit = inserted.rows[0]?.unit || body.unit || 'pcs';
    }
  }

  const qualityTier = normalizeQualityTier(body.quality_tier);
  if (!qualityTier) return { error: 'Choose a Quality Tier: All, Basic, Standard, Premium or Luxury' };

  const quotePriceRange = String(body.quote_price_range || '').trim();
  let normalizedQuoteRange = null;
  if (quotePriceRange) {
    const rangeMatch = quotePriceRange.match(
      /^(?:₹\s*|rs\.?\s*)?(\d+(?:\.\d{1,2})?)\s*[-–]\s*(?:₹\s*|rs\.?\s*)?(\d+(?:\.\d{1,2})?)$/i
    );
    if (!rangeMatch) return { error: 'Enter the Get Quote price range like 40-80 or leave empty' };
    const quoteMinimum = Number(rangeMatch[1]);
    const quoteMaximum = Number(rangeMatch[2]);
    if (!(quoteMinimum > 0) || quoteMaximum <= quoteMinimum || quoteMaximum > 99999999.99) {
      return { error: 'Get Quote maximum price must be greater than its minimum, e.g. 40-80' };
    }
    normalizedQuoteRange = `${quoteMinimum}-${quoteMaximum}`;
  }

  const rawPrice = body.price === '' || body.price == null ? null : Number(body.price);
  if (rawPrice === null || !Number.isFinite(rawPrice) || rawPrice <= 0 || rawPrice > 99999999.99) {
    return { error: 'Buy Now fixed price is required and must be a positive number' };
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

  if (images.length > 8 || images.some((url) => typeof url !== 'string' || url.length > 1000)) {
    return { error: 'Add up to 8 image URLs' };
  }
  if (Object.keys(specifications).length > 20 || Object.entries(specifications).some(([k, v]) => k.length > 100 || typeof v !== 'string' || v.length > 500)) {
    return { error: 'Add up to 20 short specifications' };
  }
  if (bulkPricing.length > 10 || bulkPricing.some((tier) => !Number.isInteger(Number(tier.min_quantity)) || Number(tier.min_quantity) < 2 || !Number.isFinite(Number(tier.price)) || Number(tier.price) <= 0)) {
    return { error: 'Bulk tiers need a minimum quantity and positive price' };
  }
  if (bulkPricing.length && !(rawPrice > 0)) {
    return { error: 'Set a selling price before adding bulk tiers' };
  }
  if (availableCities.length > 100 || availableCities.some((c) => typeof c !== 'string' || c.length > 120)) {
    return { error: 'Choose valid delivery cities' };
  }

  return {
    value: {
      name,
      category,
      description: String(body.description || '').trim().slice(0, 2000),
      quote_price_range: normalizedQuoteRange,
      price: rawPrice,
      unit: String(body.unit || categoryUnit).trim().slice(0, 100),
      quantity,
      image_url: String(body.image_url || '').trim().slice(0, 1000),
      brand: String(body.brand || '').trim().slice(0, 120),
      subcategory: String(body.subcategory || '').trim().slice(0, 255),
      compare_at_price: compareAtPrice,
      is_featured_deal: Boolean(body.is_featured_deal),
      images,
      specifications,
      bulk_pricing: bulkPricing,
      available_cities: availableCities,
      is_available: false,
      quality_tier: qualityTier,
    },
  };
}

export async function GET(req) {
  try {
    await ensureTable();
    const supplier = await getActiveSupplier(req);
    if (!supplier) return unauthorized();
    const emailParam = String(supplier.email || '').trim().toLowerCase();

    const result = await pool.query(
      `SELECT id, supplier_id, vendor_id, name, description, quote_price_range, price, unit,
              quantity, image_url, category, subcategory, brand, compare_at_price, is_featured_deal, images, specifications,
              bulk_pricing, available_cities, is_available, quality_tier, created_at
       FROM supplier_materials
       WHERE supplier_id = $1
          OR ($2 <> '' AND vendor_id IN (SELECT id FROM vendors WHERE LOWER(email) = $2))
       ORDER BY created_at DESC, id DESC`,
      [supplier.id, emailParam]
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET supplier shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not load products' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureTable();
    const supplier = await getActiveSupplier(req);
    if (!supplier) return unauthorized();
    const parsed = await validProduct(await req.json());
    if (parsed.error) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    const p = parsed.value;

    // Supplier products are created pending admin approval (is_available = false)
    const cleanSpecs = { ...(p.specifications || {}) };
    delete cleanSpecs.__approval__;
    cleanSpecs.__approval__ = {
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const result = await pool.query(
      `INSERT INTO supplier_materials
       (supplier_id, vendor_id, name, description, quote_price_range, price, unit, quantity,
        image_url, category, subcategory, brand, compare_at_price, is_featured_deal, images, specifications, bulk_pricing,
        available_cities, is_available, quality_tier)
       VALUES ($1, NULL, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14::jsonb,
               $15::jsonb, $16::jsonb, $17::jsonb, FALSE, $18)
       RETURNING *`,
      [supplier.id, p.name, p.description, p.quote_price_range, p.price, p.unit, p.quantity,
       p.image_url, p.category, p.subcategory, p.brand, p.compare_at_price, p.is_featured_deal, JSON.stringify(p.images),
       JSON.stringify(cleanSpecs), JSON.stringify(p.bulk_pricing),
       JSON.stringify(p.available_cities), p.quality_tier]
    );

    if (globalThis.__shopProductCache) globalThis.__shopProductCache.clear();
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST supplier shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not add product' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await ensureTable();
    const supplier = await getActiveSupplier(req);
    if (!supplier) return unauthorized();

    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ success: false, error: 'Valid product ID required' }, { status: 400 });

    const emailParam = String(supplier.email || '').trim().toLowerCase();
    const existingRes = await pool.query(
      `SELECT id, supplier_id, vendor_id, name, price, compare_at_price, category, quality_tier, unit, images, description, specifications, is_available
       FROM supplier_materials
       WHERE id = $1
         AND (supplier_id = $2 OR ($3 <> '' AND vendor_id IN (SELECT id FROM vendors WHERE LOWER(email) = $3)))`,
      [id, supplier.id, emailParam]
    );
    if (!existingRes.rows.length) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    const existing = existingRes.rows[0];

    const existingApproval = existing.specifications?.__approval__ || {};
    const existingStatus = existingApproval.status || 'approved';

    if (body.action === 'toggle') {
      if (existingStatus !== 'approved' && body.is_available === true) {
        return NextResponse.json(
          { success: false, error: 'Products pending approval or rejected cannot be made visible on Shop Now' },
          { status: 400 }
        );
      }
      const result = await pool.query(
        `UPDATE supplier_materials
         SET is_available=$1, supplier_id=$2, updated_at=NOW()
         WHERE id=$3 RETURNING *`,
        [body.is_available === true, supplier.id, id]
      );
      if (globalThis.__shopProductCache) globalThis.__shopProductCache.clear();
      return NextResponse.json({ success: true, data: result.rows[0] });
    }

    const parsed = await validProduct(body);
    if (parsed.error) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    const p = parsed.value;

    const cleanSpecs = { ...(p.specifications || {}) };
    delete cleanSpecs.__approval__;

    const existingImages = Array.isArray(existing.images) ? existing.images : [];
    const newImages = Array.isArray(p.images) ? p.images : [];
    const imagesChanged = JSON.stringify(existingImages) !== JSON.stringify(newImages);

    const coreFieldsChanged =
      String(existing.name || '').trim() !== String(p.name || '').trim() ||
      Number(existing.price) !== Number(p.price) ||
      (existing.compare_at_price == null ? null : Number(existing.compare_at_price)) !== (p.compare_at_price == null ? null : Number(p.compare_at_price)) ||
      String(existing.category || '').trim().toLowerCase() !== String(p.category || '').trim().toLowerCase() ||
      String(existing.quality_tier || '').trim().toLowerCase() !== String(p.quality_tier || '').trim().toLowerCase() ||
      String(existing.unit || '').trim().toLowerCase() !== String(p.unit || '').trim().toLowerCase() ||
      String(existing.description || '').trim() !== String(p.description || '').trim() ||
      imagesChanged;

    let nextAvailable = existing.is_available;
    let resubmittedForApproval = false;

    if (coreFieldsChanged) {
      cleanSpecs.__approval__ = {
        status: 'pending',
        resubmitted_at: new Date().toISOString(),
        previous_status: existingStatus,
      };
      nextAvailable = false;
      resubmittedForApproval = true;
    } else {
      cleanSpecs.__approval__ = existingApproval;
    }

    const result = await pool.query(
      `UPDATE supplier_materials SET
        supplier_id=$1, name=$2, description=$3, quote_price_range=$4, price=$5,
        unit=$6, quantity=$7, image_url=$8, category=$9, subcategory=$10, brand=$11, compare_at_price=$12,
        is_featured_deal=$13, images=$14::jsonb, specifications=$15::jsonb, bulk_pricing=$16::jsonb,
        available_cities=$17::jsonb, is_available=$18, quality_tier=$19, updated_at=NOW()
       WHERE id=$20 RETURNING *`,
      [supplier.id, p.name, p.description, p.quote_price_range, p.price, p.unit, p.quantity, p.image_url,
        p.category, p.subcategory, p.brand, p.compare_at_price, p.is_featured_deal, JSON.stringify(p.images),
        JSON.stringify(cleanSpecs), JSON.stringify(p.bulk_pricing),
        JSON.stringify(p.available_cities), nextAvailable, p.quality_tier, id]
    );
    if (!result.rows.length) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    if (globalThis.__shopProductCache) globalThis.__shopProductCache.clear();
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      resubmitted_for_approval: resubmittedForApproval,
    });
  } catch (error) {
    console.error('PUT supplier shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not update product' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await ensureTable();
    const supplier = await getActiveSupplier(req);
    if (!supplier) return unauthorized();

    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ success: false, error: 'Valid product ID required' }, { status: 400 });

    const emailParam = String(supplier.email || '').trim().toLowerCase();
    const result = await pool.query(
      `DELETE FROM supplier_materials
       WHERE id=$1
         AND (supplier_id=$2 OR ($3 <> '' AND vendor_id IN (SELECT id FROM vendors WHERE LOWER(email) = $3)))
       RETURNING id`,
      [id, supplier.id, emailParam]
    );
    if (!result.rows.length) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    if (globalThis.__shopProductCache) globalThis.__shopProductCache.clear();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE supplier shop-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not delete product' }, { status: 500 });
  }
}
