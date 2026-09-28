-- Project Management, Phase 1.  This module deliberately uses its own pm_*
-- namespace so later vendor/material phases do not alter legacy project tables.
CREATE TABLE IF NOT EXISTS pm_parties (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(255),
  gst_no VARCHAR(30),
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pm_projects (
  id BIGSERIAL PRIMARY KEY,
  party_id BIGINT NOT NULL REFERENCES pm_parties(id) ON DELETE RESTRICT,
  name VARCHAR(250) NOT NULL,
  site_address TEXT,
  start_date DATE NOT NULL,
  expected_end_date DATE,
  contract_value NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (contract_value >= 0),
  built_up_area NUMERIC(14,2),
  status VARCHAR(20) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'on_hold')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pm_party_payments (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mode VARCHAR(50),
  note TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT,
  updated_at TIMESTAMPTZ,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_by TEXT,
  deleted_at TIMESTAMPTZ
);

-- Immutable audit trail, intentionally not FK-bound so it remains available
-- after a future actor/account migration.
CREATE TABLE IF NOT EXISTS pm_audit_logs (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(40) NOT NULL,
  entity_id BIGINT NOT NULL,
  action VARCHAR(30) NOT NULL,
  changed_by TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pm_projects_party_id_idx ON pm_projects(party_id);
CREATE INDEX IF NOT EXISTS pm_party_payments_project_id_idx ON pm_party_payments(project_id);
CREATE INDEX IF NOT EXISTS pm_party_payments_active_project_date_idx ON pm_party_payments(project_id, payment_date DESC) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS pm_audit_logs_entity_idx ON pm_audit_logs(entity_type, entity_id, created_at DESC);
