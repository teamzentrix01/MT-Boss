import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { getCashbackSettings } from '@/lib/cashback/service';

export async function GET(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const settings = await getCashbackSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('GET /api/admin/cashback/settings error:', error);
    return NextResponse.json({ success: false, error: 'Could not fetch settings' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const enabled = body.enabled !== false;
    const stackingMode = body.stacking_mode === 'SUM' ? 'SUM' : 'HIGHEST';
    const allowWithCoupon = body.allow_with_coupon !== false;
    const calcBase = body.calc_base === 'BEFORE_DISCOUNT' ? 'BEFORE_DISCOUNT' : 'AFTER_DISCOUNT';
    const maxCashbackPerOrder = body.max_cashback_per_order !== '' && body.max_cashback_per_order != null
      ? Math.max(0, Number(body.max_cashback_per_order))
      : null;
    const pendingDays = Math.max(0, Number.parseInt(body.pending_days ?? 7, 10));
    const expiryDays = Math.max(0, Number.parseInt(body.expiry_days ?? 0, 10));

    // Wallet Redemption settings
    const redeemEnabled = body.redeem_enabled !== false;
    const maxRedeemPercentOfOrder = Math.min(100, Math.max(0, Number(body.max_redeem_percent_of_order ?? 10)));
    const minOrderForRedeem = Math.max(0, Number(body.min_order_for_redeem ?? 0));
    const minRedeemAmount = Math.max(0, Number(body.min_redeem_amount ?? 0));
    const allowRedeemWithCoupon = body.allow_redeem_with_coupon !== false;
    const cashbackOnWalletPaidAmount = Boolean(body.cashback_on_wallet_paid_amount);

    const result = await pool.query(
      `INSERT INTO cashback_settings (
        id, enabled, stacking_mode, allow_with_coupon, calc_base, max_cashback_per_order, pending_days, expiry_days,
        redeem_enabled, max_redeem_percent_of_order, min_order_for_redeem, min_redeem_amount,
        allow_redeem_with_coupon, cashback_on_wallet_paid_amount, updated_at
      ) VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
      ON CONFLICT (id) DO UPDATE SET
        enabled = EXCLUDED.enabled,
        stacking_mode = EXCLUDED.stacking_mode,
        allow_with_coupon = EXCLUDED.allow_with_coupon,
        calc_base = EXCLUDED.calc_base,
        max_cashback_per_order = EXCLUDED.max_cashback_per_order,
        pending_days = EXCLUDED.pending_days,
        expiry_days = EXCLUDED.expiry_days,
        redeem_enabled = EXCLUDED.redeem_enabled,
        max_redeem_percent_of_order = EXCLUDED.max_redeem_percent_of_order,
        min_order_for_redeem = EXCLUDED.min_order_for_redeem,
        min_redeem_amount = EXCLUDED.min_redeem_amount,
        allow_redeem_with_coupon = EXCLUDED.allow_redeem_with_coupon,
        cashback_on_wallet_paid_amount = EXCLUDED.cashback_on_wallet_paid_amount,
        updated_at = NOW()
      RETURNING *`,
      [
        enabled,
        stackingMode,
        allowWithCoupon,
        calcBase,
        maxCashbackPerOrder,
        pendingDays,
        expiryDays,
        redeemEnabled,
        maxRedeemPercentOfOrder,
        minOrderForRedeem,
        minRedeemAmount,
        allowRedeemWithCoupon,
        cashbackOnWalletPaidAmount,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PUT /api/admin/cashback/settings error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not update settings' }, { status: 500 });
  }
}
