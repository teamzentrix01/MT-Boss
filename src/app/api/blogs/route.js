import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';
import { DEFAULT_BLOGS } from '@/lib/blog-defaults.mjs';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ensureBlogsTable = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      category VARCHAR(100) DEFAULT 'Construction Guide',
      tags TEXT[] DEFAULT ARRAY[]::TEXT[],
      author_name VARCHAR(150) DEFAULT 'MTBOSS Editorial',
      read_time VARCHAR(50) DEFAULT '5 min read',
      meta_title VARCHAR(255),
      meta_description TEXT,
      meta_keywords TEXT,
      is_published BOOLEAN DEFAULT true,
      views_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const count = await pool.query('SELECT COUNT(*)::int AS total FROM blogs');
  if (count.rows[0]?.total > 0) return;

  for (const blog of DEFAULT_BLOGS) {
    await pool.query(
      `INSERT INTO blogs (
        slug, title, excerpt, content, cover_image, category, tags,
        author_name, read_time, meta_title, meta_description, meta_keywords,
        is_published, views_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (slug) DO NOTHING`,
      [
        blog.slug,
        blog.title,
        blog.excerpt,
        blog.content,
        blog.cover_image,
        blog.category,
        blog.tags || [],
        blog.author_name,
        blog.read_time,
        blog.meta_title || blog.title,
        blog.meta_description || blog.excerpt,
        blog.meta_keywords || '',
        blog.is_published ?? true,
        blog.views_count || 0,
      ]
    );
  }
});

function hasAdminRole(req) {
  return Boolean(requireRole(req, 'admin'));
}

export async function GET(req) {
  try {
    await ensureBlogsTable();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const all = searchParams.get('all') === '1';

    let query = 'SELECT * FROM blogs';
    const params = [];
    const conditions = [];

    if (!all) {
      conditions.push('is_published = true');
    } else if (!hasAdminRole(req)) {
      conditions.push('is_published = true');
    }

    if (category && category !== 'All') {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      conditions.push(`(LOWER(title) LIKE $${params.length} OR LOWER(excerpt) LIKE $${params.length} OR LOWER(content) LIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET /api/blogs error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!hasAdminRole(req)) {
      return unauthorized();
    }

    await ensureBlogsTable();
    const body = await req.json();

    const title = String(body.title || '').trim();
    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const content = String(body.content || '').trim();
    if (!content) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    const slug = slugify(body.slug || title);
    const excerpt = body.excerpt ? String(body.excerpt).trim() : title;
    const cover_image = body.cover_image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80';
    const category = body.category || 'Construction Guide';
    const tags = Array.isArray(body.tags) ? body.tags : (body.tags ? String(body.tags).split(',').map((t) => t.trim()) : []);
    const author_name = body.author_name || 'MTBOSS Editorial';
    const read_time = body.read_time || '5 min read';
    const meta_title = body.meta_title || title;
    const meta_description = body.meta_description || excerpt;
    const meta_keywords = body.meta_keywords || '';
    const is_published = body.is_published ?? true;

    const result = await pool.query(
      `INSERT INTO blogs (
        slug, title, excerpt, content, cover_image, category, tags,
        author_name, read_time, meta_title, meta_description, meta_keywords,
        is_published, views_count, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 0, NOW(), NOW())
      RETURNING *`,
      [
        slug, title, excerpt, content, cover_image, category, tags,
        author_name, read_time, meta_title, meta_description, meta_keywords,
        is_published
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('POST /api/blogs error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: 'An article with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 });
  }
}
