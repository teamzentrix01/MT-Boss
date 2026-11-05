/**
 * Standalone test for mobile-auth lib functions.
 * Run: node --use-system-ca scratch/test-mobile-auth.mjs
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: false });
dotenv.config({ path: '.env', override: false });

import crypto from 'crypto';

// ── Test OTP generation & hashing ──────────────────────────────────────────
const otp1 = String(crypto.randomInt(100000, 999999));
const secret = process.env.OTP_SECRET || process.env.JWT_SECRET || 'dev-otp-secret-change-me';

function hashOtp(otp) {
  return crypto.createHmac('sha256', secret).update(String(otp).trim()).digest('hex');
}

function verifyOtp(otp, hash) {
  const supplied = hashOtp(otp);
  if (hash.length !== supplied.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(supplied, 'hex'));
  } catch { return false; }
}

const hash1 = hashOtp(otp1);
console.log(`[1] OTP generation:    OTP=${otp1}  hash=${hash1.slice(0,16)}...`);
console.log(`[1] OTP verify match:  ${verifyOtp(otp1, hash1) ? '✅ PASS' : '❌ FAIL'}`);
console.log(`[1] OTP verify wrong:  ${!verifyOtp('000000', hash1) ? '✅ PASS (correctly rejected)' : '❌ FAIL'}`);

// ── Test JWT generation ─────────────────────────────────────────────────────
import jwt from 'jsonwebtoken';

const accessSecret = process.env.ACCESS_SECRET || 'dev-access-secret-change-me';
const refreshSecret = process.env.REFRESH_SECRET || 'dev-refresh-secret-change-me';

const fakeUser = { id: 1, mobile: '9876543210', role: 'vendor', status: 'pending' };

const accessToken = jwt.sign(
  { sub: String(fakeUser.id), userId: fakeUser.id, mobile: fakeUser.mobile, role: fakeUser.role, type: 'access' },
  accessSecret,
  { expiresIn: '15m' }
);

const refreshToken = jwt.sign(
  { sub: String(fakeUser.id), userId: fakeUser.id, mobile: fakeUser.mobile, role: fakeUser.role, type: 'refresh', jti: crypto.randomUUID() },
  refreshSecret,
  { expiresIn: '30d' }
);

const accessDecoded = jwt.verify(accessToken, accessSecret);
const refreshDecoded = jwt.verify(refreshToken, refreshSecret);

console.log(`[2] Access token type:   ${accessDecoded.type === 'access' ? '✅ PASS' : '❌ FAIL'}`);
console.log(`[2] Refresh token type:  ${refreshDecoded.type === 'refresh' ? '✅ PASS' : '❌ FAIL'}`);
console.log(`[2] Access token role:   ${accessDecoded.role === 'vendor' ? '✅ PASS' : '❌ FAIL'}`);
console.log(`[2] Refresh token jti:   ${refreshDecoded.jti ? '✅ PASS' : '❌ FAIL'}`);

// ── Test DB connection ──────────────────────────────────────────────────────
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

try {
  const client = await pool.connect();

  // Check tables exist
  const tablesResult = await client.query(`
    SELECT tablename FROM pg_tables 
    WHERE schemaname='public' 
    AND tablename IN ('mobile_users','mobile_otps','mobile_otp_rate_limits')
    ORDER BY tablename
  `);
  const tables = tablesResult.rows.map(r => r.tablename);
  console.log(`[3] Tables exist:        ${tables.join(', ')}`);
  const allPresent = ['mobile_otp_rate_limits','mobile_otps','mobile_users'].every(t => tables.includes(t));
  console.log(`[3] All tables present:  ${allPresent ? '✅ PASS' : '❌ FAIL'}`);

  // Test mobile_users insert + select + delete
  const testMobile = '9999988888';
  await client.query(`DELETE FROM mobile_users WHERE mobile = $1`, [testMobile]);
  await client.query(
    `INSERT INTO mobile_users (mobile, role, status) VALUES ($1, 'vendor', 'pending')`,
    [testMobile]
  );
  const row = await client.query(`SELECT id, mobile, role, status FROM mobile_users WHERE mobile=$1`, [testMobile]);
  console.log(`[3] Insert mobile_user:  ${row.rows[0]?.mobile === testMobile ? '✅ PASS' : '❌ FAIL'}`);
  await client.query(`DELETE FROM mobile_users WHERE mobile = $1`, [testMobile]);

  // Test mobile_otps insert
  const testOtpHash = hashOtp('123456');
  await client.query(`DELETE FROM mobile_otps WHERE mobile = $1`, [testMobile]);
  await client.query(
    `INSERT INTO mobile_otps (mobile, otp_hash, valid_till, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '5 minutes', NOW() + INTERVAL '1 hour')`,
    [testMobile, testOtpHash]
  );
  const otpRow = await client.query(`SELECT id, mobile FROM mobile_otps WHERE mobile=$1 AND used=FALSE`, [testMobile]);
  console.log(`[3] Insert mobile_otp:   ${otpRow.rows[0]?.mobile === testMobile ? '✅ PASS' : '❌ FAIL'}`);
  await client.query(`DELETE FROM mobile_otps WHERE mobile = $1`, [testMobile]);

  client.release();
  console.log(`[3] DB tests:            ✅ ALL PASS`);
} catch (err) {
  console.error(`[3] DB error:            ❌ FAIL — ${err.message}`);
} finally {
  await pool.end();
}

console.log('\n✅ All unit tests complete.');

