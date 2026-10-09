import pool from '../db.js';
import { getCashbackSettings, ensureWallet } from '../cashback/service.js';

/**
 * Compute maximum spendable wallet balance on an order.
 * Accepts either:
 *  computeRedeemLimit(userId, payableAmount, hasCoupon) OR
 *  computeRedeemLimit({ userId, payableAmount, hasCoupon, client })
 */
export async function computeRedeemLimit(arg1, arg2, arg3) {
  let userId, payableAmount, hasCoupon = false, client = pool;

  if (typeof arg1 === 'object' && arg1 !== null && !('connect' in arg1) && ('userId' in arg1 || 'payableAmount' in arg1)) {
    userId = arg1.userId;
    payableAmount = arg1.payableAmount;
    hasCoupon = Boolean(arg1.hasCoupon);
    client = arg1.client || pool;
  } else {
    userId = arg1;
    payableAmount = arg2;
    hasCoupon = Boolean(arg3);
  }

  const dbClient = client;
  const settings = await getCashbackSettings(dbClient);
  const payable = Math.max(0, Number(payableAmount) || 0);

  if (!settings.redeem_enabled) {
    return {
      maxAllowed: 0,
      balance: 0,
      reason: 'Wallet redemption is currently disabled.',
      allowed: false,
      maxPercent: 0,
    };
  }

  if (hasCoupon && !settings.allow_redeem_with_coupon) {
    return {
      maxAllowed: 0,
      balance: 0,
      reason: 'Wallet balance cannot be combined with coupon discounts.',
      allowed: false,
      maxPercent: 0,
    };
  }

  const minOrder = Number(settings.min_order_for_redeem) || 0;
  if (minOrder > 0 && payable < minOrder) {
    return {
      maxAllowed: 0,
      balance: 0,
      reason: `Order total must be at least ₹${minOrder.toLocaleString('en-IN')} to use wallet balance.`,
      allowed: false,
      maxPercent: 0,
    };
  }

  let balance = 0;
  if (userId) {
    await ensureWallet(userId, dbClient);
    const wRes = await dbClient.query('SELECT balance FROM wallets WHERE user_id = $1', [userId]);
    balance = Math.max(0, Number(wRes.rows[0]?.balance) || 0);
  }

  if (balance <= 0) {
    return {
      maxAllowed: 0,
      balance: 0,
      reason: 'Your available wallet balance is ₹0.00.',
      allowed: false,
      maxPercent: 0,
    };
  }

  const minRedeemAmount = Number(settings.min_redeem_amount) || 1;
  if (balance < minRedeemAmount) {
    return {
      maxAllowed: 0,
      balance,
      reason: `Minimum wallet balance required to redeem is ₹${minRedeemAmount.toLocaleString('en-IN')}.`,
      allowed: false,
      maxPercent: 0,
    };
  }

  const maxPercent = Number(settings.max_redeem_percent_of_order ?? 10);
  let capFromPercent = payable;
  if (maxPercent > 0 && maxPercent < 100) {
    capFromPercent = Math.floor((payable * maxPercent / 100) * 100) / 100;
  }

  let maxAllowed = Math.min(balance, capFromPercent, payable);
  maxAllowed = Math.max(0, Math.floor(maxAllowed * 100) / 100);

  if (maxAllowed < minRedeemAmount) {
    return {
      maxAllowed: 0,
      balance,
      reason: `Calculated redeemable amount is below the minimum ₹${minRedeemAmount.toLocaleString('en-IN')}.`,
      allowed: false,
      maxPercent,
    };
  }

  const reason = maxPercent < 100 && capFromPercent < balance
    ? `You can use up to ₹${maxAllowed.toLocaleString('en-IN')} on this order (${maxPercent}% of payable amount).`
    : null;

  return { maxAllowed, balance, reason, allowed: true, maxPercent };
}

/**
 * Reserve wallet redemption for an order inside a database transaction.
 * Consumes AVAILABLE credit lots FIFO.
 * Idempotent per order.
 */
export async function reserveWalletRedeem(arg1, arg2, arg3, arg4, arg5, arg6) {
  let client, orderId, userId, amount, payableAmount, hasCoupon = false;

  if (typeof arg1 === 'object' && arg1 !== null && ('client' in arg1 || 'orderId' in arg1)) {
    client = arg1.client || pool;
    orderId = arg1.orderId;
    userId = arg1.userId;
    amount = arg1.amount;
    payableAmount = arg1.payableAmount;
    hasCoupon = Boolean(arg1.hasCoupon);
  } else {
    client = arg1;
    orderId = arg2;
    userId = arg3;
    amount = arg4;
    payableAmount = arg5;
    hasCoupon = Boolean(arg6);
  }

  const dbClient = client;
  const requested = Math.floor(Math.max(0, Number(amount) || 0) * 100) / 100;

  if (requested <= 0) {
    await dbClient.query(
      `UPDATE material_enquiries SET wallet_used = 0, wallet_redeem_status = 'NONE' WHERE id = $1`,
      [orderId]
    );
    return { success: true, amount: 0, status: 'NONE' };
  }

  // Check if order already has an active reservation
  const existingOrderRes = await dbClient.query(
    `SELECT id, user_id, wallet_used, wallet_redeem_status FROM material_enquiries WHERE id = $1 FOR UPDATE`,
    [orderId]
  );
  const existingOrder = existingOrderRes.rows[0];
  if (!existingOrder) {
    throw new Error(`Order #${orderId} not found.`);
  }

  if (['RESERVED', 'CONSUMED'].includes(existingOrder.wallet_redeem_status)) {
    if (Number(existingOrder.wallet_used) === requested) {
      const existingTx = await dbClient.query(
        `SELECT id FROM wallet_transactions WHERE order_id = $1 AND source = 'REDEEM' AND type = 'DEBIT' LIMIT 1`,
        [orderId]
      );
      return {
        success: true,
        alreadyReserved: true,
        amount: requested,
        status: existingOrder.wallet_redeem_status,
        debitTxnId: existingTx.rows[0]?.id || null,
      };
    }
    // Releasing prior reservation to re-allocate
    await releaseWalletRedeem(orderId, dbClient);
  }

  // 1. Lock wallet row FOR UPDATE
  await ensureWallet(userId, dbClient);
  const walletRes = await dbClient.query(
    `SELECT balance, pending_balance FROM wallets WHERE user_id = $1 FOR UPDATE`,
    [userId]
  );
  const currentBalance = Number(walletRes.rows[0]?.balance) || 0;

  // 2. Re-validate limits server-side
  const limit = await computeRedeemLimit({ userId, payableAmount, hasCoupon, client: dbClient });
  if (!limit.allowed || requested > limit.maxAllowed) {
    throw new Error(limit.reason || `Requested wallet amount (₹${requested}) exceeds max allowed limit (₹${limit.maxAllowed}).`);
  }

  if (requested > currentBalance) {
    throw new Error(`Insufficient wallet balance. Available: ₹${currentBalance.toFixed(2)}, Requested: ₹${requested.toFixed(2)}`);
  }

  // 3. FIFO consumption: earliest expires_at first, NULL expires_at last, oldest created_at first
  const lotsRes = await dbClient.query(
    `SELECT id, amount, remaining_amount, expires_at, created_at 
     FROM wallet_transactions 
     WHERE user_id = $1 
       AND type = 'CREDIT' 
       AND status = 'AVAILABLE' 
       AND remaining_amount > 0 
     ORDER BY expires_at ASC NULLS LAST, created_at ASC, id ASC 
     FOR UPDATE`,
    [userId]
  );

  const lots = lotsRes.rows;
  let remainingToDeduct = requested;
  const allocations = [];

  for (const lot of lots) {
    if (remainingToDeduct <= 0) break;
    const lotAvail = Number(lot.remaining_amount);
    const take = Math.min(lotAvail, remainingToDeduct);
    const takeRounded = Math.floor(take * 100) / 100;

    if (takeRounded > 0) {
      allocations.push({
        creditTxId: lot.id,
        amount: takeRounded,
        newRemaining: Math.max(0, lotAvail - takeRounded),
      });
      remainingToDeduct = Math.round((remainingToDeduct - takeRounded) * 100) / 100;
    }
  }

  if (remainingToDeduct > 0.009) {
    throw new Error(`Could not allocate full wallet amount across available credit lots. Shortfall: ₹${remainingToDeduct.toFixed(2)}`);
  }

  // 4. Insert DEBIT transaction
  const debitRes = await dbClient.query(
    `INSERT INTO wallet_transactions (
       user_id, order_id, type, source, status, amount, remaining_amount, note, created_at
     ) VALUES (
       $1, $2, 'DEBIT', 'REDEEM', 'AVAILABLE', $3, 0.00, $4, NOW()
     ) RETURNING id`,
    [userId, orderId, requested, `Redeemed ₹${requested.toLocaleString('en-IN')} on Order #${orderId}`]
  );
  const debitTxId = debitRes.rows[0].id;

  // 5. Update credit lot remaining_amounts and insert allocations
  for (const alloc of allocations) {
    await dbClient.query(
      `UPDATE wallet_transactions SET remaining_amount = $1 WHERE id = $2`,
      [alloc.newRemaining, alloc.creditTxId]
    );

    await dbClient.query(
      `INSERT INTO wallet_redemption_allocations (
         redeem_txn_id, credit_txn_id, order_id, amount, restored_amount, created_at
       ) VALUES ($1, $2, $3, $4, 0.00, NOW())`,
      [debitTxId, alloc.creditTxId, orderId, alloc.amount]
    );
  }

  // 6. Decrement user wallet balance
  await dbClient.query(
    `UPDATE wallets 
     SET balance = GREATEST(0, balance - $1), updated_at = NOW() 
     WHERE user_id = $2`,
    [requested, userId]
  );

  // 7. Update material_enquiries
  await dbClient.query(
    `UPDATE material_enquiries 
     SET wallet_used = $1, wallet_redeem_status = 'RESERVED', updated_at = NOW() 
     WHERE id = $2`,
    [requested, orderId]
  );

  return { success: true, amount: requested, status: 'RESERVED', debitTxnId: debitTxId };
}

/**
 * Release/restore wallet redemption (e.g. payment failed, abandoned, cancelled).
 * Idempotent per order.
 */
export async function releaseWalletRedeem(arg1, arg2) {
  let orderId, client = pool, refundAmount = null;

  if (typeof arg1 === 'object' && arg1 !== null && ('orderId' in arg1)) {
    orderId = arg1.orderId;
    client = arg1.client || pool;
    refundAmount = arg1.refundAmount ?? null;
  } else {
    orderId = arg1;
    client = arg2 || pool;
  }

  const dbClient = client;

  const orderRes = await dbClient.query(
    `SELECT id, user_id, wallet_used, wallet_redeem_status FROM material_enquiries WHERE id = $1 FOR UPDATE`,
    [orderId]
  );
  const order = orderRes.rows[0];
  if (!order) return { success: false, released: false, restoredAmount: 0, reason: 'ORDER_NOT_FOUND' };

  if (order.wallet_redeem_status === 'RELEASED' || order.wallet_redeem_status === 'NONE' || Number(order.wallet_used) <= 0) {
    return { success: true, released: true, alreadyReleased: true, restoredAmount: 0, reason: 'NOTHING_TO_RELEASE' };
  }

  const totalWalletUsed = Number(order.wallet_used);
  const targetToRestore = refundAmount !== null
    ? Math.min(totalWalletUsed, Math.max(0, Number(refundAmount)))
    : totalWalletUsed;

  if (targetToRestore <= 0) {
    return { success: true, released: true, restoredAmount: 0 };
  }

  const allocRes = await dbClient.query(
    `SELECT a.id, a.redeem_txn_id, a.credit_txn_id, a.amount, a.restored_amount,
            c.id AS credit_id, c.status AS credit_status, c.expires_at AS credit_expires_at, c.remaining_amount AS credit_remaining
     FROM wallet_redemption_allocations a
     JOIN wallet_transactions c ON c.id = a.credit_txn_id
     WHERE a.order_id = $1 AND (a.amount - a.restored_amount) > 0
     ORDER BY a.id ASC
     FOR UPDATE`,
    [orderId]
  );

  const settings = await getCashbackSettings(dbClient);
  const expiryDays = Number(settings.expiry_days) || 0;
  const now = new Date();

  let remaining = targetToRestore;
  let totalActuallyRestored = 0;

  for (const alloc of allocRes.rows) {
    if (remaining <= 0) break;
    const unrestored = Number(alloc.amount) - Number(alloc.restored_amount);
    const restorePortion = Math.min(unrestored, remaining);

    if (restorePortion > 0) {
      const isExpired = alloc.credit_status === 'EXPIRED'
        || (alloc.credit_expires_at && new Date(alloc.credit_expires_at) <= now);

      if (isExpired) {
        let newExpiresAt = null;
        if (expiryDays > 0) {
          newExpiresAt = new Date(now);
          newExpiresAt.setDate(newExpiresAt.getDate() + expiryDays);
        }

        await dbClient.query(
          `INSERT INTO wallet_transactions (
             user_id, order_id, type, source, status, amount, remaining_amount, available_at, expires_at, note, created_at
           ) VALUES (
             $1, $2, 'CREDIT', 'REFUND', 'AVAILABLE', $3, $3, NOW(), $4, $5, NOW()
           )`,
          [order.user_id, order.id, restorePortion, newExpiresAt, `Restored wallet refund for Order #${order.id} (fresh expiry granted)`]
        );
      } else {
        await dbClient.query(
          `UPDATE wallet_transactions SET remaining_amount = remaining_amount + $1 WHERE id = $2`,
          [restorePortion, alloc.credit_id]
        );
      }

      await dbClient.query(
        `UPDATE wallet_redemption_allocations SET restored_amount = restored_amount + $1 WHERE id = $2`,
        [restorePortion, alloc.id]
      );

      remaining -= restorePortion;
      totalActuallyRestored += restorePortion;
    }
  }

  await dbClient.query(
    `UPDATE wallets SET balance = balance + $1, updated_at = NOW() WHERE user_id = $2`,
    [totalActuallyRestored, order.user_id]
  );

  const fullyRestored = (targetToRestore >= totalWalletUsed);
  await dbClient.query(
    `UPDATE material_enquiries 
     SET wallet_redeem_status = $1, wallet_used = GREATEST(0, wallet_used - $2), updated_at = NOW() 
     WHERE id = $3`,
    [fullyRestored ? 'RELEASED' : order.wallet_redeem_status, totalActuallyRestored, orderId]
  );

  return { success: true, released: true, restoredAmount: totalActuallyRestored };
}

/**
 * Confirm wallet redemption upon payment gateway success.
 */
export async function confirmWalletRedeem(orderId, client = pool) {
  const dbClient = (typeof orderId === 'object' && orderId?.client) ? orderId.client : client;
  const targetOrderId = (typeof orderId === 'object' && orderId?.orderId) ? orderId.orderId : orderId;

  await dbClient.query(
    `UPDATE material_enquiries 
     SET wallet_redeem_status = 'CONSUMED', updated_at = NOW() 
     WHERE id = $1 AND wallet_redeem_status = 'RESERVED'`,
    [targetOrderId]
  );
  return { success: true };
}
