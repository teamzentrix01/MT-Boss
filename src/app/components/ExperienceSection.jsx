"use client";
import { useState, useEffect, useRef } from "react";

const STATS = [
  { label: "Years of Excellence", value: "22+" },
  { label: "Projects Completed",  value: "450+" },
  { label: "Square Feet Built",   value: "12M+" },
  { label: "Expert Professionals",value: "150+" },
];

const MILESTONES = [
  { year: "2002", title: "The Foundation",       desc: "Started as a small contracting firm in Noida with a vision to redefine infrastructure." },
  { year: "2010", title: "Industrial Expansion", desc: "Successfully delivered our first 1-lakh sq. ft. warehousing complex." },
  { year: "2018", title: "Tech-Led Engineering", desc: "Integrated AI and BIM technology into our core construction process." },
  { year: "2024", title: "National Recognition", desc: "Awarded 'Most Sustainable Infrastructure Company' in the Northern Region." },
];

export default function ExperienceSection() {
  const [isDark, setIsDark] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    checkTheme();
    const themeObs = new MutationObserver(checkTheme);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const scrollObs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) scrollObs.observe(ref.current);

    return () => { themeObs.disconnect(); scrollObs.disconnect(); };
  }, []);

  return (
    <section
      ref={ref}
      className={`py-12 px-6 transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}
    >
      <div className="max-w-6xl mx-auto">

        {/* Stats row */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 border mb-8 ${isDark ? "border-zinc-800 divide-zinc-800" : "border-zinc-100 divide-zinc-100"}`}>
          {STATS.map((s, i) => (
            <div
              key={i}
              className="py-5 px-6 text-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
              }}
            >
              <p className={`text-2xl sm:text-3xl font-black leading-none mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>
                {s.value.replace(/[+M]/g, "")}<span className="text-[#facc15]">{s.value.match(/[+M]+$/)?.[0]}</span>
              </p>
              <p className={`text-[8px] uppercase font-black tracking-widest ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Journey + Timeline */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 border ${isDark ? "border-zinc-800" : "border-zinc-100"}`}
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s" }}
        >
          {/* Left */}
          <div className={`p-7 border-b lg:border-b-0 lg:border-r ${isDark ? "border-zinc-800 bg-zinc-950" : "border-zinc-100 bg-zinc-50"}`}>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-2 text-[#facc15]">Our Journey</p>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-tight mb-3 ${isDark ? "text-white" : "text-zinc-900"}`}>
              Two Decades of <span className="text-[#facc15]">Unmatched</span> Achievements
            </h2>
            <p className={`text-[11px] leading-relaxed mb-5 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
              From a local contractor to a national engineering powerhouse — every project a testament to our commitment to quality.
            </p>
            <button className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${
              isDark ? "bg-[#facc15] text-black hover:bg-yellow-300" : "bg-zinc-900 text-white hover:bg-[#facc15] hover:text-black"
            }`}>
              Download Portfolio
            </button>
          </div>

          {/* Right — compact timeline */}
          <div className={`p-7 ${isDark ? "bg-zinc-950" : "bg-white"}`}>
            <div className="relative space-y-0">
              <div className={`absolute left-[22px] top-3 bottom-3 w-px ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`} />
              {MILESTONES.map((m, i) => (
                <div
                  key={i}
                  className="relative flex gap-4 pb-5 last:pb-0"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 0.4s ease ${i * 100 + 400}ms, transform 0.4s ease ${i * 100 + 400}ms`,
                  }}
                >
                  {/* Dot */}
                  <div className="shrink-0 w-11 flex flex-col items-center pt-0.5 z-10">
                    <div className={`w-2.5 h-2.5 rounded-full border-2 border-[#facc15] ${isDark ? "bg-zinc-950" : "bg-white"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[#facc15] text-[9px] font-black uppercase tracking-widest">{m.year}</span>
                      <span className={`text-[10px] font-black uppercase tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>{m.title}</span>
                    </div>
                    <p className={`text-[10px] leading-relaxed ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
