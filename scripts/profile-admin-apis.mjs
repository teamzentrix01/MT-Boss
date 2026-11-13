/**
 * Application-level timing for slow admin APIs (excludes Next.js compile).
 * Usage: node scripts/profile-admin-apis.mjs
 * Optional HTTP: PROFILE_BASE_URL=http://127.0.0.1:3000 node scripts/profile-admin-apis.mjs
 */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import { normalizePostgresUrl } from '../src/lib/pg-url.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(root, '.env.local'), override: false, quiet: true });
dotenv.config({ path: path.join(root, '.env'), override: false, quiet: true });
dotenv.config({ path: path.join(root, 'src', '.env'), override: false, quiet: true });

const databaseUrl = process.env.DATABASE_URL?.trim();
const cleanDatabaseUrl = normalizePostgresUrl(databaseUrl);
const pool = new pg.Pool({
  connectionString: cleanDatabaseUrl,
  ...(process.env.DB_PASSWORD?.trim() ? { password: process.env.DB_PASSWORD } : {}),
  ssl: { rejectUnauthorized: false },
  max: 4,
  connectionTimeoutMillis: 12000,
  idleTimeoutMillis: 30000,
});

function ms(start) {
  return Math.round(performance.now() - start);
}

async function time(label, fn) {
  const t0 = performance.now();
  await fn();
  const elapsed = ms(t0);
  console.log(`  ${label}: ${elapsed}ms`);
  return elapsed;
}

async function measureSql() {
  console.log('\n=== SQL path timings (warm connection) ===\n');
  await pool.query('SELECT 1');

  console.log('1) product-approvals count_only');
  await time('COUNT pending approvals', () =>
    pool.query(`
      SELECT COUNT(*)::int AS count
      FROM supplier_materials m
      WHERE (m.vendor_id IS NOT NULL OR (m.supplier_id IS NOT NULL AND m.supplier_id > 0))
        AND COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'pending'
    `)
  );

  console.log('\n2) vendors counts=1 (query only vs unguarded DDL)');
  const vendorCount = await time('NEW: COUNT vendors pending only', () =>
    pool.query(`SELECT COUNT(*)::INT AS total FROM vendors v WHERE COALESCE(v.verification_status, 'pending') = 'pending'`)
  );
  const vendorDdl = await time('OLD: 6 ALTER TABLE every request', async () => {
    await pool.query(`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS pan_number VARCHAR(20)`);
    await pool.query(`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS pan_image BYTEA`);
    await pool.query(`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS pan_image_mime VARCHAR(100)`);
    await pool.query(`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS gst_number VARCHAR(30)`);
    await pool.query(`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS gst_image BYTEA`);
    await pool.query(`ALTER TABLE vendors ADD COLUMN IF NOT EXISTS gst_image_mime VARCHAR(100)`);
  });

  console.log('\n3) suppliers counts=1');
  await time('NEW: COUNT suppliers pending only', () =>
    pool.query(`SELECT COUNT(*)::INT AS total FROM suppliers s WHERE s.status = 'pending'`)
  );
  await time('OLD: CREATE payu_payment_intents IF NOT EXISTS', () =>
    pool.query(`
      CREATE TABLE IF NOT EXISTS payu_payment_intents (
        id BIGSERIAL PRIMARY KEY,
        txnid TEXT NOT NULL UNIQUE,
        purpose TEXT NOT NULL,
        entity_id INTEGER NOT NULL,
        package_id TEXT,
        amount NUMERIC(12,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING',
        gateway_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ
      )
    `)
  );

  console.log('\n4) properties status_counts vs list+count');
  await time('NEW: status_counts FILTER', () =>
    pool.query(`
      SELECT
        COUNT(*)::INT AS all,
        COUNT(*) FILTER (WHERE status = 'pending')::INT AS pending
      FROM properties
    `)
  );
  await time('OLD: COUNT + SELECT limit 1', async () => {
    await pool.query(`SELECT COUNT(*)::INT AS total FROM properties WHERE status = 'pending'`);
    await pool.query(`
      SELECT id, title, status FROM properties
      WHERE status = 'pending'
      ORDER BY created_at DESC, id DESC
      LIMIT 1 OFFSET 0
    `);
  });

  console.log('\n5) lead-management lite');
  const oldLead = await time('OLD lite: COUNT + 7 JOINs limit 100', async () => {
    await pool.query(`SELECT COUNT(*)::INT AS total FROM agent_leads l`);
    await pool.query(`
      SELECT l.id, a.name AS agent_name, f.name AS franchise_name, v.shop_name AS vendor_name
      FROM agent_leads l
      LEFT JOIN agents a ON a.id = l.agent_id
      LEFT JOIN franchises f ON f.id = l.assigned_franchise_id
      LEFT JOIN vendors v ON v.id = l.assigned_vendor_id
      LEFT JOIN pm_projects pm ON (pm.id = l.converted_project_id OR pm.source_lead_id = l.id)
      LEFT JOIN projects op ON (op.source_lead_id = l.id AND op.project_kind = 'operational')
      LEFT JOIN primary_service_enquiries pse ON (l.source_ref_table = 'primary_service_enquiries' AND pse.id = l.source_ref_id)
      LEFT JOIN service_bookings sb ON (l.source_ref_table = 'service_bookings' AND sb.id = l.source_ref_id)
      ORDER BY l.created_at DESC, l.id DESC
      LIMIT 100 OFFSET 0
    `);
  });
  const newLead = await time('NEW lite: slim SELECT limit 30 (no COUNT)', () =>
    pool.query(`
      SELECT l.id, l.client_name, l.service_type, l.lead_source, l.status, l.lead_stage, l.created_at, l.updated_at
      FROM agent_leads l
      ORDER BY l.created_at DESC, l.id DESC
      LIMIT 30 OFFSET 0
    `)
  );

  console.log('\n6) orders type=shop_order (shop-only vs UNION ALL)');
  const shopOnly = await time('NEW: shop-only CTE + summary + page', async () => {
    await pool.query(`
      WITH unified AS (
        SELECT me.id, COALESCE(me.order_reference, 'MO-' || me.id) AS order_id,
               'shop_order' AS type, LOWER(COALESCE(me.status, 'open')) AS status,
               CAST(COALESCE(me.grand_total, me.product_total, 0) AS NUMERIC) AS grand_total,
               me.created_at
        FROM material_enquiries me
      )
      SELECT COUNT(*)::INT AS total_orders, COALESCE(SUM(grand_total), 0)::NUMERIC AS total_revenue
      FROM unified
    `);
    await pool.query(`
      WITH unified AS (
        SELECT me.id, COALESCE(me.order_reference, 'MO-' || me.id) AS order_id,
               'shop_order' AS type, LOWER(COALESCE(me.status, 'open')) AS status,
               CAST(COALESCE(me.grand_total, me.product_total, 0) AS NUMERIC) AS grand_total,
               me.created_at
        FROM material_enquiries me
      )
      SELECT * FROM unified ORDER BY created_at DESC, id DESC LIMIT 25 OFFSET 0
    `);
  });
  const unionAll = await time('OLD: shop UNION ALL service + summary + page', async () => {
    await pool.query(`
      WITH unified AS (
        SELECT me.id, 'shop_order' AS type, LOWER(COALESCE(me.status, 'open')) AS status,
               CAST(COALESCE(me.grand_total, 0) AS NUMERIC) AS grand_total, me.created_at
        FROM material_enquiries me
        UNION ALL
        SELECT sb.id, 'service_booking' AS type, LOWER(COALESCE(sb.status, 'pending')) AS status,
               CAST(COALESCE(sb.total_amount, 0) AS NUMERIC) AS grand_total, sb.created_at
        FROM service_bookings sb
      )
      SELECT COUNT(*)::INT AS total_orders FROM unified WHERE type = 'shop_order'
    `);
    await pool.query(`
      WITH unified AS (
        SELECT me.id, 'shop_order' AS type, LOWER(COALESCE(me.status, 'open')) AS status,
               CAST(COALESCE(me.grand_total, 0) AS NUMERIC) AS grand_total, me.created_at
        FROM material_enquiries me
        UNION ALL
        SELECT sb.id, 'service_booking' AS type, LOWER(COALESCE(sb.status, 'pending')) AS status,
               CAST(COALESCE(sb.total_amount, 0) AS NUMERIC) AS grand_total, sb.created_at
        FROM service_bookings sb
      )
      SELECT * FROM unified WHERE type = 'shop_order'
      ORDER BY created_at DESC, id DESC LIMIT 25 OFFSET 0
    `);
  });

  console.log('\n7) EXPLAIN product-approvals pending count (no index added — seq scan preferred on small table)');
  const explain = await pool.query(`
    EXPLAIN (FORMAT TEXT)
    SELECT COUNT(*)::int AS count
    FROM supplier_materials m
    WHERE (m.vendor_id IS NOT NULL OR (m.supplier_id IS NOT NULL AND m.supplier_id > 0))
      AND COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'pending'
  `);
  for (const row of explain.rows) console.log('  ', Object.values(row)[0]);

  console.log('\n=== SQL before/after deltas (this run) ===');
  console.log(`  vendors: OLD DDL ${vendorDdl}ms → NEW count ${vendorCount}ms`);
  console.log(`  leads:   OLD ${oldLead}ms → NEW ${newLead}ms`);
  console.log(`  orders:  OLD union ${unionAll}ms → NEW shop-only ${shopOnly}ms`);
}

async function measureHttp() {
  const base = process.env.PROFILE_BASE_URL || 'http://127.0.0.1:3000';
  const secret = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || 'development-only-change-me';
  const token = jwt.sign(
    { id: 1, email: process.env.ADMIN_EMAIL || 'admin@mtboss.com', role: 'admin' },
    secret,
    { expiresIn: '1h' }
  );

  console.log(`\n=== HTTP timings against ${base} ===\n`);

  const routes = [
    '/api/admin/product-approvals?count_only=true',
    '/api/admin/orders?type=shop_order&limit=25',
    '/api/admin/vendors?status=pending&counts=1',
    '/api/properties?status_counts=1',
    '/api/admin/lead-management?lite=1&limit=30',
    '/api/admin/users?page=1&pageSize=25&skip_meta=1',
    '/api/admin/suppliers?status=pending&counts=1',
  ];

  async function hit(url) {
    const t0 = performance.now();
    try {
      const res = await fetch(`${base}${url}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      await res.text();
      return { status: res.status, ms: ms(t0) };
    } catch (err) {
      return { status: 0, ms: ms(t0), error: err.message };
    }
  }

  const probe = await hit('/api/admin/vendors?status=pending&counts=1');
  if (probe.error || probe.status === 0) {
    console.log(`  Server not reachable (${probe.error || 'no response'}). Skipping HTTP measurements.`);
    return;
  }

  console.log('First pass:');
  for (const route of routes) {
    const r = await hit(route);
    console.log(`  ${String(r.ms).padStart(6)}ms  ${r.status}  ${route}`);
  }
  console.log('\nWarm second pass:');
  for (const route of routes) {
    const r = await hit(route);
    console.log(`  ${String(r.ms).padStart(6)}ms  ${r.status}  ${route}`);
  }
}

try {
  await measureSql();
  await measureHttp();
} catch (err) {
  console.error('Profile failed:', err);
  process.exitCode = 1;
} finally {
  await pool.end().catch(() => {});
}
