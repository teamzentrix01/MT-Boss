/**
 * MSG91 OTP API v5 — MSG91 generates, sends, and verifies OTPs (not stored on our server in production).
 * Credentials stay server-side only.
 */

/** Fixed OTP for local/dev flow testing. Never used in production delivery. */
export const DEV_FIXED_OTP = '123456';

const MSG91_OTP_BASE = 'https://control.msg91.com/api/v5/otp';

/** Match mobile app + verify route (6-digit). */
export const MSG91_OTP_LENGTH = 6;

/** OTP validity on MSG91 side (minutes). Align with send-otp UX copy. */
export const MSG91_OTP_EXPIRY_MINUTES = 5;

/**
 * Skip real MSG91 outside production (or when OTP_DEV_MODE=true).
 */
export function isOtpDevMode() {
  if (process.env.OTP_DEV_MODE === 'true') return true;
  return process.env.NODE_ENV !== 'production';
}

function getMsg91Config() {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  if (!authKey || !templateId) {
    throw new Error('MSG91_AUTH_KEY and MSG91_TEMPLATE_ID must be configured for OTP delivery.');
  }
  return { authKey, templateId };
}

function formatMsg91Error(result, fallback) {
  const msg = result?.message || result?.errors || fallback;
  return typeof msg === 'string' ? msg : fallback;
}

/**
 * Ask MSG91 to generate and send an OTP (do not pass `otp` — MSG91 creates it).
 * @param {string} mobile - 10-digit Indian mobile (no country code)
 * @returns {Promise<{ requestId?: string }>}
 */
export async function sendOtpViaMsg91(mobile) {
  if (isOtpDevMode()) {
    console.log(`\n[DEV MODE] OTP for +91${mobile}: ${DEV_FIXED_OTP} (local verify, no SMS)\n`);
    return {};
  }

  const { authKey, templateId } = getMsg91Config();

  const params = new URLSearchParams({
    mobile: `91${mobile}`,
    template_id: templateId,
    otp_length: String(MSG91_OTP_LENGTH),
    otp_expiry: String(MSG91_OTP_EXPIRY_MINUTES),
    realTimeResponse: '1',
  });

  const response = await fetch(`${MSG91_OTP_BASE}?${params.toString()}`, {
    method: 'POST',
    headers: {
      authkey: authKey,
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`MSG91 send OTP error (${response.status}): ${formatMsg91Error(result, 'Request failed')}`);
  }
  if (result.type === 'error') {
    throw new Error(`MSG91 send OTP rejected: ${formatMsg91Error(result, 'Unknown error')}`);
  }

  return { requestId: result.request_id || result.requestId || undefined };
}

/**
 * Verify OTP with MSG91 (production only).
 * @returns {Promise<{ ok: true } | { ok: false, status: number, error: string }>}
 */
export async function verifyOtpViaMsg91(mobile, otp) {
  if (isOtpDevMode()) {
    return { ok: false, status: 500, error: 'verifyOtpViaMsg91 must not be used in dev mode.' };
  }

  let authKey;
  try {
    ({ authKey } = getMsg91Config());
  } catch (err) {
    return { ok: false, status: 503, error: err.message };
  }

  const params = new URLSearchParams({
    mobile: `91${mobile}`,
    otp: String(otp).trim(),
  });

  const response = await fetch(`${MSG91_OTP_BASE}/verify?${params.toString()}`, {
    method: 'GET',
    headers: {
      authkey: authKey,
      accept: 'application/json',
    },
  });

  const result = await response.json().catch(() => ({}));
  const message = String(result?.message || '').toLowerCase();

  const verified =
    result.type === 'success' ||
    message.includes('otp verified success') ||
    message.includes('otp matched');

  if (verified) {
    return { ok: true };
  }

  if (!response.ok && response.status !== 200) {
    return {
      ok: false,
      status: 502,
      error: 'Unable to verify OTP. Please try again.',
    };
  }

  const userError =
    message.includes('expired') || message.includes('timeout')
      ? 'OTP has expired. Please request a new one.'
      : message.includes('not match') || message.includes('invalid') || message.includes('incorrect')
        ? 'Incorrect OTP. Please check and try again.'
        : formatMsg91Error(result, 'Incorrect OTP. Please check and try again.');

  return { ok: false, status: 400, error: userError };
}

/** @deprecated Use sendOtpViaMsg91 — Flow API no longer used for mobile OTP. */
export async function sendOtpSms(mobile, _otp) {
  return sendOtpViaMsg91(mobile);
}
