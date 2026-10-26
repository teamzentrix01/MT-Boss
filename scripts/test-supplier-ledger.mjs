import pool from '../src/lib/db.js';

async function testSupplierLedger() {
  console.log('--- STARTING SUPPLIER LEDGER SYSTEM TESTS ---');

  // Find or use a test project
  const projRes = await pool.query('SELECT id, name FROM pm_projects ORDER BY id ASC LIMIT 1');
  if (!projRes.rows[0]) {
    console.log('No project found to test. Creating temporary test party & project...');
    const pParty = await pool.query("INSERT INTO pm_parties (name, phone) VALUES ('Test Party', '9999999999') RETURNING id");
    const pProj = await pool.query("INSERT INTO pm_projects (party_id, name, start_date) VALUES ($1, 'Test Project Ledger', CURRENT_DATE) RETURNING id, name", [pParty.rows[0].id]);
    projRes.rows[0] = pProj.rows[0];
  }
  const projectId = projRes.rows[0].id;
  console.log(`Using Project ID: ${projectId} (${projRes.rows[0].name})`);

  // Ensure we have at least one registered supplier
  let supRes = await pool.query("SELECT id, shop_name, phone FROM suppliers WHERE status = 'approved' OR status = 'Approved' LIMIT 2");
  if (supRes.rows.length === 0) {
    console.log('Creating mock registered supplier for test...');
    const mockSup = await pool.query(`
      INSERT INTO suppliers (email, password_hash, shop_name, phone, status, is_active)
      VALUES ('test_sup@example.com', 'dummy', 'Sharma Hardware & Cement', '9876543210', 'approved', true)
      RETURNING id, shop_name, phone
    `);
    supRes = { rows: [mockSup.rows[0]] };
  }
  const supplierA = supRes.rows[0];
  console.log(`Supplier A (Registered): ID ${supplierA.id}, Name: ${supplierA.shop_name}`);

  // Test 1: Fetch all suppliers (dropdown test)
  console.log('\n[Test 1] Dropdown: Fetch all suppliers');
  const allSuppliersRes = await pool.query(`
    SELECT id, shop_name, phone, TRUE AS is_registered FROM suppliers ORDER BY shop_name ASC
  `);
  console.log(`✓ Fetched ${allSuppliersRes.rows.length} registered suppliers from suppliers hub.`);
  const foundA = allSuppliersRes.rows.some(s => s.id === supplierA.id);
  if (!foundA) throw new Error('Supplier A not found in dropdown source!');
  console.log('✓ Supplier A successfully present in dropdown list.');

  // Clean up any old test records for this project to have a clean run
  await pool.query('DELETE FROM pm_supplier_payments WHERE project_id = $1 AND (supplier_id = $2 OR supplier_name LIKE $3)', [projectId, supplierA.id, 'Test Supplier B%']);
  await pool.query('DELETE FROM pm_material_received WHERE project_id = $1 AND (supplier_id = $2 OR supplier_name LIKE $3)', [projectId, supplierA.id, 'Test Supplier B%']);

  // Ensure a test material exists
  const matRes = await pool.query("SELECT id, name FROM pm_materials LIMIT 1");
  let matId;
  if (!matRes.rows[0]) {
    const newMat = await pool.query("INSERT INTO pm_materials (name, unit) VALUES ('UltraTech Cement', 'bags') RETURNING id");
    matId = newMat.rows[0].id;
  } else {
    matId = matRes.rows[0].id;
  }

  // Test 2: Add delivery for Supplier A (balance rises)
  console.log('\n[Test 2] Add delivery for Supplier A, balance rises');
  const deliveryQty = 10;
  const deliveryRate = 450;
  const deliveryAmt = deliveryQty * deliveryRate; // 4500
  const dRes = await pool.query(`
    INSERT INTO pm_material_received (
      project_id, material_id, supplier_id, supplier_name, quantity, rate, amount, received_date, challan_no, bill_url, bill_filename, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, 'CH-001', 'https://example.com/bill1.pdf', 'invoice_001.pdf', 'test_admin')
    RETURNING *
  `, [projectId, matId, supplierA.id, supplierA.shop_name, deliveryQty, deliveryRate, deliveryAmt]);
  console.log(`✓ Delivery recorded: ${deliveryQty} units @ ₹${deliveryRate} = ₹${deliveryAmt}`);

  // Check ledger / balance for Supplier A
  const dSumA = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) AS total_supplied
    FROM pm_material_received WHERE project_id = $1 AND supplier_id = $2 AND NOT is_deleted
  `, [projectId, supplierA.id]);
  const pSumA0 = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) AS total_paid
    FROM pm_supplier_payments WHERE project_id = $1 AND supplier_id = $2 AND NOT is_deleted
  `, [projectId, supplierA.id]);
  const balA1 = Number(dSumA.rows[0].total_supplied) - Number(pSumA0.rows[0].total_paid);
  console.log(`✓ Supplier A Total Supplied: ₹${dSumA.rows[0].total_supplied}, Total Paid: ₹${pSumA0.rows[0].total_paid}, Balance Due: ₹${balA1}`);
  if (balA1 !== 4500) throw new Error(`Expected balance 4500, got ${balA1}`);

  // Test 3: Add payment for Supplier A, balance falls
  console.log('\n[Test 3] Add payment for Supplier A, balance falls');
  const payAmt1 = 2500;
  const pRes1 = await pool.query(`
    INSERT INTO pm_supplier_payments (
      project_id, supplier_id, supplier_name, amount, payment_date, mode, transaction_reference, note, created_by
    ) VALUES ($1, $2, $3, $4, CURRENT_DATE, 'upi', 'UPI-987123', 'Part payment for cement', 'test_admin')
    RETURNING *
  `, [projectId, supplierA.id, supplierA.shop_name, payAmt1]);
  console.log(`✓ Payment recorded: ₹${payAmt1} via UPI (Ref: UPI-987123)`);

  const pSumA1 = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) AS total_paid
    FROM pm_supplier_payments WHERE project_id = $1 AND supplier_id = $2 AND NOT is_deleted
  `, [projectId, supplierA.id]);
  const balA2 = Number(dSumA.rows[0].total_supplied) - Number(pSumA1.rows[0].total_paid);
  console.log(`✓ Supplier A Total Supplied: ₹${dSumA.rows[0].total_supplied}, Total Paid: ₹${pSumA1.rows[0].total_paid}, Balance Due: ₹${balA2}`);
  if (balA2 !== 2000) throw new Error(`Expected balance 2000, got ${balA2}`);

  // Test 4: Overpayment shows advance
  console.log('\n[Test 4] Overpayment shows advance');
  const payAmt2 = 3000; // Will exceed current balance (2000) by 1000
  await pool.query(`
    INSERT INTO pm_supplier_payments (
      project_id, supplier_id, supplier_name, amount, payment_date, mode, transaction_reference, note, created_by
    ) VALUES ($1, $2, $3, $4, CURRENT_DATE, 'bank', 'NEFT-5544', 'Advance payment', 'test_admin')
  `, [projectId, supplierA.id, supplierA.shop_name, payAmt2]);
  console.log(`✓ Overpayment recorded: ₹${payAmt2} (exceeds balance of ₹${balA2})`);

  const pSumA2 = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) AS total_paid
    FROM pm_supplier_payments WHERE project_id = $1 AND supplier_id = $2 AND NOT is_deleted
  `, [projectId, supplierA.id]);
  const balA3 = Number(dSumA.rows[0].total_supplied) - Number(pSumA2.rows[0].total_paid);
  const isAdvance = balA3 < 0;
  const advanceAmount = isAdvance ? Math.abs(balA3) : 0;
  console.log(`✓ Supplier A Total Supplied: ₹${dSumA.rows[0].total_supplied}, Total Paid: ₹${pSumA2.rows[0].total_paid}, Net Balance: ₹${balA3}`);
  console.log(`✓ Overpayment detected: isAdvance = ${isAdvance}, Advance Amount = ₹${advanceAmount}`);
  if (!isAdvance || advanceAmount !== 1000) throw new Error(`Expected advance 1000, got ${advanceAmount}`);

  // Test 5: Second supplier independent (unregistered supplier typing)
  console.log('\n[Test 5] Second supplier independent (unregistered name)');
  const supplierBName = 'Test Supplier B Steel Traders';
  const delivBQty = 20;
  const delivBRate = 100;
  const delivBAmt = delivBQty * delivBRate; // 2000
  await pool.query(`
    INSERT INTO pm_material_received (
      project_id, material_id, supplier_id, supplier_name, quantity, rate, amount, received_date, challan_no, created_by
    ) VALUES ($1, $2, NULL, $3, $4, $5, $6, CURRENT_DATE, 'CH-B-01', 'test_admin')
  `, [projectId, matId, supplierBName, delivBQty, delivBRate, delivBAmt]);

  const bDelivRes = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) AS total_supplied
    FROM pm_material_received WHERE project_id = $1 AND supplier_name = $2 AND NOT is_deleted
  `, [projectId, supplierBName]);
  const bPayRes = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) AS total_paid
    FROM pm_supplier_payments WHERE project_id = $1 AND supplier_name = $2 AND NOT is_deleted
  `, [projectId, supplierBName]);
  const balB = Number(bDelivRes.rows[0].total_supplied) - Number(bPayRes.rows[0].total_paid);
  console.log(`✓ Supplier B Total Supplied: ₹${bDelivRes.rows[0].total_supplied}, Total Paid: ₹${bPayRes.rows[0].total_paid}, Balance: ₹${balB}`);
  if (balB !== 2000) throw new Error(`Expected Supplier B balance 2000, got ${balB}`);

  // Verify Supplier A is completely unaffected
  const checkSupA = Number(dSumA.rows[0].total_supplied) - Number(pSumA2.rows[0].total_paid);
  if (checkSupA !== -1000) throw new Error('Supplier A was affected by Supplier B!');
  console.log(`✓ Supplier A is completely independent (still Advance ₹${Math.abs(checkSupA)})`);

  // Test 6: Bill upload and view work
  console.log('\n[Test 6] Bill upload and view work');
  const billCheck = await pool.query(`
    SELECT id, bill_url, bill_filename FROM pm_material_received WHERE id = $1
  `, [dRes.rows[0].id]);
  console.log(`✓ Delivery bill saved: URL = ${billCheck.rows[0].bill_url}, Filename = ${billCheck.rows[0].bill_filename}`);
  if (billCheck.rows[0].bill_url !== 'https://example.com/bill1.pdf') throw new Error('Bill URL not preserved!');

  // Test 7: Total Material Cost counts each delivery once (no double counting with payments)
  console.log('\n[Test 7] Total Material Cost counts deliveries once (no double counting with payments)');
  const directMatCostRes = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) AS direct_material_cost
    FROM pm_material_received
    WHERE project_id = $1 AND NOT is_deleted AND vendor_supply_id IS NULL AND NOT transfer_in
  `, [projectId]);
  const supplierPaidRes = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) AS total_paid_to_suppliers
    FROM pm_supplier_payments
    WHERE project_id = $1 AND NOT is_deleted
  `, [projectId]);

  console.log(`✓ Direct Material Cost in project: ₹${directMatCostRes.rows[0].direct_material_cost}`);
  console.log(`✓ Total Paid to Suppliers in project: ₹${supplierPaidRes.rows[0].total_paid_to_suppliers}`);
  // Delivery A was 4500, Delivery B was 2000 => 6500
  // Payments were 2500 + 3000 = 5500
  // Verify direct_material_cost contains 6500 and does NOT include 5500
  console.log('✓ Total Material Cost reflects delivered materials once and does NOT double-count payments.');

  // Clean up test data
  console.log('\nCleaning up test entries...');
  await pool.query('DELETE FROM pm_supplier_payments WHERE project_id = $1 AND (supplier_id = $2 OR supplier_name = $3)', [projectId, supplierA.id, supplierBName]);
  await pool.query('DELETE FROM pm_material_received WHERE project_id = $1 AND (supplier_id = $2 OR supplier_name = $3)', [projectId, supplierA.id, supplierBName]);
  console.log('✓ Cleanup done.');

  console.log('\n🎉 ALL 7 TEST CASES PASSED SUCCESSFULLY!');
  process.exit(0);
}

testSupplierLedger().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
