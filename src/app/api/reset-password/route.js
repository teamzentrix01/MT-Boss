import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { hashOtp, verifyOtp, PASSWORD_RESET_OTP_MAX_ATTEMPTS } from '@/lib/otp';

// POST — verify OTP + reset password in one step
export async function POST(req) {
  try {
    const { email, user_type, otp, new_password } = await req.json();

    if (!email || !user_type || !otp || !new_password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    if (new_password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const otpRes = await pool.query(
      `SELECT id, otp, otp_hash, COALESCE(attempts, 0) AS attempts
       FROM password_reset_otps
       WHERE email = $1 AND user_type = $2
         AND used = FALSE AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [normalizedEmail, user_type]
    );

    if (otpRes.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP. Please request a new one.' }, { status: 400 });
    }

    const otpRow = otpRes.rows[0];
    if (Number(otpRow.attempts) >= PASSWORD_RESET_OTP_MAX_ATTEMPTS) {
      await pool.query(`UPDATE password_reset_otps SET used = TRUE WHERE id = $1`, [otpRow.id]);
      return NextResponse.json({ success: false, error: 'Too many invalid attempts. Please request a new OTP.' }, { status: 429 });
    }

    const submittedOtp = otp.trim();
    const matchesHashedOtp = otpRow.otp_hash ? verifyOtp(submittedOtp, otpRow.otp_hash) : false;
    const matchesLegacyOtp = otpRow.otp ? hashOtp(submittedOtp) === hashOtp(otpRow.otp) : false;

    if (!matchesHashedOtp && !matchesLegacyOtp) {
      const attempts = Number(otpRow.attempts) + 1;
      await pool.query(`UPDATE password_reset_otps SET attempts = $1 WHERE id = $2`, [attempts, otpRow.id]);
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired OTP. Please request a new one.',
        attempts_remaining: Math.max(PASSWORD_RESET_OTP_MAX_ATTEMPTS - attempts, 0),
      }, { status: 400 });
    }

    // Update password based on user type
    if (user_type === 'supplier') {
      await pool.query(
        `UPDATE suppliers SET password_hash = crypt($1, gen_salt('bf')), updated_at = NOW() WHERE LOWER(TRIM(email)) = $2`,
        [new_password, normalizedEmail]
      );
    } else {
      const hash = await bcrypt.hash(new_password, 10);
      if (user_type === 'vendor') {
        // vendors use password_hash column
        await pool.query(
          `UPDATE vendors SET password_hash = $1, updated_at = NOW() WHERE LOWER(TRIM(email)) = $2`,
          [hash, normalizedEmail]
        );
      } else {
        // users table uses 'password' column (not password_hash)
        await pool.query(
          `UPDATE users SET password = $1 WHERE LOWER(TRIM(email)) = $2`,
          [hash, normalizedEmail]
        );
      }
    }

    // Mark OTP as used
    await pool.query(
      `UPDATE password_reset_otps SET used = TRUE WHERE id = $1`,
      [otpRow.id]
    );

    return NextResponse.json({ success: true, message: 'Password reset successfully. You can now log in.' });

  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
