'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Smartphone, Shield, ArrowRight } from 'lucide-react';
import PartnerMobileOtpAuth from '@/app/components/PartnerMobileOtpAuth';
import RequiredAsterisk from '@/app/components/RequiredAsterisk';

export default function FranchiseLoginPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  // 'mobile' or 'email'
  const [authMode, setAuthMode] = useState('mobile');

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    const email = form.email.trim();
    if (!email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/franchise/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid franchise credentials.');
        return;
      }

      localStorage.setItem('franchise-token', data.token);
      localStorage.setItem('franchise', JSON.stringify(data.franchise));
      window.dispatchEvent(new Event('userLoggedIn'));
      router.push('/franchise/dashboard');
    } catch {
      setError('Could not sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = dark;
  const brandBlue = 'var(--brand-blue, #2563eb)';

  return (
    <main
      className="fl-main"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: isDark ? '#050505' : '#f5f5f7',
        color: isDark ? '#fff' : '#111',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        .fl-section {
          width: 100%;
          max-width: 880px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(340px, 440px);
          background: ${isDark ? '#111' : '#fff'};
          border: 1px solid ${isDark ? '#27272a' : '#e5e7eb'};
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }

        .fl-left-panel {
          padding: 2.75rem 2.25rem;
          background: #0f1115;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 480px;
          position: relative;
        }

        .fl-right-panel {
          padding: 2.5rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: ${isDark ? '#141417' : '#ffffff'};
        }

        .fl-tab-bar {
          display: flex;
          background: ${isDark ? '#1f1f23' : '#f1f5f9'};
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          border: 1px solid ${isDark ? '#2e2e33' : '#e2e8f0'};
        }

        .fl-tab-btn {
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

        .fl-tab-btn.active {
          background: ${isDark ? '#27272a' : '#ffffff'};
          color: ${isDark ? '#ffffff' : '#0f172a'};
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .fl-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .fl-input-icon {
          position: absolute;
          left: 0.9rem;
          color: ${isDark ? '#71717a' : '#9ca3af'};
          pointer-events: none;
        }

        .fl-input {
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

        .fl-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
          background: ${isDark ? '#18181b' : '#ffffff'};
        }

        .fl-pw-toggle {
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

        .fl-submit-btn {
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

        .fl-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .fl-mode-link {
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
        .fl-mode-link:hover {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          transform: none !important;
          text-decoration: underline !important;
          opacity: 0.85 !important;
        }

        @media (max-width: 768px) {
          .fl-section {
            grid-template-columns: 1fr;
          }
          .fl-left-panel {
            min-height: auto;
            padding: 2rem 1.5rem;
          }
          .fl-right-panel {
            padding: 2rem 1.25rem;
          }
        }
      `}</style>

      <section className="fl-section">
        <div className="fl-left-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <strong style={{ letterSpacing: '-.03em', fontSize: '1.15rem' }}>
              MT<span style={{ color: brandBlue }}>BOSS</span>
            </strong>
            <Link href="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '.8rem', fontWeight: 700 }}>
              Home
            </Link>
          </div>

          <div style={{ margin: '2rem 0' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(37,99,235,0.15)',
              border: '1px solid rgba(37,99,235,0.3)',
              borderRadius: 99,
              padding: '4px 12px',
              color: '#60a5fa',
              fontSize: '.72rem',
              fontWeight: 800,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              <Shield size={12} strokeWidth={2.5} />
              Franchise Portal
            </div>

            <h1 style={{ fontSize: '2.1rem', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-.04em' }}>
              Manage your approved territory.
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '.9rem', lineHeight: 1.7, maxWidth: 360, margin: 0 }}>
              Sign in with your registered mobile OTP or authorized account credentials to oversee territorial leads, assign agents, and monitor projects.
            </p>
          </div>

          <small style={{ color: '#64748b', fontSize: '.75rem' }}>
            Authorized franchise access only.
          </small>
        </div>

        <div className="fl-right-panel">
          {authMode === 'mobile' ? (
            <div>
              <PartnerMobileOtpAuth
                role="franchise"
                title="Franchise sign in"
                subtitle="Use the mobile number linked to your approved franchise account."
                onSuccess={() => router.push('/franchise/dashboard')}
              />

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email');
                    setError('');
                  }}
                  className="fl-mode-link no-global-btn"
                >
                  Sign in with email & password instead →
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ margin: '0 0 .35rem', fontSize: '1.35rem', fontWeight: 800 }}>Franchise Sign In</h2>
                <p style={{ margin: 0, color: isDark ? '#a1a1aa' : '#64748b', fontSize: '.84rem' }}>
                  Enter your approved account email and password.
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

              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                <div>
                  <label
                    htmlFor="fl-email"
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
                  <div className="fl-input-wrap">
                    <Mail className="fl-input-icon" size={17} strokeWidth={2} />
                    <input
                      id="fl-email"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      autoComplete="email"
                      placeholder="franchise@mtboss.in"
                      required
                      className="fl-input"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fl-password"
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
                  <div className="fl-input-wrap">
                    <Lock className="fl-input-icon" size={17} strokeWidth={2} />
                    <input
                      id="fl-password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      required
                      className="fl-input"
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <button
                      type="button"
                      className="fl-pw-toggle"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.25rem 0' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.84rem', color: isDark ? '#a1a1aa' : '#4b5563', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={form.rememberMe}
                      onChange={e => setForm(f => ({ ...f, rememberMe: e.target.checked }))}
                      style={{ accentColor: '#2563eb', cursor: 'pointer' }}
                    />
                    Remember me
                  </label>
                </div>

                <button type="submit" disabled={loading} className="fl-submit-btn">
                  {loading ? 'Signing in...' : (
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
                  className="fl-mode-link no-global-btn"
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
              Do not have credentials yet? Submit the{' '}
              <Link href="/franchise" style={{ color: '#2563eb', fontWeight: 800, textDecoration: 'none' }}>
                franchise form
              </Link>{' '}
              and wait for admin approval.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
