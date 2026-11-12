import { NextResponse } from 'next/server';
import pool, { isTransientConnectionError, queryReadWithRetry } from '@/lib/db';
import { requireRole } from '@/lib/auth';

const unauthorized = () =>
  NextResponse.json({ success: false, error: 'Admin access required' }, { status: 401 });

function dbUnavailableResponse(error, context) {
  console.error(`[product-approvals] ${context}:`, error?.code || '', error?.message || error);
  return NextResponse.json(
    {
      success: false,
      error: 'Database temporarily unavailable. Please try again in a moment.',
    },
    { status: 503 }
  );
}

function internalErrorResponse(error, context, publicMessage) {
  console.error(`[product-approvals] ${context}:`, error?.code || '', error?.message || error);
  return NextResponse.json({ success: false, error: publicMessage }, { status: 500 });
}

export async function GET(req) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const countOnly = searchParams.get('count_only') === 'true' || searchParams.get('count_only') === '1';

    if (countOnly) {
      // Table is currently small (EXPLAIN prefers seq scan); no expression index added.
      const pendingCountRes = await queryReadWithRetry(`
        SELECT COUNT(*)::int AS count
        FROM supplier_materials m
        WHERE (m.vendor_id IS NOT NULL OR (m.supplier_id IS NOT NULL AND m.supplier_id > 0))
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

    const whereClauses = ['(m.vendor_id IS NOT NULL OR (m.supplier_id IS NOT NULL AND m.supplier_id > 0))'];
    const queryParams = [];

    if (statusFilter === 'pending') {
      whereClauses.push("COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'pending'");
    } else if (statusFilter === 'approved') {
      whereClauses.push("COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'approved'");
    } else if (statusFilter === 'rejected') {
      whereClauses.push("COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'rejected'");
    }

    if (search) {
      queryParams.push(`%${search}%`);
      const paramIdx = queryParams.length;
      whereClauses.push(`(
        LOWER(m.name) LIKE $${paramIdx} OR
        LOWER(COALESCE(m.category, '')) LIKE $${paramIdx} OR
        LOWER(COALESCE(v.vendor_name, '')) LIKE $${paramIdx} OR
        LOWER(COALESCE(v.shop_name, '')) LIKE $${paramIdx} OR
        LOWER(COALESCE(v.email, '')) LIKE $${paramIdx} OR
        LOWER(COALESCE(s.shop_name, '')) LIKE $${paramIdx} OR
        LOWER(COALESCE(s.business_name, '')) LIKE $${paramIdx} OR
        LOWER(COALESCE(s.email, '')) LIKE $${paramIdx}
      )`);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // One round-trip for global stats + filtered total (reduces pool pressure vs 2 queries).
    const metaRes = await queryReadWithRetry(
      `
      WITH scoped AS (
        SELECT
          m.id,
          COALESCE(m.specifications->'__approval__'->>'status', 'approved') AS approval_status
        FROM supplier_materials m
        LEFT JOIN vendors v ON v.id = m.vendor_id
        LEFT JOIN suppliers s ON s.id = m.supplier_id
        WHERE (m.vendor_id IS NOT NULL OR (m.supplier_id IS NOT NULL AND m.supplier_id > 0))
      ),
      filtered AS (
        SELECT m.id
        FROM supplier_materials m
        LEFT JOIN vendors v ON v.id = m.vendor_id
        LEFT JOIN suppliers s ON s.id = m.supplier_id
        ${whereSql}
      )
      SELECT
        (SELECT COUNT(*)::int FROM scoped WHERE approval_status = 'pending') AS pending,
        (SELECT COUNT(*)::int FROM scoped WHERE approval_status = 'approved') AS approved,
        (SELECT COUNT(*)::int FROM scoped WHERE approval_status = 'rejected') AS rejected,
        (SELECT COUNT(*)::int FROM scoped) AS total,
        (SELECT COUNT(*)::int FROM filtered) AS filtered_total
      `,
      queryParams
    );

    const meta = metaRes.rows[0] || {};
    const stats = {
      pending: meta.pending || 0,
      approved: meta.approved || 0,
      rejected: meta.rejected || 0,
      total: meta.total || 0,
    };
    const totalFiltered = meta.filtered_total || 0;

    const listParams = [...queryParams, limit, offset];
    const limitIdx = queryParams.length + 1;
    const offsetIdx = queryParams.length + 2;

    const listRes = await queryReadWithRetry(
      `SELECT
         m.id,
         m.vendor_id,
         m.supplier_id,
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
         CASE WHEN m.supplier_id > 0 THEN COALESCE(s.shop_name, s.business_name, 'Supplier') ELSE v.vendor_name END AS vendor_name,
         CASE WHEN m.supplier_id > 0 THEN COALESCE(s.shop_name, s.business_name, 'Supplier') ELSE v.shop_name END AS shop_name,
         CASE WHEN m.supplier_id > 0 THEN s.email ELSE v.email END AS vendor_email,
         CASE WHEN m.supplier_id > 0 THEN s.phone ELSE v.phone END AS vendor_phone,
         CASE WHEN m.supplier_id > 0 THEN s.city ELSE v.city END AS vendor_city,
         CASE WHEN m.supplier_id > 0 THEN s.state ELSE v.state END AS vendor_state,
         CASE WHEN m.supplier_id > 0 THEN (s.status = 'approved' AND s.is_active = TRUE) ELSE COALESCE(v.is_approved, false) END AS vendor_is_approved,
         CASE WHEN m.supplier_id > 0 THEN s.status ELSE v.verification_status END AS vendor_verification_status,
         CASE WHEN m.supplier_id > 0 THEN s.status ELSE v.status END AS vendor_status
       FROM supplier_materials m
       LEFT JOIN vendors v ON v.id = m.vendor_id
       LEFT JOIN suppliers s ON s.id = m.supplier_id
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
    if (isTransientConnectionError(error)) {
      return dbUnavailableResponse(error, 'GET connect/query');
    }
    return internalErrorResponse(error, 'GET unexpected', 'Could not load product approvals');
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

    // Writes use pool.query with NO automatic retry (avoid duplicate approvals).
    const existing = await pool.query(
      `SELECT m.id, m.name, m.vendor_id, m.supplier_id, m.specifications, m.is_available,
              CASE WHEN m.supplier_id > 0 THEN COALESCE(s.shop_name, s.business_name, 'Supplier') ELSE v.vendor_name END AS partner_name,
              CASE WHEN m.supplier_id > 0 THEN s.email ELSE v.email END AS partner_email
       FROM supplier_materials m
       LEFT JOIN vendors v ON v.id = m.vendor_id
       LEFT JOIN suppliers s ON s.id = m.supplier_id
       WHERE m.id = $1 AND (m.vendor_id IS NOT NULL OR (m.supplier_id IS NOT NULL AND m.supplier_id > 0))`,
      [id]
    );

    if (!existing.rows.length) {
      return NextResponse.json(
        { success: false, error: 'Product not found or not submitted for approval' },
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
         WHERE id = $2 AND (vendor_id IS NOT NULL OR (supplier_id IS NOT NULL AND supplier_id > 0))
         RETURNING id, name, is_available, specifications`,
        [JSON.stringify(approvalMetadata), id]
      );

      if (globalThis.__shopProductCache) globalThis.__shopProductCache.clear();

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
         WHERE id = $2 AND (vendor_id IS NOT NULL OR (supplier_id IS NOT NULL AND supplier_id > 0))
         RETURNING id, name, is_available, specifications`,
        [JSON.stringify(rejectionMetadata), id]
      );

      if (globalThis.__shopProductCache) globalThis.__shopProductCache.clear();

      return NextResponse.json({
        success: true,
        message: `Product "${product.name}" rejected`,
        data: result.rows[0],
      });
    }
  } catch (error) {
    if (isTransientConnectionError(error)) {
      return dbUnavailableResponse(error, 'POST connect/query');
    }
    return internalErrorResponse(error, 'POST unexpected', 'Could not update approval status');
  }
}
