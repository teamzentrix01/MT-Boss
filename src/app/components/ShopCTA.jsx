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

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// Fallback static categories shown while loading / if API returns empty
const FALLBACK = [
  { id: "f1", name: "Cement",       emoji: "🏗️", types: ["OPC 43 Grade", "PPC", "White Cement"] },
  { id: "f2", name: "Steel",        emoji: "⚙️",  types: ["Carbon Steel", "Stainless Steel", "TMT Bars"] },
  { id: "f3", name: "Sand & Gravel",emoji: "🪨",  types: ["River Sand", "M-Sand", "Coarse Gravel"] },
  { id: "f4", name: "Bricks",       emoji: "🧱",  types: ["Red Bricks", "Fly Ash", "AAC Blocks"] },
  { id: "f5", name: "Paint",        emoji: "🎨",  types: ["Interior", "Exterior", "Waterproof"] },
  { id: "f6", name: "Tiles",        emoji: "🪟",  types: ["Floor Tiles", "Wall Tiles", "Vitrified"] },
];

function CategoryCard({ cat, dark, idx, visible }) {
  const types = Array.isArray(cat.types)
    ? cat.types
    : (typeof cat.types === "string" ? JSON.parse(cat.types || "[]") : []);

  return (
    <Link
      href="/ShopNow"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${idx * 60}ms, transform 0.5s ease ${idx * 60}ms`,
      }}
      className={`group flex flex-col border transition-all duration-300 overflow-hidden ${
        dark
          ? "bg-zinc-950 border-zinc-800 hover:border-[var(--brand-blue)]/60"
          : "bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-lg"
      }`}
    >
      {/* Image or emoji banner */}
      <div className={`relative overflow-hidden flex items-center justify-center ${dark ? "bg-zinc-900" : "bg-zinc-50"}`} style={{ height: 110 }}>
        {cat.image ? (
          <img
            src={cat.image}
            alt={cat.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
          />
        ) : (
          <span className="text-5xl select-none group-hover:scale-110 transition-transform duration-300">{cat.emoji || "🛒"}</span>
        )}
        {/* label badge */}
        {cat.label && (
          <span className="absolute top-2 left-2 bg-[var(--brand-blue)] text-black text-[7px] font-black uppercase tracking-widest px-2 py-0.5">
            {cat.label}
          </span>
        )}
        {/* hover overlay */}
        <div className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center ${dark ? "bg-black/50" : "bg-zinc-900/40"}`}>
          <span className="text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
            Get Quote
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-xs font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}>
            {cat.name}
          </h3>
          {cat.price_range && (
            <span className={`text-[8px] font-bold ${dark ? "text-zinc-500" : "text-zinc-400"}`}>{cat.price_range}</span>
          )}
        </div>

        {/* Type chips */}
        {types.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {types.slice(0, 3).map((t) => (
              <span key={t} className={`text-[7px] font-black uppercase tracking-wide px-1.5 py-0.5 border ${
                dark ? "border-zinc-800 text-zinc-500" : "border-zinc-200 text-zinc-400"
              }`}>
                {t}
              </span>
            ))}
            {types.length > 3 && (
              <span className={`text-[7px] font-bold px-1.5 py-0.5 ${dark ? "text-zinc-600" : "text-zinc-300"}`}>
                +{types.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className={`flex items-center justify-between mt-auto pt-2.5 border-t ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
          <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${dark ? "text-zinc-600 group-hover:text-[var(--brand-blue)]" : "text-zinc-300 group-hover:text-[var(--brand-blue-deep)]"}`}>
            Get Quote →
          </span>
          {cat.unit && (
            <span className={`text-[8px] ${dark ? "text-zinc-600" : "text-zinc-300"}`}>{cat.unit}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ShopCTA() {
  const dark = useDarkMode();
  const [headRef, headVisible] = useInView(0.08);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shop-categories")
      .then((r) => r.json())
      .then((d) => { if (d.success && d.data.length > 0) setCategories(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const display = (loading ? [] : (categories.length > 0 ? categories : FALLBACK)).slice(0, 6);

  return (
    <section className={`py-12 px-6 transition-colors duration-500 ${dark ? "bg-zinc-950" : "bg-zinc-50"}`}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={headRef}
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7"
        >
          <div>
            <p className={`text-[9px] font-black uppercase tracking-[0.4em] mb-1.5 ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>
              Material Marketplace
            </p>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none ${dark ? "text-white" : "text-zinc-900"}`}>
              Construction Materials, <span className="text-[var(--brand-blue)]">Sourced Right</span>
            </h2>
            <div className={`w-8 h-0.5 mt-2 ${dark ? "bg-[var(--brand-blue)]" : "bg-zinc-900"}`} />
          </div>
          <Link
            href="/ShopNow"
            className={`self-start shrink-0 px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${
              dark ? "bg-[var(--brand-blue)] text-black hover:bg-[var(--brand-blue-light)]" : "bg-zinc-900 text-white hover:bg-[var(--brand-blue)] hover:text-black"
            }`}
          >
            Browse All →
          </Link>
        </div>

        {/* How it works — 3 steps inline */}
        <div
          style={{ opacity: headVisible ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}
          className={`flex items-center gap-0 mb-7 border ${dark ? "border-zinc-800" : "border-zinc-100"}`}
        >
          {[
            { n: "1", label: "Pick a Material", icon: "📦" },
            { n: "2", label: "Fill Quick Form", icon: "📋" },
            { n: "3", label: "Supplier Contacts You", icon: "🚀" },
          ].map((s, i) => (
            <div key={s.n} className={`flex-1 flex items-center gap-2.5 py-3 px-4 border-r last:border-r-0 ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
              <span className="text-lg">{s.icon}</span>
              <div>
                <p className={`text-[7px] font-black uppercase tracking-widest ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>Step {s.n}</p>
                <p className={`text-[9px] font-black uppercase ${dark ? "text-white" : "text-zinc-800"}`}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category grid */}
        {loading ? (
          <div className={`text-center py-16 text-[10px] font-black uppercase tracking-widest ${dark ? "text-zinc-700" : "text-zinc-300"}`}>
            Loading categories…
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {display.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} dark={dark} idx={i} visible={headVisible} />
            ))}
          </div>
        )}

        {/* Bottom CTA strip */}
        <div
          style={{ opacity: headVisible ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border ${dark ? "border-zinc-800 bg-black" : "border-zinc-200 bg-white"}`}
        >
          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {["✅ Verified Suppliers", "🚚 Pan-India Delivery", "💬 Expert Support", "🔒 Secure Enquiry"].map((t) => (
              <span key={t} className={`text-[10px] font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{t}</span>
            ))}
          </div>
          <Link
            href="/ShopNow"
            className={`shrink-0 px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${
              dark ? "border border-[var(--brand-blue)] text-[var(--brand-blue)] hover:bg-[var(--brand-blue)] hover:text-black" : "border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            Get a Quote Now →
          </Link>
        </div>

      </div>
    </section>
  );
}
