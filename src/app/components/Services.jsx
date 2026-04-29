"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link"; 

const featuredServices = [
  {
    id: 1,
    title: "Commercial Buildings",
    description: "From corporate offices to retail complexes, we design and construct world-class commercial spaces built to last.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    link: "/services/all", // Confirm folder name is 'services' not 'Services'
  },
  {
    id: 2,
    title: "Hotel & Hospitality",
    description: "We deliver premium hotel and resort construction with meticulous attention to interiors and guest experience.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    link: "/services/all",
  },
  {
    id: 3,
    title: "Residential Projects",
    description: "Affordable housing to luxury villas — MT BOSS builds residential spaces that marry comfort and safety.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    link: "/services/all",
  },
];

function ServiceCard({ service, index, isDark }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-sm cursor-pointer border transition-all duration-500 ${
        isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-100 bg-white'
      }`}
      style={{
        height: "400px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      <img
        src={service.image}
        alt={service.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
      />
      
      <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-black/40' : 'from-black/90 via-black/20'} to-transparent transition-opacity group-hover:opacity-0`} />
      
      <div className="absolute bottom-0 left-0 right-0 p-8 group-hover:opacity-0 group-hover:translate-y-4 transition-all duration-300">
        <div className="w-12 h-0.5 bg-[#facc15] mb-4" />
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{service.title}</h3>
      </div>

      {/* Button click handling via Link */}
      <div className="absolute inset-0 bg-[#facc15] flex flex-col items-center justify-center text-center p-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20">
        <h3 className="text-2xl font-black text-black uppercase mb-4 tracking-tighter">{service.title}</h3>
        <p className="text-sm text-black font-bold leading-relaxed mb-8">{service.description}</p>
        
        {/* Is Link par click karte hi page change ho jayega */}
        <Link 
          href={service.link} 
          className="px-8 py-3 bg-black text-[#facc15] text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default function Services() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark-mode"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`py-24 px-6 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.5em] mb-4">Core Expertise</p>
          <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Major <span className="text-[#facc15]">Services</span>
          </h2>
          <div className="w-20 h-1.5 bg-[#facc15] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {featuredServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} isDark={isDark} />
          ))}
        </div>

        <div className="text-center mt-20">
          <Link 
            href="/Services/all" 
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-transparent border-2 border-[#facc15] text-[#facc15] font-black uppercase text-xs tracking-[0.3em] overflow-hidden transition-all hover:text-white"
          >
            <span className="absolute inset-0 bg-[#facc15] translate-y-full transition-transform group-hover:translate-y-0 -z-10" />
            Explore All Services
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}