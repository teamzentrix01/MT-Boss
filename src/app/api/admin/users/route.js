import { NextResponse } from 'next/server';
import { queryWithConnectionRetry } from '@/lib/db';
import { requireAdmin } from '@/lib/agent-auth';
import { createInitializationGuard } from '@/lib/api-utils';
import { ensureMaterialOrderSchema } from '@/lib/material-orders';
import { ensureUserModerationSchema } from '@/lib/user-moderation';

const ensureUserListSchema = createInitializationGuard(async () => {
  await queryWithConnectionRetry('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)');
});

let usersKpiCache = { expiresAt: 0, stats: null, cities: null };
const USERS_KPI_TTL_MS = 60 * 1000;

export async function GET(req) {
  try {
    if (!await requireAdmin(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await Promise.all([
      ensureUserListSchema(),
      ensureUserModerationSchema(),
      ensureMaterialOrderSchema(),
    ]);

    const { searchParams } = new URL(req.url);
    const search = String(searchParams.get('search') || '').trim();
    const status = String(searchParams.get('status') || 'all');
    const city = String(searchParams.get('city') || '').trim();
    const from = searchParams.get('from') || null;
    const to = searchParams.get('to') || null;
    const orderFilter = String(searchParams.get('orders') || 'all');
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(5, Number.parseInt(searchParams.get('pageSize') || '25', 10) || 25));
    const offset = (page - 1) * pageSize;

    const baseWhere = `
      WHERE ($1 = '' OR u.name ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%' OR COALESCE(u.phone, '') ILIKE '%' || $1 || '%')
        AND ($2 = 'all' OR ($2 = 'blocked' AND u.is_blocked) OR ($2 = 'active' AND NOT COALESCE(u.is_blocked, false)))
        AND ($3 = '' OR LOWER(COALESCE(u.delivery_city, '')) = LOWER($3))
        AND ($4::date IS NULL OR u.created_at::date >= $4::date)
        AND ($5::date IS NULL OR u.created_at::date <= $5::date)
    `;
    const baseParams = [search, status, city, from, to];

    let stats;
    let cities;
    if (usersKpiCache.stats && usersKpiCache.expiresAt > Date.now()) {
      stats = usersKpiCache.stats;
      cities = usersKpiCache.cities;
    } else {
      // Cheap KPI stats — no full email-join material aggregate across all users
      const [kpiRes, citiesRes] = await Promise.all([
        queryWithConnectionRetry(`
          SELECT
            COUNT(*)::int AS total_users,
            COUNT(*) FILTER (WHERE NOT COALESCE(is_blocked, false))::int AS active_users,
            COUNT(*) FILTER (WHERE COALESCE(is_blocked, false))::int AS blocked_users,
            (
              SELECT COUNT(DISTINCT uid)::int FROM (
                SELECT user_id AS uid FROM service_bookings WHERE user_id IS NOT NULL
                UNION
                SELECT user_id AS uid FROM material_enquiries WHERE user_id IS NOT NULL
              ) ordered_users
            ) AS with_orders_count,
            (
              SELECT COALESCE(SUM(amount), 0)::numeric FROM (
                SELECT COALESCE(SUM(COALESCE(final_amount, total_amount, 0)), 0) AS amount FROM service_bookings
                UNION ALL
                SELECT COALESCE(SUM(COALESCE(grand_total, amount_received, product_total, 0)), 0) AS amount
                FROM material_enquiries WHERE user_id IS NOT NULL
              ) spends
            ) AS total_lifetime_spent
          FROM users
        `),
        queryWithConnectionRetry(`
          SELECT DISTINCT delivery_city
          FROM users
          WHERE delivery_city IS NOT NULL AND TRIM(delivery_city) != ''
          ORDER BY delivery_city ASC
        `),
      ]);

      const statsRow = kpiRes.rows[0] || {};
      const totalUsers = Number(statsRow.total_users || 0);
      const withOrders = Number(statsRow.with_orders_count || 0);
      stats = {
        total_users: totalUsers,
        active_users: Number(statsRow.active_users || 0),
        blocked_users: Number(statsRow.blocked_users || 0),
        with_orders_count: withOrders,
        zero_orders_count: Math.max(0, totalUsers - withOrders),
        total_lifetime_spent: Number(statsRow.total_lifetime_spent || 0),
      };
      cities = citiesRes.rows.map((r) => r.delivery_city).filter(Boolean);
      usersKpiCache = { expiresAt: Date.now() + USERS_KPI_TTL_MS, stats, cities };
    }

    let result;
    let total = 0;

    if (orderFilter === 'all') {
      // Page users first, then attach order stats only for that page
      const countRes = await queryWithConnectionRetry(
        `SELECT COUNT(*)::int AS total FROM users u ${baseWhere}`,
        baseParams
      );
      total = Number(countRes.rows[0]?.total || 0);

      const pageRes = await queryWithConnectionRetry(
        `SELECT u.id, u.name, u.email, u.phone, u.delivery_city, u.created_at, u.last_login_at,
                u.is_blocked, u.blocked_reason, u.blocked_at
         FROM users u
         ${baseWhere}
         ORDER BY u.created_at DESC
         LIMIT $6 OFFSET $7`,
        [...baseParams, pageSize, offset]
      );

      const ids = pageRes.rows.map((r) => r.id);
      let statsByUser = new Map();
      if (ids.length) {
        const pageStats = await queryWithConnectionRetry(
          `SELECT
             u.id AS user_id,
             COALESCE(b.order_count, 0) + COALESCE(m.order_count, 0) AS total_orders,
             COALESCE(b.total_spent, 0) + COALESCE(m.total_spent, 0) AS total_spent
           FROM UNNEST($1::int[]) AS u(id)
           LEFT JOIN (
             SELECT user_id, COUNT(*)::int AS order_count,
                    COALESCE(SUM(COALESCE(final_amount, total_amount, 0)), 0)::numeric AS total_spent
             FROM service_bookings
             WHERE user_id = ANY($1::int[])
             GROUP BY user_id
           ) b ON b.user_id = u.id
           LEFT JOIN (
             SELECT user_id AS uid, COUNT(*)::int AS order_count,
                    COALESCE(SUM(COALESCE(grand_total, amount_received, product_total, 0)), 0)::numeric AS total_spent
             FROM material_enquiries
             WHERE user_id = ANY($1::int[])
             GROUP BY user_id
           ) m ON m.uid = u.id`,
          [ids]
        );
        statsByUser = new Map(pageStats.rows.map((r) => [r.user_id, r]));
      }

      result = {
        rows: pageRes.rows.map((u) => {
          const s = statsByUser.get(u.id);
          return {
            ...u,
            total_orders: Number(s?.total_orders || 0),
            total_spent: Number(s?.total_spent || 0),
          };
        }),
      };
    } else {
      // Order filter needs stats — still scope material join to user_id only (faster than email match)
      const filtered = await queryWithConnectionRetry(
        `WITH page_stats AS (
           SELECT
             u.id AS user_id,
             COALESCE(b.order_count, 0) + COALESCE(m.order_count, 0) AS total_orders,
             COALESCE(b.total_spent, 0) + COALESCE(m.total_spent, 0) AS total_spent
           FROM users u
           LEFT JOIN (
             SELECT user_id, COUNT(*)::int AS order_count,
                    COALESCE(SUM(COALESCE(final_amount, total_amount, 0)), 0)::numeric AS total_spent
             FROM service_bookings GROUP BY user_id
           ) b ON b.user_id = u.id
           LEFT JOIN (
             SELECT user_id AS uid, COUNT(*)::int AS order_count,
                    COALESCE(SUM(COALESCE(grand_total, amount_received, product_total, 0)), 0)::numeric AS total_spent
             FROM material_enquiries WHERE user_id IS NOT NULL GROUP BY user_id
           ) m ON m.uid = u.id
         ),
         filtered_users AS (
           SELECT
             u.id, u.name, u.email, u.phone, u.delivery_city, u.created_at, u.last_login_at,
             u.is_blocked, u.blocked_reason, u.blocked_at,
             COALESCE(os.total_orders, 0)::int AS total_orders,
             COALESCE(os.total_spent, 0)::numeric AS total_spent
           FROM users u
           LEFT JOIN page_stats os ON os.user_id = u.id
           ${baseWhere}
             AND (
               $6 = 'zero' AND COALESCE(os.total_orders, 0) = 0
               OR $6 = 'has_orders' AND COALESCE(os.total_orders, 0) > 0
             )
         )
         SELECT *, COUNT(*) OVER()::int AS total_count
         FROM filtered_users
         ORDER BY created_at DESC
         LIMIT $7 OFFSET $8`,
        [...baseParams, orderFilter, pageSize, offset]
      );
      total = Number(filtered.rows[0]?.total_count || 0);
      result = filtered;
    }

    return NextResponse.json({
      success: true,
      data: result.rows,
      cities,
      stats,
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
