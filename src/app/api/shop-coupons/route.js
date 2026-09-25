import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';
import { couponIsCurrentlyActive } from '@/lib/coupon-calculations';

const ensureCoupons = createInitializationGuard(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS shop_coupons (
    id SERIAL PRIMARY KEY, code VARCHAR(60), discount_type VARCHAR(12) NOT NULL,
    discount_value NUMERIC(12,2) NOT NULL, max_discount_cap NUMERIC(12,2), min_cart_value NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE, start_date DATE, end_date DATE,
    applicable_categories JSONB NOT NULL DEFAULT '[]'::jsonb, created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
  )`);
  await pool.query('CREATE UNIQUE INDEX IF NOT EXISTS shop_coupons_code_unique ON shop_coupons (LOWER(code)) WHERE code IS NOT NULL');
});

function serialize(row) { return { ...row, code: row.code || null, applicable_categories: Array.isArray(row.applicable_categories) ? row.applicable_categories : [] }; }
function validate(body) {
  const code = String(body.code || '').trim().toUpperCase() || null;
  const discountType = body.discount_type === 'flat' ? 'flat' : body.discount_type === 'percentage' ? 'percentage' : '';
  const value = Number(body.discount_value), cap = body.max_discount_cap === '' || body.max_discount_cap == null ? null : Number(body.max_discount_cap), minimum = Number(body.min_cart_value || 0);
  const categories = Array.isArray(body.applicable_categories) ? [...new Set(body.applicable_categories.map((v) => String(v).trim()).filter(Boolean))] : [];
  if (!discountType || !(value > 0) || !(minimum >= 0) || (cap !== null && !(cap >= 0))) throw new Error('Enter a valid coupon discount and minimum order value');
  if (discountType === 'percentage' && value > 100) throw new Error('Percentage discounts cannot exceed 100%');
  if (body.start_date && body.end_date && new Date(body.end_date) < new Date(body.start_date)) throw new Error('End date cannot be before start date');
  return { code, discountType, value, cap, minimum, categories, isActive: body.is_active !== false, start: body.start_date || null, end: body.end_date || null };
}

export async function GET(req) {
  try {
    await ensureCoupons();
    const isAdmin = Boolean(requireRole(req, 'admin'));
    const result = await pool.query(`SELECT * FROM shop_coupons ${isAdmin ? '' : 'WHERE is_active=TRUE'} ORDER BY is_active DESC, id DESC`);
    return NextResponse.json({ success: true, data: result.rows.map(serialize).filter((coupon) => isAdmin || couponIsCurrentlyActive(coupon)) });
  } catch (error) { return NextResponse.json({ success: false, error: error.message || 'Could not load coupons' }, { status: 500 }); }
}

export async function POST(req) {
  if (!requireRole(req, 'admin')) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  try { await ensureCoupons(); const c = validate(await req.json()); const result = await pool.query(`INSERT INTO shop_coupons (code,discount_type,discount_value,max_discount_cap,min_cart_value,is_active,start_date,end_date,applicable_categories) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb) RETURNING *`, [c.code, c.discountType, c.value, c.cap, c.minimum, c.isActive, c.start, c.end, JSON.stringify(c.categories)]); return NextResponse.json({ success: true, data: serialize(result.rows[0]) }, { status: 201 }); }
  catch (error) { return NextResponse.json({ success: false, error: error.code === '23505' ? 'Coupon code already exists' : error.message }, { status: 400 }); }
}

export async function PUT(req) {
  if (!requireRole(req, 'admin')) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  try { await ensureCoupons(); const body = await req.json(); const id = Number(body.id); if (!Number.isInteger(id)) throw new Error('Invalid coupon'); const c = validate(body); const result = await pool.query(`UPDATE shop_coupons SET code=$1,discount_type=$2,discount_value=$3,max_discount_cap=$4,min_cart_value=$5,is_active=$6,start_date=$7,end_date=$8,applicable_categories=$9::jsonb,updated_at=NOW() WHERE id=$10 RETURNING *`, [c.code, c.discountType, c.value, c.cap, c.minimum, c.isActive, c.start, c.end, JSON.stringify(c.categories), id]); if (!result.rows[0]) throw new Error('Coupon not found'); return NextResponse.json({ success: true, data: serialize(result.rows[0]) }); }
  catch (error) { return NextResponse.json({ success: false, error: error.code === '23505' ? 'Coupon code already exists' : error.message }, { status: 400 }); }
}

export async function DELETE(req) {
  if (!requireRole(req, 'admin')) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  try { await ensureCoupons(); const id = Number(new URL(req.url).searchParams.get('id')); if (!Number.isInteger(id)) throw new Error('Invalid coupon'); await pool.query('DELETE FROM shop_coupons WHERE id=$1', [id]); return NextResponse.json({ success: true }); }
  catch (error) { return NextResponse.json({ success: false, error: error.message }, { status: 400 }); }
}
