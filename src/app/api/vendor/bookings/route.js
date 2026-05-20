import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let vendorId;
    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
      vendorId = decoded.id;
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'active';

    // Earnings logic:
    //   Quick job (≤30 min): base_amount split 50/50 — vendor gets 50%, admin gets 50%
    //   Extended job (>30 min): base 100% to admin + extra follows: 18% GST, 15% commission, 67% vendor
    const baseSelect = `
      SELECT
        sb.id, sb.booking_reference, sb.user_name, sb.user_phone,
        sb.service_address, sb.service_city, sb.booking_date, sb.booking_time,
        sb.base_amount, sb.visit_fee, sb.tax_amount, sb.total_amount,
        sb.final_amount, sb.user_paid_amount,
        COALESCE(sb.extra_amount, 0)  AS extra_amount,
        COALESCE(sb.is_quick_job, FALSE) AS is_quick_job,
        sb.status, sb.vendor_status, sb.vendor_notes, sb.user_notes,
        sb.created_at, sb.accepted_at, sb.completed_at,
        qs.icon, qs.label,
        CASE
          WHEN COALESCE(sb.is_quick_job, FALSE) = TRUE
            THEN ROUND(sb.base_amount * 0.50)
          ELSE ROUND(COALESCE(sb.extra_amount, 0) * 0.67)
        END AS vendor_earning,
        CASE
          WHEN COALESCE(sb.is_quick_job, FALSE) = TRUE
            THEN ROUND(sb.base_amount * 0.50)
          ELSE sb.base_amount + ROUND(COALESCE(sb.extra_amount, 0) * 0.15)
        END AS admin_commission,
        CASE
          WHEN COALESCE(sb.is_quick_job, FALSE) = TRUE THEN 0
          ELSE ROUND(COALESCE(sb.extra_amount, 0) * 0.18)
        END AS gst_amount,
        br.rating_stars, br.review_text, br.created_at AS rated_at
      FROM service_bookings sb
      JOIN quick_services qs ON sb.quick_service_id = qs.id
      LEFT JOIN booking_ratings br ON br.booking_id = sb.id
      WHERE sb.vendor_id = $1`;

    let query = baseSelect;
    const params = [vendorId];

    if (type === 'active') {
      query += ` AND sb.status IN ('VENDOR_ACCEPTED', 'VENDOR_ON_WAY', 'IN_PROGRESS', 'AWAITING_PAYMENT')`;
    } else if (type === 'completed') {
      query += ` AND sb.status = 'COMPLETED'`;
    }

    query += ` ORDER BY sb.created_at DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json({ success: true, bookings: result.rows });

  } catch (error) {
    console.error('Vendor bookings fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
