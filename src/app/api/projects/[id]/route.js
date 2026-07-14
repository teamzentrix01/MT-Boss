import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectOpsSchema, getProjectOps, getProjectSummaries } from '@/lib/project-ops';

const PROJECT_STATUSES = new Set([
  'lead',
  'estimate_sent',
  'final',
  'started',
  'ongoing',
  'running',
  'on_hold',
  'completed',
  'cancelled',
  'lost',
]);

const ENTRY_TABLES = {
  payment: 'project_payments',
  labour: 'project_labour_entries',
  material: 'project_material_entries',
  expense: 'project_expenses',
  media: 'project_media',
};

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const manage = searchParams.get('manage') === '1';

    if (manage) {
      if (!requireRole(req, 'admin')) return unauthorized();

      const rows = await getProjectSummaries('WHERE p.id = $1', [id]);
      const project = rows[0];
      if (!project) {
        return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
      }

      const ops = await getProjectOps(id);
      return NextResponse.json({ success: true, project, ...ops });
    }

    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureProjectOpsSchema();

    const { id } = await params;
    const body = await req.json();
    const nextStatus = PROJECT_STATUSES.has(body.project_status) ? body.project_status : null;

    const result = await pool.query(
      `UPDATE projects
       SET project_status = COALESCE($1, project_status),
           deal_amount = COALESCE($2, deal_amount),
           client_name = $3,
           client_phone = $4,
           client_email = $5,
           project_notes = $6,
           started_at = CASE WHEN $1 IN ('started', 'ongoing', 'running') THEN COALESCE(started_at, NOW()) ELSE started_at END,
           completed_at = CASE WHEN $1 = 'completed' THEN COALESCE(completed_at, NOW()) ELSE completed_at END
       WHERE id = $7
       RETURNING *`,
      [
        nextStatus,
        body.deal_amount === '' || body.deal_amount === undefined ? null : Number(body.deal_amount || 0),
        body.client_name || null,
        body.client_phone || null,
        body.client_email || null,
        body.project_notes || '',
        id,
      ]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const rows = await getProjectSummaries('WHERE p.id = $1', [id]);
    return NextResponse.json({ success: true, data: rows[0] || result.rows[0] });
  } catch (error) {
    console.error('Admin project update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureProjectOpsSchema();

    const { id } = await params;
    const body = await req.json();
    const entryType = body.entry_type;

    const exists = await pool.query('SELECT id, assigned_agent_id FROM projects WHERE id = $1', [id]);
    const project = exists.rows[0];
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    let result;
    if (entryType === 'payment') {
      const amount = Number(body.amount || 0);
      if (amount <= 0) return NextResponse.json({ success: false, error: 'Payment amount is required' }, { status: 400 });
      result = await pool.query(
        `INSERT INTO project_payments (project_id, agent_id, amount, payment_date, payment_mode, notes)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [id, project.assigned_agent_id || null, amount, body.payment_date || new Date(), body.payment_mode || null, body.notes || null]
      );
    } else if (entryType === 'labour') {
      if (!body.labour_name) return NextResponse.json({ success: false, error: 'Labour name is required' }, { status: 400 });
      result = await pool.query(
        `INSERT INTO project_labour_entries
          (project_id, agent_id, labour_name, labour_role, work_date, attendance_status, wage_amount, paid_amount, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          id,
          project.assigned_agent_id || null,
          body.labour_name,
          body.labour_role || null,
          body.work_date || new Date(),
          body.attendance_status || 'present',
          Number(body.wage_amount || 0),
          Number(body.paid_amount || 0),
          body.notes || null,
        ]
      );
    } else if (entryType === 'material') {
      if (!body.material_name) return NextResponse.json({ success: false, error: 'Material name is required' }, { status: 400 });
      const quantity = Number(body.quantity || 0);
      const rate = Number(body.rate || 0);
      const total = body.total_amount === undefined || body.total_amount === ''
        ? quantity * rate
        : Number(body.total_amount || 0);
      result = await pool.query(
        `INSERT INTO project_material_entries
          (project_id, agent_id, material_name, quantity, unit, rate, total_amount, supplier_name, vehicle_number, bill_url, entry_date, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
        [
          id,
          project.assigned_agent_id || null,
          body.material_name,
          quantity,
          body.unit || null,
          rate,
          total,
          body.supplier_name || null,
          body.vehicle_number || null,
          body.bill_url || null,
          body.entry_date || new Date(),
          body.notes || null,
        ]
      );
    } else if (entryType === 'expense') {
      const amount = Number(body.amount || 0);
      if (!body.expense_type || amount <= 0) {
        return NextResponse.json({ success: false, error: 'Expense type and amount are required' }, { status: 400 });
      }
      result = await pool.query(
        `INSERT INTO project_expenses (project_id, agent_id, expense_type, amount, expense_date, notes)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [id, project.assigned_agent_id || null, body.expense_type, amount, body.expense_date || new Date(), body.notes || null]
      );
    } else if (entryType === 'media') {
      if (!body.media_url) return NextResponse.json({ success: false, error: 'Media URL is required' }, { status: 400 });
      result = await pool.query(
        `INSERT INTO project_media (project_id, agent_id, media_type, media_url, caption, media_date)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [id, project.assigned_agent_id || null, body.media_type || 'photo', body.media_url, body.caption || null, body.media_date || new Date()]
      );
    } else {
      return NextResponse.json({ success: false, error: 'Unknown entry type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Admin project entry error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureProjectOpsSchema();

    const { id: projectId } = await params;
    const { entry_type, id } = await req.json();
    const table = ENTRY_TABLES[entry_type];
    if (!table || !id) {
      return NextResponse.json({ success: false, error: 'Entry type and id are required' }, { status: 400 });
    }

    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 AND project_id = $2 RETURNING id`,
      [id, projectId]
    );

    if (!result.rows[0]) {
      return NextResponse.json({ success: false, error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin project entry delete error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
