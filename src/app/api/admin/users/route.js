import { NextResponse } from 'next/server';
import { queryWithConnectionRetry } from '@/lib/db';
import { requireAdmin } from '@/lib/agent-auth';

export async function GET(req) {
  try {
    if (!await requireAdmin(req)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // Moderation columns are already provisioned. Do not run ALTER TABLE here:
    // hot reload can otherwise turn an ordinary list read into a DB timeout.
    const { searchParams } = new URL(req.url);
    const search = String(searchParams.get('search') || '').trim();
    const status = String(searchParams.get('status') || 'all');
    const city = String(searchParams.get('city') || '').trim();
    const from = searchParams.get('from') || null;
    const to = searchParams.get('to') || null;
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(50, Math.max(10, Number.parseInt(searchParams.get('pageSize') || '25', 10) || 25));
    const offset = (page - 1) * pageSize;

    // Pagination happens before aggregation. Each history table is only read
    // for the 25 users currently shown, never for every registered user.
    const result = await queryWithConnectionRetry(`
      WITH filtered_users AS (
        SELECT id, name, email, phone, delivery_city, created_at, last_login_at,
               is_blocked, blocked_reason, blocked_at
        FROM users
        WHERE ($1 = '' OR name ILIKE '%' || $1 || '%' OR email ILIKE '%' || $1 || '%' OR COALESCE(phone, '') ILIKE '%' || $1 || '%')
          AND ($2 = 'all' OR ($2 = 'blocked' AND is_blocked) OR ($2 = 'active' AND NOT is_blocked))
          AND ($3 = '' OR LOWER(COALESCE(delivery_city, '')) = LOWER($3))
          AND ($4::date IS NULL OR created_at::date >= $4::date)
          AND ($5::date IS NULL OR created_at::date <= $5::date)
      ), paged_users AS (
        SELECT *, COUNT(*) OVER()::int AS total_count
        FROM filtered_users
        ORDER BY created_at DESC
        LIMIT $6 OFFSET $7
      ), booking_stats AS (
        SELECT sb.user_id, COUNT(*)::int AS order_count,
               COALESCE(SUM(COALESCE(sb.final_amount, sb.total_amount, 0)), 0) AS total_spent
        FROM service_bookings sb JOIN paged_users u ON u.id = sb.user_id
        GROUP BY sb.user_id
      ), material_stats AS (
        SELECT me.user_id, COUNT(*)::int AS order_count,
               COALESCE(SUM(COALESCE(me.amount_received, 0)), 0) AS total_spent
        FROM material_enquiries me JOIN paged_users u ON u.id = me.user_id
        GROUP BY me.user_id
      )
      SELECT u.*, COALESCE(b.order_count, 0) + COALESCE(m.order_count, 0) AS total_orders,
             COALESCE(b.total_spent, 0) + COALESCE(m.total_spent, 0) AS total_spent
      FROM paged_users u
      LEFT JOIN booking_stats b ON b.user_id = u.id
      LEFT JOIN material_stats m ON m.user_id = u.id
      ORDER BY u.created_at DESC`, [search, status, city, from, to, pageSize, offset]);
    const cities = [...new Set(result.rows.map((user) => user.delivery_city).filter(Boolean))].sort();
    const total = Number(result.rows[0]?.total_count || 0);
    return NextResponse.json({ success: true, data: result.rows, cities, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not load users' }, { status: 500 });
  }
}
