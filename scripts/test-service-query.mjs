import pool from '../src/lib/db.js';

async function testServiceUnion() {
  try {
    const query = `
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
        '[]'::JSON AS events
      FROM service_bookings sb
      LEFT JOIN users u ON u.id = sb.user_id
      LEFT JOIN quick_services qs ON qs.id = sb.quick_service_id
      ORDER BY sb.created_at DESC
      LIMIT 3
    `;

    const res = await pool.query(query);
    console.log('Service bookings query successful! Count:', res.rows.length);
    console.log('Sample service row:', res.rows[0]);
  } catch (err) {
    console.error('Error running service bookings query:', err);
  } finally {
    process.exit(0);
  }
}

testServiceUnion();
