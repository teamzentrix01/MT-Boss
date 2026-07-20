import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/agent-auth';
import { ensureServiceCitiesSchema } from '@/lib/service-cities';

// ═══════════════════════════════════════════════════════════════════════
// VERIFY ADMIN TOKEN
// ═══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════
// GET - FETCH ALL VENDORS
// ═══════════════════════════════════════════════════════════════════════

export async function GET(req) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    await ensureServiceCitiesSchema();

    const result = await pool.query(
      `SELECT
        v.id, v.email, v.shop_name, v.phone,
        v.city, v.state, v.country, v.postal_code,
        v.aadhar_number,
        (v.profile_photo IS NOT NULL) AS profile_photo,
        (v.aadhar_image  IS NOT NULL) AS aadhar_image,
        v.status, v.verification_status, v.is_approved, v.created_at, v.updated_at,
        COALESCE(assigned.services, '[]'::json) AS services
       FROM vendors v
       LEFT JOIN LATERAL (
         SELECT json_agg(
           json_build_object(
             'id', qs.id,
             'label', qs.label,
             'icon', qs.icon
           ) ORDER BY qs.label
         ) AS services
         FROM vendor_services vs
         JOIN quick_services qs ON qs.id = vs.quick_service_id
         WHERE vs.vendor_id = v.id AND vs.is_active = TRUE
       ) assigned ON TRUE
       ORDER BY v.created_at DESC`
    );

    const servicesResult = await pool.query(
      `SELECT id, label, icon, cities
       FROM quick_services
       WHERE COALESCE(is_service_active, TRUE) = TRUE
       ORDER BY label ASC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      available_services: servicesResult.rows,
    });

  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// PUT - VENDOR MANAGEMENT (APPROVE, REJECT, ACTIVATE, DEACTIVATE)
// ═══════════════════════════════════════════════════════════════════════

export async function PUT(req) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      vendor_id,
      action, // 'approve', 'reject', 'activate', 'deactivate'
      services, // Array of quick_service_ids to assign
      admin_notes
    } = await req.json();

    if (!vendor_id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: vendor_id, action' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await ensureServiceCitiesSchema();

      if (action === 'approve') {
        // Approve vendor and assign services
        const vendorResult = await client.query(`
  UPDATE vendors 
  SET is_approved = TRUE, 
      status = 'active',              
      verification_status = 'verified',
      approval_date = NOW()
  WHERE id = $1
  RETURNING *
`, [vendor_id]);

        if (vendorResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        // Create vendor stats
       await client.query(
  `INSERT INTO vendor_stats (vendor_id)
   VALUES ($1)
   ON CONFLICT (vendor_id) DO NOTHING`,
          [vendor_id]
        );

        // Assign services if provided
        if (services && services.length > 0) {
          for (const service_id of services) {
            await client.query(
              `INSERT INTO vendor_services (vendor_id, quick_service_id, is_active)
               VALUES ($1, $2, TRUE)
               ON CONFLICT (vendor_id, quick_service_id) 
               DO UPDATE SET is_active = TRUE`,
              [vendor_id, service_id]
            );
          }
        }

        // Log admin action
        await client.query(
          `INSERT INTO admin_activity_logs (action, entity_type, entity_id, details, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          ['vendor_approved', 'vendor', vendor_id, JSON.stringify({ services, admin_notes })]
        );

        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          message: 'Vendor approved successfully',
          data: vendorResult.rows[0]
        });

      } else if (action === 'reject') {
        // Reject vendor
        const vendorResult = await client.query(
          `UPDATE vendors 
           SET verification_status = 'rejected',
               status = 'inactive',
               updated_at = NOW()
           WHERE id = $1
           RETURNING *`,
          [vendor_id]
        );

        if (vendorResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        await client.query(
          `INSERT INTO admin_activity_logs (action, entity_type, entity_id, details, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          ['vendor_rejected', 'vendor', vendor_id, JSON.stringify({ admin_notes })]
        );

        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          message: 'Vendor rejected successfully',
          data: vendorResult.rows[0]
        });

      } else if (action === 'activate') {
        // Activate vendor
        const vendorResult = await client.query(
          `UPDATE vendors 
           SET status = 'active', updated_at = NOW()
           WHERE id = $1
           RETURNING *`,
          [vendor_id]
        );

        if (vendorResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          message: 'Vendor activated successfully',
          data: vendorResult.rows[0]
        });

      } else if (action === 'deactivate') {
        // Deactivate vendor - won't receive notifications
        const vendorResult = await client.query(
          `UPDATE vendors 
           SET status = 'inactive', updated_at = NOW()
           WHERE id = $1
           RETURNING *`,
          [vendor_id]
        );

        if (vendorResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        await client.query('COMMIT');

        return NextResponse.json({
          success: true,
          message: 'Vendor deactivated successfully',
          data: vendorResult.rows[0]
        });
      } else if (action === 'update_services') {
        const serviceIds = [...new Set(
          (Array.isArray(services) ? services : [])
            .map((serviceId) => Number(serviceId))
            .filter((serviceId) => Number.isInteger(serviceId) && serviceId > 0)
        )];
        if (serviceIds.length === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Assign at least one service available in the vendor city' }, { status: 400 });
        }

        const vendorResult = await client.query(
          `SELECT id, city FROM vendors WHERE id = $1 FOR UPDATE`,
          [vendor_id]
        );
        if (vendorResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
        }

        if (serviceIds.length > 0) {
          const validServices = await client.query(
            `SELECT qs.id
             FROM quick_services qs
             WHERE qs.id = ANY($1::int[])
               AND COALESCE(qs.is_service_active, TRUE) = TRUE
               AND EXISTS (
                 SELECT 1 FROM UNNEST(COALESCE(qs.cities, '{}')) configured_city
                 WHERE LOWER(TRIM(configured_city)) = LOWER(TRIM($2))
               )`,
            [serviceIds, vendorResult.rows[0].city]
          );
          if (validServices.rows.length !== serviceIds.length) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: 'One or more services are not available in the vendor city' }, { status: 400 });
          }
        }

        await client.query(
          `UPDATE vendor_services SET is_active = FALSE WHERE vendor_id = $1`,
          [vendor_id]
        );
        for (const serviceId of serviceIds) {
          await client.query(
            `INSERT INTO vendor_services (vendor_id, quick_service_id, is_active)
             VALUES ($1, $2, TRUE)
             ON CONFLICT (vendor_id, quick_service_id)
             DO UPDATE SET is_active = TRUE`,
            [vendor_id, serviceId]
          );
        }

        const updatedServices = await client.query(
          `SELECT qs.id, qs.label, qs.icon
           FROM vendor_services vs
           JOIN quick_services qs ON qs.id = vs.quick_service_id
           WHERE vs.vendor_id = $1 AND vs.is_active = TRUE
           ORDER BY qs.label ASC`,
          [vendor_id]
        );

        await client.query('COMMIT');
        return NextResponse.json({
          success: true,
          message: 'Vendor services updated successfully',
          services: updatedServices.rows,
        });
      } else {
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
      }

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error managing vendor:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// POST - CREATE FREE TIME SLOTS
// ═══════════════════════════════════════════════════════════════════════

export async function POST(req) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      quick_service_id,
      slot_date,
      slot_start,
      slot_end,
      city,
      max_bookings = 1
    } = await req.json();

    if (!quick_service_id || !slot_date || !slot_start || !slot_end || !city) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO free_time_slots (
        quick_service_id, slot_date, slot_start, slot_end, city, max_bookings, is_available, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW())
      RETURNING *`,
      [quick_service_id, slot_date, slot_start, slot_end, city, max_bookings]
    );

    return NextResponse.json({
      success: true,
      message: 'Free slot created successfully',
      data: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating free slot:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// PATCH - UPDATE FREE SLOT AVAILABILITY
// ═══════════════════════════════════════════════════════════════════════

export async function PATCH(req) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      slot_id,
      is_available
    } = await req.json();

    if (!slot_id || is_available === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE free_time_slots 
       SET is_available = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [is_available, slot_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Slot updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating slot:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// DELETE - REMOVE FREE SLOT
// ═══════════════════════════════════════════════════════════════════════

export async function DELETE(req) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const slot_id = searchParams.get('slot_id');

    if (!slot_id) {
      return NextResponse.json({ error: 'Slot ID required' }, { status: 400 });
    }

    const result = await pool.query(
      `DELETE FROM free_time_slots WHERE id = $1 RETURNING id`,
      [slot_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Slot deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting slot:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
