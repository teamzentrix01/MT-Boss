"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function FeaturedProjects() {
  const [isDark, setIsDark] = useState(false);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => { if (data.success) setProjects(data.data.slice(0, 3)); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark-mode"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    const scrollObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) scrollObserver.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      scrollObserver.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-24 px-6 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-zinc-50'}`}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <p className="text-xs font-black uppercase tracking-[0.3em] mb-3" style={{ color: "#facc15" }}>
              Our Masterpieces
            </p>
            <h2 className={`text-4xl sm:text-6xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Featured <br />
              <span style={{ color: isDark ? '#facc15' : 'inherit' }}>Projects</span>
            </h2>
          </div>

          {/* ── FIX 1: was <button>, now <Link> ── */}
          <Link
            href="/FeaturedProjects/ProjectGallery"
            className={`group flex items-center gap-3 px-8 py-4 border-2 font-black uppercase text-xs tracking-widest transition-all ${
              isDark
                ? 'border-zinc-800 text-white hover:bg-[#facc15] hover:text-black hover:border-[#facc15]'
                : 'border-zinc-200 text-zinc-900 hover:bg-black hover:text-white hover:border-black'
            }`}
          >
            View All Projects
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="group relative h-[500px] overflow-hidden bg-zinc-800 transition-all duration-700"
              style={{
                transitionDelay: `${idx * 150}ms`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)'
              }}
            >
              {/* ── FIX 2: was project.image, now project.image_url ── */}
              <img
                src={project.image_url}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1 opacity-70 group-hover:opacity-40"
              />

              {/* Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[#facc15] text-xs font-black uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                  {project.category}{project.location ? ` — ${project.location}` : ''}
                </p>
                <h3 className="text-white text-3xl font-black uppercase leading-none mb-6">
                  {project.title}
                </h3>

                {/* ── FIX 3: was plain <button>, now <Link> ── */}
                <div className="h-0 group-hover:h-12 overflow-hidden transition-all duration-500">
                  <Link
                    href="/FeaturedProjects/ProjectGallery"
                    className="inline-block bg-[#facc15] text-black px-6 py-3 text-[10px] font-black uppercase tracking-tighter hover:bg-white transition-colors"
                  >
                    Explore Details
                  </Link>
                </div>
              </div>

              {/* Decorative number */}
              <span className="absolute top-8 right-8 text-white/10 text-6xl font-black italic group-hover:text-[#facc15]/20 transition-colors">
                0{idx + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div className={`mt-16 h-px w-full transition-colors duration-500 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
      </div>
    </section>
  );
}