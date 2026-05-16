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

  // Monitor dark mode changes
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
        document.cookie = `vendor-auth-token=${data.token}; path=/; max-age=604800`;
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

  return (
    <>
      <style>{`
        .vlp-root {
          --vlp-bg:      ${dark ? '#000000' : '#f5f5f7'};
          --vlp-surface: ${dark ? '#000000' : '#ffffff'};
          --vlp-border:  ${dark ? '#10b981' : '#e2e2e7'};
          --vlp-text:    ${dark ? '#ffffff' : '#111113'};
          --vlp-muted:   ${dark ? '#9ca3af' : '#6b6b76'};
          --vlp-accent:  ${dark ? '#10b981' : '#059669'};
          --vlp-err-bg:  ${dark ? '#7f1d1d' : '#fff1f2'};
          --vlp-err-tx:  ${dark ? '#fca5a5' : '#9f1239'};
          --vlp-err-br:  ${dark ? '#dc2626' : '#fca5a5'};
        }

        .vlp-root {
          min-height: 100vh;
          background: var(--vlp-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background-color 0.5s ease, color 0.5s ease;
        }

        .vlp-wrap {
          display: flex;
          width: 100%;
          max-width: 860px;
          background: var(--vlp-surface);
          border: 1px solid var(--vlp-border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(0,0,0,.07);
          transition: background-color 0.5s ease, border-color 0.5s ease;
        }

        .vlp-brand {
          flex: 0 0 320px;
          background: ${dark ? '#1a1a1a' : '#111113'};
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: background-color 0.5s ease;
        }
        @media(max-width:640px){ .vlp-brand { display: none; } }

        .vlp-brand-logo {
          font-size: 1.125rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .vlp-brand-logo span { color: #10b981; }

        .vlp-brand-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 0.75rem;
        }
        .vlp-brand-sub {
          font-size: 0.8125rem;
          color: #9ca3af;
          line-height: 1.6;
        }

        .vlp-brand-footer {
          font-size: 0.7rem;
          color: #6b7280;
        }

        .vlp-form-panel {
          flex: 1;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--vlp-surface);
          transition: background-color 0.5s ease;
        }

        .vlp-form-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--vlp-text);
          margin-bottom: 0.25rem;
          transition: color 0.5s ease;
        }
        .vlp-form-sub {
          font-size: 0.8125rem;
          color: var(--vlp-muted);
          margin-bottom: 1.5rem;
          transition: color 0.5s ease;
        }

        .vlp-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          background: var(--vlp-err-bg);
          border: 1px solid var(--vlp-err-br);
          border-radius: 6px;
          font-size: 0.8125rem;
          color: var(--vlp-err-tx);
          margin-bottom: 1rem;
          transition: background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease;
        }
        .vlp-error-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--vlp-err-tx);
          flex-shrink: 0;
        }

        .vlp-field { margin-bottom: 0.875rem; }
        .vlp-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--vlp-muted);
          margin-bottom: 0.3rem;
          transition: color 0.5s ease;
        }
        .vlp-input-wrap { position: relative; }
        .vlp-input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 15px; height: 15px;
          color: var(--vlp-muted);
          pointer-events: none;
          transition: color 0.5s ease;
        }
        .vlp-input {
          width: 100%;
          padding: 0.45rem 0.75rem 0.45rem 2.25rem;
          border: 1px solid var(--vlp-border);
          border-radius: 7px;
          background: var(--vlp-bg);
          color: var(--vlp-text);
          font-size: 0.8125rem;
          outline: none;
          transition: border-color .15s, background-color 0.5s ease, color 0.5s ease;
          box-sizing: border-box;
        }
        .vlp-input::placeholder { color: ${dark ? '#6b7280' : '#b0b0ba'}; }
        .vlp-input:focus { border-color: var(--vlp-accent); background: ${dark ? '#1a1a1a' : '#fff'}; }

        .vlp-pw-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--vlp-muted);
          padding: 0; display: flex;
          transition: color .15s;
        }
        .vlp-pw-toggle:hover { color: var(--vlp-text); }

        .vlp-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .vlp-remember {
          display: flex; align-items: center; gap: 0.375rem;
          font-size: 0.75rem; color: var(--vlp-muted);
          cursor: pointer;
          transition: color 0.5s ease;
        }
        .vlp-remember input { accent-color: var(--vlp-accent); cursor: pointer; }
        .vlp-forgot {
          font-size: 0.75rem;
          color: var(--vlp-accent);
          text-decoration: none;
          font-weight: 600;
          transition: opacity .15s, color 0.5s ease;
        }
        .vlp-forgot:hover { opacity: .75; }

        .vlp-submit {
          width: 100%;
          padding: 0.55rem 1rem;
          background: var(--vlp-accent);
          color: #fff;
          border: none;
          border-radius: 7px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: opacity .15s, background-color 0.5s ease, color 0.5s ease;
          margin-bottom: 1.25rem;
        }
        .vlp-submit:hover:not(:disabled) { opacity: .88; }
        .vlp-submit:disabled { opacity: .5; cursor: not-allowed; }

        @keyframes vlp-spin { to { transform: rotate(360deg); } }
        .vlp-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: vlp-spin .7s linear infinite;
        }

        .vlp-signup {
          text-align: center;
          font-size: 0.8rem;
          color: var(--vlp-muted);
          transition: color 0.5s ease;
        }
        .vlp-signup a {
          color: var(--vlp-accent);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.5s ease;
        }
        .vlp-signup a:hover { text-decoration: underline; }

        .vlp-tos {
          text-align: center;
          font-size: 0.7rem;
          color: var(--vlp-muted);
          margin-top: 1.25rem;
          transition: color 0.5s ease;
        }
        .vlp-tos a { color: var(--vlp-accent); text-decoration: none; transition: color 0.5s ease; }
        .vlp-tos a:hover { text-decoration: underline; }
      `}</style>

      <div className="vlp-root">
        <div className="vlp-wrap">

          {/* Brand side */}
          <div className="vlp-brand">
            <div className="vlp-brand-logo">VENDOR<span>HUB</span></div>
            <div className="vlp-brand-mid">
              <div className="vlp-brand-heading">Grow your business with us.</div>
              <p className="vlp-brand-sub">Sign in to your vendor dashboard — manage products, orders, analytics and more, all in one place.</p>
            </div>
            <div className="vlp-brand-footer">© {new Date().getFullYear()} Vendor Hub. All rights reserved.</div>
          </div>

          {/* Form side */}
          <div className="vlp-form-panel">
            <div className="vlp-form-title">Welcome back, Vendor</div>
            <div className="vlp-form-sub">Sign in to your vendor account to continue</div>

            {error && (
              <div className="vlp-error">
                <span className="vlp-error-dot" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="vlp-field">
                <label className="vlp-label" htmlFor="email">Email address</label>
                <div className="vlp-input-wrap">
                  <svg className="vlp-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    className="vlp-input" type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="vendor@example.com" required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="vlp-field">
                <label className="vlp-label" htmlFor="password">Password</label>
                <div className="vlp-input-wrap">
                  <svg className="vlp-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    className="vlp-input" style={{ paddingRight: '2.5rem' }}
                    type={showPassword ? 'text' : 'password'}
                    id="password" name="password"
                    value={formData.password} onChange={handleChange}
                    placeholder="••••••••" required
                  />
                  <button type="button" className="vlp-pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M15.171 13.576l1.474 1.474a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10C1.732 14.057 5.522 17 10 17a9.958 9.958 0 004.512-1.074l1.78 1.781a1 1 0 001.414-1.414l-1.474-1.474z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="vlp-options">
                <label className="vlp-remember">
                  <input type="checkbox" />
                  Remember me
                </label>
                <Link href="/vendor/forgot-password" className="vlp-forgot">Forgot password?</Link>
              </div>

              {/* Submit */}
              <button type="submit" className="vlp-submit" disabled={loading}>
                {loading ? (
                  <><span className="vlp-spinner" /> Signing in…</>
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

            {/* Sign up */}
            <div className="vlp-signup">
              Don't have a vendor account? <Link href="/vendor/signup">Register here</Link>
            </div>

            <div className="vlp-tos">
              By signing in, you agree to our{' '}
              <Link href="#">Terms of Service</Link> and{' '}
              <Link href="#">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}