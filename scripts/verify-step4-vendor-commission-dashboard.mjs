import pool from '../src/lib/db.js';
import {
  ensureShopVendorCommissionsSchema,
  recordShopVendorCommission,
  getShopVendorCommissionOverview,
  markShopVendorCommissionPaid,
} from '../src/lib/shop-commissions.js';

async function verifyStep4() {
  console.log('=== Step 4 Verification: Admin Dashboard Shop Vendor Commission ===\n');

  await ensureShopVendorCommissionsSchema();

  // Find or create test vendor
  let vendorRes = await pool.query('SELECT id, shop_name FROM vendors LIMIT 1');
  let testVendorId;
  let createdTestVendor = false;

  if (!vendorRes.rows.length) {
    const newV = await pool.query(`
      INSERT INTO vendors (email, password_hash, shop_name, business_name, is_approved, status)
      VALUES ('test_vendor_step4_${Date.now()}@example.com', 'hash', 'Step 4 Test Vendor', 'Step 4 Biz', TRUE, 'active')
      RETURNING id, shop_name
    `);
    testVendorId = newV.rows[0].id;
    createdTestVendor = true;
    console.log(`Created test vendor ID: ${testVendorId}`);
  } else {
    testVendorId = vendorRes.rows[0].id;
    console.log(`Using existing vendor ID: ${testVendorId} (${vendorRes.rows[0].shop_name})`);
  }

  // Get baseline overview
  const initialOverview = await getShopVendorCommissionOverview();
  console.log('Baseline Overview:', {
    today: initialOverview.today,
    total: initialOverview.total,
    pending: initialOverview.pending,
    paid: initialOverview.paid,
    pendingVendorsCount: initialOverview.pendingVendors.length,
  });

  // Create two test orders
  const o1Res = await pool.query(`
    INSERT INTO material_enquiries (user_name, user_phone, category_name, product_total, grand_total, status)
    VALUES ('Customer Step 4 A', '9999990001', 'Cement', 2000.00, 2000.00, 'open')
    RETURNING id
  `);
  const order1Id = o1Res.rows[0].id;

  const o2Res = await pool.query(`
    INSERT INTO material_enquiries (user_name, user_phone, category_name, product_total, grand_total, status)
    VALUES ('Customer Step 4 B', '9999990002', 'Steel', 3000.00, 3000.00, 'open')
    RETURNING id
  `);
  const order2Id = o2Res.rows[0].id;

  // Insert two pending commission rows (10% of 2000 = 200, 10% of 3000 = 300)
  const comm1 = await recordShopVendorCommission({
    orderId: order1Id,
    vendorId: testVendorId,
    productId: 101,
    orderAmount: 2000.00,
    commissionPercent: 10.00,
    status: 'pending',
  });

  const comm2 = await recordShopVendorCommission({
    orderId: order2Id,
    vendorId: testVendorId,
    productId: 102,
    orderAmount: 3000.00,
    commissionPercent: 10.00,
    status: 'pending',
  });

  console.log(`\nCreated 2 pending commission rows: ₹${comm1.commission_amount} + ₹${comm2.commission_amount} = ₹500.00`);

  // Verify overview reflects pending dues
  const midOverview = await getShopVendorCommissionOverview();
  console.log('\nUpdated Overview with pending commissions:', {
    today: midOverview.today,
    total: midOverview.total,
    pending: midOverview.pending,
    paid: midOverview.paid,
  });

  if (Number(midOverview.pending) < Number(initialOverview.pending) + 500) {
    throw new Error(`Expected pending to increase by 500, but went from ${initialOverview.pending} to ${midOverview.pending}`);
  }

  const vendorDueEntry = midOverview.pendingVendors.find(v => Number(v.vendor_id) === Number(testVendorId));
  if (!vendorDueEntry) {
    throw new Error(`Vendor ${testVendorId} not found in pendingVendors list`);
  }
  console.log('✅ Found vendor pending entry:', vendorDueEntry);

  if (Number(vendorDueEntry.pending_due_amount) < 500) {
    throw new Error(`Expected vendor pending dues to be >= 500, got ${vendorDueEntry.pending_due_amount}`);
  }

  // Settle commission offline: mark vendor as paid
  console.log('\n--- Testing Mark as Paid Offline Settlement Action ---');
  const settledRows = await markShopVendorCommissionPaid({
    vendorId: testVendorId,
    paidNote: 'Settled offline in cash by admin - test verification',
  });

  console.log(`Marked ${settledRows.length} commission row(s) as paid for vendor ${testVendorId}`);
  if (settledRows.length < 2) {
    throw new Error(`Expected at least 2 rows settled, got ${settledRows.length}`);
  }

  const postOverview = await getShopVendorCommissionOverview();
  console.log('\nPost-Settlement Overview:', {
    today: postOverview.today,
    total: postOverview.total,
    pending: postOverview.pending,
    paid: postOverview.paid,
  });

  if (Number(postOverview.paid) < Number(initialOverview.paid) + 500) {
    throw new Error(`Expected paid to increase by at least 500, but got ${postOverview.paid}`);
  }

  const vendorAfterSettle = postOverview.pendingVendors.find(v => Number(v.vendor_id) === Number(testVendorId));
  if (vendorAfterSettle) {
    throw new Error(`Vendor ${testVendorId} still listed in pendingVendors after full settlement!`);
  }
  console.log('✅ Verified: Vendor is cleared from pending dues list after settlement.');

  // Clean up test data
  await pool.query('DELETE FROM material_enquiries WHERE id IN ($1, $2)', [order1Id, order2Id]);
  if (createdTestVendor) {
    await pool.query('DELETE FROM vendors WHERE id = $1', [testVendorId]);
  }
  console.log('✅ Cleaned up test orders and commissions.');

  console.log('\n🎉 Step 4 verification PASSED completely!');
  await pool.end();
  process.exit(0);
}

verifyStep4().catch((err) => {
  console.error('Step 4 verification failed:', err);
  process.exit(1);
});
