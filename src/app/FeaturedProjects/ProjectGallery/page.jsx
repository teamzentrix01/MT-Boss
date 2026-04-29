"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "The Grand Plaza",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    size: "large", // Grid span control
  },
  {
    id: 2,
    title: "Urban Heights",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    size: "small",
  },
  {
    id: 3,
    title: "Heritage Resort",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    size: "small",
  },
  {
    id: 4,
    title: "Industrial Hub X",
    category: "Industrial",
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7edd?w=800&q=80",
    size: "medium",
  },
  {
    id: 5,
    title: "Skyline Villa",
    category: "Luxury Home",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    size: "medium",
  },
  {
    id: 6,
    title: "Tech Park Phase II",
    category: "IT Infrastructure",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    size: "small",
  }
];

export default function ProjectGallery() {
  const [filter, setFilter] = useState("All");
  const [isDark, setIsDark] = useState(false);
  const categories = ["All", "Commercial", "Residential", "Hospitality", "Industrial"];

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark-mode"));
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section className={`py-24 px-6 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.4em] mb-4">Our Portfolio</p>
            <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Featured <span className="text-[#facc15]">Projects</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                  filter === cat 
                    ? 'bg-[#facc15] border-[#facc15] text-black' 
                    : `border-zinc-800 ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`group relative overflow-hidden rounded-sm cursor-pointer transition-all duration-700 ${
                project.size === "large" ? "md:col-span-2 md:row-span-2" : 
                project.size === "medium" ? "md:col-span-2" : ""
              }`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-[#facc15] text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                  {project.category}
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
                  {project.title}
                </h3>
                <Link href={`/projects/${project.id}`} className="text-white text-[10px] font-bold uppercase tracking-widest border-b-2 border-[#facc15] w-fit hover:text-[#facc15] transition-colors">
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <Link href="/projects" className="inline-flex items-center gap-4 px-12 py-5 bg-[#facc15] text-black font-black uppercase text-xs tracking-[0.3em] hover:bg-white transition-all shadow-xl">
            See More Works
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}