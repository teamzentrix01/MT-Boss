'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServiceCities } from '@/hooks/useServiceCities';

export default function VendorSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dark, setDark] = useState(false);
  const { services, loading: loadingServices, error: serviceCityError } = useServiceCities();
  const [step, setStep] = useState(1);
  const [profilePreview, setProfilePreview] = useState(null);
  const [aadharPreview, setAadharPreview] = useState(null);
  const profileRef = useRef();
  const aadharRef = useRef();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    state: '',
    country: 'India',
    postal_code: '',
    aadhar_number: '',
    aadhar_image: null,
    profile_photo: null,
    services: [],
    package_id: 'pkg_6m',
  });

  const availableCities = [...new Map(
    services
      .flatMap((service) => Array.isArray(service.cities) ? service.cities : [])
      .map((city) => String(city).trim())
      .filter(Boolean)
      .map((city) => [city.toLowerCase(), city])
  ).values()].sort((a, b) => a.localeCompare(b));

  const cityServices = formData.city
    ? services.filter((service) => (service.cities || []).some(
        (city) => String(city).trim().toLowerCase() === formData.city.trim().toLowerCase()
      ))
    : [];

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
    if (name === 'phone') {
      const rawDigits = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, phone: rawDigits && /^[6-9]/.test(rawDigits) ? rawDigits.slice(0, 10) : '' }));
    } else if (name === 'city') {
      setFormData(prev => ({ ...prev, city: value, services: [] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError('');
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (field === 'profile_photo') setProfilePreview(reader.result);
      if (field === 'aadhar_image') setAadharPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setFormData(prev => ({ ...prev, [field]: file }));
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

  const validateStep = (s) => {
    switch (s) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
          setError('All fields are required'); return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Invalid email format'); return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters'); return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match'); return false;
        }
        if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
          setError('Invalid Indian mobile number'); return false;
        }
        return true;

      case 2:
        if (!formData.city || !formData.state || !formData.postal_code) {
          setError('City, state and postal code are required'); return false;
        }
        if (formData.postal_code.length < 5) {
          setError('Invalid postal code'); return false;
        }
        if (!formData.aadhar_number || formData.aadhar_number.replace(/\s/g, '').length !== 12) {
          setError('Enter a valid 12-digit Aadhaar number'); return false;
        }
        return true;

      case 3:
        if (formData.services.length === 0) {
          setError('Select at least one service'); return false;
        }
        return true;

      case 4:
        if (!formData.package_id) {
          setError('Select a subscription plan'); return false;
        }
        return true;

      default: return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) { setError(''); setStep(step + 1); }
  };

  const handlePrevious = () => { setError(''); setStep(step - 1); };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setLoading(true);
    setError('');

    try {
      // Build FormData for file uploads
      const payload = new FormData();
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      payload.append('phone', formData.phone);
      payload.append('city', formData.city);
      payload.append('state', formData.state);
      payload.append('country', formData.country);
      payload.append('postal_code', formData.postal_code);
      payload.append('aadhar_number', formData.aadhar_number);
      payload.append('services', JSON.stringify(formData.services));
      payload.append('package_id', formData.package_id);
      if (formData.profile_photo) payload.append('profile_photo', formData.profile_photo);
      if (formData.aadhar_image) payload.append('aadhar_image', formData.aadhar_image);

      const res = await fetch('/api/vendor/signup', {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ FIX: Don't store token - vendor is pending approval
        // Just save email for reference and redirect to pending page
        localStorage.setItem('vendor-signup-email', formData.email);
        
        // Redirect to pending approval page instead of dashboard
        router.push('/vendor/pending-approval');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = ['Account Setup', 'Address & Identity', 'Services', 'Subscription Plan'];
  const stepIcons = ['🔐', '🏠', '⚡', '📦'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .vs-root *, .vs-root *::before, .vs-root *::after { box-sizing: border-box; }

        .vs-root {
          min-height: 100vh;
          background: ${dark ? '#0a0a0a' : '#f0ede8'};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.4s;
        }

        .vs-wrap {
          width: 100%;
          max-width: 560px;
        }

        /* Brand bar */
        .vs-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 2rem;
        }
        .vs-brand-dot {
          width: 10px; height: 10px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 12px #22c55e;
        }
        .vs-brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          color: ${dark ? '#fff' : '#111'};
          letter-spacing: -0.02em;
        }
        .vs-brand-name span { color: #22c55e; }

        /* Steps indicator */
        .vs-steps {
          display: flex;
          gap: 0;
          margin-bottom: 2.5rem;
          border: 1px solid ${dark ? '#2a2a2a' : '#ddd'};
          border-radius: 12px;
          overflow: hidden;
          background: ${dark ? '#111' : '#fff'};
        }
        .vs-step-tab {
          flex: 1;
          padding: 0.875rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          border-right: 1px solid ${dark ? '#2a2a2a' : '#ddd'};
          transition: background 0.2s;
          cursor: default;
        }
        .vs-step-tab:last-child { border-right: none; }
        .vs-step-tab.active {
          background: #22c55e;
        }
        .vs-step-tab.done {
          background: ${dark ? '#0f2a1a' : '#dcfce7'};
        }
        .vs-step-icon {
          font-size: 1rem;
        }
        .vs-step-label {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: ${dark ? '#666' : '#999'};
        }
        .vs-step-tab.active .vs-step-label,
        .vs-step-tab.done .vs-step-label {
          color: ${dark ? '#22c55e' : '#15803d'};
        }
        .vs-step-tab.active .vs-step-label { color: #fff; }

        /* Card */
        .vs-card {
          background: ${dark ? '#111' : '#fff'};
          border: 1px solid ${dark ? '#222' : '#e5e0d8'};
          border-radius: 16px;
          padding: 2.25rem;
          box-shadow: ${dark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 4px 40px rgba(0,0,0,0.06)'};
        }

        .vs-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: ${dark ? '#fff' : '#111'};
          margin-bottom: 0.4rem;
          letter-spacing: -0.02em;
        }
        .vs-card-sub {
          font-size: 0.82rem;
          color: ${dark ? '#555' : '#888'};
          margin-bottom: 1.75rem;
        }

        /* Error */
        .vs-error {
          padding: 0.875rem 1rem;
          background: ${dark ? '#1a0808' : '#fff1f1'};
          border: 1px solid ${dark ? '#7f1d1d' : '#fca5a5'};
          border-radius: 8px;
          color: ${dark ? '#f87171' : '#dc2626'};
          font-size: 0.82rem;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Fields */
        .vs-field { margin-bottom: 1.1rem; }
        .vs-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: ${dark ? '#555' : '#888'};
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.45rem;
        }
        .vs-input, .vs-select {
          width: 100%;
          padding: 0.8rem 1rem;
          background: ${dark ? '#0a0a0a' : '#fafaf8'};
          border: 1px solid ${dark ? '#2a2a2a' : '#e0dbd2'};
          border-radius: 9px;
          color: ${dark ? '#fff' : '#111'};
          font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .vs-input:focus, .vs-select:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px ${dark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.1)'};
        }
        .vs-input::placeholder { color: ${dark ? '#333' : '#bbb'}; }

        .vs-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
        }
        @media (max-width: 480px) { .vs-row { grid-template-columns: 1fr; } }

        /* File upload */
        .vs-upload-area {
          border: 2px dashed ${dark ? '#2a2a2a' : '#ddd'};
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: ${dark ? '#0a0a0a' : '#fafaf8'};
          position: relative;
          overflow: hidden;
        }
        .vs-upload-area:hover {
          border-color: #22c55e;
          background: ${dark ? '#0a1a0e' : '#f0fdf4'};
        }
        .vs-upload-area.has-file {
          border-color: #22c55e;
          border-style: solid;
        }
        .vs-upload-area input[type="file"] {
          position: absolute; inset: 0; opacity: 0; cursor: pointer;
        }
        .vs-upload-icon { font-size: 1.75rem; margin-bottom: 0.5rem; }
        .vs-upload-text {
          font-size: 0.8rem;
          color: ${dark ? '#555' : '#888'};
          font-weight: 500;
        }
        .vs-upload-text strong {
          color: #22c55e;
          font-weight: 600;
        }
        .vs-upload-preview {
          width: 100%;
          max-height: 120px;
          object-fit: cover;
          border-radius: 6px;
        }
        .vs-profile-preview {
          width: 80px; height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #22c55e;
          margin: 0 auto 0.5rem;
          display: block;
        }
        .vs-file-name {
          font-size: 0.75rem;
          color: #22c55e;
          font-weight: 600;
          margin-top: 0.4rem;
        }

        /* Services */
        .vs-services {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem;
          margin-top: 0.5rem;
          max-height: 300px;
          overflow-y: auto;
          padding-right: 2px;
        }
        .vs-services::-webkit-scrollbar { width: 4px; }
        .vs-services::-webkit-scrollbar-track { background: transparent; }
        .vs-services::-webkit-scrollbar-thumb { background: ${dark ? '#333' : '#ddd'}; border-radius: 2px; }

        .vs-service-card {
          padding: 0.875rem;
          border: 1.5px solid ${dark ? '#222' : '#e5e0d8'};
          border-radius: 10px;
          background: ${dark ? '#0a0a0a' : '#fafaf8'};
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
        }
        .vs-service-card:hover { border-color: #22c55e; }
        .vs-service-card.selected {
          border-color: #22c55e;
          background: ${dark ? '#0a1a0e' : '#f0fdf4'};
        }
        .vs-service-card input[type="checkbox"] {
          width: 16px; height: 16px;
          accent-color: #22c55e;
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .vs-service-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: ${dark ? '#ddd' : '#222'};
          line-height: 1.3;
        }
        .vs-service-price {
          font-size: 0.7rem;
          color: ${dark ? '#555' : '#999'};
          margin-top: 0.2rem;
        }

        /* Buttons */
        .vs-buttons {
          display: flex;
          gap: 0.875rem;
          margin-top: 2rem;
        }
        .vs-btn {
          flex: 1;
          padding: 0.9rem;
          border: 1.5px solid ${dark ? '#2a2a2a' : '#ddd'};
          border-radius: 9px;
          background: transparent;
          color: ${dark ? '#888' : '#666'};
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s;
        }
        .vs-btn:hover {
          border-color: ${dark ? '#444' : '#bbb'};
          color: ${dark ? '#fff' : '#111'};
        }
        .vs-btn-primary {
          background: #22c55e;
          color: #fff;
          border-color: #22c55e;
        }
        .vs-btn-primary:hover { background: #16a34a; border-color: #16a34a; }
        .vs-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .vs-footer {
          text-align: center;
          font-size: 0.8rem;
          color: ${dark ? '#444' : '#aaa'};
          margin-top: 1.5rem;
        }
        .vs-footer a { color: #22c55e; text-decoration: none; font-weight: 600; }
        .vs-footer a:hover { text-decoration: underline; }

        .vs-selected-count {
          font-size: 0.75rem;
          color: #22c55e;
          font-weight: 600;
          margin-top: 0.75rem;
        }
      `}</style>

      <div className="vs-root">
        <div className="vs-wrap">

          {/* Brand */}
          <div className="vs-brand">
            <div className="vs-brand-dot"></div>
            <div className="vs-brand-name">VENDOR<span>HUB</span></div>
          </div>

          {/* Step tabs */}
          <div className="vs-steps">
            {stepTitles.map((title, i) => (
              <div
                key={i}
                className={`vs-step-tab ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}
              >
                <span className="vs-step-icon">{step > i + 1 ? '✓' : stepIcons[i]}</span>
                <span className="vs-step-label">{title}</span>
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="vs-card">
            <div className="vs-card-title">
              {step === 1 && 'Create your account'}
              {step === 2 && 'Where are you located?'}
              {step === 3 && 'What do you offer?'}
            </div>
            <div className="vs-card-sub">
              {step === 1 && 'Enter your login credentials and contact number'}
              {step === 2 && 'Address and identity verification details'}
              {step === 3 && 'Select the services you provide to customers'}
            </div>

            {error && <div className="vs-error">⚠ {error}</div>}

            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>

              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div className="vs-field">
                    <label className="vs-label">Email Address *</label>
                    <input
                      className="vs-input"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="vs-field">
                    <label className="vs-label">Mobile Number *</label>
                    <input
                      className="vs-input"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>

                  <div className="vs-field">
                    <label className="vs-label">Password *</label>
                    <input
                      className="vs-input"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="vs-field">
                    <label className="vs-label">Confirm Password *</label>
                    <input
                      className="vs-input"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                    />
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <div className="vs-row">
                    <div className="vs-field">
                      <label className="vs-label">City *</label>
                      <select
                        className="vs-input"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={loadingServices}
                      >
                        <option value="">{loadingServices ? 'Loading service cities...' : 'Select service city'}</option>
                        {availableCities.map((city) => <option key={city} value={city}>{city}</option>)}
                      </select>
                      {serviceCityError && <div className="vs-error" style={{ marginTop: '0.35rem' }}>{serviceCityError}</div>}
                    </div>
                    <div className="vs-field">
                      <label className="vs-label">State *</label>
                      <input
                        className="vs-input"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Delhi"
                      />
                    </div>
                  </div>

                  <div className="vs-row">
                    <div className="vs-field">
                      <label className="vs-label">Country</label>
                      <input
                        className="vs-input"
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="India"
                      />
                    </div>
                    <div className="vs-field">
                      <label className="vs-label">Postal Code *</label>
                      <input
                        className="vs-input"
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        placeholder="110001"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="vs-field">
                    <label className="vs-label">Aadhaar Number *</label>
                    <input
                      className="vs-input"
                      type="text"
                      name="aadhar_number"
                      value={formData.aadhar_number}
                      onChange={(e) => {
                        // Format: XXXX XXXX XXXX
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                        const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                        setFormData(prev => ({ ...prev, aadhar_number: formatted }));
                        if (error) setError('');
                      }}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={14}
                    />
                  </div>

                  <div className="vs-row">
                    <div className="vs-field">
                      <label className="vs-label">Profile Photo (Optional)</label>
                      <div className={`vs-upload-area ${profilePreview ? 'has-file' : ''}`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'profile_photo')}
                        />
                        {profilePreview ? (
                          <>
                            <img src={profilePreview} alt="Profile" className="vs-profile-preview" />
                            <div className="vs-file-name">✓ Photo uploaded</div>
                          </>
                        ) : (
                          <>
                            <div className="vs-upload-icon">🤳</div>
                            <div className="vs-upload-text"><strong>Click to upload</strong><br />your photo</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="vs-field">
                      <label className="vs-label">Aadhaar Card Image (Optional)</label>
                      <div className={`vs-upload-area ${aadharPreview ? 'has-file' : ''}`}>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, 'aadhar_image')}
                        />
                        {aadharPreview ? (
                          <>
                            <img src={aadharPreview} alt="Aadhaar" className="vs-upload-preview" />
                            <div className="vs-file-name">✓ Aadhaar uploaded</div>
                          </>
                        ) : (
                          <>
                            <div className="vs-upload-icon">🪪</div>
                            <div className="vs-upload-text"><strong>Click to upload</strong><br />Aadhaar front</div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <label className="vs-label">Select services you provide *</label>
                  {loadingServices ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: dark ? '#555' : '#aaa', fontSize: '0.85rem' }}>
                      Loading services...
                    </div>
                  ) : cityServices.length > 0 ? (
                    <div className="vs-services">
                      {cityServices.map(service => (
                        <label
                          key={service.id}
                          className={`vs-service-card ${formData.services.includes(service.id) ? 'selected' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service.id)}
                            onChange={() => handleServiceToggle(service.id)}
                          />
                          <div>
                            <div className="vs-service-name">{service.label}</div>
                            <div className="vs-service-price">₹{service.base_price}/15 min</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: dark ? '#555' : '#aaa', fontSize: '0.85rem' }}>
                      No services are configured for {formData.city || 'the selected city'}. Please go back and choose another city.
                    </div>
                  )}
                  {formData.services.length > 0 && (
                    <div className="vs-selected-count">
                      ✓ {formData.services.length} service{formData.services.length > 1 ? 's' : ''} selected
                    </div>
                  )}
                </>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <>
                  <label className="vs-label">Select a subscription plan *</label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {[
                      { id: 'pkg_6m', name: '6 Months Plan', duration: '6 Months', price: '₹2,999', desc: 'Perfect for getting started. Complete booking access.' },
                      { id: 'pkg_1y', name: '1 Year Plan', duration: '12 Months', price: '₹4,999', desc: 'Most popular. Great value with a full year of leads.' },
                      { id: 'pkg_2y', name: '2 Years Plan', duration: '24 Months', price: '₹7,999', desc: 'Best deal. Long-term peace of mind and maximum savings.' },
                    ].map(pkg => (
                      <div
                        key={pkg.id}
                        onClick={() => setFormData(prev => ({ ...prev, package_id: pkg.id }))}
                        style={{ border: formData.package_id === pkg.id ? '2px solid #22c55e' : dark ? '1px solid #2a2a2a' : '1px solid #e0dbd2' }}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          formData.package_id === pkg.id
                            ? 'bg-green-500/10'
                            : dark ? 'bg-zinc-900/40 hover:border-zinc-700' : 'bg-zinc-50 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-sm font-bold ${dark ? 'text-white' : 'text-zinc-800'}`}>{pkg.name}</span>
                          <span className="text-green-500 font-extrabold text-sm">{pkg.price}</span>
                        </div>
                        <p className={`text-xs ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>{pkg.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="vs-buttons">
                {step > 1 && (
                  <button type="button" onClick={handlePrevious} className="vs-btn">
                    ← Back
                  </button>
                )}
                <button
                  type="submit"
                  className="vs-btn vs-btn-primary"
                  disabled={loading || (step === 3 && loadingServices)}
                >
                  {step === 4
                    ? loading ? 'Creating account...' : 'Create Account →'
                    : 'Continue →'}
                </button>
              </div>
            </form>

            <div className="vs-footer">
              Already a vendor? <Link href="/vendor/login">Sign in</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
