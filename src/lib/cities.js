import pool from './db';
import { createInitializationGuard } from './api-utils';

export function cleanCityName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

const legacyCitySources = [
  ['agents', 'city'],
  ['franchises', 'city'],
  ['vendors', 'city'],
  ['suppliers', 'city'],
  ['office_locations', 'city'],
  ['free_time_slots', 'city'],
  ['paid_time_slot_availability', 'city'],
  ['professional_services', 'city'],
  ['properties', 'location'],
  ['jobs', 'location'],
];

const cascadeCityColumns = [
  ...legacyCitySources,
  ['agent_leads', 'city'],
  ['agent_schedule', 'city'],
  ['service_bookings', 'service_city'],
  ['material_enquiries', 'selected_city'],
  ['career_enquiries', 'job_location'],
];

export const ensureCitiesSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS managed_cities (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      state VARCHAR(120),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS managed_cities_name_unique
      ON managed_cities (LOWER(TRIM(name)))
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS managed_city_metadata (
      key TEXT PRIMARY KEY,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const importState = await pool.query(
    `SELECT 1 FROM managed_city_metadata WHERE key = 'legacy_city_import'`
  );
  if (!importState.rows.length) {
    // Import legacy values exactly once. A permanently deleted city must never
    // be recreated just because an old historical record still mentions it.
    for (const [table, column] of legacyCitySources) {
      const exists = await pool.query(
        `SELECT 1
           FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
        [table, column]
      );
      if (exists.rows.length === 0) continue;
      await pool.query(`
        INSERT INTO managed_cities (name)
        SELECT DISTINCT TRIM(${column}::text)
          FROM ${table}
         WHERE NULLIF(TRIM(${column}::text), '') IS NOT NULL
        ON CONFLICT DO NOTHING
      `);
    }

    const quickServiceCities = await pool.query(
      `SELECT 1
         FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'quick_services' AND column_name = 'cities'`
    );
    if (quickServiceCities.rows.length) {
      await pool.query(`
        INSERT INTO managed_cities (name)
        SELECT DISTINCT TRIM(city)
          FROM quick_services
          CROSS JOIN LATERAL UNNEST(COALESCE(cities, '{}')) city
         WHERE NULLIF(TRIM(city), '') IS NOT NULL
        ON CONFLICT DO NOTHING
      `);
    }
    await pool.query(
      `INSERT INTO managed_city_metadata (key) VALUES ('legacy_city_import') ON CONFLICT DO NOTHING`
    );
  }
});

export async function getManagedCities({ includeInactive = false } = {}) {
  await ensureCitiesSchema();
  const result = await pool.query(
    `SELECT id, name, state, is_active, sort_order, created_at, updated_at
       FROM managed_cities
      ${includeInactive ? '' : 'WHERE is_active = TRUE'}
      ORDER BY sort_order ASC, name ASC`
  );
  return result.rows;
}

export async function resolveManagedCity(value, { activeOnly = true } = {}) {
  const city = cleanCityName(value);
  if (!city) return null;
  await ensureCitiesSchema();
  const result = await pool.query(
    `SELECT name
       FROM managed_cities
      WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
        ${activeOnly ? 'AND is_active = TRUE' : ''}
      LIMIT 1`,
    [city]
  );
  return result.rows[0]?.name || null;
}

export async function normalizeManagedCityList(values) {
  const requested = [...new Map(
    (Array.isArray(values) ? values : [])
      .map(cleanCityName)
      .filter(Boolean)
      .map((city) => [city.toLocaleLowerCase('en-IN'), city])
  ).values()];
  if (!requested.length) return [];

  await ensureCitiesSchema();
  const result = await pool.query(
    `SELECT name
       FROM managed_cities
      WHERE is_active = TRUE
        AND LOWER(TRIM(name)) = ANY($1::text[])
      ORDER BY name`,
    [requested.map((city) => city.toLocaleLowerCase('en-IN'))]
  );
  return result.rows.map((row) => row.name);
}

export const managedCityColumns = cascadeCityColumns;
