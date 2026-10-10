import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const auth = await assertAgentAccess(req, null, 'vendor');
    if (!auth.allowed) return auth.response;

    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const q = String(s.get('search') || '').trim();

    const r = await pool.query(
      `SELECT *, COUNT(*) OVER()::int total_count
       FROM pm_vendors
       WHERE $1 = '' OR name ILIKE '%'||$1||'%' OR COALESCE(phone, '') ILIKE '%'||$1||'%'
       ORDER BY name
       LIMIT $2 OFFSET $3`,
      [q, pageSize, offset]
    );

    const total = Number(r.rows[0]?.total_count || 0);
    return NextResponse.json({
      success: true,
      data: r.rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureProjectManagementSchema();
    const auth = await assertAgentAccess(req, null, 'vendor');
    if (!auth.allowed) return auth.response;

    const b = await req.json();
    const name = String(b.name || '').trim();
    if (!name) return NextResponse.json({ success: false, error: 'Vendor name is required' }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const actor = actorFromAdmin(auth.user);
      const r = await client.query(
        `INSERT INTO pm_vendors(name, phone, trade, address, is_active)
         VALUES($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, b.phone || null, b.trade || null, b.address || null, b.is_active !== false]
      );
      await writePmPhase2Audit(client, 'pm_vendors', r.rows[0].id, 'created', actor, null, r.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: r.rows[0] }, { status: 201 });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
