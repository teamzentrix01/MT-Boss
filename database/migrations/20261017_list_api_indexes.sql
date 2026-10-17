-- Indexes for high-traffic admin/list API filters and sorts
-- Safe/idempotent: IF NOT EXISTS throughout

CREATE INDEX IF NOT EXISTS idx_agents_status_created
  ON agents (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agents_created_at
  ON agents (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_created_at
  ON users (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_delivery_city
  ON users (delivery_city);

CREATE INDEX IF NOT EXISTS idx_users_is_blocked
  ON users (is_blocked);

CREATE INDEX IF NOT EXISTS idx_career_enquiries_created_at
  ON career_enquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_career_enquiries_status_created
  ON career_enquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_calculator_quote_otps_created_at
  ON calculator_quote_otps (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_franchises_created_at
  ON franchises (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_franchises_status_created
  ON franchises (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vendors_verification_created
  ON vendors (verification_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_suppliers_status_created
  ON suppliers (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_property_enquiries_created_at
  ON property_enquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_property_enquiries_status_created
  ON property_enquiries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_professional_services_status_sort
  ON professional_services (status, sort_order ASC, id ASC);

CREATE INDEX IF NOT EXISTS idx_jobs_status_urgent_created
  ON jobs (status, urgent DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blogs_published_created
  ON blogs (is_published, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_managed_cities_active_sort
  ON managed_cities (is_active, sort_order ASC, name ASC);
