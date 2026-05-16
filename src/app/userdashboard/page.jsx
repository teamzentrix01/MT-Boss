'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/login'); return; }
    setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'auth-token=; path=/; max-age=0';
    router.push('/login');
  };

  if (!user) return null;

  const cards = [
    { icon: '🏠', label: 'Saved Properties', value: '0', color: '#eff4ff', tx: '#1e3a8a' },
    { icon: '📋', label: 'My Enquiries',     value: '0', color: '#fff7ed', tx: '#9a3412' },
    { icon: '⭐', label: 'Favourites',        value: '0', color: '#f0fdf4', tx: '#14532d' },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ud-root {
          min-height: 100vh;
          background: #f5f5f7;
          font-family: 'DM Sans', system-ui, sans-serif;
          color: #111113;
        }

        /* Header */
        .ud-header {
          background: #fff;
          border-bottom: 1px solid #e2e2e7;
          padding: 0.875rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ud-logo { font-size: 1.125rem; font-weight: 800; letter-spacing: -0.02em; }
        .ud-logo span { color: #2563eb; }
        .ud-header-right { display: flex; align-items: center; gap: 0.75rem; }
        .ud-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: #2563eb; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8125rem; font-weight: 700;
        }
        .ud-username { font-size: 0.8125rem; font-weight: 600; color: #111113; }
        .ud-logout {
          padding: 0.375rem 0.875rem;
          background: transparent; color: #6b6b76;
          border: 1px solid #e2e2e7; border-radius: 6px;
          font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; transition: all .15s;
        }
        .ud-logout:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }

        /* Main */
        .ud-main { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }

        /* Welcome */
        .ud-welcome {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          border-radius: 12px;
          padding: 1.75rem 2rem;
          color: #fff;
          margin-bottom: 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ud-welcome-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.25rem; }
        .ud-welcome-sub { font-size: 0.8125rem; opacity: 0.75; }
        .ud-welcome-emoji { font-size: 3rem; opacity: 0.6; }

        /* Stat cards */
        .ud-cards {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem; margin-bottom: 1.5rem;
        }
        @media(max-width: 600px){ .ud-cards { grid-template-columns: 1fr; } }
        .ud-card {
          border-radius: 10px; padding: 1.25rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .ud-card-icon { font-size: 1.75rem; }
        .ud-card-label { font-size: 0.75rem; font-weight: 600; opacity: 0.65; margin-bottom: 0.2rem; }
        .ud-card-value { font-size: 1.5rem; font-weight: 700; }

        /* Sections */
        .ud-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media(max-width: 600px){ .ud-grid { grid-template-columns: 1fr; } }

        .ud-panel {
          background: #fff; border: 1px solid #e2e2e7;
          border-radius: 10px; overflow: hidden;
        }
        .ud-panel-head {
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid #e2e2e7;
          font-size: 0.8125rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: .06em;
          color: #6b6b76;
        }
        .ud-panel-body { padding: 1rem 1.25rem; }

        /* Quick links */
        .ud-links { display: flex; flex-direction: column; gap: 0.5rem; }
        .ud-link-btn {
          display: flex; align-items: center; gap: 0.625rem;
          padding: 0.6rem 0.875rem;
          border: 1px solid #e2e2e7; border-radius: 8px;
          background: #f5f5f7;
          font-size: 0.8125rem; font-weight: 600; color: #111113;
          cursor: pointer; transition: all .15s; text-align: left;
        }
        .ud-link-btn:hover { background: #eff4ff; border-color: #bfdbfe; color: #2563eb; }

        /* Activity */
        .ud-empty {
          text-align: center; padding: 1.5rem 0;
          font-size: 0.8125rem; color: #6b6b76;
        }
        .ud-empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }

        /* Account info */
        .ud-info-row {
          display: flex; justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f5;
          font-size: 0.8125rem;
        }
        .ud-info-row:last-child { border-bottom: none; }
        .ud-info-label { color: #6b6b76; }
        .ud-info-value { font-weight: 600; }
      `}</style>

      <div className="ud-root">

        {/* Header */}
        <div className="ud-header">
          <div className="ud-logo">MT<span>BOSS</span></div>
          <div className="ud-header-right">
            <div className="ud-avatar">
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <span className="ud-username">{user.name || user.email}</span>
            <button className="ud-logout" onClick={handleLogout}>⎋ Logout</button>
          </div>
        </div>

        {/* Main */}
        <div className="ud-main">

          {/* Welcome Banner */}
          <div className="ud-welcome">
            <div>
              <div className="ud-welcome-title">
                Welcome back, {user.name ? user.name.split(' ')[0] : 'there'} 👋
              </div>
              <div className="ud-welcome-sub">
                Here's what's happening with your account today.
              </div>
            </div>
            <div className="ud-welcome-emoji">🏡</div>
          </div>

          {/* Stat Cards */}
          <div className="ud-cards">
            {cards.map((c, i) => (
              <div
                key={i}
                className="ud-card"
                style={{ background: c.color, color: c.tx }}
              >
                <span className="ud-card-icon">{c.icon}</span>
                <div>
                  <div className="ud-card-label">{c.label}</div>
                  <div className="ud-card-value">{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Grid */}
          <div className="ud-grid">

            {/* Quick Actions */}
            <div className="ud-panel">
              <div className="ud-panel-head">Quick Actions</div>
              <div className="ud-panel-body">
                <div className="ud-links">
                  {[
                    { icon: '🔍', label: 'Browse Properties' },
                    { icon: '📞', label: 'Contact Support' },
                    { icon: '📝', label: 'Submit Enquiry' },
                    { icon: '⭐', label: 'View Favourites' },
                  ].map((item) => (
                    <button key={item.label} className="ud-link-btn">
                      <span>{item.icon}</span> {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Recent Activity */}
              <div className="ud-panel">
                <div className="ud-panel-head">Recent Activity</div>
                <div className="ud-panel-body">
                  <div className="ud-empty">
                    <div className="ud-empty-icon">📭</div>
                    No recent activity yet.
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="ud-panel">
                <div className="ud-panel-head">Account Info</div>
                <div className="ud-panel-body">
                  {[
                    ['Name',   user.name  || '—'],
                    ['Email',  user.email || '—'],
                    ['Role',   user.role  || 'User'],
                  ].map(([label, value]) => (
                    <div key={label} className="ud-info-row">
                      <span className="ud-info-label">{label}</span>
                      <span className="ud-info-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}