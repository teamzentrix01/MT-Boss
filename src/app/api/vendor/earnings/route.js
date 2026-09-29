import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';

// Mirrors the payout split used by /api/vendor/bookings.
const VENDOR_EARNING_SQL = `
  CASE
    WHEN COALESCE(sb.is_quick_job, FALSE) = TRUE THEN ROUND(COALESCE(sb.base_amount, 0) * 0.50)
    ELSE ROUND(COALESCE(sb.extra_amount, 0) * 0.76)
  END`;

export async function GET(req) {
  const vendor = requireRole(req, 'vendor');
  if (!vendor) return unauthorized();

  try {
    const summary = await pool.query(
      `SELECT
         COALESCE(SUM(${VENDOR_EARNING_SQL}) FILTER (WHERE sb.status = 'COMPLETED'), 0) AS total_earnings,
         COUNT(*) FILTER (WHERE sb.status = 'COMPLETED') AS completed_bookings,
         COALESCE(SUM(${VENDOR_EARNING_SQL}) FILTER (
           WHERE sb.status IN ('VENDOR_ACCEPTED', 'VENDOR_ON_WAY', 'IN_PROGRESS', 'AWAITING_PAYMENT')
         ), 0) AS pending_amount,
         COALESCE(SUM(${VENDOR_EARNING_SQL}) FILTER (
           WHERE sb.status = 'COMPLETED'
             AND DATE_TRUNC('month', COALESCE(sb.completed_at, sb.created_at)) = DATE_TRUNC('month', NOW())
         ), 0) AS monthly_earnings
       FROM service_bookings sb
       WHERE sb.vendor_id = $1`,
      [vendor.id]
    );

    const entries = await pool.query(
      `SELECT sb.id, sb.booking_reference, sb.user_name, qs.label AS service_label,
              TO_CHAR(COALESCE(sb.completed_at, sb.created_at), 'YYYY-MM-DD') AS date,
              ${VENDOR_EARNING_SQL} AS amount
         FROM service_bookings sb
         LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
        WHERE sb.vendor_id = $1 AND sb.status = 'COMPLETED'
        ORDER BY COALESCE(sb.completed_at, sb.created_at) DESC
        LIMIT 50`,
      [vendor.id]
    );

    const stats = summary.rows[0] || {};
    return NextResponse.json({
      success: true,
      data: {
        totalEarnings: Number(stats.total_earnings) || 0,
        completedBookings: Number(stats.completed_bookings) || 0,
        pendingAmount: Number(stats.pending_amount) || 0,
        monthlyEarnings: Number(stats.monthly_earnings) || 0,
        entries: entries.rows.map((row) => ({ ...row, amount: Number(row.amount) || 0 })),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
