-- Phase 5: Cost Benchmarks, Rate Estimation, Budget Calculator Link
-- Additive, non-breaking migration for Neon Postgres

-- 1. Small additions to existing pm_projects table
ALTER TABLE pm_projects
  ADD COLUMN IF NOT EXISTS project_type VARCHAR(40) NULL,
  ADD COLUMN IF NOT EXISTS floors INT NULL,
  ADD COLUMN IF NOT EXISTS quality_tier VARCHAR(40) NULL,
  ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL,
  ADD COLUMN IF NOT EXISTS foundation_type VARCHAR(40) NULL,
  ADD COLUMN IF NOT EXISTS include_in_benchmark BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS completed_date DATE NULL,
  ADD COLUMN IF NOT EXISTS progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0;

-- 2. Add benchmark_key to pm_materials
ALTER TABLE pm_materials
  ADD COLUMN IF NOT EXISTS benchmark_key VARCHAR(40) NULL;

-- 3. Project benchmarks snapshot table
CREATE TABLE IF NOT EXISTS pm_project_benchmarks (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL UNIQUE REFERENCES pm_projects(id) ON DELETE CASCADE,
  built_up_area NUMERIC(14,2),
  labour_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
  vendor_material_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
  direct_material_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
  other_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
  cost_per_sqft NUMERIC(14,2),
  labour_per_sqft NUMERIC(14,2),
  material_per_sqft NUMERIC(14,2),
  other_per_sqft NUMERIC(14,2),
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_quality_flags JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 4. Project material benchmarks snapshot table
CREATE TABLE IF NOT EXISTS pm_project_material_benchmarks (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
  material_id BIGINT NOT NULL REFERENCES pm_materials(id) ON DELETE CASCADE,
  benchmark_key VARCHAR(40),
  net_quantity NUMERIC(14,3) NOT NULL DEFAULT 0,
  quantity_per_sqft NUMERIC(14,4),
  avg_rate NUMERIC(14,2),
  cost_per_sqft NUMERIC(14,2),
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, material_id)
);

-- 5. Rate summary snapshot table
CREATE TABLE IF NOT EXISTS pm_rate_summary (
  id BIGSERIAL PRIMARY KEY,
  segment_key VARCHAR(120) NOT NULL,
  project_type VARCHAR(40),
  quality_tier VARCHAR(40),
  floors_bucket VARCHAR(40),
  city VARCHAR(100),
  metric VARCHAR(60) NOT NULL,
  median NUMERIC(14,2),
  min NUMERIC(14,2),
  max NUMERIC(14,2),
  sample_count INT NOT NULL DEFAULT 0,
  confidence VARCHAR(20) NOT NULL DEFAULT 'low',
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Calculator rate overrides table
CREATE TABLE IF NOT EXISTS pm_calculator_rate_overrides (
  id BIGSERIAL PRIMARY KEY,
  metric_key VARCHAR(60) NOT NULL,
  quality_tier VARCHAR(40),
  old_value NUMERIC(14,2) NOT NULL,
  new_value NUMERIC(14,2) NOT NULL,
  applied_by TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reverted_at TIMESTAMPTZ NULL,
  note TEXT
);

-- 7. Seed setting use_real_rates (default false)
INSERT INTO pm_settings (key, value)
VALUES ('use_real_rates', 'false')
ON CONFLICT (key) DO NOTHING;

-- 8. Indexes for performance (< 2s responses)
CREATE INDEX IF NOT EXISTS pm_projects_benchmark_idx ON pm_projects(include_in_benchmark, status, progress_percent);
CREATE INDEX IF NOT EXISTS pm_project_benchmarks_proj_idx ON pm_project_benchmarks(project_id);
CREATE INDEX IF NOT EXISTS pm_project_mat_bm_proj_key_idx ON pm_project_material_benchmarks(project_id, benchmark_key);
CREATE INDEX IF NOT EXISTS pm_project_mat_bm_mat_idx ON pm_project_material_benchmarks(material_id);
CREATE INDEX IF NOT EXISTS pm_rate_summary_segment_metric_idx ON pm_rate_summary(segment_key, metric);
CREATE INDEX IF NOT EXISTS pm_calc_overrides_metric_tier_active_idx ON pm_calculator_rate_overrides(metric_key, quality_tier) WHERE reverted_at IS NULL;
