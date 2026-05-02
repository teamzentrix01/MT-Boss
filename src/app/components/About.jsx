"use client";
import { useEffect, useRef, useState } from "react";

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&q=80",
  "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1200&q=80",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
];

export default function AboutSection({
  subtitle = "About Us",
  title = "MTBOSS CONSTRUCTION",
  hashtags = ["#StrongFoundationForStrongNation", "#BuildingNation", "#TransformingLives"],
  years = 20,
  images = DEFAULT_IMAGES,
  bgImage = "https://i.pinimg.com/736x/df/95/db/df95db051ac7c4228bcbaecdc24deb9b.jpg",
  paragraph = "MTBOSS Construction is a technology-led engineering, procurement, and construction company committed to delivering sustainable infrastructure across India. From bridges and highways to industrial complexes and urban developments, we bring precision, integrity, and innovation to every project we undertake — on time and within budget.",
  aboutLink = "/About-us",
}) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // GLOBAL THEME DETECTION (Updated to documentElement)
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
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setImgIndex((i) => (i + 1) % images.length);
        setFading(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Updated Theme Colors
  const themeColor = "#facc15"; 
  const bgColor = isDark ? "#000000" : "#ffffff";
  const headingColor = isDark ? "#facc15" : "#eab308"; 
  const bodyTextColor = isDark ? "#d1d5db" : "#4b5563";

  return (
    <section
      ref={sectionRef}
      className={`relative py-24 px-6 text-center overflow-hidden transition-colors duration-500`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Background image only for light mode */}
      {!isDark && (
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }} 
        />
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? "bg-black opacity-100" : "bg-white/50 opacity-100"}`} />

      <div
        className={`relative z-10 transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-xs uppercase tracking-widest mb-1 font-black" style={{ color: headingColor }}>
          {subtitle}
        </p>

        <h2 className="text-3xl sm:text-5xl font-black tracking-wide mb-2 transition-colors duration-500"
          style={{ 
            color: headingColor, 
            textShadow: isDark ? '0 2px 10px rgba(250,204,21,0.3)' : '0 1px 4px rgba(0,0,0,0.1)' 
          }}>
          {title}
        </h2>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-6">
          {hashtags.map((tag) => (
            <span key={tag} className="text-xs font-bold" style={{ color: isDark ? "#ffffff" : "#1f2937" }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="inline-block mb-1">
          <span
            className={`block font-black leading-none select-none transition-opacity duration-400 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
            style={{
              fontSize: "clamp(140px, 22vw, 240px)",
              backgroundImage: `url(${images[imgIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              filter: isDark ? "none" : "drop-shadow(0 4px 12px rgba(0,0,0,0.1))"
            }}
          >
            {years}
          </span>
        </div>

        <p className={`text-base sm:text-lg font-black uppercase tracking-widest mb-3 transition-colors duration-500 ${isDark ? "text-white" : "text-zinc-800"}`}>
          Years Of Experience
        </p>

        <div className="flex justify-center gap-1.5 mb-5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFading(true);
                setTimeout(() => { setImgIndex(i); setFading(false); }, 400);
              }}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ 
                width: i === imgIndex ? "24px" : "8px",
                backgroundColor: i === imgIndex ? themeColor : (isDark ? "#3f3f46" : "#e5e7eb")
              }}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>

        <p className="max-w-xl mx-auto text-sm sm:text-base font-medium leading-relaxed mb-6 transition-colors duration-500"
           style={{ color: bodyTextColor }}>
          {paragraph}
        </p>

        <a
          href={aboutLink}
          className="inline-flex items-center gap-2 px-8 py-3 text-black text-xs font-black uppercase tracking-widest rounded shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
          style={{ backgroundColor: themeColor }}
        >
          Discover More
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>

      </div>
    </section>
  );
}