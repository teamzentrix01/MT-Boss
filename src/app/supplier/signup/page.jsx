'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SupplierSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dark, setDark] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
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

    // Step 5: Documents
    gst_number: '',
    pan_number: '',
    business_registration_number: '',

    // Step 6: Bank Details
    bank_account_holder: '',
    bank_account_number: '',
    bank_name: '',
    bank_ifsc_code: '',

    // Step 7: Services
    services: [],
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

  // Fetch available services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/quick-services');
        const data = await res.json();
        if (data.success) setServices(data.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => {
      const updated = prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: updated };
    });
  };

  // Validate each step before proceeding
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

      case 6:
        if (
          !formData.bank_account_holder ||
          !formData.bank_account_number ||
          !formData.bank_name ||
          !formData.bank_ifsc_code
        ) {
          setError('All bank details are required');
          return false;
        }
        return true;

      case 7:
        if (formData.services.length === 0) {
          setError('Please select at least one service');
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

  // Final form submission on step 7
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(7)) return;

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
        localStorage.setItem('supplier-token', data.token);
        localStorage.setItem('supplier', JSON.stringify(data.supplier));
        document.cookie = `supplier-auth-token=${data.token}; path=/; max-age=604800`;
        router.push('/supplier/dashboard');
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
    'Documents',
    'Bank Details',
    'Select Services',
  ];

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

        .ss-header {
          margin-bottom: 2rem;
        }

        .ss-logo {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .ss-logo span {
          color: var(--accent);
        }

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

        /* Step progress bars */
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

        .ss-progress-bar.active {
          background: var(--accent);
        }

        .ss-step-info {
          font-size: 0.75rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        /* Error banner */
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

        /* Form fields */
        .ss-field {
          margin-bottom: 1rem;
        }

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
        .ss-select:focus {
          border-color: var(--accent);
        }

        .ss-input::placeholder,
        .ss-textarea::placeholder {
          color: ${dark ? '#444' : '#c0c0c0'};
        }

        .ss-textarea {
          resize: vertical;
          min-height: 100px;
        }

        /* Two-column grid row */
        .ss-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .ss-row {
            grid-template-columns: 1fr;
          }
          .ss-container {
            padding: 1.5rem;
          }
          .ss-title {
            font-size: 1.25rem;
          }
        }

        /* Service selection grid */
        .ss-services {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }

        .ss-service-card {
          padding: 1rem;
          border: 2px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ss-service-card:hover {
          border-color: var(--accent);
          background: ${dark ? '#0f2a18' : '#ecfdf5'};
        }

        .ss-service-card.selected {
          border-color: var(--accent);
          background: ${dark ? '#064e3b' : '#d1fae5'};
        }

        .ss-service-card input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--accent);
          flex-shrink: 0;
        }

        .ss-service-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          flex: 1;
        }

        .ss-service-name {
          font-weight: 600;
          color: var(--text);
          font-size: 0.875rem;
        }

        .ss-service-price {
          font-size: 0.75rem;
          color: var(--muted);
        }

        /* Navigation buttons */
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

        .ss-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Login link at bottom */
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

        .ss-login a:hover {
          text-decoration: underline;
        }

        /* Empty state for services */
        .ss-empty {
          text-align: center;
          padding: 2rem;
          color: var(--muted);
          font-size: 0.875rem;
        }
      `}</style>

      <div className="ss-root">
        <div className="ss-container">

          {/* Header */}
          <div className="ss-header">
            <div className="ss-logo">SUPPLIER<span>HUB</span></div>
            <div className="ss-title">Create Your Store</div>
            <div className="ss-subtitle">Join our marketplace and start serving customers</div>
          </div>

          {/* Step progress indicators */}
          <div className="ss-progress">
            {[1, 2, 3, 4, 5, 6, 7].map(s => (
              <div key={s} className={`ss-progress-bar ${s <= step ? 'active' : ''}`} />
            ))}
          </div>

          {/* Current step label */}
          <div className="ss-step-info">
            Step {step} of 7 • {stepTitles[step - 1]}
          </div>

          {/* Error message */}
          {error && (
            <div className="ss-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={step === 7 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>

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

            {/* ── STEP 5: Documents ── */}
            {step === 5 && (
              <>
                <div className="ss-field">
                  <label className="ss-label">GST Number</label>
                  <input
                    className="ss-input"
                    type="text"
                    name="gst_number"
                    value={formData.gst_number}
                    onChange={handleChange}
                    placeholder="22AABCT1234H1Z0"
                  />
                </div>

                <div className="ss-row">
                  <div className="ss-field">
                    <label className="ss-label">PAN Number</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                    />
                  </div>
                  <div className="ss-field">
                    <label className="ss-label">Business Registration</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="business_registration_number"
                      value={formData.business_registration_number}
                      onChange={handleChange}
                      placeholder="Registration Number"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 6: Bank Details ── */}
            {step === 6 && (
              <>
                <div className="ss-field">
                  <label className="ss-label">Account Holder Name *</label>
                  <input
                    className="ss-input"
                    type="text"
                    name="bank_account_holder"
                    value={formData.bank_account_holder}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="ss-field">
                  <label className="ss-label">Account Number *</label>
                  <input
                    className="ss-input"
                    type="text"
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                    placeholder="Your Account Number"
                    required
                  />
                </div>

                <div className="ss-row">
                  <div className="ss-field">
                    <label className="ss-label">Bank Name *</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      placeholder="HDFC / ICICI / SBI"
                      required
                    />
                  </div>
                  <div className="ss-field">
                    <label className="ss-label">IFSC Code *</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="bank_ifsc_code"
                      value={formData.bank_ifsc_code}
                      onChange={handleChange}
                      placeholder="HDFC0000001"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 7: Select Services ── */}
            {step === 7 && (
              <>
                <label className="ss-label">Services You Provide *</label>
                {loadingServices ? (
                  <div className="ss-empty">Loading services...</div>
                ) : services.length > 0 ? (
                  <div className="ss-services">
                    {services.map(service => (
                      <label
                        key={service.id}
                        className={`ss-service-card ${formData.services.includes(service.id) ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                        />
                        <div className="ss-service-info">
                          <div className="ss-service-name">{service.label}</div>
                          <div className="ss-service-price">₹{service.base_price}/30 min</div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="ss-empty">No services available</div>
                )}
              </>
            )}

            {/* Navigation buttons */}
            <div className="ss-buttons">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="ss-btn"
                >
                  ← Previous
                </button>
              )}
              <button
                type="submit"
                className="ss-btn ss-btn-primary"
                disabled={loading || (step === 7 && loadingServices)}
              >
                {step === 7
                  ? loading ? 'Creating Account...' : 'Create Account'
                  : 'Next →'}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="ss-login">
            Already have an account? <Link href="/supplier/login">Sign in</Link>
          </div>

        </div>
      </div>
    </>
  );
}