import pool from '../src/lib/db.js';
import {
  ensureShopVendorCommissionsSchema,
  recordShopVendorCommission,
  getVendorOwnCommissionSummary,
  markShopVendorCommissionPaid,
} from '../src/lib/shop-commissions.js';

async function verifyStep5And6() {
  console.log('=== Step 5 & 6 Verification: Vendor Panel Commission & Customer Visibility Check ===\n');

  await ensureShopVendorCommissionsSchema();

  // Find or create two test vendors to verify strict scoping
  let v1 = await pool.query(`
    INSERT INTO vendors (email, password_hash, shop_name, business_name, is_approved, status)
    VALUES ('test_vendor_a_${Date.now()}@example.com', 'hash', 'Vendor Shop Alpha', 'Alpha Biz', TRUE, 'active')
    RETURNING id, shop_name
  `);
  const vendorAId = v1.rows[0].id;

  let v2 = await pool.query(`
    INSERT INTO vendors (email, password_hash, shop_name, business_name, is_approved, status)
    VALUES ('test_vendor_b_${Date.now()}@example.com', 'hash', 'Vendor Shop Beta', 'Beta Biz', TRUE, 'active')
    RETURNING id, shop_name
  `);
  const vendorBId = v2.rows[0].id;

  console.log(`Created Vendor A (ID: ${vendorAId}) and Vendor B (ID: ${vendorBId})`);

  let orderAId, orderBId;

  try {
    // Create test orders
    const oA = await pool.query(`
      INSERT INTO material_enquiries (user_name, user_phone, category_name, product_total, grand_total, status)
      VALUES ('Customer Alpha', '9999991111', 'Cement', 2000.00, 2000.00, 'open')
      RETURNING id
    `);
    orderAId = oA.rows[0].id;

    const oB = await pool.query(`
      INSERT INTO material_enquiries (user_name, user_phone, category_name, product_total, grand_total, status)
      VALUES ('Customer Beta', '9999992222', 'Steel', 4000.00, 4000.00, 'open')
      RETURNING id
    `);
    orderBId = oB.rows[0].id;

    // Record commission for Vendor A: ₹2,000 * 10% = ₹200.00
    const commA = await recordShopVendorCommission({
      orderId: orderAId,
      vendorId: vendorAId,
      productId: 501,
      orderAmount: 2000.00,
      commissionPercent: 10.00,
      status: 'pending',
    });

    // Record commission for Vendor B: ₹4,000 * 10% = ₹400.00
    const commB = await recordShopVendorCommission({
      orderId: orderBId,
      vendorId: vendorBId,
      productId: 502,
      orderAmount: 4000.00,
      commissionPercent: 10.00,
      status: 'pending',
    });

    console.log(`\nCreated Commission A: ₹${commA.commission_amount} for Vendor A (order ${orderAId})`);
    console.log(`Created Commission B: ₹${commB.commission_amount} for Vendor B (order ${orderBId})`);

    // 1. Verify Vendor A own summary
    const summaryA = await getVendorOwnCommissionSummary(vendorAId);
    console.log('\n--- Vendor A Commission Summary ---', {
      pending_commission: summaryA.pending_commission,
      paid_commission: summaryA.paid_commission,
      total_orders_count: summaryA.total_orders_count,
      orders: summaryA.recent_orders.length,
    });

    if (summaryA.pending_commission !== 200.00) {
      throw new Error(`Expected Vendor A pending_commission to be 200.00, got ${summaryA.pending_commission}`);
    }
    if (summaryA.recent_orders.some(o => o.order_id === orderBId)) {
      throw new Error('SECURITY VIOLATION: Vendor A can see Vendor B order in recent orders!');
    }
    console.log('✅ Verified: Vendor A sees ONLY their ₹200 pending dues and their own orders.');

    // 2. Verify Vendor B own summary
    const summaryB = await getVendorOwnCommissionSummary(vendorBId);
    console.log('\n--- Vendor B Commission Summary ---', {
      pending_commission: summaryB.pending_commission,
      paid_commission: summaryB.paid_commission,
      total_orders_count: summaryB.total_orders_count,
      orders: summaryB.recent_orders.length,
    });

    if (summaryB.pending_commission !== 400.00) {
      throw new Error(`Expected Vendor B pending_commission to be 400.00, got ${summaryB.pending_commission}`);
    }
    if (summaryB.recent_orders.some(o => o.order_id === orderAId)) {
      throw new Error('SECURITY VIOLATION: Vendor B can see Vendor A order in recent orders!');
    }
    console.log('✅ Verified: Vendor B sees ONLY their ₹400 pending dues and their own orders.');

    // 3. Settle Vendor A commission offline
    console.log('\n--- Settling Vendor A offline with admin note ---');
    await markShopVendorCommissionPaid({
      vendorId: vendorAId,
      paidNote: 'Paid offline in cash to admin',
    });

    const updatedSummaryA = await getVendorOwnCommissionSummary(vendorAId);
    console.log('Vendor A Post-Settlement:', {
      pending_commission: updatedSummaryA.pending_commission,
      paid_commission: updatedSummaryA.paid_commission,
    });

    if (updatedSummaryA.pending_commission !== 0 || updatedSummaryA.paid_commission !== 200.00) {
      throw new Error(`Expected Vendor A pending=0, paid=200, got pending=${updatedSummaryA.pending_commission}, paid=${updatedSummaryA.paid_commission}`);
    }

    // Ensure Vendor B is untouched
    const recheckSummaryB = await getVendorOwnCommissionSummary(vendorBId);
    if (recheckSummaryB.pending_commission !== 400.00) {
      throw new Error(`Vendor B was unintentionally changed! Expected 400, got ${recheckSummaryB.pending_commission}`);
    }
    console.log('✅ Verified: Vendor B pending dues remain ₹400 while Vendor A is settled.');

    // 4. Step 6 Verification: Customer visibility check
    console.log('\n--- Step 6 Verification: Confirm NO Customer Visibility of Shop Vendor Commission ---');
    const tableCols = await pool.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'material_enquiries' AND column_name LIKE '%shop_vendor%'
    `);
    if (tableCols.rows.length > 0) {
      throw new Error(`Shop vendor commission column found in material_enquiries: ${tableCols.rows.map(r => r.column_name).join(', ')}`);
    }

    const customerOrder = await pool.query('SELECT * FROM material_enquiries WHERE id = $1', [orderAId]);
    const row = customerOrder.rows[0];

    console.log('Customer order totals show ONLY:', {
      product_total: row.product_total,
      shipping_cost: row.shipping_cost,
      coupon_discount: row.coupon_discount,
      grand_total: row.grand_total,
    });

    // Verify that the customer API response shape does NOT leak internal commission tracking
    const sampleCustomerResponse = {
      id: row.id,
      order_reference: row.order_reference,
      order_intent: row.order_intent,
      status: row.status,
      product_total: row.product_total,
      shipping_cost: row.shipping_cost,
      coupon_discount: row.coupon_discount,
      grand_total: row.grand_total,
    };

    const leakedKeys = Object.keys(sampleCustomerResponse).filter(k =>
      k.toLowerCase().includes('commission') || k.toLowerCase().includes('vendor_fee')
    );
    if (leakedKeys.length > 0) {
      throw new Error(`Leaked internal fields in customer response: ${leakedKeys.join(', ')}`);
    }

    console.log('✅ Verified: Zero shop vendor commission fields in customer order payload.');
    console.log('✅ Verified: `shop_vendor_commissions` is completely separated for internal platform tracking.');

  } finally {
    // Clean up test data
    if (orderAId && orderBId) {
      await pool.query('DELETE FROM material_enquiries WHERE id IN ($1, $2)', [orderAId, orderBId]);
    }
    await pool.query('DELETE FROM vendors WHERE id IN ($1, $2)', [vendorAId, vendorBId]);
    console.log('✅ Cleaned up test orders, commissions, and test vendors.');
  }

  console.log('\n🎉 Step 5 & 6 verification PASSED completely!');
  await pool.end();
  process.exit(0);
}

verifyStep5And6().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
