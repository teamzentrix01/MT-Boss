"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import "./admin-theme.css";
import { AdminStatusBadge } from "./AdminUI";
import DashboardNotifications from "./DashboardNotifications";
import { useRouter, useSearchParams } from "next/navigation";
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
  Wallet,
  LogOut,
  Menu,
  ChevronDown,
} from "@/app/components/ui/icons";

const menuStructure = [
  // Standalone top items
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, tab: '' },
  { id: 'users', label: 'Users', icon: Users, tab: 'users' },

  // Approvals
  {
    id: 'approvals',
    label: 'Approvals',
    icon: PackageCheck,
    children: [
      { label: 'Product Approvals', tab: 'product-approvals' },
      { label: 'Package Approvals', tab: 'packages' },
    ],
  },

  // Properties & Rentals
  {
    id: 'properties',
    label: 'Properties & Rentals',
    icon: House,
    children: [
      { label: 'Properties', tab: 'properties' },
      // { label: 'Room Rentals', tab: 'room-rentals' },
      // { label: 'Flats', tab: 'flats' },
      // { label: 'Plots', tab: 'plots' },
      // { label: 'Create Property', tab: 'create-property' },
      { label: 'Property Bookings', tab: 'property-bookings' },
      { label: 'Property Enquiries', tab: 'property-enquiries' },
    ],
  },

  // Services
  {
    id: 'services',
    label: 'Services',
    icon: Wrench,
    children: [
      { label: 'Construction Services', tab: 'primary-services' },
      // { label: 'Construction Enquiry', tab: 'primary-service-enquiries' },
      { label: 'Quick Services', tab: 'quick-services' },
      // { label: 'Quick Enquiry', tab: 'quick-enquiries' },
      { label: 'Professional Services', tab: 'professionals' },
      // { label: 'Professional Enquiries', tab: 'professional-enquiries' },
      { label: 'Service Bookings', tab: 'bookings' },
      { label: 'Service Pricing', tab: 'quick-services-pricing' },
    ],
  },

  // Enquiries
  {
    id: 'enquiries',
    label: 'Enquiries',
    icon: MessageSquareText,
    children: [
      { label: 'Professional Enquiries', tab: 'professional-enquiries' },
      { label: 'Quick Enquiry', tab: 'quick-enquiries' },
      { label: 'Construction Enquiry', tab: 'primary-service-enquiries' },
    ],
  },

  // Shop & E-Commerce
  {
    id: 'shop',
    label: 'Shop & E-Commerce',
    icon: ShoppingCart,
    children: [
      { label: 'Shop Now Manager', tab: 'shop-categories' },
      { label: '+ Add Shop Product', tab: 'shop-products' },
      { label: 'Orders History', tab: 'orders-history' },
      { label: 'Shipping Settings', tab: 'shipping-settings' },
      { label: 'Vendor Commission', tab: 'shop-commission-settings' },
      { label: 'Cashback & Wallet', tab: 'cashback' },
      { label: 'Franchises', tab: 'franchises' },
    ],
  },

  // Project Management
  {
    id: 'project-management',
    label: 'Project Management',
    icon: Building2,
    children: [
      { label: 'PM Dashboard', tab: 'pm-dashboard' },
      { label: 'Project Management', tab: 'project-management' },
      { label: 'Party Project Management', tab: 'party-project-management' },
      { label: 'PM Reports', tab: 'pm-reports' },
      { label: 'PM Activity Log', tab: 'pm-audit' },
      { label: 'Portfolio Projects', tab: 'projects' },
    ],
  },

  // Leads
  {
    id: 'sales',
    label: 'Sales & Leads',
    icon: ClipboardList,
    children: [
      { label: 'Lead Management', tab: 'lead-management' },
      // { label: 'Calculator', tab: 'calculator' },
      // { label: 'Calculator Quotes', tab: 'calculator-quotes' },
      { label: 'Revenue & Earnings', tab: 'revenue' },
    ],
  },

  // calculator
  {
    id: 'calculator',
    label: 'Calculator',
    icon: Calculator,
    children: [
      { label: 'Calculator', tab: 'calculator' },
      { label: 'Calculator Quotes', tab: 'calculator-quotes' },
    ],
  },

  // Hiring & Jobs
  {
    id: 'hiring',
    label: 'Hiring & Jobs',
    icon: Briefcase,
    children: [
      { label: 'Career Enquiry', tab: 'career-enquiries' },
      { label: 'New Jobs', tab: 'jobs' },
    ],
  },

  // Locations
  {
    id: 'locations',
    label: 'Locations',
    icon: MapPin,
    children: [
      { label: 'Office Locations', tab: 'office-locations' },
      { label: 'Cities', tab: 'cities' },
      // { label: 'Franchises', tab: 'franchises' },
    ],
  },

  // Website & Content
  {
    id: 'website',
    label: 'Website & Content',
    icon: Layers,
    children: [
      { label: 'Hero Banners', tab: 'hero-banners' },
      { label: 'SEO Blogs & Guides', tab: 'blogs' },
      { label: 'Customer Reviews', tab: 'reviews' },
      { label: 'FAQs Management', tab: 'faqs' },
      { label: 'Free Time Slots', tab: 'free-slots' },
      { label: 'Contact Forms', tab: 'submissions' },
    ],
  },
];

function isTabAllowedForAgent(tab, user) {
  if (user?.role === "agent") {
    if (tab === "product-approvals" || tab === "packages") return false;
    if (
      tab.includes("project-management") ||
      tab.startsWith("pm-") ||
      tab === "projects"
    ) {
      return !!user.has_project_management_access;
    }
    if (tab === "lead-management") return true;
    return false;
  }
  return true;
}

function SidebarNav({ sidebarOpen, closeSidebarOnMobile, isDarkMode, user }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get("tab") || "" : "";
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchPending = async () => {
      try {
        let u = {};
        try {
          u = JSON.parse(localStorage.getItem("user") || "{}");
        } catch {}
        const token =
          localStorage.getItem("admin-token") ||
          (u.role === "admin" ? localStorage.getItem("token") : "");
        if (!token) return;
        const res = await fetch(
          "/api/admin/product-approvals?count_only=true",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (active && data.success) {
          setPendingApprovalsCount(data.pendingCount || 0);
        }
      } catch {}
    };
    fetchPending();
    const handleUpdate = () => fetchPending();
    window.addEventListener("mtbossShopProductsUpdated", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("mtbossShopProductsUpdated", handleUpdate);
    };
  }, []);

  const [openGroups, setOpenGroups] = useState({});

  // Filter visible items and their children based on user permissions
  const visibleItems = menuStructure
    .map((item) => {
      if (item.children) {
        const allowedChildren = item.children.filter((child) =>
          isTabAllowedForAgent(child.tab || "", user)
        );
        if (allowedChildren.length === 0) return null;
        return { ...item, children: allowedChildren };
      }
      if (!isTabAllowedForAgent(item.tab || "", user)) return null;
      return item;
    })
    .filter(Boolean);

  // Automatically expand group containing active tab
  useEffect(() => {
    visibleItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => (child.tab || "") === currentTab
        );
        if (hasActiveChild) {
          setOpenGroups((prev) => ({ ...prev, [item.id]: true }));
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <nav className="admin-sidebar__nav flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
      {visibleItems.map((item) => {
        const IconComponent = item.icon;

        if (item.children) {
          const isOpen = !!openGroups[item.id];
          const isChildActive = item.children.some(
            (child) => (child.tab || "") === currentTab
          );
          const hasApprovalsBadge =
            item.id === "approvals" && pendingApprovalsCount > 0;

          return (
            <div key={item.id} className="admin-sidebar__dropdown-group">
              <button
                type="button"
                onClick={() => toggleGroup(item.id)}
                aria-expanded={isOpen}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-sm font-medium ${
                  isChildActive
                    ? "bg-brand-50 text-brand-600 font-semibold"
                    : "text-ink-700 hover:bg-app"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${
                      isChildActive ? "text-brand-600" : "text-current"
                    }`}
                  >
                    {IconComponent ? (
                      <IconComponent
                        size={20}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                  <span className="truncate select-none text-left">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {hasApprovalsBadge && (
                    <AdminStatusBadge tone="danger">
                      {pendingApprovalsCount}
                    </AdminStatusBadge>
                  )}
                  <ChevronDown
                    size={16}
                    className={`text-ink-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="mt-1 ml-4 pl-3 border-l-2 border-zinc-200 space-y-1">
                  {item.children.map((child) => {
                    const isChildTabActive =
                      (child.tab || "") === currentTab;
                    return (
                      <Link
                        key={child.label}
                        href={
                          child.tab
                            ? `/dashboard?tab=${child.tab}`
                            : "/dashboard"
                        }
                        onClick={closeSidebarOnMobile}
                        title={child.label}
                        aria-current={isChildTabActive ? "page" : undefined}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                          isChildTabActive
                            ? "bg-brand-100 text-brand-600 font-bold"
                            : "text-ink-700 hover:text-ink-900 hover:bg-app font-medium"
                        }`}
                      >
                        <span className="truncate">{child.label}</span>
                        {child.tab === "product-approvals" &&
                          pendingApprovalsCount > 0 && (
                            <AdminStatusBadge tone="danger" className="ml-2">
                              {pendingApprovalsCount}
                            </AdminStatusBadge>
                          )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        // Standalone Items (e.g. Overview, Users)
        const isActive = (item.tab || "") === currentTab;
        return (
          <div key={item.id || item.label}>
            <Link
              href={item.tab ? `/dashboard?tab=${item.tab}` : "/dashboard"}
              onClick={closeSidebarOnMobile}
              title={item.label}
              aria-current={isActive ? "page" : undefined}
              data-active={isActive ? "true" : undefined}
              className={`admin-sidebar__item relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isActive
                  ? "bg-brand-100 text-brand-600 font-semibold"
                  : "text-ink-700 hover:bg-app font-medium"
              }`}
            >
              <span
                className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${
                  isActive ? "text-brand-600" : "text-current"
                }`}
              >
                {IconComponent ? (
                  <IconComponent
                    size={20}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                ) : null}
              </span>
              <span className="flex-1 text-sm truncate select-none">
                {item.label}
              </span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const isDarkMode = false;
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!profileOpen) return;
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        let u = JSON.parse(localStorage.getItem("user"));
        if (!u) {
          const agentStr = localStorage.getItem("agent");
          if (agentStr) {
            u = JSON.parse(agentStr);
            u.role = "agent";
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
    window.addEventListener("resize", syncSidebar);
    return () => window.removeEventListener("resize", syncSidebar);
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const res = await originalFetch(...args);
      if (
        res.status === 403 &&
        typeof args[0] === "string" &&
        args[0].includes("/api/admin/project-management")
      ) {
        let u = null;
        try {
          u = JSON.parse(localStorage.getItem("agent"));
        } catch {}
        if (u) {
          alert(
            "Your access to Project Management has been revoked. Contact admin.",
          );
          window.location.href = "/agent/dashboard";
        }
      }
      return res;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/dashboard?tab=overview');
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const bgClass = "bg-surface";
  const pageBgClass = "bg-app";
  const textPrimary = "text-ink-900";
  const borderColor = "border-line";
  const hoverBg = "hover:bg-app";
  return (
    <div
      className={`admin-dashboard-root flex h-dvh overflow-hidden ${pageBgClass}`}
    >
      {sidebarOpen && (
        <div
          aria-label="Close dashboard menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-[70] bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed lg:relative top-0 bottom-0 lg:top-auto lg:bottom-auto left-0 z-[80] w-72 lg:w-64 h-dvh lg:h-full shrink-0 ${bgClass} border-r ${borderColor} transition-transform duration-300 flex flex-col shadow-lg lg:translate-x-0`}
      >
        {/* Logo / Header */}
        <div className="admin-sidebar__brand flex items-center px-4 border-b">
          <Link href="/" aria-label="Go to MTBoss website" className="admin-sidebar__brand-link">
            MTBoss
          </Link>
        </div>
        {/* Menu Items with active indicator */}
        <Suspense fallback={<div className="flex-1 p-4" />}>
          <SidebarNav
            sidebarOpen={true}
            closeSidebarOnMobile={closeSidebarOnMobile}
            isDarkMode={false}
            user={user}
          />
        </Suspense>
      </aside>

      {/* Main Content */}
      <main
        className={`h-full flex-1 min-w-0 overflow-y-auto overscroll-contain ${pageBgClass}`}
      >
        <div
          className="admin-topbar sticky top-0 z-40 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {/* <button
              type="button"
              onClick={goBack}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${isDarkMode ? "text-white hover:bg-white/10" : "text-slate-800 hover:bg-slate-100"}`}
              aria-label="Go to previous page"
            >
              ← Back
            </button> */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${isDarkMode ? "text-white hover:bg-white/10" : "text-slate-800 hover:bg-slate-100"}`}
            >
              <Menu size={18} strokeWidth={1.75} aria-hidden="true" />
              Menu
            </button>
            <span className={`hidden lg:block text-sm font-semibold ${textPrimary}`}>
              {" "}
              Admin Dashboard
            </span>
          </div>
          <div className="flex-1" />
          <div className="relative flex items-center gap-1">
            <DashboardNotifications />
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${hoverBg}`}
              >
                <span className="admin-avatar flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white">
                  {user.name?.charAt(0) || "A"}
                </span>
                <span
                  className={`hidden sm:block max-w-40 truncate text-sm font-semibold ${textPrimary}`}
                >
                  {user.name || "Admin"}
                </span>
              </button>

              {profileOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 min-w-48 z-50 rounded-lg border ${borderColor} ${bgClass} p-1 shadow-xl`}
                >
                  <div
                    className={`px-3 py-2 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {user.email || "Admin account"}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isDarkMode ? "text-red-400 hover:bg-red-400/10" : "text-red-600 hover:bg-red-50"}`}
                  >
                    <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="admin-logout-button rounded-lg p-2 transition-colors"
            >
              <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
