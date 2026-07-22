import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureOtpSchema } from '@/lib/otp';
import { requireRole, unauthorized } from '@/lib/auth';

function verifyToken(req) {
  return requireRole(req, 'user');
}

export async function GET(req) {
  try {
    await ensureOtpSchema();

    const decoded = verifyToken(req);
    if (!decoded) {
      return unauthorized();
    }

    const userId = decoded.id && decoded.id !== 0 ? decoded.id : null;
    const userEmail = decoded.email || null;

    const query = `SELECT
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
        sb.payment_status,
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
        sb.start_otp_verified,
        sb.finish_otp_verified,
        sb.start_otp_generated_at,
        sb.finish_otp_generated_at,
        CASE
          WHEN sb.start_otp IS NOT NULL
           AND COALESCE(sb.start_otp_verified, FALSE) = FALSE
           AND sb.start_otp_generated_at > NOW() - INTERVAL '10 minutes'
          THEN TRUE ELSE FALSE
        END AS start_otp_pending,
        CASE
          WHEN sb.finish_otp IS NOT NULL
           AND COALESCE(sb.finish_otp_verified, FALSE) = FALSE
           AND sb.finish_otp_generated_at > NOW() - INTERVAL '10 minutes'
          THEN TRUE ELSE FALSE
        END AS finish_otp_pending,
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
       WHERE (
         ($1::INTEGER IS NOT NULL AND sb.user_id = $1)
         OR ($2::TEXT IS NOT NULL AND LOWER(sb.user_email) = LOWER($2))
       )
       AND sb.payment_status = 'PAID'
       ORDER BY sb.created_at DESC`;
    const queryParams = [userId, userEmail];

    const result = await pool.query(query, queryParams);

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
