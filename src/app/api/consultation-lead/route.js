import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { handleApiError } from '@/lib/api-utils';
import { notifyAdminSubmission } from '@/lib/customer-communications';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS consultation_leads (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      email VARCHAR(150),
      city VARCHAR(100),
      service VARCHAR(150),
      preferred_slot VARCHAR(100),
      plot_area VARCHAR(100),
      status VARCHAR(50) DEFAULT 'New',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function POST(req) {
  try {
    await ensureTable();
    const { name, phone, email, city, service, preferredSlot, plotArea } = await req.json();

    const cleanName = cleanText(name);
    const cleanEmail = cleanText(email).toLowerCase();
    const cleanPhone = normalizePhone(phone);
    const cleanCity = cleanText(city) || 'Bareilly / UP';
    const cleanService = cleanText(service) || 'Residential Construction';
    const cleanSlot = cleanText(preferredSlot) || 'Immediate Call Back';
    const cleanArea = cleanText(plotArea) || '-';

    if (!cleanName || !cleanPhone) {
      return NextResponse.json(
        { error: 'Full Name and a valid 10-digit Mobile Number are required.' },
        { status: 400 }
      );
    }

    const contactError = validateContactFields({
      name: cleanName,
      email: cleanEmail || undefined,
      phone: cleanPhone,
      emailRequired: false,
    });
    if (contactError) {
      return NextResponse.json({ error: contactError }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO consultation_leads (name, phone, email, city, service, preferred_slot, plot_area, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'New', NOW())
       RETURNING id, name, phone, email, city, service, created_at`,
      [cleanName, cleanPhone, cleanEmail || null, cleanCity, cleanService, cleanSlot, cleanArea]
    );

    const ref = `CONSULT-${result.rows[0].id}`;

    // Send instant admin email notification to mtboss2016@gmail.com
    await notifyAdminSubmission({
      type: 'On-Arrival Consultation Modal Lead',
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail || '-',
      reference: ref,
      details: {
        'Service Requested': cleanService,
        'City / Location': cleanCity,
        'Preferred Time Slot': cleanSlot,
        'Plot / Built-up Area': cleanArea,
      },
    }).catch((err) => console.error('Admin lead notification error:', err));

    return NextResponse.json(
      {
        success: true,
        message: 'Your consultation request has been confirmed! Our senior engineer will call you shortly.',
        leadId: ref,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Consultation lead submission error:', error);
    return handleApiError(error);
  }
}
