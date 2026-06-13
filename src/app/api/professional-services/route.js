import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';

// ── Auto-create tables on first request ─────────────────────────────────────
let tablesReady = false;
async function ensureTables() {
  if (tablesReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS professional_services (
      id               SERIAL PRIMARY KEY,
      name             VARCHAR(200) NOT NULL,
      title            VARCHAR(200) NOT NULL,
      category         VARCHAR(100) NOT NULL,
      profile_picture  TEXT,
      experience       INTEGER DEFAULT 0,
      description      TEXT,
      specializations  JSONB DEFAULT '[]',
      portfolio_images JSONB DEFAULT '[]',
      certifications   TEXT,
      city             VARCHAR(100),
      phone            VARCHAR(20),
      email            VARCHAR(200) NOT NULL,
      website          VARCHAR(300),
      instagram        VARCHAR(200),
      linkedin         VARCHAR(200),
      status           VARCHAR(20) DEFAULT 'pending'
                         CHECK (status IN ('pending','approved','rejected')),
      sort_order       INTEGER DEFAULT 0,
      created_at       TIMESTAMP DEFAULT NOW(),
      updated_at       TIMESTAMP DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS professional_enquiries (
      id                 SERIAL PRIMARY KEY,
      professional_id    INTEGER REFERENCES professional_services(id) ON DELETE CASCADE,
      professional_name  VARCHAR(200),
      professional_email VARCHAR(200),
      enquirer_name      VARCHAR(200) NOT NULL,
      enquirer_email     VARCHAR(200) NOT NULL,
      enquirer_phone     VARCHAR(20),
      message            TEXT NOT NULL,
      is_read            BOOLEAN DEFAULT FALSE,
      created_at         TIMESTAMP DEFAULT NOW()
    )
  `);
  tablesReady = true;
}

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req) {
  try {
    await ensureTables();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const idParam = searchParams.get('id');

    // Single professional by ID (public profile page)
    if (idParam) {
      const result = await pool.query(
        `SELECT * FROM professional_services WHERE id = $1 AND status = 'approved'`,
        [idParam]
      );
      if (result.rows.length === 0)
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: result.rows[0] });
    }

    if (isAdmin) {
      if (!requireRole(req, 'admin')) return unauthorized();
      const result = await pool.query(`
        SELECT * FROM professional_services
        ORDER BY
          CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END ASC,
          COALESCE(sort_order, 0) ASC,
          created_at DESC
      `);
      return NextResponse.json({ success: true, data: result.rows });
    }

    // Public — approved only
    const result = await pool.query(`
      SELECT * FROM professional_services
      WHERE status = 'approved'
      ORDER BY COALESCE(sort_order, 0) ASC, id ASC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET professionals error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    await ensureTables();
    const {
      name, title, category, profile_picture, experience,
      description, specializations, portfolio_images,
      certifications, city, phone, email,
      website, instagram, linkedin,
    } = await req.json();

    if (!name || !title || !category || !email || !phone || !city || !description) {
      return NextResponse.json(
        { error: 'Name, title, category, email, phone, city and description are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO professional_services
        (name, title, category, profile_picture, experience, description,
         specializations, portfolio_images, certifications, city, phone, email,
         website, instagram, linkedin, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'pending',NOW(),NOW())
       RETURNING id, name, title`,
      [
        name, title, category,
        profile_picture || null,
        parseInt(experience) || 0,
        description,
        JSON.stringify(Array.isArray(specializations) ? specializations : []),
        JSON.stringify(Array.isArray(portfolio_images) ? portfolio_images : []),
        certifications || null,
        city, phone, email,
        website || null, instagram || null, linkedin || null,
      ]
    );

    // Notify admin via email (non-blocking)
    try {
      const { sendMail } = await import('@/lib/email');
      const adminEmail = process.env.SMTP_USER || process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await sendMail({
          to: adminEmail,
          subject: `New Professional Application — ${name} (${title})`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fff;border-radius:8px;border:1px solid #e5e7eb">
              <h2 style="color:#111;margin-bottom:4px;">New Professional Application</h2>
              <p style="color:#6b7280;font-size:13px;margin-bottom:20px;">Submitted on ${new Date().toLocaleString('en-IN')}</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                ${[['Name',name],['Title',title],['Category',category],['City',city],['Phone',phone],['Email',email],['Experience',`${experience} years`]].map(
                  ([k,v]) => `<tr><td style="padding:6px 0;color:#6b7280;width:110px;">${k}</td><td style="padding:6px 0;font-weight:600;color:#111;">${v}</td></tr>`
                ).join('')}
              </table>
              <p style="margin-top:20px;font-size:13px;color:#374151;"><strong>Bio:</strong> ${description}</p>
              <p style="margin-top:16px;font-size:13px;color:#6b7280;">Log in to admin dashboard → Professional Services tab to review and approve.</p>
            </div>
          `,
        });
      }
    } catch (e) {
      console.warn('Admin notification email failed:', e.message);
    }

    return NextResponse.json(
      { success: true, message: 'Application submitted! We will review and get back to you.', data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST professional error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── PUT ──────────────────────────────────────────────────────────────────────
export async function PUT(req) {
  try {
    await ensureTables();
    if (!requireRole(req, 'admin')) return unauthorized();

    const { id, status, ...fields } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // Status-only update (approve / reject)
    if (status && Object.keys(fields).length === 0) {
      const result = await pool.query(
        `UPDATE professional_services SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
        [status, id]
      );
      if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: result.rows[0] });
    }

    // Full update
    const {
      name, title, category, profile_picture, experience, description,
      specializations, portfolio_images, certifications,
      city, phone, email, website, instagram, linkedin,
    } = fields;

    const result = await pool.query(
      `UPDATE professional_services SET
        name=$1, title=$2, category=$3, profile_picture=$4, experience=$5, description=$6,
        specializations=$7, portfolio_images=$8, certifications=$9,
        city=$10, phone=$11, email=$12, website=$13, instagram=$14, linkedin=$15,
        status=COALESCE($16, status), updated_at=NOW()
       WHERE id=$17 RETURNING *`,
      [
        name, title, category, profile_picture || null, parseInt(experience) || 0, description,
        JSON.stringify(Array.isArray(specializations) ? specializations : []),
        JSON.stringify(Array.isArray(portfolio_images) ? portfolio_images : []),
        certifications || null, city, phone, email,
        website || null, instagram || null, linkedin || null,
        status || null, id,
      ]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('PUT professional error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── PATCH ────────────────────────────────────────────────────────────────────
export async function PATCH(req) {
  try {
    await ensureTables();
    if (!requireRole(req, 'admin')) return unauthorized();

    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: 'items array required' }, { status: 400 });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const { id, sort_order } of items) {
        await client.query(
          `UPDATE professional_services SET sort_order=$1 WHERE id=$2`,
          [sort_order, id]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH professionals error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(req) {
  try {
    await ensureTables();
    if (!requireRole(req, 'admin')) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const result = await pool.query(
      `DELETE FROM professional_services WHERE id=$1 RETURNING id`, [id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE professional error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
