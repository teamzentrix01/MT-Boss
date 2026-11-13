'use client';

import RequiredAsterisk from '../../components/RequiredAsterisk';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Smartphone, ArrowRight } from 'lucide-react';
import PartnerMobileOtpAuth from '@/app/components/PartnerMobileOtpAuth';

export default function ServiceProviderLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  // 'mobile' or 'email'
  const [authMode, setAuthMode] = useState('mobile');

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
        localStorage.setItem('service provider-token', data.token);
        localStorage.setItem('service-provider-token', data.token);
        localStorage.setItem('vendor', JSON.stringify(data.vendor || data.user || data));
        localStorage.setItem('service provider', JSON.stringify(data.vendor || data.user || data));
        localStorage.setItem('service-provider', JSON.stringify(data.vendor || data.user || data));
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

  const isDark = dark;
  const brandBlue = 'var(--brand-blue, #2563eb)';

  return (
    <div
      className="sp-login-page"
      suppressHydrationWarning
      style={{
        minHeight: '100vh',
        background: isDark ? '#050505' : '#f5f5f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style suppressHydrationWarning>{`
        .sp-login-page { width: 100%; box-sizing: border-box; }
        .sp-login-card {
          width: 100%;
          max-width: 860px;
          display: flex;
          background: ${isDark ? '#111' : '#fff'};
          border: 1px solid ${isDark ? '#27272a' : '#e5e7eb'};
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }

        .sp-login-brand {
          flex: 0 0 320px;
          background: #0f1115;
          color: #fff;
          padding: 2.75rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .sp-login-form {
          flex: 1;
          padding: 2.5rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: ${isDark ? '#141417' : '#ffffff'};
        }

        .sp-tab-bar {
          display: flex;
          background: ${isDark ? '#1f1f23' : '#f1f5f9'};
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          border: 1px solid ${isDark ? '#2e2e33' : '#e2e8f0'};
        }

        .sp-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0.6rem 0.75rem;
          border-radius: 7px;
          font-size: 0.8125rem;
          font-weight: 700;
          border: none;
          background: transparent;
          color: ${isDark ? '#a1a1aa' : '#64748b'};
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sp-tab-btn.active {
          background: ${isDark ? '#27272a' : '#ffffff'};
          color: ${isDark ? '#ffffff' : '#0f172a'};
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .sp-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .sp-input-icon {
          position: absolute;
          left: 0.9rem;
          color: ${isDark ? '#71717a' : '#9ca3af'};
          pointer-events: none;
        }

        .sp-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 0.9rem 0.75rem 2.6rem;
          border-radius: 10px;
          border: 1px solid ${isDark ? '#3f3f46' : '#d4d4d8'};
          background: ${isDark ? '#18181b' : '#fafafa'};
          color: inherit;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .sp-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
          background: ${isDark ? '#18181b' : '#ffffff'};
        }

        .sp-pw-toggle {
          position: absolute;
          right: 0.85rem;
          background: transparent;
          border: none;
          color: ${isDark ? '#a1a1aa' : '#71717a'};
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .sp-submit-btn {
          width: 100%;
          border: none;
          border-radius: 10px;
          background: var(--brand-blue, #2563eb);
          color: #0f172a;
          padding: 0.85rem 1rem;
          font-weight: 800;
          font-size: 0.925rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: opacity 0.2s, transform 0.1s;
        }

        .sp-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .sp-mode-link {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          border: none !important;
          box-shadow: none !important;
          transform: none !important;
          color: ${isDark ? '#60a5fa' : '#2563eb'} !important;
          font-weight: 600 !important;
          font-size: 0.85rem !important;
          cursor: pointer !important;
          padding: 6px 10px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 4px !important;
          text-decoration: none !important;
          transition: opacity 0.15s ease !important;
        }
        .sp-mode-link:hover {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          transform: none !important;
          text-decoration: underline !important;
          opacity: 0.85 !important;
        }

        @media (max-width: 768px) {
          .sp-login-card {
            flex-direction: column;
          }
          .sp-login-brand { display: none !important; }
          .sp-login-form {
            padding: 2rem 1.25rem;
          }
        }
      `}</style>

      <div className="sp-login-card">
        {/* Brand Side Panel */}
        <div className="sp-login-brand">
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', marginBottom: '2rem' }}>
              MT<span style={{ color: brandBlue }}>BOSS</span>
              <span style={{ marginLeft: 8, fontSize: '0.65rem', fontWeight: 800, color: '#0f172a', background: brandBlue, padding: '3px 8px', borderRadius: 99, letterSpacing: '0.08em' }}>
                SERVICE PROVIDER
              </span>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', lineHeight: 1.28, marginBottom: '0.75rem' }}>
              Grow your business with us.
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.7 }}>
              Manage bookings, track earnings, and serve customers — all from your service provider dashboard.
            </p>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>© {new Date().getFullYear()} MTBOSS. All rights reserved.</div>
        </div>

        {/* Form Panel */}
        <div className="sp-login-form">
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.75rem',
              fontWeight: 700,
              color: isDark ? '#a1a1aa' : '#64748b',
              textDecoration: 'none',
              marginBottom: '1.25rem',
            }}
          >
            ← Back to User Login
          </Link>

          {authMode === 'mobile' ? (
            <div>
              <PartnerMobileOtpAuth
                role="vendor"
                title="Service provider sign in"
                subtitle="Use the mobile number on your approved vendor profile."
                onSuccess={() => router.push('/vendor/dashboard')}
              />

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email');
                    setError('');
                  }}
                  className="sp-mode-link no-global-btn"
                >
                  Sign in with email & password instead →
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ margin: '0 0 .35rem', fontSize: '1.35rem', fontWeight: 800 }}>Service Provider Sign In</h2>
                <p style={{ margin: 0, color: isDark ? '#a1a1aa' : '#64748b', fontSize: '.84rem' }}>
                  Use your registered account email and password.
                </p>
              </div>

              {error && (
                <div style={{
                  padding: '.75rem .95rem',
                  borderRadius: 10,
                  background: isDark ? '#2a0a0a' : '#fff1f2',
                  color: isDark ? '#fca5a5' : '#9f1239',
                  border: `1px solid ${isDark ? '#7f1d1d' : '#fecdd3'}`,
                  fontSize: '.84rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                <div>
                  <label
                    htmlFor="sp-email"
                    style={{
                      display: 'block',
                      fontSize: '.78rem',
                      fontWeight: 700,
                      color: isDark ? '#d4d4d8' : '#374151',
                      marginBottom: '.4rem',
                    }}
                  >
                    Email address <RequiredAsterisk />
                  </label>
                  <div className="sp-input-wrap">
                    <Mail className="sp-input-icon" size={17} strokeWidth={2} />
                    <input
                      id="sp-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="serviceprovider@example.com"
                      required
                      className="sp-input"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="sp-password"
                    style={{
                      display: 'block',
                      fontSize: '.78rem',
                      fontWeight: 700,
                      color: isDark ? '#d4d4d8' : '#374151',
                      marginBottom: '.4rem',
                    }}
                  >
                    Password <RequiredAsterisk />
                  </label>
                  <div className="sp-input-wrap">
                    <Lock className="sp-input-icon" size={17} strokeWidth={2} />
                    <input
                      id="sp-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      required
                      className="sp-input"
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <button
                      type="button"
                      className="sp-pw-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', marginTop: '-0.25rem' }}>
                  <Link href="/forgot-password" style={{ fontSize: '0.8rem', fontWeight: 700, color: brandBlue, textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" disabled={loading} className="sp-submit-btn">
                  {loading ? 'Signing in…' : (
                    <>
                      Sign In
                      <ArrowRight size={16} strokeWidth={2.4} />
                    </>
                  )}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('mobile');
                    setError('');
                  }}
                  className="sp-mode-link no-global-btn"
                >
                  ← Use mobile OTP instead
                </button>
              </div>
            </div>
          )}

          <div style={{
            margin: '1.75rem 0 0',
            paddingTop: '1.25rem',
            borderTop: `1px solid ${isDark ? '#27272a' : '#f1f5f9'}`,
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: '.82rem', color: isDark ? '#888' : '#64748b', lineHeight: 1.6 }}>
              No service provider account?{' '}
              <Link href="/vendor/signup" style={{ color: '#2563eb', fontWeight: 800, textDecoration: 'none' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
