import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

export async function PATCH(req, { params }) {
  try {
    await ensureProjectManagementSchema();
    const auth = await assertAgentAccess(req, null, 'vendor');
    if (!auth.allowed) return auth.response;

    const b = await req.json();
    const id = Number((await params).id);
    const name = String(b.name || '').trim();
    if (!name) return NextResponse.json({ success: false, error: 'Vendor name is required' }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const old = (await client.query('SELECT * FROM pm_vendors WHERE id = $1 FOR UPDATE', [id])).rows[0];
      if (!old) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
      }

      const r = await client.query(
        `UPDATE pm_vendors
         SET name = $1, phone = $2, trade = $3, address = $4, is_active = $5
         WHERE id = $6
         RETURNING *`,
        [name, b.phone || null, b.trade || null, b.address || null, b.is_active !== false, id]
      );

      const actor = actorFromAdmin(auth.user);
      await writePmPhase2Audit(client, 'pm_vendors', id, 'updated', actor, old, r.rows[0]);
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

export async function DELETE(req, { params }) {
  const admin = requireRole(req, 'admin');
  if (!admin) {
    const auth = await assertAgentAccess(req, null, null);
    if (auth.role === 'agent') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Agents cannot delete records (admin only)' }, { status: 403 });
    }
    return unauthorized();
  }

  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const old = (await client.query('SELECT * FROM pm_vendors WHERE id = $1 FOR UPDATE', [id])).rows[0];
      if (!old) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
      }

      const r = await client.query(`UPDATE pm_vendors SET is_active = FALSE WHERE id = $1 RETURNING *`, [id]);
      const actor = actorFromAdmin(admin);
      await writePmPhase2Audit(client, 'pm_vendors', id, 'deactivated', actor, old, r.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true });
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
