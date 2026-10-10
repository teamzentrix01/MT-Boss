import pool from '../src/lib/db.js';

async function reconcile() {
  console.log('--- MT BOSS WALLET LEDGER RECONCILIATION ---');
  try {
    const res = await pool.query(`
      SELECT 
        w.user_id,
        w.balance AS wallet_balance,
        COALESCE(SUM(t.remaining_amount), 0) AS total_lots_remaining,
        (w.balance - COALESCE(SUM(t.remaining_amount), 0)) AS diff
      FROM wallets w
      LEFT JOIN wallet_transactions t 
        ON t.user_id = w.user_id 
        AND t.type = 'CREDIT' 
        AND t.status = 'AVAILABLE'
      GROUP BY w.user_id, w.balance
      ORDER BY diff DESC, w.user_id ASC
    `);

    let mismatchCount = 0;
    for (const row of res.rows) {
      const diff = Math.abs(Number(row.diff));
      if (diff > 0.01) {
        mismatchCount++;
        console.error(`🚨 MISMATCH for User ID ${row.user_id}: Wallet Balance = ₹${row.wallet_balance}, Sum of Available Lots = ₹${row.total_lots_remaining}, Diff = ₹${row.diff}`);
      }
    }

    if (mismatchCount === 0) {
      console.log(`✅ SUCCESS: All ${res.rows.length} wallets reconcile 100% with AVAILABLE remaining_amount lots!`);
    } else {
      console.error(`❌ Found ${mismatchCount} mismatched wallets.`);
    }

    // Summary of total active system balances
    const totals = await pool.query(`
      SELECT 
        COALESCE(SUM(balance), 0) as total_wallet_balance,
        COALESCE(SUM(pending_balance), 0) as total_pending_balance
      FROM wallets
    `);
    console.log(`System Totals: Active Balance = ₹${totals.rows[0].total_wallet_balance}, Pending Balance = ₹${totals.rows[0].total_pending_balance}`);

  } catch (err) {
    console.error('Reconciliation query failed:', err);
  } finally {
    await pool.end();
  }
}

reconcile();
