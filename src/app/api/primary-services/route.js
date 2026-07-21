import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard, handleApiError, isDatabaseConnectionError } from '@/lib/api-utils';
import { fallbackPrimaryServices, fallbackResponse } from '@/lib/public-fallbacks';
import { normalizeCityList } from '@/lib/service-cities';

const ensurePrimaryServiceCities = createInitializationGuard(async () => {
  await pool.query(`ALTER TABLE primary_services ADD COLUMN IF NOT EXISTS cities TEXT[] NOT NULL DEFAULT '{}'`);
});

// GET — public, no auth. Supports ?slug=xyz for single record.
export async function GET(req) {
  try {
    await ensurePrimaryServiceCities();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const result = await pool.query(
        `SELECT * FROM primary_services WHERE slug = $1`,
        [slug]
      );
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: result.rows[0] });
    }

    // Order by sort_order if the column exists, fall back to id
    let result;
    try {
      result = await pool.query(
        `SELECT * FROM primary_services ORDER BY COALESCE(sort_order, 0) ASC, id ASC`
      );
    } catch {
      result = await pool.query(`SELECT * FROM primary_services ORDER BY id ASC`);
    }
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET primary-services error:', error.message);
    if (isDatabaseConnectionError(error)) {
      const { searchParams } = new URL(req.url);
      const slug = searchParams.get('slug');
      if (slug) {
        const service = fallbackPrimaryServices.find((item) => item.slug.toLowerCase() === slug.toLowerCase());
        if (!service) {
          return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
        return NextResponse.json(fallbackResponse(service));
      }
      return NextResponse.json(fallbackResponse(fallbackPrimaryServices));
    }
    return handleApiError(error);
  }
}

// POST - Create
export async function POST(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensurePrimaryServiceCities();

    const {
      slug, title, description, image,
      hero_subtitle, about_heading, about_body,
      stat1_value, stat1_label, stat2_value, stat2_label,
      stat3_value, stat3_label, stat4_value, stat4_label,
      process, benefits, projects,
      cta_heading, contact_phone, contact_email, cities,
    } = await req.json();

    const normalizedCities = normalizeCityList(cities);
    if (!slug || !title || !description || !image || normalizedCities.length === 0) {
      return NextResponse.json({ error: 'Slug, title, description, image and at least one city are required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO primary_services (
        slug, title, description, image,
        hero_subtitle, about_heading, about_body,
        stat1_value, stat1_label, stat2_value, stat2_label,
        stat3_value, stat3_label, stat4_value, stat4_label,
        process, benefits, projects,
        cta_heading, contact_phone, contact_email, cities
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
      RETURNING *`,
      [
        slug, title, description, image,
        hero_subtitle || null, about_heading || null, about_body || null,
        stat1_value || null, stat1_label || null,
        stat2_value || null, stat2_label || null,
        stat3_value || null, stat3_label || null,
        stat4_value || null, stat4_label || null,
        JSON.stringify(process || []),
        JSON.stringify(benefits || []),
        JSON.stringify(projects || []),
        cta_heading || null, contact_phone || null, contact_email || null, normalizedCities,
      ]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating primary service:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT - Update
export async function PUT(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensurePrimaryServiceCities();

    const {
      id, slug, title, description, image,
      hero_subtitle, about_heading, about_body,
      stat1_value, stat1_label, stat2_value, stat2_label,
      stat3_value, stat3_label, stat4_value, stat4_label,
      process, benefits, projects,
      cta_heading, contact_phone, contact_email, cities,
    } = await req.json();

    const normalizedCities = normalizeCityList(cities);
    if (!id || !slug || !title || !description || !image || normalizedCities.length === 0) {
      return NextResponse.json({ error: 'ID, slug, title, description, image and at least one city are required' }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE primary_services SET
        slug=$1, title=$2, description=$3, image=$4,
        hero_subtitle=$5, about_heading=$6, about_body=$7,
        stat1_value=$8, stat1_label=$9,
        stat2_value=$10, stat2_label=$11,
        stat3_value=$12, stat3_label=$13,
        stat4_value=$14, stat4_label=$15,
        process=$16, benefits=$17, projects=$18,
        cta_heading=$19, contact_phone=$20, contact_email=$21, cities=$22,
        updated_at=NOW()
       WHERE id=$23 RETURNING *`,
      [
        slug, title, description, image,
        hero_subtitle || null, about_heading || null, about_body || null,
        stat1_value || null, stat1_label || null,
        stat2_value || null, stat2_label || null,
        stat3_value || null, stat3_label || null,
        stat4_value || null, stat4_label || null,
        JSON.stringify(process || []),
        JSON.stringify(benefits || []),
        JSON.stringify(projects || []),
        cta_heading || null, contact_phone || null, contact_email || null, normalizedCities,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating primary service:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH - Bulk reorder primary services
export async function PATCH(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { items } = await req.json(); // [{ id, sort_order }, ...]
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array required' }, { status: 400 });
    }

    // Ensure sort_order column exists (safe to run repeatedly)
    await pool.query(
      `ALTER TABLE primary_services ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0`
    );

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const { id, sort_order } of items) {
        await client.query(
          `UPDATE primary_services SET sort_order = $1 WHERE id = $2`,
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
    console.error('Error reordering primary services:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });

    const result = await pool.query(
      `DELETE FROM primary_services WHERE id=$1 RETURNING id`, [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    console.error('Error deleting primary service:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
