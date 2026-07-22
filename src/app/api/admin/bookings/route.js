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
        ,COALESCE(eligible.eligible_vendors, '[]'::json) AS eligible_vendors
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
      LEFT JOIN LATERAL (
        SELECT json_agg(json_build_object(
          'vendor_id', ev.id, 'shop_name', ev.shop_name, 'phone', ev.phone,
          'city', ev.city, 'package_name', ev.package_name,
          'package_expires_at', ev.package_expires_at
        ) ORDER BY ev.shop_name) AS eligible_vendors
        FROM vendors ev
        JOIN vendor_services evs ON evs.vendor_id = ev.id
          AND evs.quick_service_id = sb.quick_service_id AND evs.is_active = TRUE
        WHERE LOWER(TRIM(ev.city)) = LOWER(TRIM(sb.service_city))
          AND ev.is_approved = TRUE
          AND LOWER(COALESCE(ev.status, 'active')) IN ('active', 'approved')
          AND COALESCE(ev.verification_status, 'verified') IN ('verified', 'approved')
          AND ev.package_status = 'active'
          AND ev.package_expires_at > NOW()
      ) eligible ON TRUE
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

export async function PATCH(req) {
  const client = await pool.connect();
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensurePackageSchema();
    const { id, action, vendor_id } = await req.json();
    if (!id || !['admin_accept', 'assign_vendor'].includes(action)) {
      return NextResponse.json({ error: 'Valid booking id and action are required' }, { status: 400 });
    }

    await client.query('BEGIN');
    if (action === 'admin_accept') {
      const result = await client.query(
        `UPDATE service_bookings SET status='ADMIN_ACCEPTED', user_status='ADMIN_ACCEPTED'
         WHERE id=$1 AND payment_status='PAID'
           AND status IN ('WAITING_FOR_ADMIN_ASSIGNMENT','WAITING_FOR_VENDOR_ACCEPTANCE')
           AND vendor_id IS NULL RETURNING *`, [id]
      );
      if (!result.rows.length) {
        await client.query('ROLLBACK');
        return NextResponse.json({ error: 'Booking is not available for admin acceptance' }, { status: 409 });
      }
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: result.rows[0] });
    }

    if (!vendor_id) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Select a paid vendor' }, { status: 400 });
    }
    const result = await client.query(
      `UPDATE service_bookings sb
       SET vendor_id=$1, status='VENDOR_ACCEPTED', vendor_status='ACCEPTED',
           user_status='VENDOR_ACCEPTED', accepted_at=NOW()
       WHERE sb.id=$2 AND sb.status='ADMIN_ACCEPTED' AND sb.payment_status='PAID'
         AND sb.vendor_id IS NULL AND EXISTS (
           SELECT 1 FROM vendors v JOIN vendor_services vs ON vs.vendor_id=v.id
           WHERE v.id=$1 AND vs.quick_service_id=sb.quick_service_id AND vs.is_active=TRUE
             AND LOWER(TRIM(v.city))=LOWER(TRIM(sb.service_city))
             AND v.is_approved=TRUE
             AND LOWER(COALESCE(v.status,'active')) IN ('active','approved')
             AND COALESCE(v.verification_status,'verified') IN ('verified','approved')
             AND v.package_status='active' AND v.package_expires_at>NOW()
         ) RETURNING *`, [vendor_id, id]
    );
    if (!result.rows.length) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Selected vendor is not eligible or booking is not admin-accepted' }, { status: 409 });
    }
    await client.query(`UPDATE service_notifications SET expires_at=NOW() WHERE booking_id=$1`, [id]);
    await client.query('COMMIT');
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('Admin booking action error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  } finally {
    client.release();
  }
}
