-- Phase 2 is additive: no Phase 1 table is changed.
CREATE TABLE IF NOT EXISTS pm_vendors (
  id BIGSERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL, phone VARCHAR(30), trade VARCHAR(120), address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS pm_project_vendors (
  id BIGSERIAL PRIMARY KEY, project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
  vendor_id BIGINT NOT NULL REFERENCES pm_vendors(id) ON DELETE RESTRICT, work_description TEXT NOT NULL,
  pay_type VARCHAR(20) NOT NULL CHECK (pay_type IN ('daily_wage','contract')), daily_rate NUMERIC(14,2),
  contract_amount NUMERIC(14,2), status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(project_id,vendor_id,work_description),
  CHECK ((pay_type='daily_wage' AND daily_rate IS NOT NULL AND daily_rate >= 0) OR (pay_type='contract' AND contract_amount IS NOT NULL AND contract_amount >= 0))
);
CREATE TABLE IF NOT EXISTS pm_attendance (
  id BIGSERIAL PRIMARY KEY, project_vendor_id BIGINT NOT NULL REFERENCES pm_project_vendors(id) ON DELETE RESTRICT,
  attendance_date DATE NOT NULL, status VARCHAR(20) NOT NULL CHECK(status IN ('present','absent','half_day')),
  workers_count NUMERIC(10,2) NOT NULL DEFAULT 1 CHECK(workers_count > 0), rate_per_worker NUMERIC(14,2) NOT NULL CHECK(rate_per_worker >= 0),
  wage_amount NUMERIC(14,2) NOT NULL CHECK(wage_amount >= 0), note TEXT, created_by TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_vendor_id,attendance_date)
);
CREATE TABLE IF NOT EXISTS pm_vendor_payments (
  id BIGSERIAL PRIMARY KEY, project_vendor_id BIGINT NOT NULL REFERENCES pm_project_vendors(id) ON DELETE RESTRICT,
  amount NUMERIC(14,2) NOT NULL CHECK(amount>0), payment_date DATE NOT NULL, mode VARCHAR(50),
  payment_type VARCHAR(20) NOT NULL CHECK(payment_type IN ('advance','labour','material','contract')), note TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE, created_by TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS pm_vendor_material_supply (
  id BIGSERIAL PRIMARY KEY, project_vendor_id BIGINT NOT NULL REFERENCES pm_project_vendors(id) ON DELETE RESTRICT,
  item_name VARCHAR(250) NOT NULL, unit VARCHAR(40), quantity NUMERIC(14,3) NOT NULL CHECK(quantity>0), rate NUMERIC(14,2) NOT NULL CHECK(rate>=0),
  amount NUMERIC(14,2) NOT NULL CHECK(amount>0), supply_date DATE NOT NULL, material_id BIGINT NULL, note TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE, created_by TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS pm_audit_log (
  id BIGSERIAL PRIMARY KEY, table_name VARCHAR(80) NOT NULL, record_id BIGINT NOT NULL, action VARCHAR(30) NOT NULL,
  changed_by TEXT NOT NULL, old_data JSONB, new_data JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS pm_project_vendors_project_id_idx ON pm_project_vendors(project_id);
CREATE INDEX IF NOT EXISTS pm_project_vendors_vendor_id_idx ON pm_project_vendors(vendor_id);
CREATE INDEX IF NOT EXISTS pm_attendance_project_vendor_id_idx ON pm_attendance(project_vendor_id);
CREATE INDEX IF NOT EXISTS pm_attendance_vendor_date_idx ON pm_attendance(project_vendor_id,attendance_date);
CREATE INDEX IF NOT EXISTS pm_vendor_payments_project_vendor_id_idx ON pm_vendor_payments(project_vendor_id);
CREATE INDEX IF NOT EXISTS pm_vendor_material_supply_project_vendor_id_idx ON pm_vendor_material_supply(project_vendor_id);
CREATE INDEX IF NOT EXISTS pm_vendor_payments_active_date_idx ON pm_vendor_payments(project_vendor_id,payment_date DESC) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS pm_vendor_supply_active_date_idx ON pm_vendor_material_supply(project_vendor_id,supply_date DESC) WHERE NOT is_deleted;
