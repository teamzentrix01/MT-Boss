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

const MODELS = [
  {
    name: "Associate Partner",
    investment: "₹5 – 10 Lakhs",
    roi: "Up to 20% ROI",
    territory: "Single City",
    support: "Basic",
    features: ["Project referral rights", "Brand license", "Sales training", "Marketing materials", "Relationship manager"],
    borderColor: "border-blue-500/40",
    badgeBg: "bg-blue-500",
    roiColor: "text-blue-400",
  },
  {
    name: "Regional Franchise",
    investment: "₹25 – 50 Lakhs",
    roi: "Up to 35% ROI",
    territory: "Multiple Districts",
    support: "Premium",
    features: ["Exclusive territory rights", "Full brand partnership", "Technical support", "Lead generation", "Revenue sharing", "Priority allocation"],
    borderColor: "border-[#facc15]/60",
    badgeBg: "bg-[#facc15]",
    roiColor: "text-[#facc15]",
    popular: true,
  },
  {
    name: "Master Franchise",
    investment: "₹1 Cr+",
    roi: "Up to 50% ROI",
    territory: "Entire State",
    support: "Elite",
    features: ["State-level exclusivity", "Sub-franchise rights", "Board representation", "Dedicated pipeline", "Co-branding", "Direct CEO access"],
    borderColor: "border-purple-500/40",
    badgeBg: "bg-purple-500",
    roiColor: "text-purple-400",
  },
];

function ModelCard({ model, dark, idx, visible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s ease ${idx * 100}ms, transform 0.55s ease ${idx * 100}ms`,
      }}
      className={`relative flex flex-col border transition-all duration-300 overflow-hidden ${
        model.popular
          ? dark ? `bg-zinc-950 ${model.borderColor} shadow-lg` : `bg-white ${model.borderColor} border-2 shadow-xl`
          : dark ? `bg-zinc-950 ${model.borderColor} border hover:border-opacity-80` : `bg-white border-zinc-100 border hover:border-zinc-300 hover:shadow-md`
      }`}
    >
      {/* Popular badge */}
      {model.popular && (
        <div className="flex justify-center py-1.5 bg-[#facc15]">
          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-black">Most Popular</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Support badge + name */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-1 text-white ${model.badgeBg}`}>
            {model.support} Support
          </span>
        </div>
        <h3 className={`text-base font-black uppercase tracking-tight mb-1 ${dark ? "text-white" : "text-zinc-900"}`}>
          {model.name}
        </h3>

        {/* Investment */}
        <p className={`text-xl font-black mb-0.5 ${model.roiColor}`}>{model.investment}</p>
        <p className={`text-[9px] uppercase tracking-widest mb-4 ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Investment Range</p>

        {/* ROI + Territory chips */}
        <div className={`grid grid-cols-2 divide-x mb-4 border ${dark ? "border-zinc-800 divide-zinc-800" : "border-zinc-100 divide-zinc-100"}`}>
          <div className="py-2.5 px-3">
            <p className={`text-[10px] font-black ${model.roiColor}`}>{model.roi}</p>
            <p className={`text-[8px] uppercase tracking-widest ${dark ? "text-zinc-600" : "text-zinc-400"}`}>Returns</p>
          </div>
          <div className="py-2.5 px-3">
            <p className={`text-[10px] font-black ${dark ? "text-white" : "text-zinc-800"}`}>{model.territory}</p>
            <p className={`text-[8px] uppercase tracking-widest ${dark ? "text-zinc-600" : "text-zinc-400"}`}>Territory</p>
          </div>
        </div>

        {/* Features list */}
        <ul className={`space-y-1.5 mb-5 flex-1 border-t pt-4 ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
          {model.features.map((f) => (
            <li key={f} className={`flex items-center gap-2 text-[10px] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
              <svg className={`w-2.5 h-2.5 shrink-0 ${model.roiColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/franchise"
          className={`flex items-center justify-between w-full px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-all duration-300 group/btn ${
            model.popular
              ? "bg-[#facc15] text-black hover:bg-yellow-300"
              : dark
              ? "bg-zinc-900 text-white border border-zinc-700 hover:bg-[#facc15] hover:text-black hover:border-[#facc15]"
              : "bg-zinc-900 text-white hover:bg-[#facc15] hover:text-black"
          }`}
        >
          Apply for {model.name.split(" ")[0]} {model.name.split(" ")[1] || ""}
          <svg className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function FranchiseCTA() {
  const dark = useDarkMode();
  const [ref, visible] = useInView(0.08);

  return (
    <section
      className={`py-12 px-6 transition-colors duration-500 ${dark ? "bg-zinc-900" : "bg-[#f0f7ff]"}`}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          ref={ref}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8"
        >
          <div>
            <p className={`text-[9px] font-black uppercase tracking-[0.4em] mb-1.5 ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>
              Own a Business
            </p>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none ${dark ? "text-white" : "text-zinc-900"}`}>
              MT Boss <span className="text-[#facc15]">Franchise</span>
            </h2>
            <div className={`w-8 h-0.5 mt-2 ${dark ? "bg-[#facc15]" : "bg-zinc-900"}`} />
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <p className={`text-[10px] leading-relaxed max-w-xs text-right ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
              Own a piece of India's fastest-growing construction brand. Three models for every investment level.
            </p>
            <Link
              href="/franchise"
              className={`shrink-0 px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                dark ? "bg-[#facc15] text-black hover:bg-yellow-300" : "bg-zinc-900 text-white hover:bg-[#facc15] hover:text-black"
              }`}
            >
              View All Models →
            </Link>
          </div>
        </div>

        {/* Model cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {MODELS.map((model, i) => (
            <ModelCard key={model.name} model={model} dark={dark} idx={i} visible={visible} />
          ))}
        </div>

        {/* Trust strip */}
        <div
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.4s" }}
          className={`flex flex-wrap items-center justify-between gap-4 px-5 py-4 border ${dark ? "border-zinc-800 bg-zinc-950" : "border-zinc-200 bg-white"}`}
        >
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { icon: "🏆", text: "20+ Yrs Established Brand" },
              { icon: "📈", text: "Up to 50% ROI" },
              { icon: "🤝", text: "End-to-End Support" },
              { icon: "🌍", text: "50+ Cities Network" },
            ].map((b) => (
              <span key={b.text} className={`flex items-center gap-1.5 text-[10px] font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                {b.icon} {b.text}
              </span>
            ))}
          </div>
          <Link
            href="/franchise"
            className={`shrink-0 px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${
              dark ? "border border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black" : "border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            Apply Now →
          </Link>
        </div>

      </div>
    </section>
  );
}
