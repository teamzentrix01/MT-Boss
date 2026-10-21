import pool from '../db.js';
import { calculateCashback } from './calculate.js';
import { createInitializationGuard } from '../api-utils.js';

/**
 * Ensures all Cashback & Wallet tables, columns, indexes, and initial records exist.
 * Idempotent with TTL caching via createInitializationGuard.
 */
export const ensureCashbackSchema = createInitializationGuard(async () => {
  // 1. Ensure shop_categories exists (for category_id foreign key in cashback_rules)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shop_categories (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(200) NOT NULL,
      image       TEXT,
      emoji       VARCHAR(20)  DEFAULT '🛒',
      emoji_image TEXT,
      label       VARCHAR(100) DEFAULT '',
      label_color VARCHAR(50)  DEFAULT 'yellow',
      price_range VARCHAR(100) DEFAULT '',
      unit        VARCHAR(100) DEFAULT '',
      sort_order  INTEGER      DEFAULT 0,
      is_active   BOOLEAN      DEFAULT TRUE,
      created_at  TIMESTAMP    DEFAULT NOW(),
      updated_at  TIMESTAMP    DEFAULT NOW()
    );
  `);

  // 2. cashback_settings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cashback_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      enabled BOOLEAN NOT NULL DEFAULT TRUE,
      stacking_mode VARCHAR(20) NOT NULL DEFAULT 'HIGHEST',
      allow_with_coupon BOOLEAN NOT NULL DEFAULT TRUE,
      calc_base VARCHAR(20) NOT NULL DEFAULT 'AFTER_DISCOUNT',
      max_cashback_per_order NUMERIC(12,2) DEFAULT NULL,
      pending_days INTEGER NOT NULL DEFAULT 7,
      expiry_days INTEGER NOT NULL DEFAULT 0,
      redeem_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      max_redeem_percent_of_order NUMERIC(5,2) NOT NULL DEFAULT 10.00,
      min_order_for_redeem NUMERIC(12,2) NOT NULL DEFAULT 0.00,
      min_redeem_amount NUMERIC(12,2) NOT NULL DEFAULT 1.00,
      allow_redeem_with_coupon BOOLEAN NOT NULL DEFAULT TRUE,
      cashback_on_wallet_paid_amount BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT single_row_check CHECK (id = 1)
    );
  `);

  // Add any columns if table was created in an earlier migration
  await pool.query(`
    ALTER TABLE cashback_settings
      ADD COLUMN IF NOT EXISTS redeem_enabled BOOLEAN NOT NULL DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS max_redeem_percent_of_order NUMERIC(5,2) NOT NULL DEFAULT 10.00,
      ADD COLUMN IF NOT EXISTS min_order_for_redeem NUMERIC(12,2) NOT NULL DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS min_redeem_amount NUMERIC(12,2) NOT NULL DEFAULT 1.00,
      ADD COLUMN IF NOT EXISTS allow_redeem_with_coupon BOOLEAN NOT NULL DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS cashback_on_wallet_paid_amount BOOLEAN NOT NULL DEFAULT FALSE;
  `);

  // Seed default settings row
  await pool.query(`
    INSERT INTO cashback_settings (
      id, enabled, stacking_mode, allow_with_coupon, calc_base, max_cashback_per_order, pending_days, expiry_days,
      redeem_enabled, max_redeem_percent_of_order, min_order_for_redeem, min_redeem_amount, allow_redeem_with_coupon, cashback_on_wallet_paid_amount
    )
    VALUES (1, TRUE, 'HIGHEST', TRUE, 'AFTER_DISCOUNT', NULL, 7, 0, TRUE, 10.00, 0.00, 1.00, TRUE, FALSE)
    ON CONFLICT (id) DO NOTHING;
  `);

  // 3. cashback_rules table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cashback_rules (
      id SERIAL PRIMARY KEY,
      rule_type VARCHAR(30) NOT NULL,
      value_type VARCHAR(20) NOT NULL DEFAULT 'PERCENT',
      value NUMERIC(10,2) NOT NULL DEFAULT 0,
      category_id INTEGER REFERENCES shop_categories(id) ON DELETE CASCADE,
      slabs JSONB DEFAULT '[]'::jsonb,
      min_order_value NUMERIC(12,2) DEFAULT 0,
      max_cashback NUMERIC(12,2) DEFAULT NULL,
      start_date DATE DEFAULT NULL,
      end_date DATE DEFAULT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      priority INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE UNIQUE INDEX IF NOT EXISTS uidx_cashback_active_first_order
    ON cashback_rules (rule_type)
    WHERE rule_type = 'FIRST_ORDER' AND is_active = TRUE;

    CREATE UNIQUE INDEX IF NOT EXISTS uidx_cashback_active_slab
    ON cashback_rules (rule_type)
    WHERE rule_type = 'SLAB' AND is_active = TRUE;

    CREATE UNIQUE INDEX IF NOT EXISTS uidx_cashback_active_category
    ON cashback_rules (category_id)
    WHERE rule_type = 'CATEGORY' AND is_active = TRUE AND category_id IS NOT NULL;
  `);

  // 4. wallets table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallets (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
      pending_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT chk_wallet_balance_positive CHECK (balance >= 0),
      CONSTRAINT chk_wallet_pending_positive CHECK (pending_balance >= 0)
    );
  `);

  // 5. wallet_transactions table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id BIGSERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      order_id INTEGER REFERENCES material_enquiries(id) ON DELETE SET NULL,
      type VARCHAR(20) NOT NULL,
      source VARCHAR(30) NOT NULL,
      status VARCHAR(20) NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      remaining_amount NUMERIC(12,2) DEFAULT NULL,
      rule_breakdown JSONB DEFAULT '{}'::jsonb,
      available_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
      note TEXT DEFAULT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    ALTER TABLE wallet_transactions
      ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC(12,2) DEFAULT NULL;

    CREATE INDEX IF NOT EXISTS idx_wallet_tx_user_created ON wallet_transactions (user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_wallet_tx_status_available ON wallet_transactions (status, available_at);
    CREATE INDEX IF NOT EXISTS idx_wallet_tx_status_expires ON wallet_transactions (status, expires_at);

    CREATE UNIQUE INDEX IF NOT EXISTS uidx_wallet_tx_one_cashback_per_order
    ON wallet_transactions (order_id)
    WHERE source = 'CASHBACK' AND type = 'CREDIT' AND order_id IS NOT NULL;
  `);

  // 6. wallet_redemption_allocations table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallet_redemption_allocations (
      id BIGSERIAL PRIMARY KEY,
      redeem_txn_id BIGINT NOT NULL REFERENCES wallet_transactions(id) ON DELETE CASCADE,
      credit_txn_id BIGINT NOT NULL REFERENCES wallet_transactions(id) ON DELETE CASCADE,
      order_id INTEGER REFERENCES material_enquiries(id) ON DELETE SET NULL,
      amount NUMERIC(12,2) NOT NULL,
      restored_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT chk_alloc_amount_pos CHECK (amount > 0),
      CONSTRAINT chk_alloc_restored_le_amount CHECK (restored_amount <= amount)
    );

    CREATE INDEX IF NOT EXISTS idx_alloc_redeem_txn ON wallet_redemption_allocations (redeem_txn_id);
    CREATE INDEX IF NOT EXISTS idx_alloc_credit_txn ON wallet_redemption_allocations (credit_txn_id);
    CREATE INDEX IF NOT EXISTS idx_alloc_order_id ON wallet_redemption_allocations (order_id);
  `);

  // 7. Order snapshot columns on material_enquiries
  try {
    const colCheck = await pool.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'material_enquiries' 
        AND column_name = 'cashback_amount'
      LIMIT 1
    `);
    if (!colCheck.rows.length) {
      await pool.query(`
        ALTER TABLE material_enquiries
          ADD COLUMN IF NOT EXISTS cashback_amount NUMERIC(12,2) DEFAULT 0.00,
          ADD COLUMN IF NOT EXISTS cashback_breakdown JSONB DEFAULT '{}'::jsonb,
          ADD COLUMN IF NOT EXISTS cashback_status VARCHAR(30) DEFAULT 'NONE',
          ADD COLUMN IF NOT EXISTS wallet_used NUMERIC(12,2) NOT NULL DEFAULT 0.00,
          ADD COLUMN IF NOT EXISTS wallet_redeem_status VARCHAR(30) NOT NULL DEFAULT 'NONE';
      `);
    }
  } catch (err) {
    console.warn('Could not verify/alter cashback columns on material_enquiries:', err.message);
  }
}, 24 * 60 * 60 * 1000, 'cashback_schema_guard');

/**
 * Loads current global cashback settings.
 */
export async function getCashbackSettings(client = pool) {
  await ensureCashbackSchema();
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
    redeem_enabled: true,
    max_redeem_percent_of_order: 10,
    min_order_for_redeem: 0,
    min_redeem_amount: 1,
    allow_redeem_with_coupon: true,
    cashback_on_wallet_paid_amount: false,
  };
}

/**
 * Loads all active cashback rules.
 */
export async function getActiveCashbackRules(client = pool) {
  await ensureCashbackSchema();
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
    await ensureCashbackSchema();
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
 * Maturity and Expiry processor:
 * 1. Moves PENDING cashback to AVAILABLE when available_at <= NOW() (or immediately if pending_days === 0).
 *    If maturity was delayed past initial expires_at, extends expires_at to give customer their full validity window.
 * 2. Expires AVAILABLE cashback when expires_at <= NOW().
 *    CRITICAL: Expiry expires only remaining_amount of a lot, NEVER money the user already spent.
 * Can be run globally (cron) or scoped to a specific userId (on-demand lazy settlement).
 */
export async function processScheduledMaturityAndExpiry(client = pool, userId = null) {
  await ensureCashbackSchema();
  const dbClient = client;

  const settings = await getCashbackSettings(dbClient);
  const expiryDays = Number(settings.expiry_days) || 0;
  const pendingDays = Number(settings.pending_days) || 0;

  // 1. Mature PENDING transactions
  let maturitySql = `
    SELECT id, user_id, amount, remaining_amount, available_at, expires_at 
    FROM wallet_transactions 
    WHERE status = 'PENDING'
  `;
  const params = [];

  // If pendingDays > 0, mature only when return window has elapsed.
  // If pendingDays === 0, any pending transaction is eligible to mature immediately.
  if (pendingDays > 0) {
    maturitySql += ` AND available_at <= NOW()`;
  }

  if (userId) {
    params.push(Number(userId));
    maturitySql += ` AND user_id = $${params.length}`;
  }

  const maturingRes = await dbClient.query(maturitySql, params);

  let maturedCount = 0;
  for (const tx of maturingRes.rows) {
    const amt = Number(tx.amount);

    // Calculate new expires_at:
    // If settings has expiry_days > 0:
    // If the transaction's existing expires_at is null OR has already passed (due to delayed cron/system check),
    // extend expires_at to NOW() + expiryDays so the customer actually receives their valid spendable window!
    let newExpiresAt = tx.expires_at;
    if (expiryDays > 0) {
      if (!newExpiresAt || new Date(newExpiresAt) <= new Date()) {
        const ext = new Date();
        ext.setDate(ext.getDate() + expiryDays);
        newExpiresAt = ext;
      }
    } else {
      newExpiresAt = null;
    }

    await dbClient.query('BEGIN');
    try {
      await dbClient.query(
        `UPDATE wallet_transactions
         SET status = 'AVAILABLE',
             remaining_amount = COALESCE(remaining_amount, amount),
             expires_at = $1
         WHERE id = $2`,
        [newExpiresAt, tx.id]
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
  let expiringSql = `
    SELECT id, user_id, amount, COALESCE(remaining_amount, amount) AS unspent_amount 
    FROM wallet_transactions 
    WHERE status = 'AVAILABLE' 
      AND expires_at IS NOT NULL 
      AND expires_at <= NOW()
      AND COALESCE(remaining_amount, amount) > 0
  `;
  const expParams = [];
  if (userId) {
    expParams.push(Number(userId));
    expiringSql += ` AND user_id = $${expParams.length}`;
  }

  const expiringRes = await dbClient.query(expiringSql, expParams);

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
