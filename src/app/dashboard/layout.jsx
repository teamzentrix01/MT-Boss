'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    const frame = requestAnimationFrame(() => {
      try {
        let u = JSON.parse(localStorage.getItem('user'));
        if (!u) {
          const agentStr = localStorage.getItem('agent');
          if (agentStr) {
            u = JSON.parse(agentStr);
            u.role = 'agent';
          }
        }
        setUser(u || {});
      } catch {
        setUser({});
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const syncSidebar = () => setSidebarOpen(window.innerWidth >= 1024);
    syncSidebar();
    window.addEventListener('resize', syncSidebar);
    return () => window.removeEventListener('resize', syncSidebar);
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const res = await originalFetch(...args);
      if (res.status === 403 && typeof args[0] === 'string' && args[0].includes('/api/admin/project-management')) {
        let u = null;
        try { u = JSON.parse(localStorage.getItem('agent')); } catch {}
        if (u) {
          alert('Your access to Project Management has been revoked. Contact admin.');
          window.location.href = '/agent/dashboard';
        }
      }
      return res;
    };
    return () => { window.fetch = originalFetch; };
  }, []);

  const menuItems = [
    { label: 'Overview',                  icon: '📊', tab: '' },
    { label: 'Agents',                    icon: '👤', tab: 'agents' },
    { label: 'Users',                     icon: '👥', tab: 'users' },
    { label: 'Calculator',               icon: '🧮', tab: 'calculator' },
    { label: 'Calculator Quotes',        icon: '✉️', tab: 'calculator-quotes' },
    { label: 'Career Enquiry',           icon: '✉️', tab: 'career-enquiries' },
    { label: 'New Jobs',                 icon: '💼', tab: 'jobs' },
    { label: 'Lead Management',          icon: '📋', tab: 'lead-management' },
    { label: 'Office Locations',         icon: '📍', tab: 'office-locations' },
    { label: 'Cities',                    icon: '🏙️', tab: 'cities' },
    { label: 'Contact Forms',            icon: '✉️', tab: 'submissions' },
    { label: 'Franchises',               icon: '🏢', tab: 'franchises' },
    { label: 'Free Time Slots',          icon: '📅', tab: 'free-slots' },
    { label: 'FAQs Management',          icon: '❓', tab: 'faqs' },
    { label: 'Customer Reviews',         icon: '⭐', tab: 'reviews' },
    { label: 'Hero Banners',             icon: '🖼️', tab: 'hero-banners' },
    { label: 'SEO Blogs & Guides',       icon: '📰', tab: 'blogs' },

    { label: 'Construction Services',    icon: '⊞',  tab: 'primary-services' },
    { label: 'Construction Enquiry',     icon: '✉️', tab: 'primary-service-enquiries' },
    { label: 'Professional Enquiries',   icon: '💬', tab: 'professional-enquiries' },
    { label: 'Professional Services',    icon: '👔', tab: 'professionals' },
    { label: 'Project Management',       icon: '📋', tab: 'project-management' },
    { label: 'Project Management · Parties', icon: '🏗️', tab: 'party-project-management' },
    { label: 'PM Dashboard',              icon: '📈', tab: 'pm-dashboard' },
    { label: 'PM Reports',                icon: '📑', tab: 'pm-reports' },
    { label: 'PM Activity Log',           icon: '📂', tab: 'pm-audit' },
    { label: 'PM Benchmarks · Rates',     icon: '📊', tab: 'pm-benchmarks' },
    { label: 'Portfolio Projects',       icon: '🏗️', tab: 'projects' },
    { label: 'Properties',               icon: '🏠', tab: 'properties' },
    { label: 'Property Enquiries',       icon: '📨', tab: 'property-enquiries' },
    { label: 'Quick Enquiry',            icon: '⚡', tab: 'quick-enquiries' },
    { label: 'Quick Services',           icon: '⚡', tab: 'quick-services' },
    { label: 'Revenue & Earnings',       icon: '💸', tab: 'revenue' },
    { label: 'Service Bookings',         icon: '📝', tab: 'bookings' },
    { label: 'Service Pricing',          icon: '💰', tab: 'quick-services-pricing' },
    { label: 'Shop Now Manager',         icon: '🛒', tab: 'shop-categories' },
    { label: '+ Add Shop Product',       icon: '➕', tab: 'shop-products' },
    { label: 'Suppliers',                icon: '📦', tab: 'suppliers' },
    { label: 'Vendors',                  icon: '🏪', tab: 'vendors' },
    { label: 'Package Approvals',        icon: '📦', tab: 'packages' },
  ];

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const bgClass = isDarkMode ? 'bg-black' : 'bg-white';
  const pageBgClass = isDarkMode ? 'bg-[#0f0f11]' : 'bg-[#f5f5f7]';
  const textPrimary = isDarkMode ? 'text-white' : 'text-black';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-[var(--brand-blue-light)]' : 'border-[var(--brand-blue)]';
  const hoverBg = isDarkMode ? 'hover:bg-[var(--brand-blue-dark)]/10' : 'hover:bg-sky-50';

  return (
    <div className={`flex h-[calc(100dvh-4rem)] overflow-hidden ${pageBgClass}`}>
      {sidebarOpen && (
        <div
          aria-label="Close dashboard menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-x-0 top-16 bottom-0 z-[70] bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0 lg:w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'} fixed lg:relative top-16 bottom-0 lg:top-auto lg:bottom-auto left-0 z-[80] w-72 h-[calc(100dvh-4rem)] lg:h-full shrink-0 ${bgClass} border-r-2 ${borderColor} transition-all duration-300 flex flex-col shadow-lg`}>
        {/* Logo */}
        <div className={`flex items-center justify-between h-16 px-4 border-b-2 ${borderColor}`}>
          {sidebarOpen && <span className={`font-black text-xl ${textPrimary}`}>MTBoss</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-[var(--brand-blue-dark)]/10' : 'hover:bg-sky-50'}`}
          >
            {sidebarOpen ? '◀️' : '▶️'}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {menuItems.filter(item => {
            if (user?.role === 'agent') {
              // Agents only see PM if they have access, and maybe Lead Management if they are allowed there.
              // For PM items:
              if (item.tab.includes('project-management') || item.tab.startsWith('pm-') || item.tab === 'projects') {
                return !!user.has_project_management_access;
              }
              // Allow lead management if they use it from admin UI (though usually agents use agent UI)
              if (item.tab === 'lead-management') return true;
              return false;
            }
            return true;
          }).map((item) => (
            <Link
              key={item.label}
              href={item.tab ? `/dashboard?tab=${item.tab}` : '/dashboard'}
              onClick={closeSidebarOnMobile}
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
                  <p className="text-sm font-medium text-black">{user.name || 'Admin'}</p>
                  <p className="text-xs text-black">{user.email || 'admin@example.com'}</p>
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
      <main className={`h-full flex-1 min-w-0 overflow-y-auto overscroll-contain ${pageBgClass}`}>
        <div className={`lg:hidden sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 ${bgClass} ${borderColor}`}>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className={`px-3 py-2 rounded-lg text-sm font-black ${isDarkMode ? 'text-white' : 'text-black'}`}
          >
            Menu
          </button>
          <span className={`text-sm font-black ${textPrimary}`}>Dashboard</span>
        </div>
        {children}
      </main>
    </div>
  );
}
