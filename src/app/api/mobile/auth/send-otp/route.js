import { NextResponse } from 'next/server';
import {
  parseIndianPhone,
  getClientIp,
  assertAndRecordOtpSend,
  sendTwilioOtp,
  isOtpDevMode,
  OTP_VALID_MINUTES,
  RESEND_COOLDOWN_SECONDS,
} from '@/lib/twilio-otp';

/**
 * POST /api/mobile/auth/send-otp
 * Legacy-compatible wrapper around Twilio Verify.
 * Body: { mobile: "9876543210" } or { phone: "+919876543210" }
 */
export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }

    const phoneInput = body?.phone ?? body?.mobile ?? '';
    const parsed = parseIndianPhone(phoneInput);
    if (!parsed.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Enter a valid 10-digit Indian mobile number (starting with 6-9).',
        },
        { status: 400 },
      );
    }

    const ip = getClientIp(req);
    const rate = await assertAndRecordOtpSend({ mobileDigits: parsed.digits, ip });
    if (!rate.ok) {
      return NextResponse.json({ success: false, error: rate.error }, { status: rate.status });
    }

    try {
      await sendTwilioOtp(parsed.e164);
    } catch (smsErr) {
      console.error('[send-otp] SMS delivery failed:', smsErr.message);
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP. Please try again.' },
        { status: smsErr.status || 502 },
      );
    }

    const isDev = isOtpDevMode();
    return NextResponse.json({
      success: true,
      message: isDev
        ? 'Dev OTP ready. Use 123456 to verify (no SMS sent).'
        : 'OTP sent successfully',
      phone: parsed.e164,
      resend_after_seconds: RESEND_COOLDOWN_SECONDS,
      valid_for_minutes: OTP_VALID_MINUTES,
      ...(isDev ? { dev: true } : {}),
    });
  } catch (error) {
    console.error('[send-otp] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
