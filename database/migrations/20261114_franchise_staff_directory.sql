-- Migration: Franchise Staff Records & Directory
-- Date: 2026-11-14

CREATE TABLE IF NOT EXISTS franchise_staff (
  id BIGSERIAL PRIMARY KEY,
  franchise_id INTEGER NOT NULL REFERENCES franchises(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(150),
  role VARCHAR(100) NOT NULL DEFAULT 'Site Supervisor',
  department VARCHAR(100) DEFAULT 'Operations',
  joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
  relieving_date DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'working' CHECK (status IN ('working', 'resigned', 'terminated', 'on_leave', 'inactive')),
  assigned_project_or_site VARCHAR(255),
  notes TEXT,
  staff_code VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS franchise_staff_franchise_idx ON franchise_staff(franchise_id);
CREATE INDEX IF NOT EXISTS franchise_staff_status_idx ON franchise_staff(franchise_id, status);
CREATE INDEX IF NOT EXISTS franchise_staff_role_idx ON franchise_staff(franchise_id, role);
CREATE INDEX IF NOT EXISTS franchise_staff_code_idx ON franchise_staff(franchise_id, staff_code);

-- Backfill staff_code for existing records
ALTER TABLE franchise_staff ADD COLUMN IF NOT EXISTS staff_code VARCHAR(50);
UPDATE franchise_staff SET staff_code = 'FS-' || LPAD(id::text, 4, '0') WHERE staff_code IS NULL;

