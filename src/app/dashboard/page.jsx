'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import QuickServicesManager from '../components/QuickServicesManager';
import PrimaryServicesManager from '../components/PrimaryServicesManager';
import ProfessionalServicesManager from '../components/ProfessionalServicesManager';
import ProfessionalEnquiriesManager from '../components/ProfessionalEnquiriesManager';
import ShopCategoriesManager from '../components/ShopCategoriesManager';
import PropertiesManager from '../components/PropertiesManager';
import ProjectsManager from '../components/ProjectsManager';
import VendorManagementAdmin from '../components/VendorManagementAdmin';
import SupplierHubAdmin from '../components/SupplierHubAdmin';
import FranchisesManager from './franchises/page';
import AgentsManager from './agents/page';
import BookingsManager from '../components/BookingsManager';
import FreeTimeSlotsManager from '../components/FreeTimeSlotsManager';
import QuickServicesPricing from '../components/QuickServicesPricing';
import CalculatorManager from '../components/CalculatorManager';
import RevenueManager from '../components/RevenueManager';
import HeroBannersManager from '../components/HeroBannersManager';

function getResumeActionUrl(resumeUrl, mode) {
  if (!resumeUrl) return '';

  try {
    if (typeof window === 'undefined') return resumeUrl;
    const { pathname } = new URL(resumeUrl, window.location.origin);
    const marker = '/uploads/resumes/';

    if (!pathname.startsWith(marker)) return resumeUrl;

    const filename = pathname.slice(marker.length);
    return `/api/career-enquiries/resume/${encodeURIComponent(filename)}?mode=${mode}`;
  } catch {
    return resumeUrl;
  }
}

function getResumeViewerUrl(resumeUrl, resumeName) {
  const viewUrl = getResumeActionUrl(resumeUrl, 'view');
  if (!viewUrl) return '';

  const params = new URLSearchParams({
    url: viewUrl,
    name: resumeName || 'Resume',
  });

  return `/dashboard/resume-viewer?${params.toString()}`;
}

function AdminDashboard() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [primaryServiceEnquiries, setPrimaryServiceEnquiries] = useState([]);
  const [selectedPrimaryServiceEnquiry, setSelectedPrimaryServiceEnquiry] = useState(null);
  const [pseSearch, setPseSearch] = useState('');
  const [careerEnquiries, setCareerEnquiries] = useState([]);
  const [selectedCareerEnquiry, setSelectedCareerEnquiry] = useState(null);
  const [pendingProperties, setPendingProperties] = useState(0);
  const [pendingVendors, setPendingVendors] = useState(0);
  const [pendingSuppliers, setPendingSuppliers] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [activeVendorBookings, setActiveVendorBookings] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [todayCommission, setTodayCommission] = useState(0);
  const [totalGST, setTotalGST] = useState(0);
  const [supplierCommission, setSupplierCommission] = useState({ total: 0, today: 0, fulfilled: 0, open: 0 });
  const router = useRouter();

  // Sync tab from URL when navigating via sidebar
  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark-mode');
    setIsDarkMode(isDark);

    const observer = new MutationObserver(() => {
      setIsDarkMode(html.classList.contains('dark-mode'));
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch contact submissions
        const contactRes = await fetch('/api/contact', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const contactData = await contactRes.json();
        if (contactData.success) setSubmissions(contactData.data);

        const primaryEnquiryRes = await fetch('/api/primary-service-enquiries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const primaryEnquiryData = await primaryEnquiryRes.json();
        if (primaryEnquiryData.success) setPrimaryServiceEnquiries(primaryEnquiryData.data);

        const careerEnquiryRes = await fetch('/api/career-enquiries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const careerEnquiryData = await careerEnquiryRes.json();
        if (careerEnquiryData.success) setCareerEnquiries(careerEnquiryData.data);

        // Fetch properties
        const propsRes = await fetch('/api/properties?status=all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const propsData = await propsRes.json();
        if (propsData.success) {
          setPendingProperties(propsData.data.filter(p => p.status === 'pending').length);
        }

        // Fetch vendors
        const vendorsRes = await fetch('/api/admin/vendors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Fetch suppliers + commission summary
        const suppliersRes = await fetch('/api/admin/suppliers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const suppliersData = await suppliersRes.json();
        if (suppliersData.success) {
          setPendingSuppliers(suppliersData.data.filter(s => s.status === 'pending').length);
        }

        // Fetch supplier commission summary via PATCH
        try {
          const commRes = await fetch('/api/admin/suppliers', {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const commData = await commRes.json();
          if (commData.success) {
            setSupplierCommission({
              total: parseFloat(commData.data.total_commission || 0),
              today: parseFloat(commData.data.today_commission || 0),
              fulfilled: parseInt(commData.data.total_fulfilled || 0),
              open: parseInt(commData.data.open_enquiries || 0),
            });
          }
        } catch { /* non-critical */ }

        // Fetch bookings
        const bookingsRes = await fetch('/api/admin/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const bookingsData = await bookingsRes.json();
        if (bookingsData.success) {
          const all = bookingsData.data;
          const today = new Date().toISOString().split('T')[0];

          setPendingBookings(all.filter(b => b.status === 'WAITING_FOR_VENDOR_ACCEPTANCE').length);
          setCompletedBookings(all.filter(b => b.status === 'COMPLETED').length);
          setActiveVendorBookings(all.filter(b => ['VENDOR_ACCEPTED', 'VENDOR_ON_WAY', 'IN_PROGRESS'].includes(b.status)).length);

          const completed = all.filter(b => b.status === 'COMPLETED');
          const calcCommission = b => Math.round((parseFloat(b.final_amount || b.total_amount || 0)) * 0.15);
          const calcGST        = b => Math.round((parseFloat(b.final_amount || b.total_amount || 0)) * 0.18);

          setTotalCommission(completed.reduce((s, b) => s + calcCommission(b), 0));
          setTotalGST(completed.reduce((s, b) => s + calcGST(b), 0));
          setTodayCommission(
            completed
              .filter(b => b.completed_at && b.completed_at.startsWith(today))
              .reduce((s, b) => s + calcCommission(b), 0)
          );
        }
        const vendorsData = await vendorsRes.json();
        if (vendorsData.success) {
          setPendingVendors(vendorsData.data.filter(v => v.verification_status === 'pending').length);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: 'Pending Bookings', value: pendingBookings, icon: '⏳', color: 'a' },
    { label: 'Active (On Way/Work)', value: activeVendorBookings, icon: '🚀', color: 'b' },
    { label: 'Completed Bookings', value: completedBookings, icon: '✓', color: 'c' },
    { label: 'Pending Vendors', value: pendingVendors, icon: '🏪', color: 'd' },
  ];

  const getStatusColor = (status) => {
    const map = {
      'New': 'status-new',
      'Pending': 'status-pending',
      'Contacted': 'status-contacted',
      'Resolved': 'status-resolved',
    };
    return map[status] || 'status-new';
  };
  const tabs = [
    { id: 'overview',                   label: 'Overview',                  icon: '▦'  },
    { id: 'agents',                     label: 'Agents',                    icon: '👤' },
    { id: 'calculator',                 label: 'Calculator',                icon: '🧮' },
    { id: 'hero-banners',              label: 'Hero Banners',              icon: '🖼️' },
    { id: 'career-enquiries',           label: 'Career Enquiry',            icon: '✉'  },
    { id: 'submissions',                label: 'Contact Forms',             icon: '✉'  },
    { id: 'franchises',                 label: 'Franchises',                icon: '🏢' },
    { id: 'free-slots',                 label: 'Free Time Slots',           icon: '📅' },
    { id: 'primary-services',           label: 'Primary Services',          icon: '⊞'  },
    { id: 'primary-service-enquiries',  label: 'Primary Services Enquiry',  icon: '✉'  },
    { id: 'professional-enquiries',     label: 'Professional Enquiries',    icon: '💬' },
    { id: 'professionals',              label: 'Professional Services',     icon: '👔' },
    { id: 'projects',                   label: 'Projects',                  icon: '🏗️' },
    { id: 'properties',                 label: 'Properties',                icon: '⌂'  },
    { id: 'quick-services',             label: 'Quick Services',            icon: '⚡' },
    { id: 'revenue',                    label: 'Revenue & Earnings',        icon: '💸' },
    { id: 'bookings',                   label: 'Service Bookings',          icon: '📝' },
    { id: 'quick-services-pricing',     label: 'Service Pricing',           icon: '💰' },
    { id: 'shop-categories',            label: 'Shop Categories',           icon: '🛒' },
    { id: 'suppliers',                  label: 'Suppliers',                 icon: '📦' },
    { id: 'vendors',                    label: 'Vendors',                   icon: '🏪' },
  ];

  if (loading) {
    return (
      <div className="dash-loading">
        <span>Loading…</span>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'auth-token=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <>
      <style>{`
        /* ── Tokens ── */
        :root {
          --bg:        #f5f5f7;
          --surface:   #ffffff;
          --border:    #e2e2e7;
          --text:      #111113;
          --muted:     #6b6b76;
          --accent:    #2563eb;
          --accent-lt: #eff4ff;

          --stat-a-bg: #f0f4ff;
          --stat-a-tx: #1e3a8a;
          --stat-b-bg: #fff7ed;
          --stat-b-tx: #9a3412;
          --stat-c-bg: #f0fdf4;
          --stat-c-tx: #14532d;
          --stat-d-bg: #fef3c7;
          --stat-d-tx: #92400e;

          --sn-bg: #dbeafe; --sn-tx: #1e40af;
          --sp-bg: #ffedd5; --sp-tx: #9a3412;
          --sc-bg: #dbeafe; --sc-tx: #1e40af;
          --sr-bg: #dcfce7; --sr-tx: #166534;
        }
        .dark-mode {
          --bg:        #0f0f11;
          --surface:   #18181c;
          --border:    #2a2a30;
          --text:      #f0f0f5;
          --muted:     #7c7c8a;
          --accent:    #60a5fa;
          --accent-lt: #1e2a3a;

          --stat-a-bg: #1a2035; --stat-a-tx: #93c5fd;
          --stat-b-bg: #2a1a0e; --stat-b-tx: #fb923c;
          --stat-c-bg: #0f2a18; --stat-c-tx: #86efac;
          --stat-d-bg: #2a1f0e; --stat-d-tx: #fbbf24;

          --sn-bg: #1e2a3a; --sn-tx: #93c5fd;
          --sp-bg: #2a1a0e; --sp-tx: #fb923c;
          --sc-bg: #1e2a3a; --sc-tx: #93c5fd;
          --sr-bg: #0f2a18; --sr-tx: #86efac;
        }

        /* ── Base ── */
        .dash-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'DM Sans', system-ui, sans-serif;
          color: var(--text);
        }
        .dash-loading {
          display: flex; align-items: center; justify-content: center;
          min-height: 100vh;
          background: var(--bg); color: var(--muted);
          font-size: 0.875rem;
        }

        /* ── Header ── */
        .dash-header {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }
        .dash-header-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0.875rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .dash-title { font-size: 1.125rem; font-weight: 700; letter-spacing: -0.02em; }
        .dash-subtitle { font-size: 0.75rem; color: var(--muted); margin-top: 1px; }
        .dash-export-btn {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.4rem 0.875rem;
          background: var(--accent); color: #fff;
          border: none; border-radius: 6px;
          font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; transition: opacity .15s;
        }
        .dash-export-btn:hover { opacity: .85; }

        .dash-logout-btn {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.4rem 0.875rem;
          background: transparent; color: var(--muted);
          border: 1px solid var(--border); border-radius: 6px;
          font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; transition: all .15s;
        }
        .dash-logout-btn:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

        /* ── Tabs ── */
        .dash-tabs-bar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 40;
        }
        .dash-tabs-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 1.5rem 4px;
          display: flex; overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
        .dash-tabs-inner::-webkit-scrollbar { height: 4px; }
        .dash-tabs-inner::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
        .dash-tabs-inner::-webkit-scrollbar-track { background: transparent; }
        .dash-tab {
          display: flex; align-items: center; gap: 0.375rem;
          padding: 0.6rem 1rem;
          font-size: 0.8125rem; font-weight: 500;
          color: var(--muted);
          border: none; background: none;
          border-bottom: 2px solid transparent;
          cursor: pointer; white-space: nowrap;
          transition: color .15s, border-color .15s;
          margin-bottom: -1px;
        }
        .dash-tab:hover { color: var(--text); }
        .dash-tab.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }
        .dash-tab-icon { font-size: 0.875rem; }

        /* ── Content ── */
        .dash-content {
          max-width: 1280px; margin: 0 auto;
          padding: 1.25rem 1.5rem;
        }

        /* ── Stat Cards ── */
        .dash-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 0.75rem; margin-bottom: 1rem; }
        @media(max-width:640px){ .dash-stats { grid-template-columns: 1fr; } }
        @media(max-width:1024px){ .dash-stats { grid-template-columns: repeat(2,1fr); } }

        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem 1.25rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .stat-card-a { background: var(--stat-a-bg); border-color: transparent; }
        .stat-card-b { background: var(--stat-b-bg); border-color: transparent; }
        .stat-card-c { background: var(--stat-c-bg); border-color: transparent; }
        .stat-card-d { background: var(--stat-d-bg); border-color: transparent; }
        .stat-label {
          font-size: 0.6875rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: .06em; color: var(--muted); margin-bottom: 0.25rem;
        }
        .stat-card-a .stat-label { color: var(--stat-a-tx); opacity: .7; }
        .stat-card-b .stat-label { color: var(--stat-b-tx); opacity: .7; }
        .stat-card-c .stat-label { color: var(--stat-c-tx); opacity: .7; }
        .stat-card-d .stat-label { color: var(--stat-d-tx); opacity: .7; }
        .stat-value { font-size: 1.75rem; font-weight: 700; line-height: 1; }
        .stat-card-a .stat-value { color: var(--stat-a-tx); }
        .stat-card-b .stat-value { color: var(--stat-b-tx); }
        .stat-card-c .stat-value { color: var(--stat-c-tx); }
        .stat-card-d .stat-value { color: var(--stat-d-tx); }
        .stat-icon { font-size: 1.5rem; opacity: .5; }

        /* ── Panel ── */
        .panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          margin-bottom: 0.75rem;
          overflow: hidden;
        }
        .panel-header {
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .panel-title { font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
        .panel-body { padding: 0.875rem 1.25rem; }

        /* ── Submission Row ── */
        .sub-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.6rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background .12s;
        }
        .sub-row:hover { background: var(--bg); }
        .sub-name { font-size: 0.8125rem; font-weight: 600; }
        .sub-meta { font-size: 0.75rem; color: var(--muted); margin-top: 1px; }

        /* ── Status Badges ── */
        .badge {
          display: inline-block;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
          font-size: 0.6875rem; font-weight: 600;
        }
        .status-new      { background: var(--sn-bg); color: var(--sn-tx); }
        .status-pending  { background: var(--sp-bg); color: var(--sp-tx); }
        .status-contacted{ background: var(--sc-bg); color: var(--sc-tx); }
        .status-resolved { background: var(--sr-bg); color: var(--sr-tx); }

        /* ── Pending Alert ── */
        .pending-alert {
          background: var(--surface);
          border: 1px solid var(--border);
          border-left: 3px solid #f97316;
          border-radius: 8px;
          padding: 1rem 1.25rem;
        }
        .pending-alert-title { font-size: 0.8125rem; font-weight: 700; margin-bottom: 0.375rem; }
        .pending-alert-body  { font-size: 0.8125rem; color: var(--muted); margin-bottom: 0.75rem; }
        .pending-alert-body strong { color: #f97316; }
        .review-btn {
          padding: 0.4rem 0.875rem;
          background: #f97316; color: #fff;
          border: none; border-radius: 6px;
          font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; transition: opacity .15s;
        }
        .review-btn:hover { opacity: .85; }

        /* ── Submissions Tab ── */
        .section-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .section-head-title { font-size: 0.875rem; font-weight: 700; }
        .search-input {
          padding: 0.35rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface);
          color: var(--text);
          font-size: 0.8125rem;
          outline: none;
          width: 200px;
          transition: border-color .15s;
        }
        .search-input:focus { border-color: var(--accent); }
        .search-input::placeholder { color: var(--muted); }

        /* ── Modal ── */
        .modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.45);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem; z-index: 50;
        }
        .modal {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          max-width: 540px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          padding: 1.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,.2);
        }
        .modal-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .modal-title { font-size: 0.9375rem; font-weight: 700; }
        .modal-close {
          background: none; border: none; cursor: pointer;
          color: var(--muted); font-size: 1.25rem; line-height: 1;
          padding: 0.125rem 0.25rem; border-radius: 4px;
          transition: background .12s;
        }
        .modal-close:hover { background: var(--bg); }
        .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .modal-field-label {
          font-size: 0.6875rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: .06em;
          color: var(--muted); margin-bottom: 0.25rem;
        }
        .modal-field-value { font-size: 0.8125rem; font-weight: 600; }
        .modal-message {
          background: var(--bg); border-radius: 6px;
          padding: 0.75rem; font-size: 0.8125rem;
          color: var(--muted); line-height: 1.6;
          margin-bottom: 1.25rem;
        }
        .modal-close-btn {
          width: 100%; padding: 0.5rem;
          background: var(--accent); color: #fff;
          border: none; border-radius: 6px;
          font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; transition: opacity .15s;
        }
        .modal-close-btn:hover { opacity: .85; }

        .empty-state {
          text-align: center; padding: 2rem;
          font-size: 0.8125rem; color: var(--muted);
        }
      `}</style>

      <div className="dash-root">
        {/* Header */}
        <div className="dash-header">
          <div className="dash-header-inner">
            <div>
              <div className="dash-title">Admin Dashboard</div>
              <div className="dash-subtitle">Manage properties, forms, vendors &amp; services</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="dash-export-btn">↗ Export</button>
              <button className="dash-logout-btn" onClick={handleLogout}>
                ⎋ Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="dash-tabs-bar">
          <div className="dash-tabs-inner">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`dash-tab${activeTab === tab.id ? ' active' : ''}`}
              >
                <span className="dash-tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="dash-content">

          {/* Overview */}
          {activeTab === 'overview' && (
            <>
              <div className="dash-stats">
                {stats.map((s, i) => (
                  <div key={i} className={`stat-card stat-card-${['a', 'b', 'c', 'd'][i]}`}>
                    <div>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                    </div>
                    <span className="stat-icon">{s.icon}</span>
                  </div>
                ))}
              </div>

              {/* Admin Earnings */}
              <div className="panel" style={{ marginBottom: '1rem' }}>
                <div className="panel-header">
                  <span className="panel-title">💰 Admin Earnings (Commission)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', padding: '1rem' }}>
                  {[
                    { label: "Today's Commission", value: `₹${todayCommission.toLocaleString('en-IN')}`, sub: '15% of today\'s bookings', color: '#facc15' },
                    { label: 'Total Commission', value: `₹${totalCommission.toLocaleString('en-IN')}`, sub: '15% of all completed', color: '#4ade80' },
                    { label: 'Total GST Collected', value: `₹${totalGST.toLocaleString('en-IN')}`, sub: '18% collected from users', color: '#60a5fa' },
                  ].map(({ label, value, sub, color }) => (
                    <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1.25rem' }}>
                      <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', marginBottom: '0.5rem' }}>{label}</p>
                      <p style={{ fontSize: '1.75rem', fontWeight: 900, color }}>{value}</p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supplier Marketplace Commission */}
              <div className="panel" style={{ marginBottom: '1rem' }}>
                <div className="panel-header">
                  <span className="panel-title">📦 Supplier Marketplace Commission (15%)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', padding: '1rem' }}>
                  {[
                    { label: "Today's Commission", value: `₹${supplierCommission.today.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: '#facc15' },
                    { label: 'Total Commission', value: `₹${supplierCommission.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: '#4ade80' },
                    { label: 'Orders Fulfilled', value: supplierCommission.fulfilled, color: '#60a5fa' },
                    { label: 'Open Enquiries', value: supplierCommission.open, color: '#f97316' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem' }}>
                      <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', marginBottom: '0.5rem' }}>{label}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 900, color }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">Recent Contact Submissions</span>
                </div>
                <div className="panel-body">
                  {submissions.length === 0 ? (
                    <p className="empty-state">No submissions yet.</p>
                  ) : (
                    <div>
                      {submissions.slice(0, 5).map((item) => (
                        <div key={item.id} className="sub-row" onClick={() => setSelectedSubmission(item)}>
                          <div>
                            <div className="sub-name">{item.name}</div>
                            <div className="sub-meta">{item.email} · {item.department}</div>
                          </div>
                          <span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {pendingProperties > 0 && (
                <div className="pending-alert">
                  <div className="pending-alert-title">Pending Properties Review</div>
                  <div className="pending-alert-body">
                    <strong>{pendingProperties}</strong> {pendingProperties === 1 ? 'property' : 'properties'} awaiting verification.
                  </div>
                  <button onClick={() => setActiveTab('properties')} className="review-btn">
                    Review Properties →
                  </button>
                </div>
              )}

              {pendingVendors > 0 && (
                <div className="pending-alert">
                  <div className="pending-alert-title">Pending Vendor Verification</div>
                  <div className="pending-alert-body">
                    <strong>{pendingVendors}</strong> {pendingVendors === 1 ? 'vendor' : 'vendors'} awaiting approval.
                  </div>
                  <button onClick={() => setActiveTab('vendors')} className="review-btn">
                    Review Vendors →
                  </button>
                </div>
              )}

              {pendingSuppliers > 0 && (
                <div className="pending-alert">
                  <div className="pending-alert-title">📦 Pending Supplier Applications</div>
                  <div className="pending-alert-body">
                    <strong>{pendingSuppliers}</strong> {pendingSuppliers === 1 ? 'supplier' : 'suppliers'} awaiting approval.
                  </div>
                  <button onClick={() => setActiveTab('suppliers')} className="review-btn">
                    Review Suppliers →
                  </button>
                </div>
              )}

              {pendingBookings > 0 && (
                <div className="pending-alert">
                  <div className="pending-alert-title">⏳ Pending Service Bookings</div>
                  <div className="pending-alert-body">
                    <strong>{pendingBookings}</strong> {pendingBookings === 1 ? 'booking' : 'bookings'} waiting for vendor assignment.
                  </div>
                  <button onClick={() => setActiveTab('bookings')} className="review-btn">
                    Review Bookings →
                  </button>
                </div>
              )}

              {activeVendorBookings > 0 && (
                <div className="pending-alert">
                  <div className="pending-alert-title">🚀 Active Vendor Bookings</div>
                  <div className="pending-alert-body">
                    <strong>{activeVendorBookings}</strong> {activeVendorBookings === 1 ? 'booking is' : 'bookings are'} currently being worked on.
                  </div>
                  <button onClick={() => setActiveTab('bookings')} className="review-btn">
                    View Details →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Contact Submissions */}
          {activeTab === 'submissions' && (
            <div>
              <div className="section-head">
                <span className="section-head-title">Contact Submissions</span>
                <input type="text" placeholder="Search…" className="search-input" />
              </div>
              <div className="panel">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                        {['Name', 'Email', 'Department', 'Status', 'Date', 'Action'].map(col => (
                          <th key={col} style={{ padding: '0.5rem 0.875rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.6rem 0.875rem', fontWeight: '600' }}>{item.name}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.email}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.department}</td>
                          <td style={{ padding: '0.6rem 0.875rem' }}><span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span></td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                          <td style={{ padding: '0.6rem 0.875rem' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '0.8125rem', fontWeight: '600', padding: 0 }} onClick={() => setSelectedSubmission(item)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {submissions.length === 0 && <p className="empty-state">No contact submissions yet.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'primary-service-enquiries' && (
            <div>
              <div className="section-head">
                <span className="section-head-title">Primary Services Enquiry</span>
                <input
                  type="text"
                  placeholder="Search name, phone, service, email…"
                  className="search-input"
                  value={pseSearch}
                  onChange={e => setPseSearch(e.target.value)}
                />
              </div>
              <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                        {['Enquirer', 'Service & Location', 'Budget', 'Carpet Area', 'Meeting Date', 'Time Slot', 'Images', 'Status', 'Submitted', 'Action'].map(col => (
                          <th key={col} style={{ padding: '0.55rem 0.875rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {primaryServiceEnquiries
                        .filter(item => {
                          const q = pseSearch.toLowerCase();
                          return !q ||
                            item.name?.toLowerCase().includes(q) ||
                            item.phone?.includes(q) ||
                            item.email?.toLowerCase().includes(q) ||
                            item.service_title?.toLowerCase().includes(q) ||
                            item.address?.toLowerCase().includes(q);
                        })
                        .map((item) => {
                          const imgUrls = Array.isArray(item.property_image_urls)
                            ? item.property_image_urls
                            : item.property_image_url ? [item.property_image_url] : [];
                          return (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '0.6rem 0.875rem', minWidth: '150px' }}>
                                <div style={{ fontWeight: 700 }}>{item.name}</div>
                                <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{item.phone}</div>
                                {item.email && <div style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>{item.email}</div>}
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem', minWidth: '160px' }}>
                                <div style={{ fontWeight: 600 }}>{item.service_title}</div>
                                {item.address && (
                                  <div style={{ color: 'var(--muted)', fontSize: '0.7rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    📍 {item.address}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{item.budget || '—'}</td>
                              <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{item.carpet_area ? `${item.carpet_area} sqft` : '—'}</td>
                              <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                                {item.meeting_date ? new Date(item.meeting_date).toLocaleDateString('en-IN') : '—'}
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{item.time_slot || '—'}</td>
                              <td style={{ padding: '0.6rem 0.875rem' }}>
                                {imgUrls.length > 0 ? (
                                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    {imgUrls.slice(0, 3).map((url, i) => (
                                      <img key={i} src={url} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border)' }}
                                        onError={ev => { ev.target.style.display = 'none'; }} />
                                    ))}
                                    {imgUrls.length > 3 && <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700 }}>+{imgUrls.length - 3}</span>}
                                  </div>
                                ) : <span style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>—</span>}
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem' }}>
                                <select
                                  value={item.status}
                                  onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
                                    await fetch('/api/primary-service-enquiries', {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                      body: JSON.stringify({ id: item.id, status: newStatus }),
                                    });
                                    setPrimaryServiceEnquiries(prev => prev.map(x => x.id === item.id ? { ...x, status: newStatus } : x));
                                  }}
                                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '4px', padding: '3px 6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                  {['New', 'Reviewing', 'In Progress', 'Completed', 'Cancelled'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                                {new Date(item.created_at).toLocaleDateString('en-IN')}
                                <div style={{ fontSize: '0.68rem' }}>{new Date(item.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                              </td>
                              <td style={{ padding: '0.6rem 0.875rem' }}>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '0.8125rem', fontWeight: '700', padding: 0, whiteSpace: 'nowrap' }}
                                  onClick={() => setSelectedPrimaryServiceEnquiry(item)}>
                                  View All
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {primaryServiceEnquiries.length === 0 && <p className="empty-state">No primary services enquiries yet.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'career-enquiries' && (
            <div>
              <div className="section-head">
                <span className="section-head-title">Career Enquiry</span>
                <input type="text" placeholder="Search..." className="search-input" />
              </div>
              <div className="panel">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                        {['Name', 'Email', 'Phone', 'Position', 'Experience', 'Status', 'Date', 'Action'].map(col => (
                          <th key={col} style={{ padding: '0.5rem 0.875rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {careerEnquiries.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.6rem 0.875rem', fontWeight: '600' }}>{item.name}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.email}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.phone}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.position}</td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{item.experience}</td>
                          <td style={{ padding: '0.6rem 0.875rem' }}><span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span></td>
                          <td style={{ padding: '0.6rem 0.875rem', color: 'var(--muted)' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                          <td style={{ padding: '0.6rem 0.875rem' }}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '0.8125rem', fontWeight: '600', padding: 0 }} onClick={() => setSelectedCareerEnquiry(item)}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {careerEnquiries.length === 0 && <p className="empty-state">No career enquiries yet.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vendors' && <VendorManagementAdmin isDarkMode={isDarkMode} />}
          {activeTab === 'suppliers' && <SupplierHubAdmin isDarkMode={isDarkMode} />}
          {activeTab === 'properties' && <PropertiesManager isDarkMode={isDarkMode} />}
          {activeTab === 'quick-services' && <QuickServicesManager isDarkMode={isDarkMode} />}
          {activeTab === 'primary-services' && <PrimaryServicesManager isDarkMode={isDarkMode} />}
          {activeTab === 'professionals' && <ProfessionalServicesManager isDarkMode={isDarkMode} />}
          {activeTab === 'professional-enquiries' && <ProfessionalEnquiriesManager isDarkMode={isDarkMode} />}
          {activeTab === 'agents' && <AgentsManager />}
          {activeTab === 'franchises' && <FranchisesManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'shop-categories' && <ShopCategoriesManager isDarkMode={isDarkMode} />}
          {activeTab === 'bookings' && <BookingsManager isDarkMode={isDarkMode} />}
          {activeTab === 'revenue' && <RevenueManager isDarkMode={isDarkMode} />}
          {activeTab === 'free-slots' && <FreeTimeSlotsManager isDarkMode={isDarkMode} />}
          {activeTab === 'quick-services-pricing' && <QuickServicesPricing isDarkMode={isDarkMode} />}
          {activeTab === 'calculator' && <CalculatorManager isDarkMode={isDarkMode} />}
          {activeTab === 'hero-banners' && <HeroBannersManager isDarkMode={isDarkMode} />}

        </div>

        {/* Modal */}
        {selectedSubmission && (
          <div className="modal-backdrop" onClick={() => setSelectedSubmission(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <span className="modal-title">Submission Details</span>
                <button className="modal-close" onClick={() => setSelectedSubmission(null)}>✕</button>
              </div>

              <div className="modal-grid">
                {[
                  ['Name', selectedSubmission.name],
                  ['Email', selectedSubmission.email],
                  ['Phone', selectedSubmission.phone],
                  ['Department', selectedSubmission.department],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="modal-field-label">{label}</div>
                    <div className="modal-field-value">{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <div className="modal-field-label">Subject</div>
                <div className="modal-field-value">{selectedSubmission.subject}</div>
              </div>

              <div className="modal-field-label" style={{ marginBottom: '0.375rem' }}>Message</div>
              <div className="modal-message">{selectedSubmission.message}</div>

              <button className="modal-close-btn" onClick={() => setSelectedSubmission(null)}>Close</button>
            </div>
          </div>
        )}

        {selectedPrimaryServiceEnquiry && (() => {
          const enq = selectedPrimaryServiceEnquiry;
          const imgUrls = Array.isArray(enq.property_image_urls)
            ? enq.property_image_urls
            : enq.property_image_url ? [enq.property_image_url] : [];
          const imgNames = Array.isArray(enq.property_image_names)
            ? enq.property_image_names
            : enq.property_image_name ? [enq.property_image_name] : [];

          const updateStatus = async (status) => {
            const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
            await fetch('/api/primary-service-enquiries', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ id: enq.id, status }),
            });
            const updated = { ...enq, status };
            setSelectedPrimaryServiceEnquiry(updated);
            setPrimaryServiceEnquiries(prev => prev.map(x => x.id === enq.id ? updated : x));
          };

          return (
            <div className="modal-backdrop" onClick={() => setSelectedPrimaryServiceEnquiry(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}
                style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: 0 }}>

                {/* Header */}
                <div className="modal-head" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface)' }}>
                  <div>
                    <span className="modal-title">{enq.service_title} Enquiry</span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
                      {new Date(enq.created_at).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <button className="modal-close" onClick={() => setSelectedPrimaryServiceEnquiry(null)}>✕</button>
                </div>

                {/* ── Section 1: Enquirer ── */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Enquirer Details</div>
                  <div className="modal-grid">
                    {[
                      ['Name', enq.name],
                      ['Phone', enq.phone],
                      ['Email', enq.email || '—'],
                      ['Service', enq.service_title],
                      ['Status', enq.status],
                      ['Submitted', new Date(enq.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="modal-field-label">{label}</div>
                        <div className="modal-field-value">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Section 2: Project Details ── */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Project Details</div>
                  <div className="modal-grid">
                    {[
                      ['Budget', enq.budget || '—'],
                      ['Carpet Area', enq.carpet_area ? `${enq.carpet_area} sqft` : '—'],
                      ['Time Slot', enq.time_slot || '—'],
                      ['Meeting Date', enq.meeting_date ? new Date(enq.meeting_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="modal-field-label">{label}</div>
                        <div className="modal-field-value">{value}</div>
                      </div>
                    ))}
                  </div>

                  {enq.gps_location && (
                    <div style={{ marginTop: '0.875rem' }}>
                      <div className="modal-field-label">GPS Location</div>
                      <a href={`https://maps.google.com/?q=${enq.gps_location}`} target="_blank" rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', marginTop: 4 }}>
                        📍 {enq.gps_location} — Open in Google Maps ↗
                      </a>
                    </div>
                  )}

                  {enq.address && (
                    <div style={{ marginTop: '0.875rem' }}>
                      <div className="modal-field-label">Full Address</div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text)', marginTop: 4, lineHeight: 1.6 }}>{enq.address}</div>
                    </div>
                  )}

                  {enq.message && (
                    <div style={{ marginTop: '0.875rem' }}>
                      <div className="modal-field-label" style={{ marginBottom: '0.375rem' }}>Project Description</div>
                      <div className="modal-message">{enq.message}</div>
                    </div>
                  )}
                </div>

                {/* ── Section 3: Property Images ── */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    Property Images {imgUrls.length > 0 && <span style={{ fontWeight: 600, color: 'var(--muted)' }}>({imgUrls.length} file{imgUrls.length !== 1 ? 's' : ''})</span>}
                  </div>
                  {imgUrls.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0 }}>No property images uploaded.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.75rem' }}>
                      {imgUrls.map((url, idx) => (
                        <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden', background: 'var(--bg)' }}>
                          <a href={url} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                            <img src={url} alt={imgNames[idx] || `Image ${idx + 1}`}
                              style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                              onError={ev => { ev.target.parentElement.parentElement.style.display = 'none'; }} />
                          </a>
                          <div style={{ padding: '0.45rem 0.6rem', display: 'flex', gap: '0.3rem' }}>
                            <a href={url} target="_blank" rel="noreferrer"
                              style={{ flex: 1, textAlign: 'center', padding: '0.35rem 0', fontSize: '0.7rem', fontWeight: 800, background: 'var(--accent)', color: '#111', textDecoration: 'none', borderRadius: '3px' }}>
                              🔍 View
                            </a>
                            <a href={url} download={imgNames[idx] || `property-image-${idx + 1}`}
                              style={{ flex: 1, textAlign: 'center', padding: '0.35rem 0', fontSize: '0.7rem', fontWeight: 700, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', textDecoration: 'none', borderRadius: '3px' }}>
                              ⬇ Save
                            </a>
                          </div>
                          {imgNames[idx] && (
                            <div style={{ padding: '0 0.6rem 0.5rem', fontSize: '0.65rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {imgNames[idx]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Section 4: Admin Actions ── */}
                <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 700, alignSelf: 'center' }}>Mark as:</span>
                    {['Reviewing', 'In Progress', 'Completed', 'Cancelled'].map(status => (
                      <button key={status}
                        onClick={() => updateStatus(status)}
                        style={{
                          padding: '0.35rem 0.75rem', fontSize: '0.72rem', fontWeight: 700,
                          border: '1px solid var(--border)',
                          background: enq.status === status ? 'var(--accent)' : 'var(--bg)',
                          color: enq.status === status ? '#111' : 'var(--text)',
                          borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap',
                        }}>
                        {status}
                      </button>
                    ))}
                  </div>
                  <button className="modal-close-btn" style={{ margin: 0 }}
                    onClick={() => setSelectedPrimaryServiceEnquiry(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {selectedCareerEnquiry && (
          <div className="modal-backdrop" onClick={() => setSelectedCareerEnquiry(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <span className="modal-title">Career Enquiry Details</span>
                <button className="modal-close" onClick={() => setSelectedCareerEnquiry(null)}>x</button>
              </div>

              <div className="modal-grid">
                {[
                  ['Name', selectedCareerEnquiry.name],
                  ['Email', selectedCareerEnquiry.email],
                  ['Phone', selectedCareerEnquiry.phone],
                  ['Position', selectedCareerEnquiry.position],
                  ['Department', selectedCareerEnquiry.department || '-'],
                  ['Location', selectedCareerEnquiry.job_location || '-'],
                  ['Experience', selectedCareerEnquiry.experience],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="modal-field-label">{label}</div>
                    <div className="modal-field-value">{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div className="modal-field-label">Resume</div>
                <div className="modal-field-value">{selectedCareerEnquiry.resume_name || 'Not Uploaded'}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.625rem' }}>
                  {selectedCareerEnquiry.resume_url ? (
                    <>
                    <a
                      href={getResumeViewerUrl(selectedCareerEnquiry.resume_url, selectedCareerEnquiry.resume_name)}
                      target="_blank"
                      rel="noreferrer"
                      className="modal-close-btn"
                      style={{ width: 'auto', textDecoration: 'none', padding: '0.45rem 0.875rem' }}
                    >
                      View Resume
                    </a>
                    <a
                      href={getResumeActionUrl(selectedCareerEnquiry.resume_url, 'download')}
                      download={selectedCareerEnquiry.resume_name || true}
                      className="modal-close-btn"
                      style={{ width: 'auto', textDecoration: 'none', padding: '0.45rem 0.875rem', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}
                    >
                      Download
                    </a>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled
                        className="modal-close-btn"
                        style={{ width: 'auto', padding: '0.45rem 0.875rem', opacity: 0.45, cursor: 'not-allowed' }}
                      >
                        View Resume
                      </button>
                      <button
                        type="button"
                        disabled
                        className="modal-close-btn"
                        style={{ width: 'auto', padding: '0.45rem 0.875rem', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', opacity: 0.45, cursor: 'not-allowed' }}
                      >
                        Download
                      </button>
                    </>
                  )}
                </div>
                {!selectedCareerEnquiry.resume_url && selectedCareerEnquiry.resume_name && selectedCareerEnquiry.resume_name !== 'Not Uploaded' && (
                  <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
                    Resume file is not available for this older submission. View and download will appear for new applications.
                  </p>
                )}
              </div>

              <div className="modal-grid">
                {[
                  ['Current Company', selectedCareerEnquiry.current_company || '-'],
                  ['Notice Period', selectedCareerEnquiry.notice_period || '-'],
                  ['Current Salary', selectedCareerEnquiry.current_salary || '-'],
                  ['Expected Salary', selectedCareerEnquiry.expected_salary || '-'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="modal-field-label">{label}</div>
                    <div className="modal-field-value">{value}</div>
                  </div>
                ))}
              </div>

              <div className="modal-field-label" style={{ marginBottom: '0.375rem' }}>Cover Letter</div>
              <div className="modal-message">{selectedCareerEnquiry.cover_letter || 'No cover letter provided.'}</div>

              <button className="modal-close-btn" onClick={() => setSelectedCareerEnquiry(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>Loading…</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
