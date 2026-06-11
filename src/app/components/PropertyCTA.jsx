"use client";
import { useEffect, useRef, useState } from "react";
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

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const CARDS = [
  {
    type: "BUY",
    headline: "Find Your Dream Home",
    sub: "Browse verified properties for sale across India. Filter by location, budget, type, and more.",
    href: "/property/buy",
    cta: "Browse Properties",
    stats: [{ val: "500+", label: "Listings" }, { val: "20+", label: "Cities" }, { val: "100%", label: "Verified" }],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path d="M8 28L32 8l24 20v28H40V40H24v16H8V28z" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <rect x="26" y="40" width="12" height="16" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M20 28h8M36 28h8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="28" r="4" strokeWidth="2" />
      </svg>
    ),
    accent: "#facc15",
    accentDark: "#facc15",
  },
  {
    type: "SELL",
    headline: "List & Sell Fast",
    sub: "List your property for free. Get it verified and reach thousands of serious buyers instantly.",
    href: "/property/sell",
    cta: "List Your Property",
    stats: [{ val: "Free", label: "Listing" }, { val: "Fast", label: "Approval" }, { val: "Direct", label: "Buyers" }],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <rect x="10" y="16" width="44" height="36" rx="2" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M10 24h44" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22 16V10M42 16V10" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 36l6 6 18-14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: "#facc15",
    accentDark: "#facc15",
  },
  {
    type: "RENT",
    headline: "Rent with Confidence",
    sub: "Find tenant-ready rental properties or list yours for rent. Zero brokerage, transparent pricing.",
    href: "/property/rent",
    cta: "Explore Rentals",
    stats: [{ val: "₹0", label: "Brokerage" }, { val: "Quick", label: "Move-in" }, { val: "Safe", label: "Contracts" }],
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path d="M12 56V28L32 12l20 16v28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="22" y="38" width="20" height="18" rx="1" strokeWidth="2.5" />
        <path d="M32 38V56" strokeWidth="2" strokeLinecap="round" />
        <path d="M28 30h8M24 22h16" strokeWidth="2" strokeLinecap="round" />
        <circle cx="44" cy="18" r="8" strokeWidth="2.5" />
        <path d="M44 15v4l2 2" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    accent: "#facc15",
    accentDark: "#facc15",
  },
];

function Card({ card, dark, idx }) {
  const [ref, visible] = useInView(0.08);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${idx * 100}ms, transform 0.6s ease ${idx * 100}ms`,
      }}
      className={`group relative flex flex-col border transition-all duration-400 overflow-hidden ${
        dark
          ? "bg-zinc-950 border-zinc-800 hover:border-[#facc15]"
          : "bg-white border-zinc-100 hover:border-zinc-900 hover:shadow-2xl"
      }`}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-full transition-all duration-500"
        style={{ background: hovered ? "#facc15" : "transparent" }}
      />

      {/* Type badge + icon row */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <span className={`inline-block px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] mb-3 ${
            dark ? "bg-[#facc15] text-black" : "bg-zinc-900 text-white"
          }`}>
            {card.type}
          </span>
          <h3 className={`text-xl font-black uppercase tracking-tight leading-tight ${
            dark ? "text-white" : "text-zinc-900"
          }`}>
            {card.headline}
          </h3>
        </div>
        {/* Icon */}
        <div
          className={`shrink-0 ml-4 w-14 h-14 transition-colors duration-300 ${
            dark ? "text-[#facc15]" : "text-[#0d6ebd]"
          } ${hovered ? (dark ? "text-white" : "text-zinc-900") : ""}`}
          style={{ stroke: "currentColor" }}
        >
          {card.icon}
        </div>
      </div>

      {/* Description */}
      <p className={`px-6 pb-5 text-[11px] leading-relaxed flex-1 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
        {card.sub}
      </p>

      {/* Stats row */}
      <div className={`mx-6 mb-5 grid grid-cols-3 divide-x border ${
        dark ? "border-zinc-800 divide-zinc-800" : "border-zinc-100 divide-zinc-100"
      }`}>
        {card.stats.map((s) => (
          <div key={s.label} className="py-3 text-center">
            <p className={`text-sm font-black ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>{s.val}</p>
            <p className={`text-[8px] uppercase tracking-widest mt-0.5 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <Link
          href={card.href}
          className={`flex items-center justify-between w-full px-5 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 group/btn ${
            dark
              ? "bg-zinc-900 text-white border border-zinc-700 hover:bg-[#facc15] hover:text-black hover:border-[#facc15]"
              : "bg-zinc-900 text-white hover:bg-[#facc15] hover:text-black"
          }`}
        >
          {card.cta}
          <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function PropertyCTA() {
  const dark = useDarkMode();
  const [headRef, headVisible] = useInView(0.1);

  return (
    <section className={`py-16 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-[#f0f7ff]"}`}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={headRef}
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>
              MTbossProperty
            </p>
            <h2 className={`text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none ${dark ? "text-white" : "text-zinc-900"}`}>
              Buy, Sell &amp; <span className="text-[#facc15]">Rent</span>
            </h2>
            <div className={`w-10 h-0.5 mt-3 ${dark ? "bg-[#facc15]" : "bg-zinc-900"}`} />
          </div>
          <p className={`text-[11px] leading-relaxed max-w-xs ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
            Everything property-related in one place — find your next home, sell yours, or list it for rent.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CARDS.map((card, i) => (
            <Card key={card.type} card={card} dark={dark} idx={i} />
          ))}
        </div>

        {/* Bottom strip */}
        <div
          ref={headRef}
          className={`mt-8 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border ${
            dark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-4">
            {[
              { icon: "✅", text: "Admin-Verified Listings" },
              { icon: "🔒", text: "Secure & Transparent" },
              { icon: "📍", text: "Pan-India Coverage" },
            ].map((item) => (
              <span key={item.text} className={`flex items-center gap-1.5 text-[10px] font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                <span>{item.icon}</span> {item.text}
              </span>
            ))}
          </div>
          <Link
            href="/property/buy"
            className={`shrink-0 px-7 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${
              dark ? "bg-[#facc15] text-black hover:bg-yellow-300" : "bg-zinc-900 text-white hover:bg-[#facc15] hover:text-black"
            }`}
          >
            View All Properties →
          </Link>
        </div>
      </div>
    </section>
  );
}
