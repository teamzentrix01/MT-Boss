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

  // Base queries for shop orders and service bookings with child subqueries
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
        SELECT COALESCE(json_agg(ev ORDER BY ev.created_at ASC), '[]'::json)
        FROM (
          SELECT moe.id, moe.status, moe.title, moe.note, moe.actor_role, moe.actor_name, moe.created_at
          FROM material_order_events moe
          WHERE moe.order_id = me.id
        ) ev
      ) AS events,
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
      sb.service_address AS delivery_address,
      COALESCE(sb.service_city, 'N/A') AS delivery_city,
      sb.booking_date AS delivery_date,
      sb.created_at,
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

/**
 * Generate PDF Invoice Buffer using pdfkit
 */
export async function generateOrderInvoicePdf(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', (data) => buffers.push(data));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const primaryColor = '#0284c7'; // Brand Blue
      const darkColor = '#0f172a';
      const grayColor = '#64748b';
      const lightBg = '#f8fafc';
      const borderColor = '#e2e8f0';

      // ── Header ──
      doc.rect(0, 0, 595.28, 80).fill('#0f172a');

      doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text('MT-BOSS', 40, 24);
      doc.fontSize(10).font('Helvetica').fillColor('#94a3b8').text('BUILDING MATERIALS & SERVICES', 40, 48);

      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('TAX INVOICE / BILL', 360, 26, { align: 'right', width: 195 });
      doc.fontSize(9).font('Helvetica').fillColor('#cbd5e1').text(`Invoice #: ${order.order_id}`, 360, 48, { align: 'right', width: 195 });

      doc.moveDown(2);

      // ── Metadata Grid ──
      const startY = 100;
      doc.rect(40, startY, 515.28, 65).fillAndStroke(lightBg, borderColor);

      doc.fillColor(grayColor).fontSize(8).font('Helvetica-Bold').text('ORDER ID', 55, startY + 12);
      doc.fillColor(darkColor).fontSize(9).font('Helvetica').text(order.order_id, 55, startY + 24);

      doc.fillColor(grayColor).fontSize(8).font('Helvetica-Bold').text('ORDER DATE', 180, startY + 12);
      doc.fillColor(darkColor).fontSize(9).font('Helvetica').text(formatDateDDMMYYYY(order.created_at), 180, startY + 24);

      doc.fillColor(grayColor).fontSize(8).font('Helvetica-Bold').text('DELIVERY DATE', 290, startY + 12);
      doc.fillColor(darkColor).fontSize(9).font('Helvetica').text(formatDateDDMMYYYY(order.delivery_date), 290, startY + 24);

      doc.fillColor(grayColor).fontSize(8).font('Helvetica-Bold').text('DELIVERY CITY', 400, startY + 12);
      doc.fillColor(darkColor).fontSize(9).font('Helvetica').text(order.delivery_city || 'N/A', 400, startY + 24);

      doc.fillColor(grayColor).fontSize(8).font('Helvetica-Bold').text('STATUS', 55, startY + 42);
      const statusText = String(order.status || 'open').toUpperCase().replace(/_/g, ' ');
      doc.fillColor(order.status === 'delivered' || order.status === 'completed' ? '#16a34a' : '#d97706')
        .fontSize(9).font('Helvetica-Bold').text(statusText, 55, startY + 52);

      doc.fillColor(grayColor).fontSize(8).font('Helvetica-Bold').text('PAYMENT MODE', 180, startY + 42);
      doc.fillColor(darkColor).fontSize(9).font('Helvetica').text(order.payment_mode || 'Cash on Delivery / Standard', 180, startY + 52);

      // ── Customer & Supplier Blocks ──
      const customerY = startY + 80;

      // Customer Block
      doc.rect(40, customerY, 250, 95).fillAndStroke('#ffffff', borderColor);
      doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text('CUSTOMER DETAILS', 52, customerY + 10);
      doc.fillColor(darkColor).fontSize(10).font('Helvetica-Bold').text(order.customer_name || 'Customer', 52, customerY + 24);
      doc.fillColor(grayColor).fontSize(8.5).font('Helvetica').text(`Phone: ${formatIndianPhone(order.customer_phone)}`, 52, customerY + 38);
      doc.fillColor(grayColor).fontSize(8.5).font('Helvetica').text(`Email: ${order.customer_email || 'N/A'}`, 52, customerY + 50);
      doc.fillColor(grayColor).fontSize(8).font('Helvetica').text(
        `Address: ${order.delivery_address || 'N/A'}`,
        52, customerY + 62, { width: 226, height: 26, ellipsis: true }
      );

      // Supplier / Vendor Block
      doc.rect(305.28, customerY, 250, 95).fillAndStroke('#ffffff', borderColor);
      const partnerTitle = order.supplier ? 'ASSIGNED SUPPLIER' : (order.vendor ? 'ASSIGNED VENDOR' : 'FULFILLMENT HUB');
      doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text(partnerTitle, 317, customerY + 10);

      if (order.supplier) {
        doc.fillColor(darkColor).fontSize(10).font('Helvetica-Bold').text(order.supplier.shop_name || order.supplier.business_name || 'Verified Supplier', 317, customerY + 24);
        doc.fillColor(grayColor).fontSize(8.5).font('Helvetica').text(`Phone: ${formatIndianPhone(order.supplier.phone)}`, 317, customerY + 38);
        doc.fillColor(grayColor).fontSize(8.5).font('Helvetica').text(`City: ${order.supplier.city || 'N/A'}`, 317, customerY + 50);
      } else if (order.vendor) {
        doc.fillColor(darkColor).fontSize(10).font('Helvetica-Bold').text(order.vendor.vendor_name || order.vendor.shop_name || 'Verified Vendor', 317, customerY + 24);
        doc.fillColor(grayColor).fontSize(8.5).font('Helvetica').text(`Phone: ${formatIndianPhone(order.vendor.phone)}`, 317, customerY + 38);
        doc.fillColor(grayColor).fontSize(8.5).font('Helvetica').text(`City: ${order.vendor.city || 'N/A'}`, 317, customerY + 50);
      } else {
        doc.fillColor(darkColor).fontSize(10).font('Helvetica-Bold').text('MT-Boss Direct Operations', 317, customerY + 24);
        doc.fillColor(grayColor).fontSize(8.5).font('Helvetica').text('Helpline: +91 9410225039', 317, customerY + 38);
        doc.fillColor(grayColor).fontSize(8.5).font('Helvetica').text('Email: support@mtboss.in', 317, customerY + 50);
      }

      // ── Items Table ──
      const tableY = customerY + 115;
      doc.rect(40, tableY, 515.28, 24).fill('#1e293b');

      doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold');
      doc.text('ITEM DESCRIPTION', 52, tableY + 7);
      doc.text('UNIT', 260, tableY + 7);
      doc.text('QUANTITY', 320, tableY + 7);
      doc.text('RATE (Rs.)', 390, tableY + 7, { align: 'right', width: 60 });
      doc.text('AMOUNT (Rs.)', 480, tableY + 7, { align: 'right', width: 65 });

      let currentY = tableY + 24;
      const items = order.items && order.items.length > 0 ? order.items : [
        {
          name: order.product_name || 'Material Item',
          category: order.category_name,
          unit: order.order_unit || 'unit',
          quantity: order.quantity_text || '1',
          rate: order.unit_price,
          amount: order.product_total,
        },
      ];

      items.forEach((item, idx) => {
        const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        doc.rect(40, currentY, 515.28, 30).fillAndStroke(rowBg, borderColor);

        doc.fillColor(darkColor).fontSize(9).font('Helvetica-Bold').text(item.name || 'N/A', 52, currentY + 7);
        if (item.category && item.category !== 'N/A') {
          doc.fillColor(grayColor).fontSize(7.5).font('Helvetica').text(item.category, 52, currentY + 18);
        }

        doc.fillColor(darkColor).fontSize(8.5).font('Helvetica').text(item.unit || 'N/A', 260, currentY + 10);
        doc.fillColor(darkColor).fontSize(8.5).font('Helvetica').text(String(item.quantity || '1'), 320, currentY + 10);

        const rateStr = item.rate !== null && item.rate !== undefined
          ? Number(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })
          : 'N/A';
        doc.fillColor(darkColor).fontSize(8.5).font('Helvetica').text(rateStr, 390, currentY + 10, { align: 'right', width: 60 });

        const amountStr = item.amount !== null && item.amount !== undefined
          ? Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })
          : 'N/A';
        doc.fillColor(darkColor).fontSize(9).font('Helvetica-Bold').text(amountStr, 480, currentY + 10, { align: 'right', width: 65 });

        currentY += 30;
      });

      // ── Totals Calculation ──
      const totalsY = currentY + 15;
      const totalBoxX = 330;
      const totalBoxW = 225.28;

      doc.rect(totalBoxX, totalsY, totalBoxW, 110).fillAndStroke('#ffffff', borderColor);

      let lineY = totalsY + 10;
      const printTotalLine = (label, val, isBold = false, isAccent = false, isDiscount = false) => {
        doc.fillColor(grayColor).fontSize(8.5).font(isBold ? 'Helvetica-Bold' : 'Helvetica').text(label, totalBoxX + 15, lineY);
        let valColor = darkColor;
        if (isAccent) valColor = primaryColor;
        if (isDiscount) valColor = '#16a34a';

        doc.fillColor(valColor).fontSize(isBold ? 10 : 8.5).font(isBold ? 'Helvetica-Bold' : 'Helvetica')
          .text(val, totalBoxX + 100, lineY, { align: 'right', width: 110 });
        lineY += 20;
      };

      const productTotalStr = order.product_total !== null && order.product_total !== undefined
        ? `Rs. ${Number(order.product_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
        : 'N/A';
      printTotalLine('Product Total:', productTotalStr);

      if (Number(order.coupon_discount || 0) > 0) {
        const couponLabel = order.coupon_code ? `Coupon (${order.coupon_code}):` : 'Coupon Discount:';
        printTotalLine(couponLabel, `-Rs. ${Number(order.coupon_discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, false, false, true);
      }

      const feeLabel = order.type === 'service_booking' ? 'Visit / Service Fee:' : 'Shipping Cost:';
      const shippingStr = Number(order.shipping_cost || 0) > 0
        ? `Rs. ${Number(order.shipping_cost).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
        : 'Free / N/A';
      printTotalLine(feeLabel, shippingStr);

      if (Number(order.wallet_used || 0) > 0) {
        printTotalLine(
          'Wallet redeemed:',
          `-Rs. ${Number(order.wallet_used).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          false,
          false,
          true
        );
      }

      doc.moveTo(totalBoxX + 10, lineY - 5).lineTo(totalBoxX + totalBoxW - 10, lineY - 5).strokeColor(borderColor).stroke();

      const grandTotalStr = order.grand_total !== null && order.grand_total !== undefined
        ? `Rs. ${Number(order.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
        : 'N/A';
      printTotalLine('Grand Total:', grandTotalStr, true, true);

      // Notes & Instructions
      if (order.notes) {
        doc.rect(40, totalsY, 270, 75).fillAndStroke(lightBg, borderColor);
        doc.fillColor(primaryColor).fontSize(8.5).font('Helvetica-Bold').text('ORDER NOTES & REMARKS', 52, totalsY + 10);
        doc.fillColor(darkColor).fontSize(8).font('Helvetica').text(order.notes, 52, totalsY + 24, { width: 246, height: 42, ellipsis: true });
      }

      // ── Footer ──
      const footerY = 750;
      doc.moveTo(40, footerY).lineTo(555.28, footerY).strokeColor(borderColor).stroke();
      doc.fillColor(grayColor).fontSize(8).font('Helvetica')
        .text('Thank you for choosing MT-Boss! This is a computer-generated tax invoice and requires no physical signature.', 40, footerY + 12, { align: 'center', width: 515.28 });
      doc.fillColor(grayColor).fontSize(7.5).font('Helvetica')
        .text('Zentrix MT-Boss Technologies · Moradabad, Uttar Pradesh · Contact: support@mtboss.in', 40, footerY + 24, { align: 'center', width: 515.28 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
