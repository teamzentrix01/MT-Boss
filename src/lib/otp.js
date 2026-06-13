import crypto from 'crypto';
import pool from '@/lib/db';
import { getJwtSecret } from '@/lib/auth';

export const SERVICE_OTP_EXPIRY_MINUTES = 10;
export const SERVICE_OTP_MAX_ATTEMPTS = 5;
export const PASSWORD_RESET_OTP_EXPIRY_MINUTES = 10;
export const PASSWORD_RESET_OTP_MAX_ATTEMPTS = 5;

function getOtpSecret() {
  return process.env.OTP_SECRET || getJwtSecret();
}

export async function ensureOtpSchema() {
  const alters = [
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS start_otp TEXT`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS start_otp_verified BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS start_otp_generated_at TIMESTAMPTZ`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS start_otp_attempts INTEGER DEFAULT 0`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS service_started_at TIMESTAMPTZ`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS finish_otp TEXT`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS finish_otp_verified BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS finish_otp_generated_at TIMESTAMPTZ`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS finish_otp_attempts INTEGER DEFAULT 0`,
    `ALTER TABLE service_bookings ADD COLUMN IF NOT EXISTS service_finished_at TIMESTAMPTZ`,
  ];

  for (const sql of alters) {
    try { await pool.query(sql); } catch (_) { /* already exists */ }
  }
}

export function generateOtp() {
  return String(Math.floor(1000 + Math.random() * 9000)); // 4-digit OTP
}

export function generateSixDigitOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashOtp(otp) {
  return crypto
    .createHmac('sha256', getOtpSecret())
    .update(String(otp).trim())
    .digest('hex');
}

export function verifyOtp(otp, otpHash) {
  if (!otp || !otpHash) return false;

  const suppliedHash = hashOtp(otp);
  const storedHash = String(otpHash);

  if (storedHash.length !== suppliedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(storedHash, 'utf8'),
    Buffer.from(suppliedHash, 'utf8')
  );
}
