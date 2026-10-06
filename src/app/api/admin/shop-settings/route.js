import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import {
  getShopVendorCommissionPercent,
  setShopVendorCommissionPercent,
  ensureShopVendorCommissionsSchema,
} from '@/lib/shop-commissions';

export async function GET(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    await ensureShopVendorCommissionsSchema();
    const percent = await getShopVendorCommissionPercent();

    const [statsRes, settingRes] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*)::int AS total_count,
          COALESCE(SUM(commission_amount), 0)::numeric AS total_amount,
          COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END), 0)::numeric AS pending_amount,
          COALESCE(SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END), 0)::numeric AS paid_amount
        FROM shop_vendor_commissions
      `),
      pool.query(`
        SELECT updated_at FROM pm_settings WHERE key = 'shop_vendor_commission_percent' LIMIT 1
      `),
    ]);

    const stats = statsRes.rows[0] || { total_count: 0, total_amount: 0, pending_amount: 0, paid_amount: 0 };
    const updatedAt = settingRes.rows[0]?.updated_at || null;

    return NextResponse.json({
      success: true,
      data: {
        shop_vendor_commission_percent: percent,
        updated_at: updatedAt,
        stats: {
          total_count: Number(stats.total_count || 0),
          total_amount: Number(stats.total_amount || 0),
          pending_amount: Number(stats.pending_amount || 0),
          paid_amount: Number(stats.paid_amount || 0),
        },
      },
    });
  } catch (err) {
    console.error('Error fetching shop settings:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch shop settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) return unauthorized();

    await ensureShopVendorCommissionsSchema();
    const body = await req.json();

    if (body.shop_vendor_commission_percent === undefined && body.commission_percent === undefined) {
      return NextResponse.json(
        { success: false, error: 'shop_vendor_commission_percent is required' },
        { status: 400 }
      );
    }

    const rawValue = body.shop_vendor_commission_percent ?? body.commission_percent;
    const num = Number(rawValue);

    if (!Number.isFinite(num) || num < 0 || num > 100) {
      return NextResponse.json(
        { success: false, error: 'shop_vendor_commission_percent must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    const updatedPercent = await setShopVendorCommissionPercent(num);

    return NextResponse.json({
      success: true,
      message: 'Shop vendor commission percent updated successfully',
      data: {
        shop_vendor_commission_percent: updatedPercent,
      },
    });
  } catch (err) {
    console.error('Error updating shop settings:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update shop settings' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  return PATCH(req);
}
