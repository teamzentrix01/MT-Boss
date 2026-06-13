import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const result = await pool.query(
      `SELECT DISTINCT v.city 
       FROM vendors v
       JOIN vendor_services vs ON v.id = vs.vendor_id
       WHERE vs.quick_service_id = $1
         AND vs.is_active = TRUE
         AND v.is_approved = TRUE
         AND v.status = 'active'
         AND COALESCE(v.verification_status, 'verified') IN ('verified', 'approved')
       ORDER BY v.city ASC`,
      [id]
    );

    const citiesMap = new Map();
    result.rows.forEach(row => {
      const rawCity = row.city?.trim();
      if (rawCity) {
        const key = rawCity.toLowerCase();
        if (!citiesMap.has(key)) {
          // Title Case formatting
          const formatted = rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase();
          citiesMap.set(key, formatted);
        }
      }
    });

    const cities = Array.from(citiesMap.values()).sort();

    return NextResponse.json({ success: true, cities });
  } catch (error) {
    console.error('Error fetching cities for quick service:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
