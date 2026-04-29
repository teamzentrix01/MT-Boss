"use client";
import { useState, useEffect } from "react";

const allQuickServices = [
  { id: 1, icon: "🔧", label: "Plumbing", desc: "Pipeline solutions, leakage repairs, and premium sanitary fittings for modern homes.", basePrice: 299, duration: "1–2 hrs" },
  { id: 2, icon: "⚡", label: "Electrician", desc: "Expert wiring, circuit management, and appliance installation with guaranteed safety.", basePrice: 349, duration: "1–3 hrs" },
  { id: 3, icon: "🎨", label: "Painting", desc: "Premium emulsions, texture painting, and specialized exterior coatings.", basePrice: 999, duration: "1–3 days" },
  { id: 4, icon: "❄️", label: "AC Service", desc: "AC servicing, chemical cleaning, gas top-ups, and repairs for all brands.", basePrice: 499, duration: "1–2 hrs" },
  { id: 5, icon: "🪟", label: "Carpentry", desc: "Custom furniture, modular kitchen fittings, and precision woodwork.", basePrice: 599, duration: "2–5 hrs" },
  { id: 6, icon: "🧹", label: "Deep Cleaning", desc: "Hospital-grade sanitization and deep cleaning for home and office.", basePrice: 799, duration: "3–5 hrs" },
  { id: 7, icon: "🔒", label: "Locksmith", desc: "High-security lock installations, digital lock setup, and emergency key assistance.", basePrice: 249, duration: "30–90 min" },
  { id: 8, icon: "🏠", label: "Waterproofing", desc: "Seepage solutions for terraces, bathrooms, and basements using nanotechnology.", basePrice: 1499, duration: "1–2 days" },
  { id: 9, icon: "🪣", label: "Tank Cleaning", desc: "6-stage mechanized cleaning ensuring 100% bacteria-free water.", basePrice: 599, duration: "2–3 hrs" },
  { id: 10, icon: "🔥", label: "Gas Pipeline", desc: "Certified copper/GI gas pipeline installations for kitchens and industries.", basePrice: 899, duration: "2–4 hrs" },
  { id: 11, icon: "📡", label: "CCTV Install", desc: "Smart surveillance with night vision and remote mobile monitoring.", basePrice: 1999, duration: "3–5 hrs" },
  { id: 12, icon: "🚿", label: "Bathroom Fit", desc: "Luxury bathroom renovations, shower cubicles, and designer faucets.", basePrice: 2499, duration: "2–4 days" },
  { id: 13, icon: "🪞", label: "Glass & Mirrors", desc: "Glass partitions, toughened glass work, and decorative mirror fittings.", basePrice: 799, duration: "2–4 hrs" },
  { id: 14, icon: "🏗️", label: "False Ceiling", desc: "POP and Gypsum ceiling designs with cove lighting and soundproofing.", basePrice: 1799, duration: "2–5 days" },
  { id: 15, icon: "🧱", label: "Tiling & Flooring", desc: "Italian marble, vitrified tiles, and wooden flooring installation.", basePrice: 1999, duration: "2–5 days" },
  { id: 16, icon: "🔨", label: "Wall Repairs", desc: "Crack filling, plastering, and wall strengthening for aging buildings.", basePrice: 499, duration: "1–2 days" },
  { id: 17, icon: "💡", label: "Home Automation", desc: "Automated lighting, climate control, and voice assistant integrations.", basePrice: 3999, duration: "1–3 days" },
  { id: 18, icon: "🪜", label: "Staircase Work", desc: "Wooden, steel, and glass staircases with premium handrails and finishes.", basePrice: 4999, duration: "3–7 days" },
  { id: 19, icon: "🌿", label: "Garden & Lawn", desc: "Landscaping, organic gardening, and vertical garden setup.", basePrice: 699, duration: "2–4 hrs" },
  { id: 20, icon: "🏠", label: "Pest Control", desc: "Eco-friendly pest management for termites, rodents, and household pests.", basePrice: 499, duration: "1–2 hrs" },
];

const TIME_SLOTS = [
  "08:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 02:00 PM",
  "02:00 PM – 04:00 PM",
  "04:00 PM – 06:00 PM",
  "06:00 PM – 08:00 PM",
];

const PROPERTY_TYPES = ["Apartment", "Independent House", "Villa", "Office / Commercial", "Shop / Showroom"];

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

// ─── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ service, isDark, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1 = details, 2 = confirm, 3 = success
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    propertyType: "",
    date: "",
    timeSlot: "",
    description: "",
    urgency: "normal",      // normal | urgent
    visitCharge: 0,
  });
  const [errors, setErrors] = useState({});

  const visitFee = form.urgency === "urgent" ? 149 : 0;
  const estimatedCost = `₹${service.basePrice} onwards`;

  const overlay = isDark ? "bg-black/80" : "bg-zinc-900/60";
  const modal = isDark ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900";
  const input = isDark
    ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600 focus:border-[#facc15]"
    : "bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900";
  const label = isDark ? "text-zinc-400" : "text-zinc-500";
  const muted = isDark ? "text-zinc-500" : "text-zinc-400";
  const divider = isDark ? "border-zinc-800" : "border-zinc-100";
  const pillBase = "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer";
  const pillActive = isDark
    ? "border-[#facc15] bg-[#facc15] text-black"
    : "border-zinc-900 bg-zinc-900 text-white";
  const pillInactive = isDark
    ? "border-zinc-700 text-zinc-400 hover:border-zinc-500"
    : "border-zinc-300 text-zinc-500 hover:border-zinc-500";

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Valid 10-digit phone required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.pincode || form.pincode.length !== 6) e.pincode = "Valid 6-digit pincode required";
    if (!form.propertyType) e.propertyType = "Select property type";
    if (!form.date) e.date = "Select a date";
    if (!form.timeSlot) e.timeSlot = "Select a time slot";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) setStep(2);
  }

  function handleConfirm() {
    // Here you'd POST to your API / admin dashboard
    setStep(3);
  }

  // Trap scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className={`backdrop-blur-sm ${overlay}`}
      style={{ position:"fixed", inset:0, zIndex:99999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`relative w-full border shadow-2xl flex flex-col ${modal}`}
        style={{ maxHeight:"calc(100vh - 32px)", maxWidth:"576px", width:"100%", zIndex:100000 }}
      >
        {/* ── Header ── (fixed, never scrolls) */}
        <div className={`flex-shrink-0 flex items-center justify-between px-6 py-4 border-b ${divider}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{service.icon}</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#facc15]">Book Service</p>
              <h2 className="text-lg font-black uppercase tracking-tight">{service.label}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center border transition-all font-black text-sm ${isDark ? "border-zinc-700 text-zinc-400 hover:border-[#facc15] hover:text-[#facc15]" : "border-zinc-300 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900"}`}
          >
            ✕
          </button>
        </div>

        {/* ── Step Indicator ── (fixed, never scrolls) */}
        {step < 3 && (
          <div className={`flex-shrink-0 flex border-b ${divider}`}>
            {["Your Details", "Confirm & Pay"].map((s, i) => (
              <div key={i} className={`flex-1 py-2.5 text-center text-[9px] font-black uppercase tracking-widest transition-all ${step === i + 1 ? "text-[#facc15] border-b-2 border-[#facc15]" : muted}`}>
                {i + 1}. {s}
              </div>
            ))}
          </div>
        )}

        {/* ── Scrollable Content Wrapper ── */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {/* ══ STEP 1 ══ */}
        {step === 1 && (
          <div className="p-6 space-y-5">

            {/* Service Info Bar */}
            <div className={`flex items-center justify-between px-4 py-3 border ${isDark ? "border-zinc-800 bg-zinc-900" : "border-zinc-100 bg-zinc-50"}`}>
              <div>
                <p className={`text-[9px] uppercase tracking-widest font-black ${muted}`}>Estimated Cost</p>
                <p className="text-sm font-black text-[#facc15]">{estimatedCost}</p>
              </div>
              <div className="text-center">
                <p className={`text-[9px] uppercase tracking-widest font-black ${muted}`}>Duration</p>
                <p className={`text-sm font-black ${isDark ? "text-white" : "text-zinc-900"}`}>{service.duration}</p>
              </div>
              <div className="text-right">
                <p className={`text-[9px] uppercase tracking-widest font-black ${muted}`}>Warranty</p>
                <p className={`text-sm font-black ${isDark ? "text-white" : "text-zinc-900"}`}>30 Days</p>
              </div>
            </div>

            {/* Section: Personal */}
            <SectionTitle isDark={isDark}>Personal Information</SectionTitle>

            <Field label="Full Name *" error={errors.name} isDark={isDark}>
              <input
                className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone *" error={errors.phone} isDark={isDark}>
                <input
                  className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                  placeholder="10-digit mobile"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                />
              </Field>
              <Field label="Email (optional)" error={errors.email} isDark={isDark}>
                <input
                  className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
            </div>

            {/* Section: Address */}
            <SectionTitle isDark={isDark}>Service Address</SectionTitle>

            <Field label="Full Address *" error={errors.address} isDark={isDark}>
              <textarea
                rows={2}
                className={`w-full px-3 py-2.5 text-sm border outline-none transition-all resize-none ${input}`}
                placeholder="House/Flat No., Street, Landmark…"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="City *" error={errors.city} isDark={isDark}>
                <input
                  className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                  placeholder="e.g. Delhi"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </Field>
              <Field label="Pincode *" error={errors.pincode} isDark={isDark}>
                <input
                  className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
                />
              </Field>
            </div>

            {/* Property Type */}
            <Field label="Property Type *" error={errors.propertyType} isDark={isDark}>
              <div className="flex flex-wrap gap-2 mt-1">
                {PROPERTY_TYPES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => set("propertyType", p)}
                    className={`${pillBase} ${form.propertyType === p ? pillActive : pillInactive}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>

            {/* Section: Scheduling */}
            <SectionTitle isDark={isDark}>Schedule & Timing</SectionTitle>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Preferred Date *" error={errors.date} isDark={isDark}>
                <input
                  type="date"
                  min={getTodayStr()}
                  className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                />
              </Field>

              <Field label="Time Slot *" error={errors.timeSlot} isDark={isDark}>
                <select
                  className={`w-full px-3 py-2.5 text-sm border outline-none transition-all ${input}`}
                  value={form.timeSlot}
                  onChange={(e) => set("timeSlot", e.target.value)}
                >
                  <option value="">Select slot</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Urgency */}
            <Field label="Service Priority" isDark={isDark}>
              <div className="flex gap-3 mt-1">
                {[
                  { val: "normal", label: "Normal", sub: "Within 24 hrs • Free visit" },
                  { val: "urgent", label: "Urgent", sub: "Within 4 hrs • ₹149 extra" },
                ].map(({ val, label, sub }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => set("urgency", val)}
                    className={`flex-1 p-3 border text-left transition-all ${form.urgency === val
                      ? (isDark ? "border-[#facc15] bg-[#facc15]/10" : "border-zinc-900 bg-zinc-50")
                      : (isDark ? "border-zinc-800" : "border-zinc-200")
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-widest ${form.urgency === val ? (isDark ? "text-[#facc15]" : "text-zinc-900") : muted}`}>{label}</p>
                    <p className={`text-[10px] mt-0.5 ${muted}`}>{sub}</p>
                  </button>
                ))}
              </div>
            </Field>

            {/* Problem Description */}
            <Field label="Describe the Problem (optional)" isDark={isDark}>
              <textarea
                rows={3}
                className={`w-full px-3 py-2.5 text-sm border outline-none transition-all resize-none ${input}`}
                placeholder="Tell us more so our expert comes prepared…"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>

            {/* CTA */}
            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-yellow-300 transition-all"
            >
              Proceed to Confirm →
            </button>
          </div>
        )}

        {/* ══ STEP 2: Confirm ══ */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <SectionTitle isDark={isDark}>Booking Summary</SectionTitle>

            <div className={`border divide-y ${divider} ${isDark ? "divide-zinc-800" : "divide-zinc-100"}`}>
              {[
                ["Service", `${service.icon} ${service.label}`],
                ["Name", form.name],
                ["Phone", form.phone],
                ["Email", form.email || "—"],
                ["Address", `${form.address}, ${form.city} – ${form.pincode}`],
                ["Property", form.propertyType],
                ["Date", form.date],
                ["Time Slot", form.timeSlot],
                ["Priority", form.urgency === "urgent" ? "⚡ Urgent (within 4 hrs)" : "Normal (within 24 hrs)"],
                ["Issue", form.description || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 px-4 py-2.5">
                  <p className={`text-[10px] font-black uppercase tracking-widest w-24 shrink-0 ${muted}`}>{k}</p>
                  <p className={`text-xs font-medium ${isDark ? "text-white" : "text-zinc-800"}`}>{v}</p>
                </div>
              ))}
            </div>

            {/* Charges */}
            <SectionTitle isDark={isDark}>Charges Breakdown</SectionTitle>
            <div className={`border ${divider}`}>
              {[
                ["Inspection / Visit Fee", form.urgency === "urgent" ? "₹149" : "FREE"],
                ["Service Charge", `${estimatedCost}`],
                ["GST (18%)", "Included in final bill"],
                ["Warranty", "30 Days Parts & Labour"],
              ].map(([k, v], i) => (
                <div key={i} className={`flex justify-between px-4 py-2.5 border-b last:border-0 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
                  <p className={`text-xs ${muted}`}>{k}</p>
                  <p className={`text-xs font-black ${v === "FREE" ? "text-green-500" : (isDark ? "text-white" : "text-zinc-900")}`}>{v}</p>
                </div>
              ))}
            </div>

            <p className={`text-[10px] leading-relaxed ${muted}`}>
              * Final charges will be confirmed after inspection. You only pay after the job is done & you're satisfied.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest border transition-all ${isDark ? "border-zinc-700 text-zinc-400 hover:border-zinc-500" : "border-zinc-300 text-zinc-500 hover:border-zinc-700"}`}
              >
                ← Edit Details
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-[#facc15] text-black text-[9px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all"
              >
                Confirm Booking ✓
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 3: Success ══ */}
        {step === 3 && (
          <div className="p-10 text-center space-y-5">
            <div className="text-6xl animate-bounce">✅</div>
            <p className="text-[#facc15] text-[9px] font-black uppercase tracking-[0.5em]">Booking Confirmed</p>
            <h3 className={`text-2xl font-black uppercase tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
              We're on our way!
            </h3>
            <p className={`text-xs leading-relaxed max-w-xs mx-auto ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              Your <strong>{service.label}</strong> booking has been placed successfully. Our team will call you at <strong>{form.phone}</strong> within 30 minutes to confirm.
            </p>

            <div className={`border px-5 py-4 text-left space-y-1 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
              <p className={`text-[9px] uppercase tracking-widest font-black ${muted}`}>Booking Reference</p>
              <p className={`text-lg font-black tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>
                #{String(Date.now()).slice(-8).toUpperCase()}
              </p>
              <p className={`text-[10px] ${muted}`}>{form.date} • {form.timeSlot}</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#facc15] text-black text-[9px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all"
            >
              Done
            </button>
          </div>
        )}
        </div>{/* end scrollable content */}
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function SectionTitle({ children, isDark }) {
  return (
    <div className="flex items-center gap-3">
      <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${isDark ? "text-zinc-400" : "text-zinc-400"}`}>{children}</p>
      <div className={`flex-1 h-px ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`} />
    </div>
  );
}

function Field({ label, error, isDark, children }) {
  return (
    <div className="space-y-1.5">
      <label className={`block text-[9px] font-black uppercase tracking-widest ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
        {label}
      </label>
      {children}
      {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AllQuickServicesPage() {
  const [isDark, setIsDark] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const bg = isDark ? "bg-black text-white" : "bg-white text-zinc-900";
  const border = isDark ? "border-zinc-900" : "border-zinc-100";
  const card = isDark
    ? "bg-zinc-950 border-zinc-800 hover:border-[#facc15]"
    : "bg-zinc-50 border-zinc-200 hover:bg-white hover:shadow-lg hover:border-zinc-900";
  const muted = isDark ? "text-zinc-500" : "text-zinc-600";
  const btn = isDark
    ? "border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black"
    : "border-black text-black hover:bg-black hover:text-white";

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 ${bg}`}>

      {/* Hero */}
      <section className={`pt-28 pb-10 px-6 text-center border-b ${border}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.5em] mb-3">Quality Guaranteed</p>
          <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
            Quick <span className="text-[#facc15]">Home</span> Services
          </h1>
          <p className={`text-sm max-w-xl mx-auto leading-relaxed ${muted}`}>
            Hassle-free home maintenance with India's most trusted professionals. Select a service to book an appointment.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allQuickServices.map((s) => (
            <div key={s.id} className={`group p-5 border transition-all duration-300 relative overflow-hidden ${card}`}>
              <span className={`absolute -top-1 -right-1 text-6xl font-black opacity-[0.03] group-hover:opacity-10 group-hover:text-[#facc15] transition-all ${isDark ? "text-white" : "text-black"}`}>
                {s.id < 10 ? `0${s.id}` : s.id}
              </span>
              <div className="text-3xl mb-3 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 origin-left">
                {s.icon}
              </div>
              <h3 className={`text-base font-black uppercase tracking-tight mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                {s.label}
              </h3>
              <p className={`text-xs leading-relaxed mb-4 min-h-[48px] ${muted}`}>{s.desc}</p>

              {/* Starting price */}
              <p className={`text-[10px] font-black mb-3 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                Starts at <span className="text-[#facc15]">₹{s.basePrice}</span>
              </p>

              <button
                onClick={() => setSelectedService(s)}
                className={`w-full py-2.5 text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${btn}`}
              >
                Book Service
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedService && (
        <BookingModal
          service={selectedService}
          isDark={isDark}
          onClose={() => setSelectedService(null)}
          onSuccess={() => setSelectedService(null)}
        />
      )}
    </main>
  );
}