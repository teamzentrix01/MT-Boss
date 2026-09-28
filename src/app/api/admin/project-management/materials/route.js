import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementPhase5Schema, pageParams } from '@/lib/project-management';

export async function GET(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const q = s.get('search') || '';
    const r = await pool.query(
      `SELECT *, COUNT(*) OVER()::int total_count
       FROM pm_materials
       WHERE ($1 = '' OR name ILIKE '%'||$1||'%' OR COALESCE(benchmark_key, '') ILIKE '%'||$1||'%')
       ORDER BY name
       LIMIT $2 OFFSET $3`,
      [q, pageSize, offset]
    );
    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: r.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!requireRole(req, 'admin')) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const b = await req.json();
    const name = String(b.name || '').trim();
    const min = Number(b.min_stock_level || 0);
    if (!name || !Number.isFinite(min) || min < 0) {
      return NextResponse.json({ success: false, error: 'Invalid material' }, { status: 400 });
    }
    const benchmarkKey = b.benchmark_key || null;
    const r = await pool.query(
      `INSERT INTO pm_materials(name, unit, category, min_stock_level, is_active, benchmark_key)
       VALUES($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, b.unit || null, b.category || null, min, b.is_active !== false, benchmarkKey]
    );
    return NextResponse.json({ success: true, data: r.rows[0] }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e.code === '23505' ? 'Material already exists' : e.message },
      { status: e.code === '23505' ? 409 : 500 }
    );
  }
}
