import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireRole, unauthorized } from '@/lib/auth';
import { cleanText, normalizePhone, validateContactFields } from '@/lib/validation';

// Tables are guaranteed to exist by professional-services route (same ensureTables),
// but guard here too so this route works standalone.
let ready = false;
async function ensureTable() {
  if (ready) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS professional_enquiries (
      id                 SERIAL PRIMARY KEY,
      professional_id    INTEGER,
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
  ready = true;
}

// POST — anyone can send an enquiry to a professional
export async function POST(req) {
  await ensureTable();
  try {
    const {
      professional_id,
      enquirer_name,
      enquirer_email,
      enquirer_phone,
      message,
    } = await req.json();
    const cleanName = cleanText(enquirer_name);
    const cleanEmail = cleanText(enquirer_email).toLowerCase();
    const cleanPhone = enquirer_phone ? normalizePhone(enquirer_phone) : null;

    if (!professional_id || !cleanName || !cleanEmail || !message) {
      return NextResponse.json(
        { error: 'professional_id, enquirer_name, enquirer_email and message are required' },
        { status: 400 }
      );
    }
    const contactError = validateContactFields({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || undefined,
      phoneRequired: false,
      nameLabel: 'Enquirer name',
    });
    if (contactError) return NextResponse.json({ error: contactError }, { status: 400 });

    // Fetch professional's email & name
    const proResult = await pool.query(
      `SELECT id, name, email, title FROM professional_services WHERE id = $1 AND status = 'approved'`,
      [professional_id]
    );
    if (proResult.rows.length === 0) {
      return NextResponse.json({ error: 'Professional not found or not approved' }, { status: 404 });
    }
    const professional = proResult.rows[0];

    // Save enquiry
    await pool.query(
      `INSERT INTO professional_enquiries
        (professional_id, professional_name, professional_email,
         enquirer_name, enquirer_email, enquirer_phone, message, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())`,
      [
        professional_id,
        professional.name,
        professional.email,
        cleanName,
        cleanEmail,
        cleanPhone,
        message,
      ]
    );

    // Email the ADMIN (admin acts as middleman — client never contacts professional directly)
    try {
      const { sendMail } = await import('@/lib/email');
      const adminEmail = process.env.SMTP_USER || 'mtboss2016@gmail.com';
      await sendMail({
        to: adminEmail,
        subject: `Professional Enquiry: ${enquirer_name} → ${professional.name} — MTBoss`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;
                      background:#fff;border-radius:8px;border:1px solid #e5e7eb">
            <h2 style="color:#111;margin-bottom:4px;">New Professional Enquiry</h2>
            <p style="color:#6b7280;font-size:13px;margin-bottom:20px;">
              A user has enquired about a professional — ${new Date().toLocaleString('en-IN')}
            </p>

            <h3 style="color:#f6b400;font-size:13px;font-weight:700;text-transform:uppercase;
                       letter-spacing:0.06em;margin:0 0 8px;">Professional Requested</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
              ${[
                ['Name', professional.name],
                ['Title', professional.title || '—'],
                ['ID', professional.id],
              ].map(([k, v]) =>
                `<tr>
                  <td style="padding:6px 0;color:#6b7280;width:90px;">${k}</td>
                  <td style="padding:6px 0;font-weight:600;color:#111;">${v}</td>
                </tr>`
              ).join('')}
            </table>

            <h3 style="color:#f6b400;font-size:13px;font-weight:700;text-transform:uppercase;
                       letter-spacing:0.06em;margin:0 0 8px;">Enquirer Details</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
              ${[
                ['Name',  enquirer_name],
                ['Email', enquirer_email],
                ['Phone', enquirer_phone || '—'],
              ].map(([k, v]) =>
                `<tr>
                  <td style="padding:6px 0;color:#6b7280;width:90px;">${k}</td>
                  <td style="padding:6px 0;font-weight:600;color:#111;">${v}</td>
                </tr>`
              ).join('')}
            </table>

            <h3 style="color:#f6b400;font-size:13px;font-weight:700;text-transform:uppercase;
                       letter-spacing:0.06em;margin:0 0 8px;">Message</h3>
            <div style="padding:16px;background:#f9fafb;border-radius:6px;
                        font-size:14px;color:#374151;line-height:1.6;">
              ${message.replace(/\n/g, '<br/>')}
            </div>

            <p style="margin-top:20px;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:16px;">
              Action required: Review this enquiry in the
              <strong>MTbossAdmin Dashboard → Professional Enquiries</strong> tab and
              facilitate the connection between the user and professional.
            </p>
          </div>
        `,
      });
    } catch (e) {
      console.warn('Professional enquiry email failed:', e.message);
    }

    return NextResponse.json(
      { success: true, message: 'Enquiry submitted! Our team will review and connect you shortly.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST professional-enquiries error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET — admin can list enquiries (optionally filter by professional_id)
export async function GET(req) {
  await ensureTable();
  try {
    if (!requireRole(req, 'admin')) return unauthorized();

    const { searchParams } = new URL(req.url);
    const proId = searchParams.get('professional_id');

    const result = proId
      ? await pool.query(
          `SELECT * FROM professional_enquiries WHERE professional_id=$1 ORDER BY created_at DESC`,
          [proId]
        )
      : await pool.query(
          `SELECT * FROM professional_enquiries ORDER BY created_at DESC`
        );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('GET professional-enquiries error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
