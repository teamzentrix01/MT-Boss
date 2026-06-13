import pool from '@/lib/db';

// Package definitions
export const PACKAGES = [
  { id: 'pkg_6m', name: '6 Months', duration_months: 6, price: 2999, label: '6 Month Plan' },
  { id: 'pkg_1y', name: '1 Year', duration_months: 12, price: 4999, label: '1 Year Plan' },
  { id: 'pkg_2y', name: '2 Years', duration_months: 24, price: 7999, label: '2 Year Plan' },
];

export async function ensurePackageSchema() {
  // Add package columns to vendors table
  const vendorAlters = [
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

  // Add package columns to suppliers table
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
}

export function getPackageById(packageId) {
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
  if (!row.package_expires_at) return false;
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
