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
    { label: "About Us", href: "/About-us" },
    { label: "Shop Now", href: "/ShopNow" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
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
    { label: "Facebook", href: "https://www.facebook.com/Mtbosscompany/", icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
    { label: "Instagram", href: "https://www.instagram.com/mtboss.in/", icon: (
      <>
        <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7z" />
        <path d="M12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z" />
        <circle cx="17.5" cy="6.5" r="1.3" />
      </>
    ) },
    { label: "LinkedIn", href: "https://in.linkedin.com/company/mtboss-construction-company", icon: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /> },
    { label: "Twitter", href: "https://x.com/mtboss", icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
    { label: "YouTube", href: "https://www.youtube.com/@mtboss", icon: <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> },
  ];

  const themeYellow = "var(--brand-blue)";

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
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`w-9 h-9 flex items-center justify-center rounded-sm transition-all duration-300 hover:scale-110 ${isDark ? 'bg-zinc-900 text-white hover:bg-[var(--brand-blue)] hover:text-black' : 'bg-zinc-100 text-zinc-900 hover:bg-[var(--brand-blue)]'}`}>
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
                  <a href={link.href} className={`text-sm font-bold transition-colors duration-200 hover:text-[var(--brand-blue)] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
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
                  <a href={link.href} className={`text-sm font-bold transition-colors duration-200 hover:text-[var(--brand-blue)] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
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
                  Harthala Kanth Road Behind Kr Collection, near Domino's,<br />Uttar Pradesh, India
                </p>
              </div>
              <a href="mailto:info@mtboss.in" className={`block text-sm font-black hover:text-[var(--brand-blue)] transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                info@mtboss.in
              </a>
              <a href="tel:+919410225039" className={`block text-sm font-black hover:text-[var(--brand-blue)] transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                +91 94102 25039
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
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[var(--brand-blue)]">Privacy</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[var(--brand-blue)]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
