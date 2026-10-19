import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/agent-auth';

export async function POST(req, { params }) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const userId = Number((await params).id);
    const body = await req.json().catch(() => ({}));
    const reason = body?.reason ? String(body.reason).trim().slice(0, 1000) : null;
    if (!Number.isInteger(userId)) return NextResponse.json({ success: false, error: 'Invalid user' }, { status: 400 });

    let updatedRecord = null;
    if (userId >= 3000000) {
      const aId = userId - 3000000;
      const res = await pool.query(
        `UPDATE agents SET status = 'Rejected', login_enabled = FALSE WHERE id = $1 RETURNING id, status, email`,
        [aId]
      );
      if (res.rows[0]) {
        updatedRecord = { id: userId, is_blocked: true, blocked_reason: reason || 'Application Rejected', blocked_at: new Date() };
      }
    } else if (userId >= 2000000) {
      const sId = userId - 2000000;
      const res = await pool.query(
        `UPDATE suppliers SET is_active = FALSE, status = 'rejected', rejection_reason = $1 WHERE id = $2 RETURNING id, status, email`,
        [reason || 'Blocked by admin', sId]
      );
      if (res.rows[0]) {
        updatedRecord = { id: userId, is_blocked: true, blocked_reason: reason || 'Blocked by admin', blocked_at: new Date() };
      }
    } else if (userId >= 1000000) {
      const vId = userId - 1000000;
      const res = await pool.query(
        `UPDATE vendors SET status = 'blocked' WHERE id = $1 RETURNING id, status, email`,
        [vId]
      );
      if (res.rows[0]) {
        updatedRecord = { id: userId, is_blocked: true, blocked_reason: reason || 'Blocked by admin', blocked_at: new Date() };
      }
    } else {
      const result = await pool.query(
        `UPDATE users SET is_blocked=TRUE, blocked_reason=$1, blocked_at=NOW() WHERE id=$2 RETURNING id, is_blocked, blocked_reason, blocked_at`,
        [reason, userId]
      );
      if (result.rows[0]) {
        updatedRecord = result.rows[0];
      }
    }

    if (!updatedRecord) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    try {
      await pool.query(
        'INSERT INTO user_moderation_logs (user_id, action, reason, admin_id, admin_name) VALUES ($1, $2, $3, $4, $5)',
        [userId, 'blocked', updatedRecord.blocked_reason, admin.id || null, admin.name || admin.email || 'Admin']
      );
    } catch (e) {
      console.warn('Moderation log insert error:', e.message);
    }
    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error) { return NextResponse.json({ success: false, error: error.message || 'Could not block user' }, { status: 500 }); }
}
