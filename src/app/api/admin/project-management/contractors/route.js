import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, assertAgentAccess } from '@/lib/project-management';

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const auth = await assertAgentAccess(req, null, 'vendor');
    if (!auth.allowed) return auth.response;

    // 1. Sync any registered contractors from vendors table into pm_vendors
    try {
      await pool.query(
        `INSERT INTO pm_vendors (external_vendor_id, name, phone, trade, is_active)
         SELECT v.id, COALESCE(v.vendor_name, v.business_name, v.shop_name, v.email), v.phone,
                COALESCE(NULLIF(v.contractor_trade, ''), 'CIVIL'), TRUE
         FROM vendors v
         WHERE (v.is_contractor = TRUE OR v.is_project_contractor = TRUE OR LOWER(COALESCE(v.business_type, '')) LIKE '%contractor%')
           AND COALESCE(v.status, 'active') NOT IN ('inactive', 'blocked', 'rejected')
         ON CONFLICT (external_vendor_id) WHERE external_vendor_id IS NOT NULL
         DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, trade = EXCLUDED.trade, is_active = TRUE`
      );
    } catch (syncErr) {
      console.warn("pm_vendors contractor sync skipped:", syncErr.message);
    }

    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const tradeParam = String(s.get('trade') || '').trim().toLowerCase();
    const q = String(s.get('search') || s.get('q') || '').trim();

    console.log("[CONTRACTORS GET API] Filters:", { trade: tradeParam, search: q, page, pageSize });

    // Build WHERE clause
    const whereParts = [
      `pv.is_active = TRUE`,
      `COALESCE(v.status, 'active') NOT IN ('inactive', 'blocked', 'rejected')`
    ];
    const vals = [];

    // Search filter (name or phone)
    if (q) {
      vals.push(`%${q}%`);
      whereParts.push(`(pv.name ILIKE $${vals.length} OR COALESCE(pv.phone, '') ILIKE $${vals.length} OR COALESCE(v.email, '') ILIKE $${vals.length})`);
    }

    // Trade filter:
    // If trade is 'all' or empty -> do not filter by trade!
    // If trade is specified (e.g. 'civil') -> match trade, or include null/general
    if (tradeParam && tradeParam !== 'all') {
      vals.push(`%${tradeParam}%`);
      whereParts.push(`(pv.trade ILIKE $${vals.length} OR v.contractor_trade ILIKE $${vals.length} OR pv.trade IS NULL OR LOWER(pv.trade) IN ('general', 'general vendor', 'other'))`);
    }

    const whereSql = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*)::int as total
      FROM pm_vendors pv
      LEFT JOIN vendors v ON v.id = pv.external_vendor_id
      ${whereSql}
    `;
    const countRes = await pool.query(countQuery, vals);
    const total = Number(countRes.rows[0]?.total || 0);

    vals.push(pageSize, offset);
    const listQuery = `
      SELECT 
        pv.id,
        pv.name,
        COALESCE(pv.phone, v.phone) as phone,
        COALESCE(pv.trade, v.contractor_trade, 'CIVIL') as trade,
        COALESCE(v.contractor_trade, pv.trade, 'CIVIL') as contractor_trade,
        pv.address,
        pv.external_vendor_id,
        v.id as vendor_id,
        v.email,
        COALESCE(v.status, 'active') as status,
        COALESCE(v.is_contractor, TRUE) as is_project_contractor
      FROM pm_vendors pv
      LEFT JOIN vendors v ON v.id = pv.external_vendor_id
      ${whereSql}
      ORDER BY pv.name ASC
      LIMIT $${vals.length - 1} OFFSET $${vals.length}
    `;

    const r = await pool.query(listQuery, vals);

    console.log(`[CONTRACTORS GET API] Found ${r.rows.length} contractors (Total: ${total})`);

    return NextResponse.json({
      success: true,
      data: r.rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    });
  } catch (e) {
    console.error("CONTRACTORS GET ERROR:", e);
    return NextResponse.json({ success: false, error: e.message || 'Could not load contractors' }, { status: 500 });
  }
}
