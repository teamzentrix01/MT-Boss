import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard, handleApiError, isDatabaseConnectionError } from '@/lib/api-utils';
import { fallbackQuickServices, fallbackResponse } from '@/lib/public-fallbacks';
import { ensureServiceCitiesSchema, normalizeCityList } from '@/lib/service-cities';
import { normalizeManagedCityList } from '@/lib/cities';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
const QUICK_SERVICE_DURATION = '15 mins';

function jsonWithoutCache(body, init = {}) {
  const response = NextResponse.json(body, init);
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  return response;
}

const ensureQuickServiceSeoColumns = createInitializationGuard(async () => {
  await ensureServiceCitiesSchema();
  try {
    await pool.query(`
      ALTER TABLE quick_services
        ALTER COLUMN icon TYPE TEXT,
        ALTER COLUMN label TYPE TEXT,
        ALTER COLUMN description TYPE TEXT,
        ALTER COLUMN duration TYPE TEXT,
        ADD COLUMN IF NOT EXISTS icon_type VARCHAR(20) DEFAULT 'image',
        ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT '',
        ADD COLUMN IF NOT EXISTS icon_url TEXT DEFAULT '',
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

    // Backfill icon_url and icon_type for legacy rows
    await pool.query(`
      UPDATE quick_services
         SET icon_type = CASE WHEN icon_type IS NULL OR icon_type = '' THEN 'image' ELSE icon_type END,
             icon_url = CASE WHEN (icon_url IS NULL OR icon_url = '') AND icon ~* '^(https?://|data:image/|blob:)' THEN icon ELSE COALESCE(icon_url, '') END,
             icon_name = COALESCE(icon_name, '')
    `);

    await pool.query(`
      UPDATE quick_services
         SET slug = LOWER(REGEXP_REPLACE(TRIM(label), '[^a-zA-Z0-9]+', '-', 'g'))
       WHERE slug IS NULL OR TRIM(slug) = ''
    `);

    await pool.query(
      `UPDATE quick_services SET duration = $1 WHERE duration IS DISTINCT FROM $1`,
      [QUICK_SERVICE_DURATION]
    );

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
  const { searchParams } = new URL(req.url);
  const adminView = searchParams.get('admin') === '1';
  if (adminView && !requireRole(req, 'admin')) return unauthorized();

  try {
    await ensureQuickServiceSeoColumns();
    const slug = searchParams.get('slug');

    if (slug) {
      const result = await pool.query(
        `SELECT * FROM quick_services WHERE LOWER(slug) = LOWER($1) LIMIT 1`,
        [slug]
      );
      if (result.rows.length === 0) {
        return jsonWithoutCache({ success: false, error: 'Service not found' }, { status: 404 });
      }
      return jsonWithoutCache({ success: true, data: result.rows[0] });
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
    return jsonWithoutCache({
      success: true,
      data: result.rows,
      total: result.rowCount,
    });
  } catch (error) {
    console.error('GET quick-services error:', error.message);
    if (isDatabaseConnectionError(error)) {
      if (adminView) {
        return jsonWithoutCache(
          { success: false, error: 'Quick services database is unavailable' },
          { status: 503 }
        );
      }
      const slug = searchParams.get('slug');
      if (slug) {
        const service = fallbackQuickServices.find((item) => item.slug.toLowerCase() === slug.toLowerCase());
        if (!service) {
          return jsonWithoutCache({ success: false, error: 'Service not found' }, { status: 404 });
        }
        return jsonWithoutCache(fallbackResponse(service));
      }
      const fallback = fallbackResponse(fallbackQuickServices);
      return jsonWithoutCache({ ...fallback, total: fallbackQuickServices.length });
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
      iconType: rawIconType,
      iconName: rawIconName,
      iconUrl: rawIconUrl,
      label,
      desc,
      basePrice,
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

    // Determine iconType, iconName, iconUrl
    let iconType = rawIconType;
    let iconName = rawIconName ? String(rawIconName).trim() : '';
    let iconUrl = rawIconUrl ? String(rawIconUrl).trim() : '';

    if (!iconType) {
      if (iconName) {
        iconType = 'lucide';
      } else {
        iconType = 'image';
        iconUrl = iconUrl || (icon ? String(icon).trim() : '');
      }
    }

    if (iconType === 'lucide') {
      if (!iconName) {
        return NextResponse.json({ error: 'Please select an icon or upload an image' }, { status: 400 });
      }
      iconUrl = ''; // Clear unused mode
    } else {
      iconType = 'image';
      iconUrl = iconUrl || (icon ? String(icon).trim() : '');
      if (!iconUrl) {
        return NextResponse.json({ error: 'Please select an icon or upload an image' }, { status: 400 });
      }
      iconName = ''; // Clear unused mode
    }

    const legacyIconValue = iconType === 'lucide' ? iconName : iconUrl;

    if (!label || !desc || !basePrice || !Array.isArray(cities) || cities.length === 0) {
      return NextResponse.json(
        { error: 'All fields and at least one city are required' },
        { status: 400 }
      );
    }
    const requestedCities = normalizeCityList(cities);
    const normalizedCities = await normalizeManagedCityList(requestedCities);
    if (normalizedCities.length !== requestedCities.length) {
      return NextResponse.json({ error: 'Select cities from City Management only' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO quick_services (
        icon, icon_type, icon_name, icon_url,
        label, description, base_price, duration, visiting_price,
        main_category, sub_category,
        slug, video_url, seo_title, seo_description, coverage_details, how_to_use, cities
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *`,
      [
        legacyIconValue,
        iconType,
        iconName,
        iconUrl,
        label,
        desc,
        parseFloat(basePrice),
        QUICK_SERVICE_DURATION,
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
      iconType: rawIconType,
      iconName: rawIconName,
      iconUrl: rawIconUrl,
      label,
      desc,
      basePrice,
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

    // Determine iconType, iconName, iconUrl
    let iconType = rawIconType;
    let iconName = rawIconName ? String(rawIconName).trim() : '';
    let iconUrl = rawIconUrl ? String(rawIconUrl).trim() : '';

    if (!iconType) {
      if (iconName) {
        iconType = 'lucide';
      } else {
        iconType = 'image';
        iconUrl = iconUrl || (icon ? String(icon).trim() : '');
      }
    }

    if (iconType === 'lucide') {
      if (!iconName) {
        return NextResponse.json({ error: 'Please select an icon or upload an image' }, { status: 400 });
      }
      iconUrl = ''; // Clear unused mode
    } else {
      iconType = 'image';
      iconUrl = iconUrl || (icon ? String(icon).trim() : '');
      if (!iconUrl) {
        return NextResponse.json({ error: 'Please select an icon or upload an image' }, { status: 400 });
      }
      iconName = ''; // Clear unused mode
    }

    const legacyIconValue = iconType === 'lucide' ? iconName : iconUrl;

    if (!id || !label || !desc || !basePrice || !Array.isArray(cities) || cities.length === 0) {
      return NextResponse.json(
        { error: 'All fields and at least one city are required' },
        { status: 400 }
      );
    }
    const requestedCities = normalizeCityList(cities);
    const normalizedCities = await normalizeManagedCityList(requestedCities);
    if (normalizedCities.length !== requestedCities.length) {
      return NextResponse.json({ error: 'Select cities from City Management only' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE quick_services
       SET icon=$1, icon_type=$2, icon_name=$3, icon_url=$4,
           label=$5, description=$6, base_price=$7, duration=$8, visiting_price=$9,
           main_category=$10, sub_category=$11,
           slug=$12, video_url=$13, seo_title=$14, seo_description=$15,
           coverage_details=$16, how_to_use=$17, cities=$18
       WHERE id=$19
       RETURNING *`,
      [
        legacyIconValue,
        iconType,
        iconName,
        iconUrl,
        label,
        desc,
        parseFloat(basePrice),
        QUICK_SERVICE_DURATION,
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
