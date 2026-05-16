'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, profile
  const [bookings, setBookings] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  // Dark mode detection
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!stored || !token) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(stored);
      setUser(userData);
      setEditData(userData);
      setLoading(false);
    } catch {
      router.push('/login');
    }
  }, [router]);

  // Fetch bookings
  const fetchBookings = async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/user/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'auth-token=; path=/; max-age=0';
    router.push('/login');
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editData)
      });

      const data = await res.json();
      if (res.ok) {
        setUser(editData);
        localStorage.setItem('user', JSON.stringify(editData));
        setEditMode(false);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    }
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

  if (!user) return null;

  return (
    <>
      <style>{`
        .ud-root {
          --bg: ${dark ? '#000000' : '#f5f5f7'};
          --surface: ${dark ? '#111111' : '#ffffff'};
          --border: ${dark ? '#333333' : '#e2e2e7'};
          --text: ${dark ? '#ffffff' : '#111113'};
          --muted: ${dark ? '#9ca3af' : '#6b6b76'};
          --accent: #2563eb;
          --accent-hover: #1d4ed8;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .ud-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background-color 0.5s, color 0.5s;
        }

        /* Header/Navbar */
        .ud-header {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .ud-navbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .ud-logo {
          font-size: 1.125rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .ud-logo span {
          color: var(--accent);
        }

        .ud-navbar-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .ud-user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ud-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 700;
        }

        .ud-user-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .ud-user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
        }

        .ud-user-email {
          font-size: 0.75rem;
          color: var(--muted);
        }

        .ud-logout {
          padding: 0.5rem 1rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ud-logout:hover {
          background: var(--accent-hover);
          opacity: 0.9;
        }

        /* Main */
        .ud-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .ud-header-section {
          margin-bottom: 2rem;
        }

        .ud-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .ud-subtitle {
          color: var(--muted);
          font-size: 0.95rem;
        }

        /* Tabs */
        .ud-tabs {
          display: flex;
          gap: 0;
          border-bottom: 2px solid var(--border);
          margin-bottom: 2rem;
        }

        .ud-tab {
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

        .ud-tab:hover {
          color: var(--text);
        }

        .ud-tab.active {
          color: var(--accent);
        }

        .ud-tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent);
        }

        /* Profile Tab */
        .ud-profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .ud-profile-grid {
            grid-template-columns: 1fr;
          }
        }

        .ud-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.5rem;
        }

        .ud-card-title {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ud-card-title button {
          font-size: 0.75rem;
          padding: 0.4rem 0.8rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .ud-card-title button:hover {
          background: var(--accent-hover);
        }

        .ud-field {
          margin-bottom: 1rem;
        }

        .ud-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ud-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: ${dark ? '#1a1a1a' : '#f9f9f9'};
          color: var(--text);
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }

        .ud-input:focus {
          border-color: var(--accent);
          background: var(--surface);
        }

        .ud-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ud-value {
          padding: 0.75rem;
          background: ${dark ? '#1a1a1a' : '#f9f9f9'};
          border-radius: 6px;
          font-size: 0.875rem;
          color: var(--text);
        }

        .ud-buttons {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .ud-buttons button {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: var(--text);
        }

        .ud-buttons button.save {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }

        .ud-buttons button.save:hover {
          background: var(--accent-hover);
        }

        .ud-buttons button.cancel:hover {
          background: var(--border);
        }

        /* Bookings */
        .ud-bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ud-booking-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.5rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .ud-booking-card {
            grid-template-columns: 1fr;
          }
        }

        .ud-booking-info h4 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: var(--text);
        }

        .ud-booking-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .ud-booking-detail {
          font-size: 0.85rem;
          color: var(--muted);
        }

        .ud-booking-detail strong {
          color: var(--text);
          font-weight: 600;
        }

        .ud-booking-status {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ud-booking-status.pending {
          background: ${dark ? '#7c2d12' : '#fed7aa'};
          color: ${dark ? '#fed7aa' : '#92400e'};
        }

        .ud-booking-status.accepted {
          background: ${dark ? '#064e3b' : '#d1fae5'};
          color: ${dark ? '#86efac' : '#065f46'};
        }

        .ud-booking-status.completed {
          background: ${dark ? '#064e3b' : '#d1fae5'};
          color: ${dark ? '#86efac' : '#065f46'};
        }

        .ud-booking-status.cancelled {
          background: ${dark ? '#7f1d1d' : '#fee2e2'};
          color: ${dark ? '#fca5a5' : '#991b1b'};
        }

        .ud-empty {
          padding: 3rem 2rem;
          text-align: center;
          color: var(--muted);
        }

        .ud-empty-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .ud-loading {
          padding: 2rem;
          text-align: center;
          color: var(--muted);
        }

        @media (max-width: 600px) {
          .ud-container {
            padding: 1rem;
          }
          .ud-title {
            font-size: 1.5rem;
          }
          .ud-navbar-right {
            gap: 0.5rem;
          }
          .ud-user-details {
            display: none;
          }
        }
      `}</style>

      <div className="ud-root">
        {/* Header */}
        <div className="ud-header">
          <div className="ud-navbar-left">
            <div className="ud-logo">MT<span>BOSS</span></div>
          </div>
          <div className="ud-navbar-right">
            <div className="ud-user-info">
              <div className="ud-avatar">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div className="ud-user-details">
                <div className="ud-user-name">{user.name || user.email}</div>
                <div className="ud-user-email">User</div>
              </div>
            </div>
            <button className="ud-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Main */}
        <div className="ud-container">
          <div className="ud-header-section">
            <div className="ud-title">
              Welcome back, {user.name ? user.name.split(' ')[0] : 'there'} 👋
            </div>
            <div className="ud-subtitle">
              Manage your bookings and profile
            </div>
          </div>

          {/* Tabs */}
          <div className="ud-tabs">
            <button
              className={`ud-tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('bookings');
                fetchBookings();
              }}
            >
              📅 My Bookings
            </button>
            <button
              className={`ud-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
          </div>

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <>
              {loadingData ? (
                <div className="ud-loading">Loading bookings...</div>
              ) : bookings.length > 0 ? (
                <div className="ud-bookings-list">
                  {bookings.map(booking => (
                    <div key={booking.id} className="ud-booking-card">
                      <div className="ud-booking-info">
                        <h4>Booking #{booking.booking_reference}</h4>
                        <div className="ud-booking-details">
                          <div className="ud-booking-detail">
                            <strong>Service:</strong> {booking.service_label}
                          </div>
                          <div className="ud-booking-detail">
                            <strong>Vendor:</strong> {booking.vendor_shop_name || 'Pending Assignment'}
                          </div>
                          <div className="ud-booking-detail">
                            <strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}
                          </div>
                          <div className="ud-booking-detail">
                            <strong>Time:</strong> {booking.booking_time}
                          </div>
                          <div className="ud-booking-detail">
                            <strong>Amount:</strong> ₹{booking.final_amount}
                          </div>
                          <div className="ud-booking-detail">
                            <strong>Address:</strong> {booking.service_address}, {booking.service_city}
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`ud-booking-status ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ud-empty">
                  <div className="ud-empty-icon">📭</div>
                  <p>No bookings yet. <Link href="/quick" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '600' }}>Book a service</Link></p>
                </div>
              )}
            </>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="ud-profile-grid">
              {/* Personal Info */}
              <div className="ud-card">
                <div className="ud-card-title">
                  Personal Information
                  {!editMode && (
                    <button onClick={() => setEditMode(true)}>Edit</button>
                  )}
                </div>
                {editMode ? (
                  <>
                    <div className="ud-field">
                      <label className="ud-label">Full Name</label>
                      <input
                        className="ud-input"
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => handleEditChange('name', e.target.value)}
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="ud-field">
                      <label className="ud-label">Email</label>
                      <input
                        className="ud-input"
                        type="email"
                        value={editData.email || ''}
                        disabled
                        placeholder="Email"
                      />
                    </div>
                    <div className="ud-field">
                      <label className="ud-label">Phone</label>
                      <input
                        className="ud-input"
                        type="tel"
                        value={editData.phone || ''}
                        onChange={(e) => handleEditChange('phone', e.target.value)}
                        placeholder="Phone Number"
                      />
                    </div>
                    <div className="ud-buttons">
                      <button className="save" onClick={handleSaveProfile}>Save</button>
                      <button className="cancel" onClick={() => {
                        setEditMode(false);
                        setEditData(user);
                      }}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ud-field">
                      <label className="ud-label">Full Name</label>
                      <div className="ud-value">{user.name || '—'}</div>
                    </div>
                    <div className="ud-field">
                      <label className="ud-label">Email</label>
                      <div className="ud-value">{user.email || '—'}</div>
                    </div>
                    <div className="ud-field">
                      <label className="ud-label">Phone</label>
                      <div className="ud-value">{user.phone || '—'}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Account Info */}
              <div className="ud-card">
                <div className="ud-card-title">Account Information</div>
                <div className="ud-field">
                  <label className="ud-label">Account Type</label>
                  <div className="ud-value">User</div>
                </div>
                <div className="ud-field">
                  <label className="ud-label">Status</label>
                  <div className="ud-value">Active</div>
                </div>
                <div className="ud-field">
                  <label className="ud-label">Member Since</label>
                  <div className="ud-value">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}