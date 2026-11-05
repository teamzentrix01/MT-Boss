/**
 * MSG91 Flow API v5 integration for mobile OTP delivery.
 * All credentials remain server-side only.
 */

/**
 * Send OTP via MSG91 Flow API v5.
 * In dev mode (OTP_DEV_MODE=true) prints OTP to terminal instead of sending SMS.
 * Never returns OTP in the API response.
 * @param {string} mobile - 10-digit Indian mobile number (no country code)
 * @param {string} otp - 6-digit OTP string
 * @returns {Promise<void>}
 */
export async function sendOtpSms(mobile, otp) {
  const devMode = process.env.OTP_DEV_MODE === 'true';

  if (devMode) {
    // Print to server terminal only - never expose in API response
    console.log(`\n[DEV MODE] OTP for +91${mobile}: ${otp}\n`);
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
