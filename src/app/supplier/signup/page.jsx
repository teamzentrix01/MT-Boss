'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SupplierSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Step 1: Credentials
    email: '',
    password: '',
    confirmPassword: '',

    // Step 2: Shop Info
    shop_name: '',
    business_name: '',
    phone: '',

    // Step 3: Address
    city: '',
    state: '',
    country: 'India',
    postal_code: '',

    // Step 4: Business Details
    business_type: '',
    description: '',
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError('All fields are required');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Invalid email format');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;

      case 2:
        if (!formData.shop_name || !formData.business_name || !formData.phone) {
          setError('All fields are required');
          return false;
        }
        if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
          setError('Invalid Indian phone number');
          return false;
        }
        return true;

      case 3:
        if (!formData.city || !formData.state || !formData.country || !formData.postal_code) {
          setError('All fields are required');
          return false;
        }
        if (formData.postal_code.length < 5) {
          setError('Invalid postal code');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setError('');
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setError('');
    setStep(step - 1);
  };

  // Final submission on step 5
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/supplier/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/supplier/pending-approval');
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    'Login Credentials',
    'Shop Information',
    'Address Details',
    'Business Details',
  ];

  const TOTAL_STEPS = 4;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .ss-root {
          --bg: ${dark ? '#000' : '#f5f5f7'};
          --surface: ${dark ? '#111' : '#fff'};
          --border: ${dark ? '#333' : '#e2e2e7'};
          --text: ${dark ? '#fff' : '#111'};
          --muted: ${dark ? '#999' : '#666'};
          --accent: #10b981;
          --error-bg: ${dark ? '#7f1d1d' : '#fff0f0'};
          --error-color: ${dark ? '#f87171' : '#dc2626'};
          --error-border: ${dark ? '#991b1b' : '#fca5a5'};
        }

        .ss-root {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background-color 0.5s;
        }

        .ss-container {
          width: 100%;
          max-width: 650px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          max-height: 90vh;
          overflow-y: auto;
        }

        .ss-header { margin-bottom: 2rem; }

        .ss-logo {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        .ss-logo span { color: var(--accent); }

        .ss-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .ss-subtitle {
          font-size: 0.875rem;
          color: var(--muted);
        }

        .ss-progress {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          margin-top: 1rem;
        }

        .ss-progress-bar {
          flex: 1;
          height: 5px;
          background: var(--border);
          border-radius: 3px;
          transition: background 0.3s;
        }
        .ss-progress-bar.active { background: var(--accent); }

        .ss-step-info {
          font-size: 0.75rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .ss-error {
          padding: 1rem;
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          border-radius: 8px;
          color: var(--error-color);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ss-field { margin-bottom: 1rem; }

        .ss-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ss-input,
        .ss-textarea,
        .ss-select {
          width: 100%;
          padding: 0.75rem;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          color: var(--text);
          font-size: 0.875rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .ss-input:focus,
        .ss-textarea:focus,
        .ss-select:focus { border-color: var(--accent); }
        .ss-input::placeholder,
        .ss-textarea::placeholder { color: ${dark ? '#444' : '#c0c0c0'}; }
        .ss-textarea { resize: vertical; min-height: 100px; }

        .ss-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .ss-row { grid-template-columns: 1fr; }
          .ss-container { padding: 1.5rem; }
          .ss-title { font-size: 1.25rem; }
        }

        .ss-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .ss-btn {
          flex: 1;
          padding: 0.875rem;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          background: transparent;
          color: var(--text);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
          font-family: inherit;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .ss-btn:hover:not(:disabled) {
          border-color: var(--text);
          background: var(--border);
        }
        .ss-btn-primary {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        .ss-btn-primary:hover:not(:disabled) {
          opacity: 0.9;
          background: var(--accent);
        }
        .ss-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .ss-login {
          text-align: center;
          font-size: 0.875rem;
          color: var(--muted);
          margin-top: 1.5rem;
        }
        .ss-login a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
        }
        .ss-login a:hover { text-decoration: underline; }

        .ss-notice {
          background: ${dark ? '#0a1f14' : '#ecfdf5'};
          border: 1px solid ${dark ? '#065f46' : '#6ee7b7'};
          border-radius: 8px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }
        .ss-notice-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 0.05rem; }
        .ss-notice-text {
          font-size: 0.85rem;
          color: ${dark ? '#6ee7b7' : '#065f46'};
          line-height: 1.6;
        }
        .ss-notice-text strong {
          display: block;
          margin-bottom: 0.2rem;
          font-size: 0.9rem;
        }

      `}</style>

      <div className="ss-root">
        <div className="ss-container">

          <div className="ss-header">
            <div className="ss-logo">SUPPLIER<span>HUB</span></div>
            <div className="ss-title">Create Your Store</div>
            <div className="ss-subtitle">Join our marketplace and start serving customers</div>
          </div>

          {/* 4-step progress */}
          <div className="ss-progress">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`ss-progress-bar ${s <= step ? 'active' : ''}`} />
            ))}
          </div>

          <div className="ss-step-info">
            Step {step} of {TOTAL_STEPS} • {stepTitles[step - 1]}
          </div>

          {error && (
            <div className="ss-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Notice on last step */}
          {step === TOTAL_STEPS && (
            <div className="ss-notice">
              <span className="ss-notice-icon">🔔</span>
              <div className="ss-notice-text">
                <strong>Admin Approval Required</strong>
                After submitting, your account will be reviewed by our admin team. You will be able to log in only after your account has been approved.
              </div>
            </div>
          )}

          <form onSubmit={step === TOTAL_STEPS ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>

            {/* ── STEP 1: Login Credentials ── */}
            {step === 1 && (
              <>
                <div className="ss-field">
                  <label className="ss-label">Email Address *</label>
                  <input
                    className="ss-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="supplier@example.com"
                    required
                  />
                </div>
                <div className="ss-field">
                  <label className="ss-label">Password *</label>
                  <input
                    className="ss-input"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="ss-field">
                  <label className="ss-label">Confirm Password *</label>
                  <input
                    className="ss-input"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </>
            )}

            {/* ── STEP 2: Shop Information ── */}
            {step === 2 && (
              <>
                <div className="ss-field">
                  <label className="ss-label">Shop Name *</label>
                  <input
                    className="ss-input"
                    type="text"
                    name="shop_name"
                    value={formData.shop_name}
                    onChange={handleChange}
                    placeholder="My Awesome Shop"
                    required
                  />
                </div>
                <div className="ss-field">
                  <label className="ss-label">Business Name *</label>
                  <input
                    className="ss-input"
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="Business Legal Name"
                    required
                  />
                </div>
                <div className="ss-field">
                  <label className="ss-label">Phone Number *</label>
                  <input
                    className="ss-input"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    required
                  />
                </div>
              </>
            )}

            {/* ── STEP 3: Address Details ── */}
            {step === 3 && (
              <>
                <div className="ss-row">
                  <div className="ss-field">
                    <label className="ss-label">City *</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Delhi"
                      required
                    />
                  </div>
                  <div className="ss-field">
                    <label className="ss-label">State *</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Delhi"
                      required
                    />
                  </div>
                </div>
                <div className="ss-row">
                  <div className="ss-field">
                    <label className="ss-label">Country *</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="India"
                      required
                    />
                  </div>
                  <div className="ss-field">
                    <label className="ss-label">Postal Code *</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      placeholder="110001"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 4: Business Details ── */}
            {step === 4 && (
              <>
                <div className="ss-field">
                  <label className="ss-label">Business Type</label>
                  <input
                    className="ss-input"
                    type="text"
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    placeholder="e.g., Retail, Service, Manufacturing"
                  />
                </div>
                <div className="ss-field">
                  <label className="ss-label">Business Description</label>
                  <textarea
                    className="ss-textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about your business..."
                  />
                </div>
              </>
            )}

            {/* Navigation buttons */}
            <div className="ss-buttons">
              {step > 1 && (
                <button type="button" onClick={handlePrevious} className="ss-btn">
                  ← Previous
                </button>
              )}
              <button
                type="submit"
                className="ss-btn ss-btn-primary"
                disabled={loading}
              >
                {step === TOTAL_STEPS
                  ? loading ? 'Submitting...' : 'Submit for Approval'
                  : 'Next →'}
              </button>
            </div>
          </form>

          <div className="ss-login">
            Already have an account? <Link href="/supplier/login">Sign in</Link>
          </div>

        </div>
      </div>
    </>
  );
}