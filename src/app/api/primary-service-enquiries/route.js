import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ||
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  'team.zentrix01@gmail.com';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS primary_service_enquiries (
      id SERIAL PRIMARY KEY,
      service_slug VARCHAR(255),
      service_title VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      message TEXT,
      property_image_name VARCHAR(255),
      property_image_url TEXT,
      property_image_names JSONB,
      property_image_urls JSONB,
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE primary_service_enquiries
    ADD COLUMN IF NOT EXISTS property_image_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS property_image_url TEXT,
    ADD COLUMN IF NOT EXISTS property_image_names JSONB,
    ADD COLUMN IF NOT EXISTS property_image_urls JSONB
  `);
}

async function savePropertyImage(file) {
  if (!file || file.size === 0) return null;

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid image type. Only JPG, PNG, and WEBP are allowed.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image too large. Max 5MB.');
  }

  const extMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  };
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName || `property.${extMap[file.type]}`}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'primary-service-properties');

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  await writeFile(join(uploadDir, filename), Buffer.from(bytes));

  return `/uploads/primary-service-properties/${filename}`;
}

async function savePropertyImages(files) {
  if (!files || files.length === 0) return { names: [], urls: [] };

  if (files.length > 10) {
    throw new Error('You can upload a maximum of 10 property images.');
  }

  const urls = [];
  const names = [];

  for (const file of files) {
    const url = await savePropertyImage(file);
    if (url) {
      urls.push(url);
      names.push(file.name);
    }
  }

  return { names, urls };
}

async function sendAdminNotification(enquiry) {
  try {
    await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        Service: enquiry.service_title,
        'Service Slug': enquiry.service_slug || 'Not Provided',
        'Full Name': enquiry.name,
        Phone: enquiry.phone,
        Email: enquiry.email || 'Not Provided',
        'Project Details': enquiry.message || 'Not Provided',
        'Property Images': Array.isArray(enquiry.property_image_urls) && enquiry.property_image_urls.length > 0
          ? enquiry.property_image_urls.map(url => `${process.env.NEXT_PUBLIC_APP_URL || ''}${url}`).join(', ')
          : 'Not Uploaded',
        _subject: `New Primary Services Enquiry - ${enquiry.service_title} - ${enquiry.name}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });
  } catch (error) {
    console.warn('Primary services enquiry email failed:', error);
  }
}

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let body;
    let propertyImages = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      propertyImages = formData
        .getAll('property_images')
        .filter(file => file && typeof file === 'object' && file.size > 0);

      const legacyImage = formData.get('property_image');
      if (legacyImage && typeof legacyImage === 'object' && legacyImage.size > 0) {
        propertyImages.push(legacyImage);
      }

      body = Object.fromEntries(formData.entries());
    } else {
      body = await req.json();
    }

    const { service_slug, service_title, name, phone, email, message, property_image_name } = body;

    if (!service_title || !name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Service, name, and phone are required' },
        { status: 400 }
      );
    }

    await ensureTable();
    const propertyImageData = await savePropertyImages(propertyImages);

    const result = await pool.query(
      `INSERT INTO primary_service_enquiries
        (service_slug, service_title, name, phone, email, message, property_image_name, property_image_url, property_image_names, property_image_urls, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10::jsonb, $11, NOW())
       RETURNING id, service_slug, service_title, name, phone, email, message, property_image_name, property_image_url, property_image_names, property_image_urls, status, created_at`,
      [
        service_slug || null,
        service_title,
        name,
        phone,
        email || null,
        message || null,
        propertyImageData.names[0] || property_image_name || null,
        propertyImageData.urls[0] || null,
        JSON.stringify(propertyImageData.names),
        JSON.stringify(propertyImageData.urls),
        'New',
      ]
    );

    const enquiry = result.rows[0];
    await sendAdminNotification(enquiry);

    return NextResponse.json(
      {
        success: true,
        message: 'Your enquiry has been sent successfully!',
        data: enquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Primary services enquiry error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureTable();

    const result = await pool.query(
      `SELECT id, service_slug, service_title, name, phone, email, message, property_image_name, property_image_url, property_image_names, property_image_urls, status, created_at
       FROM primary_service_enquiries
       ORDER BY created_at DESC
       LIMIT 100`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching primary services enquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
