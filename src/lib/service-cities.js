import pool from './db';
import { createInitializationGuard } from './api-utils';
import { ensureCitiesSchema, getManagedCities, resolveManagedCity } from './cities';

export const ensureServiceCitiesSchema = createInitializationGuard(async () => {
  await ensureCitiesSchema();
  await pool.query(`
    ALTER TABLE quick_services
    ADD COLUMN IF NOT EXISTS cities TEXT[] NOT NULL DEFAULT '{}'
  `);

  // Preserve existing vendor/service coverage when the cities column is first
  // introduced. Once an admin configures cities, that explicit list remains
  // authoritative because only empty arrays are backfilled.
  await pool.query(`
    UPDATE quick_services qs
       SET cities = coverage.cities
      FROM (
        SELECT
          vs.quick_service_id,
          ARRAY_AGG(DISTINCT INITCAP(TRIM(v.city)) ORDER BY INITCAP(TRIM(v.city))) AS cities
        FROM vendor_services vs
        JOIN vendors v ON v.id = vs.vendor_id
        WHERE vs.is_active = TRUE
          AND NULLIF(TRIM(v.city), '') IS NOT NULL
        GROUP BY vs.quick_service_id
      ) coverage
     WHERE qs.id = coverage.quick_service_id
       AND CARDINALITY(COALESCE(qs.cities, '{}')) = 0
  `);
});

export function cleanCity(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

export function cityMatches(left, right) {
  return cleanCity(left).toLocaleLowerCase('en-IN') === cleanCity(right).toLocaleLowerCase('en-IN');
}

export function normalizeCityList(cities) {
  const normalized = new Map();
  for (const value of Array.isArray(cities) ? cities : []) {
    const city = cleanCity(value);
    if (city) normalized.set(city.toLocaleLowerCase('en-IN'), city);
  }
  return [...normalized.values()];
}

export async function getServiceCities(serviceId) {
  await ensureServiceCitiesSchema();
  if (serviceId) {
    const service = await pool.query(
      `SELECT 1 FROM quick_services
        WHERE id = $1 AND COALESCE(is_service_active, TRUE) = TRUE`,
      [serviceId]
    );
    if (!service.rows.length) return [];
  }
  return (await getManagedCities()).map((city) => city.name);
}

export async function getCityServiceCoverage() {
  await ensureServiceCitiesSchema();
  const [result, managedCities] = await Promise.all([
    pool.query(
      `SELECT id, label, icon, base_price, duration
         FROM quick_services
        WHERE COALESCE(is_service_active, TRUE) = TRUE
        ORDER BY label ASC`
    ),
    getManagedCities(),
  ]);
  const activeCities = managedCities.map((city) => city.name);

  const services = result.rows.map((service) => ({
    ...service,
    cities: activeCities,
  }));
  const cityMap = new Map();
  for (const service of services) {
    for (const city of service.cities) {
      const key = cleanCity(city).toLocaleLowerCase('en-IN');
      const current = cityMap.get(key) || { city, service_ids: [], services: [] };
      current.service_ids.push(service.id);
      current.services.push(service.label);
      cityMap.set(key, current);
    }
  }

  return {
    cities: [...cityMap.values()].map((item) => item.city).sort((a, b) => a.localeCompare(b)),
    mapping: [...cityMap.values()].sort((a, b) => a.city.localeCompare(b.city)),
    services,
  };
}

export async function resolveServiceCity(serviceId, city) {
  await ensureServiceCitiesSchema();
  const canonicalCity = await resolveManagedCity(city);
  if (!serviceId || !canonicalCity) return null;
  const service = await pool.query(
    `SELECT 1 FROM quick_services
      WHERE id = $1 AND COALESCE(is_service_active, TRUE) = TRUE`,
    [serviceId]
  );
  return service.rows.length ? canonicalCity : null;
}

export async function addServiceCity(serviceId, city) {
  await ensureServiceCitiesSchema();
  const requestedCity = await resolveManagedCity(city);
  if (!serviceId || !requestedCity) return null;

  const result = await pool.query(
    `UPDATE quick_services
        SET cities = CASE
          WHEN EXISTS (
            SELECT 1 FROM UNNEST(COALESCE(cities, '{}')) configured_city
            WHERE LOWER(TRIM(configured_city)) = LOWER(TRIM($2))
          ) THEN cities
          ELSE ARRAY_APPEND(COALESCE(cities, '{}'), $2)
        END
      WHERE id = $1
      RETURNING $2::TEXT AS city`,
    [serviceId, requestedCity]
  );
  return result.rows[0]?.city || null;
}

export async function resolveConfiguredCity(city) {
  return resolveManagedCity(city);
}

export async function hasVendorForServiceCity(serviceId, city) {
  const canonicalCity = await resolveServiceCity(serviceId, city);
  if (!canonicalCity) return false;

  const result = await pool.query(
    `SELECT 1
     FROM vendors v
     JOIN vendor_services vs
       ON vs.vendor_id = v.id
      AND vs.quick_service_id = $1
      AND vs.is_active = TRUE
     WHERE LOWER(TRIM(v.city)) = LOWER(TRIM($2))
       AND v.is_approved = TRUE
       AND LOWER(COALESCE(v.status, 'active')) IN ('active', 'approved')
       AND COALESCE(v.verification_status, 'verified') IN ('verified', 'approved')
     LIMIT 1`,
    [serviceId, canonicalCity]
  );
  return result.rows.length > 0;
}
