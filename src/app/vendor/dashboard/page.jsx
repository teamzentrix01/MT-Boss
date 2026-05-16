'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VendorDashboard() {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check dark mode
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Load vendor from localStorage
    const vendorData = localStorage.getItem('vendor');
    const token = localStorage.getItem('vendor-token');

    if (!token || !vendorData) {
      router.push('/vendor/login');
      return;
    }

    try {
      setVendor(JSON.parse(vendorData));
      setLoading(false);
    } catch {
      router.push('/vendor/login');
    }
  }, [router]);

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
        color: dark ? '#fff' : '#111'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .vd-root {
          --vd-bg: ${dark ? '#000000' : '#f5f5f7'};
          --vd-surface: ${dark ? '#1a1a1a' : '#ffffff'};
          --vd-border: ${dark ? '#333333' : '#e2e2e7'};
          --vd-text: ${dark ? '#ffffff' : '#111113'};
          --vd-muted: ${dark ? '#9ca3af' : '#6b6b76'};
          --vd-accent: #10b981;
          --vd-accent-light: ${dark ? '#064e3b' : '#ecfdf5'};
        }

        .vd-root {
          min-height: 100vh;
          background: var(--vd-bg);
          color: var(--vd-text);
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: background-color 0.5s, color 0.5s;
        }

        .vd-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: var(--vd-surface);
          border-bottom: 1px solid var(--vd-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .vd-logo {
          font-size: 1rem;
          font-weight: 800;
          color: var(--vd-text);
        }
        .vd-logo span { color: var(--vd-accent); }

        .vd-nav-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .vd-user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 0.875rem;
        }
        .vd-user-name {
          font-weight: 600;
          color: var(--vd-text);
        }
        .vd-user-role {
          color: var(--vd-muted);
          font-size: 0.75rem;
        }

        .vd-logout-btn {
          padding: 0.5rem 1rem;
          background: var(--vd-accent);
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          transition: opacity 0.2s;
        }
        .vd-logout-btn:hover { opacity: 0.85; }

        .vd-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 2rem;
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
          color: var(--vd-muted);
          font-size: 0.95rem;
        }

        .vd-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .vd-card {
          background: var(--vd-surface);
          border: 1px solid var(--vd-border);
          border-radius: 10px;
          padding: 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .vd-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .vd-card-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .vd-card-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--vd-text);
        }

        .vd-card-desc {
          color: var(--vd-muted);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .vd-card-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--vd-accent);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          transition: gap 0.2s;
        }
        .vd-card-link:hover { gap: 0.75rem; }

        .vd-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .vd-stat-box {
          background: var(--vd-surface);
          border: 1px solid var(--vd-border);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .vd-stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--vd-accent);
          margin-bottom: 0.25rem;
        }

        .vd-stat-label {
          color: var(--vd-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .vd-navbar { padding: 1rem; }
          .vd-container { padding: 1rem; }
          .vd-title { font-size: 1.5rem; }
          .vd-grid { grid-template-columns: 1fr; }
          .vd-user-info { display: none; }
        }
      `}</style>

      <div className="vd-root">
        {/* Navbar */}
        <div className="vd-navbar">
          <div className="vd-logo">VENDOR<span>HUB</span></div>
          <div className="vd-nav-right">
            <div className="vd-user-info">
              <div className="vd-user-name">{vendor?.shop_name || 'Vendor'}</div>
              <div className="vd-user-role">Vendor Account</div>
            </div>
            <button className="vd-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="vd-container">
          <div className="vd-header">
            <div className="vd-title">Welcome, {vendor?.shop_name}!</div>
            <div className="vd-subtitle">Manage your store and track your business performance</div>
          </div>

          {/* Stats */}
          <div className="vd-stats">
            <div className="vd-stat-box">
              <div className="vd-stat-value">0</div>
              <div className="vd-stat-label">Total Products</div>
            </div>
            <div className="vd-stat-box">
              <div className="vd-stat-value">0</div>
              <div className="vd-stat-label">Total Orders</div>
            </div>
            <div className="vd-stat-box">
              <div className="vd-stat-value">₹0</div>
              <div className="vd-stat-label">Total Revenue</div>
            </div>
            <div className="vd-stat-box">
              <div className="vd-stat-value">0</div>
              <div className="vd-stat-label">Active Sales</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="vd-grid">
            <div className="vd-card">
              <div className="vd-card-icon">📦</div>
              <div className="vd-card-title">Manage Products</div>
              <div className="vd-card-desc">Add, edit, and manage your product listings</div>
              <Link href="/vendor/products" className="vd-card-link">
                Go to Products →
              </Link>
            </div>

            <div className="vd-card">
              <div className="vd-card-icon">📋</div>
              <div className="vd-card-title">View Orders</div>
              <div className="vd-card-desc">Track and manage customer orders</div>
              <Link href="/vendor/orders" className="vd-card-link">
                View Orders →
              </Link>
            </div>

            <div className="vd-card">
              <div className="vd-card-icon">💰</div>
              <div className="vd-card-title">Revenue & Payouts</div>
              <div className="vd-card-desc">Track earnings and manage payouts</div>
              <Link href="/vendor/payouts" className="vd-card-link">
                View Payouts →
              </Link>
            </div>

            <div className="vd-card">
              <div className="vd-card-icon">📊</div>
              <div className="vd-card-title">Analytics</div>
              <div className="vd-card-desc">Detailed insights about your business</div>
              <Link href="/vendor/analytics" className="vd-card-link">
                View Analytics →
              </Link>
            </div>

            <div className="vd-card">
              <div className="vd-card-icon">⚙️</div>
              <div className="vd-card-title">Store Settings</div>
              <div className="vd-card-desc">Configure your store information</div>
              <Link href="/vendor/settings" className="vd-card-link">
                Open Settings →
              </Link>
            </div>

            <div className="vd-card">
              <div className="vd-card-icon">💬</div>
              <div className="vd-card-title">Support</div>
              <div className="vd-card-desc">Get help from our support team</div>
              <Link href="/vendor/support" className="vd-card-link">
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}