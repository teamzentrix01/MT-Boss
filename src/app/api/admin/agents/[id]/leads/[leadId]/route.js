import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin, ensureAgentSchema } from '@/lib/agent-auth';

const STATUSES = new Set(['New', 'Contacted', 'Follow-up', 'Converted', 'Lost']);

export async function PATCH(req, { params }) {
  try {
    await ensureAgentSchema();
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, leadId } = params;
    const { status, notes, followUpDate } = await req.json();

    const result = await pool.query(
      `UPDATE agent_leads
          SET status = COALESCE($1, status),
              notes = COALESCE($2, notes),
              follow_up_date = COALESCE($3, follow_up_date),
              updated_at = NOW()
        WHERE id = $4 AND agent_id = $5
        RETURNING *`,
      [STATUSES.has(status) ? status : null, notes || null, followUpDate || null, leadId, id]
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
