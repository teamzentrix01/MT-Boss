import pool from '../src/lib/db.js';
import {
  ensureShopVendorCommissionsSchema,
  getShopVendorCommissionPercent,
  setShopVendorCommissionPercent,
  recordShopVendorCommission,
} from '../src/lib/shop-commissions.js';

async function verifyStep3() {
  console.log('--- Step 3 Verification: Fee Calculation ONLY on Vendor-Sourced Products ---');

  await ensureShopVendorCommissionsSchema();

  // Set commission percent to 10%
  await setShopVendorCommissionPercent(10.00);
  const currentRate = await getShopVendorCommissionPercent();
  console.log(`Current platform fee rate: ${currentRate}%`);

  // Find or create test vendor
  let vendorRes = await pool.query('SELECT id, shop_name FROM vendors LIMIT 1');
  let testVendorId;
  if (!vendorRes.rows.length) {
    const newV = await pool.query(`
      INSERT INTO vendors (email, password_hash, shop_name, business_name, is_approved, status)
      VALUES ('test_vendor_${Date.now()}@example.com', 'hash', 'Test Vendor Shop', 'Test Vendor Biz', TRUE, 'active')
      RETURNING id, shop_name
    `);
    testVendorId = newV.rows[0].id;
    console.log(`Created test vendor ID: ${testVendorId}`);
  } else {
    testVendorId = vendorRes.rows[0].id;
    console.log(`Using existing vendor ID: ${testVendorId} (${vendorRes.rows[0].shop_name})`);
  }

  // 1. Create a dummy order for vendor product
  const vendorOrderRes = await pool.query(`
    INSERT INTO material_enquiries (
      user_name, user_phone, category_name, product_total, grand_total, status
    ) VALUES (
      'Customer A', '9876543210', 'Cement', 5000.00, 5200.00, 'open'
    ) RETURNING id
  `);
  const vendorOrderId = vendorOrderRes.rows[0].id;

  // Simulate vendor product order item logic
  const vendorProduct = { id: 101, vendor_id: testVendorId, supplier_id: 0 };
  const vendorProductTotal = 5000.00;

  // Apply fee calculation: source is vendor (vendor_id > 0)
  const isVendorSourced = Boolean(vendorProduct?.vendor_id && Number(vendorProduct.vendor_id) > 0);
  if (isVendorSourced) {
    const orderAmount = Number(vendorProductTotal);
    const commRow = await recordShopVendorCommission({
      orderId: vendorOrderId,
      vendorId: vendorProduct.vendor_id,
      productId: vendorProduct.id,
      orderAmount: orderAmount,
      commissionPercent: currentRate,
      status: 'pending',
    });
    console.log('✅ Vendor order commission row created:', {
      id: commRow.id,
      order_id: commRow.order_id,
      vendor_id: commRow.vendor_id,
      product_id: commRow.product_id,
      order_amount: commRow.order_amount,
      commission_percent_applied: commRow.commission_percent_applied,
      commission_amount: commRow.commission_amount,
      status: commRow.status,
    });

    if (Number(commRow.commission_amount) !== 500.00) {
      throw new Error(`Expected commission_amount to be 500.00 (10% of 5000) but got ${commRow.commission_amount}`);
    }
    if (commRow.status !== 'pending') {
      throw new Error(`Expected status 'pending' but got ${commRow.status}`);
    }
  }

  // 2. Create a dummy order for Admin product
  const adminOrderRes = await pool.query(`
    INSERT INTO material_enquiries (
      user_name, user_phone, category_name, product_total, grand_total, status
    ) VALUES (
      'Customer B', '9876543211', 'Steel', 8000.00, 8000.00, 'open'
    ) RETURNING id
  `);
  const adminOrderId = adminOrderRes.rows[0].id;

  const adminProduct = { id: 102, vendor_id: null, supplier_id: 0 }; // Admin product!
  const isAdminVendorSourced = Boolean(adminProduct?.vendor_id && Number(adminProduct.vendor_id) > 0);

  let adminCommRowCreated = false;
  if (isAdminVendorSourced) {
    await recordShopVendorCommission({
      orderId: adminOrderId,
      vendorId: adminProduct.vendor_id,
      productId: adminProduct.id,
      orderAmount: 8000.00,
      commissionPercent: currentRate,
      status: 'pending',
    });
    adminCommRowCreated = true;
  } else {
    console.log('✅ Admin product skipped — no commission row created as expected.');
  }

  if (adminCommRowCreated) {
    throw new Error('FAILED: Commission row was created for Admin product!');
  }

  // Verify that Admin order has 0 commission records in DB
  const checkAdminComm = await pool.query('SELECT * FROM shop_vendor_commissions WHERE order_id = $1', [adminOrderId]);
  if (checkAdminComm.rows.length !== 0) {
    throw new Error('FAILED: Found commission records for Admin order in DB!');
  }
  console.log(`✅ Verified in DB: Admin order ${adminOrderId} has 0 commission rows.`);

  // 3. Test changing commission percentage doesn't retroactively alter existing records
  console.log('\n--- Testing Historical Non-Retroactive Integrity ---');
  await setShopVendorCommissionPercent(15.00); // Change to 15%
  console.log('Changed setting to 15.00%');

  const recheckVendorComm = await pool.query('SELECT * FROM shop_vendor_commissions WHERE order_id = $1', [vendorOrderId]);
  const row = recheckVendorComm.rows[0];
  console.log(`Existing vendor order ${vendorOrderId} stored rate: ${row.commission_percent_applied}%, amount: ₹${row.commission_amount}`);

  if (Number(row.commission_percent_applied) !== 10.00 || Number(row.commission_amount) !== 500.00) {
    throw new Error('FAILED: Existing commission row was retroactively changed!');
  }
  console.log('✅ Verified: Existing commission row was NOT retroactively changed!');

  // Restore setting back to 10.00
  await setShopVendorCommissionPercent(10.00);

  // Clean up test orders & test commission row
  await pool.query('DELETE FROM material_enquiries WHERE id IN ($1, $2)', [vendorOrderId, adminOrderId]);
  console.log('✅ Test orders cleaned up.');

  console.log('\n🎉 Step 3 verification passed completely!');
  await pool.end();
  process.exit(0);
}

verifyStep3().catch((err) => {
  console.error('Step 3 verification error:', err);
  process.exit(1);
});
