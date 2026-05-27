// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/api/admin/revenue/route.js
// ADMIN REVENUE & EARNINGS — Full pricing breakdown with date & vendor filters
// ════════════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const from_date  = searchParams.get('from_date');   // YYYY-MM-DD
    const to_date    = searchParams.get('to_date');     // YYYY-MM-DD
    const vendor_id  = searchParams.get('vendor_id');   // number or 'all'
    const status     = searchParams.get('status') || 'all'; // 'all' | 'COMPLETED' | ...

    // ── 1. Build transactions query ─────────────────────────────────────────────
    let conditions = [];
    let params     = [];
    let pIdx       = 1;

    if (status && status !== 'all') {
      conditions.push(`sb.status = $${pIdx++}`);
      params.push(status);
    }

    if (from_date) {
      conditions.push(`sb.created_at::date >= $${pIdx++}`);
      params.push(from_date);
    }

    if (to_date) {
      conditions.push(`sb.created_at::date <= $${pIdx++}`);
      params.push(to_date);
    }

    if (vendor_id && vendor_id !== 'all') {
      conditions.push(`sb.vendor_id = $${pIdx++}`);
      params.push(vendor_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const txQuery = `
      SELECT
        sb.id,
        sb.booking_reference,
        sb.user_name,
        sb.user_phone,
        sb.user_email,
        sb.service_address,
        sb.service_city,
        sb.property_type,
        sb.booking_date,
        sb.booking_time,
        sb.slot_type,
        sb.urgency,
        sb.status,
        sb.vendor_status,
        sb.user_status,
        sb.payment_status,
        sb.service_description,
        COALESCE(sb.base_amount, 0)       AS base_amount,
        COALESCE(sb.visit_fee, 0)         AS visit_fee,
        COALESCE(sb.tax_amount, 0)        AS tax_amount,
        COALESCE(sb.total_amount, 0)      AS total_amount,
        COALESCE(sb.final_amount, 0)      AS final_amount,
        COALESCE(sb.user_paid_amount, 0)  AS user_paid_amount,
        sb.vendor_notes,
        sb.user_notes,
        sb.created_at,
        sb.accepted_at,
        sb.completed_at,
        qs.label  AS service_label,
        qs.icon   AS service_icon,
        v.id      AS vendor_id,
        v.shop_name AS vendor_name,
        v.phone     AS vendor_phone,
        v.email     AS vendor_email
      FROM service_bookings sb
      JOIN quick_services qs ON sb.quick_service_id = qs.id
      LEFT JOIN vendors v     ON sb.vendor_id = v.id
      ${whereClause}
      ORDER BY sb.created_at DESC
    `;

    const txResult = await pool.query(txQuery, params);
    const transactions = txResult.rows;

    // ── 2. Compute per-booking financials ───────────────────────────────────────
    const enriched = transactions.map(b => {
      const paidAmt      = parseFloat(b.user_paid_amount) || 0;
      const finalAmt     = parseFloat(b.final_amount)     || 0;
      const totalAmt     = parseFloat(b.total_amount)     || 0;

      // Use user_paid_amount if filled, else final_amount, else total_amount
      const effectiveAmt = paidAmt > 0 ? paidAmt : finalAmt > 0 ? finalAmt : totalAmt;

      const adminCommission = Math.round(effectiveAmt * 0.15 * 100) / 100;
      const vendorPayout    = Math.round(effectiveAmt * 0.85 * 100) / 100;
      const gstAmount       = Math.round(parseFloat(b.tax_amount) * 100) / 100;

      return {
        ...b,
        effective_amount:   effectiveAmt,
        admin_commission:   adminCommission,
        vendor_payout:      vendorPayout,
        gst_amount:         gstAmount,
      };
    });

    // ── 3. Per-vendor aggregated breakdown ──────────────────────────────────────
    const vendorMap = {};
    for (const b of enriched) {
      const vId   = b.vendor_id   || 'unassigned';
      const vName = b.vendor_name || 'Unassigned';

      if (!vendorMap[vId]) {
        vendorMap[vId] = {
          vendor_id:        vId,
          vendor_name:      vName,
          vendor_phone:     b.vendor_phone  || '-',
          vendor_email:     b.vendor_email  || '-',
          total_bookings:   0,
          completed_count:  0,
          total_collected:  0,
          admin_commission: 0,
          vendor_payout:    0,
          gst_collected:    0,
          bookings:         [],
        };
      }

      const vm = vendorMap[vId];
      vm.total_bookings++;
      if (b.status === 'COMPLETED') vm.completed_count++;
      vm.total_collected  += b.effective_amount;
      vm.admin_commission += b.admin_commission;
      vm.vendor_payout    += b.vendor_payout;
      vm.gst_collected    += b.gst_amount;
      vm.bookings.push(b.booking_reference);
    }

    const vendorBreakdown = Object.values(vendorMap).sort(
      (a, b) => b.total_collected - a.total_collected
    );

    // ── 4. Summary totals ───────────────────────────────────────────────────────
    const completed = enriched.filter(b => b.status === 'COMPLETED');

    const summary = {
      total_bookings:     enriched.length,
      completed_bookings: completed.length,
      pending_bookings:   enriched.filter(b => b.status === 'WAITING_FOR_VENDOR_ACCEPTANCE').length,
      active_bookings:    enriched.filter(b => ['VENDOR_ACCEPTED', 'VENDOR_ON_WAY', 'IN_PROGRESS'].includes(b.status)).length,

      // Money from COMPLETED bookings only
      total_collected:    Math.round(completed.reduce((s, b) => s + b.effective_amount,   0) * 100) / 100,
      total_admin_earn:   Math.round(completed.reduce((s, b) => s + b.admin_commission,   0) * 100) / 100,
      total_vendor_pay:   Math.round(completed.reduce((s, b) => s + b.vendor_payout,      0) * 100) / 100,
      total_gst:          Math.round(completed.reduce((s, b) => s + b.gst_amount,         0) * 100) / 100,

      // Pipeline value (not yet completed)
      pipeline_value:     Math.round(
        enriched
          .filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED')
          .reduce((s, b) => s + (parseFloat(b.final_amount) || parseFloat(b.total_amount) || 0), 0)
        * 100
      ) / 100,
    };

    // ── 5. Vendor list (for filter dropdown) ────────────────────────────────────
    const vendorListRes = await pool.query(
      `SELECT id, shop_name, phone FROM vendors WHERE verification_status = 'approved' ORDER BY shop_name`
    );

    return NextResponse.json({
      success:          true,
      summary,
      transactions:     enriched,
      vendor_breakdown: vendorBreakdown,
      vendor_list:      vendorListRes.rows,
    });

  } catch (error) {
    console.error('Admin revenue fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
