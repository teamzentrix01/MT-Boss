'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
} from '@/app/components/ui/icons';

/**
 * PanelLayout: Reusable dashboard layout copied from the Admin dashboard (/dashboard).
 * Provides:
 * - Collapsible left sidebar with Lucide icons, active-item highlight, badge indicators
 * - Responsive mobile drawer with backdrop overlay
 * - Sidebar footer with user avatar, name, role badge, and logout
 * - Synchronized dark mode support
 * - Top header with title, subtitle, role badge, and actions
 */
export default function PanelLayout({
  title = 'Dashboard',
  subtitle = '',
  user = {},
  roleBadge = '',
  menuItems = [],
  activeTab = '',
  onTabChange = () => {},
  onLogout = () => {},
  actions = null,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Detect dark mode from root element class (matches Admin layout)
  useEffect(() => {
    const html = document.documentElement;
    const updateDarkMode = () => setIsDarkMode(html.classList.contains('dark-mode'));
    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Sync sidebar open state on desktop / mobile
  useEffect(() => {
    const syncSidebar = () => setSidebarOpen(window.innerWidth >= 1024);
    syncSidebar();
    window.addEventListener('resize', syncSidebar);
    return () => window.removeEventListener('resize', syncSidebar);
  }, []);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const bgClass = isDarkMode ? 'bg-black' : 'bg-white';
  const pageBgClass = isDarkMode ? 'bg-[#0f0f11]' : 'bg-[#f5f5f7]';
  const textPrimary = isDarkMode ? 'text-white' : 'text-[#0f172a]';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-zinc-800' : 'border-slate-200';
  const hoverBg = isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100/80';

  const visibleItems = menuItems.filter((item) => !item.hidden);
  const roleDisplay = roleBadge || user?.role || '';

  return (
    <div className={`panel-layout-root admin-dashboard-root flex h-[calc(100dvh-4rem)] overflow-hidden ${pageBgClass} font-sans`}>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          aria-label="Close dashboard menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-x-0 top-16 bottom-0 z-[70] bg-black/50 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0 lg:w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
        } fixed lg:relative top-16 bottom-0 lg:top-auto lg:bottom-auto left-0 z-[80] w-72 h-[calc(100dvh-4rem)] lg:h-full shrink-0 ${bgClass} border-r ${borderColor} transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Sidebar Header: Logo & Collapse Button */}
        <div className={`flex items-center justify-between h-16 px-4 border-b ${borderColor}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className={`font-black text-xl tracking-tight ${textPrimary}`}>MTBOSS</span>
              {/* {roleDisplay && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[rgba(33,150,243,0.12)] text-[#0284c7]">
                  {roleDisplay}
                </span>
              )} */}
            </div>
          ) : (
            <span className={`font-black text-lg ${textPrimary} mx-auto`}>MT</span>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            {sidebarOpen ? (
              <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {visibleItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onTabChange(item.key);
                  closeSidebarOnMobile();
                }}
                title={item.label}
                className={`w-full relative flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-[rgba(33,150,243,0.12)] text-[#0284c7] font-semibold'
                    : isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-white/5 font-medium'
                    : 'text-[#0f172a] hover:text-[#0284c7] hover:bg-slate-100/80 font-medium'
                }`}
              >
                <span
                  className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-md transition-colors ${
                    isActive ? 'bg-[rgba(33,150,243,0.18)] text-[#0284c7]' : 'text-current'
                  }`}
                >
                  {IconComponent ? (
                    <IconComponent size={20} strokeWidth={1.75} color="currentColor" aria-hidden="true" />
                  ) : null}
                </span>

                {sidebarOpen ? (
                  <span className="flex-1 flex items-center justify-between text-sm truncate select-none">
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                      <span
                        className={`ml-auto inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none rounded-full shadow-xs ${
                          item.badgeColor || 'text-white bg-amber-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                ) : (
                  item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
                  )
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: User Profile & Logout */}
        <div className={`border-t ${borderColor} p-3`}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors text-left ${hoverBg}`}
            >
              <div className="w-9 h-9 rounded-lg bg-[#0284c7] flex items-center justify-center font-bold text-white shrink-0">
                {(user?.name || user?.shop_name || 'U').charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="text-left flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${textPrimary}`}>
                    {user?.name || user?.shop_name || 'User'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.city ? `${user.city} · ` : ''}{roleDisplay || user?.email || ''}
                  </p>
                </div>
              )}
            </button>

            {profileOpen && sidebarOpen && (
              <div
                className={`absolute bottom-full left-0 right-0 mb-2 ${bgClass} border ${borderColor} rounded-lg shadow-xl overflow-hidden z-50`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    isDarkMode ? 'text-red-400 hover:bg-red-400/10' : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`h-full flex-1 min-w-0 overflow-y-auto overscroll-contain ${pageBgClass}`}>
        {/* Mobile Top Header */}
        <div
          className={`lg:hidden sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 ${bgClass} ${borderColor}`}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
              isDarkMode ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Menu size={18} strokeWidth={1.75} aria-hidden="true" />
            Menu
          </button>
          <span className={`text-sm font-bold truncate ${textPrimary}`}>{title}</span>
        </div>

        {/* Desktop / Shared Header Bar */}
        <div className={`border-b ${borderColor} ${bgClass} px-4 sm:px-6 lg:px-8 py-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-7xl mx-auto">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className={`text-xl sm:text-2xl font-bold tracking-tight truncate ${textPrimary}`}>
                  {title}
                </h1>
                {roleDisplay && (
                  <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[rgba(33,150,243,0.12)] text-[#0284c7]">
                    {roleDisplay}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5 truncate`}>
                  {subtitle}
                </p>
              )}
            </div>

            {actions && (
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
