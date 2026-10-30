import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';
import { promotionIsCurrentlyActive } from '@/lib/promotion-calculations';

const ensurePromotions = createInitializationGuard(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS shop_promotions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    promo_type VARCHAR(32) NOT NULL DEFAULT 'percentage',
    discount_value NUMERIC(12,2) NOT NULL DEFAULT 0,
    max_discount_cap NUMERIC(12,2),
    min_cart_value NUMERIC(12,2) NOT NULL DEFAULT 0,
    applicable_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
    free_shipping_same_city_only BOOLEAN NOT NULL DEFAULT FALSE,
    badge_text VARCHAR(255),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  // Seed default promotions if table is empty
  const countRes = await pool.query('SELECT count(*) FROM shop_promotions');
  if (parseInt(countRes.rows[0].count, 10) === 0) {
    await pool.query(`INSERT INTO shop_promotions 
      (name, promo_type, discount_value, max_discount_cap, min_cart_value, badge_text, description, free_shipping_same_city_only, is_active)
      VALUES 
      ('5% Extra Discount on ₹50k+ Shopping', 'percentage', 5.00, NULL, 50000.00, '5% Extra OFF on orders above ₹50,000', 'Get 5% extra discount automatically when your cart reaches ₹50,000 or more.', FALSE, TRUE),
      ('Free Shipping on ₹50k+ Orders', 'free_shipping', 0.00, NULL, 50000.00, 'Free Delivery on orders above ₹50,000', 'Enjoy 100% Free Shipping charges on all orders above ₹50,000.', FALSE, TRUE)
    `);
  }
});

function serialize(row) {
  return {
    ...row,
    discount_value: Number(row.discount_value) || 0,
    max_discount_cap: row.max_discount_cap !== null && row.max_discount_cap !== undefined ? Number(row.max_discount_cap) : null,
    min_cart_value: Number(row.min_cart_value) || 0,
    applicable_categories: Array.isArray(row.applicable_categories) ? row.applicable_categories : [],
    free_shipping_same_city_only: Boolean(row.free_shipping_same_city_only),
    is_active: Boolean(row.is_active),
    start_date: row.start_date ? String(row.start_date).slice(0, 10) : null,
    end_date: row.end_date ? String(row.end_date).slice(0, 10) : null,
  };
}

function validate(body) {
  const name = String(body.name || '').trim();
  if (!name) throw new Error('Promotion name is required');

  const promoType = ['percentage', 'flat', 'free_shipping'].includes(body.promo_type)
    ? body.promo_type
    : 'percentage';

  const minCart = Number(body.min_cart_value || 0);
  if (Number.isNaN(minCart) || minCart < 0) throw new Error('Minimum cart value must be 0 or more');

  let discountValue = Number(body.discount_value || 0);
  if (promoType === 'percentage') {
    if (discountValue <= 0 || discountValue > 100) throw new Error('Percentage discount must be between 0.01% and 100%');
  } else if (promoType === 'flat') {
    if (discountValue <= 0) throw new Error('Flat discount amount must be greater than 0');
  } else if (promoType === 'free_shipping') {
    discountValue = 0;
  }

  const cap = body.max_discount_cap === '' || body.max_discount_cap == null ? null : Number(body.max_discount_cap);
  if (cap !== null && (Number.isNaN(cap) || cap < 0)) throw new Error('Maximum discount cap must be 0 or more');

  const categories = Array.isArray(body.applicable_categories)
    ? [...new Set(body.applicable_categories.map((v) => String(v).trim()).filter(Boolean))]
    : [];

  const freeShippingSameCityOnly = Boolean(body.free_shipping_same_city_only);
  const badgeText = String(body.badge_text || '').trim() || null;
  const description = String(body.description || '').trim() || null;
  const isActive = body.is_active !== false;
  const start = body.start_date || null;
  const end = body.end_date || null;

  if (start && end && new Date(end) < new Date(start)) {
    throw new Error('End date cannot be earlier than start date');
  }

  return {
    name,
    promoType,
    discountValue,
    cap,
    minCart,
    categories,
    freeShippingSameCityOnly,
    badgeText,
    description,
    isActive,
    start,
    end,
  };
}

export async function GET(req) {
  try {
    await ensurePromotions();
    const isAdmin = Boolean(requireRole(req, 'admin'));
    const result = await pool.query(
      `SELECT * FROM shop_promotions ${isAdmin ? '' : 'WHERE is_active=TRUE'} ORDER BY min_cart_value ASC, id DESC`
    );
    const data = result.rows.map(serialize).filter((promo) => isAdmin || promotionIsCurrentlyActive(promo));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load promotions' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!requireRole(req, 'admin')) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }
  try {
    await ensurePromotions();
    const p = validate(await req.json());
    const result = await pool.query(
      `INSERT INTO shop_promotions 
        (name, promo_type, discount_value, max_discount_cap, min_cart_value, applicable_categories, free_shipping_same_city_only, badge_text, description, is_active, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [p.name, p.promoType, p.discountValue, p.cap, p.minCart, JSON.stringify(p.categories), p.freeShippingSameCityOnly, p.badgeText, p.description, p.isActive, p.start, p.end]
    );
    return NextResponse.json({ success: true, data: serialize(result.rows[0]) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  if (!requireRole(req, 'admin')) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }
  try {
    await ensurePromotions();
    const body = await req.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid promotion ID');
    const p = validate(body);
    const result = await pool.query(
      `UPDATE shop_promotions 
       SET name=$1, promo_type=$2, discount_value=$3, max_discount_cap=$4, min_cart_value=$5, applicable_categories=$6::jsonb, free_shipping_same_city_only=$7, badge_text=$8, description=$9, is_active=$10, start_date=$11, end_date=$12, updated_at=NOW()
       WHERE id=$13
       RETURNING *`,
      [p.name, p.promoType, p.discountValue, p.cap, p.minCart, JSON.stringify(p.categories), p.freeShippingSameCityOnly, p.badgeText, p.description, p.isActive, p.start, p.end, id]
    );
    if (!result.rows[0]) throw new Error('Promotion not found');
    return NextResponse.json({ success: true, data: serialize(result.rows[0]) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  if (!requireRole(req, 'admin')) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }
  try {
    await ensurePromotions();
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!Number.isInteger(id) || id <= 0) throw new Error('Invalid promotion ID');
    await pool.query('DELETE FROM shop_promotions WHERE id=$1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
