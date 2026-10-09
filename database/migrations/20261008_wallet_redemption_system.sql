-- Migration: 20261008_wallet_redemption_system.sql
-- Description: Wallet redemption settings, order wallet fields, credit lot remaining_amount, and redemption allocations.

-- 1. Extend cashback_settings for Wallet Redemption
ALTER TABLE cashback_settings
  ADD COLUMN IF NOT EXISTS redeem_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS max_redeem_percent_of_order NUMERIC(5,2) NOT NULL DEFAULT 10.00,
  ADD COLUMN IF NOT EXISTS min_order_for_redeem NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS min_redeem_amount NUMERIC(12,2) NOT NULL DEFAULT 1.00,
  ADD COLUMN IF NOT EXISTS allow_redeem_with_coupon BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS cashback_on_wallet_paid_amount BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Extend material_enquiries for Wallet Redemption
ALTER TABLE material_enquiries
  ADD COLUMN IF NOT EXISTS wallet_used NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS wallet_redeem_status VARCHAR(30) NOT NULL DEFAULT 'NONE'; -- 'NONE', 'RESERVED', 'CONSUMED', 'RELEASED'

-- 3. Add remaining_amount to wallet_transactions
ALTER TABLE wallet_transactions
  ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC(12,2) DEFAULT NULL;

-- 4. Create wallet_redemption_allocations table
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

-- 5. Backfill remaining_amount for existing wallet_transactions
UPDATE wallet_transactions
SET remaining_amount = CASE
  WHEN type = 'CREDIT' AND status = 'AVAILABLE' THEN amount
  WHEN type = 'CREDIT' AND status = 'PENDING' THEN amount
  ELSE 0.00
END
WHERE remaining_amount IS NULL;
