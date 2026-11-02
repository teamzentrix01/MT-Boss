-- Add shifts and overtime to labor attendance
ALTER TABLE pm_labor_attendance 
  ADD COLUMN IF NOT EXISTS shift_type VARCHAR(20) NOT NULL DEFAULT 'day',
  ADD COLUMN IF NOT EXISTS overtime_hours NUMERIC(6,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS overtime_amount NUMERIC(14,2) NOT NULL DEFAULT 0;

-- Also add to contractor attendance for consistency
ALTER TABLE pm_attendance 
  ADD COLUMN IF NOT EXISTS shift_type VARCHAR(20) NOT NULL DEFAULT 'day',
  ADD COLUMN IF NOT EXISTS overtime_hours NUMERIC(6,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS overtime_amount NUMERIC(14,2) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS pm_labor_att_shift_idx ON pm_labor_attendance(shift_type);

