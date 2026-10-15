import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';
import {
  calculateShipping,
  DEFAULT_QUANTITY_SHIPPING_RULES,
  validateQuantityRules,
  sameCity,
} from '@/lib/shipping-calc';

export {
  calculateShipping,
  DEFAULT_QUANTITY_SHIPPING_RULES,
  validateQuantityRules,
  sameCity,
};

export const ensureShippingSchema = createInitializationGuard(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS shipping_core_city_rates (
    city_name VARCHAR(100) PRIMARY KEY, fixed_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE, updated_at TIMESTAMP DEFAULT NOW()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS shipping_distance_rule (
    id SMALLINT PRIMARY KEY CHECK (id = 1), rate_per_km NUMERIC(10,2) NOT NULL DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE, updated_at TIMESTAMP DEFAULT NOW()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS shipping_free_rule (
    id SMALLINT PRIMARY KEY CHECK (id = 1), min_order_value NUMERIC(12,2) NOT NULL DEFAULT 50000,
    applicable_only_to_same_city BOOLEAN NOT NULL DEFAULT TRUE, is_active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT NOW()
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS shipping_city_distances (
    from_city VARCHAR(100) NOT NULL, to_city VARCHAR(100) NOT NULL, distance_km NUMERIC(10,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE, updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (from_city, to_city), CHECK (LOWER(from_city) <> LOWER(to_city))
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS pm_settings (
    key VARCHAR(100) PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await pool.query(`INSERT INTO shipping_core_city_rates (city_name, fixed_cost) VALUES
    ('Moradabad', 0), ('Bareilly', 0) ON CONFLICT (city_name) DO NOTHING`);
  await pool.query(`INSERT INTO shipping_distance_rule (id, rate_per_km) VALUES (1, 10) ON CONFLICT (id) DO NOTHING`);
  await pool.query(`INSERT INTO shipping_free_rule (id, min_order_value, applicable_only_to_same_city) VALUES (1, 50000, TRUE) ON CONFLICT (id) DO NOTHING`);
});

export async function getShippingSettings() {
  await ensureShippingSchema();
  const [core, distance, free, routes, qtyRulesRes] = await Promise.all([
    pool.query('SELECT city_name, fixed_cost, is_active FROM shipping_core_city_rates ORDER BY city_name'),
    pool.query('SELECT rate_per_km, is_active FROM shipping_distance_rule WHERE id=1'),
    pool.query('SELECT min_order_value, applicable_only_to_same_city, is_active FROM shipping_free_rule WHERE id=1'),
    pool.query('SELECT from_city, to_city, distance_km, is_active FROM shipping_city_distances ORDER BY from_city, to_city'),
    pool.query("SELECT value FROM pm_settings WHERE key = 'quantity_shipping_rules' LIMIT 1").catch(() => ({ rows: [] })),
  ]);

  let quantityRules = null;
  const rawQty = qtyRulesRes?.rows?.[0]?.value;
  if (rawQty) {
    try {
      quantityRules = JSON.parse(rawQty);
    } catch {
      quantityRules = null;
    }
  }

  // If no saved data, seed defaults in-memory only (persisted when admin saves)
  if (!quantityRules || !Array.isArray(quantityRules.categories)) {
    quantityRules = DEFAULT_QUANTITY_SHIPPING_RULES;
  }

  return {
    coreCities: core.rows,
    distanceRule: distance.rows[0],
    freeRule: free.rows[0],
    distances: routes.rows,
    quantityRules,
  };
}
