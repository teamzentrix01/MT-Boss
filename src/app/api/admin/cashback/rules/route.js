import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { validateSlabs } from '@/lib/cashback/calculate';

export async function GET(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    let query = `
      SELECT r.*, c.name AS category_name
      FROM cashback_rules r
      LEFT JOIN shop_categories c ON c.id = r.category_id
    `;
    const params = [];
    if (type) {
      query += ` WHERE r.rule_type = $1`;
      params.push(type.toUpperCase());
    }
    query += ` ORDER BY r.rule_type, r.priority ASC, r.id ASC`;

    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET /api/admin/cashback/rules error:', error);
    return NextResponse.json({ success: false, error: 'Could not fetch rules' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const ruleType = String(body.rule_type || '').trim().toUpperCase();
    if (!['FIRST_ORDER', 'CATEGORY', 'SLAB'].includes(ruleType)) {
      return NextResponse.json({ success: false, error: 'Rule type must be FIRST_ORDER, CATEGORY, or SLAB' }, { status: 400 });
    }

    const valueType = body.value_type === 'FLAT' ? 'FLAT' : 'PERCENT';
    const value = Math.max(0, Number(body.value || 0));
    const minOrderValue = Math.max(0, Number(body.min_order_value || 0));
    const maxCashback = body.max_cashback !== '' && body.max_cashback != null ? Math.max(0, Number(body.max_cashback)) : null;
    const startDate = body.start_date || null;
    const endDate = body.end_date || null;
    const isActive = body.is_active !== false;
    const priority = Number.parseInt(body.priority || 0, 10);
    const categoryId = ruleType === 'CATEGORY' ? Number(body.category_id) : null;
    const slabs = ruleType === 'SLAB' ? (Array.isArray(body.slabs) ? body.slabs : []) : [];

    if (ruleType === 'CATEGORY') {
      if (!Number.isInteger(categoryId) || categoryId <= 0) {
        return NextResponse.json({ success: false, error: 'Select a valid category for category rule' }, { status: 400 });
      }
      if (value <= 0) {
        return NextResponse.json({ success: false, error: 'Enter a valid cashback value greater than 0' }, { status: 400 });
      }
    }

    if (ruleType === 'FIRST_ORDER') {
      if (value <= 0) {
        return NextResponse.json({ success: false, error: 'Enter a valid cashback value greater than 0' }, { status: 400 });
      }
    }

    if (ruleType === 'SLAB') {
      const slabValidation = validateSlabs(slabs);
      if (!slabValidation.valid) {
        return NextResponse.json({ success: false, error: slabValidation.error }, { status: 400 });
      }
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return NextResponse.json({ success: false, error: 'End date cannot be earlier than start date' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO cashback_rules (
        rule_type, value_type, value, category_id, slabs, min_order_value, max_cashback, start_date, end_date, is_active, priority
      ) VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        ruleType,
        valueType,
        value,
        categoryId,
        JSON.stringify(slabs),
        minOrderValue,
        maxCashback,
        startDate,
        endDate,
        isActive,
        priority,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/cashback/rules error:', error);
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'An active rule of this type or category already exists. Please deactivate or edit the existing rule.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: error.message || 'Could not create rule' }, { status: 500 });
  }
}
