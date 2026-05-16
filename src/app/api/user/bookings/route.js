// ============================================
// File: app/api/user/bookings/route.js
// ============================================
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
 
function verifyToken(req) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7);
  try {
    return jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
  } catch {
    return null;
  }
}
 
export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    const result = await pool.query(
      `SELECT 
        sb.id,
        sb.booking_reference,
        sb.quick_service_id,
        sb.booking_date,
        sb.booking_time,
        sb.final_amount,
        sb.status,
        sb.service_address,
        sb.service_city,
        qs.label as service_label,
        v.shop_name as vendor_shop_name
       FROM service_bookings sb
       JOIN quick_services qs ON sb.quick_service_id = qs.id
       LEFT JOIN vendors v ON sb.vendor_id = v.id
       WHERE sb.user_id = $1
       ORDER BY sb.booking_date DESC`,
      [decoded.id]
    );
 
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}