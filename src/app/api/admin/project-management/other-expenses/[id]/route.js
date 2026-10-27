import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { ensureProjectManagementSchema, actorFromAdmin, writePmPhase2Audit, assertAgentAccess } from '@/lib/project-management';

const VALID_CATEGORIES = ['transport', 'machine_rent', 'electricity_water', 'permit', 'misc', 'tools', 'rent'];

export async function PATCH(req, { params }) {
  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_other_expenses WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
      }

      const auth = await assertAgentAccess(req, old.project_id, 'construction');
      if (!auth.allowed) {
        await c.query('ROLLBACK');
        return auth.response;
      }

      const b = await req.json();
      const amt = Number(b.amount);
      const cat = String(b.category || '').trim();

      if (
        !Number.isFinite(amt) ||
        amt <= 0 ||
        !VALID_CATEGORIES.includes(cat) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(b.expense_date || '')
      ) {
        await c.query('ROLLBACK');
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
        await c.query('ROLLBACK');
        return NextResponse.json({
          success: false,
          error: `Item / Tool name is required when Category is ${cat === 'tools' ? 'Tools' : 'Rent'}`
        }, { status: 400 });
      }

      if (itemName.length > 120) {
        itemName = itemName.slice(0, 120).trim();
      }

      const storedNote = itemName ? (noteText ? `[Item: ${itemName}] ${noteText}` : `[Item: ${itemName}]`) : (noteText || null);

      const r = await c.query(
        `UPDATE pm_other_expenses
         SET amount = $1, category = $2, expense_date = $3, note = $4
         WHERE id = $5
         RETURNING *`,
        [amt, cat, b.expense_date, storedNote, id]
      );

      const actor = actorFromAdmin(auth.user);
      await writePmPhase2Audit(c, 'pm_other_expenses', id, 'updated', actor, old, r.rows[0]);
      await c.query('COMMIT');

      const saved = r.rows[0];
      return NextResponse.json({
        success: true,
        data: {
          ...saved,
          item_name: itemName || null,
          display_note: noteText || null,
        }
      });
    } catch (e) {
      await c.query('ROLLBACK');
      return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    } finally {
      c.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const admin = requireRole(req, 'admin');
  if (!admin) {
    const auth = await assertAgentAccess(req, null, null);
    if (auth.role === 'agent') {
      return NextResponse.json({ success: false, error: 'Unauthorized: Agents cannot delete records (admin only)' }, { status: 403 });
    }
    return unauthorized();
  }

  try {
    await ensureProjectManagementSchema();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const c = await pool.connect();
    try {
      await c.query('BEGIN');
      const old = (await c.query(`SELECT * FROM pm_other_expenses WHERE id = $1 FOR UPDATE`, [id])).rows[0];
      if (!old || old.is_deleted) {
        await c.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
      }

      const r = await c.query(
        `UPDATE pm_other_expenses
         SET is_deleted = TRUE
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      const actor = actorFromAdmin(admin);
      await writePmPhase2Audit(c, 'pm_other_expenses', id, 'soft_deleted', actor, old, r.rows[0]);
      await c.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (e) {
      await c.query('ROLLBACK');
      return NextResponse.json({ success: false, error: e.message }, { status: 400 });
    } finally {
      c.release();
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
