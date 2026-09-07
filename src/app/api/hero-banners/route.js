import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { createInitializationGuard, handleApiError, isDatabaseConnectionError } from '@/lib/api-utils';
import { fallbackHeroBanners, fallbackResponse } from '@/lib/public-fallbacks';
import { ensureHeroBannersSchema } from '@/lib/hero-banners-schema.mjs';
import { validateBanner } from '@/lib/hero-banner-fields.mjs';
import { installServiceBanners } from '@/lib/install-service-banners';

const ensureTable = createInitializationGuard(() => ensureHeroBannersSchema(pool));
const fail = (error, status = 400) => NextResponse.json({ success: false, error }, { status });

export async function GET(req) {
  const managerMode = new URL(req.url).searchParams.get('mode') === 'manager';
  if (managerMode && !requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureTable();
    const result = await pool.query(`SELECT * FROM hero_banners ${managerMode ? '' : 'WHERE is_active = true'} ORDER BY sort_order ASC, id ASC`);
    return NextResponse.json({ success: true, data: result.rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    // Never present fallback content as editable database records.
    if (!managerMode && isDatabaseConnectionError(error)) return NextResponse.json(fallbackResponse(fallbackHeroBanners));
    return handleApiError(error);
  }
}

async function save(req, updating) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    const payload = await req.json();
    if (!payload || typeof payload !== 'object') return fail('Invalid banner.');
    if (!updating && payload.action === 'load-service-banners') {
      await ensureTable();
      return NextResponse.json({ success: true, data: await installServiceBanners() });
    }
    if (updating && (!Number.isInteger(Number(payload.id)) || Number(payload.id) < 1)) return fail('A valid banner ID is required.');
    if (updating && Object.keys(payload).every(key => ['id', 'is_active'].includes(key))) {
      if (typeof payload.is_active !== 'boolean') return fail('Invalid banner status.');
      await ensureTable();
      const result = await pool.query('UPDATE hero_banners SET is_active=$1, updated_at=NOW() WHERE id=$2 RETURNING *', [payload.is_active, payload.id]);
      if (!result.rows.length) return fail('Banner not found.', 404);
      return NextResponse.json({ success: true, data: result.rows[0] });
    }
    const { data, error } = validateBanner(payload, process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    if (error) return fail(error);
    await ensureTable();
    const fields = Object.keys(data);
    const values = Object.values(data);
    const result = updating
      ? await pool.query(`UPDATE hero_banners SET ${fields.map((key, i) => `${key}=$${i + 1}`).join(', ')}, updated_at=NOW() WHERE id=$${values.length + 1} RETURNING *`, [...values, Number(payload.id)])
      : await pool.query(`INSERT INTO hero_banners (${fields.join(', ')}) VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`, values);
    if (!result.rows.length) return fail('Banner not found.', 404);
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: updating ? 200 : 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return fail('Invalid request body.');
    return handleApiError(error);
  }
}

export async function POST(req) { return save(req, false); }
export async function PATCH(req) { return save(req, true); }

export async function DELETE(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    const { id } = await req.json();
    if (!Number.isInteger(Number(id)) || Number(id) < 1) return fail('A valid banner ID is required.');
    await ensureTable();
    const result = await pool.query('DELETE FROM hero_banners WHERE id=$1 RETURNING id', [id]);
    if (!result.rows.length) return fail('Banner not found.', 404);
    return NextResponse.json({ success: true });
  } catch (error) { return handleApiError(error); }
}
