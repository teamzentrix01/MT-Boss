"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setProject(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!project) return;
    const images = [project.image_url, ...(project.additional_images?.map(img => img.image_url) || [])];
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [project]);

  const images = project ? [project.image_url, ...(project.additional_images?.map(img => img.image_url) || [])] : [];
  
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[var(--brand-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Loading Project…</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="text-center">
          <p className="text-[var(--brand-blue)] text-xs font-black uppercase tracking-[0.4em] mb-4">404</p>
          <h1 className={`text-4xl font-black uppercase tracking-tighter mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>Project Not Found</h1>
          <Link href="/FeaturedProjects/ProjectGallery" className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand-blue)] text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all">
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>

      {/* Hero Image Slider */}
      <div className="relative h-[60vh] md:h-[75vh] overflow-hidden group">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${project.title} - ${idx}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        {/* Slider Controls */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-[var(--brand-blue)] text-white hover:text-black rounded-full border border-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-[var(--brand-blue)] text-white hover:text-black rounded-full border border-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImageIndex ? "bg-[var(--brand-blue)] w-8" : "bg-white/50 hover:bg-white"}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Back button */}
        <Link
          href="/FeaturedProjects/ProjectGallery"
          className="absolute top-8 left-8 flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest border-b-2 border-[var(--brand-blue)] hover:text-[var(--brand-blue)] transition-colors"
        >
          ← Back to Gallery
        </Link>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <span className="text-[var(--brand-blue)] text-xs font-black uppercase tracking-[0.4em] block mb-3">
            {project.category}{project.location ? ` — ${project.location}` : ""}
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">

        {/* Meta row */}
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-6 pb-12 mb-12 border-b-2 ${isDark ? "border-zinc-800" : "border-zinc-100"}`}>
          {[
            { label: "Category", value: project.category },
            { label: "Location", value: project.location || "—" },
            { label: "Size", value: project.size ? project.size.charAt(0).toUpperCase() + project.size.slice(1) : "—" },
          ].map(item => (
            <div key={item.label}>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>
                {item.label}
              </p>
              <p className={`text-base font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        {project.description && (
          <div className="mb-16">
            <p className="text-[var(--brand-blue)] text-xs font-black uppercase tracking-[0.4em] mb-4">About This Project</p>
            <p className={`text-lg md:text-xl leading-relaxed font-medium ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
              {project.description}
            </p>
          </div>
        )}

        {/* Back CTA */}
        <Link
          href="/FeaturedProjects/ProjectGallery"
          className="inline-flex items-center gap-4 px-12 py-5 bg-[var(--brand-blue)] text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-black hover:text-white transition-all"
        >
          ← Explore More Projects
        </Link>
      </div>
    </main>
  );
}