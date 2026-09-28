import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { createInitializationGuard } from '@/lib/api-utils';
import { resolveManagedCity } from '@/lib/cities';
import { requireRole } from '@/lib/auth';
import { addMaterialOrderEvent, ensureMaterialOrderSchema } from '@/lib/material-orders';
import { notifyAdminSubmission, deliverMaterialOrderReceipt } from '@/lib/customer-communications';
import { calculateShipping, getShippingSettings } from '@/lib/shipping';
import { calculateCoupon, couponIsCurrentlyActive } from '@/lib/coupon-calculations';

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS material_enquiries (
      id                      SERIAL PRIMARY KEY,
      user_name               VARCHAR(255) NOT NULL,
      user_phone              VARCHAR(20)  NOT NULL,
      user_email              VARCHAR(255),
      order_intent            VARCHAR(20),
      category_name           VARCHAR(255) NOT NULL,
      category_emoji          TEXT         DEFAULT '',
      material_type           VARCHAR(255),
      product_id              INTEGER,
      indicative_unit_price   NUMERIC(10,2),
      subcategory_name        VARCHAR(255),

      brand_company           VARCHAR(255),
      quantity_text           VARCHAR(255),
      order_unit              VARCHAR(100),
      delivery_date           DATE,
      delivery_address        TEXT,
      latitude                DECIMAL(10,8),
      longitude               DECIMAL(11,8),
      message                 TEXT,
      status                  VARCHAR(50)  DEFAULT 'open',
      accepted_by_supplier_id INTEGER,
      accepted_at             TIMESTAMP,
      fulfilled_at            TIMESTAMP,
      amount_received         NUMERIC(10,2),
      admin_commission        NUMERIC(10,2),
      supplier_notes          TEXT,
      created_at              TIMESTAMP    DEFAULT NOW(),
      updated_at              TIMESTAMP    DEFAULT NOW()
    )
  `);
  // Safe column migrations — run every time, all idempotent
  const migrations = [
    `ALTER TABLE material_enquiries ALTER COLUMN category_emoji TYPE TEXT USING category_emoji::TEXT`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS material_type    VARCHAR(255)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS subcategory_name VARCHAR(255)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS brand_company    VARCHAR(255)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS order_unit       VARCHAR(100)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS delivery_date    DATE`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS selected_city    VARCHAR(100)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS product_id       INTEGER`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS indicative_unit_price NUMERIC(10,2)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS order_intent VARCHAR(20)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(12,2) DEFAULT 0`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS shipping_breakdown JSONB DEFAULT '[]'::jsonb`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(60)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS coupon_discount NUMERIC(12,2) DEFAULT 0`,
  ];
  for (const sql of migrations) {
    try { await pool.query(sql); } catch { /* already correct type or column exists */ }
  }
});

// ── POST — submit enquiry from ShopNow page ───────────────────────────────────
export async function POST(req) {
  try {
    await ensureTable();
    await ensureMaterialOrderSchema();
    const user = requireRole(req, 'user');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Please login as a customer to place and track this order' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      user_name, user_phone, user_email,
      category_name, category_emoji,
      material_type, subcategory_name, brand_company,
      quantity_text, order_unit, delivery_date,
      delivery_address, latitude, longitude,
      message, selected_city,
    } = body;
    const isCart = Array.isArray(body.items);
    const couponId = Number(body.coupon_id);
    const orderIntent = cleanText(body.order_intent)?.toLowerCase() || (isCart ? 'cart' : 'quote');
    if (!['quote', 'buy', 'cart'].includes(orderIntent) || (isCart && orderIntent !== 'cart') || (!isCart && orderIntent === 'cart')) {
      return NextResponse.json({ success: false, error: 'Invalid shop order type' }, { status: 400 });
    }
    if (isCart && (body.items.length === 0 || body.items.length > 20)) {
      return NextResponse.json({ success: false, error: 'Cart must contain 1 to 20 materials' }, { status: 400 });
    }
    const orderItems = isCart ? body.items : [{
      product_id: body.product_id, category_name, category_emoji, material_type, subcategory_name,
      brand_company, quantity_text, order_unit,
    }];
    const cleanName = cleanText(user_name);
    const cleanEmail = user_email ? cleanText(user_email).toLowerCase() : null;
    const cleanPhone = normalizePhone(user_phone);

    if (!cleanName || !cleanPhone || orderItems.some((item) => !cleanText(item?.category_name))) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and category are required' },
        { status: 400 }
      );
    }
    const contactError = validateContactFields({
      name: cleanName,
      email: cleanEmail || undefined,
      phone: cleanPhone,
      emailRequired: false,
    });
    if (contactError) return NextResponse.json({ success: false, error: contactError }, { status: 400 });
    const canonicalCity = await resolveManagedCity(selected_city);
    if (!canonicalCity) {
      return NextResponse.json({ success: false, error: 'Select an active delivery city' }, { status: 400 });
    }
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json({ success: false, error: 'Live location is required for material enquiries' }, { status: 400 });
    }
    if (isCart && orderItems.some((item) => {
      const quantity = Number(item.quantity);
      return !cleanText(item.material_type) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10000;
    })) {
      return NextResponse.json({ success: false, error: 'Each cart item needs a material and valid quantity' }, { status: 400 });
    }
    if (!isCart) {
      const quantity = Number.parseFloat(String(quantity_text || ''));
      if (!cleanText(material_type) || !Number.isFinite(quantity) || quantity <= 0 || quantity > 100000000) {
        return NextResponse.json({ success: false, error: 'Select a material and enter a valid quantity' }, { status: 400 });
      }
      if (orderIntent === 'buy' && (!Number.isInteger(quantity) || quantity > 10000)) {
        return NextResponse.json({ success: false, error: 'Buy Now quantity must be a whole number between 1 and 10000' }, { status: 400 });
      }
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      let validatedCoupon = null;
      let couponDiscount = 0;
      if (isCart && Number.isInteger(couponId) && couponId > 0) {
        const couponResult = await client.query('SELECT * FROM shop_coupons WHERE id=$1', [couponId]);
        const coupon = couponResult.rows[0];
        if (!coupon || !couponIsCurrentlyActive(coupon)) {
          const failure = new Error('The selected coupon is no longer active.'); failure.status = 409; throw failure;
        }
        const couponProductIds = orderItems.map((item) => Number(item.product_id)).filter((id) => Number.isInteger(id) && id > 0);
        const couponProducts = couponProductIds.length ? await client.query('SELECT id, price, compare_at_price, category, bulk_pricing FROM supplier_materials WHERE id=ANY($1::int[])', [couponProductIds]) : { rows: [] };
        const productsById = new Map(couponProducts.rows.map((product) => [product.id, product]));
        const serverCart = orderItems.map((item) => ({ product: productsById.get(Number(item.product_id)), quantity: Number(item.quantity) })).filter((item) => item.product);
        const calculation = calculateCoupon(serverCart, coupon);
        if (!calculation.eligible) {
          const failure = new Error(`Add ₹${calculation.gap.toLocaleString('en-IN')} more of regular-price items to use this coupon.`); failure.status = 409; throw failure;
        }
        validatedCoupon = coupon;
        couponDiscount = calculation.discount;
      }
      // Calculate shipping from server-side prices and vendor/source cities. The first
      // enquiry in a source-city group owns that group's cost; the rest remain ₹0.
      const productIds = orderItems.map((item) => Number(item.product_id)).filter((id) => Number.isInteger(id) && id > 0);
      const shippingBySourceCity = new Map();
      if (productIds.length) {
        const shippingProducts = await client.query(`SELECT m.id, m.price, m.bulk_pricing,
          COALESCE(NULLIF(TRIM(v.city), ''), NULLIF(TRIM(s.city), ''), CASE WHEN jsonb_array_length(COALESCE(m.available_cities, '[]'::jsonb))=1 THEN m.available_cities->>0 END) AS source_city
          FROM supplier_materials m LEFT JOIN vendors v ON v.id=m.vendor_id LEFT JOIN suppliers s ON s.id=m.supplier_id
          WHERE m.id=ANY($1::int[])`, [productIds]);
        const quantities = new Map(orderItems.map((item) => [Number(item.product_id), isCart ? Number(item.quantity) : Number.parseInt(String(quantity_text || ''), 10)]));
        const groups = new Map();
        for (const product of shippingProducts.rows) {
          const quantity = quantities.get(product.id) || 1;
          const tier = (Array.isArray(product.bulk_pricing) ? product.bulk_pricing : []).filter((entry) => quantity >= Number(entry.min_quantity)).sort((a, b) => Number(b.min_quantity) - Number(a.min_quantity))[0];
          const key = String(product.source_city || '').trim().toLowerCase();
          const group = groups.get(key) || { vendorCity: product.source_city || '', orderValue: 0 };
          group.orderValue += (tier ? Number(tier.price) : Number(product.price) || 0) * quantity;
          groups.set(key, group);
        }
        const shipping = calculateShipping({ groups: [...groups.values()], customerCity: canonicalCity, settings: await getShippingSettings() });
        shipping.breakdown.forEach((row) => shippingBySourceCity.set(String(row.vendorCity || '').trim().toLowerCase(), row));
      }
      const chargedShippingGroups = new Set();
      let couponRecorded = false;
      const orders = [];
      for (const item of orderItems) {
        let indicativeUnitPrice = null;
        let sourceCity = '';
        const coverage = await client.query(`SELECT 1 WHERE EXISTS (
          SELECT 1 FROM suppliers s WHERE LOWER(TRIM(s.city))=LOWER(TRIM($1))
            AND s.status='approved' AND s.is_active=TRUE
            AND EXISTS (SELECT 1 FROM unnest(s.product_categories) cat WHERE LOWER(cat)=LOWER($2))
        ) OR EXISTS (
          SELECT 1 FROM supplier_materials m WHERE m.supplier_id=0 AND m.is_available=TRUE AND m.quantity>0
            AND LOWER(TRIM(m.category))=LOWER(TRIM($2))
            AND EXISTS (SELECT 1 FROM jsonb_array_elements_text(COALESCE(m.available_cities, '[]'::jsonb)) city WHERE LOWER(TRIM(city))=LOWER(TRIM($1)))
        )`, [canonicalCity, cleanText(item.category_name)]);
        if (!coverage.rows.length) {
          const failure = new Error(`${item.category_name} is not available for delivery in ${canonicalCity}.`);
          failure.status = 409;
          throw failure;
        }
        if (item.product_id) {
          const requestedQuantity = isCart ? Number(item.quantity) : Number.parseInt(String(quantity_text || ''), 10);
          const productResult = await client.query(
            `SELECT m.name, m.category, m.unit, m.quantity, m.price, m.bulk_pricing, m.is_available,
                    m.supplier_id, m.vendor_id,
                    COALESCE(NULLIF(TRIM(v.city), ''), NULLIF(TRIM(s.city), ''), CASE WHEN jsonb_array_length(COALESCE(m.available_cities, '[]'::jsonb))=1 THEN m.available_cities->>0 END) AS source_city,
                    CASE
                      WHEN jsonb_array_length(COALESCE(m.available_cities, '[]'::jsonb)) > 0 THEN m.available_cities
                      WHEN m.supplier_id <> 0 AND s.city IS NOT NULL THEN jsonb_build_array(s.city)
                      ELSE '[]'::jsonb
                    END AS available_cities,
                    CASE WHEN m.supplier_id = 0 THEN TRUE
                         ELSE COALESCE(s.status = 'approved' AND s.is_active = TRUE, FALSE)
                    END AS supplier_available
             FROM supplier_materials m
             LEFT JOIN suppliers s ON s.id = m.supplier_id
             LEFT JOIN vendors v ON v.id = m.vendor_id
             WHERE m.id=$1
             FOR UPDATE OF m`,
            [item.product_id]
          );
          const product = productResult.rows[0];
          if (!product || !product.is_available || !product.supplier_available
            || product.name.trim().toLowerCase() !== cleanText(item.material_type)?.trim().toLowerCase()
            || (product.category && product.category.trim().toLowerCase() !== cleanText(item.category_name)?.trim().toLowerCase())) {
            const failure = new Error('A product in your order has changed or is unavailable. Refresh Shop Now and try again.');
            failure.status = 409;
            throw failure;
          }
          if (!(product.available_cities || []).some((city) => city.trim().toLowerCase() === canonicalCity.trim().toLowerCase())) {
            const failure = new Error(`${product.name} is not available for delivery in ${canonicalCity}.`);
            failure.status = 409;
            throw failure;
          }
          if (orderIntent !== 'quote' && Number.isInteger(requestedQuantity) && requestedQuantity > product.quantity) {
            const failure = new Error(`${product.name} has only ${product.quantity} ${product.unit || 'units'} available. Update your cart quantity.`);
            failure.status = 409;
            throw failure;
          }
          if (product.price != null) {
            const tier = (Array.isArray(product.bulk_pricing) ? product.bulk_pricing : [])
              .filter((entry) => Number.isInteger(requestedQuantity) && requestedQuantity >= Number(entry.min_quantity))
              .sort((a, b) => Number(b.min_quantity) - Number(a.min_quantity))[0];
            indicativeUnitPrice = tier ? Number(tier.price) : Number(product.price);
          }
          sourceCity = product.source_city || '';
        }
        const orderReference = `MO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const itemQuantity = isCart ? `${item.quantity} ${cleanText(item.order_unit) || 'pcs'}` : quantity_text;
        const shippingRow = item.product_id ? shippingBySourceCity.get(String(sourceCity).trim().toLowerCase()) : null;
        const shippingCost = shippingRow && !chargedShippingGroups.has(String(shippingRow.vendorCity || '').trim().toLowerCase()) ? shippingRow.shippingCost : 0;
        if (shippingRow) chargedShippingGroups.add(String(shippingRow.vendorCity || '').trim().toLowerCase());
        const result = await client.query(
        `INSERT INTO material_enquiries
           (user_id, order_reference, order_intent, user_name, user_phone, user_email,
            category_name, category_emoji, product_id, indicative_unit_price,
            material_type, subcategory_name, brand_company,
            quantity_text, order_unit, delivery_date,
            delivery_address, latitude, longitude, message, selected_city, shipping_cost, shipping_breakdown, coupon_code, coupon_discount)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23::jsonb,$24,$25)
         RETURNING id, order_reference, order_intent, status, created_at`,
        [
          user.id, orderReference, orderIntent, cleanName, cleanPhone, cleanEmail || user.email || null,
          cleanText(item.category_name), item.category_emoji || '', item.product_id || null, indicativeUnitPrice,
          cleanText(item.material_type) || null, cleanText(item.subcategory_name) || null, cleanText(item.brand_company) || null,
          itemQuantity || null, cleanText(item.order_unit) || null, delivery_date || null,
          delivery_address || null, lat, lng,
          message || null, canonicalCity, shippingCost ?? 0, JSON.stringify(shippingRow ? [shippingRow] : []),
          couponRecorded ? null : validatedCoupon?.code || (validatedCoupon ? 'AUTO' : null), couponRecorded ? 0 : couponDiscount,
        ]
      );
        couponRecorded = couponRecorded || Boolean(validatedCoupon);
        await addMaterialOrderEvent(client, {
          orderId: result.rows[0].id,
          status: 'open',
          title: orderIntent === 'quote' ? 'Quote requested' : 'Order placed',
          note: orderIntent === 'quote' ? 'Your Get Quote request has been received.' : 'Your material order has been received.',
          actorRole: 'user',
          actorId: user.id,
          actorName: cleanName,
        });
        orders.push({ ...result.rows[0], product_id: item.product_id || null, indicative_unit_price: indicativeUnitPrice, category_name: item.category_name, material_type: item.material_type, quantity_text: itemQuantity, order_unit: item.order_unit });
      }
      await client.query('COMMIT');
      const targetEmail = cleanEmail || user.email;
      await Promise.allSettled(orders.flatMap((order) => [
        notifyAdminSubmission({ type: 'material order', name: cleanName, phone: cleanPhone, email: targetEmail, reference: order.order_reference, details: { Category: order.category_name, Material: order.material_type, Quantity: order.quantity_text, Unit: order.order_unit, City: canonicalCity } }),
        deliverMaterialOrderReceipt({ email: targetEmail, customerName: cleanName, phone: cleanPhone, category: order.category_name, material: order.material_type, quantity: order.quantity_text, unit: order.order_unit, city: canonicalCity, orderReference: order.order_reference, deliveryAddress: delivery_address }),
      ]));
      return NextResponse.json({ success: true, data: isCart ? { orders } : orders[0] }, { status: 201 });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('POST material-enquiries error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: err.status || 500 });
  }
}

// ── GET — admin can view all enquiries ────────────────────────────────────────
export async function GET(req) {
  try {
    await ensureTable();
    await ensureMaterialOrderSchema();
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }
    const result = await pool.query(
      `SELECT me.*, s.shop_name AS accepted_by_shop
       FROM material_enquiries me
       LEFT JOIN suppliers s ON s.id = me.accepted_by_supplier_id
       ORDER BY me.created_at DESC`
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
