'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        // Check if blocked due to pending/rejected approval
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .sl-root {
          min-height: 100vh;
          background: ${dark ? '#0a0a0a' : '#f0f0f0'};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background-color 0.4s;
        }

        /* Main card with split layout */
        .sl-card {
          width: 100%;
          max-width: 900px;
          display: grid;
          grid-template-columns: 420px 1fr;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
        }

        /* Left panel - dark branding side */
        .sl-left {
          background: ${dark ? '#0d0d0d' : '#111'};
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .sl-left::before {
          content: '';
          position: absolute;
          top: -80px;
          right: -80px;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .sl-left::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: -60px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .sl-logo {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          position: relative;
          z-index: 1;
        }

        .sl-logo span {
          color: #10b981;
        }

        .sl-left-content {
          position: relative;
          z-index: 1;
        }

        .sl-left-heading {
          font-size: 2rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 1rem;
          letter-spacing: -0.03em;
        }

        .sl-left-desc {
          font-size: 0.9rem;
          color: #888;
          line-height: 1.6;
        }

        .sl-copyright {
          font-size: 0.75rem;
          color: #555;
          position: relative;
          z-index: 1;
        }

        /* Right panel - form side */
        .sl-right {
          background: ${dark ? '#1a1a1a' : '#fff'};
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .sl-form-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${dark ? '#fff' : '#111'};
          margin-bottom: 0.4rem;
          letter-spacing: -0.02em;
        }

        .sl-form-subtitle {
          font-size: 0.875rem;
          color: ${dark ? '#888' : '#666'};
          margin-bottom: 2rem;
        }

        /* Generic error message */
        .sl-error {
          padding: 0.875rem 1rem;
          background: ${dark ? '#2d0a0a' : '#fff0f0'};
          border: 1px solid ${dark ? '#7f1d1d' : '#fca5a5'};
          border-radius: 8px;
          color: ${dark ? '#f87171' : '#dc2626'};
          font-size: 0.875rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        /* ── Approval status banners ── */
        .sl-approval-banner {
          border-radius: 10px;
          padding: 1.1rem 1.25rem;
          margin-bottom: 1.25rem;
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }

        .sl-approval-banner.pending {
          background: ${dark ? '#0d1f14' : '#ecfdf5'};
          border: 1px solid ${dark ? '#065f46' : '#6ee7b7'};
        }

        .sl-approval-banner.rejected {
          background: ${dark ? '#2d0a0a' : '#fff0f0'};
          border: 1px solid ${dark ? '#7f1d1d' : '#fca5a5'};
        }

        .sl-banner-icon {
          font-size: 1.4rem;
          flex-shrink: 0;
          margin-top: 0.05rem;
        }

        .sl-banner-body {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sl-banner-title {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .pending .sl-banner-title  { color: ${dark ? '#34d399' : '#065f46'}; }
        .rejected .sl-banner-title { color: ${dark ? '#f87171' : '#dc2626'}; }

        .sl-banner-msg {
          font-size: 0.82rem;
          line-height: 1.55;
        }

        .pending .sl-banner-msg  { color: ${dark ? '#6ee7b7' : '#047857'}; }
        .rejected .sl-banner-msg { color: ${dark ? '#fca5a5' : '#b91c1c'}; }

        /* Form fields */
        .sl-field {
          margin-bottom: 1.1rem;
        }

        .sl-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: ${dark ? '#aaa' : '#555'};
          margin-bottom: 0.5rem;
          letter-spacing: 0.02em;
        }

        .sl-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sl-input-icon {
          position: absolute;
          left: 0.85rem;
          color: ${dark ? '#555' : '#bbb'};
          font-size: 0.95rem;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .sl-input {
          width: 100%;
          padding: 0.75rem 0.875rem 0.75rem 2.5rem;
          border: 1.5px solid ${dark ? '#333' : '#e5e7eb'};
          border-radius: 8px;
          background: ${dark ? '#111' : '#f9fafb'};
          color: ${dark ? '#fff' : '#111'};
          font-size: 0.875rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .sl-input:focus {
          border-color: #10b981;
          background: ${dark ? '#0d1f17' : '#f0fdf4'};
        }

        .sl-input::placeholder {
          color: ${dark ? '#444' : '#c0c0c0'};
        }

        .sl-pwd-toggle {
          position: absolute;
          right: 0.85rem;
          background: none;
          border: none;
          cursor: pointer;
          color: ${dark ? '#555' : '#bbb'};
          display: flex;
          align-items: center;
          padding: 0;
          font-size: 1rem;
          transition: color 0.2s;
        }

        .sl-pwd-toggle:hover {
          color: ${dark ? '#aaa' : '#666'};
        }

        .sl-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          margin-top: 0.25rem;
        }

        .sl-remember {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: ${dark ? '#aaa' : '#555'};
          user-select: none;
        }

        .sl-remember input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #10b981;
          cursor: pointer;
        }

        .sl-forgot {
          font-size: 0.875rem;
          font-weight: 600;
          color: #10b981;
          text-decoration: none;
        }

        .sl-forgot:hover {
          text-decoration: underline;
        }

        .sl-btn {
          width: 100%;
          padding: 0.875rem;
          background: #10b981;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: opacity 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .sl-btn:hover:not(:disabled) {
          opacity: 0.92;
        }

        .sl-btn:active:not(:disabled) {
          transform: scale(0.99);
        }

        .sl-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .sl-register {
          text-align: center;
          font-size: 0.875rem;
          color: ${dark ? '#777' : '#888'};
          margin-top: 1.25rem;
        }

        .sl-register a {
          color: #10b981;
          font-weight: 700;
          text-decoration: none;
        }

        .sl-register a:hover {
          text-decoration: underline;
        }

        .sl-terms {
          text-align: center;
          font-size: 0.75rem;
          color: ${dark ? '#555' : '#aaa'};
          margin-top: 1.25rem;
          line-height: 1.5;
        }

        .sl-terms a {
          color: ${dark ? '#777' : '#888'};
          text-decoration: none;
        }

        .sl-terms a:hover {
          text-decoration: underline;
        }

        @media (max-width: 700px) {
          .sl-card {
            grid-template-columns: 1fr;
          }
          .sl-left {
            padding: 2rem 1.75rem;
            min-height: 200px;
          }
          .sl-left-heading {
            font-size: 1.5rem;
          }
          .sl-copyright {
            display: none;
          }
          .sl-right {
            padding: 2rem 1.75rem;
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .sl-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>

      <div className="sl-root">
        <div className="sl-card">

          {/* ── Left branding panel ── */}
          <div className="sl-left">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="sl-logo">SUPPLIER<span>HUB</span></div>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: '#666', textDecoration: 'none', padding: '0.35rem 0.75rem', border: '1px solid #333', borderRadius: 6, transition: 'all 0.2s', position: 'relative', zIndex: 1 }}
                onMouseEnter={e => { e.currentTarget.style.color = '#10b981'; e.currentTarget.style.borderColor = '#10b981'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#333'; }}>
                ← Home
              </Link>
            </div>

            <div className="sl-left-content">
              <div className="sl-left-heading">
                Grow your business<br />with us.
              </div>
              <div className="sl-left-desc">
                Sign in to your supplier dashboard —<br />
                manage products, orders, analytics and<br />
                more, all in one place.
              </div>
            </div>

            <div className="sl-copyright">
              © {new Date().getFullYear()} Supplier Hub. All rights reserved.
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div className="sl-right">
            <div className="sl-form-title">Welcome back, Supplier</div>
            <div className="sl-form-subtitle">Sign in to your supplier account to continue</div>

            {/* Generic error */}
            {error && (
              <div className="sl-error">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Pending approval banner */}
            {approvalStatus === 'pending' && (
              <div className="sl-approval-banner pending">
                <span className="sl-banner-icon">⏳</span>
                <div className="sl-banner-body">
                  <div className="sl-banner-title">Account Pending Approval</div>
                  <div className="sl-banner-msg">
                    Your account is under review by our admin team. You will be notified once approved. Please check back later.
                  </div>
                </div>
              </div>
            )}

            {/* Rejected banner */}
            {approvalStatus === 'rejected' && (
              <div className="sl-approval-banner rejected">
                <span className="sl-banner-icon">🚫</span>
                <div className="sl-banner-body">
                  <div className="sl-banner-title">Account Not Approved</div>
                  <div className="sl-banner-msg">
                    Your supplier account was not approved. Please contact support for more information.
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Email field */}
              <div className="sl-field">
                <label className="sl-label">Email address</label>
                <div className="sl-input-wrap">
                  <span className="sl-input-icon">✉</span>
                  <input
                    className="sl-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="supplier@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="sl-field">
                <label className="sl-label">Password</label>
                <div className="sl-input-wrap">
                  <span className="sl-input-icon">🔒</span>
                  <input
                    className="sl-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="sl-pwd-toggle"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="sl-options">
                <label className="sl-remember">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <Link href="/supplier/forgot-password" className="sl-forgot">
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="sl-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="sl-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>Sign In →</>
                )}
              </button>
            </form>

            {/* Register link */}
            <div className="sl-register">
              Don&apos;t have a supplier account?{' '}
              <Link href="/supplier/signup">Register here</Link>
            </div>

            {/* Terms */}
            <div className="sl-terms">
              By signing in, you agree to our{' '}
              <Link href="/terms">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
