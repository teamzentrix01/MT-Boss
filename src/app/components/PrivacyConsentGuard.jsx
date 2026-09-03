'use client';

import { useEffect } from 'react';

const EXCLUDED_PATHS = [
  '/login', '/forgot-password', '/reset-password', '/payment/',
  '/dashboard', '/agent/dashboard', '/franchise/dashboard', '/supplier/dashboard', '/vendor/dashboard',
];

function isPersonalDataForm(form) {
  if (!(form instanceof HTMLFormElement)) return false;
  if (form.dataset.privacyConsent === 'off' || form.querySelector('[data-privacy-consent-checkbox]')) return false;
  if (EXCLUDED_PATHS.some((path) => window.location.pathname.includes(path))) return false;

  const fields = [...form.querySelectorAll('input, textarea, select')];
  const signature = fields.map((field) => `${field.type || ''} ${field.name || ''} ${field.id || ''} ${field.placeholder || ''}`).join(' ').toLowerCase();
  const hasContactData = /\b(email|tel|phone|mobile|whatsapp|address|message|enquir|applicant|customer|client|user_name|full.?name|shop.?name)\b/.test(signature);
  const isUtilityForm = fields.length <= 2 && /\b(otp|password|search|filter)\b/.test(signature) && !/phone|mobile|email/.test(signature);
  return hasContactData && !isUtilityForm;
}

function consentElement() {
  const wrapper = document.createElement('div');
  wrapper.className = 'privacy-consent-field';
  wrapper.dataset.privacyConsentInjected = 'true';
  wrapper.innerHTML = `
    <label class="privacy-consent-label">
      <input type="checkbox" name="privacy_consent" value="accepted" required data-privacy-consent-checkbox />
      <span>I have read and agree to the <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>. I consent to MTBOSS using my details to process and follow up on this request.<span aria-hidden="true" class="privacy-required"> *</span></span>
    </label>
    <span class="privacy-consent-help">Required before submitting this form.</span>
  `;
  return wrapper;
}

export default function PrivacyConsentGuard() {
  useEffect(() => {
    let scheduled = false;
    const syncForms = () => {
      scheduled = false;
      document.querySelectorAll('form').forEach((form) => {
        if (!isPersonalDataForm(form)) return;
        const consent = consentElement();
        const submit = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
        if (submit?.parentNode === form) form.insertBefore(consent, submit);
        else form.appendChild(consent);
      });
    };
    const scheduleSync = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(syncForms);
    };
    const observer = new MutationObserver(scheduleSync);
    const removeInjectedConsent = () => {
      document.querySelectorAll('[data-privacy-consent-injected]').forEach((element) => element.remove());
    };
    const beforeNavigation = (event) => {
      if (event.target instanceof Element && event.target.closest('a[href]')) removeInjectedConsent();
    };
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('click', beforeNavigation, true);
    window.addEventListener('popstate', removeInjectedConsent);
    window.addEventListener('pagehide', removeInjectedConsent);
    syncForms();
    return () => {
      observer.disconnect();
      document.removeEventListener('click', beforeNavigation, true);
      window.removeEventListener('popstate', removeInjectedConsent);
      window.removeEventListener('pagehide', removeInjectedConsent);
      removeInjectedConsent();
    };
  }, []);

  return null;
}
