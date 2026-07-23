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
    const normalizedEmail = String(email).trim().toLowerCase();

    await ensureTable();

    // Check user exists in the right table
    const table = user_type === 'supplier' ? 'suppliers' : user_type === 'vendor' ? 'vendors' : 'users';
    const userRes = await pool.query(
      `SELECT id, email FROM ${table} WHERE LOWER(TRIM(email)) = $1`,
      [normalizedEmail]
    );

    if (userRes.rows.length === 0) {
      console.info(`[PASSWORD RESET skipped] No registered ${user_type} account matched the submitted email.`);
      // Generic message — don't reveal if email exists
      return NextResponse.json({ success: true, message: 'If that email is registered, an OTP has been sent.' });
    }

    const recentCount = await pool.query(
      `SELECT COUNT(*)::INTEGER AS count
       FROM password_reset_otps
       WHERE email = $1 AND user_type = $2 AND created_at > NOW() - INTERVAL '1 hour'`,
      [normalizedEmail, user_type]
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
      [normalizedEmail, user_type]
    );

    await pool.query(
      `INSERT INTO password_reset_otps (email, user_type, otp_hash, expires_at) VALUES ($1, $2, $3, $4)`,
      [normalizedEmail, user_type, hashOtp(otp), expiresAt]
    );

    // Check if SMTP is actually configured
    const smtpConfigured = !!(
      (process.env.SMTP_HOST || process.env.EMAIL_HOST)
      && (process.env.SMTP_USER || process.env.EMAIL_USER)
      && (process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD)
    );
    const isProduction = process.env.NODE_ENV === 'production';

    if (!smtpConfigured && isProduction) {
      await pool.query(
        `UPDATE password_reset_otps SET used = TRUE WHERE email = $1 AND user_type = $2 AND used = FALSE`,
        [normalizedEmail, user_type]
      );
      return NextResponse.json(
        { success: false, error: 'Email service is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    if (smtpConfigured) {
      try {
        await sendMail({
          to: userRes.rows[0].email,
          subject: 'Your MTBoss password reset code',
          text: [
            'MTBoss password reset',
            '',
            `Your one-time password is: ${otp}`,
            `This code expires in ${PASSWORD_RESET_OTP_EXPIRY_MINUTES} minutes.`,
            '',
            'If you did not request a password reset, you can safely ignore this email.',
            'For your security, do not share this code with anyone.',
            '',
            'MTBoss',
          ].join('\n'),
          html: `
            <!doctype html>
            <html lang="en">
              <body style="margin:0;padding:0;background:#f4f4f5;color:#18181b;">
                <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
                  Use this one-time code to reset your MTBoss password.
                </div>
                <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:32px 20px;">
                  <div style="background:#ffffff;border:1px solid #e4e4e7;padding:28px;">
                    <p style="margin:0 0 20px;color:#111827;font-size:20px;font-weight:700;">MTBoss</p>
                    <h1 style="color:#18181b;font-size:24px;line-height:1.3;margin:0 0 12px;">Reset your password</h1>
                    <p style="color:#52525b;font-size:15px;line-height:1.6;margin:0 0 20px;">
                      Enter this one-time code on the MTBoss password reset screen. It expires in
                      <strong>${PASSWORD_RESET_OTP_EXPIRY_MINUTES} minutes</strong>.
                    </p>
                    <div style="background:#f4f4f5;border:1px solid #e4e4e7;padding:22px;text-align:center;margin:0 0 20px;">
                      <div style="font-size:34px;font-weight:700;letter-spacing:10px;color:#18181b;">${otp}</div>
                    </div>
                    <p style="color:#52525b;font-size:13px;line-height:1.6;margin:0;">
                      If you did not request this, you can safely ignore this email. For your security,
                      do not share this code with anyone.
                    </p>
                  </div>
                  <p style="color:#71717a;font-size:11px;line-height:1.5;text-align:center;margin:16px 0 0;">
                    This transactional email was sent because a password reset was requested for your MTBoss account.
                  </p>
                </div>
              </body>
            </html>
          `,
        });
      } catch (err) {
        console.error('Email send failed:', err.message);
        await pool.query(
          `UPDATE password_reset_otps SET used = TRUE WHERE email = $1 AND user_type = $2 AND used = FALSE`,
          [normalizedEmail, user_type]
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
