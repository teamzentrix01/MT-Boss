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

const AGENT_TYPES = [
  {
    icon: "🏘️",
    type: "Property Agent",
    earn: "Up to 2% / deal",
    desc: "Refer property buyers to our Buy & Sale division.",
    earnColor: "text-blue-400",
    earnBg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: "🏗️",
    type: "Construction Agent",
    earn: "Up to 3% / project",
    desc: "Connect clients needing construction or renovation projects.",
    earnColor: "text-[#facc15]",
    earnBg: "bg-[#facc15]/10 border-[#facc15]/20",
    popular: true,
  },
  {
    icon: "🤝",
    type: "Franchise Agent",
    earn: "Up to ₹1L / sign-up",
    desc: "Help us find franchise partners across India.",
    earnColor: "text-purple-400",
    earnBg: "bg-purple-500/10 border-purple-500/20",
  },
];

export default function AgentCTA() {
  const dark = useDarkMode();
  const [ref, visible] = useInView(0.08);

  return (
    <section
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
      className={`py-12 px-6 transition-colors duration-500 ${dark ? "bg-black" : "bg-white"}`}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <p className={`text-[9px] font-black uppercase tracking-[0.4em] mb-1.5 ${dark ? "text-[#facc15]" : "text-[#0d6ebd]"}`}>
              Earn with MT Boss
            </p>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none ${dark ? "text-white" : "text-zinc-900"}`}>
              Become an <span className="text-[#facc15]">Agent</span>
            </h2>
          </div>
          <Link
            href="/agent"
            className={`self-start shrink-0 px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${
              dark ? "bg-[#facc15] text-black hover:bg-yellow-300" : "bg-zinc-900 text-white hover:bg-[#facc15] hover:text-black"
            }`}
          >
            Register as Agent →
          </Link>
        </div>

        {/* 3 agent cards — horizontal compact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {AGENT_TYPES.map((agent, i) => (
            <Link
              key={agent.type}
              href="/agent"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
              }}
              className={`group relative flex flex-col gap-3 p-4 border transition-all duration-300 ${
                agent.popular
                  ? dark ? "bg-zinc-950 border-[#facc15]/60" : "bg-white border-zinc-800 shadow-md"
                  : dark ? "bg-zinc-950 border-zinc-800 hover:border-zinc-600" : "bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-sm"
              }`}
            >
              {agent.popular && (
                <span className="absolute -top-2.5 left-4 bg-[#facc15] text-black text-[7px] font-black uppercase tracking-widest px-2 py-0.5">
                  Most Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{agent.icon}</span>
                  <span className={`text-[11px] font-black uppercase tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}>{agent.type}</span>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wide px-2 py-1 border ${agent.earnBg} ${agent.earnColor}`}>
                  {agent.earn}
                </span>
              </div>
              <p className={`text-[10px] leading-relaxed ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{agent.desc}</p>
              <span className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest mt-auto transition-colors ${
                dark ? "text-zinc-600 group-hover:text-[#facc15]" : "text-zinc-300 group-hover:text-[#0d6ebd]"
              }`}>
                Apply Now
                <svg className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 border ${dark ? "border-zinc-800 bg-zinc-950" : "border-zinc-100 bg-zinc-50"}`}>
          {["💰 High Commissions", "🚀 Fast Payouts in 7 days", "📋 Ready Leads Provided", "🌍 Work Anywhere"].map((t) => (
            <span key={t} className={`text-[10px] font-bold ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{t}</span>
          ))}
        </div>

      </div>
    </section>
  );
}
