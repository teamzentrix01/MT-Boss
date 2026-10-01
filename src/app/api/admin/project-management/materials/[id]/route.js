import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase5Schema } from '@/lib/project-management';

export async function PATCH(req, { params }) {
  if (!await requirePmAccess(req)) return unauthorized();
  try {
    await ensureProjectManagementPhase5Schema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid material ID' }, { status: 400 });
    }
    const b = await req.json();
    const updates = [];
    const values = [];
    let i = 1;

    if (b.name !== undefined) {
      updates.push(`name = $${i++}`);
      values.push(String(b.name).trim());
    }
    if (b.unit !== undefined) {
      updates.push(`unit = $${i++}`);
      values.push(b.unit || null);
    }
    if (b.category !== undefined) {
      updates.push(`category = $${i++}`);
      values.push(b.category || null);
    }
    if (b.min_stock_level !== undefined) {
      updates.push(`min_stock_level = $${i++}`);
      values.push(Number(b.min_stock_level || 0));
    }
    if (b.is_active !== undefined) {
      updates.push(`is_active = $${i++}`);
      values.push(Boolean(b.is_active));
    }
    if (b.benchmark_key !== undefined) {
      updates.push(`benchmark_key = $${i++}`);
      values.push(b.benchmark_key || null);
    }

    if (!updates.length) {
      return NextResponse.json({ success: false, error: 'No fields provided' }, { status: 400 });
    }

    values.push(id);
    const r = await pool.query(
      `UPDATE pm_materials SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    if (!r.rows[0]) {
      return NextResponse.json({ success: false, error: 'Material not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: r.rows[0] });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
