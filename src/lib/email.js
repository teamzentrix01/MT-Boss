// Email utility — configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in .env
// Falls back to console.log if not configured.

export async function sendMail({ to, subject, html, text, replyTo }) {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || user || 'noreply@mtboss.in';
  const configuredReplyTo = replyTo || process.env.SMTP_REPLY_TO || user;

  if (!host || !user || !pass) {
    console.log(`[EMAIL — not configured] To: ${to} | Subject: ${subject}`);
    return;
  }

  const nodemailer = (await import('nodemailer')).default;
  const ports = [port];
  if (/gmail\.com$/i.test(host) && port === 587) ports.push(465);
  if (/gmail\.com$/i.test(host) && port === 465) ports.push(587);

  let lastError;
  for (const candidatePort of ports) {
    const transporter = nodemailer.createTransport({
      host,
      port: candidatePort,
      secure: candidatePort === 465,
      requireTLS: candidatePort !== 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });

    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        replyTo: configuredReplyTo,
        // Keep the SMTP envelope aligned with the authenticated sender. This
        // avoids SPF failures when SMTP_FROM is a display name or alias.
        envelope: { from: user, to },
      });
      if (!info.accepted?.length || info.rejected?.length) {
        throw new Error(`SMTP did not accept the recipient (${info.response || 'no response'})`);
      }
      console.log(`[EMAIL sent] To: ${to} | Subject: ${subject} | Message-ID: ${info.messageId} | Port: ${candidatePort}`);
      transporter.close();
      return info;
    } catch (error) {
      transporter.close();
      lastError = error;
      const retryable = ['ETIMEDOUT', 'ECONNECTION', 'ESOCKET', 'ECONNRESET', 'EHOSTUNREACH'].includes(error.code);
      if (!retryable || candidatePort === ports.at(-1)) break;
      console.warn(`[EMAIL retry] SMTP port ${candidatePort} failed (${error.code}); trying alternate Gmail port.`);
    }
  }

  console.warn(`[EMAIL failed] ${lastError?.message || 'Unknown SMTP error'}`);
  throw lastError || new Error('Email delivery failed');
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
