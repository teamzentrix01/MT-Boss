import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { ensureSiteContent } from '@/lib/site-content';
import { faqPages } from '@/lib/faq-defaults.mjs';
import { validateFaq } from '@/lib/site-content-validation.mjs';
const fail = (error, status = 400) => NextResponse.json({ success: false, error }, { status });
export async function GET(req) {
  const params = new URL(req.url).searchParams;
  const manager = params.get('mode') === 'manager';
  if (manager && !requireRole(req, 'admin')) return unauthorized();
  const page = params.get('page');
  if (page && !faqPages.includes(page)) return fail('Invalid page.');
  try {
    await ensureSiteContent();
    const result = await pool.query(`SELECT * FROM site_faqs WHERE ($1::text IS NULL OR page=$1) ${manager ? '' : 'AND is_active=true'} ORDER BY page,sort_order,id`, [page]);
    return NextResponse.json({ success: true, data: result.rows }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return handleApiError(error); }
}
async function save(req, update) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') return fail('Invalid FAQ.');
    if (update && (!Number.isInteger(body.id) || body.id < 1)) return fail('Invalid FAQ ID.');
    const { data, error } = validateFaq(body);
    if (error) return fail(error);
    await ensureSiteContent();
    const values = [data.page, data.q, data.a, data.sort_order, data.is_active];
    const result = update
      ? await pool.query('UPDATE site_faqs SET page=$1,q=$2,a=$3,sort_order=$4,is_active=$5,updated_at=NOW() WHERE id=$6 RETURNING *', [...values, body.id])
      : await pool.query('INSERT INTO site_faqs(page,q,a,sort_order,is_active) VALUES($1,$2,$3,$4,$5) RETURNING *', values);
    if (!result.rows.length) return fail('FAQ not found.', 404);
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) { return error instanceof SyntaxError ? fail('Invalid JSON.') : handleApiError(error); }
}
export async function POST(req) { return save(req, false); }
export async function PATCH(req) { return save(req, true); }
export async function DELETE(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    const { id } = await req.json();
    if (!Number.isInteger(id) || id < 1) return fail('Invalid FAQ ID.');
    await ensureSiteContent();
    const result = await pool.query('DELETE FROM site_faqs WHERE id=$1 RETURNING id', [id]);
    if (!result.rows.length) return fail('FAQ not found.', 404);
    return NextResponse.json({ success: true });
  } catch (error) { return error instanceof SyntaxError ? fail('Invalid JSON.') : handleApiError(error); }
}
