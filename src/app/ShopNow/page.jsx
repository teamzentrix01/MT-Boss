"use client";

import { useState, useEffect } from "react";

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

const SUPPORTED_CITIES = ['Moradabad', 'Bareilly', 'Meerut', 'Noida', 'Delhi', 'Gurgaon', 'Haldwani', 'Dehradun'];

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const X = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const ArrowRight = ({ size = 13 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const Package = ({ size = 18 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const Zap = ({ size = 12 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const TrendingUp = ({ size = 18 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const Star = ({ size = 18 }) => (
  <svg width={size} height={size} fill="currentColor" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

const CITIES = [
  'Agra','Ahmedabad','Ajmer','Aligarh','Allahabad','Amritsar','Aurangabad',
  'Bangalore','Bareilly','Bhopal','Bhubaneswar','Chandigarh','Chennai',
  'Coimbatore','Dehradun','Delhi','Dhanbad','Faridabad','Ghaziabad',
  'Guwahati','Gwalior','Howrah','Hubli-Dharwad','Hyderabad','Indore',
  'Jabalpur','Jaipur','Jalandhar','Jodhpur','Kanpur','Kochi','Kolkata',
  'Kota','Lucknow','Ludhiana','Madurai','Mangalore','Meerut','Moradabad',
  'Mumbai','Mysore','Nagpur','Nashik','Noida','Patna','Pune','Raipur',
  'Rajkot','Ranchi','Srinagar','Surat','Thane','Thiruvananthapuram',
  'Varanasi','Vijayawada','Visakhapatnam','Vadodara',
];

export default function ShopPage() {
  const isDarkMode = useDarkMode();

  // ── category list ──────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shop-categories")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .catch(console.error)
      .finally(() => setCatsLoading(false));
  }, []);

  // ── modal state ────────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitted, setSubmitted]           = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [submitError, setSubmitError]       = useState("");

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
  const [checkingCity, setCheckingCity] = useState(false);

  // GPS
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationCoords, setLocationCoords] = useState(null);

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

  const openModal = (category) => {
    setSelectedCategory(category);
    setSubmitted(false);
    setSubmitError("");
    setSelectedCity("");
    setCityError("");
    setFormData({ name: "", email: "", phone: "", quantity: "", address: "", message: "" });
    setMaterialType("");
    setCustomType("");
    setSubcategoryVal("");
    setCustomSubcategory("");
    setOrderUnit("");
    setProductOptions({ products: [], types: [], units: [] });
    setBrandCompany("");
    setDeliveryDate("");
    setLocationStatus("loading");
    setLocationCoords(null);
    setIsModalOpen(true);
    // auto-fetch GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          setLocationStatus("success");
        },
        () => setLocationStatus("error"),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationStatus("error");
    }
  };

  useEffect(() => {
    if (!selectedCategory?.name) return;
    setLoadingProductOptions(true);
    fetch(`/api/shop-material-options?category=${encodeURIComponent(selectedCategory.name)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProductOptions(data.data || { products: [], types: [], units: [] });
      })
      .catch(console.error)
      .finally(() => setLoadingProductOptions(false));
  }, [selectedCategory?.name]);

  const retryLocation = () => {
    if (!navigator.geolocation) { setLocationStatus("error"); return; }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocationStatus("success");
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const checkCityAvailability = async (cityVal) => {
    if (!cityVal) {
      setCityError("Please select a city");
      return false;
    }
    
    setCheckingCity(true);
    setCityError("");
    try {
      const res = await fetch(`/api/pincode-check?city=${encodeURIComponent(cityVal)}&type=category&name=${selectedCategory?.name}`);
      const data = await res.json();
      
      if (!data.available) {
        setCityError(data.message || `Service not available in ${cityVal}`);
        setCheckingCity(false);
        return false;
      }
      setCityError("");
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
    const finalType     = hasTypes ? (materialType === "Others" ? customType.trim() : materialType) : customType.trim();
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

    try {
      const res = await fetch("/api/material-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name:       formData.name,
          user_phone:      formData.phone,
          user_email:      formData.email,
          category_name:   selectedCategory?.name,
          category_emoji:  selectedCategory?.emoji || '',
          material_type:   finalType   || null,
          subcategory_name: finalSubcat || null,
          brand_company:   brandCompany.trim() || null,
          quantity_text:   formData.quantity && orderUnit ? `${formData.quantity} ${orderUnit}` : formData.quantity || null,
          order_unit:      orderUnit || null,
          delivery_date:   deliveryDate || null,
          delivery_address: formData.address,
          latitude:        locationCoords?.latitude  || null,
          longitude:       locationCoords?.longitude || null,
          message:         formData.message || null,
          selected_city:   selectedCity,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to submit enquiry");
      setSubmitted(true);
      setTimeout(() => setIsModalOpen(false), 3500);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── theme tokens ───────────────────────────────────────────────────────────
  const pageBg     = isDarkMode ? "bg-zinc-950"    : "bg-gray-50";
  const cardBg     = isDarkMode ? "bg-zinc-900"    : "bg-white";
  const cardBorder = isDarkMode ? "border-zinc-800" : "border-gray-200";
  const headText   = isDarkMode ? "text-white"     : "text-gray-900";
  const subText    = isDarkMode ? "text-zinc-400"  : "text-gray-500";
  const divider    = isDarkMode ? "border-zinc-700" : "border-gray-100";
  const inputCls   = isDarkMode
    ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--brand-blue-light)]"
    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[var(--brand-blue-light)]";
  const selectCls  = isDarkMode
    ? "bg-zinc-800 border-zinc-700 text-white focus:border-[var(--brand-blue-light)]"
    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[var(--brand-blue-light)]";
  const labelText  = isDarkMode ? "text-zinc-300"  : "text-gray-700";
  const modalBg    = isDarkMode ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-100";
  const modalHead  = isDarkMode ? "border-zinc-800" : "border-gray-100";

  const labelStyles = {
    blue:   { bg: isDarkMode ? "bg-blue-900/40"   : "bg-blue-50",   text: isDarkMode ? "text-blue-300"   : "text-blue-600",   border: isDarkMode ? "border-blue-700"   : "border-blue-200"   },
    yellow: { bg: isDarkMode ? "bg-[var(--brand-blue-ink)]/40" : "bg-sky-50", text: isDarkMode ? "text-[var(--brand-blue-lighter)]" : "text-[var(--brand-blue-deep)]", border: isDarkMode ? "border-[var(--brand-blue-deeper)]" : "border-sky-200" },
    green:  { bg: isDarkMode ? "bg-green-900/40"  : "bg-green-50",  text: isDarkMode ? "text-green-300"  : "text-green-600",  border: isDarkMode ? "border-green-700"  : "border-green-200"  },
    purple: { bg: isDarkMode ? "bg-purple-900/40" : "bg-purple-50", text: isDarkMode ? "text-purple-300" : "text-purple-600", border: isDarkMode ? "border-purple-700" : "border-purple-200" },
    pink:   { bg: isDarkMode ? "bg-pink-900/40"   : "bg-pink-50",   text: isDarkMode ? "text-pink-300"   : "text-pink-600",   border: isDarkMode ? "border-pink-700"   : "border-pink-200"   },
    orange: { bg: isDarkMode ? "bg-orange-900/40" : "bg-orange-50", text: isDarkMode ? "text-orange-300" : "text-orange-600", border: isDarkMode ? "border-orange-700" : "border-orange-200" },
    amber:  { bg: isDarkMode ? "bg-[var(--brand-blue-ink)]/40"  : "bg-sky-50",  text: isDarkMode ? "text-[var(--brand-blue-lighter)]"  : "text-[var(--brand-blue-deep)]",  border: isDarkMode ? "border-[var(--brand-blue-deeper)]"  : "border-sky-200"  },
    cyan:   { bg: isDarkMode ? "bg-cyan-900/40"   : "bg-cyan-50",   text: isDarkMode ? "text-cyan-300"   : "text-cyan-600",   border: isDarkMode ? "border-cyan-700"   : "border-cyan-200"   },
  };

  const stats = [
    { icon: <Package size={18} />, value: "500+",  label: "Products"   },
    { icon: <TrendingUp size={18} />, value: catsLoading ? "…" : `${categories.length}`, label: "Categories" },
    { icon: <Zap size={18} />,     value: "24hr",  label: "Response"   },
    { icon: <Star size={18} />,    value: "4.9★",  label: "Rated"      },
  ];

  // shared input class
  const inp = `w-full px-3 py-2 rounded-lg border-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand-blue-lighter)] transition-all ${inputCls}`;
  const sel = `w-full px-3 py-2 rounded-lg border-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--brand-blue-lighter)] transition-all ${selectCls}`;
  const lbl = `block text-[10px] font-bold mb-1 ${labelText} uppercase tracking-wide`;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-300`}>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-zinc-950">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5 text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-blue)]/10 border border-[var(--brand-blue-light)]/30 text-[var(--brand-blue)] text-[9px] font-bold px-3 py-1 rounded-full mb-2 tracking-widest uppercase">
            <Zap size={12} /> Material Marketplace
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
            Construction Materials, <span className="text-[var(--brand-blue-light)]">Sourced Right.</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto mb-3">
            Browse all major construction categories and get a direct quote from verified suppliers across India.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-zinc-300">
                <span className="text-[var(--brand-blue-light)]">{s.icon}</span>
                <span className="font-bold text-sm">{s.value}</span>
                <span className="text-[11px] text-zinc-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories Grid ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <div className="text-center mb-5">
          <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--brand-blue)] mb-1">What We Offer</p>
          <h2 className={`text-xl md:text-2xl font-bold ${headText}`}>Material Categories</h2>
          <p className={`mt-1 text-xs ${subText}`}>Click any category to get a quote</p>
        </div>

        {catsLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 animate-spin text-[var(--brand-blue-light)]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className={`text-sm font-semibold ${subText} uppercase tracking-widest`}>Loading categories…</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className={`text-center py-20 border ${cardBorder} rounded-xl`}>
            <div className="text-5xl mb-4">🛒</div>
            <p className={`text-base font-bold ${headText} mb-2`}>No categories available yet</p>
            <p className={`text-sm ${subText}`}>Check back soon — categories are being configured.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const style = labelStyles[cat.label_color] || labelStyles["yellow"];
              return (
                <div
                  key={cat.id}
                  className={`group relative ${cardBg} border ${cardBorder} rounded-xl flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden`}
                  onClick={() => openModal(cat)}
                >
                  {/* Image / Emoji hero */}
                  {cat.image ? (
                    <div className="relative w-full overflow-hidden" style={{ height: "160px" }}>
                      <img src={cat.image} alt={cat.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {cat.label && (
                        <span className={`absolute top-3 left-3 text-[9px] font-extrabold tracking-widest uppercase px-2 py-1 rounded border ${style.bg} ${style.text} ${style.border}`}>
                          {cat.label}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className={`relative flex flex-col items-start justify-end p-4 ${isDarkMode ? "bg-zinc-800" : "bg-gray-100"}`} style={{ height: "120px" }}>
                      <div className="text-6xl mb-1 group-hover:scale-110 transition-transform duration-300">{cat.emoji}</div>
                      {cat.label && (
                        <span className={`text-[9px] font-extrabold tracking-widest uppercase px-2 py-1 rounded border ${style.bg} ${style.text} ${style.border}`}>
                          {cat.label}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-4">
                    <h3 className={`text-sm font-extrabold ${headText} mb-3 leading-snug tracking-wide flex-1`}>{cat.name}</h3>

                    {/* Types preview pills */}
                    {(cat.types || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(cat.types || []).slice(0, 3).map((t) => (
                          <span key={t} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isDarkMode ? "bg-zinc-700 text-zinc-300" : "bg-gray-100 text-gray-600"}`}>
                            {t}
                          </span>
                        ))}
                        {(cat.types || []).length > 3 && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isDarkMode ? "bg-zinc-700 text-zinc-400" : "bg-gray-100 text-gray-400"}`}>
                            +{(cat.types || []).length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <button className="w-full flex items-center justify-center gap-2 bg-[var(--brand-blue)] hover:bg-sky-500 text-gray-900 text-xs font-bold py-2.5 px-4 rounded-lg transition-all duration-200 group-hover:shadow-md">
                      Get Quote <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Trust Bar ───────────────────────────────────────────────────────── */}
      <div className={`border-t ${cardBorder} ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-wrap justify-center gap-8 text-center">
          {["✅ Verified Suppliers", "🚚 Pan-India Delivery", "💬 Expert Support", "🔒 Secure Enquiry"].map((item) => (
            <span key={item} className={`text-sm font-semibold ${isDarkMode ? "text-zinc-300" : "text-gray-600"}`}>{item}</span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          MODAL — Get a Quote
      ════════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-start justify-center p-3 sm:p-4 overflow-hidden">
          <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-lg border overflow-hidden max-h-[calc(100vh-2rem)] flex flex-col`}>

            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${modalHead}`}>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-[var(--brand-blue)] mb-0.5">Request Quote</p>
                <h2 className={`text-lg font-extrabold ${headText} flex items-center gap-2`}>
                  {selectedCategory?.emoji || "📦"} {selectedCategory?.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={`p-2 rounded-full transition-all ${isDarkMode ? "text-zinc-400 hover:bg-zinc-800 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
                aria-label="Close quote form"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center overflow-y-auto">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-blue)] text-2xl text-gray-950">
                  ✓
                </div>
                <h3 className={`text-xl font-black ${headText}`}>Request submitted</h3>
                <p className={`mt-2 text-sm ${subText}`}>
                  Your order request has been received. Order will be placed within 24 to 48 hrs after supplier confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                <div className="mb-4">
                  <label className={lbl}>Delivery City *</label>
                  <div className="flex gap-2 items-end">
                    <select
                      className={`flex-1 ${sel}`}
                      value={selectedCity}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedCity(val);
                        if (val && selectedCategory) {
                          checkCityAvailability(val);
                        } else {
                          setCityError("");
                        }
                      }}
                    >
                      <option value="">Select a city</option>
                      {SUPPORTED_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                  {!cityError && selectedCity && (
                    <p className="text-[9px] mt-1 text-green-500">✓ Supplier available in this city</p>
                  )}
                  <p className={`text-[9px] mt-0.5 ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>
                    Required — used to check supplier availability and show local pricing.
                  </p>
                </div>

                {/* ── CITY VERIFICATION STATUS ─────────────────────── */}
                {selectedCity && !cityError && (
                  <div className={`rounded-xl border-2 px-4 py-3 mb-4 flex items-center justify-between ${isDarkMode ? "border-green-600 bg-green-900/20" : "border-green-500 bg-green-50"}`}>
                    <div>
                      <p className={`text-[9px] font-extrabold uppercase tracking-widest mb-0.5 ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                        ✓ Supplier Available
                      </p>
                      <p className={`text-base font-black ${isDarkMode ? "text-green-300" : "text-green-800"}`}>
                        {selectedCity}
                      </p>
                    </div>
                  </div>
                )}

                {(() => {
                  if (selectedCategory?.price_range) {
                    return (
                      <div className={`rounded-xl border px-4 py-3 mb-4 flex items-center justify-between ${isDarkMode ? "border-zinc-700 bg-zinc-800" : "border-gray-200 bg-gray-50"}`}>
                        <div>
                          <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                            Indicative Price Range
                          </p>
                          <p className={`text-sm font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"}`}>
                            {selectedCategory.price_range}
                          </p>
                          {selectedCategory.unit && (
                            <p className={`text-[10px] ${isDarkMode ? "text-zinc-500" : "text-gray-400"}`}>{selectedCategory.unit}</p>
                          )}
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-1 rounded ${isDarkMode ? "bg-zinc-700 text-zinc-400" : "bg-gray-200 text-gray-500"}`}>
                          General
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div className={`rounded-xl border px-4 py-2.5 mb-4 ${isDarkMode ? "border-zinc-700 bg-zinc-800" : "border-gray-200 bg-gray-50"}`}>
                      <p className={`text-[10px] font-semibold ${isDarkMode ? "text-zinc-400" : "text-gray-500"}`}>
                        Price will be quoted by a verified supplier{selectedCity ? ` for ${selectedCity}` : ""}.
                      </p>
                    </div>
                  );
                })()}

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
                  <div>
                    <label className={lbl}>Quantity Required</label>
                    <input type="text" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="e.g. 500" className={inp} />
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
                    {locationStatus !== "loading" && (
                      <button type="button" onClick={retryLocation}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${isDarkMode ? "border-zinc-600 text-zinc-300 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue-light)]" : "border-gray-300 text-gray-500 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue-deep)]"}`}>
                        🔄 Retry
                      </button>
                    )}
                  </div>

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
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[var(--brand-blue)] hover:bg-sky-500 disabled:opacity-60 text-gray-900 font-extrabold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-sm tracking-wide"
                >
                  {submitting ? "Submitting…" : "Submit Enquiry →"}
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
        </div>
      )}
    </div>
  );
}
