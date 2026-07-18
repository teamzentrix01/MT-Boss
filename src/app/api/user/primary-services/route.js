import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard } from '@/lib/api-utils';

export const runtime = 'nodejs';

function normalizeArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return value ? [value] : [];
    }
  }
  return [];
}

const ensureSchema = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS primary_service_enquiries (
      id SERIAL PRIMARY KEY,
      service_slug VARCHAR(255),
      service_title VARCHAR(255) NOT NULL,
      user_id INTEGER,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      alternate_phone VARCHAR(50),
      email VARCHAR(255),
      message TEXT,
      status VARCHAR(50) DEFAULT 'Site Visit',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const migrations = [
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS user_id INTEGER`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS property_image_name VARCHAR(255)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS property_image_url TEXT`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS property_image_names JSONB`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS property_image_urls JSONB`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS budget VARCHAR(150)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS carpet_area VARCHAR(100)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS time_slot VARCHAR(100)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS meeting_date DATE`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS gps_location VARCHAR(100)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS address TEXT`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS rating_stars INTEGER`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS review_text TEXT`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS site_image_names JSONB`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS site_image_urls JSONB`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`,
  ];
  for (const sql of migrations) {
    await pool.query(sql);
  }
});

async function saveSiteImage(file) {
  if (!file || file.size === 0) return null;

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG, or WEBP site photos are allowed.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Each site photo must be under 5MB.');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName || 'site-photo.jpg'}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'primary-service-reviews');

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  await writeFile(join(uploadDir, filename), Buffer.from(bytes));
  return `/uploads/primary-service-reviews/${filename}`;
}

async function saveSiteImages(files) {
  if (!files || files.length === 0) return { names: [], urls: [] };
  if (files.length > 10) throw new Error('You can upload a maximum of 10 site photos.');

  const names = [];
  const urls = [];
  for (const file of files) {
    const url = await saveSiteImage(file);
    if (url) {
      names.push(file.name);
      urls.push(url);
    }
  }
  return { names, urls };
}

export async function GET(req) {
  try {
    const user = requireRole(req, 'user');
    if (!user) return unauthorized();

    await ensureSchema();
    const userId = user.id && user.id !== 0 ? user.id : null;
    const userEmail = user.email || null;

    const result = await pool.query(
      `SELECT id, service_slug, service_title, name, phone, alternate_phone, email, message,
              budget, carpet_area, time_slot, meeting_date, gps_location, address,
              property_image_name, property_image_url, property_image_names, property_image_urls,
              rating_stars, review_text, site_image_names, site_image_urls, reviewed_at,
              status, created_at
       FROM primary_service_enquiries
       WHERE (
         ($1::INTEGER IS NOT NULL AND user_id = $1)
         OR ($2::TEXT IS NOT NULL AND LOWER(email) = LOWER($2))
       )
       ORDER BY created_at DESC`,
      [userId, userEmail]
    );

    const data = result.rows.map((row) => ({
      ...row,
      property_image_names: normalizeArray(row.property_image_names),
      property_image_urls: normalizeArray(row.property_image_urls),
      site_image_names: normalizeArray(row.site_image_names),
      site_image_urls: normalizeArray(row.site_image_urls),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('User primary services fetch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = requireRole(req, 'user');
    if (!user) return unauthorized();

    await ensureSchema();

    const formData = await req.formData();
    const enquiryId = Number(formData.get('enquiry_id'));
    const ratingStars = Number(formData.get('rating_stars'));
    const reviewText = String(formData.get('review_text') || '').trim();
    const sitePhotos = formData
      .getAll('site_photos')
      .filter(file => file && typeof file === 'object' && file.size > 0);

    if (!enquiryId) {
      return NextResponse.json({ success: false, error: 'Enquiry id is required' }, { status: 400 });
    }
    if (!ratingStars || ratingStars < 1 || ratingStars > 5) {
      return NextResponse.json({ success: false, error: 'Select a rating from 1 to 5 stars' }, { status: 400 });
    }

    const userId = user.id && user.id !== 0 ? user.id : null;
    const userEmail = user.email || null;

    const access = await pool.query(
      `SELECT id, status
       FROM primary_service_enquiries
       WHERE id = $1
         AND (
           ($2::INTEGER IS NOT NULL AND user_id = $2)
           OR ($3::TEXT IS NOT NULL AND LOWER(email) = LOWER($3))
         )`,
      [enquiryId, userId, userEmail]
    );

    if (access.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Primary service enquiry not found' }, { status: 404 });
    }
    if (access.rows[0].status !== 'Complete') {
      return NextResponse.json({ success: false, error: 'Review can be submitted after service completion only' }, { status: 409 });
    }

    const imageData = await saveSiteImages(sitePhotos);
    const result = await pool.query(
      `UPDATE primary_service_enquiries
       SET rating_stars = $1,
           review_text = $2,
           site_image_names = $3::jsonb,
           site_image_urls = $4::jsonb,
           reviewed_at = NOW()
       WHERE id = $5
       RETURNING id, rating_stars, review_text, site_image_names, site_image_urls, reviewed_at`,
      [
        ratingStars,
        reviewText || null,
        JSON.stringify(imageData.names),
        JSON.stringify(imageData.urls),
        enquiryId,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('User primary service review error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
