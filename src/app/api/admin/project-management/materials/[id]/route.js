import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementPhase5Schema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

export async function PATCH(req, { params }) {
  try {
    await ensureProjectManagementPhase5Schema();
    const auth = await assertAgentAccess(req, null, 'construction');
    if (!auth.allowed) return auth.response;

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

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const old = (await client.query('SELECT * FROM pm_materials WHERE id = $1 FOR UPDATE', [id])).rows[0];
      if (!old) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Material not found' }, { status: 404 });
      }

      values.push(id);
      const r = await client.query(
        `UPDATE pm_materials SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      const actor = actorFromAdmin(auth.user);
      await writePmPhase2Audit(client, 'pm_materials', id, 'updated', actor, old, r.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: r.rows[0] });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
