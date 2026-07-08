import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS hero_banners (
    id                   SERIAL PRIMARY KEY,
    label                VARCHAR(255) DEFAULT 'Engineering Excellence',
    title                VARCHAR(500) NOT NULL,
    subtitle             VARCHAR(500),
    description          TEXT,
    image_url            TEXT NOT NULL,
    cloudinary_public_id VARCHAR(255),
    sort_order           INTEGER DEFAULT 0,
    is_active            BOOLEAN DEFAULT true,
    created_at           TIMESTAMP DEFAULT NOW(),
    updated_at           TIMESTAMP DEFAULT NOW()
  )
`;

async function ensureTable() {
  try {
    await pool.query(CREATE_TABLE_SQL);
  } catch (error) {
    console.error('ensureTable error:', error);
    throw error;
  }
}

// Public — used by the home page Hero component
export async function GET() {
  try {
    await ensureTable();
    const result = await pool.query(
      `SELECT * FROM hero_banners WHERE is_active = true ORDER BY sort_order ASC, id ASC`
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET hero-banners error:', error.message);
    return handleApiError(error);
  }
}

export async function POST(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { label, title, subtitle, description, image_url, cloudinary_public_id, sort_order, is_active } = await req.json();
    if (!title || !image_url)
      return NextResponse.json({ success: false, error: 'Title and image are required' }, { status: 400 });

    await ensureTable();
    const result = await pool.query(
      `INSERT INTO hero_banners (label, title, subtitle, description, image_url, cloudinary_public_id, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        label || 'Engineering Excellence',
        title,
        subtitle || null,
        description || null,
        image_url,
        cloudinary_public_id || null,
        sort_order ?? 0,
        is_active ?? true,
      ]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST hero-banners error:', error.message);
    return handleApiError(error);
  }
}

export async function PATCH(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { id, label, title, subtitle, description, image_url, cloudinary_public_id, sort_order, is_active } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    await ensureTable();
    const result = await pool.query(
      `UPDATE hero_banners
       SET label=$1, title=$2, subtitle=$3, description=$4, image_url=$5,
           cloudinary_public_id=$6, sort_order=$7, is_active=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [
        label || 'Engineering Excellence',
        title,
        subtitle || null,
        description || null,
        image_url,
        cloudinary_public_id || null,
        sort_order ?? 0,
        is_active ?? true,
        id,
      ]
    );
    if (!result.rows.length)
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PATCH hero-banners error:', error.message);
    return handleApiError(error);
  }
}

export async function DELETE(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    await ensureTable();
    await pool.query(`DELETE FROM hero_banners WHERE id=$1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE hero-banners error:', error);
    return handleApiError(error);
  }
}
