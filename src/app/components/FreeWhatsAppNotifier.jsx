'use client';

import { useEffect, useState } from 'react';

const TRACKED_ENDPOINTS = new Map([
  ['/api/contact', 'Contact Form'],
  // Job and agent application pages already have their own richer WhatsApp messages.
  ['/api/franchises', 'Franchise Application'],
  ['/api/material-enquiries', 'Material Order'],
  ['/api/property-enquiries', 'Property Enquiry'],
  ['/api/professional-enquiries', 'Professional Enquiry'],
  ['/api/primary-service-enquiries', 'Construction Service Enquiry'],
  ['/api/calculator-leads', 'Calculator Enquiry'],
  ['/api/calculator-quote-otp', 'Construction Calculator Quotation'],
  ['/api/bookings/create', 'Quick Service Booking'],
  ['/api/properties', 'Property Listing Submission'],
  ['/api/professional-services', 'Professional Registration'],
  ['/api/user/primary-services', 'Construction Service Request'],
  ['/api/auth/signup', 'Customer Registration'],
  ['/api/vendor/signup', 'Vendor Registration'],
  ['/api/supplier/signup', 'Supplier Registration'],
  ['/api/agent/login', 'Agent Login'],
  ['/api/auth/login', 'Customer/Admin Login'],
  ['/api/vendor/login', 'Vendor Login'],
  ['/api/supplier/login', 'Supplier Login'],
  ['/api/franchise/login', 'Franchise Login'],
]);

const BLOCKED_KEYS = /password|confirm|otp|token|secret|hash|aadhaar|pan|account|ifsc|bank|latitude|longitude|resume_data|authorization/i;
const USEFUL_KEYS = /name|email|phone|mobile|city|state|address|service|category|property|position|experience|company|notice|salary|message|cover|date|time|slot|model|investment|territory|department|reference|amount|price|status|pincode/i;

function endpointFrom(input) {
  try {
    const raw = typeof input === 'string' ? input : input?.url;
    return new URL(raw, window.location.origin).pathname.replace(/\/$/, '');
  } catch {
    return '';
  }
}

function requestDetails(body) {
  if (!body) return {};
  if (body instanceof FormData) return Object.fromEntries([...body.entries()].filter(([, value]) => typeof value === 'string'));
  if (typeof body === 'string') {
    try { return JSON.parse(body); } catch { return {}; }
  }
  return {};
}

function readableLabel(key) {
  return String(key).replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function makeMessage(type, details, responseData) {
  const lines = [`*New ${type} - MTBOSS*`];
  const merged = { ...details };
  const data = responseData?.data || responseData?.booking || responseData;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    ['id', 'booking_reference', 'application_reference', 'order_reference', 'status', 'total_amount'].forEach((key) => {
      if (data[key] !== undefined && merged[key] === undefined) merged[key] = data[key];
    });
  }
  Object.entries(merged)
    .filter(([key, value]) => !BLOCKED_KEYS.test(key) && USEFUL_KEYS.test(key) && value !== '' && value !== null && value !== undefined && typeof value !== 'object')
    .slice(0, 18)
    .forEach(([key, value]) => lines.push(`*${readableLabel(key)}:* ${String(value).slice(0, 700)}`));
  lines.push(`*Page:* ${window.location.pathname}`);
  lines.push(`*Submitted:* ${new Date().toLocaleString('en-IN')}`);
  return lines.join('\n');
}

export default function FreeWhatsAppNotifier() {
  const [pendingShare, setPendingShare] = useState(null);

  useEffect(() => {
    const adminNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER;
    if (!adminNumber) return undefined;
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input, init = {}) => {
      const response = await originalFetch(input, init);
      const endpoint = endpointFrom(input);
      const type = TRACKED_ENDPOINTS.get(endpoint);
      const method = String(init.method || (typeof input !== 'string' ? input?.method : '') || 'GET').toUpperCase();
      const details = requestDetails(init.body);
      const isAdminScreen = /(^|\/)dashboard(\/|$)/.test(window.location.pathname);
      const isOtpVerification = endpoint === '/api/calculator-quote-otp' && details.action === 'verify';
      if (!type || method !== 'POST' || !response.ok || isAdminScreen || isOtpVerification) return response;

      try {
        const responseData = await response.clone().json().catch(() => ({}));
        if (responseData?.success === false || responseData?.error) return response;
        const message = makeMessage(type, details, responseData);
        const shareUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
        setPendingShare({ type, shareUrl });
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.warn('Could not prepare the free WhatsApp update:', error);
      }
      return response;
    };

    return () => { window.fetch = originalFetch; };
  }, []);

  if (!pendingShare) return null;
  return (
    <aside className="fixed bottom-24 right-5 z-[10000] w-[min(360px,calc(100vw-40px))] border border-emerald-500 bg-zinc-950 p-4 text-white shadow-2xl" role="status">
      <button type="button" onClick={() => setPendingShare(null)} className="absolute right-2 top-1 bg-transparent p-1 text-lg text-zinc-400" aria-label="Dismiss WhatsApp reminder">×</button>
      <p className="pr-6 text-xs font-black uppercase tracking-wider text-emerald-400">Submission successful</p>
      <p className="mt-1 text-xs leading-5 text-zinc-300">Send the pre-filled {pendingShare.type} update to the MTBOSS admin on WhatsApp.</p>
      <a href={pendingShare.shareUrl} target="_blank" rel="noopener noreferrer" onClick={() => setPendingShare(null)} className="mt-3 inline-block bg-[#25D366] px-4 py-2 text-xs font-black uppercase tracking-wider text-black">
        Send WhatsApp Update
      </a>
    </aside>
  );
}
