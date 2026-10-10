-- Migration: 20261008_cashback_wallet_system.sql
-- Description: Dynamic Cashback Rules, Wallet balance, Transactions, and Order snapshot columns

-- 1. Global Cashback Settings (single-row table)
CREATE TABLE IF NOT EXISTS cashback_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  stacking_mode VARCHAR(20) NOT NULL DEFAULT 'HIGHEST', -- 'HIGHEST' or 'SUM'
  allow_with_coupon BOOLEAN NOT NULL DEFAULT TRUE,
  calc_base VARCHAR(20) NOT NULL DEFAULT 'AFTER_DISCOUNT', -- 'AFTER_DISCOUNT' or 'BEFORE_DISCOUNT'
  max_cashback_per_order NUMERIC(12,2) DEFAULT NULL, -- NULL = no cap
  pending_days INTEGER NOT NULL DEFAULT 7, -- days after delivery before becoming spendable; 0 = instant
  expiry_days INTEGER NOT NULL DEFAULT 0, -- 0 = never expires
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row_check CHECK (id = 1)
);

-- Ensure default settings row exists
INSERT INTO cashback_settings (id, enabled, stacking_mode, allow_with_coupon, calc_base, max_cashback_per_order, pending_days, expiry_days)
VALUES (1, TRUE, 'HIGHEST', TRUE, 'AFTER_DISCOUNT', NULL, 7, 0)
ON CONFLICT (id) DO NOTHING;

-- 2. Dynamic Cashback Rules
CREATE TABLE IF NOT EXISTS cashback_rules (
  id SERIAL PRIMARY KEY,
  rule_type VARCHAR(30) NOT NULL, -- 'FIRST_ORDER', 'CATEGORY', 'SLAB'
  value_type VARCHAR(20) NOT NULL DEFAULT 'PERCENT', -- 'PERCENT' or 'FLAT'
  value NUMERIC(10,2) NOT NULL DEFAULT 0, -- e.g. 5.00 for 5% or 200 for flat 200 (for FIRST_ORDER & CATEGORY)
  category_id INTEGER REFERENCES shop_categories(id) ON DELETE CASCADE,
  slabs JSONB DEFAULT '[]'::jsonb, -- Array of [{ upto: 5000, percent: 1 }, { upto: 20000, percent: 2 }, { upto: null, percent: 3 }]
  min_order_value NUMERIC(12,2) DEFAULT 0,
  max_cashback NUMERIC(12,2) DEFAULT NULL, -- Per-rule cap (NULL = no cap)
  start_date DATE DEFAULT NULL,
  end_date DATE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partial Unique Indexes for rules
-- Only one active FIRST_ORDER rule allowed
CREATE UNIQUE INDEX IF NOT EXISTS uidx_cashback_active_first_order
ON cashback_rules (rule_type)
WHERE rule_type = 'FIRST_ORDER' AND is_active = TRUE;

-- Only one active SLAB rule allowed
CREATE UNIQUE INDEX IF NOT EXISTS uidx_cashback_active_slab
ON cashback_rules (rule_type)
WHERE rule_type = 'SLAB' AND is_active = TRUE;

-- Only one active CATEGORY rule per category
CREATE UNIQUE INDEX IF NOT EXISTS uidx_cashback_active_category
ON cashback_rules (category_id)
WHERE rule_type = 'CATEGORY' AND is_active = TRUE AND category_id IS NOT NULL;

-- 3. Wallets table for users
CREATE TABLE IF NOT EXISTS wallets (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  pending_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_wallet_balance_positive CHECK (balance >= 0),
  CONSTRAINT chk_wallet_pending_positive CHECK (pending_balance >= 0)
);

-- 4. Wallet Transactions Ledger
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES material_enquiries(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL, -- 'CREDIT' or 'DEBIT'
  source VARCHAR(30) NOT NULL, -- 'CASHBACK', 'REDEEM', 'REFUND', 'REVERSAL', 'EXPIRY'
  status VARCHAR(20) NOT NULL, -- 'PENDING', 'AVAILABLE', 'EXPIRED', 'REVERSED'
  amount NUMERIC(12,2) NOT NULL,
  rule_breakdown JSONB DEFAULT '{}'::jsonb,
  available_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  note TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_user_created ON wallet_transactions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_status_available ON wallet_transactions (status, available_at);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_status_expires ON wallet_transactions (status, expires_at);

-- Ensure only one cashback credit transaction per order
CREATE UNIQUE INDEX IF NOT EXISTS uidx_wallet_tx_one_cashback_per_order
ON wallet_transactions (order_id)
WHERE source = 'CASHBACK' AND type = 'CREDIT' AND order_id IS NOT NULL;

-- 5. Add Cashback snapshot columns to orders (material_enquiries)
ALTER TABLE material_enquiries
  ADD COLUMN IF NOT EXISTS cashback_amount NUMERIC(12,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS cashback_breakdown JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS cashback_status VARCHAR(30) DEFAULT 'NONE'; -- 'NONE', 'SCHEDULED', 'CREDITED', 'REVERSED', 'CANCELLED'
