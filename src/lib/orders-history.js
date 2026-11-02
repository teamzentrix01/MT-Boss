import pool from './db.js';
import PDFDocument from 'pdfkit';
import { formatIndianPhone, toIndianPhoneTel, normalizePhoneSearch } from './phone-utils.js';
import { creditDeliveredCashback, reverseOrderCashback } from './cashback/service.js';
import { releaseWalletRedeem } from './wallet/redeem.js';

export { formatIndianPhone, toIndianPhoneTel, normalizePhoneSearch };

/**
 * Format currency with Indian Lakh formatting (en-IN)
 */
export function formatINR(val, fallback = 'N/A') {
  if (val === null || val === undefined || val === '' || isNaN(Number(val))) return fallback;
  const num = Number(val);
  return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Format date in DD-MM-YYYY
 */
export function formatDateDDMMYYYY(val, fallback = 'N/A') {
  if (!val) return fallback;
  const d = new Date(val);
  if (isNaN(d.getTime())) return fallback;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Format date and time in DD-MM-YYYY HH:mm
 */
export function formatDateTimeDDMMYYYY(val, fallback = 'N/A') {
  if (!val) return fallback;
  const d = new Date(val);
  if (isNaN(d.getTime())) return fallback;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export const VALID_ORDER_STATUSES = [
  'open',
  'accepted',
  'confirmed',
  'processing',
  'packed',
  'dispatched',
  'out_for_delivery',
  'delivered',
  'fulfilled',
  'completed',
  'cancelled',
  'rejected',
  'payment_failed',
];

/**
 * Fetch orders list with single aggregated SQL query & child subqueries
 */
export async function getAdminOrders({
  page = 1,
  limit = 25,
  orderId = '',
  customerName = '',
  phone = '',
  status = '',
  city = '',
  createdFrom = '',
  createdTo = '',
  deliveryFrom = '',
  deliveryTo = '',
  type = 'all', // 'all' | 'shop_order' | 'service_booking'
  exportCsv = false,
} = {}) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = exportCsv ? 50000 : Math.max(1, Math.min(100, parseInt(limit, 10) || 25));
  const offset = (p - 1) * l;

  const conditions = [];
  const params = [];
  let paramIdx = 1;

  if (orderId && orderId.trim()) {
    conditions.push(`(unified.order_id ILIKE $${paramIdx})`);
    params.push(`%${orderId.trim()}%`);
    paramIdx++;
  }

  if (customerName && customerName.trim()) {
    conditions.push(`(unified.customer_name ILIKE $${paramIdx})`);
    params.push(`%${customerName.trim()}%`);
    paramIdx++;
  }

  if (phone && phone.trim()) {
    const cleanDigits = normalizePhoneSearch(phone);
    if (cleanDigits) {
      conditions.push(`(REGEXP_REPLACE(unified.customer_phone, '\\D', '', 'g') LIKE $${paramIdx} OR unified.customer_phone ILIKE $${paramIdx + 1})`);
      params.push(`%${cleanDigits}%`);
      params.push(`%${phone.trim()}%`);
      paramIdx += 2;
    } else {
      conditions.push(`(unified.customer_phone ILIKE $${paramIdx})`);
      params.push(`%${phone.trim()}%`);
      paramIdx++;
    }
  }

  if (status && status.trim() && status.toLowerCase() !== 'all') {
    conditions.push(`(LOWER(unified.status) = LOWER($${paramIdx}))`);
    params.push(status.trim().toLowerCase());
    paramIdx++;
  }

  if (city && city.trim() && city.toLowerCase() !== 'all') {
    conditions.push(`(unified.delivery_city ILIKE $${paramIdx})`);
    params.push(`%${city.trim()}%`);
    paramIdx++;
  }

  if (createdFrom && createdFrom.trim()) {
    conditions.push(`(unified.created_at >= $${paramIdx}::date)`);
    params.push(createdFrom.trim());
    paramIdx++;
  }

  if (createdTo && createdTo.trim()) {
    conditions.push(`(unified.created_at <= ($${paramIdx}::date + INTERVAL '1 day'))`);
    params.push(createdTo.trim());
    paramIdx++;
  }

  if (deliveryFrom && deliveryFrom.trim()) {
    conditions.push(`(unified.delivery_date >= $${paramIdx}::date)`);
    params.push(deliveryFrom.trim());
    paramIdx++;
  }

  if (deliveryTo && deliveryTo.trim()) {
    conditions.push(`(unified.delivery_date <= ($${paramIdx}::date + INTERVAL '1 day'))`);
    params.push(deliveryTo.trim());
    paramIdx++;
  }

  if (type === 'shop_order') {
    conditions.push(`(unified.type = 'shop_order')`);
  } else if (type === 'service_booking') {
    conditions.push(`(unified.type = 'service_booking')`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // List/summary: slim rows (no events / supplier / vendor JSON — those load on detail)
  const shopQuery = `
    SELECT
      me.id,
      COALESCE(me.order_reference, 'MO-' || me.id) AS order_id,
      'shop_order' AS type,
      'Shop Material' AS type_label,
      me.user_id AS customer_id,
      COALESCE(me.user_name, u.name, 'Customer') AS customer_name,
      COALESCE(me.user_phone, u.phone, 'N/A') AS customer_phone,
      COALESCE(me.user_email, u.email, 'N/A') AS customer_email,
      COALESCE(me.material_type, me.category_name, 'Material Item') AS product_name,
      COALESCE(me.category_name, 'Material') AS category_name,
      me.subcategory_name,
      me.brand_company,
      COALESCE(me.quantity_text, '1 ' || COALESCE(me.order_unit, 'unit')) AS quantity_text,
      me.order_unit,
      me.indicative_unit_price,
      me.product_total,
      me.shipping_cost,
      me.coupon_code,
      me.coupon_discount,
      CAST(COALESCE(me.grand_total, me.product_total, 0) AS NUMERIC) AS grand_total,
      CAST(COALESCE(me.wallet_used, 0) AS NUMERIC) AS wallet_used,
      COALESCE(me.wallet_redeem_status, 'NONE') AS wallet_redeem_status,
      me.delivery_address,
      COALESCE(me.selected_city, 'N/A') AS delivery_city,
      me.delivery_date,
      me.created_at,
      LOWER(COALESCE(me.status, 'open')) AS status,
      me.order_intent,
      COALESCE(me.message, me.status_note) AS notes,
      me.accepted_by_supplier_id,
      NULL::JSON AS supplier,
      NULL::JSON AS vendor,
      '[]'::JSON AS events,
      1 AS type_sort_priority
    FROM material_enquiries me
    LEFT JOIN users u ON u.id = me.user_id
  `;

  const serviceQuery = `
    SELECT
      sb.id,
      COALESCE(sb.booking_reference, 'BK-' || sb.id) AS order_id,
      'service_booking' AS type,
      'Service Booking' AS type_label,
      sb.user_id AS customer_id,
      COALESCE(sb.user_name, u.name, 'Customer') AS customer_name,
      COALESCE(sb.user_phone, u.phone, 'N/A') AS customer_phone,
      COALESCE(sb.user_email, u.email, 'N/A') AS customer_email,
      COALESCE(qs.label, sb.service_description, 'Service Booking') AS product_name,
      COALESCE(qs.main_category, 'Service') AS category_name,
      COALESCE(qs.sub_category, sb.service_subcategory) AS subcategory_name,
      NULL::TEXT AS brand_company,
      '1 Service' AS quantity_text,
      'service' AS order_unit,
      sb.base_amount AS indicative_unit_price,
      sb.base_amount AS product_total,
      sb.visit_fee AS shipping_cost,
      NULL::TEXT AS coupon_code,
      0::NUMERIC AS coupon_discount,
      CAST(COALESCE(sb.total_amount, sb.final_amount, sb.base_amount, 0) AS NUMERIC) AS grand_total,
      CAST(0 AS NUMERIC) AS wallet_used,
      'NONE'::TEXT AS wallet_redeem_status,
      sb.service_address AS delivery_address,
      COALESCE(sb.service_city, 'N/A') AS delivery_city,
      sb.booking_date AS delivery_date,
      sb.created_at,
      LOWER(COALESCE(sb.status, 'pending')) AS status,
      'service' AS order_intent,
      COALESCE(sb.user_notes, sb.admin_notes, sb.vendor_notes) AS notes,
      NULL::INT AS accepted_by_supplier_id,
      NULL::JSON AS supplier,
      NULL::JSON AS vendor,
      '[]'::JSON AS events,
      2 AS type_sort_priority
    FROM service_bookings sb
    LEFT JOIN users u ON u.id = sb.user_id
    LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
  `;

  // Combine based on type selection. Shop orders are prioritized first
  const unionSql = `
    WITH unified AS (
      ${shopQuery}
      UNION ALL
      ${serviceQuery}
    )
  `;

  // Summary aggregation query over filtered dataset
  const summarySql = `
    ${unionSql}
    SELECT
      COUNT(*)::INT AS total_orders,
      COUNT(CASE WHEN LOWER(status) IN ('open', 'pending', 'processing', 'accepted', 'confirmed', 'packed', 'dispatched', 'out_for_delivery') THEN 1 END)::INT AS pending_orders,
      COUNT(CASE WHEN LOWER(status) IN ('delivered', 'fulfilled', 'completed') THEN 1 END)::INT AS delivered_orders,
      COUNT(CASE WHEN LOWER(status) IN ('cancelled', 'rejected', 'payment_failed') THEN 1 END)::INT AS cancelled_orders,
      COALESCE(SUM(grand_total), 0)::NUMERIC AS total_revenue
    FROM unified
    ${whereClause}
  `;

  // Paginated items query: sort newest first, shop orders first on equal timestamps
  const itemsSql = `
    ${unionSql}
    SELECT *
    FROM unified
    ${whereClause}
    ORDER BY created_at DESC, type_sort_priority ASC, id DESC
    LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
  `;

  const [summaryResult, itemsResult] = await Promise.all([
    pool.query(summarySql, params),
    pool.query(itemsSql, [...params, l, offset]),
  ]);

  const summary = summaryResult.rows[0] || {
    total_orders: 0,
    pending_orders: 0,
    delivered_orders: 0,
    cancelled_orders: 0,
    total_revenue: '0.00',
  };

  const totalCount = parseInt(summary.total_orders, 10) || 0;
  const totalPages = Math.ceil(totalCount / l) || 1;

  return {
    orders: itemsResult.rows,
    summary: {
      total_orders: totalCount,
      pending_orders: parseInt(summary.pending_orders, 10) || 0,
      delivered_orders: parseInt(summary.delivered_orders, 10) || 0,
      cancelled_orders: parseInt(summary.cancelled_orders, 10) || 0,
      total_revenue: parseFloat(summary.total_revenue || 0),
    },
    pagination: {
      page: p,
      limit: l,
      totalCount,
      totalPages,
    },
  };
}

/**
 * Fetch a single order by ID or reference with all details for Bill / Invoice
 * @param {string|number} orderId - Numeric id or order/booking reference
 * @param {{ type?: 'shop_order'|'service_booking' }} [options] - Limit lookup to one order kind
 */
export async function getAdminOrderById(orderId, { type } = {}) {
  if (!orderId) return null;
  const isNumber = /^\d+$/.test(String(orderId).trim());
  const ref = String(orderId).trim();
  const tryShop = !type || type === 'shop_order';
  const tryService = !type || type === 'service_booking';

  // Try shop orders first (material_enquiries)
  const shopSql = `
    SELECT
      me.id,
      COALESCE(me.order_reference, 'MO-' || me.id) AS order_id,
      'shop_order' AS type,
      'Shop Material' AS type_label,
      me.user_id AS customer_id,
      COALESCE(me.user_name, u.name, 'Customer') AS customer_name,
      COALESCE(me.user_phone, u.phone, 'N/A') AS customer_phone,
      COALESCE(me.user_email, u.email, 'N/A') AS customer_email,
      COALESCE(me.material_type, me.category_name, 'Material Item') AS product_name,
      COALESCE(me.category_name, 'Material') AS category_name,
      me.subcategory_name,
      me.brand_company,
      COALESCE(me.quantity_text, '1 ' || COALESCE(me.order_unit, 'unit')) AS quantity_text,
      me.order_unit,
      me.indicative_unit_price,
      me.product_total,
      me.shipping_cost,
      me.shipping_breakdown,
      me.coupon_code,
      me.coupon_discount,
      CAST(COALESCE(me.grand_total, me.product_total, 0) AS NUMERIC) AS grand_total,
      CAST(COALESCE(me.wallet_used, 0) AS NUMERIC) AS wallet_used,
      COALESCE(me.wallet_redeem_status, 'NONE') AS wallet_redeem_status,
      me.delivery_address,
      COALESCE(me.selected_city, 'N/A') AS delivery_city,
      me.delivery_date,
      me.created_at,
      me.updated_at,
      LOWER(COALESCE(me.status, 'open')) AS status,
      me.order_intent,
      COALESCE(me.message, me.status_note) AS notes,
      me.accepted_by_supplier_id,
      (
        SELECT row_to_json(sup)
        FROM (
          SELECT s.id, s.shop_name, s.business_name, s.phone, s.email, s.city
          FROM suppliers s
          WHERE s.id = me.accepted_by_supplier_id
        ) sup
      ) AS supplier,
      NULL::JSON AS vendor,
      (
        SELECT row_to_json(u)
        FROM (
          SELECT id, name, email, phone, delivery_city, is_blocked, created_at, last_login_at
          FROM users
          WHERE id = me.user_id
        ) u
      ) AS customer,
      (
        SELECT COALESCE(json_agg(ev ORDER BY ev.created_at ASC), '[]'::json)
        FROM (
          SELECT moe.id, moe.status, moe.title, moe.note, moe.actor_role, moe.actor_name, moe.created_at
          FROM material_order_events moe
          WHERE moe.order_id = me.id
        ) ev
      ) AS events
    FROM material_enquiries me
    LEFT JOIN users u ON u.id = me.user_id
    WHERE ${isNumber ? 'me.id = $1 OR me.order_reference = $2' : 'me.order_reference = $1'}
    LIMIT 1
  `;

  if (tryShop) {
    const shopParams = isNumber ? [parseInt(ref, 10), ref] : [ref];
    const shopRes = await pool.query(shopSql, shopParams);
    if (shopRes.rows.length > 0) {
      return normalizeOrderBillData(shopRes.rows[0]);
    }
    if (type === 'shop_order') return null;
  }

  // Try service bookings
  const serviceSql = `
    SELECT
      sb.id,
      COALESCE(sb.booking_reference, 'BK-' || sb.id) AS order_id,
      'service_booking' AS type,
      'Service Booking' AS type_label,
      sb.user_id AS customer_id,
      COALESCE(sb.user_name, u.name, 'Customer') AS customer_name,
      COALESCE(sb.user_phone, u.phone, 'N/A') AS customer_phone,
      COALESCE(sb.user_email, u.email, 'N/A') AS customer_email,
      COALESCE(qs.label, sb.service_description, 'Service Booking') AS product_name,
      COALESCE(qs.main_category, 'Service') AS category_name,
      COALESCE(qs.sub_category, sb.service_subcategory) AS subcategory_name,
      NULL::TEXT AS brand_company,
      '1 Service' AS quantity_text,
      'service' AS order_unit,
      sb.base_amount AS indicative_unit_price,
      sb.base_amount AS product_total,
      sb.visit_fee AS shipping_cost,
      NULL::TEXT AS coupon_code,
      0::NUMERIC AS coupon_discount,
      CAST(COALESCE(sb.total_amount, sb.final_amount, sb.base_amount, 0) AS NUMERIC) AS grand_total,
      sb.payment_status,
      sb.payment_gateway,
      sb.payment_txnid,
      sb.payment_completed_at,
      sb.service_address AS delivery_address,
      COALESCE(sb.service_city, 'N/A') AS delivery_city,
      sb.booking_date AS delivery_date,
      sb.created_at,
      sb.updated_at,
      LOWER(COALESCE(sb.status, 'pending')) AS status,
      'service' AS order_intent,
      COALESCE(sb.user_notes, sb.admin_notes, sb.vendor_notes) AS notes,
      NULL::INT AS accepted_by_supplier_id,
      NULL::JSON AS supplier,
      (
        SELECT row_to_json(v)
        FROM (
          SELECT id, vendor_name, shop_name, phone, email, city
          FROM vendors
          WHERE id = sb.vendor_id
        ) v
      ) AS vendor,
      (
        SELECT row_to_json(u)
        FROM (
          SELECT id, name, email, phone, delivery_city, is_blocked, created_at, last_login_at
          FROM users
          WHERE id = sb.user_id
        ) u
      ) AS customer,
      '[]'::JSON AS events
    FROM service_bookings sb
    LEFT JOIN users u ON u.id = sb.user_id
    LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
    WHERE ${isNumber ? 'sb.id = $1 OR sb.booking_reference = $2' : 'sb.booking_reference = $1'}
    LIMIT 1
  `;

  if (tryService) {
    const serviceParams = isNumber ? [parseInt(ref, 10), ref] : [ref];
    const serviceRes = await pool.query(serviceSql, serviceParams);
    if (serviceRes.rows.length > 0) {
      return normalizeOrderBillData(serviceRes.rows[0]);
    }
  }

  return null;
}

const INVOICE_ORDER_TYPES = new Set(['shop_order', 'service_booking']);

export function canActorAccessOrderInvoice(order, actor) {
  if (!order || !actor) return false;
  if (actor.role === 'admin') return true;
  if (actor.role !== 'user') return false;

  const actorId = Number(actor.id);
  if (order.customer_id != null && Number(order.customer_id) === actorId) return true;

  const actorEmail = String(actor.email || '').trim().toLowerCase();
  const orderEmail = String(order.customer_email || '').trim().toLowerCase();
  if (actorEmail && orderEmail && orderEmail !== 'n/a' && actorEmail === orderEmail) return true;

  return false;
}

/**
 * Load invoice payload when the actor is allowed to view it.
 * @returns {Promise<{ order }|{ forbidden: true }|null>}
 */
export async function getOrderForInvoiceRequest(orderId, type, actor) {
  const normalizedType = String(type || '').trim();
  if (!INVOICE_ORDER_TYPES.has(normalizedType)) {
    throw new Error('Invalid order type. Use shop_order or service_booking.');
  }

  const order = await getAdminOrderById(orderId, { type: normalizedType });
  if (!order) return null;
  if (!canActorAccessOrderInvoice(order, actor)) return { forbidden: true };
  return { order };
}

/**
 * Normalizes order bill data with graceful fallbacks ("N/A") for older or missing fields
 */
function normalizeOrderBillData(row) {
  // Construct clean items table array
  const unitPrice = row.indicative_unit_price !== null && row.indicative_unit_price !== undefined ? parseFloat(row.indicative_unit_price) : null;
  const lineTotal = row.product_total !== null && row.product_total !== undefined ? parseFloat(row.product_total) : (unitPrice !== null ? unitPrice : null);
  const grandTotal = row.grand_total !== null && row.grand_total !== undefined ? parseFloat(row.grand_total) : (lineTotal !== null ? lineTotal : null);
  const shippingCost = row.shipping_cost !== null && row.shipping_cost !== undefined ? parseFloat(row.shipping_cost) : 0;
  const couponDiscount = row.coupon_discount !== null && row.coupon_discount !== undefined ? parseFloat(row.coupon_discount) : 0;
  const walletUsed = row.wallet_used !== null && row.wallet_used !== undefined ? parseFloat(row.wallet_used) : 0;

  let paymentMode = 'Pay on Delivery / Standard';
  if (row.payment_status === 'PAID') {
    const gateway = row.payment_gateway || 'Online';
    paymentMode = row.payment_txnid ? `Paid via ${gateway} · Ref ${row.payment_txnid}` : `Paid via ${gateway}`;
  } else if (row.payment_status === 'FREE') {
    paymentMode = 'Free slot / No charge';
  } else if (row.notes?.includes('Payment preference:')) {
    paymentMode = row.notes.split('Payment preference:')[1]?.trim() || paymentMode;
  }

  const items = [
    {
      name: row.product_name || 'N/A',
      category: row.category_name || 'N/A',
      subcategory: row.subcategory_name || 'N/A',
      brand: row.brand_company || 'N/A',
      unit: row.order_unit || 'N/A',
      quantity: row.quantity_text || '1',
      rate: unitPrice !== null && !isNaN(unitPrice) ? unitPrice : null,
      amount: lineTotal !== null && !isNaN(lineTotal) ? lineTotal : null,
    },
  ];

  return {
    ...row,
    unit_price: unitPrice,
    product_total: lineTotal,
    shipping_cost: shippingCost,
    coupon_discount: couponDiscount,
    wallet_used: walletUsed,
    grand_total: grandTotal,
    items,
    payment_mode: paymentMode,
  };
}

/**
 * Update order status and record in pm_audit_log & material_order_events
 */
export async function updateAdminOrderStatus({
  orderId,
  type = 'shop_order',
  newStatus,
  notes = '',
  adminUser = {},
}) {
  const normalizedStatus = String(newStatus || '').trim().toLowerCase();
  if (!VALID_ORDER_STATUSES.includes(normalizedStatus)) {
    throw new Error(`Invalid status: "${newStatus}". Allowed values: ${VALID_ORDER_STATUSES.join(', ')}`);
  }

  const adminIdentifier = `${adminUser.email || adminUser.name || 'admin'} (#${adminUser.id || 0})`;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let oldData = null;
    let recordId = null;
    let updatedRow = null;

    if (type === 'service_booking') {
      const isNum = /^\d+$/.test(String(orderId).trim());
      const findSql = isNum
        ? 'SELECT * FROM service_bookings WHERE id = $1 OR booking_reference = $2 FOR UPDATE'
        : 'SELECT * FROM service_bookings WHERE booking_reference = $1 FOR UPDATE';
      const findParams = isNum ? [parseInt(orderId, 10), String(orderId).trim()] : [String(orderId).trim()];
      const findRes = await client.query(findSql, findParams);

      if (findRes.rows.length === 0) {
        throw new Error('Service booking not found');
      }

      oldData = findRes.rows[0];
      recordId = oldData.id;

      const updateRes = await client.query(
        `UPDATE service_bookings
         SET status = $1, admin_notes = COALESCE($2, admin_notes), updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [normalizedStatus.toUpperCase(), notes || null, recordId]
      );
      updatedRow = updateRes.rows[0];

      // Record in pm_audit_log
      await client.query(
        `INSERT INTO pm_audit_log
         (table_name, record_id, action, changed_by, old_data, new_data, created_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, NOW())`,
        [
          'service_bookings',
          recordId,
          'status_change',
          adminIdentifier,
          JSON.stringify({ status: oldData.status, admin_notes: oldData.admin_notes }),
          JSON.stringify({ status: updatedRow.status, admin_notes: updatedRow.admin_notes }),
        ]
      );
    } else {
      // Shop / Material order
      const isNum = /^\d+$/.test(String(orderId).trim());
      const findSql = isNum
        ? 'SELECT * FROM material_enquiries WHERE id = $1 OR order_reference = $2 FOR UPDATE'
        : 'SELECT * FROM material_enquiries WHERE order_reference = $1 FOR UPDATE';
      const findParams = isNum ? [parseInt(orderId, 10), String(orderId).trim()] : [String(orderId).trim()];
      const findRes = await client.query(findSql, findParams);

      if (findRes.rows.length === 0) {
        throw new Error('Material order not found');
      }

      oldData = findRes.rows[0];
      recordId = oldData.id;

      const updateRes = await client.query(
        `UPDATE material_enquiries
         SET status = $1, status_note = COALESCE($2, status_note), updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [normalizedStatus, notes || null, recordId]
      );
      updatedRow = updateRes.rows[0];

      // Record in material_order_events
      await client.query(
        `INSERT INTO material_order_events
         (order_id, status, title, note, actor_role, actor_id, actor_name, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          recordId,
          normalizedStatus,
          `Status changed to ${normalizedStatus.replace(/_/g, ' ').toUpperCase()}`,
          notes || `Admin updated order status to ${normalizedStatus}`,
          'admin',
          adminUser.id || 0,
          adminUser.name || 'Admin',
        ]
      );

      // Record in pm_audit_log
      await client.query(
        `INSERT INTO pm_audit_log
         (table_name, record_id, action, changed_by, old_data, new_data, created_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, NOW())`,
        [
          'material_enquiries',
          recordId,
          'status_change',
          adminIdentifier,
          JSON.stringify({ status: oldData.status, status_note: oldData.status_note }),
          JSON.stringify({ status: updatedRow.status, status_note: updatedRow.status_note }),
        ]
      );

      // Cashback & wallet redemption hook on delivery or cancellation/return
      if (['delivered', 'fulfilled'].includes(normalizedStatus)) {
        await creditDeliveredCashback({ orderId: recordId, client });
      } else if (['cancelled', 'returned'].includes(normalizedStatus)) {
        await reverseOrderCashback({ orderId: recordId, reason: `Order marked as ${normalizedStatus}`, client });
        await releaseWalletRedeem(recordId, client);
      }
    }

    await client.query('COMMIT');
    return {
      orderId: recordId,
      oldStatus: oldData.status,
      newStatus: normalizedStatus,
      updatedAt: new Date(),
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Fetch customer profile by user ID or customer email/phone
 */
export async function getCustomerProfile(customerIdOrPhone) {
  const isNumber = /^\d+$/.test(String(customerIdOrPhone).trim());
  let user = null;

  if (isNumber) {
    const res = await pool.query(
      `SELECT id, name, email, phone, delivery_city, is_blocked, created_at, last_login_at
       FROM users WHERE id = $1`,
      [parseInt(customerIdOrPhone, 10)]
    );
    user = res.rows[0] || null;
  }

  if (!user) {
    const res = await pool.query(
      `SELECT id, name, email, phone, delivery_city, is_blocked, created_at, last_login_at
       FROM users WHERE phone = $1 OR email = $1 LIMIT 1`,
      [String(customerIdOrPhone).trim()]
    );
    user = res.rows[0] || null;
  }

  // If user still doesn't exist in users table (e.g. guest order), pull from material_enquiries
  if (!user) {
    const guestRes = await pool.query(
      `SELECT user_name AS name, user_email AS email, user_phone AS phone,
              selected_city AS delivery_city, delivery_address, created_at
       FROM material_enquiries
       WHERE user_id::TEXT = $1 OR user_phone = $1 OR user_email = $1
       ORDER BY created_at DESC LIMIT 1`,
      [String(customerIdOrPhone).trim()]
    );
    if (guestRes.rows.length > 0) {
      const g = guestRes.rows[0];
      return {
        id: null,
        name: g.name || 'Guest Customer',
        email: g.email || 'N/A',
        phone: g.phone || 'N/A',
        delivery_city: g.delivery_city || 'N/A',
        delivery_address: g.delivery_address || 'N/A',
        is_blocked: false,
        created_at: g.created_at,
        last_login_at: null,
        is_guest: true,
      };
    }
    return null;
  }

  // Fetch default delivery address
  const addrRes = await pool.query(
    `SELECT delivery_address FROM material_enquiries WHERE user_id = $1 AND delivery_address IS NOT NULL ORDER BY created_at DESC LIMIT 1`,
    [user.id]
  );
  const deliveryAddress = addrRes.rows[0]?.delivery_address || 'N/A';

  return {
    ...user,
    delivery_address: deliveryAddress,
    is_guest: false,
  };
}

/**
 * Fetch all orders for a customer in a single batched query with timing logging
 */
export async function getCustomerOrdersHistory(customerId, customerPhone = null) {
  const startTime = Date.now();

  const query = `
    WITH customer_orders AS (
      SELECT
        me.id,
        COALESCE(me.order_reference, 'MO-' || me.id) AS order_id,
        'shop_order' AS type,
        'Shop Material' AS type_label,
        COALESCE(me.material_type, me.category_name, 'Material Item') AS product_name,
        me.quantity_text,
        CAST(COALESCE(me.grand_total, me.product_total, 0) AS NUMERIC) AS grand_total,
        me.coupon_code,
        me.delivery_address,
        COALESCE(me.selected_city, 'N/A') AS delivery_city,
        me.delivery_date,
        me.created_at,
        LOWER(COALESCE(me.status, 'open')) AS status
      FROM material_enquiries me
      WHERE ($1::INT IS NOT NULL AND me.user_id = $1::INT)
         OR ($2::TEXT IS NOT NULL AND me.user_phone = $2::TEXT)

      UNION ALL

      SELECT
        sb.id,
        COALESCE(sb.booking_reference, 'BK-' || sb.id) AS order_id,
        'service_booking' AS type,
        'Service Booking' AS type_label,
        COALESCE(qs.label, sb.service_description, 'Service Booking') AS product_name,
        '1 Service' AS quantity_text,
        CAST(COALESCE(sb.total_amount, sb.final_amount, sb.base_amount, 0) AS NUMERIC) AS grand_total,
        NULL::TEXT AS coupon_code,
        sb.service_address AS delivery_address,
        COALESCE(sb.service_city, 'N/A') AS delivery_city,
        sb.booking_date AS delivery_date,
        sb.created_at,
        LOWER(COALESCE(sb.status, 'pending')) AS status
      FROM service_bookings sb
      LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
      WHERE ($1::INT IS NOT NULL AND sb.user_id = $1::INT)
         OR ($2::TEXT IS NOT NULL AND sb.user_phone = $2::TEXT)
    )
    SELECT
      (SELECT COALESCE(json_agg(co ORDER BY co.created_at DESC), '[]'::json) FROM customer_orders co) AS orders,
      COUNT(*)::INT AS total_orders,
      COALESCE(SUM(grand_total), 0)::NUMERIC AS lifetime_spend,
      (
        SELECT COALESCE(json_agg(DISTINCT coupon_code), '[]'::json)
        FROM customer_orders
        WHERE coupon_code IS NOT NULL AND TRIM(coupon_code) != ''
      ) AS coupons_used
    FROM customer_orders
  `;

  const userIdParam = customerId && /^\d+$/.test(String(customerId)) ? parseInt(customerId, 10) : null;
  const phoneParam = customerPhone || (!userIdParam ? String(customerId || '').trim() : null);

  const res = await pool.query(query, [userIdParam, phoneParam]);
  const durationMs = Date.now() - startTime;
  console.log(`[Admin Customer Orders] Batched query completed in ${durationMs}ms for user ${customerId || customerPhone}`);

  const row = res.rows[0] || {
    orders: [],
    total_orders: 0,
    lifetime_spend: '0.00',
    coupons_used: [],
  };

  return {
    orders: row.orders || [],
    total_orders: parseInt(row.total_orders, 10) || 0,
    lifetime_spend: parseFloat(row.lifetime_spend || 0),
    coupons_used: row.coupons_used || [],
    query_duration_ms: durationMs,
  };
}

const INVOICE_PAGE_W = 595.28;
const INVOICE_MARGIN = 40;
const INVOICE_CONTENT_W = INVOICE_PAGE_W - INVOICE_MARGIN * 2;

function companyInvoiceConfig() {
  return {
    name: process.env.COMPANY_NAME || 'MTBOSS',
    tagline: process.env.COMPANY_TAGLINE || 'Building Materials & Services',
    address: process.env.COMPANY_ADDRESS || 'Zentrix MTBOSS Technologies · Moradabad, Uttar Pradesh',
    gstin: String(process.env.COMPANY_GSTIN || '').trim(),
    pan: String(process.env.COMPANY_PAN || '').trim(),
    phone: process.env.COMPANY_PHONE || process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 9410225039',
    email: process.env.COMPANY_SUPPORT_EMAIL || process.env.SMTP_REPLY_TO || 'support@MTBOSS.in',
    placeOfSupply: process.env.COMPANY_PLACE_OF_SUPPLY || 'Uttar Pradesh (09)',
    productHsn: String(process.env.INVOICE_DEFAULT_PRODUCT_HSN || '2523').trim(),
    shippingHsn: String(process.env.INVOICE_SHIPPING_HSN || '996812').trim(),
    serviceHsn: String(process.env.INVOICE_SERVICE_HSN || '998599').trim(),
  };
}

function hasInvoiceGstStructure(config) {
  return Boolean(config.gstin);
}

function formatInvoiceMoney(val, { dashWhenEmpty = true } = {}) {
  if (val === null || val === undefined || val === '' || Number.isNaN(Number(val))) {
    return dashWhenEmpty ? '-' : '0.00';
  }
  return Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function splitInclusiveGst(totalInclusive) {
  const total = Math.max(0, Number(totalInclusive) || 0);
  if (total <= 0) return { taxable: 0, cgst: 0, sgst: 0, totalTax: 0 };
  const taxable = Math.round((total / 1.18) * 100) / 100;
  const totalTax = Math.round((total - taxable) * 100) / 100;
  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax - cgst) * 100) / 100;
  return { taxable, cgst, sgst, totalTax };
}

function gstCellsForAmount(amountInclusive, hasGst) {
  if (!hasGst) return { taxable: '-', cgst: '-', sgst: '-' };
  const n = Number(amountInclusive);
  if (!Number.isFinite(n) || n <= 0) return { taxable: '-', cgst: '-', sgst: '-' };
  const split = splitInclusiveGst(n);
  return {
    taxable: formatInvoiceMoney(split.taxable, { dashWhenEmpty: false }),
    cgst: formatInvoiceMoney(split.cgst, { dashWhenEmpty: false }),
    sgst: formatInvoiceMoney(split.sgst, { dashWhenEmpty: false }),
  };
}

function parseInvoiceQuantity(value) {
  const raw = String(value ?? '').trim();
  const match = raw.match(/^([\d.]+)/);
  if (match) return { display: raw || '-', numeric: Number(match[1]) || 0 };
  return { display: raw || '1', numeric: 1 };
}

function buildInvoiceTableRows(order, config, hasGst) {
  const productTotal = Number(order.product_total) || 0;
  const couponDiscount = Number(order.coupon_discount) || 0;
  const shippingCost = Number(order.shipping_cost) || 0;
  const feeLabel = order.type === 'service_booking' ? 'Visit / service charges' : 'Shipping / Delivery Charges';

  const baseItems = order.items?.length
    ? order.items
    : [{
      name: order.product_name || 'Material Item',
      category: order.category_name,
      unit: order.order_unit || 'unit',
      quantity: order.quantity_text || '1',
      rate: order.unit_price,
      amount: order.product_total,
    }];

  const rows = [];
  baseItems.forEach((item, index) => {
    const qty = parseInvoiceQuantity(item.quantity);
    const rate = item.rate != null ? Number(item.rate) : null;
    const lineAmount = item.amount != null ? Number(item.amount) : productTotal;
    const discount = index === 0 && couponDiscount > 0 ? couponDiscount : null;
    const lineTitle = item.name || 'Item';
    const subtitle = [item.category, item.brand].filter((part) => part && part !== 'N/A').join(' · ');
    const description = subtitle ? `${lineTitle}\n${subtitle}` : lineTitle;
    const hsn = hasGst ? config.productHsn : '-';
    const gstBase = lineAmount - (discount || 0);
    const gst = gstCellsForAmount(gstBase > 0 ? gstBase : lineAmount, hasGst);

    rows.push({
      description,
      hsn,
      qty: qty.display,
      rate: rate != null ? formatInvoiceMoney(rate, { dashWhenEmpty: false }) : '-',
      discount: discount != null ? formatInvoiceMoney(discount, { dashWhenEmpty: false }) : '-',
      ...gst,
      amount: formatInvoiceMoney(lineAmount, { dashWhenEmpty: false }),
      hsnKey: hsn,
      gstBase: gstBase > 0 ? gstBase : lineAmount,
    });
  });

  if (shippingCost > 0) {
    const hsn = hasGst ? config.shippingHsn : '-';
    const gst = gstCellsForAmount(shippingCost, hasGst);
    rows.push({
      description: feeLabel,
      hsn,
      qty: '-',
      rate: '-',
      discount: '-',
      ...gst,
      amount: formatInvoiceMoney(shippingCost, { dashWhenEmpty: false }),
      hsnKey: hsn,
      gstBase: shippingCost,
    });
  }

  return rows;
}

function buildHsnSummaryRows(tableRows, hasGst) {
  if (!hasGst) {
    return [{ hsn: '-', taxable: '-', cgst: '-', sgst: '-', totalTax: '-' }];
  }
  const buckets = new Map();
  tableRows.forEach((row) => {
    const key = row.hsnKey && row.hsnKey !== '-' ? row.hsnKey : '—';
    const split = splitInclusiveGst(Number(row.gstBase) || 0);
    const existing = buckets.get(key) || { taxable: 0, cgst: 0, sgst: 0, totalTax: 0 };
    existing.taxable += split.taxable;
    existing.cgst += split.cgst;
    existing.sgst += split.sgst;
    existing.totalTax += split.totalTax;
    buckets.set(key, existing);
  });
  return [...buckets.entries()].map(([hsn, totals]) => ({
    hsn,
    taxable: formatInvoiceMoney(totals.taxable, { dashWhenEmpty: false }),
    cgst: formatInvoiceMoney(totals.cgst, { dashWhenEmpty: false }),
    sgst: formatInvoiceMoney(totals.sgst, { dashWhenEmpty: false }),
    totalTax: formatInvoiceMoney(totals.totalTax, { dashWhenEmpty: false }),
  }));
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigitWords(n) {
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `${TENS[tens]}${ones ? ` ${ONES[ones]}` : ''}`.trim();
}

function chunkToWords(n) {
  if (n === 0) return '';
  if (n < 100) return twoDigitWords(n);
  if (n < 1000) {
    const hundreds = Math.floor(n / 100);
    const rest = n % 100;
    return `${ONES[hundreds]} Hundred${rest ? ` ${twoDigitWords(rest)}` : ''}`.trim();
  }
  return '';
}

function amountInWordsINR(amount) {
  const value = Math.round(Number(amount) || 0);
  if (value === 0) return 'Indian Rupees Zero Only';
  let n = value;
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const parts = [];
  if (crore) parts.push(`${chunkToWords(crore)} Crore`);
  if (lakh) parts.push(`${chunkToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${chunkToWords(thousand)} Thousand`);
  if (n) parts.push(chunkToWords(n));
  return `Indian Rupees ${parts.join(' ').replace(/\s+/g, ' ').trim()} Only`;
}

function cleanPdfString(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/₹/g, 'Rs. ')
    .replace(/[^\x00-\xFF]/g, ' ')
    .trim();
}

function drawInvoiceMetaCell(doc, x, y, w, h, label, value, { valueColor = '#0f172a', valueSize = 8.5 } = {}) {
  doc.rect(x, y, w, h).fillAndStroke('#ffffff', '#e2e8f0');
  doc.fillColor('#64748b').fontSize(7).font('Helvetica-Bold').text(label, x + 6, y + 5, { width: w - 12, lineBreak: false });
  doc.fillColor(valueColor).fontSize(valueSize).font('Helvetica-Bold').text(cleanPdfString(value ?? '-'), x + 6, y + 17, { width: w - 12, lineBreak: false });
}

function drawInvoiceAddressBlock(doc, x, y, w, h, title, lines) {
  doc.rect(x, y, w, h).fillAndStroke('#ffffff', '#e2e8f0');
  doc.fillColor('#0284c7').fontSize(8).font('Helvetica-Bold').text(title, x + 8, y + 7, { lineBreak: false });
  doc.fillColor('#0f172a').fontSize(7.5).font('Helvetica').text(lines.filter(Boolean).map(cleanPdfString).join('\n'), x + 8, y + 20, { width: w - 16, lineGap: 1.2 });
}

function drawStatusPill(doc, x, y, statusText) {
  const normalized = cleanPdfString(statusText || 'OPEN').toUpperCase().replace(/_/g, ' ');
  const pillW = Math.min(78, doc.widthOfString(normalized) + 16);
  doc.roundedRect(x, y, pillW, 14, 7).fill('#fef3c7');
  doc.fillColor('#b45309').fontSize(7.5).font('Helvetica-Bold').text(normalized, x + 8, y + 3, { width: pillW - 16, lineBreak: false });
}

/**
 * Generate PDF Invoice Buffer using pdfkit (GST tax-invoice layout)
 */
export async function generateOrderInvoicePdf(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 0,
        size: 'A4',
        autoFirstPage: true,
        bufferPages: true,
      });
      const buffers = [];
      const company = companyInvoiceConfig();
      const hasGst = hasInvoiceGstStructure(company);

      doc.on('data', (data) => buffers.push(data));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const darkColor = '#0f172a';
      const grayColor = '#64748b';
      const lightBg = '#f8fafc';
      const borderColor = '#e2e8f0';
      const primaryColor = '#0284c7';

      const invoiceNo = cleanPdfString(order.order_id || '-');
      const productTotal = Number(order.product_total) || 0;
      const couponDiscount = Number(order.coupon_discount) || 0;
      const shippingCost = Number(order.shipping_cost) || 0;
      const walletUsed = Number(order.wallet_used) || 0;
      const grandTotal = Number(order.grand_total) || Math.max(0, productTotal - couponDiscount + shippingCost - walletUsed);
      const gstSummary = hasGst ? splitInclusiveGst(grandTotal) : null;
      const tableRows = buildInvoiceTableRows(order, company, hasGst);
      const hsnSummaryRows = buildHsnSummaryRows(tableRows, hasGst);

      const tableTotals = tableRows.reduce(
        (acc, row) => {
          if (hasGst) {
            const split = splitInclusiveGst(Number(row.gstBase) || 0);
            acc.taxable += split.taxable;
            acc.cgst += split.cgst;
            acc.sgst += split.sgst;
            acc.amount += Number(String(row.amount).replace(/,/g, '')) || 0;
          }
          return acc;
        },
        { taxable: 0, cgst: 0, sgst: 0, amount: 0 },
      );

      // ── Header band ──
      const headerH = 88;
      doc.rect(0, 0, INVOICE_PAGE_W, headerH).fill('#0f172a');
      doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text(company.name, INVOICE_MARGIN, 16, { lineBreak: false });
      doc.fontSize(8.5).font('Helvetica').fillColor('#cbd5e1').text(company.tagline, INVOICE_MARGIN, 40, { lineBreak: false });
      doc.fontSize(7.5).fillColor('#94a3b8').text(company.address, INVOICE_MARGIN, 54, { width: 300, lineBreak: false });
      const gstLine = hasGst
        ? `GSTIN: ${company.gstin}${company.pan ? ` | PAN: ${company.pan}` : ''}`
        : `GSTIN: -${company.pan ? ` | PAN: ${company.pan}` : ''}`;
      doc.text(gstLine, INVOICE_MARGIN, 68, { width: 300, lineBreak: false });

      doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text('TAX INVOICE', INVOICE_MARGIN + 320, 18, { align: 'right', width: 200, lineBreak: false });
      doc.fontSize(8.5).font('Helvetica').fillColor('#cbd5e1').text(`Invoice No: ${invoiceNo}`, INVOICE_MARGIN + 320, 42, { align: 'right', width: 200, lineBreak: false });
      doc.fontSize(7).text('Original for Recipient', INVOICE_MARGIN + 320, 56, { align: 'right', width: 200, lineBreak: false });

      // ── Metadata strip ──
      const metaY = headerH + 10;
      const metaCellW = INVOICE_CONTENT_W / 6;
      const metaH = 38;
      const statusText = String(order.status || 'open').toUpperCase().replace(/_/g, ' ');
      drawInvoiceMetaCell(doc, INVOICE_MARGIN, metaY, metaCellW, metaH, 'Invoice Date', formatDateDDMMYYYY(order.created_at));
      drawInvoiceMetaCell(doc, INVOICE_MARGIN + metaCellW, metaY, metaCellW, metaH, 'Order ID', invoiceNo);
      drawInvoiceMetaCell(doc, INVOICE_MARGIN + metaCellW * 2, metaY, metaCellW, metaH, 'Delivery Date', formatDateDDMMYYYY(order.delivery_date));
      drawInvoiceMetaCell(doc, INVOICE_MARGIN + metaCellW * 3, metaY, metaCellW, metaH, 'Place of Supply', hasGst ? company.placeOfSupply : '-');
      drawInvoiceMetaCell(doc, INVOICE_MARGIN + metaCellW * 4, metaY, metaCellW, metaH, 'Payment Mode', order.payment_mode || 'Cash on Delivery');
      doc.rect(INVOICE_MARGIN + metaCellW * 5, metaY, metaCellW, metaH).fillAndStroke('#ffffff', borderColor);
      doc.fillColor(grayColor).fontSize(7).font('Helvetica-Bold').text('Order Status', INVOICE_MARGIN + metaCellW * 5 + 6, metaY + 5, { lineBreak: false });
      drawStatusPill(doc, INVOICE_MARGIN + metaCellW * 5 + 6, metaY + 18, statusText);

      // ── Bill / Ship / Fulfilled ──
      const addrY = metaY + metaH + 8;
      const addrW = (INVOICE_CONTENT_W - 16) / 3;
      const addrH = 82;
      const customerAddress = order.delivery_address || '-';
      const customerGst = hasGst ? 'Unregistered / Consumer' : '-';
      drawInvoiceAddressBlock(doc, INVOICE_MARGIN, addrY, addrW, addrH, 'BILL TO', [
        order.customer_name || 'Customer',
        customerAddress,
        `Phone: ${formatIndianPhone(order.customer_phone)}`,
        `Email: ${order.customer_email && order.customer_email !== 'N/A' ? order.customer_email : '-'}`,
        `GSTIN: ${customerGst}`,
      ]);
      drawInvoiceAddressBlock(doc, INVOICE_MARGIN + addrW + 8, addrY, addrW, addrH, 'SHIP TO', [
        order.customer_name || 'Customer',
        customerAddress,
        `Delivery City: ${order.delivery_city || '-'}`,
        `Phone: ${formatIndianPhone(order.customer_phone)}`,
      ]);

      let fulfilledLines;
      if (order.supplier) {
        fulfilledLines = [
          order.supplier.shop_name || order.supplier.business_name || 'Verified Supplier',
          `Phone: ${formatIndianPhone(order.supplier.phone)}`,
          `City: ${order.supplier.city || '-'}`,
          order.supplier.email ? `Email: ${order.supplier.email}` : null,
        ];
      } else if (order.vendor || order.service_provider) {
        const prov = order.vendor || order.service_provider;
        fulfilledLines = [
          prov.vendor_name || prov.service_provider_name || prov.shop_name || 'Verified Service Provider',
          `Phone: ${formatIndianPhone(prov.phone)}`,
          `City: ${prov.city || '-'}`,
          prov.email ? `Email: ${prov.email}` : null,
        ];
      } else {
        fulfilledLines = [
          'MTBOSS Direct Operations',
          `Helpline: ${company.phone}`,
          `Email: ${company.email}`,
        ];
      }
      drawInvoiceAddressBlock(doc, INVOICE_MARGIN + (addrW + 8) * 2, addrY, addrW, addrH, 'FULFILLED BY', fulfilledLines);

      // ── Line items table ──
      const cols = [
        { key: 'idx', label: '#', x: INVOICE_MARGIN, w: 16 },
        { key: 'description', label: 'Item Description', x: INVOICE_MARGIN + 16, w: 112 },
        { key: 'hsn', label: 'HSN/SAC', x: INVOICE_MARGIN + 128, w: 42 },
        { key: 'qty', label: 'Qty', x: INVOICE_MARGIN + 170, w: 38 },
        { key: 'rate', label: 'Rate (Rs.)', x: INVOICE_MARGIN + 208, w: 44 },
        { key: 'discount', label: 'Discount (Rs.)', x: INVOICE_MARGIN + 252, w: 48 },
        { key: 'taxable', label: 'Taxable Value', x: INVOICE_MARGIN + 300, w: 52 },
        { key: 'cgst', label: 'CGST 9%', x: INVOICE_MARGIN + 352, w: 44 },
        { key: 'sgst', label: 'SGST 9%', x: INVOICE_MARGIN + 396, w: 44 },
        { key: 'amount', label: 'Amount (Rs.)', x: INVOICE_MARGIN + 440, w: INVOICE_CONTENT_W - (440 - INVOICE_MARGIN) },
      ];

      let tableY = addrY + addrH + 10;
      doc.rect(INVOICE_MARGIN, tableY, INVOICE_CONTENT_W, 18).fill('#1e293b');
      doc.fillColor('#ffffff').fontSize(6.5).font('Helvetica-Bold');
      cols.forEach((col) => {
        doc.text(col.label, col.x + 2, tableY + 5, { width: col.w - 4, align: col.key === 'amount' || col.key === 'rate' || col.key === 'discount' || col.key === 'taxable' || col.key === 'cgst' || col.key === 'sgst' ? 'right' : 'left', lineBreak: false });
      });

      tableY += 18;
      tableRows.forEach((row, index) => {
        const rowH = 30;
        doc.rect(INVOICE_MARGIN, tableY, INVOICE_CONTENT_W, rowH).fillAndStroke(index % 2 === 0 ? '#ffffff' : lightBg, borderColor);
        doc.fillColor(darkColor).fontSize(7).font('Helvetica');
        doc.text(String(index + 1), cols[0].x + 2, tableY + 7, { width: cols[0].w - 4, lineBreak: false });
        doc.font('Helvetica-Bold').text(cleanPdfString(row.description), cols[1].x + 2, tableY + 5, { width: cols[1].w - 4, lineGap: 0.5 });
        doc.font('Helvetica');
        doc.text(row.hsn, cols[2].x + 2, tableY + 9, { width: cols[2].w - 4, lineBreak: false });
        doc.text(row.qty, cols[3].x + 2, tableY + 9, { width: cols[3].w - 4, lineBreak: false });
        doc.text(row.rate, cols[4].x + 2, tableY + 9, { width: cols[4].w - 4, align: 'right', lineBreak: false });
        doc.text(row.discount, cols[5].x + 2, tableY + 9, { width: cols[5].w - 4, align: 'right', lineBreak: false });
        doc.text(row.taxable, cols[6].x + 2, tableY + 9, { width: cols[6].w - 4, align: 'right', lineBreak: false });
        doc.text(row.cgst, cols[7].x + 2, tableY + 9, { width: cols[7].w - 4, align: 'right', lineBreak: false });
        doc.text(row.sgst, cols[8].x + 2, tableY + 9, { width: cols[8].w - 4, align: 'right', lineBreak: false });
        doc.font('Helvetica-Bold').text(row.amount, cols[9].x + 2, tableY + 9, { width: cols[9].w - 4, align: 'right', lineBreak: false });
        tableY += rowH;
      });

      doc.rect(INVOICE_MARGIN, tableY, INVOICE_CONTENT_W, 18).fillAndStroke('#eef2ff', borderColor);
      doc.fillColor(darkColor).fontSize(7).font('Helvetica-Bold').text('Total', cols[1].x + 2, tableY + 5, { lineBreak: false });
      if (hasGst) {
        doc.text(formatInvoiceMoney(tableTotals.taxable, { dashWhenEmpty: false }), cols[6].x + 2, tableY + 5, { width: cols[6].w - 4, align: 'right', lineBreak: false });
        doc.text(formatInvoiceMoney(tableTotals.cgst, { dashWhenEmpty: false }), cols[7].x + 2, tableY + 5, { width: cols[7].w - 4, align: 'right', lineBreak: false });
        doc.text(formatInvoiceMoney(tableTotals.sgst, { dashWhenEmpty: false }), cols[8].x + 2, tableY + 5, { width: cols[8].w - 4, align: 'right', lineBreak: false });
      } else {
        doc.text('-', cols[6].x + 2, tableY + 5, { width: cols[6].w - 4, align: 'right', lineBreak: false });
        doc.text('-', cols[7].x + 2, tableY + 5, { width: cols[7].w - 4, align: 'right', lineBreak: false });
        doc.text('-', cols[8].x + 2, tableY + 5, { width: cols[8].w - 4, align: 'right', lineBreak: false });
      }
      doc.text(formatInvoiceMoney(grandTotal, { dashWhenEmpty: false }), cols[9].x + 2, tableY + 5, { width: cols[9].w - 4, align: 'right', lineBreak: false });
      tableY += 22;

      const footerTop = tableY + 6;
      const leftW = 270;
      const rightX = INVOICE_MARGIN + leftW + 10;
      const rightW = INVOICE_CONTENT_W - leftW - 10;

      doc.fillColor(darkColor).fontSize(7.5).font('Helvetica-Bold').text('Amount in Words', INVOICE_MARGIN, footerTop, { lineBreak: false });
      doc.font('Helvetica').fontSize(7.5).text(amountInWordsINR(grandTotal), INVOICE_MARGIN, footerTop + 12, { width: leftW });

      const hsnY = footerTop + 30;
      doc.fillColor(primaryColor).fontSize(7.5).font('Helvetica-Bold').text('HSN / SAC Summary', INVOICE_MARGIN, hsnY, { lineBreak: false });
      const hsnTableY = hsnY + 11;
      const hsnCols = [
        { label: 'HSN/SAC', w: 50 },
        { label: 'Taxable Value', w: 60 },
        { label: 'CGST', w: 46 },
        { label: 'SGST', w: 46 },
        { label: 'Total Tax', w: 50 },
      ];
      let hx = INVOICE_MARGIN;
      doc.rect(INVOICE_MARGIN, hsnTableY, leftW, 15).fill('#1e293b');
      doc.fillColor('#ffffff').fontSize(6.5).font('Helvetica-Bold');
      hsnCols.forEach((col) => {
        doc.text(col.label, hx + 3, hsnTableY + 4, { width: col.w - 6, lineBreak: false });
        hx += col.w;
      });
      let hy = hsnTableY + 15;
      hsnSummaryRows.forEach((row) => {
        hx = INVOICE_MARGIN;
        doc.rect(INVOICE_MARGIN, hy, leftW, 13).strokeColor(borderColor).stroke();
        doc.fillColor(darkColor).fontSize(6.5).font('Helvetica');
        [row.hsn, row.taxable, row.cgst, row.sgst, row.totalTax].forEach((cell, i) => {
          doc.text(String(cell), hx + 3, hy + 3, { width: hsnCols[i].w - 6, align: i === 0 ? 'left' : 'right', lineBreak: false });
          hx += hsnCols[i].w;
        });
        hy += 13;
      });

      const termsY = hy + 8;
      doc.rect(INVOICE_MARGIN, termsY, leftW, 64).fillAndStroke(lightBg, borderColor);
      doc.fillColor(primaryColor).fontSize(7.5).font('Helvetica-Bold').text('TERMS & NOTES', INVOICE_MARGIN + 8, termsY + 6, { lineBreak: false });
      const gstNote = hasGst
        ? 'Prices are inclusive of applicable GST unless stated otherwise.'
        : 'GST details are not applicable on this invoice.';
      const terms = [
        order.notes || null,
        gstNote,
        'Materials once delivered are subject to supplier return policies.',
        'Disputes are subject to Moradabad jurisdiction.',
      ].filter(Boolean).map(cleanPdfString).join('\n');
      doc.fillColor(darkColor).fontSize(6.8).font('Helvetica').text(terms, INVOICE_MARGIN + 8, termsY + 18, { width: leftW - 16, lineGap: 1.1 });

      // ── Totals box ──
      let lineY = footerTop;
      doc.rect(rightX, lineY, rightW, 158).fillAndStroke('#ffffff', borderColor);
      lineY += 8;
      const printTotalLine = (label, val, { bold = false, accent = false, discount = false } = {}) => {
        doc.fillColor(grayColor).fontSize(7.5).font(bold ? 'Helvetica-Bold' : 'Helvetica').text(label, rightX + 8, lineY, { width: rightW - 16, lineBreak: false });
        let valColor = darkColor;
        if (accent) valColor = primaryColor;
        if (discount) valColor = '#16a34a';
        doc.fillColor(valColor).fontSize(bold ? 9.5 : 7.5).font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .text(val, rightX + 8, lineY, { width: rightW - 16, align: 'right', lineBreak: false });
        lineY += 16;
      };

      const qtyMeta = parseInvoiceQuantity(order.items?.[0]?.quantity || order.quantity_text);
      const rateMeta = order.unit_price ?? order.items?.[0]?.rate;
      const productLabel = rateMeta != null && qtyMeta.numeric
        ? `Product Total (${qtyMeta.numeric} x ${formatInvoiceMoney(rateMeta, { dashWhenEmpty: false })}):`
        : 'Product Total:';
      printTotalLine(productLabel, formatInvoiceMoney(productTotal, { dashWhenEmpty: false }));
      if (couponDiscount > 0) {
        const couponLabel = order.coupon_code ? `Coupon (${order.coupon_code}):` : 'Coupon Discount:';
        printTotalLine(couponLabel, `- ${formatInvoiceMoney(couponDiscount, { dashWhenEmpty: false })}`, { discount: true });
      }
      const feeLabel = order.type === 'service_booking' ? 'Visit / Service Fee:' : 'Shipping Cost:';
      printTotalLine(feeLabel, shippingCost > 0 ? formatInvoiceMoney(shippingCost, { dashWhenEmpty: false }) : '-');
      if (walletUsed > 0) {
        printTotalLine('Wallet redeemed:', `- ${formatInvoiceMoney(walletUsed, { dashWhenEmpty: false })}`, { discount: true });
      }
      if (hasGst && gstSummary) {
        printTotalLine('Taxable Value:', formatInvoiceMoney(gstSummary.taxable, { dashWhenEmpty: false }));
        printTotalLine('CGST @ 9%:', formatInvoiceMoney(gstSummary.cgst, { dashWhenEmpty: false }));
        printTotalLine('SGST @ 9%:', formatInvoiceMoney(gstSummary.sgst, { dashWhenEmpty: false }));
      } else {
        printTotalLine('Taxable Value:', '-');
        printTotalLine('CGST @ 9%:', '-');
        printTotalLine('SGST @ 9%:', '-');
      }

      doc.rect(rightX + 6, lineY + 2, rightW - 12, 20).fill('#eff6ff');
      doc.fillColor(primaryColor).fontSize(8.5).font('Helvetica-Bold').text('Grand Total:', rightX + 10, lineY + 6, { lineBreak: false });
      doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold')
        .text(`Rs. ${formatInvoiceMoney(grandTotal, { dashWhenEmpty: false })}`, rightX + 8, lineY + 6, { width: rightW - 16, align: 'right', lineBreak: false });
      lineY += 28;
      doc.fillColor(grayColor).fontSize(7).font('Helvetica').text('Authorised Signatory for MTBOSS', rightX + 8, lineY, { width: rightW - 16, align: 'right', lineBreak: false });

      // ── Page bottom footer (Safely positioned above page boundary) ──
      const pageFooterY = 780;
      doc.moveTo(INVOICE_MARGIN, pageFooterY).lineTo(INVOICE_PAGE_W - INVOICE_MARGIN, pageFooterY).strokeColor(borderColor).stroke();
      doc.fillColor(grayColor).fontSize(7).font('Helvetica')
        .text('Thank you for choosing MTBOSS! This is a computer-generated tax invoice and requires no physical signature.', INVOICE_MARGIN, pageFooterY + 6, { align: 'center', width: INVOICE_CONTENT_W, lineBreak: false });
      doc.text(`${company.address} | Contact: ${company.email}`, INVOICE_MARGIN, pageFooterY + 18, { align: 'center', width: INVOICE_CONTENT_W, lineBreak: false });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Get distinct delivery cities from shop orders and service bookings
 */
export async function getDistinctDeliveryCities() {
  try {
    const query = `
      SELECT DISTINCT TRIM(city) AS city FROM (
        SELECT selected_city AS city FROM material_enquiries WHERE selected_city IS NOT NULL AND TRIM(selected_city) != ''
        UNION
        SELECT service_city AS city FROM service_bookings WHERE service_city IS NOT NULL AND TRIM(service_city) != ''
      ) sub
      WHERE city IS NOT NULL AND TRIM(city) != '' AND LOWER(TRIM(city)) != 'n/a'
      ORDER BY city ASC
    `;
    const res = await pool.query(query);
    return res.rows.map((r) => r.city).filter(Boolean);
  } catch (err) {
    console.error('getDistinctDeliveryCities error:', err);
    return [];
  }
}
