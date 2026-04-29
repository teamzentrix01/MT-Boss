"use client";
import { useState, useEffect, useRef } from "react";

const stats = [
  { label: "Years of Excellence", value: "22+", suffix: "" },
  { label: "Projects Completed", value: "450", suffix: "+" },
  { label: "Square Feet Built", value: "12", suffix: "M+" },
  { label: "Expert Professionals", value: "150", suffix: "+" },
];

const milestones = [
  {
    year: "2002",
    title: "The Foundation",
    description: "Started as a small contracting firm in Noida with a vision to redefine infrastructure."
  },
  {
    year: "2010",
    title: "Industrial Expansion",
    description: "Successfully delivered our first 1-lakh sq. ft. warehousing complex."
  },
  {
    year: "2018",
    title: "Tech-Led Engineering",
    description: "Integrated AI and sustainable BIM technology into our core construction process."
  },
  {
    year: "2024",
    title: "National Recognition",
    description: "Awarded as the 'Most Sustainable Infrastructure Company' in the Northern Region."
  }
];

export default function ExperienceSection() {
  const [isDark, setIsDark] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // UPDATED: Ab ye documentElement (html) ko check karega
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
      className={`py-5 px-6 transition-colors duration-500 overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* TOP SECTION: COUNTERS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`text-center p-8 border-l-2 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ 
                transitionDelay: `${idx * 100}ms`,
                borderColor: "#facc15" 
              }}
            >
              <h3 className={`text-4xl sm:text-6xl font-black mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {stat.value}<span className="text-[#facc15]">{stat.suffix}</span>
              </h3>
              <p className={`text-[10px] uppercase font-black tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* BOTTOM SECTION: TIMELINE & EXPERIENCE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className={`${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'} transition-all duration-1000`}>
            <p className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: "#facc15" }}>
              Our Journey
            </p>
            <h2 className={`text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-8 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Two Decades of <br /> <span className="text-[#facc15]">Unmatched</span> <br /> Achievements
            </h2>
            <p className={`text-lg mb-10 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              MT BOSS has evolved from a local contractor to a national engineering powerhouse. Our experience spans across sectors, ensuring that every brick laid is a testament to our commitment to quality.
            </p>
            <button className={`px-10 py-4 font-black uppercase text-xs tracking-widest transition-all ${
              isDark ? 'bg-[#facc15] text-black' : 'bg-black text-white hover:bg-[#facc15] hover:text-black'
            }`}>
              Download Portfolio
            </button>
          </div>

          <div className="space-y-12 relative">
            <div className={`absolute left-0 top-0 w-px h-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`} />

            {milestones.map((m, idx) => (
              <div 
                key={idx} 
                className={`relative pl-10 group transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                <div className="absolute left-[-4.5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-[#facc15] group-hover:scale-150 transition-all duration-300" />
                
                <span className="text-sm font-black text-[#facc15] mb-2 block">{m.year}</span>
                <h4 className={`text-xl font-black uppercase mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {m.title}
                </h4>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                  {m.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}