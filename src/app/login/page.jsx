'use client';

import RequiredAsterisk from '../components/RequiredAsterisk';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { clearWebSessionExcept } from '@/lib/client-session';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Building2,
  Wrench,
  MessageSquare,
  Briefcase,
  Package,
} from 'lucide-react';

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
    const params = new URLSearchParams(window.location.search);
    setRedirectParam(params.get('redirect') || '');
    const errorParam = params.get('error');
    if (errorParam) {
      setError(
        errorParam === 'account_suspended'
          ? 'Your account has been suspended. Contact support for assistance.'
          : decodeURIComponent(errorParam)
      );
    }
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
        const role = data.user?.role === 'admin' ? 'admin' : 'user';
        clearWebSessionExcept(role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user?.role === 'admin') {
          localStorage.setItem('admin-token', data.token);
          localStorage.setItem('admin', JSON.stringify(data.user));
        }
        window.dispatchEvent(new Event('userLoggedIn'));
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
          --lp-bg:      ${dark ? '#0a0a0c' : '#eef1f6'};
          --lp-surface: ${dark ? '#111114' : '#ffffff'};
          --lp-border:  ${dark ? 'rgba(148, 163, 184, 0.2)' : '#e2e8f0'};
          --lp-text:    ${dark ? '#f8fafc' : '#0f172a'};
          --lp-muted:   ${dark ? '#94a3b8' : '#64748b'};
          --lp-accent:  #2563eb;
          --lp-accent-light: #3b82f6;
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
          transition: background-color 0.5s ease;
        }

        .lp-wrap {
          display: flex;
          width: 100%;
          max-width: 920px;
          min-height: 560px;
          background: var(--lp-surface);
          border: 1px solid var(--lp-border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(15, 23, 42, 0.04);
          transition: background-color 0.5s ease, border-color 0.5s ease;
        }

        .lp-brand {
          flex: 0 0 340px;
          position: relative;
          padding: 2rem 2rem 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          background: linear-gradient(165deg, #0c1929 0%, #060b14 45%, #0a1020 100%);
        }
        .lp-brand-grid {
          pointer-events: none;
          position: absolute;
          inset: 0;
          opacity: 0.45;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .lp-brand-glow {
          pointer-events: none;
          position: absolute;
          width: 280px;
          height: 280px;
          left: 50%;
          top: 42%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, rgba(37, 99, 235, 0.06) 45%, transparent 70%);
        }
        .lp-brand-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        @media (max-width: 720px) {
          .lp-brand { display: none; }
          .lp-wrap { min-height: auto; }
        }

        .lp-brand-top { margin-bottom: 2.5rem; }

        .lp-brand-logo-row {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 1rem;
        }
        .lp-brand-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(145deg, #1d4ed8 0%, #2563eb 55%, #3b82f6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
          overflow: hidden;
        }
        .lp-brand-logo-text {
          font-size: 1.125rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
        }
        .lp-brand-logo-text span { color: #60a5fa; }

        .lp-admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.65rem;
          border-radius: 999px;
          font-size: 0.6875rem;
          font-weight: 600;
          color: #93c5fd;
          background: rgba(37, 99, 235, 0.12);
          border: 1px solid rgba(96, 165, 250, 0.25);
        }

        .lp-brand-mid { flex: 1; display: flex; flex-direction: column; justify-content: center; }

        .lp-brand-heading {
          font-size: 1.625rem;
          font-weight: 700;
          color: #f8fafc;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-bottom: 0.875rem;
        }
        .lp-brand-heading em {
          font-style: normal;
          color: #60a5fa;
        }
        .lp-brand-sub {
          font-size: 0.8125rem;
          color: #94a3b8;
          line-height: 1.65;
          max-width: 280px;
        }

        .lp-feature-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1.75rem;
        }
        .lp-feature-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          border-radius: 8px;
          font-size: 0.6875rem;
          font-weight: 600;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(148, 163, 184, 0.15);
        }

        .lp-brand-footer {
          position: relative;
          z-index: 1;
          font-size: 0.6875rem;
          color: #64748b;
          margin-top: 1.5rem;
        }

        .lp-form-panel {
          flex: 1;
          padding: 2.5rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--lp-surface);
          transition: background-color 0.5s ease;
        }
        @media (max-width: 480px) {
          .lp-form-panel { padding: 1.75rem 1.25rem; }
        }

        .lp-form-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--lp-text);
          margin-bottom: 0.35rem;
          letter-spacing: -0.02em;
          transition: color 0.5s ease;
        }
        .lp-form-sub {
          font-size: 0.875rem;
          color: var(--lp-muted);
          margin-bottom: 1.75rem;
          transition: color 0.5s ease;
        }

        .lp-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 0.875rem;
          background: var(--lp-err-bg);
          border: 1px solid var(--lp-err-br);
          border-radius: 8px;
          font-size: 0.8125rem;
          color: var(--lp-err-tx);
          margin-bottom: 1rem;
        }
        .lp-error-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--lp-err-tx);
          flex-shrink: 0;
        }

        .lp-field { margin-bottom: 1rem; }
        .lp-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--lp-text);
          margin-bottom: 0.4rem;
          transition: color 0.5s ease;
        }
        .lp-input-wrap { position: relative; }
        .lp-input-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--lp-muted);
          pointer-events: none;
        }
        .lp-input {
          width: 100%;
          padding: 0.625rem 0.875rem 0.625rem 2.5rem;
          border: 1px solid var(--lp-border);
          border-radius: 10px;
          background: ${dark ? '#0f172a' : '#f8fafc'};
          color: var(--lp-text);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background-color 0.5s ease, color 0.5s ease;
          box-sizing: border-box;
        }
        .lp-input::placeholder { color: ${dark ? '#64748b' : '#94a3b8'}; }
        .lp-input:focus {
          border-color: var(--lp-accent);
          background: ${dark ? '#0f172a' : '#fff'};
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .lp-pw-toggle {
          position: absolute;
          right: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--lp-muted);
          padding: 0; display: flex;
          transition: color 0.15s;
        }
        .lp-pw-toggle:hover { color: var(--lp-text); }

        .lp-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.35rem;
        }
        .lp-remember {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.8125rem; color: var(--lp-muted);
          cursor: pointer;
        }
        .lp-remember input { accent-color: var(--lp-accent); cursor: pointer; width: 15px; height: 15px; }
        .lp-forgot {
          font-size: 0.8125rem;
          color: var(--lp-accent);
          text-decoration: none;
          font-weight: 600;
          transition: opacity 0.15s;
        }
        .lp-forgot:hover { opacity: 0.75; }

        .lp-submit {
          width: 100%;
          padding: 0.7rem 1rem;
          background: linear-gradient(180deg, var(--lp-accent-light) 0%, var(--lp-accent) 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          margin-bottom: 1.35rem;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }
        .lp-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }
        .lp-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        @keyframes lp-spin { to { transform: rotate(360deg); } }
        .lp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: lp-spin .7s linear infinite;
        }

        .lp-divider {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .lp-divider-line { flex: 1; height: 1px; background: var(--lp-border); }
        .lp-divider-text { font-size: 0.6875rem; color: var(--lp-muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }

        .lp-social { margin-bottom: 1.25rem; }
        .lp-social-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--lp-border);
          border-radius: 10px;
          background: var(--lp-surface);
          color: var(--lp-text);
          font-size: 0.875rem; font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
        }
        .lp-social-btn:hover {
          background: ${dark ? '#1e293b' : '#f8fafc'};
          border-color: ${dark ? '#475569' : '#cbd5e1'};
        }

        .lp-signup {
          text-align: center;
          font-size: 0.875rem;
          color: var(--lp-muted);
        }
        .lp-signup a {
          color: var(--lp-accent);
          font-weight: 600;
          text-decoration: none;
        }
        .lp-signup a:hover { text-decoration: underline; }

        .lp-alt-logins {
          margin-top: 1.25rem;
          padding-top: 1.15rem;
          border-top: 1px solid var(--lp-border);
          display: flex;
          gap: 0.625rem;
        }
        .lp-alt-login {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.55rem 0.5rem;
          border-radius: 10px;
          font-size: 0.6875rem;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.15s, background 0.15s;
        }
        .lp-alt-login--vendor {
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.45);
          background: ${dark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.06)'};
        }
        .lp-alt-login--supplier {
          color: #4f46e5;
          border: 1px solid rgba(99, 102, 241, 0.45);
          background: ${dark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.06)'};
        }
        .lp-alt-login:hover { opacity: 0.88; }
      `}</style>

      <div className="lp-root">
        <div className="lp-wrap">

          <div className="lp-brand">
            <div className="lp-brand-grid" aria-hidden />
            <div className="lp-brand-glow" aria-hidden />
            <div className="lp-brand-inner">
              <div className="lp-brand-top">
                <div className="lp-brand-logo-row">
                  <div className="lp-brand-logo-icon">
                    <Image src="/logo.png" alt="" width={28} height={28} style={{ objectFit: 'contain' }} />
                  </div>
                  <div className="lp-brand-logo-text">MT<span>BOSS</span></div>
                </div>
                <div className="lp-admin-badge">
                  <Shield size={12} strokeWidth={2.25} />
                  Admin portal
                </div>
              </div>

              <div className="lp-brand-mid">
                <h1 className="lp-brand-heading">
                  Manage your properties with <em>confidence.</em>
                </h1>
                <p className="lp-brand-sub">
                  Sign in to access the admin dashboard — properties, services, enquiries and more, all in one place.
                </p>
                <div className="lp-feature-chips">
                  <span className="lp-feature-chip">
                    <Building2 size={13} strokeWidth={2} />
                    Properties
                  </span>
                  <span className="lp-feature-chip">
                    <Wrench size={13} strokeWidth={2} />
                    Services
                  </span>
                  <span className="lp-feature-chip">
                    <MessageSquare size={13} strokeWidth={2} />
                    Enquiries
                  </span>
                </div>
              </div>

              <div className="lp-brand-footer">© {new Date().getFullYear()} MTBOSS. All rights reserved.</div>
            </div>
          </div>

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
              <div className="lp-field">
                <label className="lp-label" htmlFor="email">Email address <RequiredAsterisk /></label>
                <div className="lp-input-wrap">
                  <Mail className="lp-input-icon" size={17} strokeWidth={2} />
                  <input
                    className="lp-input"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="lp-field">
                <label className="lp-label" htmlFor="password">Password <RequiredAsterisk /></label>
                <div className="lp-input-wrap">
                  <Lock className="lp-input-icon" size={17} strokeWidth={2} />
                  <input
                    className="lp-input"
                    style={{ paddingRight: '2.75rem' }}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button type="button" className="lp-pw-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              <div className="lp-options">
                <label className="lp-remember">
                  <input type="checkbox" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="lp-forgot">Forgot password?</Link>
              </div>

              <button type="submit" className="lp-submit" disabled={loading}>
                {loading ? (
                  <><span className="lp-spinner" /> Signing in…</>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={17} strokeWidth={2.25} />
                  </>
                )}
              </button>
            </form>

            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-text">or</span>
              <div className="lp-divider-line" />
            </div>

            <div className="lp-social">
              <button type="button" className="lp-social-btn" onClick={handleGoogleLogin}>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="lp-signup">
              Don&apos;t have an account?{' '}
              <Link href={redirectParam ? `/signup?redirect=${encodeURIComponent(redirectParam)}` : '/signup'}>
                Create one
              </Link>
            </div>

            <div className="lp-alt-logins">
              <Link href="/vendor/login" className="lp-alt-login lp-alt-login--vendor">
                <Briefcase size={14} strokeWidth={2} />
                Service Provider Login
              </Link>
              <Link href="/supplier/login" className="lp-alt-login lp-alt-login--supplier">
                <Package size={14} strokeWidth={2} />
                Vendor Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
