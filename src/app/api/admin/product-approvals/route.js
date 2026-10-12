import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';

const unauthorized = () =>
  NextResponse.json({ success: false, error: 'Admin access required' }, { status: 401 });

export async function GET(req) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const countOnly = searchParams.get('count_only') === 'true' || searchParams.get('count_only') === '1';

    // If lightweight count query for sidebar badge
    if (countOnly) {
      const pendingCountRes = await pool.query(`
        SELECT COUNT(*)::int AS count
        FROM supplier_materials m
        WHERE m.vendor_id IS NOT NULL
          AND COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'pending'
      `);
      return NextResponse.json({
        success: true,
        pendingCount: pendingCountRes.rows[0]?.count || 0,
      });
    }

    const statusFilter = (searchParams.get('status') || 'all').toLowerCase();
    const search = String(searchParams.get('search') || '').trim().toLowerCase();
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.max(1, Math.min(100, Number(searchParams.get('limit')) || 20));
    const offset = (page - 1) * limit;

    // Base query conditions for vendor-sourced products
    let whereClauses = ['m.vendor_id IS NOT NULL'];
    let queryParams = [];

    // Filter by approval status
    if (statusFilter === 'pending') {
      whereClauses.push("COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'pending'");
    } else if (statusFilter === 'approved') {
      whereClauses.push("COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'approved'");
    } else if (statusFilter === 'rejected') {
      whereClauses.push("COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'rejected'");
    }

    // Search by product name, category, or vendor details
    if (search) {
      queryParams.push(`%${search}%`);
      const paramIdx = queryParams.length;
      whereClauses.push(`(
        LOWER(m.name) LIKE $${paramIdx} OR
        LOWER(COALESCE(m.category, '')) LIKE $${paramIdx} OR
        LOWER(COALESCE(v.vendor_name, '')) LIKE $${paramIdx} OR
        LOWER(COALESCE(v.shop_name, '')) LIKE $${paramIdx} OR
        LOWER(COALESCE(v.email, '')) LIKE $${paramIdx}
      )`);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Overall stats counts
    const statsRes = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'pending')::int AS pending,
        COUNT(*) FILTER (WHERE COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'approved')::int AS approved,
        COUNT(*) FILTER (WHERE COALESCE(m.specifications->'__approval__'->>'status', 'rejected') = 'rejected')::int AS rejected,
        COUNT(*)::int AS total
      FROM supplier_materials m
      WHERE m.vendor_id IS NOT NULL
    `);
    const stats = statsRes.rows[0] || { pending: 0, approved: 0, rejected: 0, total: 0 };

    // Total count for current filtered query
    const countRes = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM supplier_materials m
       LEFT JOIN vendors v ON v.id = m.vendor_id
       ${whereSql}`,
      queryParams
    );
    const totalFiltered = countRes.rows[0]?.total || 0;

    // Paginated list
    const listParams = [...queryParams, limit, offset];
    const limitIdx = queryParams.length + 1;
    const offsetIdx = queryParams.length + 2;

    const listRes = await pool.query(
      `SELECT
         m.id,
         m.vendor_id,
         m.name,
         m.description,
         m.category,
         m.subcategory,
         m.brand,
         m.price,
         m.compare_at_price,
         m.quote_price_range,
         m.unit,
         m.quantity,
         m.image_url,
         m.images,
         m.specifications,
         m.bulk_pricing,
         m.available_cities,
         m.is_available,
         m.quality_tier,
         m.created_at,
         m.updated_at,
         COALESCE(m.specifications->'__approval__'->>'status', 'approved') AS approval_status,
         m.specifications->'__approval__'->>'rejection_reason' AS rejection_reason,
         m.specifications->'__approval__'->>'approved_by' AS approved_by,
         m.specifications->'__approval__'->>'approved_at' AS approved_at,
         m.specifications->'__approval__'->>'rejected_by' AS rejected_by,
         m.specifications->'__approval__'->>'rejected_at' AS rejected_at,
         v.vendor_name,
         v.shop_name,
         v.email AS vendor_email,
         v.phone AS vendor_phone,
         v.city AS vendor_city,
         v.state AS vendor_state,
         v.is_approved AS vendor_is_approved,
         v.verification_status AS vendor_verification_status,
         v.status AS vendor_status
       FROM supplier_materials m
       LEFT JOIN vendors v ON v.id = m.vendor_id
       ${whereSql}
       ORDER BY
         CASE WHEN COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'pending' THEN 0 ELSE 1 END ASC,
         m.updated_at DESC,
         m.id DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      listParams
    );

    return NextResponse.json({
      success: true,
      data: listRes.rows,
      stats,
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit) || 1,
      },
    });
  } catch (error) {
    console.error('GET admin product-approvals error:', error);
    return NextResponse.json({ success: false, error: 'Could not load product approvals' }, { status: 500 });
  }
}

export async function POST(req) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();

  try {
    const body = await req.json();
    const id = Number(body.id);
    const action = String(body.action || '').trim().toLowerCase();
    const reason = String(body.reason || '').trim();

    if (!Number.isInteger(id) || id < 1) {
      return NextResponse.json({ success: false, error: 'Valid product ID is required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Action must be approve or reject' }, { status: 400 });
    }

    // Verify product exists and is vendor-sourced
    const existing = await pool.query(
      `SELECT m.id, m.name, m.vendor_id, m.specifications, m.is_available,
              v.vendor_name, v.email AS vendor_email
       FROM supplier_materials m
       LEFT JOIN vendors v ON v.id = m.vendor_id
       WHERE m.id = $1 AND m.vendor_id IS NOT NULL`,
      [id]
    );

    if (!existing.rows.length) {
      return NextResponse.json(
        { success: false, error: 'Vendor product not found or not sourced from a vendor' },
        { status: 404 }
      );
    }

    const product = existing.rows[0];
    const adminIdentifier = admin.email || admin.username || (admin.id ? `Admin #${admin.id}` : 'Admin');
    const nowIso = new Date().toISOString();

    if (action === 'approve') {
      const approvalMetadata = {
        status: 'approved',
        approved_by: adminIdentifier,
        approved_at: nowIso,
      };

      const result = await pool.query(
        `UPDATE supplier_materials
         SET is_available = TRUE,
             specifications = jsonb_set(
               COALESCE(specifications, '{}'::jsonb),
               '{__approval__}',
               $1::jsonb,
               TRUE
             ),
             updated_at = NOW()
         WHERE id = $2 AND vendor_id IS NOT NULL
         RETURNING id, name, is_available, specifications`,
        [JSON.stringify(approvalMetadata), id]
      );

      // Audit log note: No dedicated shop products audit log exists in schema, so skipping as per spec.

      return NextResponse.json({
        success: true,
        message: `Product "${product.name}" approved successfully`,
        data: result.rows[0],
      });
    }

    if (action === 'reject') {
      if (!reason || reason.length < 3) {
        return NextResponse.json(
          { success: false, error: 'A rejection reason is required (at least 3 characters)' },
          { status: 400 }
        );
      }

      const rejectionMetadata = {
        status: 'rejected',
        rejection_reason: reason,
        rejected_by: adminIdentifier,
        rejected_at: nowIso,
      };

      const result = await pool.query(
        `UPDATE supplier_materials
         SET is_available = FALSE,
             specifications = jsonb_set(
               COALESCE(specifications, '{}'::jsonb),
               '{__approval__}',
               $1::jsonb,
               TRUE
             ),
             updated_at = NOW()
         WHERE id = $2 AND vendor_id IS NOT NULL
         RETURNING id, name, is_available, specifications`,
        [JSON.stringify(rejectionMetadata), id]
      );

      // Audit log note: No dedicated shop products audit log exists in schema, so skipping as per spec.

      return NextResponse.json({
        success: true,
        message: `Product "${product.name}" rejected`,
        data: result.rows[0],
      });
    }
  } catch (error) {
    console.error('POST admin product-approvals error:', error);
    return NextResponse.json({ success: false, error: 'Could not update approval status' }, { status: 500 });
  }
}
