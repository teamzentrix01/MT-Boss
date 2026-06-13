import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

function verifyToken(req) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.slice(7), process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
  } catch {
    return null;
  }
}

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decoded.id && decoded.id !== 0 ? decoded.id : null;

    let query, queryParams;
    if (userId) {
      // Normal case: filter by user_id
      query = `SELECT
        sb.id,
        sb.booking_reference,
        sb.quick_service_id,
        sb.booking_date,
        sb.booking_time,
        sb.base_amount,
        sb.visit_fee,
        sb.tax_amount,
        sb.total_amount,
        sb.final_amount,
        sb.user_paid_amount,
        sb.status,
        sb.vendor_status,
        sb.user_status,
        sb.urgency,
        sb.service_address,
        sb.service_city,
        sb.service_pincode,
        sb.property_type,
        sb.service_description,
        sb.user_notes,
        sb.location_map_url,
        sb.created_at,
        sb.accepted_at,
        sb.completed_at,
        sb.start_otp,
        sb.start_otp_verified,
        sb.finish_otp,
        sb.finish_otp_verified,
        qs.icon  AS service_icon,
        qs.label AS service_label,
        v.shop_name AS vendor_shop_name,
        v.phone     AS vendor_phone,
        CASE WHEN br.booking_id IS NOT NULL THEN TRUE ELSE FALSE END AS has_rating,
        br.rating_stars
       FROM service_bookings sb
       JOIN quick_services qs ON sb.quick_service_id = qs.id
       LEFT JOIN vendors v ON sb.vendor_id = v.id
       LEFT JOIN booking_ratings br
         ON br.booking_id = sb.id AND br.user_id = $1
       WHERE sb.user_id = $1
       ORDER BY sb.created_at DESC`;
      queryParams = [userId];
    } else {
      // Fallback: match by email from the JWT token
      const userEmail = decoded.email;
      query = `SELECT
        sb.id,
        sb.booking_reference,
        sb.quick_service_id,
        sb.booking_date,
        sb.booking_time,
        sb.base_amount,
        sb.visit_fee,
        sb.tax_amount,
        sb.total_amount,
        sb.final_amount,
        sb.user_paid_amount,
        sb.status,
        sb.vendor_status,
        sb.user_status,
        sb.urgency,
        sb.service_address,
        sb.service_city,
        sb.service_pincode,
        sb.property_type,
        sb.service_description,
        sb.user_notes,
        sb.location_map_url,
        sb.created_at,
        sb.accepted_at,
        sb.completed_at,
        sb.start_otp,
        sb.start_otp_verified,
        sb.finish_otp,
        sb.finish_otp_verified,
        qs.icon  AS service_icon,
        qs.label AS service_label,
        v.shop_name AS vendor_shop_name,
        v.phone     AS vendor_phone,
        FALSE AS has_rating,
        NULL AS rating_stars
       FROM service_bookings sb
       JOIN quick_services qs ON sb.quick_service_id = qs.id
       LEFT JOIN vendors v ON sb.vendor_id = v.id
       WHERE sb.user_id IS NULL AND LOWER(sb.user_email) = LOWER($1)
       ORDER BY sb.created_at DESC`;
      queryParams = [userEmail];
    }

    const result = await pool.query(query, queryParams);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
