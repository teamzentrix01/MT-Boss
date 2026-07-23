"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PortfolioProjectCard from "../components/PortfolioProjectCard";



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
    // GLOBAL THEME DETECTION (documentElement focus)
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
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <p className="text-xs font-black uppercase tracking-[0.3em] mb-3" style={{ color: "var(--brand-blue)" }}>
              Our Masterpieces
            </p>
            <h2 className={`text-4xl sm:text-6xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Featured <br /> <span style={{ color: isDark ? 'var(--brand-blue)' : 'inherit' }}>Portfolio</span>
            </h2>
          </div>
          <Link href="/FeaturedProjects/ProjectGallery" className={`group flex items-center gap-3 px-8 py-4 border-2 font-black uppercase text-xs tracking-widest transition-all ${
            isDark 
            ? 'border-zinc-800 text-white hover:bg-[var(--brand-blue)] hover:text-black hover:border-[var(--brand-blue)]' 
            : 'border-zinc-200 text-zinc-900 hover:bg-black hover:text-white hover:border-black'
          }`}>
            View All Portfolio
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <PortfolioProjectCard
              key={project.id}
              project={project}
              index={idx}
              isDark={isDark}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Bottom Decorative Line */}
        <div className={`mt-16 h-px w-full transition-colors duration-500 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
      </div>
    </section>
  );
}
