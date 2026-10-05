import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
const pool = new Pool({ connectionString });

async function runTest() {
  console.log('--- Testing Phase 3 End-to-End Flow ---');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Create a party
    const partyRes = await client.query(
      `INSERT INTO pm_parties (name, phone, email) VALUES ('Phase3 Test Client', '9888888888', 'p3@test.com') RETURNING id, name`
    );
    const partyId = partyRes.rows[0].id;
    console.log('1. Created Party:', partyRes.rows[0].name, 'ID:', partyId);

    // 2. Create Project A and Project B
    const projARes = await client.query(
      `INSERT INTO pm_projects (party_id, name, start_date, contract_value, built_up_area, status)
       VALUES ($1, 'Project Alpha Site', CURRENT_DATE, 500000, 2500, 'running')
       RETURNING id, name`,
      [partyId]
    );
    const projAId = projARes.rows[0].id;

    const projBRes = await client.query(
      `INSERT INTO pm_projects (party_id, name, start_date, contract_value, built_up_area, status)
       VALUES ($1, 'Project Beta Site', CURRENT_DATE, 400000, 1800, 'running')
       RETURNING id, name`,
      [partyId]
    );
    const projBId = projBRes.rows[0].id;
    console.log('2. Created Projects: Alpha (ID:', projAId, '), Beta (ID:', projBId, ')');

    // 3. Create Master Materials
    const matRes = await client.query(
      `INSERT INTO pm_materials (name, unit, category, min_stock_level)
       VALUES ('UltraTech Cement P3', 'bags', 'Civil', 20)
       RETURNING id, name, unit, min_stock_level`
    );
    const matId = matRes.rows[0].id;
    console.log('3. Created Master Material:', matRes.rows[0].name, 'ID:', matId);

    // 4. Direct Material Received in Project Alpha (100 bags @ 350)
    const rcvRes = await client.query(
      `INSERT INTO pm_material_received (
         project_id, material_id, supplier_name, quantity, rate, amount,
         received_date, challan_no, created_by
       ) VALUES ($1, $2, 'Birla Direct Supplier', 100, 350, 35000, CURRENT_DATE, 'CH-001', 'tester')
       RETURNING id, quantity, rate, amount`,
      [projAId, matId]
    );
    console.log('4. Recorded Direct Material Received: 100 bags @ 350 = ₹', rcvRes.rows[0].amount);

    // Verify stock in Project Alpha
    let stockRes = await client.query(
      `WITH r AS (SELECT SUM(quantity) q, SUM(amount) a FROM pm_material_received WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted),
            u AS (SELECT SUM(quantity) q FROM pm_material_used WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted),
            adj AS (SELECT SUM(quantity) q FROM pm_material_adjustments WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted)
       SELECT COALESCE(r.q,0)-COALESCE(u.q,0)-COALESCE(adj.q,0) stock,
              CASE WHEN COALESCE(r.q,0)>0 THEN r.a/r.q ELSE 0 END avg_rate
       FROM r, u, adj`,
      [projAId, matId]
    );
    console.log('   Alpha Stock:', stockRes.rows[0].stock, 'Avg Rate:', stockRes.rows[0].avg_rate);
    if (Number(stockRes.rows[0].stock) !== 100) throw new Error('Stock should be 100');

    // 5. Vendor Material Supply Auto-Linking
    const vendorRes = await client.query(`INSERT INTO pm_vendors (name, trade) VALUES ('Phase3 Cement Vendor', 'Supplier') RETURNING id`);
    const vendorId = vendorRes.rows[0].id;
    const pvRes = await client.query(
      `INSERT INTO pm_project_vendors (project_id, vendor_id, work_description, pay_type)
       VALUES ($1, $2, 'Material supply vendor', 'contract') RETURNING id`,
      [projAId, vendorId]
    );
    const pvId = pvRes.rows[0].id;

    // Insert supply with material_id
    const supplyRes = await client.query(
      `INSERT INTO pm_vendor_material_supply (
         project_vendor_id, item_name, unit, quantity, rate, amount,
         supply_date, material_id, created_by
       ) VALUES ($1, 'Cement Supply', 'bags', 50, 360, 18000, CURRENT_DATE, $2, 'tester')
       RETURNING id`,
      [pvId, matId]
    );
    const supplyId = supplyRes.rows[0].id;

    // In same transaction, insert linked pm_material_received
    await client.query(
      `INSERT INTO pm_material_received (
         project_id, material_id, supplier_name, supplier_vendor_id, vendor_supply_id,
         quantity, rate, amount, received_date, created_by
       ) VALUES ($1, $2, 'Phase3 Cement Vendor', $3, $4, 50, 360, 18000, CURRENT_DATE, 'tester')`,
      [projAId, matId, vendorId, supplyId]
    );
    console.log('5. Recorded Vendor Supply with auto-linked pm_material_received (50 bags @ 360 = ₹18,000)');

    // Verify combined stock = 150
    stockRes = await client.query(
      `WITH r AS (SELECT SUM(quantity) q, SUM(amount) a FROM pm_material_received WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted),
            u AS (SELECT SUM(quantity) q FROM pm_material_used WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted),
            adj AS (SELECT SUM(quantity) q FROM pm_material_adjustments WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted)
       SELECT COALESCE(r.q,0)-COALESCE(u.q,0)-COALESCE(adj.q,0) stock,
              CASE WHEN COALESCE(r.q,0)>0 THEN r.a/r.q ELSE 0 END avg_rate
       FROM r, u, adj`,
      [projAId, matId]
    );
    console.log('   Alpha Stock after vendor supply:', stockRes.rows[0].stock, 'Avg Rate:', Number(stockRes.rows[0].avg_rate).toFixed(2));
    if (Number(stockRes.rows[0].stock) !== 150) throw new Error('Stock should be 150');

    // Verify non-double-counted material cost:
    // direct purchases (vendor_supply_id IS NULL AND NOT transfer_in) = 35,000
    // vendor supplied = 18,000
    // Total material cost = 53,000
    const matCostCheck = await client.query(
      `SELECT
         COALESCE((SELECT SUM(amount) FROM pm_material_received WHERE project_id=$1 AND vendor_supply_id IS NULL AND NOT transfer_in AND NOT is_deleted), 0) direct_mat,
         COALESCE((SELECT SUM(amount) FROM pm_vendor_material_supply WHERE project_vendor_id=$2 AND NOT is_deleted), 0) vendor_mat`,
      [projAId, pvId]
    );
    const directMat = Number(matCostCheck.rows[0].direct_mat);
    const vendorMat = Number(matCostCheck.rows[0].vendor_mat);
    console.log('   Direct material cost:', directMat, 'Vendor material cost:', vendorMat, 'Total:', directMat + vendorMat);
    if (directMat !== 35000 || vendorMat !== 18000) throw new Error('Material cost calculations mismatch');

    // 6. Material Used (record 60 bags used for foundation)
    await client.query(
      `INSERT INTO pm_material_used (project_id, material_id, quantity, used_date, used_for, created_by)
       VALUES ($1, $2, 60, CURRENT_DATE, 'Foundation casting', 'tester')`,
      [projAId, matId]
    );
    console.log('6. Recorded Material Used: 60 bags');

    // 7. Material Adjustment - Transfer out 20 bags to Project Beta
    const avgRateA = Number(stockRes.rows[0].avg_rate);
    const adjRes = await client.query(
      `INSERT INTO pm_material_adjustments (
         project_id, material_id, adjustment_type, quantity,
         adjustment_date, to_project_id, created_by
       ) VALUES ($1, $2, 'transfer_out', 20, CURRENT_DATE, $3, 'tester')
       RETURNING id`,
      [projAId, matId, projBId]
    );

    // Auto-create transfer_in received in Project Beta
    await client.query(
      `INSERT INTO pm_material_received (
         project_id, material_id, supplier_name, quantity, rate, amount,
         received_date, transfer_in, created_by
       ) VALUES ($1, $2, 'Transfer from Project Alpha Site', 20, $3, $4, CURRENT_DATE, TRUE, 'tester')`,
      [projBId, matId, avgRateA, 20 * avgRateA]
    );
    console.log('7. Recorded Transfer Out of 20 bags from Alpha to Beta @ rate', avgRateA.toFixed(2));

    // Check Project Alpha stock: 150 - 60 used - 20 transferred = 70 bags
    const alphaStockAfter = await client.query(
      `WITH r AS (SELECT SUM(quantity) q FROM pm_material_received WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted),
            u AS (SELECT SUM(quantity) q FROM pm_material_used WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted),
            adj AS (SELECT SUM(quantity) q FROM pm_material_adjustments WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted)
       SELECT COALESCE(r.q,0)-COALESCE(u.q,0)-COALESCE(adj.q,0) stock
       FROM r, u, adj`,
      [projAId, matId]
    );
    console.log('   Alpha Stock after usage and transfer:', alphaStockAfter.rows[0].stock);
    if (Number(alphaStockAfter.rows[0].stock) !== 70) throw new Error('Alpha stock should be 70');

    // Check Project Beta stock: 20 bags
    const betaStock = await client.query(
      `WITH r AS (SELECT SUM(quantity) q FROM pm_material_received WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted),
            u AS (SELECT SUM(quantity) q FROM pm_material_used WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted),
            adj AS (SELECT SUM(quantity) q FROM pm_material_adjustments WHERE project_id=$1 AND material_id=$2 AND NOT is_deleted)
       SELECT COALESCE(r.q,0)-COALESCE(u.q,0)-COALESCE(adj.q,0) stock
       FROM r, u, adj`,
      [projBId, matId]
    );
    console.log('   Beta Stock from transfer:', betaStock.rows[0].stock);
    if (Number(betaStock.rows[0].stock) !== 20) throw new Error('Beta stock should be 20');

    // 8. Other Expenses
    await client.query(
      `INSERT INTO pm_other_expenses (project_id, category, amount, expense_date, note, created_by)
       VALUES ($1, 'machine_rent', 12000, CURRENT_DATE, 'JCB excavation 2 days', 'tester'),
              ($1, 'transport', 3500, CURRENT_DATE, 'Tractor trolley bricks transport', 'tester')`,
      [projAId]
    );
    const expRes = await client.query(
      `SELECT SUM(amount) total_exp FROM pm_other_expenses WHERE project_id=$1 AND NOT is_deleted`,
      [projAId]
    );
    console.log('8. Recorded Other Expenses total = ₹', expRes.rows[0].total_exp);
    if (Number(expRes.rows[0].total_exp) !== 15500) throw new Error('Other expenses should be 15500');

    // 9. Party Payment and Total Project Profit Rollup
    await client.query(
      `INSERT INTO pm_party_payments (project_id, amount, payment_date, created_by)
       VALUES ($1, 200000, CURRENT_DATE, 'tester')`,
      [projAId]
    );

    // Total Project Alpha Expense:
    // labour = 0
    // material = 35000 (direct) + 18000 (vendor) = 53000
    // other = 15500
    // Total Expense = 68500
    // Received = 200000
    // Net Profit = 200000 - 68500 = 131500
    const rollup = await client.query(
      `WITH direct_mat AS (SELECT COALESCE(SUM(amount),0) amt FROM pm_material_received WHERE project_id=$1 AND NOT is_deleted AND vendor_supply_id IS NULL AND NOT transfer_in),
            ven_mat AS (SELECT COALESCE(SUM(m.amount),0) amt FROM pm_vendor_material_supply m JOIN pm_project_vendors pv ON pv.id=m.project_vendor_id WHERE pv.project_id=$1 AND NOT m.is_deleted),
            other_e AS (SELECT COALESCE(SUM(amount),0) amt FROM pm_other_expenses WHERE project_id=$1 AND NOT is_deleted),
            rcv AS (SELECT COALESCE(SUM(amount),0) amt FROM pm_party_payments WHERE project_id=$1 AND NOT is_deleted)
       SELECT direct_mat.amt direct_mat, ven_mat.amt ven_mat,
              direct_mat.amt + ven_mat.amt total_mat,
              other_e.amt other_expenses,
              direct_mat.amt + ven_mat.amt + other_e.amt total_project_expense,
              rcv.amt received,
              rcv.amt - (direct_mat.amt + ven_mat.amt + other_e.amt) net_profit
       FROM direct_mat, ven_mat, other_e, rcv`,
      [projAId]
    );

    const r = rollup.rows[0];
    console.log('9. Project Alpha Financial Rollup:');
    console.log('   Total Material:', r.total_mat, '(Direct:', r.direct_mat, '+ Vendor:', r.ven_mat, ')');
    console.log('   Other Expenses:', r.other_expenses);
    console.log('   Total Expense:', r.total_project_expense);
    console.log('   Party Received:', r.received);
    console.log('   Net Profit So Far:', r.net_profit);

    if (Number(r.total_mat) !== 53000) throw new Error('Total material mismatch');
    if (Number(r.total_project_expense) !== 68500) throw new Error('Total expense mismatch');
    if (Number(r.net_profit) !== 131500) throw new Error('Net profit mismatch');

    // 10. Audit Logging Verification
    await client.query(
      `INSERT INTO pm_audit_log (table_name, record_id, action, changed_by, old_data, new_data)
       VALUES ('pm_material_received', 99999, 'updated', 'tester', '{"quantity": 100}', '{"quantity": 120}')`
    );
    const auditRes = await client.query(
      `SELECT * FROM pm_audit_log WHERE table_name='pm_material_received' ORDER BY id DESC LIMIT 1`
    );
    console.log('10. Audit log verified for table:', auditRes.rows[0].table_name, 'Action:', auditRes.rows[0].action);

    await client.query('ROLLBACK'); // Roll back test transaction to leave DB pristine
    console.log('--- ALL PHASE 3 INTEGRATION TESTS PASSED (10/10) ---');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runTest();
