"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

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

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#facc15] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>Loading Project…</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="text-center">
          <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">404</p>
          <h1 className={`text-4xl font-black uppercase tracking-tighter mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>Project Not Found</h1>
          <Link href="/FeaturedProjects/ProjectGallery" className="inline-flex items-center gap-3 px-8 py-4 bg-[#facc15] text-black font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all">
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>

      {/* Hero Image */}
      <div className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        <img
          src={project.image_url}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Back button */}
        <Link
          href="/FeaturedProjects/ProjectGallery"
          className="absolute top-8 left-8 flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest border-b-2 border-[#facc15] hover:text-[#facc15] transition-colors"
        >
          ← Back to Gallery
        </Link>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <span className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] block mb-3">
            {project.category}{project.location ? ` — ${project.location}` : ""}
          </span>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
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
            <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">About This Project</p>
            <p className={`text-lg md:text-xl leading-relaxed font-medium ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
              {project.description}
            </p>
          </div>
        )}

        {/* Back CTA */}
        <Link
          href="/FeaturedProjects/ProjectGallery"
          className="inline-flex items-center gap-4 px-12 py-5 bg-[#facc15] text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-black hover:text-white transition-all"
        >
          ← Explore More Projects
        </Link>
      </div>
    </main>
  );
}