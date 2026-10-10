import assert from 'node:assert';
import { calculateCashback, validateSlabs } from '../src/lib/cashback/calculate.js';

console.log('=== Running Cashback Calculation Unit Tests ===\n');

// Standard test settings
const baseSettings = {
  enabled: true,
  stacking_mode: 'HIGHEST',
  allow_with_coupon: true,
  calc_base: 'AFTER_DISCOUNT',
  max_cashback_per_order: null,
  pending_days: 7,
  expiry_days: 0,
};

// 1. Slab Validation Test
console.log('Test 1: Slabs validation');
const validSlabs = [
  { upto: 5000, percent: 1 },
  { upto: 20000, percent: 2 },
  { upto: null, percent: 3 },
];
assert.strictEqual(validateSlabs(validSlabs).valid, true, 'Valid slabs should pass');

const invalidAsc = [
  { upto: 5000, percent: 1 },
  { upto: 4000, percent: 2 },
  { upto: null, percent: 3 },
];
assert.strictEqual(validateSlabs(invalidAsc).valid, false, 'Non-ascending slabs should fail');

const nonNullLast = [
  { upto: 5000, percent: 1 },
  { upto: 20000, percent: 2 },
];
assert.strictEqual(validateSlabs(nonNullLast).valid, false, 'Slabs with fixed last tier should fail');
console.log('✔ Slabs validation tests passed');

// 2. Each type alone
console.log('\nTest 2: Each cashback type alone');

// First order alone (e.g. 5% capped at 250)
const firstOrderRule = {
  id: 1,
  rule_type: 'FIRST_ORDER',
  value_type: 'PERCENT',
  value: 5,
  min_order_value: 1000,
  max_cashback: 250,
  is_active: true,
};
const resFirstOrder = calculateCashback({
  items: [{ category_id: 1, total: 3000 }],
  subtotal: 3000,
  isFirstOrder: true,
  rules: [firstOrderRule],
  settings: baseSettings,
});
// 5% of 3000 = 150
assert.strictEqual(resFirstOrder.totalCashback, 150);
assert.strictEqual(resFirstOrder.breakdown.firstOrder.amount, 150);

// Category rule alone (Cement cat id=1, 2% cashback)
const categoryRule = {
  id: 2,
  rule_type: 'CATEGORY',
  category_id: 1,
  value_type: 'PERCENT',
  value: 2,
  min_order_value: 0,
  is_active: true,
};
const resCat = calculateCashback({
  items: [
    { category_id: 1, total: 4000 },
    { category_id: 2, total: 2000 },
  ],
  subtotal: 6000,
  rules: [categoryRule],
  settings: baseSettings,
});
// 2% on cement (4000) = 80
assert.strictEqual(resCat.totalCashback, 80);

// Slab rule alone: upto 5000: 1%, upto 20000: 2%, above: 3%
const slabRule = {
  id: 3,
  rule_type: 'SLAB',
  slabs: validSlabs,
  min_order_value: 0,
  is_active: true,
};

// 3. Slab boundaries test (Exactly 5000, Exactly 20000, and above)
console.log('\nTest 3: Slab boundaries (<= 5000, <= 20000, > 20000)');
const resSlab5000 = calculateCashback({
  subtotal: 5000,
  rules: [slabRule],
  settings: baseSettings,
});
// 1% of 5000 = 50
assert.strictEqual(resSlab5000.totalCashback, 50);

const resSlab20000 = calculateCashback({
  subtotal: 20000,
  rules: [slabRule],
  settings: baseSettings,
});
// 2% of 20000 = 400
assert.strictEqual(resSlab20000.totalCashback, 400);

const resSlabAbove = calculateCashback({
  subtotal: 30000,
  rules: [slabRule],
  settings: baseSettings,
});
// 3% of 30000 = 900
assert.strictEqual(resSlabAbove.totalCashback, 900);
console.log('✔ Slab boundary tests passed (5000 -> 50, 20000 -> 400, 30000 -> 900)');

// 4. Stacking: HIGHEST vs SUM
console.log('\nTest 4: Stacking mode HIGHEST vs SUM');
// Subtotal 10,000 (Cement 10,000 at 2% = 200). Slab tier (10,000 <= 20,000) is 2% = 200.
// Let's use Category Paint (cat id=2, 4%): 10,000 * 4% = 400. Slab = 200.
const catPaint = {
  id: 4,
  rule_type: 'CATEGORY',
  category_id: 2,
  value_type: 'PERCENT',
  value: 4,
  is_active: true,
};

// HIGHEST mode: max(Category: 400, Slab: 200) = 400
const resHighest = calculateCashback({
  items: [{ category_id: 2, total: 10000 }],
  subtotal: 10000,
  rules: [catPaint, slabRule],
  settings: { ...baseSettings, stacking_mode: 'HIGHEST' },
});
assert.strictEqual(resHighest.totalCashback, 400);

// SUM mode: Category(400) + Slab(200) = 600
const resSum = calculateCashback({
  items: [{ category_id: 2, total: 10000 }],
  subtotal: 10000,
  rules: [catPaint, slabRule],
  settings: { ...baseSettings, stacking_mode: 'SUM' },
});
assert.strictEqual(resSum.totalCashback, 600);
console.log('✔ Stacking mode tests passed (HIGHEST=400, SUM=600)');

// 5. First order bonus combined with regular cashback
console.log('\nTest 5: First order bonus on top of regular cashback');
const resFirstOrderStacked = calculateCashback({
  items: [{ category_id: 2, total: 10000 }],
  subtotal: 10000,
  isFirstOrder: true,
  rules: [catPaint, slabRule, firstOrderRule],
  settings: { ...baseSettings, stacking_mode: 'SUM' },
});
// Category(400) + Slab(200) + FirstOrder(5% capped at 250 = 250) = 850
assert.strictEqual(resFirstOrderStacked.totalCashback, 850);
assert.strictEqual(resFirstOrderStacked.breakdown.firstOrder.amount, 250);
console.log('✔ First order bonus combined test passed');

// 6. Coupon Blocked Setting
console.log('\nTest 6: Coupon blocked setting');
const resCouponBlocked = calculateCashback({
  subtotal: 10000,
  hasCoupon: true,
  couponDiscount: 500,
  rules: [slabRule],
  settings: { ...baseSettings, allow_with_coupon: false },
});
assert.strictEqual(resCouponBlocked.totalCashback, 0);
assert.strictEqual(resCouponBlocked.reason, 'COUPON_BLOCKED');
console.log('✔ Coupon blocked test passed');

// 7. AFTER_DISCOUNT vs BEFORE_DISCOUNT and proportional category spread
console.log('\nTest 7: Coupon proportional spreading for AFTER_DISCOUNT');
// Subtotal: 10,000. Cat 1 = 6000, Cat 2 = 4000. Coupon = 2000 (20% discount).
// Net Cat 1 = 6000 - 20% = 4800. Net Cat 2 = 4000 - 20% = 3200.
// Cat 1 rule (2%): 4800 * 2% = 96.
const resAfterDiscount = calculateCashback({
  items: [
    { category_id: 1, total: 6000 },
    { category_id: 2, total: 4000 },
  ],
  subtotal: 10000,
  hasCoupon: true,
  couponDiscount: 2000,
  rules: [categoryRule],
  settings: { ...baseSettings, calc_base: 'AFTER_DISCOUNT' },
});
assert.strictEqual(resAfterDiscount.totalCashback, 96);
assert.strictEqual(resAfterDiscount.breakdown.effectiveBase, 8000);
console.log('✔ Proportional coupon discount spread test passed (4800 * 2% = 96)');

// 8. Order Level Max Cap
console.log('\nTest 8: Global Max Cashback Cap per order');
const resCapped = calculateCashback({
  subtotal: 50000,
  rules: [slabRule],
  settings: { ...baseSettings, max_cashback_per_order: 500 },
});
// 3% of 50000 = 1500, but capped at 500
assert.strictEqual(resCapped.totalCashback, 500);
assert.strictEqual(resCapped.capped, true);
console.log('✔ Max order cap test passed');

// 9. Min Order Value check
console.log('\nTest 9: Minimum Order Value constraint');
const minOrderRule = {
  id: 5,
  rule_type: 'SLAB',
  slabs: validSlabs,
  min_order_value: 10000,
  is_active: true,
};
const resMinOrder = calculateCashback({
  subtotal: 4000,
  rules: [minOrderRule],
  settings: baseSettings,
});
assert.strictEqual(resMinOrder.totalCashback, 0);
console.log('✔ Min order value test passed');

// 10. Date Window validation
console.log('\nTest 10: Date window validation');
const expiredRule = {
  id: 6,
  rule_type: 'FIRST_ORDER',
  value_type: 'FLAT',
  value: 300,
  start_date: '2026-01-01',
  end_date: '2026-01-31',
  is_active: true,
};
const resExpired = calculateCashback({
  subtotal: 5000,
  isFirstOrder: true,
  rules: [expiredRule],
  settings: baseSettings,
  now: new Date('2026-10-08'),
});
assert.strictEqual(resExpired.totalCashback, 0, 'Expired rule must not generate cashback');
console.log('✔ Date window test passed');

console.log('\n🎉 ALL 10 UNIT TESTS PASSED SUCCESSFULLY! 🎉\n');
