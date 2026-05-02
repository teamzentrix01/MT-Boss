"use client";
import { useState, useEffect } from "react";

export default function Footer() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // GLOBAL THEME DETECTION (Sync with layout.js)
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

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Services", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Want to be an Agent?", href: "#" },
  ];

  const serviceLinks = [
    { label: "Commercial Buildings", href: "#" },
    { label: "Hotel & Hospitality", href: "#" },
    { label: "Residential Projects", href: "#" },
    { label: "Industrial & Warehousing", href: "#" },
    { label: "Infrastructure & Roads", href: "#" },
    { label: "EPC Contracting", href: "#" },
  ];

  const socialLinks = [
    { label: "Facebook", href: "#", icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
    { label: "Instagram", href: "#", icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.011 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.012-3.584.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.947s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072z" /> },
    { label: "LinkedIn", href: "#", icon: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /> },
  ];

  const themeYellow = "#facc15";

  return (
    <footer className={`transition-colors duration-500 border-t ${isDark ? 'bg-black border-zinc-900' : 'bg-white border-zinc-100'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="space-y-6">
            <a href="/" className="inline-block">
              {/* Logo brightness adjustment for dark mode */}
              <img src="/logo.png" alt="MTBOSS Logo" className={`h-10 w-auto transition-all ${isDark ? 'brightness-200' : 'brightness-100'}`} />
            </a>
            <p className={`text-sm leading-relaxed font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              MTBOSS Construction is a technology-led EPC company committed to delivering high-end infrastructure solutions across India.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} className={`w-9 h-9 flex items-center justify-center rounded-sm transition-all duration-300 hover:scale-110 ${isDark ? 'bg-zinc-900 text-white hover:bg-[#facc15] hover:text-black' : 'bg-zinc-100 text-zinc-900 hover:bg-[#facc15]'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Navigation
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={`text-sm font-bold transition-colors duration-200 hover:text-[#facc15] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Solutions
            </h3>
            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={`text-sm font-bold transition-colors duration-200 hover:text-[#facc15] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Office
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-1 h-10 rounded-full shrink-0" style={{ backgroundColor: themeYellow }} />
                <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Sector 18, Noida,<br />Uttar Pradesh, India
                </p>
              </div>
              <a href="mailto:info@mtboss.in" className={`block text-sm font-black hover:text-[#facc15] transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                info@mtboss.in
              </a>
              <a href="tel:+911234567890" className={`block text-sm font-black hover:text-[#facc15] transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                +91 12345 67890
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className={`py-6 px-6 border-t ${isDark ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-100 bg-zinc-50'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            © {new Date().getFullYear()} MTBOSS CONSTRUCTION — BUILT WITH PRECISION
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#facc15]">Privacy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#facc15]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}