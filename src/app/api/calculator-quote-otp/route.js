import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import pool from '@/lib/db';
import { requireRole, unauthorized } from '@/lib/auth';
import { sendMail } from '@/lib/email';
import { generateSixDigitOtp, hashOtp, verifyOtp } from '@/lib/otp';
import { createInitializationGuard } from '@/lib/api-utils';

const EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

const ensureTable = createInitializationGuard(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS calculator_quote_otps (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      address TEXT NOT NULL,
      site_image_url TEXT,
      site_image_name TEXT,
      estimate JSONB,
      otp_hash TEXT,
      attempts INTEGER DEFAULT 0,
      verified BOOLEAN DEFAULT FALSE,
      used BOOLEAN DEFAULT FALSE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      verified_at TIMESTAMPTZ
    )
  `);
  await pool.query(`ALTER TABLE calculator_quote_otps ADD COLUMN IF NOT EXISTS site_image_url TEXT`);
  await pool.query(`ALTER TABLE calculator_quote_otps ADD COLUMN IF NOT EXISTS site_image_name TEXT`);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function isValidPhone(phone) {
  return /^[0-9+\-\s()]{8,20}$/.test(String(phone || '').trim());
}

async function saveSiteImage(file) {
  if (!file || typeof file === 'string') return null;

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid site image. Only JPG, PNG or WEBP allowed.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Site image is too large. Max 5MB allowed.');
  }

  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp';
  const safeName = String(file.name || `site.${ext}`).replace(/[^a-zA-Z0-9._-]/g, '-');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'calculator-sites');
  if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadDir, filename), buffer);

  return {
    url: `/uploads/calculator-sites/${filename}`,
    name: file.name || filename,
  };
}

export async function POST(req) {
  try {
    await ensureTable();
    const contentType = req.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');
    let body;

    if (isMultipart) {
      const formData = await req.formData();
      body = {
        action: formData.get('action') || 'request',
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        estimate: JSON.parse(formData.get('estimate') || '{}'),
        site_image: formData.get('site_image'),
      };
    } else {
      body = await req.json();
    }
    const action = body.action || 'request';

    if (action === 'verify') {
      const id = Number(body.quote_id);
      const otp = String(body.otp || '').trim();
      if (!id || !otp) {
        return NextResponse.json({ success: false, error: 'Quote ID and OTP are required.' }, { status: 400 });
      }

      const { rows } = await pool.query(
        `SELECT id, otp_hash, attempts, expires_at, verified, used
         FROM calculator_quote_otps
         WHERE id = $1`,
        [id]
      );

      const row = rows[0];
      if (!row || row.used) {
        return NextResponse.json({ success: false, error: 'OTP request not found. Please request a new OTP.' }, { status: 404 });
      }
      if (row.verified) {
        return NextResponse.json({ success: true, verified: true });
      }
      if (Number(row.attempts || 0) >= MAX_ATTEMPTS) {
        await pool.query(`UPDATE calculator_quote_otps SET used = TRUE WHERE id = $1`, [id]);
        return NextResponse.json({ success: false, error: 'Too many incorrect attempts. Please request a new OTP.' }, { status: 429 });
      }
      if (!row.expires_at || new Date(row.expires_at).getTime() < Date.now()) {
        await pool.query(`UPDATE calculator_quote_otps SET used = TRUE WHERE id = $1`, [id]);
        return NextResponse.json({ success: false, error: 'OTP expired. Please request a new OTP.' }, { status: 410 });
      }

      if (!verifyOtp(otp, row.otp_hash)) {
        await pool.query(`UPDATE calculator_quote_otps SET attempts = attempts + 1 WHERE id = $1`, [id]);
        return NextResponse.json({ success: false, error: 'Invalid OTP. Please check and try again.' }, { status: 400 });
      }

      await pool.query(
        `UPDATE calculator_quote_otps
         SET verified = TRUE, verified_at = NOW()
         WHERE id = $1`,
        [id]
      );
      return NextResponse.json({ success: true, verified: true });
    }

    const { name, email, phone, address, estimate, site_image } = body;
    if (!name || !email || !phone || !address) {
      return NextResponse.json({ success: false, error: 'Name, email, phone and address are required.' }, { status: 400 });
    }
    if (!site_image) {
      return NextResponse.json({ success: false, error: 'Site image is required.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Enter a valid email address.' }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ success: false, error: 'Enter a valid mobile number.' }, { status: 400 });
    }

    const recent = await pool.query(
      `SELECT COUNT(*)::INTEGER AS count
       FROM calculator_quote_otps
       WHERE (email = $1 OR phone = $2)
         AND created_at > NOW() - INTERVAL '1 hour'`,
      [String(email).trim().toLowerCase(), String(phone).trim()]
    );
    if (Number(recent.rows[0]?.count || 0) >= 6) {
      return NextResponse.json({ success: false, error: 'Too many OTP requests. Please try again later.' }, { status: 429 });
    }

    const otp = generateSixDigitOtp();
    const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);
    const savedImage = await saveSiteImage(site_image);

    const result = await pool.query(
      `INSERT INTO calculator_quote_otps
        (name, email, phone, address, site_image_url, site_image_name, estimate, otp_hash, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id`,
      [
        String(name).trim(),
        String(email).trim().toLowerCase(),
        String(phone).trim(),
        String(address).trim(),
        savedImage?.url || null,
        savedImage?.name || null,
        estimate || {},
        hashOtp(otp),
        expiresAt,
      ]
    );

    const smtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    const isProduction = process.env.NODE_ENV === 'production';

    if (smtpConfigured) {
      await sendMail({
        to: String(email).trim(),
        subject: 'Your MTBoss budget estimate OTP',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fff;color:#111;">
            <h2 style="margin:0 0 8px;font-size:22px;">MTBoss Budget Estimate OTP</h2>
            <p style="color:#555;line-height:1.6;">Use this OTP to verify your quote request and download your construction budget estimate. It expires in <strong>${EXPIRY_MINUTES} minutes</strong>.</p>
            <div style="background:#f4f5f7;border-radius:10px;text-align:center;padding:22px;margin:18px 0;">
              <div style="font-size:34px;font-weight:900;letter-spacing:10px;">${otp}</div>
            </div>
            <p style="font-size:12px;color:#777;">The same OTP can be used for mobile/email verification on the website.</p>
          </div>
        `,
      });
    } else if (isProduction) {
      await pool.query(`UPDATE calculator_quote_otps SET used = TRUE WHERE id = $1`, [result.rows[0].id]);
      return NextResponse.json({ success: false, error: 'OTP service is not configured. Please contact support.' }, { status: 503 });
    }

    return NextResponse.json({
      success: true,
      quote_id: result.rows[0].id,
      message: smtpConfigured ? 'OTP sent to your email. Use the same OTP to verify and download the report.' : 'OTP generated.',
      email_sent: smtpConfigured,
      sms_sent: false,
      ...(!smtpConfigured && !isProduction ? { dev_otp: otp } : {}),
    });
  } catch (error) {
    console.error('calculator-quote-otp error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    if (!requireRole(req, 'admin')) return unauthorized();
    await ensureTable();
    const result = await pool.query(
      `SELECT id, name, email, phone, address, site_image_url, site_image_name,
              estimate, verified, created_at, verified_at
       FROM calculator_quote_otps
       ORDER BY created_at DESC`
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('calculator-quote-otp GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
