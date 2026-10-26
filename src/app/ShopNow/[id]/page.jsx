"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Flame,
  MapPin,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Truck,
  Wallet,
  Zap,
} from "lucide-react";
import { useCities } from "@/hooks/useCities";
import { displayUnit, getProductImage, ShopImage } from "../Storefront";
import ProductGalleryCarousel, { getProductImages } from "../ProductGalleryCarousel";
import { getCartStep } from "@/lib/cart-step";
import { triggerFlyToCart } from "../flyToCart";
import "../shop.css";

// ── Dark mode hook ────────────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains("dark-mode"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  // Next.js App Router unwrap params
  const resolvedParams = use(params);
  const rawId = resolvedParams?.id || "";
  const productId = String(rawId).replace(/^supplier-/, "");

  const isDarkMode = useDarkMode();
  const { cities: supportedCities } = useCities();

  // ── Product and Page State ──────────────────────────────────────────────────
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs"); // "specs" | "description" | "delivery"
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // ── Header / Store State ────────────────────────────────────────────────────
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [cityCheckLoading, setCityCheckLoading] = useState(false);
  const [cityAvailableStatus, setCityAvailableStatus] = useState(null); // true | false | null
  const [walletBalance, setWalletBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");



  // Sync cart from localStorage
  const loadCartFromStorage = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("MTBOSS-shop-cart") || "[]");
      if (Array.isArray(saved)) {
        setCart(saved);
        const count = saved.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        setCartCount(count);
      }
    } catch {}
  };

  useEffect(() => {
    loadCartFromStorage();
    const handleStorage = () => loadCartFromStorage();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Fetch wallet balance if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/wallet", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.success && d?.data) setWalletBalance(Number(d.data.balance) || 0);
        })
        .catch(() => {});
    }
  }, []);

  // Fetch product details
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setLoadError("");

    fetch(`/api/shop-material-options?id=${productId}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success || !json.data?.product) {
          throw new Error(json.error || "Material not found");
        }
        return json.data.product;
      })
      .then((prod) => {
        if (!prod) return;
        setProduct(prod);
        setSelectedQuantity(getCartStep(prod) || 1);

        // Fetch related products from same category
        if (prod.category) {
          fetch(`/api/shop-material-options?category=${encodeURIComponent(prod.category)}`)
            .then((r) => r.json())
            .then((d) => {
              if (d?.success && Array.isArray(d.data?.products)) {
                const others = d.data.products.filter((p) => String(p.id) !== String(prod.id));
                setRelatedProducts(others.slice(0, 6));
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        setLoadError(err.message || "Could not load product details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  // Derived product pricing and discount
  const basePrice = Number(product?.price) || 0;
  const compareAtPrice = Number(product?.compare_at_price) || 0;
  const discountPercent =
    compareAtPrice > basePrice && basePrice > 0
      ? Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)
      : 0;

  // Bulk tier pricing resolution for the selected quantity
  const unitPrice = useMemo(() => {
    if (!product || basePrice <= 0) return 0;
    const tiers = Array.isArray(product.bulk_pricing) ? product.bulk_pricing : [];
    const matched = tiers
      .filter((tier) => selectedQuantity >= Number(tier.min_quantity))
      .sort((a, b) => Number(b.min_quantity) - Number(a.min_quantity))[0];
    return matched ? Number(matched.price) : basePrice;
  }, [product, basePrice, selectedQuantity]);

  const lineTotal = unitPrice * selectedQuantity;
  const savings = compareAtPrice > unitPrice ? (compareAtPrice - unitPrice) * selectedQuantity : 0;
  const isAvailable = !product?.fromSupplier || Number(product?.quantity) > 0;

  // City availability check
  const handleCheckCity = async (cityToVerify) => {
    const city = cityToVerify || selectedCity;
    if (!city) return;
    setCityCheckLoading(true);
    try {
      const res = await fetch(
        `/api/pincode-check?city=${encodeURIComponent(city)}&type=category&name=${encodeURIComponent(
          product?.category || ""
        )}`
      );
      const data = await res.json();
      setCityAvailableStatus(Boolean(data?.available));
    } catch {
      setCityAvailableStatus(null);
    } finally {
      setCityCheckLoading(false);
    }
  };

  // Add to cart handler
  const handleAddToCart = (e) => {
    if (!product || !isAvailable) return;
    if (e) {
      triggerFlyToCart(e, product);
    }
    try {
      const raw = localStorage.getItem("MTBOSS-shop-cart") || "[]";
      const currentCart = JSON.parse(raw);
      const step = getCartStep(product);
      const limit = product.fromSupplier ? Math.max(0, Number(product.quantity) || 0) : 10000;

      const existingIndex = currentCart.findIndex(
        (item) => String(item.product?.product_id || item.product?.id) === String(product.id)
      );

      let updatedCart = [...currentCart];
      if (existingIndex > -1) {
        const curQty = updatedCart[existingIndex].quantity || step;
        updatedCart[existingIndex].quantity = Math.min(curQty + selectedQuantity, limit || 10000);
      } else {
        updatedCart.push({
          product: {
            ...product,
            product_id: product.id,
            fromSupplier: true,
          },
          quantity: Math.min(selectedQuantity, limit || 10000),
        });
      }

      localStorage.setItem("MTBOSS-shop-cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storage"));
      loadCartFromStorage();

      setToastMessage(`✓ Added ${selectedQuantity} ${displayUnit(product.unit)} to your cart!`);
      setTimeout(() => setToastMessage(""), 3500);
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  // Copy share link
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // ── Buy Now Navigation ─────────────────────────────────────────────────────
  const handleBuyNow = () => {
    if (!product || !isAvailable) return;
    router.push(`/ShopNow/${productId}/checkout?qty=${selectedQuantity}&from=detail`);
  };

  // UI styling tokens
  const pageBg = isDarkMode ? "bg-zinc-950 text-white" : "bg-[#f8fafc] text-slate-900";
  const cardBg = isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200/80 shadow-sm";
  const borderCol = isDarkMode ? "border-zinc-800" : "border-slate-200";
  const textMuted = isDarkMode ? "text-zinc-400" : "text-slate-500";
  const inpCls = isDarkMode
    ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--brand-blue)]"
    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[var(--brand-blue)]";

  // Loading view
  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${pageBg}`}>
        <div className="w-12 h-12 border-4 border-[var(--brand-blue)] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-base font-bold">Loading product details...</h2>
        <p className={`text-xs mt-1 ${textMuted}`}>Fetching verified supplier specifications and prices</p>
      </div>
    );
  }

  // Error view
  if (loadError || !product) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${pageBg}`}>
        <ShieldAlert size={48} className="text-rose-500 mb-3" />
        <h2 className="text-xl font-black">Material Not Found</h2>
        <p className={`text-sm mt-1 max-w-md ${textMuted}`}>
          {loadError || "The material you requested could not be found or may have been removed."}
        </p>
        <Link
          href="/ShopNow"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--brand-blue)] text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-sky-400 transition-all shadow-md"
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  const galleryImages = getProductImages(product, { image: product.image_url });

  return (
    <div className={`shop-product-detail-page min-h-screen ${pageBg} transition-colors duration-200`}>
      {/* ── TOP HEADER ────────────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${isDarkMode ? "bg-zinc-950/90 border-zinc-800" : "bg-white/95 border-slate-200 shadow-xs"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand & Back Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/ShopNow"
              className={`p-2 rounded-xl border transition-all ${
                isDarkMode ? "border-zinc-800 hover:bg-zinc-800 text-zinc-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"
              }`}
              title="Back to Shop Catalog"
            >
              <ArrowLeft size={18} />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="MT-Boss" width={110} height={32} className="h-7 w-auto object-contain" priority />
              <span className="hidden sm:inline-block text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded bg-[var(--brand-blue)] text-slate-950 uppercase">
                SHOP
              </span>
            </Link>
          </div>

          {/* Deliver to City selector */}
          <div className="hidden md:flex items-center relative">
            <button
              type="button"
              onClick={() => setCityOpen(!cityOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isDarkMode ? "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700" : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300"
              }`}
            >
              <MapPin size={15} className="text-[var(--brand-blue)]" />
              <span>Deliver to: <strong>{selectedCity || "Select City"}</strong></span>
              <ChevronDown size={14} className={textMuted} />
            </button>
            {cityOpen && (
              <div className={`absolute top-full left-0 mt-2 w-64 rounded-xl border p-3 shadow-xl z-50 ${isDarkMode ? "bg-zinc-900 border-zinc-700" : "bg-white border-slate-200"}`}>
                <p className="text-[10px] font-black uppercase tracking-wider mb-2 text-[var(--brand-blue)]">Select Delivery City</p>
                <div className="max-h-56 overflow-y-auto space-y-1">
                  {supportedCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setSelectedCity(city);
                        setCityOpen(false);
                        handleCheckCity(city);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedCity === city
                          ? "bg-[var(--brand-blue)] text-slate-950 font-bold"
                          : isDarkMode
                          ? "hover:bg-zinc-800 text-zinc-300"
                          : "hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions: Wallet & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/wallet"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isDarkMode ? "border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700" : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300"
              }`}
              title="My Cashback Wallet"
            >
              <Wallet size={16} className="text-[var(--brand-blue)]" />
              <span className="hidden sm:inline">Wallet</span>
              <span className="px-1.5 py-0.5 rounded text-[11px] font-black bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                ₹{walletBalance.toLocaleString("en-IN")}
              </span>
            </Link>

            <Link
              href="/ShopNow/cart"
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-black transition-all ${
                isDarkMode ? "border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              }`}
            >
              <ShoppingCart size={17} className="text-[var(--brand-blue)]" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-blue)] text-slate-950 text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMBS STRIP ─────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[var(--brand-blue)] transition-colors">Home</Link>
        <ChevronRight size={13} />
        <Link href="/ShopNow" className="hover:text-[var(--brand-blue)] transition-colors">Shop Materials</Link>
        {product?.category && (
          <>
            <ChevronRight size={13} />
            <Link href={`/ShopNow?category=${encodeURIComponent(product.category)}`} className="hover:text-[var(--brand-blue)] transition-colors font-medium">
              {product.category}
            </Link>
          </>
        )}
        <ChevronRight size={13} />
        <span className={`font-bold truncate max-w-[200px] sm:max-w-md ${isDarkMode ? "text-white" : "text-slate-800"}`}>
          {product?.name || ""}
        </span>
      </nav>

      {/* ── TOAST NOTIFICATION ────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
            <Link href="/ShopNow/cart" className="underline font-black text-emerald-100 hover:text-white ml-2">
              View Cart →
            </Link>
          </div>
        </div>
      )}

      {/* ── MAIN PRODUCT SECTION (2-COLUMN GRID) ──────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-36 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: PRODUCT IMAGE GALLERY
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className={`p-4 sm:p-6 rounded-3xl border relative ${cardBg}`}>
              {/* Badges on top of image */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                {discountPercent > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md">
                    <Flame size={13} /> {discountPercent}% OFF
                  </span>
                )}
                {product.is_featured_deal && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-md">
                    ★ Featured Deal
                  </span>
                )}
              </div>

              {/* Share & Wishlist button top-right */}
              <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className={`p-2.5 rounded-full border backdrop-blur-md transition-all ${
                    isDarkMode ? "bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800 text-zinc-300" : "bg-white/90 border-slate-200 hover:bg-white text-slate-700 shadow-sm"
                  }`}
                  title="Share product link"
                  aria-label="Share product"
                >
                  {copiedLink ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
                </button>
              </div>

              {/* Gallery Component */}
              <div className="w-full aspect-square max-h-[480px] flex items-center justify-center overflow-hidden rounded-2xl">
                <ProductGalleryCarousel
                  product={product}
                  category={{
                    image: product?.category_image || product?.image_url || (Array.isArray(product?.images) && product.images[0]),
                    name: product?.category || "",
                  }}
                />
              </div>

              {/* Quality & Return Guarantee strip */}
              <div className={`mt-5 pt-4 border-t flex items-center justify-around text-center ${borderCol}`}>
                <div className="flex flex-col items-center">
                  <ShieldCheck size={22} className="text-emerald-500 mb-1" />
                  <span className="text-[11px] font-extrabold">100% Genuine</span>
                  <span className={`text-[9px] ${textMuted}`}>Direct Supplier</span>
                </div>
                <div className={`h-8 w-px ${borderCol}`} />
                <div className="flex flex-col items-center">
                  <Truck size={22} className="text-[var(--brand-blue)] mb-1" />
                  <span className="text-[11px] font-extrabold">Site Delivery</span>
                  <span className={`text-[9px] ${textMuted}`}>Fast Dispatch</span>
                </div>
                <div className={`h-8 w-px ${borderCol}`} />
                <div className="flex flex-col items-center">
                  <BadgePercent size={22} className="text-amber-500 mb-1" />
                  <span className="text-[11px] font-extrabold">2% Cashback</span>
                  <span className={`text-[9px] ${textMuted}`}>In MT-Boss Wallet</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: PRODUCT DETAILS & PURCHASE ACTIONS
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border ${cardBg}`}>
              {/* Category, Brand, and Stock Tag */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.brand && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {product.brand}
                  </span>
                )}
                {product.category && (
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${isDarkMode ? "bg-zinc-800 text-zinc-300" : "bg-slate-100 text-slate-700"}`}>
                    {product.category}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                    isAvailable ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                  {isAvailable ? "Available in Stock" : "Temporarily Unavailable"}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Subtitle / Unit info */}
              <p className={`mt-1 text-xs font-semibold ${textMuted}`}>
                {product.subcategory ? `${product.subcategory} · ` : ""}
                Standard unit: <strong>{displayUnit(product.unit)}</strong>
                {product.quantity > 0 && ` · ${product.quantity} in stock`}
              </p>

              {/* ── PRICING BLOCK ── */}
              <div className={`mt-5 p-4 rounded-2xl border ${isDarkMode ? "bg-zinc-800/50 border-zinc-700/80" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-baseline gap-3 flex-wrap">
                  {unitPrice > 0 ? (
                    <>
                      <div className="text-3xl font-black text-slate-900 dark:text-white">
                        ₹{unitPrice.toLocaleString("en-IN")}
                        <span className={`text-sm font-semibold ml-1.5 ${textMuted}`}>
                          / {displayUnit(product.unit)}
                        </span>
                      </div>
                      {compareAtPrice > unitPrice && (
                        <del className={`text-base font-bold ${textMuted}`}>
                          ₹{compareAtPrice.toLocaleString("en-IN")}
                        </del>
                      )}
                      {discountPercent > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          Save ₹{savings.toLocaleString("en-IN")} ({discountPercent}% OFF)
                        </span>
                      )}
                    </>
                  ) : (
                    <div>
                      <span className="text-2xl font-black text-amber-500">Price on Quote</span>
                      <p className={`text-xs mt-0.5 ${textMuted}`}>
                        {product.quote_price_range ? `Indicative range: ₹${product.quote_price_range}` : "Verified suppliers will provide best daily rates."}
                      </p>
                    </div>
                  )}
                </div>
                <p className={`text-[11px] mt-1.5 flex items-center gap-1.5 font-medium ${textMuted}`}>
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  Inclusive of all applicable GST &amp; Supplier Taxes · Official tax invoice provided
                </p>
              </div>

              {/* ── BULK PRICING TIER BOX ── */}
              {Array.isArray(product.bulk_pricing) && product.bulk_pricing.length > 0 && (
                <div className={`mt-5 p-4 rounded-2xl border ${isDarkMode ? "border-zinc-800 bg-zinc-800/30" : "border-blue-100 bg-blue-50/50"}`}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <Tag size={15} className="text-[var(--brand-blue)]" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Bulk Order Discounts Available
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <div className={`p-2.5 rounded-xl border text-center ${selectedQuantity < Number(product.bulk_pricing[0]?.min_quantity || 999999) ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/10" : isDarkMode ? "border-zinc-700 bg-zinc-800" : "border-slate-200 bg-white"}`}>
                      <p className={`text-[10px] uppercase font-bold ${textMuted}`}>Base Tier</p>
                      <p className="text-xs font-black">1 - {(Number(product.bulk_pricing[0]?.min_quantity) - 1) || 49} {displayUnit(product.unit)}</p>
                      <p className="text-sm font-black text-[var(--brand-blue)] mt-0.5">₹{basePrice.toLocaleString("en-IN")}</p>
                    </div>
                    {product.bulk_pricing.map((tier, idx) => {
                      const isTierActive = selectedQuantity >= Number(tier.min_quantity);
                      return (
                        <div
                          key={`tier-${idx}`}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isTierActive
                              ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                              : isDarkMode
                              ? "border-zinc-700 bg-zinc-800"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <p className="text-[10px] uppercase font-bold text-emerald-600">Tier {idx + 1}</p>
                          <p className="text-xs font-black">{tier.min_quantity}+ {displayUnit(product.unit)}</p>
                          <p className="text-sm font-black text-emerald-600 mt-0.5">₹{Number(tier.price).toLocaleString("en-IN")}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── CITY AVAILABILITY CHECKER ── */}
              <div className={`mt-5 p-4 rounded-2xl border ${borderCol}`}>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="city-verify-select" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={15} className="text-[var(--brand-blue)]" />
                    Delivery City Availability
                  </label>
                  {cityAvailableStatus === true && (
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Serviceable in {selectedCity}
                    </span>
                  )}
                  {cityAvailableStatus === false && (
                    <span className="text-xs font-bold text-rose-500">
                      ⚠ Currently unavailable in {selectedCity}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <select
                    id="city-verify-select"
                    value={selectedCity}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedCity(val);
                      handleCheckCity(val);
                    }}
                    className={`flex-1 px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] ${inpCls}`}
                  >
                    <option value="">Select your city to check delivery...</option>
                    {supportedCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleCheckCity()}
                    disabled={!selectedCity || cityCheckLoading}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-black uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {cityCheckLoading ? <RefreshCw size={13} className="animate-spin" /> : "Check"}
                  </button>
                </div>
              </div>

              {/* ── QUANTITY SELECTOR & TOTAL CALCULATION ── */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--brand-blue)]/30 bg-[var(--brand-blue)]/5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block text-slate-800 dark:text-zinc-200">
                    Order Quantity ({displayUnit(product.unit)})
                  </span>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="inline-flex items-center rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1 shadow-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedQuantity((q) => Math.max(1, q - (getCartStep(product) || 1)))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={selectedQuantity}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                          setSelectedQuantity(val);
                        }}
                        className="w-14 text-center font-black text-sm bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedQuantity((q) => q + (getCartStep(product) || 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <span className={`text-xs font-bold ${textMuted}`}>
                      {displayUnit(product.unit)}s
                    </span>
                  </div>
                </div>

                {unitPrice > 0 && (
                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${textMuted}`}>Subtotal</span>
                    <p className="text-2xl font-black text-[var(--brand-blue)]">
                      ₹{lineTotal.toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>

              {/* ── ACTION BUTTONS: BUY NOW & ADD TO CART ── */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!isAvailable}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[var(--brand-blue)] to-sky-400 hover:from-sky-400 hover:to-[var(--brand-blue)] text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <Zap size={18} className="fill-slate-950" />
                  {isAvailable ? "Buy Now · Instant Checkout" : "Currently Unavailable"}
                </button>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e)}
                  disabled={!isAvailable}
                  className={`flex-1 py-4 px-6 rounded-2xl border-2 font-black text-sm uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${
                    isDarkMode
                      ? "border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                      : "border-slate-800 bg-slate-900 hover:bg-slate-800 text-white shadow-md"
                  }`}
                >
                  <ShoppingCart size={18} />
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            SPECIFICATIONS & DESCRIPTION SECTION
           ───────────────────────────────────────────────────────────── */}
        <div className={`mt-10 rounded-3xl border ${cardBg} overflow-hidden`}>
          {/* Tabs header */}
          <div className={`flex border-b overflow-x-auto ${borderCol}`}>
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                activeTab === "specs"
                  ? "border-[var(--brand-blue)] text-[var(--brand-blue)]"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Technical Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                activeTab === "description"
                  ? "border-[var(--brand-blue)] text-[var(--brand-blue)]"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Product Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("delivery")}
              className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                activeTab === "delivery"
                  ? "border-[var(--brand-blue)] text-[var(--brand-blue)]"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              Delivery &amp; Site Logistics
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Tab 1: Specifications Table */}
            {activeTab === "specs" && (
              <div>
                <h3 className="text-base font-black mb-4">Material Specifications &amp; Standards</h3>
                {Object.keys(product.specifications || {}).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div
                        key={key}
                        className={`p-3.5 rounded-xl border flex items-center justify-between ${
                          isDarkMode ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200/70"
                        }`}
                      >
                        <span className={`text-xs font-bold uppercase tracking-wide ${textMuted}`}>{key}</span>
                        <span className="text-xs font-extrabold text-right ml-4">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isDarkMode ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200/70"}`}>
                      <span className={`text-xs font-bold uppercase tracking-wide ${textMuted}`}>Category</span>
                      <span className="text-xs font-extrabold">{product.category || "Building Materials"}</span>
                    </div>
                    {product.brand && (
                      <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isDarkMode ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200/70"}`}>
                        <span className={`text-xs font-bold uppercase tracking-wide ${textMuted}`}>Brand</span>
                        <span className="text-xs font-extrabold">{product.brand}</span>
                      </div>
                    )}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isDarkMode ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200/70"}`}>
                      <span className={`text-xs font-bold uppercase tracking-wide ${textMuted}`}>Standard Unit</span>
                      <span className="text-xs font-extrabold">{displayUnit(product.unit)}</span>
                    </div>
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isDarkMode ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200/70"}`}>
                      <span className={`text-xs font-bold uppercase tracking-wide ${textMuted}`}>Quality Standard</span>
                      <span className="text-xs font-extrabold text-emerald-500">IS / BIS Verified Grade</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Description */}
            {activeTab === "description" && (
              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
                <p>
                  {product.description ||
                    `${product.name} is a high-grade construction material supplied through MT-Boss verified vendor and supplier network. Specially chosen for durability, high load capacity, and compliance with Indian building and construction norms.`}
                </p>
                <div className={`p-4 rounded-2xl border ${isDarkMode ? "bg-zinc-800/40 border-zinc-800" : "bg-slate-50 border-slate-200"}`}>
                  <h4 className="text-xs font-black uppercase tracking-wider mb-2 text-[var(--brand-blue)]">
                    Quality Guarantee by MT-Boss
                  </h4>
                  <p className={`text-xs ${textMuted}`}>
                    Every lot is verified for weight, batch code, and brand authenticity prior to dispatch to your construction site. In case of any transit damage or specification discrepancy, our site logistics support is available for replacement.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Delivery Info */}
            {activeTab === "delivery" && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-2xl border ${borderCol}`}>
                    <Clock size={20} className="text-[var(--brand-blue)] mb-2" />
                    <h4 className="font-extrabold mb-1">Dispatch Timelines</h4>
                    <p className={textMuted}>Standard orders are scheduled and dispatched within 24 to 48 hours directly to site.</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${borderCol}`}>
                    <Truck size={20} className="text-emerald-500 mb-2" />
                    <h4 className="font-extrabold mb-1">Direct Site Delivery</h4>
                    <p className={textMuted}>Delivered via commercial trucks and tippers. Please ensure road access for heavy vehicles.</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${borderCol}`}>
                    <ShieldCheck size={20} className="text-amber-500 mb-2" />
                    <h4 className="font-extrabold mb-1">Unloading &amp; Inspection</h4>
                    <p className={textMuted}>Site engineer or supervisor can inspect batch stamps and quantity before signing challan.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RELATED PRODUCTS IN SAME CATEGORY
           ───────────────────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--brand-blue)]">
                  EXPLORE MORE
                </span>
                <h2 className="text-xl sm:text-2xl font-black">Related Materials in {product?.category || "Category"}</h2>
              </div>
              <Link
                href={`/ShopNow?category=${encodeURIComponent(product?.category || "")}`}
                className="text-xs font-bold text-[var(--brand-blue)] hover:underline flex items-center gap-1"
              >
                View all in {product?.category || "Category"} <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedProducts.map((relProd) => {
                const relPrice = Number(relProd.price) || 0;
                const relImage = getProductImage(relProd, { image: relProd.image_url });
                return (
                  <Link
                    key={relProd.id}
                    href={`/ShopNow/${relProd.id}`}
                    className={`group p-3 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 ${cardBg}`}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden relative mb-2.5 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                      {relImage ? (
                        <ShopImage src={relImage} alt={relProd.name} fill sizes="180px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <Package size={32} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold line-clamp-2 group-hover:text-[var(--brand-blue)] transition-colors">
                        {relProd.name}
                      </h4>
                      <div className="mt-1.5 flex items-baseline justify-between">
                        <strong className="text-xs font-black text-slate-900 dark:text-white">
                          {relPrice > 0 ? `₹${relPrice.toLocaleString("en-IN")}` : "Quote"}
                        </strong>
                        <span className={`text-[10px] ${textMuted}`}>{displayUnit(relProd.unit)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE STICKY BOTTOM ACTION BAR (Viewport <= 768px)
         ───────────────────────────────────────────────────────────── */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t backdrop-blur-lg ${
        isDarkMode ? "bg-zinc-950/95 border-zinc-800" : "bg-white/95 border-slate-200 shadow-2xl"
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className={`text-[9px] font-black uppercase tracking-wider block ${textMuted}`}>Total Price</span>
            <div className="text-base font-black truncate text-[var(--brand-blue)]">
              {unitPrice > 0 ? `₹${lineTotal.toLocaleString("en-IN")}` : "Price on Quote"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleAddToCart(e)}
              disabled={!isAvailable}
              className={`p-3 rounded-xl border font-bold text-xs active:scale-95 transition-all ${
                isDarkMode ? "border-zinc-700 bg-zinc-800 text-white" : "border-slate-300 bg-slate-100 text-slate-900"
              }`}
              title="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!isAvailable}
              className="py-3 px-5 rounded-xl bg-[var(--brand-blue)] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Zap size={15} className="fill-slate-950" />
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* End main */}
    </div>
  );
}
