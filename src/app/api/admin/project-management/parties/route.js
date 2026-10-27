import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmAudit } from '@/lib/project-management';

export async function GET(req) {
  const admin = await requirePmAccess(req); if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const { searchParams } = new URL(req.url);
    const search = String(searchParams.get('search') || '').trim();
    const lite = searchParams.get('lite') === '1';
    const { page, pageSize, offset } = pageParams(searchParams);

    const isAgent = admin.role === 'agent';
    const agentId = admin.id;

    // Typeahead / convert-modal: skip payment/project aggregates
    if (lite) {
      const result = await pool.query(
        `SELECT p.id, p.name, p.phone, p.email, p.gst_no, p.address, p.created_at,
                COUNT(*) OVER()::int AS total_count
           FROM pm_parties p
          WHERE ($1 = ''
             OR p.name ILIKE '%' || $1 || '%'
             OR COALESCE(p.phone,'') ILIKE '%' || $1 || '%'
             OR COALESCE(p.email,'') ILIKE '%' || $1 || '%')
            ${isAgent ? `AND EXISTS (
              SELECT 1 FROM pm_projects pr
              JOIN pm_project_agents pa ON pa.project_id = pr.id
              WHERE pr.party_id = p.id AND pa.agent_id = $4
            )` : ''}
          ORDER BY p.created_at DESC
          LIMIT $2 OFFSET $3`,
        isAgent ? [search, pageSize, offset, agentId] : [search, pageSize, offset]
      );
      const total = Number(result.rows[0]?.total_count || 0);
      return NextResponse.json({
        success: true,
        data: result.rows,
        pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
      });
    }

    const result = await pool.query(
      `WITH filtered AS (
         SELECT p.id, p.name, p.phone, p.email, p.gst_no, p.address, p.created_at,
                COUNT(*) OVER()::int AS total_count
           FROM pm_parties p
          WHERE ($1 = ''
             OR p.name ILIKE '%' || $1 || '%'
             OR COALESCE(p.phone, '') ILIKE '%' || $1 || '%'
             OR COALESCE(p.email, '') ILIKE '%' || $1 || '%')
            ${isAgent ? `AND EXISTS (
              SELECT 1 FROM pm_projects pr
              JOIN pm_project_agents pa ON pa.project_id = pr.id
              WHERE pr.party_id = p.id AND pa.agent_id = $4
            )` : ''}
          ORDER BY p.created_at DESC
          LIMIT $2 OFFSET $3
       ),
       totals AS (
         SELECT pr.party_id,
                COUNT(*)::int AS project_count,
                COALESCE(SUM(pr.contract_value), 0) AS total_contract_value,
                COALESCE(SUM(pay.received), 0) AS total_received
           FROM pm_projects pr
           JOIN filtered f ON f.id = pr.party_id
           ${isAgent ? 'JOIN pm_project_agents pa ON pa.project_id = pr.id AND pa.agent_id = $4' : ''}
           LEFT JOIN LATERAL (
             SELECT COALESCE(SUM(amount), 0) AS received
               FROM pm_party_payments
              WHERE project_id = pr.id
                AND NOT is_deleted
           ) pay ON TRUE
          GROUP BY pr.party_id
       )
       SELECT f.id, f.name, f.phone, f.email, f.gst_no, f.address, f.created_at, f.total_count,
              COALESCE(t.project_count, 0) AS project_count,
              COALESCE(t.total_contract_value, 0) AS total_contract_value,
              COALESCE(t.total_received, 0) AS total_received,
              COALESCE(t.total_contract_value, 0) - COALESCE(t.total_received, 0) AS total_pending
         FROM filtered f
         LEFT JOIN totals t ON t.party_id = f.id
        ORDER BY f.created_at DESC`,
      isAgent ? [search, pageSize, offset, agentId] : [search, pageSize, offset]
    );

    const hasPayments = admin.role === 'admin' || admin.role === 'site_supervisor' || (admin.specializations || []).includes('payments');
    const rows = hasPayments
      ? result.rows
      : result.rows.map((r) => ({
          ...r,
          total_contract_value: null,
          total_received: null,
          total_pending: null,
        }));

    const total = Number(result.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 },
    });
  } catch (error) { return NextResponse.json({ success:false, error:error.message || 'Could not load parties' }, { status:500 }); }
}

export async function POST(req) {
  const admin = await requirePmAccess(req); if (!admin) return unauthorized();
  if (admin.role === 'agent') {
    return NextResponse.json({ success: false, error: 'Unauthorized: Agents cannot create parties' }, { status: 403 });
  }
  try {
    await ensureProjectManagementSchema(); const body = await req.json(); const name = String(body.name || '').trim();
    if (!name) return NextResponse.json({ success:false, error:'Party name is required' }, {status:400});
    const client = await pool.connect(); try { await client.query('BEGIN');
      let result;
      let existingPartyRes;
      let is_existing = false;

      if (body.phone && body.phone.trim()) {
        existingPartyRes = await client.query(
          `SELECT * FROM pm_parties WHERE phone = $1 LIMIT 1`,
          [body.phone.trim()]
        );
      }

      if (!existingPartyRes || existingPartyRes.rows.length === 0) {
        existingPartyRes = await client.query(
          `SELECT * FROM pm_parties WHERE name ILIKE $1 LIMIT 1`,
          [name]
        );
      }

      if (existingPartyRes && existingPartyRes.rows.length > 0) {
        result = existingPartyRes;
        is_existing = true;
      } else {
        result = await client.query(`INSERT INTO pm_parties(name,phone,email,gst_no,address) VALUES($1,$2,$3,$4,$5) RETURNING *`, [name, body.phone?.trim() || null, body.email?.trim() || null, body.gst_no?.trim() || null, body.address?.trim() || null]);
        await writePmAudit(client,'party',result.rows[0].id,'created',actorFromAdmin(admin),null,result.rows[0]); 
      }
      
      await client.query('COMMIT');
      return NextResponse.json({success:true, data:result.rows[0], is_existing},{status:201});
    } catch(error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  } catch(error) { return NextResponse.json({success:false,error:error.message || 'Could not create party'},{status:500}); }
}
