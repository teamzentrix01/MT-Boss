"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const fallbackProcess = [
  { step: "01", title: "Consultation & Brief",  desc: "We analyse your goals, site conditions, budget, and timeline before anything begins." },
  { step: "02", title: "Design & Planning",      desc: "Architects and engineers finalise blueprints tailored to your vision and local regulations." },
  { step: "03", title: "Approvals & Permits",   desc: "We handle all municipal approvals, RERA registrations, and statutory clearances." },
  { step: "04", title: "Execution & Structure", desc: "Premium-grade materials, strict quality control, and milestone-based site management." },
  { step: "05", title: "MEP & Finishing",       desc: "Electrical, plumbing, HVAC, and premium finishing — tiles, paint, woodwork, fixtures." },
  { step: "06", title: "Handover & Support",    desc: "Snag-free possession with full warranty and a dedicated post-handover support team." },
];

const fallbackBenefits = [
  { icon: "🏗️", title: "Quality Materials",     desc: "Only certified, premium-grade materials used across all projects." },
  { icon: "⏱️", title: "On-Time Delivery",      desc: "Milestone-based scheduling ensures zero delays." },
  { icon: "💰", title: "Transparent Pricing",   desc: "Fixed-cost contracts — no hidden charges, ever." },
  { icon: "🔬", title: "Quality Audits",        desc: "Third-party inspections at every critical stage." },
  { icon: "🌿", title: "Sustainable Practices", desc: "Eco-friendly methods and green building options available." },
  { icon: "🔑", title: "Turnkey Ready",         desc: "Complete delivery with zero coordination hassle for the client." },
];

const fallbackProjects = [
  { name: "Greenfield Villas, Noida",        type: "Luxury Villas",     area: "48 Units",   status: "Delivered", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { name: "Vertex Corporate Tower, Noida",   type: "Office Complex",    area: "1.2L sq.ft", status: "Delivered", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" },
  { name: "Urban Nest, Greater Noida",       type: "Mixed-Use",         area: "240 Units",  status: "Ongoing",   img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80" },
];

const TIME_SLOTS = [
  "Morning (9AM – 12PM)",
  "Afternoon (12PM – 4PM)",
  "Evening (4PM – 7PM)",
];

export default function ServiceDetailPage() {
  const { slug }   = useParams();
  const router     = useRouter();

  const [service,   setService]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);
  const [isDark,    setIsDark]    = useState(false);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", message: "",
    budget: "", carpetArea: "", timeSlot: "", meetingDate: "", address: "",
  });

  const [gpsCoords,    setGpsCoords]    = useState(null);
  const [fetchingGps,  setFetchingGps]  = useState(false);
  const [gpsError,     setGpsError]     = useState("");

  const [submitted,    setSubmitted]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [submitError,  setSubmitError]  = useState("");
  const [propertyImages, setPropertyImages] = useState([]);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res  = await fetch(`/api/primary-services?slug=${slug}`);
        const data = await res.json();
        if (data.success) setService(data.data);
        else setNotFound(true);
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  const bg   = isDark ? "bg-black text-white"            : "bg-white text-zinc-900";
  const muted= isDark ? "text-zinc-400"                  : "text-zinc-600";
  const card = isDark ? "bg-zinc-950 border-zinc-800"    : "bg-zinc-50 border-zinc-100";
  const inp  = `w-full px-3 py-2.5 border text-sm outline-none transition-all ${isDark
    ? "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[var(--brand-blue)]"
    : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-black"}`;

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported by your browser. Enter address manually.");
      return;
    }
    setFetchingGps(true);
    setGpsError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setGpsCoords({ lat, lng });
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const d = await r.json();
          if (d.display_name) setForm(f => ({ ...f, address: d.display_name }));
        } catch {}
        setFetchingGps(false);
      },
      () => {
        setGpsError("Could not fetch location. Please allow location access or enter address manually.");
        setFetchingGps(false);
      },
      { timeout: 10000 }
    );
  };

  const handlePropertyImages = (files) => {
    const selected = Array.from(files || []);
    if (selected.length === 0) { setPropertyImages([]); setSubmitError(""); return; }
    if (selected.length > 10) { setSubmitError("Max 10 property images."); setPropertyImages([]); return; }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (selected.some(f => !allowed.includes(f.type))) { setSubmitError("Only JPG, PNG or WEBP images."); return; }
    if (selected.some(f => f.size > 5 * 1024 * 1024)) { setSubmitError("Each image must be under 5MB."); return; }
    setSubmitError("");
    setPropertyImages(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("service_slug", slug);
      payload.append("service_title", service.title);
      payload.append("name", form.name);
      payload.append("phone", form.phone);
      payload.append("email", form.email);
      payload.append("message", form.message);
      payload.append("budget", form.budget);
      payload.append("carpet_area", form.carpetArea);
      payload.append("time_slot", form.timeSlot);
      payload.append("meeting_date", form.meetingDate);
      payload.append("gps_location", gpsCoords ? `${gpsCoords.lat.toFixed(6)},${gpsCoords.lng.toFixed(6)}` : "");
      payload.append("address", form.address);
      propertyImages.forEach(file => payload.append("property_images", file));

      const res = await fetch("/api/primary-service-enquiries", { method: "POST", body: payload });
      const data = await res.json();
      if (!data.success) { setSubmitError(data.error || "Something went wrong. Please try again."); return; }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <main className={`min-h-screen flex items-center justify-center font-serif ${bg}`}>
      <p className="text-[var(--brand-blue)] text-sm font-black uppercase tracking-widest animate-pulse">Loading...</p>
    </main>
  );

  if (notFound || !service) return (
    <main className={`min-h-screen flex flex-col items-center justify-center font-serif ${bg}`}>
      <p className="text-6xl mb-4">🏗️</p>
      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Service Not Found</h1>
      <p className={`text-sm mb-6 ${muted}`}>This service doesn&apos;t exist or has been removed.</p>
      <button onClick={() => router.push("/Services/all")}
        className="px-6 py-3 bg-[var(--brand-blue)] text-black font-black uppercase text-[9px] tracking-widest hover:bg-black hover:text-[var(--brand-blue)] transition-all">
        ← Back to Services
      </button>
    </main>
  );

  const processList  = Array.isArray(service.process)  && service.process.length  > 0 ? service.process  : fallbackProcess;
  const benefitsList = Array.isArray(service.benefits) && service.benefits.length > 0 ? service.benefits : fallbackBenefits;
  const projectsList = Array.isArray(service.projects) && service.projects.length > 0 ? service.projects : fallbackProjects;

  const stats = [
    service.stat1_value ? [service.stat1_value, service.stat1_label] : null,
    service.stat2_value ? [service.stat2_value, service.stat2_label] : null,
    service.stat3_value ? [service.stat3_value, service.stat3_label] : null,
    service.stat4_value ? [service.stat4_value, service.stat4_label] : null,
  ].filter(Boolean);

  const defaultStats = [["500+","Projects Delivered"],["12+","Years Experience"],["98%","On-Time Rate"],["0","Hidden Charges"]];
  const finalStats   = stats.length > 0 ? stats : defaultStats;

  const words     = service.title.split(" ");
  const titleMain = words.slice(0, -1).join(" ");
  const titleLast = words[words.length - 1];

  const heroSubtitle  = service.hero_subtitle  || service.description;
  const aboutHeading  = service.about_heading  || "Built with Precision";
  const aboutBody     = service.about_body     || service.description;
  const ctaHeading    = service.cta_heading    || `Start Your ${service.title} Project`;
  const phone         = service.contact_phone  || "+91 98765 43210";
  const email         = service.contact_email  || "hello@mtboss.in";

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 ${bg}`}>

      {/* ── Hero ── */}
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-14 w-full">
          <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.5em] mb-3">MTBOSS Construction</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none mb-4">
            {titleMain}<br /><span className="text-[var(--brand-blue)]">{titleLast}</span>
          </h1>
          <p className="text-zinc-300 text-sm max-w-md leading-relaxed">{heroSubtitle}</p>
        </div>
      </section>

      {/* ── About ── */}
      <section className={`py-14 px-6 border-b ${isDark ? "border-zinc-900" : "border-zinc-100"}`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] mb-3">About This Service</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              {aboutHeading.includes(" ") ? (
                <>{aboutHeading.split(" ").slice(0,-1).join(" ")}<br />
                  <span className="text-[var(--brand-blue)]">{aboutHeading.split(" ").slice(-1)}</span></>
              ) : <span className="text-[var(--brand-blue)]">{aboutHeading}</span>}
            </h2>
            <p className={`text-sm leading-relaxed mb-4 ${muted}`}>{aboutBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {finalStats.map(([val, label]) => (
              <div key={label} className={`border p-5 ${card}`}>
                <p className="text-2xl font-black text-[var(--brand-blue)]">{val}</p>
                <p className={`text-[10px] uppercase tracking-widest mt-1 font-bold ${muted}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] mb-3">How We Work</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10">Our Process</h2>
          <div className="grid md:grid-cols-3 gap-0">
            {processList.map((p, i) => (
              <div key={i} className={`border p-6 ${card} ${i > 0 && i % 3 !== 0 ? "border-l-0" : ""} ${i >= 3 ? "border-t-0" : ""}`}>
                <p className="text-3xl font-black text-[var(--brand-blue)]/30 mb-3">{p.step}</p>
                <h3 className="text-sm font-black uppercase tracking-tight mb-2">{p.title}</h3>
                <p className={`text-xs leading-relaxed ${muted}`}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className={`py-14 px-6 ${isDark ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10">The MTBOSS<br />Advantage</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {benefitsList.map((b, i) => (
              <div key={i} className={`border p-5 hover:border-[var(--brand-blue)] transition-all ${card}`}>
                <p className="text-2xl mb-3">{b.icon}</p>
                <h3 className="text-xs font-black uppercase tracking-tight mb-1">{b.title}</h3>
                <p className={`text-xs leading-relaxed ${muted}`}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Project References</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10">Signature<br />Projects</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {projectsList.map((p, i) => (
              <div key={i} className={`group border overflow-hidden ${card}`}>
                <div className="relative h-44 overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-3 right-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                    p.status === "Delivered" ? "bg-[var(--brand-blue)] text-black" : "bg-black text-[var(--brand-blue)] border border-[var(--brand-blue)]"
                  }`}>{p.status}</div>
                </div>
                <div className="p-4">
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${muted}`}>{p.type} · {p.area}</p>
                  <h3 className="text-sm font-black uppercase tracking-tight">{p.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Form ── */}
      <section className={`py-14 px-6 ${isDark ? "bg-zinc-950" : "bg-zinc-100"}`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Get Started</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">
              {ctaHeading.split(" ").length > 2
                ? <>{ctaHeading.split(" ").slice(0,2).join(" ")}<br /><span className="text-[var(--brand-blue)]">{ctaHeading.split(" ").slice(2,4).join(" ")}</span><br />{ctaHeading.split(" ").slice(4).join(" ")}</>
                : ctaHeading}
            </h2>
            <p className={`text-sm leading-relaxed ${muted}`}>
              Our specialist will reach out within 24 hours with a customised proposal.
            </p>
            <div className={`mt-6 border-l-4 border-[var(--brand-blue)] pl-4 ${muted}`}>
              <p className="text-xs font-bold mb-1">📞 {phone}</p>
              <p className="text-xs font-bold">✉️ {email}</p>
            </div>
          </div>

          {submitted ? (
            <div className={`border p-10 flex flex-col items-center justify-center text-center ${card}`}>
              <p className="text-4xl mb-3">✅</p>
              <h3 className="text-lg font-black uppercase">Enquiry Received!</h3>
              <p className={`mt-2 text-xs ${muted}`}>Our team will contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={`border p-6 space-y-4 ${card}`}>

              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Full Name *</label>
                  <input required type="text" className={inp} placeholder="John Sharma"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Phone Number *</label>
                  <input required type="tel" className={inp} placeholder="+91 9876543210"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              {/* Email & Budget */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Email Address</label>
                  <input type="email" className={inp} placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Budget (₹)</label>
                  <input type="text" className={inp} placeholder="e.g. ₹25,00,000"
                    value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
                </div>
              </div>

              {/* Carpet Area & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Carpet Area (sqft)</label>
                  <input type="number" min="0" className={inp} placeholder="e.g. 1200"
                    value={form.carpetArea} onChange={e => setForm({ ...form, carpetArea: e.target.value })} />
                </div>
                <div>
                  <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Preferred Time Slot</label>
                  <select className={inp} value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })}>
                    <option value="">Select time slot</option>
                    {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                </div>
              </div>

              {/* Meeting Date */}
              <div>
                <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Preferred Meeting Date</label>
                <input type="date" className={inp} min={today}
                  value={form.meetingDate} onChange={e => setForm({ ...form, meetingDate: e.target.value })} />
              </div>

              {/* Live Location */}
              <div>
                <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Your Location</label>
                <button type="button" onClick={fetchLiveLocation} disabled={fetchingGps}
                  className={`w-full py-2.5 text-xs font-black uppercase tracking-widest border transition-all ${
                    gpsCoords
                      ? "bg-green-600 text-white border-green-600"
                      : isDark
                        ? "bg-zinc-800 text-zinc-300 border-zinc-600 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                        : "bg-white text-zinc-700 border-zinc-300 hover:border-black"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}>
                  {fetchingGps ? "📡 Fetching location…" : gpsCoords ? `✓ Location Fetched (${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)})` : "📍 Use My Live Location"}
                </button>
                {gpsError && <p className="mt-1.5 text-[10px] font-bold text-red-500">{gpsError}</p>}
              </div>

              {/* Address */}
              <div>
                <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Full Address</label>
                <textarea rows={2} className={inp}
                  placeholder="Street, City, State, PIN — auto-filled if you use live location"
                  value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>

              {/* Project Details */}
              <div>
                <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Project Details</label>
                <textarea rows={3} className={inp}
                  placeholder={`Tell us about your ${service.title} project — scope, timeline, special requirements...`}
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>

              {/* Property Images */}
              <div>
                <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Property Images</label>
                <input type="file" multiple accept="image/jpeg,image/png,image/webp" className={inp}
                  onChange={e => handlePropertyImages(e.target.files)} />
                <p className={`mt-1.5 text-[10px] font-bold ${muted}`}>Optional. Upload 0 to 10 images, max 5MB each.</p>
                {propertyImages.length > 0 && (
                  <div className={`mt-2 text-[10px] font-bold ${muted}`}>
                    {propertyImages.map(file => <p key={`${file.name}-${file.size}`}>{file.name}</p>)}
                  </div>
                )}
              </div>

              {submitError && <p className="text-xs font-bold text-red-500">{submitError}</p>}

              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-[var(--brand-blue)] text-black font-black uppercase text-[9px] tracking-widest hover:bg-black hover:text-[var(--brand-blue)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? "Submitting…" : "Submit Enquiry →"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
