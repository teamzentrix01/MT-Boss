'use client';
import RequiredAsterisk from '../../components/RequiredAsterisk';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCities } from '@/hooks/useCities';
import { redirectToPayU } from '@/lib/payu-client';

export default function SupplierSignupPage() {
  const router = useRouter();
  const { cities, loading: citiesLoading, error: citiesError } = useCities();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]); // stores category names

  // ── Fetch shop categories from DB (same source as ShopNow page) ────────────
  const [productCategories, setProductCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/shop-categories')
      .then(r => r.json())
      .then(d => { if (d.success) setProductCategories(d.data); })
      .catch(console.error)
      .finally(() => setCatsLoading(false));
  }, []);

  const [plans, setPlans] = useState([
    { id: 'pkg_free_1m', name: '1 Month Free Trial', price: 'Free', rawPrice: 0, desc: 'Setup store & add products free for 1 month. Customer leads & direct payouts unlock on paid plan.' },
    { id: 'pkg_6m', name: '6 Months Plan', price: '₹2,999', rawPrice: 2999, desc: 'Perfect for getting started. Complete material enquiries access.' },
    { id: 'pkg_1y', name: '1 Year Plan', price: '₹4,999', rawPrice: 4999, desc: 'Most popular. Great value with a full year of enquiries.' },
    { id: 'pkg_2y', name: '2 Years Plan', price: '₹7,999', rawPrice: 7999, desc: 'Best deal. Long-term peace of mind and maximum savings.' },
  ]);

  useEffect(() => {
    fetch('/api/supplier/packages')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d?.packages) && d.packages.length > 0) {
          const mapped = d.packages.map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            price: Number(pkg.price) === 0 ? 'Free' : `₹${Number(pkg.price).toLocaleString('en-IN')}`,
            rawPrice: Number(pkg.price || 0),
            desc: pkg.description || `${pkg.name} subscription plan.`,
          }));
          setPlans(mapped);
          setFormData(prev => ({ ...prev, package_id: prev.package_id || mapped[0]?.id }));
        }
      })
      .catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    shop_name: '', phone: '',
    city: '', state: '', country: 'India', postal_code: '',
    aadhaar_number: '', aadhaar_document: '',
    pan_number: '', pan_document: '',
    gst_number: '', gst_document: '',
    package_id: 'pkg_free_1m',
  });

  const [fileNames, setFileNames] = useState({
    aadhaar_document: '',
    pan_document: '',
    gst_document: '',
  });

  const handleFileUpload = (field, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result }));
      setFileNames(prev => ({ ...prev, [field]: file.name }));
      if (error) setError('');
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (field) => {
    setFormData(prev => ({ ...prev, [field]: '' }));
    setFileNames(prev => ({ ...prev, [field]: '' }));
  };

  const selectedPlan = plans.find(p => p.id === formData.package_id);
  const isFreePlan = selectedPlan
    ? (selectedPlan.rawPrice === 0 || selectedPlan.price === 'Free')
    : false;

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
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError('');
  };

  // Toggle by category name (what gets stored & matched in enquiries)
  const toggleCategory = (name) => {
    setSelectedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
    if (error) setError('');
  };

  const validateStep = (s) => {
    if (s === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) { setError('All fields are required'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Invalid email format'); return false; }
      if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return false; }
      if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
    }
    if (s === 2) {
      if (!formData.shop_name || !formData.phone) { setError('Shop name and phone are required'); return false; }
      if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) { setError('Invalid Indian phone number'); return false; }
    }
    if (s === 3) {
      if (!formData.city || !formData.state || !formData.postal_code) { setError('City, state and postal code are required'); return false; }
      if (formData.postal_code.length < 5) { setError('Invalid postal code'); return false; }
    }
    if (s === 4) {
      if (selectedCategories.length === 0) { setError('Select at least one product category'); return false; }
    }
    if (s === 5) {
      if (!formData.aadhaar_number) { setError('Aadhaar number is required'); return false; }
      if (!/^\d{12}$/.test(formData.aadhaar_number.replace(/\s/g, ''))) { setError('Aadhaar must be exactly 12 digits'); return false; }
      if (!formData.aadhaar_document) { setError('Please upload Aadhaar card document (Photo or PDF)'); return false; }
      if (!formData.pan_number) { setError('PAN number is required'); return false; }
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.pan_number.trim())) { setError('Valid 10-character PAN number is required (e.g., ABCDE1234F)'); return false; }
      if (!formData.pan_document) { setError('Please upload PAN card document (Photo or PDF)'); return false; }
      if (formData.gst_number && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(formData.gst_number.trim())) {
        setError('Invalid GST number format (15 characters, e.g., 07AAAAA0000A1Z5)');
        return false;
      }
    }
    if (s === 6) {
      if (!formData.package_id) { setError('Select a subscription plan'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) { setError(''); setStep(step + 1); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(6)) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/supplier/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          aadhaar_number: formData.aadhaar_number.replace(/\s/g, ''),
          pan_number: (formData.pan_number || '').trim().toUpperCase(),
          gst_number: (formData.gst_number || '').trim().toUpperCase(),
          product_categories: selectedCategories, // already names from DB
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.payment) {
          redirectToPayU(data.payment);
        } else {
          router.push(data.redirectTo || '/supplier/pending-approval');
        }
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const TOTAL_STEPS = 6;
  const stepTitles = ['Login Credentials', 'Shop Details', 'Address', 'Products You Sell', 'Identity & Tax Details', 'Subscription Plan'];

  const c = {
    bg: dark ? '#000' : '#f5f5f7',
    surface: dark ? '#111' : '#fff',
    border: dark ? '#333' : '#e2e2e7',
    text: dark ? '#fff' : '#111',
    muted: dark ? '#999' : '#666',
    inputBg: dark ? '#1a1a1a' : '#f8f8f8',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .ss-root { min-height:100vh; background:${c.bg}; display:flex; align-items:center; justify-content:center; padding:1.5rem; font-family:'DM Sans',system-ui,sans-serif; }
        .ss-box { width:100%; max-width:640px; background:${c.surface}; border:1px solid ${c.border}; border-radius:16px; padding:2.5rem; box-shadow:0 12px 40px rgba(0,0,0,0.1); max-height:92vh; overflow-y:auto; }
        .ss-logo { font-size:1.1rem; font-weight:800; color:${c.text}; margin-bottom:0.75rem; letter-spacing:-0.02em; }
        .ss-logo span { color:#10b981; }
        .ss-title { font-size:1.5rem; font-weight:700; color:${c.text}; margin-bottom:0.25rem; letter-spacing:-0.02em; }
        .ss-sub { font-size:0.875rem; color:${c.muted}; margin-bottom:1.5rem; }
        .ss-progress { display:flex; gap:0.375rem; margin-bottom:0.75rem; }
        .ss-bar { flex:1; height:4px; background:${c.border}; border-radius:3px; transition:background .3s; }
        .ss-bar.on { background:#10b981; }
        .ss-step-label { font-size:0.72rem; color:${c.muted}; text-transform:uppercase; letter-spacing:.08em; font-weight:600; margin-bottom:1.5rem; }
        .ss-error { padding:.875rem 1rem; background:${dark?'#3b0a0a':'#fff0f0'}; border:1px solid ${dark?'#991b1b':'#fca5a5'}; border-radius:8px; color:${dark?'#f87171':'#dc2626'}; font-size:.875rem; margin-bottom:1.25rem; display:flex; align-items:center; gap:.5rem; }
        .ss-field { margin-bottom:1rem; }
        .ss-label { display:block; font-size:.75rem; font-weight:700; color:${c.muted}; margin-bottom:.4rem; text-transform:uppercase; letter-spacing:.06em; }
        .ss-input { width:100%; padding:.75rem; border:1.5px solid ${c.border}; border-radius:8px; background:${c.inputBg}; color:${c.text}; font-size:.875rem; font-family:inherit; outline:none; transition:border-color .2s; box-sizing:border-box; }
        .ss-input:focus { border-color:#10b981; }
        .ss-input::placeholder { color:${dark?'#444':'#bbb'}; }
        .ss-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        @media(max-width:540px){ .ss-row{grid-template-columns:1fr;} .ss-box{padding:1.5rem;} }
        .ss-btns { display:flex; gap:1rem; margin-top:2rem; }
        .ss-btn { flex:1; padding:.875rem; border:1.5px solid ${c.border}; border-radius:8px; background:transparent; color:${c.text}; font-weight:600; cursor:pointer; transition:all .2s; font-size:.875rem; font-family:inherit; text-transform:uppercase; letter-spacing:.05em; }
        .ss-btn:hover:not(:disabled) { background:${c.border}; }
        .ss-btn-primary { background:#10b981; color:#fff; border-color:#10b981; }
        .ss-btn-primary:hover:not(:disabled) { background:#059669; border-color:#059669; }
        .ss-btn:disabled { opacity:.5; cursor:not-allowed; }
        .ss-login { text-align:center; font-size:.875rem; color:${c.muted}; margin-top:1.25rem; }
        .ss-login a { color:#10b981; text-decoration:none; font-weight:600; }
        .ss-login a:hover { text-decoration:underline; }
        /* Category chips */
        .cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(175px,1fr)); gap:.75rem; margin-top:.5rem; }
        .cat-chip { display:flex; align-items:center; gap:.625rem; padding:.75rem 1rem; border:2px solid ${c.border}; border-radius:10px; cursor:pointer; transition:all .2s; background:${c.inputBg}; user-select:none; }
        .cat-chip:hover { border-color:#10b981; background:${dark?'#0a2a1a':'#f0fdf4'}; }
        .cat-chip.selected { border-color:#10b981; background:${dark?'#0a2a1a':'#f0fdf4'}; }
        .cat-emoji { font-size:1.4rem; flex-shrink:0; }
        .cat-name { font-size:.8rem; font-weight:700; color:${c.text}; line-height:1.3; flex:1; }
        .cat-check { margin-left:auto; width:18px; height:18px; border-radius:50%; border:2px solid ${c.border}; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; }
        .cat-check.on { background:#10b981; border-color:#10b981; color:#fff; font-size:.65rem; font-weight:800; }
        .ss-notice { background:${dark?'#0a1f14':'#ecfdf5'}; border:1px solid ${dark?'#065f46':'#6ee7b7'}; border-radius:8px; padding:1rem 1.25rem; margin-bottom:1.5rem; display:flex; gap:.75rem; align-items:flex-start; font-size:.85rem; color:${dark?'#6ee7b7':'#065f46'}; line-height:1.6; }
        .cats-loading { text-align:center; padding:2rem; color:${c.muted}; font-size:.85rem; }
      `}</style>

      <div className="ss-root">
        <div className="ss-box">
          <div className="ss-logo">VENDOR<span>HUB</span></div>
          <div className="ss-title">Create Your Store</div>
          <div className="ss-sub">Join our marketplace and start serving customers</div>

          {/* Progress */}
          <div className="ss-progress">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className={`ss-bar ${i < step ? 'on' : ''}`} />
            ))}
          </div>
          <div className="ss-step-label">Step {step} of {TOTAL_STEPS} — {stepTitles[step - 1]}</div>

          {error && <div className="ss-error">⚠️ {error}</div>}

          {step === 5 && (
            <div className="ss-notice">
              🔒 Aadhaar, PAN card, and business verification documents are reviewed confidentially by the admin team before store approval.
            </div>
          )}

          <form onSubmit={step === TOTAL_STEPS ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>

            {/* STEP 1 — Credentials */}
            {step === 1 && (
              <>
                <div className="ss-field">
                  <label className="ss-label">Email Address <RequiredAsterisk /></label>
                  <input className="ss-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="supplier@example.com" required />
                </div>
                <div className="ss-row">
                  <div className="ss-field">
                    <label className="ss-label">Password <RequiredAsterisk /></label>
                    <input className="ss-input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required />
                  </div>
                  <div className="ss-field">
                    <label className="ss-label">Confirm Password <RequiredAsterisk /></label>
                    <input className="ss-input" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" required />
                  </div>
                </div>
              </>
            )}

            {/* STEP 2 — Shop Details */}
            {step === 2 && (
              <>
                <div className="ss-field">
                  <label className="ss-label">Shop / Store Name <RequiredAsterisk /></label>
                  <input className="ss-input" type="text" name="shop_name" value={formData.shop_name} onChange={handleChange} placeholder="e.g., Sharma Building Materials" required />
                </div>
                <div className="ss-field">
                  <label className="ss-label">Contact Phone Number <RequiredAsterisk /></label>
                  <input className="ss-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" required />
                </div>
              </>
            )}

            {/* STEP 3 — Address */}
            {step === 3 && (
              <>
                <div className="ss-row">
                  <div className="ss-field">
                    <label className="ss-label">City <RequiredAsterisk /></label>
                    <select className="ss-input" name="city" value={formData.city} onChange={handleChange} required disabled={citiesLoading}>
                      <option value="">{citiesLoading ? 'Loading cities...' : 'Select city'}</option>
                      {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    {citiesError && <div className="ss-error">{citiesError}</div>}
                  </div>
                  <div className="ss-field">
                    <label className="ss-label">State <RequiredAsterisk /></label>
                    <input className="ss-input" type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Delhi" required />
                  </div>
                </div>
                <div className="ss-row">
                  <div className="ss-field">
                    <label className="ss-label">Country <RequiredAsterisk /></label>
                    <input className="ss-input" type="text" name="country" value={formData.country} onChange={handleChange} placeholder="India" required />
                  </div>
                  <div className="ss-field">
                    <label className="ss-label">Postal Code <RequiredAsterisk /></label>
                    <input className="ss-input" type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="110001" required />
                  </div>
                </div> 
              </>
            )}

            {/* STEP 4 — Product Categories (fetched from DB) */}
            {step === 4 && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '.875rem', fontWeight: 600, color: c.text, marginBottom: '.35rem' }}>
                    What products does your shop sell? *
                  </div>
                  <div style={{ fontSize: '.8rem', color: c.muted }}>
                    Select all that apply — you will only receive enquiries for your selected categories.
                  </div>
                </div>

                {catsLoading ? (
                  <div className="cats-loading">
                    <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>⏳</div>
                    Loading categories…
                  </div>
                ) : productCategories.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: c.muted, fontSize: '.85rem', background: c.inputBg, border: `1px solid ${c.border}`, borderRadius: '8px' }}>
                    No categories configured yet. Please contact the admin.
                  </div>
                ) : (
                  <div className="cat-grid">
                    {productCategories.map(cat => {
                      const on = selectedCategories.includes(cat.name);
                      return (
                        <div key={cat.id} className={`cat-chip ${on ? 'selected' : ''}`} onClick={() => toggleCategory(cat.name)}>
                          {cat.image
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={cat.image} alt={cat.name} className="cat-emoji" style={{ width: '1.4rem', height: '1.4rem', objectFit: 'cover', borderRadius: '3px' }} />
                            : <span className="cat-emoji">{cat.emoji || '🛒'}</span>
                          }
                          <span className="cat-name">{cat.name}</span>
                          <span className={`cat-check ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedCategories.length > 0 && (
                  <div style={{ marginTop: '1rem', fontSize: '.8rem', color: '#10b981', fontWeight: 600 }}>
                    ✓ {selectedCategories.length} categor{selectedCategories.length > 1 ? 'ies' : 'y'} selected
                  </div>
                )}
              </>
            )}

            {/* STEP 5 — Identity & Tax Details (Aadhaar, PAN, GST) */}
            {step === 5 && (
              <>
                {/* Aadhaar Section */}
                <div style={{ background: c.inputBg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🪪</span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: c.text }}>Aadhaar Card Details <RequiredAsterisk /></div>
                      <div style={{ fontSize: '0.72rem', color: c.muted }}>Mandatory for identity verification</div>
                    </div>
                  </div>

                  <div className="ss-field">
                    <label className="ss-label">Aadhaar Number * (12 digits)</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="aadhaar_number"
                      value={formData.aadhaar_number}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setFormData(prev => ({ ...prev, aadhaar_number: val }));
                        if (error) setError('');
                      }}
                      placeholder="Enter 12-digit Aadhaar number"
                      maxLength={12}
                      inputMode="numeric"
                      required
                    />
                  </div>

                  <div className="ss-field" style={{ marginBottom: 0 }}>
                    <label className="ss-label">Upload Aadhaar Card (Photo / PDF) <RequiredAsterisk /></label>
                    <input
                      type="file"
                      id="upload-aadhaar"
                      accept="image/*,application/pdf"
                      style={{ display: 'none' }}
                      onChange={e => handleFileUpload('aadhaar_document', e.target.files?.[0])}
                    />
                    {!formData.aadhaar_document ? (
                      <label htmlFor="upload-aadhaar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.85rem', border: `1.5px dashed ${c.border}`, borderRadius: 8, background: dark ? '#151515' : '#fafafa', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                        <span style={{ fontSize: '1.1rem' }}>📎</span>
                        <span style={{ fontSize: '0.8rem', color: c.muted, fontWeight: 600 }}>Click to select Aadhaar document (Max 5MB)</span>
                      </label>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: dark ? '#0a2a1a' : '#f0fdf4', border: '1.5px solid #10b981', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                          <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                          {formData.aadhaar_document.startsWith('data:image') ? (
                            <img src={formData.aadhaar_document} alt="Aadhaar" style={{ width: 34, height: 26, objectFit: 'cover', borderRadius: 4, border: '1px solid #10b981' }} />
                          ) : (
                            <span style={{ fontSize: '1.1rem' }}>📄</span>
                          )}
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: c.text, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {fileNames.aadhaar_document || 'Aadhaar document attached'}
                          </span>
                        </div>
                        <button type="button" onClick={() => removeFile('aadhaar_document')} style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                          ✕ Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* PAN Card Section */}
                <div style={{ background: c.inputBg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>💳</span>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: c.text }}>PAN Card Details <RequiredAsterisk /></div>
                      <div style={{ fontSize: '0.72rem', color: c.muted }}>Mandatory for business & financial verification</div>
                    </div>
                  </div>

                  <div className="ss-field">
                    <label className="ss-label">PAN Number * (10 characters)</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={e => {
                        const val = e.target.value.toUpperCase().slice(0, 10);
                        setFormData(prev => ({ ...prev, pan_number: val }));
                        if (error) setError('');
                      }}
                      placeholder="e.g. ABCDE1234F"
                      maxLength={10}
                      style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}
                      required
                    />
                  </div>

                  <div className="ss-field" style={{ marginBottom: 0 }}>
                    <label className="ss-label">Upload PAN Card (Photo / PDF) <RequiredAsterisk /></label>
                    <input
                      type="file"
                      id="upload-pan"
                      accept="image/*,application/pdf"
                      style={{ display: 'none' }}
                      onChange={e => handleFileUpload('pan_document', e.target.files?.[0])}
                    />
                    {!formData.pan_document ? (
                      <label htmlFor="upload-pan" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.85rem', border: `1.5px dashed ${c.border}`, borderRadius: 8, background: dark ? '#151515' : '#fafafa', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                        <span style={{ fontSize: '1.1rem' }}>📎</span>
                        <span style={{ fontSize: '0.8rem', color: c.muted, fontWeight: 600 }}>Click to select PAN Card document (Max 5MB)</span>
                      </label>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: dark ? '#0a2a1a' : '#f0fdf4', border: '1.5px solid #10b981', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                          <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                          {formData.pan_document.startsWith('data:image') ? (
                            <img src={formData.pan_document} alt="PAN" style={{ width: 34, height: 26, objectFit: 'cover', borderRadius: 4, border: '1px solid #10b981' }} />
                          ) : (
                            <span style={{ fontSize: '1.1rem' }}>📄</span>
                          )}
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: c.text, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {fileNames.pan_document || 'PAN document attached'}
                          </span>
                        </div>
                        <button type="button" onClick={() => removeFile('pan_document')} style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                          ✕ Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* GST Section */}
                <div style={{ background: c.inputBg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🏢</span>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: c.text }}>GST Details</div>
                        <div style={{ fontSize: '0.72rem', color: c.muted }}>Provide GST if your business is GST registered</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: 6, background: dark ? '#222' : '#e5e7eb', color: c.muted, fontWeight: 700 }}>OPTIONAL</span>
                  </div>

                  <div className="ss-field">
                    <label className="ss-label">GSTIN / GST Number (15 characters)</label>
                    <input
                      className="ss-input"
                      type="text"
                      name="gst_number"
                      value={formData.gst_number}
                      onChange={e => {
                        const val = e.target.value.toUpperCase().slice(0, 15);
                        setFormData(prev => ({ ...prev, gst_number: val }));
                        if (error) setError('');
                      }}
                      placeholder="e.g. 07AAAAA0000A1Z5 (Optional)"
                      maxLength={15}
                      style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}
                    />
                  </div>

                  <div className="ss-field" style={{ marginBottom: 0 }}>
                    <label className="ss-label">Upload GST Certificate (Optional)</label>
                    <input
                      type="file"
                      id="upload-gst"
                      accept="image/*,application/pdf"
                      style={{ display: 'none' }}
                      onChange={e => handleFileUpload('gst_document', e.target.files?.[0])}
                    />
                    {!formData.gst_document ? (
                      <label htmlFor="upload-gst" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.85rem', border: `1.5px dashed ${c.border}`, borderRadius: 8, background: dark ? '#151515' : '#fafafa', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                        <span style={{ fontSize: '1.1rem' }}>📎</span>
                        <span style={{ fontSize: '0.8rem', color: c.muted, fontWeight: 600 }}>Click to select GST Certificate (Optional)</span>
                      </label>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: dark ? '#0a2a1a' : '#f0fdf4', border: '1.5px solid #10b981', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                          <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                          {formData.gst_document.startsWith('data:image') ? (
                            <img src={formData.gst_document} alt="GST" style={{ width: 34, height: 26, objectFit: 'cover', borderRadius: 4, border: '1px solid #10b981' }} />
                          ) : (
                            <span style={{ fontSize: '1.1rem' }}>📄</span>
                          )}
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: c.text, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {fileNames.gst_document || 'GST document attached'}
                          </span>
                        </div>
                        <button type="button" onClick={() => removeFile('gst_document')} style={{ background: 'transparent', border: 'none', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                          ✕ Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary card */}
                <div style={{ background: c.inputBg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '1.25rem', marginTop: '1.5rem' }}>
                  <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: c.muted, marginBottom: '.75rem' }}>Registration Summary</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', fontSize: '.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: c.muted }}>Shop</span>
                      <strong style={{ color: c.text }}>{formData.shop_name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: c.muted }}>Location</span>
                      <strong style={{ color: c.text }}>{formData.city}, {formData.state}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: c.muted }}>PAN</span>
                      <strong style={{ color: c.text, letterSpacing: '0.06em' }}>{formData.pan_number || '—'}</strong>
                    </div>
                    {formData.gst_number && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: c.muted }}>GSTIN</span>
                        <strong style={{ color: c.text, letterSpacing: '0.06em' }}>{formData.gst_number}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <span style={{ color: c.muted, flexShrink: 0 }}>Products</span>
                      <div style={{ textAlign: 'right' }}>
                        {selectedCategories.map(name => {
                          const cat = productCategories.find(c => c.name === name);
                          return (
                            <span key={name} style={{ display: 'inline-block', background: dark ? '#1a2a1a' : '#dcfce7', color: '#16a34a', padding: '.15rem .5rem', borderRadius: 6, fontSize: '.72rem', fontWeight: 700, margin: '.1rem .1rem' }}>
                              {cat?.emoji} {name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* STEP 6 — Subscription Plan */}
            {step === 6 && (
              <>
                <label className="ss-label">Select a subscription plan <RequiredAsterisk /></label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {plans.map(pkg => (
                    <div
                      key={pkg.id}
                      onClick={() => setFormData(prev => ({ ...prev, package_id: pkg.id }))}
                      style={{
                        border: formData.package_id === pkg.id ? '2px solid #10b981' : `1px solid ${c.border}`,
                        background: formData.package_id === pkg.id ? (dark ? '#0a2a1a' : '#f0fdf4') : c.inputBg,
                        padding: '1rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: c.text }}>{pkg.name}</span>
                          {pkg.rawPrice === 0 && (
                            <span style={{ background: '#10b981', color: '#fff', fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: 999, fontWeight: 800 }}>
                              FREE TRIAL
                            </span>
                          )}
                        </div>
                        <span style={{ color: '#10b981', fontWeight: 800, fontSize: '0.875rem' }}>{pkg.price}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: c.muted, margin: 0 }}>{pkg.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="ss-btns">
              {step > 1 && (
                <button type="button" onClick={() => { setError(''); setStep(step - 1); }} className="ss-btn">← Back</button>
              )}
              <button type="submit" className="ss-btn ss-btn-primary" disabled={loading}>
                {step === TOTAL_STEPS
                  ? (loading
                      ? (isFreePlan ? 'Registering…' : 'Opening PayU…')
                      : (isFreePlan ? 'Complete Free Registration →' : 'Pay & Submit →'))
                  : 'Continue →'}
              </button>
            </div>
          </form>

          <div className="ss-login">Already have an account? <Link href="/supplier/login">Sign in</Link></div>
        </div>
      </div>
    </>
  );
}
