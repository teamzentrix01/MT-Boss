'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ContractorLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: true });

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
      const res = await fetch('/api/contractor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('contractor-token', data.token);
        localStorage.setItem('contractor', JSON.stringify(data.contractor || data.user));
        localStorage.setItem('user', JSON.stringify(data.user || data.contractor));
        window.dispatchEvent(new Event('userLoggedIn'));
        router.push('/contractor/dashboard');
      } else {
        setError(data.error || data.message || 'Invalid credentials.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bg = dark ? '#0a0a0c' : '#f4f5f8';
  const surface = dark ? '#121216' : '#ffffff';
  const border = dark ? '#26262e' : '#e2e4e9';
  const text = dark ? '#ffffff' : '#111216';
  const muted = dark ? '#82848f' : '#6b7280';
  const inputBg = dark ? '#18181e' : '#f9fafb';
  const brandColor = '#2563eb';

  return (
    <div className="contractor-login-page" style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", transition: 'background 0.3s' }}>
      <style>{`
        .contractor-login-page { width: 100%; box-sizing: border-box; }
        .contractor-login-card { min-width: 0; }
        @media (max-width: 680px) {
          .contractor-brand-panel { display: none !important; }
          .contractor-login-card { max-width: 440px !important; }
        }
      `}</style>

      <div className="contractor-login-card" style={{ display: 'flex', width: '100%', maxWidth: 860, background: surface, border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,.1)', transition: 'all 0.3s' }}>
        
        {/* Left Brand Panel */}
        <div className="contractor-brand-panel" style={{ flex: '0 0 320px', background: 'linear-gradient(135deg, #0b1528 0%, #0f224a 50%, #1e3a8a 100%)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.1)', padding: '0.4rem 0.85rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '2rem', backdropFilter: 'blur(10px)' }}>
              <span>🏗️</span>
              <span style={{ color: '#93c5fd' }}>Contractor Hub</span>
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.25, margin: '0 0 1rem', color: '#fff' }}>
              MT-BOSS Contractor Portal
            </h2>

            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 2rem' }}>
              Manage ongoing construction sites, assign labor attendance, track material usage, and view verified milestone payouts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: '#e2e8f0' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(59,130,246,0.3)', color: '#60a5fa', fontWeight: 700 }}>✓</span>
                <span>Direct Site Projects & Work Orders</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: '#e2e8f0' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(59,130,246,0.3)', color: '#60a5fa', fontWeight: 700 }}>✓</span>
                <span>Daily Worker & Labor Attendance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: '#e2e8f0' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(59,130,246,0.3)', color: '#60a5fa', fontWeight: 700 }}>✓</span>
                <span>Material Requests & Invoices</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: '#e2e8f0' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(59,130,246,0.3)', color: '#60a5fa', fontWeight: 700 }}>✓</span>
                <span>Guaranteed Milestone Payouts</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', marginTop: '2rem' }}>
            Civil · Structural · RCC · MEP · Interior Fitouts
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{ flex: 1, padding: '2.5rem 2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: text, margin: 0 }}>Contractor Sign In</h1>
              <Link href="/" style={{ fontSize: '0.75rem', color: muted, textDecoration: 'none' }}>
                ← Home
              </Link>
            </div>
            <p style={{ fontSize: '0.82rem', color: muted, margin: 0 }}>
              Enter your credentials to access your contractor project dashboard.
            </p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span>⚠️</span>
              <span style={{ flex: 1 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>
                Registered Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="contractor@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  fontSize: '0.875rem',
                  background: inputBg,
                  border: `1px solid ${border}`,
                  borderRadius: 8,
                  color: text,
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = brandColor}
                onBlur={e => e.target.style.borderColor = border}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: text, margin: 0 }}>
                  Password
                </label>
                <Link href="/contractor/forgot-password" style={{ fontSize: '0.75rem', color: brandColor, textDecoration: 'none', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 0.9rem',
                    fontSize: '0.875rem',
                    background: inputBg,
                    border: `1px solid ${border}`,
                    borderRadius: 8,
                    color: text,
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = brandColor}
                  onBlur={e => e.target.style.borderColor = border}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: muted,
                    padding: 0,
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={{ accentColor: brandColor, cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '0.78rem', color: muted, cursor: 'pointer' }}>
                Remember my session on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#fff',
                background: brandColor,
                border: 'none',
                borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                transition: 'all 0.2s',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In as Contractor →'}
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: `1px solid ${border}`, textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: muted, margin: '0 0 1rem' }}>
              New to MT-BOSS?{' '}
              <Link href="/contractor/signup" style={{ color: brandColor, fontWeight: 700, textDecoration: 'none' }}>
                Register as a Contractor
              </Link>
            </p>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link href="/vendor/login" style={{ flex: 1, padding: '0.45rem', border: `1px solid ${border}`, borderRadius: 6, fontSize: '0.72rem', color: muted, textDecoration: 'none', fontWeight: 600, background: inputBg }}>
                🏪 Vendor Login
              </Link>
              <Link href="/supplier/login" style={{ flex: 1, padding: '0.45rem', border: `1px solid ${border}`, borderRadius: 6, fontSize: '0.72rem', color: muted, textDecoration: 'none', fontWeight: 600, background: inputBg }}>
                📦 Supplier Login
              </Link>
              <Link href="/login" style={{ flex: 1, padding: '0.45rem', border: `1px solid ${border}`, borderRadius: 6, fontSize: '0.72rem', color: muted, textDecoration: 'none', fontWeight: 600, background: inputBg }}>
                👤 Customer Login
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
