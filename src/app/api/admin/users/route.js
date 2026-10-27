import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryWithConnectionRetry } from '@/lib/db';
import { requireAdmin } from '@/lib/agent-auth';
import { createInitializationGuard } from '@/lib/api-utils';
import { ensureMaterialOrderSchema } from '@/lib/material-orders';
import { ensureUserModerationSchema } from '@/lib/user-moderation';

const ensureUserListSchema = createInitializationGuard(async () => {
  await queryWithConnectionRetry('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)');
  await queryWithConnectionRetry("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Customer'");
});

const metaCache = new Map();
const META_CACHE_TTL = 60_000; // 60s cache to avoid repeated heavy full-table scans

const UNIFIED_USERS_CTE = `
  WITH unified_users AS (
    SELECT
      u.id,
      u.id AS user_id,
      COALESCE(u.name, 'Customer') AS name,
      u.email,
      u.phone,
      u.delivery_city,
      u.created_at,
      u.last_login_at,
      COALESCE(u.is_blocked, false) AS is_blocked,
      u.blocked_reason,
      u.blocked_at,
      CASE
        WHEN a.id IS NOT NULL THEN 'Agent'
        WHEN v.id IS NOT NULL THEN (CASE WHEN LOWER(COALESCE(v.business_type, '')) LIKE '%contractor%' THEN 'Contractor' ELSE 'Vendor' END)
        WHEN s.id IS NOT NULL THEN 'Supplier'
        WHEN NULLIF(u.role, '') IS NOT NULL AND LOWER(u.role) NOT IN ('customer', 'user') THEN u.role
        ELSE 'Customer'
      END AS role,
      'users' AS source_table
    FROM users u
    LEFT JOIN agents a ON LOWER(u.email) = LOWER(a.email)
    LEFT JOIN vendors v ON LOWER(u.email) = LOWER(v.email)
    LEFT JOIN suppliers s ON LOWER(u.email) = LOWER(s.email)

    UNION ALL

    SELECT
      1000000 + v.id AS id,
      NULL::int AS user_id,
      COALESCE(v.vendor_name, v.business_name, v.shop_name, 'Vendor') AS name,
      v.email,
      v.phone,
      v.city AS delivery_city,
      v.created_at,
      v.last_login AS last_login_at,
      COALESCE(v.status = 'inactive' OR v.status = 'rejected', false) AS is_blocked,
      NULL::text AS blocked_reason,
      NULL::timestamptz AS blocked_at,
      CASE
        WHEN LOWER(COALESCE(v.business_type, '')) LIKE '%contractor%' THEN 'Contractor'
        ELSE 'Vendor'
      END AS role,
      'vendors' AS source_table
    FROM vendors v
    WHERE v.email IS NOT NULL AND LOWER(v.email) NOT IN (SELECT LOWER(email) FROM users WHERE email IS NOT NULL)

    UNION ALL

    SELECT
      2000000 + s.id AS id,
      NULL::int AS user_id,
      COALESCE(s.business_name, s.shop_name, 'Supplier') AS name,
      s.email,
      s.phone,
      s.city AS delivery_city,
      s.created_at,
      s.last_login_at,
      COALESCE(NOT s.is_active, false) AS is_blocked,
      s.rejection_reason AS blocked_reason,
      NULL::timestamptz AS blocked_at,
      'Supplier' AS role,
      'suppliers' AS source_table
    FROM suppliers s
    WHERE s.email IS NOT NULL AND LOWER(s.email) NOT IN (SELECT LOWER(email) FROM users WHERE email IS NOT NULL)

    UNION ALL

    SELECT
      3000000 + a.id AS id,
      NULL::int AS user_id,
      COALESCE(a.name, 'Agent') AS name,
      a.email,
      a.phone,
      a.city AS delivery_city,
      a.created_at,
      a.last_login_at,
      COALESCE(a.status = 'Rejected' OR NOT a.login_enabled, false) AS is_blocked,
      NULL::text AS blocked_reason,
      NULL::timestamptz AS blocked_at,
      'Agent' AS role,
      'agents' AS source_table
    FROM agents a
    WHERE a.email IS NOT NULL AND LOWER(a.email) NOT IN (SELECT LOWER(email) FROM users WHERE email IS NOT NULL)
  )
`;

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
    const role = String(searchParams.get('role') || 'all').trim();
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
        AND ($6 = 'all' OR LOWER(u.role) = LOWER($6))
    `;
    const baseParams = [search, status, city, from, to, role];

    const skipMeta = searchParams.get('skip_meta') === '1' || searchParams.get('meta') === '0';
    const cacheKey = `meta_${role}`;
    const now = Date.now();
    const cached = metaCache.get(cacheKey);

    let stats = null;
    let cities = null;

    if (!skipMeta) {
      if (cached && (now - cached.at < META_CACHE_TTL)) {
        stats = cached.stats;
        cities = cached.cities;
      } else {
        const [roleCountsRes, citiesRes, kpiRes] = await Promise.all([
          queryWithConnectionRetry(`
            ${UNIFIED_USERS_CTE}
            SELECT
              COUNT(*)::int AS count_all,
              COUNT(*) FILTER (WHERE LOWER(role) = 'customer')::int AS count_customer,
              COUNT(*) FILTER (WHERE LOWER(role) = 'vendor')::int AS count_vendor,
              COUNT(*) FILTER (WHERE LOWER(role) = 'contractor')::int AS count_contractor,
              COUNT(*) FILTER (WHERE LOWER(role) = 'agent')::int AS count_agent,
              COUNT(*) FILTER (WHERE LOWER(role) = 'supplier')::int AS count_supplier
            FROM unified_users
          `),
          queryWithConnectionRetry(`
            ${UNIFIED_USERS_CTE}
            SELECT DISTINCT delivery_city
            FROM unified_users
            WHERE delivery_city IS NOT NULL AND TRIM(delivery_city) != ''
            ORDER BY delivery_city ASC
          `),
          queryWithConnectionRetry(`
            ${UNIFIED_USERS_CTE}
            SELECT
              COUNT(*)::int AS total_users,
              COUNT(*) FILTER (WHERE NOT COALESCE(u.is_blocked, false))::int AS active_users,
              COUNT(*) FILTER (WHERE COALESCE(u.is_blocked, false))::int AS blocked_users,
              COUNT(DISTINCT CASE WHEN (COALESCE(b.order_count, 0) + COALESCE(m.order_count, 0)) > 0 THEN u.id END)::int AS with_orders_count,
              COALESCE(SUM(COALESCE(b.total_spent, 0) + COALESCE(m.total_spent, 0)), 0)::numeric AS total_lifetime_spent
            FROM unified_users u
            LEFT JOIN (
              SELECT user_id, COUNT(*)::int AS order_count,
                     COALESCE(SUM(COALESCE(final_amount, total_amount, 0)), 0)::numeric AS total_spent
              FROM service_bookings
              WHERE user_id IS NOT NULL
              GROUP BY user_id
            ) b ON b.user_id = u.user_id
            LEFT JOIN (
              SELECT user_id AS uid, COUNT(*)::int AS order_count,
                     COALESCE(SUM(COALESCE(grand_total, amount_received, product_total, 0)), 0)::numeric AS total_spent
              FROM material_enquiries
              WHERE user_id IS NOT NULL
              GROUP BY user_id
            ) m ON m.uid = u.user_id
            WHERE ($1 = 'all' OR LOWER(u.role) = LOWER($1))
          `, [role]),
        ]);

        const countsRow = roleCountsRes.rows[0] || {};
        const kpiRow = kpiRes.rows[0] || {};
        const totalUsers = Number(kpiRow.total_users || 0);
        const activeUsers = Number(kpiRow.active_users || 0);
        const blockedUsers = Number(kpiRow.blocked_users || 0);
        const withOrders = Number(kpiRow.with_orders_count || 0);
        const totalSpent = Number(kpiRow.total_lifetime_spent || 0);

        stats = {
          total_users: totalUsers,
          active_users: activeUsers,
          blocked_users: blockedUsers,
          with_orders_count: withOrders,
          zero_orders_count: Math.max(0, totalUsers - withOrders),
          total_lifetime_spent: totalSpent,
          current_role: role,
          role_counts: {
            all: Number(countsRow.count_all || 0),
            customer: Number(countsRow.count_customer || 0),
            vendor: Number(countsRow.count_vendor || 0),
            contractor: Number(countsRow.count_contractor || 0),
            agent: Number(countsRow.count_agent || 0),
            supplier: Number(countsRow.count_supplier || 0),
          },
        };

        cities = citiesRes.rows.map((r) => r.delivery_city).filter(Boolean);
        metaCache.set(cacheKey, { stats, cities, at: now });
      }
    } else if (cached) {
      stats = cached.stats;
      cities = cached.cities;
    }

    let result;
    let total = 0;

    if (orderFilter === 'all') {
      const countRes = await queryWithConnectionRetry(
        `
        ${UNIFIED_USERS_CTE}
        SELECT COUNT(*)::int AS total
        FROM unified_users u
        ${baseWhere}
        `,
        baseParams
      );
      total = Number(countRes.rows[0]?.total || 0);

      const pageRes = await queryWithConnectionRetry(
        `
        ${UNIFIED_USERS_CTE}
        SELECT u.id, u.user_id, u.name, u.email, u.phone, u.delivery_city, u.created_at, u.last_login_at,
               u.is_blocked, u.blocked_reason, u.blocked_at, u.role, u.source_table
        FROM unified_users u
        ${baseWhere}
        ORDER BY u.created_at DESC
        LIMIT $7 OFFSET $8
        `,
        [...baseParams, pageSize, offset]
      );

      const userIds = pageRes.rows.map((r) => r.user_id).filter(Boolean);
      let statsByUser = new Map();
      if (userIds.length) {
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
          [userIds]
        );
        statsByUser = new Map(pageStats.rows.map((r) => [r.user_id, r]));
      }

      result = {
        rows: pageRes.rows.map((u) => {
          const s = u.user_id ? statsByUser.get(u.user_id) : null;
          return {
            ...u,
            total_orders: Number(s?.total_orders || 0),
            total_spent: Number(s?.total_spent || 0),
          };
        }),
      };
    } else {
      const filtered = await queryWithConnectionRetry(
        `
        ${UNIFIED_USERS_CTE},
        page_stats AS (
          SELECT
            u.id AS user_id,
            COALESCE(b.order_count, 0) + COALESCE(m.order_count, 0) AS total_orders,
            COALESCE(b.total_spent, 0) + COALESCE(m.total_spent, 0) AS total_spent
          FROM unified_users u
          LEFT JOIN (
            SELECT user_id, COUNT(*)::int AS order_count,
                   COALESCE(SUM(COALESCE(final_amount, total_amount, 0)), 0)::numeric AS total_spent
            FROM service_bookings GROUP BY user_id
          ) b ON b.user_id = u.user_id
          LEFT JOIN (
            SELECT user_id AS uid, COUNT(*)::int AS order_count,
                   COALESCE(SUM(COALESCE(grand_total, amount_received, product_total, 0)), 0)::numeric AS total_spent
            FROM material_enquiries WHERE user_id IS NOT NULL GROUP BY user_id
          ) m ON m.uid = u.user_id
        ),
        filtered_users AS (
          SELECT
            u.id, u.user_id, u.name, u.email, u.phone, u.delivery_city, u.created_at, u.last_login_at,
            u.is_blocked, u.blocked_reason, u.blocked_at, u.role, u.source_table,
            COALESCE(os.total_orders, 0)::int AS total_orders,
            COALESCE(os.total_spent, 0)::numeric AS total_spent
          FROM unified_users u
          LEFT JOIN page_stats os ON os.user_id = u.user_id
          ${baseWhere}
            AND (
              $7 = 'zero' AND COALESCE(os.total_orders, 0) = 0
              OR $7 = 'has_orders' AND COALESCE(os.total_orders, 0) > 0
            )
        )
        SELECT *, COUNT(*) OVER()::int AS total_count
        FROM filtered_users
        ORDER BY created_at DESC
        LIMIT $8 OFFSET $9
        `,
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

export async function POST(req) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      role = 'Customer',
      name,
      email,
      phone,
      password,
      city,
      state,
      postal_code,
      address,
      // Agent specific
      occupation,
      agent_type = 'contractor',
      experience,
      network,
      specializations = [],
      has_project_management_access = false,
      // Vendor specific
      shop_name,
      business_name,
      business_type,
      services = [],
      // Supplier specific
      aadhaar_number,
      product_categories = [],
    } = body;

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPhone = String(phone || '').trim();
    const cleanName = String(name || shop_name || 'Account').trim();
    const cleanCity = String(city || '').trim();

    if (!cleanEmail) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
    if (!cleanPhone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const rawPassword = password || `${role}@123`;
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const normRole = String(role || 'Customer').toLowerCase();

    // Check existing in users table
    const existingUser = await queryWithConnectionRetry(
      'SELECT id, role FROM users WHERE LOWER(email) = $1 LIMIT 1',
      [cleanEmail]
    );

    let createdId = null;

    if (normRole === 'agent') {
      const existingAgent = await queryWithConnectionRetry(
        "SELECT id FROM agents WHERE LOWER(email) = $1 AND status <> 'Rejected' LIMIT 1",
        [cleanEmail]
      );
      if (existingAgent.rows.length > 0) {
        return NextResponse.json({ success: false, error: 'An active agent with this email already exists' }, { status: 409 });
      }

      const agentRes = await queryWithConnectionRetry(
        `INSERT INTO agents (
          name, email, phone, city, state, occupation, agent_type, experience, network,
          message, status, login_enabled, password_hash, created_at, updated_at,
          auth_version, has_project_management_access, specializations
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Approved', true, $11, NOW(), NOW(), 1, $12, $13::jsonb
        ) RETURNING id, name, email, phone, city, status`,
        [
          cleanName,
          cleanEmail,
          cleanPhone,
          cleanCity,
          state || '',
          occupation || 'Civil Engineer',
          agent_type || 'contractor',
          experience || '1-2 Years',
          network || '100+',
          'Created by Administrator',
          passwordHash,
          Boolean(has_project_management_access),
          JSON.stringify(Array.isArray(specializations) ? specializations : [])
        ]
      );
      createdId = agentRes.rows[0]?.id;

      if (existingUser.rows.length === 0) {
        await queryWithConnectionRetry(
          `INSERT INTO users (name, email, phone, delivery_city, password, role, is_blocked, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, 'Agent', false, NOW(), NOW())`,
          [cleanName, cleanEmail, cleanPhone, cleanCity, passwordHash]
        );
      } else {
        await queryWithConnectionRetry(
          `UPDATE users SET role = 'Agent', phone = COALESCE(phone, $2), delivery_city = COALESCE(delivery_city, $3) WHERE id = $1`,
          [existingUser.rows[0].id, cleanPhone, cleanCity]
        );
      }

    } else if (normRole === 'vendor' || normRole === 'contractor') {
      const vShop = shop_name || cleanName;
      const vBiz = business_name || vShop;
      const vType = business_type || (normRole === 'contractor' ? 'contractor' : 'vendor');

      const existingVendor = await queryWithConnectionRetry(
        'SELECT id FROM vendors WHERE LOWER(email) = $1 LIMIT 1',
        [cleanEmail]
      );
      if (existingVendor.rows.length > 0) {
        return NextResponse.json({ success: false, error: 'A vendor with this email already exists' }, { status: 409 });
      }

      const vendorRes = await queryWithConnectionRetry(
        `INSERT INTO vendors (
          vendor_name, shop_name, business_name, email, phone, city, state, postal_code, country,
          business_type, status, verification_status, password_hash, is_approved, approval_date,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active', 'verified', $11, true, NOW(), NOW(), NOW()
        ) RETURNING id, vendor_name, email, phone, city, status`,
        [
          cleanName,
          vShop,
          vBiz,
          cleanEmail,
          cleanPhone,
          cleanCity,
          state || '',
          postal_code || '',
          'India',
          vType,
          passwordHash
        ]
      );
      createdId = vendorRes.rows[0]?.id;

      if (Array.isArray(services) && services.length > 0 && createdId) {
        for (const sId of services) {
          const numId = Number(sId);
          if (numId > 0) {
            await queryWithConnectionRetry(
              `INSERT INTO vendor_services (vendor_id, quick_service_id, is_active)
               VALUES ($1, $2, TRUE)
               ON CONFLICT (vendor_id, quick_service_id)
               DO UPDATE SET is_active = TRUE`,
              [createdId, numId]
            );
          }
        }
      }

      if (existingUser.rows.length === 0) {
        await queryWithConnectionRetry(
          `INSERT INTO users (name, email, phone, delivery_city, password, role, is_blocked, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, 'Vendor', false, NOW(), NOW())`,
          [cleanName, cleanEmail, cleanPhone, cleanCity, passwordHash]
        );
      } else {
        await queryWithConnectionRetry(
          `UPDATE users SET role = 'Vendor', phone = COALESCE(phone, $2), delivery_city = COALESCE(delivery_city, $3) WHERE id = $1`,
          [existingUser.rows[0].id, cleanPhone, cleanCity]
        );
      }

    } else if (normRole === 'supplier') {
      const sShop = shop_name || cleanName;
      const sBiz = business_name || sShop;

      const existingSupplier = await queryWithConnectionRetry(
        'SELECT id FROM suppliers WHERE LOWER(email) = $1 LIMIT 1',
        [cleanEmail]
      );
      if (existingSupplier.rows.length > 0) {
        return NextResponse.json({ success: false, error: 'A supplier with this email already exists' }, { status: 409 });
      }

      const prodCats = Array.isArray(product_categories) && product_categories.length > 0
        ? product_categories
        : ['Cement', 'Bricks', 'Steel'];

      const supplierRes = await queryWithConnectionRetry(
        `INSERT INTO suppliers (
          shop_name, business_name, email, phone, city, state, postal_code, country,
          aadhaar_number, aadhaar_status, product_categories, status, is_active,
          password_hash, created_at, updated_at, approved_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, 'verified', $10, 'approved', true, $11, NOW(), NOW(), NOW()
        ) RETURNING id, shop_name, email, phone, city, status`,
        [
          sShop,
          sBiz,
          cleanEmail,
          cleanPhone,
          cleanCity,
          state || '',
          postal_code || '',
          'India',
          aadhaar_number || null,
          prodCats,
          passwordHash
        ]
      );
      createdId = supplierRes.rows[0]?.id;

      if (existingUser.rows.length === 0) {
        await queryWithConnectionRetry(
          `INSERT INTO users (name, email, phone, delivery_city, password, role, is_blocked, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, 'Supplier', false, NOW(), NOW())`,
          [cleanName, cleanEmail, cleanPhone, cleanCity, passwordHash]
        );
      } else {
        await queryWithConnectionRetry(
          `UPDATE users SET role = 'Supplier', phone = COALESCE(phone, $2), delivery_city = COALESCE(delivery_city, $3) WHERE id = $1`,
          [existingUser.rows[0].id, cleanPhone, cleanCity]
        );
      }

    } else {
      if (existingUser.rows.length > 0) {
        return NextResponse.json({ success: false, error: 'A customer account with this email already exists' }, { status: 409 });
      }

      const userRes = await queryWithConnectionRetry(
        `INSERT INTO users (name, email, phone, delivery_city, password, role, is_blocked, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, 'Customer', false, NOW(), NOW())
         RETURNING id, name, email, phone, delivery_city, role`,
        [cleanName, cleanEmail, cleanPhone, cleanCity, passwordHash]
      );
      createdId = userRes.rows[0]?.id;
    }

    return NextResponse.json({
      success: true,
      message: `${role} account created successfully.`,
      data: {
        id: createdId,
        role,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        city: cleanCity,
        temporary_password: rawPassword
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Admin user creation error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not create account' }, { status: 500 });
  }
}

