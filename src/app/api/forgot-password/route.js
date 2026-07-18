import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendMail } from '@/lib/email';
import { generateSixDigitOtp, hashOtp, PASSWORD_RESET_OTP_EXPIRY_MINUTES } from '@/lib/otp';
import { createInitializationGuard } from '@/lib/api-utils';

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_otps (
      id         SERIAL PRIMARY KEY,
      email      VARCHAR(255) NOT NULL,
      user_type  VARCHAR(20)  NOT NULL,
      otp        VARCHAR(6),
      otp_hash   TEXT,
      attempts   INTEGER      DEFAULT 0,
      expires_at TIMESTAMP    NOT NULL,
      used       BOOLEAN      DEFAULT FALSE,
      created_at TIMESTAMP    DEFAULT NOW()
    )
  `);
  await pool.query(`ALTER TABLE password_reset_otps ALTER COLUMN otp DROP NOT NULL`);
  await pool.query(`ALTER TABLE password_reset_otps ADD COLUMN IF NOT EXISTS otp_hash TEXT`);
  await pool.query(`ALTER TABLE password_reset_otps ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 0`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_pro_email ON password_reset_otps (email, user_type)`);
});

// POST — generate OTP and send to email
export async function POST(req) {
  try {
    const { email, user_type } = await req.json(); // user_type: 'user' | 'supplier' | 'vendor'

    if (!email || !user_type) {
      return NextResponse.json({ success: false, error: 'Email and user type required' }, { status: 400 });
    }

    await ensureTable();

    // Check user exists in the right table
    const table = user_type === 'supplier' ? 'suppliers' : user_type === 'vendor' ? 'vendors' : 'users';
    const userRes = await pool.query(`SELECT id, email FROM ${table} WHERE email = $1`, [email]);

    if (userRes.rows.length === 0) {
      // Generic message — don't reveal if email exists
      return NextResponse.json({ success: true, message: 'If that email is registered, an OTP has been sent.' });
    }

    const recentCount = await pool.query(
      `SELECT COUNT(*)::INTEGER AS count
       FROM password_reset_otps
       WHERE email = $1 AND user_type = $2 AND created_at > NOW() - INTERVAL '1 hour'`,
      [email, user_type]
    );

    if (Number(recentCount.rows[0]?.count || 0) >= 5) {
      return NextResponse.json(
        { success: false, error: 'Too many OTP requests. Please try again later.' },
        { status: 429 }
      );
    }

    const otp = generateSixDigitOtp();
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_OTP_EXPIRY_MINUTES * 60 * 1000);

    await pool.query(
      `UPDATE password_reset_otps SET used = TRUE WHERE email = $1 AND user_type = $2 AND used = FALSE`,
      [email, user_type]
    );

    await pool.query(
      `INSERT INTO password_reset_otps (email, user_type, otp_hash, expires_at) VALUES ($1, $2, $3, $4)`,
      [email, user_type, hashOtp(otp), expiresAt]
    );

    // Check if SMTP is actually configured
    const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    const isProduction = process.env.NODE_ENV === 'production';

    if (!smtpConfigured && isProduction) {
      await pool.query(
        `UPDATE password_reset_otps SET used = TRUE WHERE email = $1 AND user_type = $2 AND used = FALSE`,
        [email, user_type]
      );
      return NextResponse.json(
        { success: false, error: 'Email service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    if (smtpConfigured) {
      try {
        await sendMail({
          to: email,
          subject: 'Your MTbosspassword reset OTP',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
              <h2 style="color:#111;margin-bottom:8px;">Password Reset OTP</h2>
              <p style="color:#555;line-height:1.6;margin-bottom:20px;">
                Use the code below to reset your password. It expires in <strong>${PASSWORD_RESET_OTP_EXPIRY_MINUTES} minutes</strong>.
              </p>
              <div style="background:#f5f5f7;border-radius:10px;padding:24px;text-align:center;margin-bottom:20px;">
                <div style="font-size:36px;font-weight:900;letter-spacing:12px;color:#111;">${otp}</div>
              </div>
              <p style="color:#999;font-size:12px;">If you didn't request this, ignore this email.</p>
            </div>
          `,
        });
      } catch (err) {
        console.error('Email send failed:', err.message);
        await pool.query(
          `UPDATE password_reset_otps SET used = TRUE WHERE email = $1 AND user_type = $2 AND used = FALSE`,
          [email, user_type]
        );
        return NextResponse.json({ success: false, error: 'Failed to send OTP email. Please try again.' }, { status: 502 });
      }
    }

    return NextResponse.json({
      success: true,
      message: smtpConfigured ? 'OTP sent to your email address.' : 'OTP generated (email not configured).',
      email_sent: smtpConfigured,
      // Show OTP on screen when SMTP is not configured (dev/testing mode)
      ...(!smtpConfigured && !isProduction && { dev_otp: otp }),
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
