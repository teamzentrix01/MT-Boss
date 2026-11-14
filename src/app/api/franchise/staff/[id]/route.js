import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getFranchiseAccess, franchiseAccessResponse } from '@/lib/franchise-access';
import { ensureFranchiseStaffSchema } from '@/lib/franchise-staff';

export async function PATCH(req, { params }) {
  try {
    await ensureFranchiseStaffSchema();
    const access = await getFranchiseAccess(req, 'staff.manage');
    if (!access.allowed) return franchiseAccessResponse(access);

    const franchiseId = access.user.id;
    const staffId = Number((await params)?.id);

    if (!Number.isInteger(staffId) || staffId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid staff ID' }, { status: 400 });
    }

    // Check staff exists and belongs to this franchise
    const existingResult = await pool.query(
      `SELECT * FROM franchise_staff WHERE id = $1 AND franchise_id = $2`,
      [staffId, franchiseId]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
    }

    const existing = existingResult.rows[0];
    const body = await req.json();

    const name = body.name !== undefined ? String(body.name).trim() : existing.name;
    const phone = body.phone !== undefined ? String(body.phone).trim() : existing.phone;
    const email = body.email !== undefined ? (String(body.email).trim() || null) : existing.email;
    const role = body.role !== undefined ? String(body.role).trim() : existing.role;
    const department = body.department !== undefined ? String(body.department).trim() : existing.department;
    const joiningDate = body.joining_date !== undefined ? body.joining_date : existing.joining_date;
    const status = body.status !== undefined && ['working', 'resigned', 'terminated', 'on_leave', 'inactive'].includes(body.status)
      ? body.status
      : existing.status;

    let relievingDate = body.relieving_date !== undefined ? (body.relieving_date || null) : existing.relieving_date;

    // Automatic date handling when status changes
    if (status !== 'working' && status !== 'on_leave' && !relievingDate) {
      relievingDate = new Date().toISOString().slice(0, 10);
    } else if (status === 'working' && body.relieving_date === undefined) {
      relievingDate = null;
    }

    const assignedProjectOrSite = body.assigned_project_or_site !== undefined
      ? (String(body.assigned_project_or_site).trim() || null)
      : existing.assigned_project_or_site;
    const notes = body.notes !== undefined ? (String(body.notes).trim() || null) : existing.notes;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name cannot be empty' }, { status: 400 });
    }

    const updateResult = await pool.query(
      `UPDATE franchise_staff
       SET
         name = $1,
         phone = $2,
         email = $3,
         role = $4,
         department = $5,
         joining_date = $6,
         relieving_date = $7,
         status = $8,
         assigned_project_or_site = $9,
         notes = $10,
         updated_at = NOW()
       WHERE id = $11 AND franchise_id = $12
       RETURNING
         id,
         COALESCE(staff_code, 'FS-' || LPAD(id::text, 4, '0')) AS staff_code,
         franchise_id,
         name,
         phone,
         email,
         role,
         department,
         TO_CHAR(joining_date, 'YYYY-MM-DD') AS joining_date,
         TO_CHAR(relieving_date, 'YYYY-MM-DD') AS relieving_date,
         status,
         assigned_project_or_site,
         notes,
         created_at,
         updated_at`,
      [
        name,
        phone,
        email,
        role,
        department,
        joiningDate,
        relievingDate,
        status,
        assignedProjectOrSite,
        notes,
        staffId,
        franchiseId,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Staff record updated successfully',
      data: updateResult.rows[0],
    });
  } catch (error) {
    console.error('Error updating franchise staff member:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update staff record' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await ensureFranchiseStaffSchema();
    const access = await getFranchiseAccess(req, 'staff.manage');
    if (!access.allowed) return franchiseAccessResponse(access);

    const franchiseId = access.user.id;
    const staffId = Number((await params)?.id);

    if (!Number.isInteger(staffId) || staffId <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid staff ID' }, { status: 400 });
    }

    const deleteResult = await pool.query(
      `DELETE FROM franchise_staff WHERE id = $1 AND franchise_id = $2 RETURNING id, name`,
      [staffId, franchiseId]
    );

    if (deleteResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Staff member ${deleteResult.rows[0].name} deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting franchise staff member:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete staff record' },
      { status: 500 }
    );
  }
}

