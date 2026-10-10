import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireActiveUser } from '@/lib/user-moderation';
import { previewCartCashback } from '@/lib/cashback/service';

export async function POST(req) {
  try {
    const { user } = await requireActiveUser(req);
    const body = await req.json();

    const items = Array.isArray(body.items) ? body.items : [];
    const subtotal = Math.max(0, Number(body.subtotal || 0));
    const couponDiscount = Math.max(0, Number(body.coupon_discount || 0));
    const hasCoupon = Boolean(body.coupon_code || couponDiscount > 0);

    // If client provided product_ids, we can fetch real category_ids for accuracy
    const productIds = items.map((it) => Number(it.product_id)).filter((id) => Number.isInteger(id) && id > 0);
    const categoryMap = new Map();

    if (productIds.length > 0) {
      const prodRes = await pool.query(
        `SELECT m.id, m.category, c.id AS category_id
         FROM supplier_materials m
         LEFT JOIN shop_categories c ON LOWER(TRIM(c.name)) = LOWER(TRIM(m.category))
         WHERE m.id = ANY($1::int[])`,
        [productIds]
      );
      for (const row of prodRes.rows) {
        categoryMap.set(row.id, row.category_id);
      }
    }

    const enhancedItems = items.map((it) => {
      const catId = it.category_id || categoryMap.get(Number(it.product_id)) || null;
      return {
        ...it,
        category_id: catId,
      };
    });

    const preview = await previewCartCashback({
      userId: user?.id || null,
      items: enhancedItems,
      subtotal,
      couponDiscount,
      hasCoupon,
    });

    return NextResponse.json({
      success: true,
      data: {
        totalCashback: preview.totalCashback,
        breakdown: preview.breakdown,
        capped: preview.capped,
      },
    });
  } catch (error) {
    console.error('POST /api/cashback/preview error:', error);
    return NextResponse.json({ success: false, error: 'Could not preview cashback' }, { status: 500 });
  }
}
