import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createInitializationGuard } from '@/lib/api-utils';
import { QUALITY_TIER_COLUMN_SQL } from '@/lib/quality-tier';

const ensureColumn = createInitializationGuard(async () => {
  await pool.query(QUALITY_TIER_COLUMN_SQL);
});

const isMissingSchema = (error) => error?.code === '42P01' || error?.code === '42703';

export async function GET() {
  try {
    await ensureColumn();
    const result = await pool.query(
      `SELECT m.id, m.name, m.brand, m.price, m.unit, m.category, m.quality_tier, m.created_at,
              CASE
                WHEN jsonb_array_length(COALESCE(m.available_cities, '[]'::jsonb)) > 0 THEN m.available_cities
                WHEN m.vendor_id IS NOT NULL AND v.city IS NOT NULL THEN jsonb_build_array(v.city)
                WHEN m.supplier_id <> 0 AND s.city IS NOT NULL THEN jsonb_build_array(s.city)
                ELSE '[]'::jsonb
              END AS available_cities
         FROM supplier_materials m
         LEFT JOIN suppliers s ON s.id = m.supplier_id
         LEFT JOIN vendors v ON v.id = m.vendor_id
        WHERE m.is_available = TRUE
          AND m.price > 0
          AND m.quality_tier IS NOT NULL
          AND (
            (m.vendor_id IS NOT NULL AND v.is_approved = TRUE AND v.status = 'active')
            OR (m.vendor_id IS NULL AND (m.supplier_id = 0 OR (s.status = 'approved' AND s.is_active = TRUE)))
          )
        ORDER BY m.price ASC, m.created_at ASC, m.id ASC`
    );
    const data = result.rows.map((row) => ({
      ...row,
      price: Number(row.price),
      brand: row.brand || '',
      available_cities: Array.isArray(row.available_cities) ? row.available_cities : [],
    }));
    return NextResponse.json({ success: true, data }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    if (isMissingSchema(error)) return NextResponse.json({ success: true, data: [] });
    console.error('GET calculator-tier-products error:', error);
    return NextResponse.json({ success: false, error: 'Could not load tier products' }, { status: 500 });
  }
}
