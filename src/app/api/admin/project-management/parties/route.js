import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmAudit } from '@/lib/project-management';

export async function GET(req) {
  const admin = requireRole(req, 'admin'); if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const { searchParams } = new URL(req.url); const search = String(searchParams.get('search') || '').trim();
    const { page, pageSize, offset } = pageParams(searchParams);
    const result = await pool.query(`WITH filtered AS (
      SELECT p.*, COUNT(*) OVER()::int AS total_count FROM pm_parties p
      WHERE $1 = '' OR p.name ILIKE '%' || $1 || '%' OR COALESCE(p.phone,'') ILIKE '%' || $1 || '%' OR COALESCE(p.email,'') ILIKE '%' || $1 || '%'
      ORDER BY p.created_at DESC LIMIT $2 OFFSET $3
    ), project_totals AS (
      SELECT pr.party_id, COUNT(*)::int AS project_count, COALESCE(SUM(pr.contract_value),0) AS total_contract_value
      FROM pm_projects pr JOIN filtered f ON f.id=pr.party_id GROUP BY pr.party_id
    ), payment_totals AS (
      SELECT pr.party_id, COALESCE(SUM(pay.amount),0) AS total_received FROM pm_projects pr
      JOIN filtered f ON f.id=pr.party_id LEFT JOIN pm_party_payments pay ON pay.project_id=pr.id AND NOT pay.is_deleted GROUP BY pr.party_id
    ) SELECT f.*, COALESCE(pt.project_count,0) AS project_count, COALESCE(pt.total_contract_value,0) AS total_contract_value,
      COALESCE(py.total_received,0) AS total_received, COALESCE(pt.total_contract_value,0)-COALESCE(py.total_received,0) AS total_pending
      FROM filtered f LEFT JOIN project_totals pt ON pt.party_id=f.id LEFT JOIN payment_totals py ON py.party_id=f.id ORDER BY f.created_at DESC`, [search, pageSize, offset]);
    const total = Number(result.rows[0]?.total_count || 0);
    return NextResponse.json({ success:true, data:result.rows, pagination:{page,pageSize,total,totalPages:Math.ceil(total/pageSize)} });
  } catch (error) { return NextResponse.json({ success:false, error:error.message || 'Could not load parties' }, { status:500 }); }
}

export async function POST(req) {
  const admin = requireRole(req, 'admin'); if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema(); const body = await req.json(); const name = String(body.name || '').trim();
    if (!name) return NextResponse.json({ success:false, error:'Party name is required' }, {status:400});
    const client = await pool.connect(); try { await client.query('BEGIN');
      const result = await client.query(`INSERT INTO pm_parties(name,phone,email,gst_no,address) VALUES($1,$2,$3,$4,$5) RETURNING *`, [name, body.phone?.trim() || null, body.email?.trim() || null, body.gst_no?.trim() || null, body.address?.trim() || null]);
      await writePmAudit(client,'party',result.rows[0].id,'created',actorFromAdmin(admin),null,result.rows[0]); await client.query('COMMIT');
      return NextResponse.json({success:true,data:result.rows[0]},{status:201});
    } catch(error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  } catch(error) { return NextResponse.json({success:false,error:error.message || 'Could not create party'},{status:500}); }
}
