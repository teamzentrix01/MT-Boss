import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { calculateShipping, getShippingSettings } from '@/lib/shipping';
import { resolveManagedCity } from '@/lib/cities';

export async function POST(req) {
  try {
    const { customerCity, items } = await req.json();
    const city = await resolveManagedCity(customerCity);
    if (!city || !Array.isArray(items) || !items.length || items.length > 20) {
      return NextResponse.json(
        { success: false, error: 'A delivery city and 1 to 20 cart items are required' },
        { status: 400 }
      );
    }

    const ids = items.map((item) => Number(item.product_id)).filter((id) => Number.isInteger(id) && id > 0);
    if (ids.length !== items.length) {
      return NextResponse.json(
        { success: false, error: 'Shipping is available for uploaded products only' },
        { status: 400 }
      );
    }

    const uniqueIds = [...new Set(ids)];
    const result = await pool.query(
      `SELECT m.id, m.name, m.category, m.unit, m.price, m.bulk_pricing,
        COALESCE(NULLIF(TRIM(v.city), ''), NULLIF(TRIM(s.city), ''), CASE WHEN jsonb_array_length(COALESCE(m.available_cities, '[]'::jsonb))=1 THEN m.available_cities->>0 END) AS source_city
       FROM supplier_materials m
       LEFT JOIN vendors v ON v.id = m.vendor_id
       LEFT JOIN suppliers s ON s.id = m.supplier_id
       WHERE m.id = ANY($1::int[]) AND m.is_available = TRUE
         AND (m.vendor_id IS NULL OR COALESCE(m.specifications->'__approval__'->>'status', 'approved') = 'approved')`,
      [uniqueIds]
    );

    if (result.rows.length !== uniqueIds.length) {
      return NextResponse.json(
        { success: false, error: 'One or more products are unavailable. Refresh your cart.' },
        { status: 409 }
      );
    }

    const quantities = new Map(items.map((it) => [Number(it.product_id), Number(it.quantity) || 1]));
    const preparedItems = result.rows.map((row) => {
      const qty = quantities.get(row.id) || 1;
      const tier = (Array.isArray(row.bulk_pricing) ? row.bulk_pricing : [])
        .filter((entry) => qty >= Number(entry.min_quantity))
        .sort((a, b) => Number(b.min_quantity) - Number(a.min_quantity))[0];
      return {
        product_id: row.id,
        name: row.name,
        category: row.category,
        unit: row.unit,
        price: tier ? Number(tier.price) : Number(row.price) || 0,
        quantity: qty,
        source_city: row.source_city || city,
      };
    });

    const settings = await getShippingSettings();
    const shipping = calculateShipping({ items: preparedItems, customerCity: city, settings });

    return NextResponse.json({ success: true, data: shipping });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Could not calculate shipping' },
      { status: 500 }
    );
  }
}

