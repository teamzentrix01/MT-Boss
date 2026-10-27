import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureProjectManagementSchema, pageParams, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

const VALID_CATEGORIES = ['transport', 'machine_rent', 'electricity_water', 'permit', 'misc', 'tools', 'rent'];

export async function GET(req) {
  try {
    await ensureProjectManagementSchema();
    const s = new URL(req.url).searchParams;
    const { page, pageSize, offset } = pageParams(s);
    const projectId = Number(s.get('projectId'));

    if (!Number.isInteger(projectId)) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const auth = await assertAgentAccess(req, projectId, 'construction');
    if (!auth.allowed) return auth.response;

    const category = s.get('category') || null;
    const startDate = s.get('startDate') || null;
    const endDate = s.get('endDate') || null;
    const search = (s.get('search') || '').trim();

    let where = 'project_id = $1 AND NOT is_deleted';
    const params = [projectId];

    if (category) {
      params.push(category);
      where += ` AND category = $${params.length}`;
    }
    if (startDate) {
      params.push(startDate);
      where += ` AND expense_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      where += ` AND expense_date <= $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      where += ` AND (note ILIKE $${params.length} OR category ILIKE $${params.length})`;
    }

    params.push(pageSize, offset);

    const r = await pool.query(
      `SELECT *, COUNT(*) OVER()::int AS total_count,
              SUM(amount) OVER() AS filtered_total_amount
       FROM pm_other_expenses
       WHERE ${where}
       ORDER BY expense_date DESC, created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    const total = Number(r.rows[0]?.total_count || 0);
    const totalAmount = Number(r.rows[0]?.filtered_total_amount || 0);

    const rows = r.rows.map((row) => {
      let item_name = row.item_name || null;
      let display_note = row.note || '';
      if (!item_name && row.note) {
        const m = String(row.note).match(/^\[Item:\s*([^\]]+)\](?:\s*([\s\S]*))?$/);
        if (m) {
          item_name = m[1].trim();
          display_note = (m[2] || '').trim();
        }
      }
      return {
        ...row,
        item_name: item_name || null,
        display_note: display_note || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: rows,
      summary: { totalAmount },
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) }
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ensureProjectManagementSchema();
    const b = await req.json();
    const p = Number(b.project_id);
    const amt = Number(b.amount);
    const cat = String(b.category || '').trim();

    if (
      !Number.isInteger(p) ||
      !Number.isFinite(amt) ||
      amt <= 0 ||
      !VALID_CATEGORIES.includes(cat) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.expense_date || '')
    ) {
      return NextResponse.json({ success: false, error: 'Invalid expense parameters' }, { status: 400 });
    }

    // Validation: Item / Tool name is required when Category is tools or rent
    let itemName = typeof b.item_name === 'string' ? b.item_name.trim() : '';
    let noteText = typeof b.note === 'string' ? b.note.trim() : '';

    const itemMatch = noteText.match(/^\[Item:\s*([^\]]+)\](?:\s*([\s\S]*))?$/);
    if (itemMatch) {
      if (!itemName) itemName = itemMatch[1].trim();
      noteText = (itemMatch[2] || '').trim();
    }

    if (['tools', 'rent'].includes(cat) && !itemName) {
      return NextResponse.json({
        success: false,
        error: `Item / Tool name is required when Category is ${cat === 'tools' ? 'Tools' : 'Rent'}`
      }, { status: 400 });
    }

    if (itemName.length > 120) {
      itemName = itemName.slice(0, 120).trim();
    }

    const storedNote = itemName ? (noteText ? `[Item: ${itemName}] ${noteText}` : `[Item: ${itemName}]`) : (noteText || null);

    const auth = await assertAgentAccess(req, p, 'construction');
    if (!auth.allowed) return auth.response;

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const actor = actorFromAdmin(auth.user);

      const r = await c.query(
        `INSERT INTO pm_other_expenses(
           project_id, category, amount, expense_date, note, created_by
         ) VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING *`,
        [p, cat, amt, b.expense_date, storedNote, actor]
      );

      await writePmPhase2Audit(c, 'pm_other_expenses', r.rows[0].id, 'created', actor, null, r.rows[0]);
      await c.query('COMMIT');

      const saved = r.rows[0];
      return NextResponse.json({
        success: true,
        data: {
          ...saved,
          item_name: itemName || null,
          display_note: noteText || null,
        }
      }, { status: 201 });
    } catch (e) {
      await c.query('ROLLBACK');
      throw e;
    } finally {
      c.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
