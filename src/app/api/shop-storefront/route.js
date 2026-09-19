import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { createInitializationGuard, isDatabaseConnectionError } from '@/lib/api-utils';
import { defaultShopStorefront, normalizeShopStorefront } from '@/lib/shop-storefront-defaults';

export const dynamic = 'force-dynamic';

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS shop_storefront_settings (
    id SMALLINT PRIMARY KEY CHECK (id = 1),
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
});

export async function GET() {
  try {
    await ensureTable();
    const result = await pool.query('SELECT content FROM shop_storefront_settings WHERE id = 1');
    return NextResponse.json({ success: true, data: normalizeShopStorefront(result.rows[0]?.content) });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return NextResponse.json({ success: true, data: defaultShopStorefront, fallback: true });
    }
    console.error('GET shop-storefront error:', error);
    return NextResponse.json({ success: false, error: 'Could not load storefront content' }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!requireRole(req, 'admin')) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 401 });
  try {
    const content = normalizeShopStorefront(await req.json());
    await ensureTable();
    await pool.query(`INSERT INTO shop_storefront_settings (id, content)
      VALUES (1, $1::jsonb)
      ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`, [JSON.stringify(content)]);
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('PUT shop-storefront error:', error);
    return NextResponse.json({ success: false, error: 'Could not save storefront content' }, { status: 500 });
  }
}
