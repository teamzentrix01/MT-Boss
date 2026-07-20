import pool from './db';
import { createInitializationGuard } from './api-utils';

export const ensureServiceCitiesSchema = createInitializationGuard(async () => {
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
  const params = [];
  const serviceFilter = serviceId ? 'AND qs.id = $1' : '';
  if (serviceId) params.push(serviceId);

  const result = await pool.query(
    `SELECT MIN(TRIM(configured_city)) AS city
       FROM quick_services qs
       CROSS JOIN LATERAL UNNEST(COALESCE(qs.cities, '{}')) configured_city
      WHERE NULLIF(TRIM(configured_city), '') IS NOT NULL
        AND COALESCE(qs.is_service_active, TRUE) = TRUE
       ${serviceFilter}
      GROUP BY LOWER(TRIM(configured_city))
      ORDER BY MIN(TRIM(configured_city)) ASC`,
    params
  );
  return result.rows.map((row) => row.city);
}

export async function getCityServiceCoverage() {
  await ensureServiceCitiesSchema();
  const result = await pool.query(
    `SELECT qs.id, qs.label, qs.icon, qs.base_price, qs.duration,
            ARRAY_AGG(TRIM(configured_city) ORDER BY TRIM(configured_city)) AS cities
       FROM quick_services qs
       CROSS JOIN LATERAL UNNEST(COALESCE(qs.cities, '{}')) configured_city
      WHERE NULLIF(TRIM(configured_city), '') IS NOT NULL
        AND COALESCE(qs.is_service_active, TRUE) = TRUE
      GROUP BY qs.id, qs.label, qs.icon, qs.base_price, qs.duration
      ORDER BY qs.label ASC`
  );

  const services = result.rows.map((service) => ({
    ...service,
    cities: normalizeCityList(service.cities),
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
  const cleanRequestedCity = cleanCity(city);
  if (!serviceId || !cleanRequestedCity) return null;

  const result = await pool.query(
    `SELECT TRIM(configured_city) AS city
     FROM quick_services qs
     CROSS JOIN LATERAL UNNEST(COALESCE(qs.cities, '{}')) configured_city
     WHERE qs.id = $1
       AND LOWER(TRIM(configured_city)) = LOWER(TRIM($2))
       AND COALESCE(qs.is_service_active, TRUE) = TRUE
     LIMIT 1`,
    [serviceId, cleanRequestedCity]
  );
  return result.rows[0]?.city || null;
}

export async function resolveConfiguredCity(city) {
  await ensureServiceCitiesSchema();
  const requestedCity = cleanCity(city);
  if (!requestedCity) return null;
  const result = await pool.query(
    `SELECT MIN(TRIM(configured_city)) AS city
       FROM quick_services qs
       CROSS JOIN LATERAL UNNEST(COALESCE(qs.cities, '{}')) configured_city
      WHERE LOWER(TRIM(configured_city)) = LOWER(TRIM($1))
        AND COALESCE(qs.is_service_active, TRUE) = TRUE
      GROUP BY LOWER(TRIM(configured_city))
      LIMIT 1`,
    [requestedCity]
  );
  return result.rows[0]?.city || null;
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
