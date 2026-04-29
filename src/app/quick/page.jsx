"use client";
import { useState, useEffect } from "react";

const allQuickServices = [
  { id: 1, icon: "🔧", label: "Plumbing", desc: "Complete pipeline solutions, leakage repairs, and premium sanitary fittings for modern homes." },
  { id: 2, icon: "⚡", label: "Electrician", desc: "Expert wiring, circuit management, and appliance installation with guaranteed safety standards." },
  { id: 3, icon: "🎨", label: "Painting", desc: "Transform your spaces with premium emulsions, texture painting, and specialized exterior coatings." },
  { id: 4, icon: "❄️", label: "AC Service", desc: "Advanced AC servicing, chemical cleaning, gas top-ups, and efficient repair for all brands." },
  { id: 5, icon: "🪟", label: "Carpentry", desc: "Custom furniture design, modular kitchen fittings, and precision woodwork by master craftsmen." },
  { id: 6, icon: "🧹", label: "Deep Cleaning", desc: "Hospital-grade sanitization and deep cleaning for every corner of your home and office." },
  { id: 7, icon: "🔒", label: "Locksmith", desc: "High-security lock installations, digital lock setup, and emergency key assistance." },
  { id: 8, icon: "🏠", label: "Waterproofing", desc: "End-to-end seepage solutions for terraces, bathrooms, and basements using nanotechnology." },
  { id: 9, icon: "🪣", label: "Tank Cleaning", desc: "6-stage mechanized water tank cleaning process ensuring 100% bacteria-free water." },
  { id: 10, icon: "🔥", label: "Gas Pipeline", desc: "Safe and certified copper/GI gas pipeline installations for kitchens and industries." },
  { id: 11, icon: "📡", label: "CCTV Install", desc: "Smart surveillance setup with night vision and remote monitoring via mobile apps." },
  { id: 12, icon: "🚿", label: "Bathroom Fit", desc: "Luxury bathroom renovations, shower cubicle fittings, and designer faucet installations." },
  { id: 13, icon: "🪞", label: "Glass & Mirrors", desc: "Sophisticated glass partitions, toughened glass work, and decorative mirror fittings." },
  { id: 14, icon: "🏗️", label: "False Ceiling", desc: "Aesthetic POP and Gypsum ceiling designs with strategic cove lighting and soundproofing." },
  { id: 15, icon: "🧱", label: "Tiling & Flooring", desc: "Flawless installation of Italian marble, vitrified tiles, and wooden flooring solutions." },
  { id: 16, icon: "🔨", label: "Wall Repairs", desc: "Structural crack filling, plastering, and wall strengthening for aging buildings." },
  { id: 17, icon: "💡", label: "Home Automation", desc: "Smart home solutions including automated lighting, climate control, and voice assistants." },
  { id: 18, icon: "🪜", label: "Staircase Work", desc: "Designer wooden, steel, and glass staircases with premium handrails and finishes." },
  { id: 19, icon: "🌿", label: "Garden & Lawn", desc: "Professional landscaping, organic gardening, and vertical garden setup for urban homes." },
  { id: 20, icon: "🏠", label: "Pest Control", desc: "Eco-friendly pest management for termites, rodents, and general household pests." },
];

export default function AllServicesPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check global theme (html class) instead of local body
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark-mode"));
    };

    checkTheme();

    // Listen to theme changes from layout.js
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["class"] 
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className={`min-h-screen font-serif transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}>
      
      {/* Hero Header */}
      <section className={`pt-40 pb-16 px-6 text-center border-b ${isDark ? 'border-zinc-900' : 'border-zinc-100'}`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[#facc15] text-xs font-black uppercase tracking-[0.5em] mb-4">Quality Guaranteed</p>
          <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Our Quick <span className="text-[#facc15]">Home</span> Services
          </h1>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
            Experience hassle-free home maintenance with India's most trusted professionals. 
            Select a service below to learn more or book an appointment.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allQuickServices.map((service) => (
              <div 
                key={service.id}
                className={`group p-10 border transition-all duration-300 relative overflow-hidden ${
                  isDark 
                  ? 'bg-zinc-950 border-zinc-800 hover:border-[#facc15]' 
                  : 'bg-zinc-50 border-zinc-200 hover:bg-white hover:shadow-2xl hover:border-black'
                }`}
              >
                {/* Decorative Number */}
                <span className={`absolute -top-2 -right-2 text-8xl font-black opacity-[0.03] group-hover:text-[#facc15] group-hover:opacity-10 transition-all ${isDark ? 'text-white' : 'text-black'}`}>
                  {service.id < 10 ? `0${service.id}` : service.id}
                </span>

                <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 origin-left">
                  {service.icon}
                </div>
                
                <h3 className={`text-2xl font-black uppercase tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {service.label}
                </h3>
                
                <p className={`text-sm leading-relaxed mb-8 min-h-[60px] ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  {service.desc}
                </p>

                <button className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
                  isDark 
                  ? 'border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-black' 
                  : 'border-black text-black hover:bg-black hover:text-white'
                }`}>
                  Book Service
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}