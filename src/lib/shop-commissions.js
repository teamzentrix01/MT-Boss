import pool from './db.js';

function createInitializationGuard(initializer, ttlMs = 5 * 60 * 1000) {
  let inFlight = null;
  let initializedAt = 0;

  return async function runInitialization() {
    if (initializedAt && Date.now() - initializedAt < ttlMs) return;

    if (!inFlight) {
      inFlight = Promise.resolve()
        .then(initializer)
        .then(() => {
          initializedAt = Date.now();
        })
        .catch((error) => {
          initializedAt = 0;
          throw error;
        })
        .finally(() => {
          inFlight = null;
        });
    }

    return inFlight;
  };
}

export const DEFAULT_COMMISSION_PERCENT = 10.00;

/**
 * Ensures the platform fee setting and shop_vendor_commissions tracking table exist.
 */
export const ensureShopVendorCommissionsSchema = createInitializationGuard(async () => {
  // 1. Ensure existing key-value settings table (pm_settings) exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pm_settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // 2. Ensure default commission setting is seeded
  await pool.query(`
    INSERT INTO pm_settings (key, value)
    VALUES ('shop_vendor_commission_percent', $1)
    ON CONFLICT (key) DO NOTHING
  `, [String(DEFAULT_COMMISSION_PERCENT)]);

  // 3. Ensure shop_vendor_commissions table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shop_vendor_commissions (
      id BIGSERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES material_enquiries(id) ON DELETE CASCADE,
      vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
      product_id INTEGER,
      order_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
      commission_percent_applied NUMERIC(5,2) NOT NULL DEFAULT 0,
      commission_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
      status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
      rate_source VARCHAR(20) DEFAULT 'default' CHECK (rate_source IN ('product', 'category', 'default')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      paid_at TIMESTAMPTZ,
      paid_note TEXT
    )
  `);

  // Ensure rate_source column exists if table was created previously
  await pool.query(`
    ALTER TABLE shop_vendor_commissions
      ADD COLUMN IF NOT EXISTS rate_source VARCHAR(20) DEFAULT 'default'
      CHECK (rate_source IN ('product', 'category', 'default'))
  `);

  // 4. Ensure shop_commission_rules table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS shop_commission_rules (
      id BIGSERIAL PRIMARY KEY,
      scope_type VARCHAR(20) NOT NULL CHECK (scope_type IN ('category', 'product')),
      scope_id INTEGER NOT NULL,
      commission_percent NUMERIC(5,2) NOT NULL CHECK (commission_percent >= 0 AND commission_percent <= 100),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(scope_type, scope_id)
    )
  `);

  // 5. Ensure performance indexes exist
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_shop_vendor_commissions_order_id ON shop_vendor_commissions(order_id);
    CREATE INDEX IF NOT EXISTS idx_shop_vendor_commissions_vendor_id ON shop_vendor_commissions(vendor_id);
    CREATE INDEX IF NOT EXISTS idx_shop_vendor_commissions_status ON shop_vendor_commissions(status);
    CREATE INDEX IF NOT EXISTS idx_shop_vendor_commissions_created_at ON shop_vendor_commissions(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_shop_commission_rules_scope ON shop_commission_rules(scope_type, scope_id);
    CREATE INDEX IF NOT EXISTS idx_shop_commission_rules_active ON shop_commission_rules(is_active);
  `);
});

/**
 * Get the current shop vendor commission percent (global default).
 * Returns a number, e.g. 10.00
 */
export async function getShopVendorCommissionPercent() {
  await ensureShopVendorCommissionsSchema();
  const res = await pool.query(
    `SELECT value FROM pm_settings WHERE key = 'shop_vendor_commission_percent' LIMIT 1`
  );
  if (!res.rows.length) return DEFAULT_COMMISSION_PERCENT;
  const num = Number(res.rows[0].value);
  return Number.isFinite(num) && num >= 0 ? num : DEFAULT_COMMISSION_PERCENT;
}

/**
 * Set the shop vendor commission percent (global default).
 * @param {number|string} percent
 */
export async function setShopVendorCommissionPercent(percent) {
  await ensureShopVendorCommissionsSchema();
  const num = Number(percent);
  if (!Number.isFinite(num) || num < 0 || num > 100) {
    throw new Error('Commission percent must be a valid number between 0 and 100');
  }
  const formatted = num.toFixed(2);
  await pool.query(
    `INSERT INTO pm_settings (key, value, updated_at)
     VALUES ('shop_vendor_commission_percent', $1, NOW())
     ON CONFLICT (key)
     DO UPDATE SET value = $1, updated_at = NOW()`,
    [formatted]
  );
  return Number(formatted);
}

/**
 * Single source of truth for resolving commission rate for a product:
 * Product rule (active) > Category rule (active) > Global Default shop_vendor_commission_percent.
 *
 * @param {Object|number} product - Product object ({ id, category, category_id }) or product ID number
 * @param {Object} [options]
 * @param {Object} [options.client] - Optional db client (for transactions)
 * @returns {Promise<{ rate: number, rateSource: 'product'|'category'|'default', ruleId: number|null, scopeType: string, scopeId: number|null }>}
 */
export async function resolveCommissionRate(product, { client = null } = {}) {
  await ensureShopVendorCommissionsSchema();
  const executor = client || pool;

  const productId = product?.id || product?.product_id || (typeof product === 'number' ? product : null);
  let categoryId = product?.category_id ? Number(product.category_id) : null;
  let categoryName = product?.category || product?.category_name || null;

  // 1. Check Product-level Rule (Highest Priority)
  if (productId) {
    const prodRuleRes = await executor.query(
      `SELECT id, commission_percent, is_active
       FROM shop_commission_rules
       WHERE scope_type = 'product' AND scope_id = $1 AND is_active = TRUE
       LIMIT 1`,
      [Number(productId)]
    );
    if (prodRuleRes.rows.length > 0) {
      return {
        rate: Number(prodRuleRes.rows[0].commission_percent),
        rateSource: 'product',
        ruleId: prodRuleRes.rows[0].id,
        scopeType: 'product',
        scopeId: Number(productId),
      };
    }

    // If category is not known yet, try to discover category from supplier_materials
    if (!categoryId && !categoryName) {
      const pRes = await executor.query(
        `SELECT category FROM supplier_materials WHERE id = $1 LIMIT 1`,
        [Number(productId)]
      );
      if (pRes.rows.length > 0) {
        categoryName = pRes.rows[0].category;
      }
    }
  }

  // 2. Check Category-level Rule (Medium Priority)
  if (!categoryId && categoryName) {
    const catRes = await executor.query(
      `SELECT id FROM shop_categories WHERE LOWER(TRIM(name)) = LOWER(TRIM($1)) LIMIT 1`,
      [String(categoryName)]
    );
    if (catRes.rows.length > 0) {
      categoryId = catRes.rows[0].id;
    }
  }

  if (categoryId) {
    const catRuleRes = await executor.query(
      `SELECT id, commission_percent, is_active
       FROM shop_commission_rules
       WHERE scope_type = 'category' AND scope_id = $1 AND is_active = TRUE
       LIMIT 1`,
      [Number(categoryId)]
    );
    if (catRuleRes.rows.length > 0) {
      return {
        rate: Number(catRuleRes.rows[0].commission_percent),
        rateSource: 'category',
        ruleId: catRuleRes.rows[0].id,
        scopeType: 'category',
        scopeId: Number(categoryId),
      };
    }
  }

  // 3. Fallback to Global Default Rate
  const defaultRate = await getShopVendorCommissionPercent();
  return {
    rate: defaultRate,
    rateSource: 'default',
    ruleId: null,
    scopeType: 'default',
    scopeId: null,
  };
}

/**
 * Create a commission tracking record for a shop order.
 * Note: Purely a tracking record — does NOT deduct anything from customer or order amount.
 */
export async function recordShopVendorCommission({
  orderId,
  vendorId,
  productId = null,
  productCategory = null,
  orderAmount,
  commissionPercent = null,
  rateSource = null,
  status = 'pending',
  client = null,
}) {
  await ensureShopVendorCommissionsSchema();

  const executor = client || pool;
  let percent = commissionPercent !== null ? Number(commissionPercent) : null;
  let source = rateSource;

  if (percent === null || source === null) {
    const resolved = await resolveCommissionRate(
      { id: productId, category: productCategory },
      { client: executor }
    );
    if (percent === null) percent = resolved.rate;
    if (source === null) source = resolved.rateSource;
  }

  const amt = Number(orderAmount) || 0;
  const commissionAmt = Math.round((amt * (percent / 100)) * 100) / 100;

  const res = await executor.query(
    `INSERT INTO shop_vendor_commissions
      (order_id, vendor_id, product_id, order_amount, commission_percent_applied, commission_amount, status, rate_source)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [orderId, vendorId, productId, amt, percent, commissionAmt, status, source || 'default']
  );

  return res.rows[0];
}

/**
 * List all configured commission rules with joined target details.
 */
export async function getShopCommissionRules({ client = null } = {}) {
  await ensureShopVendorCommissionsSchema();
  const executor = client || pool;

  const res = await executor.query(`
    SELECT
      r.id,
      r.scope_type,
      r.scope_id,
      r.commission_percent::numeric AS commission_percent,
      r.is_active,
      r.created_at,
      r.updated_at,
      CASE
        WHEN r.scope_type = 'category' THEN sc.name
        WHEN r.scope_type = 'product' THEN sm.name
        ELSE NULL
      END AS target_name,
      CASE
        WHEN r.scope_type = 'product' THEN sm.category
        ELSE NULL
      END AS product_category,
      CASE
        WHEN r.scope_type = 'product' THEN sm.vendor_id
        ELSE NULL
      END AS vendor_id,
      CASE
        WHEN r.scope_type = 'product' THEN COALESCE(v.shop_name, v.business_name, 'Vendor #' || sm.vendor_id)
        ELSE NULL
      END AS vendor_name
    FROM shop_commission_rules r
    LEFT JOIN shop_categories sc ON r.scope_type = 'category' AND sc.id = r.scope_id
    LEFT JOIN supplier_materials sm ON r.scope_type = 'product' AND sm.id = r.scope_id
    LEFT JOIN vendors v ON sm.vendor_id = v.id
    ORDER BY
      CASE r.scope_type WHEN 'category' THEN 1 WHEN 'product' THEN 2 ELSE 3 END,
      target_name ASC,
      r.id ASC
  `);

  return res.rows.map((r) => ({
    id: Number(r.id),
    scope_type: r.scope_type,
    scope_id: Number(r.scope_id),
    commission_percent: Number(r.commission_percent),
    is_active: Boolean(r.is_active),
    created_at: r.created_at,
    updated_at: r.updated_at,
    target_name: r.target_name || `${r.scope_type} #${r.scope_id}`,
    product_category: r.product_category || null,
    vendor_id: r.vendor_id ? Number(r.vendor_id) : null,
    vendor_name: r.vendor_name || null,
  }));
}

/**
 * Create or update a commission rule (category or product).
 */
export async function createOrUpdateShopCommissionRule({
  scopeType,
  scopeId,
  commissionPercent,
  isActive = true,
}, { client = null } = {}) {
  await ensureShopVendorCommissionsSchema();
  const executor = client || pool;

  const validScopeType = String(scopeType || '').trim().toLowerCase();
  if (!['category', 'product'].includes(validScopeType)) {
    throw new Error("scope_type must be either 'category' or 'product'");
  }

  const sid = Number(scopeId);
  if (!Number.isInteger(sid) || sid <= 0) {
    throw new Error('Valid scope_id is required');
  }

  const rate = Number(commissionPercent);
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    throw new Error('commission_percent must be a number between 0 and 100');
  }

  // Validate target exists
  if (validScopeType === 'category') {
    const catCheck = await executor.query('SELECT id, name FROM shop_categories WHERE id = $1', [sid]);
    if (!catCheck.rows.length) throw new Error(`Category ID ${sid} does not exist`);
  } else {
    const prodCheck = await executor.query('SELECT id, name FROM supplier_materials WHERE id = $1', [sid]);
    if (!prodCheck.rows.length) throw new Error(`Product ID ${sid} does not exist`);
  }

  const res = await executor.query(`
    INSERT INTO shop_commission_rules (scope_type, scope_id, commission_percent, is_active, updated_at)
    VALUES ($1, $2, $3, $4, NOW())
    ON CONFLICT (scope_type, scope_id)
    DO UPDATE SET
      commission_percent = EXCLUDED.commission_percent,
      is_active = EXCLUDED.is_active,
      updated_at = NOW()
    RETURNING *
  `, [validScopeType, sid, rate.toFixed(2), Boolean(isActive)]);

  return res.rows[0];
}

/**
 * Delete a commission rule by ID.
 */
export async function deleteShopCommissionRule(id, { client = null } = {}) {
  await ensureShopVendorCommissionsSchema();
  const executor = client || pool;
  const ruleId = Number(id);
  const res = await executor.query(
    'DELETE FROM shop_commission_rules WHERE id = $1 RETURNING *',
    [ruleId]
  );
  return res.rows[0] || null;
}

/**
 * Toggle active status of a commission rule.
 */
export async function toggleShopCommissionRule(id, isActive, { client = null } = {}) {
  await ensureShopVendorCommissionsSchema();
  const executor = client || pool;
  const ruleId = Number(id);
  const res = await executor.query(
    'UPDATE shop_commission_rules SET is_active = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [Boolean(isActive), ruleId]
  );
  return res.rows[0] || null;
}

/**
 * Get available categories and vendor products for rule creation selectors.
 */
export async function getAvailableCommissionTargets({ client = null } = {}) {
  await ensureShopVendorCommissionsSchema();
  const executor = client || pool;

  const [categoriesRes, productsRes] = await Promise.all([
    executor.query(`
      SELECT id, name, unit
      FROM shop_categories
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, name ASC
    `),
    executor.query(`
      SELECT
        sm.id,
        sm.name,
        sm.category,
        sm.price,
        sm.vendor_id,
        COALESCE(v.shop_name, v.business_name, 'Vendor #' || sm.vendor_id) AS vendor_name
      FROM supplier_materials sm
      LEFT JOIN vendors v ON sm.vendor_id = v.id
      WHERE sm.vendor_id IS NOT NULL AND sm.vendor_id > 0
      ORDER BY sm.name ASC
    `),
  ]);

  return {
    categories: categoriesRes.rows.map((c) => ({
      id: Number(c.id),
      name: c.name,
      unit: c.unit || '',
    })),
    products: productsRes.rows.map((p) => ({
      id: Number(p.id),
      name: p.name,
      category: p.category || '',
      price: Number(p.price || 0),
      vendor_id: Number(p.vendor_id),
      vendor_name: p.vendor_name,
    })),
  };
}

/**
 * Query detailed shop vendor commission records with pagination and filters.
 */
export async function getShopVendorCommissionRecords({
  status = 'all',
  vendorId = null,
  startDate = null,
  endDate = null,
  page = 1,
  limit = 20,
} = {}) {
  await ensureShopVendorCommissionsSchema();

  const conditions = [];
  const params = [];

  if (status && status !== 'all') {
    params.push(status.toLowerCase());
    conditions.push(`svc.status = $${params.length}`);
  }

  if (vendorId && Number(vendorId) > 0) {
    params.push(Number(vendorId));
    conditions.push(`svc.vendor_id = $${params.length}`);
  }

  if (startDate) {
    params.push(startDate);
    conditions.push(`svc.created_at >= $${params.length}::timestamptz`);
  }

  if (endDate) {
    const endStr = endDate.length === 10 ? `${endDate}T23:59:59.999Z` : endDate;
    params.push(endStr);
    conditions.push(`svc.created_at <= $${params.length}::timestamptz`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Total matching count
  const countSql = `SELECT COUNT(*)::int AS total FROM shop_vendor_commissions svc ${whereClause}`;
  const countRes = await pool.query(countSql, params);
  const total = Number(countRes.rows[0]?.total || 0);

  const safeLimit = Math.max(1, Math.min(100, Number(limit) || 20));
  const safePage = Math.max(1, Number(page) || 1);
  const offset = (safePage - 1) * safeLimit;

  // Query records
  const queryParams = [...params, safeLimit, offset];
  const recordsSql = `
    SELECT
      svc.id,
      svc.order_id,
      svc.vendor_id,
      svc.product_id,
      svc.order_amount::numeric AS order_amount,
      svc.commission_percent_applied::numeric AS commission_percent_applied,
      svc.commission_amount::numeric AS commission_amount,
      svc.status,
      svc.rate_source,
      svc.created_at,
      svc.paid_at,
      svc.paid_note,
      me.order_reference,
      COALESCE(NULLIF(TRIM(v.shop_name), ''), NULLIF(TRIM(v.business_name), ''), 'Vendor #' || svc.vendor_id) AS vendor_name,
      v.phone AS vendor_phone,
      COALESCE(NULLIF(TRIM(sm.name), ''), 'Shop Product #' || COALESCE(svc.product_id::text, svc.order_id::text)) AS product_name,
      sm.category AS product_category
    FROM shop_vendor_commissions svc
    LEFT JOIN material_enquiries me ON me.id = svc.order_id
    LEFT JOIN vendors v ON v.id = svc.vendor_id
    LEFT JOIN supplier_materials sm ON sm.id = svc.product_id
    ${whereClause}
    ORDER BY svc.created_at DESC, svc.id DESC
    LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
  `;

  const [recordsRes, vendorsRes] = await Promise.all([
    pool.query(recordsSql, queryParams),
    pool.query(`
      SELECT DISTINCT
        v.id,
        COALESCE(NULLIF(TRIM(v.shop_name), ''), NULLIF(TRIM(v.business_name), ''), 'Vendor #' || v.id) AS name
      FROM vendors v
      INNER JOIN shop_vendor_commissions svc ON svc.vendor_id = v.id
      ORDER BY name ASC
    `),
  ]);

  return {
    records: recordsRes.rows.map((r) => ({
      id: Number(r.id),
      order_id: Number(r.order_id),
      order_reference: r.order_reference || `MO-${r.order_id}`,
      vendor_id: Number(r.vendor_id),
      vendor_name: r.vendor_name,
      vendor_phone: r.vendor_phone,
      product_id: r.product_id ? Number(r.product_id) : null,
      product_name: r.product_name,
      product_category: r.product_category,
      order_amount: Number(r.order_amount || 0),
      commission_percent_applied: Number(r.commission_percent_applied || 0),
      commission_amount: Number(r.commission_amount || 0),
      status: r.status,
      rate_source: r.rate_source || 'default',
      created_at: r.created_at,
      paid_at: r.paid_at,
      paid_note: r.paid_note,
    })),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
    vendors: vendorsRes.rows.map((v) => ({
      id: Number(v.id),
      name: v.name,
    })),
  };
}

/**
 * Aggregates shop vendor commission metrics and vendor pending dues for the Admin Dashboard.
 */
export async function getShopVendorCommissionOverview() {
  await ensureShopVendorCommissionsSchema();

  const [statsRes, vendorsRes] = await Promise.all([
    pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN created_at::date = CURRENT_DATE THEN commission_amount ELSE 0 END), 0)::numeric AS today,
        COALESCE(SUM(commission_amount), 0)::numeric AS total,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END), 0)::numeric AS pending,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END), 0)::numeric AS paid,
        COUNT(*)::int AS total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::int AS pending_count,
        COUNT(CASE WHEN status = 'paid' THEN 1 END)::int AS paid_count
      FROM shop_vendor_commissions
    `),
    pool.query(`
      SELECT
        svc.vendor_id,
        COALESCE(NULLIF(TRIM(v.shop_name), ''), NULLIF(TRIM(v.business_name), ''), 'Vendor #' || svc.vendor_id) AS vendor_name,
        v.phone,
        v.email,
        COUNT(svc.id)::int AS pending_orders_count,
        COALESCE(SUM(svc.commission_amount), 0)::numeric AS pending_due_amount,
        array_agg(svc.id ORDER BY svc.id DESC) AS commission_ids,
        array_agg(svc.order_id ORDER BY svc.id DESC) AS order_ids
      FROM shop_vendor_commissions svc
      LEFT JOIN vendors v ON v.id = svc.vendor_id
      WHERE svc.status = 'pending'
      GROUP BY svc.vendor_id, v.shop_name, v.business_name, v.phone, v.email
      ORDER BY pending_due_amount DESC
    `),
  ]);

  const row = statsRes.rows[0] || {};
  return {
    today: Number(row.today || 0),
    total: Number(row.total || 0),
    pending: Number(row.pending || 0),
    paid: Number(row.paid || 0),
    totalOrders: Number(row.total_orders || 0),
    pendingCount: Number(row.pending_count || 0),
    paidCount: Number(row.paid_count || 0),
    pendingVendors: (vendorsRes.rows || []).map((v) => ({
      vendor_id: Number(v.vendor_id),
      vendor_name: v.vendor_name,
      phone: v.phone || '',
      email: v.email || '',
      pending_orders_count: Number(v.pending_orders_count || 0),
      pending_due_amount: Number(v.pending_due_amount || 0),
      commission_ids: v.commission_ids || [],
      order_ids: v.order_ids || [],
    })),
  };
}

/**
 * Mark vendor commissions as paid for offline settlement.
 * Can settle all pending for a vendor or a specific commission row.
 */
export async function markShopVendorCommissionPaid({ vendorId, commissionId, paidNote }) {
  await ensureShopVendorCommissionsSchema();

  const note = (paidNote && String(paidNote).trim()) || 'Settled offline by admin';

  if (vendorId) {
    const res = await pool.query(
      `UPDATE shop_vendor_commissions
       SET status = 'paid', paid_at = NOW(), paid_note = $1
       WHERE vendor_id = $2 AND status = 'pending'
       RETURNING id, order_id, vendor_id, commission_amount, status, paid_at, paid_note`,
      [note, vendorId]
    );
    return res.rows;
  }

  if (commissionId) {
    const res = await pool.query(
      `UPDATE shop_vendor_commissions
       SET status = 'paid', paid_at = NOW(), paid_note = $1
       WHERE id = $2 AND status = 'pending'
       RETURNING id, order_id, vendor_id, commission_amount, status, paid_at, paid_note`,
      [note, commissionId]
    );
    return res.rows;
  }

  throw new Error('Either vendorId or commissionId must be provided');
}

/**
 * Get a specific vendor's own commission summary and recent orders list.
 * Scoped strictly to that vendor's ID.
 */
export async function getVendorOwnCommissionSummary(vendorId) {
  await ensureShopVendorCommissionsSchema();

  const vId = Number(vendorId);
  if (!vId) {
    throw new Error('Valid vendorId is required');
  }

  const [statsRes, ordersRes] = await Promise.all([
    pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'pending' THEN commission_amount ELSE 0 END), 0)::numeric AS pending_commission,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN commission_amount ELSE 0 END), 0)::numeric AS paid_commission,
        COALESCE(SUM(commission_amount), 0)::numeric AS total_commission,
        COUNT(*)::int AS total_orders_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::int AS pending_orders_count,
        COUNT(CASE WHEN status = 'paid' THEN 1 END)::int AS paid_orders_count
      FROM shop_vendor_commissions
      WHERE vendor_id = $1
    `, [vId]),
    pool.query(`
      SELECT
        svc.id,
        svc.order_id,
        svc.product_id,
        COALESCE(NULLIF(TRIM(sm.name), ''), 'Shop Product #' || COALESCE(svc.product_id::text, svc.order_id::text)) AS product_name,
        svc.order_amount,
        svc.commission_percent_applied,
        svc.commission_amount,
        svc.status,
        svc.created_at,
        svc.paid_at,
        svc.paid_note
      FROM shop_vendor_commissions svc
      LEFT JOIN supplier_materials sm ON sm.id = svc.product_id
      WHERE svc.vendor_id = $1
      ORDER BY svc.created_at DESC
      LIMIT 50
    `, [vId]),
  ]);

  const row = statsRes.rows[0] || {};
  return {
    pending_commission: Number(row.pending_commission || 0),
    paid_commission: Number(row.paid_commission || 0),
    total_commission: Number(row.total_commission || 0),
    total_orders_count: Number(row.total_orders_count || 0),
    pending_orders_count: Number(row.pending_orders_count || 0),
    paid_orders_count: Number(row.paid_orders_count || 0),
    recent_orders: ordersRes.rows.map((r) => ({
      id: r.id,
      order_id: r.order_id,
      product_id: r.product_id,
      product_name: r.product_name,
      order_amount: Number(r.order_amount || 0),
      commission_percent_applied: Number(r.commission_percent_applied || 0),
      commission_amount: Number(r.commission_amount || 0),
      status: r.status,
      created_at: r.created_at,
      paid_at: r.paid_at,
      paid_note: r.paid_note,
    })),
  };
}

