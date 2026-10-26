import dotenv from 'dotenv';
import pg from 'pg';
import { DEFAULT_BLOGS } from '../src/lib/blog-defaults.mjs';

dotenv.config({ path: 'src/.env' });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seedBlogs() {
  console.log('Ensuring blogs table exists...');
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

  for (const blog of DEFAULT_BLOGS) {
    await pool.query(
      `INSERT INTO blogs (
        slug, title, excerpt, content, cover_image, category, tags,
        author_name, read_time, meta_title, meta_description, meta_keywords,
        is_published, views_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        cover_image = EXCLUDED.cover_image,
        category = EXCLUDED.category,
        tags = EXCLUDED.tags,
        author_name = EXCLUDED.author_name,
        read_time = EXCLUDED.read_time,
        meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description,
        meta_keywords = EXCLUDED.meta_keywords,
        is_published = EXCLUDED.is_published`,
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
    console.log(`Seeded / updated blog: ${blog.title}`);
  }

  const res = await pool.query('SELECT COUNT(*)::int AS count FROM blogs');
  console.log(`Total blogs in database: ${res.rows[0].count}`);
  await pool.end();
}

seedBlogs().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
