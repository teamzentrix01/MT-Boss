"use client";
import { useState, useEffect, useRef } from "react";

const FALLBACK_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
    label: "Engineering Excellence",
    title: "Sustainable Technology Led",
    subtitle: "Engineering, Procurement & Construction",
    description: "We provide simple and innovative solutions to deliver complex projects on time.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80",
    label: "Engineering Excellence",
    title: "Building Tomorrow's",
    subtitle: "Infrastructure Today",
    description: "Delivering world-class infrastructure across energy, transport, and urban development.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&q=80",
    label: "Engineering Excellence",
    title: "Precision Engineering",
    subtitle: "At Every Scale",
    description: "From concept to commissioning — trusted by industry leaders across India and beyond.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1600&q=80",
    label: "Engineering Excellence",
    title: "Innovation Driven",
    subtitle: "Construction Excellence",
    description: "Leveraging cutting-edge technology to redefine what's possible in modern construction.",
  },
];

const AUTOPLAY_DELAY = 5000;

export default function Hero() {
  const [slides, setSlides]       = useState(FALLBACK_SLIDES);
  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [isDark, setIsDark]       = useState(false);

  const timerRef     = useRef(null);
  const progressRef  = useRef(null);
  const startTimeRef = useRef(null);

  // Fetch dynamic banners from DB; fall back to hardcoded if empty
  useEffect(() => {
    fetch('/api/hero-banners')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data.length > 0) setSlides(data.data);
      })
      .catch(() => {}); // silently keep fallback
  }, []);

  useEffect(() => {
    // UPDATED: Ab ye documentElement (html) ko monitor karega
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

  // Isse dark/light mode ke hisaab se image ke upar ka gradient change hoga
  const overlayGradient = isDark 
    ? "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)"
    : "linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, rgba(0,0,0,0.1) 100%)";

  const goTo = (index) => {
    if (animating || index === current) return;
    setAnimating(true);
    setCurrent(index);
    resetProgress();
    setTimeout(() => setAnimating(false), 800);
  };

  const next = () => goTo((current + 1) % slides.length);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  const resetProgress = () => {
    setProgress(0);
    startTimeRef.current = performance.now();
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
      resetProgress();
    }, AUTOPLAY_DELAY);
    return () => clearInterval(timerRef.current);
  }, [current]);

  useEffect(() => {
    startTimeRef.current = performance.now();
    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100);
      setProgress(pct);
      if (pct < 100) progressRef.current = requestAnimationFrame(animate);
    };
    progressRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current]);

  return (
    <section
      className={`relative w-full overflow-hidden transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"}`}
      style={{ height: "100svh", minHeight: "480px", maxHeight: "900px" }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={slide.image_url || slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              transform: i === current ? "scale(1.05)" : "scale(1)",
              transition: "transform 6s ease-out",
            }}
          />

          <div className="absolute inset-0 transition-all duration-500" style={{ background: overlayGradient }} />

          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
              <div className="max-w-2xl">

                {/* Label line — slides in from left */}
                <div className="flex items-center gap-3 mb-4"
                  style={{
                    opacity:    i === current ? 1 : 0,
                    transform:  i === current ? "translateX(0)"   : "translateX(-32px)",
                    transition: i === current ? "opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s" : "none",
                  }}>
                  <span className={`block h-px ${isDark ? "bg-[var(--brand-blue)]" : "bg-zinc-800"}`}
                    style={{
                      minWidth:   i === current ? "40px" : "0px",
                      width:      i === current ? "40px" : "0px",
                      transition: i === current ? "width 0.6s ease 0.3s, min-width 0.6s ease 0.3s" : "none",
                    }} />
                  <span className={`text-xs sm:text-sm uppercase tracking-[0.22em] font-semibold ${isDark ? "text-[var(--brand-blue)]" : "text-zinc-800"}`}>
                    {slide.label || "Engineering Excellence"}
                  </span>
                </div>

                {/* Title — slides up with slight blur */}
                <h1
                  className={`font-bold leading-[1.1] mb-2 ${isDark ? "text-[var(--brand-blue)]" : "text-zinc-900"}`}
                  style={{
                    fontSize:   "clamp(2rem, 5vw, 3.8rem)",
                    textShadow: isDark ? "0 2px 10px rgba(0,0,0,0.5)" : "none",
                    opacity:    i === current ? 1 : 0,
                    transform:  i === current ? "translateY(0)"   : "translateY(48px)",
                    filter:     i === current ? "blur(0px)"       : "blur(4px)",
                    transition: i === current ? "opacity 0.75s ease 0.25s, transform 0.75s cubic-bezier(0.22,1,0.36,1) 0.25s, filter 0.75s ease 0.25s" : "none",
                  }}
                >
                  {slide.title}
                </h1>

                {/* Subtitle — slides up, slightly delayed */}
                <h2
                  className={`font-bold leading-[1.1] mb-6 ${isDark ? "text-white" : "text-zinc-700"}`}
                  style={{
                    fontSize:   "clamp(1.5rem, 4vw, 2.8rem)",
                    textShadow: isDark ? "0 2px 10px rgba(0,0,0,0.5)" : "none",
                    opacity:    i === current ? 1 : 0,
                    transform:  i === current ? "translateY(0)"   : "translateY(48px)",
                    filter:     i === current ? "blur(0px)"       : "blur(4px)",
                    transition: i === current ? "opacity 0.75s ease 0.4s, transform 0.75s cubic-bezier(0.22,1,0.36,1) 0.4s, filter 0.75s ease 0.4s" : "none",
                  }}
                >
                  {slide.subtitle}
                </h2>

                {/* Description — fades up last */}
                <p
                  className={`mb-10 leading-relaxed font-medium ${isDark ? "text-zinc-300" : "text-zinc-600"}`}
                  style={{
                    fontSize:   "clamp(0.95rem, 1.6vw, 1.15rem)",
                    maxWidth:   "520px",
                    opacity:    i === current ? 1 : 0,
                    transform:  i === current ? "translateY(0)"   : "translateY(28px)",
                    transition: i === current ? "opacity 0.7s ease 0.55s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s" : "none",
                  }}
                >
                  {slide.description}
                </p>

              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button onClick={prev} className={`absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full border transition-all ${isDark ? 'border-zinc-700 text-white bg-black/20 hover:bg-[var(--brand-blue)] hover:text-black hover:border-[var(--brand-blue)]' : 'border-zinc-300 text-zinc-800 bg-white/20 hover:bg-black hover:text-white hover:border-black'} backdrop-blur-md`} aria-label="Previous slide">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
      </button>
      
      <button onClick={next} className={`absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full border transition-all ${isDark ? 'border-zinc-700 text-white bg-black/20 hover:bg-[var(--brand-blue)] hover:text-black hover:border-[var(--brand-blue)]' : 'border-zinc-300 text-zinc-800 bg-white/20 hover:bg-black hover:text-white hover:border-black'} backdrop-blur-md`} aria-label="Next slide">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center gap-6">
          <div className="flex items-center gap-4">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="relative h-1.5 flex items-center">
                {i === current ? (
                  <div className={`w-16 h-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                    <div className="h-full bg-[var(--brand-blue)] transition-none" style={{ width: `${progress}%` }} />
                  </div>
                ) : (
                  <div className={`w-6 h-full rounded-full transition-all ${isDark ? 'bg-zinc-800 hover:bg-zinc-600' : 'bg-zinc-300 hover:bg-zinc-400'}`} />
                )}
              </button>
            ))}
          </div>
          <div className={`text-[10px] font-black tracking-[0.3em] ml-auto ${isDark ? 'text-[var(--brand-blue)]' : 'text-zinc-900'}`}>
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </section>
  );
}