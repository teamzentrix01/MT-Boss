import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { createInitializationGuard } from '@/lib/api-utils';

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS property_enquiries (
    id SERIAL PRIMARY KEY, property_id INTEGER NOT NULL, property_title VARCHAR(250) NOT NULL,
    property_type VARCHAR(100), property_location VARCHAR(200), enquirer_name VARCHAR(200) NOT NULL,
    enquirer_phone VARCHAR(20) NOT NULL, enquirer_email VARCHAR(200), message TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'new', created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  )`);
});

export async function POST(req) {
  try {
    await ensureTable();
    const body = await req.json();
    const propertyId = Number(body.property_id);
    const name = cleanText(body.name);
    const phone = normalizePhone(body.phone);
    const email = cleanText(body.email).toLowerCase();
    const message = cleanText(body.message);
    if (!Number.isInteger(propertyId) || propertyId <= 0) return NextResponse.json({ success: false, error: 'Invalid property' }, { status: 400 });
    const contactError = validateContactFields({ name, phone, email: email || undefined, emailRequired: false, nameLabel: 'Full name' });
    if (contactError) return NextResponse.json({ success: false, error: contactError }, { status: 400 });
    const found = await pool.query(`SELECT id,title,type,location FROM properties WHERE id=$1 AND status='verified'`, [propertyId]);
    if (!found.rows.length) return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    const property = found.rows[0];
    const result = await pool.query(
      `INSERT INTO property_enquiries (property_id,property_title,property_type,property_location,enquirer_name,enquirer_phone,enquirer_email,message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [property.id, property.title, property.type, property.location, name, phone, email || null, message || null]
    );
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('POST property enquiry error:', error);
    return NextResponse.json({ success: false, error: 'Unable to submit enquiry' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureTable();
    const result = await pool.query(`SELECT * FROM property_enquiries ORDER BY created_at DESC`);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET property enquiries error:', error);
    return NextResponse.json({ success: false, error: 'Unable to load enquiries' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureTable();
    const { id, status } = await req.json();
    if (!id || !['new', 'contacted', 'follow-up', 'converted', 'lost'].includes(status)) return NextResponse.json({ success: false, error: 'Invalid status update' }, { status: 400 });
    const result = await pool.query(`UPDATE property_enquiries SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING *`, [status, id]);
    if (!result.rows.length) return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PATCH property enquiry error:', error);
    return NextResponse.json({ success: false, error: 'Unable to update enquiry' }, { status: 500 });
  }
}
