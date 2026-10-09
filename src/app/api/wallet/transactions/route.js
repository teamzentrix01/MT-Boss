import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireActiveUser } from '@/lib/user-moderation';

export async function GET(req) {
  try {
    const { user, blocked } = await requireActiveUser(req);
    if (blocked) {
      return NextResponse.json({ success: false, error: 'Account blocked' }, { status: 403 });
    }
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, Number.parseInt(searchParams.get('limit') || 50, 10)));

    const result = await pool.query(
      `SELECT t.*, me.order_reference
       FROM wallet_transactions t
       LEFT JOIN material_enquiries me ON me.id = t.order_id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC, t.id DESC
       LIMIT $2`,
      [user.id, limit]
    );

    return NextResponse.json({
      success: true,
      data: result.rows.map((row) => ({
        ...row,
        amount: Number(row.amount),
      })),
    });
  } catch (error) {
    console.error('GET /api/wallet/transactions error:', error);
    return NextResponse.json({ success: false, error: 'Could not fetch transactions' }, { status: 500 });
  }
}
