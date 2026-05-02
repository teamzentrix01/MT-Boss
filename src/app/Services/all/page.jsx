"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const allServices = [
  { id: 1, slug: "residential-construction", title: "Residential Construction", description: "Affordable housing to luxury villas — MTBOSS builds spaces that marry comfort, safety, and enduring quality.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
  { id: 2, slug: "commercial-construction", title: "Commercial Construction", description: "From corporate offices to retail complexes, we design and construct world-class commercial spaces built to last.", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" },
  { id: 3, slug: "turnkey-projects", title: "Turnkey Projects", description: "End-to-end EPC services — we handle design, sourcing, and execution under one roof for seamless delivery.", image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80" },
  { id: 4, slug: "interior-structural-solutions", title: "Interior & Structural Solutions", description: "Turnkey interior fit-out solutions for offices, hotels, and retail spaces — function meets refined aesthetics.", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80" },
];

export default function AllServicesPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const bg = isDark ? "bg-black text-white" : "bg-white text-zinc-900";
  const muted = isDark ? "text-zinc-500" : "text-zinc-600";
  const border = isDark ? "border-zinc-900" : "border-zinc-100";

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 ${bg}`}>

      {/* Hero */}
      <section className={`pt-28 pb-12 px-6 text-center border-b ${border}`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.5em] mb-3">What We Do</p>
          <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 ${isDark ? "text-white" : "text-zinc-900"}`}>
            Full Cycle <span className="text-[#facc15]">Solutions</span>
          </h1>
          <p className={`text-sm max-w-xl mx-auto leading-relaxed ${muted}`}>
            MTBOSS provides end-to-end engineering and infrastructure services — from conceptual design to final construction.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {allServices.map((s) => (
            <div key={s.id} className={`group relative h-[340px] overflow-hidden border transition-all duration-500 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
              <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
              <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-black via-black/40" : "from-black/90 via-black/20"} to-transparent`} />
              <div className="absolute inset-0 p-7 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                <div className="w-8 h-0.5 bg-[#facc15] mb-4 -translate-x-3 group-hover:translate-x-0 transition-transform duration-400" />
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{s.title}</h3>
                <p className="text-zinc-300 text-xs leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-400 mb-5">{s.description}</p>
                <Link href={`/Services/all/${s.slug}`} className="w-fit px-6 py-2 bg-[#facc15] text-black font-black uppercase text-[9px] tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-400 hover:bg-white">
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className={`py-12 text-center ${isDark ? "bg-zinc-950" : "bg-zinc-100"}`}>
        <h2 className={`text-xl font-black uppercase mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>Have a specific project in mind?</h2>
        <Link href="/CTASection" className={`px-8 py-3 font-black uppercase text-[10px] tracking-widest border transition-all ${isDark ? "bg-[#facc15] text-black border-[#facc15] hover:bg-transparent hover:text-[#facc15]" : "bg-black text-[#facc15] border-black hover:bg-transparent hover:text-black"}`}>
          Get in Touch Now
        </Link>
      </section>
    </main>
  );
}