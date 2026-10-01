import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requirePmAccess } from '@/lib/project-management';

export async function DELETE(req, { params }) {
  const user = await requirePmAccess(req);
  if (!user || user.role !== 'admin') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  
  const { id: projectId, agentId } = await params;
  
  try {
    const result = await pool.query(
      `DELETE FROM pm_project_agents
       WHERE project_id = $1 AND agent_id = $2
       RETURNING id`,
      [projectId, agentId]
    );

    if (result.rows.length > 0) {
      await pool.query(
        `INSERT INTO pm_audit_logs (entity_type, entity_id, action, changed_by, before_data)
         VALUES ($1, $2, $3, $4, $5)`,
        ['project_agent', projectId, 'REMOVE_AGENT', user.email || 'admin', { agent_id: agentId }]
      );
    }
    
    return NextResponse.json({ success: true, message: 'Agent removed' });
  } catch (error) {
    console.error('Remove agent error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
