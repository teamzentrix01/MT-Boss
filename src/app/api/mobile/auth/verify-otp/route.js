import { NextResponse } from 'next/server';
import {
  parseIndianPhone,
  getClientIp,
  assertAndRecordOtpVerifyAttempt,
  verifyTwilioOtp,
  OTP_LENGTH,
} from '@/lib/twilio-otp';
import { issueSessionAfterOtp } from '@/lib/otp-auth-session';
import { VALID_MOBILE_ROLES } from '@/lib/mobile-auth';

/**
 * POST /api/mobile/auth/verify-otp
 * Verifies OTP via Twilio Verify, then issues partner/customer session JWTs.
 * Body: { mobile, otp, role, create_if_missing? }
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
    const otp = String(body?.otp ?? body?.code ?? '').trim();
    const role = String(body?.role || '').trim().toLowerCase();
    const createIfMissing = body?.create_if_missing === true;

    const parsed = parseIndianPhone(phoneInput);
    if (!parsed.ok) {
      return NextResponse.json({ success: false, error: 'Invalid mobile number.' }, { status: 400 });
    }
    if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(otp)) {
      return NextResponse.json({ success: false, error: 'OTP must be 6 digits.' }, { status: 400 });
    }
    if (!VALID_MOBILE_ROLES.includes(role)) {
      return NextResponse.json(
        { success: false, error: `Invalid role. Must be one of: ${VALID_MOBILE_ROLES.join(', ')}.` },
        { status: 400 },
      );
    }

    const ip = getClientIp(req);
    const attemptGuard = await assertAndRecordOtpVerifyAttempt({
      mobileDigits: parsed.digits,
      ip,
    });
    if (!attemptGuard.ok) {
      return NextResponse.json(
        { success: false, error: attemptGuard.error },
        { status: attemptGuard.status },
      );
    }

    const otpCheck = await verifyTwilioOtp(parsed.e164, otp);
    if (!otpCheck.ok) {
      return NextResponse.json({ success: false, error: otpCheck.error }, { status: otpCheck.status });
    }

    const { response } = await issueSessionAfterOtp({
      mobileDigits: parsed.digits,
      role,
      createIfMissing,
    });
    return response;
  } catch (error) {
    console.error('[verify-otp] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
