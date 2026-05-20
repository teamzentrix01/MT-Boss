import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = `
      SELECT
        sb.id,
        sb.booking_reference,
        sb.user_name,
        sb.user_phone,
        sb.user_email,
        sb.service_address,
        sb.service_city,
        sb.service_pincode,
        sb.property_type,
        sb.booking_date,
        sb.booking_time,
        sb.urgency,
        sb.service_description,
        sb.base_amount,
        sb.visit_fee,
        sb.tax_amount,
        sb.total_amount,
        sb.final_amount,
        sb.user_paid_amount,
        sb.slot_type,
        sb.status,
        sb.vendor_status,
        sb.user_status,
        sb.payment_status,
        sb.vendor_notes,
        sb.user_notes,
        sb.created_at,
        sb.accepted_at,
        sb.completed_at,
        qs.icon  AS service_icon,
        qs.label AS service_label,
        v.shop_name AS vendor_name,
        v.phone     AS vendor_phone
      FROM service_bookings sb
      JOIN quick_services qs ON sb.quick_service_id = qs.id
      LEFT JOIN vendors v ON sb.vendor_id = v.id
    `;

    const params = [];
    if (status && status !== 'all') {
      params.push(status);
      query += ` WHERE sb.status = $1`;
    }

    query += ` ORDER BY sb.created_at DESC`;

    const result = await pool.query(query, params);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Admin bookings fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
