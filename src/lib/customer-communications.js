import { sendMail } from '@/lib/email';

const companyName = process.env.COMPANY_NAME || 'MTBOSS Construction';
const companyPhone = process.env.COMPANY_PHONE || process.env.NEXT_PUBLIC_COMPANY_PHONE || '+91 9458410866';
const appUrl = String(process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
const isLocal = !appUrl || appUrl.includes('localhost') || appUrl.includes('127.0.0.1');
const logoUrl = process.env.COMPANY_LOGO_URL || (!isLocal ? `${appUrl}/logo.png` : 'https://mtboss.in/logo.png');


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

export async function deliverCalculatorEstimate({ email, customerName, phone, project = {}, totals = {}, reference }) {
  if (!email) return [{ status: 'skipped' }];

  const refNumber = reference || `EST-${Date.now().toString().slice(-8)}`;
  const rows = [
    ['Customer Name', customerName],
    ['Phone', phone],
    ['City / Location', project.city || 'India'],
    ['Built-up Area', project.propertySize || project.area ? `${project.propertySize || project.area} sqft` : ''],
    ['Total Floors', project.floors || '1'],
    ['Package / Quality', project.quality || 'Standard'],
    ['Foundation', project.foundation || 'Standard RCC'],
    ['Estimate Reference', refNumber],
  ].filter(([, value]) => value);

  const grandTotal = totals.grandTotal || totals.total || 0;
  const html = `<!doctype html><html><body style="margin:0;background:#f3f4f6;padding:24px;font-family:Arial,sans-serif;color:#111827">
    <div style="max-width:680px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px #00000012">
      <div style="background:#0b1220;color:#fff;padding:28px;display:flex;align-items:center;justify-content:space-between">
        <div><div style="font-size:12px;letter-spacing:2px;color:#60a5fa">CONSTRUCTION ESTIMATE &amp; QUOTE</div><h1 style="margin:8px 0 0;font-size:24px">${escapeHtml(companyName)}</h1></div>
        ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(companyName)}" width="72" style="max-height:60px;object-fit:contain;background:#fff;border-radius:10px;padding:4px">` : ''}
      </div>
      <div style="padding:30px">
        <div style="display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid #e5e7eb;padding-bottom:22px;margin-bottom:22px">
          <div><div style="font-size:12px;color:#6b7280">ESTIMATE ID</div><strong>${escapeHtml(refNumber)}</strong><div style="font-size:13px;color:#6b7280;margin-top:6px">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div></div>
          <div style="text-align:right"><div style="font-size:12px;color:#6b7280">ESTIMATED BUDGET</div><div style="font-size:26px;font-weight:800;color:#2563eb">${money(grandTotal)}</div><span style="font-size:11px;background:#dbeafe;color:#1e40af;border-radius:20px;padding:4px 9px">ESTIMATE</span></div>
        </div>
        <table style="width:100%;border-collapse:collapse">${rows.map(([key, value]) => `<tr><td style="padding:9px 0;color:#6b7280;font-size:13px;width:38%">${escapeHtml(key)}</td><td style="padding:9px 0;font-size:13px;font-weight:600">${escapeHtml(value)}</td></tr>`).join('')}</table>
        <div style="margin-top:24px;padding:16px;background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px;font-size:13px;line-height:1.6">
          This estimate is generated by MTBOSS Construction Calculator. Our project engineering team will review your specifications and contact you to schedule an on-site consultation.
        </div>
      </div>
      <div style="padding:18px 30px;background:#f9fafb;color:#6b7280;font-size:12px">${escapeHtml(companyName)}${companyPhone ? ` · ${escapeHtml(companyPhone)}` : ''}</div>
    </div></body></html>`;

  return Promise.allSettled([
    sendMail({
      to: email,
      subject: `Construction Estimate ${refNumber} - ${companyName}`,
      html,
      text: `${companyName}\nConstruction Estimate ${refNumber}\nTotal: ${money(grandTotal)}\nThank you for choosing ${companyName}.`,
    }),
  ]);
}

export async function deliverMaterialOrderReceipt({ email, customerName, phone, category, material, quantity, unit, city, orderReference, deliveryAddress }) {
  if (!email) return [{ status: 'skipped' }];
  const rows = [
    ['Customer Name', customerName],
    ['Phone', phone],
    ['Category', category],
    ['Material Type', material],
    ['Quantity & Unit', `${quantity || ''} ${unit || ''}`.trim()],
    ['Delivery City', city],
    ['Delivery Address', deliveryAddress],
    ['Order Reference', orderReference],
  ].filter(([, value]) => value);

  const html = `<!doctype html><html><body style="margin:0;background:#f3f4f6;padding:24px;font-family:Arial,sans-serif;color:#111827">
    <div style="max-width:680px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px #00000012">
      <div style="background:#0b1220;color:#fff;padding:28px;display:flex;align-items:center;justify-content:space-between">
        <div><div style="font-size:12px;letter-spacing:2px;color:#60a5fa">MATERIAL ORDER RECEIPT</div><h1 style="margin:8px 0 0;font-size:24px">${escapeHtml(companyName)}</h1></div>
        ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(companyName)}" width="72" style="max-height:60px;object-fit:contain;background:#fff;border-radius:10px;padding:4px">` : ''}
      </div>
      <div style="padding:30px">
        <div style="border-bottom:1px solid #e5e7eb;padding-bottom:18px;margin-bottom:18px">
          <div style="font-size:12px;color:#6b7280">ORDER REFERENCE</div><strong>${escapeHtml(orderReference)}</strong>
        </div>
        <table style="width:100%;border-collapse:collapse">${rows.map(([key, value]) => `<tr><td style="padding:9px 0;color:#6b7280;font-size:13px;width:38%">${escapeHtml(key)}</td><td style="padding:9px 0;font-size:13px;font-weight:600">${escapeHtml(value)}</td></tr>`).join('')}</table>
        <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-left:4px solid #16a34a;border-radius:6px;font-size:13px;line-height:1.6;color:#166534">
          Your material enquiry has been recorded. Verified suppliers will connect with you shortly for delivery scheduling.
        </div>
      </div>
      <div style="padding:18px 30px;background:#f9fafb;color:#6b7280;font-size:12px">${escapeHtml(companyName)}${companyPhone ? ` · ${escapeHtml(companyPhone)}` : ''}</div>
    </div></body></html>`;

  return Promise.allSettled([
    sendMail({
      to: email,
      subject: `Material Order Confirmation ${orderReference} - ${companyName}`,
      html,
      text: `${companyName}\nMaterial Order ${orderReference}\nCategory: ${category}\nQuantity: ${quantity} ${unit}`,
    }),
  ]);
}

export async function deliverContactAcknowledgement({ email, name, subject, reference }) {
  if (!email) return [{ status: 'skipped' }];
  const html = `<!doctype html><html><body style="margin:0;background:#f3f4f6;padding:24px;font-family:Arial,sans-serif;color:#111827">
    <div style="max-width:640px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px #00000012">
      <div style="background:#0b1220;color:#fff;padding:24px;display:flex;align-items:center;justify-content:space-between">
        <div><div style="font-size:12px;letter-spacing:2px;color:#60a5fa">MESSAGE RECEIVED</div><h2 style="margin:6px 0 0">${escapeHtml(companyName)}</h2></div>
        ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(companyName)}" width="64" style="max-height:50px;object-fit:contain;background:#fff;border-radius:8px;padding:4px">` : ''}
      </div>
      <div style="padding:28px">
        <p style="font-size:15px;margin-top:0">Hello <strong>${escapeHtml(name)}</strong>,</p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563">Thank you for reaching out to us regarding <strong>${escapeHtml(subject)}</strong>. We have received your message and our team will get back to you within 24 business hours.</p>
        ${reference ? `<div style="background:#f3f4f6;padding:12px 16px;border-radius:8px;font-size:13px;margin:20px 0;color:#374151"><strong>Reference ID:</strong> ${escapeHtml(reference)}</div>` : ''}
        <p style="font-size:13px;color:#6b7280;margin-bottom:0">Best regards,<br>${escapeHtml(companyName)} Team</p>
      </div>
      <div style="padding:16px 28px;background:#f9fafb;color:#6b7280;font-size:12px">${escapeHtml(companyName)}${companyPhone ? ` · ${escapeHtml(companyPhone)}` : ''}</div>
    </div></body></html>`;

  return Promise.allSettled([
    sendMail({
      to: email,
      subject: `We have received your message: ${subject} - ${companyName}`,
      html,
      text: `Hello ${name},\n\nThank you for reaching out to ${companyName}. We have received your inquiry and will respond within 24 hours.\n\nBest regards,\n${companyName}`,
    }),
  ]);
}

export async function deliverReviewConfirmation({ email, name, rating, service }) {
  if (!email) return [{ status: 'skipped' }];
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const html = `<!doctype html><html><body style="margin:0;background:#f3f4f6;padding:24px;font-family:Arial,sans-serif;color:#111827">
    <div style="max-width:640px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px #00000012">
      <div style="background:#0b1220;color:#fff;padding:24px;display:flex;align-items:center;justify-content:space-between">
        <div><div style="font-size:12px;letter-spacing:2px;color:#60a5fa">REVIEW RECEIVED</div><h2 style="margin:6px 0 0">${escapeHtml(companyName)}</h2></div>
        ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(companyName)}" width="64" style="max-height:50px;object-fit:contain;background:#fff;border-radius:8px;padding:4px">` : ''}
      </div>
      <div style="padding:28px">
        <p style="font-size:15px;margin-top:0">Thank you, <strong>${escapeHtml(name)}</strong>!</p>
        <p style="font-size:14px;line-height:1.6;color:#4b5563">We appreciate your feedback for our <strong>${escapeHtml(service)}</strong> services.</p>
        <div style="background:#fef3c7;border:1px solid #fde68a;padding:14px 18px;border-radius:8px;font-size:16px;margin:20px 0;color:#92400e;font-weight:bold">
          Your Rating: <span style="font-size:20px;letter-spacing:2px;color:#d97706">${stars}</span> (${rating}/5)
        </div>
        <p style="font-size:14px;line-height:1.6;color:#4b5563">Your review helps us continuously improve our standards and deliver quality construction and home services across India.</p>
        <p style="font-size:13px;color:#6b7280;margin-bottom:0">Warm regards,<br>${escapeHtml(companyName)}</p>
      </div>
      <div style="padding:16px 28px;background:#f9fafb;color:#6b7280;font-size:12px">${escapeHtml(companyName)}${companyPhone ? ` · ${escapeHtml(companyPhone)}` : ''}</div>
    </div></body></html>`;

  return Promise.allSettled([
    sendMail({
      to: email,
      subject: `Thank you for reviewing MTBoss! ⭐`,
      html,
      text: `Hello ${name},\n\nThank you for reviewing ${service} on ${companyName}. Your rating: ${rating}/5.\n\nWarm regards,\n${companyName}`,
    }),
  ]);
}



export async function notifyAdminSubmission({ type, name, phone, email, reference, details = {} }) {
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'mtboss2016@gmail.com';
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

export async function deliverPropertyEnquiryNotification({ enquiry, property, owner }) {
  const jobs = [];
  const listingLabel = (property.listing_type || '').toLowerCase() === 'rent' ? 'Rent' : 'Sell / Buy';

  // 1. Notify Property Owner (if owner email exists)
  if (owner?.email) {
    const ownerSubject = `New Customer Inquiry for your ${listingLabel} Property: ${property.title} - ${companyName}`;
    const cleanEnquirerPhone = String(enquiry.phone || '').replace(/\D/g, '');
    const waLink = cleanEnquirerPhone ? `https://wa.me/91${cleanEnquirerPhone.slice(-10)}?text=${encodeURIComponent(`Hello ${enquiry.name || ''}, regarding your inquiry for ${property.title} on MTBoss...`)}` : '';
    const telLink = cleanEnquirerPhone ? `tel:+91${cleanEnquirerPhone.slice(-10)}` : '';

    const ownerHtml = `<!doctype html><html><body style="margin:0;background:#f3f4f6;padding:24px;font-family:Arial,sans-serif;color:#111827">
      <div style="max-width:640px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px #00000012">
        <div style="background:#0b1220;color:#fff;padding:24px;display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-size:11px;letter-spacing:1.5px;color:#38bdf8;text-transform:uppercase;font-weight:bold">NEW PROPERTY INQUIRY</div>
            <h2 style="margin:6px 0 0;font-size:22px">${escapeHtml(companyName)}</h2>
          </div>
          ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(companyName)}" width="64" style="max-height:50px;object-fit:contain;background:#fff;border-radius:8px;padding:4px">` : ''}
        </div>
        <div style="padding:28px">
          <p style="font-size:15px;margin-top:0">Dear <strong>${escapeHtml(owner.name || 'Property Owner')}</strong>,</p>
          <p style="font-size:14px;line-height:1.6;color:#4b5563">
            A customer has submitted an inquiry for your listed property (<strong>${escapeHtml(listingLabel)}</strong>):
          </p>

          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #2196f3;padding:16px;border-radius:8px;margin:18px 0">
            <h3 style="margin:0 0 6px;font-size:16px;color:#0f172a">${escapeHtml(property.title)}</h3>
            <p style="margin:0;font-size:13px;color:#64748b">
              📍 ${escapeHtml(property.location || '-')}${property.price ? ` &nbsp;•&nbsp; 💰 <strong>₹${escapeHtml(property.price)}</strong>` : ''}
            </p>
          </div>

          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:18px;margin-bottom:22px">
            <div style="font-size:12px;font-weight:bold;color:#6b7280;letter-spacing:1px;margin-bottom:12px;text-transform:uppercase">Customer Lead Details</div>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:7px 0;color:#6b7280;font-size:13px;width:35%">Customer Name:</td><td style="padding:7px 0;font-size:13px;font-weight:bold;color:#111827">${escapeHtml(enquiry.name)}</td></tr>
              <tr><td style="padding:7px 0;color:#6b7280;font-size:13px">Phone Number:</td><td style="padding:7px 0;font-size:13px;font-weight:bold;color:#111827">${escapeHtml(enquiry.phone)}</td></tr>
              ${enquiry.email ? `<tr><td style="padding:7px 0;color:#6b7280;font-size:13px">Email Address:</td><td style="padding:7px 0;font-size:13px;font-weight:bold;color:#111827">${escapeHtml(enquiry.email)}</td></tr>` : ''}
              ${enquiry.message ? `<tr><td style="padding:7px 0;color:#6b7280;font-size:13px;vertical-align:top">Message:</td><td style="padding:7px 0;font-size:13px;color:#374151;white-space:pre-wrap">${escapeHtml(enquiry.message)}</td></tr>` : ''}
              <tr><td style="padding:7px 0;color:#6b7280;font-size:13px">Received On:</td><td style="padding:7px 0;font-size:12px;color:#6b7280">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
            </table>
          </div>

          <div style="margin:24px 0">
            ${telLink ? `<a href="${telLink}" style="display:inline-block;background:#2196f3;color:#000;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:bold;text-decoration:none;margin-right:10px;margin-bottom:10px">📞 Call Customer</a>` : ''}
            ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#22c55e;color:#fff;padding:12px 22px;border-radius:8px;font-size:13px;font-weight:bold;text-decoration:none;margin-bottom:10px">💬 WhatsApp Customer</a>` : ''}
          </div>

          <p style="font-size:13px;color:#6b7280;margin-bottom:0">Best regards,<br>${escapeHtml(companyName)} Property Team</p>
        </div>
        <div style="padding:16px 28px;background:#f9fafb;color:#6b7280;font-size:12px">${escapeHtml(companyName)}${companyPhone ? ` · ${escapeHtml(companyPhone)}` : ''}</div>
      </div></body></html>`;

    jobs.push(sendMail({
      to: owner.email,
      subject: ownerSubject,
      html: ownerHtml,
      text: `Hello ${owner.name || 'Owner'},\n\nNew inquiry for your property: ${property.title}\n\nCustomer: ${enquiry.name}\nPhone: ${enquiry.phone}\nEmail: ${enquiry.email || '-'}\nMessage: ${enquiry.message || '-'}\n\nReceived: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
      replyTo: enquiry.email || undefined,
    }));
  }

  // 2. WhatsApp to Property Owner (if owner phone exists)
  if (owner?.phone) {
    const ownerWhatsAppText = `*${companyName} - New Property Inquiry*\n\nDear *${owner.name || 'Property Owner'}*,\nYou received an inquiry for your property:\n*${property.title}* (${listingLabel})\n\n*Customer Details:*\n• Name: ${enquiry.name}\n• Phone: ${enquiry.phone}\n• Email: ${enquiry.email || '-'}\n• Message: ${enquiry.message || '-'}\n\nPlease contact the customer at your earliest convenience.`;
    jobs.push(sendWhatsApp({ to: owner.phone, text: ownerWhatsAppText }));
  }

  // 3. Customer Acknowledgment Email (if customer email provided)
  if (enquiry?.email) {
    const customerSubject = `Inquiry Confirmation: ${property.title} - ${companyName}`;
    const customerHtml = `<!doctype html><html><body style="margin:0;background:#f3f4f6;padding:24px;font-family:Arial,sans-serif;color:#111827">
      <div style="max-width:640px;margin:auto;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 8px 30px #00000012">
        <div style="background:#0b1220;color:#fff;padding:24px;display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-size:11px;letter-spacing:1.5px;color:#38bdf8;text-transform:uppercase;font-weight:bold">INQUIRY CONFIRMATION</div>
            <h2 style="margin:6px 0 0;font-size:22px">${escapeHtml(companyName)}</h2>
          </div>
          ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(companyName)}" width="64" style="max-height:50px;object-fit:contain;background:#fff;border-radius:8px;padding:4px">` : ''}
        </div>
        <div style="padding:28px">
          <p style="font-size:15px;margin-top:0">Hello <strong>${escapeHtml(enquiry.name)}</strong>,</p>
          <p style="font-size:14px;line-height:1.6;color:#4b5563">
            Thank you for reaching out! Your inquiry for <strong>${escapeHtml(property.title)}</strong> (<strong>${escapeHtml(listingLabel)}</strong>) has been successfully received and forwarded directly to the property owner and our team.
          </p>

          <!-- Property Card Summary -->
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #2196f3;padding:16px;border-radius:8px;margin:18px 0">
            <h3 style="margin:0 0 6px;font-size:16px;color:#0f172a">${escapeHtml(property.title)}</h3>
            <p style="margin:0;font-size:13px;color:#64748b">
              📍 ${escapeHtml(property.location || '-')}${property.price ? ` &nbsp;•&nbsp; 💰 <strong>₹${escapeHtml(property.price)}</strong>` : ''} &nbsp;•&nbsp; ${escapeHtml(listingLabel)}
            </p>
          </div>

          <!-- Customer Submitted Details -->
          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:18px;margin-bottom:22px">
            <div style="font-size:12px;font-weight:bold;color:#6b7280;letter-spacing:1px;margin-bottom:12px;text-transform:uppercase">Your Submitted Inquiry Details</div>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:35%">Your Name:</td><td style="padding:6px 0;font-size:13px;font-weight:bold;color:#111827">${escapeHtml(enquiry.name)}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Phone Number:</td><td style="padding:6px 0;font-size:13px;font-weight:bold;color:#111827">${escapeHtml(enquiry.phone)}</td></tr>
              <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Email Address:</td><td style="padding:6px 0;font-size:13px;font-weight:bold;color:#111827">${escapeHtml(enquiry.email)}</td></tr>
              ${enquiry.message ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;vertical-align:top">Your Message:</td><td style="padding:6px 0;font-size:13px;color:#374151;white-space:pre-wrap">${escapeHtml(enquiry.message)}</td></tr>` : ''}
              <tr><td style="padding:6px 0;color:#6b7280;font-size:13px">Submitted On:</td><td style="padding:6px 0;font-size:12px;color:#6b7280">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
            </table>
          </div>

          <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:14px 18px;border-radius:6px;margin:18px 0;font-size:13px;color:#1e40af">
            The property owner ${owner?.name ? `(<strong>${escapeHtml(owner.name)}</strong>)` : ''} or our support team will contact you shortly on <strong>${escapeHtml(enquiry.phone)}</strong>.
          </div>

          <p style="font-size:13px;color:#6b7280;margin-bottom:0">Warm regards,<br>${escapeHtml(companyName)} Team</p>
        </div>
        <div style="padding:16px 28px;background:#f9fafb;color:#6b7280;font-size:12px">${escapeHtml(companyName)}${companyPhone ? ` · ${escapeHtml(companyPhone)}` : ''}</div>
      </div></body></html>`;

    jobs.push(sendMail({
      to: enquiry.email,
      subject: customerSubject,
      html: customerHtml,
      text: `Hello ${enquiry.name},\n\nThank you for inquiring about ${property.title}. Your inquiry has been received and forwarded to the property owner.\n\nDetails:\nProperty: ${property.title}\nPrice: ${property.price || '-'}\nLocation: ${property.location || '-'}\n\nOur team / property owner will get in touch with you soon.\n\nWarm regards,\n${companyName}`,
    }));
  }

  const results = await Promise.allSettled(jobs);
  results.filter((item) => item.status === 'rejected').forEach((item) => console.error('Property inquiry notification error:', item.reason));
  return results;
}
