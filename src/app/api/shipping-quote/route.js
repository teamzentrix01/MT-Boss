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
    const result = await pool.query(`SELECT m.id, m.category, c.shipping_charge
      FROM supplier_materials m
      LEFT JOIN shop_categories c ON LOWER(TRIM(c.name)) = LOWER(TRIM(m.category))
      WHERE m.id = ANY($1::int[]) AND m.is_available=TRUE`, [ids]);
    if (result.rows.length !== ids.length) return NextResponse.json({ success: false, error: 'One or more products are unavailable. Refresh your cart.' }, { status: 409 });
    
    // Group by category to apply shipping charge once per category
    const categoryCharges = new Map();
    for (const product of result.rows) {
      const catName = (product.category || 'Other').trim();
      if (!categoryCharges.has(catName)) {
        categoryCharges.set(catName, Number(product.shipping_charge) || 0);
      }
    }
    
    let totalShipping = 0;
    const breakdown = [];
    
    for (const [catName, charge] of categoryCharges.entries()) {
      totalShipping += charge;
      breakdown.push({
        vendorCity: '',
        customerCity: city,
        orderValue: 0,
        distanceKm: null,
        shippingCost: charge,
        label: `Shipping (${catName}): ₹${charge.toLocaleString('en-IN')}`
      });
    }

    const shipping = { breakdown, totalShipping };
    return NextResponse.json({ success: true, data: shipping });
  } catch (error) { return NextResponse.json({ success: false, error: error.message || 'Could not calculate shipping' }, { status: 500 }); }
}
