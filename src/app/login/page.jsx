'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [redirectParam, setRedirectParam] = useState('');

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    // Read redirect param from URL
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
    if (!formData.email) { setError('Email address is required.'); return; }
    if (!emailRegex.test(formData.email)) { setError('Please enter a valid email address.'); return; }
    if (!formData.password) { setError('Password is required.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user?.role === 'admin') {
          localStorage.setItem('admin-token', data.token);
          localStorage.setItem('admin', JSON.stringify(data.user));
        }
        window.dispatchEvent(new Event('userLoggedIn'));
        // Admin always goes to admin dashboard; regular users honour the redirect param
        const destination =
          data.user?.role === 'admin'
            ? (data.redirectTo || '/dashboard')
            : (redirectParam || data.redirectTo || '/userdashboard');
        router.push(destination);
      } else {
        setError(data.error || data.message || 'Invalid credentials.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <>
      <style>{`
        .lp-root {
          --lp-bg:      ${dark ? '#000000' : '#f5f5f7'};
          --lp-surface: ${dark ? '#000000' : '#ffffff'};
          --lp-border:  ${dark ? 'var(--brand-blue-light)' : '#e2e2e7'};
          --lp-text:    ${dark ? '#ffffff' : '#111113'};
          --lp-muted:   ${dark ? '#9ca3af' : '#6b6b76'};
          --lp-accent:  ${dark ? 'var(--brand-blue-light)' : '#2563eb'};
          --lp-err-bg:  ${dark ? '#7f1d1d' : '#fff1f2'};
          --lp-err-tx:  ${dark ? '#fca5a5' : '#9f1239'};
          --lp-err-br:  ${dark ? '#dc2626' : '#fca5a5'};
        }

        .lp-root {
          min-height: 100vh;
          background: var(--lp-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background-color 0.5s ease, color 0.5s ease;
        }

        .lp-wrap {
          display: flex;
          width: 100%;
          max-width: 860px;
          background: var(--lp-surface);
          border: 1px solid var(--lp-border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,.07);
          transition: background-color 0.5s ease, border-color 0.5s ease;
        }

        .lp-brand {
          flex: 0 0 320px;
          background: ${dark ? '#1a1a1a' : '#111113'};
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: background-color 0.5s ease;
        }
        @media(max-width:640px){ .lp-brand { display: none; } }

        .lp-brand-logo {
          font-size: 1.125rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .lp-brand-logo span { color: var(--brand-blue-light); }

        .lp-brand-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 0.75rem;
        }
        .lp-brand-sub {
          font-size: 0.8125rem;
          color: #9ca3af;
          line-height: 1.6;
        }
        .lp-brand-footer {
          font-size: 0.7rem;
          color: #6b7280;
        }

        .lp-form-panel {
          flex: 1;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--lp-surface);
          transition: background-color 0.5s ease;
        }

        .lp-form-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--lp-text);
          margin-bottom: 0.25rem;
          transition: color 0.5s ease;
        }
        .lp-form-sub {
          font-size: 0.8125rem;
          color: var(--lp-muted);
          margin-bottom: 1.5rem;
          transition: color 0.5s ease;
        }

        .lp-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          background: var(--lp-err-bg);
          border: 1px solid var(--lp-err-br);
          border-radius: 6px;
          font-size: 0.8125rem;
          color: var(--lp-err-tx);
          margin-bottom: 1rem;
          transition: background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease;
        }
        .lp-error-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--lp-err-tx);
          flex-shrink: 0;
        }

        .lp-field { margin-bottom: 0.875rem; }
        .lp-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--lp-muted);
          margin-bottom: 0.3rem;
          transition: color 0.5s ease;
        }
        .lp-input-wrap { position: relative; }
        .lp-input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 15px; height: 15px;
          color: var(--lp-muted);
          pointer-events: none;
          transition: color 0.5s ease;
        }
        .lp-input {
          width: 100%;
          padding: 0.45rem 0.75rem 0.45rem 2.25rem;
          border: 1px solid var(--lp-border);
          border-radius: 7px;
          background: var(--lp-bg);
          color: var(--lp-text);
          font-size: 0.8125rem;
          outline: none;
          transition: border-color .15s, background-color 0.5s ease, color 0.5s ease;
          box-sizing: border-box;
        }
        .lp-input::placeholder { color: ${dark ? '#6b7280' : '#b0b0ba'}; }
        .lp-input:focus { border-color: var(--lp-accent); background: ${dark ? '#1a1a1a' : '#fff'}; }

        .lp-pw-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--lp-muted);
          padding: 0; display: flex;
          transition: color .15s;
        }
        .lp-pw-toggle:hover { color: var(--lp-text); }

        .lp-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .lp-remember {
          display: flex; align-items: center; gap: 0.375rem;
          font-size: 0.75rem; color: var(--lp-muted);
          cursor: pointer;
          transition: color 0.5s ease;
        }
        .lp-remember input { accent-color: var(--lp-accent); cursor: pointer; }
        .lp-forgot {
          font-size: 0.75rem;
          color: var(--lp-accent);
          text-decoration: none;
          font-weight: 600;
          transition: opacity .15s, color 0.5s ease;
        }
        .lp-forgot:hover { opacity: .75; }

        .lp-submit {
          width: 100%;
          padding: 0.55rem 1rem;
          background: var(--lp-accent);
          color: ${dark ? '#000' : '#fff'};
          border: none;
          border-radius: 7px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: opacity .15s, background-color 0.5s ease, color 0.5s ease;
          margin-bottom: 1.25rem;
        }
        .lp-submit:hover:not(:disabled) { opacity: .88; }
        .lp-submit:disabled { opacity: .5; cursor: not-allowed; }

        @keyframes lp-spin { to { transform: rotate(360deg); } }
        .lp-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: ${dark ? '#000' : '#fff'};
          border-radius: 50%;
          animation: lp-spin .7s linear infinite;
        }

        .lp-divider {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .lp-divider-line { flex: 1; height: 1px; background: var(--lp-border); transition: background-color 0.5s ease; }
        .lp-divider-text { font-size: 0.7rem; color: var(--lp-muted); text-transform: uppercase; letter-spacing: .06em; transition: color 0.5s ease; }

        .lp-social { display: grid; grid-template-columns: 1fr; gap: 0.5rem; margin-bottom: 1.25rem; }
        .lp-social-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          padding: 0.45rem 0.75rem;
          border: 1px solid var(--lp-border);
          border-radius: 7px;
          background: var(--lp-surface);
          color: var(--lp-text);
          font-size: 0.8rem; font-weight: 600;
          cursor: pointer;
          transition: background .15s, border-color .15s, color 0.5s ease, background-color 0.5s ease;
        }
        .lp-social-btn:hover { background: var(--lp-bg); border-color: var(--lp-muted); }

        .lp-signup {
          text-align: center;
          font-size: 0.8rem;
          color: var(--lp-muted);
          transition: color 0.5s ease;
        }
        .lp-signup a {
          color: var(--lp-accent);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.5s ease;
        }
        .lp-signup a:hover { text-decoration: underline; }

        .lp-tos {
          text-align: center;
          font-size: 0.7rem;
          color: var(--lp-muted);
          margin-top: 1.25rem;
          transition: color 0.5s ease;
        }
        .lp-tos a { color: var(--lp-accent); text-decoration: none; transition: color 0.5s ease; }
        .lp-tos a:hover { text-decoration: underline; }

        /* ── Vendor CTA ── */
        .lp-vendor-cta {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--lp-border);
          transition: border-color 0.5s ease;
        }
        .lp-vendor-cta-text {
          font-size: 0.75rem;
          color: var(--lp-muted);
          margin-bottom: 0.625rem;
          text-align: center;
          transition: color 0.5s ease;
        }
        .lp-vendor-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #10b981;
          color: #10b981;
          border-radius: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .lp-vendor-cta-btn:hover {
          background: ${dark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'};
          opacity: 0.9;
        }
        .lp-vendor-cta-btn svg { width: 14px; height: 14px; }

        /* ── Supplier CTA ── */
        .lp-supplier-cta {
          margin-top: 0.625rem;
          padding-top: 0.625rem;
          border-top: 1px solid var(--lp-border);
          transition: border-color 0.5s ease;
        }
        .lp-supplier-cta-text {
          font-size: 0.75rem;
          color: var(--lp-muted);
          margin-bottom: 0.625rem;
          text-align: center;
          transition: color 0.5s ease;
        }
        .lp-supplier-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem 1rem;
          background: transparent;
          border: 1px solid #6366f1;
          color: #6366f1;
          border-radius: 7px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .lp-supplier-cta-btn:hover {
          background: ${dark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)'};
          opacity: 0.9;
        }
        .lp-supplier-cta-btn svg { width: 14px; height: 14px; }
      `}</style>

      <div className="lp-root">
        <div className="lp-wrap">

          {/* Brand side */}
          <div className="lp-brand">
            <div className="lp-brand-logo">MT<span>BOSS</span></div>
            <div className="lp-brand-mid">
              <div className="lp-brand-heading">Manage your properties with confidence.</div>
              <p className="lp-brand-sub">Sign in to access the admin dashboard — properties, services, enquiries and more, all in one place.</p>
            </div>
            <div className="lp-brand-footer">© {new Date().getFullYear()} MT-BOSS. All rights reserved.</div>
          </div>

          {/* Form side */}
          <div className="lp-form-panel">
            <div className="lp-form-title">Welcome back</div>
            <div className="lp-form-sub">Sign in to your account to continue</div>

            {error && (
              <div className="lp-error">
                <span className="lp-error-dot" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="lp-field">
                <label className="lp-label" htmlFor="email">Email address</label>
                <div className="lp-input-wrap">
                  <svg className="lp-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    className="lp-input" type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="you@example.com" required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lp-field">
                <label className="lp-label" htmlFor="password">Password</label>
                <div className="lp-input-wrap">
                  <svg className="lp-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    className="lp-input" style={{ paddingRight: '2.5rem' }}
                    type={showPassword ? 'text' : 'password'}
                    id="password" name="password"
                    value={formData.password} onChange={handleChange}
                    placeholder="••••••••" required
                  />
                  <button type="button" className="lp-pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10C1.732 14.057 5.522 17 10 17a9.958 9.958 0 004.512-1.074l1.78 1.781a1 1 0 001.414-1.414l-1.474-1.474z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="lp-options">
                <label className="lp-remember">
                  <input type="checkbox" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="lp-forgot">Forgot password?</Link>
              </div>

              {/* Submit */}
              <button type="submit" className="lp-submit" disabled={loading}>
                {loading ? (
                  <><span className="lp-spinner" /> Signing in…</>
                ) : (
                  <>
                    Sign In
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Google */}
            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-text">or</span>
              <div className="lp-divider-line" />
            </div>
            <div className="lp-social">
              <button className="lp-social-btn" onClick={handleGoogleLogin}>
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="lp-signup">
              Don't have an account?{' '}
              <Link href={redirectParam ? `/signup?redirect=${encodeURIComponent(redirectParam)}` : '/signup'}>
                Create one
              </Link>
            </div>

            {/* Vendor + Supplier links — compact */}
            <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid var(--lp-border)', display: 'flex', gap: '0.5rem' }}>
              <Link href="/vendor/login" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '0.45rem', border: '1px solid #10b981', color: '#10b981', borderRadius: 7, fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                🏪 Vendor Login
              </Link>
              <Link href="/supplier/login" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '0.45rem', border: '1px solid #6366f1', color: '#6366f1', borderRadius: 7, fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                📦 Supplier Login
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
