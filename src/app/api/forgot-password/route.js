import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendMail } from '@/lib/email';

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_otps (
      id         SERIAL PRIMARY KEY,
      email      VARCHAR(255) NOT NULL,
      user_type  VARCHAR(20)  NOT NULL,
      otp        VARCHAR(6)   NOT NULL,
      expires_at TIMESTAMP    NOT NULL,
      used       BOOLEAN      DEFAULT FALSE,
      created_at TIMESTAMP    DEFAULT NOW()
    )
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_pro_email ON password_reset_otps (email, user_type)`);
}

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

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old OTPs for this email
    await pool.query(
      `DELETE FROM password_reset_otps WHERE email = $1 AND user_type = $2`,
      [email, user_type]
    );

    await pool.query(
      `INSERT INTO password_reset_otps (email, user_type, otp, expires_at) VALUES ($1, $2, $3, $4)`,
      [email, user_type, otp, expiresAt]
    );

    // Check if SMTP is actually configured
    const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (smtpConfigured) {
      try {
        await sendMail({
          to: email,
          subject: 'Your MT Boss password reset OTP',
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
              <h2 style="color:#111;margin-bottom:8px;">Password Reset OTP</h2>
              <p style="color:#555;line-height:1.6;margin-bottom:20px;">
                Use the code below to reset your password. It expires in <strong>10 minutes</strong>.
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
      }
    }

    return NextResponse.json({
      success: true,
      message: smtpConfigured ? 'OTP sent to your email address.' : 'OTP generated (email not configured).',
      email_sent: smtpConfigured,
      // Show OTP on screen when SMTP is not configured (dev/testing mode)
      ...(!smtpConfigured && { dev_otp: otp }),
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
