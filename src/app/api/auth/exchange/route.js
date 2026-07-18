import crypto from 'crypto';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req) {
  try {
    const { code } = await req.json();
    if (!code || !/^[a-f0-9]{64}$/i.test(code)) {
      return NextResponse.json({ error: 'Invalid login code' }, { status: 400 });
    }

    const codeHash = crypto.createHash('sha256').update(code).digest('hex');
    const result = await pool.query(
      `DELETE FROM oauth_login_codes
       WHERE code_hash = $1 AND expires_at > NOW()
       RETURNING token, user_payload, redirect_to`,
      [codeHash]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Login code expired or already used' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      token: result.rows[0].token,
      user: result.rows[0].user_payload,
      redirectTo: result.rows[0].redirect_to,
    });
  } catch (error) {
    console.error('OAuth exchange error:', error);
    return NextResponse.json({ error: 'Unable to complete Google login' }, { status: 500 });
  }
}
