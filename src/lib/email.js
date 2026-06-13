// Email utility — configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in .env
// Falls back to console.log if not configured.

export async function sendMail({ to, subject, html }) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || 'noreply@mtboss.in';

  if (!host || !user || !pass) {
    console.log(`[EMAIL — not configured] To: ${to} | Subject: ${subject}`);
    return;
  }

  // Dynamic import so build doesn't fail if nodemailer isn't installed
  try {
    const nodemailer = (await import('nodemailer')).default;
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    await transporter.sendMail({ from, to, subject, html });
    console.log(`[EMAIL sent] To: ${to} | Subject: ${subject}`);
  } catch (err) {
    console.warn(`[EMAIL failed] ${err.message}`);
    throw err;
  }
}

export async function sendEnquiryAcceptedEmail({ to, userName, shopName, categoryName, phone }) {
  await sendMail({
    to,
    subject: `Your ${categoryName} enquiry has been accepted — MTBoss`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fff;border-radius:8px;">
        <h2 style="color:#111;margin-bottom:8px;">Great news, ${userName}! 🎉</h2>
        <p style="color:#555;line-height:1.6;">
          Your enquiry for <strong>${categoryName}</strong> has been accepted by
          <strong>${shopName}</strong>.
        </p>
        <p style="color:#555;line-height:1.6;">
          The supplier will contact you shortly on <strong>${phone}</strong> to discuss
          delivery details, pricing, and schedule.
        </p>
        <div style="background:#f5f5f5;border-radius:6px;padding:16px;margin:20px 0;">
          <p style="margin:0;font-size:13px;color:#333;font-weight:600;">What happens next?</p>
          <ol style="margin:8px 0 0;padding-left:20px;color:#555;font-size:13px;line-height:1.8;">
            <li>Supplier calls you to confirm quantity &amp; delivery address</li>
            <li>Materials are dispatched to your location</li>
            <li>You confirm receipt of materials</li>
          </ol>
        </div>
        <p style="color:#999;font-size:12px;margin-top:24px;">
          — MTbossMaterial Marketplace
        </p>
      </div>
    `,
  });
}
