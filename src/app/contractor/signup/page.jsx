'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ContractorSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [dark, setDark] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company_name: '',
    city: 'Moradabad',
    state: 'Uttar Pradesh',
    vendor_type: 'Civil Contractor',
    experience: '5-10 Years',
    gst: '',
    pan: '',
    message: '',
  });

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
    if (name === 'phone') {
      const rawDigits = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, phone: rawDigits.slice(0, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.name) { setError('Contractor full name is required.'); return; }
    if (!formData.email || !emailRegex.test(formData.email)) { setError('Please enter a valid email address.'); return; }
    if (!phoneRegex.test(formData.phone)) { setError('Please enter a valid 10-digit Indian phone number (starts with 6-9).'); return; }
    if (!formData.password || formData.password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);

    try {
      const res = await fetch('/api/contractor/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Account registered successfully! Redirecting to dashboard...');
        if (data.token) {
          localStorage.setItem('contractor-token', data.token);
          localStorage.setItem('contractor', JSON.stringify(data.contractor || data.user));
          localStorage.setItem('user', JSON.stringify(data.user || data.contractor));
          window.dispatchEvent(new Event('userLoggedIn'));
        }
        setTimeout(() => {
          router.push('/contractor/dashboard');
        }, 1200);
      } else {
        setError(data.error || 'Failed to register contractor account.');
      }
    } catch {
      setError('A network error occurred. Please try again.');
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
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", transition: 'background 0.3s' }}>
      <div style={{ width: '100%', maxWidth: 780, background: surface, border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,.08)', padding: '2.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${border}`, paddingBottom: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(37,99,235,0.1)', color: brandColor, padding: '0.35rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <span>🏗️</span>
              <span>Contractor Partner Registration</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: text, margin: '0 0 0.35rem' }}>
              Join MT-BOSS Contractor Network
            </h1>
            <p style={{ fontSize: '0.84rem', color: muted, margin: 0 }}>
              Register your contracting firm to receive verified site work orders, project contracts & milestone payouts.
            </p>
          </div>
          <Link href="/contractor/login" style={{ fontSize: '0.82rem', color: brandColor, textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}>
            Existing Member? Sign In →
          </Link>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.85rem 1.25rem', borderRadius: 8, fontSize: '0.84rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '0.85rem 1.25rem', borderRadius: 8, fontSize: '0.84rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Basic Info */}
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: text, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.85rem' }}>
              1. Contractor & Company Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>Full Name *</label>
                <input type="text" name="name" required placeholder="e.g. Ramesh Sharma" value={formData.name} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>Company / Firm Name</label>
                <input type="text" name="company_name" placeholder="e.g. Sharma Civil Constructions" value={formData.company_name} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>Email Address *</label>
                <input type="email" name="email" required placeholder="contractor@example.com" value={formData.email} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>Mobile Number *</label>
                <input type="tel" name="phone" required placeholder="9876543210" value={formData.phone} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* Section 2: Specialization & Location */}
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: text, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.85rem' }}>
              2. Specialization & Operating Area
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>Contractor Category *</label>
                <select name="vendor_type" value={formData.vendor_type} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box' }}>
                  <option value="Civil Contractor">Civil Contractor (RCC & Structural)</option>
                  <option value="MEP Contractor">MEP Contractor (Plumbing & Electrical)</option>
                  <option value="Interior Vendor">Interior & Finishing Contractor</option>
                  <option value="Painting Contractor">Painting & Waterproofing</option>
                  <option value="Flooring Contractor">Flooring & Tiling</option>
                  <option value="General Contractor">General Construction Contractor</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>Operating City *</label>
                <input type="text" name="city" required placeholder="e.g. Moradabad, Bareilly" value={formData.city} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>Experience Level</label>
                <select name="experience" value={formData.experience} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box' }}>
                  <option value="1-3 Years">1 - 3 Years</option>
                  <option value="3-5 Years">3 - 5 Years</option>
                  <option value="5-10 Years">5 - 10 Years</option>
                  <option value="10+ Years">10+ Years Master Contractor</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>PAN Number</label>
                <input type="text" name="pan" placeholder="ABCDE1234F" value={formData.pan} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* Section 3: Password */}
          <div>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: text, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.85rem' }}>
              3. Security & Login Credentials
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>Password (min 6 characters) *</label>
                <input type="password" name="password" required placeholder="••••••••" value={formData.password} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>Confirm Password *</label>
                <input type="password" name="confirmPassword" required placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* Section 4: Bio / Work Details */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: text, marginBottom: '0.35rem' }}>
              Tell us about your team size, machinery, and past completed projects (Optional)
            </label>
            <textarea name="message" rows={3} placeholder="e.g. Team of 20 skilled masons, completed 15+ residential RCC structures in Moradabad & Bareilly..." value={formData.message} onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', background: inputBg, border: `1px solid ${border}`, borderRadius: 8, color: text, boxSizing: 'border-box', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: dark ? '#18181e' : '#f8fafc', padding: '0.85rem 1rem', borderRadius: 8, border: `1px solid ${border}` }}>
            <input type="checkbox" required id="agree" style={{ marginTop: 3, accentColor: brandColor, cursor: 'pointer' }} />
            <label htmlFor="agree" style={{ fontSize: '0.78rem', color: muted, lineHeight: 1.5, cursor: 'pointer' }}>
              I agree to the MT-BOSS Contractor Terms & Conditions. I confirm that all submitted experience and certifications are genuine and verifiable.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '1rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#fff',
              background: brandColor,
              border: 'none',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Creating Contractor Account...' : 'Submit & Activate Contractor Account →'}
          </button>
        </form>

      </div>
    </div>
  );
}
