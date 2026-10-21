import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensurePackageSchema } from '@/lib/packages';
import { ensureServiceBookingSubcategorySchema } from '@/lib/booking-schema';
import { ensureOtpSchema } from '@/lib/otp';

const SORT_FIELDS = {
  created_at: 'sb.created_at',
  booking_date: 'sb.booking_date',
  total_amount: 'sb.total_amount',
  status: 'sb.status',
};

async function ensureBookingSchemasOnce() {
  await Promise.all([
    ensurePackageSchema(),
    ensureOtpSchema(),
    ensureServiceBookingSubcategorySchema(),
  ]);
}

async function fetchBookingDetail(id) {
  const result = await pool.query(
    `SELECT
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
        sb.service_subcategory,
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
        COALESCE(notified.notified_vendors, '[]'::json) AS notified_vendors,
        COALESCE(eligible.eligible_vendors, '[]'::json) AS eligible_vendors
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
          'city', ev.city, 'package_name', ev.package_name, 'package_status', ev.package_status,
          'package_expires_at', ev.package_expires_at
        ) ORDER BY ev.shop_name) AS eligible_vendors
        FROM vendors ev
        JOIN vendor_services evs ON evs.vendor_id = ev.id AND evs.is_active = TRUE
        JOIN quick_services evqs ON evqs.id = evs.quick_service_id
        WHERE LOWER(TRIM(ev.city)) = LOWER(TRIM(sb.service_city))
          AND (
            evs.quick_service_id = sb.quick_service_id
            OR LOWER(TRIM(evqs.label)) = LOWER(TRIM(qs.label))
          )
          AND ev.is_approved = TRUE
          AND LOWER(COALESCE(ev.status, 'active')) IN ('active', 'approved')
          AND COALESCE(ev.verification_status, 'verified') IN ('verified', 'approved')
          AND ev.package_status = 'active'
          AND (ev.package_expires_at IS NULL OR ev.package_expires_at > NOW())
      ) eligible ON TRUE
      WHERE sb.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function GET(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // List path skips stacked schema ensures (TTL-cached DDL is for mutations / cold detail).
    if (id) {
      await ensureBookingSchemasOnce();
      const booking = await fetchBookingDetail(id);
      if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: booking });
    }

    const status = searchParams.get('status');
    const q = (searchParams.get('q') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25', 10) || 25));
    const offset = (page - 1) * limit;
    const sortKey = SORT_FIELDS[searchParams.get('sort')] ? searchParams.get('sort') : 'created_at';
    const order = String(searchParams.get('order') || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const sortSql = SORT_FIELDS[sortKey];

    const where = [];
    const params = [];

    if (status && status !== 'all') {
      params.push(status);
      where.push(`sb.status = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      where.push(`(
        sb.booking_reference ILIKE $${params.length}
        OR sb.user_name ILIKE $${params.length}
        OR sb.user_phone ILIKE $${params.length}
        OR sb.service_city ILIKE $${params.length}
        OR qs.label ILIKE $${params.length}
      )`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countRes = await pool.query(
      `SELECT COUNT(*)::INT AS total
       FROM service_bookings sb
       JOIN quick_services qs ON sb.quick_service_id = qs.id
       ${whereSql}`,
      params
    );
    const total = countRes.rows[0]?.total || 0;

    const listParams = [...params, limit, offset];
    const result = await pool.query(
      `SELECT
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
        sb.service_subcategory,
        sb.property_type,
        sb.booking_date,
        sb.booking_time,
        sb.total_amount,
        sb.final_amount,
        sb.slot_type,
        sb.status,
        sb.vendor_status,
        sb.user_status,
        sb.payment_status,
        sb.created_at,
        sb.accepted_at,
        sb.started_at,
        sb.completed_at,
        qs.icon  AS service_icon,
        qs.label AS service_label,
        v.shop_name AS vendor_name,
        v.phone     AS vendor_phone
      FROM service_bookings sb
      JOIN quick_services qs ON sb.quick_service_id = qs.id
      LEFT JOIN vendors v ON sb.vendor_id = v.id
      ${whereSql}
      ORDER BY ${sortSql} ${order}, sb.id DESC
      LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
      listParams
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
      sort: { field: sortKey, order: order.toLowerCase() },
    });
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
    await ensureOtpSchema();
    const { id, action, vendor_id } = await req.json();
    if (!id || !['admin_accept', 'assign_vendor', 'reconcile_paid'].includes(action)) {
      return NextResponse.json({ error: 'Valid booking id and action are required' }, { status: 400 });
    }

    if (action === 'reconcile_paid') {
      const result = await pool.query(
        `UPDATE service_bookings
            SET status = 'COMPLETED',
                user_status = 'COMPLETED',
                vendor_status = 'COMPLETED',
                user_paid_amount = COALESCE(user_paid_amount, total_amount),
                completed_at = COALESCE(completed_at, NOW())
          WHERE status = 'AWAITING_PAYMENT'
            AND payment_status = 'PAID'
            AND COALESCE(finish_otp_verified, FALSE) = TRUE
            AND COALESCE(final_amount, total_amount, base_amount, 0) <= COALESCE(user_paid_amount, total_amount, 0)
          RETURNING id`
      );
      return NextResponse.json({ success: true, data: { updated: result.rowCount } });
    }

    await client.query('BEGIN');
    if (action === 'admin_accept') {
      const result = await client.query(
        `UPDATE service_bookings SET status='ADMIN_ACCEPTED', user_status='ADMIN_ACCEPTED'
         WHERE id=$1 AND payment_status IN ('PAID', 'FREE')
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
           user_status='VENDOR_ACCEPTED', accepted_at=NOW(),
           start_otp=NULL, start_otp_verified=FALSE,
           start_otp_generated_at=NULL, start_otp_attempts=0
       WHERE sb.id=$2
         AND sb.status IN ('ADMIN_ACCEPTED', 'VENDOR_ACCEPTED', 'VENDOR_ON_WAY')
         AND sb.payment_status IN ('PAID', 'FREE')
         AND sb.vendor_id IS DISTINCT FROM $1
         AND COALESCE(sb.start_otp_verified, FALSE)=FALSE
         AND EXISTS (
           SELECT 1 FROM vendors v
           JOIN vendor_services vs ON vs.vendor_id=v.id AND vs.is_active=TRUE
           JOIN quick_services assigned_qs ON assigned_qs.id=vs.quick_service_id
           JOIN quick_services booked_qs ON booked_qs.id=sb.quick_service_id
           WHERE v.id=$1
             AND (vs.quick_service_id=sb.quick_service_id OR LOWER(TRIM(assigned_qs.label))=LOWER(TRIM(booked_qs.label)))
             AND LOWER(TRIM(v.city))=LOWER(TRIM(sb.service_city))
             AND v.is_approved=TRUE
             AND LOWER(COALESCE(v.status,'active')) IN ('active','approved')
             AND COALESCE(v.verification_status,'verified') IN ('verified','approved')
             AND v.package_status = 'active'
             AND (v.package_expires_at IS NULL OR v.package_expires_at > NOW())
         ) RETURNING *`, [vendor_id, id]
    );
    if (!result.rows.length) {
      await client.query('ROLLBACK');
      return NextResponse.json({
        error: 'Vendor cannot be changed. Select a different eligible vendor and make sure the service has not started.',
      }, { status: 409 });
    }
    const locationsTable = await client.query(`SELECT to_regclass('public.vendor_locations') AS table_name`);
    if (locationsTable.rows[0]?.table_name) {
      await client.query(`DELETE FROM vendor_locations WHERE booking_id=$1`, [id]);
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
