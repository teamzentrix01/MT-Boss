/**
 * Pure calculation logic for MT Boss Cashback System.
 * Free of side-effects or DB dependencies for easy unit-testing and determinism.
 */

/**
 * Checks if a date falls within an optional active window [startDate, endDate].
 */
export function isDateWithinWindow(startDate, endDate, now = new Date()) {
  const current = new Date(now);
  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (current < start) return false;
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (current > end) return false;
  }
  return true;
}

/**
 * Validates slab definitions:
 * Ascending "upto" numeric limits with the last slab being open-ended (upto: null or undefined).
 */
export function validateSlabs(slabs) {
  if (!Array.isArray(slabs) || slabs.length === 0) {
    return { valid: false, error: 'Slabs array cannot be empty' };
  }

  let previousLimit = 0;
  for (let i = 0; i < slabs.length; i += 1) {
    const slab = slabs[i];
    const isLast = i === slabs.length - 1;
    const percent = Number(slab.percent);

    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      return { valid: false, error: `Invalid cashback percent at tier ${i + 1}` };
    }

    if (isLast) {
      if (slab.upto !== null && slab.upto !== undefined && slab.upto !== '') {
        return { valid: false, error: 'The last slab tier must be open-ended (upto: null)' };
      }
    } else {
      const upto = Number(slab.upto);
      if (!Number.isFinite(upto) || upto <= previousLimit) {
        return { valid: false, error: `Slab limits must be strictly ascending (tier ${i + 1} must be > ${previousLimit})` };
      }
      previousLimit = upto;
    }
  }

  return { valid: true };
}

/**
 * Calculates cashback for an order.
 *
 * @param {Object} params
 * @param {Array} params.items - Cart items [{ category_id, category_name, price, quantity, total }]
 * @param {number} params.subtotal - Total product amount before coupon discount
 * @param {number} params.couponDiscount - Applied coupon discount amount
 * @param {boolean} params.hasCoupon - Whether a coupon was used
 * @param {boolean} params.isFirstOrder - Whether this customer has zero prior delivered orders
 * @param {Array} params.rules - Active cashback rules from DB
 * @param {Object} params.settings - Global cashback settings from DB
 * @param {number} [params.walletUsed=0] - Amount paid using wallet balance
 * @param {Date} [params.now=new Date()] - Reference timestamp for window validation
 *
 * @returns {Object} { totalCashback, breakdown, capped, effectiveEligibleAmount }
 */
export function calculateCashback({
  items = [],
  subtotal = 0,
  couponDiscount = 0,
  hasCoupon = false,
  walletUsed = 0,
  isFirstOrder = false,
  rules = [],
  settings = {},
  now = new Date(),
}) {
  const emptyResult = {
    totalCashback: 0,
    breakdown: {
      firstOrder: null,
      category: null,
      slab: null,
      stackingMode: settings.stacking_mode || 'HIGHEST',
    },
    capped: false,
    reason: null,
  };

  if (!settings.enabled) {
    return { ...emptyResult, reason: 'CASHBACK_DISABLED' };
  }

  if (hasCoupon && !settings.allow_with_coupon) {
    return { ...emptyResult, reason: 'COUPON_BLOCKED' };
  }

  const cleanSubtotal = Math.max(0, Number(subtotal) || 0);
  const cleanCoupon = Math.max(0, Number(couponDiscount) || 0);
  const cleanWallet = Math.max(0, Number(walletUsed) || 0);

  // If cashback_on_wallet_paid_amount is false (default), subtract wallet_used from cashback base
  const walletDeduction = settings.cashback_on_wallet_paid_amount ? 0 : cleanWallet;

  const effectiveBase = settings.calc_base === 'BEFORE_DISCOUNT'
    ? Math.max(0, cleanSubtotal - walletDeduction)
    : Math.max(0, cleanSubtotal - cleanCoupon - walletDeduction);

  if (effectiveBase <= 0) {
    return { ...emptyResult, reason: 'ZERO_BASE' };
  }

  // 1. Proportional discount spreading across items for AFTER_DISCOUNT category calculation
  const totalDeduction = (settings.calc_base === 'BEFORE_DISCOUNT' ? 0 : cleanCoupon) + walletDeduction;
  const discountRatio = cleanSubtotal > 0 ? (totalDeduction / cleanSubtotal) : 0;
  const processedItems = items.map((item) => {
    const rawTotal = Math.max(0, Number(item.total ?? (Number(item.price || 0) * Number(item.quantity || 1))) || 0);
    const itemDiscount = settings.calc_base === 'BEFORE_DISCOUNT' ? 0 : rawTotal * discountRatio;
    const netTotal = Math.max(0, rawTotal - itemDiscount);
    return {
      ...item,
      rawTotal,
      netTotal,
      categoryId: item.category_id != null ? Number(item.category_id) : null,
      categoryName: String(item.category_name || item.category || '').trim().toLowerCase(),
    };
  });

  // Extract rules by type (only active and within valid date window)
  const validRules = rules.filter((r) => r.is_active && isDateWithinWindow(r.start_date, r.end_date, now));

  const firstOrderRule = validRules.find((r) => r.rule_type === 'FIRST_ORDER');
  const slabRule = validRules.find((r) => r.rule_type === 'SLAB');
  const categoryRules = validRules.filter((r) => r.rule_type === 'CATEGORY');

  // --- A. First Order Bonus Calculation ---
  let firstOrderCashback = 0;
  let firstOrderDetails = null;

  if (isFirstOrder && firstOrderRule) {
    const minOrder = Number(firstOrderRule.min_order_value || 0);
    if (effectiveBase >= minOrder) {
      if (firstOrderRule.value_type === 'FLAT') {
        firstOrderCashback = Number(firstOrderRule.value) || 0;
      } else {
        firstOrderCashback = (effectiveBase * (Number(firstOrderRule.value) || 0)) / 100;
      }

      if (firstOrderRule.max_cashback != null) {
        firstOrderCashback = Math.min(firstOrderCashback, Number(firstOrderRule.max_cashback));
      }
      firstOrderCashback = Math.round(firstOrderCashback * 100) / 100;

      firstOrderDetails = {
        ruleId: firstOrderRule.id,
        amount: firstOrderCashback,
        valueType: firstOrderRule.value_type,
        value: Number(firstOrderRule.value),
      };
    }
  }

  // --- B. Category-wise Cashback Calculation ---
  let categoryCashback = 0;
  const categoryDetailsList = [];

  for (const catRule of categoryRules) {
    const targetCatId = catRule.category_id != null ? Number(catRule.category_id) : null;
    const matchingItems = processedItems.filter((item) => {
      if (targetCatId != null && item.categoryId != null) {
        return item.categoryId === targetCatId;
      }
      return false;
    });

    const categoryBase = matchingItems.reduce((acc, it) => acc + it.netTotal, 0);
    const minOrder = Number(catRule.min_order_value || 0);

    if (categoryBase > 0 && effectiveBase >= minOrder) {
      let catAmount = 0;
      if (catRule.value_type === 'FLAT') {
        catAmount = Number(catRule.value) || 0;
      } else {
        catAmount = (categoryBase * (Number(catRule.value) || 0)) / 100;
      }

      if (catRule.max_cashback != null) {
        catAmount = Math.min(catAmount, Number(catRule.max_cashback));
      }
      catAmount = Math.round(catAmount * 100) / 100;

      if (catAmount > 0) {
        categoryCashback += catAmount;
        categoryDetailsList.push({
          ruleId: catRule.id,
          categoryId: targetCatId,
          categoryBase: Math.round(categoryBase * 100) / 100,
          amount: catAmount,
          valueType: catRule.value_type,
          value: Number(catRule.value),
        });
      }
    }
  }
  categoryCashback = Math.round(categoryCashback * 100) / 100;

  // --- C. Slab / Tier-based Cashback Calculation ---
  let slabCashback = 0;
  let slabDetails = null;

  if (slabRule && Array.isArray(slabRule.slabs) && slabRule.slabs.length > 0) {
    const minOrder = Number(slabRule.min_order_value || 0);
    if (effectiveBase >= minOrder) {
      // Find matching tier: ascending check
      const matchedTier = slabRule.slabs.find((s) => {
        if (s.upto === null || s.upto === undefined || s.upto === '') return true;
        return effectiveBase <= Number(s.upto);
      });

      if (matchedTier) {
        const percent = Number(matchedTier.percent) || 0;
        slabCashback = (effectiveBase * percent) / 100;
        if (slabRule.max_cashback != null) {
          slabCashback = Math.min(slabCashback, Number(slabRule.max_cashback));
        }
        slabCashback = Math.round(slabCashback * 100) / 100;

        slabDetails = {
          ruleId: slabRule.id,
          amount: slabCashback,
          percent,
          upto: matchedTier.upto,
          orderBase: Math.round(effectiveBase * 100) / 100,
        };
      }
    }
  }

  // --- Stacking Combination (Category + Slab) ---
  const stackingMode = settings.stacking_mode === 'SUM' ? 'SUM' : 'HIGHEST';
  let regularCashback = 0;

  if (stackingMode === 'SUM') {
    regularCashback = categoryCashback + slabCashback;
  } else {
    // HIGHEST mode takes the maximum between total category cashback and slab cashback
    regularCashback = Math.max(categoryCashback, slabCashback);
  }

  // First order bonus is always added on top of regular cashback
  let totalCashback = Math.round((regularCashback + firstOrderCashback) * 100) / 100;

  // Apply Global Order Cap
  let isCapped = false;
  if (settings.max_cashback_per_order != null && Number(settings.max_cashback_per_order) > 0) {
    const maxCap = Number(settings.max_cashback_per_order);
    if (totalCashback > maxCap) {
      totalCashback = maxCap;
      isCapped = true;
    }
  }

  return {
    totalCashback,
    breakdown: {
      firstOrder: firstOrderDetails,
      category: categoryDetailsList.length > 0 ? { total: categoryCashback, items: categoryDetailsList } : null,
      slab: slabDetails,
      stackingMode,
      calcBase: settings.calc_base,
      effectiveBase: Math.round(effectiveBase * 100) / 100,
    },
    capped: isCapped,
  };
}
