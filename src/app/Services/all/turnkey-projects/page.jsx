"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const process = [
  { step: "01", title: "Concept & Scope", desc: "We lock in scope, deliverables, and KPIs with your team — eliminating ambiguity from day one." },
  { step: "02", title: "Engineering Design", desc: "Full architectural, structural, and MEP design produced in-house or with certified partner consultants." },
  { step: "03", title: "Procurement", desc: "We source all materials, equipment, and sub-systems directly — leveraging bulk purchase advantages." },
  { step: "04", title: "Construction Execution", desc: "Single-team execution across civil, electrical, mechanical, and finishing — zero coordination gaps." },
  { step: "05", title: "Testing & Commissioning", desc: "All systems are tested, balanced, and certified before occupancy — nothing is left to chance." },
  { step: "06", title: "Turnover & Warranty", desc: "Complete documentation, O&M manuals, and a 12-month defect liability period included." },
];

const benefits = [
  { icon: "🎯", title: "Single Point of Responsibility", desc: "One contract, one team, zero blame-shifting between agencies." },
  { icon: "💼", title: "Reduced Client Effort", desc: "We manage 100% of the coordination — you stay informed, not overwhelmed." },
  { icon: "📦", title: "Integrated Procurement", desc: "Better pricing and faster lead times through our supply chain relationships." },
  { icon: "🔁", title: "Design-Build Synergy", desc: "The same team that designs executes — eliminating costly interpretation errors." },
  { icon: "🗓️", title: "Fixed Timeline", desc: "Hard delivery dates with contractual milestone commitments." },
  { icon: "💡", title: "Value Engineering", desc: "Ongoing cost optimisation without compromising specifications." },
];

const projects = [
  { name: "Al Noor Hotel, Dubai", type: "Turnkey Hotel", area: "220 Rooms", status: "Delivered", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" },
  { name: "Reliance Distribution Hub, Ghaziabad", type: "Industrial Facility", area: "4L sq.ft", status: "Delivered", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80" },
  { name: "Delhi Tech Park Phase II", type: "IT Campus", area: "6L sq.ft", status: "Ongoing", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80" },
];

export default function TurnkeyPage() {
  const [isDark, setIsDark] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const bg = isDark ? "bg-black text-white" : "bg-white text-zinc-900";
  const muted = isDark ? "text-zinc-400" : "text-zinc-600";
  const card = isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-100";
  const inputCls = `w-full px-4 py-3 border text-sm font-medium outline-none transition-all ${isDark ? "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#facc15]" : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-black"}`;

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 ${bg}`}>

      {/* ── HERO ── */}
      <section className="relative h-[90vh] flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1600&q=80" alt="Turnkey" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto px-8 pb-20 w-full">
          <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.5em] mb-4">MT BOSS Construction</p>
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white leading-none mb-6">
            Turnkey<br /><span className="text-[#facc15]">Projects</span>
          </h1>
          <p className="text-zinc-300 text-lg max-w-xl leading-relaxed">
            Design. Procure. Build. Hand over. One team, one contract, zero complications.
          </p>
        </div>
      </section>

      {/* ── DESCRIPTION ── */}
      <section className={`py-24 px-8 border-b ${isDark ? "border-zinc-900" : "border-zinc-100"}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">About This Service</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Complete<br /><span className="text-[#facc15]">Ownership,</span><br />Zero Stress
            </h2>
            <p className={`text-base leading-relaxed mb-6 ${muted}`}>
              Our Turnkey division takes full responsibility — from the first sketch to the final snag list. You engage us once and receive a ready-to-occupy asset. No chasing architects, contractors, or suppliers separately.
            </p>
            <p className={`text-base leading-relaxed ${muted}`}>
              MT BOSS has delivered turnkey projects across hospitality, industrial, commercial, and institutional sectors — domestically and in the Middle East.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["30+", "Turnkey Projects"], ["₹500Cr+", "Project Value"], ["100%", "On-Spec Delivery"], ["12M", "Warranty Period"]].map(([num, label]) => (
              <div key={label} className={`border p-8 ${card}`}>
                <p className="text-4xl font-black text-[#facc15]">{num}</p>
                <p className={`text-xs uppercase tracking-widest mt-2 font-bold ${muted}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">How We Work</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16">Our Process</h2>
          <div className="grid md:grid-cols-3 gap-0">
            {process.map((p, i) => (
              <div key={p.step} className={`border p-10 ${card} ${i !== 0 ? (i % 3 === 0 ? "border-t-0 md:border-t" : "border-l-0 md:border-l") : ""}`}>
                <p className="text-5xl font-black text-[#facc15]/30 mb-4">{p.step}</p>
                <h3 className="text-lg font-black uppercase tracking-tight mb-3">{p.title}</h3>
                <p className={`text-sm leading-relaxed ${muted}`}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className={`py-24 px-8 ${isDark ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">Why Choose Us</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16">The MT BOSS<br />Advantage</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className={`border p-8 transition-all hover:border-[#facc15] ${card}`}>
                <p className="text-4xl mb-4">{b.icon}</p>
                <h3 className="text-base font-black uppercase tracking-tight mb-2">{b.title}</h3>
                <p className={`text-sm leading-relaxed ${muted}`}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">Project References</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16">Delivered<br />Complete</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <div key={proj.name} className={`group border overflow-hidden ${card}`}>
                <div className="relative h-56 overflow-hidden">
                  <img src={proj.img} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-black uppercase tracking-widest ${proj.status === "Delivered" ? "bg-[#facc15] text-black" : "bg-black text-[#facc15] border border-[#facc15]"}`}>
                    {proj.status}
                  </div>
                </div>
                <div className="p-6">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${muted}`}>{proj.type} · {proj.area}</p>
                  <h3 className="text-lg font-black uppercase tracking-tight">{proj.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / ENQUIRY FORM ── */}
      <section className={`py-24 px-8 ${isDark ? "bg-zinc-950" : "bg-zinc-100"}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">Get Started</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
              Tell Us Your<br /><span className="text-[#facc15]">Vision.</span><br />We'll Build It.
            </h2>
            <p className={`text-base leading-relaxed ${muted}`}>
              Describe your turnkey requirement and our EPC specialists will get back to you within 24 hours.
            </p>
            <div className={`mt-10 border-l-4 border-[#facc15] pl-6 ${muted}`}>
              <p className="text-sm font-bold">📞 +91 98765 43210</p>
              <p className="text-sm mt-1 font-bold">✉️ hello@mtboss.in</p>
            </div>
          </div>

          {submitted ? (
            <div className={`border p-12 flex flex-col items-center justify-center text-center h-full ${card}`}>
              <p className="text-5xl mb-4">✅</p>
              <h3 className="text-2xl font-black uppercase">Enquiry Received!</h3>
              <p className={`mt-3 text-sm ${muted}`}>Our team will contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={`border p-10 space-y-5 ${card}`}>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest block mb-2 ${muted}`}>Full Name *</label>
                <input required className={inputCls} placeholder="John Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest block mb-2 ${muted}`}>Phone Number *</label>
                <input required type="tel" className={inputCls} placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest block mb-2 ${muted}`}>Email Address</label>
                <input type="email" className={inputCls} placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase tracking-widest block mb-2 ${muted}`}>Project Details</label>
                <textarea rows={4} className={inputCls} placeholder="Project type, location, scale, and expected timeline..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="w-full py-4 bg-[#facc15] text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-[#facc15] transition-all duration-300">
                Submit Enquiry →
              </button>
            </form>
          )}
        </div>
      </section>

    </main>
  );
}