import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import {
  getShopCommissionRules,
  createOrUpdateShopCommissionRule,
  deleteShopCommissionRule,
  toggleShopCommissionRule,
  getAvailableCommissionTargets,
  resolveCommissionRate,
} from '@/lib/shop-commissions';

export async function GET(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const { searchParams } = new URL(req.url);
    if (searchParams.get('action') === 'resolve') {
      const productId = searchParams.get('product_id') ? Number(searchParams.get('product_id')) : null;
      const categoryId = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : null;
      const category = searchParams.get('category') || null;

      const resolved = await resolveCommissionRate({
        id: productId,
        category_id: categoryId,
        category,
      });

      return NextResponse.json({ success: true, data: resolved });
    }

    const [rules, targets] = await Promise.all([
      getShopCommissionRules(),
      getAvailableCommissionTargets(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        rules,
        targets,
      },
    });
  } catch (err) {
    console.error('Error fetching shop commission rules:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch commission rules' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const body = await req.json();
    const scopeType = body.scope_type || body.scopeType;
    const scopeId = body.scope_id || body.scopeId;
    const commissionPercent = body.commission_percent ?? body.commissionPercent;
    const isActive = body.is_active ?? body.isActive ?? true;

    if (!scopeType || !['category', 'product'].includes(String(scopeType).toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "scope_type must be either 'category' or 'product'" },
        { status: 400 }
      );
    }

    if (!scopeId || isNaN(Number(scopeId))) {
      return NextResponse.json(
        { success: false, error: 'Valid scope_id is required' },
        { status: 400 }
      );
    }

    const rate = Number(commissionPercent);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      return NextResponse.json(
        { success: false, error: 'commission_percent must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    const rule = await createOrUpdateShopCommissionRule({
      scopeType: String(scopeType).toLowerCase(),
      scopeId: Number(scopeId),
      commissionPercent: rate,
      isActive: Boolean(isActive),
    });

    return NextResponse.json({
      success: true,
      message: 'Commission rule saved successfully',
      data: rule,
    });
  } catch (err) {
    console.error('Error saving commission rule:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save commission rule' },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const body = await req.json();
    const id = body.id ? Number(body.id) : null;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rule ID is required' },
        { status: 400 }
      );
    }

    if (body.is_active !== undefined || body.isActive !== undefined) {
      const activeVal = body.is_active !== undefined ? body.is_active : body.isActive;
      const updated = await toggleShopCommissionRule(id, activeVal);
      return NextResponse.json({
        success: true,
        message: `Rule ${activeVal ? 'activated' : 'deactivated'} successfully`,
        data: updated,
      });
    }

    if (body.commission_percent !== undefined) {
      const rate = Number(body.commission_percent);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        return NextResponse.json(
          { success: false, error: 'commission_percent must be a number between 0 and 100' },
          { status: 400 }
        );
      }

      const res = await pool.query(
        'UPDATE shop_commission_rules SET commission_percent = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [rate.toFixed(2), id]
      );
      return NextResponse.json({
        success: true,
        message: 'Commission rate updated successfully',
        data: res.rows[0],
      });
    }

    return NextResponse.json(
      { success: false, error: 'Nothing to update' },
      { status: 400 }
    );
  } catch (err) {
    console.error('Error updating commission rule:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update commission rule' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  return PATCH(req);
}

export async function DELETE(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') ? Number(searchParams.get('id')) : null;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rule ID is required' },
        { status: 400 }
      );
    }

    const deleted = await deleteShopCommissionRule(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Rule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Commission rule deleted successfully',
      data: deleted,
    });
  } catch (err) {
    console.error('Error deleting commission rule:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to delete commission rule' },
      { status: 500 }
    );
  }
}
