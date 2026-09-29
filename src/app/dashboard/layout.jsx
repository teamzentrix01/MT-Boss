'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  UserCog,
  Calculator,
  FileText,
  Briefcase,
  BriefcaseBusiness,
  ClipboardList,
  MapPin,
  Building,
  Mail,
  Store,
  CalendarClock,
  HelpCircle,
  Star,
  ImageIcon,
  Newspaper,
  Layers,
  MessageSquare,
  Users,
  Building2,
  FolderKanban,
  House,
  MessageSquareText,
  Zap,
  Wrench,
  CircleDollarSign,
  CalendarDays,
  Tags,
  ShoppingCart,
  PlusCircle,
  Truck,
  HardHat,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
} from '@/app/components/ui/icons';

const menuItems = [
  { label: 'Overview',                  icon: LayoutDashboard,      tab: '' },
  { label: 'Agents',                    icon: UserCog,              tab: 'agents' },
  { label: 'Calculator',               icon: Calculator,           tab: 'calculator' },
  { label: 'Calculator Quotes',        icon: FileText,             tab: 'calculator-quotes' },
  { label: 'Career Enquiry',           icon: Briefcase,            tab: 'career-enquiries' },
  { label: 'New Jobs',                 icon: BriefcaseBusiness,    tab: 'jobs' },
  { label: 'Lead Management',          icon: ClipboardList,        tab: 'lead-management' },
  { label: 'Office Locations',         icon: MapPin,               tab: 'office-locations' },
  { label: 'Cities',                    icon: Building,             tab: 'cities' },
  { label: 'Contact Forms',            icon: Mail,                 tab: 'submissions' },
  { label: 'Franchises',               icon: Store,                tab: 'franchises' },
  { label: 'Free Time Slots',          icon: CalendarClock,        tab: 'free-slots' },
  { label: 'FAQs Management',          icon: HelpCircle,           tab: 'faqs' },
  { label: 'Customer Reviews',         icon: Star,                 tab: 'reviews' },
  { label: 'Hero Banners',             icon: ImageIcon,            tab: 'hero-banners' },
  { label: 'SEO Blogs & Guides',       icon: Newspaper,            tab: 'blogs' },

  { label: 'Construction Services',    icon: Layers,               tab: 'primary-services' },
  { label: 'Construction Enquiry',     icon: MessageSquare,        tab: 'primary-service-enquiries' },
  { label: 'Professional Enquiries',   icon: MessageSquare,        tab: 'professional-enquiries' },
  { label: 'Professional Services',    icon: Users,                tab: 'professionals' },
  { label: 'Project Management',       icon: Building2,            tab: 'project-management' },
  { label: 'Portfolio Projects',       icon: FolderKanban,         tab: 'projects' },
  { label: 'Properties',               icon: House,                tab: 'properties' },
  { label: 'Property Enquiries',       icon: MessageSquareText,    tab: 'property-enquiries' },
  { label: 'Quick Enquiry',            icon: Zap,                  tab: 'quick-enquiries' },
  { label: 'Quick Services',           icon: Wrench,               tab: 'quick-services' },
  { label: 'Revenue & Earnings',       icon: CircleDollarSign,     tab: 'revenue' },
  { label: 'Service Bookings',         icon: CalendarDays,         tab: 'bookings' },
  { label: 'Orders History',           icon: ClipboardList,        tab: 'orders-history' },
  { label: 'Service Pricing',          icon: Tags,                 tab: 'quick-services-pricing' },
  { label: 'Shop Now Manager',         icon: ShoppingCart,         tab: 'shop-categories' },
  { label: '+ Add Shop Product',       icon: PlusCircle,           tab: 'shop-products' },
  { label: 'Shipping Settings',        icon: Truck,                tab: 'shipping-settings' },
  { label: 'Suppliers',                icon: Truck,                tab: 'suppliers' },
  { label: 'Vendors',                  icon: HardHat,              tab: 'vendors' },
  { label: 'Package Approvals',        icon: PackageCheck,         tab: 'packages' },
];

function SidebarNav({ sidebarOpen, closeSidebarOnMobile, isDarkMode }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams ? (searchParams.get('tab') || '') : '';

  return (
    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
      {menuItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = (item.tab || '') === currentTab;

        return (
          <Link
            key={item.label}
            href={item.tab ? `/dashboard?tab=${item.tab}` : '/dashboard'}
            onClick={closeSidebarOnMobile}
            title={item.label}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all ${
              isActive
                ? 'bg-[rgba(33,150,243,0.12)] text-[#0284c7] font-semibold'
                : isDarkMode
                ? 'text-gray-300 hover:text-white hover:bg-white/5 font-medium'
                : 'text-[#0f172a] hover:text-[#0284c7] hover:bg-slate-100/80 font-medium'
            }`}
          >
            <span
              className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-md transition-colors ${
                isActive
                  ? 'bg-[rgba(33,150,243,0.18)] text-[#0284c7]'
                  : 'text-current'
              }`}
            >
              {IconComponent ? (
                <IconComponent
                  size={20}
                  strokeWidth={1.75}
                  color="currentColor"
                  aria-hidden="true"
                />
              ) : null}
            </span>
            {sidebarOpen && <span className="text-sm truncate select-none">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

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
        setUser(JSON.parse(localStorage.getItem('user') || '{}'));
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

  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const bgClass = isDarkMode ? 'bg-[#0f172a]' : 'bg-white';
  const textPrimary = isDarkMode ? 'text-white' : 'text-[#0f172a]';
  const borderColor = isDarkMode ? 'border-slate-800' : 'border-slate-200';
  const hoverBg = isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50';

  return (
    <div className="admin-dashboard-root flex h-[calc(100dvh-4rem)] overflow-hidden bg-slate-900">
      {sidebarOpen && (
        <div
          aria-label="Close dashboard menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-x-0 top-16 bottom-0 z-[70] bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0 lg:w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'} fixed lg:relative top-16 bottom-0 lg:top-auto lg:bottom-auto left-0 z-[80] w-72 h-[calc(100dvh-4rem)] lg:h-full shrink-0 ${bgClass} border-r ${borderColor} transition-all duration-300 flex flex-col shadow-lg`}>
        {/* Logo / Header */}
        <div className={`flex items-center justify-between h-16 px-4 border-b ${borderColor}`}>
          {sidebarOpen && <span className={`font-black text-xl tracking-tight ${textPrimary}`}>MTBoss</span>}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
          >
            {sidebarOpen ? (
              <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Menu Items with active indicator */}
        <Suspense fallback={<div className="flex-1 p-4" />}>
          <SidebarNav
            sidebarOpen={sidebarOpen}
            closeSidebarOnMobile={closeSidebarOnMobile}
            isDarkMode={isDarkMode}
          />
        </Suspense>

        {/* User Profile */}
        <div className={`border-t ${borderColor} p-3`}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors ${hoverBg}`}
            >
              <div className="w-9 h-9 rounded-lg bg-[#0284c7] flex items-center justify-center font-bold text-white shrink-0">
                {user.name?.charAt(0) || 'A'}
              </div>
              {sidebarOpen && (
                <div className="text-left flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${textPrimary}`}>{user.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email || 'admin@example.com'}</p>
                </div>
              )}
            </button>

            {profileOpen && sidebarOpen && (
              <div className={`absolute bottom-full left-0 right-0 mb-2 ${bgClass} border ${borderColor} rounded-lg shadow-xl overflow-hidden`}>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-400/10' : 'text-red-600 hover:bg-red-50'}`}
                >
                  <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="h-full flex-1 min-w-0 overflow-y-auto overscroll-contain">
        <div className={`lg:hidden sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 ${bgClass} ${borderColor}`}>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-slate-800 hover:bg-slate-100'}`}
          >
            <Menu size={18} strokeWidth={1.75} aria-hidden="true" />
            Menu
          </button>
          <span className={`text-sm font-bold ${textPrimary}`}>Admin Dashboard</span>
        </div>
        {children}
      </main>
    </div>
  );
}
