-- Migration: Add specializations to agents table (additive only)
-- Allowed values: payments, labor, vendor, construction

ALTER TABLE agents 
  ADD COLUMN IF NOT EXISTS specializations JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Ensure any NULLs in existing rows are migrated to empty array
UPDATE agents 
  SET specializations = '[]'::jsonb 
  WHERE specializations IS NULL;
