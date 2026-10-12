import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireActiveUser } from '@/lib/user-moderation';
import { computeRedeemLimit } from '@/lib/wallet/redeem';
import { handleApiError } from '@/lib/api-utils';

export async function POST(req) {
  try {
    const { user, blocked } = await requireActiveUser(req);
    if (blocked) {
      return NextResponse.json({ success: false, error: 'Account blocked' }, { status: 403 });
    }
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const userId = Number.parseInt(user.id, 10);
    if (!userId || userId <= 0 || Number.isNaN(userId)) {
      return NextResponse.json({
        success: true,
        data: {
          maxAllowed: 0,
          applied: 0,
          reason: 'No customer wallet account found',
          balance: 0,
          maxPercent: 0,
          payableAmount: 0,
          hasCoupon: false,
        },
      });
    }

    const body = await req.json();
    const { items = [], couponId = null, selectedCity = '', requestedAmount = null } = body;

    // 1. Re-validate cart items server-side from PostgreSQL
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          maxAllowed: 0,
          applied: 0,
          reason: 'Cart is empty',
          balance: 0,
          maxPercent: 0,
          payableAmount: 0,
          hasCoupon: false,
        },
      });
    }

    const itemIds = items.map((i) => Number(i.id)).filter(Boolean);
    let verifiedSubtotal = 0;

    if (itemIds.length > 0) {
      const productsRes = await pool.query(
        `SELECT id, name, price FROM supplier_materials WHERE id = ANY($1::int[])`,
        [itemIds]
      );
      const productMap = new Map();
      productsRes.rows.forEach((p) => productMap.set(p.id, p));

      for (const item of items) {
        const prod = productMap.get(Number(item.id));
        const unitPrice = prod && prod.price != null
          ? Number(prod.price || 0)
          : Number(item.price || 0);
        const qty = Math.max(1, Number(item.quantity) || 1);
        verifiedSubtotal += unitPrice * qty;
      }
    } else {
      for (const item of items) {
        const unitPrice = Number(item.price || 0);
        const qty = Math.max(1, Number(item.quantity) || 1);
        verifiedSubtotal += unitPrice * qty;
      }
    }

    // 2. Validate coupon if provided
    let couponDiscount = 0;
    let hasCoupon = false;
    if (couponId) {
      const couponRes = await pool.query(
        `SELECT * FROM shop_coupons 
         WHERE (id = $1::int OR code = $2) 
           AND is_active = true 
           AND (end_date IS NULL OR end_date >= CURRENT_DATE)
           AND (start_date IS NULL OR start_date <= CURRENT_DATE)`,
        [isNaN(Number(couponId)) ? -1 : Number(couponId), String(couponId)]
      );
      if (couponRes.rows.length > 0) {
        const coupon = couponRes.rows[0];
        const minOrder = Number(coupon.min_cart_value || 0);
        if (verifiedSubtotal >= minOrder) {
          hasCoupon = true;
          if (coupon.discount_type === 'PERCENT') {
            const calculated = (verifiedSubtotal * Number(coupon.discount_value)) / 100;
            couponDiscount = coupon.max_discount_cap
              ? Math.min(calculated, Number(coupon.max_discount_cap))
              : calculated;
          } else {
            couponDiscount = Math.min(Number(coupon.discount_value), verifiedSubtotal);
          }
        }
      }
    }

    const payableAmount = Math.max(0, verifiedSubtotal - couponDiscount);

    // 3. Compute redeem limit using the central wallet service
    const redeemCalc = await computeRedeemLimit(userId, payableAmount, hasCoupon);

    // 4. Calculate applied amount based on requestedAmount
    let applied = redeemCalc.maxAllowed;
    if (requestedAmount !== null && requestedAmount !== undefined && requestedAmount !== '') {
      const reqNum = Math.max(0, Number(requestedAmount));
      applied = Math.min(reqNum, redeemCalc.maxAllowed);
      applied = Math.round(applied * 100) / 100;
    }

    return NextResponse.json({
      success: true,
      data: {
        maxAllowed: redeemCalc.maxAllowed,
        applied,
        reason: redeemCalc.reason,
        balance: redeemCalc.balance,
        maxPercent: redeemCalc.maxPercent,
        payableAmount,
        hasCoupon,
      },
    });
  } catch (error) {
    console.error('POST /api/wallet/redeem-preview error:', error);
    return handleApiError(error);
  }
}
