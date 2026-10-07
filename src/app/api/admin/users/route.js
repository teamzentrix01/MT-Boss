import { NextResponse } from 'next/server';
import { queryWithConnectionRetry } from '@/lib/db';
import { requireAdmin } from '@/lib/agent-auth';

export async function GET(req) {
  try {
    if (!await requireAdmin(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = String(searchParams.get('search') || '').trim();
    const status = String(searchParams.get('status') || 'all');
    const city = String(searchParams.get('city') || '').trim();
    const from = searchParams.get('from') || null;
    const to = searchParams.get('to') || null;
    const orderFilter = String(searchParams.get('orders') || 'all'); // 'all' | 'zero' | 'has_orders'
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(5, Number.parseInt(searchParams.get('pageSize') || '25', 10) || 25));
    const offset = (page - 1) * pageSize;

    // Pre-calculate user order counts and spends with accurate material enquiries totals
    const result = await queryWithConnectionRetry(`
      WITH user_order_stats AS (
        SELECT
          u.id AS user_id,
          COALESCE(b.order_count, 0) + COALESCE(m.order_count, 0) AS total_orders,
          COALESCE(b.total_spent, 0) + COALESCE(m.total_spent, 0) AS total_spent
        FROM users u
        LEFT JOIN (
          SELECT user_id, COUNT(*)::int AS order_count,
                 COALESCE(SUM(COALESCE(final_amount, total_amount, 0)), 0)::numeric AS total_spent
          FROM service_bookings
          GROUP BY user_id
        ) b ON b.user_id = u.id
        LEFT JOIN (
          SELECT
            COALESCE(me.user_id, u_sub.id) AS uid,
            COUNT(*)::int AS order_count,
            COALESCE(SUM(COALESCE(me.grand_total, me.amount_received, me.product_total, 0)), 0)::numeric AS total_spent
          FROM material_enquiries me
          LEFT JOIN users u_sub ON LOWER(TRIM(u_sub.email)) = LOWER(TRIM(me.user_email))
          WHERE me.user_id IS NOT NULL OR u_sub.id IS NOT NULL
          GROUP BY COALESCE(me.user_id, u_sub.id)
        ) m ON m.uid = u.id
      ),
      filtered_users AS (
        SELECT
          u.id, u.name, u.email, u.phone, u.delivery_city, u.created_at, u.last_login_at,
          u.is_blocked, u.blocked_reason, u.blocked_at,
          COALESCE(os.total_orders, 0)::int AS total_orders,
          COALESCE(os.total_spent, 0)::numeric AS total_spent
        FROM users u
        LEFT JOIN user_order_stats os ON os.user_id = u.id
        WHERE ($1 = '' OR u.name ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%' OR COALESCE(u.phone, '') ILIKE '%' || $1 || '%')
          AND ($2 = 'all' OR ($2 = 'blocked' AND u.is_blocked) OR ($2 = 'active' AND NOT COALESCE(u.is_blocked, false)))
          AND ($3 = '' OR LOWER(COALESCE(u.delivery_city, '')) = LOWER($3))
          AND ($4::date IS NULL OR u.created_at::date >= $4::date)
          AND ($5::date IS NULL OR u.created_at::date <= $5::date)
          AND (
            $6 = 'all' OR
            ($6 = 'zero' AND COALESCE(os.total_orders, 0) = 0) OR
            ($6 = 'has_orders' AND COALESCE(os.total_orders, 0) > 0)
          )
      ),
      paged_users AS (
        SELECT *, COUNT(*) OVER()::int AS total_count
        FROM filtered_users
        ORDER BY created_at DESC
        LIMIT $7 OFFSET $8
      )
      SELECT * FROM paged_users;
    `, [search, status, city, from, to, orderFilter, pageSize, offset]);

    // Fetch distinct delivery cities across all users for the dropdown filter
    const citiesRes = await queryWithConnectionRetry(`
      SELECT DISTINCT delivery_city
      FROM users
      WHERE delivery_city IS NOT NULL AND TRIM(delivery_city) != ''
      ORDER BY delivery_city ASC
    `);
    const cities = citiesRes.rows.map((r) => r.delivery_city).filter(Boolean);

    // Fetch overall KPI stats
    const kpiRes = await queryWithConnectionRetry(`
      WITH user_order_stats AS (
        SELECT
          u.id AS user_id,
          COALESCE(b.order_count, 0) + COALESCE(m.order_count, 0) AS total_orders,
          COALESCE(b.total_spent, 0) + COALESCE(m.total_spent, 0) AS total_spent
        FROM users u
        LEFT JOIN (
          SELECT user_id, COUNT(*)::int AS order_count,
                 COALESCE(SUM(COALESCE(final_amount, total_amount, 0)), 0)::numeric AS total_spent
          FROM service_bookings
          GROUP BY user_id
        ) b ON b.user_id = u.id
        LEFT JOIN (
          SELECT
            COALESCE(me.user_id, u_sub.id) AS uid,
            COUNT(*)::int AS order_count,
            COALESCE(SUM(COALESCE(me.grand_total, me.amount_received, me.product_total, 0)), 0)::numeric AS total_spent
          FROM material_enquiries me
          LEFT JOIN users u_sub ON LOWER(TRIM(u_sub.email)) = LOWER(TRIM(me.user_email))
          WHERE me.user_id IS NOT NULL OR u_sub.id IS NOT NULL
          GROUP BY COALESCE(me.user_id, u_sub.id)
        ) m ON m.uid = u.id
      )
      SELECT
        COUNT(*)::int AS total_users,
        COUNT(CASE WHEN NOT COALESCE(u.is_blocked, false) THEN 1 END)::int AS active_users,
        COUNT(CASE WHEN COALESCE(u.is_blocked, false) THEN 1 END)::int AS blocked_users,
        COUNT(CASE WHEN COALESCE(os.total_orders, 0) > 0 THEN 1 END)::int AS with_orders_count,
        COUNT(CASE WHEN COALESCE(os.total_orders, 0) = 0 THEN 1 END)::int AS zero_orders_count,
        COALESCE(SUM(os.total_spent), 0)::numeric AS total_lifetime_spent
      FROM users u
      LEFT JOIN user_order_stats os ON os.user_id = u.id;
    `);

    const stats = kpiRes.rows[0] || {
      total_users: 0,
      active_users: 0,
      blocked_users: 0,
      with_orders_count: 0,
      zero_orders_count: 0,
      total_lifetime_spent: 0,
    };

    const total = Number(result.rows[0]?.total_count || 0);

    return NextResponse.json({
      success: true,
      data: result.rows,
      cities,
      stats: {
        total_users: Number(stats.total_users || 0),
        active_users: Number(stats.active_users || 0),
        blocked_users: Number(stats.blocked_users || 0),
        with_orders_count: Number(stats.with_orders_count || 0),
        zero_orders_count: Number(stats.zero_orders_count || 0),
        total_lifetime_spent: Number(stats.total_lifetime_spent || 0),
      },
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not load users' }, { status: 500 });
  }
}
