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
    const result = await pool.query(`UPDATE users SET is_blocked=TRUE, blocked_reason=$1, blocked_at=NOW() WHERE id=$2 RETURNING id, is_blocked, blocked_reason, blocked_at`, [reason, userId]);
    if (!result.rows[0]) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    await pool.query('INSERT INTO user_moderation_logs (user_id, action, reason, admin_id, admin_name) VALUES ($1, $2, $3, $4, $5)', [userId, 'blocked', result.rows[0].blocked_reason, admin.id || null, admin.name || admin.email || 'Admin']);
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) { return NextResponse.json({ success: false, error: error.message || 'Could not block user' }, { status: 500 }); }
}
