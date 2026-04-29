"use client";
import { useState, useEffect } from "react";

const process = [
  { step: "01", title: "Brief & Feasibility", desc: "We analyse commercial goals, footprint, ROI expectations, and local zoning regulations." },
  { step: "02", title: "Architectural Design", desc: "Functional, aesthetically driven floor plans — LEED-ready and code-compliant." },
  { step: "03", title: "Structural Engineering", desc: "High-load RCC/steel frames designed for commercial usage and long lifecycle." },
  { step: "04", title: "MEP Integration", desc: "Fully coordinated electrical, HVAC, fire suppression, and data cabling via BIM." },
  { step: "05", title: "Facade & Finishing", desc: "Curtain walls, cladding, lobbies, and tenant-ready interiors to international standards." },
  { step: "06", title: "Commissioning", desc: "Systems testing, safety certification, and complete documentation before handover." },
];

const benefits = [
  { icon: "🏢", title: "Grade-A Construction", desc: "Premium materials suited for corporate and retail occupancy." },
  { icon: "📐", title: "BIM-Based Design", desc: "Building Information Modelling minimises clashes and rework." },
  { icon: "🔒", title: "Safety First", desc: "OSHA-aligned site practices and fire safety compliance throughout." },
  { icon: "⚡", title: "Fast-Track Execution", desc: "Parallel workflows ensure commercial projects are ready faster." },
  { icon: "📊", title: "Cost Intelligence", desc: "Real-time cost tracking with value-engineering recommendations." },
  { icon: "🌐", title: "Smart Building Ready", desc: "Infrastructure prepped for IoT, BMS, and smart office integrations." },
];

const projects = [
  { name: "Vertex Corporate Tower, Noida", type: "Office Complex", area: "1.2L sq.ft", status: "Delivered", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" },
  { name: "The Promenade Mall, Ghaziabad", type: "Retail Complex", area: "80K sq.ft", status: "Delivered", img: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80" },
  { name: "Nexus Business Hub, Greater Noida", type: "Mixed-Use Commercial", area: "2L sq.ft", status: "Ongoing", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" },
];

export default function CommercialPage() {
  const [isDark, setIsDark] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const bg = isDark ? "bg-black text-white" : "bg-white text-zinc-900";
  const muted = isDark ? "text-zinc-400" : "text-zinc-600";
  const card = isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-100";
  const inp = `w-full px-3 py-2.5 border text-sm outline-none transition-all ${isDark ? "bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#facc15]" : "bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-black"}`;

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 ${bg}`}>

      {/* Hero */}
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80" alt="Commercial" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-14 w-full">
          <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.5em] mb-3">MT BOSS Construction</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none mb-4">
            Commercial<br /><span className="text-[#facc15]">Construction</span>
          </h1>
          <p className="text-zinc-300 text-sm max-w-md leading-relaxed">Corporate towers, retail centres, and business parks — engineered for performance, built for legacy.</p>
        </div>
      </section>

      {/* About */}
      <section className={`py-14 px-6 border-b ${isDark ? "border-zinc-900" : "border-zinc-100"}`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-3">About This Service</p>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Spaces That<br />Drive <span className="text-[#facc15]">Business</span></h2>
            <p className={`text-sm leading-relaxed mb-4 ${muted}`}>MT BOSS has constructed over 3 million sq.ft of commercial space across the NCR — from Grade-A office towers to multi-level retail plazas, combining architectural ambition with engineering rigour.</p>
            <p className={`text-sm leading-relaxed ${muted}`}>Every project is backed by BIM coordination, dedicated site engineers, and a transparent reporting cadence.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[["3M+", "Sq.Ft Delivered"], ["25+", "Commercial Projects"], ["100%", "Code Compliant"], ["15+", "Repeat Clients"]].map(([n, l]) => (
              <div key={l} className={`border p-5 ${card}`}>
                <p className="text-2xl font-black text-[#facc15]">{n}</p>
                <p className={`text-[10px] uppercase tracking-widest mt-1 font-bold ${muted}`}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-3">How We Work</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10">Our Process</h2>
          <div className="grid md:grid-cols-3 gap-0">
            {process.map((p, i) => (
              <div key={p.step} className={`border p-6 ${card} ${i > 0 && i % 3 !== 0 ? "border-l-0" : ""} ${i >= 3 ? "border-t-0" : ""}`}>
                <p className="text-3xl font-black text-[#facc15]/30 mb-3">{p.step}</p>
                <h3 className="text-sm font-black uppercase tracking-tight mb-2">{p.title}</h3>
                <p className={`text-xs leading-relaxed ${muted}`}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={`py-14 px-6 ${isDark ? "bg-zinc-950" : "bg-zinc-50"}`}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10">The MT BOSS<br />Advantage</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className={`border p-5 hover:border-[#facc15] transition-all ${card}`}>
                <p className="text-2xl mb-3">{b.icon}</p>
                <h3 className="text-xs font-black uppercase tracking-tight mb-1">{b.title}</h3>
                <p className={`text-xs leading-relaxed ${muted}`}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Project References</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10">Landmark<br />Builds</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {projects.map((p) => (
              <div key={p.name} className={`group border overflow-hidden ${card}`}>
                <div className="relative h-44 overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-3 right-3 px-2 py-1 text-[9px] font-black uppercase tracking-widest ${p.status === "Delivered" ? "bg-[#facc15] text-black" : "bg-black text-[#facc15] border border-[#facc15]"}`}>{p.status}</div>
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

      {/* CTA Form */}
      <section className={`py-14 px-6 ${isDark ? "bg-zinc-950" : "bg-zinc-100"}`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.4em] mb-3">Get Started</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">Build Your<br /><span className="text-[#facc15]">Commercial</span><br />Vision</h2>
            <p className={`text-sm leading-relaxed ${muted}`}>Share your requirements and our expert team will respond within 24 hours with a tailored proposal.</p>
            <div className={`mt-6 border-l-4 border-[#facc15] pl-4 ${muted}`}>
              <p className="text-xs font-bold mb-1">📞 +91 98765 43210</p>
              <p className="text-xs font-bold">✉️ hello@mtboss.in</p>
            </div>
          </div>
          {submitted ? (
            <div className={`border p-10 flex flex-col items-center justify-center text-center ${card}`}>
              <p className="text-4xl mb-3">✅</p>
              <h3 className="text-lg font-black uppercase">Enquiry Received!</h3>
              <p className={`mt-2 text-xs ${muted}`}>Our team will contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className={`border p-6 space-y-4 ${card}`}>
              {[["Full Name *", "text", "John Sharma", "name"], ["Phone Number *", "tel", "+91 9876543210", "phone"], ["Email Address", "email", "you@example.com", "email"]].map(([label, type, ph, key]) => (
                <div key={key}>
                  <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>{label}</label>
                  <input required={label.includes("*")} type={type} className={inp} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className={`text-[9px] font-black uppercase tracking-widest block mb-1.5 ${muted}`}>Project Details</label>
                <textarea rows={3} className={inp} placeholder="Location, type of commercial space, area required, timeline..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="w-full py-3 bg-[#facc15] text-black font-black uppercase text-[9px] tracking-widest hover:bg-black hover:text-[#facc15] transition-all duration-300">Submit Enquiry →</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}