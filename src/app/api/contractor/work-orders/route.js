import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { getJwtSecret, getBearerToken } from '@/lib/auth';

function getContractor(req) {
  try {
    const token = getBearerToken(req, 'contractor');
    if (token) {
      return jwt.verify(token, getJwtSecret());
    }
  } catch {}
  return null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const name = searchParams.get('name');

    let query = `
      SELECT pce.*, 
             COALESCE(p.title, pp.name, 'Project #' || pce.project_id) AS project_title,
             COALESCE(p.location, pp.site_address, 'Location N/A') AS site_location,
             COALESCE(p.project_status, pp.status, 'In Progress') AS project_status
      FROM project_contractor_entries pce
      LEFT JOIN projects p ON p.id = pce.project_id
      LEFT JOIN pm_projects pp ON pp.id = pce.project_id
    `;
    const params = [];

    if (phone) {
      query += ` WHERE pce.contractor_phone = $1`;
      params.push(phone);
    } else if (name) {
      query += ` WHERE LOWER(pce.contractor_name) LIKE $1`;
      params.push(`%${name.toLowerCase()}%`);
    }

    query += ` ORDER BY pce.created_at DESC, pce.id DESC LIMIT 100`;

    const res = await pool.query(query, params);
    return NextResponse.json({ success: true, workOrders: res.rows });
  } catch (error) {
    console.error('Work orders GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const auth = getContractor(req);

    const {
      project_id,
      contractor_name,
      company_name,
      work_description,
      contract_amount,
      paid_amount,
      payment_date,
      payment_mode,
      invoice_number,
      notes,
      contractor_phone,
    } = body;

    const cName = contractor_name || auth?.name || 'Contractor';
    const cPhone = contractor_phone || '';
    let projId = Number(project_id);
    if (!projId) {
      const firstProj = await pool.query('SELECT id FROM projects ORDER BY id ASC LIMIT 1');
      projId = firstProj.rows[0]?.id || 3;
    }

    const res = await pool.query(
      `INSERT INTO project_contractor_entries (
        project_id,
        contractor_name,
        company_name,
        work_description,
        contract_amount,
        paid_amount,
        payment_date,
        payment_mode,
        invoice_number,
        notes,
        contractor_phone,
        created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()
      ) RETURNING *`,
      [
        projId,
        cName,
        company_name || cName,
        work_description || 'General Contractor Work',
        Number(contract_amount) || 0,
        Number(paid_amount) || 0,
        payment_date || new Date().toISOString().slice(0, 10),
        payment_mode || 'Bank Transfer',
        invoice_number || `INV-${Date.now().toString().slice(-6)}`,
        notes || '',
        cPhone,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Work order logged successfully',
      workOrder: res.rows[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Work orders POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id, paid_amount, payment_mode, invoice_number, notes, work_description } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Work order ID is required' }, { status: 400 });
    }

    const res = await pool.query(
      `UPDATE project_contractor_entries
       SET paid_amount = COALESCE($1, paid_amount),
           payment_mode = COALESCE($2, payment_mode),
           invoice_number = COALESCE($3, invoice_number),
           notes = COALESCE($4, notes),
           work_description = COALESCE($5, work_description)
       WHERE id = $6
       RETURNING *`,
      [
        paid_amount !== undefined ? Number(paid_amount) : null,
        payment_mode || null,
        invoice_number || null,
        notes || null,
        work_description || null,
        id,
      ]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Work order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Work order updated successfully',
      workOrder: res.rows[0],
    });
  } catch (error) {
    console.error('Work orders PUT error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
