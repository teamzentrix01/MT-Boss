'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export default function QuickServiceSlugPage() {
  const dark = useDarkMode();
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/quick-services?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.success && data.data) {
          setService(data.data);
        } else {
          setError('Service not found');
        }
      } catch {
        setError('Failed to load service');
      } finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  if (loading) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${dark ? 'bg-black text-white' : 'bg-gray-50 text-zinc-900'}`}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[var(--brand-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold">Loading service...</p>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${dark ? 'bg-black text-white' : 'bg-gray-50 text-zinc-900'}`}>
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-black uppercase mb-2">Service Not Found</h1>
          <p className={`text-sm mb-6 ${dark ? 'text-zinc-400' : 'text-zinc-500'}`}>{error || 'The requested service does not exist.'}</p>
          <Link href="/quick" className="px-6 py-3 bg-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-widest">
            Browse All Services
          </Link>
        </div>
      </main>
    );
  }

  const seoTitle = service.seo_title || `${service.label} - Quick Service | MTBOSS`;
  const seoDesc = service.seo_description || service.description || `Book ${service.label} service from MTBOSS. Professional, reliable, and affordable.`;

  const card = dark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm';
  const muted = dark ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <>
      <head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
      </head>

      <main className={`min-h-screen transition-colors duration-500 ${dark ? 'bg-black text-white' : 'bg-gray-50 text-zinc-900'}`}>
        {/* Hero Section */}
        <section className="relative py-20 px-6" style={{ background: dark ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)' : 'linear-gradient(135deg, #fefce8 0%, #fef9c3 50%, #fefce8 100%)' }}>
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-6xl block mb-6">{service.icon || '🔧'}</span>
            <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] block mb-3">Quick Service</span>
            <h1 className={`text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4 ${dark ? 'text-white' : 'text-zinc-800'}`}>
              {service.label}
            </h1>
            <p className={`text-sm max-w-xl mx-auto leading-relaxed mb-6 ${muted}`}>
              {service.description || `Professional ${service.label} service delivered to your doorstep.`}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <p className="text-[var(--brand-blue)] text-2xl font-black">₹{service.base_price || service.admin_base_price || 199}</p>
                <p className={`text-[10px] uppercase tracking-widest font-bold ${muted}`}>Starting Price</p>
              </div>
              {service.duration && (
                <div className="text-center">
                  <p className={`text-2xl font-black ${dark ? 'text-white' : 'text-zinc-800'}`}>{service.duration}</p>
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${muted}`}>Duration</p>
                </div>
              )}
            </div>
            <Link
              href={`/quick?service=${service.id}`}
              className="inline-flex items-center gap-3 px-10 py-4 bg-[var(--brand-blue)] text-black font-black uppercase text-xs tracking-widest hover:bg-[var(--brand-blue-light)] transition-all"
            >
              Book Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* What We Cover */}
        {service.coverage_details && (
          <section className={`py-16 px-6 ${dark ? 'bg-zinc-900' : 'bg-white'}`}>
            <div className="max-w-4xl mx-auto">
              <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">What We Cover</span>
              <h2 className={`text-2xl font-black uppercase tracking-tight mb-6 ${dark ? 'text-white' : 'text-zinc-800'}`}>Service Coverage</h2>
              <div className={`border ${card} p-6 rounded-sm`}>
                {service.coverage_details.split('\n').map((line, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                    <svg className="w-4 h-4 text-[var(--brand-blue)] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <p className={`text-sm ${muted}`}>{line.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How to Use */}
        {service.how_to_use && (
          <section className={`py-16 px-6 ${dark ? 'bg-black' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto">
              <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Simple Process</span>
              <h2 className={`text-2xl font-black uppercase tracking-tight mb-6 ${dark ? 'text-white' : 'text-zinc-800'}`}>How to Use This Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.how_to_use.split('\n').filter(Boolean).map((step, i) => (
                  <div key={i} className={`border ${card} p-5 rounded-sm`}>
                    <div className="w-8 h-8 bg-[var(--brand-blue)] rounded-sm flex items-center justify-center mb-3">
                      <span className="text-black text-xs font-black">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <p className={`text-sm ${muted}`}>{step.trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Video Section */}
        {service.video_url && (
          <section className={`py-16 px-6 ${dark ? 'bg-zinc-900' : 'bg-white'}`}>
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] block mb-2">Watch</span>
              <h2 className={`text-2xl font-black uppercase tracking-tight mb-6 ${dark ? 'text-white' : 'text-zinc-800'}`}>Service Overview</h2>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={service.video_url.replace('watch?v=', 'embed/')}
                  className="absolute inset-0 w-full h-full rounded-sm"
                  allowFullScreen
                  title={`${service.label} overview video`}
                />
              </div>
            </div>
          </section>
        )}

        {/* Pricing + CTA */}
        <section className={`py-16 px-6 ${dark ? 'bg-black' : 'bg-zinc-800'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-[var(--brand-blue)] text-[10px] font-black uppercase tracking-[0.4em] block mb-3">Ready to Book?</span>
            <h2 className="text-3xl font-black uppercase text-white mb-4 tracking-tight">
              Get {service.label} Service Today
            </h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
              Professional service at your doorstep. Book now and our verified vendor will arrive at your preferred time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/quick?service=${service.id}`}
                className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[var(--brand-blue)] text-black font-black uppercase text-xs tracking-widest hover:bg-[var(--brand-blue-light)] transition-all"
              >
                Book This Service
              </Link>
              <Link
                href="/quick"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white text-white font-black uppercase text-xs tracking-widest hover:bg-white hover:text-zinc-800 transition-all"
              >
                All Quick Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
