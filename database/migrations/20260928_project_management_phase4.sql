-- Phase 4: Alert dismissals + settings. Read-only over Phases 1-3.
-- No existing table is altered.

CREATE TABLE IF NOT EXISTS pm_alert_dismissals (
  id           BIGSERIAL PRIMARY KEY,
  alert_key    TEXT NOT NULL,
  dismissed_by TEXT NOT NULL,
  dismissed_until TIMESTAMPTZ,          -- NULL = permanent dismissal
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pm_settings (
  key        VARCHAR(100) PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed defaults (idempotent)
INSERT INTO pm_settings (key, value) VALUES
  ('party_payment_gap_days',          '30'),
  ('contract_paid_warning_percent',   '90')
ON CONFLICT (key) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS pm_alert_dismissals_key_until_idx
  ON pm_alert_dismissals (alert_key, dismissed_until DESC NULLS FIRST);
CREATE INDEX IF NOT EXISTS pm_alert_dismissals_created_idx
  ON pm_alert_dismissals (created_at DESC);

-- Missing Phase 3 composite indexes that help dashboard queries
CREATE INDEX IF NOT EXISTS pm_party_payments_date_idx
  ON pm_party_payments (payment_date DESC) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS pm_attendance_date_idx
  ON pm_attendance (attendance_date DESC);
CREATE INDEX IF NOT EXISTS pm_other_expenses_date_idx
  ON pm_other_expenses (expense_date DESC) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS pm_material_received_date_idx
  ON pm_material_received (received_date DESC) WHERE NOT is_deleted;
CREATE INDEX IF NOT EXISTS pm_vendor_supply_date_idx
  ON pm_vendor_material_supply (supply_date DESC) WHERE NOT is_deleted;
