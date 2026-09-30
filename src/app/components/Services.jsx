"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link"; 

const featuredServices = [
  {
    id: 1,
    title: "Commercial Buildings",
    description: "From corporate offices to retail complexes, we design and construct world-class commercial spaces built to last.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    link: "/Services/all/commercial-buildings",
  },
  {
    id: 2,
    title: "Hotel & Hospitality",
    description: "We deliver premium hotel and resort construction with meticulous attention to interiors and guest experience.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    link: "/Services/all/hotel-hospitality",
  },
  {
    id: 3,
    title: "Residential Projects",
    description: "Affordable housing to luxury villas — MTBOSS builds residential spaces that marry comfort and safety.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    link: "/Services/all/residential-projects",
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
      className={`group relative overflow-hidden rounded-sm border transition-all duration-500 ${
        isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-100 bg-white'
      }`}
      style={{
        height: "400px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      <Link href={service.link} className="absolute inset-0 z-10" aria-label={`View details for ${service.title}`} />

      <Image
        src={service.image}
        alt={service.title}
        fill
        sizes="(max-width: 767px) 100vw, 33vw"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
      />
      
      {/* Dark gradient for default/mobile view */}
      <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-black/60' : 'from-black/95 via-black/50'} to-transparent transition-opacity duration-300 md:group-hover:opacity-0`} />
      
      {/* Mobile visible content & Desktop base content */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end transition-all duration-300 md:group-hover:opacity-0 md:group-hover:translate-y-4">
        <div className="w-12 h-0.5 bg-[var(--brand-blue)] mb-3" />
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-2 drop-shadow-md">{service.title}</h3>
        {service.description && (
          <p className="text-xs text-zinc-300 line-clamp-2 mb-4 md:hidden leading-relaxed font-medium">
            {service.description}
          </p>
        )}
        <div className="md:hidden">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg rounded-none">
            View Details
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>

      {/* Desktop Hover Overlay */}
      <div className="hidden md:flex absolute inset-0 bg-[var(--brand-blue)] flex-col items-center justify-center text-center p-8 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-20 pointer-events-none">
        <h3 className="text-2xl font-black text-black uppercase mb-4 tracking-tighter">{service.title}</h3>
        <p className="text-sm text-black font-bold leading-relaxed mb-8">{service.description}</p>
        
        <span 
          className="px-8 py-3 bg-black text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
        >
          View Details
        </span>
      </div>
    </div>
  );
}

export default function Services() {
  const [isDark, setIsDark] = useState(false);
  const [services, setServices] = useState(featuredServices);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark-mode"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/primary-services")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length) {
          setServices(data.data.slice(0, 3).map((service) => ({
            id: service.id,
            title: service.title,
            description: service.description,
            image: service.image,
            link: `/Services/all/${service.slug}`,
          })));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className={`py-24 px-6 transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[var(--brand-blue)] text-xs font-black uppercase tracking-[0.5em] mb-4">Core Expertise</p>
          <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Construction <span className="text-[var(--brand-blue)]">Services</span>
          </h2>
          <div className="w-20 h-1.5 bg-[var(--brand-blue)] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} isDark={isDark} />
          ))}
        </div>

        <div className="text-center mt-20">
          <Link 
            href="/Services/all" 
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-transparent border-2 border-[var(--brand-blue)] text-[var(--brand-blue)] font-black uppercase text-xs tracking-[0.3em] overflow-hidden transition-all hover:text-white"
          >
            <span className="absolute inset-0 bg-[var(--brand-blue)] translate-y-full transition-transform group-hover:translate-y-0 -z-10" />
            Explore Construction Services
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
