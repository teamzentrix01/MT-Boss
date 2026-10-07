-- Migration: Add shop_commission_rules table and rate_source to shop_vendor_commissions
-- Date: 2026-10-06

CREATE TABLE IF NOT EXISTS shop_commission_rules (
  id BIGSERIAL PRIMARY KEY,
  scope_type VARCHAR(20) NOT NULL CHECK (scope_type IN ('category', 'product')),
  scope_id INTEGER NOT NULL,
  commission_percent NUMERIC(5,2) NOT NULL CHECK (commission_percent >= 0 AND commission_percent <= 100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(scope_type, scope_id)
);

CREATE INDEX IF NOT EXISTS idx_shop_commission_rules_scope
  ON shop_commission_rules(scope_type, scope_id);

CREATE INDEX IF NOT EXISTS idx_shop_commission_rules_active
  ON shop_commission_rules(is_active);

-- Add rate_source to shop_vendor_commissions if not exists
ALTER TABLE shop_vendor_commissions
  ADD COLUMN IF NOT EXISTS rate_source VARCHAR(20) DEFAULT 'default'
  CHECK (rate_source IN ('product', 'category', 'default'));
