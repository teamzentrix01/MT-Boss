'use client';

import RequiredAsterisk from '../../components/RequiredAsterisk';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Smartphone, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import PartnerMobileOtpAuth from '@/app/components/PartnerMobileOtpAuth';

export default function SupplierLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);

  // 'idle' | 'pending' | 'rejected'
  const [approvalStatus, setApprovalStatus] = useState('idle');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  // 'mobile' or 'email'
  const [authMode, setAuthMode] = useState('mobile');

  // Monitor dark mode
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
    if (approvalStatus !== 'idle') setApprovalStatus('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) { setError('Email address is required.'); return; }
    if (!emailRegex.test(formData.email)) { setError('Please enter a valid email address.'); return; }
    if (!formData.password) { setError('Password is required.'); return; }

    setLoading(true);
    setError('');
    setApprovalStatus('idle');

    try {
      const res = await fetch('/api/supplier/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('supplier-token', data.token);
        localStorage.setItem('supplier', JSON.stringify(data.supplier));
        router.push('/supplier/dashboard');
      } else {
        if (data.status === 'pending') {
          setApprovalStatus('pending');
        } else if (data.status === 'rejected') {
          setApprovalStatus('rejected');
        } else {
          setError(data.error || 'Invalid email or password');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDark = dark;
  const brandGreen = '#10b981';

  return (
    <div
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
        .sup-card {
          width: 100%;
          max-width: 880px;
          display: flex;
          background: ${isDark ? '#111' : '#fff'};
          border: 1px solid ${isDark ? '#27272a' : '#e5e7eb'};
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }

        .sup-left {
          flex: 0 0 340px;
          background: #0f1115;
          color: #fff;
          padding: 2.75rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .sup-right {
          flex: 1;
          padding: 2.5rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: ${isDark ? '#141417' : '#ffffff'};
        }

        .sup-tab-bar {
          display: flex;
          background: ${isDark ? '#1f1f23' : '#f1f5f9'};
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 1.5rem;
          border: 1px solid ${isDark ? '#2e2e33' : '#e2e8f0'};
        }

        .sup-tab-btn {
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

        .sup-tab-btn.active {
          background: ${isDark ? '#27272a' : '#ffffff'};
          color: ${isDark ? '#ffffff' : '#0f172a'};
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .sup-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .sup-input-icon {
          position: absolute;
          left: 0.9rem;
          color: ${isDark ? '#71717a' : '#9ca3af'};
          pointer-events: none;
        }

        .sup-input {
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

        .sup-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
          background: ${isDark ? '#18181b' : '#ffffff'};
        }

        .sup-pw-toggle {
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

        .sup-submit-btn {
          width: 100%;
          border: none;
          border-radius: 10px;
          background: #10b981;
          color: #ffffff;
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

        .sup-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .sup-mode-link {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          border: none !important;
          box-shadow: none !important;
          transform: none !important;
          color: #10b981 !important;
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
        .sup-mode-link:hover {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          transform: none !important;
          text-decoration: underline !important;
          opacity: 0.85 !important;
        }

        @media (max-width: 768px) {
          .sup-card {
            flex-direction: column;
          }
          .sup-left {
            display: none !important;
          }
          .sup-right {
            padding: 2rem 1.25rem;
          }
        }
      `}</style>

      <div className="sup-card">
        {/* Left Branding Panel */}
        <div className="sup-left">
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', marginBottom: '2rem' }}>
              MT<span style={{ color: brandGreen }}>BOSS</span>
              <span style={{ marginLeft: 8, fontSize: '0.65rem', fontWeight: 800, color: '#fff', background: '#059669', padding: '3px 8px', borderRadius: 99, letterSpacing: '0.08em' }}>
                SUPPLIER
              </span>
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', lineHeight: 1.28, marginBottom: '0.75rem' }}>
              Supplier & Partner Portal
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.7 }}>
              Manage material inventory, process direct supply orders, track payouts, and communicate with project teams seamlessly.
            </p>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>© {new Date().getFullYear()} MTBOSS. All rights reserved.</div>
        </div>

        {/* Right Form Panel */}
        <div className="sup-right">
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
            ← Back to Customer Login
          </Link>

          {authMode === 'mobile' ? (
            <div>
              <PartnerMobileOtpAuth
                role="supplier"
                title="Supplier sign in"
                subtitle="Use the mobile number on your approved supplier account."
                onSuccess={() => router.push('/supplier/dashboard')}
              />

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('email');
                    setError('');
                  }}
                  className="sup-mode-link no-global-btn"
                >
                  Sign in with email & password instead →
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ margin: '0 0 .35rem', fontSize: '1.35rem', fontWeight: 800 }}>Supplier Sign In</h2>
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

              {approvalStatus === 'pending' && (
                <div style={{
                  padding: '.85rem 1rem',
                  borderRadius: 10,
                  background: isDark ? '#2a1f0a' : '#fffbeb',
                  color: isDark ? '#fde68a' : '#b45309',
                  border: `1px solid ${isDark ? '#78350f' : '#fde68a'}`,
                  fontSize: '.84rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <Clock size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 2 }}>Account Pending Approval</div>
                    <div style={{ fontSize: '.8rem', opacity: 0.9 }}>
                      Your account is under review by our admin team. You will be notified once approved. Please check back later.
                    </div>
                  </div>
                </div>
              )}

              {approvalStatus === 'rejected' && (
                <div style={{
                  padding: '.85rem 1rem',
                  borderRadius: 10,
                  background: isDark ? '#2a0a0a' : '#fff1f2',
                  color: isDark ? '#fca5a5' : '#9f1239',
                  border: `1px solid ${isDark ? '#7f1d1d' : '#fecdd3'}`,
                  fontSize: '.84rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 2 }}>Account Not Approved</div>
                    <div style={{ fontSize: '.8rem', opacity: 0.9 }}>
                      Your supplier account was not approved. Please contact support for more information.
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                <div>
                  <label
                    htmlFor="sup-email"
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
                  <div className="sup-input-wrap">
                    <Mail className="sup-input-icon" size={17} strokeWidth={2} />
                    <input
                      id="sup-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="supplier@example.com"
                      autoComplete="email"
                      required
                      className="sup-input"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="sup-password"
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
                  <div className="sup-input-wrap">
                    <Lock className="sup-input-icon" size={17} strokeWidth={2} />
                    <input
                      id="sup-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      required
                      className="sup-input"
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <button
                      type="button"
                      className="sup-pw-toggle"
                      onClick={() => setShowPassword(p => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-0.25rem' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', fontSize: '.84rem', color: isDark ? '#a1a1aa' : '#4b5563', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      style={{ accentColor: '#10b981', cursor: 'pointer' }}
                    />
                    Remember me
                  </label>
                  <Link href="/supplier/forgot-password" style={{ fontSize: '0.8rem', fontWeight: 700, color: brandGreen, textDecoration: 'none' }}>
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" disabled={loading} className="sup-submit-btn">
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
                  className="sup-mode-link no-global-btn"
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
            <p style={{ margin: '0 0 0.5rem', fontSize: '.82rem', color: isDark ? '#888' : '#64748b' }}>
              Don&apos;t have a supplier account?{' '}
              <Link href="/supplier/signup" style={{ color: brandGreen, fontWeight: 800, textDecoration: 'none' }}>
                Register here
              </Link>
            </p>
            <div style={{ fontSize: '.72rem', color: isDark ? '#666' : '#9ca3af' }}>
              By signing in, you agree to our{' '}
              <Link href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms</Link>{' '}
              and{' '}
              <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
