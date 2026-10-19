"use client";

import { useState, useEffect, Suspense } from "react";
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
} from "@/app/components/ui/icons";

const groupForTab = (tab) => {
  if (["", "agents", "users"].includes(tab)) return "Main";
  if (["career-enquiries", "jobs", "professionals", "professional-enquiries"].includes(tab)) return "Hiring";
  if (["office-locations", "cities", "franchises"].includes(tab)) return "Locations";
  if (["calculator", "calculator-quotes", "lead-management", "submissions", "revenue", "bookings", "orders-history", "quick-services-pricing", "shop-categories", "shop-products", "cashback", "shipping-settings", "shop-commission-settings", "suppliers", "vendors", "product-approvals", "packages"].includes(tab)) return "Sales";
  return "Operations";
};

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, tab: "" },
  { label: "Agents", icon: UserCog, tab: "agents" },
  { label: "Users", icon: Users, tab: "users" },
  { label: "Calculator", icon: Calculator, tab: "calculator" },
  { label: "Calculator Quotes", icon: FileText, tab: "calculator-quotes" },
  { label: "Career Enquiry", icon: Briefcase, tab: "career-enquiries" },
  { label: "New Jobs", icon: BriefcaseBusiness, tab: "jobs" },
  { label: "Lead Management", icon: ClipboardList, tab: "lead-management" },
  { label: "Office Locations", icon: MapPin, tab: "office-locations" },
  { label: "Cities", icon: Building, tab: "cities" },
  { label: "Contact Forms", icon: Mail, tab: "submissions" },
  { label: "Franchises", icon: Store, tab: "franchises" },
  { label: "Free Time Slots", icon: CalendarClock, tab: "free-slots" },
  { label: "FAQs Management", icon: HelpCircle, tab: "faqs" },
  { label: "Customer Reviews", icon: Star, tab: "reviews" },
  { label: "Hero Banners", icon: ImageIcon, tab: "hero-banners" },
  { label: "SEO Blogs & Guides", icon: Newspaper, tab: "blogs" },

  { label: "Construction Services", icon: Layers, tab: "primary-services" },
  {
    label: "Construction Enquiry",
    icon: MessageSquare,
    tab: "primary-service-enquiries",
  },
  {
    label: "Professional Enquiries",
    icon: MessageSquare,
    tab: "professional-enquiries",
  },
  { label: "Professional Services", icon: Users, tab: "professionals" },
  { label: "Project Management", icon: Building2, tab: "project-management" },
  {
    label: "Project Management · Parties",
    icon: Building2,
    tab: "party-project-management",
  },
  { label: "PM Dashboard", icon: LayoutDashboard, tab: "pm-dashboard" },
  { label: "PM Reports", icon: FileText, tab: "pm-reports" },
  { label: "PM Activity Log", icon: FolderKanban, tab: "pm-audit" },
  {
    label: "PM Benchmarks · Rates",
    icon: CircleDollarSign,
    tab: "pm-benchmarks",
  },
  { label: "Portfolio Projects", icon: FolderKanban, tab: "projects" },
  { label: "All Properties", icon: House, tab: "properties" },
  { label: "Room Rentals", icon: House, tab: "room-rentals" },
  { label: "Flats", icon: Building, tab: "flats" },
  { label: "Plots", icon: MapPin, tab: "plots" },
  { label: "Create Property", icon: PlusCircle, tab: "create-property" },
  { label: "Property Bookings", icon: CalendarDays, tab: "property-bookings" },
  {
    label: "Property Enquiries",
    icon: MessageSquareText,
    tab: "property-enquiries",
  },
  { label: "Quick Enquiry", icon: Zap, tab: "quick-enquiries" },
  { label: "Quick Services", icon: Wrench, tab: "quick-services" },
  { label: "Revenue & Earnings", icon: CircleDollarSign, tab: "revenue" },
  { label: "Service Bookings", icon: CalendarDays, tab: "bookings" },
  { label: "Orders History", icon: ClipboardList, tab: "orders-history" },
  { label: "Service Pricing", icon: Tags, tab: "quick-services-pricing" },
  { label: "Shop Now Manager", icon: ShoppingCart, tab: "shop-categories" },
  { label: "Cashback & Wallet", icon: Wallet, tab: "cashback" },
  { label: "+ Add Shop Product", icon: PlusCircle, tab: "shop-products" },
  { label: "Shipping Settings", icon: Truck, tab: "shipping-settings" },
  {
    label: "Vendor Commission",
    icon: CircleDollarSign,
    tab: "shop-commission-settings",
  },
  { label: "Suppliers", icon: Truck, tab: "suppliers" },
  { label: "Vendors", icon: HardHat, tab: "vendors" },
  { label: "Product Approvals", icon: PackageCheck, tab: "product-approvals" },
  { label: "Package Approvals", icon: PackageCheck, tab: "packages" },
];

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

  const visibleItems = menuItems.filter((item) => {
    if (user?.role === "agent") {
      const tab = item.tab || "";
      if (tab === "product-approvals") return false;
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
  });

  return (
    <nav className="admin-sidebar__nav flex-1 overflow-y-auto px-3 py-4 space-y-1">
      {visibleItems.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = (item.tab || "") === currentTab;
        const group = groupForTab(item.tab || "");
        const previousGroup = index > 0 ? groupForTab(visibleItems[index - 1].tab || "") : null;
        const showGroup = group !== previousGroup;
        const itemLabel = item.label.charAt(0).toUpperCase() + item.label.slice(1).toLowerCase();

        return (
          <div key={item.label}>
            {showGroup && <div className="admin-sidebar__group">{group}</div>}
            <Link
              href={item.tab ? `/dashboard?tab=${item.tab}` : "/dashboard"}
              onClick={closeSidebarOnMobile}
              title={itemLabel}
              aria-current={isActive ? "page" : undefined}
              data-active={isActive ? "true" : undefined}
              className={`admin-sidebar__item relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive ? "bg-brand-100 text-brand-600 font-semibold" : "text-ink-700 hover:bg-app font-medium"}`}
            >
              <span className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${isActive ? "text-brand-600" : "text-current"}`}>
                {IconComponent ? <IconComponent size={20} strokeWidth={1.7} aria-hidden="true" /> : null}
              </span>
              <span className="flex-1 flex items-center justify-between text-sm truncate select-none">
                <span>{itemLabel}</span>
                {item.tab === "product-approvals" && pendingApprovalsCount > 0 && (
                  <AdminStatusBadge tone="danger" className="ml-auto">{pendingApprovalsCount}</AdminStatusBadge>
                )}
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
  const isDarkMode = false;
  const [user, setUser] = useState({});
  const router = useRouter();

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
          <Link href="/" aria-label="Go to MT Boss website" className="admin-sidebar__brand-link">
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
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
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
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="admin-logout-button rounded-lg p-2 transition-colors"
            >
              <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
            {profileOpen && (
              <div
                className={`absolute right-0 top-full mt-2 min-w-48 rounded-lg border ${borderColor} ${bgClass} p-1 shadow-xl`}
              >
                <div
                  className={`px-3 py-2 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {user.email || "Admin account"}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isDarkMode ? "text-red-400 hover:bg-red-400/10" : "text-red-600 hover:bg-red-50"}`}
                >
                  <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
