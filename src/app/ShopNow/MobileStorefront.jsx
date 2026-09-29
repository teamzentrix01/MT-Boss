"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Droplet,
  Grid3X3,
  Hammer,
  Home,
  Layers,
  MapPin,
  Minus,
  Mountain,
  Package,
  PaintBucket,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  User,
  Wallet,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { displayUnit, getProductImage, ShopImage } from "./Storefront";
import { getCartStep } from "@/lib/cart-step";
import { CATEGORY_NAV_TREE } from "./categoryNavTree";
import GlobalSearch from "../components/GlobalSearch";
import QuickServices from "../components/QuickServices";
import MaterialOrdersPanel from "../components/MaterialOrdersPanel";

function getCategoryIcon(name = "") {
  const val = name.toLowerCase();
  if (/cement|concrete/.test(val)) return Package;
  if (/steel|iron|tmt|rebar|metal|pipe/.test(val)) return Wrench;
  if (/sand|gravel|aggregate|barjri|bajri/.test(val)) return Mountain;
  if (/brick|block|aac/.test(val)) return Hammer;
  if (/paint|colour|primer/.test(val)) return PaintBucket;
  if (/tile|floor|marble|granite/.test(val)) return Grid3X3;
  if (/plumb|sanitary|tank/.test(val)) return Droplet;
  if (/timber|wood|plywood|lakdi/.test(val)) return Layers;
  if (/electric|wire|cable|switch|mcb/.test(val)) return Zap;
  return Package;
}

function getSubcategoriesForCategory(category) {
  if (!category) return ["All"];
  const list = [];
  if (Array.isArray(category.subcategories) && category.subcategories.length > 0) {
    category.subcategories.forEach((s) => {
      const name = typeof s === 'object' && s !== null ? s.name : s;
      if (name && !list.includes(name)) list.push(name);
    });
  }
  if (Array.isArray(category.types) && category.types.length > 0) {
    category.types.forEach((t) => {
      if (!list.includes(t)) list.push(t);
    });
  }
  if (list.length === 0) {
    const treeMatch = CATEGORY_NAV_TREE.find(
      (p) =>
        p.label.toLowerCase().includes(category.name.toLowerCase()) ||
        category.name.toLowerCase().includes(p.label.toLowerCase()) ||
        p.children.some((c) => c.toLowerCase() === category.name.toLowerCase())
    );
    if (treeMatch && Array.isArray(treeMatch.children)) {
      list.push(...treeMatch.children.slice(0, 6));
    }
  }
  if (list.length === 0) {
    list.push("Standard Grade", "Premium Grade", "Commercial");
  }
  return ["All", ...list];
}

function getProductDiscount(product) {
  const price = Number(product?.price);
  const compare = Number(product?.compare_at_price);
  if (compare > price && price > 0) {
    return Math.round(((compare - price) / compare) * 100);
  }
  if (Array.isArray(product?.bulk_pricing) && product.bulk_pricing.length > 0) {
    const lowest = Math.min(...product.bulk_pricing.map((b) => Number(b.price) || price));
    if (lowest < price && price > 0) {
      return Math.round(((price - lowest) / price) * 100);
    }
  }
  return 8; // fallback realistic bulk discount
}

function getLowestBulkPrice(product) {
  const basePrice = Number(product?.price) || 0;
  if (Array.isArray(product?.bulk_pricing) && product.bulk_pricing.length > 0) {
    const valid = product.bulk_pricing.map((b) => Number(b.price)).filter((p) => p > 0);
    if (valid.length > 0) return Math.min(...valid);
  }
  return basePrice > 0 ? Math.round(basePrice * 0.92) : null;
}

function MobileTopNavBar({ user, isDark, onToggleTheme, onOpenNavDrawer }) {
  return (
    <div className="mobile-top-nav-bar">
      {/* Logo (MTboss icon + text) — left side */}
      <Link href="/" className="mobile-top-logo" aria-label="MTBoss Home">
        <Image
          src="/logo.png"
          alt="MTboss"
          width={100}
          height={30}
          priority
          className="mobile-top-logo-img"
        />
      </Link>

      {/* Actions: Sign In + Sign Up + Dark mode + Hamburger */}
      <div className="mobile-top-actions">
        {!user ? (
          <>
            <Link href="/login" className="mobile-btn-signin">
              Sign In
            </Link>
            <Link href="/signup" className="mobile-btn-signup">
              Sign Up
            </Link>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (user.role === 'vendor') window.location.href = '/vendor/dashboard';
              else if (user.role === 'admin') window.location.href = '/dashboard';
              else if (user.role === 'supplier') window.location.href = '/supplier/dashboard';
              else if (user.role === 'franchise') window.location.href = '/franchise/dashboard';
              else window.location.href = '/userdashboard';
            }}
            className="mobile-btn-signin"
          >
            Dashboard
          </button>
        )}

        {/* Dark mode toggle (moon icon) — light/dark theme switch */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="mobile-theme-toggle-btn"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? (
            <span className="text-sm select-none leading-none">☀️</span>
          ) : (
            <span className="text-sm select-none leading-none">🌙</span>
          )}
        </button>

        {/* Hamburger menu (≡) — extreme right, mobile nav drawer kholne ke liye */}
        <button
          type="button"
          onClick={onOpenNavDrawer}
          className="mobile-hamburger-btn"
          aria-label="Open navigation menu"
        >
          <svg className="w-5 h-5 text-gray-800 dark:text-gray-100" fill="none" stroke="currentColor" strokeWidth={2.4} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function MobileStorefront({
  categories = [],
  products = [],
  catalog = [],
  content = {},
  loading = false,
  cities = [],
  selectedCity = "",
  setSelectedCity,
  cart = [],
  onAdd,
  onChangeQty,
  onQuote,
  onBuy,
  onCheckout,
  onDetails,
  shippingSettings = null,
  activeCoupon = null,
  couponCalculation = null,
  couponOffers = [],
  onApplyCoupon = () => ({ error: 'Coupon service unavailable' }),
  onSelectCoupon = () => ({ error: 'Coupon service unavailable' }),
  onClearCoupon = () => { },
}) {
  const [mobileView, setMobileView] = useState("home"); // "home" | "listing" | "orders" | "account"
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterChip, setActiveFilterChip] = useState("All");
  const [citySheetOpen, setCitySheetOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [listingSearchOpen, setListingSearchOpen] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const [localShippingSettings, setLocalShippingSettings] = useState(shippingSettings);
  const [couponCode, setCouponCode] = useState(activeCoupon?.code || '');
  const [couponNotice, setCouponNotice] = useState('');
  const [offersOpen, setOffersOpen] = useState(false);
  const searchInputRef = useRef(null);
  const rightFeedRef = useRef(null);
  const activeCatBtnRef = useRef(null);

  useEffect(() => {
    if (activeCoupon?.code) {
      setCouponCode(activeCoupon.code);
    }
  }, [activeCoupon]);

  useEffect(() => {
    if (shippingSettings) setLocalShippingSettings(shippingSettings);
  }, [shippingSettings]);

  useEffect(() => {
    const loadShipping = () => {
      fetch("/api/shipping-settings")
        .then((r) => (r.ok && r.headers.get('content-type')?.includes('application/json') ? r.json() : null))
        .then((res) => {
          if (res?.success && res.data) setLocalShippingSettings(res.data);
        })
        .catch(console.error);
    };
    loadShipping();
    window.addEventListener("focus", loadShipping);
    window.addEventListener("shippingSettingsUpdated", loadShipping);
    return () => {
      window.removeEventListener("focus", loadShipping);
      window.removeEventListener("shippingSettingsUpdated", loadShipping);
    };
  }, []);

  const activeShipping = localShippingSettings || shippingSettings;
  const freeRule = activeShipping?.freeRule;
  const isFreeDeliveryActive = Boolean(freeRule?.is_active);
  const freeDeliveryMinOrder = freeRule?.min_order_value != null ? Number(freeRule.min_order_value) : 50000;

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('vendor-token') || localStorage.getItem('admin-token') || localStorage.getItem('supplier-token') || localStorage.getItem('franchise-token');
      const userData = localStorage.getItem('user') || localStorage.getItem('vendor') || localStorage.getItem('admin') || localStorage.getItem('supplier') || localStorage.getItem('franchise');
      if (token && userData) {
        try { setUser(JSON.parse(userData)); } catch (e) { }
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('userLoggedIn', checkUser);
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userLoggedIn', checkUser);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setIsDark(html.classList.contains("dark-mode"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (navDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [navDrawerOpen]);

  const handleToggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    [
      'token', 'user', 'admin-token', 'admin', 'vendor-token', 'vendor',
      'supplier-token', 'supplier', 'franchise-token', 'franchise'
    ].forEach((key) => localStorage.removeItem(key));
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
    setUser(null);
    window.dispatchEvent(new Event('userLoggedIn'));
    window.location.href = '/login';
  };

  // Active Category object
  const activeCategory = useMemo(() => {
    if (!activeCategoryId && categories.length > 0) return categories[0];
    return categories.find((c) => String(c.id) === String(activeCategoryId)) || categories[0] || null;
  }, [categories, activeCategoryId]);

  const displayedHomeCategories = useMemo(() => {
    return showAllCategories ? categories : categories.slice(0, 6);
  }, [categories, showAllCategories]);

  useEffect(() => {
    if (mobileView === "listing") {
      activeCatBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeCategoryId, mobileView]);

  // Subcategories for active category
  const subcategories = useMemo(() => {
    return getSubcategoriesForCategory(activeCategory);
  }, [activeCategory]);

  // Filter chips (subcategories + brands) for right pane in listing
  const filterChips = useMemo(() => {
    if (!activeCategory) return ["All"];
    const catProducts = catalog.filter(
      (p) =>
        String(p.category?.id) === String(activeCategory.id) ||
        p.category?.name?.toLowerCase() === activeCategory.name?.toLowerCase()
    );
    const subcats = Array.isArray(activeCategory.subcategories) && activeCategory.subcategories.length > 0
      ? activeCategory.subcategories.map(s => typeof s === 'object' && s !== null ? s.name : s).filter(Boolean)
      : getSubcategoriesForCategory(activeCategory).filter((s) => s !== "All");
    const brands = [...new Set(catProducts.map((p) => p.brand).filter(Boolean))];
    const options = ["All", ...subcats, ...brands].filter(Boolean);
    return [...new Set(options)].slice(0, 12);
  }, [catalog, activeCategory]);

  // Products belonging to the active category
  const categoryProducts = useMemo(() => {
    if (!activeCategory) return [];
    let list = catalog.filter((product) => {
      const matchCat =
        String(product.category?.id) === String(activeCategory.id) ||
        product.category?.name?.toLowerCase() === activeCategory.name?.toLowerCase();
      return matchCat;
    });

    // Subcategory filter
    if (activeSubcategory && activeSubcategory !== "All") {
      const subLower = activeSubcategory.toLowerCase();
      const filtered = list.filter((p) => {
        const text = `${p.name} ${p.description || ""} ${p.brand || ""}`.toLowerCase();
        return text.includes(subLower);
      });
      if (filtered.length > 0) list = filtered;
    }

    // Filter chip filter (brand / specific tag)
    if (activeFilterChip && activeFilterChip !== "All") {
      const chipLower = activeFilterChip.toLowerCase();
      const filtered = list.filter((p) => {
        const text = `${p.name} ${p.brand || ""}`.toLowerCase();
        return text.includes(chipLower);
      });
      if (filtered.length > 0) list = filtered;
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((p) => `${p.name} ${p.brand || ""} ${p.category?.name || ""}`.toLowerCase().includes(q));
    }

    return list;
  }, [catalog, activeCategory, activeSubcategory, activeFilterChip, searchQuery]);

  // Global search results when searching from home header
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    return catalog.filter((p) => `${p.name} ${p.brand || ""} ${p.category?.name || ""}`.toLowerCase().includes(q));
  }, [catalog, searchQuery]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Number of unique categories in cart (used for mobile cart badge & cart display)
  const cartCategoryCount = useMemo(() => {
    if (!Array.isArray(cart) || cart.length === 0) return 0;
    const uniqueCategories = new Set();
    cart.forEach((item) => {
      const p = item?.product || {};
      const cat = p.category || item?.category;
      let name = "";
      if (typeof cat === "object" && cat !== null) {
        name = cat.name || cat.title || String(cat.id || "");
      } else if (typeof cat === "string") {
        name = cat;
      }
      if (!name) {
        name = p.category_name || p.categoryName || "";
      }
      if (!name && Array.isArray(categories)) {
        const found = categories.find((c) =>
          (p.category_id && (String(c.id) === String(p.category_id) || String(c._id) === String(p.category_id))) ||
          c.name?.toLowerCase() === p.name?.toLowerCase()
        );
        if (found) name = found.name;
      }
      const finalKey = (name || p.name || p.id || "").trim().toLowerCase();
      if (finalKey) uniqueCategories.add(finalKey);
    });
    return uniqueCategories.size;
  }, [cart, categories]);

  const cartSubtotal = cart.reduce((sum, item) => {
    const price = Number(item.product.price) || 0;
    return sum + price * item.quantity;
  }, 0);
  const hasUnpricedItems = cart.some((item) => !(Number(item.product.price) > 0));
  const couponDiscount = (activeCoupon && couponCalculation?.eligible) ? (Number(couponCalculation.discount) || 0) : 0;
  const cartFinalTotal = Math.max(0, cartSubtotal - couponDiscount);

  const navigateToCategory = (cat) => {
    setActiveCategoryId(cat.id);
    setActiveSubcategory("All");
    setActiveFilterChip("All");
    setMobileView("listing");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const navigateToHome = () => {
    setMobileView("home");
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="mobile-store-root">
      {/* ─────────────────────────────────────────────────────────────
          1. STICKY MOBILE HEADER (When on Home / Discovery View)
         ───────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────
          1. STICKY MOBILE HEADER (When on Home / Discovery View)
         ───────────────────────────────────────────────────────────── */}
      {mobileView === "home" && (
        <header className="mobile-sticky-header">
          {/* Row 0: Mobile Top Nav Bar (Logo | Sign In | Sign Up | Theme Toggle | Hamburger) */}
          <MobileTopNavBar
            user={user}
            isDark={isDark}
            onToggleTheme={handleToggleDarkMode}
            onOpenNavDrawer={() => setNavDrawerOpen(true)}
          />

          {/* Row 1: Delivery Info dropdown + Wallet + Cart */}
          <div className="mobile-header-row-1">
            <div className="mobile-brand-box">
              <button
                type="button"
                className="mobile-delivery-dropdown"
                onClick={() => setCitySheetOpen(true)}
                aria-label="Select delivery city"
              >
                <span className="mobile-delivery-dot" />
                <span className="mobile-delivery-text">
                  {(content?.delivery_tagline || "60 Mins delivery")} · <strong>{selectedCity || "Select City"}</strong>
                </span>
                <ChevronDown size={13} className="text-gray-500" />
              </button>
            </div>

            <div className="mobile-header-actions">
              <button
                type="button"
                className="mobile-header-icon-btn"
                onClick={() => setWalletModalOpen(true)}
                aria-label="Wallet"
              >
                <Wallet size={20} />
                <span className="mobile-wallet-pill">₹0</span>
              </button>

              <button
                type="button"
                className="mobile-header-icon-btn mobile-cart-btn"
                onClick={() => setMobileCartOpen(true)}
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={21} />
                {cartCategoryCount > 0 && <span className="mobile-cart-badge">{cartCategoryCount}</span>}
              </button>
            </div>
          </div>

          {/* Row 2: Full-width search bar */}
          <div className="mobile-header-row-2">
            <div className="mobile-search-bar">
              <Search size={18} className="mobile-search-icon" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={content?.search_placeholder || "Search for Cement, TMT Bars, Tiles..."}
                aria-label="Search materials"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mobile-search-clear"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Row 3: Horizontally scrollable strip of trust badges */}
          <div className="mobile-header-row-3">
            <div className="mobile-trust-strip">
              {isFreeDeliveryActive && (
                <div className="mobile-trust-badge">
                  <Truck size={14} className="mobile-trust-icon text-[#0D9488]" />
                  <span>{content?.trust_badge_1 || "Free Delivery"}</span>
                </div>
              )}
              {content?.trust_badge_2 !== "" && (
                <div className="mobile-trust-badge">
                  <BadgePercent size={14} className="mobile-trust-icon text-[#E4572E]" />
                  <span>{content?.trust_badge_2 || "2% Cashback"}</span>
                </div>
              )}
              {content?.trust_badge_3 !== "" && (
                <div className="mobile-trust-badge">
                  <ShieldCheck size={14} className="mobile-trust-icon text-[#12283F]" />
                  <span>{content?.trust_badge_3 || "Pay on Delivery"}</span>
                </div>
              )}
              {content?.trust_badge_4 !== "" && (
                <div className="mobile-trust-badge">
                  <Zap size={14} className="mobile-trust-icon text-amber-500" />
                  <span>{content?.trust_badge_4 || "60 Mins Express"}</span>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* ─────────────────────────────────────────────────────────────
          LISTING VIEW STICKY HEADER (When inside a Category)
         ───────────────────────────────────────────────────────────── */}
      {mobileView === "listing" && (
        <header className="mobile-listing-header">
          {/* Row 0: Mobile Top Nav Bar (Logo | Sign In | Sign Up | Theme Toggle | Hamburger) */}
          <MobileTopNavBar
            user={user}
            isDark={isDark}
            onToggleTheme={handleToggleDarkMode}
            onOpenNavDrawer={() => setNavDrawerOpen(true)}
          />

          <div className="mobile-listing-header-inner">
            <button
              type="button"
              className="mobile-back-btn"
              onClick={navigateToHome}
              aria-label="Back to categories"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="mobile-listing-title-box">
              <h1 className="mobile-listing-title">{activeCategory?.name || "Materials"}</h1>
              <span className="mobile-listing-city">Delivering to {selectedCity || "Your Site"}</span>
            </div>

            <div className="mobile-listing-header-actions">
              <button
                type="button"
                className="mobile-listing-action-btn"
                onClick={() => {
                  setListingSearchOpen(!listingSearchOpen);
                  if (!listingSearchOpen) {
                    setTimeout(() => searchInputRef.current?.focus(), 100);
                  }
                }}
                aria-label="Search category"
              >
                <Search size={20} />
              </button>

              <button
                type="button"
                className="mobile-listing-action-btn mobile-cart-btn"
                onClick={() => setMobileCartOpen(true)}
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} />
                {cartCategoryCount > 0 && <span className="mobile-cart-badge">{cartCategoryCount}</span>}
              </button>
            </div>
          </div>

          {/* Expandable search inside listing */}
          {listingSearchOpen && (
            <div className="mobile-listing-search-expand">
              <div className="mobile-search-bar">
                <Search size={16} className="mobile-search-icon" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${activeCategory?.name}...`}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="mobile-search-clear">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. STICKY MOBILE HEADER (When on Orders or Account View)
         ───────────────────────────────────────────────────────────── */}
      {(mobileView === "orders" || mobileView === "account") && (
        <header className="mobile-listing-header">
          <MobileTopNavBar
            user={user}
            isDark={isDark}
            onToggleTheme={handleToggleDarkMode}
            onOpenNavDrawer={() => setNavDrawerOpen(true)}
          />

          <div className="mobile-listing-header-inner">
            <button
              type="button"
              className="mobile-back-btn"
              onClick={navigateToHome}
              aria-label="Back to home"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="mobile-listing-title-box">
              <h1 className="mobile-listing-title">
                {mobileView === "orders" ? "Material Orders" : "My Account"}
              </h1>
              <span className="mobile-listing-city">
                {mobileView === "orders"
                  ? "Track status & delivery"
                  : user?.name
                    ? `Logged in as ${user.name}`
                    : "MT-Boss Customer Profile"}
              </span>
            </div>

            <div className="mobile-listing-header-actions">
              <button
                type="button"
                className="mobile-listing-action-btn mobile-cart-btn"
                onClick={() => setMobileCartOpen(true)}
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} />
                {cartCategoryCount > 0 && <span className="mobile-cart-badge">{cartCategoryCount}</span>}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MAIN SCROLLABLE CONTENT AREA
         ───────────────────────────────────────────────────────────── */}
      <main className="mobile-main-content">
        {/* VIEW 1: HOME / DISCOVERY */}
        {mobileView === "home" && (
          <div className="mobile-discovery-wrap">
            {/* Search Results Override if user is searching from header */}
            {searchQuery.trim() ? (
              <section className="mobile-search-results-section">
                <div className="mobile-section-title-row">
                  <h2 className="mobile-section-heading">Results for “{searchQuery}”</h2>
                  <span className="text-xs text-gray-500">{searchResults.length} found</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="mobile-empty-feed">
                    <p>No materials matching “{searchQuery}”.</p>
                    <button
                      type="button"
                      className="mobile-clear-search-btn"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="mobile-product-feed">
                    {searchResults.map((product) => {
                      const cartItem = cart.find((item) => item.product.id === product.id);
                      const quantity = cartItem?.quantity || 0;
                      return (
                        <MobileProductCard
                          key={product.id}
                          product={product}
                          quantity={quantity}
                          onAdd={onAdd}
                          onChangeQty={onChangeQty}
                          onQuote={onQuote}
                          onBuy={onBuy}
                          onDetails={onDetails}
                          selectedCity={selectedCity}
                          categories={categories}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            ) : (
              <>
                {/* 2. Promo Banner */}
                {content?.mobile_banner_enabled !== false && (
                  <section className="mobile-promo-banner" aria-label="Special Bulk Order Offer">
                    <div className="mobile-promo-top-row">
                      {(content?.mobile_banner_pill !== "") && (
                        <span className="mobile-promo-pill">
                          {content?.mobile_banner_pill || "⚡ Delivered in 60 mins"}
                        </span>
                      )}
                      {(content?.mobile_banner_subpill !== "") && (
                        <span className="mobile-promo-subpill">
                          {content?.mobile_banner_subpill || "Direct Factory Rates"}
                        </span>
                      )}
                    </div>
                    <h2 className="mobile-promo-title">
                      {content?.mobile_banner_title || "Save up to 25% on Bulk Construction Materials"}
                    </h2>
                    <p className="mobile-promo-desc">
                      {content?.mobile_banner_desc || "Verified suppliers for Cement, TMT Bars, Brick & Sand with immediate site dispatch."}
                    </p>
                    <div className="mobile-promo-btn-row">
                      <button
                        type="button"
                        className="mobile-promo-cta"
                        onClick={() => onQuote(catalog[0] || null)}
                      >
                        {content?.mobile_banner_btn || "Request Bulk Quote"} <ArrowRight size={14} />
                      </button>
                    </div>
                  </section>
                )}

                {/* 3. Category Grid (Initial 6 categories with View All option) */}
                <section className="mobile-categories-section">
                  <div className="mobile-section-title-row">
                    <div>
                      <span className="mobile-section-kicker">EXPLORE MATERIALS</span>
                      <h2 className="mobile-section-heading">Shop by Category</h2>
                    </div>
                    {categories.length > 6 ? (
                      <button
                        type="button"
                        className="mobile-category-header-view-all"
                        onClick={() => setShowAllCategories(!showAllCategories)}
                      >
                        {showAllCategories ? (
                          <>Show Less <ChevronUp size={14} /></>
                        ) : (
                          <>View All ({categories.length}) <ChevronRight size={14} /></>
                        )}
                      </button>
                    ) : (
                      <span className="mobile-section-tag">Direct Supply</span>
                    )}
                  </div>

                  {loading ? (
                    <div className="mobile-loading-grid">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="mobile-cat-skeleton" />
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="mobile-category-grid">
                        {displayedHomeCategories.map((cat) => {
                          const Icon = getCategoryIcon(cat.name);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              className="mobile-category-chip-btn"
                              onClick={() => navigateToCategory(cat)}
                              aria-label={`Browse ${cat.name}`}
                            >
                              <div className="mobile-category-circle">
                                {cat.image ? (
                                  <ShopImage
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    sizes="64px"
                                    className="mobile-category-circle-img"
                                    unoptimized
                                  />
                                ) : (
                                  <Icon size={26} className="text-[#12283F]" />
                                )}
                              </div>
                              <span className="mobile-category-label">{cat.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {categories.length > 6 && (
                        <div className="mobile-category-view-all-wrap">
                          <button
                            type="button"
                            className="mobile-category-view-all-btn"
                            onClick={() => setShowAllCategories(!showAllCategories)}
                          >
                            {showAllCategories ? (
                              <>
                                Show Less Categories <ChevronUp size={15} />
                              </>
                            ) : (
                              <>
                                View All Categories (+{categories.length - 6}) <ChevronDown size={15} />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </section>

                {/* Popular Quick-Order Materials */}
                <section className="mobile-quick-picks-section">
                  <div className="mobile-section-title-row">
                    <div>
                      <span className="mobile-section-kicker">POPULAR ON SITES</span>
                      <h2 className="mobile-section-heading">Trending Materials</h2>
                    </div>
                    <span className="text-xs text-[#E4572E] font-bold">Fastest Dispatch</span>
                  </div>

                  <div className="mobile-product-feed">
                    {catalog.slice(0, 5).map((product) => {
                      const cartItem = cart.find((item) => item.product.id === product.id);
                      const quantity = cartItem?.quantity || 0;
                      return (
                        <MobileProductCard
                          key={product.id}
                          product={product}
                          quantity={quantity}
                          onAdd={onAdd}
                          onChangeQty={onChangeQty}
                          onQuote={onQuote}
                          onBuy={onBuy}
                          onDetails={onDetails}
                          selectedCity={selectedCity}
                          isFreeDeliveryActive={isFreeDeliveryActive}
                          freeDeliveryMinOrder={freeDeliveryMinOrder}
                          categories={categories}
                        />
                      );
                    })}
                  </div>
                </section>

                {/* Quick Home Services (At Your Doorstep) */}
                <QuickServices className="pt-2 pb-8 px-3" />
              </>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            VIEW 2: CATEGORY / PRODUCT LISTING PAGE (TWO-PANE LAYOUT)
           ───────────────────────────────────────────────────────────── */}
        {mobileView === "listing" && (
          <div className="mobile-two-pane-container">
            {/* LEFT PANE: Narrow (≈78px) vertical scrollable sidebar showing all remaining categories */}
            <aside className="mobile-left-sidebar" aria-label="Categories">
              {categories.map((cat) => {
                const isActive = String(cat.id) === String(activeCategory?.id);
                const CatIcon = getCategoryIcon(cat.name);
                return (
                  <button
                    key={cat.id}
                    ref={isActive ? activeCatBtnRef : null}
                    type="button"
                    className={`mobile-subcat-btn ${isActive ? "is-active" : ""}`}
                    onClick={() => {
                      setActiveCategoryId(cat.id);
                      setActiveSubcategory("All");
                      setActiveFilterChip("All");
                      rightFeedRef.current?.scrollTo({ top: 0, behavior: "instant" });
                    }}
                    aria-label={cat.name}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <div className="mobile-subcat-icon-wrap">
                      {cat.image ? (
                        <ShopImage
                          src={cat.image}
                          alt={cat.name}
                          width={26}
                          height={26}
                          className="object-cover rounded-md"
                          unoptimized
                        />
                      ) : (
                        <CatIcon size={20} />
                      )}
                    </div>
                    <span className="mobile-subcat-text">{cat.name}</span>
                  </button>
                );
              })}
            </aside>

            {/* RIGHT PANE: Scrollable single-column product feed */}
            <section ref={rightFeedRef} className="mobile-right-product-feed" aria-label="Products">
              {/* Horizontal filter chip row on top */}
              {filterChips.length > 1 && (
                <div className="mobile-filter-chips-row">
                  {filterChips.map((chip) => {
                    const isSelected = activeFilterChip === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        className={`mobile-chip ${isSelected ? "is-selected" : ""}`}
                        style={
                          isSelected
                            ? {
                              backgroundColor: isDark ? "#38bdf8" : "#12283f",
                              color: isDark ? "#0f172a" : "#ffffff",
                              borderColor: isDark ? "#38bdf8" : "#12283f",
                            }
                            : undefined
                        }
                        onClick={() => setActiveFilterChip(chip)}
                        aria-pressed={isSelected}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Product cards list */}
              {categoryProducts.length === 0 ? (
                <div className="mobile-empty-category">
                  <Package size={40} className="text-gray-300 mx-auto mb-2" />
                  <p className="font-bold text-sm text-[#12283F]">
                    No materials listed under this category.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Request an immediate custom quote from our verified supplier network.
                  </p>
                  <button
                    type="button"
                    className="mobile-inquiry-btn"
                    onClick={() => onQuote({ name: `${activeCategory?.name}${activeFilterChip && activeFilterChip !== 'All' ? ` - ${activeFilterChip}` : ''}`, category: activeCategory })}
                  >
                    Get Instant Quote for {activeFilterChip && activeFilterChip !== "All" ? activeFilterChip : activeCategory?.name}
                  </button>
                </div>
              ) : (
                <div className="mobile-feed-cards">
                  {categoryProducts.map((product) => {
                    const cartItem = cart.find((item) => item.product.id === product.id);
                    const quantity = cartItem?.quantity || 0;
                    return (
                      <MobileProductCard
                        key={product.id}
                        product={product}
                        quantity={quantity}
                        onAdd={onAdd}
                        onChangeQty={onChangeQty}
                        onQuote={onQuote}
                        onBuy={onBuy}
                        onDetails={onDetails}
                        selectedCity={selectedCity}
                        isFreeDeliveryActive={isFreeDeliveryActive}
                        freeDeliveryMinOrder={freeDeliveryMinOrder}
                        categories={categories}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW 3: ORDERS VIEW */}
        {mobileView === "orders" && (
          <div className="mobile-orders-view p-3 sm:p-4 pb-28">
            <div className="mb-3.5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#12283F] dark:text-white">Material Orders</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Live order status, tracking & invoices</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (categories.length > 0) navigateToCategory(activeCategory || categories[0]);
                }}
                className="text-xs font-bold text-[#E4572E] hover:underline"
              >
                + Shop Materials
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-2 sm:p-4 shadow-sm">
              <MaterialOrdersPanel role="user" embedded={true} />
            </div>

            <div className="mt-4 p-3.5 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-100 dark:border-sky-900/40 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-[#12283F] dark:text-sky-200">Need order or dispatch help?</p>
                <p className="text-gray-500 dark:text-gray-400">MT-Boss Dispatch Desk is available 24x7</p>
              </div>
              <a
                href="tel:+919458410866"
                className="px-3.5 py-1.5 bg-[#12283F] text-white font-bold rounded-lg text-xs hover:bg-[#1b3a5c]"
              >
                Call Desk
              </a>
            </div>
          </div>
        )}

        {/* VIEW 4: ACCOUNT VIEW */}
        {mobileView === "account" && (
          <div className="mobile-account-view p-3.5 pb-28 space-y-3.5">
            {/* Profile Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
              {user ? (
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#12283F] to-[#204770] text-white font-black text-lg flex items-center justify-center shadow-md">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-[#12283F] dark:text-white truncate">
                        {user.name || 'MT-Boss Customer'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {user.role || 'Customer'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {user.email || user.phone || 'Verified Account'}
                    </p>
                    {user.phone && (
                      <p className="text-[11px] text-gray-400 mt-0.5">📞 +91 {user.phone}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 mx-auto flex items-center justify-center mb-2">
                    <User size={22} />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#12283F] dark:text-white">Welcome to MT-Boss</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                    Sign in to track orders, manage site deliveries and unlock exclusive wholesale cashback.
                  </p>
                  <div className="flex items-center justify-center gap-2.5 mt-3.5">
                    <Link
                      href="/login"
                      className="px-5 py-2 bg-[#12283F] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#1c3a5b]"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="px-5 py-2 bg-gray-100 dark:bg-zinc-800 text-[#12283F] dark:text-white text-xs font-bold rounded-xl border border-gray-200 dark:border-zinc-700"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Card */}
            <div className="bg-gradient-to-r from-[#12283F] to-[#1c3b5d] text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Wallet size={20} />
                </div>
                <div>
                  <span className="text-[11px] text-white/70 block uppercase tracking-wider font-semibold">MT-Boss Wallet</span>
                  <strong className="text-base font-black">₹0.00 <span className="text-xs font-normal text-white/80">Cashback</span></strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWalletModalOpen(true)}
                className="px-3 py-1.5 bg-amber-400 text-zinc-900 rounded-lg text-xs font-black shadow-sm active:scale-95"
              >
                Passbook
              </button>
            </div>

            {/* Account Navigation Grid */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-2 shadow-sm divide-y divide-gray-100 dark:divide-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setMobileView("orders");
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#E4572E] flex items-center justify-center">
                    <ClipboardList size={17} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#12283F] dark:text-white block">My Material Orders</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">Track shipments & past purchases</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              <button
                type="button"
                onClick={() => setCitySheetOpen(true)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[var(--brand-blue)] flex items-center justify-center">
                    <MapPin size={17} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#12283F] dark:text-white block">Delivery City</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      Currently: {selectedCity || "Select City"}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#E4572E]">Change</span>
              </button>

              <button
                type="button"
                onClick={() => onQuote(activeCategory || null)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Zap size={17} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#12283F] dark:text-white block">Request Bulk Quote</span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">Best price for large site projects</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>



            {/* Logout or Full Dashboard */}
            {user && (
              <div className="pt-1 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (user.role === 'vendor') window.location.href = '/vendor/dashboard';
                    else if (user.role === 'admin') window.location.href = '/dashboard';
                    else if (user.role === 'supplier') window.location.href = '/supplier/dashboard';
                    else if (user.role === 'franchise') window.location.href = '/franchise/dashboard';
                    else window.location.href = '/userdashboard';
                  }}
                  className="w-full py-2.5 bg-[#12283F] text-white text-xs font-bold rounded-xl"
                >
                  Open Full Dashboard
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900"
                >
                  Sign Out of Account
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          5. FIXED BOTTOM NAVIGATION (MOBILE ONLY)
         ───────────────────────────────────────────────────────────── */}
      {/* Floating "Get Quote" Pill Button above Nav */}
      {(mobileView === "home" || mobileView === "listing") && (
        <button
          type="button"
          className="mobile-floating-quote-fab"
          onClick={() => onQuote(activeCategory || null)}
          aria-label="Get Instant Quote"
        >
          <Zap size={16} className="text-amber-300" />
          <span>Get Quote</span>
        </button>
      )}

      <nav className="mobile-bottom-navbar" aria-label="Mobile Navigation">
        <button
          type="button"
          className={`mobile-nav-item ${mobileView === "home" ? "is-active" : ""}`}
          onClick={navigateToHome}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${mobileView === "listing" ? "is-active" : ""}`}
          onClick={() => {
            if (categories.length > 0) {
              navigateToCategory(activeCategory || categories[0]);
            } else {
              setMobileView("listing");
            }
          }}
        >
          <Grid3X3 size={20} />
          <span>Category</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${mobileView === "orders" ? "is-active" : ""}`}
          onClick={() => {
            setMobileView("orders");
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        >
          <ClipboardList size={20} />
          <span>Order</span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${mobileView === "account" ? "is-active" : ""}`}
          onClick={() => {
            setMobileView("account");
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        >
          <User size={20} />
          <span>Account</span>
        </button>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          CITY SELECTOR BOTTOM SHEET
         ───────────────────────────────────────────────────────────── */}
      {citySheetOpen && (
        <div className="mobile-sheet-backdrop" onClick={() => setCitySheetOpen(false)}>
          <div className="mobile-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-head">
              <div>
                <h3 className="text-base font-extrabold text-[#12283F]">Select Delivery City</h3>
                <p className="text-xs text-gray-500">Live prices and delivery depend on your site location</p>
              </div>
              <button
                type="button"
                className="mobile-sheet-close"
                onClick={() => setCitySheetOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-city-list">
              {[...new Set(cities)].map((city) => {
                const isSelected = selectedCity?.toLowerCase() === city.toLowerCase();
                return (
                  <button
                    key={city}
                    type="button"
                    className={`mobile-city-row ${isSelected ? "is-selected" : ""}`}
                    onClick={() => {
                      setSelectedCity(city);
                      setCitySheetOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className={isSelected ? "text-[#E4572E]" : "text-gray-400"} />
                      <span className="font-bold text-sm text-[#12283F]">{city}</span>
                    </div>
                    {isSelected && <CheckCircle2 size={18} className="text-[#0D9488]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          WALLET MODAL
         ───────────────────────────────────────────────────────────── */}
      {walletModalOpen && (
        <div className="mobile-sheet-backdrop" onClick={() => setWalletModalOpen(false)}>
          <div className="mobile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="text-center p-4">
              <div className="w-14 h-14 rounded-full bg-[#12283F] text-white flex items-center justify-center mx-auto mb-3">
                <Wallet size={28} />
              </div>
              <h3 className="text-lg font-black text-[#12283F]">MTBoss Cashback Wallet</h3>
              <p className="text-3xl font-extrabold text-[#E4572E] my-2">₹0.00</p>
              <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-3 text-left mt-3 text-xs text-gray-600 space-y-1.5">
                <p className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#0D9488] flex-shrink-0" />
                  <span><strong>2% Instant Cashback</strong> on every bulk material order</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#0D9488] flex-shrink-0" />
                  <span>Auto-applied as credit on your subsequent orders</span>
                </p>
              </div>
              <button
                type="button"
                className="w-full mt-4 py-2.5 bg-[#12283F] text-white text-xs font-bold rounded-xl"
                onClick={() => setWalletModalOpen(false)}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MOBILE CART BOTTOM DRAWER
         ───────────────────────────────────────────────────────────── */}
      {mobileCartOpen && (
        <div className="mobile-sheet-backdrop" onClick={() => setMobileCartOpen(false)}>
          <div className="mobile-cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-cart-drawer-head">
              <div>
                <h3 className="font-extrabold text-base text-[#12283F]">
                  My Cart ({cartCategoryCount} {cartCategoryCount === 1 ? "category" : "categories"})
                </h3>
                <span className="text-xs text-gray-500">Delivering to {selectedCity || "Site"}</span>
              </div>
              <button
                type="button"
                className="mobile-sheet-close"
                onClick={() => setMobileCartOpen(false)}
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart size={44} className="mx-auto text-gray-300 mb-2" />
                <p className="font-bold text-sm text-[#12283F]">Your cart is empty</p>
                <p className="text-xs text-gray-500 mt-1">
                  Add construction materials to request direct quotes or place bulk orders.
                </p>
                <button
                  type="button"
                  className="mt-4 px-5 py-2.5 bg-[#12283F] text-white text-xs font-bold rounded-xl"
                  onClick={() => setMobileCartOpen(false)}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {isFreeDeliveryActive && (
                  <div className="mobile-cart-free-delivery-tag">
                    <Truck size={14} className="text-[#0D9488]" />
                    <span>
                      {cartSubtotal >= freeDeliveryMinOrder
                        ? "🎉 You have qualified for FREE Site Delivery!"
                        : `Add ₹${Math.max(0, freeDeliveryMinOrder - cartSubtotal).toLocaleString("en-IN")} more for FREE Delivery`}
                    </span>
                  </div>
                )}

                <div className="mobile-cart-item-list">
                  {cart.map((item, index) => {
                    const price = Number(item.product.price) || 0;
                    const itemKey = item.product?.id ? `${item.product.id}` : `mobile-cart-item-${index}`;
                    return (
                      <div key={itemKey} className="mobile-cart-item">
                        <div className="mobile-cart-item-img">
                          {getProductImage(item.product, item.product.category || categories) ? (
                            <ShopImage
                              src={getProductImage(item.product, item.product.category || categories)}
                              alt={item.product.name}
                              fill
                              sizes="50px"
                              className="object-cover rounded-lg"
                              unoptimized
                            />
                          ) : (
                            <Package size={22} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-[#12283F] truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-gray-500 block">
                            {price > 0
                              ? `₹${price.toLocaleString("en-IN")} / ${displayUnit(item.product.unit)}`
                              : "Quote upon confirmation"}
                          </span>
                          <span className="font-extrabold text-xs text-[#12283F]">
                            {price > 0
                              ? `₹${(price * item.quantity).toLocaleString("en-IN")}`
                              : "Price on request"}
                          </span>
                        </div>
                        <div className="mobile-cart-stepper">
                          <button
                            type="button"
                            onClick={() => onChangeQty(item.product.id, -1)}
                            aria-label="Decrease"
                          >
                            <Minus size={13} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onChangeQty(item.product.id, 1)}
                            aria-label="Increase"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── COUPON BOX & AVAILABLE OFFERS (Full feature parity with desktop) ── */}
                <div className="mobile-cart-coupon-wrap pt-2.5 pb-1 border-t border-gray-100 dark:border-zinc-800">
                  <div className="store-coupon-box">
                    {activeCoupon?.code ? (
                      <div className="store-coupon-applied">
                        <span>
                          Coupon <b>{activeCoupon.code}</b>
                          {couponCalculation?.eligible
                            ? ` applied: -₹${Number(couponCalculation.discount).toLocaleString('en-IN')}`
                            : ' selected'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClearCoupon();
                            setCouponCode('');
                            setCouponNotice('');
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          const result = onApplyCoupon(couponCode);
                          setCouponNotice(result?.error || `Coupon ${result?.coupon?.code || couponCode} applied.`);
                        }}
                      >
                        <label htmlFor="mobile-store-coupon-code">Have a coupon?</label>
                        <div>
                          <input
                            id="mobile-store-coupon-code"
                            value={couponCode}
                            onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            autoCapitalize="characters"
                          />
                          <button type="submit" disabled={!couponCode.trim()}>
                            Apply
                          </button>
                        </div>
                      </form>
                    )}
                    {couponNotice && (
                      <p className={couponNotice.startsWith('Coupon') ? 'is-success' : ''}>
                        {couponNotice}
                      </p>
                    )}
                    {activeCoupon && !couponCalculation?.eligible && (
                      <p>
                        Add ₹{couponCalculation?.gap ? Number(couponCalculation.gap).toLocaleString('en-IN') : 0} more of regular-price items to unlock this coupon. Offer-priced items do not count.
                      </p>
                    )}
                  </div>

                  {!activeCoupon?.code && (
                    <button
                      type="button"
                      className="store-view-offers"
                      onClick={() => setOffersOpen((open) => !open)}
                    >
                      {offersOpen
                        ? 'Hide available offers'
                        : `View available offers${couponOffers?.length ? ` (${couponOffers.length})` : ''}`}
                    </button>
                  )}

                  {offersOpen && !activeCoupon?.code && (
                    <div className="store-available-offers">
                      {couponOffers?.length ? (
                        couponOffers.map(({ coupon, calculation }) => (
                          <div
                            className={`store-available-offer${calculation?.eligible ? ' is-eligible' : ''}`}
                            key={coupon.id}
                          >
                            <div>
                              <strong>{coupon.code || 'Automatic offer'}</strong>
                              <span>
                                {coupon.discount_type === 'percentage'
                                  ? `${coupon.discount_value}% OFF${Number(coupon.max_discount_cap) > 0 ? ` up to ₹${coupon.max_discount_cap}` : ''}`
                                  : `₹${coupon.discount_value} OFF`}
                              </span>
                              <small>
                                On regular-price items of ₹{Number(coupon.min_cart_value || 0).toLocaleString('en-IN')} or more
                                {coupon.applicable_categories?.length
                                  ? ` · Valid on: ${coupon.applicable_categories.join(', ')}`
                                  : ' · Valid on all products'}
                              </small>
                              {!calculation?.eligible && calculation?.gap > 0 && (
                                <em>Add ₹{Number(calculation.gap).toLocaleString('en-IN')} more to unlock</em>
                              )}
                            </div>
                            {!coupon.code ? (
                              <b>{calculation?.eligible ? 'Automatically applied' : 'Auto offer'}</b>
                            ) : (
                              <button
                                type="button"
                                disabled={!calculation?.eligible}
                                onClick={() => {
                                  const result = onSelectCoupon(coupon);
                                  setCouponNotice(result?.error || `Coupon ${coupon.code} applied.`);
                                  setCouponCode(coupon.code);
                                  setOffersOpen(false);
                                }}
                              >
                                {calculation?.eligible ? 'Apply' : 'Locked'}
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500 py-1">No active offers right now.</p>
                      )}
                    </div>
                  )}

                  {couponCalculation?.offerAmount > 0 && (
                    <div className="store-cart-breakdown">
                      <span>Items with existing offers</span>
                      <strong>₹{Number(couponCalculation.offerAmount).toLocaleString('en-IN')}</strong>
                      <small>Offer already applied</small>
                    </div>
                  )}
                  {couponCalculation?.regularAmount > 0 && (
                    <div className="store-cart-breakdown">
                      <span>Other items</span>
                      <strong>₹{Number(couponCalculation.regularAmount).toLocaleString('en-IN')}</strong>
                    </div>
                  )}
                  {activeCoupon && couponCalculation?.eligible && (
                    <div className="store-cart-breakdown store-cart-coupon-discount">
                      <span>{activeCoupon.code ? `Coupon “${activeCoupon.code}” applied` : 'Automatic coupon applied'}</span>
                      <strong>-₹{Number(couponCalculation.discount).toLocaleString('en-IN')}</strong>
                    </div>
                  )}
                </div>

                <div className="mobile-cart-drawer-foot">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-500 font-medium">
                      {hasUnpricedItems ? 'Current Total' : 'Product Total'}
                    </span>
                    <span className={`font-black text-sm text-[#12283F] ${activeCoupon && couponCalculation?.eligible ? 'line-through text-gray-400' : ''}`}>
                      {cartSubtotal > 0 ? `₹${cartSubtotal.toLocaleString("en-IN")}` : "On Confirmation"}
                      {cartSubtotal > 0 && hasUnpricedItems ? ' + quote items' : ''}
                    </span>
                  </div>

                  {activeCoupon && couponCalculation?.eligible && (
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        Discounted Total
                      </span>
                      <span className="font-black text-base text-emerald-700 dark:text-emerald-400">
                        ₹{cartFinalTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <p className="text-[10.5px] text-gray-500 mb-3">
                    Delivery charges, if applicable, are confirmed separately.
                  </p>

                  <button
                    type="button"
                    className="mobile-cart-checkout-btn"
                    onClick={() => {
                      setMobileCartOpen(false);
                      onCheckout();
                    }}
                  >
                    Proceed to Checkout <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MOBILE NAVIGATION DRAWER (Matching website's standard menu)
         ───────────────────────────────────────────────────────────── */}
      {navDrawerOpen && (
        <div className="mobile-nav-drawer-portal">
          <div
            className="mobile-nav-drawer-backdrop"
            onClick={() => setNavDrawerOpen(false)}
          />
          <div className="mobile-nav-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Header: Logo | Sign In | Sign Up | Theme toggle | Close */}
            <div className="mobile-nav-drawer-head">
              <Link
                href="/"
                onClick={() => setNavDrawerOpen(false)}
                className="flex items-center flex-shrink-0"
              >
                <Image
                  src="/logo.png"
                  alt="MTboss"
                  width={100}
                  height={30}
                  className="h-7 w-auto object-contain"
                />
              </Link>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setNavDrawerOpen(false)}
                      className="mobile-btn-signin"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setNavDrawerOpen(false)}
                      className="mobile-btn-signup"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setNavDrawerOpen(false);
                      if (user.role === 'vendor') window.location.href = '/vendor/dashboard';
                      else if (user.role === 'admin') window.location.href = '/dashboard';
                      else if (user.role === 'supplier') window.location.href = '/supplier/dashboard';
                      else if (user.role === 'franchise') window.location.href = '/franchise/dashboard';
                      else window.location.href = '/userdashboard';
                    }}
                    className="mobile-btn-signin"
                  >
                    Dashboard
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleToggleDarkMode}
                  className="mobile-theme-toggle-btn"
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? <span className="text-sm">☀️</span> : <span className="text-sm">🌙</span>}
                </button>

                <button
                  type="button"
                  className="mobile-nav-drawer-close"
                  onClick={() => setNavDrawerOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Global Search box */}
            <div className="px-3 pt-3 pb-2">
              <GlobalSearch user={user} isDarkMode={isDark} onNavigate={() => setNavDrawerOpen(false)} />
            </div>

            {/* Drawer Links - Standard site navigation */}
            <div className="mobile-nav-drawer-links">
              <Link
                href="/"
                onClick={() => setNavDrawerOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                Home
              </Link>

              <Link
                href="/quick"
                onClick={() => setNavDrawerOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                Services
              </Link>

              <Link
                href="/Services/professionals"
                onClick={() => setNavDrawerOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                Professionals
              </Link>

              {/* Collapsible Property */}
              <div>
                <button
                  type="button"
                  onClick={() => setPropertyOpen(!propertyOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${propertyOpen
                    ? 'bg-[#0284c7] text-white shadow-sm'
                    : isDark
                      ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                      : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                    }`}
                >
                  <span>Property</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${propertyOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {propertyOpen && (
                  <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-sky-400/40 pl-2">
                    {[
                      { label: "🏠 Buy Property", href: "/property/buy" },
                      { label: "💰 Sell Property", href: "/property/sell" },
                      { label: "🔑 Rent Property", href: "/property/rent" },
                    ].map((s) => (
                      <Link
                        key={s.label}
                        href={s.href}
                        onClick={() => setNavDrawerOpen(false)}
                        className={`block px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${isDark
                          ? 'text-zinc-400 hover:text-sky-400 hover:bg-zinc-800'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-gray-50'
                          }`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/Services/all"
                onClick={() => setNavDrawerOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                Construction
              </Link>

              <Link
                href="/calculator"
                onClick={() => setNavDrawerOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                Budget Calculator
              </Link>

              <button
                type="button"
                onClick={() => {
                  setNavDrawerOpen(false);
                  navigateToHome();
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors text-left ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                <ShoppingCart size={15} className="text-zinc-600 dark:text-zinc-400 flex-shrink-0" />
                <span>Shop Now</span>
              </button>

              <Link
                href="/careers"
                onClick={() => setNavDrawerOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                Careers
              </Link>

              <Link
                href="/contact"
                onClick={() => setNavDrawerOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                Contact
              </Link>

              <Link
                href="/agent"
                onClick={() => setNavDrawerOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                Become an Agent
              </Link>

              <Link
                href="/agent/login"
                onClick={() => setNavDrawerOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                Agent Login
              </Link>

              <Link
                href="/franchise"
                onClick={() => setNavDrawerOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isDark
                  ? 'text-zinc-300 hover:text-sky-400 hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-900 hover:bg-gray-50'
                  }`}
              >
                Franchise
              </Link>
            </div>

            {/* Bottom Auth Buttons (matching image) */}
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 space-y-2 mt-auto">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setNavDrawerOpen(false)}
                    className="block w-full py-2.5 text-center text-sm font-bold text-[#0284c7] border-2 border-[#0284c7] rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setNavDrawerOpen(false)}
                    className="block w-full py-2.5 text-center text-sm font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] rounded-lg shadow-sm transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="space-y-2">
                  <div className={`px-3 py-1.5 text-xs text-center font-bold uppercase tracking-wider rounded bg-sky-50 dark:bg-zinc-800 text-sky-800 dark:text-sky-300`}>
                    Logged in as {user.role?.toUpperCase() || 'USER'}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNavDrawerOpen(false);
                      if (user.role === 'vendor') window.location.href = '/vendor/dashboard';
                      else if (user.role === 'admin') window.location.href = '/dashboard';
                      else if (user.role === 'supplier') window.location.href = '/supplier/dashboard';
                      else if (user.role === 'franchise') window.location.href = '/franchise/dashboard';
                      else window.location.href = '/userdashboard';
                    }}
                    className="block w-full py-2.5 text-center text-sm font-bold text-[#0284c7] border border-[#0284c7] rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full py-2.5 text-center text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MOBILE PRODUCT CARD (SINGLE-COLUMN FEED ITEM)
// ─────────────────────────────────────────────────────────────
function MobileProductCard({
  product,
  quantity = 0,
  onAdd,
  onChangeQty,
  onQuote,
  onBuy,
  onDetails,
  selectedCity,
  isFreeDeliveryActive = false,
  freeDeliveryMinOrder = 50000,
  categories = [],
}) {
  const price = Number(product.price) || 0;
  const hasFixedPrice = price > 0;
  const mrp = Number(product.compare_at_price) || (price > 0 ? Math.round(price * 1.08) : 0);
  const discount = getProductDiscount(product);
  const bulkPrice = getLowestBulkPrice(product);
  const productImage = getProductImage(product, product.category || categories);

  const canOrder = !product.fromSupplier || Number(product.quantity) > 0;
  const isAvailable = canOrder;

  return (
    <article className="mobile-product-card">
      {/* Discount badge top-left */}
      {discount > 0 && (
        <span className="mobile-discount-badge">{discount}% OFF</span>
      )}

      <div className="mobile-card-inner">
        {/* Left: Product image */}
        <button
          type="button"
          className="mobile-card-img-btn"
          onClick={() => onDetails?.(product)}
          aria-label={`View ${product.name} details`}
        >
          {productImage ? (
            <ShopImage
              src={productImage}
              alt={product.name}
              fill
              sizes="84px"
              className="object-cover rounded-xl"
              unoptimized
            />
          ) : (
            <div className="mobile-card-img-placeholder">
              <Package size={34} className="text-[#12283F]/60" />
            </div>
          )}
        </button>

        {/* Right: Product details */}
        <div className="mobile-card-details">
          {/* Free delivery tag */}
          {isFreeDeliveryActive && (
            <div className="mobile-free-delivery-tag">
              <Truck size={12} className="text-[#0D9488] flex-shrink-0" />
              <span>
                {freeDeliveryMinOrder > 0
                  ? `Free Delivery on orders above ₹${freeDeliveryMinOrder.toLocaleString("en-IN")}`
                  : "Free Delivery on all orders"}
              </span>
            </div>
          )}

          {/* Product Name */}
          <button
            type="button"
            className="mobile-card-title-btn"
            onClick={() => onDetails?.(product)}
          >
            <h3 className="mobile-card-title">{product.name}</h3>
          </button>

          {/* Price & MRP */}
          <div className="mobile-card-price-row">
            <strong className="mobile-card-price">
              {hasFixedPrice ? `₹${price.toLocaleString("en-IN")}` : "Price on request"}
              {hasFixedPrice && (
                <span className="mobile-card-unit"> / {displayUnit(product.unit)}</span>
              )}
            </strong>
            {mrp > price && hasFixedPrice && (
              <del className="mobile-card-mrp">₹{mrp.toLocaleString("en-IN")}</del>
            )}
          </div>

          {/* Bulk Prices link */}
          <button
            type="button"
            className="mobile-bulk-link"
            onClick={() => onQuote(product)}
          >
            {bulkPrice
              ? `Bulk Prices at ₹${bulkPrice.toLocaleString("en-IN")} →`
              : "Bulk Prices on request →"}
          </button>

          {/* Action Row: Stepper or Add button + Quote CTA */}
          <div className="mobile-card-actions">
            {quantity > 0 ? (
              <div className="mobile-stepper" aria-label={`${product.name} quantity in cart`}>
                <button
                  type="button"
                  onClick={() => onChangeQty(product.id, -1)}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="mobile-stepper-count">{quantity}</span>
                <button
                  type="button"
                  onClick={() => onChangeQty(product.id, 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mobile-add-btn"
                disabled={!isAvailable}
                onClick={() => onAdd(product)}
              >
                <Plus size={14} /> ADD
              </button>
            )}

            <button
              type="button"
              className="mobile-quote-pill-btn"
              onClick={() => onQuote(product)}
            >
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
