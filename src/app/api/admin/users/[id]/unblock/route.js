import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/agent-auth';

export async function POST(req, { params }) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const userId = Number((await params).id);
    if (!Number.isInteger(userId)) return NextResponse.json({ success: false, error: 'Invalid user' }, { status: 400 });
    const result = await pool.query('UPDATE users SET is_blocked=FALSE, blocked_reason=NULL, blocked_at=NULL WHERE id=$1 RETURNING id, is_blocked', [userId]);
    if (!result.rows[0]) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    await pool.query('INSERT INTO user_moderation_logs (user_id, action, admin_id, admin_name) VALUES ($1, $2, $3, $4)', [userId, 'unblocked', admin.id || null, admin.name || admin.email || 'Admin']);
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) { return NextResponse.json({ success: false, error: error.message || 'Could not unblock user' }, { status: 500 }); }
}
