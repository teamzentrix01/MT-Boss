-- Migration: Shop Vendor Commissions & Commission Percent Setting
-- Step 1: Database — Platform Fee Setting + Tracking Table

-- 1. Ensure existing key-value settings table (pm_settings) exists
CREATE TABLE IF NOT EXISTS pm_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Seed shop_vendor_commission_percent setting (default 10%)
INSERT INTO pm_settings (key, value)
VALUES ('shop_vendor_commission_percent', '10.00')
ON CONFLICT (key) DO NOTHING;

-- 3. Create shop_vendor_commissions table
CREATE TABLE IF NOT EXISTS shop_vendor_commissions (
  id BIGSERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES material_enquiries(id) ON DELETE CASCADE,
  vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  product_id INTEGER,
  order_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  commission_percent_applied NUMERIC(5,2) NOT NULL DEFAULT 0,
  commission_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  paid_note TEXT
);

-- 4. Indexes for fast lookups & admin reporting
CREATE INDEX IF NOT EXISTS idx_shop_vendor_commissions_order_id ON shop_vendor_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_shop_vendor_commissions_vendor_id ON shop_vendor_commissions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_shop_vendor_commissions_status ON shop_vendor_commissions(status);
CREATE INDEX IF NOT EXISTS idx_shop_vendor_commissions_created_at ON shop_vendor_commissions(created_at DESC);
