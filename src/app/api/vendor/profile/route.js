import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

function getVendorId(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'fallback-secret');
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req) {
  try {
    const vendorId = getVendorId(req);
    if (!vendorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [vendorResult, servicesResult] = await Promise.all([
      pool.query(
        `SELECT id, email, shop_name, phone, city, state,
                description, status, verification_status, is_approved,
                created_at, updated_at
         FROM vendors WHERE id = $1`,
        [vendorId]
      ),
      pool.query(
        `SELECT vs.quick_service_id AS id, qs.label, qs.icon
         FROM vendor_services vs
         JOIN quick_services qs ON vs.quick_service_id = qs.id
         WHERE vs.vendor_id = $1 AND vs.is_active = TRUE`,
        [vendorId]
      ),
    ]);

    if (vendorResult.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      vendor: { ...vendorResult.rows[0], services: servicesResult.rows },
    });
  } catch (error) {
    console.error('Vendor profile GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const vendorId = getVendorId(req);
    if (!vendorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shop_name, phone, city, state, description, services } = await req.json();

    const vendorResult = await pool.query(
      `UPDATE vendors
       SET shop_name = COALESCE($1, shop_name),
           phone = COALESCE($2, phone),
           city = COALESCE($3, city),
           state = COALESCE($4, state),
           description = COALESCE($5, description),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, email, shop_name, phone, city, state, description, status, is_approved`,
      [shop_name || null, phone || null, city || null, state || null, description || null, vendorId]
    );

    if (vendorResult.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Update services if provided
    if (Array.isArray(services)) {
      await pool.query(
        `UPDATE vendor_services SET is_active = FALSE WHERE vendor_id = $1`,
        [vendorId]
      );
      for (const serviceId of services) {
        await pool.query(
          `INSERT INTO vendor_services (vendor_id, quick_service_id, is_active)
           VALUES ($1, $2, TRUE)
           ON CONFLICT (vendor_id, quick_service_id) DO UPDATE SET is_active = TRUE`,
          [vendorId, serviceId]
        );
      }
    }

    // Return updated data including services
    const servicesResult = await pool.query(
      `SELECT vs.quick_service_id AS id, qs.label, qs.icon
       FROM vendor_services vs
       JOIN quick_services qs ON vs.quick_service_id = qs.id
       WHERE vs.vendor_id = $1 AND vs.is_active = TRUE`,
      [vendorId]
    );

    return NextResponse.json({
      success: true,
      vendor: { ...vendorResult.rows[0], services: servicesResult.rows },
    });
  } catch (error) {
    console.error('Vendor profile PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
