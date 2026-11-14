import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getFranchiseAccess, franchiseAccessResponse } from '@/lib/franchise-access';
import { ensureFranchiseStaffSchema } from '@/lib/franchise-staff';

export async function GET(req) {
  try {
    await ensureFranchiseStaffSchema();
    const access = await getFranchiseAccess(req, 'staff.view');
    if (!access.allowed) return franchiseAccessResponse(access);

    const franchiseId = access.user.id;
    const url = new URL(req.url);
    const search = (url.searchParams.get('search') || '').trim();
    const roleFilter = (url.searchParams.get('role') || '').trim();
    const statusFilter = (url.searchParams.get('status') || '').trim();

    // 1. Calculate overall staff count metrics for this franchise
    const summaryResult = await pool.query(
      `SELECT
         COUNT(*)::int AS total_staff,
         COUNT(*) FILTER (WHERE status = 'working')::int AS currently_working,
         COUNT(*) FILTER (WHERE status = 'on_leave')::int AS on_leave,
         COUNT(*) FILTER (WHERE status IN ('resigned', 'terminated', 'inactive'))::int AS resigned_or_left
       FROM franchise_staff
       WHERE franchise_id = $1`,
      [franchiseId]
    );

    const summary = summaryResult.rows[0] || {
      total_staff: 0,
      currently_working: 0,
      on_leave: 0,
      resigned_or_left: 0,
    };

    // 2. Fetch staff list with filters
    const queryParams = [franchiseId];
    let queryText = `
      SELECT
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
        updated_at
      FROM franchise_staff
      WHERE franchise_id = $1
    `;

    if (search) {
      queryParams.push(`%${search}%`);
      queryText += ` AND (
        name ILIKE $${queryParams.length}
        OR COALESCE(staff_code, '') ILIKE $${queryParams.length}
        OR COALESCE(phone, '') ILIKE $${queryParams.length}
        OR COALESCE(email, '') ILIKE $${queryParams.length}
        OR role ILIKE $${queryParams.length}
        OR COALESCE(assigned_project_or_site, '') ILIKE $${queryParams.length}
      )`;
    }

    if (roleFilter && roleFilter !== 'all') {
      queryParams.push(roleFilter);
      queryText += ` AND role = $${queryParams.length}`;
    }

    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'active') {
        queryText += ` AND status IN ('working', 'on_leave')`;
      } else if (statusFilter === 'former') {
        queryText += ` AND status IN ('resigned', 'terminated', 'inactive')`;
      } else {
        queryParams.push(statusFilter);
        queryText += ` AND status = $${queryParams.length}`;
      }
    }

    queryText += ` ORDER BY CASE WHEN status = 'working' THEN 1 WHEN status = 'on_leave' THEN 2 ELSE 3 END, joining_date DESC, id DESC`;

    const recordsResult = await pool.query(queryText, queryParams);

    return NextResponse.json({
      success: true,
      summary,
      data: recordsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching franchise staff records:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch staff records' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await ensureFranchiseStaffSchema();
    const access = await getFranchiseAccess(req, 'staff.manage');
    if (!access.allowed) return franchiseAccessResponse(access);

    const franchiseId = access.user.id;
    const body = await req.json();

    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const email = String(body.email || '').trim() || null;
    const role = String(body.role || 'Site Supervisor').trim();
    const department = String(body.department || 'Operations').trim();
    const joiningDate = body.joining_date || new Date().toISOString().slice(0, 10);
    const relievingDate = body.relieving_date || null;
    const status = ['working', 'resigned', 'terminated', 'on_leave', 'inactive'].includes(body.status)
      ? body.status
      : 'working';
    const assignedProjectOrSite = String(body.assigned_project_or_site || '').trim() || null;
    const notes = String(body.notes || '').trim() || null;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Staff member name is required' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const insertResult = await pool.query(
      `WITH inserted AS (
        INSERT INTO franchise_staff (
          franchise_id,
          name,
          phone,
          email,
          role,
          department,
          joining_date,
          relieving_date,
          status,
          assigned_project_or_site,
          notes,
          created_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        RETURNING *
      )
      UPDATE franchise_staff
         SET staff_code = 'FS-' || LPAD(inserted.id::text, 4, '0')
        FROM inserted
       WHERE franchise_staff.id = inserted.id
      RETURNING
        franchise_staff.id,
        franchise_staff.staff_code,
        franchise_staff.franchise_id,
        franchise_staff.name,
        franchise_staff.phone,
        franchise_staff.email,
        franchise_staff.role,
        franchise_staff.department,
        TO_CHAR(franchise_staff.joining_date, 'YYYY-MM-DD') AS joining_date,
        TO_CHAR(franchise_staff.relieving_date, 'YYYY-MM-DD') AS relieving_date,
        franchise_staff.status,
        franchise_staff.assigned_project_or_site,
        franchise_staff.notes,
        franchise_staff.created_at`,
      [
        franchiseId,
        name,
        phone,
        email,
        role,
        department,
        joiningDate,
        status !== 'working' ? relievingDate : null,
        status,
        assignedProjectOrSite,
        notes,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Staff member added successfully',
      data: insertResult.rows[0],
    });
  } catch (error) {
    console.error('Error creating franchise staff member:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add staff member' },
      { status: 500 }
    );
  }
}

