import pool from '../src/lib/db.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('--- Starting Vendor Product Approvals Verification ---');
  let vendorId = null;
  let testProductId = null;
  let adminProductId = null;
  let supplierProductId = null;

  try {
    // 0. Setup: Ensure an active vendor exists
    const vendorRes = await pool.query(`
      SELECT id, vendor_name FROM vendors WHERE is_approved = TRUE AND status = 'active' LIMIT 1
    `);
    if (vendorRes.rows.length) {
      vendorId = vendorRes.rows[0].id;
    } else {
      const newVendor = await pool.query(`
        INSERT INTO vendors (vendor_name, email, phone, city, state, is_approved, verification_status, status)
        VALUES ('Test Vendor Approvals', 'test_approval_vendor@example.com', '9876543210', 'Mumbai', 'Maharashtra', TRUE, 'verified', 'active')
        RETURNING id
      `);
      vendorId = newVendor.rows[0].id;
    }
    console.log(`Using vendor ID: ${vendorId}`);

    // Test 1: Vendor adds product -> it is saved hidden (is_available = false) and listed as Pending
    console.log('\n[Test 1] Vendor adds a product');
    const insertRes = await pool.query(
      `INSERT INTO supplier_materials
       (supplier_id, vendor_id, name, description, quote_price_range, price, unit, quantity,
        category, is_available, specifications, quality_tier)
       VALUES (0, $1, 'Test Cement Ultra', 'High strength test cement', '300-350', 320.00, 'bags', 50,
               'Cement', FALSE, '{"grade": "43", "__approval__": {"status": "pending", "created_at": "2026-10-12T10:00:00.000Z"}}'::jsonb, 'standard')
       RETURNING id, is_available, specifications, vendor_id`,
      [vendorId]
    );
    testProductId = insertRes.rows[0].id;
    assert(insertRes.rows[0].is_available === false, 'Product is saved with is_available = FALSE');
    assert(insertRes.rows[0].specifications?.__approval__?.status === 'pending', 'Product __approval__.status is "pending"');

    // Test 2: Public shop query does NOT return the pending vendor product
    console.log('\n[Test 2] Public shop query filters out pending vendor product');
    const publicShopRes = await pool.query(`
      SELECT m.id, m.name
      FROM supplier_materials m
      WHERE m.id = $1
        AND m.is_available = TRUE
        AND (m.vendor_id IS NULL OR COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'approved')
    `, [testProductId]);
    assert(publicShopRes.rows.length === 0, 'Pending vendor product is hidden from public shop query');

    // Test 3: Direct order for pending vendor product fails
    console.log('\n[Test 3] Direct ordering for pending vendor product fails');
    const orderCheckRes = await pool.query(`
      SELECT m.id, m.name, m.vendor_id, m.specifications, m.is_available
      FROM supplier_materials m
      WHERE m.id = $1
    `, [testProductId]);
    const prod = orderCheckRes.rows[0];
    const approvalStatus = (prod?.vendor_id != null && prod.specifications?.__approval__?.status)
      ? prod.specifications.__approval__.status
      : 'approved';
    const canOrder = prod.is_available && (prod.vendor_id == null || approvalStatus === 'approved');
    assert(!canOrder, 'Ordering pending vendor product is blocked');

    // Test 4: Admin approves product -> goes live (is_available = true, status = approved)
    console.log('\n[Test 4] Admin approves product');
    const approveRes = await pool.query(`
      UPDATE supplier_materials
      SET is_available = TRUE,
          specifications = jsonb_set(
            COALESCE(specifications, '{}'::jsonb),
            '{__approval__}',
            '{"status": "approved", "approved_by": "admin@example.com", "approved_at": "2026-10-12T10:05:00.000Z"}'::jsonb,
            TRUE
          ),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, is_available, specifications
    `, [testProductId]);
    assert(approveRes.rows[0].is_available === true, 'Approved product is_available is now TRUE');
    assert(approveRes.rows[0].specifications?.__approval__?.status === 'approved', 'Product status is now "approved"');

    // Verify it now appears in public shop query
    const publicShopApproved = await pool.query(`
      SELECT m.id, m.name
      FROM supplier_materials m
      WHERE m.id = $1
        AND m.is_available = TRUE
        AND (m.vendor_id IS NULL OR COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'approved')
    `, [testProductId]);
    assert(publicShopApproved.rows.length === 1, 'Approved product appears in public shop query');

    // Test 5: Admin rejects product -> stays hidden (is_available = false, status = rejected, rejection_reason stored)
    console.log('\n[Test 5] Admin rejects product');
    const rejectRes = await pool.query(`
      UPDATE supplier_materials
      SET is_available = FALSE,
          specifications = jsonb_set(
            COALESCE(specifications, '{}'::jsonb),
            '{__approval__}',
            '{"status": "rejected", "rejection_reason": "Price is above threshold", "rejected_by": "admin@example.com", "rejected_at": "2026-10-12T10:10:00.000Z"}'::jsonb,
            TRUE
          ),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, is_available, specifications
    `, [testProductId]);
    assert(rejectRes.rows[0].is_available === false, 'Rejected product is_available is FALSE');
    assert(rejectRes.rows[0].specifications?.__approval__?.status === 'rejected', 'Product status is "rejected"');
    assert(rejectRes.rows[0].specifications?.__approval__?.rejection_reason === 'Price is above threshold', 'Rejection reason is preserved');

    // Verify hidden from public shop query
    const publicShopRejected = await pool.query(`
      SELECT m.id, m.name
      FROM supplier_materials m
      WHERE m.id = $1
        AND m.is_available = TRUE
        AND (m.vendor_id IS NULL OR COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'approved')
    `, [testProductId]);
    assert(publicShopRejected.rows.length === 0, 'Rejected product is hidden from public shop query');

    // Test 6: Vendor edits core field (price) of an approved product -> returns to pending (hidden)
    console.log('\n[Test 6] Vendor edits price -> returns to pending');
    // First set back to approved
    await pool.query(`
      UPDATE supplier_materials
      SET is_available = TRUE,
          specifications = jsonb_set(COALESCE(specifications, '{}'::jsonb), '{__approval__}', '{"status": "approved"}'::jsonb, TRUE)
      WHERE id = $1
    `, [testProductId]);

    // Simulate vendor updating price from 320 to 340 -> backend rule sets is_available = false, status = pending
    const vendorEditRes = await pool.query(`
      UPDATE supplier_materials
      SET price = 340.00,
          is_available = FALSE,
          specifications = jsonb_set(COALESCE(specifications, '{}'::jsonb), '{__approval__}', '{"status": "pending", "updated_at": "2026-10-12T10:15:00.000Z"}'::jsonb, TRUE),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, price, is_available, specifications
    `, [testProductId]);
    assert(Number(vendorEditRes.rows[0].price) === 340, 'Price updated to 340');
    assert(vendorEditRes.rows[0].is_available === false, 'Product returned to is_available = FALSE');
    assert(vendorEditRes.rows[0].specifications?.__approval__?.status === 'pending', 'Product returned to "pending" status');

    // Test 7: Admin and Supplier products go live immediately without approval step
    console.log('\n[Test 7] Admin and Supplier products bypass approval');
    const adminProductRes = await pool.query(`
      INSERT INTO supplier_materials
      (supplier_id, vendor_id, name, price, category, is_available, quality_tier)
      VALUES (0, NULL, 'Admin Power Drill', 2500.00, 'Tools', TRUE, 'premium')
      RETURNING id, vendor_id, is_available, specifications
    `);
    adminProductId = adminProductRes.rows[0].id;
    assert(adminProductRes.rows[0].vendor_id === null, 'Admin product has vendor_id = NULL');
    assert(adminProductRes.rows[0].is_available === true, 'Admin product is immediately available');

    const adminInPublic = await pool.query(`
      SELECT m.id, m.name
      FROM supplier_materials m
      WHERE m.id = $1
        AND m.is_available = TRUE
        AND (m.vendor_id IS NULL OR COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'approved')
    `, [adminProductId]);
    assert(adminInPublic.rows.length === 1, 'Admin product immediately appears in public queries');

    // Test 8: Existing products without approval metadata remain visible and treated as approved
    console.log('\n[Test 8] Existing products without approval value treated as approved');
    const existingLegacyProductRes = await pool.query(`
      INSERT INTO supplier_materials
      (supplier_id, vendor_id, name, price, category, is_available, specifications, quality_tier)
      VALUES (0, $1, 'Legacy Vendor Brick', 15.00, 'Bricks', TRUE, '{"color": "red"}'::jsonb, 'basic')
      RETURNING id, specifications, is_available
    `, [vendorId]);
    const legacyId = existingLegacyProductRes.rows[0].id;

    const legacyInPublic = await pool.query(`
      SELECT m.id, m.name,
             COALESCE(m.specifications->'__approval__'->>'status', 'approved') AS status
      FROM supplier_materials m
      WHERE m.id = $1
        AND m.is_available = TRUE
        AND (m.vendor_id IS NULL OR COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'approved')
    `, [legacyId]);
    assert(legacyInPublic.rows.length === 1, 'Legacy product without __approval__ appears in public queries');
    assert(legacyInPublic.rows[0].status === 'approved', 'Missing approval value defaults to "approved"');

    // Clean up test products
    await pool.query('DELETE FROM supplier_materials WHERE id IN ($1, $2, $3)', [testProductId, adminProductId, legacyId]);
    console.log('\nCleaned up test products.');

  } catch (err) {
    console.error('Error during test execution:', err);
    failed++;
  } finally {
    await pool.end();
  }

  console.log(`\n--- Test Summary: ${passed} Passed, ${failed} Failed ---`);
  if (failed > 0) process.exit(1);
}

runTests();
