import pool from '../db.js';
import { calculateCashback } from './calculate.js';

/**
 * Loads current global cashback settings.
 */
export async function getCashbackSettings(client = pool) {
  const res = await client.query('SELECT * FROM cashback_settings WHERE id = 1');
  if (res.rows[0]) return res.rows[0];
  return {
    enabled: true,
    stacking_mode: 'HIGHEST',
    allow_with_coupon: true,
    calc_base: 'AFTER_DISCOUNT',
    max_cashback_per_order: null,
    pending_days: 7,
    expiry_days: 0,
  };
}

/**
 * Loads all active cashback rules.
 */
export async function getActiveCashbackRules(client = pool) {
  const res = await client.query(`
    SELECT * FROM cashback_rules 
    WHERE is_active = TRUE 
    ORDER BY priority ASC, id ASC
  `);
  return res.rows;
}

/**
 * Checks if a user has zero DELIVERED / FULFILLED orders.
 */
export async function checkIsFirstOrder(userId, client = pool) {
  if (!userId) return true;
  const res = await client.query(
    `SELECT 1 FROM material_enquiries 
     WHERE user_id = $1 AND LOWER(status) IN ('delivered', 'fulfilled') 
     LIMIT 1`,
    [userId]
  );
  return res.rows.length === 0;
}

/**
 * Previews cashback for a cart without saving anything.
 */
export async function previewCartCashback({ userId, items, subtotal, couponDiscount, hasCoupon, walletUsed = 0 }) {
  const [settings, rules, isFirstOrder] = await Promise.all([
    getCashbackSettings(),
    getActiveCashbackRules(),
    checkIsFirstOrder(userId),
  ]);

  return calculateCashback({
    items,
    subtotal,
    couponDiscount,
    hasCoupon,
    walletUsed,
    isFirstOrder,
    rules,
    settings,
  });
}

/**
 * Snapshots cashback calculation into an order record at placement time.
 * Status becomes 'SCHEDULED' (or 'NONE' if 0). Does NOT credit wallet.
 */
export async function snapshotOrderCashback({ orderId, userId, items, subtotal, couponDiscount, hasCoupon, walletUsed = 0, client }) {
  const dbClient = client || pool;
  const [settings, rules, isFirstOrder] = await Promise.all([
    getCashbackSettings(dbClient),
    getActiveCashbackRules(dbClient),
    checkIsFirstOrder(userId, dbClient),
  ]);

  const calc = calculateCashback({
    items,
    subtotal,
    couponDiscount,
    hasCoupon,
    walletUsed,
    isFirstOrder,
    rules,
    settings,
  });

  const cashbackAmount = calc.totalCashback;
  const cashbackStatus = cashbackAmount > 0 ? 'SCHEDULED' : 'NONE';
  const cashbackBreakdown = calc.breakdown;

  await dbClient.query(
    `UPDATE material_enquiries 
     SET cashback_amount = $1, 
         cashback_breakdown = $2::jsonb, 
         cashback_status = $3
     WHERE id = $4`,
    [cashbackAmount, JSON.stringify(cashbackBreakdown), cashbackStatus, orderId]
  );

  return { cashbackAmount, cashbackStatus, cashbackBreakdown };
}

/**
 * Ensures a wallet record exists for a user (atomic upsert).
 */
export async function ensureWallet(userId, client = pool) {
  const numericId = Number.parseInt(userId, 10);
  if (!numericId || numericId <= 0 || Number.isNaN(numericId)) return;

  try {
    await client.query(
      `INSERT INTO wallets (user_id, balance, pending_balance)
       VALUES ($1, 0.00, 0.00)
       ON CONFLICT (user_id) DO NOTHING`,
      [numericId]
    );
  } catch (error) {
    // If the user does not exist in the users table (e.g. admin or non-existent user),
    // foreign key constraint 23503 is caught gracefully.
    if (error?.code === '23503') return;
    throw error;
  }
}

/**
 * Credits cashback when an order is DELIVERED.
 * Must be called within a database transaction with a row lock.
 * Idempotent: Can safely be called multiple times without double-crediting.
 */
export async function creditDeliveredCashback({ orderId, client }) {
  const dbClient = client;

  // Lock order row for update
  const orderRes = await dbClient.query(
    `SELECT id, user_id, cashback_amount, cashback_status, cashback_breakdown, created_at 
     FROM material_enquiries 
     WHERE id = $1 
     FOR UPDATE`,
    [orderId]
  );

  const order = orderRes.rows[0];
  if (!order) return { success: false, reason: 'ORDER_NOT_FOUND' };
  if (!order.user_id) return { success: false, reason: 'NO_USER' };

  // Only orders with 'SCHEDULED' status get credited
  if (order.cashback_status !== 'SCHEDULED' || Number(order.cashback_amount) <= 0) {
    return { success: false, reason: `STATUS_IS_${order.cashback_status}` };
  }

  const settings = await getCashbackSettings(dbClient);
  const amount = Number(order.cashback_amount);
  const pendingDays = Number(settings.pending_days) || 0;
  const expiryDays = Number(settings.expiry_days) || 0;

  const now = new Date();
  const availableAt = new Date(now);
  availableAt.setDate(availableAt.getDate() + pendingDays);

  let expiresAt = null;
  if (expiryDays > 0) {
    expiresAt = new Date(availableAt);
    expiresAt.setDate(expiresAt.getDate() + expiryDays);
  }

  const txStatus = pendingDays > 0 ? 'PENDING' : 'AVAILABLE';

  // Ensure user wallet exists
  await ensureWallet(order.user_id, dbClient);

  // Insert wallet transaction ledger entry (protected by unique index on order_id)
  await dbClient.query(
    `INSERT INTO wallet_transactions 
      (user_id, order_id, type, source, status, amount, remaining_amount, rule_breakdown, available_at, expires_at, note)
     VALUES ($1, $2, 'CREDIT', 'CASHBACK', $3, $4, $4, $5::jsonb, $6, $7, $8)
     ON CONFLICT DO NOTHING`,
    [
      order.user_id,
      order.id,
      txStatus,
      amount,
      JSON.stringify(order.cashback_breakdown || {}),
      availableAt,
      expiresAt,
      `Cashback for Order #${order.id}`,
    ]
  );

  // Update wallet balances
  if (txStatus === 'PENDING') {
    await dbClient.query(
      `UPDATE wallets 
       SET pending_balance = pending_balance + $1, updated_at = NOW() 
       WHERE user_id = $2`,
      [amount, order.user_id]
    );
  } else {
    await dbClient.query(
      `UPDATE wallets 
       SET balance = balance + $1, updated_at = NOW() 
       WHERE user_id = $2`,
      [amount, order.user_id]
    );
  }

  // Update order status to CREDITED
  await dbClient.query(
    `UPDATE material_enquiries 
     SET cashback_status = 'CREDITED', updated_at = NOW() 
     WHERE id = $1`,
    [order.id]
  );

  return { success: true, amount, txStatus, availableAt, expiresAt };
}

/**
 * Reverses cashback when an order is CANCELLED or RETURNED.
 * Deducts from pending_balance or balance without going below 0.
 */
export async function reverseOrderCashback({ orderId, reason = 'Order cancelled/returned', client }) {
  const dbClient = client;

  const orderRes = await dbClient.query(
    `SELECT id, user_id, cashback_amount, cashback_status 
     FROM material_enquiries 
     WHERE id = $1 
     FOR UPDATE`,
    [orderId]
  );

  const order = orderRes.rows[0];
  if (!order) return { success: false, reason: 'ORDER_NOT_FOUND' };

  if (order.cashback_status === 'SCHEDULED') {
    // Not credited yet, simply cancel scheduled cashback
    await dbClient.query(
      `UPDATE material_enquiries 
       SET cashback_status = 'CANCELLED', updated_at = NOW() 
       WHERE id = $1`,
      [order.id]
    );
    return { success: true, action: 'SCHEDULED_CANCELLED' };
  }

  if (order.cashback_status === 'CREDITED') {
    // Find credited transaction
    const txRes = await dbClient.query(
      `SELECT * FROM wallet_transactions 
       WHERE order_id = $1 AND source = 'CASHBACK' AND type = 'CREDIT' 
       FOR UPDATE`,
      [order.id]
    );

    const originalTx = txRes.rows[0];
    if (originalTx && originalTx.status !== 'REVERSED') {
      const fullAmount = Number(originalTx.amount);
      const remainingLotAmount = originalTx.remaining_amount != null
        ? Number(originalTx.remaining_amount)
        : fullAmount;

      // DECISION: If the user has already spent part of this cashback lot via redemption,
      // we only reverse the lot's remaining unspent amount (remaining_amount).
      // We never let the user's wallet balance go negative. Any unrecovered shortfall
      // is recorded in the transaction note.
      const amountToReverse = Math.max(0, Math.min(fullAmount, remainingLotAmount));
      const shortfall = Math.max(0, fullAmount - amountToReverse);

      // Lock wallet
      const walletRes = await dbClient.query(
        `SELECT balance, pending_balance FROM wallets WHERE user_id = $1 FOR UPDATE`,
        [order.user_id]
      );
      const wallet = walletRes.rows[0] || { balance: 0, pending_balance: 0 };

      // Deduct from pending if it was pending, otherwise deduct from available balance
      if (originalTx.status === 'PENDING') {
        const deductPending = Math.min(Number(wallet.pending_balance), amountToReverse);
        await dbClient.query(
          `UPDATE wallets 
           SET pending_balance = GREATEST(0, pending_balance - $1), updated_at = NOW() 
           WHERE user_id = $2`,
          [deductPending, order.user_id]
        );
      } else if (originalTx.status === 'AVAILABLE') {
        const deductBalance = Math.min(Number(wallet.balance), amountToReverse);
        await dbClient.query(
          `UPDATE wallets 
           SET balance = GREATEST(0, balance - $1), updated_at = NOW() 
           WHERE user_id = $2`,
          [deductBalance, order.user_id]
        );
      }

      // Mark original transaction remaining_amount as 0 and status as REVERSED
      await dbClient.query(
        `UPDATE wallet_transactions 
         SET status = 'REVERSED', remaining_amount = 0.00 
         WHERE id = $1`,
        [originalTx.id]
      );

      // Record reversal DEBIT transaction
      const reversalNote = shortfall > 0
        ? `${reason} (Reversed ₹${amountToReverse.toFixed(2)}; ₹${shortfall.toFixed(2)} was already spent by user)`
        : reason;

      await dbClient.query(
        `INSERT INTO wallet_transactions 
          (user_id, order_id, type, source, status, amount, remaining_amount, note, created_at)
         VALUES ($1, $2, 'DEBIT', 'REVERSAL', 'AVAILABLE', $3, 0.00, $4, NOW())`,
        [order.user_id, order.id, amountToReverse, reversalNote]
      );
    }

    await dbClient.query(
      `UPDATE material_enquiries 
       SET cashback_status = 'REVERSED', updated_at = NOW() 
       WHERE id = $1`,
      [order.id]
    );

    return { success: true, action: 'CREDITED_REVERSED' };
  }

  return { success: true, action: 'NO_ACTION_NEEDED' };
}

/**
 * Daily cron processor:
 * 1. Moves PENDING cashback to AVAILABLE when available_at <= NOW().
 * 2. Expires AVAILABLE cashback when expires_at <= NOW().
 *    CRITICAL: Expiry expires only remaining_amount of a lot, NEVER money the user already spent.
 */
export async function processScheduledMaturityAndExpiry(client = pool) {
  const dbClient = client;

  // 1. Mature PENDING transactions
  const maturingRes = await dbClient.query(`
    SELECT id, user_id, amount, remaining_amount 
    FROM wallet_transactions 
    WHERE status = 'PENDING' AND available_at <= NOW()
  `);

  let maturedCount = 0;
  for (const tx of maturingRes.rows) {
    const amt = Number(tx.amount);
    await dbClient.query('BEGIN');
    try {
      await dbClient.query(
        `UPDATE wallet_transactions
         SET status = 'AVAILABLE',
             remaining_amount = COALESCE(remaining_amount, amount)
         WHERE id = $1`,
        [tx.id]
      );
      await dbClient.query(
        `UPDATE wallets 
         SET pending_balance = GREATEST(0, pending_balance - $1), 
             balance = balance + $1, 
             updated_at = NOW() 
         WHERE user_id = $2`,
        [amt, tx.user_id]
      );
      await dbClient.query('COMMIT');
      maturedCount += 1;
    } catch (e) {
      await dbClient.query('ROLLBACK');
      console.error(`Failed to mature tx ${tx.id}:`, e);
    }
  }

  // 2. Expire AVAILABLE transactions whose expires_at <= NOW()
  // CRITICAL: Only expire remaining_amount > 0, never money already spent by user!
  const expiringRes = await dbClient.query(`
    SELECT id, user_id, amount, COALESCE(remaining_amount, amount) AS unspent_amount 
    FROM wallet_transactions 
    WHERE status = 'AVAILABLE' 
      AND expires_at IS NOT NULL 
      AND expires_at <= NOW()
      AND COALESCE(remaining_amount, amount) > 0
  `);

  let expiredCount = 0;
  for (const tx of expiringRes.rows) {
    const unspent = Number(tx.unspent_amount);
    if (unspent <= 0) continue;

    await dbClient.query('BEGIN');
    try {
      // Zero out the remaining amount on the expired credit lot
      await dbClient.query(
        `UPDATE wallet_transactions 
         SET status = 'EXPIRED', remaining_amount = 0.00 
         WHERE id = $1`,
        [tx.id]
      );

      // Decrement wallet balance by the unspent amount only
      await dbClient.query(
        `UPDATE wallets 
         SET balance = GREATEST(0, balance - $1), updated_at = NOW() 
         WHERE user_id = $2`,
        [unspent, tx.user_id]
      );

      // Record expiry DEBIT transaction
      await dbClient.query(
        `INSERT INTO wallet_transactions 
          (user_id, type, source, status, amount, remaining_amount, note, created_at)
         VALUES ($1, 'DEBIT', 'EXPIRY', 'EXPIRED', $2, 0.00, $3, NOW())`,
        [tx.user_id, unspent, `Unspent cashback expired (Original lot: ₹${Number(tx.amount).toFixed(2)}, Expired: ₹${unspent.toFixed(2)})`]
      );
      await dbClient.query('COMMIT');
      expiredCount += 1;
    } catch (e) {
      await dbClient.query('ROLLBACK');
      console.error(`Failed to expire tx ${tx.id}:`, e);
    }
  }

  return { maturedCount, expiredCount };
}
