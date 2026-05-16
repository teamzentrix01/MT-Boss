'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    completedBookings: 0,
    pendingAmount: 0,
    monthlyEarnings: 0,
  });
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

useEffect(() => {
  const vendorData = localStorage.getItem('vendor');
  const token = localStorage.getItem('vendor-token');
  if (!token || !vendorData) {
    router.push('/vendor/login');
    return;
  }
  try {
    setVendor(JSON.parse(vendorData));
    setLoading(false);

    // Fetch fresh vendor data from API to get image URLs
    fetch('/api/vendor/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.vendor) {
          setVendor(data.vendor);
          localStorage.setItem('vendor', JSON.stringify(data.vendor));
        }
      })
      .catch(() => {});

  } catch {
    router.push('/vendor/login');
  }
}, [router]);

  const fetchBookings = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/vendor/bookings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('vendor-token')}` }
      });
      const data = await res.json();
      if (data.success) setBookings(data.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchEarnings = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/vendor/earnings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('vendor-token')}` }
      });
      const data = await res.json();
      if (data.success) setEarnings(data.data || earnings);
    } catch (err) {
      console.error('Error fetching earnings:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendor-token');
    localStorage.removeItem('vendor');
    document.cookie = 'vendor-auth-token=; path=/; max-age=0';
    router.push('/vendor/login');
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

  const statusColor = (s) => {
    if (!s) return '#888';
    if (s === 'active') return '#22c55e';
    if (s === 'pending') return '#f59e0b';
    return '#888';
  };

  return (
    <>
      <style>{`
        /* Scoped to .vd-page — does NOT touch the real site navbar/footer */
        .vd-page {
          min-height: 100vh;
          background: ${dark ? '#0a0a0a' : '#f0ede8'};
          color: ${dark ? '#fff' : '#111'};
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* Internal top bar — only inside .vd-page */
        .vd-topbar {
          background: ${dark ? '#111' : '#fff'};
          border-bottom: 1px solid ${dark ? '#222' : '#e5e0d8'};
          padding: 0 2rem;
          height: 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
          /* Reset any inherited shrink from site layout */
          flex-shrink: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .vd-topbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 0;
        }

        .vd-logo {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          white-space: nowrap;
          color: ${dark ? '#fff' : '#111'};
          flex-shrink: 0;
        }
        .vd-logo span { color: #22c55e; }

        .vd-divider {
          width: 1px;
          height: 20px;
          background: ${dark ? '#333' : '#ddd'};
          flex-shrink: 0;
        }

        .vd-vendor-email {
          font-size: 0.8rem;
          color: ${dark ? '#666' : '#999'};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vd-topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        .vd-status-pill {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: ${dark ? '#0f2a1a' : '#dcfce7'};
          color: #22c55e;
          border: 1px solid #22c55e33;
        }

        .vd-logout-btn {
          padding: 0.5rem 1.1rem;
          background: transparent;
          color: ${dark ? '#888' : '#666'};
          border: 1px solid ${dark ? '#333' : '#ddd'};
          border-radius: 7px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.78rem;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .vd-logout-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        /* Body */
        .vd-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem;
        }

        /* Page header */
        .vd-page-header {
          margin-bottom: 2rem;
        }
        .vd-page-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.3rem;
          letter-spacing: -0.02em;
        }
        .vd-page-sub {
          font-size: 0.85rem;
          color: ${dark ? '#555' : '#999'};
        }

        /* Tabs */
        .vd-tabs {
          display: flex;
          border-bottom: 2px solid ${dark ? '#222' : '#e5e0d8'};
          margin-bottom: 2rem;
          gap: 0;
        }
        .vd-tab {
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
        .vd-tab:hover { color: ${dark ? '#fff' : '#111'}; }
        .vd-tab.active { color: #22c55e; }
        .vd-tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 2px;
          background: #22c55e;
        }

        /* Cards */
        .vd-card {
          background: ${dark ? '#111' : '#fff'};
          border: 1px solid ${dark ? '#222' : '#e5e0d8'};
          border-radius: 12px;
          padding: 1.5rem;
        }

        .vd-card-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: ${dark ? '#555' : '#aaa'};
          margin-bottom: 1.25rem;
        }

        /* Profile grid */
        .vd-profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        /* Identity card — full width */
        .vd-card-full {
          grid-column: 1 / -1;
        }

        .vd-rows { display: flex; flex-direction: column; gap: 0; }
        .vd-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid ${dark ? '#1a1a1a' : '#f0ede8'};
          gap: 1rem;
        }
        .vd-row:last-child { border-bottom: none; }
        .vd-row-label {
          font-size: 0.78rem;
          color: ${dark ? '#555' : '#aaa'};
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
          flex-shrink: 0;
        }
        .vd-row-value {
          font-size: 0.875rem;
          font-weight: 600;
          color: ${dark ? '#ddd' : '#222'};
          text-align: right;
        }

        .vd-badge {
          display: inline-block;
          padding: 0.25rem 0.7rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .vd-badge-green {
          background: ${dark ? '#0f2a1a' : '#dcfce7'};
          color: #22c55e;
        }
        .vd-badge-yellow {
          background: ${dark ? '#2a1f00' : '#fef9c3'};
          color: #ca8a04;
        }

        /* Bookings */
        .vd-bookings { display: flex; flex-direction: column; gap: 1rem; }
        .vd-booking-card {
          background: ${dark ? '#111' : '#fff'};
          border: 1px solid ${dark ? '#222' : '#e5e0d8'};
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }
        .vd-booking-ref {
          font-size: 0.75rem;
          color: ${dark ? '#555' : '#aaa'};
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.4rem;
        }
        .vd-booking-service {
          font-size: 0.95rem;
          font-weight: 700;
          color: ${dark ? '#ddd' : '#111'};
          margin-bottom: 0.5rem;
        }
        .vd-booking-meta {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .vd-booking-meta span {
          font-size: 0.8rem;
          color: ${dark ? '#666' : '#888'};
        }
        .vd-booking-amount {
          font-size: 1.1rem;
          font-weight: 700;
          color: #22c55e;
          white-space: nowrap;
        }

        /* Earnings stats */
        .vd-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .vd-stat-card {
          background: ${dark ? '#111' : '#fff'};
          border: 1px solid ${dark ? '#222' : '#e5e0d8'};
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }
        .vd-stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #22c55e;
          margin-bottom: 0.4rem;
          letter-spacing: -0.02em;
        }
        .vd-stat-label {
          font-size: 0.72rem;
          color: ${dark ? '#555' : '#aaa'};
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        /* Empty / loading states */
        .vd-empty {
          padding: 3rem;
          text-align: center;
          color: ${dark ? '#444' : '#bbb'};
          font-size: 0.875rem;
        }
        .vd-loading {
          padding: 2rem;
          text-align: center;
          color: ${dark ? '#555' : '#aaa'};
          font-size: 0.875rem;
        }

        @media (max-width: 640px) {
          .vd-topbar { padding: 0 1rem; }
          .vd-body { padding: 1rem; }
          .vd-page-title { font-size: 1.4rem; }
          .vd-tab { padding: 0.75rem 0.875rem; font-size: 0.7rem; }
          .vd-booking-card { flex-direction: column; }
          .vd-vendor-email { display: none; }
          .vd-divider { display: none; }
        }
      `}</style>

      <div className="vd-page">

        {/* Internal top bar — won't interfere with site navbar */}
        <div className="vd-topbar">
          <div className="vd-topbar-left">
            <div className="vd-logo">VENDOR<span>HUB</span></div>
            <div className="vd-divider" />
            <div className="vd-vendor-email">{vendor?.email}</div>
          </div>
          <div className="vd-topbar-right">
            <span className="vd-status-pill">
              {vendor?.verification_status || 'Pending'}
            </span>
            <button className="vd-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="vd-body">

          {/* Page header */}
          <div className="vd-page-header">
            <div className="vd-page-title">
              Welcome back 👋
            </div>
            <div className="vd-page-sub">
              {vendor?.email} · {vendor?.city}, {vendor?.state}
            </div>
          </div>

          {/* Tabs */}
          <div className="vd-tabs">
            <button
              className={`vd-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button
              className={`vd-tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('bookings'); fetchBookings(); }}
            >
              📅 Bookings
            </button>
            <button
              className={`vd-tab ${activeTab === 'earnings' ? 'active' : ''}`}
              onClick={() => { setActiveTab('earnings'); fetchEarnings(); }}
            >
              💰 Earnings
            </button>
          </div>

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div className="vd-profile-grid">

              {/* Account Info */}
              <div className="vd-card">
                <div className="vd-card-title">Account</div>
                <div className="vd-rows">
                  <div className="vd-row">
                    <span className="vd-row-label">Email</span>
                    <span className="vd-row-value">{vendor?.email}</span>
                  </div>
                  <div className="vd-row">
                    <span className="vd-row-label">Mobile</span>
                    <span className="vd-row-value">{vendor?.phone || '—'}</span>
                  </div>
                  <div className="vd-row">
                    <span className="vd-row-label">Status</span>
                    <span className="vd-row-value">
                      <span className={`vd-badge ${vendor?.status === 'active' ? 'vd-badge-green' : 'vd-badge-yellow'}`}>
                        {vendor?.status || 'Active'}
                      </span>
                    </span>
                  </div>
                  <div className="vd-row">
                    <span className="vd-row-label">Verification</span>
                    <span className="vd-row-value">
                      <span className={`vd-badge ${vendor?.verification_status === 'verified' ? 'vd-badge-green' : 'vd-badge-yellow'}`}>
                        {vendor?.verification_status || 'Pending'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="vd-card">
                <div className="vd-card-title">Address</div>
                <div className="vd-rows">
                  <div className="vd-row">
                    <span className="vd-row-label">City</span>
                    <span className="vd-row-value">{vendor?.city || '—'}</span>
                  </div>
                  <div className="vd-row">
                    <span className="vd-row-label">State</span>
                    <span className="vd-row-value">{vendor?.state || '—'}</span>
                  </div>
                  <div className="vd-row">
                    <span className="vd-row-label">Country</span>
                    <span className="vd-row-value">{vendor?.country || '—'}</span>
                  </div>
                  <div className="vd-row">
                    <span className="vd-row-label">Postal Code</span>
                    <span className="vd-row-value">{vendor?.postal_code || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Identity */}
              <div className="vd-card">
                <div className="vd-card-title">Identity</div>
                <div className="vd-rows">
                  <div className="vd-row">
                    <span className="vd-row-label">Aadhaar</span>
                    <span className="vd-row-value">
                      {vendor?.aadhar_number
                        ? `XXXX XXXX ${vendor.aadhar_number.slice(-4)}`
                        : '—'}
                    </span>
                  </div>
                  <div className="vd-row">
                    <span className="vd-row-label">Aadhaar Card</span>
                    <span className="vd-row-value">
                      <span className={`vd-badge ${vendor?.aadhar_image ? 'vd-badge-green' : 'vd-badge-yellow'}`}>
                        {vendor?.aadhar_image ? 'Uploaded' : 'Pending'}
                      </span>
                    </span>
                  </div>
                  <div className="vd-row">
                    <span className="vd-row-label">Profile Photo</span>
                    <span className="vd-row-value">
                      <span className={`vd-badge ${vendor?.profile_photo ? 'vd-badge-green' : 'vd-badge-yellow'}`}>
                        {vendor?.profile_photo ? 'Uploaded' : 'Pending'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── BOOKINGS TAB ── */}
          {activeTab === 'bookings' && (
            loadingData ? (
              <div className="vd-loading">Loading bookings...</div>
            ) : bookings.length > 0 ? (
              <div className="vd-bookings">
                {bookings.map(booking => (
                  <div key={booking.id} className="vd-booking-card">
                    <div>
                      <div className="vd-booking-ref">#{booking.booking_reference}</div>
                      <div className="vd-booking-service">{booking.service_label}</div>
                      <div className="vd-booking-meta">
                        <span>👤 {booking.user_name}</span>
                        <span>📅 {new Date(booking.booking_date).toLocaleDateString('en-IN')}</span>
                        <span className={`vd-badge ${booking.status === 'completed' ? 'vd-badge-green' : 'vd-badge-yellow'}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="vd-booking-amount">₹{booking.final_amount}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="vd-empty">No bookings yet — start accepting service requests!</div>
            )
          )}

          {/* ── EARNINGS TAB ── */}
          {activeTab === 'earnings' && (
            <>
              <div className="vd-stats">
                <div className="vd-stat-card">
                  <div className="vd-stat-value">₹{earnings.totalEarnings.toLocaleString('en-IN')}</div>
                  <div className="vd-stat-label">Total Earnings</div>
                </div>
                <div className="vd-stat-card">
                  <div className="vd-stat-value">{earnings.completedBookings}</div>
                  <div className="vd-stat-label">Completed</div>
                </div>
                <div className="vd-stat-card">
                  <div className="vd-stat-value">₹{earnings.pendingAmount.toLocaleString('en-IN')}</div>
                  <div className="vd-stat-label">Pending</div>
                </div>
                <div className="vd-stat-card">
                  <div className="vd-stat-value">₹{earnings.monthlyEarnings.toLocaleString('en-IN')}</div>
                  <div className="vd-stat-label">This Month</div>
                </div>
              </div>
              {loadingData ? (
                <div className="vd-loading">Loading earnings...</div>
              ) : (
                <div className="vd-card">
                  <div className="vd-empty">Earnings will appear here once you complete bookings.</div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}