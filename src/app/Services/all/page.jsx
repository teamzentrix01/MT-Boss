"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
const allServices = [
  {
    id: 1,
    title: "Commercial Buildings",
    description: "From corporate offices to retail complexes, we design and construct world-class commercial spaces built to last — combining structural integrity with modern aesthetics.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
  {
    id: 2,
    title: "Hotel & Hospitality",
    description: "We deliver premium hotel and resort construction with meticulous attention to interiors, MEP systems, and guest experience — on schedule and budget.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
  {
    id: 3,
    title: "Residential Projects",
    description: "Affordable housing to luxury villas — MT BOSS builds residential spaces that marry comfort, safety, and enduring quality for every lifestyle.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: 4,
    title: "Industrial & Warehousing",
    description: "We construct robust industrial plants, factories, and large-scale warehouses engineered for operational efficiency and long-term durability.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
  },
  {
    id: 5,
    title: "Infrastructure & Roads",
    description: "Our infrastructure division handles highways, bridges, flyovers, and urban road networks — delivering precision-engineered public works.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  },
  {
    id: 6,
    title: "EPC Contracting",
    description: "End-to-end Engineering, Procurement & Construction services — we handle design, sourcing, and execution under one roof for seamless delivery.",
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80",
  },
  {
    id: 7,
    title: "Real Estate Development",
    description: "From land acquisition to possession, MT BOSS manages full-cycle real estate development — residential townships and commercial hubs.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    id: 8,
    title: "Interior & Fit-Out Works",
    description: "We offer turnkey interior fit-out solutions for offices, hotels, and retail spaces — blending function with refined aesthetics tailored to your brand.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
  },
  {
    id: 9,
    title: "Project Management",
    description: "Our expert consultants provide end-to-end project management — planning, scheduling, cost control, and quality assurance.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  },
];

export default function AllServicesPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Corrected to observe documentElement (html tag)
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark-mode"));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["class"] 
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>
      
      {/* Hero Section */}
      <section className={`pt-40 pb-20 px-6 text-center border-b ${isDark ? 'border-zinc-900' : 'border-zinc-100'}`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.5em] mb-4">What We Do</p>
          <h1 className={`text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Full Cycle <span className="text-[#facc15]">Solutions</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
            MT BOSS provides end-to-end engineering and infrastructure services. 
            From conceptual design to final construction, we deliver excellence at every stage.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {allServices.map((service) => (
            <div 
              key={service.id}
              className={`group relative h-[450px] overflow-hidden border transition-all duration-500 ${
                isDark ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-100 bg-zinc-50'
              }`}
            >
              {/* Image with Zoom Effect */}
              <img 
                src={service.image} 
                alt={service.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Dark Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black via-black/40' : 'from-black/90 via-black/20'} to-transparent`} />

              {/* Content Box */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <div className="w-12 h-1 bg-[#facc15] mb-6 transform -translate-x-4 group-hover:translate-x-0 transition-transform duration-500" />
                
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                  {service.title}
                </h3>
                
                <p className="text-zinc-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-8">
                  {service.description}
                </p>

                <button className="w-fit px-8 py-3 bg-[#facc15] text-black font-black uppercase text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className={`py-20 text-center ${isDark ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
        <h2 className={`text-3xl font-black uppercase mb-8 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Have a specific project in mind?
        </h2>
       <Link 
  href="/CTASection" 
  className={`px-10 py-4 font-black uppercase text-xs tracking-widest border transition-all ${
    isDark 
    ? 'bg-[#facc15] text-black border-[#facc15] hover:bg-transparent hover:text-[#facc15]' 
    : 'bg-black text-[#facc15] border-black hover:bg-transparent hover:text-black'
  }`}
>
  Get in Touch Now
</Link>
      </section>

    </main>
  );
}