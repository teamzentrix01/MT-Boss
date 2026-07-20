'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VendorLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
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
    if (!formData.email) { setError('Email address is required.'); return; }
    if (!emailRegex.test(formData.email)) { setError('Please enter a valid email address.'); return; }
    if (!formData.password) { setError('Password is required.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/vendor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('vendor-token', data.token);
        localStorage.setItem('vendor', JSON.stringify(data.vendor));
        window.dispatchEvent(new Event('userLoggedIn'));
        router.push('/vendor/dashboard');
      } else {
        setError(data.error || data.message || 'Invalid credentials.');
      }
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

  return (
    <div className="vendor-login-page" style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'background 0.3s' }}>
      <style>{`
        .vendor-login-page { width: 100%; box-sizing: border-box; }
        .vendor-login-card, .vendor-login-form { min-width: 0; }

        @media (max-width: 639px) {
          .vendor-login-page {
            min-height: calc(100svh - 64px) !important;
            padding: 1rem !important;
            align-items: flex-start !important;
          }
          .vendor-login-card {
            width: 100% !important;
            max-width: 420px !important;
            margin: auto;
          }
          .vendor-login-brand { display: none !important; }
          .vendor-login-form {
            width: 100% !important;
            padding: 1.75rem 1.25rem !important;
            box-sizing: border-box;
          }
        }

        @media (max-width: 359px) {
          .vendor-login-page { padding: 0.75rem !important; }
          .vendor-login-form { padding: 1.5rem 1rem !important; }
        }
      `}</style>
      <div className="vendor-login-card" style={{ display: 'flex', width: '100%', maxWidth: 820, background: surface, border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.08)', transition: 'background 0.3s, border-color 0.3s' }}>

        {/* Brand Panel */}
        <div style={{ flex: '0 0 300px', background: dark ? '#111' : '#111113', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="vendor-login-brand">
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '2rem' }}>
              MT<span style={{ color: 'var(--brand-blue)' }}>BOSS</span>
              <span style={{ marginLeft: 8, fontSize: '0.65rem', fontWeight: 600, color: 'var(--brand-blue)', background: 'color-mix(in srgb, var(--brand-blue) 15%, transparent)', padding: '2px 8px', borderRadius: 99, letterSpacing: '0.08em' }}>VENDOR</span>
            </div>
            <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '0.75rem' }}>
              Grow your business with us.
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.7 }}>
              Manage bookings, track earnings, and serve customers — all from your vendor dashboard.
            </p>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#4b5563' }}>© {new Date().getFullYear()} MT-BOSS. All rights reserved.</div>
        </div>

        {/* Form Panel */}
        <div className="vendor-login-form" style={{ flex: 1, padding: '2.25rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: surface, transition: 'background 0.3s' }}>

          {/* Back to user login */}
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600, color: muted, textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = text}
            onMouseLeave={e => e.currentTarget.style.color = muted}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to User Login
          </Link>

          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: text, marginBottom: '0.2rem' }}>Vendor Sign In</div>
          <div style={{ fontSize: '0.8125rem', color: muted, marginBottom: '1.5rem' }}>Access your vendor dashboard</div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.875rem', background: dark ? '#3f1515' : '#fff1f2', border: `1px solid ${dark ? '#dc2626' : '#fca5a5'}`, borderRadius: 6, fontSize: '0.8125rem', color: dark ? '#fca5a5' : '#9f1239', marginBottom: '1rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: dark ? '#fca5a5' : '#9f1239', flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '0.875rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: muted, marginBottom: '0.3rem' }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: muted, pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="vendor@example.com" required
                  style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.25rem', border: `1px solid ${border}`, borderRadius: 7, background: inputBg, color: text, fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--brand-blue)'}
                  onBlur={e => e.target.style.borderColor = border}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: muted, marginBottom: '0.3rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: muted, pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required
                  style={{ width: '100%', padding: '0.5rem 2.5rem 0.5rem 2.25rem', border: `1px solid ${border}`, borderRadius: 7, background: inputBg, color: text, fontSize: '0.8125rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--brand-blue)'}
                  onBlur={e => e.target.style.borderColor = border}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: muted, padding: 0, display: 'flex' }}>
                  {showPassword
                    ? <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                    : <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10C1.732 14.057 5.522 17 10 17a9.958 9.958 0 004.512-1.074l1.78 1.781a1 1 0 001.414-1.414l-1.474-1.474z" /></svg>
                  }
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: '1rem', marginTop: '-0.25rem' }}>
              <Link href="/vendor/forgot-password" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brand-blue)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '0.6rem 1rem', background: 'var(--brand-blue)', color: '#000', border: 'none', borderRadius: 7, fontSize: '0.875rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: '1.25rem', transition: 'opacity 0.15s' }}>
              {loading ? 'Signing in…' : <>Sign In <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: muted }}>
            No vendor account? <Link href="/vendor/signup" style={{ color: 'var(--brand-blue)', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
