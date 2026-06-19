import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';

// No `ready` flag — CREATE TABLE IF NOT EXISTS + ALTER IF NOT EXISTS are idempotent
// and run in milliseconds when the table already exists. This makes the route resilient
// to dev hot-reloads and any out-of-band DB resets.
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS material_enquiries (
      id                      SERIAL PRIMARY KEY,
      user_name               VARCHAR(255) NOT NULL,
      user_phone              VARCHAR(20)  NOT NULL,
      user_email              VARCHAR(255),
      category_name           VARCHAR(255) NOT NULL,
      category_emoji          TEXT         DEFAULT '',
      material_type           VARCHAR(255),
      subcategory_name        VARCHAR(255),
      brand_company           VARCHAR(255),
      quantity_text           VARCHAR(255),
      order_unit              VARCHAR(100),
      delivery_date           DATE,
      delivery_address        TEXT,
      latitude                DECIMAL(10,8),
      longitude               DECIMAL(11,8),
      message                 TEXT,
      status                  VARCHAR(50)  DEFAULT 'open',
      accepted_by_supplier_id INTEGER,
      accepted_at             TIMESTAMP,
      fulfilled_at            TIMESTAMP,
      amount_received         NUMERIC(10,2),
      admin_commission        NUMERIC(10,2),
      supplier_notes          TEXT,
      created_at              TIMESTAMP    DEFAULT NOW(),
      updated_at              TIMESTAMP    DEFAULT NOW()
    )
  `);
  // Safe column migrations — run every time, all idempotent
  const migrations = [
    `ALTER TABLE material_enquiries ALTER COLUMN category_emoji TYPE TEXT USING category_emoji::TEXT`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS material_type    VARCHAR(255)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS subcategory_name VARCHAR(255)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS brand_company    VARCHAR(255)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS order_unit       VARCHAR(100)`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS delivery_date    DATE`,
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS selected_city    VARCHAR(100)`,
  ];
  for (const sql of migrations) {
    try { await pool.query(sql); } catch { /* already correct type or column exists */ }
  }
}

// ── POST — submit enquiry from ShopNow page ───────────────────────────────────
export async function POST(req) {
  try {
    await ensureTable();

    const {
      user_name, user_phone, user_email,
      category_name, category_emoji,
      material_type, subcategory_name, brand_company,
      quantity_text, order_unit, delivery_date,
      delivery_address, latitude, longitude,
      message, selected_city,
    } = await req.json();
    const cleanName = cleanText(user_name);
    const cleanEmail = user_email ? cleanText(user_email).toLowerCase() : null;
    const cleanPhone = normalizePhone(user_phone);

    if (!cleanName || !cleanPhone || !category_name) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and category are required' },
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

    const result = await pool.query(
      `INSERT INTO material_enquiries
         (user_name, user_phone, user_email,
          category_name, category_emoji,
          material_type, subcategory_name, brand_company,
          quantity_text, order_unit, delivery_date,
          delivery_address, latitude, longitude, message, selected_city)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING id, status, created_at`,
      [
        cleanName, cleanPhone, cleanEmail,
        category_name, category_emoji || '',
        material_type || null, subcategory_name || null, brand_company || null,
        quantity_text || null, order_unit || null, delivery_date || null,
        delivery_address || null, latitude || null, longitude || null,
        message || null, selected_city || null,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST material-enquiries error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ── GET — admin can view all enquiries ────────────────────────────────────────
export async function GET() {
  try {
    await ensureTable();
    const result = await pool.query(
      `SELECT me.*, s.shop_name AS accepted_by_shop
       FROM material_enquiries me
       LEFT JOIN suppliers s ON s.id = me.accepted_by_supplier_id
       ORDER BY me.created_at DESC`
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
