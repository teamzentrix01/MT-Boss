/* eslint-disable no-console */
require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('DB_MEASURE_SKIP: DATABASE_URL not set');
    process.exit(0);
  }
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 8000,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  try {
    const t0 = Date.now();
    await pool.query('SELECT 1');
    console.log('DB_CONNECT_MS', Date.now() - t0);

    const queries = [
      ['agents_list_slim', 'SELECT id, name, email, phone, city, status, created_at FROM agents ORDER BY created_at DESC LIMIT 50'],
      ['agents_list_full_star', 'SELECT * FROM agents ORDER BY created_at DESC LIMIT 50'],
      ['users_list_slim', 'SELECT id, name, email, phone, delivery_city, created_at, is_blocked FROM users ORDER BY created_at DESC LIMIT 25'],
      ['quotes_list_slim', `SELECT id, name, email, phone, address, verified, created_at,
        jsonb_build_object('totals', jsonb_build_object('grandTotal', estimate->'totals'->>'grandTotal')) AS estimate
        FROM calculator_quote_otps ORDER BY created_at DESC LIMIT 50`],
      ['quotes_list_full_estimate', 'SELECT id, name, email, phone, address, estimate, verified, created_at FROM calculator_quote_otps ORDER BY created_at DESC LIMIT 50'],
      ['careers_list_slim', `SELECT id, name, email, phone, position, status, created_at, resume_name, resume_url
        FROM career_enquiries ORDER BY created_at DESC LIMIT 50`],
      ['careers_list_with_bytea', 'SELECT id, name, email, position, status, created_at, length(resume_data) AS resume_bytes FROM career_enquiries ORDER BY created_at DESC LIMIT 50'],
      ['cities_lite', 'SELECT id, name, is_active FROM managed_cities WHERE is_active = TRUE ORDER BY sort_order ASC, name ASC'],
      ['franchises_no_hash', `SELECT id, name, email, phone, city, model, status, created_at FROM franchises ORDER BY created_at DESC LIMIT 200`],
    ];

    for (const [name, sql] of queries) {
      const samples = [];
      let rows = 0;
      let bytes = 0;
      for (let i = 0; i < 3; i += 1) {
        const start = Date.now();
        const res = await pool.query(sql);
        samples.push(Date.now() - start);
        rows = res.rows.length;
        bytes = Buffer.byteLength(JSON.stringify(res.rows), 'utf8');
      }
      const avg = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
      console.log(JSON.stringify({ name, rows, bytes, ms_samples: samples, ms_avg: avg }));
    }

    try {
      const slim = await pool.query(
        `SELECT id, name, position, status, created_at, resume_name, resume_url, cover_letter
         FROM career_enquiries ORDER BY created_at DESC LIMIT 50`
      );
      const heavy = await pool.query(
        `SELECT id, name, position, status, created_at, resume_name, resume_url, cover_letter, resume_data
         FROM career_enquiries ORDER BY created_at DESC LIMIT 50`
      );
      const total = await pool.query(
        `SELECT COALESCE(SUM(octet_length(resume_data)), 0)::bigint AS bytes FROM career_enquiries`
      );
      console.log(JSON.stringify({
        name: 'careers_payload_compare',
        slim_bytes: Buffer.byteLength(JSON.stringify(slim.rows), 'utf8'),
        with_bytea_bytes: Buffer.byteLength(JSON.stringify(heavy.rows), 'utf8'),
        total_resume_bytea: Number(total.rows[0].bytes || 0),
      }));
    } catch (error) {
      console.log('careers_payload_compare_skip', error.message);
    }
  } catch (error) {
    console.log('DB_MEASURE_SKIP', error.message);
  } finally {
    await pool.end().catch(() => {});
  }
}

main();
