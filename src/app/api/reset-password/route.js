import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

// POST — verify OTP + reset password in one step
export async function POST(req) {
  try {
    const { email, user_type, otp, new_password } = await req.json();

    if (!email || !user_type || !otp || !new_password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }
    if (new_password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Find valid, unused OTP
    const otpRes = await pool.query(
      `SELECT id FROM password_reset_otps
       WHERE email = $1 AND user_type = $2 AND otp = $3
         AND used = FALSE AND expires_at > NOW()`,
      [email, user_type, otp.trim()]
    );

    if (otpRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP. Please request a new one.' }, { status: 400 });
    }

    // Update password based on user type
    if (user_type === 'supplier') {
      await pool.query(
        `UPDATE suppliers SET password_hash = crypt($1, gen_salt('bf')), updated_at = NOW() WHERE email = $2`,
        [new_password, email]
      );
    } else {
      const hash = await bcrypt.hash(new_password, 10);
      if (user_type === 'vendor') {
        // vendors use password_hash column
        await pool.query(
          `UPDATE vendors SET password_hash = $1, updated_at = NOW() WHERE email = $2`,
          [hash, email]
        );
      } else {
        // users table uses 'password' column (not password_hash)
        await pool.query(
          `UPDATE users SET password = $1 WHERE email = $2`,
          [hash, email]
        );
      }
    }

    // Mark OTP as used
    await pool.query(
      `UPDATE password_reset_otps SET used = TRUE WHERE email = $1 AND user_type = $2`,
      [email, user_type]
    );

    return NextResponse.json({ success: true, message: 'Password reset successfully. You can now log in.' });

  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
