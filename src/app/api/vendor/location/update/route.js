// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/vendor/location/update/route.js
// UPDATE VENDOR LIVE LOCATION
// ════════════════════════════════════════════════════════════════════════════════
 
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
 
export async function POST(req) {
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
 
    const { booking_id, latitude, longitude, address, accuracy_meters } = await req.json();
 
    if (!booking_id || !latitude || !longitude) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
 
    // Insert location update
    await pool.query(
      `INSERT INTO vendor_locations (booking_id, vendor_id, latitude, longitude, address, accuracy_meters, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [booking_id, vendorId, latitude, longitude, address, accuracy_meters]
    );
 
    // Update booking status if not already in progress
    await pool.query(
      `UPDATE service_bookings 
       SET status = 'VENDOR_ON_WAY', vendor_status = 'ON_WAY', started_at = NOW()
       WHERE id = $1 AND status = 'VENDOR_ACCEPTED'`,
      [booking_id]
    );
 
    return NextResponse.json({
      success: true,
      message: 'Location updated'
    });
 
  } catch (error) {
    console.error('Location update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
 