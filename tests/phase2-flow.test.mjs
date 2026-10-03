import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
const pool = new Pool({ connectionString });

async function runTest() {
  console.log('--- Testing Phase 2 End-to-End Flow ---');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Create a party
    const partyRes = await client.query(
      `INSERT INTO pm_parties (name, phone, email) VALUES ('Phase2 Test Party', '9999999999', 'p2test@test.com') RETURNING id, name`
    );
    const partyId = partyRes.rows[0].id;
    console.log('1. Created Party:', partyRes.rows[0].name, 'ID:', partyId);

    // 2. Create a project
    const projRes = await client.query(
      `INSERT INTO pm_projects (party_id, name, start_date, contract_value, built_up_area, status)
       VALUES ($1, 'Phase2 Test Construction', '2026-09-01', 500000, 1000, 'running')
       RETURNING id, name, contract_value`,
      [partyId]
    );
    const projectId = projRes.rows[0].id;
    console.log('2. Created Project:', projRes.rows[0].name, 'ID:', projectId);

    // 3. Create 2 vendors
    const v1Res = await client.query(
      `INSERT INTO pm_vendors (name, phone, trade) VALUES ('Ramesh Mason', '9811111111', 'Masonry') RETURNING id, name`
    );
    const v1Id = v1Res.rows[0].id;

    const v2Res = await client.query(
      `INSERT INTO pm_vendors (name, phone, trade) VALUES ('Suresh Electric', '9822222222', 'Electrical') RETURNING id, name`
    );
    const v2Id = v2Res.rows[0].id;
    console.log('3. Created Vendors:', v1Res.rows[0].name, '&', v2Res.rows[0].name);

    // Assign Vendor 1 (Daily Wage)
    const pv1Res = await client.query(
      `INSERT INTO pm_project_vendors (project_id, vendor_id, work_description, pay_type, daily_rate, status)
       VALUES ($1, $2, 'Brickwork and plaster', 'daily_wage', 600, 'active') RETURNING id`,
      [projectId, v1Id]
    );
    const pv1Id = pv1Res.rows[0].id;

    // Assign Vendor 2 (Contract)
    const pv2Res = await client.query(
      `INSERT INTO pm_project_vendors (project_id, vendor_id, work_description, pay_type, contract_amount, status)
       VALUES ($1, $2, 'Full wiring & conduit installation', 'contract', 50000, 'active') RETURNING id`,
      [projectId, v2Id]
    );
    const pv2Id = pv2Res.rows[0].id;
    console.log('   Assigned to project:', { pv1Id, pv2Id });

    // 4. Mark attendance for Vendor 1
    // Day 1: Present, 2 workers @ 600 = 1200
    await client.query(
      `INSERT INTO pm_attendance (project_vendor_id, attendance_date, status, workers_count, rate_per_worker, wage_amount, created_by)
       VALUES ($1, '2026-09-02', 'present', 2, 600, 1200, 'test_runner')`,
      [pv1Id]
    );
    // Day 2: Half day, 2 workers @ 600 = 600
    await client.query(
      `INSERT INTO pm_attendance (project_vendor_id, attendance_date, status, workers_count, rate_per_worker, wage_amount, created_by)
       VALUES ($1, '2026-09-03', 'half_day', 2, 600, 600, 'test_runner')`,
      [pv1Id]
    );
    // Day 3: Absent = 0
    await client.query(
      `INSERT INTO pm_attendance (project_vendor_id, attendance_date, status, workers_count, rate_per_worker, wage_amount, created_by)
       VALUES ($1, '2026-09-04', 'absent', 1, 600, 0, 'test_runner')`,
      [pv1Id]
    );
    console.log('4. Attendance recorded: 3 days (Total labour = 1800)');

    // 5. Vendor material supply for Vendor 1
    // 10 bags cement @ 400 = 4000
    await client.query(
      `INSERT INTO pm_vendor_material_supply (project_vendor_id, item_name, unit, quantity, rate, amount, supply_date, created_by)
       VALUES ($1, 'UltraTech Cement', 'bags', 10, 400, 4000, '2026-09-05', 'test_runner')`,
      [pv1Id]
    );
    console.log('5. Material supply recorded: 4000 (Total earned V1 = 1800 + 4000 = 5800)');

    // 6. Vendor Payments
    // Pay V1: 2000
    await client.query(
      `INSERT INTO pm_vendor_payments (project_vendor_id, amount, payment_date, mode, payment_type, created_by)
       VALUES ($1, 2000, '2026-09-06', 'bank', 'labour', 'test_runner')`,
      [pv1Id]
    );
    // Pay V2: 20000
    await client.query(
      `INSERT INTO pm_vendor_payments (project_vendor_id, amount, payment_date, mode, payment_type, created_by)
       VALUES ($1, 20000, '2026-09-07', 'bank', 'contract', 'test_runner')`,
      [pv2Id]
    );
    console.log('6. Payments recorded: V1 paid 2000, V2 paid 20000');

    // 7. Verify aggregated queries for Project Vendors
    const pvVerifyRes = await client.query(
      `WITH labour AS (
         SELECT a.project_vendor_id, SUM(a.wage_amount) amount FROM pm_attendance a GROUP BY a.project_vendor_id
       ),
       materials AS (
         SELECT m.project_vendor_id, SUM(m.amount) amount FROM pm_vendor_material_supply m WHERE NOT m.is_deleted GROUP BY m.project_vendor_id
       ),
       payments AS (
         SELECT x.project_vendor_id, SUM(x.amount) amount FROM pm_vendor_payments x WHERE NOT x.is_deleted GROUP BY x.project_vendor_id
       )
       SELECT
         pv.id, pv.pay_type, pv.contract_amount,
         COALESCE(l.amount, 0) AS labour_earned,
         COALESCE(m.amount, 0) AS material_earned,
         COALESCE(x.amount, 0) AS paid,
         CASE WHEN pv.pay_type = 'contract' THEN pv.contract_amount ELSE COALESCE(l.amount, 0) END + COALESCE(m.amount, 0) AS earned,
         (CASE WHEN pv.pay_type = 'contract' THEN pv.contract_amount ELSE COALESCE(l.amount, 0) END + COALESCE(m.amount, 0)) - COALESCE(x.amount, 0) AS balance
       FROM pm_project_vendors pv
       LEFT JOIN labour l ON l.project_vendor_id = pv.id
       LEFT JOIN materials m ON m.project_vendor_id = pv.id
       LEFT JOIN payments x ON x.project_vendor_id = pv.id
       WHERE pv.project_id = $1
       ORDER BY pv.id`,
      [projectId]
    );

    const v1Calculated = pvVerifyRes.rows.find((r) => r.id === pv1Id);
    const v2Calculated = pvVerifyRes.rows.find((r) => r.id === pv2Id);

    console.log('7. Verification Results:');
    console.log('   Vendor 1 (Daily Wage):', {
      labour_earned: v1Calculated.labour_earned,
      material_earned: v1Calculated.material_earned,
      earned: v1Calculated.earned,
      paid: v1Calculated.paid,
      balance: v1Calculated.balance,
    });
    console.log('   Vendor 2 (Contract):', {
      contract_amount: v2Calculated.contract_amount,
      earned: v2Calculated.earned,
      paid: v2Calculated.paid,
      balance: v2Calculated.balance,
    });

    // Assertions
    if (Number(v1Calculated.earned) !== 5800) throw new Error(`V1 earned expected 5800, got ${v1Calculated.earned}`);
    if (Number(v1Calculated.paid) !== 2000) throw new Error(`V1 paid expected 2000, got ${v1Calculated.paid}`);
    if (Number(v1Calculated.balance) !== 3800) throw new Error(`V1 balance expected 3800, got ${v1Calculated.balance}`);

    if (Number(v2Calculated.earned) !== 50000) throw new Error(`V2 earned expected 50000, got ${v2Calculated.earned}`);
    if (Number(v2Calculated.paid) !== 20000) throw new Error(`V2 paid expected 20000, got ${v2Calculated.paid}`);
    if (Number(v2Calculated.balance) !== 30000) throw new Error(`V2 balance expected 30000, got ${v2Calculated.balance}`);

    // Rollback test transaction cleanly
    await client.query('ROLLBACK');
    console.log('✅ TEST PASSED: All Phase 2 calculations & balance rules match manual calculation 100%!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runTest();
