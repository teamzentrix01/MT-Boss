import pool from '../src/lib/db.js';
import { computeRedeemLimit, reserveWalletRedeem, releaseWalletRedeem, confirmWalletRedeem } from '../src/lib/wallet/redeem.js';

async function runTests() {
  console.log('=== RUNNING WALLET REDEMPTION TESTS ===');
  const client = await pool.connect();
  let testUserId = null;
  let testOrderId1 = null;
  let testOrderId2 = null;

  try {
    // Setup test user
    const userRes = await client.query(`
      INSERT INTO users (name, phone, email, password)
      VALUES ('Test Wallet User', '9999888877', 'wallet_test@example.com', 'dummy_hash')
      RETURNING id
    `);
    testUserId = userRes.rows[0].id;
    console.log(`Created test user ID: ${testUserId}`);

    // Create wallet with 0 initial balance
    await client.query(`
      INSERT INTO wallets (user_id, balance, pending_balance, updated_at)
      VALUES ($1, 0, 0, NOW())
      ON CONFLICT (user_id) DO NOTHING
    `, [testUserId]);

    // Credit multiple lots with different expiries to test FIFO:
    // Lot A: 100, expires in 2 days
    // Lot B: 200, expires in 10 days
    // Lot C: 50, no expiry (null)
    const lotA = await client.query(`
      INSERT INTO wallet_transactions (user_id, type, amount, remaining_amount, source, status, expires_at, note)
      VALUES ($1, 'CREDIT', 100, 100, 'CASHBACK', 'AVAILABLE', NOW() + INTERVAL '2 days', 'Lot A (exp 2d)')
      RETURNING id
    `, [testUserId]);

    const lotB = await client.query(`
      INSERT INTO wallet_transactions (user_id, type, amount, remaining_amount, source, status, expires_at, note)
      VALUES ($1, 'CREDIT', 200, 200, 'CASHBACK', 'AVAILABLE', NOW() + INTERVAL '10 days', 'Lot B (exp 10d)')
      RETURNING id
    `, [testUserId]);

    const lotC = await client.query(`
      INSERT INTO wallet_transactions (user_id, type, amount, remaining_amount, source, status, expires_at, note)
      VALUES ($1, 'CREDIT', 50, 50, 'CASHBACK', 'AVAILABLE', NULL, 'Lot C (no exp)')
      RETURNING id
    `, [testUserId]);

    await client.query(`UPDATE wallets SET balance = 350 WHERE user_id = $1`, [testUserId]);
    console.log('Credited Lots: A=100 (exp 2d), B=200 (exp 10d), C=50 (no exp). Total balance: 350');

    // TEST 1: computeRedeemLimit with max 10%
    // Order payable = 2000 => 10% = 200 maxAllowed
    const limit1 = await computeRedeemLimit(testUserId, 2000, false);
    console.log('Test 1 (10% max of ₹2000):', limit1);
    if (limit1.maxAllowed !== 200) throw new Error(`Expected maxAllowed 200, got ${limit1.maxAllowed}`);

    // TEST 2: Reserve ₹150 across lots FIFO
    // Should consume all of Lot A (100) and 50 of Lot B (leaving 150)
    const ordRes1 = await client.query(`
      INSERT INTO material_enquiries (user_id, user_name, user_phone, order_reference, category_name, product_total, grand_total, status)
      VALUES ($1, 'Test User', '9999888877', 'TEST-ORD-001', 'Test', 2000, 1850, 'open')
      RETURNING id
    `, [testUserId]);
    testOrderId1 = ordRes1.rows[0].id;

    await client.query('BEGIN');
    const reserve1 = await reserveWalletRedeem({
      client,
      orderId: testOrderId1,
      userId: testUserId,
      amount: 150,
      payableAmount: 2000,
      hasCoupon: false,
    });
    await client.query('COMMIT');
    console.log('Test 2 (Reserve ₹150):', reserve1);
    if (!reserve1.success || reserve1.amount !== 150) throw new Error('Reserve ₹150 failed');

    // Verify lots remaining amount
    const checkLots = await client.query(`
      SELECT id, remaining_amount FROM wallet_transactions WHERE id IN ($1, $2, $3) ORDER BY id
    `, [lotA.rows[0].id, lotB.rows[0].id, lotC.rows[0].id]);
    console.log('Lots after reserve:', checkLots.rows);
    const remA = Number(checkLots.rows.find(r => r.id === lotA.rows[0].id).remaining_amount);
    const remB = Number(checkLots.rows.find(r => r.id === lotB.rows[0].id).remaining_amount);
    const remC = Number(checkLots.rows.find(r => r.id === lotC.rows[0].id).remaining_amount);
    if (remA !== 0 || remB !== 150 || remC !== 50) {
      throw new Error(`FIFO consumption incorrect: remA=${remA}, remB=${remB}, remC=${remC}`);
    }
    console.log('✅ FIFO correctly consumed Lot A (100) and Lot B (50)');

    // Verify allocations
    const allocs = await client.query(`
      SELECT * FROM wallet_redemption_allocations WHERE redeem_txn_id = $1
    `, [reserve1.debitTxnId]);
    console.log(`Allocations created: ${allocs.rows.length}`);
    if (allocs.rows.length !== 2) throw new Error('Expected 2 allocation rows');

    // TEST 3: Idempotency of reserveWalletRedeem on same order
    await client.query('BEGIN');
    const reserveDup = await reserveWalletRedeem({
      client,
      orderId: testOrderId1,
      userId: testUserId,
      amount: 150,
      payableAmount: 2000,
      hasCoupon: false,
    });
    await client.query('COMMIT');
    if (!reserveDup.alreadyReserved) throw new Error('Expected alreadyReserved true on duplicate call');
    console.log('✅ Idempotency test passed for reserveWalletRedeem');

    // TEST 4: Release / restore when payment fails or order cancelled
    await client.query('BEGIN');
    const releaseRes = await releaseWalletRedeem(testOrderId1, client);
    await client.query('COMMIT');
    console.log('Test 4 (Release/Restore):', releaseRes);
    if (!releaseRes.released || releaseRes.restoredAmount !== 150) throw new Error('Release failed');

    const checkLotsAfterRelease = await client.query(`
      SELECT id, remaining_amount FROM wallet_transactions WHERE id IN ($1, $2, $3) ORDER BY id
    `, [lotA.rows[0].id, lotB.rows[0].id, lotC.rows[0].id]);
    const restoredA = Number(checkLotsAfterRelease.rows.find(r => r.id === lotA.rows[0].id).remaining_amount);
    const restoredB = Number(checkLotsAfterRelease.rows.find(r => r.id === lotB.rows[0].id).remaining_amount);
    if (restoredA !== 100 || restoredB !== 200) {
      throw new Error(`Lot amounts not restored: restoredA=${restoredA}, restoredB=${restoredB}`);
    }
    console.log('✅ Lots restored: Lot A back to 100, Lot B back to 200');

    // Verify wallet balance restored to 350
    const wRes = await client.query(`SELECT balance FROM wallets WHERE user_id = $1`, [testUserId]);
    if (Number(wRes.rows[0].balance) !== 350) throw new Error(`Wallet balance expected 350, got ${wRes.rows[0].balance}`);
    console.log('✅ Wallet balance restored to 350');

    // TEST 5: Idempotency of releaseWalletRedeem
    await client.query('BEGIN');
    const releaseDup = await releaseWalletRedeem(testOrderId1, client);
    await client.query('COMMIT');
    if (!releaseDup.alreadyReleased) throw new Error('Expected alreadyReleased true on double release');
    console.log('✅ Idempotency test passed for releaseWalletRedeem');

    console.log('\n🎉 ALL WALLET REDEMPTION TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ TEST FAILED:', err);
    throw err;
  } finally {
    // Cleanup test records
    try {
      if (testOrderId1) {
        await client.query(`DELETE FROM wallet_redemption_allocations WHERE redeem_txn_id IN (SELECT id FROM wallet_transactions WHERE order_id = $1)`, [testOrderId1]);
        await client.query(`DELETE FROM wallet_transactions WHERE order_id = $1`, [testOrderId1]);
        await client.query(`DELETE FROM material_enquiries WHERE id = $1`, [testOrderId1]);
      }
      if (testUserId) {
        await client.query(`DELETE FROM wallet_transactions WHERE user_id = $1`, [testUserId]);
        await client.query(`DELETE FROM wallets WHERE user_id = $1`, [testUserId]);
        await client.query(`DELETE FROM users WHERE id = $1`, [testUserId]);
      }
    } catch (e) {
      console.warn('Cleanup error:', e.message);
    }
    client.release();
    await pool.end();
  }
}

runTests();
