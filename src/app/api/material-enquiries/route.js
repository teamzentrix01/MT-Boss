import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { createInitializationGuard } from '@/lib/api-utils';
import { resolveManagedCity } from '@/lib/cities';
import { requireRole } from '@/lib/auth';
import { addMaterialOrderEvent, ensureMaterialOrderSchema } from '@/lib/material-orders';
import { notifyAdminSubmission, deliverMaterialOrderReceipt } from '@/lib/customer-communications';

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
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json({ success: false, error: 'Live location is required for material enquiries' }, { status: 400 });
    }
    if (isCart && orderItems.some((item) => {
      const quantity = Number(item.quantity);
      return !cleanText(item.material_type) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10000;
    })) {
      return NextResponse.json({ success: false, error: 'Each cart item needs a material and valid quantity' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const orders = [];
      for (const item of orderItems) {
        let indicativeUnitPrice = null;
        const coverage = await client.query(`SELECT 1 WHERE EXISTS (
          SELECT 1 FROM suppliers s WHERE LOWER(s.city)=LOWER($1)
            AND s.status='approved' AND s.is_active=TRUE
            AND EXISTS (SELECT 1 FROM unnest(s.product_categories) cat WHERE LOWER(cat)=LOWER($2))
        ) OR EXISTS (
          SELECT 1 FROM supplier_materials m WHERE m.supplier_id=0 AND m.is_available=TRUE AND m.quantity>0
            AND LOWER(TRIM(m.category))=LOWER(TRIM($2))
            AND EXISTS (SELECT 1 FROM jsonb_array_elements_text(COALESCE(m.available_cities, '[]'::jsonb)) city WHERE LOWER(city)=LOWER($1))
        )`, [canonicalCity, cleanText(item.category_name)]);
        if (!coverage.rows.length) {
          const failure = new Error(`${item.category_name} is not available for delivery in ${canonicalCity}.`);
          failure.status = 409;
          throw failure;
        }
        if (item.product_id) {
          const requestedQuantity = isCart ? Number(item.quantity) : Number.parseInt(String(quantity_text || ''), 10);
          const productResult = await client.query(
            `SELECT name, category, unit, quantity, price, bulk_pricing, is_available, supplier_id, available_cities FROM supplier_materials WHERE id=$1 FOR UPDATE`,
            [item.product_id]
          );
          const product = productResult.rows[0];
          if (!product || !product.is_available || product.name !== item.material_type || (product.category && product.category !== item.category_name)) {
            const failure = new Error('A product in your order has changed or is unavailable. Refresh Shop Now and try again.');
            failure.status = 409;
            throw failure;
          }
          const hasFixedPrice = Number(product.price) > 0;
          if (orderIntent !== 'quote' && !hasFixedPrice) {
            const failure = new Error(`${product.name} is quote-only. Please use Get Quote instead of adding it to an order.`);
            failure.status = 409;
            throw failure;
          }
          if (product.supplier_id === 0 && !(product.available_cities || []).some((city) => city.toLowerCase() === canonicalCity.toLowerCase())) {
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
        } else if (orderIntent !== 'quote') {
          const failure = new Error('Direct orders require a fixed-price product. Please use Get Quote for custom materials.');
          failure.status = 409;
          throw failure;
        }
        const orderReference = `MO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        const itemQuantity = isCart ? `${item.quantity} ${cleanText(item.order_unit) || 'pcs'}` : quantity_text;
        const result = await client.query(
        `INSERT INTO material_enquiries
           (user_id, order_reference, order_intent, user_name, user_phone, user_email,
            category_name, category_emoji, product_id, indicative_unit_price,
            material_type, subcategory_name, brand_company,
            quantity_text, order_unit, delivery_date,
            delivery_address, latitude, longitude, message, selected_city)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
         RETURNING id, order_reference, order_intent, status, created_at`,
        [
          user.id, orderReference, orderIntent, cleanName, cleanPhone, cleanEmail || user.email || null,
          cleanText(item.category_name), item.category_emoji || '', item.product_id || null, indicativeUnitPrice,
          cleanText(item.material_type) || null, cleanText(item.subcategory_name) || null, cleanText(item.brand_company) || null,
          itemQuantity || null, cleanText(item.order_unit) || null, delivery_date || null,
          delivery_address || null, lat, lng,
          message || null, canonicalCity,
        ]
      );
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
