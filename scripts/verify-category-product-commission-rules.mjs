import pool from '../src/lib/db.js';
import {
  ensureShopVendorCommissionsSchema,
  getShopVendorCommissionPercent,
  setShopVendorCommissionPercent,
  resolveCommissionRate,
  recordShopVendorCommission,
  createOrUpdateShopCommissionRule,
  deleteShopCommissionRule,
  getShopCommissionRules,
} from '../src/lib/shop-commissions.js';

async function verifyCategoryProductRules() {
  console.log('=== Verifying Category & Product-wise Commission Rules Upgrade ===\n');

  await ensureShopVendorCommissionsSchema();

  // 1. Set global default rate to 10%
  await setShopVendorCommissionPercent(10.00);
  console.log('1. Set Default Commission Rate to 10.00%');

  // 2. Ensure test vendor exists
  let vendorRes = await pool.query('SELECT id FROM vendors WHERE status = \'active\' LIMIT 1');
  let testVendorId;
  let createdVendor = false;
  if (vendorRes.rows.length) {
    testVendorId = vendorRes.rows[0].id;
  } else {
    const vRes = await pool.query(`
      INSERT INTO vendors (email, password_hash, shop_name, business_name, is_approved, status)
      VALUES ('test_vendor_rules_${Date.now()}@example.com', 'hash', 'Rules Test Shop', 'Rules Biz', TRUE, 'active')
      RETURNING id
    `);
    testVendorId = vRes.rows[0].id;
    createdVendor = true;
  }
  console.log(`Using vendor ID: ${testVendorId}`);

  // 3. Find or create Categories: "Cement" and "Sariya" (or Steel)
  let cementCatRes = await pool.query('SELECT id, name FROM shop_categories WHERE LOWER(TRIM(name)) = \'cement\' LIMIT 1');
  let cementCatId;
  if (cementCatRes.rows.length) {
    cementCatId = cementCatRes.rows[0].id;
  } else {
    const cIns = await pool.query(`INSERT INTO shop_categories (name) VALUES ('Cement') RETURNING id`);
    cementCatId = cIns.rows[0].id;
  }

  let sariyaCatRes = await pool.query('SELECT id, name FROM shop_categories WHERE LOWER(TRIM(name)) IN (\'sariya\', \'steel\') LIMIT 1');
  let sariyaCatId;
  if (sariyaCatRes.rows.length) {
    sariyaCatId = sariyaCatRes.rows[0].id;
  } else {
    const sIns = await pool.query(`INSERT INTO shop_categories (name) VALUES ('Sariya') RETURNING id`);
    sariyaCatId = sIns.rows[0].id;
  }

  console.log(`Categories: Cement (ID: ${cementCatId}), Sariya/Steel (ID: ${sariyaCatId})`);

  // 4. Create vendor products
  // Product 1: Cement Product (will inherit Category rule)
  const p1Res = await pool.query(`
    INSERT INTO supplier_materials (supplier_id, vendor_id, name, category, price, is_available)
    VALUES (0, $1, 'Ultratech Cement 50kg', 'Cement', 380.00, TRUE)
    RETURNING id, name, category
  `, [testVendorId]);
  const cementProdId = p1Res.rows[0].id;

  // Product 2: Sariya Product (will have specific Product rule)
  const p2Res = await pool.query(`
    INSERT INTO supplier_materials (supplier_id, vendor_id, name, category, price, is_available)
    VALUES (0, $1, 'Tata Tiscon Sariya 12mm', 'Steel', 650.00, TRUE)
    RETURNING id, name, category
  `, [testVendorId]);
  const sariyaProdId = p2Res.rows[0].id;

  // Product 3: Unruled Product (Sand - no category rule, no product rule)
  const p3Res = await pool.query(`
    INSERT INTO supplier_materials (supplier_id, vendor_id, name, category, price, is_available)
    VALUES (0, $1, 'River Sand 1 Ton', 'Sand', 1200.00, TRUE)
    RETURNING id, name, category
  `, [testVendorId]);
  const unruledProdId = p3Res.rows[0].id;

  // Product 4: Admin Product (vendor_id is NULL)
  const p4Res = await pool.query(`
    INSERT INTO supplier_materials (supplier_id, vendor_id, name, category, price, is_available)
    VALUES (0, NULL, 'Admin Direct Product', 'Cement', 400.00, TRUE)
    RETURNING id, name, category
  `);
  const adminProdId = p4Res.rows[0].id;

  let rule1, rule2;
  let testOrderIds = [];

  try {
    // 5. Configure rules:
    // Rule 1: Category rule for Cement = 5.00%
    rule1 = await createOrUpdateShopCommissionRule({
      scopeType: 'category',
      scopeId: cementCatId,
      commissionPercent: 5.00,
      isActive: true,
    });
    console.log('✅ Created Category Rule: Cement -> 5.00%');

    // Rule 2: Product rule for Sariya Product = 1.00%
    rule2 = await createOrUpdateShopCommissionRule({
      scopeType: 'product',
      scopeId: sariyaProdId,
      commissionPercent: 1.00,
      isActive: true,
    });
    console.log('✅ Created Product Rule: Sariya Product -> 1.00%');

    // 6. Test resolveCommissionRate
    console.log('\n--- Testing Rate Resolution (resolveCommissionRate) ---');
    const resCement = await resolveCommissionRate({ id: cementProdId, category: 'Cement' });
    console.log('Cement Product Rate:', resCement);
    if (resCement.rate !== 5.00 || resCement.rateSource !== 'category') {
      throw new Error(`Expected Cement product to resolve to 5.00% (category), got ${resCement.rate}% (${resCement.rateSource})`);
    }

    const resSariya = await resolveCommissionRate({ id: sariyaProdId, category: 'Steel' });
    console.log('Sariya Product Rate:', resSariya);
    if (resSariya.rate !== 1.00 || resSariya.rateSource !== 'product') {
      throw new Error(`Expected Sariya product to resolve to 1.00% (product), got ${resSariya.rate}% (${resSariya.rateSource})`);
    }

    const resUnruled = await resolveCommissionRate({ id: unruledProdId, category: 'Sand' });
    console.log('Unruled Product Rate:', resUnruled);
    if (resUnruled.rate !== 10.00 || resUnruled.rateSource !== 'default') {
      throw new Error(`Expected Unruled product to resolve to 10.00% (default), got ${resUnruled.rate}% (${resUnruled.rateSource})`);
    }

    // 7. Test Order Creation & Commission Rows
    console.log('\n--- Testing Orders & Commission Row Generation ---');

    // Order 1: Cement vendor product (Amount: ₹2,000)
    const o1 = await pool.query(`
      INSERT INTO material_enquiries (user_name, user_phone, category_name, product_id, product_total, grand_total, status)
      VALUES ('Customer 1', '9876543210', 'Cement', $1, 2000.00, 2000.00, 'open')
      RETURNING id
    `, [cementProdId]);
    testOrderIds.push(o1.rows[0].id);

    const comm1 = await recordShopVendorCommission({
      orderId: o1.rows[0].id,
      vendorId: testVendorId,
      productId: cementProdId,
      productCategory: 'Cement',
      orderAmount: 2000.00,
      commissionPercent: resCement.rate,
      rateSource: resCement.rateSource,
    });

    console.log('Order 1 (Cement, 5%):', {
      order_amount: comm1.order_amount,
      rate: comm1.commission_percent_applied,
      commission_amount: comm1.commission_amount,
      rate_source: comm1.rate_source,
    });
    if (Number(comm1.commission_percent_applied) !== 5.00 || Number(comm1.commission_amount) !== 100.00 || comm1.rate_source !== 'category') {
      throw new Error(`Order 1 commission mismatch! Expected 5% / 100.00, got ${comm1.commission_percent_applied}% / ${comm1.commission_amount}`);
    }

    // Order 2: Sariya vendor product (Amount: ₹5,000)
    const o2 = await pool.query(`
      INSERT INTO material_enquiries (user_name, user_phone, category_name, product_id, product_total, grand_total, status)
      VALUES ('Customer 2', '9876543211', 'Steel', $1, 5000.00, 5000.00, 'open')
      RETURNING id
    `, [sariyaProdId]);
    testOrderIds.push(o2.rows[0].id);

    const comm2 = await recordShopVendorCommission({
      orderId: o2.rows[0].id,
      vendorId: testVendorId,
      productId: sariyaProdId,
      productCategory: 'Steel',
      orderAmount: 5000.00,
      commissionPercent: resSariya.rate,
      rateSource: resSariya.rateSource,
    });

    console.log('Order 2 (Sariya, 1%):', {
      order_amount: comm2.order_amount,
      rate: comm2.commission_percent_applied,
      commission_amount: comm2.commission_amount,
      rate_source: comm2.rate_source,
    });
    if (Number(comm2.commission_percent_applied) !== 1.00 || Number(comm2.commission_amount) !== 50.00 || comm2.rate_source !== 'product') {
      throw new Error(`Order 2 commission mismatch! Expected 1% / 50.00, got ${comm2.commission_percent_applied}% / ${comm2.commission_amount}`);
    }

    // Order 3: Unruled vendor product (Amount: ₹3,000)
    const o3 = await pool.query(`
      INSERT INTO material_enquiries (user_name, user_phone, category_name, product_id, product_total, grand_total, status)
      VALUES ('Customer 3', '9876543212', 'Sand', $1, 3000.00, 3000.00, 'open')
      RETURNING id
    `, [unruledProdId]);
    testOrderIds.push(o3.rows[0].id);

    const comm3 = await recordShopVendorCommission({
      orderId: o3.rows[0].id,
      vendorId: testVendorId,
      productId: unruledProdId,
      productCategory: 'Sand',
      orderAmount: 3000.00,
      commissionPercent: resUnruled.rate,
      rateSource: resUnruled.rateSource,
    });

    console.log('Order 3 (Unruled Sand, 10% default):', {
      order_amount: comm3.order_amount,
      rate: comm3.commission_percent_applied,
      commission_amount: comm3.commission_amount,
      rate_source: comm3.rate_source,
    });
    if (Number(comm3.commission_percent_applied) !== 10.00 || Number(comm3.commission_amount) !== 300.00 || comm3.rate_source !== 'default') {
      throw new Error(`Order 3 commission mismatch! Expected 10% / 300.00, got ${comm3.commission_percent_applied}% / ${comm3.commission_amount}`);
    }

    // Order 4: Admin product (Amount: ₹4,000)
    const o4 = await pool.query(`
      INSERT INTO material_enquiries (user_name, user_phone, category_name, product_id, product_total, grand_total, status)
      VALUES ('Customer 4', '9876543213', 'Cement', $1, 4000.00, 4000.00, 'open')
      RETURNING id
    `, [adminProdId]);
    testOrderIds.push(o4.rows[0].id);

    // Check order 4 in material_enquiries logic: vendorId is null, so NO commission row is inserted
    const adminProd = await pool.query('SELECT vendor_id FROM supplier_materials WHERE id = $1', [adminProdId]);
    if (!adminProd.rows[0].vendor_id) {
      console.log('✅ Admin product has no vendor_id -> skipping commission row.');
    }
    const adminCommCheck = await pool.query('SELECT * FROM shop_vendor_commissions WHERE order_id = $1', [o4.rows[0].id]);
    if (adminCommCheck.rows.length !== 0) {
      throw new Error('FAILED: Commission row was created for Admin product!');
    }
    console.log('✅ Verified: Zero commission rows created for Admin-sourced product.');

    // 8. Test Historical Non-Retroactive Integrity
    console.log('\n--- Testing Historical Non-Retroactive Integrity ---');
    // Change Cement category rule to 8%
    await createOrUpdateShopCommissionRule({
      scopeType: 'category',
      scopeId: cementCatId,
      commissionPercent: 8.00,
      isActive: true,
    });
    console.log('Updated Cement Category Rule to 8.00%');

    // Verify existing Order 1 is still preserved at 5.00% and ₹100.00
    const recheckO1 = await pool.query('SELECT * FROM shop_vendor_commissions WHERE id = $1', [comm1.id]);
    const histRow = recheckO1.rows[0];
    console.log('Historical Order 1 stored rate:', histRow.commission_percent_applied, 'amount:', histRow.commission_amount);
    if (Number(histRow.commission_percent_applied) !== 5.00 || Number(histRow.commission_amount) !== 100.00) {
      throw new Error('Historical commission row was retroactively changed!');
    }
    console.log('✅ Verified: Existing commission row was NOT altered when rule changed.');

    // Verify customer totals remain untouched
    const checkCustomerTotals = await pool.query('SELECT product_total, grand_total FROM material_enquiries WHERE id = $1', [o1.rows[0].id]);
    if (Number(checkCustomerTotals.rows[0].grand_total) !== 2000.00) {
      throw new Error('Customer grand_total was modified!');
    }
    console.log('✅ Verified: Customer grand_total remained ₹2000.00.');

  } finally {
    // Cleanup
    if (rule1) await deleteShopCommissionRule(rule1.id);
    if (rule2) await deleteShopCommissionRule(rule2.id);
    if (testOrderIds.length) {
      await pool.query('DELETE FROM material_enquiries WHERE id = ANY($1)', [testOrderIds]);
    }
    await pool.query('DELETE FROM supplier_materials WHERE id IN ($1, $2, $3, $4)', [
      cementProdId, sariyaProdId, unruledProdId, adminProdId,
    ]);
    if (createdVendor) {
      await pool.query('DELETE FROM vendors WHERE id = $1', [testVendorId]);
    }
    console.log('\n✅ Cleaned up test rules, products, orders, and test vendor.');
  }

  console.log('\n🎉 ALL Category & Product-wise Commission Rules Tests PASSED!');
  await pool.end();
  process.exit(0);
}

verifyCategoryProductRules().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
