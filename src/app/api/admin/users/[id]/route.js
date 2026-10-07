import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/agent-auth';
import { createInitializationGuard } from '@/lib/api-utils';

const ensureUserDetailsIndexes = createInitializationGuard(async () => {
  const statements = [
    `ALTER TABLE material_enquiries ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(60), ADD COLUMN IF NOT EXISTS coupon_discount NUMERIC(12,2) DEFAULT 0`,
    `CREATE INDEX IF NOT EXISTS material_enquiries_user_created_idx ON material_enquiries (user_id, created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS service_bookings_user_created_idx ON service_bookings (user_id, created_at DESC)`,
  ];
  for (const statement of statements) {
    try { await pool.query(statement); } catch (error) { console.warn('User details schema preparation skipped:', error.message); }
  }
});

async function optionalQuery(query, values, fallbackMessage) {
  try {
    return { rows: (await pool.query(query, values)).rows, error: null };
  } catch (error) {
    console.warn(`Admin user details section unavailable: ${fallbackMessage}`, error.message);
    return { rows: [], error: fallbackMessage };
  }
}

export async function GET(req, { params }) {
  const startedAt = performance.now();
  let userId = null;
  try {
    if (!await requireAdmin(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    userId = Number(id);
    if (!Number.isInteger(userId)) {
      return NextResponse.json({ success: false, error: 'Invalid user' }, { status: 400 });
    }

    void ensureUserDetailsIndexes().catch((error) => console.warn('User details background preparation failed:', error.message));

    const userResult = await pool.query(
      `SELECT id, name, email, phone, delivery_city, created_at, last_login_at,
              is_blocked, blocked_reason, blocked_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (!userResult.rows[0]) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    const [bookings, materialOrders, couponUsage, addresses, moderationLog] = await Promise.all([
      optionalQuery(
        `SELECT sb.id, sb.booking_reference AS reference,
                COALESCE(qs.label, 'Service booking') AS description,
                COALESCE(sb.final_amount, sb.total_amount, 0)::numeric AS total,
                sb.status, sb.created_at
         FROM service_bookings sb
         LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
         WHERE sb.user_id = $1
         ORDER BY sb.created_at DESC`,
        [userId],
        'Unable to load service order history.'
      ),
      optionalQuery(
        `SELECT id, order_reference AS reference,
                COALESCE(NULLIF(TRIM(material_type), ''), NULLIF(TRIM(category_name), ''), 'Shop Order') AS description,
                COALESCE(grand_total, amount_received, product_total, 0)::numeric AS total,
                status, created_at
         FROM material_enquiries
         WHERE user_id = $1 OR (user_id IS NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM($2)))
         ORDER BY created_at DESC`,
        [userId, user.email],
        'Unable to load material order history.'
      ),
      optionalQuery(
        `SELECT id, order_reference, coupon_code,
                coupon_discount::numeric AS coupon_discount,
                COALESCE(grand_total, product_total, 0)::numeric AS grand_total,
                created_at
         FROM material_enquiries
         WHERE (user_id = $1 OR (user_id IS NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM($2))))
           AND coupon_code IS NOT NULL AND TRIM(coupon_code) != ''
         ORDER BY created_at DESC`,
        [userId, user.email],
        'Unable to load coupon history.'
      ),
      optionalQuery(
        `SELECT id, label, address_line, city, pincode, is_default, created_at
         FROM user_addresses
         WHERE user_id = $1
         ORDER BY is_default DESC, created_at DESC`,
        [userId],
        'Unable to load saved addresses.'
      ),
      optionalQuery(
        `SELECT action, reason, admin_name, created_at
         FROM user_moderation_logs
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId],
        'Unable to load moderation history.'
      ),
    ]);

    const combinedOrders = [...bookings.rows, ...materialOrders.rows].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const totalSpent = combinedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          ...user,
          total_orders: combinedOrders.length,
          total_spent: totalSpent,
        },
        orders: combinedOrders,
        couponUsage: couponUsage.rows,
        addresses: addresses.rows,
        moderationLog: moderationLog.rows,
        sectionErrors: {
          orders: bookings.error || materialOrders.error,
          coupons: couponUsage.error,
          addresses: addresses.error,
          moderation: moderationLog.error,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load user details' }, { status: 500 });
  } finally {
    console.info('Admin user details response time', { userId, durationMs: Math.round(performance.now() - startedAt) });
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userId = Number(id);
    if (!Number.isInteger(userId)) {
      return NextResponse.json({ success: false, error: 'Invalid user' }, { status: 400 });
    }

    // 1. Detach material enquiries
    await pool.query('UPDATE material_enquiries SET user_id = NULL WHERE user_id = $1', [userId]);

    // 2. Delete user addresses
    await pool.query('DELETE FROM user_addresses WHERE user_id = $1', [userId]);

    // 3. Delete user
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
      [userId]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User ${result.rows[0].email} deleted successfully`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not delete user' }, { status: 500 });
  }
}
