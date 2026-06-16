import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// POST - Create new service booking
export async function POST(req) {
  try {
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
      time_slot_id,
      service_description,
      user_latitude,
      user_longitude,
      location_map_url,
    } = await req.json();
    const selectedCity = String(service_city || '').trim();

    // Validation
    if (!quick_service_id || !user_name || !user_phone || !service_address || !selectedCity || !service_pincode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate booking reference
    const booking_reference = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Get service details
    const serviceResult = await pool.query(
      'SELECT base_price FROM quick_services WHERE id = $1',
      [quick_service_id]
    );

    if (serviceResult.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const base_price = serviceResult.rows[0].base_price;
    const visit_fee = 0;
    const total_amount = base_price + visit_fee;

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create booking
      const bookingResult = await client.query(
        `INSERT INTO service_bookings (
          booking_reference, quick_service_id,
          user_name, user_phone, user_email,
          service_address, service_city, service_pincode, property_type,
          booking_date, booking_time, slot_type, time_slot_id,
          urgency, visit_charge, service_description,
          user_latitude, user_longitude, location_map_url,
          base_amount, visit_fee, total_amount, status, vendor_status, user_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        RETURNING *`,
        [
          booking_reference, quick_service_id,
          user_name, user_phone, user_email,
          service_address, selectedCity, service_pincode, property_type,
          booking_date, booking_time, slot_type, time_slot_id,
          'normal', visit_fee, service_description,
          user_latitude, user_longitude, location_map_url,
          base_price, visit_fee, total_amount, 'WAITING_FOR_VENDOR_ACCEPTANCE', null, 'PENDING'
        ]
      );

      const booking = bookingResult.rows[0];

      // Update free slot if used
      if (slot_type === 'free' && time_slot_id) {
        await client.query(
          `UPDATE free_time_slots 
           SET current_bookings = current_bookings + 1 
           WHERE id = $1`,
          [time_slot_id]
        );
      }

      // Notify every approved vendor in the same city. Full details and
      // accept actions are gated later by package + service eligibility.
      const vendorResult = await client.query(
        `SELECT DISTINCT v.id, v.email, v.phone, v.shop_name 
         FROM vendors v
         WHERE LOWER(TRIM(v.city)) = LOWER(TRIM($1))
         AND LOWER(COALESCE(v.status, 'active')) IN ('active', 'approved')
         AND v.is_approved = TRUE
         AND COALESCE(v.verification_status, 'verified') IN ('verified', 'approved')`,
        [selectedCity]
      );

      const vendors = vendorResult.rows;

      // Create notifications for all eligible vendors
      for (const vendor of vendors) {
        await client.query(
          `INSERT INTO service_notifications (
            booking_id, vendor_id, notification_type, title, message
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            booking.id,
            vendor.id,
            'new_booking',
            `New ${selectedCity} Service Request`,
            `New booking request for your service at ${service_address}, ${selectedCity}`
          ]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Booking created successfully',
        data: {
          booking_id: booking.id,
          booking_reference: booking.booking_reference,
          total_amount: booking.total_amount,
          visit_fee: booking.visit_fee,
          vendors_notified: vendors.length,
        },
        status: 201
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error creating service booking:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}

// GET - Fetch booking details
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const booking_id = searchParams.get('booking_id');
    const booking_reference = searchParams.get('booking_reference');

    let result;

    if (booking_id) {
      result = await pool.query(
        'SELECT * FROM service_bookings WHERE id = $1',
        [booking_id]
      );
    } else if (booking_reference) {
      result = await pool.query(
        'SELECT * FROM service_bookings WHERE booking_reference = $1',
        [booking_reference]
      );
    } else {
      return NextResponse.json(
        { error: 'booking_id or booking_reference required' },
        { status: 400 }
      );
    }

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
