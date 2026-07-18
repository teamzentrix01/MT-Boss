"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark-mode"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

const FEATURES = [
  { icon: "📍", label: "Location-based pricing", desc: "City-wise labour & material rates" },
  { icon: "📐", label: "BOQ breakdown", desc: "Steel, cement, sand, bricks & more" },
  { icon: "🏗️", label: "4 quality packages", desc: "Basic → Standard → Premium → Luxury" },
  { icon: "⚡", label: "Instant estimate", desc: "Live cost updates as you change inputs" },
];

export default function CalculatorCTA() {
  const dark = useDarkMode();

  return (
    <section
      className={`py-12 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-[var(--brand-blue-faint)]"}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className={`flex flex-col lg:flex-row gap-0 border overflow-hidden ${dark ? "border-zinc-800" : "border-zinc-200"}`}>

          {/* Left: text + features */}
          <div className={`flex-1 p-7 ${dark ? "bg-zinc-950" : "bg-white"}`}>
            <p className={`text-[9px] font-black uppercase tracking-[0.4em] mb-2 ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>
              Free Planning Tool
            </p>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none mb-3 ${dark ? "text-white" : "text-zinc-900"}`}>
              Construction <span className="text-[var(--brand-blue)]">Budget</span> Calculator
            </h2>
            <p className={`text-[11px] leading-relaxed mb-6 max-w-sm ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
              Get an instant BOQ estimate for your home or project. Select city, size, floors and finish — live cost breakdown in seconds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  className={`flex items-start gap-3 p-3 border ${dark ? "border-zinc-800 bg-zinc-900" : "border-zinc-100 bg-zinc-50"}`}
                >
                  <span className="text-xl shrink-0">{f.icon}</span>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-wide ${dark ? "text-white" : "text-zinc-800"}`}>{f.label}</p>
                    <p className={`text-[9px] mt-0.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/calculator"
              className={`inline-flex items-center gap-2 px-7 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all group ${
                dark ? "bg-[var(--brand-blue)] text-black hover:bg-[var(--brand-blue-light)]" : "bg-zinc-900 text-white hover:bg-[var(--brand-blue)] hover:text-black"
              }`}
            >
              Try Calculator — Free
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right: mock estimate preview */}
          <div className={`lg:w-72 shrink-0 p-6 flex flex-col justify-center ${dark ? "bg-black border-l border-zinc-800" : "bg-zinc-900 text-white"}`}>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[var(--brand-blue)] mb-4">Sample Estimate</p>

            {/* Mock input pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {["📍 Noida", "1000 sqft", "G+1", "Standard"].map((tag) => (
                <span key={tag} className="text-[8px] font-black uppercase tracking-wide px-2.5 py-1 bg-white/10 text-white/70 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>

            {/* Mock cost rows */}
            <div className="space-y-2.5 mb-5">
              {[
                { label: "Structure",  val: "₹9,18,483" },
                { label: "Masonry",   val: "₹2,78,337" },
                { label: "Services",  val: "₹2,07,928" },
                { label: "Finishing", val: "₹1,24,600" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-[9px] text-white/50 uppercase tracking-widest">{row.label}</span>
                  <span className="text-[10px] font-black text-white/80">{row.val}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className={`pt-4 border-t border-white/10`}>
              <p className="text-[8px] uppercase tracking-widest text-white/40 mb-0.5">Total Estimate</p>
              <p className="text-2xl font-black text-[var(--brand-blue)]">₹15,29,348</p>
              <p className="text-[9px] text-white/40 mt-0.5">₹765 per sqft</p>
            </div>

            <Link
              href="/calculator"
              className="mt-5 text-center py-2.5 text-[9px] font-black uppercase tracking-widest border border-[var(--brand-blue)] text-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-black transition-all"
            >
              Calculate Yours →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
