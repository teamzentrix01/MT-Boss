import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import {
  cleanCityName,
  ensureCitiesSchema,
  getManagedCities,
  managedCityColumns,
} from '@/lib/cities';
import { handleApiError } from '@/lib/api-utils';

function cityPayload(body) {
  return {
    name: cleanCityName(body.name),
    state: cleanCityName(body.state) || null,
    isActive: body.is_active !== false,
    sortOrder: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
  };
}

async function deactivateCityReferences(city) {
  const queries = [
    [`UPDATE quick_services SET cities = ARRAY(
        SELECT value FROM UNNEST(COALESCE(cities, '{}')) value
        WHERE LOWER(TRIM(value)) <> LOWER(TRIM($1))
      )`, [city]],
    [`UPDATE shop_categories SET city_prices = COALESCE((
        SELECT JSONB_OBJECT_AGG(entry.key, entry.value)
        FROM JSONB_EACH(COALESCE(city_prices, '{}'::jsonb)) entry
        WHERE LOWER(TRIM(entry.key)) <> LOWER(TRIM($1))
      ), '{}'::jsonb)`, [city]],
    [`UPDATE calculator_products
         SET city_prices = COALESCE((
               SELECT JSONB_OBJECT_AGG(entry.key, entry.value)
               FROM JSONB_EACH(COALESCE(city_prices, '{}'::jsonb)) entry
               WHERE LOWER(TRIM(entry.key)) <> LOWER(TRIM($1))
             ), '{}'::jsonb),
             price_matrix = COALESCE((
               SELECT JSONB_OBJECT_AGG(package_entry.key, COALESCE((
                 SELECT JSONB_OBJECT_AGG(city_entry.key, city_entry.value)
                 FROM JSONB_EACH(package_entry.value) city_entry
                 WHERE LOWER(TRIM(city_entry.key)) <> LOWER(TRIM($1))
               ), '{}'::jsonb))
               FROM JSONB_EACH(COALESCE(price_matrix, '{}'::jsonb)) package_entry
             ), '{}'::jsonb),
             available_cities = ARRAY(
               SELECT value FROM UNNEST(COALESCE(available_cities, '{}')) value
               WHERE LOWER(TRIM(value)) <> LOWER(TRIM($1))
             )`, [city]],
    [`UPDATE jobs SET status = 'draft', updated_at = NOW()
      WHERE LOWER(TRIM(location)) = LOWER(TRIM($1))`, [city]],
    [`UPDATE properties SET status = 'rejected', updated_at = NOW()
      WHERE LOWER(TRIM(location)) = LOWER(TRIM($1))`, [city]],
    [`UPDATE office_locations SET is_active = FALSE, updated_at = NOW()
      WHERE LOWER(TRIM(city)) = LOWER(TRIM($1))`, [city]],
    [`UPDATE free_time_slots SET is_available = FALSE
      WHERE LOWER(TRIM(city)) = LOWER(TRIM($1))`, [city]],
    [`UPDATE paid_time_slot_availability SET is_available = FALSE, updated_at = NOW()
      WHERE LOWER(TRIM(city)) = LOWER(TRIM($1))`, [city]],
  ];
  for (const [sql, params] of queries) {
    try { await pool.query(sql, params); } catch { /* optional legacy table/column */ }
  }
}

async function activateCityForQuickServices(city) {
  try {
    await pool.query(
      `UPDATE quick_services
          SET cities = CASE
            WHEN EXISTS (
              SELECT 1 FROM UNNEST(COALESCE(cities, '{}')) value
              WHERE LOWER(TRIM(value)) = LOWER(TRIM($1))
            ) THEN cities
            ELSE ARRAY_APPEND(COALESCE(cities, '{}'), $1)
          END`,
      [city]
    );
  } catch { /* quick services may not exist on a fresh database yet */ }
}

export async function GET(req) {
  try {
    const includeInactive = new URL(req.url).searchParams.get('all') === '1';
    if (includeInactive && !requireRole(req, 'admin')) return unauthorized();
    const data = await getManagedCities({ includeInactive });
    return NextResponse.json({
      success: true,
      data,
      cities: data.filter((city) => city.is_active).map((city) => city.name),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureCitiesSchema();
    const { name, state, isActive, sortOrder } = cityPayload(await req.json());
    if (!name) {
      return NextResponse.json({ success: false, error: 'City name is required' }, { status: 400 });
    }
    const result = await pool.query(
      `INSERT INTO managed_cities (name, state, is_active, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, state, isActive, sortOrder]
    );
    if (isActive) await activateCityForQuickServices(name);
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    if (error?.code === '23505') {
      return NextResponse.json({ success: false, error: 'This city already exists' }, { status: 409 });
    }
    return handleApiError(error);
  }
}

export async function PATCH(req) {
  let client;
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureCitiesSchema();
    const body = await req.json();
    const id = Number(body.id);
    const { name, state, isActive, sortOrder } = cityPayload(body);
    if (!id || !name) {
      return NextResponse.json({ success: false, error: 'City id and name are required' }, { status: 400 });
    }

    client = await pool.connect();
    await client.query('BEGIN');
    const current = await client.query('SELECT * FROM managed_cities WHERE id = $1 FOR UPDATE', [id]);
    if (!current.rows.length) {
      await client.query('ROLLBACK');
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    const oldName = current.rows[0].name;
    const updated = await client.query(
      `UPDATE managed_cities
          SET name = $1, state = $2, is_active = $3, sort_order = $4, updated_at = NOW()
        WHERE id = $5
        RETURNING *`,
      [name, state, isActive, sortOrder, id]
    );

    if (oldName.toLocaleLowerCase('en-IN') !== name.toLocaleLowerCase('en-IN')) {
      for (const [table, column] of managedCityColumns) {
        const exists = await client.query(
          `SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
          [table, column]
        );
        if (exists.rows.length) {
          await client.query(
            `UPDATE ${table} SET ${column} = $1 WHERE LOWER(TRIM(${column}::text)) = LOWER(TRIM($2))`,
            [name, oldName]
          );
        }
      }
      await client.query(`
        UPDATE quick_services
           SET cities = ARRAY(
             SELECT CASE WHEN LOWER(TRIM(city)) = LOWER(TRIM($1)) THEN $2 ELSE city END
               FROM UNNEST(COALESCE(cities, '{}')) city
           )
      `, [oldName, name]).catch(() => {});
      await client.query(`
        UPDATE shop_categories
           SET city_prices = COALESCE((
             SELECT JSONB_OBJECT_AGG(
               CASE WHEN LOWER(TRIM(entry.key)) = LOWER(TRIM($1)) THEN $2 ELSE entry.key END,
               entry.value
             )
             FROM JSONB_EACH(COALESCE(city_prices, '{}'::jsonb)) entry
           ), '{}'::jsonb)
      `, [oldName, name]).catch(() => {});
      await client.query(`
        UPDATE calculator_products
           SET city_prices = COALESCE((
                 SELECT JSONB_OBJECT_AGG(
                   CASE WHEN LOWER(TRIM(entry.key)) = LOWER(TRIM($1)) THEN $2 ELSE entry.key END,
                   entry.value
                 )
                 FROM JSONB_EACH(COALESCE(city_prices, '{}'::jsonb)) entry
               ), '{}'::jsonb),
               price_matrix = COALESCE((
                 SELECT JSONB_OBJECT_AGG(package_entry.key, COALESCE((
                   SELECT JSONB_OBJECT_AGG(
                     CASE WHEN LOWER(TRIM(city_entry.key)) = LOWER(TRIM($1)) THEN $2 ELSE city_entry.key END,
                     city_entry.value
                   )
                   FROM JSONB_EACH(package_entry.value) city_entry
                 ), '{}'::jsonb))
                 FROM JSONB_EACH(COALESCE(price_matrix, '{}'::jsonb)) package_entry
               ), '{}'::jsonb),
               available_cities = ARRAY(
                 SELECT CASE WHEN LOWER(TRIM(city)) = LOWER(TRIM($1)) THEN $2 ELSE city END
                 FROM UNNEST(COALESCE(available_cities, '{}')) city
               )
      `, [oldName, name]).catch(() => {});
    }
    await client.query('COMMIT');
    if (!isActive) await deactivateCityReferences(name);
    else await activateCityForQuickServices(name);
    return NextResponse.json({ success: true, data: updated.rows[0] });
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    if (error?.code === '23505') {
      return NextResponse.json({ success: false, error: 'This city already exists' }, { status: 409 });
    }
    return handleApiError(error);
  } finally {
    client?.release();
  }
}

export async function DELETE(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureCitiesSchema();
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ success: false, error: 'City id is required' }, { status: 400 });
    }
    const result = await pool.query(
      `DELETE FROM managed_cities WHERE id = $1 RETURNING *`,
      [id]
    );
    if (!result.rows.length) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }
    const city = result.rows[0].name;
    await deactivateCityReferences(city);
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: `${city} was permanently deleted`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
