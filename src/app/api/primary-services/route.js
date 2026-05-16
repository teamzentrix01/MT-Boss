import pool from '@/lib/db';
import { NextResponse } from 'next/server';

// GET — public, no auth. Supports ?slug=xyz for single record.
export async function GET(req) {
  try {
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

    const result = await pool.query(
      `SELECT * FROM primary_services ORDER BY id ASC`
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching primary services:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Create
export async function POST(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      slug, title, description, image,
      hero_subtitle, about_heading, about_body,
      stat1_value, stat1_label, stat2_value, stat2_label,
      stat3_value, stat3_label, stat4_value, stat4_label,
      process, benefits, projects,
      cta_heading, contact_phone, contact_email,
    } = await req.json();

    if (!slug || !title || !description || !image) {
      return NextResponse.json({ error: 'slug, title, description and image are required' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO primary_services (
        slug, title, description, image,
        hero_subtitle, about_heading, about_body,
        stat1_value, stat1_label, stat2_value, stat2_label,
        stat3_value, stat3_label, stat4_value, stat4_label,
        process, benefits, projects,
        cta_heading, contact_phone, contact_email
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
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
        cta_heading || null, contact_phone || null, contact_email || null,
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
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      id, slug, title, description, image,
      hero_subtitle, about_heading, about_body,
      stat1_value, stat1_label, stat2_value, stat2_label,
      stat3_value, stat3_label, stat4_value, stat4_label,
      process, benefits, projects,
      cta_heading, contact_phone, contact_email,
    } = await req.json();

    if (!id || !slug || !title || !description || !image) {
      return NextResponse.json({ error: 'id, slug, title, description and image are required' }, { status: 400 });
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
        cta_heading=$19, contact_phone=$20, contact_email=$21,
        updated_at=NOW()
       WHERE id=$22 RETURNING *`,
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
        cta_heading || null, contact_phone || null, contact_email || null,
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

// DELETE
export async function DELETE(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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