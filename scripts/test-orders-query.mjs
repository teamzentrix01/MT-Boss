import pool from '../src/lib/db.js';

async function testAggregatedQuery() {
  try {
    const shopOrdersQuery = `
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
        me.category_name,
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
        me.delivery_address,
        COALESCE(me.selected_city, 'N/A') AS delivery_city,
        me.delivery_date,
        me.created_at,
        LOWER(COALESCE(me.status, 'open')) AS status,
        me.order_intent,
        me.message AS notes,
        me.accepted_by_supplier_id,
        (
          SELECT row_to_json(sup)
          FROM (
            SELECT s.id, s.shop_name, s.business_name, s.phone, s.email, s.city
            FROM suppliers s
            WHERE s.id = me.accepted_by_supplier_id
          ) sup
        ) AS supplier,
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
      ORDER BY me.created_at DESC
      LIMIT 5
    `;

    const res = await pool.query(shopOrdersQuery);
    console.log('Aggregated query successful! Rows returned:', res.rows.length);
    console.log('Sample row:', JSON.stringify(res.rows[0], null, 2));

    // Also test summary metrics query
    const summaryQuery = `
      SELECT
        COUNT(*)::INT AS total_orders,
        COUNT(CASE WHEN LOWER(status) IN ('open', 'pending', 'processing', 'accepted', 'confirmed', 'packed', 'dispatched', 'out_for_delivery') THEN 1 END)::INT AS pending_orders,
        COUNT(CASE WHEN LOWER(status) IN ('delivered', 'fulfilled', 'completed') THEN 1 END)::INT AS delivered_orders,
        COUNT(CASE WHEN LOWER(status) IN ('cancelled', 'rejected') THEN 1 END)::INT AS cancelled_orders,
        COALESCE(SUM(CAST(COALESCE(grand_total, product_total, 0) AS NUMERIC)), 0)::NUMERIC AS total_revenue
      FROM material_enquiries
    `;
    const summaryRes = await pool.query(summaryQuery);
    console.log('Summary metrics:', summaryRes.rows[0]);
  } catch (err) {
    console.error('Error running test aggregated query:', err);
  } finally {
    process.exit(0);
  }
}

testAggregatedQuery();
