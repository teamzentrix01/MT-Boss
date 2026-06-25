import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Pincode availability mapping - Add your service/product available pincodes here
const PINCODE_MAPPING = {
  // Format: "pincode": { "categories": [...], "quick_services": [...] }
  // Example:
  // "201301": { "categories": ["cement", "steel", "bricks"], "quick_services": ["electrician", "plumbing"] },
  // "201309": { "categories": ["cement", "steel"], "quick_services": ["electrician", "ac-repair"] },
  
  // Add your data like this based on your actual coverage
  // You can also query database if you have pincode data stored
};

// Fallback: If no mapping exists, allow for now but admin can restrict later
const ALLOW_UNLISTED_PINCODES = true;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get('pincode');
    const type = searchParams.get('type'); // 'category' or 'service'
    const name = searchParams.get('name');

    if (!pincode || !type || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing pincode, type, or name parameter' },
        { status: 400 }
      );
    }

    if (type === 'service') {
      const cleanName = String(name || '').trim();
      const dbCheck = await pool.query(
        `SELECT DISTINCT v.city 
         FROM vendors v
         JOIN vendor_services vs ON v.id = vs.vendor_id
         JOIN quick_services qs ON vs.quick_service_id = qs.id
         WHERE v.postal_code = $1
           AND (LOWER(qs.slug) = LOWER($2) OR LOWER(qs.label) = LOWER($3) OR LOWER(qs.label) = LOWER($4))
           AND vs.is_active = TRUE
           AND v.is_approved = TRUE
           AND LOWER(COALESCE(v.status, 'active')) IN ('active', 'approved')
           AND COALESCE(v.verification_status, 'verified') IN ('verified', 'approved')
         LIMIT 1`,
        [pincode, cleanName, cleanName, cleanName.replace(/-/g, ' ')]
      );

      if (dbCheck.rows.length > 0) {
        return NextResponse.json({
          success: true,
          available: true,
          city: dbCheck.rows[0].city,
          message: `Service available in pincode ${pincode}`,
        });
      } else {
        return NextResponse.json({
          success: true,
          available: false,
          message: `Service not available in pincode ${pincode} yet. Try another pincode or contact support.`,
        });
      }
    }

    if (type === 'category') {
      const cleanName = String(name || '').trim();
      const dbCheck = await pool.query(
        `SELECT 1 FROM suppliers s
         WHERE s.postal_code = $1
           AND s.status = 'approved'
           AND s.is_active = TRUE
           AND EXISTS (
             SELECT 1 FROM unnest(s.product_categories) cat
             WHERE LOWER(cat) = LOWER($2)
           )
         LIMIT 1`,
        [pincode, cleanName]
      );

      if (dbCheck.rows.length > 0) {
        return NextResponse.json({
          success: true,
          available: true,
          message: `Supplier available in pincode ${pincode}`,
        });
      } else {
        return NextResponse.json({
          success: true,
          available: false,
          message: `Supplier not available in pincode ${pincode} yet. Try another pincode or contact support.`,
        });
      }
    }

    const pincodeData = PINCODE_MAPPING[pincode];

    if (ALLOW_UNLISTED_PINCODES && !pincodeData) {
      // If pincode not in mapping but ALLOW_UNLISTED_PINCODES is true, allow
      return NextResponse.json({
        success: true,
        available: true,
        message: `Service available in pincode ${pincode}`,
      });
    }

    if (!pincodeData) {
      return NextResponse.json({
        success: true,
        available: false,
        message: `Service not available in pincode ${pincode} yet. Contact support.`,
      });
    }

    const isAvailable = type === 'category'
      ? pincodeData.categories?.includes(name.toLowerCase())
      : type === 'service'
      ? pincodeData.quick_services?.includes(name.toLowerCase())
      : false;

    return NextResponse.json({
      success: true,
      available: isAvailable,
      message: isAvailable
        ? `Service available in pincode ${pincode}`
        : `Service not available in pincode ${pincode} yet. Try another pincode or contact support.`,
    });
  } catch (error) {
    console.error('pincode-check error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to check pincode availability' },
      { status: 500 }
    );
  }
}
