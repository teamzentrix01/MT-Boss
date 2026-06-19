"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import QuickServiceIcon from './QuickServiceIcon';

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function slugFromService(service) {
  return service.slug || String(service.label || service.title || service.id)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function QuickServices() {
  const [headerRef, headerVisible] = useInView(0.1);
  const [gridRef, gridVisible] = useInView(0.05);
  const [isDark, setIsDark] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark-mode"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Fetch from API — same as /quick/page.jsx
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/quick-services");
        const data = await res.json();
        if (data.success) setServices(data.data);
      } catch (error) {
        console.error("Error fetching quick services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const themeYellow = "var(--brand-blue)";
  const homeDecorIndex = services.findIndex((service) =>
    String(service.label || '').toLowerCase().includes('home decor')
  );
  const visibleServices = services.slice(0, homeDecorIndex >= 0 ? homeDecorIndex + 1 : 21);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float-up {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .qs-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid ${isDark ? '#3f3f46' : '#f3f4f6'};
          background: ${isDark ? '#18181b' : '#ffffff'};
        }
        .qs-card:hover {
          background: ${themeYellow};
          transform: scale(1.07);
          z-index: 10;
          box-shadow: 0 8px 32px ${isDark ? 'color-mix(in srgb, var(--brand-blue) 20%, transparent)' : 'color-mix(in srgb, var(--brand-blue) 25%, transparent)'};
          border-color: ${themeYellow};
        }
        .qs-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
          background-size: 200% 100%;
          opacity: 0;
        }
        .qs-card:hover::before {
          opacity: 1;
          animation: shimmer 0.7s ease forwards;
        }
        .qs-icon {
          font-size: 1.5rem;
          display: block;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .qs-card:hover .qs-icon {
          transform: scale(1.25) rotate(-6deg);
        }
        .qs-label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: ${isDark ? '#ffffff' : '#1f2937'};
          transition: color 0.3s;
          text-align: center;
          line-height: 1.2;
        }
        .qs-card:hover .qs-label {
          color: #000000;
        }
        .qs-grid-item {
          animation: float-up 0.5s ease both;
        }
        /* Skeleton pulse */
        @keyframes qs-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .qs-skeleton {
          animation: qs-pulse 1.5s ease infinite;
          background: ${isDark ? '#27272a' : '#f3f4f6'};
        }
        .qs-calculator-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem 1.25rem;
          border: 1px solid ${isDark ? '#3f3f46' : '#f3f4f6'};
          background: ${isDark ? '#18181b' : '#fafafa'};
          border-radius: 8px;
        }
        .qs-calculator-title {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 900;
          color: ${isDark ? '#ffffff' : '#18181b'};
        }
        .qs-calculator-text {
          margin: 0.2rem 0 0;
          font-size: 0.78rem;
          color: ${isDark ? '#a1a1aa' : '#52525b'};
          line-height: 1.45;
        }
        .qs-calculator-btn {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.7rem 1rem;
          border-radius: 999px;
          background: var(--brand-blue);
          color: #000;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .qs-calculator-btn:hover {
          background: var(--brand-blue-dark);
          transform: translateY(-1px);
        }
        @media(max-width: 640px) {
          .qs-calculator-strip {
            align-items: flex-start;
            flex-direction: column;
          }
          .qs-calculator-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <section className={`transition-colors duration-500 py-12 px-4 sm:px-6 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="qs-calculator-strip">
            <div>
              <h3 className="qs-calculator-title">Construction Cost Calculator</h3>
              <p className="qs-calculator-text">Select products and get an instant quotation before booking home services.</p>
            </div>
            <Link href="/calculator" className="qs-calculator-btn">
              Calculate Now
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Header */}
          <div
            ref={headerRef}
            className="text-center mb-8"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <p className={`text-xs uppercase tracking-widest mb-1 font-black ${isDark ? 'text-[var(--brand-blue)]' : 'text-[var(--brand-blue-dark)]'}`}>
              At Your Doorstep
            </p>
            <h2 className={`text-2xl sm:text-3xl font-black tracking-wide mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Quick Home Services
            </h2>
            <div className={`w-8 h-0.5 mx-auto mb-3 rounded ${isDark ? 'bg-[var(--brand-blue)]' : 'bg-[var(--brand-blue-dark)]'}`} />
            <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything your home needs — one call away. Book trusted professionals instantly.
            </p>
          </div>

          {/* Services Grid — exact same layout as before */}
          <div
            ref={gridRef}
            className="grid grid-cols-2 min-[420px]:grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 shadow-sm"
            style={{ border: isDark ? "1px solid #3f3f46" : "1px solid #f3f4f6" }}
          >
            {loading
              ? /* Skeleton — 20 placeholder cells matching the grid */
                Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-1.5 py-4 px-2"
                    style={{ border: `1px solid ${isDark ? '#3f3f46' : '#f3f4f6'}` }}
                  >
                    <div className="qs-skeleton rounded" style={{ width: 28, height: 28 }} />
                    <div className="qs-skeleton rounded" style={{ width: 44, height: 10 }} />
                  </div>
                ))
              : visibleServices.map((service, i) => (
                  <Link
                    key={service.id}
                    href={`/quick/${slugFromService(service)}`}
                    className="qs-card qs-grid-item flex flex-col items-center justify-center gap-1.5 py-4 px-2"
                    style={{
                      animationDelay: gridVisible ? `${i * 0.04}s` : "none",
                      animationPlayState: gridVisible ? "running" : "paused",
                      textDecoration: 'none',
                    }}
                  >
                    <QuickServiceIcon value={service.icon} label={service.label}
                      className="qs-icon" imageClassName="w-8 h-8 object-contain" />
                    <span className="qs-label">{service.label}</span>
                  </Link>
                ))
            }
          </div>

          {/* View All Button */}
          <div
            className="text-center mt-8"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
            }}
          >
            <Link
              href="/quick"
              className="inline-flex items-center gap-2 px-8 py-3 text-xs font-black uppercase tracking-widest rounded transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 bg-[var(--brand-blue)] text-black hover:bg-[var(--brand-blue-dark)]"
            >
              View All Services
              <svg
                className="w-3.5 h-3.5"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
