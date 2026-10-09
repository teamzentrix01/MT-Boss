import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireActiveUser } from '@/lib/user-moderation';
import { ensureWallet } from '@/lib/cashback/service';

export async function GET(req) {
  try {
    const { user, blocked } = await requireActiveUser(req);
    if (blocked) {
      return NextResponse.json({ success: false, error: 'Account blocked' }, { status: 403 });
    }
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    await ensureWallet(user.id);
    const result = await pool.query(
      `SELECT balance, pending_balance, updated_at 
       FROM wallets 
       WHERE user_id = $1`,
      [user.id]
    );

    const wallet = result.rows[0] || { balance: '0.00', pending_balance: '0.00' };
    return NextResponse.json({
      success: true,
      data: {
        balance: Number(wallet.balance) || 0,
        pending_balance: Number(wallet.pending_balance) || 0,
        updated_at: wallet.updated_at,
      },
    });
  } catch (error) {
    console.error('GET /api/wallet error:', error);
    return NextResponse.json({ success: false, error: 'Could not fetch wallet details' }, { status: 500 });
  }
}
