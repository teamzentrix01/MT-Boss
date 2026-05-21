"use client";

import { useState, useEffect } from "react";

// Same dark mode hook as Contact page — watches html.classList for 'dark-mode'
function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}
// Inline SVG icons — no lucide-react dependency needed
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

export default function ShopPage() {
  const isDarkMode = useDarkMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", quantity: "", address: "", message: "" });
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | loading | success | error
  const [locationCoords, setLocationCoords] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const categories = [
    {
      id: 1,
      name: "CEMENT & CONCRETE",
      emoji: "🧱",
      label: "HIGH VOLUME",
      labelColor: "blue",
      priceRange: "₹380–450 / bag",
      unit: "per 50kg bag",
    },
    {
      id: 2,
      name: "STEEL & IRON",
      emoji: "⚙️",
      label: "ALWAYS NEEDED",
      labelColor: "yellow",
      priceRange: "₹55–65 / kg",
      unit: "per kilogram",
    },
    {
      id: 3,
      name: "WOOD & TIMBER",
      emoji: "🪵",
      label: "GROWING",
      labelColor: "green",
      priceRange: "₹400–800 / sheet",
      unit: "per sheet",
    },
    {
      id: 4,
      name: "HARDWARE & FIXTURES",
      emoji: "🔧",
      label: "STEADY DEMAND",
      labelColor: "purple",
      priceRange: "₹50–500 / unit",
      unit: "per unit",
    },
    {
      id: 5,
      name: "GLASS & ALUMINIUM",
      emoji: "🪟",
      label: "SPECIALIZED",
      labelColor: "pink",
      priceRange: "₹150–400 / SFT",
      unit: "per sq. ft.",
    },
    {
      id: 6,
      name: "PAINTS & CHEMICALS",
      emoji: "🎨",
      label: "REGULAR SUPPLY",
      labelColor: "orange",
      priceRange: "₹800–1500 / ltr",
      unit: "per litre",
    },
    {
      id: 7,
      name: "AGGREGATES & SAND",
      emoji: "🪨",
      label: "BULK SUPPLY",
      labelColor: "amber",
      priceRange: "₹35–80 / CFT",
      unit: "per cu. ft.",
    },
    {
      id: 8,
      name: "ELECTRICAL MATERIALS",
      emoji: "💡",
      label: "HIGH DEMAND",
      labelColor: "cyan",
      priceRange: "₹10–250 / unit",
      unit: "per unit",
    },
  ];

  const labelStyles = {
    blue:   { bg: isDarkMode ? "bg-blue-900/40"   : "bg-blue-50",   text: isDarkMode ? "text-blue-300"   : "text-blue-600",   border: isDarkMode ? "border-blue-700"   : "border-blue-200"   },
    yellow: { bg: isDarkMode ? "bg-yellow-900/40" : "bg-yellow-50", text: isDarkMode ? "text-yellow-300" : "text-yellow-600", border: isDarkMode ? "border-yellow-700" : "border-yellow-200" },
    green:  { bg: isDarkMode ? "bg-green-900/40"  : "bg-green-50",  text: isDarkMode ? "text-green-300"  : "text-green-600",  border: isDarkMode ? "border-green-700"  : "border-green-200"  },
    purple: { bg: isDarkMode ? "bg-purple-900/40" : "bg-purple-50", text: isDarkMode ? "text-purple-300" : "text-purple-600", border: isDarkMode ? "border-purple-700" : "border-purple-200" },
    pink:   { bg: isDarkMode ? "bg-pink-900/40"   : "bg-pink-50",   text: isDarkMode ? "text-pink-300"   : "text-pink-600",   border: isDarkMode ? "border-pink-700"   : "border-pink-200"   },
    orange: { bg: isDarkMode ? "bg-orange-900/40" : "bg-orange-50", text: isDarkMode ? "text-orange-300" : "text-orange-600", border: isDarkMode ? "border-orange-700" : "border-orange-200" },
    amber:  { bg: isDarkMode ? "bg-amber-900/40"  : "bg-amber-50",  text: isDarkMode ? "text-amber-300"  : "text-amber-600",  border: isDarkMode ? "border-amber-700"  : "border-amber-200"  },
    cyan:   { bg: isDarkMode ? "bg-cyan-900/40"   : "bg-cyan-50",   text: isDarkMode ? "text-cyan-300"   : "text-cyan-600",   border: isDarkMode ? "border-cyan-700"   : "border-cyan-200"   },
  };

  const handleEnquiry = (category) => {
    setSelectedCategory(category);
    setSubmitted(false);
    setFormData({ name: "", email: "", phone: "", quantity: "", address: "", message: "" });
    setLocationStatus('loading');
    setLocationCoords(null);
    setIsModalOpen(true);
    // Auto-fetch location on modal open
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocationCoords({ latitude, longitude });
          setLocationStatus('success');
        },
        () => setLocationStatus('error'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationStatus('error');
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationCoords({ latitude, longitude });
        setLocationStatus('success');
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/material-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: formData.name,
          user_phone: formData.phone,
          user_email: formData.email,
          category_name: selectedCategory?.name,
          category_emoji: selectedCategory?.emoji,
          quantity_text: formData.quantity,
          delivery_address: formData.address,
          latitude: locationCoords?.latitude || null,
          longitude: locationCoords?.longitude || null,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to submit enquiry');
      setSubmitted(true);
      setTimeout(() => setIsModalOpen(false), 3000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pageBg    = isDarkMode ? "bg-zinc-950"   : "bg-gray-50";
  const cardBg    = isDarkMode ? "bg-zinc-900"   : "bg-white";
  const cardBorder = isDarkMode ? "border-zinc-800" : "border-gray-200";
  const headText  = isDarkMode ? "text-white"    : "text-gray-900";
  const subText   = isDarkMode ? "text-zinc-400" : "text-gray-500";
  const divider   = isDarkMode ? "border-zinc-700" : "border-gray-100";
  const inputBg   = isDarkMode ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-yellow-400" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-400";
  const labelText = isDarkMode ? "text-zinc-300" : "text-gray-700";
  const modalBg   = isDarkMode ? "bg-zinc-900 border-zinc-700" : "bg-white";
  const modalHead = isDarkMode ? "border-zinc-800" : "border-gray-100";

  const stats = [
    { icon: <Package size={18} />, value: "500+", label: "Products" },
    { icon: <TrendingUp size={18} />, value: "8", label: "Categories" },
    { icon: <Zap size={18} />, value: "24hr", label: "Response" },
    { icon: <Star size={18} />, value: "4.9★", label: "Rated" },
  ];

  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-300`}>

      {/* Hero Banner — always black, no background lines */}
      <div className="relative overflow-hidden bg-zinc-950">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-500 text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase">
            <Zap size={12} /> Material Marketplace
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            Construction Materials,<br />
            <span className="text-yellow-400">Sourced Right.</span>
          </h1>
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-10">
            Browse all major construction categories and get a direct quote from verified suppliers across India.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-zinc-300">
                <span className="text-yellow-400">{s.icon}</span>
                <span className="font-bold text-lg">{s.value}</span>
                <span className="text-sm text-zinc-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className={`text-xs font-bold tracking-widest uppercase text-yellow-500 mb-2`}>What We Offer</p>
          <h2 className={`text-3xl md:text-4xl font-bold ${headText}`}>Material Categories</h2>
          <p className={`mt-2 text-sm ${subText}`}>Click any category to get a quote</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const style = labelStyles[cat.labelColor];
            return (
              <div
                key={cat.id}
                className={`group relative ${cardBg} border ${cardBorder} rounded-xl p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                onClick={() => handleEnquiry(cat)}
              >
                {/* Label */}
                <span className={`inline-block self-start text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md mb-4 border ${style.bg} ${style.text} ${style.border}`}>
                  {cat.label}
                </span>

                {/* Emoji — larger size to fill space left by removed description */}
                <div className="text-7xl mb-5 group-hover:scale-110 transition-transform duration-300 w-fit">
                  {cat.emoji}
                </div>

                {/* Name */}
                <h3 className={`text-sm font-extrabold ${headText} mb-4 leading-snug tracking-wide flex-1`}>
                  {cat.name}
                </h3>

                {/* Price */}
                <div className={`border-t ${divider} pt-3 mb-4`}>
                  <p className={`text-sm font-bold ${headText}`}>{cat.priceRange}</p>
                  <p className={`text-[11px] ${subText}`}>{cat.unit}</p>
                </div>

                {/* CTA */}
                <button className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-xs font-bold py-2.5 px-4 rounded-lg transition-all duration-200 group-hover:shadow-md">
                  Get Quote <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Bar */}
      <div className={`border-t ${cardBorder} ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-wrap justify-center gap-8 text-center">
          {["✅ Verified Suppliers", "🚚 Pan-India Delivery", "💬 Expert Support", "🔒 Secure Enquiry"].map((item) => (
            <span key={item} className={`text-sm font-semibold ${isDarkMode ? "text-zinc-300" : "text-gray-600"}`}>{item}</span>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`${modalBg} rounded-2xl shadow-2xl w-full max-w-md border ${isDarkMode ? "border-zinc-700" : "border-gray-100"} overflow-hidden my-auto`}>

            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${modalHead}`}>
              <div>
                <p className={`text-xs font-bold tracking-widest uppercase text-yellow-500 mb-0.5`}>Request Quote</p>
                <h2 className={`text-lg font-extrabold ${headText} flex items-center gap-2`}>
                  {selectedCategory?.emoji} {selectedCategory?.name}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}
              >
                <X size={20} />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center px-6">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className={`text-lg font-bold ${headText} mb-2`}>Enquiry Submitted!</h3>
                <p className={`text-sm ${subText} mb-3`}>
                  Your request for <strong>{selectedCategory?.name}</strong> has been received.
                </p>
                <p className={`text-xs ${subText}`}>
                  Verified suppliers will review your enquiry. You will receive an email and a call once a supplier accepts your order.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 space-y-3">

                {/* Row 1: Name + Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[10px] font-bold mb-1 ${labelText} uppercase tracking-wide`}>Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                      placeholder="Full name"
                      className={`w-full px-3 py-2 rounded-lg border-2 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-300 transition-all ${inputBg}`} />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-bold mb-1 ${labelText} uppercase tracking-wide`}>Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                      placeholder="+91 XXXXX"
                      className={`w-full px-3 py-2 rounded-lg border-2 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-300 transition-all ${inputBg}`} />
                  </div>
                </div>

                {/* Row 2: Email + Quantity */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[10px] font-bold mb-1 ${labelText} uppercase tracking-wide`}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                      placeholder="your@email.com"
                      className={`w-full px-3 py-2 rounded-lg border-2 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-300 transition-all ${inputBg}`} />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-bold mb-1 ${labelText} uppercase tracking-wide`}>Quantity</label>
                    <input type="text" name="quantity" value={formData.quantity} onChange={handleInputChange}
                      placeholder="e.g. 500 bags"
                      className={`w-full px-3 py-2 rounded-lg border-2 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-300 transition-all ${inputBg}`} />
                  </div>
                </div>

                {/* Section: Delivery Address (Manual) */}
                <div>
                  <label className={`block text-[10px] font-bold mb-1 ${labelText} uppercase tracking-wide`}>
                    🏠 Delivery Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    placeholder="Type your full delivery address here..."
                    className={`w-full px-3 py-2 rounded-lg border-2 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-300 transition-all resize-none ${inputBg}`}
                  />
                </div>

                {/* Section: Google Maps Live Location */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`block text-[10px] font-bold ${labelText} uppercase tracking-wide`}>
                      📍 Live Location (Google Maps)
                    </label>
                    {locationStatus !== 'loading' && (
                      <button type="button" onClick={getLocation}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${
                          isDarkMode ? 'border-zinc-600 text-zinc-300 hover:border-yellow-500 hover:text-yellow-400' : 'border-gray-300 text-gray-500 hover:border-yellow-500 hover:text-yellow-600'
                        }`}>
                        🔄 Retry
                      </button>
                    )}
                  </div>

                  {/* Loading */}
                  {locationStatus === 'loading' && (
                    <div className={`flex items-center gap-2 px-3 py-3 rounded-lg border ${isDarkMode ? 'border-yellow-700 bg-yellow-900/10' : 'border-yellow-300 bg-yellow-50'}`}>
                      <svg className="w-3.5 h-3.5 animate-spin text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span className={`text-[10px] font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        Fetching your location from GPS...
                      </span>
                    </div>
                  )}

                  {/* Success — Google Maps Embed */}
                  {locationStatus === 'success' && locationCoords && (
                    <div className={`rounded-lg border overflow-hidden ${isDarkMode ? 'border-green-700' : 'border-green-400'}`}>
                      <iframe
                        title="Your Live Location"
                        width="100%"
                        height="140"
                        style={{ border: 0, display: 'block' }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${locationCoords.latitude},${locationCoords.longitude}&z=16&output=embed`}
                      />
                      <div className={`flex items-center justify-between px-3 py-1.5 ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                        <span className={`text-[10px] font-mono font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                          ✅ {locationCoords.latitude.toFixed(5)}, {locationCoords.longitude.toFixed(5)}
                        </span>
                        <a
                          href={`https://www.google.com/maps?q=${locationCoords.latitude},${locationCoords.longitude}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-[10px] font-bold text-yellow-500 hover:underline"
                        >
                          Open in Maps →
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {locationStatus === 'error' && (
                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${isDarkMode ? 'border-red-700 bg-red-900/20' : 'border-red-300 bg-red-50'}`}>
                      <span className="text-red-500 text-xs flex-shrink-0">⚠️</span>
                      <p className={`text-[10px] font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                        Location access denied. Allow permission in browser settings &amp; press Retry.
                      </p>
                    </div>
                  )}
                </div>

                {/* Category Info */}
                <div className={`rounded-lg px-3 py-2 border flex items-center justify-between ${isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-yellow-50 border-yellow-100"}`}>
                  <span className={`text-[10px] font-bold ${subText}`}>Price Range</span>
                  <span className={`text-xs font-extrabold ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>{selectedCategory?.priceRange}</span>
                </div>

                {submitError && (
                  <div className="text-xs text-red-500 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    ⚠️ {submitError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-gray-900 font-extrabold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 text-sm tracking-wide"
                >
                  {submitting ? 'Submitting…' : 'Submit Enquiry →'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${isDarkMode ? "text-zinc-400 hover:bg-zinc-800" : "text-gray-500 hover:bg-gray-100"}`}
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