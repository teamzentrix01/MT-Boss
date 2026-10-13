import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensurePackageSchema, getPackages } from '@/lib/packages';
import { requireRole, unauthorized } from '@/lib/auth';

// GET - List all packages for admin (including inactive)
export async function GET(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    await ensurePackageSchema();
    const packages = await getPackages({ includeInactive: true });
    return NextResponse.json({ success: true, packages, plans: packages });
  } catch (error) {
    console.error('Admin packages plan fetch error:', error);
    return NextResponse.json({ error: 'Server error fetching plans' }, { status: 500 });
  }
}

// POST - Create or update a package plan
export async function POST(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    await ensurePackageSchema();
    const body = await req.json();
    let {
      id,
      name,
      duration_months,
      price,
      label,
      description,
      is_active,
      sort_order,
      target_role,
    } = body;

    const trimmedName = String(name || '').trim();
    if (!trimmedName) {
      return NextResponse.json({ error: 'Plan name is required' }, { status: 400 });
    }

    const durationNum = parseInt(duration_months, 10);
    if (!durationNum || durationNum <= 0) {
      return NextResponse.json({ error: 'Duration in months must be greater than 0' }, { status: 400 });
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json({ error: 'Valid price (₹) is required' }, { status: 400 });
    }

    // Auto-generate or sanitize ID
    let planId = String(id || '').trim();
    if (!planId) {
      const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      planId = `pkg_${slug || durationNum + 'm'}_${Date.now().toString(36)}`;
    }

    const displayLabel = String(label || '').trim() || `${trimmedName} Plan`;
    const descText = String(description || '').trim();
    const activeBool = is_active !== false && is_active !== 'false';
    const sortNum = parseInt(sort_order, 10) || 0;
    const roleStr = (target_role === 'both' || target_role === 'all')
      ? 'all'
      : (['vendor', 'supplier'].includes(target_role) ? target_role : 'all');

    const result = await pool.query(
      `INSERT INTO subscription_packages (
        id, name, duration_months, price, label, description, is_active, sort_order, target_role, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        duration_months = EXCLUDED.duration_months,
        price = EXCLUDED.price,
        label = EXCLUDED.label,
        description = EXCLUDED.description,
        is_active = EXCLUDED.is_active,
        sort_order = EXCLUDED.sort_order,
        target_role = EXCLUDED.target_role,
        updated_at = NOW()
      RETURNING *`,
      [planId, trimmedName, durationNum, priceNum, displayLabel, descText, activeBool, sortNum, roleStr]
    );

    return NextResponse.json({
      success: true,
      message: 'Plan saved successfully',
      package: result.rows[0],
      plan: result.rows[0],
    });
  } catch (error) {
    console.error('Admin save package plan error:', error);
    return NextResponse.json({ error: error.message || 'Server error saving plan' }, { status: 500 });
  }
}

// DELETE - Delete a package plan
export async function DELETE(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    await ensurePackageSchema();
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');
    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch (_) {}
    }

    if (!id) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    // Check if any vendors or suppliers have this package active
    const checkActive = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM vendors WHERE package_id = $1 AND package_status IN ('active', 'pending')`,
      [id]
    );
    const activeCount = checkActive.rows[0]?.cnt || 0;

    if (activeCount > 0) {
      // Soft-deactivate to avoid breaking existing vendor subscriptions
      await pool.query(
        `UPDATE subscription_packages SET is_active = FALSE, updated_at = NOW() WHERE id = $1`,
        [id]
      );
      return NextResponse.json({
        success: true,
        message: `Plan has ${activeCount} active/pending subscribers. It has been deactivated so new users cannot select it.`,
        deactivated: true,
      });
    }

    await pool.query(`DELETE FROM subscription_packages WHERE id = $1`, [id]);
    return NextResponse.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Admin delete package plan error:', error);
    return NextResponse.json({ error: 'Server error deleting plan' }, { status: 500 });
  }
}
