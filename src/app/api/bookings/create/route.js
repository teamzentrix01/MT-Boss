// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/bookings/create/route.js
// CREATE NEW BOOKING - User submits booking form
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
 
export async function POST(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Login required' }, { status: 401 });
    }
 
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
      const rawId = decoded.id;

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
 
    // Validation
    if (!user_name || !user_phone || !service_address || !service_city || !service_pincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
 
    if (!/^[6-9]\d{9}$/.test(user_phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
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

    const basePrice = serviceResult.rows[0].admin_base_price || serviceResult.rows[0].base_price || 199;
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
        [time_slot_id, quick_service_id, service_city, booking_date]
      );

      if (slotCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'This free admin slot is closed, full, expired, or no longer matches your city/service.' },
          { status: 409 }
        );
      }
    }
 
    // Create booking
    const bookingResult = await pool.query(
      `INSERT INTO service_bookings (
        booking_reference, user_id, quick_service_id, user_name, user_phone, user_email,
        service_address, service_city, service_pincode, property_type,
        booking_date, booking_time, slot_type, time_slot_id,
        user_latitude, user_longitude, location_map_url,
        service_description,
        base_amount, visit_fee, tax_amount, total_amount,
        status, vendor_status, user_status, payment_status,
        created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, NOW()
      ) RETURNING id, booking_reference, total_amount`,
      [
        bookingReference, userId || null, quick_service_id, user_name, user_phone, user_email,
        service_address, service_city, service_pincode, property_type,
        booking_date, booking_time, slot_type, time_slot_id,
        user_latitude, user_longitude, location_map_url,
        service_description,
        basePrice, visitFee, taxAmount, totalAmount,
        'WAITING_FOR_VENDOR_ACCEPTANCE', null, 'PENDING', 'PENDING'
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
        [time_slot_id, quick_service_id, service_city, booking_date]
      );

      if (slotResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'This free admin slot is closed, full, expired, or no longer matches your city/service.' },
          { status: 409 }
        );
      }
    }
 
    // Notify active vendors who serve this quick service in the same city.
    const vendorsResult = await pool.query(
      `SELECT DISTINCT v.id
       FROM vendors v
       JOIN vendor_services vs ON vs.vendor_id = v.id
       WHERE vs.quick_service_id = $1
         AND vs.is_active = TRUE
         AND LOWER(TRIM(v.city)) = LOWER(TRIM($2))
         AND v.is_approved = TRUE
         AND v.status = 'active'
         AND COALESCE(v.verification_status, 'verified') IN ('verified', 'approved')
         AND v.id NOT IN (
           SELECT vendor_id
           FROM service_bookings
           WHERE status IN ('VENDOR_ACCEPTED', 'VENDOR_ON_WAY', 'IN_PROGRESS', 'AWAITING_PAYMENT')
             AND vendor_id IS NOT NULL
         )`,
      [quick_service_id, service_city]
    );
 
    // Create notifications for each vendor
    for (const vendor of vendorsResult.rows) {
      await pool.query(
        `INSERT INTO service_notifications (
          booking_id, vendor_id, notification_type, title, message, is_read, created_at
        ) VALUES ($1, $2, 'NEW_BOOKING', 'New Service Request', $3, FALSE, NOW())`,
        [bookingId, vendor.id, `New ${user_name} booking in ${service_city}. Base: ₹${basePrice}`]
      );
    }
 
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully. Vendors notified.',
      booking: {
        id: bookingId,
        booking_reference: bookingReference,
        total_amount: totalAmount,
      }
    }, { status: 201 });
 
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
