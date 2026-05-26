import pool from '@/lib/db';
import { NextResponse } from 'next/server';

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

    if (!professional_id || !enquirer_name || !enquirer_email || !message) {
      return NextResponse.json(
        { error: 'professional_id, enquirer_name, enquirer_email and message are required' },
        { status: 400 }
      );
    }

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
        enquirer_name,
        enquirer_email,
        enquirer_phone || null,
        message,
      ]
    );

    // Email the professional (non-blocking)
    try {
      const { sendMail } = await import('@/lib/email');
      await sendMail({
        to: professional.email,
        subject: `New Enquiry from ${enquirer_name} — MT Boss`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;
                      background:#fff;border-radius:8px;border:1px solid #e5e7eb">
            <h2 style="color:#111;margin-bottom:4px;">New Enquiry on MT Boss</h2>
            <p style="color:#6b7280;font-size:13px;margin-bottom:20px;">
              Someone is interested in your services — ${new Date().toLocaleString('en-IN')}
            </p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              ${[
                ['From', enquirer_name],
                ['Email', enquirer_email],
                ['Phone', enquirer_phone || '—'],
              ].map(([k, v]) =>
                `<tr>
                  <td style="padding:6px 0;color:#6b7280;width:80px;">${k}</td>
                  <td style="padding:6px 0;font-weight:600;color:#111;">${v}</td>
                </tr>`
              ).join('')}
            </table>
            <div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:6px;
                        font-size:14px;color:#374151;line-height:1.6;">
              <strong style="display:block;margin-bottom:6px;color:#111;">Message:</strong>
              ${message.replace(/\n/g, '<br/>')}
            </div>
            <p style="margin-top:20px;font-size:12px;color:#9ca3af;">
              This enquiry was sent via MT Boss Professional Services. Reply directly to
              <a href="mailto:${enquirer_email}" style="color:#4f46e5;">${enquirer_email}</a>.
            </p>
          </div>
        `,
      });
    } catch (e) {
      console.warn('Professional enquiry email failed:', e.message);
    }

    return NextResponse.json(
      { success: true, message: 'Enquiry sent successfully! The professional will get back to you.' },
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
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
