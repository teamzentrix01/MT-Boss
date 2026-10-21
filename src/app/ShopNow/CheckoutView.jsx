"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BadgePercent,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  MapPin,
  Minus,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { useCities } from "@/hooks/useCities";
import { displayUnit, getProductImage, ShopImage } from "./Storefront";
import { getCartStep } from "@/lib/cart-step";
import "./shop.css";

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

export default function CheckoutView({ productId: initialProductId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDark = useDarkMode();
  const { cities: supportedCities } = useCities();

  const queryId = searchParams?.get("id") || searchParams?.get("productId") || "";
  const rawId = initialProductId || queryId || "";
  const productId = String(rawId).replace(/^supplier-/, "");
  const isCartMode = searchParams?.get("mode") === "cart" || (!productId && searchParams?.get("cart") === "1");
  const fromParam = searchParams?.get("from") || "";

  const handleBack = () => {
    if (fromParam === "cart" || isCartMode) {
      router.push("/ShopNow/cart");
      return;
    }
    if (fromParam === "shop") {
      router.push("/ShopNow");
      return;
    }
    if (fromParam === "detail" && (product?.id || productId)) {
      router.push(`/ShopNow/${product?.id || productId}`);
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/ShopNow");
    }
  };

  // ── Product / Cart state ────────────────────────────────────────────────────
  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Quantity
  const [qty, setQty] = useState(() => {
    const q = parseInt(searchParams?.get("qty") || "1", 10);
    return isNaN(q) || q < 1 ? 1 : q;
  });

  // Form fields
  const [selectedCity, setSelectedCity] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", message: "" });
  const [deliveryDate, setDeliveryDate] = useState("");

  // Address selector
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressMode, setAddressMode] = useState("new"); // "select" | "new"
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [newAddressLabel, setNewAddressLabel] = useState("Site");
  const [customAddressLabel, setCustomAddressLabel] = useState("");
  const [newAddressPincode, setNewAddressPincode] = useState("");
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [makeDefaultAddress, setMakeDefaultAddress] = useState(false);

  // GPS
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationCoords, setLocationCoords] = useState(null);

  // Shipping
  const [shippingQuote, setShippingQuote] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState("");

  // City check
  const [cityAvailable, setCityAvailable] = useState(null);
  const [cityCheckLoading, setCityCheckLoading] = useState(false);

  // Wallet
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletPreview, setWalletPreview] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  // ── Fetch single product or cart ────────────────────────────────────────────
  useEffect(() => {
    if (productId) {
      setLoading(true);
      setLoadError("");
      fetch(`/api/shop-material-options?id=${productId}`)
        .then(async (r) => {
          const j = await r.json();
          if (!r.ok || !j.success) throw new Error(j.error || "Material not found");
          return j.data.product;
        })
        .then((p) => {
          setProduct(p);
          const step = getCartStep(p) || 1;
          setQty((prev) => Math.max(step, prev));
        })
        .catch((e) => setLoadError(e.message))
        .finally(() => setLoading(false));
    } else {
      // Cart mode
      try {
        const raw = localStorage.getItem("mtboss-shop-cart") || "[]";
        const items = JSON.parse(raw);
        setCartItems(Array.isArray(items) ? items : []);
      } catch {}
      setLoading(false);
    }
  }, [productId]);

  // ── Prefill user ────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("admin");
      if (raw) {
        const u = JSON.parse(raw);
        setFormData((p) => ({
          ...p,
          name: p.name || u.name || "",
          email: p.email || u.email || "",
          phone: p.phone || u.phone || "",
        }));
      }
    } catch {}
  }, []);

  // ── Wallet balance ──────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("/api/wallet", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success && d?.data) setWalletBalance(Number(d.data.balance) || 0);
      })
      .catch(() => {});
  }, []);

  // ── Saved addresses ─────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("admin-token");
    let list = [];
    const doLoad = async () => {
      if (token) {
        try {
          const r = await fetch("/api/user/addresses", { headers: { Authorization: `Bearer ${token}` } });
          const d = await r.json();
          if (d.success && Array.isArray(d.data)) list = d.data;
        } catch {}
      }
      try {
        const local = JSON.parse(localStorage.getItem("mtboss_saved_addresses") || "[]");
        if (Array.isArray(local)) {
          const existing = new Set(list.map((a) => (a.address_line || "").trim().toLowerCase()));
          for (const item of local) {
            if (!existing.has((item.address_line || "").trim().toLowerCase())) list.push(item);
          }
        }
      } catch {}
      setSavedAddresses(list);
      if (list.length > 0) {
        const def = list.find((a) => a.is_default) || list[0];
        setAddressMode("select");
        applyAddress(def);
      }
    };
    doLoad();
  }, []);

  const applyAddress = (addr) => {
    if (!addr) return;
    setSelectedAddressId(addr.id);
    setFormData((p) => ({ ...p, address: addr.address_line || "" }));
    if (addr.pincode) setNewAddressPincode(addr.pincode);
    if (addr.city) {
      setSelectedCity(addr.city);
      setCityAvailable(null);
    }
    if (addr.latitude && addr.longitude) {
      setLocationCoords({ latitude: Number(addr.latitude), longitude: Number(addr.longitude) });
      setLocationStatus("success");
    } else {
      setLocationCoords(null);
      setLocationStatus("idle");
    }
  };

  const handleCheckCity = async (city) => {
    if (!city) return;
    const catName = product?.category || cartItems[0]?.product?.category?.name || "";
    setCityCheckLoading(true);
    try {
      const r = await fetch(`/api/pincode-check?city=${encodeURIComponent(city)}&type=category&name=${encodeURIComponent(catName)}`);
      const d = await r.json();
      setCityAvailable(Boolean(d?.available));
    } catch {
      setCityAvailable(null);
    } finally {
      setCityCheckLoading(false);
    }
  };

  // ── Shipping quote ──────────────────────────────────────────────────────────
  useEffect(() => {
    const items = product
      ? [{ product_id: product.id, quantity: qty }]
      : cartItems.map((ci) => ({ product_id: ci.product?.product_id || ci.product?.id, quantity: ci.quantity }));

    if (!selectedCity || !items.length) {
      setShippingQuote(null);
      return;
    }
    setShippingLoading(true);
    setShippingError("");
    let active = true;
    fetch("/api/shipping-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerCity: selectedCity, items }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        if (d.success) setShippingQuote(d.data);
        else {
          setShippingQuote(null);
          setShippingError(d.error || "Shipping could not be calculated");
        }
      })
      .catch((e) => {
        if (active) setShippingError(e.message);
      })
      .finally(() => {
        if (active) setShippingLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCity, product, qty, cartItems]);

  // ── Pricing calculations ────────────────────────────────────────────────────
  const basePrice = Number(product?.price) || 0;
  const unitPrice = useMemo(() => {
    if (!product || basePrice <= 0) return 0;
    const tiers = Array.isArray(product.bulk_pricing) ? product.bulk_pricing : [];
    const matched = tiers.filter((t) => qty >= Number(t.min_quantity)).sort((a, b) => Number(b.min_quantity) - Number(a.min_quantity))[0];
    return matched ? Number(matched.price) : basePrice;
  }, [product, basePrice, qty]);

  const singleProductLineTotal = unitPrice * qty;
  const cartLineTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.product?.price) || 0) * (Number(item.quantity) || 1), 0);
  }, [cartItems]);

  const itemsSubtotal = product ? singleProductLineTotal : cartLineTotal;
  const shippingCharges = Number(shippingQuote?.totalShipping) || 0;
  const walletDeduct = useWallet && Number(walletAmount) > 0 ? Number(walletAmount) : 0;
  const grandTotal = Math.max(0, itemsSubtotal + shippingCharges - walletDeduct);

  // ── Wallet preview ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!useWallet) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const items = product
      ? [{ id: product.id, quantity: qty }]
      : cartItems.map((ci) => ({ id: ci.product?.product_id || ci.product?.id, quantity: ci.quantity }));
    if (!items.length) return;

    let active = true;
    setWalletLoading(true);
    fetch("/api/wallet/redeem-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        items,
        selectedCity,
        requestedAmount: walletAmount !== "" ? Number(walletAmount) : null,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        if (d.success && d.data) {
          setWalletPreview(d.data);
          if (walletAmount === "" || Number(walletAmount) > d.data.maxAllowed) {
            setWalletAmount(String(d.data.maxAllowed));
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setWalletLoading(false);
      });
    return () => {
      active = false;
    };
  }, [product, qty, cartItems, selectedCity, useWallet, walletAmount]);

  // GPS location detection
  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationCoords({ latitude, longitude });
        setLocationStatus("success");
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
            headers: { "Accept-Language": "en" },
          });
          const d = await r.json();
          if (d.display_name) setFormData((p) => ({ ...p, address: p.address?.trim() || d.display_name }));
          if (d.address?.postcode) {
            const pin = String(d.address.postcode).replace(/\D/g, "").slice(0, 6);
            if (pin.length === 6) setNewAddressPincode((prev) => prev || pin);
          }
        } catch {}
      },
      () => setLocationStatus("error"),
      { timeout: 15000 }
    );
  };

  // ── Order submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCity) {
      setSubmitError("Please select your delivery city.");
      return;
    }
    if (!formData.address?.trim()) {
      setSubmitError("Please enter your complete delivery address.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to place an order so you can track it.");

      const payload = {
        order_intent: "buy",
        user_name: formData.name,
        user_phone: formData.phone,
        user_email: formData.email,
        delivery_date: deliveryDate || null,
        delivery_address: formData.address,
        latitude: locationCoords?.latitude || null,
        longitude: locationCoords?.longitude || null,
        message: formData.message || null,
        selected_city: selectedCity,
        use_wallet: useWallet,
        wallet_amount: walletDeduct,
      };

      if (product) {
        payload.product_id = product.id;
        payload.category_name = product.category;
        payload.material_type = product.name;
        payload.subcategory_name = product.subcategory || null;
        payload.brand_company = product.brand || null;
        payload.quantity_text = `${qty} ${displayUnit(product.unit)}`;
        payload.order_unit = product.unit || "unit";
      } else {
        payload.items = cartItems.map((ci) => ({
          product_id: ci.product?.product_id || null,
          category_name: ci.product?.category?.name || "Materials",
          material_type: ci.product?.name,
          quantity: ci.quantity,
          order_unit: ci.product?.unit || "unit",
        }));
      }

      const r = await fetch("/api/material-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.error || "Failed to place order");

      setSubmittedOrder(d.data);
      if (!product) {
        localStorage.removeItem("mtboss-shop-cart");
        window.dispatchEvent(new Event("storage"));
      }
      setSubmitted(true);

      // Save address
      if (addressMode === "new" && saveAddressToProfile && formData.address?.trim()) {
        const label = newAddressLabel === "Other" ? customAddressLabel.trim() || "Other" : newAddressLabel;
        fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            label,
            address_line: formData.address.trim(),
            city: selectedCity,
            pincode: newAddressPincode?.trim() || null,
            latitude: locationCoords?.latitude || null,
            longitude: locationCoords?.longitude || null,
            is_default: makeDefaultAddress || savedAddresses.length === 0,
          }),
        }).catch(() => {});
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Styling ─────────────────────────────────────────────────────────────────
  const bg = isDark ? "bg-zinc-950 text-white" : "bg-[#f8fafc] text-slate-900";
  const card = isDark ? "bg-zinc-900 border-zinc-800" : "bg-white border-slate-200/90 shadow-sm";
  const inp = isDark
    ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--brand-blue)]"
    : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[var(--brand-blue)]";
  const muted = isDark ? "text-zinc-400" : "text-slate-500";
  const border = isDark ? "border-zinc-800" : "border-slate-200";

  const inpClass = `w-full px-3.5 py-2.5 rounded-xl border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/30 transition-all ${inp}`;

  // Loading
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--brand-blue)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Loading checkout details...</p>
        </div>
      </div>
    );
  }

  // Error / empty cart
  if (loadError || (!product && !cartItems.length)) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center ${bg}`}>
        <p className="text-base font-bold text-rose-500">{loadError || "No items to checkout."}</p>
        <Link href="/ShopNow" className="px-5 py-2.5 rounded-xl bg-[var(--brand-blue)] text-slate-950 font-bold text-xs uppercase tracking-wider">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const productImage = product
    ? getProductImage(product, {
        image: product.category_image || product.image_url || (Array.isArray(product.images) && product.images[0]),
        name: product.category,
      })
    : "";

  // ── Order Success View ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className={`min-h-screen ${bg}`}>
        <header className={`sticky top-0 z-40 border-b ${isDark ? "bg-zinc-950/95 border-zinc-800" : "bg-white/95 border-slate-200 shadow-sm"} backdrop-blur-md`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
            <Link href="/ShopNow" className={`p-2 rounded-xl border transition-all ${isDark ? "border-zinc-800 hover:bg-zinc-800 text-zinc-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"}`}>
              <ArrowLeft size={18} />
            </Link>
            <Image src="/logo.png" alt="MT-Boss" width={100} height={28} className="h-7 w-auto object-contain" priority />
          </div>
        </header>

        <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/30">
            <Check size={40} className="text-white" strokeWidth={3} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2">Order Confirmed! 🎉</h1>
          <p className={`text-sm ${muted} max-w-sm mx-auto leading-relaxed`}>
            Your order has been submitted to verified suppliers. You will receive delivery updates directly.
          </p>

          {submittedOrder?.order_reference && (
            <div className={`mt-6 inline-block px-6 py-4 rounded-2xl border-2 ${isDark ? "border-[var(--brand-blue)]/50 bg-zinc-900" : "border-[var(--brand-blue)]/30 bg-blue-50"}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>Order Reference</p>
              <p className="text-xl font-black text-[var(--brand-blue)] mt-1">{submittedOrder.order_reference}</p>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/material-orders?role=user"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--brand-blue)] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:bg-sky-400 transition-all"
            >
              <ClipboardList size={16} /> Track Order Status →
            </Link>
            <Link
              href="/ShopNow"
              className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all ${
                isDark ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800" : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ShoppingCart size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Checkout Form Page ──────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${bg} shop-product-detail-page pb-20`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${isDark ? "bg-zinc-950/95 border-zinc-800" : "bg-white/95 border-slate-200 shadow-xs"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className={`p-2 rounded-xl border transition-all ${
                isDark ? "border-zinc-800 hover:bg-zinc-800 text-zinc-300" : "border-slate-200 hover:bg-slate-100 text-slate-700"
              }`}
              title="Back"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="MT-Boss" width={100} height={28} className="h-7 w-auto object-contain" priority />
              <span className="hidden sm:inline text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded bg-[var(--brand-blue)] text-slate-950 uppercase">
                CHECKOUT
              </span>
            </Link>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${isDark ? "bg-zinc-900 border-zinc-800 text-zinc-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="hidden sm:inline">100% Verified Supplier Checkout</span>
          </div>
        </div>
      </header>

      {/* Breadcrumb strip */}
      <nav className={`max-w-6xl mx-auto px-4 sm:px-6 py-3 text-xs ${muted} flex items-center gap-2 overflow-x-auto`}>
        <Link href="/ShopNow" className="hover:text-[var(--brand-blue)] transition-colors whitespace-nowrap">Shop</Link>
        <span>/</span>
        {isCartMode && (
          <>
            <Link href="/ShopNow/cart" className="hover:text-[var(--brand-blue)] transition-colors whitespace-nowrap">
              My Cart
            </Link>
            <span>/</span>
          </>
        )}
        {product && fromParam === "detail" && (
          <>
            <Link href={`/ShopNow/${product.id}`} className="hover:text-[var(--brand-blue)] transition-colors whitespace-nowrap truncate max-w-[200px]">
              {product.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-bold whitespace-nowrap text-slate-900 dark:text-white">Order Checkout</span>
      </nav>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-2">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black">Checkout &amp; Delivery Details</h1>
          <p className={`text-sm mt-1 ${muted}`}>Please enter your site delivery address to schedule dispatch.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ──────────────────────────────────────────────────────────
              LEFT: FORM INPUTS
             ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">

              {/* 1. DELIVERY CITY */}
              <div className={`p-6 rounded-3xl border ${card}`}>
                <h2 className="text-base font-black mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-[var(--brand-blue)]" />
                  1. Delivery City
                </h2>
                <select
                  required
                  value={selectedCity}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedCity(val);
                    handleCheckCity(val);
                  }}
                  className={inpClass}
                >
                  <option value="">Select your delivery city *</option>
                  {supportedCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {cityCheckLoading && (
                  <p className={`text-xs mt-2 flex items-center gap-1.5 ${muted}`}>
                    <RefreshCw size={12} className="animate-spin" /> Verifying city availability...
                  </p>
                )}
                {!cityCheckLoading && cityAvailable === true && selectedCity && (
                  <p className="text-xs mt-2 text-emerald-500 font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Serviceable in {selectedCity}
                  </p>
                )}
                {!cityCheckLoading && cityAvailable === false && selectedCity && (
                  <p className="text-xs mt-2 text-rose-500 font-bold">
                    ⚠ Material may not be currently stocked in {selectedCity}
                  </p>
                )}

                {shippingLoading && <p className={`text-xs mt-3 ${muted}`}>Calculating shipping charges...</p>}
                {shippingQuote?.totalShipping !== undefined && shippingQuote?.totalShipping !== null && (
                  <div className={`mt-3 p-3.5 rounded-xl border ${isDark ? "bg-zinc-800/60 border-zinc-700" : "bg-slate-50 border-slate-200"} text-xs space-y-1`}>
                    <p className={`font-black uppercase tracking-wider text-[10px] ${muted}`}>Shipping Estimate</p>
                    {Array.isArray(shippingQuote.breakdown) && shippingQuote.breakdown.map((row, i) => (
                      <p key={i} className="font-medium">{row.label}</p>
                    ))}
                    <p className="font-black text-sm pt-1">Total Shipping: ₹{Number(shippingQuote.totalShipping).toLocaleString("en-IN")}</p>
                  </div>
                )}
                {shippingError && !shippingLoading && <p className="text-xs mt-2 text-amber-500">{shippingError}</p>}
              </div>

              {/* 2. CUSTOMER CONTACT */}
              <div className={`p-6 rounded-3xl border ${card}`}>
                <h2 className="text-base font-black mb-4 flex items-center gap-2">
                  <span className="text-[var(--brand-blue)]">👤</span>
                  2. Customer Contact Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-wider mb-1.5 ${muted}`}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Ramesh Kumar"
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-wider mb-1.5 ${muted}`}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setFormData((p) => ({ ...p, phone: raw }));
                      }}
                      placeholder="10-digit mobile number"
                      className={inpClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={`block text-[10px] font-black uppercase tracking-wider mb-1.5 ${muted}`}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      placeholder="name@email.com"
                      className={inpClass}
                    />
                  </div>
                </div>
              </div>

              {/* 3. SITE DELIVERY ADDRESS */}
              <div className={`p-6 rounded-3xl border ${card}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black flex items-center gap-2">
                    <span className="text-[var(--brand-blue)]">🏠</span>
                    3. Delivery Address
                  </h2>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (addressMode === "select") {
                          setAddressMode("new");
                          setSelectedAddressId("new");
                          setFormData((p) => ({ ...p, address: "" }));
                        } else {
                          setAddressMode("select");
                          applyAddress(savedAddresses.find((a) => a.is_default) || savedAddresses[0]);
                        }
                      }}
                      className="text-xs font-bold text-[var(--brand-blue)] hover:underline"
                    >
                      {addressMode === "select" ? "+ Add New Address" : `← Choose Saved (${savedAddresses.length})`}
                    </button>
                  )}
                </div>

                {addressMode === "select" && savedAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => {
                      const sel = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => applyAddress(addr)}
                          className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            sel ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]/8" : isDark ? "border-zinc-800 bg-zinc-800/30 hover:border-zinc-700" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                          }`}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${sel ? "border-[var(--brand-blue)] bg-[var(--brand-blue)]" : "border-slate-400"}`}>
                            {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mb-1 ${isDark ? "bg-zinc-700 text-zinc-300" : "bg-slate-200 text-slate-600"}`}>
                              {addr.label || "Address"}
                            </span>
                            <p className="text-sm font-semibold leading-relaxed">{addr.address_line}</p>
                            {addr.city && <p className={`text-xs mt-0.5 ${muted}`}>{addr.city}{addr.pincode ? ` - ${addr.pincode}` : ""}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${muted}`}>Address Type / Tag</p>
                      <div className="flex flex-wrap gap-2">
                        {["Home", "Office", "Site", "Other"].map((lbl) => (
                          <button
                            key={lbl}
                            type="button"
                            onClick={() => setNewAddressLabel(lbl)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                              newAddressLabel === lbl
                                ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-slate-950 font-black"
                                : isDark
                                ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
                                : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            {lbl === "Home" ? "🏠" : lbl === "Office" ? "🏢" : lbl === "Site" ? "🏗️" : "📍"} {lbl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-[10px] font-black uppercase tracking-wider mb-1.5 ${muted}`}>Full Street Address / Site Location *</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                        placeholder="Plot / House No., Landmark, Construction Site, Street..."
                        className={`${inpClass} resize-none`}
                      />
                    </div>

                    {/* Optional GPS Button */}
                    <div className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-dashed ${isDark ? "border-zinc-700 bg-zinc-800/30" : "border-sky-300/60 bg-sky-50/60"}`}>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[var(--brand-blue)] flex-shrink-0" />
                        <span className="text-xs font-medium">Auto-fill via GPS location <span className={muted}>(optional)</span></span>
                      </div>
                      <button
                        type="button"
                        onClick={requestLocation}
                        disabled={locationStatus === "loading"}
                        className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--brand-blue)] text-slate-950 hover:bg-sky-400 disabled:opacity-60 transition-all cursor-pointer"
                      >
                        {locationStatus === "loading" ? "Detecting…" : locationStatus === "success" ? "✓ GPS Captured" : "Detect GPS"}
                      </button>
                    </div>

                    <label className="flex items-center gap-2.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveAddressToProfile}
                        onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                        className="w-4 h-4 rounded accent-[var(--brand-blue)] cursor-pointer"
                      />
                      Save this address to my profile for future orders
                    </label>
                  </div>
                )}
              </div>

              {/* 4. PREFERRED DATE & NOTES */}
              <div className={`p-6 rounded-3xl border ${card}`}>
                <h2 className="text-base font-black mb-4 flex items-center gap-2">
                  <span className="text-[var(--brand-blue)]">📅</span>
                  4. Preferred Delivery &amp; Notes
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-wider mb-1.5 ${muted}`}>Required Delivery Date (optional)</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      max="9999-12-31"
                      suppressHydrationWarning
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase tracking-wider mb-1.5 ${muted}`}>Site Instructions / Requirements (optional)</label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Special instructions for truck access, unloading labor, supervisor contact..."
                      className={`${inpClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* 5. WALLET REDEMPTION */}
              {walletBalance > 0 && (
                <div className={`p-6 rounded-3xl border ${isDark ? "bg-emerald-950/20 border-emerald-800/30" : "bg-emerald-50/60 border-emerald-200"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Wallet size={20} className="text-emerald-500" />
                      <div>
                        <p className="text-sm font-black">MT-Boss Cashback Wallet</p>
                        <p className={`text-xs ${muted}`}>Available Balance: ₹{walletBalance.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-bold text-emerald-600">Redeem</span>
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
                      />
                    </label>
                  </div>
                  {useWallet && walletPreview && (
                    <div className="mt-4 pt-3 border-t border-emerald-200/50 flex flex-wrap items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${muted}`}>Redeem Amount (₹)</label>
                        <input
                          type="number"
                          min="0"
                          max={walletPreview.maxAllowed}
                          value={walletAmount}
                          onChange={(e) => setWalletAmount(e.target.value)}
                          placeholder={`Max ₹${walletPreview.maxAllowed}`}
                          className={inpClass}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setWalletAmount(String(walletPreview.maxAllowed))}
                        className="self-end px-4 py-2.5 rounded-xl text-xs font-black bg-emerald-600 text-white hover:bg-emerald-500 transition-all cursor-pointer"
                      >
                        Use Max ₹{walletPreview.maxAllowed}
                      </button>
                    </div>
                  )}
                  {useWallet && walletLoading && <p className={`text-xs mt-2 ${muted}`}>Checking redemption limit...</p>}
                </div>
              )}

              {/* SUBMIT ERROR */}
              {submitError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
                  ⚠️ {submitError}
                </div>
              )}

              {/* CONFIRM ORDER BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[var(--brand-blue)] to-sky-400 hover:from-sky-400 hover:to-[var(--brand-blue)] text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-sky-500/20 active:scale-[0.98] disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap size={18} className="fill-slate-950" />
                {submitting ? "Placing Order…" : "Confirm & Place Order →"}
              </button>
              <p className={`text-xs text-center ${muted}`}>
                Orders are verified by official MT-Boss suppliers. Official GST invoice provided upon site delivery.
              </p>
            </form>
          </div>

          {/* ──────────────────────────────────────────────────────────
              RIGHT: ORDER SUMMARY (Sticky Sidebar)
             ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className={`lg:sticky lg:top-24 p-6 rounded-3xl border space-y-5 ${card}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>Order Summary</p>

              {/* Single product or cart items */}
              {product ? (
                <div>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden relative bg-slate-100 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center">
                      {productImage ? (
                        <ShopImage src={productImage} alt={product.name} fill sizes="80px" className="object-cover" />
                      ) : (
                        <Package size={28} className={muted} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm leading-snug">{product.name}</p>
                      {product.brand && <p className={`text-xs mt-0.5 ${muted}`}>{product.brand}</p>}
                      <p className={`text-xs mt-0.5 ${muted}`}>{product.category}</p>
                      <Link href={`/ShopNow/${product.id}`} className="text-xs text-[var(--brand-blue)] hover:underline mt-1 inline-block">
                        Change quantity or product →
                      </Link>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
                    <span className="text-xs font-bold uppercase tracking-wider">Quantity</span>
                    <div className={`inline-flex items-center rounded-xl border p-1 ${isDark ? "border-zinc-700 bg-zinc-800" : "border-slate-200 bg-slate-50"}`}>
                      <button
                        type="button"
                        onClick={() => setQty((q) => Math.max(1, q - (getCartStep(product) || 1)))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={qty}
                        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-12 text-center font-black text-xs bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQty((q) => q + (getCartStep(product) || 1))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <p className={`text-[11px] ${muted} mt-1 text-right`}>{displayUnit(product.unit)} per unit</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((ci, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-slate-100 dark:border-zinc-800">
                      <div>
                        <p className="font-bold">{ci.product?.name}</p>
                        <p className={muted}>{ci.quantity} {displayUnit(ci.product?.unit)}</p>
                      </div>
                      <span className="font-black">₹{((Number(ci.product?.price) || 0) * ci.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div className={`space-y-2.5 p-4 rounded-2xl ${isDark ? "bg-zinc-800/40" : "bg-slate-50"}`}>
                <div className="flex justify-between text-xs">
                  <span className={muted}>Items Subtotal</span>
                  <span className="font-bold">{itemsSubtotal > 0 ? `₹${itemsSubtotal.toLocaleString("en-IN")}` : "On Quote"}</span>
                </div>
                {shippingQuote?.totalShipping !== undefined && shippingQuote?.totalShipping !== null && (
                  <div className="flex justify-between text-xs">
                    <span className={muted}>Delivery Charges ({selectedCity || "City"})</span>
                    <span className="font-bold">₹{Number(shippingQuote.totalShipping).toLocaleString("en-IN")}</span>
                  </div>
                )}
                {walletDeduct > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-bold">
                    <span>Wallet Deduction</span>
                    <span>-₹{walletDeduct.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className={`flex justify-between text-base font-black pt-3 border-t ${border}`}>
                  <span>Payable Grand Total</span>
                  <span className="text-[var(--brand-blue)]">
                    {grandTotal > 0 ? `₹${grandTotal.toLocaleString("en-IN")}` : "Price on Confirmation"}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className={`grid grid-cols-3 gap-2 pt-3 border-t ${border} text-center`}>
                <div>
                  <ShieldCheck size={20} className="text-emerald-500 mx-auto mb-1" />
                  <p className="text-[10px] font-bold">100% Verified</p>
                </div>
                <div>
                  <Truck size={20} className="text-[var(--brand-blue)] mx-auto mb-1" />
                  <p className="text-[10px] font-bold">Direct Site Delivery</p>
                </div>
                <div>
                  <BadgePercent size={20} className="text-amber-500 mx-auto mb-1" />
                  <p className="text-[10px] font-bold">2% Cashback</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
