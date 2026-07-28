import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ensureAgentSchema, requireAgent } from '@/lib/agent-auth';
import { ensureAgentNotificationsSchema } from '@/lib/agent-notifications';

export async function GET(req) {
  try {
    await ensureAgentSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await ensureAgentNotificationsSchema();

    await pool.query(
      `INSERT INTO agent_notifications (
         agent_id, type, title, message, entity_type, entity_id, dedupe_key, created_at
       )
       SELECT id, 'account_status', 'Account approved',
              'Your agent account has been approved and activated.',
              'agent', id, 'account-approved-' || COALESCE(auth_version, 0)::TEXT,
              COALESCE(approved_at, created_at, NOW())
       FROM agents
       WHERE id = $1 AND status = 'Approved'
       ON CONFLICT (agent_id, dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING`,
      [agent.id]
    );

    const result = await pool.query(
      `SELECT id, type, title, message, entity_type, entity_id, metadata,
              is_read, read_at, created_at
       FROM agent_notifications
       WHERE agent_id = $1
       ORDER BY created_at DESC, id DESC`,
      [agent.id]
    );
    const unreadCount = result.rows.reduce((count, item) => count + (item.is_read ? 0 : 1), 0);

    return NextResponse.json({
      success: true,
      data: result.rows,
      unread_count: unreadCount,
    });
  } catch (error) {
    console.error('Agent activity fetch error:', error);
    return NextResponse.json({ success: false, error: 'Activity could not be loaded' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await ensureAgentSchema();
    const agent = await requireAgent(req);
    if (!agent) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await ensureAgentNotificationsSchema();

    const body = await req.json();
    if (body.mark_all_read === true) {
      await pool.query(
        `UPDATE agent_notifications
         SET is_read = TRUE, read_at = COALESCE(read_at, NOW())
         WHERE agent_id = $1 AND is_read = FALSE`,
        [agent.id]
      );
    } else {
      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ success: false, error: 'Valid notification id is required' }, { status: 400 });
      }
      const result = await pool.query(
        `UPDATE agent_notifications
         SET is_read = TRUE, read_at = COALESCE(read_at, NOW())
         WHERE id = $1 AND agent_id = $2
         RETURNING id`,
        [id, agent.id]
      );
      if (!result.rows[0]) {
        return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 });
      }
    }

    const unread = await pool.query(
      `SELECT COUNT(*)::INT AS count
       FROM agent_notifications
       WHERE agent_id = $1 AND is_read = FALSE`,
      [agent.id]
    );
    return NextResponse.json({ success: true, unread_count: unread.rows[0].count });
  } catch (error) {
    console.error('Agent activity update error:', error);
    return NextResponse.json({ success: false, error: 'Activity could not be updated' }, { status: 500 });
  }
}
