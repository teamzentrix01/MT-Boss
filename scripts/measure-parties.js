/* eslint-disable no-console */
require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 8000,
  });
  try {
    const listSql = `
      WITH filtered AS (
        SELECT p.id, p.name, p.phone, p.email, p.gst_no, p.address, p.created_at,
               COUNT(*) OVER()::int AS total_count
          FROM pm_parties p
         WHERE $1 = ''
            OR p.name ILIKE '%' || $1 || '%'
            OR COALESCE(p.phone,'') ILIKE '%' || $1 || '%'
            OR COALESCE(p.email,'') ILIKE '%' || $1 || '%'
         ORDER BY p.created_at DESC
         LIMIT $2 OFFSET $3
      ),
      totals AS (
        SELECT pr.party_id,
               COUNT(*)::int AS project_count,
               COALESCE(SUM(pr.contract_value), 0) AS total_contract_value,
               COALESCE(SUM(pay.received), 0) AS total_received
          FROM pm_projects pr
          JOIN filtered f ON f.id = pr.party_id
          LEFT JOIN LATERAL (
            SELECT COALESCE(SUM(amount), 0) AS received
              FROM pm_party_payments
             WHERE project_id = pr.id AND NOT is_deleted
          ) pay ON TRUE
         GROUP BY pr.party_id
      )
      SELECT f.*,
             COALESCE(t.project_count, 0) AS project_count,
             COALESCE(t.total_contract_value, 0) AS total_contract_value,
             COALESCE(t.total_received, 0) AS total_received,
             COALESCE(t.total_contract_value, 0) - COALESCE(t.total_received, 0) AS total_pending
        FROM filtered f
        LEFT JOIN totals t ON t.party_id = f.id
       ORDER BY f.created_at DESC`;

    for (let i = 0; i < 3; i += 1) {
      const t0 = Date.now();
      const res = await pool.query(listSql, ['', 20, 0]);
      console.log('LIST', { i, ms: Date.now() - t0, rows: res.rows.length });
    }

    const t1 = Date.now();
    const check = await pool.query(`
      SELECT
        to_regclass('public.pm_parties') IS NOT NULL AS has_parties,
        to_regclass('public.pm_labor_payments') IS NOT NULL AS has_labor_payments,
        EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'pm_projects' AND column_name = 'source_lead_id'
        ) AS has_source_lead
    `);
    console.log('FAST_CHECK', { ms: Date.now() - t1, ...check.rows[0] });

    // Approximate cost of sequential IF NOT EXISTS checks (what cold start does)
    const stmts = [
      `SELECT to_regclass('public.pm_parties')`,
      `SELECT to_regclass('public.pm_projects')`,
      `SELECT to_regclass('public.pm_party_payments')`,
      `SELECT to_regclass('public.pm_labor')`,
      `SELECT to_regclass('public.pm_labor_payments')`,
    ];
    const t2 = Date.now();
    for (const sql of stmts) await pool.query(sql);
    console.log('FIVE_ROUNDTRIPS_MS', Date.now() - t2);
  } catch (error) {
    console.error('ERR', error.message);
  } finally {
    await pool.end();
  }
}

main();
