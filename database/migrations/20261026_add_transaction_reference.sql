-- Add transaction_reference column to payment tables
ALTER TABLE pm_party_payments ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR(255);
ALTER TABLE pm_vendor_payments ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR(255);
ALTER TABLE pm_labor_payments ADD COLUMN IF NOT EXISTS transaction_reference VARCHAR(255);
ALTER TABLE pm_supplier_payments ADD COLUMN IF NOT EXISTS transaction_reference TEXT;
