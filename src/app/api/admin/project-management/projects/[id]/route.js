import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { requirePmAccess } from '@/lib/project-management';
import { ensureProjectManagementPhase5Schema, actorFromAdmin, writePmAudit } from '@/lib/project-management';
import { recomputeProjectBenchmark } from '@/lib/pm-benchmarks';

const valid = (b) => {
    const party = Number(b.party_id);
    const value = Number(b.contract_value);
    const area = b.built_up_area === '' || b.built_up_area == null ? null : Number(b.built_up_area);
    const status = String(b.status || 'running');
    if (!String(b.name || '').trim() ||
        !Number.isInteger(party) ||
        !Number.isFinite(value) ||
        value < 0 ||
        !b.start_date ||
        (area !== null && (!Number.isFinite(area) || area < 0)) ||
        !['running', 'completed', 'on_hold'].includes(status)
    ) {
        return null;
    }

    const projectType = b.project_type || null;
    const floors = b.floors ? Number(b.floors) : null;
    const qualityTier = b.quality_tier || null;
    const city = b.city ? String(b.city).trim() || null : null;
    const foundationType = b.foundation_type ? String(b.foundation_type).trim() || null : null;
    const includeInBenchmark = Boolean(b.include_in_benchmark);
    const completedDate = b.completed_date || null;
    const progressPercent = Number(b.progress_percent || 0);

    return [
        party,
        String(b.name).trim(),
        b.site_address ? String(b.site_address).trim() || null : null,
        b.start_date,
        b.expected_end_date || null,
        value,
        area,
        status,
        projectType,
        floors,
        qualityTier,
        city,
        foundationType,
        includeInBenchmark,
        completedDate,
        progressPercent,
    ];
};

export async function GET(req, { params }) {
    const paramId = (await params).id;
    const admin = await requirePmAccess(req, paramId);
    if (!admin) return unauthorized();
    try {
        await ensureProjectManagementPhase5Schema();
        const id = Number(paramId);
        const result = await pool.query(
            `WITH party_totals AS (
         SELECT project_id, SUM(amount) received
         FROM pm_party_payments
         WHERE project_id = $1 AND NOT is_deleted
         GROUP BY project_id
       ),
       labour AS (
         SELECT pv.project_id, SUM(a.wage_amount) amount
         FROM pm_project_vendors pv
         JOIN pm_attendance a ON a.project_vendor_id = pv.id
         WHERE pv.project_id = $1 AND pv.pay_type = 'daily_wage'
         GROUP BY pv.project_id
       ),
       materials AS (
         SELECT pv.project_id, SUM(m.amount) amount
         FROM pm_project_vendors pv
         JOIN pm_vendor_material_supply m ON m.project_vendor_id = pv.id
         WHERE pv.project_id = $1 AND NOT m.is_deleted
         GROUP BY pv.project_id
       ),
       vendor_paid AS (
         SELECT pv.project_id, SUM(x.amount) amount
         FROM pm_project_vendors pv
         JOIN pm_vendor_payments x ON x.project_vendor_id = pv.id
         WHERE pv.project_id = $1 AND NOT x.is_deleted
         GROUP BY pv.project_id
       ),
       contract_due AS (
         SELECT project_id, SUM(contract_amount) amount
         FROM pm_project_vendors
         WHERE project_id = $1 AND pay_type = 'contract'
         GROUP BY project_id
       ),
       direct_mat AS (
         SELECT project_id, SUM(amount) amount
         FROM pm_material_received
         WHERE project_id = $1 AND NOT is_deleted AND vendor_supply_id IS NULL AND NOT transfer_in
         GROUP BY project_id
       ),
       other_exp AS (
         SELECT project_id, SUM(amount) amount
         FROM pm_other_expenses
         WHERE project_id = $1 AND NOT is_deleted
         GROUP BY project_id
       ),
       ind_labour AS (
         SELECT l.project_id, SUM(la.wage_amount) amount
         FROM pm_labor l
         JOIN pm_labor_attendance la ON la.labor_id = l.id
         WHERE l.project_id = $1
         GROUP BY l.project_id
       )
       SELECT p.*, pa.name party_name,
         COALESCE(pt.received, 0) received,
         p.contract_value - COALESCE(pt.received, 0) pending,
         GREATEST(0, CURRENT_DATE - p.start_date::date) days_running,
         COALESCE(l.amount, 0) + COALESCE(cd.amount, 0) + COALESCE(il.amount, 0) total_labour_cost,
         COALESCE(l.amount, 0) + COALESCE(cd.amount, 0) vendor_labour_cost,
         COALESCE(il.amount, 0) individual_labour_cost,
         COALESCE(l.amount, 0) daily_labour_cost,
         COALESCE(cd.amount, 0) contract_labour_cost,
         COALESCE(m.amount, 0) total_vendor_material_cost,
         COALESCE(dm.amount, 0) direct_material_cost,
         COALESCE(m.amount, 0) + COALESCE(dm.amount, 0) total_material_cost,
         COALESCE(oe.amount, 0) total_other_expenses,
         (COALESCE(l.amount, 0) + COALESCE(cd.amount, 0) + COALESCE(il.amount, 0) + COALESCE(m.amount, 0) + COALESCE(dm.amount, 0) + COALESCE(oe.amount, 0)) total_expense,
         COALESCE(vp.amount, 0) total_paid_to_vendors,
         (COALESCE(l.amount, 0) + COALESCE(cd.amount, 0) + COALESCE(m.amount, 0)) - COALESCE(vp.amount, 0) total_vendor_balance_pending,
         COALESCE(pt.received, 0) - (COALESCE(l.amount, 0) + COALESCE(cd.amount, 0) + COALESCE(il.amount, 0) + COALESCE(m.amount, 0) + COALESCE(dm.amount, 0) + COALESCE(oe.amount, 0)) profit_or_loss,
         COALESCE(pt.received, 0) - (COALESCE(l.amount, 0) + COALESCE(cd.amount, 0) + COALESCE(il.amount, 0) + COALESCE(m.amount, 0) + COALESCE(dm.amount, 0) + COALESCE(oe.amount, 0)) profit_so_far
       FROM pm_projects p
       JOIN pm_parties pa ON pa.id = p.party_id
       LEFT JOIN party_totals pt ON pt.project_id = p.id
       LEFT JOIN labour l ON l.project_id = p.id
       LEFT JOIN materials m ON m.project_id = p.id
       LEFT JOIN vendor_paid vp ON vp.project_id = p.id
       LEFT JOIN contract_due cd ON cd.project_id = p.id
       LEFT JOIN direct_mat dm ON dm.project_id = p.id
       LEFT JOIN other_exp oe ON oe.project_id = p.id
       LEFT JOIN ind_labour il ON il.project_id = p.id
       WHERE p.id = $1`, [id]
        );

        if (!result.rows[0]) return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
        const row = {...result.rows[0] };
        if (admin.role === 'agent') {
            const specs = admin.specializations || [];
            const hasPayments = specs.includes('payments');
            const hasLabor = specs.includes('labor');
            const hasConstruction = specs.includes('construction');

            if (!hasPayments) {
                row.contract_value = null;
                row.received = null;
                row.pending = null;
                row.total_expense = null;
                row.profit_or_loss = null;
                row.profit_so_far = null;
                row.total_paid_to_vendors = null;
                row.total_vendor_balance_pending = null;

                if (!hasLabor) {
                    row.total_labour_cost = null;
                    row.vendor_labour_cost = null;
                    row.individual_labour_cost = null;
                    row.daily_labour_cost = null;
                    row.contract_labour_cost = null;
                }

                if (!hasConstruction) {
                    row.total_material_cost = null;
                    row.direct_material_cost = null;
                    row.total_vendor_material_cost = null;
                    row.total_other_expenses = null;
                }
            }
        }
        return NextResponse.json({ success: true, data: row });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message || 'Could not load project' }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    const paramId = (await params).id;
    const admin = await requirePmAccess(req, paramId);
    if (!admin) return unauthorized();
    try {
        await ensureProjectManagementPhase5Schema();
        const id = Number(paramId);
        const values = valid(await req.json());
        if (!Number.isInteger(id) || !values) {
            return NextResponse.json({ success: false, error: 'Provide valid project details' }, { status: 400 });
        }

        const client = await pool.connect();
        let updated;
        try {
            await client.query('BEGIN');
            const old = (await client.query('SELECT * FROM pm_projects WHERE id = $1 FOR UPDATE', [id])).rows[0];
            if (!old) {
                await client.query('ROLLBACK');
                return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
            }

            const result = await client.query(
                `UPDATE pm_projects
         SET party_id = $1, name = $2, site_address = $3, start_date = $4, expected_end_date = $5,
             contract_value = $6, built_up_area = $7, status = $8,
             project_type = $9, floors = $10, quality_tier = $11, city = $12, foundation_type = $13,
             include_in_benchmark = $14, completed_date = $15, progress_percent = $16
         WHERE id = $17
         RETURNING *`, [...values, id]
            );
            updated = result.rows[0];
            await writePmAudit(client, 'project', id, 'updated', actorFromAdmin(admin), old, updated);
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

        // Recompute benchmark
        try {
            await recomputeProjectBenchmark(id);
        } catch (e) {
            console.warn('Benchmark recompute failed:', e.message);
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message || 'Could not update project' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const paramId = (await params).id;
    const admin = await requirePmAccess(req, paramId);
    if (!admin) return unauthorized();
    if (admin.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Unauthorized: Admin only' }, { status: 403 });
    }
    try {
        await ensureProjectManagementPhase5Schema();
        const id = Number(paramId);
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid project ID' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const oldRes = await client.query('SELECT * FROM pm_projects WHERE id = $1 FOR UPDATE', [id]);
            const old = oldRes.rows[0];
            if (!old) {
                await client.query('ROLLBACK');
                return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
            }

            // Check all transaction/activity tables
            const [
                partyPaymentsRes,
                projectVendorsRes,
                vendorPaymentsRes,
                vendorSupplyRes,
                vendorAttendanceRes,
                laborRes,
                laborAttendanceRes,
                laborPaymentsRes,
                matReceivedRes,
                matUsedRes,
                matAdjustmentsRes,
                otherExpensesRes,
            ] = await Promise.all([
                client.query('SELECT COUNT(*)::int AS count FROM pm_party_payments WHERE project_id = $1 AND NOT is_deleted', [id]),
                client.query('SELECT COUNT(*)::int AS count FROM pm_project_vendors WHERE project_id = $1', [id]),
                client.query(
                    'SELECT COUNT(*)::int AS count FROM pm_vendor_payments vp JOIN pm_project_vendors pv ON pv.id = vp.project_vendor_id WHERE pv.project_id = $1 AND NOT vp.is_deleted', [id]
                ),
                client.query(
                    'SELECT COUNT(*)::int AS count FROM pm_vendor_material_supply vms JOIN pm_project_vendors pv ON pv.id = vms.project_vendor_id WHERE pv.project_id = $1 AND NOT vms.is_deleted', [id]
                ),
                client.query(
                    'SELECT COUNT(*)::int AS count FROM pm_attendance a JOIN pm_project_vendors pv ON pv.id = a.project_vendor_id WHERE pv.project_id = $1', [id]
                ),
                client.query('SELECT COUNT(*)::int AS count FROM pm_labor WHERE project_id = $1', [id]),
                client.query(
                    'SELECT COUNT(*)::int AS count FROM pm_labor_attendance la JOIN pm_labor l ON l.id = la.labor_id WHERE l.project_id = $1', [id]
                ),
                client.query(
                    'SELECT COUNT(*)::int AS count FROM pm_labor_payments lp JOIN pm_labor l ON l.id = lp.labor_id WHERE l.project_id = $1 AND NOT lp.is_deleted', [id]
                ),
                client.query('SELECT COUNT(*)::int AS count FROM pm_material_received WHERE project_id = $1 AND NOT is_deleted', [id]),
                client.query('SELECT COUNT(*)::int AS count FROM pm_material_used WHERE project_id = $1 AND NOT is_deleted', [id]),
                client.query('SELECT COUNT(*)::int AS count FROM pm_material_adjustments WHERE (project_id = $1 OR to_project_id = $1) AND NOT is_deleted', [id]),
                client.query('SELECT COUNT(*)::int AS count FROM pm_other_expenses WHERE project_id = $1 AND NOT is_deleted', [id]),
            ]);

            const partyPaymentsCount = partyPaymentsRes.rows[0].count;
            const vendorsCount = projectVendorsRes.rows[0].count;
            const vendorPaymentsCount = vendorPaymentsRes.rows[0].count;
            const vendorSupplyCount = vendorSupplyRes.rows[0].count;
            const vendorAttendanceCount = vendorAttendanceRes.rows[0].count;
            const laborCount = laborRes.rows[0].count;
            const laborAttendanceCount = laborAttendanceRes.rows[0].count;
            const laborPaymentsCount = laborPaymentsRes.rows[0].count;
            const matReceivedCount = matReceivedRes.rows[0].count;
            const matUsedCount = matUsedRes.rows[0].count;
            const matAdjustmentsCount = matAdjustmentsRes.rows[0].count;
            const otherExpensesCount = otherExpensesRes.rows[0].count;

            const blockingReasons = [];
            if (partyPaymentsCount > 0) blockingReasons.push(`${partyPaymentsCount} party payment${partyPaymentsCount > 1 ? 's' : ''}`);
            if (vendorPaymentsCount > 0) blockingReasons.push(`${vendorPaymentsCount} vendor payment${vendorPaymentsCount > 1 ? 's' : ''}`);
            if (vendorSupplyCount > 0) blockingReasons.push(`${vendorSupplyCount} vendor material supply entry${vendorSupplyCount > 1 ? 'ies' : ''}`);
            if (vendorAttendanceCount > 0) blockingReasons.push(`${vendorAttendanceCount} Contractors Attendance record${vendorAttendanceCount > 1 ? 's' : ''}`);
            if (vendorsCount > 0 && vendorPaymentsCount === 0 && vendorSupplyCount === 0 && vendorAttendanceCount === 0) {
                blockingReasons.push(`${vendorsCount} assigned vendor${vendorsCount > 1 ? 's' : ''}`);
            }
            if (laborPaymentsCount > 0) blockingReasons.push(`${laborPaymentsCount} labor payment${laborPaymentsCount > 1 ? 's' : ''}`);
            if (laborAttendanceCount > 0) blockingReasons.push(`${laborAttendanceCount} labor attendance record${laborAttendanceCount > 1 ? 's' : ''}`);
            if (laborCount > 0 && laborPaymentsCount === 0 && laborAttendanceCount === 0) {
                blockingReasons.push(`${laborCount} labor entry${laborCount > 1 ? 'ies' : ''}`);
            }
            const totalMatCount = matReceivedCount + matUsedCount + matAdjustmentsCount;
            if (totalMatCount > 0) {
                const parts = [];
                if (matReceivedCount > 0) parts.push(`${matReceivedCount} received`);
                if (matUsedCount > 0) parts.push(`${matUsedCount} used`);
                if (matAdjustmentsCount > 0) parts.push(`${matAdjustmentsCount} adjustment${matAdjustmentsCount > 1 ? 's' : ''}`);
                blockingReasons.push(`material entries (${parts.join(', ')})`);
            }
            if (otherExpensesCount > 0) blockingReasons.push(`${otherExpensesCount} other expense${otherExpensesCount > 1 ? 's' : ''}`);

            if (blockingReasons.length > 0) {
                await client.query('ROLLBACK');
                const reasonText = blockingReasons.join(', ');
                return NextResponse.json({
                    success: false,
                    error: `This project has ${reasonText}. Set it to On hold or Completed instead.`,
                }, { status: 409 });
            }

            // 1. Remove agent assignments
            await client.query('DELETE FROM pm_project_agents WHERE project_id = $1', [id]);

            // 2. Clear lead conversion link so lead can be converted again
            if (old.source_lead_id) {
                await client.query('UPDATE agent_leads SET converted_project_id = NULL WHERE id = $1', [old.source_lead_id]);
            }
            await client.query('UPDATE agent_leads SET converted_project_id = NULL WHERE converted_project_id = $1', [id]);

            // 3. Delete the project
            await client.query('DELETE FROM pm_projects WHERE id = $1', [id]);

            // 4. Fetch party info for audit log
            const partyRes = await client.query('SELECT name FROM pm_parties WHERE id = $1', [old.party_id]);
            const partyName = partyRes.rows[0]?.name || 'Unknown Party';

            // 5. Write audit log (who, when, project name, party, contract value)
            await writePmAudit(client, 'project', id, 'deleted', actorFromAdmin(admin), {
                id: old.id,
                project_name: old.name,
                party_id: old.party_id,
                party_name: partyName,
                contract_value: old.contract_value,
                start_date: old.start_date,
                source_lead_id: old.source_lead_id,
            }, null);

            await client.query('COMMIT');
            return NextResponse.json({ success: true, message: 'Project deleted successfully' });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Project delete error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Could not delete project' }, { status: 500 });
    }
}
