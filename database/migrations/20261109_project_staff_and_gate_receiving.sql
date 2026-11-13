-- Migration: Project Staff Management & Material Gate Receiving
-- Date: 2026-11-09

-- 1. Alter pm_material_received for Gate Receiving / Vehicle tracking
ALTER TABLE pm_material_received
  ADD COLUMN IF NOT EXISTS vehicle_no VARCHAR(100),
  ADD COLUMN IF NOT EXISTS driver_name VARCHAR(150),
  ADD COLUMN IF NOT EXISTS driver_phone VARCHAR(30),
  ADD COLUMN IF NOT EXISTS received_by VARCHAR(150),
  ADD COLUMN IF NOT EXISTS gate_pass_no VARCHAR(100);

-- 2. Create pm_project_staff table
CREATE TABLE IF NOT EXISTS pm_project_staff (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(30),
  role VARCHAR(100) NOT NULL DEFAULT 'Site Supervisor',
  pay_type VARCHAR(30) NOT NULL DEFAULT 'monthly' CHECK (pay_type IN ('monthly', 'per_day', 'fixed_fee')),
  salary_rate NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (salary_rate >= 0),
  commission_rate NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (commission_rate >= 0),
  commission_notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS pm_project_staff_project_idx ON pm_project_staff(project_id);
CREATE INDEX IF NOT EXISTS pm_project_staff_active_idx ON pm_project_staff(project_id, is_active);

-- 3. Create pm_staff_attendance table
CREATE TABLE IF NOT EXISTS pm_staff_attendance (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
  staff_id BIGINT NOT NULL REFERENCES pm_project_staff(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'half_day')),
  wage_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (wage_amount >= 0),
  overtime_hours NUMERIC(6,2) NOT NULL DEFAULT 0,
  overtime_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  note TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (staff_id, attendance_date)
);

CREATE INDEX IF NOT EXISTS pm_staff_att_project_idx ON pm_staff_attendance(project_id);
CREATE INDEX IF NOT EXISTS pm_staff_att_staff_idx ON pm_staff_attendance(staff_id, attendance_date);
CREATE INDEX IF NOT EXISTS pm_staff_att_date_idx ON pm_staff_attendance(attendance_date);

-- 4. Create pm_staff_payments table
CREATE TABLE IF NOT EXISTS pm_staff_payments (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
  staff_id BIGINT NOT NULL REFERENCES pm_project_staff(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  payment_type VARCHAR(30) NOT NULL DEFAULT 'salary' CHECK (payment_type IN ('salary', 'advance', 'commission', 'bonus', 'reimbursement')),
  mode VARCHAR(50) DEFAULT 'bank',
  transaction_reference TEXT,
  note TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS pm_staff_payments_project_idx ON pm_staff_payments(project_id) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS pm_staff_payments_staff_idx ON pm_staff_payments(staff_id) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS pm_staff_payments_date_idx ON pm_staff_payments(payment_date) WHERE NOT is_deleted;

