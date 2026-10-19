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

    let user = null;
    let userRole = 'Customer';
    let agentData = null;
    let vendorData = null;
    let supplierData = null;

    if (userId >= 3000000) {
      const aId = userId - 3000000;
      const aRes = await pool.query('SELECT * FROM agents WHERE id = $1', [aId]);
      if (aRes.rows[0]) {
        agentData = aRes.rows[0];
        userRole = 'Agent';
        user = {
          id: userId,
          real_id: aId,
          name: agentData.name,
          email: agentData.email,
          phone: agentData.phone,
          delivery_city: agentData.city,
          created_at: agentData.created_at,
          last_login_at: agentData.last_login_at,
          is_blocked: agentData.status === 'Rejected' || !agentData.login_enabled,
          blocked_reason: agentData.status === 'Rejected' ? 'Application Rejected' : null,
          blocked_at: null,
          role: 'Agent',
          source_table: 'agents',
        };
      }
    } else if (userId >= 2000000) {
      const sId = userId - 2000000;
      const sRes = await pool.query('SELECT * FROM suppliers WHERE id = $1', [sId]);
      if (sRes.rows[0]) {
        supplierData = sRes.rows[0];
        userRole = 'Supplier';
        user = {
          id: userId,
          real_id: sId,
          name: supplierData.contact_person || supplierData.business_name || supplierData.shop_name || 'Supplier',
          email: supplierData.email,
          phone: supplierData.phone,
          delivery_city: supplierData.city,
          created_at: supplierData.created_at,
          last_login_at: supplierData.last_login_at,
          is_blocked: !supplierData.is_active || supplierData.status === 'rejected',
          blocked_reason: supplierData.rejection_reason,
          blocked_at: null,
          role: 'Supplier',
          source_table: 'suppliers',
        };
      }
    } else if (userId >= 1000000) {
      const vId = userId - 1000000;
      const vRes = await pool.query('SELECT * FROM vendors WHERE id = $1', [vId]);
      if (vRes.rows[0]) {
        vendorData = vRes.rows[0];
        userRole = (vendorData.business_type || '').toLowerCase().includes('contractor') ? 'Contractor' : 'Vendor';
        user = {
          id: userId,
          real_id: vId,
          name: vendorData.vendor_name || vendorData.business_name || vendorData.shop_name || 'Vendor',
          email: vendorData.email,
          phone: vendorData.phone,
          delivery_city: vendorData.city,
          created_at: vendorData.created_at,
          last_login_at: vendorData.last_login,
          is_blocked: vendorData.status === 'inactive' || vendorData.status === 'rejected' || vendorData.status === 'blocked',
          blocked_reason: null,
          blocked_at: null,
          role: userRole,
          source_table: 'vendors',
        };
      }
    } else {
      const userResult = await pool.query(
        `SELECT u.id, u.name, u.email, u.phone, u.delivery_city, u.created_at, u.last_login_at,
                u.is_blocked, u.blocked_reason, u.blocked_at,
                CASE
                  WHEN a.id IS NOT NULL THEN 'Agent'
                  WHEN v.id IS NOT NULL THEN (CASE WHEN LOWER(COALESCE(v.business_type, '')) LIKE '%contractor%' THEN 'Contractor' ELSE 'Vendor' END)
                  WHEN s.id IS NOT NULL THEN 'Supplier'
                  WHEN NULLIF(u.role, '') IS NOT NULL AND LOWER(u.role) NOT IN ('customer', 'user') THEN u.role
                  ELSE 'Customer'
                END AS role
         FROM users u
         LEFT JOIN agents a ON LOWER(u.email) = LOWER(a.email)
         LEFT JOIN vendors v ON LOWER(u.email) = LOWER(v.email)
         LEFT JOIN suppliers s ON LOWER(u.email) = LOWER(s.email)
         WHERE u.id = $1`,
        [userId]
      );
      if (userResult.rows[0]) {
        user = userResult.rows[0];
        userRole = user.role || 'Customer';
        if (userRole === 'Agent' || !agentData) {
          const a = await pool.query('SELECT * FROM agents WHERE LOWER(email) = LOWER($1)', [user.email]);
          if (a.rows[0]) agentData = a.rows[0];
        }
        if (userRole === 'Vendor' || userRole === 'Contractor' || !vendorData) {
          const v = await pool.query('SELECT * FROM vendors WHERE LOWER(email) = LOWER($1)', [user.email]);
          if (v.rows[0]) vendorData = v.rows[0];
        }
        if (userRole === 'Supplier' || !supplierData) {
          const s = await pool.query('SELECT * FROM suppliers WHERE LOWER(email) = LOWER($1)', [user.email]);
          if (s.rows[0]) supplierData = s.rows[0];
        }
      }
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    let agentLeads = { rows: [] };
    let agentSchedule = { rows: [] };
    let agentUnreadActivity = { rows: [{ count: 0 }] };
    let agentProjectsCount = { rows: [{ count: 0 }] };
    if (agentData?.id) {
      [agentLeads, agentSchedule, agentUnreadActivity, agentProjectsCount] = await Promise.all([
        optionalQuery(
          `SELECT id, client_name, client_phone, client_email, service_type, city, status, created_at, final_amount, lead_stage
           FROM agent_leads
           WHERE agent_id = $1
           ORDER BY created_at DESC
           LIMIT 50`,
          [agentData.id],
          'Unable to load agent leads.'
        ),
        optionalQuery(
          `SELECT id, title, schedule_date, schedule_time, client_name, client_phone, status
           FROM agent_schedule
           WHERE agent_id = $1
           ORDER BY schedule_date ASC, schedule_time ASC NULLS LAST
           LIMIT 50`,
          [agentData.id],
          'Unable to load agent schedule.'
        ),
        optionalQuery(
          `SELECT COUNT(*)::int AS count FROM agent_notifications WHERE agent_id = $1 AND is_read = false`,
          [agentData.id],
          'Unable to load agent notifications.'
        ),
        optionalQuery(
          `SELECT COUNT(*)::int AS count FROM projects WHERE assigned_agent_id = $1`,
          [agentData.id],
          'Unable to load agent projects.'
        ),
      ]);
    }

    let vendorProducts = { rows: [] };
    let vendorOrders = { rows: [] };
    let vendorAssignedServices = { rows: [] };
    let allQuickServices = { rows: [] };
    let vendorBookingsCounts = { rows: [{ total: 0, active: 0, completed: 0 }] };
    let vendorRecentBookings = { rows: [] };
    let vendorCrmLeads = { rows: [] };
    if (vendorData?.id) {
      [
        vendorProducts,
        vendorOrders,
        vendorAssignedServices,
        allQuickServices,
        vendorBookingsCounts,
        vendorRecentBookings,
        vendorCrmLeads,
      ] = await Promise.all([
        optionalQuery(
          `SELECT id, name, category, price, is_available, created_at
           FROM supplier_materials
           WHERE vendor_id = $1
           ORDER BY created_at DESC
           LIMIT 50`,
          [vendorData.id],
          'Unable to load vendor products.'
        ),
        optionalQuery(
          `SELECT id, order_number, total_amount, status, created_at
           FROM vendor_orders
           WHERE vendor_id = $1
           ORDER BY created_at DESC
           LIMIT 50`,
          [vendorData.id],
          'Unable to load vendor orders.'
        ),
        optionalQuery(
          `SELECT qs.id, qs.label, qs.icon
           FROM vendor_services vs
           JOIN quick_services qs ON qs.id = vs.quick_service_id
           WHERE vs.vendor_id = $1 AND vs.is_active = TRUE`,
          [vendorData.id],
          'Unable to load vendor assigned services.'
        ),
        optionalQuery(
          `SELECT id, label, icon
           FROM quick_services
           WHERE COALESCE(is_service_active, TRUE) = TRUE
           ORDER BY label ASC`,
          [],
          'Unable to load quick services catalog.'
        ),
        optionalQuery(
          `SELECT COUNT(*)::int AS total,
                  COUNT(*) FILTER (WHERE status NOT IN ('COMPLETED', 'CANCELLED', 'REJECTED'))::int AS active,
                  COUNT(*) FILTER (WHERE status = 'COMPLETED')::int AS completed
           FROM service_bookings
           WHERE vendor_id = $1`,
          [vendorData.id],
          'Unable to load vendor booking counts.'
        ),
        optionalQuery(
          `SELECT sb.id, sb.booking_reference, sb.status, sb.user_name, sb.service_city, sb.final_amount, sb.created_at, qs.label AS service_label
           FROM service_bookings sb
           LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
           WHERE sb.vendor_id = $1
           ORDER BY sb.created_at DESC
           LIMIT 5`,
          [vendorData.id],
          'Unable to load vendor recent bookings.'
        ),
        optionalQuery(
          `SELECT id, client_name, client_phone, service_type, city, status, lead_stage
           FROM agent_leads
           WHERE assigned_vendor_id = $1
              OR (LOWER(TRIM(city)) = LOWER(TRIM($2)) AND status = 'New')
           ORDER BY created_at DESC
           LIMIT 5`,
          [vendorData.id, vendorData.city || ''],
          'Unable to load vendor CRM leads.'
        ),
      ]);
    }

    let supplierEnquiries = { rows: [] };
    let supplierMaterials = { rows: [] };
    let supplierStats = { rows: [{ total: 0, fulfilled: 0, earned: 0 }] };
    if (supplierData?.id) {
      [supplierEnquiries, supplierMaterials, supplierStats] = await Promise.all([
        optionalQuery(
          `SELECT id, order_reference, category_name, material_type, grand_total, status, created_at, delivery_address
           FROM material_enquiries
           WHERE accepted_by_supplier_id = $1
           ORDER BY created_at DESC
           LIMIT 50`,
          [supplierData.id],
          'Unable to load supplier material enquiries.'
        ),
        optionalQuery(
          `SELECT id, name, category, price, is_available, created_at
           FROM supplier_materials
           WHERE supplier_id = $1
           ORDER BY created_at DESC
           LIMIT 50`,
          [supplierData.id],
          'Unable to load supplier materials.'
        ),
        optionalQuery(
          `SELECT COUNT(*)::int AS total,
                  COUNT(*) FILTER (WHERE status = 'fulfilled')::int AS fulfilled,
                  COALESCE(SUM(grand_total) FILTER (WHERE status = 'fulfilled'), 0)::numeric AS earned
           FROM material_enquiries
           WHERE accepted_by_supplier_id = $1`,
          [supplierData.id],
          'Unable to load supplier statistics.'
        ),
      ]);
    }

    const [bookings, materialOrders, couponUsage, addresses, moderationLog] = await Promise.all([
      optionalQuery(
        `SELECT sb.id, sb.booking_reference AS reference,
                COALESCE(qs.label, 'Service booking') AS description,
                COALESCE(sb.final_amount, sb.total_amount, 0)::numeric AS total,
                sb.status, sb.created_at
         FROM service_bookings sb
         LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
         WHERE (sb.user_id = $1 AND $1 < 1000000)
            OR (sb.user_email IS NOT NULL AND LOWER(sb.user_email) = LOWER($2))
         ORDER BY sb.created_at DESC`,
        [userId, user.email],
        'Unable to load service order history.'
      ),
      optionalQuery(
        `SELECT id, order_reference AS reference,
                COALESCE(NULLIF(TRIM(material_type), ''), NULLIF(TRIM(category_name), ''), 'Shop Order') AS description,
                COALESCE(grand_total, amount_received, product_total, 0)::numeric AS total,
                status, created_at
         FROM material_enquiries
         WHERE (user_id = $1 AND $1 < 1000000)
            OR (user_email IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM($2)))
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
         WHERE ((user_id = $1 AND $1 < 1000000) OR (user_email IS NOT NULL AND LOWER(TRIM(user_email)) = LOWER(TRIM($2))))
           AND coupon_code IS NOT NULL AND TRIM(coupon_code) != ''
         ORDER BY created_at DESC`,
        [userId, user.email],
        'Unable to load coupon history.'
      ),
      optionalQuery(
        `SELECT id, label, address_line, city, pincode, is_default, created_at
         FROM user_addresses
         WHERE user_id = $1 AND $1 < 1000000
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
        role: userRole,
        user: {
          ...user,
          total_orders: combinedOrders.length,
          total_spent: totalSpent,
        },
        agent: agentData,
        agentLeads: agentLeads.rows,
        agentWorkspace: {
          leads: agentLeads.rows,
          leadsCount: agentLeads.rows.length,
          schedule: agentSchedule.rows,
          scheduleCount: agentSchedule.rows.length,
          projectsCount: agentProjectsCount.rows[0]?.count || 0,
          unreadActivityCount: agentUnreadActivity.rows[0]?.count || 0,
        },
        vendor: vendorData ? {
          ...vendorData,
          has_aadhar_image: Boolean(vendorData.aadhar_image),
        } : null,
        vendorProducts: vendorProducts.rows,
        vendorOrders: vendorOrders.rows,
        vendorAssignedServices: vendorAssignedServices.rows,
        allServices: allQuickServices.rows,
        vendorWorkspace: {
          counts: {
            total_bookings: vendorBookingsCounts.rows[0]?.total || 0,
            active_bookings: vendorBookingsCounts.rows[0]?.active || 0,
            completed_bookings: vendorBookingsCounts.rows[0]?.completed || 0,
            crm_leads: vendorCrmLeads.rows.length,
          },
          bookings: vendorRecentBookings.rows,
          crm_leads: vendorCrmLeads.rows,
        },
        supplier: supplierData,
        supplierEnquiries: supplierEnquiries.rows,
        supplierMaterials: supplierMaterials.rows,
        supplierStats: {
          totalEnquiries: supplierStats.rows[0]?.total || 0,
          fulfilledOrders: supplierStats.rows[0]?.fulfilled || 0,
          totalEarned: supplierStats.rows[0]?.earned || 0,
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

    if (userId >= 3000000) {
      const aId = userId - 3000000;
      const result = await pool.query('DELETE FROM agents WHERE id = $1 RETURNING id, name, email', [aId]);
      if (!result.rows[0]) return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
      return NextResponse.json({ success: true, message: `Agent ${result.rows[0].email} deleted successfully`, data: result.rows[0] });
    } else if (userId >= 2000000) {
      const sId = userId - 2000000;
      const result = await pool.query('DELETE FROM suppliers WHERE id = $1 RETURNING id, shop_name AS name, email', [sId]);
      if (!result.rows[0]) return NextResponse.json({ success: false, error: 'Supplier not found' }, { status: 404 });
      return NextResponse.json({ success: true, message: `Supplier ${result.rows[0].email} deleted successfully`, data: result.rows[0] });
    } else if (userId >= 1000000) {
      const vId = userId - 1000000;
      const result = await pool.query('DELETE FROM vendors WHERE id = $1 RETURNING id, shop_name AS name, email', [vId]);
      if (!result.rows[0]) return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
      return NextResponse.json({ success: true, message: `Vendor ${result.rows[0].email} deleted successfully`, data: result.rows[0] });
    } else {
      await pool.query('UPDATE material_enquiries SET user_id = NULL WHERE user_id = $1', [userId]);
      await pool.query('DELETE FROM user_addresses WHERE user_id = $1', [userId]);
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, name, email', [userId]);
      if (!result.rows[0]) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      return NextResponse.json({ success: true, message: `User ${result.rows[0].email} deleted successfully`, data: result.rows[0] });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not delete user' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    if (!await requireAdmin(req)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const userId = Number(id);
    if (!Number.isInteger(userId)) {
      return NextResponse.json({ success: false, error: 'Invalid user id' }, { status: 400 });
    }

    const body = await req.json();
    const role = String(body.role || '').trim();
    if (!role) {
      return NextResponse.json({ success: false, error: 'Role is required' }, { status: 400 });
    }

    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Customer'");
    let updatedUser;
    if (userId >= 3000000) {
      const aId = userId - 3000000;
      const aRes = await pool.query('SELECT name, email, phone FROM agents WHERE id = $1', [aId]);
      if (aRes.rows[0]) {
        const uRes = await pool.query(
          `INSERT INTO users (name, email, phone, role) VALUES ($1, $2, $3, $4)
           ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
           RETURNING id, name, email, role`,
          [aRes.rows[0].name, aRes.rows[0].email, aRes.rows[0].phone, role]
        );
        updatedUser = uRes.rows[0];
      }
    } else if (userId >= 2000000) {
      const sId = userId - 2000000;
      const sRes = await pool.query('SELECT business_name, shop_name, email, phone FROM suppliers WHERE id = $1', [sId]);
      if (sRes.rows[0]) {
        const uRes = await pool.query(
          `INSERT INTO users (name, email, phone, role) VALUES ($1, $2, $3, $4)
           ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
           RETURNING id, name, email, role`,
          [sRes.rows[0].business_name || sRes.rows[0].shop_name || 'Supplier', sRes.rows[0].email, sRes.rows[0].phone, role]
        );
        updatedUser = uRes.rows[0];
      }
    } else if (userId >= 1000000) {
      const vId = userId - 1000000;
      const vRes = await pool.query('SELECT vendor_name, business_name, shop_name, email, phone FROM vendors WHERE id = $1', [vId]);
      if (vRes.rows[0]) {
        const uRes = await pool.query(
          `INSERT INTO users (name, email, phone, role) VALUES ($1, $2, $3, $4)
           ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
           RETURNING id, name, email, role`,
          [vRes.rows[0].vendor_name || vRes.rows[0].business_name || vRes.rows[0].shop_name || 'Vendor', vRes.rows[0].email, vRes.rows[0].phone, role]
        );
        updatedUser = uRes.rows[0];
      }
    } else {
      const result = await pool.query(
        'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, role',
        [role, userId]
      );
      updatedUser = result.rows[0];
    }

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Could not update user role' }, { status: 500 });
  }
}
