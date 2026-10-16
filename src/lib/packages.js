import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';

// Package definitions (defaults and fallbacks)
export const PACKAGES = [
  { id: 'pkg_6m', name: '6 Months', duration_months: 6, price: 100, label: '6 Month Plan', description: 'Perfect for getting started. Complete booking access.', is_active: true, sort_order: 1, target_role: 'all' },
  { id: 'pkg_1y', name: '1 Year', duration_months: 12, price: 4999, label: '1 Year Plan', description: 'Most popular. Great value with a full year of leads.', is_active: true, sort_order: 2, target_role: 'all' },
  { id: 'pkg_2y', name: '2 Years', duration_months: 24, price: 7999, label: '2 Year Plan', description: 'Best deal. Long-term peace of mind and maximum savings.', is_active: true, sort_order: 3, target_role: 'all' },
];

export const ensurePackageSchema = createInitializationGuard(async () => {
  // 1. Subscription packages master table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscription_packages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      duration_months INTEGER NOT NULL DEFAULT 6,
      price NUMERIC NOT NULL DEFAULT 0,
      label TEXT NOT NULL,
      description TEXT DEFAULT '',
      is_active BOOLEAN DEFAULT TRUE,
      sort_order INTEGER DEFAULT 0,
      target_role TEXT DEFAULT 'all',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Column alters in case table existed previously without some columns
  const pkgTableAlters = [
    `ALTER TABLE subscription_packages ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`,
    `ALTER TABLE subscription_packages ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`,
    `ALTER TABLE subscription_packages ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0`,
    `ALTER TABLE subscription_packages ADD COLUMN IF NOT EXISTS target_role TEXT DEFAULT 'all'`,
    `ALTER TABLE subscription_packages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`,
    `ALTER TABLE subscription_packages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`,
  ];
  for (const sql of pkgTableAlters) {
    try { await pool.query(sql); } catch (_) {}
  }

  // Seed default packages if empty
  try {
    const countRes = await pool.query(`SELECT COUNT(*)::int AS cnt FROM subscription_packages`);
    if ((countRes.rows[0]?.cnt || 0) === 0) {
      for (const p of PACKAGES) {
        await pool.query(
          `INSERT INTO subscription_packages (id, name, duration_months, price, label, description, is_active, sort_order, target_role)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO NOTHING`,
          [p.id, p.name, p.duration_months, p.price, p.label, p.description, p.is_active, p.sort_order, p.target_role]
        );
      }
    }
  } catch (seedErr) {
    console.warn('Subscription packages seed notice:', seedErr.message);
  }

  // 2. Add package columns to vendors table
  const vendorAlters = [
    `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS vendor_name TEXT`,
    `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS package_id TEXT`,
    `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS package_name TEXT`,
    `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS package_price NUMERIC DEFAULT 0`,
    `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS package_duration_months INTEGER DEFAULT 0`,
    `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS package_purchased_at TIMESTAMPTZ`,
    `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS package_starts_at TIMESTAMPTZ`,
    `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS package_expires_at TIMESTAMPTZ`,
    `ALTER TABLE vendors ADD COLUMN IF NOT EXISTS package_status TEXT DEFAULT 'none'`,
  ];

  for (const sql of vendorAlters) {
    try { await pool.query(sql); } catch (_) { /* column might already exist */ }
  }

  // 3. Add package columns to suppliers table
  const supplierAlters = [
    `ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS package_id TEXT`,
    `ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS package_name TEXT`,
    `ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS package_price NUMERIC DEFAULT 0`,
    `ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS package_duration_months INTEGER DEFAULT 0`,
    `ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS package_purchased_at TIMESTAMPTZ`,
    `ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS package_starts_at TIMESTAMPTZ`,
    `ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS package_expires_at TIMESTAMPTZ`,
    `ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS package_status TEXT DEFAULT 'none'`,
  ];

  for (const sql of supplierAlters) {
    try { await pool.query(sql); } catch (_) { /* column might already exist */ }
  }
});

export async function getPackages({ role = 'all', includeInactive = false } = {}) {
  try {
    await ensurePackageSchema();
    let query = `SELECT * FROM subscription_packages WHERE 1=1`;
    const params = [];

    if (!includeInactive) {
      query += ` AND is_active = TRUE`;
    }

    if (role && role !== 'all') {
      params.push(role);
      query += ` AND (target_role = 'all' OR target_role = $${params.length})`;
    }

    query += ` ORDER BY sort_order ASC, price ASC, duration_months ASC`;
    const result = await pool.query(query, params);

    if (result.rows.length > 0) {
      return result.rows.map(r => ({
        id: r.id,
        name: r.name,
        duration_months: Number(r.duration_months),
        price: Number(r.price),
        label: r.label,
        description: r.description || '',
        is_active: r.is_active,
        sort_order: Number(r.sort_order || 0),
        target_role: r.target_role || 'all',
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    }
  } catch (err) {
    console.error('Error fetching subscription_packages:', err);
  }

  // Fallback to static PACKAGES
  return PACKAGES.filter(p => {
    if (!includeInactive && p.is_active === false) return false;
    if (role && role !== 'all' && p.target_role && p.target_role !== 'all' && p.target_role !== role) return false;
    return true;
  });
}

export async function getPackageById(packageId) {
  if (!packageId) return null;
  try {
    await ensurePackageSchema();
    const result = await pool.query(
      `SELECT * FROM subscription_packages WHERE id = $1 LIMIT 1`,
      [packageId]
    );
    if (result.rows.length > 0) {
      const r = result.rows[0];
      return {
        id: r.id,
        name: r.name,
        duration_months: Number(r.duration_months),
        price: Number(r.price),
        label: r.label,
        description: r.description || '',
        is_active: r.is_active,
        sort_order: Number(r.sort_order || 0),
        target_role: r.target_role || 'all',
      };
    }
  } catch (err) {
    console.error('Error fetching package by ID from DB:', err);
  }
  return PACKAGES.find(p => p.id === packageId) || null;
}

export function calculateExpiry(startDate, durationMonths) {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + durationMonths);
  return d;
}

export function isPackageActive(row) {
  if (!row.package_status || row.package_status === 'none') return false;
  if (row.package_status !== 'active') return false;
  if (!row.package_expires_at) return true;
  return new Date(row.package_expires_at) > new Date();
}

export function getPackageInfo(row) {
  return {
    package_id: row.package_id || null,
    package_name: row.package_name || null,
    package_price: Number(row.package_price || 0),
    package_duration_months: row.package_duration_months || 0,
    package_purchased_at: row.package_purchased_at || null,
    package_starts_at: row.package_starts_at || null,
    package_expires_at: row.package_expires_at || null,
    package_status: row.package_status || 'none',
    is_active: isPackageActive(row),
    days_remaining: row.package_expires_at
      ? Math.max(0, Math.ceil((new Date(row.package_expires_at) - new Date()) / (1000 * 60 * 60 * 24)))
      : 0,
  };
}

