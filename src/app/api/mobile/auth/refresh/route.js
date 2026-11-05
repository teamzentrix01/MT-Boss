import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { generateAccessToken, generateRefreshToken, hashRefreshToken } from '@/lib/mobile-auth';

function getRefreshSecret() {
  const s = process.env.REFRESH_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV !== 'production') return 'dev-refresh-secret-change-me';
  throw new Error('REFRESH_SECRET is required in production');
}

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }

    const refreshToken = String(body?.refreshToken || '').trim();
    if (!refreshToken) {
      return NextResponse.json({ success: false, error: 'Refresh token required' }, { status: 400 });
    }

    // Verify JWT
    let payload;
    try {
      payload = jwt.verify(refreshToken, getRefreshSecret());
    } catch (err) {
      const msg = err?.name === 'TokenExpiredError' ? 'Refresh token expired. Please sign in again.' : 'Invalid refresh token.';
      return NextResponse.json({ success: false, error: msg }, { status: 401 });
    }

    if (payload.type !== 'refresh') {
      return NextResponse.json({ success: false, error: 'Invalid token type.' }, { status: 401 });
    }

    // Hash incoming refresh token
    const incomingHash = hashRefreshToken(refreshToken);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Load user and lock row
      const result = await client.query(
        `SELECT id, mobile, name, role, status, refresh_token_hash
         FROM mobile_users WHERE id = $1 FOR UPDATE`,
        [payload.userId],
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'User not found.' }, { status: 401 });
      }

      const user = result.rows[0];

      if (user.status === 'blocked') {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Account blocked. Contact support.' }, { status: 403 });
      }

      // Reject if stored hash doesn't match (token reuse / revocation)
      if (!user.refresh_token_hash || user.refresh_token_hash !== incomingHash) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Refresh token revoked or already used.' }, { status: 401 });
      }

      // Rotate tokens
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      const newRefreshHash = hashRefreshToken(newRefreshToken);

      await client.query(
        `UPDATE mobile_users SET refresh_token_hash = $1, updated_at = NOW() WHERE id = $2`,
        [newRefreshHash, user.id],
      );

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          mobile: user.mobile,
          name: user.name,
          role: user.role,
          status: user.status,
        },
      });
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[refresh] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 });
  }
}
