import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensurePackageSchema } from '@/lib/packages';

export async function GET(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensurePackageSchema();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = `
      SELECT
        sb.id,
        sb.booking_reference,
        sb.quick_service_id,
        sb.vendor_id,
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
        sb.started_at,
        sb.completed_at,
        qs.icon  AS service_icon,
        qs.label AS service_label,
        v.shop_name AS vendor_name,
        v.email     AS vendor_email,
        v.phone     AS vendor_phone,
        v.package_name AS vendor_package_name,
        v.package_status AS vendor_package_status,
        COALESCE(notified.notified_vendors, '[]'::json) AS notified_vendors
      FROM service_bookings sb
      JOIN quick_services qs ON sb.quick_service_id = qs.id
      LEFT JOIN vendors v ON sb.vendor_id = v.id
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'vendor_id', nv.id,
            'shop_name', nv.shop_name,
            'phone', nv.phone,
            'city', nv.city,
            'package_status', nv.package_status,
            'notification_status',
              CASE
                WHEN sn.expires_at IS NOT NULL THEN 'expired'
                WHEN sn.is_read = TRUE THEN 'read'
                ELSE 'pending'
              END
          )
          ORDER BY sn.created_at DESC
        ) AS notified_vendors
        FROM service_notifications sn
        JOIN vendors nv ON nv.id = sn.vendor_id
        WHERE sn.booking_id = sb.id
      ) notified ON TRUE
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
