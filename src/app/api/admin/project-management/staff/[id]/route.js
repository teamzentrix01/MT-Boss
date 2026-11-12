import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureStaffSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

export async function PATCH(req, { params }) {
  try {
    await ensureStaffSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid Staff ID' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query('SELECT * FROM pm_project_staff WHERE id = $1 FOR UPDATE', [id])).rows[0];
      if (!old) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Staff record not found' }, { status: 404 });
      }

      const auth = await assertAgentAccess(req, old.project_id, null);
      if (!auth.allowed) {
        await c.query('ROLLBACK');
        return auth.response;
      }

      const b = await req.json();
      const name = b.name !== undefined ? String(b.name).trim() : old.name;
      const phone = b.phone !== undefined ? (b.phone ? String(b.phone).trim() : null) : old.phone;
      const role = b.role !== undefined ? String(b.role).trim() : old.role;
      const payType = b.pay_type !== undefined ? (['monthly', 'per_day', 'fixed_fee'].includes(b.pay_type) ? b.pay_type : old.pay_type) : old.pay_type;
      const salaryRate = b.salary_rate !== undefined ? Number(b.salary_rate) : old.salary_rate;
      const commissionRate = b.commission_rate !== undefined ? Number(b.commission_rate) : old.commission_rate;
      const commissionNotes = b.commission_notes !== undefined ? (b.commission_notes ? String(b.commission_notes).trim() : null) : old.commission_notes;
      const isActive = b.is_active !== undefined ? Boolean(b.is_active) : old.is_active;

      if (!name) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Staff name cannot be empty' }, { status: 400 });
      }

      const r = await c.query(
        `UPDATE pm_project_staff
         SET name = $1, phone = $2, role = $3, pay_type = $4,
             salary_rate = $5, commission_rate = $6, commission_notes = $7,
             is_active = $8, updated_at = NOW()
         WHERE id = $9
         RETURNING *`,
        [name, phone, role, payType, salaryRate, commissionRate, commissionNotes, isActive, id]
      );

      const actor = actorFromAdmin(auth.user || auth.agent);
      await writePmPhase2Audit(c, 'pm_project_staff', id, 'updated', actor, old, r.rows[0]);
      await c.query('COMMIT');

      return NextResponse.json({ success: true, data: r.rows[0] });
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
  } catch (e) {
    console.error('STAFF PATCH ERROR:', e);
    return NextResponse.json({ success: false, error: e.message || 'Could not update staff member' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await ensureStaffSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid Staff ID' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query('SELECT * FROM pm_project_staff WHERE id = $1 FOR UPDATE', [id])).rows[0];
      if (!old) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Staff record not found' }, { status: 404 });
      }

      const auth = await assertAgentAccess(req, old.project_id, null);
      if (!auth.allowed) {
        await c.query('ROLLBACK');
        return auth.response;
      }

      // Check if attendance or payment history exists
      const attCount = await c.query('SELECT COUNT(*)::int AS count FROM pm_staff_attendance WHERE staff_id = $1', [id]);
      const payCount = await c.query('SELECT COUNT(*)::int AS count FROM pm_staff_payments WHERE staff_id = $1 AND NOT is_deleted', [id]);

      if (attCount.rows[0].count > 0 || payCount.rows[0].count > 0) {
        // Soft deactivate if linked data exists
        const upd = await c.query('UPDATE pm_project_staff SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING *', [id]);
        const actor = actorFromAdmin(auth.user || auth.agent);
        await writePmPhase2Audit(c, 'pm_project_staff', id, 'deactivated', actor, old, upd.rows[0]);
        await c.query('COMMIT');
        return NextResponse.json({ success: true, message: 'Staff deactivated because existing attendance/payment history exists', data: upd.rows[0] });
      }

      await c.query('DELETE FROM pm_project_staff WHERE id = $1', [id]);
      const actor = actorFromAdmin(auth.user || auth.agent);
      await writePmPhase2Audit(c, 'pm_project_staff', id, 'deleted', actor, old, null);
      await c.query('COMMIT');

      return NextResponse.json({ success: true, message: 'Staff member removed successfully' });
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
  } catch (e) {
    console.error('STAFF DELETE ERROR:', e);
    return NextResponse.json({ success: false, error: e.message || 'Could not delete staff member' }, { status: 500 });
  }
}
