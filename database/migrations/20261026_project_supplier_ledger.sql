-- Supplier ledger: additive only. Apply through the project's normal migration process.
ALTER TABLE pm_material_received
  ADD COLUMN IF NOT EXISTS supplier_id BIGINT REFERENCES suppliers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS pm_material_received_supplier_id_idx
  ON pm_material_received(project_id, supplier_id) WHERE NOT is_deleted;

CREATE TABLE IF NOT EXISTS pm_supplier_payments (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE RESTRICT,
  supplier_id BIGINT NULL REFERENCES suppliers(id) ON DELETE SET NULL,
  supplier_name TEXT,
  amount NUMERIC(14,2) NOT NULL CHECK(amount > 0),
  payment_date DATE NOT NULL,
  mode VARCHAR(50),
  transaction_reference TEXT,
  note TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS pm_supplier_payments_project_supplier_idx
  ON pm_supplier_payments(project_id, supplier_id, payment_date DESC) WHERE NOT is_deleted;
