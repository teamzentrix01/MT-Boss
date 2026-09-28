import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmAudit } from '@/lib/project-management';

const idOf = (params) => Number(params.id);

export async function GET(req, { params }) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const id = idOf(await params);
    if (!Number.isInteger(id)) return NextResponse.json({ success: false, error: 'Invalid party id' }, { status: 400 });
    const { searchParams } = new URL(req.url);
    const { page, pageSize, offset } = pageParams(searchParams);

    const result = await pool.query(
      `WITH party AS (
         SELECT * FROM pm_parties WHERE id = $1
       ),
       paged_projects AS (
         SELECT p.*, COUNT(*) OVER()::int total_count
         FROM pm_projects p
         WHERE p.party_id = $1
         ORDER BY p.created_at DESC
         LIMIT $2 OFFSET $3
       ),
       payment_totals AS (
         SELECT pay.project_id, SUM(pay.amount) received
         FROM pm_party_payments pay
         JOIN paged_projects p ON p.id = pay.project_id
         WHERE NOT pay.is_deleted
         GROUP BY pay.project_id
       ),
       vendor_labour AS (
         SELECT pv.project_id, SUM(a.wage_amount) amount
         FROM pm_project_vendors pv
         JOIN pm_attendance a ON a.project_vendor_id = pv.id
         WHERE pv.pay_type = 'daily_wage'
         GROUP BY pv.project_id
       ),
       vendor_contract AS (
         SELECT pv.project_id, SUM(pv.contract_amount) amount
         FROM pm_project_vendors pv
         WHERE pv.pay_type = 'contract'
         GROUP BY pv.project_id
       ),
       vendor_mat AS (
         SELECT pv.project_id, SUM(m.amount) amount
         FROM pm_project_vendors pv
         JOIN pm_vendor_material_supply m ON m.project_vendor_id = pv.id
         WHERE NOT m.is_deleted
         GROUP BY pv.project_id
       ),
       direct_mat AS (
         SELECT project_id, SUM(amount) amount
         FROM pm_material_received
         WHERE NOT is_deleted AND vendor_supply_id IS NULL AND NOT transfer_in
         GROUP BY project_id
       ),
       other_exp AS (
         SELECT project_id, SUM(amount) amount
         FROM pm_other_expenses
         WHERE NOT is_deleted
         GROUP BY project_id
       ),
       party_totals AS (
         SELECT COALESCE(SUM(p.contract_value), 0) contract_value,
                COALESCE(SUM(pay.amount) FILTER (WHERE NOT pay.is_deleted), 0) received
         FROM pm_projects p
         LEFT JOIN pm_party_payments pay ON pay.project_id = p.id
         WHERE p.party_id = $1
       ),
       party_expenses AS (
         SELECT
           COALESCE((SELECT SUM(a.wage_amount) FROM pm_attendance a JOIN pm_project_vendors pv ON pv.id = a.project_vendor_id JOIN pm_projects p ON p.id = pv.project_id WHERE p.party_id = $1 AND pv.pay_type = 'daily_wage'), 0) +
           COALESCE((SELECT SUM(pv.contract_amount) FROM pm_project_vendors pv JOIN pm_projects p ON p.id = pv.project_id WHERE p.party_id = $1 AND pv.pay_type = 'contract'), 0) +
           COALESCE((SELECT SUM(m.amount) FROM pm_vendor_material_supply m JOIN pm_project_vendors pv ON pv.id = m.project_vendor_id JOIN pm_projects p ON p.id = pv.project_id WHERE p.party_id = $1 AND NOT m.is_deleted), 0) +
           COALESCE((SELECT SUM(mr.amount) FROM pm_material_received mr JOIN pm_projects p ON p.id = mr.project_id WHERE p.party_id = $1 AND NOT mr.is_deleted AND mr.vendor_supply_id IS NULL AND NOT mr.transfer_in), 0) +
           COALESCE((SELECT SUM(oe.amount) FROM pm_other_expenses oe JOIN pm_projects p ON p.id = oe.project_id WHERE p.party_id = $1 AND NOT oe.is_deleted), 0) AS total_party_expense
       )
       SELECT
         party.id party_id, party.name party_name, party.phone party_phone,
         party.email party_email, party.gst_no party_gst_no, party.address party_address,
         party.created_at party_created_at,
         pt.contract_value total_contract_value, pt.received total_received,
         pt.contract_value - pt.received total_pending,
         pe.total_party_expense,
         pt.received - pe.total_party_expense AS total_party_profit,
         pp.id project_id, pp.party_id project_party_id, pp.name project_name,
         pp.site_address, pp.start_date, pp.expected_end_date, pp.contract_value,
         pp.built_up_area, pp.status, pp.created_at project_created_at, pp.total_count,
         COALESCE(py.received, 0) received,
         pp.contract_value - COALESCE(py.received, 0) pending,
         COALESCE(vl.amount, 0) + COALESCE(vc.amount, 0) + COALESCE(vm.amount, 0) AS total_vendor_cost,
         COALESCE(vl.amount, 0) + COALESCE(vc.amount, 0) + COALESCE(vm.amount, 0) + COALESCE(dm.amount, 0) + COALESCE(oe.amount, 0) AS total_expense,
         COALESCE(py.received, 0) - (COALESCE(vl.amount, 0) + COALESCE(vc.amount, 0) + COALESCE(vm.amount, 0) + COALESCE(dm.amount, 0) + COALESCE(oe.amount, 0)) AS profit_or_loss
       FROM party
       CROSS JOIN party_totals pt
       CROSS JOIN party_expenses pe
       LEFT JOIN paged_projects pp ON TRUE
       LEFT JOIN payment_totals py ON py.project_id = pp.id
       LEFT JOIN vendor_labour vl ON vl.project_id = pp.id
       LEFT JOIN vendor_contract vc ON vc.project_id = pp.id
       LEFT JOIN vendor_mat vm ON vm.project_id = pp.id
       LEFT JOIN direct_mat dm ON dm.project_id = pp.id
       LEFT JOIN other_exp oe ON oe.project_id = pp.id
       ORDER BY pp.created_at DESC`,
      [id, pageSize, offset]
    );

    if (!result.rows.length) return NextResponse.json({ success: false, error: 'Party not found' }, { status: 404 });
    const party = result.rows[0];
    const total = Number(party.total_count || 0);

    return NextResponse.json({
      success: true,
      data: {
        party: {
          id: party.party_id,
          name: party.party_name,
          phone: party.party_phone,
          email: party.party_email,
          gst_no: party.party_gst_no,
          address: party.party_address,
          created_at: party.party_created_at,
          total_contract_value: party.total_contract_value,
          total_received: party.total_received,
          total_pending: party.total_pending,
          total_expense: Number(party.total_party_expense || 0),
          total_profit: Number(party.total_party_profit || 0),
        },
        projects: result.rows
          .filter((r) => r.project_id)
          .map((r) => ({
            id: r.project_id,
            party_id: r.project_party_id,
            name: r.project_name,
            site_address: r.site_address,
            start_date: r.start_date,
            expected_end_date: r.expected_end_date,
            contract_value: r.contract_value,
            built_up_area: r.built_up_area,
            status: r.status,
            created_at: r.project_created_at,
            received: r.received,
            pending: r.pending,
            total_vendor_cost: Number(r.total_vendor_cost || 0),
            total_expense: Number(r.total_expense || 0),
            profit_or_loss: Number(r.profit_or_loss || 0),
          })),
      },
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load party' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const id = idOf(await params);
    const body = await req.json();
    const name = String(body.name || '').trim();
    if (!Number.isInteger(id) || !name) {
      return NextResponse.json({ success: false, error: 'Valid party name is required' }, { status: 400 });
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const old = (await client.query('SELECT * FROM pm_parties WHERE id = $1 FOR UPDATE', [id])).rows[0];
      if (!old) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Party not found' }, { status: 404 });
      }
      const result = await client.query(
        'UPDATE pm_parties SET name = $1, phone = $2, email = $3, gst_no = $4, address = $5 WHERE id = $6 RETURNING *',
        [name, body.phone?.trim() || null, body.email?.trim() || null, body.gst_no?.trim() || null, body.address?.trim() || null, id]
      );
      await writePmAudit(client, 'party', id, 'updated', actorFromAdmin(admin), old, result.rows[0]);
      await client.query('COMMIT');
      return NextResponse.json({ success: true, data: result.rows[0] });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not update party' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = requireRole(req, 'admin');
  if (!admin) return unauthorized();
  try {
    await ensureProjectManagementSchema();
    const id = idOf(await params);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const old = (await client.query('SELECT * FROM pm_parties WHERE id = $1 FOR UPDATE', [id])).rows[0];
      if (!old) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Party not found' }, { status: 404 });
      }
      const children = await client.query('SELECT 1 FROM pm_projects WHERE party_id = $1 LIMIT 1', [id]);
      if (children.rows.length) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'A party with projects cannot be deleted' }, { status: 409 });
      }
      await client.query('DELETE FROM pm_parties WHERE id = $1', [id]);
      await writePmAudit(client, 'party', id, 'deleted', actorFromAdmin(admin), old, null);
      await client.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Could not delete party' }, { status: 500 });
  }
}
