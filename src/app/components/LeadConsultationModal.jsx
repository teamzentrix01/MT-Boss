'use client';

import React, { useState, useEffect } from 'react';

const CITIES = [
  'Bareilly',
  'Moradabad',
  'Meerut',
  'Noida / Greater Noida',
  'Delhi NCR',
  'Ghaziabad',
  'Lucknow',
  'Dehradun / Haridwar',
  'Other Location',
];

const SERVICES = [
  'Residential Turnkey House Construction',
  'Commercial Building & Showroom',
  'Architectural 2D/3D Design & Elevation',
  'Buy Verified Plots / Land (Bareilly & UP)',
  'Wholesale Building Materials (TMT/Cement)',
  'Franchise Business Partnership',
  'Home Renovation & Luxury Interiors',
];

const TIME_SLOTS = [
  'Immediate Call Back (Within 15 Mins)',
  'Morning (10:00 AM - 01:00 PM)',
  'Afternoon (01:00 PM - 05:00 PM)',
  'Evening (05:00 PM - 08:30 PM)',
];

export default function LeadConsultationModal({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Bareilly',
    service: 'Residential Turnkey House Construction',
    preferredSlot: 'Immediate Call Back (Within 15 Mins)',
    plotArea: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Show popup on every refresh/page load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Listen to global open event (e.g. from CTA buttons)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-consultation-modal', handleOpen);
    return () => window.removeEventListener('open-consultation-modal', handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('Please enter your Name and a valid 10-digit Mobile Number.');
      return;
    }

    const rawDigits = formData.phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(rawDigits)) {
      setErrorMsg('Please enter a valid 10-digit Indian Mobile Number (starting with 6-9).');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/consultation-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Failed to submit. Please try again or WhatsApp us.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again or reach us at +91 94584 10866.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      
      {/* ── MODAL CONTAINER ── */}
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl border border-white/20 flex flex-col md:flex-row overflow-hidden animate-scaleUp transition-all duration-300 bg-zinc-950 text-white"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── CLOSE BUTTON ── */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all duration-200 text-sm font-bold shadow-md hover:rotate-90"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* ── LEFT PANEL (BRAND & VALUE PROPOSITION) ── */}
        <div className="relative w-full md:w-5/12 p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950 to-blue-950 border-b md:border-b-0 md:border-r border-white/10">
          
          {/* Subtle Background Pattern & Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,180,216,0.25),transparent_60%)] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-black uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              MT-BOSS CONSTRUCTION • VERIFIED
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight mb-2">
              Build Your Dream Space With India&apos;s Leading Builders
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Moradabad • Bareilly • NCR • Lucknow • Dehradun
            </p>
          </div>

          {/* Value Checklist */}
          <div className="relative z-10 my-6 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5 border border-emerald-500/30">
                ✓
              </div>
              <p className="text-xs text-zinc-200">
                <strong className="text-white">Standard Construction:</strong> Transparent ₹1,500 – ₹2,300/sqft Packages
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5 border border-emerald-500/30">
                ✓
              </div>
              <p className="text-xs text-zinc-200">
                <strong className="text-white">Free Architecture:</strong> 2D Floor Plan &amp; 3D Vastu Elevation
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5 border border-emerald-500/30">
                ✓
              </div>
              <p className="text-xs text-zinc-200">
                <strong className="text-white">Wholesale Materials:</strong> Direct Tata Steel &amp; UltraTech Cement
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0 mt-0.5 border border-emerald-500/30">
                ✓
              </div>
              <p className="text-xs text-zinc-200">
                <strong className="text-white">Verified Properties:</strong> 100% RERA &amp; Title Clear Plots in Bareilly
              </p>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
            <span>⭐ 500+ Projects Handed Over</span>
            <span className="text-sky-400 font-semibold">10+ Years Trust</span>
          </div>
        </div>

        {/* ── RIGHT PANEL (INTERACTIVE CONSULTATION FORM) ── */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 bg-zinc-950 flex flex-col justify-center">
          {submitted ? (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center text-2xl shadow-lg">
                ✓
              </div>
              <h4 className="text-xl font-black text-white">
                Consultation Request Received!
              </h4>
              <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
                Thank you <strong className="text-sky-400">{formData.name}</strong>. Our senior project engineer will connect with you on <strong className="text-white">{formData.phone}</strong> within 15 minutes.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href="https://wa.me/919458410866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md inline-flex items-center justify-center gap-1.5"
                >
                  <span>💬 Instant WhatsApp Chat</span>
                </a>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📅</span>
                  <h4 className="text-lg font-black tracking-tight text-white">
                    Book Free Project Consultation
                  </h4>
                </div>
                <p className="text-xs text-zinc-400">
                  Fill in your details — our senior project engineer will confirm your slot.
                </p>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Full Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-sky-400 text-white text-xs outline-none transition-all placeholder-zinc-500"
                />
              </div>

              {/* Mobile & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number (10 digits) *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-sky-400 text-white text-xs outline-none transition-all placeholder-zinc-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address (Optional)"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-sky-400 text-white text-xs outline-none transition-all placeholder-zinc-500"
                />
              </div>

              {/* City & Service Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] text-zinc-400 font-semibold mb-1">
                    Select Location / City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-sky-400 text-white text-xs outline-none transition-all"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 font-semibold mb-1">
                    Service Required *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-sky-400 text-white text-xs outline-none transition-all"
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preferred Slot & Approx Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] text-zinc-400 font-semibold mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    name="preferredSlot"
                    value={formData.preferredSlot}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-sky-400 text-white text-xs outline-none transition-all"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 font-semibold mb-1">
                    Approx. Plot / Built Area (Optional)
                  </label>
                  <input
                    type="text"
                    name="plotArea"
                    placeholder="e.g. 1000 sqft / 200 Gaj"
                    value={formData.plotArea}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-sky-400 text-white text-xs outline-none transition-all placeholder-zinc-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-400 via-[var(--brand-blue)] to-blue-600 hover:brightness-110 active:scale-[0.99] text-black font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-sky-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Booking Consultation...</span>
                  </>
                ) : (
                  <>
                    <span>📅 Confirm Free Consultation &amp; Get Estimate</span>
                  </>
                )}
              </button>

              {/* Secondary WhatsApp & Privacy Note */}
              <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-500">
                <span>🔒 100% Privacy. No spam guarantee.</span>
                <a
                  href="https://wa.me/919458410866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>💬 WhatsApp Helpline</span>
                </a>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
