import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/agent-auth';
import { createInitializationGuard } from '@/lib/api-utils';

// Keep DDL off the modal's normal request path. This runs once per warm process
// (or after the guard TTL), instead of acquiring table locks for every click.
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
    if (!await requireAdmin(req)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    userId = Number(id);
    if (!Number.isInteger(userId)) return NextResponse.json({ success: false, error: 'Invalid user' }, { status: 400 });
    // Schema/index preparation must not hold the modal open. Section queries
    // below already degrade safely while a first-run migration completes.
    void ensureUserDetailsIndexes().catch((error) => console.warn('User details background preparation failed:', error.message));
    const userResult = await pool.query('SELECT id, name, email, phone, delivery_city, created_at, last_login_at, is_blocked, blocked_reason, blocked_at FROM users WHERE id=$1', [userId]);
    if (!userResult.rows[0]) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    const [bookings, materialOrders, couponUsage, moderationLog] = await Promise.all([
      optionalQuery(`SELECT sb.id, sb.booking_reference AS reference, COALESCE(qs.label, 'Service booking') AS description, COALESCE(sb.final_amount, sb.total_amount, 0) AS total, sb.status, sb.created_at FROM service_bookings sb LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id WHERE sb.user_id=$1 ORDER BY sb.created_at DESC`, [userId], 'Unable to load service order history.'),
      optionalQuery(`SELECT id, order_reference AS reference, material_type AS description, COALESCE(amount_received, 0) AS total, status, created_at FROM material_enquiries WHERE user_id=$1 ORDER BY created_at DESC`, [userId], 'Unable to load material order history.'),
      optionalQuery(`SELECT id, order_reference, coupon_code, coupon_discount, created_at FROM material_enquiries WHERE user_id=$1 AND coupon_code IS NOT NULL ORDER BY created_at DESC`, [userId], 'Unable to load coupon history.'),
      optionalQuery('SELECT action, reason, admin_name, created_at FROM user_moderation_logs WHERE user_id=$1 ORDER BY created_at DESC', [userId], 'Unable to load moderation history.'),
    ]);
    return NextResponse.json({ success: true, data: {
      user: userResult.rows[0],
      orders: [...bookings.rows, ...materialOrders.rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      couponUsage: couponUsage.rows,
      moderationLog: moderationLog.rows,
      sectionErrors: {
        orders: bookings.error || materialOrders.error,
        coupons: couponUsage.error,
        moderation: moderationLog.error,
      },
    } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load user details' }, { status: 500 });
  } finally {
    console.info('Admin user details response time', { userId, durationMs: Math.round(performance.now() - startedAt) });
  }
}
