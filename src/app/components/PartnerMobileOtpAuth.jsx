'use client';

import RequiredAsterisk from './RequiredAsterisk';
import { useCallback, useEffect, useRef, useState } from 'react';
import { applyPartnerWebSession } from '@/lib/partner-web-auth';
import { normalizeFranchisePermissions } from '@/lib/franchise-permissions';

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const OTP_VALID_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 60;

function formatMmSs(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Partner portal sign-in (agent, vendor, supplier, franchise) via mobile OTP.
 * @param {'agent'|'vendor'|'supplier'|'franchise'} role
 */
export default function PartnerMobileOtpAuth({
  role,
  title = 'Sign in with mobile',
  subtitle = 'We will send a 6-digit OTP valid for 5 minutes.',
  onSuccess,
}) {
  const [step, setStep] = useState('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [validSecondsLeft, setValidSecondsLeft] = useState(OTP_VALID_SECONDS);
  const [resendSecondsLeft, setResendSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const otpRefs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => {
      setValidSecondsLeft((p) => (p > 0 ? p - 1 : 0));
      setResendSecondsLeft((p) => (p > 0 ? p - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const finishLogin = useCallback(
    (data) => {
      if (role === 'franchise' && data.franchise) {
        data.franchise = {
          ...data.franchise,
          permissions: normalizeFranchisePermissions(data.franchise.permissions),
        };
      }
      applyPartnerWebSession(role, data);
      onSuccess?.(data);
    },
    [onSuccess, role],
  );

  const sendOtp = async () => {
    setError('');
    setInfo('');
    if (!MOBILE_REGEX.test(mobile)) {
      setError('Enter a valid 10-digit mobile number (starting 6–9).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${mobile}` }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP.');
      }
      setStep('otp');
      setValidSecondsLeft(OTP_VALID_SECONDS);
      setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);
      setOtp(['', '', '', '', '', '']);
      setInfo(data.message || 'OTP sent successfully.');
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Enter the 6-digit OTP.');
      return;
    }
    if (validSecondsLeft <= 0) {
      setError('OTP expired. Please resend.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${mobile}`, code: otpString, role }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Verification failed.');
      }
      if (data.needsSignup) {
        throw new Error('No account found for this mobile. Complete registration first.');
      }
      finishLogin(data);
    } catch (err) {
      setError(err.message || 'Verification failed.');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  return (
    <div className="cmoa-panel">
      <style>{`
        .cmoa-panel { width: 100%; }
        .cmoa-title { font-size: 1.125rem; font-weight: 800; margin-bottom: 0.35rem; }
        .cmoa-sub { font-size: 0.8125rem; opacity: 0.75; margin-bottom: 1.25rem; line-height: 1.5; }
        .cmoa-error { background: #fff1f2; color: #9f1239; border: 1px solid #fecdd3; border-radius: 8px; padding: 0.65rem 0.85rem; font-size: 0.8125rem; margin-bottom: 1rem; }
        .cmoa-info { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0.65rem 0.85rem; font-size: 0.8125rem; margin-bottom: 1rem; }
        .dark-mode .cmoa-error { background: #7f1d1d; color: #fecaca; border-color: #dc2626; }
        .dark-mode .cmoa-info { background: #1e3a5f; color: #bfdbfe; border-color: #2563eb; }
        .cmoa-label { display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.35rem; opacity: 0.8; }
        .cmoa-mobile-row { display: flex; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: #fff; }
        .dark-mode .cmoa-mobile-row { border-color: #3f3f46; background: #18181b; }
        .cmoa-prefix { padding: 0.65rem 0.85rem; font-weight: 700; border-right: 1px solid #e2e8f0; background: #f8fafc; }
        .dark-mode .cmoa-prefix { border-color: #3f3f46; background: #27272a; }
        .cmoa-mobile-input { flex: 1; border: none; padding: 0.65rem 0.85rem; font-size: 0.9375rem; background: transparent; color: inherit; outline: none; }
        .cmoa-btn { width: 100%; margin-top: 1rem; padding: 0.75rem 1rem; border: none; border-radius: 10px; background: var(--brand-blue, #2563eb); color: #0f172a; font-weight: 800; font-size: 0.875rem; cursor: pointer; }
        .cmoa-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .cmoa-otp-row { display: flex; gap: 0.5rem; justify-content: center; margin: 0.75rem 0; }
        .cmoa-otp-box { width: 2.5rem; height: 2.75rem; text-align: center; font-size: 1.125rem; font-weight: 800; border: 2px solid #e2e8f0; border-radius: 10px; background: #fff; color: inherit; }
        .dark-mode .cmoa-otp-box { border-color: #52525b; background: #18181b; }
        .cmoa-link { background: transparent !important; background-color: transparent !important; background-image: none !important; box-shadow: none !important; border: none !important; transform: none !important; color: var(--brand-blue, #2563eb) !important; font-weight: 700; font-size: 0.8125rem; cursor: pointer; margin-top: 0.75rem; }
        .cmoa-link:hover { background: transparent !important; background-color: transparent !important; box-shadow: none !important; transform: none !important; text-decoration: underline !important; }
        .cmoa-muted { font-size: 0.75rem; opacity: 0.7; text-align: center; margin-top: 0.5rem; }
      `}</style>

      <div className="cmoa-title">{title}</div>
      <div className="cmoa-sub">{subtitle}</div>

      {error ? <div className="cmoa-error">{error}</div> : null}
      {info ? <div className="cmoa-info">{info}</div> : null}

      {step === 'mobile' && (
        <>
          <label className="cmoa-label" htmlFor="pma-mobile">
            Registered mobile <RequiredAsterisk />
          </label>
          <div className="cmoa-mobile-row">
            <span className="cmoa-prefix">+91</span>
            <input
              id="pma-mobile"
              className="cmoa-mobile-input"
              inputMode="numeric"
              maxLength={10}
              placeholder="9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>
          <button type="button" className="cmoa-btn" disabled={loading} onClick={() => void sendOtp()}>
            {loading ? 'Sending…' : 'Send OTP'}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          <p className="cmoa-muted">
            OTP sent to <strong>+91 {mobile}</strong>
            {' · '}
            <button type="button" className="cmoa-link no-global-btn" style={{ margin: 0 }} onClick={() => { setStep('mobile'); setError(''); }}>
              Change number
            </button>
          </p>
          <div className="cmoa-otp-row" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                className="cmoa-otp-box"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={validSecondsLeft <= 0}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
              />
            ))}
          </div>
          <p className="cmoa-muted">
            {validSecondsLeft <= 0 ? 'OTP expired' : `Valid for ${formatMmSs(validSecondsLeft)}`}
          </p>
          <button
            type="button"
            className="cmoa-btn"
            disabled={loading || validSecondsLeft <= 0}
            onClick={() => void verifyOtp()}
          >
            {loading ? 'Verifying…' : 'Verify & sign in'}
          </button>
          {resendSecondsLeft > 0 ? (
            <p className="cmoa-muted">Resend OTP in {resendSecondsLeft}s</p>
          ) : (
            <button type="button" className="cmoa-link no-global-btn" disabled={loading} onClick={() => void sendOtp()}>
              Resend OTP
            </button>
          )}
        </>
      )}
    </div>
  );
}
