import { sendMail } from '@/lib/email';

const companyName = process.env.COMPANY_NAME || 'MTBOSS Construction';
const companyPhone = process.env.COMPANY_PHONE || process.env.NEXT_PUBLIC_COMPANY_PHONE || '';
const appUrl = String(process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
const logoUrl = process.env.COMPANY_LOGO_URL || (appUrl ? `${appUrl}/logo.png` : '');

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function indianPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function money(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value || 0));
}

async function sendWhatsApp({ to, text }) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = indianPhone(to);
  if (!token || !phoneNumberId || !recipient) return { skipped: true };

  const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to: recipient, type: 'text', text: { preview_url: false, body: text } }),
  });
  if (!response.ok) throw new Error(`WhatsApp delivery failed (${response.status}): ${await response.text()}`);
  return response.json();
}

function invoiceHtml(invoice) {
  const rows = [
    ['Customer', invoice.customerName], ['Email', invoice.email], ['Mobile', invoice.phone],
    ['Service / Plan', invoice.service], ['Reference', invoice.reference],
    ['Payment ID', invoice.paymentId], ['Payment method', invoice.paymentMethod || 'PayU'],
  ].filter(([, value]) => value);
  return `<!doctype html><html><body style="margin:0;background:#f3f4f6;padding:24px;font-family:Arial,sans-serif;color:#111827">
    <div style="max-width:680px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px #00000012">
      <div style="background:#0b1220;color:#fff;padding:28px;display:flex;align-items:center;justify-content:space-between">
        <div><div style="font-size:12px;letter-spacing:2px;color:#60a5fa">PAYMENT RECEIPT</div><h1 style="margin:8px 0 0;font-size:26px">${escapeHtml(companyName)}</h1></div>
        ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(companyName)}" width="72" style="max-height:60px;object-fit:contain;background:#fff;border-radius:10px;padding:4px">` : ''}
      </div>
      <div style="padding:30px"><div style="display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid #e5e7eb;padding-bottom:22px;margin-bottom:22px">
        <div><div style="font-size:12px;color:#6b7280">INVOICE NUMBER</div><strong>${escapeHtml(invoice.invoiceNumber)}</strong><div style="font-size:13px;color:#6b7280;margin-top:6px">${escapeHtml(invoice.date)}</div></div>
        <div style="text-align:right"><div style="font-size:12px;color:#6b7280">AMOUNT PAID</div><div style="font-size:27px;font-weight:800;color:#16a34a">${money(invoice.amount)}</div><span style="font-size:11px;background:#dcfce7;color:#166534;border-radius:20px;padding:4px 9px">PAID</span></div>
      </div>
      <table style="width:100%;border-collapse:collapse">${rows.map(([key, value]) => `<tr><td style="padding:9px 0;color:#6b7280;font-size:13px;width:38%">${escapeHtml(key)}</td><td style="padding:9px 0;font-size:13px;font-weight:600">${escapeHtml(value)}</td></tr>`).join('')}</table>
      <div style="margin-top:24px;padding:16px;background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px;font-size:13px;line-height:1.6">Thank you for choosing ${escapeHtml(companyName)}. Please keep this receipt for your records.</div>
      </div><div style="padding:18px 30px;background:#f9fafb;color:#6b7280;font-size:12px">${escapeHtml(companyName)}${companyPhone ? ` · ${escapeHtml(companyPhone)}` : ''}</div>
    </div></body></html>`;
}

export async function deliverPaymentInvoice(details) {
  const invoice = {
    ...details,
    invoiceNumber: details.invoiceNumber || `MTB-${String(details.reference || Date.now()).replace(/\W/g, '').slice(-18)}`,
    date: details.date || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };
  const jobs = [];
  if (invoice.email) jobs.push(sendMail({
    to: invoice.email,
    subject: `Payment receipt ${invoice.invoiceNumber} - ${companyName}`,
    html: invoiceHtml(invoice),
    text: `${companyName}\nPayment receipt ${invoice.invoiceNumber}\n${invoice.service}\nAmount paid: ${money(invoice.amount)}\nReference: ${invoice.reference}`,
  }));
  if (invoice.phone) jobs.push(sendWhatsApp({
    to: invoice.phone,
    text: `*${companyName} - Payment Receipt*\n\nInvoice: ${invoice.invoiceNumber}\nCustomer: ${invoice.customerName || '-'}\nService: ${invoice.service || '-'}\nAmount paid: ${money(invoice.amount)}\nReference: ${invoice.reference || '-'}\nPayment ID: ${invoice.paymentId || '-'}\nStatus: PAID\n\nThank you for choosing ${companyName}.`,
  }));
  const results = await Promise.allSettled(jobs);
  results.filter((item) => item.status === 'rejected').forEach((item) => console.error('Invoice delivery error:', item.reason));
  return results;
}

export async function notifyAdminSubmission({ type, name, phone, email, reference, details = {} }) {
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const detailLines = Object.entries(details).filter(([, value]) => value !== undefined && value !== null && value !== '').slice(0, 12).map(([key, value]) => `${key}: ${value}`);
  const plainText = `New ${type} - ${companyName}\n\nName: ${name || '-'}\nPhone: ${phone || '-'}\nEmail: ${email || '-'}\nReference: ${reference || '-'}${detailLines.length ? `\n${detailLines.join('\n')}` : ''}\n\nReceived: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
  const jobs = [];
  if (adminEmail) jobs.push(sendMail({
    to: adminEmail,
    subject: `New ${type}: ${reference || name || 'MTBOSS notification'}`,
    text: plainText,
    replyTo: email || undefined,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden"><div style="background:#111827;color:white;padding:22px"><div style="font-size:12px;color:#60a5fa;letter-spacing:1.5px">NEW WEBSITE ACTIVITY</div><h2 style="margin:7px 0 0">${escapeHtml(type)}</h2></div><div style="padding:24px"><table style="width:100%;border-collapse:collapse">${[['Name', name], ['Phone', phone], ['Email', email], ['Reference', reference], ...Object.entries(details)].filter(([, value]) => value !== undefined && value !== null && value !== '').map(([key, value]) => `<tr><td style="padding:8px;color:#6b7280;width:35%">${escapeHtml(key)}</td><td style="padding:8px;font-weight:600">${escapeHtml(value)}</td></tr>`).join('')}</table></div></div>`,
  }));
  if (adminPhone) jobs.push(sendWhatsApp({
      to: adminPhone,
      text: `*${plainText}*`,
    }));
  const results = await Promise.allSettled(jobs);
  results.filter((item) => item.status === 'rejected').forEach((item) => console.error('Admin notification error:', item.reason));
  return results.length ? results : [{ status: 'skipped' }];
}
