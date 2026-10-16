import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, verifyBearer } from '@/lib/auth';
import { ensureProjectManagementSchema, requirePmAccess, actorFromAdmin, writePmAudit } from '@/lib/project-management';

const idempotencyStore = new Map();

function cleanIdempotency() {
  const now = Date.now();
  for (const [k, v] of idempotencyStore.entries()) {
    if (now - v.timestamp > 15 * 60 * 1000) {
      idempotencyStore.delete(k);
    }
  }
}

export async function POST(req) {
  const admin = (await requirePmAccess(req)) || requireRole(req, 'admin') || verifyBearer(req, 'agent');
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const idempotencyKey = req.headers.get('idempotency-key') || req.headers.get('x-idempotency-key');
  if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
    const cached = idempotencyStore.get(idempotencyKey);
    return NextResponse.json({ success: true, project_id: cached.project_id, already_converted: true });
  }

  try {
    await ensureProjectManagementSchema();
    const { lead_id, party_id, new_party, project } = await req.json();

    if (!lead_id || !project || !project.name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Begin single database transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Lock the lead row first
      const leadLockRes = await client.query(
        `SELECT id, converted_project_id, client_name, client_phone, client_email, city
           FROM agent_leads
          WHERE id = $1
            FOR UPDATE`,
        [lead_id]
      );
      const leadRow = leadLockRes.rows[0];
      if (!leadRow) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
      }

      // 2. Check whether lead is already converted (reuse existing converted_project_id / source_lead_id)
      let existingProjectId = leadRow.converted_project_id;
      if (!existingProjectId) {
        const existingProjRes = await client.query(
          `SELECT id FROM pm_projects WHERE source_lead_id = $1 ORDER BY id ASC LIMIT 1`,
          [lead_id]
        );
        if (existingProjRes.rows.length > 0) {
          existingProjectId = existingProjRes.rows[0].id;
          await client.query(
            `UPDATE agent_leads SET converted_project_id = $1 WHERE id = $2`,
            [existingProjectId, lead_id]
          );
        }
      }

      if (existingProjectId) {
        await client.query('COMMIT');
        if (idempotencyKey) {
          cleanIdempotency();
          idempotencyStore.set(idempotencyKey, { project_id: existingProjectId, timestamp: Date.now() });
        }
        return NextResponse.json({
          success: true,
          project_id: existingProjectId,
          already_converted: true,
        });
      }

      // 3. Create party if not exists (reusing existing phone/email matching)
      let finalPartyId = party_id;
      if (!finalPartyId && new_party) {
        let existingPartyRes;

        if (new_party.phone) {
          existingPartyRes = await client.query(
            `SELECT id FROM pm_parties WHERE phone = $1 LIMIT 1`,
            [new_party.phone]
          );
        }

        if ((!existingPartyRes || existingPartyRes.rows.length === 0) && new_party.email) {
          existingPartyRes = await client.query(
            `SELECT id FROM pm_parties WHERE email = $1 LIMIT 1`,
            [new_party.email]
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

      // 4. Create the project
      const startDate = project.start_date || new Date().toISOString().slice(0, 10);
      const projRes = await client.query(
        `INSERT INTO pm_projects (party_id, name, site_address, start_date, contract_value, status, source_lead_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          finalPartyId,
          project.name,
          project.site_address || '',
          startDate,
          project.contract_value || 0,
          project.status || 'running',
          lead_id,
        ]
      );
      const createdProject = projRes.rows[0];
      const projectId = createdProject.id;

      // 5. Assign agent if any
      if (project.agent_id) {
        await client.query(
          `INSERT INTO pm_project_agents (project_id, agent_id, assigned_by)
           VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [projectId, project.agent_id, admin.email || admin.name || 'Admin']
        );
      }

      // 6. Set lead's link to the project
      await client.query(
        `UPDATE agent_leads SET converted_project_id = $1 WHERE id = $2`,
        [projectId, lead_id]
      );

      // 7. Write audit log
      const actor = actorFromAdmin(admin);
      await writePmAudit(client, 'project', projectId, 'created', actor, null, createdProject);

      await client.query('COMMIT');

      if (idempotencyKey) {
        cleanIdempotency();
        idempotencyStore.set(idempotencyKey, { project_id: projectId, timestamp: Date.now() });
      }

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
