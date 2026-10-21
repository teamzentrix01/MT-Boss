-- Contractors are vendor accounts with is_contractor = true. Suppliers keep
-- using their existing, separate supplier account and login.
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS is_contractor BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS contractor_trade VARCHAR(120);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS labor_roles JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS labor_team_size VARCHAR(50);
CREATE INDEX IF NOT EXISTS vendors_contractor_idx ON vendors(is_contractor) WHERE is_contractor = TRUE;
UPDATE vendors SET is_contractor = TRUE
WHERE LOWER(COALESCE(business_type, '')) LIKE '%contractor%';

ALTER TABLE pm_vendors ADD COLUMN IF NOT EXISTS external_vendor_id BIGINT;
CREATE UNIQUE INDEX IF NOT EXISTS pm_vendors_external_vendor_id_key ON pm_vendors(external_vendor_id) WHERE external_vendor_id IS NOT NULL;

-- Link each worker to the exact project contractor assignment. vendor_id is
-- retained for backward compatibility with existing labor entries.
ALTER TABLE pm_labor ADD COLUMN IF NOT EXISTS project_vendor_id BIGINT REFERENCES pm_project_vendors(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS pm_labor_project_vendor_idx ON pm_labor(project_vendor_id);
