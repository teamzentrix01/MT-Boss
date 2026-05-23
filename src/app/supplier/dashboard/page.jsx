'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SupplierDashboard() {
  const router = useRouter();
  const [supplier, setSupplier] = useState(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🧱',
    label: '',
    labelColor: 'blue',
    priceRange: '',
    unit: '',
  });

  // ── Profile Edit State ──
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [aadhaarStatus, setAadhaarStatus] = useState('unverified'); // 'unverified' | 'pending' | 'verified'
  const [aadhaarSending, setAadhaarSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [profileData, setProfileData] = useState({
    // Bank Details
    bank_account_holder: '',
    bank_account_number: '',
    bank_name: '',
    bank_ifsc_code: '',
    // Aadhaar
    aadhaar_number: '',
  });

  const labelColorOptions = ['blue', 'yellow', 'green', 'purple', 'pink', 'orange', 'amber', 'cyan'];
  const labelOptions = ['HIGH VOLUME', 'ALWAYS NEEDED', 'GROWING', 'STEADY DEMAND', 'SPECIALIZED', 'REGULAR SUPPLY', 'BULK SUPPLY', 'HIGH DEMAND'];

  // Dark mode detection
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Load supplier from localStorage
  useEffect(() => {
    const supplierData = localStorage.getItem('supplier');
    const token = localStorage.getItem('supplier-token');
    if (!token || !supplierData) {
      router.push('/supplier/login');
      return;
    }
    try {
      const parsed = JSON.parse(supplierData);
      setSupplier(parsed);
      setLoading(false);
      fetchCategories(token);
      // Pre-fill profile if saved
      if (parsed.bank_account_holder) {
        setProfileData({
          bank_account_holder: parsed.bank_account_holder || '',
          bank_account_number: parsed.bank_account_number || '',
          bank_name: parsed.bank_name || '',
          bank_ifsc_code: parsed.bank_ifsc_code || '',
          aadhaar_number: parsed.aadhaar_number || '',
        });
      }
      if (parsed.aadhaar_status) setAadhaarStatus(parsed.aadhaar_status);
    } catch {
      router.push('/supplier/login');
    }
  }, [router]);

  const fetchCategories = async (token) => {
    setLoadingCategories(true);
    try {
      const res = await fetch(`/api/supplier/categories?supplierId=1`, {
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('supplier-token')}` }
      });
      const data = await res.json();
      if (data.success) setCategories(data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name,
        emoji: category.emoji,
        label: category.label,
        labelColor: category.labelColor,
        priceRange: category.priceRange,
        unit: category.unit,
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', emoji: '🧱', label: '', labelColor: 'blue', priceRange: '', unit: '' });
    }
    setShowModal(true);
  };

  const saveCategory = async () => {
    if (!formData.name || !formData.label || !formData.priceRange || !formData.unit) {
      alert('All fields are required!');
      return;
    }
    try {
      const token = localStorage.getItem('supplier-token');
      const payload = { ...formData, supplierId: 1 };

      if (editingId) {
        const res = await fetch(`/api/supplier/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setCategories(categories.map(c => c.id === editingId ? data.data : c));
          alert('Category updated!');
        }
      } else {
        const res = await fetch(`/api/supplier/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setCategories([...categories, data.data]);
          alert('Category added!');
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Error saving category');
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      const token = localStorage.getItem('supplier-token');
      const res = await fetch(`/api/supplier/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter(c => c.id !== id));
        alert('Category deleted!');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Error deleting category');
    }
  };

  // ── Save Bank Details ──
  const saveBankDetails = async () => {
    const { bank_account_holder, bank_account_number, bank_name, bank_ifsc_code } = profileData;
    if (!bank_account_holder || !bank_account_number || !bank_name || !bank_ifsc_code) {
      setProfileMsg({ type: 'error', text: 'Please fill all bank fields.' });
      return;
    }
    setProfileSaving(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const token = localStorage.getItem('supplier-token');
      const res = await fetch('/api/supplier/profile/bank', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ bank_account_holder, bank_account_number, bank_name, bank_ifsc_code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfileMsg({ type: 'success', text: 'Bank details saved successfully!' });
        // Update localStorage
        const stored = JSON.parse(localStorage.getItem('supplier') || '{}');
        localStorage.setItem('supplier', JSON.stringify({ ...stored, bank_account_holder, bank_account_number, bank_name, bank_ifsc_code }));
      } else {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to save bank details.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Send Aadhaar OTP ──
  const sendAadhaarOtp = async () => {
    if (!/^\d{12}$/.test(profileData.aadhaar_number)) {
      setProfileMsg({ type: 'error', text: 'Please enter a valid 12-digit Aadhaar number.' });
      return;
    }
    setAadhaarSending(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const token = localStorage.getItem('supplier-token');
      const res = await fetch('/api/supplier/profile/aadhaar/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ aadhaar_number: profileData.aadhaar_number }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setProfileMsg({ type: 'success', text: 'OTP sent to your Aadhaar-linked mobile number.' });
      } else {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to send OTP.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setAadhaarSending(false);
    }
  };

  // ── Verify Aadhaar OTP ──
  const verifyAadhaarOtp = async () => {
    if (!otp || otp.length < 4) {
      setProfileMsg({ type: 'error', text: 'Please enter the OTP.' });
      return;
    }
    setAadhaarSending(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const token = localStorage.getItem('supplier-token');
      const res = await fetch('/api/supplier/profile/aadhaar/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ aadhaar_number: profileData.aadhaar_number, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAadhaarStatus('verified');
        setOtpSent(false);
        setOtp('');
        setProfileMsg({ type: 'success', text: 'Aadhaar verified successfully! ✅' });
        const stored = JSON.parse(localStorage.getItem('supplier') || '{}');
        localStorage.setItem('supplier', JSON.stringify({ ...stored, aadhaar_status: 'verified', aadhaar_number: profileData.aadhaar_number }));
      } else {
        setProfileMsg({ type: 'error', text: data.error || 'OTP verification failed.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setAadhaarSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('supplier-token');
    localStorage.removeItem('supplier');
    router.push('/supplier/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: dark ? '#000' : '#f5f5f7',
        color: dark ? '#fff' : '#111', fontFamily: 'DM Sans, sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  const bg = dark ? '#0a0a0a' : '#f0ede8';
  const surface = dark ? '#111' : '#fff';
  const border = dark ? '#222' : '#e5e0d8';
  const text = dark ? '#fff' : '#111';
  const muted = dark ? '#555' : '#999';
  const inputBg = dark ? '#1a1a1a' : '#f5f5f5';

  return (
    <>
      <style>{`
        .sd-page {
          min-height: 100vh;
          background: ${bg};
          color: ${text};
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .sd-topbar {
          background: ${surface};
          border-bottom: 1px solid ${border};
          padding: 0 2rem;
          height: 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          box-sizing: border-box;
        }

        .sd-topbar-left { display: flex; align-items: center; gap: 1rem; }

        .sd-logo {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          white-space: nowrap;
          color: ${text};
        }
        .sd-logo span { color: #f59e0b; }

        .sd-divider { width: 1px; height: 20px; background: ${border}; }

        .sd-supplier-name {
          font-size: 0.8rem;
          color: ${muted};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sd-topbar-right { display: flex; align-items: center; gap: 1rem; }

        .sd-status-pill {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: ${dark ? '#1a2a0a' : '#dcfce7'};
          color: #22c55e;
          border: 1px solid #22c55e33;
        }

        .sd-logout-btn {
          padding: 0.5rem 1.1rem;
          background: transparent;
          color: ${dark ? '#888' : '#666'};
          border: 1px solid ${border};
          border-radius: 7px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.78rem;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .sd-logout-btn:hover { border-color: #ef4444; color: #ef4444; }

        .sd-body { max-width: 1100px; margin: 0 auto; padding: 2rem; }

        .sd-page-header { margin-bottom: 2rem; }
        .sd-page-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.3rem; letter-spacing: -0.02em; }
        .sd-page-sub { font-size: 0.85rem; color: ${muted}; }

        .sd-tabs {
          display: flex;
          border-bottom: 2px solid ${border};
          margin-bottom: 2rem;
          gap: 0;
        }
        .sd-tab {
          padding: 0.875rem 1.5rem;
          background: none;
          border: none;
          color: ${dark ? '#555' : '#aaa'};
          cursor: pointer;
          font-weight: 600;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          position: relative;
          transition: color 0.2s;
          white-space: nowrap;
          font-family: inherit;
        }
        .sd-tab:hover { color: ${text}; }
        .sd-tab.active { color: #f59e0b; }
        .sd-tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 2px;
          background: #f59e0b;
        }

        .sd-btn-add {
          padding: 0.6rem 1.2rem;
          background: #f59e0b;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: all 0.2s;
        }
        .sd-btn-add:hover { background: #d97706; transform: translateY(-2px); }

        .sd-categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .sd-cat-card {
          background: ${surface};
          border: 1px solid ${border};
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sd-cat-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
        .sd-cat-emoji { font-size: 2.5rem; }
        .sd-cat-name { font-size: 0.9rem; font-weight: 700; color: ${dark ? '#ddd' : '#222'}; flex: 1; }
        .sd-cat-actions { display: flex; gap: 0.5rem; }

        .sd-btn-icon {
          padding: 0.4rem 0.6rem;
          background: transparent;
          border: 1px solid ${border};
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.7rem;
          transition: all 0.2s;
        }
        .sd-btn-icon:hover { border-color: #f59e0b; background: ${dark ? '#1a1a1a' : '#fef9c3'}; }
        .sd-btn-icon.delete:hover { border-color: #ef4444; background: ${dark ? '#2a1a1a' : '#fee2e2'}; }

        .sd-cat-details { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem; color: ${muted}; }
        .sd-cat-label {
          display: inline-block;
          background: ${dark ? '#222' : '#f0ede8'};
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          font-weight: 600;
          color: #f59e0b;
          width: fit-content; 
        }

        .sd-empty { padding: 3rem; text-align: center; color: ${dark ? '#444' : '#bbb'}; font-size: 0.875rem; }

        /* ── Profile Section ── */
        .sd-profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .sd-profile-grid { grid-template-columns: 1fr; }
        }

        .sd-profile-card {
          background: ${surface};
          border: 1px solid ${border};
          border-radius: 14px;
          padding: 1.75rem;
        }

        .sd-profile-card-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
          color: ${text};
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sd-profile-card-sub {
          font-size: 0.75rem;
          color: ${muted};
          margin-bottom: 1.5rem;
        }

        .sd-form-group { margin-bottom: 1rem; }

        .sd-form-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 0.4rem;
          color: ${muted};
        }

        .sd-form-input {
          width: 100%;
          padding: 0.7rem 0.9rem;
          border: 1px solid ${border};
          border-radius: 8px;
          background: ${inputBg};
          color: ${text};
          font-family: inherit;
          font-size: 0.875rem;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .sd-form-input:focus { outline: none; border-color: #f59e0b; }
        .sd-form-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .sd-form-input::placeholder { color: ${dark ? '#444' : '#ccc'}; }

        .sd-otp-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-top: 0.75rem;
        }

        .sd-otp-input {
          flex: 1;
          padding: 0.7rem 0.9rem;
          border: 1px solid ${border};
          border-radius: 8px;
          background: ${inputBg};
          color: ${text};
          font-family: inherit;
          font-size: 0.875rem;
          letter-spacing: 0.2em;
          font-weight: 700;
          box-sizing: border-box;
        }
        .sd-otp-input:focus { outline: none; border-color: #10b981; }

        .sd-save-btn {
          width: 100%;
          margin-top: 1.25rem;
          padding: 0.8rem;
          background: #f59e0b;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.85rem;
          font-family: inherit;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .sd-save-btn:hover:not(:disabled) { background: #d97706; }
        .sd-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .sd-otp-btn {
          padding: 0.7rem 1.1rem;
          background: #10b981;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.78rem;
          font-family: inherit;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .sd-otp-btn:hover:not(:disabled) { background: #059669; }
        .sd-otp-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .sd-aadhaar-status {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 1rem;
        }
        .sd-aadhaar-status.verified {
          background: ${dark ? '#0a2a14' : '#dcfce7'};
          color: #16a34a;
          border: 1px solid #16a34a33;
        }
        .sd-aadhaar-status.unverified {
          background: ${dark ? '#2a1a0a' : '#fff7ed'};
          color: #ea580c;
          border: 1px solid #ea580c33;
        }
        .sd-aadhaar-status.pending {
          background: ${dark ? '#1a1a0a' : '#fefce8'};
          color: #ca8a04;
          border: 1px solid #ca8a0433;
        }

        .sd-profile-msg {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sd-profile-msg.success {
          background: ${dark ? '#0a2a14' : '#f0fdf4'};
          color: #16a34a;
          border: 1px solid #16a34a44;
        }
        .sd-profile-msg.error {
          background: ${dark ? '#2a0a0a' : '#fff0f0'};
          color: #dc2626;
          border: 1px solid #dc262644;
        }

        .sd-resend-link {
          font-size: 0.75rem;
          color: ${muted};
          margin-top: 0.5rem;
          cursor: pointer;
          text-decoration: underline;
        }
        .sd-resend-link:hover { color: #10b981; }

        /* Modal */
        .sd-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(4px);
        }

        .sd-modal {
          background: ${surface};
          border: 1px solid ${border};
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .sd-modal-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 1.5rem; color: ${text}; }

        .sd-form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid ${border};
          border-radius: 8px;
          background: ${inputBg};
          color: ${text};
          font-family: inherit;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .sd-form-select:focus { outline: none; border-color: #f59e0b; }

        .sd-emoji-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .sd-emoji-btn {
          padding: 0.8rem;
          background: ${inputBg};
          border: 2px solid ${border};
          border-radius: 8px;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sd-emoji-btn.selected { border-color: #f59e0b; background: ${dark ? '#2a1a0a' : '#fef9c3'}; }
        .sd-emoji-btn:hover { transform: scale(1.1); }

        .sd-modal-buttons { display: flex; gap: 1rem; margin-top: 1.5rem; }

        .sd-btn-primary {
          flex: 1;
          padding: 0.75rem;
          background: #f59e0b;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .sd-btn-primary:hover { background: #d97706; }

        .sd-btn-secondary {
          flex: 1;
          padding: 0.75rem;
          background: transparent;
          color: ${dark ? '#888' : '#666'};
          border: 1px solid ${border};
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .sd-btn-secondary:hover { border-color: ${dark ? '#666' : '#ccc'}; }

        .sd-loading { padding: 2rem; text-align: center; color: ${dark ? '#555' : '#aaa'}; font-size: 0.875rem; }

        @media (max-width: 640px) {
          .sd-topbar { padding: 0 1rem; }
          .sd-body { padding: 1rem; }
          .sd-page-title { font-size: 1.4rem; }
          .sd-categories-grid { grid-template-columns: 1fr; }
          .sd-supplier-name { display: none; }
          .sd-divider { display: none; }
          .sd-modal { width: 95%; padding: 1.5rem; }
        }
      `}</style>

      <div className="sd-page">

        {/* Top Bar */}
        <div className="sd-topbar">
          <div className="sd-topbar-left">
            <div className="sd-logo">SUPPLIER<span>HUB</span></div>
            <div className="sd-divider" />
            <div className="sd-supplier-name">{supplier?.name}</div>
          </div>
          <div className="sd-topbar-right">
            <span className="sd-status-pill">Active</span>
            <button className="sd-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="sd-body">

          {/* Page Header */}
          <div className="sd-page-header">
            <div className="sd-page-title">
              {activeTab === 'categories' ? 'Manage Categories 📦' : 'Edit Profile 👤'}
            </div>
            <div className="sd-page-sub">
              {activeTab === 'categories'
                ? 'Add, edit, or remove product categories from your catalog'
                : 'Update your bank details and verify your Aadhaar'}
            </div>
          </div>

          {/* Tabs */}
          <div className="sd-tabs">
            <button
              className={`sd-tab ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              📋 Categories
            </button>
            <button
              className={`sd-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setProfileMsg({ type: '', text: '' }); }}
            >
              👤 Profile Edit
            </button>
          </div>

          {/* ── Categories Tab ── */}
          {activeTab === 'categories' && (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <button className="sd-btn-add" onClick={() => openModal()}>+ Add Category</button>
              </div>

              {loadingCategories ? (
                <div className="sd-loading">Loading categories...</div>
              ) : categories.length > 0 ? (
                <div className="sd-categories-grid">
                  {categories.map(cat => (
                    <div key={cat.id} className="sd-cat-card">
                      <div className="sd-cat-header">
                        <div className="sd-cat-emoji">{cat.emoji}</div>
                        <div className="sd-cat-actions">
                          <button className="sd-btn-icon" onClick={() => openModal(cat)} title="Edit">✏️ Edit</button>
                          <button className="sd-btn-icon delete" onClick={() => deleteCategory(cat.id)} title="Delete">🗑️ Delete</button>
                        </div>
                      </div>
                      <div>
                        <div className="sd-cat-name">{cat.name}</div>
                        <div className="sd-cat-label">{cat.label}</div>
                      </div>
                      <div className="sd-cat-details">
                        <div>Price: <strong>{cat.priceRange}</strong></div>
                        <div>Unit: <strong>{cat.unit}</strong></div>
                        <div>Color: <strong>{cat.labelColor}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="sd-empty">No categories yet. Add your first category! 👇</div>
              )}
            </>
          )}

          {/* ── Profile Tab ── */}
          {activeTab === 'profile' && (
            <>
              {profileMsg.text && (
                <div className={`sd-profile-msg ${profileMsg.type}`}>
                  {profileMsg.type === 'success' ? '✅' : '⚠️'} {profileMsg.text}
                </div>
              )}

              <div className="sd-profile-grid" style={{ marginTop: '1.5rem' }}>

                {/* Bank Details Card */}
                <div className="sd-profile-card">
                  <div className="sd-profile-card-title">🏦 Bank Details</div>
                  <div className="sd-profile-card-sub">Your payment will be settled to this bank account</div>

                  <div className="sd-form-group">
                    <label className="sd-form-label">Account Holder Name *</label>
                    <input
                      type="text"
                      className="sd-form-input"
                      value={profileData.bank_account_holder}
                      onChange={e => setProfileData({ ...profileData, bank_account_holder: e.target.value })}
                      placeholder="Full Name as per bank"
                    />
                  </div>

                  <div className="sd-form-group">
                    <label className="sd-form-label">Account Number *</label>
                    <input
                      type="text"
                      className="sd-form-input"
                      value={profileData.bank_account_number}
                      onChange={e => setProfileData({ ...profileData, bank_account_number: e.target.value })}
                      placeholder="Your Account Number"
                    />
                  </div>

                  <div className="sd-form-group">
                    <label className="sd-form-label">Bank Name *</label>
                    <input
                      type="text"
                      className="sd-form-input"
                      value={profileData.bank_name}
                      onChange={e => setProfileData({ ...profileData, bank_name: e.target.value })}
                      placeholder="e.g., HDFC / ICICI / SBI"
                    />
                  </div>

                  <div className="sd-form-group">
                    <label className="sd-form-label">IFSC Code *</label>
                    <input
                      type="text"
                      className="sd-form-input"
                      value={profileData.bank_ifsc_code}
                      onChange={e => setProfileData({ ...profileData, bank_ifsc_code: e.target.value.toUpperCase() })}
                      placeholder="HDFC0000001"
                    />
                  </div>

                  <button className="sd-save-btn" onClick={saveBankDetails} disabled={profileSaving}>
                    {profileSaving ? 'Saving...' : '💾 Save Bank Details'}
                  </button>
                </div>

                {/* Aadhaar Verification Card */}
                <div className="sd-profile-card">
                  <div className="sd-profile-card-title">🪪 Aadhaar Verification</div>
                  <div className="sd-profile-card-sub">Verify your identity using your Aadhaar card</div>

                  <div className={`sd-aadhaar-status ${aadhaarStatus}`}>
                    {aadhaarStatus === 'verified' && '✅ Verified'}
                    {aadhaarStatus === 'unverified' && '⚠️ Not Verified'}
                    {aadhaarStatus === 'pending' && '🕐 Pending'}
                  </div>

                  {aadhaarStatus !== 'verified' && (
                    <>
                      <div className="sd-form-group">
                        <label className="sd-form-label">Aadhaar Number *</label>
                        <input
                          type="text"
                          className="sd-form-input"
                          value={profileData.aadhaar_number}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                            setProfileData({ ...profileData, aadhaar_number: val });
                          }}
                          placeholder="12-digit Aadhaar number"
                          maxLength={12}
                          disabled={otpSent}
                        />
                      </div>

                      {!otpSent ? (
                        <button
                          className="sd-otp-btn"
                          style={{ width: '100%', marginTop: '0.5rem' }}
                          onClick={sendAadhaarOtp}
                          disabled={aadhaarSending || profileData.aadhaar_number.length !== 12}
                        >
                          {aadhaarSending ? 'Sending OTP...' : '📱 Send OTP'}
                        </button>
                      ) : (
                        <>
                          <div className="sd-form-group" style={{ marginTop: '1rem' }}>
                            <label className="sd-form-label">Enter OTP</label>
                            <div className="sd-otp-row">
                              <input
                                type="text"
                                className="sd-otp-input"
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="••••••"
                                maxLength={6}
                              />
                              <button
                                className="sd-otp-btn"
                                onClick={verifyAadhaarOtp}
                                disabled={aadhaarSending || otp.length < 4}
                              >
                                {aadhaarSending ? 'Verifying...' : 'Verify'}
                              </button>
                            </div>
                          </div>
                          <div
                            className="sd-resend-link"
                            onClick={() => { setOtpSent(false); setOtp(''); setProfileMsg({ type: '', text: '' }); }}
                          >
                            ← Change Aadhaar number / Resend OTP
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {aadhaarStatus === 'verified' && (
                    <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: muted, lineHeight: 1.6 }}>
                      Your Aadhaar has been successfully verified. If you need to update it, please contact support.
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </div>
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="sd-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sd-modal" onClick={e => e.stopPropagation()}>
            <h2 className="sd-modal-title">
              {editingId ? '✏️ Edit Category' : '➕ Add New Category'}
            </h2>

            <div className="sd-form-group">
              <label className="sd-form-label">Emoji</label>
              <div className="sd-emoji-grid">
                {['🧱', '⚙️', '🪵', '🔧', '🪟', '🎨', '🪨', '💡', '🔩', '🏗️', '⛏️', '🛠️'].map(emoji => (
                  <button
                    key={emoji}
                    className={`sd-emoji-btn ${formData.emoji === emoji ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, emoji })}
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="sd-form-group">
              <label className="sd-form-label">Category Name *</label>
              <input
                type="text"
                className="sd-form-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., CEMENT & CONCRETE"
              />
            </div>

            <div className="sd-form-group">
              <label className="sd-form-label">Label *</label>
              <select
                className="sd-form-select"
                value={formData.label}
                onChange={e => setFormData({ ...formData, label: e.target.value })}
              >
                <option value="">Select label</option>
                {labelOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="sd-form-group">
              <label className="sd-form-label">Label Color *</label>
              <select
                className="sd-form-select"
                value={formData.labelColor}
                onChange={e => setFormData({ ...formData, labelColor: e.target.value })}
              >
                {labelColorOptions.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div className="sd-form-group">
              <label className="sd-form-label">Price Range *</label>
              <input
                type="text"
                className="sd-form-input"
                value={formData.priceRange}
                onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                placeholder="e.g., ₹380–450 / bag"
              />
            </div>

            <div className="sd-form-group">
              <label className="sd-form-label">Unit *</label>
              <input
                type="text"
                className="sd-form-input"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., per 50kg bag"
              />
            </div>

            <div className="sd-modal-buttons">
              <button className="sd-btn-primary" onClick={saveCategory}>
                {editingId ? '💾 Update' : '✅ Add'}
              </button>
              <button className="sd-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}