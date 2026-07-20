import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard, handleApiError, isDatabaseConnectionError } from '@/lib/api-utils';
import { fallbackQuickServices, fallbackResponse } from '@/lib/public-fallbacks';
import { ensureServiceCitiesSchema, normalizeCityList } from '@/lib/service-cities';

const ensureQuickServiceSeoColumns = createInitializationGuard(async () => {
  await ensureServiceCitiesSchema();
  try {
    await pool.query(`
      ALTER TABLE quick_services
        ALTER COLUMN icon TYPE TEXT,
        ALTER COLUMN label TYPE TEXT,
        ALTER COLUMN description TYPE TEXT,
        ALTER COLUMN duration TYPE TEXT,
        ADD COLUMN IF NOT EXISTS slug TEXT,
        ADD COLUMN IF NOT EXISTS video_url TEXT,
        ADD COLUMN IF NOT EXISTS seo_title TEXT,
        ADD COLUMN IF NOT EXISTS seo_description TEXT,
        ADD COLUMN IF NOT EXISTS coverage_details TEXT,
        ADD COLUMN IF NOT EXISTS how_to_use TEXT,
        ADD COLUMN IF NOT EXISTS cities TEXT[] NOT NULL DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS main_category VARCHAR(200),
        ADD COLUMN IF NOT EXISTS sub_category VARCHAR(200),
        ADD COLUMN IF NOT EXISTS visiting_price DECIMAL(10,2)
    `);

    await pool.query(`
      UPDATE quick_services
         SET slug = LOWER(REGEXP_REPLACE(TRIM(label), '[^a-zA-Z0-9]+', '-', 'g'))
       WHERE slug IS NULL OR TRIM(slug) = ''
    `);

    // Ensure all services have a flat base_price and visiting_price of 150
    await pool.query(`
      UPDATE quick_services
         SET base_price = 150.00,
             visiting_price = 150.00
       WHERE COALESCE(base_price, 0) != 150.00 OR COALESCE(visiting_price, 0) != 150.00
    `);
  } catch (error) {
    console.error('ensureQuickServiceSeoColumns error:', error.message);
    if (isDatabaseConnectionError(error)) {
      throw error;
    }
    // Don't throw for non-connection schema drift; the main query may still work.
  }
});

// GET all quick services — public, no auth required
export async function GET(req) {
  try {
    await ensureQuickServiceSeoColumns();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const result = await pool.query(
        `SELECT * FROM quick_services WHERE LOWER(slug) = LOWER($1) LIMIT 1`,
        [slug]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: result.rows[0] });
    }

    // Order by sort_order if the column exists, fall back to id
    let result;
    try {
      result = await pool.query(
        `SELECT * FROM quick_services ORDER BY COALESCE(sort_order, 0) ASC, id ASC`
      );
    } catch {
      result = await pool.query(`SELECT * FROM quick_services ORDER BY id ASC`);
    }
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET quick-services error:', error.message);
    if (isDatabaseConnectionError(error)) {
      const { searchParams } = new URL(req.url);
      const slug = searchParams.get('slug');
      if (slug) {
        const service = fallbackQuickServices.find((item) => item.slug.toLowerCase() === slug.toLowerCase());
        if (!service) {
          return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
        }
        return NextResponse.json(fallbackResponse(service));
      }
      return NextResponse.json(fallbackResponse(fallbackQuickServices));
    }
    return handleApiError(error);
  }
}

// POST - Create new quick service
export async function POST(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    await ensureQuickServiceSeoColumns();
    const {
      icon,
      label,
      desc,
      basePrice,
      duration,
      visiting_price,
      main_category,
      sub_category,
      slug,
      video_url,
      seo_title,
      seo_description,
      coverage_details,
      how_to_use,
      cities,
    } = await req.json();

    if (!icon || !label || !desc || !basePrice || !duration || !Array.isArray(cities) || cities.length === 0) {
      return NextResponse.json(
        { error: 'All fields and at least one city are required' },
        { status: 400 }
      );
    }
    const normalizedCities = normalizeCityList(cities);
    if (normalizedCities.length === 0) {
      return NextResponse.json({ error: 'At least one valid city is required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO quick_services (
        icon, label, description, base_price, duration, visiting_price,
        main_category, sub_category,
        slug, video_url, seo_title, seo_description, coverage_details, how_to_use, cities
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        icon,
        label,
        desc,
        parseFloat(basePrice),
        duration,
        parseFloat(visiting_price || 150),
        main_category || null,
        sub_category || null,
        slug || label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        video_url || null,
        seo_title || null,
        seo_description || null,
        coverage_details || null,
        how_to_use || null,
        normalizedCities,
      ]
    );

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating quick service:', error.message);
    return handleApiError(error);
  }
}

// PUT - Update quick service
export async function PUT(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    await ensureQuickServiceSeoColumns();
    const {
      id,
      icon,
      label,
      desc,
      basePrice,
      duration,
      visiting_price,
      main_category,
      sub_category,
      slug,
      video_url,
      seo_title,
      seo_description,
      coverage_details,
      how_to_use,
      cities,
    } = await req.json();

    if (!id || !icon || !label || !desc || !basePrice || !duration || !Array.isArray(cities) || cities.length === 0) {
      return NextResponse.json(
        { error: 'All fields and at least one city are required' },
        { status: 400 }
      );
    }
    const normalizedCities = normalizeCityList(cities);
    if (normalizedCities.length === 0) {
      return NextResponse.json({ error: 'At least one valid city is required' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE quick_services
       SET icon=$1, label=$2, description=$3, base_price=$4, duration=$5, visiting_price=$6,
           main_category=$7, sub_category=$8,
           slug=$9, video_url=$10, seo_title=$11, seo_description=$12,
           coverage_details=$13, how_to_use=$14, cities=$15
       WHERE id=$16
       RETURNING *`,
      [
        icon,
        label,
        desc,
        parseFloat(basePrice),
        duration,
        parseFloat(visiting_price || 150),
        main_category || null,
        sub_category || null,
        slug || label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        video_url || null,
        seo_title || null,
        seo_description || null,
        coverage_details || null,
        how_to_use || null,
        normalizedCities,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Removing a service city also removes that service from vendors operating
    // outside the remaining coverage, so stale assignments cannot receive jobs.
    await pool.query(
      `UPDATE vendor_services vs
          SET is_active = FALSE
         FROM vendors v
        WHERE vs.vendor_id = v.id
          AND vs.quick_service_id = $1
          AND vs.is_active = TRUE
          AND NOT EXISTS (
            SELECT 1 FROM UNNEST($2::text[]) configured_city
            WHERE LOWER(TRIM(configured_city)) = LOWER(TRIM(v.city))
          )`,
      [id, normalizedCities]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating quick service:', error.message);
    return handleApiError(error);
  }
}

// PATCH - Bulk reorder quick services
export async function PATCH(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { items } = await req.json(); // [{ id, sort_order }, ...]
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array required' }, { status: 400 });
    }

    // Ensure sort_order column exists (safe to run repeatedly)
    await pool.query(
      `ALTER TABLE quick_services ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0`
    );

    // Bulk update in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const { id, sort_order } of items) {
        await client.query(
          `UPDATE quick_services SET sort_order = $1 WHERE id = $2`,
          [sort_order, id]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering quick services:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE - Remove quick service
export async function DELETE(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      `DELETE FROM quick_services WHERE id=$1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting quick service:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
