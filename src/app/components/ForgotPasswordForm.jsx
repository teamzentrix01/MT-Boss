'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordForm({ userType, loginHref, accentColor }) {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(1); // 1=email, 2=otp+password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(''); // success/info messages
  const [devOtp, setDevOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const sendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { setError('Please enter your email address'); return; }
    if (!emailRegex.test(email)) { setError('Please enter a valid email address'); return; }
    setLoading(true); setError(''); setInfo('');
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, user_type: userType }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setResendCooldown(60);
        if (data.dev_otp) {
          setDevOtp(data.dev_otp);
          // Auto-fill OTP boxes when shown on screen
          setOtp(data.dev_otp.split(''));
        } else {
          setInfo('OTP sent! Check your email inbox (also check spam).');
        }
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch { setError('An error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleOtpChange = (i, val) => {
    const v = val.replace(/\D/g, '').slice(0, 1);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    setError('');
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, user_type: userType, otp: otpString, new_password: newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setDone(true);
        setTimeout(() => router.push(loginHref), 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch { setError('An error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  const bg      = dark ? '#0a0a0a' : '#f5f5f7';
  const surface = dark ? '#111'    : '#fff';
  const border  = dark ? '#27272a' : '#e2e2e7';
  const text    = dark ? '#f0f0f5' : '#111';
  const muted   = dark ? '#71717a' : '#6b6b76';
  const inputBg = dark ? '#1a1a1a' : '#f9f9fb';
  const isYellow = accentColor === '#facc15';

  const inputStyle = {
    width: '100%', padding: '0.75rem 0.9rem',
    border: `1.5px solid ${border}`, borderRadius: 8,
    background: inputBg, color: text, fontSize: '0.875rem',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color .2s',
  };

  const btnStyle = (disabled) => ({
    width: '100%', padding: '0.8rem',
    background: accentColor, color: isYellow ? '#000' : '#fff',
    border: 'none', borderRadius: 8, fontSize: '0.9rem', fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
    fontFamily: 'inherit', transition: 'opacity .2s', marginTop: '0.5rem',
  });

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 440, background: surface, border: `1px solid ${border}`, borderRadius: 14, padding: '2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,.08)' }}>

        <Link href={loginHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 600, color: muted, textDecoration: 'none', marginBottom: '1.75rem' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Login
        </Link>

        {done ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.5rem' }}>Password Changed!</h2>
            <p style={{ color: muted, fontSize: '0.875rem', lineHeight: 1.6 }}>
              Your password has been updated. Redirecting to login…
            </p>
          </div>
        ) : (
          <>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              {step === 1 ? '🔑' : '🔐'}
            </div>

            <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: text, marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
              {step === 1 ? 'Forgot Password?' : 'Enter OTP & New Password'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: muted, lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {step === 1
                ? 'Enter your registered email and we\'ll send a 6-digit OTP.'
                : `OTP sent to ${email}. Enter it below along with your new password.`}
            </p>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
              {[1, 2].map(s => (
                <div key={s} style={{ flex: 1, height: 3, borderRadius: 3, background: s <= step ? accentColor : border, transition: 'background .3s' }} />
              ))}
            </div>

            {error && (
              <div style={{ padding: '0.75rem 1rem', background: dark ? '#2d0a0a' : '#fff0f0', border: `1px solid ${dark ? '#7f1d1d' : '#fca5a5'}`, borderRadius: 8, color: dark ? '#f87171' : '#dc2626', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Show OTP on screen when email not configured */}
            {devOtp && step === 2 && (
              <div style={{ padding: '1rem 1.25rem', background: dark ? '#1a2a0a' : '#f0fdf4', border: `2px solid ${accentColor}`, borderRadius: 10, marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: accentColor, marginBottom: '0.5rem' }}>
                  📧 Email not configured — Your OTP is:
                </div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '0.3em', color: text, textAlign: 'center', padding: '0.5rem 0' }}>
                  {devOtp}
                </div>
                <div style={{ fontSize: '0.75rem', color: muted, textAlign: 'center', marginTop: '0.25rem' }}>
                  OTP auto-filled below — just set your new password
                </div>
              </div>
            )}

            {info && !devOtp && (
              <div style={{ padding: '0.75rem 1rem', background: dark ? '#0a2a14' : '#f0fdf4', border: `1px solid ${dark ? '#16a34a44' : '#86efac'}`, borderRadius: 8, color: dark ? '#4ade80' : '#15803d', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontWeight: 600 }}>
                ✅ {info}
              </div>
            )}

            {/* STEP 1 — Email */}
            {step === 1 && (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: muted, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="your@email.com" required
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = accentColor}
                    onBlur={e => e.target.style.borderColor = border}
                  />
                </div>
                <button onClick={sendOtp} disabled={loading} style={btnStyle(loading)}>
                  {loading ? 'Sending OTP…' : 'Send OTP →'}
                </button>
              </>
            )}

            {/* STEP 2 — OTP + New Password */}
            {step === 2 && (
              <form onSubmit={handleReset}>
                {/* OTP boxes */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: muted, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Enter 6-Digit OTP
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }} onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        type="text" inputMode="numeric" maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        style={{
                          width: 44, height: 52, textAlign: 'center',
                          fontSize: '1.35rem', fontWeight: 800, letterSpacing: 0,
                          border: `2px solid ${digit ? accentColor : border}`,
                          borderRadius: 10, background: inputBg, color: text,
                          outline: 'none', fontFamily: 'inherit',
                          transition: 'border-color .15s',
                        }}
                        onFocus={e => e.target.style.borderColor = accentColor}
                        onBlur={e => e.target.style.borderColor = digit ? accentColor : border}
                      />
                    ))}
                  </div>

                  {/* Resend */}
                  <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: muted }}>
                    {resendCooldown > 0
                      ? `Resend OTP in ${resendCooldown}s`
                      : loading
                      ? <span style={{ color: muted }}>Sending…</span>
                      : <button type="button" onClick={() => { setOtp(['','','','','','']); setInfo(''); sendOtp(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: accentColor, fontWeight: 700, fontSize: '0.8rem', padding: 0 }}>
                          Resend OTP
                        </button>
                    }
                  </div>
                </div>

                {/* New Password */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: muted, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPwd ? 'text' : 'password'} value={newPassword} onChange={e => { setNewPassword(e.target.value); setError(''); }} placeholder="Min. 6 characters" required
                      style={{ ...inputStyle, paddingRight: '2.5rem' }}
                      onFocus={e => e.target.style.borderColor = accentColor}
                      onBlur={e => e.target.style.borderColor = border}
                    />
                    <button type="button" onClick={() => setShowPwd(p => !p)}
                      style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: muted, fontSize: '1rem' }}>
                      {showPwd ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: muted, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm Password</label>
                  <input type={showPwd ? 'text' : 'password'} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }} placeholder="Repeat password" required
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = accentColor}
                    onBlur={e => e.target.style.borderColor = border}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.35rem' }}>Passwords don't match</div>
                  )}
                </div>

                <button type="submit" disabled={loading || otp.join('').length !== 6} style={btnStyle(loading || otp.join('').length !== 6)}>
                  {loading ? 'Resetting…' : 'Reset Password →'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
