import pool from '@/lib/db';

export async function ensureOtpSchema() {
  const alters = [
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS start_otp TEXT`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS start_otp_verified BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS start_otp_generated_at TIMESTAMPTZ`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS service_started_at TIMESTAMPTZ`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS finish_otp TEXT`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS finish_otp_verified BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS finish_otp_generated_at TIMESTAMPTZ`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS service_finished_at TIMESTAMPTZ`,
  ];

  for (const sql of alters) {
    try { await pool.query(sql); } catch (_) { /* already exists */ }
  }
}

export function generateOtp() {
  return String(Math.floor(1000 + Math.random() * 9000)); // 4-digit OTP
}
