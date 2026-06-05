'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dark, setDark] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [redirectParam, setRedirectParam] = useState('');

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    // Read redirect param from URL so we can pass it through after signup
    const params = new URLSearchParams(window.location.search);
    setRedirectParam(params.get('redirect') || '');
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) return setError('Name is required');
    if (!formData.email) return setError('Email address is required');
    if (!emailRegex.test(formData.email)) return setError('Please enter a valid email address');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Signup failed');
      setSuccess('Account created! Redirecting to login...');
      const loginUrl = redirectParam
        ? `/login?redirect=${encodeURIComponent(redirectParam)}`
        : '/login';
      setTimeout(() => router.push(loginUrl), 1800);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bg = dark ? '#000' : '#f5f5f7';
  const surface = dark ? '#0a0a0a' : '#fff';
  const border = dark ? '#27272a' : '#e2e2e7';
  const text = dark ? '#fff' : '#111113';
  const muted = dark ? '#71717a' : '#6b6b76';
  const inputBg = dark ? '#111' : '#f9f9fb';

  const inputStyle = {
    width: '100%', padding: '0.48rem 0.75rem 0.48rem 2.25rem',
    border: `1px solid ${border}`, borderRadius: 7, background: inputBg,
    color: text, fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 600, color: muted, marginBottom: '0.3rem' };

  const EyeOpen = () => (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
  );
  const EyeClosed = () => (
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
      <path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10C1.732 14.057 5.522 17 10 17a9.958 9.958 0 004.512-1.074l1.78 1.781a1 1 0 001.414-1.414l-1.474-1.474z" />
    </svg>
  );

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'background 0.3s' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: 820, background: surface, border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.08)', transition: 'background 0.3s, border-color 0.3s' }}>

        {/* Brand Panel */}
        <div style={{ flex: '0 0 300px', background: dark ? '#111' : '#111113', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="hidden sm:flex flex-col">
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '2.5rem' }}>
              MT<span style={{ color: '#facc15' }}>BOSS</span>
            </div>
            <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '0.75rem' }}>
              Join thousands of happy customers.
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Book home services, track orders, manage properties — your MT-BOSS account gives you access to everything.
            </p>
            {['Free to create', 'Instant booking', 'Verified vendors', 'Secure payments'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ color: '#facc15', fontWeight: 700, fontSize: '0.75rem' }}>✓</span>
                <span style={{ fontSize: '0.8125rem', color: '#d1d5db' }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#4b5563' }}>© {new Date().getFullYear()} MT-BOSS. All rights reserved.</div>
        </div>

        {/* Form Panel */}
        <div style={{ flex: 1, padding: '2rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: surface, transition: 'background 0.3s' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: text, marginBottom: '0.2rem' }}>Create Account</div>
          <div style={{ fontSize: '0.8125rem', color: muted, marginBottom: '1.25rem' }}>Sign up to get started with MT-BOSS</div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.875rem', background: dark ? '#3f1515' : '#fff1f2', border: `1px solid ${dark ? '#dc2626' : '#fca5a5'}`, borderRadius: 6, fontSize: '0.8125rem', color: dark ? '#fca5a5' : '#9f1239', marginBottom: '0.875rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: dark ? '#fca5a5' : '#9f1239', flexShrink: 0 }} />
              {error}
            </div>
          )}

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.875rem', background: dark ? '#14532d33' : '#f0fdf4', border: `1px solid ${dark ? '#16a34a' : '#86efac'}`, borderRadius: 6, fontSize: '0.8125rem', color: dark ? '#86efac' : '#166534', marginBottom: '0.875rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: dark ? '#86efac' : '#166534', flexShrink: 0 }} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: muted, pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#facc15'} onBlur={e => e.target.style.borderColor = border} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: muted, pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#facc15'} onBlur={e => e.target.style.borderColor = border} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: muted, pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" required
                  style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  onFocus={e => e.target.style.borderColor = '#facc15'} onBlur={e => e.target.style.borderColor = border} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: muted, padding: 0, display: 'flex' }}>
                  {showPassword ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: muted, pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required
                  style={{ ...inputStyle, paddingRight: '2.5rem' }}
                  onFocus={e => e.target.style.borderColor = '#facc15'} onBlur={e => e.target.style.borderColor = border} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: muted, padding: 0, display: 'flex' }}>
                  {showConfirm ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || !!success}
              style={{ width: '100%', padding: '0.6rem 1rem', background: '#facc15', color: '#000', border: 'none', borderRadius: 7, fontSize: '0.875rem', fontWeight: 700, cursor: (loading || success) ? 'not-allowed' : 'pointer', opacity: (loading || success) ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: '1.25rem', transition: 'opacity 0.15s' }}>
              {loading ? 'Creating account…' : <>Create Account <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: muted }}>
            Already have an account?{' '}
            <Link
              href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
              style={{ color: '#facc15', fontWeight: 600, textDecoration: 'none' }}
            >
              Sign in
            </Link>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: `1px solid ${border}`, textAlign: 'center' }}>
            <Link href="/vendor/signup" style={{ fontSize: '0.78rem', color: muted, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = text}
              onMouseLeave={e => e.currentTarget.style.color = muted}>
              Register as a Vendor instead →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
