import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized, verifyBearer } from '@/lib/auth';
import { ensureAgentSchema } from '@/lib/agent-auth';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { createInitializationGuard } from '@/lib/api-utils';

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ||
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  'mtboss2016@gmail.com';

export const runtime = 'nodejs';

const PRIMARY_SERVICE_STATUSES = ['Site Visit', 'Estimate', 'Planning', 'Work Start', 'Complete'];

function normalizeArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      // Plain legacy single value.
    }
    return value ? [value] : [];
  }
  return [];
}

const ensureTable = createInitializationGuard(async () => {
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
      property_image_name VARCHAR(255),
      property_image_url TEXT,
      property_image_names JSONB,
      property_image_urls JSONB,
      status VARCHAR(50) DEFAULT 'Site Visit',
      rating_stars INTEGER,
      review_text TEXT,
      site_image_names JSONB,
      site_image_urls JSONB,
      reviewed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const safeMigrations = [
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS property_image_name VARCHAR(255)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS property_image_url TEXT`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS property_image_names JSONB`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS property_image_urls JSONB`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS user_id INTEGER`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS alternate_phone VARCHAR(50)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS budget VARCHAR(150)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS carpet_area VARCHAR(100)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS time_slot VARCHAR(100)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS meeting_date DATE`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS gps_location VARCHAR(100)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS address TEXT`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS state VARCHAR(120)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS city VARCHAR(120)`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS rating_stars INTEGER`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS review_text TEXT`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS site_image_names JSONB`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS site_image_urls JSONB`,
    `ALTER TABLE primary_service_enquiries ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP`,
    `ALTER TABLE primary_service_enquiries ALTER COLUMN status SET DEFAULT 'Site Visit'`,
  ];
  for (const sql of safeMigrations) {
    try { await pool.query(sql); } catch { /* column already exists */ }
  }
});

async function syncEnquiryToLead(enquiry) {
  try {
    await ensureAgentSchema();
    try { await pool.query(`ALTER TABLE agent_leads ALTER COLUMN agent_id DROP NOT NULL`); } catch {}

    const alters = [
      `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS assigned_by_role VARCHAR(40) DEFAULT 'admin'`,
      `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS source_ref_table VARCHAR(80)`,
      `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS source_ref_id INTEGER`,
      `ALTER TABLE agent_leads ADD COLUMN IF NOT EXISTS priority VARCHAR(30) DEFAULT 'Normal'`,
    ];
    for (const sql of alters) await pool.query(sql);

    await pool.query(
      `INSERT INTO agent_leads
         (city, client_name, client_phone, client_email, service_type, lead_type, status,
          notes, client_requirement, lead_source, source_ref_table, source_ref_id, assigned_by_role)
       SELECT $1,$2,$3,$4,$5,'Primary Service','New',$6,$7,'primary-service','primary_service_enquiries',$8,'system'
       WHERE NOT EXISTS (
         SELECT 1 FROM agent_leads
         WHERE source_ref_table = 'primary_service_enquiries' AND source_ref_id = $8
       )`,
      [
        [enquiry.city, enquiry.state].filter(Boolean).join(', ') || enquiry.address || 'Unassigned',
        enquiry.name,
        enquiry.phone,
        enquiry.email || null,
        enquiry.service_title,
        enquiry.message || null,
        [enquiry.budget, enquiry.carpet_area ? `${enquiry.carpet_area} sqft` : null].filter(Boolean).join(' | ') || null,
        enquiry.id,
      ]
    );
  } catch (error) {
    console.warn('Primary service lead sync failed:', error.message);
  }
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

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error('Image upload configuration is missing. Please contact support.');
  }

  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('upload_preset', uploadPreset);
  uploadData.append('folder', 'mtboss/primary-service-properties');
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: uploadData,
  });
  const result = await response.json();
  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || 'Property image upload failed. Please try again.');
  }
  return result.secure_url;
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
        'Full Name': enquiry.name,
        'Main Phone': enquiry.phone,
        'Alternative Phone': enquiry.alternate_phone,
        Email: enquiry.email || 'Not Provided',
        Budget: enquiry.budget || 'Not Provided',
        'Carpet Area': enquiry.carpet_area ? `${enquiry.carpet_area} sqft` : 'Not Provided',
        'Preferred Time Slot': enquiry.time_slot || 'Not Provided',
        'Meeting Date': enquiry.meeting_date || 'Not Provided',
        'GPS Location': enquiry.gps_location || 'Not Provided',
        State: enquiry.state || 'Not Provided',
        City: enquiry.city || 'Not Provided',
        Address: enquiry.address || 'Not Provided',
        'Project Details': enquiry.message || 'Not Provided',
        'Property Images': Array.isArray(enquiry.property_image_urls) && enquiry.property_image_urls.length > 0
          ? enquiry.property_image_urls.map(url => `${process.env.NEXT_PUBLIC_APP_URL || ''}${url}`).join(', ')
          : 'Not Uploaded',
        _subject: `New Service Enquiry - ${enquiry.service_title} - ${enquiry.name}`,
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

    const {
      service_slug, service_title, name, phone, alternate_phone, email, message, property_image_name,
      budget, carpet_area, time_slot, meeting_date, gps_location, address, state, city,
    } = body;
    const cleanName = cleanText(name);
    const cleanEmail = email ? cleanText(email).toLowerCase() : null;
    const cleanPhone = normalizePhone(phone);
    const cleanAlternatePhone = normalizePhone(alternate_phone);
    const cleanState = cleanText(state);
    const cleanCity = cleanText(city);

    if (!service_title || !cleanName || !cleanPhone || !cleanState || !cleanCity || !cleanText(address)) {
      return NextResponse.json(
        { success: false, error: 'Service, name, main phone, state, city and full address are required' },
        { status: 400 }
      );
    }
    const contactError = validateContactFields({
      name: cleanName,
      email: cleanEmail || undefined,
      phone: cleanPhone,
      emailRequired: false,
    });
    if (contactError) return NextResponse.json({ success: false, error: contactError }, { status: 400 });
    if (cleanAlternatePhone && !/^[6-9]\d{9}$/.test(cleanAlternatePhone)) {
      return NextResponse.json({ success: false, error: 'Alternate phone number must be 10 digits and start with 6, 7, 8 or 9.' }, { status: 400 });
    }

    await ensureTable();
    const propertyImageData = await savePropertyImages(propertyImages);
    const user = verifyBearer(req, 'user');
    const userId = user?.role === 'user' && user.id && user.id !== 0 ? user.id : null;

    const result = await pool.query(
      `INSERT INTO primary_service_enquiries
        (service_slug, service_title, user_id, name, phone, alternate_phone, email, message,
         budget, carpet_area, time_slot, meeting_date, gps_location, address, state, city,
         property_image_name, property_image_url, property_image_names, property_image_urls, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19::jsonb,$20::jsonb,$21,NOW())
       RETURNING *`,
      [
        service_slug || null,
        service_title,
        userId,
        cleanName,
        cleanPhone,
        cleanAlternatePhone || null,
        cleanEmail,
        message || null,
        budget || null,
        carpet_area || null,
        time_slot || null,
        meeting_date || null,
        gps_location || null,
        address || null,
        cleanState,
        cleanCity,
        propertyImageData.names[0] || property_image_name || null,
        propertyImageData.urls[0] || null,
        JSON.stringify(propertyImageData.names),
        JSON.stringify(propertyImageData.urls),
        'Site Visit',
      ]
    );

    const enquiry = result.rows[0];
    await syncEnquiryToLead(enquiry);
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
    const publicError = /image|upload|maximum|5mb|jpg|png|webp/i.test(error.message || '')
      ? error.message
      : 'Server error. Please try again.';
    return NextResponse.json(
      { success: false, error: publicError },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ success: false, error: 'id and status required' }, { status: 400 });
    if (!PRIMARY_SERVICE_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid primary service status' }, { status: 400 });
    }

    await ensureTable();
    await pool.query(`UPDATE primary_service_enquiries SET status = $1 WHERE id = $2`, [status, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH primary-service-enquiries error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    await ensureTable();

    const result = await pool.query(
      `SELECT id, service_slug, service_title, user_id, name, phone, alternate_phone, email, message,
              budget, carpet_area, time_slot, meeting_date, gps_location, address, state, city,
              property_image_name, property_image_url, property_image_names, property_image_urls,
              rating_stars, review_text, site_image_names, site_image_urls, reviewed_at,
              status, created_at
       FROM primary_service_enquiries
       ORDER BY created_at DESC
       LIMIT 100`
    );

    const data = result.rows.map((row) => {
      const propertyImageUrls = normalizeArray(row.property_image_urls);
      const propertyImageNames = normalizeArray(row.property_image_names);
      const siteImageUrls = normalizeArray(row.site_image_urls);
      const siteImageNames = normalizeArray(row.site_image_names);
      return {
        ...row,
        property_image_urls: propertyImageUrls,
        property_image_names: propertyImageNames,
        site_image_urls: siteImageUrls,
        site_image_names: siteImageNames,
        property_image_url: row.property_image_url || propertyImageUrls[0] || null,
        property_image_name: row.property_image_name || propertyImageNames[0] || null,
      };
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching primary services enquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
