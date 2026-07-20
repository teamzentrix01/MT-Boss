// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/vendor/notifications/route.js
// GET VENDOR NOTIFICATIONS
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensurePackageSchema } from '@/lib/packages';
 
export async function GET(req) {
  try {
    const vendor = requireRole(req, 'vendor');
    if (!vendor) return unauthorized();

    await ensurePackageSchema();
 
    // Get pending notifications that still match this vendor's city.
    // Contact details and accept action stay locked unless the vendor has
    // an active package and serves the requested quick service.
    const result = await pool.query(
      `WITH visible_notifications AS (
        SELECT
          sn.id,
          sb.id AS booking_id,
          COALESCE(sn.notification_type, 'new_booking') AS notification_type,
          COALESCE(sn.title, 'New Service Request') AS title,
          COALESCE(sn.message, 'New booking request in your city') AS message,
          COALESCE(sn.is_read, FALSE) AS is_read,
          COALESCE(sn.created_at, sb.created_at) AS created_at,
          sb.user_name,
          sb.user_phone,
          sb.service_address,
          sb.service_city,
          sb.booking_date,
          sb.booking_time,
          sb.user_latitude,
          sb.user_longitude,
          sb.location_map_url,
          sb.base_amount,
          sb.total_amount,
          sb.service_description,
          v.package_status,
          v.package_expires_at,
          qs.icon,
          qs.label,
          (v.package_status = 'active' AND v.package_expires_at > NOW()) AS has_active_package,
          EXISTS (
            SELECT 1
            FROM vendor_services vs
            WHERE vs.vendor_id = v.id
              AND vs.quick_service_id = sb.quick_service_id
              AND vs.is_active = TRUE
          ) AS serves_service
        FROM service_bookings sb
        JOIN vendors v ON v.id = $1
        LEFT JOIN service_notifications sn
          ON sn.booking_id = sb.id
         AND sn.vendor_id = v.id
        JOIN quick_services qs ON sb.quick_service_id = qs.id
        WHERE COALESCE(sn.is_read, FALSE) = FALSE
          AND (sn.expires_at IS NULL OR sn.expires_at > NOW())
          AND sb.status = 'WAITING_FOR_VENDOR_ACCEPTANCE'
          AND LOWER(TRIM(v.city)) = LOWER(TRIM(sb.service_city))
          AND EXISTS (
            SELECT 1
            FROM vendor_services eligible_service
            WHERE eligible_service.vendor_id = v.id
              AND eligible_service.quick_service_id = sb.quick_service_id
              AND eligible_service.is_active = TRUE
          )
          AND v.is_approved = TRUE
          AND LOWER(COALESCE(v.status, 'active')) IN ('active', 'approved')
          AND COALESCE(v.verification_status, 'verified') IN ('verified', 'approved')
      )
      SELECT
        id,
        booking_id,
        notification_type,
        title,
        message,
        is_read,
        created_at,
        CASE WHEN has_active_package AND serves_service THEN user_name ELSE 'Customer' END AS user_name,
        CASE WHEN has_active_package AND serves_service THEN user_phone ELSE NULL END AS user_phone,
        CASE WHEN has_active_package AND serves_service THEN service_address ELSE NULL END AS service_address,
        service_city,
        booking_date,
        booking_time,
        CASE WHEN has_active_package AND serves_service THEN user_latitude ELSE NULL END AS user_latitude,
        CASE WHEN has_active_package AND serves_service THEN user_longitude ELSE NULL END AS user_longitude,
        CASE WHEN has_active_package AND serves_service THEN location_map_url ELSE NULL END AS location_map_url,
        base_amount,
        total_amount,
        service_description,
        has_active_package,
        serves_service,
        (has_active_package AND serves_service) AS can_accept,
        NOT (has_active_package AND serves_service) AS contact_locked,
        package_status,
        package_expires_at,
        icon,
        label
      FROM visible_notifications
      ORDER BY created_at DESC`,
      [vendor.id]
    );
 
    return NextResponse.json({
      success: true,
      notifications: result.rows
    });
 
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
