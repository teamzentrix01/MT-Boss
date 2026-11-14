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
 * POST /api/auth/verify-otp
 * Body: { phone: "+919876543210", code: "123456" }
 * Optional: { role, create_if_missing } — when role is set, issues JWT session after Twilio verify.
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
    const code = String(body?.code ?? body?.otp ?? '').trim();
    const roleRaw = body?.role != null ? String(body.role).trim().toLowerCase() : '';
    const createIfMissing = body?.create_if_missing === true;

    const parsed = parseIndianPhone(phoneInput);
    if (!parsed.ok) {
      return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    }

    if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code)) {
      return NextResponse.json(
        { success: false, error: `OTP must be ${OTP_LENGTH} digits.` },
        { status: 400 },
      );
    }

    if (roleRaw && !VALID_MOBILE_ROLES.includes(roleRaw)) {
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

    const otpCheck = await verifyTwilioOtp(parsed.e164, code);
    if (!otpCheck.ok) {
      return NextResponse.json({ success: false, error: otpCheck.error }, { status: otpCheck.status });
    }

    // Pure verification (no session) when role is omitted
    if (!roleRaw) {
      return NextResponse.json({
        success: true,
        verified: true,
        phone: parsed.e164,
        mobile: parsed.digits,
        message: 'OTP verified successfully',
      });
    }

    const { response } = await issueSessionAfterOtp({
      mobileDigits: parsed.digits,
      role: roleRaw,
      createIfMissing,
    });
    return response;
  } catch (error) {
    console.error('[auth/verify-otp] Error:', error.message);
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
