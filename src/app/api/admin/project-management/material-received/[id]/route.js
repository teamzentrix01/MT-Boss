import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureStaffSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess, assertSameDayEditable } from '@/lib/project-management';

export async function PATCH(req, { params }) {
  try {
    await ensureStaffSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    try {
      await pool.query(`
        ALTER TABLE pm_material_received 
        ADD COLUMN IF NOT EXISTS bill_url text,
        ADD COLUMN IF NOT EXISTS bill_filename text
      `);
    } catch {}

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_material_received WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Received entry not found' }, { status: 404 });
      }

      const auth = await assertAgentAccess(req, old.project_id, 'construction');
      if (!auth.allowed) {
        await c.query('ROLLBACK');
        return auth.response;
      }

      const b = await req.json();
      const sameDay = assertSameDayEditable(old.created_at, auth.user, Boolean(b.admin_override));
      if (!sameDay.allowed) {
        await c.query('ROLLBACK');
        return sameDay.response;
      }
      const q = Number(b.quantity);
      const rate = Number(b.rate);

      if (
        !Number.isFinite(q) ||
        q <= 0 ||
        !Number.isFinite(rate) ||
        rate < 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(b.received_date || '')
      ) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Invalid received entry' }, { status: 400 });
      }

      const amount = q * rate;
      const unit = b.unit !== undefined ? (b.unit ? String(b.unit).trim() : null) : old.unit;
      const vehicleNo = b.vehicle_no !== undefined ? (b.vehicle_no ? String(b.vehicle_no).trim() : null) : old.vehicle_no;
      const driverName = b.driver_name !== undefined ? (b.driver_name ? String(b.driver_name).trim() : null) : old.driver_name;
      const driverPhone = b.driver_phone !== undefined ? (b.driver_phone ? String(b.driver_phone).trim() : null) : old.driver_phone;
      const receivedBy = b.received_by !== undefined ? (b.received_by ? String(b.received_by).trim() : null) : old.received_by;
      const gatePassNo = b.gate_pass_no !== undefined ? (b.gate_pass_no ? String(b.gate_pass_no).trim() : null) : old.gate_pass_no;

      const r = await c.query(
        `UPDATE pm_material_received
         SET quantity = $1, rate = $2, amount = $3, supplier_name = $4,
             received_date = $5, challan_no = $6, note = $7, unit = $8,
             vehicle_no = $9, driver_name = $10, driver_phone = $11, received_by = $12, gate_pass_no = $13,
             updated_at = NOW()
         WHERE id = $14
         RETURNING *`,
        [q, rate, amount, b.supplier_name || null, b.received_date, b.challan_no || null, b.note || null, unit, vehicleNo, driverName, driverPhone, receivedBy, gatePassNo, id]
      );

      const actor = actorFromAdmin(auth.user);
      await writePmPhase2Audit(c, 'pm_material_received', id, 'updated', actor, old, r.rows[0]);
      await c.query('COMMIT');
      return NextResponse.json({ success: true, data: r.rows[0] });
    } catch (e) {
      await c.query('ROLLBACK');
      return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    } finally {
      c.release();
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
    await ensureStaffSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_material_received WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Received entry not found' }, { status: 404 });
      }

      const sameDay = assertSameDayEditable(old.created_at, admin, false);
      if (!sameDay.allowed) {
        await c.query('ROLLBACK');
        return sameDay.response;
      }

      const r = await c.query(
        `UPDATE pm_material_received
         SET is_deleted = TRUE, updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      const actor = actorFromAdmin(admin);
      await writePmPhase2Audit(c, 'pm_material_received', id, 'soft_deleted', actor, old, r.rows[0]);
      await c.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (e) {
      await c.query('ROLLBACK');
      return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    } finally {
      c.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
