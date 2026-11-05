import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import {
  getRefreshSecret,
  generateRefreshToken,
  hashRefreshToken,
  signPartnerAccessToken,
  loadPartnerEntity,
  ensureMobileUsersEntityColumn,
} from '@/lib/mobile-auth';

function entityStillAllowed(role, entity) {
  if (!entity) return false;
  if (role === 'agent') return entity.status === 'Approved' && entity.login_enabled;
  if (role === 'vendor') return Boolean(entity.is_approved) && entity.status !== 'inactive';
  return entity.status === 'approved' && entity.is_active !== false;
}

function profileFromEntity(role, entity, mobileFallback) {
  const mobile = String(entity.phone || mobileFallback || '').replace(/\D/g, '').slice(-10);
  if (role === 'agent') {
    return {
      id: entity.id,
      mobile,
      name: entity.name,
      email: entity.email,
      role: 'agent',
      status: 'active',
      phone: entity.phone,
    };
  }
  if (role === 'vendor') {
    return {
      id: entity.id,
      mobile,
      name: entity.shop_name || entity.business_name || entity.vendor_name || entity.email,
      email: entity.email,
      role: 'vendor',
      status: 'active',
      phone: entity.phone,
    };
  }
  return {
    id: entity.id,
    mobile,
    name: entity.shop_name || entity.email,
    email: entity.email,
    role: 'supplier',
    status: 'active',
    phone: entity.phone,
  };
}

export async function POST(req) {
  try {
    await ensureMobileUsersEntityColumn();

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

    let payload;
    try {
      payload = jwt.verify(refreshToken, getRefreshSecret());
    } catch (err) {
      const msg = err?.name === 'TokenExpiredError'
        ? 'Refresh token expired. Please sign in again.'
        : 'Invalid refresh token.';
      return NextResponse.json({ success: false, error: msg }, { status: 401 });
    }

    if (payload.type !== 'refresh') {
      return NextResponse.json({ success: false, error: 'Invalid token type.' }, { status: 401 });
    }

    const incomingHash = hashRefreshToken(refreshToken);
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `SELECT id, mobile, name, role, status, entity_id, refresh_token_hash
         FROM mobile_users WHERE id = $1 FOR UPDATE`,
        [payload.userId],
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'User not found.' }, { status: 401 });
      }

      const mobileUser = result.rows[0];

      if (mobileUser.status === 'blocked') {
        await client.query('ROLLBACK');
        return NextResponse.json({ success: false, error: 'Account blocked. Contact support.' }, { status: 403 });
      }

      if (!mobileUser.refresh_token_hash || mobileUser.refresh_token_hash !== incomingHash) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: 'Refresh token revoked or already used.' },
          { status: 401 },
        );
      }

      const entityId = mobileUser.entity_id || payload.entityId;
      const entity = await loadPartnerEntity(mobileUser.role, entityId);
      if (!entityStillAllowed(mobileUser.role, entity)) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: 'Linked partner account is inactive. Please sign in again.' },
          { status: 401 },
        );
      }

      const accessToken = signPartnerAccessToken(mobileUser.role, entity);
      const newRefreshToken = generateRefreshToken({
        ...mobileUser,
        entity_id: entity.id,
      });
      const newRefreshHash = hashRefreshToken(newRefreshToken);

      await client.query(
        `UPDATE mobile_users
            SET refresh_token_hash = $1,
                entity_id = $2,
                name = COALESCE($3, name),
                status = 'active',
                updated_at = NOW()
          WHERE id = $4`,
        [
          newRefreshHash,
          entity.id,
          profileFromEntity(mobileUser.role, entity, mobileUser.mobile).name,
          mobileUser.id,
        ],
      );

      await client.query('COMMIT');

      const user = profileFromEntity(mobileUser.role, entity, mobileUser.mobile);

      return NextResponse.json({
        success: true,
        token: accessToken,
        accessToken,
        refreshToken: newRefreshToken,
        user,
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
