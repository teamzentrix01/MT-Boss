'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // profile, bookings, earnings
  const [bookings, setBookings] = useState([]);
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    completedBookings: 0,
    pendingAmount: 0,
    monthlyEarnings: 0,
  });
  const [loadingData, setLoadingData] = useState(false);

  // Dark mode detection
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Load vendor from localStorage
  useEffect(() => {
    const vendorData = localStorage.getItem('vendor');
    const token = localStorage.getItem('vendor-token');

    if (!token || !vendorData) {
      router.push('/vendor/login');
      return;
    }

    try {
      const parsed = JSON.parse(vendorData);
      setVendor(parsed);
      setLoading(false);
    } catch {
      router.push('/vendor/login');
    }
  }, [router]);

  // Fetch bookings
  const fetchBookings = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/vendor/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vendor-token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch earnings
  const fetchEarnings = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/vendor/earnings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vendor-token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setEarnings(data.data || earnings);
      }
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: dark ? '#000' : '#f5f5f7',
        color: dark ? '#fff' : '#111',
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .vd-root {
          --bg: ${dark ? '#000000' : '#f5f5f7'};
          --surface: ${dark ? '#111111' : '#ffffff'};
          --border: ${dark ? '#333333' : '#e2e2e7'};
          --text: ${dark ? '#ffffff' : '#111113'};
          --muted: ${dark ? '#9ca3af' : '#6b6b76'};
          --accent: #10b981;
          --accent-light: ${dark ? '#064e3b' : '#d1fae5'};
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .vd-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background-color 0.5s, color 0.5s;
        }

        /* Navbar */
        .vd-navbar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .vd-navbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .vd-logo {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .vd-logo span {
          color: var(--accent);
        }

        .vd-vendor-name {
          font-size: 0.875rem;
          color: var(--muted);
        }

        .vd-navbar-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .vd-logout-btn {
          padding: 0.6rem 1.2rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 7px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          transition: opacity 0.2s;
        }

        .vd-logout-btn:hover {
          opacity: 0.9;
        }

        /* Container */
        .vd-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .vd-header {
          margin-bottom: 2rem;
        }

        .vd-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .vd-subtitle {
          color: var(--muted);
          font-size: 0.95rem;
        }

        /* Tab Navigation */
        .vd-tabs {
          display: flex;
          gap: 0;
          border-bottom: 2px solid var(--border);
          margin-bottom: 2rem;
        }

        .vd-tab {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s;
          position: relative;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.8rem;
        }

        .vd-tab:hover {
          color: var(--text);
        }

        .vd-tab.active {
          color: var(--accent);
        }

        .vd-tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent);
        }

        /* Profile Tab */
        .vd-profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .vd-profile-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .vd-profile-card h3 {
          font-size: 0.85rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .vd-profile-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .vd-profile-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border);
        }

        .vd-profile-row:last-child {
          border-bottom: none;
        }

        .vd-profile-label {
          color: var(--muted);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .vd-profile-value {
          color: var(--text);
          font-weight: 600;
        }

        /* Bookings Tab */
        .vd-bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .vd-booking-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.5rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1.5rem;
          align-items: start;
        }

        .vd-booking-info h4 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: var(--text);
        }

        .vd-booking-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .vd-booking-detail {
          font-size: 0.85rem;
          color: var(--muted);
        }

        .vd-booking-status {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .vd-booking-status.pending {
          background: ${dark ? '#7c2d12' : '#fed7aa'};
          color: ${dark ? '#fed7aa' : '#92400e'};
        }

        .vd-booking-status.accepted {
          background: var(--accent-light);
          color: ${dark ? '#86efac' : '#065f46'};
        }

        .vd-booking-status.completed {
          background: var(--accent-light);
          color: ${dark ? '#86efac' : '#065f46'};
        }

        .vd-booking-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .vd-booking-btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg);
          color: var(--text);
          cursor: pointer;
          font-weight: 600;
          font-size: 0.8rem;
          transition: all 0.2s;
        }

        .vd-booking-btn:hover {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }

        /* Earnings Tab */
        .vd-earnings-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .vd-stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 2rem;
          text-align: center;
        }

        .vd-stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .vd-stat-label {
          color: var(--muted);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .vd-earnings-table {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
        }

        .vd-table-header {
          background: ${dark ? '#1a1a1a' : '#f9f9f9'};
          border-bottom: 1px solid var(--border);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem 1.5rem;
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
        }

        .vd-table-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          align-items: center;
        }

        .vd-table-row:last-child {
          border-bottom: none;
        }

        .vd-empty {
          padding: 3rem 2rem;
          text-align: center;
          color: var(--muted);
        }

        .vd-loading {
          padding: 2rem;
          text-align: center;
          color: var(--muted);
        }

        @media (max-width: 768px) {
          .vd-navbar {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .vd-container {
            padding: 1rem;
          }

          .vd-title {
            font-size: 1.5rem;
          }

          .vd-tabs {
            margin-bottom: 1rem;
          }

          .vd-tab {
            padding: 0.75rem 1rem;
            font-size: 0.7rem;
          }

          .vd-booking-card {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .vd-table-header,
          .vd-table-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div className="vd-root">
        {/* Navbar */}
        <div className="vd-navbar">
          <div className="vd-navbar-left">
            <div className="vd-logo">VENDOR<span>HUB</span></div>
            <div className="vd-vendor-name">{vendor?.shop_name}</div>
          </div>
          <div className="vd-navbar-right">
            <button className="vd-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="vd-container">
          <div className="vd-header">
            <div className="vd-title">Welcome, {vendor?.business_name}!</div>
            <div className="vd-subtitle">Manage your profile, bookings, and earnings</div>
          </div>

          {/* Tabs */}
          <div className="vd-tabs">
            <button
              className={`vd-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Your Profile
            </button>
            <button
              className={`vd-tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('bookings');
                fetchBookings();
              }}
            >
              📅 Bookings
            </button>
            <button
              className={`vd-tab ${activeTab === 'earnings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('earnings');
                fetchEarnings();
              }}
            >
              💰 Earnings
            </button>
          </div>

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="vd-profile-grid">
              {/* Basic Info */}
              <div className="vd-profile-card">
                <h3>Basic Information</h3>
                <div className="vd-profile-content">
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Shop Name</span>
                    <span className="vd-profile-value">{vendor?.shop_name}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Business Name</span>
                    <span className="vd-profile-value">{vendor?.business_name}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Email</span>
                    <span className="vd-profile-value">{vendor?.email}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Phone</span>
                    <span className="vd-profile-value">{vendor?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="vd-profile-card">
                <h3>Address</h3>
                <div className="vd-profile-content">
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">City</span>
                    <span className="vd-profile-value">{vendor?.city || 'N/A'}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">State</span>
                    <span className="vd-profile-value">{vendor?.state || 'N/A'}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Country</span>
                    <span className="vd-profile-value">{vendor?.country || 'N/A'}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Postal Code</span>
                    <span className="vd-profile-value">{vendor?.postal_code || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="vd-profile-card">
                <h3>Business Details</h3>
                <div className="vd-profile-content">
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Business Type</span>
                    <span className="vd-profile-value">{vendor?.business_type || 'N/A'}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Status</span>
                    <span className="vd-profile-value" style={{ textTransform: 'capitalize' }}>
                      {vendor?.status || 'Active'}
                    </span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Verification</span>
                    <span className="vd-profile-value" style={{ textTransform: 'capitalize' }}>
                      {vendor?.verification_status || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="vd-profile-card">
                <h3>Bank Details</h3>
                <div className="vd-profile-content">
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Account Holder</span>
                    <span className="vd-profile-value">{vendor?.bank_account_holder || 'N/A'}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Bank Name</span>
                    <span className="vd-profile-value">{vendor?.bank_name || 'N/A'}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">IFSC Code</span>
                    <span className="vd-profile-value">{vendor?.bank_ifsc_code || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="vd-profile-card">
                <h3>Documents</h3>
                <div className="vd-profile-content">
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">GST Number</span>
                    <span className="vd-profile-value">{vendor?.gst_number || 'N/A'}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">PAN Number</span>
                    <span className="vd-profile-value">{vendor?.pan_number || 'N/A'}</span>
                  </div>
                  <div className="vd-profile-row">
                    <span className="vd-profile-label">Business Reg.</span>
                    <span className="vd-profile-value">{vendor?.business_registration_number || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="vd-profile-card">
                <h3>About Your Business</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--muted)' }}>
                  {vendor?.description || 'No description provided'}
                </p>
              </div>
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <>
              {loadingData ? (
                <div className="vd-loading">Loading bookings...</div>
              ) : bookings.length > 0 ? (
                <div className="vd-bookings-list">
                  {bookings.map(booking => (
                    <div key={booking.id} className="vd-booking-card">
                      <div className="vd-booking-info">
                        <h4>Booking #{booking.booking_reference}</h4>
                        <div className="vd-booking-details">
                          <div className="vd-booking-detail">
                            <strong>Service:</strong> {booking.service_label}
                          </div>
                          <div className="vd-booking-detail">
                            <strong>Customer:</strong> {booking.user_name}
                          </div>
                          <div className="vd-booking-detail">
                            <strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}
                          </div>
                          <div className="vd-booking-detail">
                            <strong>Amount:</strong> ₹{booking.final_amount}
                          </div>
                        </div>
                      </div>
                      <div className="vd-booking-actions">
                        <span className={`vd-booking-status ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="vd-empty">No bookings yet. Start accepting service requests!</div>
              )}
            </>
          )}

          {/* EARNINGS TAB */}
          {activeTab === 'earnings' && (
            <>
              <div className="vd-earnings-stats">
                <div className="vd-stat-card">
                  <div className="vd-stat-value">₹{earnings.totalEarnings.toLocaleString()}</div>
                  <div className="vd-stat-label">Total Earnings</div>
                </div>
                <div className="vd-stat-card">
                  <div className="vd-stat-value">{earnings.completedBookings}</div>
                  <div className="vd-stat-label">Completed Bookings</div>
                </div>
                <div className="vd-stat-card">
                  <div className="vd-stat-value">₹{earnings.pendingAmount.toLocaleString()}</div>
                  <div className="vd-stat-label">Pending Amount</div>
                </div>
                <div className="vd-stat-card">
                  <div className="vd-stat-value">₹{earnings.monthlyEarnings.toLocaleString()}</div>
                  <div className="vd-stat-label">This Month</div>
                </div>
              </div>

              {loadingData ? (
                <div className="vd-loading">Loading earnings...</div>
              ) : (
                <div className="vd-earnings-table">
                  <div className="vd-table-header">
                    <div>Booking ID</div>
                    <div>Date</div>
                    <div>Amount</div>
                  </div>
                  {/* Sample data - replace with actual data from API */}
                  <div className="vd-empty">
                    Earnings data will appear here when you complete bookings
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}