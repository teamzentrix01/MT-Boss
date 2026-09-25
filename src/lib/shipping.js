import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';

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
  await pool.query(`INSERT INTO shipping_core_city_rates (city_name, fixed_cost) VALUES
    ('Moradabad', 0), ('Bareilly', 0) ON CONFLICT (city_name) DO NOTHING`);
  await pool.query(`INSERT INTO shipping_distance_rule (id, rate_per_km) VALUES (1, 10) ON CONFLICT (id) DO NOTHING`);
  await pool.query(`INSERT INTO shipping_free_rule (id, min_order_value, applicable_only_to_same_city) VALUES (1, 50000, TRUE) ON CONFLICT (id) DO NOTHING`);
});

export async function getShippingSettings() {
  await ensureShippingSchema();
  const [core, distance, free, routes] = await Promise.all([
    pool.query('SELECT city_name, fixed_cost, is_active FROM shipping_core_city_rates ORDER BY city_name'),
    pool.query('SELECT rate_per_km, is_active FROM shipping_distance_rule WHERE id=1'),
    pool.query('SELECT min_order_value, applicable_only_to_same_city, is_active FROM shipping_free_rule WHERE id=1'),
    pool.query('SELECT from_city, to_city, distance_km, is_active FROM shipping_city_distances ORDER BY from_city, to_city'),
  ]);
  return { coreCities: core.rows, distanceRule: distance.rows[0], freeRule: free.rows[0], distances: routes.rows };
}

const sameCity = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

export function calculateShipping({ groups, customerCity, settings }) {
  const coreByCity = new Map(settings.coreCities.filter((row) => row.is_active).map((row) => [row.city_name.trim().toLowerCase(), Number(row.fixed_cost)]));
  const routes = new Map(settings.distances.filter((row) => row.is_active).map((row) => [`${row.from_city.trim().toLowerCase()}|${row.to_city.trim().toLowerCase()}`, Number(row.distance_km)]));
  const distanceRule = settings.distanceRule;
  const freeRule = settings.freeRule;
  const breakdown = groups.map((group) => {
    const sourceCity = String(group.vendorCity || '').trim();
    const orderValue = Number(group.orderValue) || 0;
    const coreCost = coreByCity.get(sourceCity.toLowerCase());
    if (sameCity(sourceCity, customerCity) && coreCost !== undefined) {
      const free = freeRule?.is_active && (!freeRule.applicable_only_to_same_city || sameCity(sourceCity, customerCity)) && orderValue >= Number(freeRule.min_order_value);
      return { vendorCity: sourceCity, customerCity, orderValue, distanceKm: null, shippingCost: free ? 0 : coreCost,
        label: free ? `Shipping (${sourceCity}, same city): Free (order above ₹${Number(freeRule.min_order_value).toLocaleString('en-IN')})` : `Shipping (${sourceCity}, same city): ₹${coreCost.toLocaleString('en-IN')}` };
    }
    const key = `${sourceCity.toLowerCase()}|${String(customerCity).trim().toLowerCase()}`;
    const reverseKey = `${String(customerCity).trim().toLowerCase()}|${sourceCity.toLowerCase()}`;
    const distanceKm = routes.get(key) ?? routes.get(reverseKey);
    if (!sourceCity || distanceKm === undefined || !distanceRule?.is_active) return { vendorCity: sourceCity || 'Source city unavailable', customerCity, orderValue, distanceKm: null, shippingCost: null, label: `Shipping (${sourceCity || 'source city'} → ${customerCity}): distance needs configuration` };
    const free = freeRule?.is_active && !freeRule.applicable_only_to_same_city && orderValue >= Number(freeRule.min_order_value);
    const shippingCost = free ? 0 : Number(distanceKm) * Number(distanceRule.rate_per_km);
    return { vendorCity: sourceCity, customerCity, orderValue, distanceKm, shippingCost, label: free ? `Shipping (${sourceCity} → ${customerCity}, ${distanceKm}km): Free (order above ₹${Number(freeRule.min_order_value).toLocaleString('en-IN')})` : `Shipping (${sourceCity} → ${customerCity}, ${distanceKm}km): ₹${shippingCost.toLocaleString('en-IN')}` };
  });
  return { breakdown, totalShipping: breakdown.every((row) => row.shippingCost !== null) ? breakdown.reduce((sum, row) => sum + row.shippingCost, 0) : null };
}
