'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VendorSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    shop_name: '',
    business_name: '',
    phone: '',
    city: '',
    state: '',
  });

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
      const res = await fetch('/api/vendor/signup', {
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
        setError(data.error || 'Registration failed');
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
        .vsup-root {
          --vsup-bg:      ${dark ? '#000000' : '#f5f5f7'};
          --vsup-surface: ${dark ? '#000000' : '#ffffff'};
          --vsup-border:  ${dark ? '#10b981' : '#e2e2e7'};
          --vsup-text:    ${dark ? '#ffffff' : '#111113'};
          --vsup-muted:   ${dark ? '#9ca3af' : '#6b6b76'};
          --vsup-accent:  ${dark ? '#10b981' : '#059669'};
          --vsup-err-bg:  ${dark ? '#7f1d1d' : '#fff1f2'};
          --vsup-err-tx:  ${dark ? '#fca5a5' : '#9f1239'};
          --vsup-err-br:  ${dark ? '#dc2626' : '#fca5a5'};
        }

        .vsup-root {
          min-height: 100vh;
          background: var(--vsup-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background-color 0.5s ease, color 0.5s ease;
        }

        .vsup-container {
          width: 100%;
          max-width: 520px;
          background: var(--vsup-surface);
          border: 1px solid var(--vsup-border);
          border-radius: 12px;
          padding: 2.5rem 2rem;
          box-shadow: 0 8px 40px rgba(0,0,0,.07);
          transition: background-color 0.5s ease, border-color 0.5s ease;
        }

        .vsup-logo {
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--vsup-text);
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
        }
        .vsup-logo span { color: #10b981; }

        .vsup-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--vsup-text);
          margin-bottom: 0.25rem;
          transition: color 0.5s ease;
        }
        .vsup-sub {
          font-size: 0.8125rem;
          color: var(--vsup-muted);
          margin-bottom: 1.5rem;
          transition: color 0.5s ease;
        }

        .vsup-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          background: var(--vsup-err-bg);
          border: 1px solid var(--vsup-err-br);
          border-radius: 6px;
          font-size: 0.8125rem;
          color: var(--vsup-err-tx);
          margin-bottom: 1rem;
          transition: background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease;
        }

        .vsup-field { margin-bottom: 0.875rem; }
        .vsup-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--vsup-muted);
          margin-bottom: 0.3rem;
          transition: color 0.5s ease;
        }
        .vsup-input {
          width: 100%;
          padding: 0.45rem 0.75rem;
          border: 1px solid var(--vsup-border);
          border-radius: 7px;
          background: var(--vsup-bg);
          color: var(--vsup-text);
          font-size: 0.8125rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color .15s, background-color 0.5s ease, color 0.5s ease;
        }
        .vsup-input::placeholder { color: ${dark ? '#6b7280' : '#b0b0ba'}; }
        .vsup-input:focus { border-color: var(--vsup-accent); }

        .vsup-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        @media(max-width:640px){ .vsup-row { grid-template-columns: 1fr; } }

        .vsup-submit {
          width: 100%;
          padding: 0.55rem 1rem;
          background: var(--vsup-accent);
          color: #fff;
          border: none;
          border-radius: 7px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: opacity .15s;
          margin-top: 1rem;
        }
        .vsup-submit:hover:not(:disabled) { opacity: .88; }
        .vsup-submit:disabled { opacity: .5; cursor: not-allowed; }

        .vsup-login {
          text-align: center;
          font-size: 0.8rem;
          color: var(--vsup-muted);
          margin-top: 1.5rem;
          transition: color 0.5s ease;
        }
        .vsup-login a {
          color: var(--vsup-accent);
          font-weight: 600;
          text-decoration: none;
        }
        .vsup-login a:hover { text-decoration: underline; }
      `}</style>

      <div className="vsup-root">
        <div className="vsup-container">
          <div className="vsup-logo">VENDOR<span>HUB</span></div>
          <div className="vsup-title">Create Vendor Account</div>
          <div className="vsup-sub">Register your business and start selling today</div>

          {error && <div className="vsup-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="vsup-field">
              <label className="vsup-label" htmlFor="email">Email address *</label>
              <input
                className="vsup-input" type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="vendor@example.com" required
              />
            </div>

            {/* Password */}
            <div className="vsup-field">
              <label className="vsup-label" htmlFor="password">Password *</label>
              <input
                className="vsup-input" type="password" id="password" name="password"
                value={formData.password} onChange={handleChange}
                placeholder="••••••••" required
              />
            </div>

            {/* Shop Name */}
            <div className="vsup-field">
              <label className="vsup-label" htmlFor="shop_name">Shop Name *</label>
              <input
                className="vsup-input" type="text" id="shop_name" name="shop_name"
                value={formData.shop_name} onChange={handleChange}
                placeholder="My Online Shop" required
              />
            </div>

            {/* Business Name */}
            <div className="vsup-field">
              <label className="vsup-label" htmlFor="business_name">Business Name *</label>
              <input
                className="vsup-input" type="text" id="business_name" name="business_name"
                value={formData.business_name} onChange={handleChange}
                placeholder="ABC Trading Company" required
              />
            </div>

            {/* Phone */}
            <div className="vsup-field">
              <label className="vsup-label" htmlFor="phone">Phone Number</label>
              <input
                className="vsup-input" type="tel" id="phone" name="phone"
                value={formData.phone} onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* City & State Row */}
            <div className="vsup-row">
              <div className="vsup-field">
                <label className="vsup-label" htmlFor="city">City</label>
                <input
                  className="vsup-input" type="text" id="city" name="city"
                  value={formData.city} onChange={handleChange}
                  placeholder="Your city"
                />
              </div>
              <div className="vsup-field">
                <label className="vsup-label" htmlFor="state">State</label>
                <input
                  className="vsup-input" type="text" id="state" name="state"
                  value={formData.state} onChange={handleChange}
                  placeholder="Your state"
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="vsup-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="vsup-login">
            Already have an account? <Link href="/vendor/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </>
  );
}