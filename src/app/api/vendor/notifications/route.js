// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/vendor/notifications/route.js
// GET VENDOR NOTIFICATIONS
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
 
export async function GET(req) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    let vendorId;
    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
      vendorId = decoded.id;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
 
    // Get pending notifications with booking details
    const result = await pool.query(
      `SELECT 
        sn.id, sn.booking_id, sn.notification_type, sn.title, sn.message, sn.is_read, sn.created_at,
        sb.user_name, sb.user_phone, sb.service_address, sb.service_city, sb.booking_date, sb.booking_time,
        sb.user_latitude, sb.user_longitude, sb.location_map_url, sb.base_amount, sb.total_amount, sb.service_description,
        qs.icon, qs.label
       FROM service_notifications sn
       JOIN service_bookings sb ON sn.booking_id = sb.id
       JOIN quick_services qs ON sb.quick_service_id = qs.id
       WHERE sn.vendor_id = $1
       AND sn.is_read = FALSE
       AND (sn.expires_at IS NULL OR sn.expires_at > NOW())
       ORDER BY sn.created_at DESC`,
      [vendorId]
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