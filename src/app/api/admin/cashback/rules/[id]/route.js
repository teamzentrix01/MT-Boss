import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { validateSlabs } from '@/lib/cashback/calculate';
import { ensureCashbackSchema } from '@/lib/cashback/service';

export async function PUT(req, { params }) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureCashbackSchema();
    const { id } = await params;
    const ruleId = Number(id);
    if (!Number.isInteger(ruleId) || ruleId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid rule ID' }, { status: 400 });
    }

    const body = await req.json();
    const valueType = body.value_type === 'FLAT' ? 'FLAT' : 'PERCENT';
    const numValue = Number(body.value);
    const value = Number.isFinite(numValue) ? Math.max(0, numValue) : 0;

    const numMinOrder = Number(body.min_order_value);
    const minOrderValue = Number.isFinite(numMinOrder) ? Math.max(0, numMinOrder) : 0;

    const parsedMaxCashback = Number(body.max_cashback);
    const maxCashback = body.max_cashback !== '' && body.max_cashback != null && Number.isFinite(parsedMaxCashback)
      ? Math.max(0, parsedMaxCashback)
      : null;

    const startDate = body.start_date || null;
    const endDate = body.end_date || null;
    const isActive = body.is_active !== false;

    const parsedPriority = Number.parseInt(body.priority || 0, 10);
    const priority = Number.isFinite(parsedPriority) ? parsedPriority : 0;

    const parsedCatId = Number(body.category_id);
    const categoryId = body.category_id != null && Number.isInteger(parsedCatId) ? parsedCatId : null;
    const slabs = Array.isArray(body.slabs) ? body.slabs : [];

    // Verify existing rule
    const existingRes = await pool.query('SELECT * FROM cashback_rules WHERE id = $1', [ruleId]);
    const existing = existingRes.rows[0];
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Rule not found' }, { status: 404 });
    }

    if (existing.rule_type === 'SLAB') {
      const slabValidation = validateSlabs(slabs);
      if (!slabValidation.valid) {
        return NextResponse.json({ success: false, error: slabValidation.error }, { status: 400 });
      }
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return NextResponse.json({ success: false, error: 'End date cannot be earlier than start date' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE cashback_rules SET
        value_type = $1,
        value = $2,
        category_id = COALESCE($3, category_id),
        slabs = $4::jsonb,
        min_order_value = $5,
        max_cashback = $6,
        start_date = $7,
        end_date = $8,
        is_active = $9,
        priority = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *`,
      [
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
        ruleId,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PUT /api/admin/cashback/rules/[id] error:', error);
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Another active rule of this type or category already exists.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: error.message || 'Could not update rule' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureCashbackSchema();
    const { id } = await params;
    const ruleId = Number(id);
    if (!Number.isInteger(ruleId) || ruleId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid rule ID' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM cashback_rules WHERE id = $1 RETURNING id', [ruleId]);
    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Rule not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Rule deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/admin/cashback/rules/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not delete rule' }, { status: 500 });
  }
}

