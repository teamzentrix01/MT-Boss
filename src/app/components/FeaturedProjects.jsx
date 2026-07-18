"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function FeaturedProjects() {
  const [isDark, setIsDark] = useState(false);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!isVisible) return;
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { if (data.success) setProjects(data.data.slice(0, 3)); })
      .catch(console.error);
  }, [isVisible]);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    checkTheme();
    const themeObs = new MutationObserver(checkTheme);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const scrollObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) scrollObs.observe(sectionRef.current);

    return () => { themeObs.disconnect(); scrollObs.disconnect(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-12 px-6 transition-colors duration-500 ${isDark ? "bg-black" : "bg-zinc-50"}`}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
        >
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-1.5 text-[var(--brand-blue)]">Our Portfolio</p>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none ${isDark ? "text-white" : "text-zinc-900"}`}>
              Featured <span className="text-[var(--brand-blue)]">Portfolio</span>
            </h2>
          </div>
          <Link
            href="/FeaturedProjects/ProjectGallery"
            className={`group self-start flex items-center gap-2 px-5 py-2.5 border font-black uppercase text-[9px] tracking-widest transition-all ${
              isDark
                ? "border-zinc-700 text-white hover:bg-[var(--brand-blue)] hover:text-black hover:border-[var(--brand-blue)]"
                : "border-zinc-300 text-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-900"
            }`}
          >
            View All Portfolio
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Empty state */}
        {projects.length === 0 && (
          <div className={`text-center py-16 border text-[10px] font-black uppercase tracking-widest ${isDark ? "border-zinc-800 text-zinc-700" : "border-zinc-100 text-zinc-300"}`}>
            No projects added yet
          </div>
        )}

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="group relative overflow-hidden bg-zinc-800"
              style={{
                height: 240,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.55s ease ${idx * 120}ms, transform 0.55s ease ${idx * 120}ms`,
              }}
            >
              <img
                src={project.image_url}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-40"
              />

              {/* Overlay */}
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <p className="text-[var(--brand-blue)] text-[8px] font-black uppercase tracking-widest mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.category}{project.location ? ` — ${project.location}` : ""}
                </p>
                <h3 className="text-white text-sm font-black uppercase leading-tight mb-2">{project.title}</h3>
                <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-500">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-block bg-[var(--brand-blue)] text-black px-4 py-1.5 text-[8px] font-black uppercase tracking-widest hover:bg-white transition-colors"
                  >
                    Explore Details
                  </Link>
                </div>
              </div>

              {/* Number watermark */}
              <span className="absolute top-3 right-3 text-white/10 text-3xl font-black italic group-hover:text-[var(--brand-blue)]/20 transition-colors">
                0{idx + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom divider */}
        <div className={`mt-8 h-px w-full ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
      </div>
    </section>
  );
}
