import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ensureProjectManagementSchema } from '@/lib/project-management';

export async function POST(req) {
  const admin = requireRole(req, 'admin');
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    await ensureProjectManagementSchema();
    const { lead_id, party_id, new_party, project } = await req.json();

    if (!lead_id || !project || !project.name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Begin transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let finalPartyId = party_id;

      // 1. Create party if not exists or find existing by phone
      if (!finalPartyId && new_party) {
        let existingPartyRes;
        
        if (new_party.phone) {
          existingPartyRes = await client.query(
            `SELECT id FROM pm_parties WHERE phone = $1 LIMIT 1`,
            [new_party.phone]
          );
        }
        
        if (!existingPartyRes || existingPartyRes.rows.length === 0) {
          existingPartyRes = await client.query(
            `SELECT id FROM pm_parties WHERE name ILIKE $1 LIMIT 1`,
            [new_party.name]
          );
        }
        
        if (existingPartyRes && existingPartyRes.rows.length > 0) {
          finalPartyId = existingPartyRes.rows[0].id;
        } else {
          const partyRes = await client.query(
            `INSERT INTO pm_parties (name, phone, email, address)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [new_party.name, new_party.phone, new_party.email, new_party.address]
          );
          finalPartyId = partyRes.rows[0].id;
        }
      }

      if (!finalPartyId) {
        throw new Error('Party ID is required');
      }

      const startDate = project.start_date || new Date().toISOString().slice(0, 10);
      const projRes = await client.query(
        `INSERT INTO pm_projects (party_id, name, site_address, start_date, contract_value, status, source_lead_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          finalPartyId,
          project.name,
          project.site_address || '',
          startDate,
          project.contract_value || 0,
          project.status || 'running',
          lead_id
        ]
      );
      const projectId = projRes.rows[0].id;

      // 3. Assign agent if any
      if (project.agent_id) {
        await client.query(
          `INSERT INTO pm_project_agents (project_id, agent_id, assigned_by)
           VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [projectId, project.agent_id, admin.email]
        );
      }

      // 4. Update lead
      await client.query(
        `UPDATE agent_leads SET converted_project_id = $1 WHERE id = $2`,
        [projectId, lead_id]
      );

      await client.query('COMMIT');
      return NextResponse.json({ success: true, project_id: projectId });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Lead convert error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}
