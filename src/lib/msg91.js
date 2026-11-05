/**
 * MSG91 Flow API v5 integration for mobile OTP delivery.
 * All credentials remain server-side only.
 */

/** Temporary fixed OTP for local/dev flow testing. Never used in production. */
export const DEV_FIXED_OTP = '123456';

/**
 * Temporary: skip real SMS outside production (or when OTP_DEV_MODE=true).
 * Production always requires MSG91 unless OTP_DEV_MODE is explicitly true (emergency only).
 */
export function isOtpDevMode() {
  if (process.env.OTP_DEV_MODE === 'true') return true;
  return process.env.NODE_ENV !== 'production';
}

/**
 * Send OTP via MSG91 Flow API v5.
 * In dev mode prints OTP to terminal instead of sending SMS.
 * Never returns OTP in the API response.
 * @param {string} mobile - 10-digit Indian mobile number (no country code)
 * @param {string} otp - 6-digit OTP string
 * @returns {Promise<void>}
 */
export async function sendOtpSms(mobile, otp) {
  if (isOtpDevMode()) {
    // Print to server terminal only - never expose in API response
    console.log(`\n[DEV MODE] OTP for +91${mobile}: ${otp} (fixed test OTP when using ${DEV_FIXED_OTP})\n`);
    return;
  }

  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId) {
    throw new Error('MSG91_AUTH_KEY and MSG91_TEMPLATE_ID must be configured for SMS delivery.');
  }

  const payload = {
    template_id: templateId,
    short_url: '0',
    recipients: [
      {
        mobiles: `91${mobile}`,
        otp,
      },
    ],
  };

  const response = await fetch('https://control.msg91.com/api/v5/flow', {
    method: 'POST',
    headers: {
      authkey: authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`MSG91 API error (${response.status}): ${body}`);
  }

  const result = await response.json().catch(() => ({}));
  if (result.type === 'error') {
    throw new Error(`MSG91 rejected OTP: ${result.message || 'Unknown error'}`);
  }
}
