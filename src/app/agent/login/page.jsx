'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Smartphone, ArrowRight } from 'lucide-react';
import { clearWebSessionExcept } from '@/lib/client-session';
import PartnerMobileOtpAuth from '@/app/components/PartnerMobileOtpAuth';
import RequiredAsterisk from '@/app/components/RequiredAsterisk';

export default function AgentLoginPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const email = form.email.trim().toLowerCase();
    if (!email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch('/api/agent/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, email }),
        signal: controller.signal,
      });
      let data = {};
      try {
        data = await res.json();
      } catch {
        setError('Unexpected server response. Please try again.');
        return;
      }
      if (!res.ok) {
        setError(data.error || 'Invalid credentials.');
        return;
      }

      clearWebSessionExcept('agent');
      localStorage.setItem('agent-token', data.token);
      localStorage.setItem('agent', JSON.stringify(data.agent));
      window.dispatchEvent(new Event('userLoggedIn'));
      const agent = data.agent || {};
      if (agent.has_project_management_access) {
        router.replace('/dashboard?tab=overview');
      } else {
        router.replace('/agent/dashboard');
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        setError('Sign-in timed out. Please check your connection and try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  const handleOtpSuccess = (data) => {
    const agent = data.agent || {};
    if (agent.has_project_management_access) {
      router.replace('/dashboard?tab=overview');
    } else {
      router.replace('/agent/dashboard');
    }
  };

  const isDark = dark;
  const brandBlue = 'var(--brand-blue, #2563eb)';

  return (
    <main
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
      <style>{`
        .al-card {
          width: 100%;
          max-width: 860px;
          display: flex;
          background: ${isDark ? '#111' : '#fff'};
          border: 1px solid ${isDark ? '#27272a' : '#e5e7eb'};
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }

        .al-left {
          flex: 0 0 320px;
          background: #0f1115;
          color: #fff;
          padding: 2.75rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .al-right {
          flex: 1;
          padding: 2.5rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: ${isDark ? '#141417' : '#ffffff'};
        }

        .al-tab-bar {
          display: flex;
          background: ${isDark ? '#1f1f23' : '#f1f5f9'};
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          border: 1px solid ${isDark ? '#2e2e33' : '#e2e8f0'};
        }

        .al-tab-btn {
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

        .al-tab-btn.active {
          background: ${isDark ? '#27272a' : '#ffffff'};
          color: ${isDark ? '#ffffff' : '#0f172a'};
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .al-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .al-input-icon {
          position: absolute;
          left: 0.9rem;
          color: ${isDark ? '#71717a' : '#9ca3af'};
          pointer-events: none;
        }

        .al-input {
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

        .al-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
          background: ${isDark ? '#18181b' : '#ffffff'};
        }

        .al-pw-toggle {
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

        .al-submit-btn {
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

        .al-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .al-card {
            flex-direction: column;
          }
          .al-left {
            display: none !important;
          }
          .al-right {
            padding: 2rem 1.25rem;
          }
        }
      `}</style>

      <div className="al-card">
        <section className="al-left">
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', marginBottom: '2rem' }}>
              MT<span style={{ color: brandBlue }}>BOSS</span>
              <span style={{ marginLeft: 8, fontSize: 10, color: '#0f172a', background: brandBlue, padding: '3px 8px', borderRadius: 99, fontWeight: 800 }}>AGENT</span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: 1.28, marginBottom: 12 }}>Manage your city leads with focus.</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>Sign in with your registered mobile OTP or authorized agent credentials. Agents with project access can open the admin panel after login.</p>
          </div>
          <p style={{ fontSize: 11, color: '#64748b' }}>Approved agents only</p>
        </section>

        <section className="al-right">
          <Link href="/login" prefetch={false} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: isDark ? '#a1a1aa' : '#64748b', fontSize: 12, fontWeight: 700, textDecoration: 'none', marginBottom: '1.25rem' }}>
            ← Back to customer login
          </Link>

          {authMode === 'mobile' ? (
            <div>
              <PartnerMobileOtpAuth
                role="agent"
                title="Agent sign in"
                subtitle="Use the mobile number linked to your approved agent profile."
                onSuccess={handleOtpSuccess}
              />

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email');
                    setError('');
                  }}
                  style={{
                    border: 0,
                    background: 'transparent',
                    color: brandBlue,
                    fontWeight: 700,
                    fontSize: '.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Sign in with email & password instead →
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ margin: '0 0 .35rem', fontSize: '1.35rem', fontWeight: 800 }}>Agent Sign In</h2>
                <p style={{ margin: 0, color: isDark ? '#a1a1aa' : '#64748b', fontSize: '.84rem' }}>
                  Use the credentials sent by admin after approval.
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
                    htmlFor="al-email"
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
                  <div className="al-input-wrap">
                    <Mail className="al-input-icon" size={17} strokeWidth={2} />
                    <input
                      id="al-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="agent@example.com"
                      required
                      className="al-input"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="al-password"
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
                  <div className="al-input-wrap">
                    <Lock className="al-input-icon" size={17} strokeWidth={2} />
                    <input
                      id="al-password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                      className="al-input"
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <button
                      type="button"
                      className="al-pw-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="al-submit-btn">
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
                  style={{
                    border: 0,
                    background: 'transparent',
                    color: brandBlue,
                    fontWeight: 700,
                    fontSize: '.82rem',
                    cursor: 'pointer',
                  }}
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
              Platform admin?{' '}
              <Link href="/login?admin=1" style={{ color: '#2563eb', fontWeight: 800, textDecoration: 'none' }}>
                Admin sign-in (email)
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
