import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { clearOtherAuthCookies, getJwtSecret, setAuthCookie } from '@/lib/auth';
import {
  verifyMobileSignupToken,
  signPartnerAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  upsertMobileUserSession,
  ensureMobileUsersEntityColumn,
} from '@/lib/mobile-auth';
import { normalizePhone } from '@/lib/validation';
import { isAdminEmail } from '@/lib/admin-email';

const MOBILE_REGEX = /^[6-9]\d{9}$/;

export async function POST(req) {
  try {
    await ensureMobileUsersEntityColumn();

    const body = await req.json();
    const mobileSignupToken = String(body?.mobileSignupToken || body?.mobile_signup_token || '').trim();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const phoneRaw = String(body?.phone || body?.mobile || '').trim();

    const verified = verifyMobileSignupToken(mobileSignupToken);
    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'OTP verification expired. Please verify your mobile number again.' },
        { status: 400 },
      );
    }

    const phone = normalizePhone(phoneRaw || verified.mobile);
    if (!MOBILE_REGEX.test(phone)) {
      return NextResponse.json({ success: false, error: 'Enter a valid 10-digit mobile number.' }, { status: 400 });
    }
    if (phone !== verified.mobile) {
      return NextResponse.json(
        { success: false, error: 'Mobile number does not match the verified OTP session.' },
        { status: 400 },
      );
    }
    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required.' }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }
    if (isAdminEmail(email)) {
      return NextResponse.json({ success: false, error: 'This email is reserved. Use a different email.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const phoneMatchSql = `RIGHT(regexp_replace(COALESCE(phone, ''), '\\D', '', 'g'), 10) = $1`;
      const existingPhone = await client.query(
        `SELECT id FROM users WHERE ${phoneMatchSql} LIMIT 1`,
        [phone],
      );
      if (existingPhone.rows.length > 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, error: 'An account already exists for this mobile number. Please sign in with OTP.' },
          { status: 409 },
        );
      }

      let inserted;
      try {
        inserted = await client.query(
          `INSERT INTO users (name, email, password, phone)
           VALUES ($1, $2, $3, $4)
           RETURNING id, email, name, phone, FALSE AS is_blocked`,
          [name, email, hashedPassword, phone],
        );
      } catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '23505') {
          return NextResponse.json(
            { success: false, error: 'Email already exists. Please use a different email.' },
            { status: 400 },
          );
        }
        throw error;
      }

      const user = inserted.rows[0];
      const mobileUser = await upsertMobileUserSession(client, {
        mobile: phone,
        role: 'user',
        entityId: user.id,
        name: user.name,
        status: 'active',
      });

      const accessToken = signPartnerAccessToken('user', user);
      const refreshToken = generateRefreshToken(mobileUser);
      const refreshTokenHash = hashRefreshToken(refreshToken);

      await client.query(
        `UPDATE mobile_users SET refresh_token_hash = $1, updated_at = NOW() WHERE id = $2`,
        [refreshTokenHash, mobileUser.id],
      );
      await client.query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [user.id]).catch(() => {});

      await client.query('COMMIT');

      const responseUser = {
        id: user.id,
        mobile: phone,
        name: user.name,
        email: user.email,
        role: 'user',
        status: 'active',
        phone: user.phone,
      };

      const response = NextResponse.json({
        success: true,
        message: 'Account created successfully.',
        token: accessToken,
        accessToken,
        refreshToken,
        user: responseUser,
      }, { status: 201 });

      clearOtherAuthCookies(response, 'auth-token');
      return setAuthCookie(response, 'auth-token', accessToken);
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[signup-after-otp] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
