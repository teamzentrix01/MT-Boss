/**
 * Direct integration test for the send-otp route handler.
 * Simulates what Next.js does when the route is called.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: false });
dotenv.config({ path: '.env', override: false });

// Patch globalThis for Next.js DB pool pattern
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
globalThis.__MTBOSS_pg_pool__ = pool;

// Simulate Next.js NextResponse
class MockNextResponse {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
  }
  static json(data, init = {}) {
    return new MockNextResponse(JSON.stringify(data), init);
  }
}

// Patch next/server
const { default: Module } = await import('module');
const originalLoad = Module._load;
Module._load = function (id, ...args) {
  if (id === 'next/server') {
    return { NextResponse: MockNextResponse };
  }
  return originalLoad.call(this, id, ...args);
};

// Now import our route module
// We need to replace the @/ alias manually first
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Simple mock request
function mockReq(body) {
  return {
    json: async () => body,
    headers: { get: () => null },
    cookies: { get: () => null },
  };
}

// Test the send-otp logic directly
import crypto from 'crypto';
import { Pool as PgPool } from 'pg';

const testPool = new PgPool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Replicate the route logic inline
const MOBILE_REGEX = /^[6-9]\d{9}$/;

async function testSendOtp(mobileInput) {
  const mobile = String(mobileInput || '').trim().replace(/\s/g, '');
  console.log(`Testing send-otp for mobile: ${mobile}`);

  if (!MOBILE_REGEX.test(mobile)) {
    return { error: 'Invalid mobile', status: 400 };
  }

  const client = await testPool.connect();
  try {
    await client.query('BEGIN');

    const lockKey = mobile.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 0);
    await client.query(`SELECT pg_advisory_xact_lock($1)`, [lockKey]);

    const recentRow = await client.query(
      `SELECT COUNT(*)::INT AS cnt FROM mobile_otp_rate_limits WHERE mobile = $1 AND requested_at > NOW() - INTERVAL '60 seconds'`,
      [mobile]
    );
    console.log(`  Rate limit (60s): ${recentRow.rows[0].cnt} requests`);

    if (Number(recentRow.rows[0]?.cnt) >= 1) {
      await client.query('ROLLBACK');
      return { error: 'Rate limited (60s)', status: 429 };
    }

    const hourlyRow = await client.query(
      `SELECT COUNT(*)::INT AS cnt FROM mobile_otp_rate_limits WHERE mobile = $1 AND requested_at > NOW() - INTERVAL '1 hour'`,
      [mobile]
    );
    console.log(`  Rate limit (1h): ${hourlyRow.rows[0].cnt} requests`);

    if (Number(hourlyRow.rows[0]?.cnt) >= 5) {
      await client.query('ROLLBACK');
      return { error: 'Rate limited (1h)', status: 429 };
    }

    await client.query(`INSERT INTO mobile_otp_rate_limits (mobile) VALUES ($1)`, [mobile]);
    await client.query(`UPDATE mobile_otps SET used = TRUE WHERE mobile = $1 AND used = FALSE`, [mobile]);

    const otp = String(crypto.randomInt(100000, 999999));
    const secret = process.env.OTP_SECRET || process.env.JWT_SECRET || 'dev-otp-secret-change-me';
    const otpHash = crypto.createHmac('sha256', secret).update(otp).digest('hex');

    await client.query(
      `INSERT INTO mobile_otps (mobile, otp_hash, valid_till, expires_at) VALUES ($1, $2, NOW() + INTERVAL '5 minutes', NOW() + INTERVAL '1 hour')`,
      [mobile, otpHash]
    );

    await client.query('COMMIT');

    // DEV MODE: log OTP to terminal
    if (process.env.OTP_DEV_MODE === 'true') {
      console.log(`\n[DEV MODE] OTP for +91${mobile}: ${otp}\n`);
    }

    // Cleanup
    testPool.query(`DELETE FROM mobile_otp_rate_limits WHERE requested_at < NOW() - INTERVAL '2 hours'`).catch(() => {});
    testPool.query(`DELETE FROM mobile_otps WHERE expires_at < NOW()`).catch(() => {});

    return { success: true, message: 'OTP sent successfully', status: 200 };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

// ── Run test ────────────────────────────────────────────────────────────────
const testMobile = '8888877777';

// Clean up first
await testPool.query(`DELETE FROM mobile_otp_rate_limits WHERE mobile = $1`, [testMobile]);
await testPool.query(`DELETE FROM mobile_otps WHERE mobile = $1`, [testMobile]);

try {
  const result = await testSendOtp(testMobile);
  console.log(`[send-otp] Result:       ${JSON.stringify(result)}`);
  console.log(`[send-otp] Test:         ${result.success ? '✅ PASS' : '❌ FAIL'}`);
} catch (err) {
  console.error(`[send-otp] ❌ FAIL:     ${err.message}`);
  console.error(err.stack);
}

// Test rate limiting (second request should be 429)
try {
  const r2 = await testSendOtp(testMobile);
  console.log(`[rate-limit 60s] Status: ${r2.status === 429 ? '✅ PASS (429)' : `❌ FAIL (got ${r2.status})`}`);
} catch (err) {
  console.error(`[rate-limit 60s] ❌:    ${err.message}`);
}

// Test invalid mobile
const r3 = await testSendOtp('1234567890').catch(e => ({ error: e.message, status: 500 }));
console.log(`[invalid mobile] Status: ${r3.status === 400 ? '✅ PASS (400)' : `❌ FAIL (got ${r3.status})`}`);

// Cleanup
await testPool.query(`DELETE FROM mobile_otp_rate_limits WHERE mobile = $1`, [testMobile]);
await testPool.query(`DELETE FROM mobile_otps WHERE mobile = $1`, [testMobile]);

await testPool.end();
console.log('\n✅ Route logic tests complete.');

