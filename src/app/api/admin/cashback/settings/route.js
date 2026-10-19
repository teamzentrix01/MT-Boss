import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { getCashbackSettings, ensureCashbackSchema, processScheduledMaturityAndExpiry } from '@/lib/cashback/service';

export async function GET(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureCashbackSchema();
    try {
      await processScheduledMaturityAndExpiry(pool);
    } catch (settleErr) {
      console.error('Auto-settle on settings GET error:', settleErr);
    }

    const settings = await getCashbackSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('GET /api/admin/cashback/settings error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not fetch settings' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const admin = requireRole(req, 'admin');
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    }

    await ensureCashbackSchema();
    const body = await req.json();
    const enabled = body.enabled !== false;
    const stackingMode = body.stacking_mode === 'SUM' ? 'SUM' : 'HIGHEST';
    const allowWithCoupon = body.allow_with_coupon !== false;
    const calcBase = body.calc_base === 'BEFORE_DISCOUNT' ? 'BEFORE_DISCOUNT' : 'AFTER_DISCOUNT';

    const parsedMaxCashback = Number(body.max_cashback_per_order);
    const maxCashbackPerOrder = body.max_cashback_per_order !== '' && body.max_cashback_per_order != null && Number.isFinite(parsedMaxCashback)
      ? Math.max(0, parsedMaxCashback)
      : null;

    const parsedPending = Number.parseInt(body.pending_days, 10);
    const pendingDays = Number.isFinite(parsedPending) && parsedPending >= 0 ? parsedPending : 7;

    const parsedExpiry = Number.parseInt(body.expiry_days, 10);
    const expiryDays = Number.isFinite(parsedExpiry) && parsedExpiry >= 0 ? parsedExpiry : 0;

    // Wallet Redemption settings
    const redeemEnabled = body.redeem_enabled !== false;

    const parsedMaxRedeem = Number(body.max_redeem_percent_of_order);
    const maxRedeemPercentOfOrder = Number.isFinite(parsedMaxRedeem)
      ? Math.min(100, Math.max(0, parsedMaxRedeem))
      : 10;

    const parsedMinOrderRedeem = Number(body.min_order_for_redeem);
    const minOrderForRedeem = Number.isFinite(parsedMinOrderRedeem) ? Math.max(0, parsedMinOrderRedeem) : 0;

    const parsedMinRedeem = Number(body.min_redeem_amount);
    const minRedeemAmount = Number.isFinite(parsedMinRedeem) ? Math.max(0, parsedMinRedeem) : 0;

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

    // Automatically trigger maturity processor so if pending_days was updated or matured lots exist, balances sync immediately.
    let settleResult = null;
    try {
      settleResult = await processScheduledMaturityAndExpiry(pool);
    } catch (settleErr) {
      console.error('Auto-settle on settings update error:', settleErr);
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      settleResult,
    });
  } catch (error) {
    console.error('PUT /api/admin/cashback/settings error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not update settings' }, { status: 500 });
  }
}

