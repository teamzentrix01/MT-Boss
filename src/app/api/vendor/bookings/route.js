import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Decode JWT to get vendor_id (implement based on your JWT library)
    // For now, get from query or body
    const vendorId = req.nextUrl.searchParams.get('vendor_id');

    const result = await pool.query(
      `SELECT 
        sb.id,
        sb.booking_reference,
        sb.booking_date,
        sb.final_amount,
        sb.status,
        sb.user_name,
        qs.label as service_label
       FROM service_bookings sb
       JOIN quick_services qs ON sb.quick_service_id = qs.id
       WHERE sb.vendor_id = $1
       ORDER BY sb.booking_date DESC`,
      [vendorId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}