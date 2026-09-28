export function productHasOffer(product) {
  const originalPrice = Number(product?.compare_at_price);
  const buyNowPrice = Number(product?.price);
  return Number.isFinite(originalPrice) && Number.isFinite(buyNowPrice) && originalPrice > buyNowPrice && buyNowPrice > 0;
}

export function cartUnitPrice(product, quantity = 1) {
  const base = Number(product?.price);
  if (!(base > 0)) return 0;
  const tier = (product?.bulk_pricing || []).filter((entry) => quantity >= Number(entry.min_quantity)).sort((a, b) => Number(b.min_quantity) - Number(a.min_quantity))[0];
  return tier ? Number(tier.price) : base;
}

function categoryMatches(coupon, product) {
  const categories = Array.isArray(coupon?.applicable_categories) ? coupon.applicable_categories : [];
  return !categories.length || categories.some((category) => String(category).trim().toLowerCase() === String(product?.category?.name || product?.category || '').trim().toLowerCase());
}

export function calculateCoupon(cart, coupon) {
  const offerAmount = cart.filter(({ product }) => productHasOffer(product)).reduce((total, item) => total + cartUnitPrice(item.product, item.quantity) * item.quantity, 0);
  const eligibleAmount = cart.filter(({ product }) => !productHasOffer(product) && categoryMatches(coupon, product)).reduce((total, item) => total + cartUnitPrice(item.product, item.quantity) * item.quantity, 0);
  const regularAmount = cart.filter(({ product }) => !productHasOffer(product)).reduce((total, item) => total + cartUnitPrice(item.product, item.quantity) * item.quantity, 0);
  const minimum = Math.max(0, Number(coupon?.min_cart_value) || 0);
  const eligible = Boolean(coupon) && eligibleAmount >= minimum;
  let discount = 0;
  if (eligible) {
    discount = coupon.discount_type === 'flat'
      ? Number(coupon.discount_value) || 0
      : eligibleAmount * ((Number(coupon.discount_value) || 0) / 100);
    if (coupon.discount_type === 'percentage' && Number(coupon.max_discount_cap) > 0) discount = Math.min(discount, Number(coupon.max_discount_cap));
    discount = Math.min(discount, eligibleAmount);
  }
  return { offerAmount, regularAmount, eligibleAmount, eligible, discount: Math.round(discount * 100) / 100, gap: Math.max(0, minimum - eligibleAmount) };
}

export function couponIsCurrentlyActive(coupon, now = new Date()) {
  if (!coupon?.is_active) return false;
  const start = coupon.start_date ? new Date(coupon.start_date) : null;
  // PostgreSQL returns DATE columns as Date objects, while browser/API payloads may
  // contain YYYY-MM-DD strings. Normalise both without turning a Date into an
  // invalid "Mon ... GMT...T23:59" string.
  const end = coupon.end_date ? new Date(coupon.end_date) : null;
  if (end && !Number.isNaN(end.getTime())) end.setHours(23, 59, 59, 999);
  return (!start || start <= now) && (!end || end >= now);
}
