'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState({});
  const router = useRouter();

  // Detect dark mode from navbar
  useEffect(() => {
    const html = document.documentElement;
    const updateDarkMode = () => setIsDarkMode(html.classList.contains('dark-mode'));
    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'));
    } catch {
      setUser({});
    }
  }, []);

  const menuItems = [
    { label: 'Overview',                  icon: '📊', tab: '' },
    { label: 'Agents',                    icon: '👤', tab: 'agents' },
    { label: 'Calculator',               icon: '🧮', tab: 'calculator' },
    { label: 'Career Enquiry',           icon: '✉️', tab: 'career-enquiries' },
    { label: 'New Jobs',                 icon: '💼', tab: 'jobs' },
    { label: 'Contact Forms',            icon: '✉️', tab: 'submissions' },
    { label: 'Franchises',               icon: '🏢', tab: 'franchises' },
    { label: 'Free Time Slots',          icon: '📅', tab: 'free-slots' },
    { label: 'Hero Banners',             icon: '🖼️', tab: 'hero-banners' },
    { label: 'Primary Services',         icon: '⊞',  tab: 'primary-services' },
    { label: 'Primary Services Enquiry', icon: '✉️', tab: 'primary-service-enquiries' },
    { label: 'Professional Enquiries',   icon: '💬', tab: 'professional-enquiries' },
    { label: 'Professional Services',    icon: '👔', tab: 'professionals' },
    { label: 'Projects',                 icon: '🏗️', tab: 'projects' },
    { label: 'Properties',               icon: '🏠', tab: 'properties' },
    { label: 'Quick Services',           icon: '⚡', tab: 'quick-services' },
    { label: 'Revenue & Earnings',       icon: '💸', tab: 'revenue' },
    { label: 'Service Bookings',         icon: '📝', tab: 'bookings' },
    { label: 'Service Pricing',          icon: '💰', tab: 'quick-services-pricing' },
    { label: 'Shop Categories',          icon: '🛒', tab: 'shop-categories' },
    { label: 'Suppliers',                icon: '📦', tab: 'suppliers' },
    { label: 'Vendors',                  icon: '🏪', tab: 'vendors' },
  ];

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const bgClass = isDarkMode ? 'bg-black' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-black';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-[var(--brand-blue-light)]' : 'border-[var(--brand-blue)]';
  const hoverBg = isDarkMode ? 'hover:bg-[var(--brand-blue-dark)]/10' : 'hover:bg-sky-50';

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} ${bgClass} border-r-2 ${borderColor} transition-all duration-300 flex flex-col shadow-lg`}>
        {/* Logo */}
        <div className={`flex items-center justify-between h-16 px-4 border-b-2 ${borderColor}`}>
          {sidebarOpen && <span className={`font-black text-xl ${textPrimary}`}>MT-BOSS</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-[var(--brand-blue-dark)]/10' : 'hover:bg-sky-50'}`}
          >
            {sidebarOpen ? '◀️' : '▶️'}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.tab ? `/dashboard?tab=${item.tab}` : '/dashboard'}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:text-[var(--brand-blue-light)] hover:bg-[var(--brand-blue-dark)]/10' : 'text-gray-700 hover:text-[var(--brand-blue-deep)] hover:bg-sky-50'}`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className={`border-t-2 ${borderColor} p-4`}>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${hoverBg}`}
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--brand-blue)] flex items-center justify-center font-bold text-black">
                {user.name?.charAt(0) || 'A'}
              </div>
              {sidebarOpen && (
                <div className="text-left flex-1">
                  <p className={`text-sm font-medium ${textPrimary}`}>{user.name || 'Admin'}</p>
                  <p className={`text-xs ${textSecondary}`}>{user.email || 'admin@example.com'}</p>
                </div>
              )}
            </button>

            {profileOpen && sidebarOpen && (
              <div className={`absolute bottom-full left-0 right-0 mb-2 ${bgClass} border-2 ${borderColor} rounded-lg shadow-lg`}>
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-400/10' : 'text-red-600 hover:bg-red-50'}`}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
