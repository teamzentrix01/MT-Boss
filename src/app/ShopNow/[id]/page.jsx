"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Package,
  ShieldAlert,
} from "lucide-react";
import { displayUnit, getProductImage } from "../Storefront";
import ProductGalleryCarousel from "../ProductGalleryCarousel";
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

function getQuickAnswer(product) {
  if (product?.description && product.description.length > 50 && product.description.length < 280) {
    return product.description;
  }
  const name = product?.name || "This material";
  const cat = (product?.category || "").toLowerCase();
  const sub = (product?.subcategory || "").toLowerCase();

  if (cat.includes("cement") || sub.includes("cement") || name.toLowerCase().includes("cement")) {
    return `${name} is a premium Portland Pozzolana Cement with superior workability and smooth finish, designed for masonry and plastering operations with eco-friendly pozzolanic materials that reduce heat generation and minimize cracking in humid climates.`;
  }
  if (cat.includes("sand") || sub.includes("sand") || name.toLowerCase().includes("sand")) {
    return `${name} is triple-washed, silt-free construction sand graded for superior bond strength in mortar, plastering, and RCC casting without organic impurities.`;
  }
  if (cat.includes("brick") || sub.includes("brick") || cat.includes("block") || sub.includes("block")) {
    return `${name} delivers high compressive strength, sharp edges, and uniform dimensions, engineered for load-bearing walls, foundations, and modern masonry structures.`;
  }
  if (cat.includes("steel") || sub.includes("steel") || cat.includes("iron")) {
    return `${name} is high-strength Fe 500D / 550D TMT rebar featuring superior ductility, high bendability, and earthquake-resistant bonding for reinforced concrete frames.`;
  }
  if (cat.includes("paint") || sub.includes("paint")) {
    return `${name} provides long-lasting wall protection, high scrub resistance, and rich aesthetic coverage engineered for modern interior and exterior surfaces.`;
  }
  return `${name} is a verified, high-performance construction material supplied through MTBOSS verified supplier network, certified for durability, consistency, and compliance with Indian building norms.`;
}

function getHighlightsBullets(product) {
  if (!product) return [];
  const bullets = [];

  const grade = product.grade || product.specifications?.Grade || product.type;
  bullets.push({ label: "Grade", val: grade || "Portland Pozzolana Cement (PPC) / IS Standard" });

  const packSize = product.pack_size || (product.unit ? `${displayUnit(product.unit)} Packaging` : null);
  bullets.push({ label: "Packaging Size", val: packSize || "50 Kg Bag" });

  const comp = product.material || product.specifications?.Composition;
  bullets.push({ label: "Composition", val: comp || "Pozzolanic materials with premium clinker" });

  if (product.brand) {
    bullets.push({ label: "Brand", val: product.brand });
  }

  const heat = product.specifications?.["Heat of Hydration"] || product.specifications?.Hydration;
  bullets.push({ label: "Heat of Hydration", val: heat || "Low (reduces cracking risk)" });

  bullets.push({ label: "Best Before", val: "3 months from manufacturing date" });

  return bullets;
}

// ── Smart Related Products Filter ─────────────────────────────────────────────
function areSubcategoriesRelated(subA, subB) {
  const a = String(subA || "").trim().toLowerCase();
  const b = String(subB || "").trim().toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;

  // Word overlap comparison (e.g. "Sanitary Ware" vs "Sanitary", "CPVC Pipes" vs "Pipes")
  const wordsA = a.split(/[\s,/\\-]+/).filter((w) => w.length >= 3);
  const wordsB = b.split(/[\s,/\\-]+/).filter((w) => w.length >= 3);
  return wordsA.some((w) => wordsB.includes(w));
}

function filterRelatedProducts(currentProduct, candidates) {
  if (!currentProduct || !Array.isArray(candidates) || candidates.length === 0) {
    return [];
  }

  const curId = String(currentProduct.id);
  const curSub = String(currentProduct.subcategory || "").trim().toLowerCase();
  const curCat = String(currentProduct.category || "").trim().toLowerCase();
  const curName = String(currentProduct.name || "").trim().toLowerCase();

  // Exclude current product itself
  const pool = candidates.filter((p) => String(p.id) !== curId);

  // Common stop words to exclude when tokenizing product names
  const stopWords = new Set([
    "with", "from", "each", "pack", "size", "inch", "free", "best", "super",
    "high", "plus", "standard", "heavy", "duty", "item", "product", "bags", "bag", "pcs", "piece"
  ]);
  const nameTokens = curName
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !stopWords.has(w));

  // Case 1: Current product has an explicit subcategory (e.g. 'Sanitary', 'Cement', 'CPVC Pipes')
  if (curSub) {
    // 1A. Items with strictly matching/related subcategory
    const strictSubMatches = pool.filter((p) => {
      const pSub = String(p.subcategory || "").trim().toLowerCase();
      return pSub && areSubcategoriesRelated(curSub, pSub);
    });

    // 1B. Items with NO subcategory defined, but their name matches current name or subcategory
    const unclassifiedMatches = pool.filter((p) => {
      const pSub = String(p.subcategory || "").trim().toLowerCase();
      if (pSub) return false; // Belongs to an explicitly different subcategory, reject!
      const pName = String(p.name || "").toLowerCase();
      if (pName.includes(curSub)) return true;
      return nameTokens.some((tok) => pName.includes(tok));
    });

    const combined = [...strictSubMatches, ...unclassifiedMatches];
    return combined.slice(0, 4);
  }

  // Case 2: Current product has NO subcategory
  // Match candidate by matching name keywords or matching candidate subcategory
  const nameMatches = pool.filter((p) => {
    const pName = String(p.name || "").toLowerCase();
    const pSub = String(p.subcategory || "").toLowerCase();
    return nameTokens.some((tok) => pName.includes(tok) || pSub.includes(tok));
  });

  if (nameMatches.length > 0) {
    return nameMatches.slice(0, 4);
  }

  // Fallback: only products in the exact same category
  if (curCat) {
    const sameCat = pool.filter((p) => {
      const pCat = String(p.category || "").trim().toLowerCase();
      return pCat === curCat;
    });
    return sameCat.slice(0, 4);
  }

  return [];
}

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawId = resolvedParams?.id || "";
  const productId = String(rawId).replace(/^supplier-/, "");

  const isDarkMode = useDarkMode();

  // ── Product and Page State ──────────────────────────────────────────────────
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState("");

  // Accordion state (Product Highlights open by default)
  const [openAccordions, setOpenAccordions] = useState({
    highlights: true,
    description: false,
    faqs: false,
    returns: false,
  });

  const toggleAccordion = (section) => {
    setOpenAccordions((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Sync cart safely from localStorage using initializer to avoid setState in effect
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("MTBOSS-shop-cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("MTBOSS-shop-cart") || "[]");
        if (Array.isArray(saved)) {
          setCart(saved);
        }
      } catch {}
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cartUpdated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cartUpdated", handleStorage);
    };
  }, []);

  // Fetch product detail and related products without synchronous setState in effect
  useEffect(() => {
    if (!productId) return;
    let isCancelled = false;

    async function loadData() {
      try {
        const res = await fetch(`/api/shop-material-options?id=${encodeURIComponent(productId)}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        const prod = data.data?.product || data.product || data;
        if (!prod || !prod.id) throw new Error("Product data not found");
        if (isCancelled) return;

        setProduct(prod);
        setSelectedQuantity(getCartStep(prod) || 1);

        // Fetch and filter related products strictly matching subcategory or relevance
        const categoryParam = prod.category ? `?category=${encodeURIComponent(prod.category)}` : "";
        const relRes = await fetch(`/api/shop-material-options${categoryParam}`);
        const relData = await relRes.json();
        if (relData?.success && Array.isArray(relData.data?.products) && !isCancelled) {
          const matched = filterRelatedProducts(prod, relData.data.products);
          setRelatedProducts(matched);
        }
      } catch (err) {
        if (!isCancelled) {
          setLoadError(err.message || "Could not load product details.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [productId]);

  // Derived product pricing and discount
  const basePrice = Number(product?.price) || 0;
  const compareAtPrice = Number(product?.compare_at_price) || 0;
  const discountPercent =
    compareAtPrice > basePrice && basePrice > 0
      ? Math.round(((compareAtPrice - basePrice) / compareAtPrice) * 100)
      : compareAtPrice > 0
      ? 7
      : 7;

  const bulkPrice = useMemo(() => {
    if (Array.isArray(product?.bulk_pricing) && product.bulk_pricing.length > 0) {
      const p = Number(product.bulk_pricing[0].price);
      if (p > 0) return p;
    }
    return Math.round(basePrice * 0.92);
  }, [product, basePrice]);

  const isAvailable = product ? Number(product.quantity ?? 1) > 0 : true;

  // Add to cart handler
  const handleAddToCart = (e, targetProduct = product, qty = selectedQuantity) => {
    const prod = targetProduct || product;
    if (!prod) return;
    if (e) {
      triggerFlyToCart(e, prod);
    }
    try {
      const raw = localStorage.getItem("MTBOSS-shop-cart") || "[]";
      const currentCart = JSON.parse(raw);
      const step = getCartStep(prod);

      const existingIndex = currentCart.findIndex(
        (item) => String(item.product?.product_id || item.product?.id) === String(prod.id)
      );

      let updatedCart = [...currentCart];
      if (existingIndex > -1) {
        const curQty = updatedCart[existingIndex].quantity || step;
        updatedCart[existingIndex].quantity = curQty + qty;
      } else {
        updatedCart.push({
          product: {
            ...prod,
            product_id: prod.id,
            fromSupplier: true,
          },
          quantity: qty,
        });
      }

      localStorage.setItem("MTBOSS-shop-cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("cartUpdated"));

      setToastMessage(`✓ Added ${qty} ${displayUnit(prod.unit)} to your cart!`);
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  // Loading view
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-black">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Loading Product...</p>
      </div>
    );
  }

  // Error view
  if (loadError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-black">
        <ShieldAlert size={48} className="text-rose-500 mb-3" />
        <h2 className="text-xl font-bold">Material Not Found</h2>
        <p className="text-sm mt-1 max-w-md text-slate-500">
          {loadError || "The material you requested could not be found."}
        </p>
        <Link
          href="/ShopNow"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-700 text-white font-bold text-xs uppercase hover:bg-emerald-800 transition-all shadow-sm"
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  const bullets = getHighlightsBullets(product);
  const quickAnswer = getQuickAnswer(product);

  return (
    <div className="shop-page shop-product-detail-page min-h-screen bg-white dark:bg-black font-sans text-slate-900 dark:text-zinc-100 transition-colors">
      <style jsx global>{`
        .product-side-scroll {
          scrollbar-width: thin;
          scrollbar-color: #94a3b8 #f1f5f9;
        }
        .product-side-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .product-side-scroll::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .product-side-scroll::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 4px;
        }
        .dark-mode .product-side-scroll::-webkit-scrollbar-track {
          background: #18181b;
        }
        .dark-mode .product-side-scroll::-webkit-scrollbar-thumb {
          background: #52525b;
        }
      `}</style>

      {/* ── BREADCRUMB ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          <span>&gt;</span>
          <Link href="/ShopNow" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            {product.category || "Building Materials"}
          </Link>
          <span>&gt;</span>
          <span className="text-slate-800 dark:text-zinc-200 font-semibold truncate max-w-[280px]">
            {product.subcategory || product.name}
          </span>
        </nav>
      </div>

      {/* ── TOAST NOTIFICATION ────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-xl animate-fade-in">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
            <Link href="/ShopNow/cart" className="underline font-bold text-emerald-200 hover:text-white ml-2">
              View Cart →
            </Link>
          </div>
        </div>
      )}

      {/* ── MAIN PRODUCT SECTION (MATCHING USER REFERENCE IMAGE) ─────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: PRODUCT IMAGE + THUMBNAILS
             ───────────────────────────────────────────────────────────── */}
          <div className="md:col-span-6 relative">
            {/* Top-left Discount Tag (e.g. 7% OFF yellow box like image) */}
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-[#facc15] text-slate-950 font-black text-xs px-2.5 py-1 rounded-sm shadow-xs uppercase">
                {discountPercent}% OFF
              </span>
            </div>

            {/* Gallery (shows single image if product only has 1, or thumbnail row if multiple) */}
            <div className="w-full flex flex-col items-center">
              <ProductGalleryCarousel product={product} />
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: SCROLLABLE PRODUCT DETAILS & ACCORDIONS
             ───────────────────────────────────────────────────────────── */}
          <div className="md:col-span-6 max-h-[520px] overflow-y-auto pr-2 sm:pr-3 space-y-4 product-side-scroll">
            {/* Product Title */}
            <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Pricing Row */}
            <div className="flex items-baseline gap-2.5">
              {compareAtPrice > basePrice && (
                <span className="text-lg sm:text-xl text-slate-400 line-through font-medium">
                  ₹{compareAtPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                ₹{basePrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* 5% Discount Banner (Yellow Ribbon like reference image) */}
            <div className="bg-[#fef9c3] dark:bg-amber-950/30 border border-[#fef08a] dark:border-amber-900/50 rounded-sm p-2 sm:p-2.5 flex items-center gap-2.5">
              <span className="bg-[#eab308] text-slate-950 font-extrabold text-[11px] px-2 py-0.5 rounded-xs flex items-center gap-1 shadow-2xs">
                5%
              </span>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-amber-200">Discount </span>
                <span className="text-[11px] text-slate-600 dark:text-amber-300/80">on orders above 50K</span>
              </div>
            </div>

            {/* GST / Shipping calculated at checkout */}
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Incl GST{" "}
              <span className="underline cursor-pointer text-slate-700 dark:text-zinc-300">
                Shipping
              </span>{" "}
              calculated at checkout.
            </p>

            {/* Unlock Bulk Prices */}
            <div>
              <span
                onClick={() => handleAddToCart(null, product, 50)}
                className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold hover:underline cursor-pointer inline-block"
              >
                Unlock Bulk Prices of ₹{bulkPrice.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Add To Cart Full Width Green Button */}
            <button
              type="button"
              onClick={(e) => handleAddToCart(e)}
              disabled={!isAvailable}
              className="w-full py-3.5 px-6 rounded-md !bg-[#15803d] hover:!bg-[#166534] !text-white !bg-none font-sans font-bold text-base transition-colors shadow-xs active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isAvailable ? "Add To Cart" : "Out of Stock"}
            </button>

            {/* ───────────────────────────────────────────────────────────
                ACCORDION SECTIONS (AS IN REFERENCE IMAGE)
               ─────────────────────────────────────────────────────────── */}
            <div className="space-y-2 pt-2">
              {/* Accordion 1: Product Highlights (Open by default) */}
              <div className="border border-slate-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => toggleAccordion("highlights")}
                  className="w-full py-3 px-4 flex items-center justify-between text-left text-sm font-sans font-bold !text-slate-900 dark:!text-white !bg-slate-50/90 dark:!bg-zinc-800/60 hover:!bg-slate-100 dark:hover:!bg-zinc-800 transition-colors !bg-none"
                >
                  <span>Product Highlights</span>
                  {openAccordions.highlights ? (
                    <ChevronUp size={16} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-500" />
                  )}
                </button>

                {openAccordions.highlights && (
                  <div className="p-4 space-y-4 text-xs sm:text-sm border-t border-slate-200 dark:border-zinc-800">
                    {/* Quick Answer yellow highlight box */}
                    <div className="bg-[#fef9c3] dark:bg-amber-950/40 border border-[#fef08a] dark:border-amber-900/60 rounded p-3.5">
                      <h4 className="text-[#854d0e] dark:text-amber-300 font-bold text-xs sm:text-sm mb-1">
                        Quick Answer: What is {product.name} used for?
                      </h4>
                      <p className="text-slate-800 dark:text-amber-100 text-xs leading-relaxed">
                        {quickAnswer}
                      </p>
                    </div>

                    {/* Custom Highlights added by seller/admin */}
                    {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                      <div className="space-y-2 pt-1 pb-1">
                        <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                          <span>✨</span> Key Product Highlights
                        </h5>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
                          {product.highlights.map((hl, idx) => {
                            const text = typeof hl === 'object' && hl !== null ? (hl.val || hl.label || '') : hl;
                            if (!text) return null;
                            return (
                              <li key={`custom-hl-${idx}`} className="flex items-start gap-2">
                                <span className="text-emerald-600 dark:text-emerald-400 font-black">✓</span>
                                <span className="leading-snug">{text}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Specifications Bullet Points */}
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-zinc-300">
                      {bullets.map((b, idx) => (
                        <li key={`bullet-${idx}`} className="flex items-start gap-2">
                          <span className="text-slate-400 font-bold">•</span>
                          <span>
                            <strong>{b.label}:</strong> {b.val}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Product Description */}
              <div className="border border-slate-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => toggleAccordion("description")}
                  className="w-full py-3 px-4 flex items-center justify-between text-left text-sm font-sans font-bold !text-slate-900 dark:!text-white !bg-slate-50/90 dark:!bg-zinc-800/60 hover:!bg-slate-100 dark:hover:!bg-zinc-800 transition-colors !bg-none"
                >
                  <span>Product Description</span>
                  {openAccordions.description ? (
                    <ChevronUp size={16} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-500" />
                  )}
                </button>

                {openAccordions.description && (
                  <div className="p-4 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 space-y-3 leading-relaxed border-t border-slate-200 dark:border-zinc-800">
                    <p>
                      {product.description ||
                        `${product.name} is a high-grade construction material supplied through MTBOSS verified supplier network. Specially chosen for durability, high load capacity, and compliance with Indian building and construction norms.`}
                    </p>
                    <p className="text-xs text-slate-500">
                      Every lot is verified for weight, batch code, and brand authenticity prior to dispatch to your construction site. In case of any transit damage or specification discrepancy, our site logistics support is available for replacement.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: FAQs */}
              <div className="border border-slate-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => toggleAccordion("faqs")}
                  className="w-full py-3 px-4 flex items-center justify-between text-left text-sm font-sans font-bold !text-slate-900 dark:!text-white !bg-slate-50/90 dark:!bg-zinc-800/60 hover:!bg-slate-100 dark:hover:!bg-zinc-800 transition-colors !bg-none"
                >
                  <span>FAQs</span>
                  {openAccordions.faqs ? (
                    <ChevronUp size={16} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-500" />
                  )}
                </button>

                {openAccordions.faqs && (
                  <div className="p-4 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 space-y-3.5 border-t border-slate-200 dark:border-zinc-800">
                    {Array.isArray(product.faqs) && product.faqs.filter((f) => f && f.q && f.a).length > 0 ? (
                      product.faqs.filter((f) => f && f.q && f.a).map((faq, idx) => (
                        <div key={`faq-${idx}`}>
                          <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                            Q: {faq.q}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 whitespace-pre-line leading-relaxed">
                            A: {faq.a}
                          </p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                            Q: How should this material be stored at the site?
                          </p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            A: Store in an elevated, dry, covered shed on wooden pallets away from moisture and direct rainwater.
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                            Q: Is an official GST tax invoice provided?
                          </p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            A: Yes, 100% genuine manufacturer test certificate and GST invoice accompany every delivery.
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                            Q: How do bulk order discounts work?
                          </p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            A: Bulk discounts unlock automatically for orders exceeding 50 units or ₹50,000 at checkout.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 4: Returns & Exchange Policy */}
              <div className="border border-slate-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => toggleAccordion("returns")}
                  className="w-full py-3 px-4 flex items-center justify-between text-left text-sm font-sans font-bold !text-slate-900 dark:!text-white !bg-slate-50/90 dark:!bg-zinc-800/60 hover:!bg-slate-100 dark:hover:!bg-zinc-800 transition-colors !bg-none"
                >
                  <span>Returns &amp; Exchange Policy</span>
                  {openAccordions.returns ? (
                    <ChevronUp size={16} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-500" />
                  )}
                </button>

                {openAccordions.returns && (
                  <div className="p-4 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 space-y-2 border-t border-slate-200 dark:border-zinc-800">
                    {product.returns_policy?.trim() ? (
                      <div className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-zinc-300">
                        {product.returns_policy.trim()}
                      </div>
                    ) : (
                      <>
                        <p>
                          <strong>Site Inspection:</strong> Customers can inspect quantity, brand stamps, and packaging at the time of truck unloading.
                        </p>
                        <p>
                          <strong>Transit Damage:</strong> Any burst bags or damaged items reported on the delivery challan will be replaced immediately or refunded.
                        </p>
                        <p>
                          <strong>Unopened Materials:</strong> Standard 48-hour return policy applies for unopened, undamaged materials.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            "YOU MAY ALSO LIKE" SECTION (AS IN REFERENCE IMAGE)
           ───────────────────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
              You may also like
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProd, idx) => {
                const relPrice = Number(relProd.price) || 0;
                const relCompare = Number(relProd.compare_at_price) || 0;
                const relDisc =
                  relCompare > relPrice && relPrice > 0
                    ? Math.round(((relCompare - relPrice) / relCompare) * 100)
                    : (idx % 2 === 0 ? 5 : 6);
                const relImage = getProductImage(relProd, { image: relProd.image_url });
                const relBulk = Math.round(relPrice * 0.92);

                return (
                  <div
                    key={relProd.id}
                    className="border border-slate-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 p-3 sm:p-4 flex flex-col justify-between relative hover:shadow-md transition-shadow group"
                  >
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-[#facc15] text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-xs uppercase">
                        {relDisc}% OFF
                      </span>
                    </div>

                    {/* Image */}
                    <Link
                      href={`/ShopNow/${relProd.id}`}
                      className="w-full aspect-square flex items-center justify-center p-3 mb-3 bg-white dark:bg-zinc-900 rounded-md overflow-hidden"
                    >
                      {relImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={relImage}
                          alt={relProd.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <Package size={40} className="text-slate-300" />
                      )}
                    </Link>

                    {/* Info */}
                    <div className="space-y-2">
                      {/* Delivery Badges */}
                      <div className="text-[10px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 flex-wrap">
                        <span>⏱ 60 Mins</span>
                        <span>•</span>
                        <span>₹ Pay on Delivery</span>
                      </div>

                      <div className="bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 text-[10px] font-bold px-2 py-1 rounded inline-block">
                        🚚 Free Delivery on orders above ₹500
                      </div>

                      {/* Title */}
                      <Link href={`/ShopNow/${relProd.id}`}>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 transition-colors">
                          {relProd.name}
                        </h4>
                      </Link>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        {relCompare > relPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{relCompare.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          ₹{relPrice.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* 5% Discount Banner */}
                      <div className="bg-[#fef9c3] dark:bg-amber-950/30 border border-[#fef08a] dark:border-amber-900/50 rounded-xs p-1.5 flex items-center gap-1.5 text-[10px]">
                        <span className="bg-[#eab308] text-slate-950 font-black px-1 rounded-2xs">5%</span>
                        <span className="font-bold text-slate-900 dark:text-amber-200">Discount on orders above 50K</span>
                      </div>

                      {/* Bulk Price */}
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                        Unlock Bulk Prices of ₹{relBulk.toLocaleString("en-IN")}
                      </p>

                      {/* Add Button */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, relProd, 1)}
                        className="w-full py-2 rounded !bg-[#15803d] hover:!bg-[#166534] !text-white !bg-none font-sans font-bold text-xs transition-colors mt-2 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
