import { NextResponse } from 'next/server';
import { requireRole, verifyBearer } from '@/lib/auth';
import pool from '@/lib/db';
import { getShippingSettings, ensureShippingSchema, validateQuantityRules, invalidateShippingSettingsCache } from '@/lib/shipping';

export async function GET(req) {
  const isAdmin = requireRole(req, 'admin');
  const isVendor = verifyBearer(req, 'vendor');
  try {
    const data = await getShippingSettings();

    // Customers only see freeRule and core cities for delivery check, never the rule table
    if (!isAdmin && !isVendor) {
      return NextResponse.json({
        success: true,
        data: {
          coreCities: data.coreCities,
          freeRule: data.freeRule,
        },
        canEdit: false,
      });
    }

    return NextResponse.json({
      success: true,
      data,
      canEdit: Boolean(isAdmin),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const adminUser = verifyBearer(req, 'admin');
  if (!adminUser) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  try {
    await ensureShippingSchema();
    const body = await req.json();
    const coreCities = Array.isArray(body.coreCities) ? body.coreCities : [];
    const distances = Array.isArray(body.distances) ? body.distances : [];

    if (
      coreCities.some(
        (row) =>
          !String(row.city_name || '').trim() ||
          !Number.isFinite(Number(row.fixed_cost)) ||
          Number(row.fixed_cost) < 0
      )
    ) {
      throw new Error('Each core city needs a valid non-negative fixed cost');
    }

    if (
      distances.some(
        (row) =>
          !String(row.from_city || '').trim() ||
          !String(row.to_city || '').trim() ||
          String(row.from_city).trim().toLowerCase() === String(row.to_city).trim().toLowerCase() ||
          !Number.isFinite(Number(row.distance_km)) ||
          Number(row.distance_km) < 0
      )
    ) {
      throw new Error('Each distance route needs two different cities and a valid distance');
    }

    if (
      !Number.isFinite(Number(body.distanceRule?.rate_per_km)) ||
      Number(body.distanceRule.rate_per_km) < 0 ||
      !Number.isFinite(Number(body.freeRule?.min_order_value)) ||
      Number(body.freeRule.min_order_value) < 0
    ) {
      throw new Error('Shipping amounts must be non-negative');
    }

    // Validate quantityRules if provided
    if (body.quantityRules) {
      validateQuantityRules(body.quantityRules);
    }

    const oldSettings = await getShippingSettings();

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM shipping_core_city_rates');
      for (const row of coreCities) {
        await client.query(
          'INSERT INTO shipping_core_city_rates (city_name, fixed_cost, is_active) VALUES ($1,$2,$3)',
          [String(row.city_name).trim(), Number(row.fixed_cost), row.is_active !== false]
        );
      }

      await client.query('DELETE FROM shipping_city_distances');
      for (const row of distances) {
        await client.query(
          'INSERT INTO shipping_city_distances (from_city, to_city, distance_km, is_active) VALUES ($1,$2,$3,$4)',
          [
            String(row.from_city).trim(),
            String(row.to_city).trim(),
            Number(row.distance_km),
            row.is_active !== false,
          ]
        );
      }

      await client.query(
        'UPDATE shipping_distance_rule SET rate_per_km=$1, is_active=$2, updated_at=NOW() WHERE id=1',
        [Number(body.distanceRule.rate_per_km), body.distanceRule.is_active !== false]
      );

      await client.query(
        'UPDATE shipping_free_rule SET min_order_value=$1, applicable_only_to_same_city=$2, is_active=$3, updated_at=NOW() WHERE id=1',
        [
          Number(body.freeRule.min_order_value),
          body.freeRule.applicable_only_to_same_city !== false,
          body.freeRule.is_active !== false,
        ]
      );

      // Persist quantityRules to pm_settings
      if (body.quantityRules) {
        await client.query(
          `INSERT INTO pm_settings (key, value, updated_at)
           VALUES ('quantity_shipping_rules', $1, NOW())
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
          [JSON.stringify(body.quantityRules)]
        );
      }

      // Log in admin_activity_logs if available
      const who = adminUser.email || adminUser.username || String(adminUser.id || 'admin');
      const adminId = Number.isInteger(Number(adminUser.id)) ? Number(adminUser.id) : null;
      try {
        await client.query(
          `INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, details, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [
            adminId,
            'shipping_settings_updated',
            'shipping_settings',
            1,
            JSON.stringify({
              who,
              when: new Date().toISOString(),
              old_value: oldSettings,
              new_value: {
                coreCities,
                distances,
                distanceRule: body.distanceRule,
                freeRule: body.freeRule,
                quantityRules: body.quantityRules,
              },
            }),
          ]
        );
      } catch (logErr) {
        console.warn('Could not record admin activity log for shipping settings:', logErr.message);
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    invalidateShippingSettingsCache();
    const updatedData = await getShippingSettings();
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Could not save shipping settings' },
      { status: 400 }
    );
  }
}
