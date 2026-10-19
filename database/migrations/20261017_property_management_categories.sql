-- Migration: 20261017_property_management_categories.sql
-- Additive: Room Rent / Flat / Plot categories, structured details, bookings.
-- Does not drop or rewrite existing property rows.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS property_category VARCHAR(30) NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS nearby_places JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS security_deposit NUMERIC(14,2),
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS locality VARCHAR(120),
  ADD COLUMN IF NOT EXISTS state VARCHAR(120),
  ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
  ADD COLUMN IF NOT EXISTS available_from DATE,
  ADD COLUMN IF NOT EXISTS furnishing VARCHAR(40),
  ADD COLUMN IF NOT EXISTS floor_plans JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS documents JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Backfill sensible categories from legacy type/category text
UPDATE properties
SET property_category = CASE
  WHEN LOWER(COALESCE(type, '') || ' ' || COALESCE(category, '')) ~ 'plot|land|agricultural' THEN 'plot'
  WHEN LOWER(COALESCE(type, '') || ' ' || COALESCE(category, '')) ~ 'room|pg|hostel|shared' THEN 'room_rent'
  WHEN LOWER(COALESCE(type, '') || ' ' || COALESCE(category, '')) ~ 'apartment|flat|bhk|rk|villa|house|residential' THEN 'flat'
  ELSE property_category
END
WHERE property_category = 'general';

CREATE INDEX IF NOT EXISTS idx_properties_category ON properties (property_category);
CREATE INDEX IF NOT EXISTS idx_properties_status_category ON properties (status, property_category);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties (listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_price_raw ON properties (price_raw);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties (location);

CREATE TABLE IF NOT EXISTS property_bookings (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  duration_months INTEGER,
  message TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'requested',
  admin_notes TEXT,
  reviewed_by INTEGER,
  reviewed_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT property_bookings_status_check CHECK (
    status = ANY (ARRAY['requested', 'approved', 'rejected', 'cancelled', 'completed'])
  )
);

CREATE INDEX IF NOT EXISTS idx_property_bookings_property ON property_bookings (property_id);
CREATE INDEX IF NOT EXISTS idx_property_bookings_user ON property_bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_property_bookings_status ON property_bookings (status);
CREATE INDEX IF NOT EXISTS idx_property_bookings_dates ON property_bookings (property_id, start_date, end_date);
