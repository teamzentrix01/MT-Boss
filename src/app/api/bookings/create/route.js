// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/bookings/create/route.js
// CREATE NEW BOOKING - User submits booking form
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';
import { createPayURequest } from '@/lib/payu';
import { hasVendorForServiceCity, resolveServiceCity } from '@/lib/service-cities';

function normalizeTimeSlot(slot) {
  return String(slot || '').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
}

async function ensurePaidSlotsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS paid_time_slot_availability (
      id SERIAL PRIMARY KEY,
      quick_service_id INTEGER NOT NULL REFERENCES quick_services(id) ON DELETE CASCADE,
      slot_date DATE NOT NULL,
      city VARCHAR(120) NOT NULL,
      time_slot VARCHAR(80) NOT NULL,
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      updated_by_role VARCHAR(30),
      updated_by_id INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (quick_service_id, slot_date, city, time_slot)
    )
  `);
}

async function ensurePaymentColumns() {
  await pool.query(`
    ALTER TABLE service_bookings
      ADD COLUMN IF NOT EXISTS payment_gateway TEXT,
      ADD COLUMN IF NOT EXISTS payment_txnid TEXT,
      ADD COLUMN IF NOT EXISTS payment_gateway_id TEXT,
      ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMPTZ
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS service_bookings_payment_txnid_uidx
    ON service_bookings (payment_txnid)
    WHERE payment_txnid IS NOT NULL
  `);
}
 
export async function POST(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Login required' }, { status: 401 });
    }
 
    let userId;
    let authenticatedEmail = null;
    try {
      const decoded = requireRole(req, 'user');
      if (!decoded) throw new Error('Invalid role');
      const rawId = decoded.id;
      authenticatedEmail = decoded.email || null;

      // id = 0 means admin hardcoded login — not a real users table row
      if (!rawId || rawId === 0) {
        userId = null;
      } else {
        // Verify user actually exists in users table to avoid FK violation
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [rawId]);
        userId = userCheck.rows.length > 0 ? rawId : null;
      }
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
 
    const {
      quick_service_id,
      user_name,
      user_phone,
      user_email,
      service_address,
      service_city,
      service_pincode,
      property_type,
      booking_date,
      booking_time,
      slot_type, // 'free' or 'paid'
      time_slot_id, // for free slots
      user_latitude,
      user_longitude,
      location_map_url,
      service_description,
    } = await req.json();
    let selectedCity = String(service_city || '').trim();
    const cleanUserName = cleanText(user_name);
    const cleanUserEmail = cleanText(user_email || authenticatedEmail || '').toLowerCase();
    const cleanUserPhone = normalizePhone(user_phone);
 
    // Validation
    if (!cleanUserName || !cleanUserPhone || !service_address || !selectedCity || !service_pincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
 
    const contactError = validateContactFields({
      name: cleanUserName,
      email: cleanUserEmail,
      phone: cleanUserPhone,
      emailRequired: true,
      nameLabel: 'Customer name',
    });
    if (contactError) return NextResponse.json({ error: contactError }, { status: 400 });
    if (!/^\d{6}$/.test(String(service_pincode || '').trim())) {
      return NextResponse.json({ error: 'Pincode must be exactly 6 digits' }, { status: 400 });
    }

    const canonicalCity = await resolveServiceCity(quick_service_id, selectedCity);
    if (!canonicalCity) {
      return NextResponse.json({ error: 'Selected city is not available for this service.' }, { status: 400 });
    }
    selectedCity = canonicalCity;
    if (!await hasVendorForServiceCity(quick_service_id, selectedCity)) {
      return NextResponse.json({ error: 'No approved vendor is currently available for this service in the selected city.' }, { status: 409 });
    }
 
    // ── Ensure user_id is nullable (safe to run repeatedly, idempotent) ──
    try {
      await pool.query(
        `ALTER TABLE service_bookings ALTER COLUMN user_id DROP NOT NULL`
      );
    } catch (_) {
      // Already nullable — ignore
    }

    // Get service base price
    const serviceResult = await pool.query(
      'SELECT admin_base_price, base_price FROM quick_services WHERE id = $1',
      [quick_service_id]
    );

    if (serviceResult.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const basePrice = 150;
    const visitFee = 0;
    const taxAmount = Math.round((basePrice * 18) / 100);
    const totalAmount = basePrice + visitFee + taxAmount;

    // Generate booking reference
    const bookingReference = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    if (slot_type === 'free') {
      if (!time_slot_id) {
        return NextResponse.json({ error: 'Please select a free admin slot' }, { status: 400 });
      }

      const slotCheck = await pool.query(
        `SELECT id
         FROM free_time_slots
         WHERE id = $1
           AND quick_service_id = $2
           AND LOWER(TRIM(city)) = LOWER(TRIM($3))
           AND slot_date::DATE = $4::DATE
           AND slot_date::DATE >= CURRENT_DATE
           AND is_available = TRUE
           AND COALESCE(current_bookings, 0) < COALESCE(max_bookings, 1)`,
        [time_slot_id, quick_service_id, selectedCity, booking_date]
      );

      if (slotCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'This free admin slot is closed, full, expired, or no longer matches your city/service.' },
          { status: 409 }
        );
      }
    } else {
      await ensurePaidSlotsTable();
      const paidSlotCheck = await pool.query(
        `SELECT is_available
         FROM paid_time_slot_availability
         WHERE quick_service_id = $1
           AND slot_date::DATE = $2::DATE
           AND LOWER(TRIM(city)) = LOWER(TRIM($3))
           AND time_slot = $4
         LIMIT 1`,
        [quick_service_id, booking_date, selectedCity, normalizeTimeSlot(booking_time)]
      );

      if (paidSlotCheck.rows[0]?.is_available === false) {
        return NextResponse.json(
          { error: 'This paid time slot is closed for the selected date. Please choose another slot.' },
          { status: 409 }
        );
      }
    }
 
    await ensurePaymentColumns();
    const paymentTxnId = `MTB${Date.now()}${Math.random().toString(36).slice(2, 8)}`.slice(0, 50);

    // Create a reserved booking. Vendors are notified only after PayU verifies payment.
    const bookingResult = await pool.query(
      `INSERT INTO service_bookings (
        booking_reference, user_id, quick_service_id, user_name, user_phone, user_email,
        service_address, service_city, service_pincode, property_type,
        booking_date, booking_time, slot_type, time_slot_id,
        user_latitude, user_longitude, location_map_url,
        service_description,
        base_amount, visit_fee, tax_amount, total_amount,
        status, vendor_status, user_status, payment_status,
        payment_gateway, payment_txnid,
        created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, NOW()
      ) RETURNING id, booking_reference, total_amount`,
      [
        bookingReference, userId || null, quick_service_id, cleanUserName, cleanUserPhone, cleanUserEmail,
        service_address, selectedCity, service_pincode, property_type,
        booking_date, booking_time, slot_type, time_slot_id,
        user_latitude, user_longitude, location_map_url,
        service_description,
        basePrice, visitFee, taxAmount, totalAmount,
        'PAYMENT_PENDING', null, 'PAYMENT_PENDING', 'PENDING', 'PAYU', paymentTxnId
      ]
    );
 
    const booking = bookingResult.rows[0];
    const bookingId = booking.id;
 
    // Update free slot if used. The conditions prevent booking admin-closed,
    // full, expired, wrong-city, or wrong-service slots.
    if (slot_type === 'free' && time_slot_id) {
      const slotResult = await pool.query(
        `UPDATE free_time_slots
         SET current_bookings = COALESCE(current_bookings, 0) + 1,
             is_available = CASE WHEN COALESCE(current_bookings, 0) + 1 >= COALESCE(max_bookings, 1) THEN FALSE ELSE TRUE END
         WHERE id = $1
           AND quick_service_id = $2
           AND LOWER(TRIM(city)) = LOWER(TRIM($3))
           AND slot_date::DATE = $4::DATE
           AND is_available = TRUE
           AND COALESCE(current_bookings, 0) < COALESCE(max_bookings, 1)
         RETURNING id`,
        [time_slot_id, quick_service_id, selectedCity, booking_date]
      );

      if (slotResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'This free admin slot is closed, full, expired, or no longer matches your city/service.' },
          { status: 409 }
        );
      }
    }
 
    const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
    const appUrl = configuredAppUrl || new URL(req.url).origin;
    const callbackUrl = `${appUrl}/api/payu/callback`;
    const payment = createPayURequest({
      txnid: paymentTxnId,
      amount: totalAmount,
      productinfo: `MTBOSS service booking ${bookingReference}`,
      firstname: cleanUserName.split(/\s+/)[0],
      email: cleanUserEmail,
      phone: cleanUserPhone,
      surl: callbackUrl,
      furl: callbackUrl,
      udf1: String(bookingId),
      udf2: bookingReference,
    });
 
    return NextResponse.json({
      success: true,
      message: 'Booking reserved. Redirecting to PayU for payment.',
      booking: {
        id: bookingId,
        booking_reference: bookingReference,
        total_amount: totalAmount,
        payment_status: 'PENDING',
      },
      payment,
    }, { status: 201 });
 
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
