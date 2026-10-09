import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, actorFromAdmin, writePmAudit, assertAgentAccess } from '@/lib/project-management';

function values(b) {
  const amount = Number(b.amount);
  return Number.isFinite(amount) && amount > 0 && b.payment_date
    ? [amount, b.payment_date, String(b.mode || '').trim() || null, String(b.note || '').trim() || null]
    : null;
}

export async function PATCH(req, { params }) {
  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    const v = values(await req.json());
    if (!Number.isInteger(id) || !v) {
      return NextResponse.json({ success: false, error: 'Provide valid payment details' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const old = (await client.query('SELECT * FROM pm_party_payments WHERE id = $1 FOR UPDATE', [id])).rows[0];
      if (!old || old.is_deleted) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
      }

      const auth = await assertAgentAccess(req, old.project_id, 'payments');
      if (!auth.allowed) {
        await client.query('ROLLBACK');
        return auth.response;
      }

      const actor = actorFromAdmin(auth.user);
      const result = await client.query(
        'UPDATE pm_party_payments SET amount = $1, payment_date = $2, mode = $3, note = $4, updated_by = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
        [...v, actor, id]
      );
      await writePmAudit(client, 'party_payment', id, 'updated', actor, old, result.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: result.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not update payment' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = requireRole(req, 'admin');
  if (!admin) {
    // If agent tried to delete, return 403 explicitly
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
      const old = (await client.query('SELECT * FROM pm_party_payments WHERE id = $1 FOR UPDATE', [id])).rows[0];
      if (!old || old.is_deleted) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
      }
      const actor = actorFromAdmin(admin);
      const result = await client.query(
        'UPDATE pm_party_payments SET is_deleted = TRUE, deleted_by = $1, deleted_at = NOW(), updated_by = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [actor, id]
      );
      await writePmAudit(client, 'party_payment', id, 'soft_deleted', actor, old, result.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not delete payment' }, { status: 500 });
  }
}
