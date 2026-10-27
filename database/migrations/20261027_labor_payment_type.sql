-- Add payment_type column to pm_labor_payments to distinguish regular wage from advance payments
ALTER TABLE pm_labor_payments ADD COLUMN IF NOT EXISTS payment_type VARCHAR(50) DEFAULT 'wage';
