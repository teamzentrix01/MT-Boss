import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
  try {
    const vendorId = req.nextUrl.searchParams.get('vendor_id');

    const statsResult = await pool.query(
      `SELECT 
        total_earnings,
        completed_bookings,
        COALESCE((
          SELECT SUM(final_amount) 
          FROM service_bookings 
          WHERE vendor_id = $1 AND status != 'completed'
        ), 0) as pending_amount
       FROM vendor_stats
       WHERE vendor_id = $1`,
      [vendorId]
    );

    const monthlyResult = await pool.query(
      `SELECT COALESCE(SUM(final_amount), 0) as monthly_earnings
       FROM service_bookings
       WHERE vendor_id = $1 
       AND DATE_TRUNC('month', booking_date) = DATE_TRUNC('month', NOW())`,
      [vendorId]
    );

    const stats = statsResult.rows[0] || {};
    const monthly = monthlyResult.rows[0] || {};

    return NextResponse.json({
      success: true,
      data: {
        totalEarnings: Number(stats.total_earnings) || 0,
        completedBookings: Number(stats.completed_bookings) || 0,
        pendingAmount: Number(stats.pending_amount) || 0,
        monthlyEarnings: Number(monthly.monthly_earnings) || 0
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}