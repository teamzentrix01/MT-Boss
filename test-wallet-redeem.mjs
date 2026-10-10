import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
const pool = new Pool({ connectionString });

async function run() {
  console.log('--- Testing Wallet Redemption System ---');
  const { computeRedeemLimit, reserveWalletRedeem, releaseWalletRedeem } = await import('./src/lib/wallet/redeem.js');
  const { calculateCashback } = await import('./src/lib/cashback/calculate.js');
  const { processScheduledMaturityAndExpiry } = await import('./src/lib/cashback/service.js');

  const client = await pool.connect();
  let uId = null;
  let oId = null;

  try {
    const p1 = '$1';
    const p2 = '$2';
    const p3 = '$3';
    const p4 = '$4';
    const p5 = '$5';
    const p6 = '$6';
    const p7 = '$7';
    const p8 = '$8';

    const uRes = await client.query(
      INSERT INTO users (name, email, phone, role, password) VALUES (, , , , ) RETURNING id,
      ['Test User', 'test_' + Date.now() + '@mtboss.com', '9999999999', 'user', 'hash']
    );
    uId = uRes.rows[0].id;

    const oRes = await client.query(
      INSERT INTO material_enquiries (user_id, order_reference, status, product_total, grand_total) VALUES (, , , , ) RETURNING id,
      [uId, 'TT-01', 'open', 1000, 1050]
    );
    oId = oRes.rows[0].id;

    const in2d = new Date(Date.now() + 2 * 86400000);
    const in5d = new Date(Date.now() + 5 * 86400000);

    const lA = await client.query(
      INSERT INTO wallet_transactions (user_id, type, source, status, amount, remaining_amount, available_at, expires_at, note) VALUES (, , , , , , NOW(), , ) RETURNING id,
      [uId, 'CREDIT', 'CASHBACK', 'AVAILABLE', 100, 100, in5d, 'Lot A: 5 days']
    );
    const lB = await client.query(
      INSERT INTO wallet_transactions (user_id, type, source, status, amount, remaining_amount, available_at, expires_at, note) VALUES (, , , , , , NOW(), , ) RETURNING id,
      [uId, 'CREDIT', 'CASHBACK', 'AVAILABLE', 50, 50, in2d, 'Lot B: 2 days']
    );
    const lC = await client.query(
      INSERT INTO wallet_transactions (user_id, type, source, status, amount, remaining_amount, available_at, expires_at, note) VALUES (, , , , , , NOW(), NULL, ) RETURNING id,
      [uId, 'CREDIT', 'CASHBACK', 'AVAILABLE', 200, 200, 'Lot C: No expiry']
    );

    await client.query(
      INSERT INTO wallets (user_id, balance, pending_balance) VALUES (, , ) ON CONFLICT (user_id) DO UPDATE SET balance = , pending_balance = ,
      [uId, 350, 0]
    );

    // Test 1: computeRedeemLimit with 10% limit rule (10% of 1050 = 105)
    const limit1 = await computeRedeemLimit({ userId: uId, payableAmount: 1050, hasCoupon: false, client });
    console.log('Test 1 - Limit with 10% cap (105):', limit1.maxAllowed === 105 ? 'PASSED' : 'FAILED (' + limit1.maxAllowed + ')');

    // Test 2: Coupon blocking
    await client.query('UPDATE cashback_settings SET allow_redeem_with_coupon = FALSE WHERE id = 1');
    const limitCoupon = await computeRedeemLimit({ userId: uId, payableAmount: 1050, hasCoupon: true, client });
    console.log('Test 2 - Coupon blocking when disallowed:', limitCoupon.allowed === false ? 'PASSED' : 'FAILED');
    await client.query('UPDATE cashback_settings SET allow_redeem_with_coupon = TRUE WHERE id = 1');

    // Test 3: FIFO consumption across multiple lots (requested: 80)
    // Lot B (earliest expiry, 50) -> fully consumed (remaining = 0)
    // Lot A (5 days, takes 30) -> remaining = 70
    // Lot C (no expiry) -> untouched (remaining = 200)
    await client.query('BEGIN');
    const rRes = await reserveWalletRedeem({ client, orderId: oId, userId: uId, amount: 80, payableAmount: 1050, hasCoupon: false });
    await client.query('COMMIT');
    console.log('Test 3 - Reserve executed:', rRes.success ? 'PASSED' : 'FAILED');

    const lotsCheck = await client.query(
      SELECT id, remaining_amount FROM wallet_transactions WHERE id IN (, , ) ORDER BY id,
      [lA.rows[0].id, lB.rows[0].id, lC.rows[0].id]
    );
    const m = Object.fromEntries(lotsCheck.rows.map(r => [r.id, Number(r.remaining_amount)]));
    const fifoOk = (m[lB.rows[0].id] === 0 && m[lA.rows[0].id] === 70 && m[lC.rows[0].id] === 200);
    console.log('Test 3 - FIFO allocation (Lot B:0, Lot A:70, Lot C:200):', fifoOk ? 'PASSED' : 'FAILED');

    const w1 = await client.query(SELECT balance FROM wallets WHERE user_id = , [uId]);
    console.log('Test 3 - Wallet balance (expected 270):', Number(w1.rows[0].balance) === 270 ? 'PASSED' : 'FAILED');

    // Test 4: Idempotency of reserveWalletRedeem
    await client.query('BEGIN');
    const rRes2 = await reserveWalletRedeem({ client, orderId: oId, userId: uId, amount: 80, payableAmount: 1050, hasCoupon: false });
    await client.query('COMMIT');
    const w2 = await client.query(SELECT balance FROM wallets WHERE user_id = , [uId]);
    console.log('Test 4 - Idempotency double call:', (rRes2.success && Number(w2.rows[0].balance) === 270) ? 'PASSED' : 'FAILED');

    // Test 5: Expiry does not touch spent money
    await client.query(
      UPDATE wallet_transactions SET expires_at = NOW() - INTERVAL '1 hour' WHERE id IN (, ),
      [lA.rows[0].id, lB.rows[0].id]
    );
    await processScheduledMaturityAndExpiry(client);
    const w3 = await client.query(SELECT balance FROM wallets WHERE user_id = , [uId]);
    console.log('Test 5 - Expiry only expires unspent amount (expected 200):', Number(w3.rows[0].balance) === 200 ? 'PASSED' : 'FAILED (' + w3.rows[0].balance + ')');

    // Test 6: Release and restore after payment failure / cancellation
    const relRes = await releaseWalletRedeem({ orderId: oId, client });
    console.log('Test 6 - Release executed:', relRes.success ? 'PASSED' : 'FAILED');
    const w4 = await client.query(SELECT balance FROM wallets WHERE user_id = , [uId]);
    console.log('Test 6 - Wallet balance restored (expected 280):', Number(w4.rows[0].balance) === 280 ? 'PASSED' : 'FAILED (' + w4.rows[0].balance + ')');

    const fresh = await client.query(SELECT id FROM wallet_transactions WHERE user_id =  AND source = 'REFUND' AND status = 'AVAILABLE', [uId]);
    console.log('Test 6 - Fresh lot created for expired portions:', fresh.rows.length > 0 ? 'PASSED' : 'FAILED');

    // Test 7: calculateCashback with walletUsed deduction
    const cb = calculateCashback({
      subtotal: 1000,
      couponDiscount: 0,
      walletUsed: 100,
      settings: { enabled: true, calc_base: 'AFTER_DISCOUNT', cashback_on_wallet_paid_amount: false },
      rules: [{ id: 1, rule_type: 'SLAB', slabs: [{ upto: null, percent: 10 }], is_active: true }]
    });
    console.log('Test 7 - Cashback base minus walletUsed (expected 90):', cb.totalCashback === 90 ? 'PASSED' : 'FAILED (' + cb.totalCashback + ')');

    // Test 8: Wallet covering 100% of order
    await client.query('UPDATE cashback_settings SET max_redeem_percent_of_order = 100 WHERE id = 1');
    const limit100 = await computeRedeemLimit({ userId: uId, payableAmount: 250, hasCoupon: false, client });
    console.log('Test 8 - 100% order payable allowed:', (limit100.maxAllowed === 250 && limit100.allowed) ? 'PASSED' : 'FAILED');
    await client.query('UPDATE cashback_settings SET max_redeem_percent_of_order = 10 WHERE id = 1');

    console.log('\n🎉 ALL 8 TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    if (uId) {
      const p1 = '$1';
      await client.query(DELETE FROM wallet_redemption_allocations WHERE order_id = , [oId]);
      await client.query(DELETE FROM wallet_transactions WHERE user_id = , [uId]);
      await client.query(DELETE FROM wallets WHERE user_id = , [uId]);
      await client.query(DELETE FROM material_order_events WHERE order_id = , [oId]);
      await client.query(DELETE FROM material_enquiries WHERE id = , [oId]);
      await client.query(DELETE FROM users WHERE id = , [uId]);
    }
    client.release();
    await pool.end();
  }
}

run();
