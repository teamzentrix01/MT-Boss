import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';

function hasAdminRole(req) {
  return Boolean(requireRole(req, 'admin'));
}

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT * FROM blogs WHERE slug = $1 LIMIT 1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }

    // Increment view count in the background
    pool.query(`UPDATE blogs SET views_count = views_count + 1 WHERE slug = $1`, [slug]).catch((err) => {
      console.error('Failed to increment blog views:', err);
    });

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('GET /api/blogs/[slug] error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    if (!hasAdminRole(req)) {
      return unauthorized();
    }

    const { slug } = await params;
    const body = await req.json();

    const existing = await pool.query(`SELECT id FROM blogs WHERE slug = $1`, [slug]);
    if (existing.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }

    const updates = [];
    const values = [];

    const allowedFields = [
      'title', 'slug', 'excerpt', 'content', 'cover_image', 'category',
      'tags', 'author_name', 'read_time', 'meta_title', 'meta_description',
      'meta_keywords', 'is_published'
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        values.push(body[field]);
        updates.push(`${field} = $${values.length}`);
      }
    });

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    values.push(slug);
    const query = `UPDATE blogs SET ${updates.join(', ')}, updated_at = NOW() WHERE slug = $${values.length} RETURNING *`;
    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PATCH /api/blogs/[slug] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!hasAdminRole(req)) {
      return unauthorized();
    }

    const { slug } = await params;
    const result = await pool.query(`DELETE FROM blogs WHERE slug = $1 RETURNING id`, [slug]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/blogs/[slug] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete blog' }, { status: 500 });
  }
}
