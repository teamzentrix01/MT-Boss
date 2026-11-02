-- Local / Unregistered Project Vendors table
CREATE TABLE IF NOT EXISTS pm_project_local_vendors (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(30),
  city VARCHAR(100),
  address TEXT,
  material_type VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, name)
);

CREATE INDEX IF NOT EXISTS pm_project_local_vendors_proj_idx 
  ON pm_project_local_vendors(project_id);

CREATE INDEX IF NOT EXISTS pm_project_local_vendors_proj_active_idx 
  ON pm_project_local_vendors(project_id, is_active) WHERE is_active;

