import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { calculateShipping, getShippingSettings } from '@/lib/shipping';
import { resolveManagedCity } from '@/lib/cities';

export async function POST(req) {
  try {
    const { customerCity, items } = await req.json();
    const city = await resolveManagedCity(customerCity);
    if (!city || !Array.isArray(items) || !items.length || items.length > 20) return NextResponse.json({ success: false, error: 'A delivery city and 1 to 20 cart items are required' }, { status: 400 });
    const ids = items.map((item) => Number(item.product_id)).filter((id) => Number.isInteger(id) && id > 0);
    if (ids.length !== items.length) return NextResponse.json({ success: false, error: 'Shipping is available for uploaded products only' }, { status: 400 });
    const result = await pool.query(`SELECT m.id, m.price, m.bulk_pricing, m.supplier_id, m.vendor_id,
      COALESCE(NULLIF(TRIM(v.city), ''), NULLIF(TRIM(s.city), ''),
        CASE WHEN jsonb_array_length(COALESCE(m.available_cities, '[]'::jsonb)) = 1 THEN m.available_cities->>0 END) AS source_city
      FROM supplier_materials m LEFT JOIN vendors v ON v.id=m.vendor_id LEFT JOIN suppliers s ON s.id=m.supplier_id
      WHERE m.id = ANY($1::int[]) AND m.is_available=TRUE`, [ids]);
    if (result.rows.length !== ids.length) return NextResponse.json({ success: false, error: 'One or more products are unavailable. Refresh your cart.' }, { status: 409 });
    const requested = new Map(items.map((item) => [Number(item.product_id), Math.max(1, Math.floor(Number(item.quantity) || 1))]));
    const groups = new Map();
    for (const product of result.rows) {
      const quantity = requested.get(product.id);
      const tier = (Array.isArray(product.bulk_pricing) ? product.bulk_pricing : []).filter((entry) => quantity >= Number(entry.min_quantity)).sort((a, b) => Number(b.min_quantity) - Number(a.min_quantity))[0];
      const value = (tier ? Number(tier.price) : Number(product.price) || 0) * quantity;
      const key = String(product.source_city || '').trim().toLowerCase();
      const current = groups.get(key) || { vendorCity: product.source_city || '', orderValue: 0 };
      current.orderValue += value;
      groups.set(key, current);
    }
    const shipping = calculateShipping({ groups: [...groups.values()], customerCity: city, settings: await getShippingSettings() });
    return NextResponse.json({ success: true, data: shipping });
  } catch (error) { return NextResponse.json({ success: false, error: error.message || 'Could not calculate shipping' }, { status: 500 }); }
}
