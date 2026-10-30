import { cartUnitPrice } from './coupon-calculations.js';

export function promotionIsCurrentlyActive(promotion, now = new Date()) {
  if (!promotion || promotion.is_active === false) return false;
  const start = promotion.start_date ? new Date(promotion.start_date) : null;
  const end = promotion.end_date ? new Date(promotion.end_date) : null;
  if (end && !Number.isNaN(end.getTime())) end.setHours(23, 59, 59, 999);
  return (!start || start <= now) && (!end || end >= now);
}

function categoryMatches(promotion, product) {
  const categories = Array.isArray(promotion?.applicable_categories) ? promotion.applicable_categories : [];
  if (!categories.length) return true;
  const prodCategory = String(product?.category?.name || product?.category || '').trim().toLowerCase();
  return categories.some((c) => String(c).trim().toLowerCase() === prodCategory);
}

export function calculatePromotion(cart = [], promotion) {
  if (!promotion || !promotionIsCurrentlyActive(promotion)) {
    return {
      eligible: false,
      discount: 0,
      freeShipping: false,
      gap: Math.max(0, Number(promotion?.min_cart_value) || 0),
      eligibleAmount: 0,
      totalAmount: 0,
    };
  }

  const items = Array.isArray(cart) ? cart : [];
  let totalAmount = 0;
  let eligibleAmount = 0;

  for (const item of items) {
    const prod = item.product || item;
    const qty = Number(item.quantity) || 1;
    const price = cartUnitPrice(prod, qty);
    const lineTotal = price * qty;
    totalAmount += lineTotal;

    if (categoryMatches(promotion, prod)) {
      eligibleAmount += lineTotal;
    }
  }

  const minSpend = Math.max(0, Number(promotion.min_cart_value) || 0);
  // Spend threshold applies to eligibleAmount (or totalAmount if all categories)
  const thresholdBasis = promotion.applicable_categories?.length ? eligibleAmount : totalAmount;
  const eligible = thresholdBasis >= minSpend;
  const gap = Math.max(0, minSpend - thresholdBasis);

  let discount = 0;
  let freeShipping = false;

  if (eligible) {
    if (promotion.promo_type === 'percentage') {
      const pct = Number(promotion.discount_value) || 0;
      discount = eligibleAmount * (pct / 100);
      const cap = Number(promotion.max_discount_cap);
      if (cap > 0 && discount > cap) {
        discount = cap;
      }
      discount = Math.min(discount, eligibleAmount);
    } else if (promotion.promo_type === 'flat') {
      discount = Math.min(Number(promotion.discount_value) || 0, eligibleAmount);
    } else if (promotion.promo_type === 'free_shipping') {
      freeShipping = true;
      discount = 0;
    }
  }

  return {
    eligible,
    discount: Math.round(discount * 100) / 100,
    freeShipping,
    gap: Math.round(gap * 100) / 100,
    eligibleAmount: Math.round(eligibleAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    promotion,
  };
}

export function evaluateCartPromotions(cart = [], promotions = []) {
  const activeList = (Array.isArray(promotions) ? promotions : []).filter(promotionIsCurrentlyActive);

  // Discount promotions (percentage or flat)
  const discountEvaluations = activeList
    .filter((p) => p.promo_type === 'percentage' || p.promo_type === 'flat')
    .map((p) => ({ promotion: p, calc: calculatePromotion(cart, p) }))
    .filter(({ calc }) => calc.eligible)
    .sort((a, b) => b.calc.discount - a.calc.discount);

  const bestDiscount = discountEvaluations[0] || null;

  // Free shipping promotions
  const freeShippingEvaluations = activeList
    .filter((p) => p.promo_type === 'free_shipping')
    .map((p) => ({ promotion: p, calc: calculatePromotion(cart, p) }))
    .filter(({ calc }) => calc.eligible);

  const activeFreeShipping = freeShippingEvaluations[0] || null;

  // Next unlocked promotion (smallest gap)
  const lockedPromos = activeList
    .map((p) => ({ promotion: p, calc: calculatePromotion(cart, p) }))
    .filter(({ calc }) => !calc.eligible && calc.gap > 0)
    .sort((a, b) => a.calc.gap - b.calc.gap);

  const nextPromotion = lockedPromos[0] || null;

  return {
    bestDiscount,
    discountAmount: bestDiscount ? bestDiscount.calc.discount : 0,
    activeFreeShipping,
    hasFreeShipping: Boolean(activeFreeShipping),
    nextPromotion,
    allPromotions: activeList,
  };
}
