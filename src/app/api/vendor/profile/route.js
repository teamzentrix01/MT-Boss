import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { cleanCity, ensureServiceCitiesSchema } from '@/lib/service-cities';

function getVendorId(req) {
  return requireRole(req, 'vendor')?.id || null;
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
        `SELECT DISTINCT vs.quick_service_id AS id, qs.label, qs.icon
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

    await ensureServiceCitiesSchema();
    const currentResult = await pool.query(
      `SELECT city FROM vendors WHERE id = $1`,
      [vendorId]
    );
    if (currentResult.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const currentServicesResult = await pool.query(
      `SELECT quick_service_id AS id
       FROM vendor_services
       WHERE vendor_id = $1 AND is_active = TRUE`,
      [vendorId]
    );
    const serviceIds = Array.isArray(services)
      ? [...new Set(services.map(Number).filter((id) => Number.isInteger(id) && id > 0))]
      : currentServicesResult.rows.map((row) => Number(row.id));
    if (Array.isArray(services) && serviceIds.length !== services.length) {
      return NextResponse.json({ error: 'Invalid service selection' }, { status: 400 });
    }
    if (serviceIds.length === 0) {
      return NextResponse.json({ error: 'Select at least one service for your operating city' }, { status: 400 });
    }

    const requestedCity = cleanCity(city || currentResult.rows[0].city);
    let canonicalCity = requestedCity;
    if (serviceIds.length > 0) {
      const coveredServices = await pool.query(
        `SELECT qs.id, configured_city AS canonical_city
         FROM quick_services qs
         CROSS JOIN LATERAL (
           SELECT TRIM(city_name) AS configured_city
           FROM UNNEST(COALESCE(qs.cities, '{}')) city_name
           WHERE LOWER(TRIM(city_name)) = LOWER(TRIM($1))
           LIMIT 1
         ) coverage
         WHERE qs.id = ANY($2::int[])
           AND COALESCE(qs.is_service_active, TRUE) = TRUE`,
        [requestedCity, serviceIds]
      );
      if (coveredServices.rows.length !== serviceIds.length) {
        return NextResponse.json(
          { error: 'Selected services are not all available in this city.' },
          { status: 400 }
        );
      }
      canonicalCity = coveredServices.rows[0].canonical_city;
    }

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
      [shop_name || null, phone || null, canonicalCity || null, state || null, description || null, vendorId]
    );

    if (vendorResult.rows.length === 0) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Update services if provided
    if (Array.isArray(services)) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(
          `UPDATE vendor_services SET is_active = FALSE WHERE vendor_id = $1`,
          [vendorId]
        );

        for (const serviceId of serviceIds) {
          const updated = await client.query(
            `UPDATE vendor_services
             SET is_active = TRUE
             WHERE vendor_id = $1 AND quick_service_id = $2
             RETURNING vendor_id`,
            [vendorId, serviceId]
          );

          if (updated.rows.length === 0) {
            await client.query(
              `INSERT INTO vendor_services (vendor_id, quick_service_id, is_active)
               VALUES ($1, $2, TRUE)`,
              [vendorId, serviceId]
            );
          }
        }

        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    // Return updated data including services
    const servicesResult = await pool.query(
      `SELECT DISTINCT vs.quick_service_id AS id, qs.label, qs.icon
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
