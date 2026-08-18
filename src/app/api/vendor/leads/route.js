import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensurePackageSchema } from '@/lib/packages';
import { ensureServiceBookingSubcategorySchema } from '@/lib/booking-schema';

function activePackageCondition(alias = 'v') {
  return `${alias}.package_status = 'active'
    AND (${alias}.package_expires_at IS NULL OR ${alias}.package_expires_at > NOW())`;
}

export async function GET(req) {
  try {
    const vendor = requireRole(req, 'vendor');
    if (!vendor) return unauthorized();

    await ensurePackageSchema();
    await ensureServiceBookingSubcategorySchema();

    const incoming = await pool.query(
      `WITH vendor_state AS (
         SELECT id, city, package_status, package_purchased_at, package_starts_at, package_expires_at, created_at
           FROM vendors
          WHERE id = $1
       )
       SELECT
         sb.id AS booking_id,
         sb.booking_reference,
         'incoming' AS lead_track_status,
         sb.status,
         sn.created_at AS tracked_at,
         sb.user_name AS customer_name,
         sb.user_phone AS customer_phone,
         sb.service_address,
         sb.service_city,
         sb.booking_date,
         sb.booking_time,
         sb.service_subcategory,
         sb.service_description,
         sb.base_amount,
         sb.total_amount,
         qs.label AS service_label,
         qs.icon AS service_icon,
         TRUE AS can_accept,
         FALSE AS contact_locked
       FROM service_bookings sb
       JOIN vendor_state v ON LOWER(TRIM(v.city)) = LOWER(TRIM(sb.service_city))
       JOIN quick_services qs ON qs.id = sb.quick_service_id
       JOIN service_notifications sn
         ON sn.booking_id = sb.id
        AND sn.vendor_id = v.id
       WHERE sb.status = 'WAITING_FOR_VENDOR_ACCEPTANCE'
         AND COALESCE(sn.is_read, FALSE) = FALSE
         AND (sn.expires_at IS NULL OR sn.expires_at > NOW())
         AND ${activePackageCondition('v')}
         AND sn.created_at >= COALESCE(v.package_starts_at, v.package_purchased_at, v.created_at, '-infinity'::TIMESTAMPTZ)
         AND EXISTS (
           SELECT 1
             FROM vendor_services vs
            WHERE vs.vendor_id = v.id
              AND vs.quick_service_id = sb.quick_service_id
              AND vs.is_active = TRUE
         )
       ORDER BY tracked_at DESC
       LIMIT 100`,
      [vendor.id]
    );

    const assigned = await pool.query(
      `SELECT
         sb.id AS booking_id,
         sb.booking_reference,
         CASE
           WHEN sb.status IN ('VENDOR_ACCEPTED', 'VENDOR_ON_WAY', 'IN_PROGRESS') THEN 'active'
           WHEN sb.status = 'AWAITING_PAYMENT' THEN 'awaiting_payment'
           WHEN sb.status = 'COMPLETED' THEN 'completed'
           ELSE LOWER(sb.status)
         END AS lead_track_status,
         sb.status,
         COALESCE(sb.completed_at, sb.accepted_at, sb.created_at) AS tracked_at,
         sb.user_name AS customer_name,
         sb.user_phone AS customer_phone,
         sb.service_address,
         sb.service_city,
         sb.booking_date,
         sb.booking_time,
         sb.service_subcategory,
         sb.service_description,
         sb.base_amount,
         sb.total_amount,
         sb.final_amount,
         sb.vendor_notes,
         sb.accepted_at,
         sb.completed_at,
         qs.label AS service_label,
         qs.icon AS service_icon,
         TRUE AS can_accept,
         FALSE AS contact_locked
       FROM service_bookings sb
       JOIN quick_services qs ON qs.id = sb.quick_service_id
       JOIN vendors v ON v.id = sb.vendor_id
       WHERE sb.vendor_id = $1
         AND ${activePackageCondition('v')}
         AND COALESCE(sb.accepted_at, sb.created_at) >= COALESCE(v.package_starts_at, v.package_purchased_at, v.created_at, '-infinity'::TIMESTAMPTZ)
       ORDER BY tracked_at DESC
       LIMIT 200`,
      [vendor.id]
    );

    const data = [...incoming.rows, ...assigned.rows].sort((a, b) => (
      new Date(b.tracked_at || 0).getTime() - new Date(a.tracked_at || 0).getTime()
    ));

    return NextResponse.json({
      success: true,
      data,
      counts: {
        incoming: data.filter((lead) => lead.lead_track_status === 'incoming').length,
        active: data.filter((lead) => lead.lead_track_status === 'active').length,
        awaiting_payment: data.filter((lead) => lead.lead_track_status === 'awaiting_payment').length,
        completed: data.filter((lead) => lead.lead_track_status === 'completed').length,
      },
    });
  } catch (error) {
    console.error('Vendor lead track fetch error:', error);
    return NextResponse.json({ success: false, error: 'Vendor lead track could not be loaded' }, { status: 500 });
  }
}
