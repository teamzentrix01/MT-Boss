"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { COMPANY_CONTACT } from "../lib/company";

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
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

export default function FranchiseCTA() {
  const dark = useDarkMode();
  const [ref, visible] = useInView(0.08);

  const points = [
    "Territory-based construction business opportunity",
    "Training, lead support, and operating guidance",
    "Commercials shared after eligibility review",
  ];

  return (
    <section className={`py-14 px-6 transition-colors duration-500 ${dark ? "bg-zinc-950" : "bg-[var(--brand-blue-faint)]"}`}>
      <div
        ref={ref}
        className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-center border p-6 sm:p-8 ${
          dark ? "bg-black border-zinc-800" : "bg-white border-zinc-100 shadow-sm"
        }`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-3 ${dark ? "text-[var(--brand-blue)]" : "text-[var(--brand-blue-deep)]"}`}>
            Franchise Opportunity
          </p>
          <h2 className={`text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight ${dark ? "text-white" : "text-zinc-900"}`}>
            Build with MTboss construction
          </h2>
          <p className={`mt-4 max-w-2xl text-sm leading-7 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
            Start a franchise conversation with our team. We review your city, business background, operating capacity,
            and preferred territory before sharing commercial details.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            {points.map((point) => (
              <div key={point} className={`p-4 border ${dark ? "border-zinc-800 bg-zinc-950" : "border-zinc-100 bg-zinc-50"}`}>
                <p className={`text-xs font-bold leading-5 ${dark ? "text-zinc-300" : "text-zinc-700"}`}>{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-5 border ${dark ? "border-zinc-800 bg-zinc-950" : "border-zinc-100 bg-[var(--brand-blue-faint)]"}`}>
          <p className={`text-xs leading-6 mb-5 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
            Franchise pricing and revenue terms are shared after profile verification and discovery call.
          </p>
          <Link
            href="/franchise"
            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest"
          >
            Request Franchise Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href={COMPANY_CONTACT.telHref}
            className={`mt-3 flex items-center justify-center w-full px-6 py-3 border text-[10px] font-black uppercase tracking-widest ${
              dark ? "border-zinc-700 text-white" : "border-zinc-300 text-zinc-900"
            }`}
          >
            Call Franchise Team
          </a>
        </div>
      </div>
    </section>
  );
}
