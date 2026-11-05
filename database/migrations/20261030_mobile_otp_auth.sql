-- Mobile OTP Authentication tables
-- Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS)

-- NOTE: We do NOT alter the existing public.users table (which stores website customer accounts).
-- Mobile partner authentication uses a dedicated mobile_users table to avoid any conflict
-- with existing website users, vendors, agents, and suppliers tables.

-- Step 1: Create mobile_users table for app-specific identity
-- This is a SEPARATE table from the website users/vendors/agents/suppliers tables
CREATE TABLE IF NOT EXISTS public.mobile_users (
  id SERIAL PRIMARY KEY,
  mobile VARCHAR(15) NOT NULL UNIQUE,
  name VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'vendor' CHECK (role IN ('agent','vendor','supplier')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','blocked')),
  refresh_token_hash TEXT,
  entity_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.mobile_users
  ADD COLUMN IF NOT EXISTS entity_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_mobile_users_mobile ON public.mobile_users(mobile);
CREATE INDEX IF NOT EXISTS idx_mobile_users_entity ON public.mobile_users(role, entity_id);

-- Step 3: OTPs table for mobile auth
CREATE TABLE IF NOT EXISTS public.mobile_otps (
  id SERIAL PRIMARY KEY,
  mobile VARCHAR(15) NOT NULL,
  otp_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  valid_till TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mobile_otps_mobile ON public.mobile_otps(mobile);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_valid_till ON public.mobile_otps(valid_till);
CREATE INDEX IF NOT EXISTS idx_mobile_otps_expires_at ON public.mobile_otps(expires_at);

-- Step 4: OTP rate limits table
CREATE TABLE IF NOT EXISTS public.mobile_otp_rate_limits (
  id SERIAL PRIMARY KEY,
  mobile VARCHAR(15) NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mobile_otp_rate_limits_mobile ON public.mobile_otp_rate_limits(mobile);
CREATE INDEX IF NOT EXISTS idx_mobile_otp_rate_limits_requested_at ON public.mobile_otp_rate_limits(requested_at);
