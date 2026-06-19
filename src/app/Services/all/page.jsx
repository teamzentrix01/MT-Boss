"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AllServicesPage() {
  const [isDark, setIsDark] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dark mode detection
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/primary-services");
        const data = await res.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error("Error fetching primary services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const bg = isDark ? "bg-black text-white" : "bg-white text-zinc-900";
  const muted = isDark ? "text-zinc-500" : "text-zinc-600";
  const border = isDark ? "border-zinc-900" : "border-zinc-100";

  // Loading state
  if (loading) {
    return (
      <main className={`min-h-screen font-serif ${bg}`}>
        <section className={`pt-28 pb-12 px-6 text-center`}>
          <p className="text-[var(--brand-blue)]">Loading Services...</p>
        </section>
      </main>
    );
  }

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 ${bg}`}>

      {/* Hero */}
      <section className={`pt-28 pb-12 px-6 text-center border-b ${border}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.5em] mb-3">What We Do</p>
          <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
            Construction <span className="text-[var(--brand-blue)]">Services</span>
          </h1>
          <p className={`text-sm max-w-xl mx-auto leading-relaxed ${muted}`}>
            MTBOSS provides end-to-end engineering and infrastructure services — from conceptual design to final construction.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.length > 0 ? (
            services.map((s) => (
              <div key={s.id} className={`group relative h-[340px] overflow-hidden border transition-all duration-500 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
                <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-black via-black/40" : "from-black/90 via-black/20"} to-transparent`} />
                <div className="absolute inset-0 p-7 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                  <div className="w-8 h-0.5 bg-[var(--brand-blue)] mb-4 -translate-x-3 group-hover:translate-x-0 transition-transform duration-400" />
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{s.title}</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-400 mb-5">{s.description}</p>
                  <Link href={`/Services/all/${s.slug}`} className="w-fit px-6 py-2 bg-[var(--brand-blue)] text-black font-black uppercase text-[9px] tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-400 hover:bg-white">
                    Book a visit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className={muted}>No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className={`py-12 text-center ${isDark ? "bg-zinc-950" : "bg-zinc-100"}`}>
        <h2 className={`text-xl font-black uppercase mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>Have a specific project in mind?</h2>
        <Link href="/CTASection" className={`px-8 py-3 font-black uppercase text-[10px] tracking-widest border transition-all ${isDark ? "bg-[var(--brand-blue)] text-black border-[var(--brand-blue)] hover:bg-transparent hover:text-[var(--brand-blue)]" : "bg-black text-[var(--brand-blue)] border-black hover:bg-transparent hover:text-black"}`}>
          Get in Touch Now
        </Link>
      </section>
    </main>
  );
}
