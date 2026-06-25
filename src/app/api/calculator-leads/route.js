import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req) {
  try {
    const { name, email, phone, city, area, floors, quality, grandTotal } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Name and phone are required.' }, { status: 400 });
    }

    // Format requirement and notes
    const requirement = `${city || 'Moradabad'}, ${area || 1000} sqft, Floors: ${floors || 1}, ${quality || 'Standard'} package. Est: ₹${Number(grandTotal || 0).toLocaleString('en-IN')}`;
    const notes = `Calculator Live Estimation. City: ${city || 'Moradabad'}, Area: ${area || 1000} sqft, Floors: ${floors || 1}, Package: ${quality || 'Standard'}`;

    // Upsert logic: if a calculator lead with matching email or phone exists, update it.
    // Otherwise insert new lead.
    const searchEmail = String(email || '').trim().toLowerCase();
    const searchPhone = String(phone || '').trim();

    const existing = await pool.query(
      `SELECT id FROM agent_leads 
       WHERE lead_source = 'calculator_visit' 
         AND (
           (client_email IS NOT NULL AND client_email <> '' AND LOWER(client_email) = $1)
           OR (client_phone IS NOT NULL AND client_phone <> '' AND client_phone = $2)
         )
       LIMIT 1`,
      [searchEmail, searchPhone]
    );

    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE agent_leads
         SET client_name = $1,
             client_phone = $2,
             client_email = $3,
             city = $4,
             client_requirement = $5,
             notes = $6,
             updated_at = NOW()
         WHERE id = $7
         RETURNING id`,
        [
          String(name).trim(),
          searchPhone,
          searchEmail || null,
          city || 'Unassigned',
          requirement,
          notes,
          existing.rows[0].id
        ]
      );
      return NextResponse.json({ success: true, message: 'Calculator lead updated.', lead_id: result.rows[0].id });
    }

    // Insert new lead
    result = await pool.query(
      `INSERT INTO agent_leads (
        city, client_name, client_phone, client_email, 
        service_type, lead_type, status, notes, 
        client_requirement, lead_source, assigned_by_role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        city || 'Unassigned',
        String(name).trim(),
        searchPhone,
        searchEmail || null,
        'Budget Calculator',
        'Calculator Visit',
        'New',
        notes,
        requirement,
        'calculator_visit',
        'system'
      ]
    );

    return NextResponse.json({ success: true, message: 'Calculator lead created.', lead_id: result.rows[0].id });
  } catch (err) {
    console.error('Error in calculator-leads API:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
