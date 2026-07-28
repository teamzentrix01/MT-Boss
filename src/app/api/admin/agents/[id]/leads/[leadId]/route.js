import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin, ensureAgentSchema } from '@/lib/agent-auth';
import { ensureProjectOpsSchema } from '@/lib/project-ops';

const STATUSES = new Set(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost']);

export async function PATCH(req, { params }) {
  try {
    await ensureAgentSchema();
    await ensureProjectOpsSchema();
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, leadId } = await params;
    const body = await req.json();
    const { status, notes, followUpDate } = body;

    const currentResult = await pool.query(
      `SELECT l.lead_stage, p.id AS project_id
         FROM agent_leads l
         LEFT JOIN projects p ON p.source_lead_id = l.id AND p.project_kind = 'operational'
        WHERE l.id = $1 AND l.agent_id = $2`,
      [leadId, id]
    );
    const current = currentResult.rows[0];
    if (!current) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }
    if (current.project_id && status && status !== 'Converted') {
      return NextResponse.json(
        { success: false, error: 'A finalized lead must remain Converted while its project exists.' },
        { status: 409 }
      );
    }
    if (status === 'Converted' && current.lead_stage !== 'Final') {
      return NextResponse.json(
        { success: false, error: 'Only a Final-stage lead can be marked Converted.' },
        { status: 400 }
      );
    }

    const hasNotes = Object.prototype.hasOwnProperty.call(body, 'notes');
    const result = await pool.query(
      `UPDATE agent_leads
          SET status = COALESCE($1, status),
              notes = CASE WHEN $2::BOOLEAN THEN $3 ELSE notes END,
              follow_up_date = CASE WHEN $4::BOOLEAN THEN $5 ELSE follow_up_date END,
              updated_at = NOW()
        WHERE id = $6 AND agent_id = $7
        RETURNING *`,
      [
        STATUSES.has(status) ? status : null,
        hasNotes,
        notes || null,
        Object.prototype.hasOwnProperty.call(body, 'followUpDate'),
        followUpDate || null,
        leadId,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Admin lead update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
