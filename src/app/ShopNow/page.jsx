"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useCities } from "@/hooks/useCities";
import Storefront, { displayUnit } from "./Storefront";
import { defaultShopStorefront } from "@/lib/shop-storefront-defaults";
// Dark-mode watcher
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
// ── Inline SVG icons ──────────────────────────────────────────────────────────
const X = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// ── Thin section divider used inside the modal ────────────────────────────────
function SectionLabel({ children, isDark }) {
  return (
    <div className={`flex items-center gap-2 my-3 ${isDark ? "text-zinc-500" : "text-gray-400"}`}>
      <div className={`flex-1 h-px ${isDark ? "bg-zinc-800" : "bg-gray-200"}`} />
      <span className="text-[9px] font-extrabold uppercase tracking-widest">{children}</span>
      <div className={`flex-1 h-px ${isDark ? "bg-zinc-800" : "bg-gray-200"}`} />
    </div>
  );
}

function getUnitPrice(product, quantity = 1) {
  const basePrice = Number(product?.price);
  if (!Number.isFinite(basePrice) || basePrice <= 0) return 0;
  const tier = (product?.bulk_pricing || [])
    .filter((entry) => quantity >= Number(entry.min_quantity))
    .sort((a, b) => Number(b.min_quantity) - Number(a.min_quantity))[0];
  return tier ? Number(tier.price) : basePrice;
}

function getQuotePrice(category, selectedCity) {
  if (!category) return null;
  const cityPrices = category.city_prices && typeof category.city_prices === 'object'
    ? category.city_prices
    : {};
  const cityEntry = selectedCity
    ? Object.entries(cityPrices).find(([city]) => city.trim().toLowerCase() === selectedCity.trim().toLowerCase())
    : null;
  const cityRange = String(cityEntry?.[1]?.price_range || '').trim();
  const generalRange = String(category.price_range || '').trim();
  const range = cityRange || generalRange;
  if (!range) return null;

  const unit = displayUnit(cityEntry?.[1]?.unit || category.unit, '');
  const normalizedRange = range.replace(/(\d)\s*-\s*(?=\d)/g, '$1–');
  const withCurrency = /₹|\b(?:rs\.?|inr)\b/i.test(normalizedRange)
    ? normalizedRange
    : `₹${normalizedRange}`;
  const display = unit && !withCurrency.toLowerCase().includes(unit.toLowerCase())
    ? `${withCurrency}/${unit}`
    : withCurrency;

  return {
    display,
    unit,
    label: cityRange ? selectedCity : 'General',
  };
}

export default function ShopPage() {
  const isDarkMode = useDarkMode();
  const { cities: supportedCities } = useCities();

  // ── category list ──────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [storeContent, setStoreContent] = useState(defaultShopStorefront);
  const [cart, setCart] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const [modalMode, setModalMode] = useState("quote");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("mtboss-shop-cart") || "[]");
      if (Array.isArray(saved)) setCart(saved.filter((item) => (
        item?.product?.id
        && Number(item.product.price) > 0
        && Number.isInteger(item.quantity)
        && item.quantity > 0
      )));
    } catch { /* Ignore stale cart data. */ }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (cartReady) localStorage.setItem("mtboss-shop-cart", JSON.stringify(cart));
  }, [cart, cartReady]);

  useEffect(() => {
    fetch("/api/shop-categories")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .catch(console.error)
      .finally(() => setCatsLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/shop-material-options")
      .then((response) => response.json())
      .then((data) => { if (data.success) setAllProducts(data.data?.products || []); })
      .catch(console.error)
      .finally(() => setProductsLoaded(true));
  }, []);

  useEffect(() => {
    if (!cartReady || !productsLoaded || !categories.length) return;
    setCart((previous) => previous.flatMap((item) => {
      if (!item.product?.product_id) return [];
      const current = allProducts.find((product) => product.id === item.product.product_id);
      const category = categories.find((entry) => entry.name.toLowerCase() === current?.category?.toLowerCase())
        || categories.find((entry) => current?.name?.toLowerCase().includes(entry.name.toLowerCase()));
      if (!current || !category || Number(current.price) <= 0 || Number(current.quantity) < 1) return [];
      return [{ product: { ...item.product, ...current, category, image: current.image_url, fromSupplier: true, product_id: current.id }, quantity: Math.min(item.quantity, current.quantity) }];
    }));
  }, [allProducts, cartReady, categories, productsLoaded]);

  useEffect(() => {
    fetch("/api/shop-storefront")
      .then((response) => response.json())
      .then((data) => { if (data.success) setStoreContent(data.data); })
      .catch(console.error);
  }, []);

  // ── modal state ────────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitted, setSubmitted]           = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [submitting, setSubmitting]         = useState(false);
  const [submitError, setSubmitError]       = useState("");
  const [mounted, setMounted]               = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isModalOpen) return undefined;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isModalOpen]);

  // Contact / delivery fields
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", quantity: "", address: "", message: "",
  });

  // Material-specific fields
  const [materialType, setMaterialType]         = useState("");   // chosen from dropdown
  const [customType, setCustomType]             = useState("");   // free-text if "Others"
  const [subcategoryVal, setSubcategoryVal]     = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [orderUnit, setOrderUnit]               = useState("");
  const [productOptions, setProductOptions]     = useState({ products: [], types: [], units: [] });
  const [loadingProductOptions, setLoadingProductOptions] = useState(false);
  const [brandCompany, setBrandCompany]         = useState("");
  const [deliveryDate, setDeliveryDate]         = useState("");

  // City selection
  const [selectedCity, setSelectedCity] = useState("");
  const [cityError, setCityError] = useState("");
  const [cityVerified, setCityVerified] = useState(false);
  const [checkingCity, setCheckingCity] = useState(false);

  // GPS
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationCoords, setLocationCoords] = useState(null);
  const [locationError, setLocationError] = useState("");

  // ── helpers ────────────────────────────────────────────────────────────────
  const dynamicTypes = productOptions.types || [];
  const dynamicUnits = productOptions.units || [];
  const catTypes    = (dynamicTypes.length > 0 ? dynamicTypes : (selectedCategory?.types || [])).filter(Boolean);
  const catSubs     = (selectedCategory?.subcategories || []).filter(Boolean);
  const hasTypes    = catTypes.length > 0;
  const hasSubs     = catSubs.length  > 0;
  const categoryUnits = [
    ...dynamicUnits,
    selectedCategory?.unit || '',
    'bag',
    'bags',
    'pcs',
    'kg',
    'quintal',
    'box',
    'bundle',
    'cft',
    'ton',
    'meter',
  ].map((u) => String(u || '').trim()).filter(Boolean);
  const unitOptions = [...new Set(categoryUnits)];

  const openModal = (category, product = null, mode = "quote") => {
    setModalMode(mode);
    setSelectedCategory(category);
    setSelectedProduct(product);
    setSubmitted(false);
    setSubmittedOrder(null);
    setSubmitError("");
    setCityError("");
    setCityVerified(false);
    setFormData({ name: "", email: "", phone: "", quantity: product && mode !== "cart" ? "1" : "", address: "", message: "" });
    setMaterialType(product?.name || "");
    setCustomType(product?.name || "");
    setSubcategoryVal("");
    setCustomSubcategory("");
    setOrderUnit(product?.unit || "");
    setProductOptions({ products: [], types: [], units: [] });
    setBrandCompany("");
    setDeliveryDate("");
    setLocationStatus("idle");
    setLocationCoords(null);
    setLocationError("");
    setIsModalOpen(true);
  };

  const addToCart = (product) => {
    if (!(Number(product?.price) > 0)) return;
    setCart((previous) => {
      const existing = previous.find((item) => item.product.id === product.id);
      const limit = product.fromSupplier ? Math.max(0, Number(product.quantity) || 0) : 10000;
      if (limit === 0) return previous;
      if (existing) return previous.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, limit, 10000) } : item);
      if (previous.length >= 20) return previous;
      return [...previous, { product, quantity: 1 }];
    });
  };

  const changeCartQuantity = (id, delta) => setCart((previous) => previous
    .map((item) => item.product.id === id ? { ...item, quantity: Math.max(0, Math.min(item.product.fromSupplier ? Math.max(0, Number(item.product.quantity) || 0) : 10000, 10000, item.quantity + delta)) } : item)
    .filter((item) => item.quantity > 0));

  const openCartCheckout = () => {
    if (!cart.length) return;
    openModal(cart[0].product.category, null, "cart");
  };

  useEffect(() => {
    if (!isModalOpen || !selectedCategory?.name) return;
    setLoadingProductOptions(true);
    fetch(`/api/shop-material-options?category=${encodeURIComponent(selectedCategory.name)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProductOptions(data.data || { products: [], types: [], units: [] });
      })
      .catch(console.error)
      .finally(() => setLoadingProductOptions(false));
  }, [selectedCategory?.name, isModalOpen]);

  const fillAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await response.json();
      if (data.display_name) {
        setFormData((prev) => ({
          ...prev,
          address: prev.address?.trim() ? prev.address : data.display_name,
        }));
      }
    } catch {
      // Keep the captured coordinates even if reverse geocoding is unavailable.
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationStatus("loading");
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocationCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocationStatus("success");
        await fillAddressFromCoords(pos.coords.latitude, pos.coords.longitude);
      },
      // A normal browser location is still useful for delivery when precise GPS is unavailable.
      () => navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setLocationCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          setLocationStatus("success");
          await fillAddressFromCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setLocationStatus("error");
          setLocationError("Could not access location. Please allow GPS permission and try again.");
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
      ),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const retryLocation = requestLocation;

  const checkCityAvailability = async (cityVal) => {
    if (!cityVal) {
      setCityError("Please select a city");
      return false;
    }
    
    setCheckingCity(true);
    setCityError("");
    setCityVerified(false);
    try {
      const categoryNames = modalMode === "cart"
        ? [...new Set(cart.map((item) => item.product.category.name))]
        : [selectedCategory?.name];
      const checks = await Promise.all(categoryNames.map(async (name) => {
        const res = await fetch(`/api/pincode-check?city=${encodeURIComponent(cityVal)}&type=category&name=${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error("Could not check city availability");
        return { name, data: await res.json() };
      }));
      const unavailable = checks.find((check) => !check.data.available);
      if (unavailable) {
        setCityError(unavailable.data.message || `${unavailable.name} is not available in ${cityVal}`);
        setCheckingCity(false);
        return false;
      }
      setCityError("");
      setCityVerified(true);
      setCheckingCity(false);
      return true;
    } catch (error) {
      setCityError("Error checking city availability");
      setCheckingCity(false);
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const rawDigits = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, phone: rawDigits && /^[6-9]/.test(rawDigits) ? rawDigits.slice(0, 10) : '' }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    // Resolve final type & subcategory values
    const finalType     = hasTypes ? (materialType === "Others" ? customType.trim() : materialType) : (customType.trim() || materialType.trim());
    const finalSubcat   = subcategoryVal   === "Others" ? customSubcategory.trim() : subcategoryVal;

    // Check city availability first
    const isCityAvailable = await checkCityAvailability(selectedCity);
    if (!isCityAvailable) {
      setSubmitting(false);
      return;
    }

    if (deliveryDate) {
      const year = new Date(deliveryDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (year < currentYear || year > 9999 || isNaN(year)) {
        setSubmitError("Please enter a valid delivery date.");
        setSubmitting(false);
        return;
      }
    }

    if (!locationCoords?.latitude || !locationCoords?.longitude) {
      setSubmitError("Please click 'Get Live Location' before submitting this material enquiry.");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login as a customer before placing an order so you can track it.");
      }
      const payload = {
          order_intent:    modalMode,
          user_name:       formData.name,
          user_phone:      formData.phone,
          user_email:      formData.email,
          delivery_date:   deliveryDate || null,
          delivery_address: formData.address,
          latitude:        locationCoords?.latitude  || null,
          longitude:       locationCoords?.longitude || null,
          message:         formData.message || null,
          selected_city:   selectedCity,
      };
      if (modalMode === "cart") {
        payload.items = cart.map((item) => ({
          product_id: item.product.product_id || null,
          category_name: item.product.category.name,
          category_emoji: item.product.category.emoji || "",
          material_type: item.product.name,
          quantity: item.quantity,
          order_unit: item.product.unit || "pcs",
        }));
      } else {
        Object.assign(payload, {
          product_id:   selectedProduct?.product_id || null,
          category_name:   selectedCategory?.name,
          category_emoji:  selectedCategory?.emoji || '',
          material_type:   finalType || null,
          subcategory_name: finalSubcat || null,
          brand_company:   brandCompany.trim() || null,
          quantity_text:   formData.quantity && orderUnit ? `${formData.quantity} ${orderUnit}` : formData.quantity || null,
          order_unit:      orderUnit || null,
        });
      }
      const res = await fetch("/api/material-enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to submit enquiry");
      setSubmittedOrder(data.data);
      if (modalMode === "cart") setCart([]);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── theme tokens ───────────────────────────────────────────────────────────
  const pageBg     = isDarkMode ? "bg-zinc-950"    : "bg-gray-50";
  const headText   = isDarkMode ? "text-white"     : "text-gray-900";
  const subText    = isDarkMode ? "text-zinc-400"  : "text-gray-500";
  const inputCls   = isDarkMode
    ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--brand-blue-light)]"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[var(--brand-blue-light)]";
  const selectCls  = isDarkMode
    ? "bg-zinc-800 border-zinc-700 text-white focus:border-[var(--brand-blue-light)]"
    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[var(--brand-blue-light)]";
  const labelText  = isDarkMode ? "text-zinc-300"  : "text-gray-700";
  const modalBg    = isDarkMode ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-100";
  const modalHead  = isDarkMode ? "border-zinc-800" : "border-gray-100";

  // shared input class
  const inp = `w-full px-3 py-2 rounded-lg border-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand-blue-lighter)] transition-all ${inputCls}`;
  const sel = `w-full px-3 py-2 rounded-lg border-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand-blue-lighter)] transition-all ${selectCls}`;
  const lbl = `block text-[10px] font-bold mb-1 ${labelText} uppercase tracking-wide`;
  const selectedQuantity = Math.max(1, Number.parseInt(formData.quantity, 10) || 1);
  const selectedUnitPrice = getUnitPrice(selectedProduct, selectedQuantity);
  const selectedProductTotal = selectedUnitPrice * selectedQuantity;
  const cartProductTotal = cart.reduce((sum, item) => sum + getUnitPrice(item.product, item.quantity) * item.quantity, 0);
  const quotePrice = getQuotePrice(selectedCategory, selectedCity);

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-300`}>

      <Storefront categories={categories} products={allProducts} content={storeContent} loading={catsLoading} cities={supportedCities} selectedCity={selectedCity} setSelectedCity={setSelectedCity} cart={cart} onAdd={addToCart} onChangeQty={changeCartQuantity} onQuote={(product) => openModal(product.category, product, "quote")} onBuy={(product) => openModal(product.category, product, "buy")} onCheckout={openCartCheckout} />

      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black/70 p-2 backdrop-blur-sm sm:p-4" style={{ zIndex: 99999 }}>
          <div className={`${modalBg} flex max-h-[calc(100dvh-1rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border shadow-2xl sm:max-h-[calc(100dvh-2rem)]`}>

            {/* Modal Header */}
            <div className={`sticky top-0 z-20 flex flex-none items-center justify-between gap-4 border-b px-4 py-3 sm:px-6 ${modalHead} ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
              <div className="min-w-0">
                <p className="mb-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--brand-blue)]">{modalMode === "quote" ? "Get Quote" : "Checkout"}</p>
                <h2 className={`truncate text-base font-extrabold sm:text-lg ${headText}`}>
                  {modalMode === "cart"
                    ? (submitted ? "Cart order placed" : `Your cart (${cart.length} materials)`)
                    : (selectedProduct?.name || selectedCategory?.name)}
                </h2>
                {modalMode !== "cart" && selectedProduct?.name && (
                  <p className={`mt-0.5 truncate text-[10px] font-semibold ${subText}`}>{selectedCategory?.emoji || "📦"} {selectedCategory?.name}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={`flex h-9 w-9 flex-none items-center justify-center rounded-full transition-all ${isDarkMode ? "text-zinc-400 hover:bg-zinc-800 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center overflow-y-auto">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-blue)] text-2xl text-gray-950">
                  ✓
                </div>
                <h3 className={`text-xl font-black ${headText}`}>{modalMode === "quote" ? "Quote requested" : "Order placed"}</h3>
                <p className={`mt-2 text-sm ${subText}`}>
                  {modalMode === "quote"
                    ? "Your requirement has been received. A supplier will share a price quote for it."
                    : "Your order has been received and will be confirmed by the supplier within 24 to 48 hours."}
                </p>
                {submittedOrder?.order_reference && (
                  <p className={`mt-3 text-xs font-black uppercase tracking-wider ${headText}`}>
                    Order ID: {submittedOrder.order_reference}
                  </p>
                )}
                {submittedOrder?.orders?.length > 0 && (
                  <div className={`mt-3 text-xs ${headText}`}>
                    {submittedOrder.orders.map((order) => <p key={order.id} className="mt-1"><strong>{order.material_type}</strong> — {order.order_reference}</p>)}
                  </div>
                )}
                <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                  <Link
                    href="/material-orders?role=user"
                    className="rounded-lg bg-[var(--brand-blue)] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-gray-950"
                  >
                    Track this order
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={`rounded-lg border px-5 py-2.5 text-xs font-black uppercase tracking-wider ${isDarkMode ? "border-zinc-700 text-zinc-300" : "border-zinc-300 text-zinc-700"}`}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 font-sans sm:px-6">
                <div className="mb-4">
                  <label className={lbl}>Delivery City *</label>
                  <div className="flex gap-2 items-end">
                    <select
                      className={`flex-1 ${sel}`}
                      value={selectedCity}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedCity(val);
                        setCityVerified(false);
                        if (val && selectedCategory) {
                          checkCityAvailability(val);
                        } else {
                          setCityError("");
                        }
                      }}
                    >
                      <option value="">Select a city</option>
                      {supportedCities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {selectedCity && (
                      <button
                        type="button"
                        onClick={() => checkCityAvailability(selectedCity)}
                        disabled={checkingCity}
                        className={`px-4 py-2 text-xs font-bold ${checkingCity ? 'opacity-50 cursor-wait' : ''} bg-[var(--brand-blue)] text-gray-900 rounded-lg transition-all`}
                      >
                        {checkingCity ? 'Checking...' : 'Verify'}
                      </button>
                    )}
                  </div>
                  {cityError && (
                    <p className={`text-[9px] mt-1 ${cityError.includes('not available') ? 'text-red-500' : 'text-amber-500'}`}>
                      ⚠ {cityError}
                    </p>
                  )}
                  {!cityError && cityVerified && selectedCity && (
                    <p className="text-[9px] mt-1 text-green-500">✓ Material available in this city</p>
                  )}
                  <p className={`text-[9px] mt-0.5 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>
                    Required to check supplier availability and delivery.
                  </p>
                </div>

                {/* ── CITY VERIFICATION STATUS ─────────────────────── */}
                {selectedCity && cityVerified && !cityError && (
                  <div className={`rounded-xl border-2 px-4 py-3 mb-4 flex items-center justify-between ${isDarkMode ? "border-green-600 bg-green-900/20" : "border-green-500 bg-green-50"}`}>
                    <div>
                      <p className={`text-[9px] font-extrabold uppercase tracking-widest mb-0.5 ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                        ✓ Material Available
                      </p>
                      <p className={`text-base font-black ${isDarkMode ? "text-green-300" : "text-green-800"}`}>
                        {selectedCity}
                      </p>
                    </div>
                  </div>
                )}

                {modalMode === "cart" ? (
                  <div className={`rounded-xl border px-4 py-3 mb-4 ${isDarkMode ? "border-zinc-700 bg-zinc-800" : "border-gray-200 bg-gray-50"}`}>
                    <p className={`text-xs font-bold mb-2 ${headText}`}>Materials in your order</p>
                    {cart.map((item) => {
                      const itemUnitPrice = getUnitPrice(item.product, item.quantity);
                      return <p key={item.product.id} className={`text-xs py-1 ${subText}`}>{item.product.name} · {item.quantity} {displayUnit(item.product.unit)} · ₹{(itemUnitPrice * item.quantity).toLocaleString("en-IN")}</p>;
                    })}
                    <div className={`mt-2 flex items-center justify-between border-t pt-2 ${isDarkMode ? "border-zinc-700" : "border-gray-200"}`}>
                      <span className={`text-xs font-bold ${headText}`}>Product total</span>
                      <strong className={`text-sm ${headText}`}>₹{cartProductTotal.toLocaleString("en-IN")}</strong>
                    </div>
                    <p className={`text-[10px] mt-2 ${subText}`}>Delivery charges, if applicable, are confirmed separately.</p>
                  </div>
                ) : <>
                {modalMode === "buy" ? (
                  <div className={`rounded-xl border px-4 py-3 mb-4 ${isDarkMode ? "border-zinc-700 bg-zinc-800" : "border-gray-200 bg-gray-50"}`}>
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${subText}`}>Order pricing</p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className={`text-sm font-bold ${headText}`}>₹{selectedUnitPrice.toLocaleString("en-IN")} / {displayUnit(selectedProduct?.unit)}</p>
                      <p className={`text-sm font-black ${headText}`}>Total: ₹{selectedProductTotal.toLocaleString("en-IN")}</p>
                    </div>
                    <p className={`text-[10px] mt-1 ${subText}`}>Product price is fixed for the selected quantity. Delivery charges, if applicable, are confirmed separately.</p>
                  </div>
                ) : (
                  quotePrice ? (
                    <div className={`mb-4 flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 ${isDarkMode ? "border-zinc-700 bg-zinc-800" : "border-gray-200 bg-gray-50"}`}>
                      <div className="min-w-0">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${subText}`}>Indicative Price Range</p>
                        <p className={`mt-1 text-xl font-black leading-tight ${headText}`}>{quotePrice.display}</p>
                        {quotePrice.unit && <p className={`mt-1 text-xs ${subText}`}>{quotePrice.unit}</p>}
                      </div>
                      <span className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-black ${isDarkMode ? "bg-zinc-700 text-zinc-300" : "bg-gray-200 text-gray-500"}`}>
                        {quotePrice.label}
                      </span>
                    </div>
                  ) : (
                    <div className={`rounded-xl border px-4 py-3 mb-4 ${isDarkMode ? "border-zinc-700 bg-zinc-800" : "border-gray-200 bg-gray-50"}`}>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${subText}`}>Get Quote</p>
                      <p className={`text-xs font-semibold mt-1 ${headText}`}>Price will be shared by a verified supplier.</p>
                      <p className={`text-[10px] mt-1 ${subText}`}>The final quote depends on quantity, specification and delivery location{selectedCity ? ` in ${selectedCity}` : ""}.</p>
                    </div>
                  )
                )}

                {/* ── SECTION 1 — Material Details ───────────────────── */}
                <SectionLabel isDark={isDarkMode}>📦 Material Details</SectionLabel>

                {loadingProductOptions && (
                  <p className={`text-[10px] font-semibold mb-2 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>
                    Loading uploaded product options...
                  </p>
                )}

                {/* Material Type */}
                {hasTypes && (
                  <div className="mb-3">
                    <label className={lbl}>Type of Material *</label>
                    <select
                      value={materialType}
                      onChange={(e) => { setMaterialType(e.target.value); setCustomType(""); }}
                      required
                      className={sel}
                    >
                      <option value="">— Select type —</option>
                      {catTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                      <option value="Others">Others (specify below)</option>
                    </select>
                    {dynamicTypes.length > 0 && (
                      <p className={`text-[9px] mt-0.5 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>
                        Options are coming from uploaded products.
                      </p>
                    )}
                  </div>
                )}

                {/* Custom type input */}
                {(materialType === "Others" || !hasTypes) && (
                  <div className="mb-3">
                    <label className={lbl}>{hasTypes ? "Specify Material Type *" : "Type of Material"}</label>
                    <input
                      type="text"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      required={!hasTypes}
                      placeholder={`e.g. special grade ${selectedCategory?.name || "material"}`}
                      className={inp}
                    />
                  </div>
                )}

                {/* Subcategory (only if subcategories are defined) */}
                {hasSubs && (
                  <div className="mb-3">
                    <label className={lbl}>Sub-category</label>
                    <select
                      value={subcategoryVal}
                      onChange={(e) => { setSubcategoryVal(e.target.value); setCustomSubcategory(""); }}
                      className={sel}
                    >
                      <option value="">— Select sub-category (optional) —</option>
                      {catSubs.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                      <option value="Others">Others (specify below)</option>
                    </select>
                  </div>
                )}

                {/* Custom subcategory */}
                {subcategoryVal === "Others" && (
                  <div className="mb-3">
                    <label className={lbl}>Specify Sub-category *</label>
                    <input
                      type="text"
                      value={customSubcategory}
                      onChange={(e) => setCustomSubcategory(e.target.value)}
                      required
                      placeholder="Describe the sub-category"
                      className={inp}
                    />
                  </div>
                )}

                {/* Brand / Company */}
                <div className="mb-3">
                  <label className={lbl}>Brand / Company Name</label>
                  <input
                    type="text"
                    value={brandCompany}
                    onChange={(e) => setBrandCompany(e.target.value)}
                    placeholder={`e.g. Ultratech, JSW, ACC`}
                    className={inp}
                  />
                  <p className={`text-[9px] mt-0.5 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>
                    Leave blank if any brand is acceptable
                  </p>
                </div>
                </>}

                {/* ── SECTION 2 — Contact Details ────────────────────── */}
                <SectionLabel isDark={isDarkMode}>👤 Your Details</SectionLabel>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={lbl}>Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your name" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+91 XXXXX" className={inp} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className={lbl}>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="your@email.com" className={inp} />
                </div>

                {/* ── SECTION 3 — Quantity & Delivery ───────────────── */}
                <SectionLabel isDark={isDarkMode}>🚚 Quantity & Delivery</SectionLabel>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  {modalMode !== "cart" && <>
                  <div>
                    <label className={lbl}>Quantity Required *</label>
                    <input type="number" min={modalMode === "buy" ? "1" : "0.01"} max={modalMode === "buy" ? "10000" : "100000000"} step={modalMode === "buy" ? "1" : "any"} name="quantity" value={formData.quantity} onChange={handleInputChange} required placeholder="e.g. 500" className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>SKU / Unit</label>
                    <select
                      value={orderUnit}
                      onChange={(e) => setOrderUnit(e.target.value)}
                      className={sel}
                      required={Boolean(formData.quantity)}
                    >
                      <option value="">Select unit</option>
                      {unitOptions.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                  </>}
                  <div>
                    <label className={lbl}>Delivery Needed By</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      max="9999-12-31"
                      className={inp}
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mb-3">
                  <label className={lbl}>🏠 Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    placeholder="Full delivery address (plot no., street, city, state, PIN)"
                    className={`${inp} resize-none`}
                  />
                </div>

                {/* ── SECTION 4 — GPS Location ────────────────────────── */}
                <SectionLabel isDark={isDarkMode}>📍 Live Location</SectionLabel>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                      Share your location for faster supplier matching
                    </span>
                    {locationStatus === "success" && (
                      <button type="button" onClick={retryLocation}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${isDarkMode ? "border-zinc-600 text-zinc-300 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue-light)]" : "border-gray-300 text-gray-500 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue-deep)]"}`}>
                        🔄 Retry
                      </button>
                    )}
                  </div>

                  {(locationStatus === "idle" || locationStatus === "error") && (
                    <button
                      type="button"
                      onClick={retryLocation}
                      className={`w-full py-2.5 px-3 mb-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                        isDarkMode
                          ? "border-[var(--brand-blue)] text-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/10"
                          : "border-zinc-900 text-zinc-900 hover:bg-zinc-100"
                      }`}
                    >
                      {locationStatus === "error" ? "Try Again - Get Live Location" : "Get Live Location"}
                    </button>
                  )}

                  {locationStatus === "loading" && (
                    <div className={`flex items-center gap-2 px-3 py-3 rounded-lg border ${isDarkMode ? "border-[var(--brand-blue-deeper)] bg-[var(--brand-blue-ink)]/10" : "border-[var(--brand-blue-lighter)] bg-sky-50"}`}>
                      <svg className="w-3.5 h-3.5 animate-spin text-[var(--brand-blue)] flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span className={`text-[10px] font-bold ${isDarkMode ? "text-[var(--brand-blue-light)]" : "text-[var(--brand-blue-deep)]"}`}>
                        Fetching your GPS location…
                      </span>
                    </div>
                  )}

                  {locationStatus === "success" && locationCoords && (
                    <div className={`rounded-lg border overflow-hidden ${isDarkMode ? "border-green-700" : "border-green-400"}`}>
                      <iframe
                        title="Your Live Location"
                        width="100%" height="130"
                        style={{ border: 0, display: "block" }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${locationCoords.latitude},${locationCoords.longitude}&z=16&output=embed`}
                      />
                      <div className={`flex items-center justify-between px-3 py-1.5 ${isDarkMode ? "bg-green-900/20" : "bg-green-50"}`}>
                        <span className={`text-[10px] font-mono font-bold ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                          ✅ {locationCoords.latitude.toFixed(5)}, {locationCoords.longitude.toFixed(5)}
                        </span>
                        <a href={`https://www.google.com/maps?q=${locationCoords.latitude},${locationCoords.longitude}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-[10px] font-bold text-[var(--brand-blue)] hover:underline">
                          Open in Maps →
                        </a>
                      </div>
                    </div>
                  )}

                  {locationStatus === "error" && (
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${isDarkMode ? "border-red-700 bg-red-900/20" : "border-red-300 bg-red-50"}`}>
                      <span className="text-red-500 text-xs flex-shrink-0">⚠️</span>
                      <p className={`text-[10px] font-bold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                        Location access denied. Allow permission in browser settings &amp; press Retry.
                      </p>
                    </div>
                  )}
                </div>

                {/* ── SECTION 5 — Additional Requirements ────────────── */}
                <SectionLabel isDark={isDarkMode}>📝 Additional Requirements</SectionLabel>

                <div className="mb-4">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe any specific requirements — grade, finish, packaging, site conditions, special instructions…"
                    className={`${inp} resize-none`}
                  />
                </div>

                {/* Error */}
                {submitError && (
                  <div className="text-xs text-red-500 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                    ⚠️ {submitError}
                    {submitError.toLowerCase().includes("login") && <Link href="/login" className="block mt-2 underline">Go to login</Link>}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[var(--brand-blue)] hover:bg-sky-500 disabled:opacity-60 text-gray-900 font-extrabold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-sm tracking-wide"
                >
                  {submitting ? "Submitting…" : modalMode === "quote" ? "Get Quote →" : "Place Order →"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-500 hover:bg-gray-100"}`}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
