"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const PUBLIC_RESULTS = [
  { title: "Home", subtitle: "MT-BOSS homepage", href: "/", keywords: "home main" },
  { title: "Quick Services", subtitle: "Book home repair and maintenance", href: "/quick", keywords: "quick service plumber electrician repair booking" },
  { title: "Primary Services", subtitle: "Construction and core services", href: "/Services/all", keywords: "primary construction services" },
  { title: "Professional Services", subtitle: "Architects, engineers and consultants", href: "/Services/professionals", keywords: "professional architect engineer consultant" },
  { title: "Buy Property", subtitle: "Browse verified properties", href: "/property/buy", keywords: "buy property house flat plot" },
  { title: "Sell Property", subtitle: "List a property", href: "/property/sell", keywords: "sell property listing" },
  { title: "Rent Property", subtitle: "Find or list rental property", href: "/property/rent", keywords: "rent rental property tenant" },
  { title: "Budget Calculator", subtitle: "Estimate construction cost", href: "/calculator", keywords: "calculator estimate budget boq cost" },
  { title: "Shop Now", subtitle: "Browse shop categories", href: "/ShopNow", keywords: "shop material products store" },
  { title: "Become an Agent", subtitle: "Apply as MT-BOSS agent", href: "/agent", keywords: "agent apply lead work" },
  { title: "Franchise", subtitle: "Apply for franchise", href: "/franchise", keywords: "franchise partner business" },
  { title: "Careers", subtitle: "Open job roles", href: "/careers", keywords: "career jobs hiring" },
  { title: "Contact", subtitle: "Contact MT-BOSS", href: "/contact", keywords: "contact support office" },
];

const ROLE_RESULTS = {
  user: [
    { title: "My Dashboard", subtitle: "Bookings and account", href: "/userdashboard", keywords: "my bookings user dashboard orders" },
  ],
  admin: [
    { title: "Admin Overview", subtitle: "Main admin dashboard", href: "/dashboard", keywords: "admin overview dashboard" },
    { title: "Service Bookings", subtitle: "Track quick service bookings", href: "/dashboard?tab=bookings", keywords: "admin bookings quick service vendor accepted" },
    { title: "Vendors", subtitle: "Approve and manage vendors", href: "/dashboard?tab=vendors", keywords: "admin vendor approval shops" },
    { title: "Suppliers", subtitle: "Approve and manage suppliers", href: "/dashboard?tab=suppliers", keywords: "admin supplier material" },
    { title: "Package Approvals", subtitle: "Approve paid packages", href: "/dashboard?tab=packages", keywords: "admin package approval subscription" },
    { title: "Revenue & Earnings", subtitle: "Commission and payments", href: "/dashboard?tab=revenue", keywords: "admin revenue earning commission" },
    { title: "Quick Services", subtitle: "Manage quick services", href: "/dashboard?tab=quick-services", keywords: "admin quick services manage" },
    { title: "Service Pricing", subtitle: "Manage quick service prices", href: "/dashboard?tab=quick-services-pricing", keywords: "admin pricing price quick service" },
    { title: "Free Time Slots", subtitle: "Manage city slots", href: "/dashboard?tab=free-slots", keywords: "admin free slots time city" },
    { title: "Properties", subtitle: "Verify property listings", href: "/dashboard?tab=properties", keywords: "admin property verify buy rent sell" },
    { title: "Projects", subtitle: "Manage projects", href: "/dashboard?tab=projects", keywords: "admin projects gallery" },
    { title: "Agents", subtitle: "Approve and manage agents", href: "/dashboard?tab=agents", keywords: "admin agents leads" },
    { title: "Franchises", subtitle: "Manage franchise requests", href: "/dashboard?tab=franchises", keywords: "admin franchise" },
    { title: "Primary Services", subtitle: "Manage primary services", href: "/dashboard?tab=primary-services", keywords: "admin primary services" },
    { title: "Professional Services", subtitle: "Manage professionals", href: "/dashboard?tab=professionals", keywords: "admin professional services" },
    { title: "Shop Categories", subtitle: "Manage shop categories", href: "/dashboard?tab=shop-categories", keywords: "admin shop categories" },
    { title: "Career Enquiries", subtitle: "Review career submissions", href: "/dashboard?tab=career-enquiries", keywords: "admin career enquiries resume" },
    { title: "Contact Forms", subtitle: "Review contact submissions", href: "/dashboard?tab=submissions", keywords: "admin contact forms enquiry" },
  ],
  vendor: [
    { title: "Vendor Bookings", subtitle: "Incoming quick service requests", href: "/vendor/dashboard?tab=notifications", keywords: "vendor booking requests notifications leads" },
    { title: "Vendor History", subtitle: "Completed jobs and ratings", href: "/vendor/dashboard?tab=history", keywords: "vendor history completed ratings earnings" },
    { title: "Vendor Package", subtitle: "Buy or check package", href: "/vendor/dashboard?tab=packages", keywords: "vendor package subscription paid leads" },
    { title: "Vendor Profile", subtitle: "Shop profile and services", href: "/vendor/dashboard?tab=profile", keywords: "vendor profile shop services city" },
  ],
  supplier: [
    { title: "Supplier Orders", subtitle: "Open enquiries and orders", href: "/supplier/dashboard?tab=orders", keywords: "supplier orders enquiries materials" },
    { title: "Supplier Earnings", subtitle: "Revenue and commission", href: "/supplier/dashboard?tab=earnings", keywords: "supplier earnings revenue commission" },
    { title: "Supplier Package", subtitle: "Buy or check package", href: "/supplier/dashboard?tab=packages", keywords: "supplier package subscription" },
    { title: "Supplier Profile", subtitle: "Shop and category settings", href: "/supplier/dashboard?tab=profile", keywords: "supplier profile categories shop" },
  ],
  franchise: [
    { title: "Franchise Dashboard", subtitle: "Projects and assigned agents", href: "/franchise/dashboard", keywords: "franchise dashboard projects agents" },
  ],
  agent: [
    { title: "Agent Leads", subtitle: "Lead management", href: "/agent/dashboard?tab=leads", keywords: "agent leads clients follow up" },
    { title: "Agent Projects", subtitle: "Assigned project work", href: "/agent/dashboard?tab=projects", keywords: "agent projects payments labour materials" },
    { title: "Agent Schedule", subtitle: "Follow-ups and tasks", href: "/agent/dashboard?tab=schedule", keywords: "agent schedule tasks follow up" },
    { title: "Agent Profile", subtitle: "Profile and password", href: "/agent/dashboard?tab=profile", keywords: "agent profile password" },
  ],
};

function normalize(value) {
  return String(value || "").toLowerCase();
}

function serviceSlug(service) {
  return service.slug || normalize(service.label).trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function GlobalSearch({ user, isDarkMode, onNavigate }) {
  const router = useRouter();
  const wrapRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [quickServices, setQuickServices] = useState([]);

  const role = user?.role || "guest";

  useEffect(() => {
    let active = true;
    fetch("/api/quick-services")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success) setQuickServices(data.data || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const searchItems = useMemo(() => {
    const serviceResults = quickServices.map((service) => ({
      title: service.label,
      subtitle: "Quick service",
      href: `/quick/${serviceSlug(service)}`,
      keywords: `${service.description || ""} quick service booking repair home`,
    }));

    const roleItems = ROLE_RESULTS[role] || [];
    const userItems = role === "guest" ? [] : ROLE_RESULTS.user;
    const publicItems = role === "admin" ? PUBLIC_RESULTS : [...PUBLIC_RESULTS, ...serviceResults];

    if (role === "user" || role === "guest") return [...publicItems, ...userItems];
    return [...roleItems, ...publicItems];
  }, [quickServices, role]);

  const results = useMemo(() => {
    const q = normalize(query).trim();
    if (!q) return searchItems.slice(0, 6);

    return searchItems
      .map((item) => {
        const haystack = normalize(`${item.title} ${item.subtitle} ${item.keywords}`);
        const title = normalize(item.title);
        const score = title.startsWith(q) ? 3 : title.includes(q) ? 2 : haystack.includes(q) ? 1 : 0;
        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 8);
  }, [query, searchItems]);

  function goTo(item) {
    setQuery("");
    setOpen(false);
    onNavigate?.();
    router.push(item.href);
  }

  return (
    <div ref={wrapRef} className="relative w-full lg:w-[180px] xl:w-[220px]">
      <div className={`flex items-center gap-2 border rounded-md px-3 py-2 transition-colors ${
        isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-gray-50 border-gray-200 text-zinc-900"
      }`}>
        <svg className={isDarkMode ? "w-4 h-4 text-zinc-500" : "w-4 h-4 text-gray-400"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
        </svg>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && results[0]) goTo(results[0]);
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder={role === "admin" ? "Search admin tools..." : role === "vendor" ? "Search vendor tools..." : "Search services..."}
          className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-400"
        />
      </div>

      {open && (
        <div className={`absolute left-0 right-0 top-full mt-2 rounded-md border shadow-xl z-[140] overflow-hidden ${
          isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-100"
        }`}>
          {results.length > 0 ? (
            results.map((item) => (
              <button
                key={`${item.href}-${item.title}`}
                type="button"
                onClick={() => goTo(item)}
                className={`w-full text-left px-4 py-3 border-b last:border-b-0 transition-colors ${
                  isDarkMode ? "border-zinc-900 hover:bg-zinc-900" : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <div className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>{item.title}</div>
                <div className={`text-[11px] mt-0.5 ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}>{item.subtitle}</div>
              </button>
            ))
          ) : (
            <div className={`px-4 py-4 text-sm ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}>
              No allowed result found for your role.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
