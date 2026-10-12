import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import {
  ensureUserNotificationsSchema,
  syncUserNotificationsFromHistory,
} from '@/lib/user-notifications';

export async function GET(req) {
  try {
    const user = requireRole(req, 'user');
    if (!user) return unauthorized();

    await ensureUserNotificationsSchema();
    await syncUserNotificationsFromHistory(user);

    const result = await pool.query(
      `SELECT id, type, title, message, entity_type, entity_id, metadata,
              is_read, read_at, created_at
         FROM user_notifications
        WHERE user_id = $1
           OR (user_id IS NULL AND LOWER(user_email) = LOWER($2))
        ORDER BY created_at DESC, id DESC
        LIMIT 100`,
      [user.id, user.email || '']
    );
    const unreadCount = result.rows.reduce((count, row) => count + (row.is_read ? 0 : 1), 0);

    return NextResponse.json({
      success: true,
      notifications: result.rows,
      unread_count: unreadCount,
    });
  } catch (error) {
    console.error('User notifications GET error:', error);
    return NextResponse.json({ success: false, error: 'Notifications could not be loaded' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const user = requireRole(req, 'user');
    if (!user) return unauthorized();

    await ensureUserNotificationsSchema();
    const body = await req.json();

    if (body.mark_all_read === true) {
      await pool.query(
        `UPDATE user_notifications
            SET is_read = TRUE, read_at = COALESCE(read_at, NOW())
          WHERE is_read = FALSE
            AND (user_id = $1 OR (user_id IS NULL AND LOWER(user_email) = LOWER($2)))`,
        [user.id, user.email || '']
      );
    } else {
      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ success: false, error: 'Valid notification id is required' }, { status: 400 });
      }
      const updated = await pool.query(
        `UPDATE user_notifications
            SET is_read = TRUE, read_at = COALESCE(read_at, NOW())
          WHERE id = $1
            AND (user_id = $2 OR (user_id IS NULL AND LOWER(user_email) = LOWER($3)))
          RETURNING id`,
        [id, user.id, user.email || '']
      );
      if (!updated.rows[0]) {
        return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 });
      }
    }

    const unread = await pool.query(
      `SELECT COUNT(*)::INT AS count
         FROM user_notifications
        WHERE is_read = FALSE
          AND (user_id = $1 OR (user_id IS NULL AND LOWER(user_email) = LOWER($2)))`,
      [user.id, user.email || '']
    );

    return NextResponse.json({ success: true, unread_count: unread.rows[0].count });
  } catch (error) {
    console.error('User notifications PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Notifications could not be updated' }, { status: 500 });
  }
}
