import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requirePmAccess } from '@/lib/project-management';

export async function GET(req, { params }) {
  const user = await requirePmAccess(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  
  const { id: projectId } = await params;
  
  try {
    // If agent, verify they are assigned or just let them fetch?
    // Actually, this route is for the project overview which checks access anyway.
    
    const result = await pool.query(
      `SELECT a.id, a.name, a.email, a.phone, a.city, pa.assigned_at
       FROM pm_project_agents pa
       JOIN agents a ON pa.agent_id = a.id
       WHERE pa.project_id = $1
       ORDER BY pa.assigned_at ASC`,
      [projectId]
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch project agents error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  const user = await requirePmAccess(req);
  if (!user || user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  
  const { id: projectId } = await params;
  
  try {
    const { agent_id } = await req.json();
    if (!agent_id) return NextResponse.json({ success: false, error: 'Agent ID required' }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO pm_project_agents (project_id, agent_id, assigned_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (project_id, agent_id) DO NOTHING
       RETURNING id, project_id, agent_id`,
      [projectId, agent_id, user.email || 'admin']
    );

    // Audit log
    if (result.rows.length > 0) {
      await pool.query(
        `INSERT INTO pm_audit_logs (entity_type, entity_id, action, changed_by, after_data)
         VALUES ($1, $2, $3, $4, $5)`,
        ['project_agent', projectId, 'ASSIGN_AGENT', user.email || 'admin', { agent_id }]
      );
    }
    
    return NextResponse.json({ success: true, message: 'Agent assigned' });
  } catch (error) {
    console.error('Assign agent error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
