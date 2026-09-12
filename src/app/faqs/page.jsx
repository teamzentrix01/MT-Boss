'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { faqPages, faqPageLabels, faqDefaults } from '@/lib/faq-defaults.mjs';

export default function FaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndexes, setOpenIndexes] = useState([0]); // First FAQ open by default
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark-mode'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Fetch all active FAQs from API with fallback to defaults
  useEffect(() => {
    let isMounted = true;
    const loadFaqs = async () => {
      try {
        const res = await fetch('/api/faqs', { cache: 'no-store' });
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setFaqs(data.data);
        } else if (isMounted) {
          // Flatten default faqs as fallback
          const flattened = Object.entries(faqDefaults).flatMap(([page, items]) =>
            items.map((item, idx) => ({
              id: `${page}-${idx}`,
              page,
              q: item.q,
              a: item.a,
              sort_order: idx,
              is_active: true,
            }))
          );
          setFaqs(flattened);
        }
      } catch (err) {
        if (isMounted) {
          const flattened = Object.entries(faqDefaults).flatMap(([page, items]) =>
            items.map((item, idx) => ({
              id: `${page}-${idx}`,
              page,
              q: item.q,
              a: item.a,
              sort_order: idx,
              is_active: true,
            }))
          );
          setFaqs(flattened);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter FAQs by Category and Search query
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.page === activeCategory;
      const qText = String(faq.q || '').toLowerCase();
      const aText = String(faq.a || '').toLowerCase();
      const s = searchQuery.toLowerCase().trim();
      const matchesSearch = !s || qText.includes(s) || aText.includes(s);
      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategory, searchQuery]);

  const toggleFaq = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleOpenAll = () => {
    setOpenIndexes(filteredFaqs.map((_, i) => i));
  };

  const handleCloseAll = () => {
    setOpenIndexes([]);
  };

  const triggerConsultation = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-consultation-modal'));
    }
  };

  // Google FAQ Schema JSON-LD
  const faqSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: filteredFaqs.slice(0, 30).map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    };
  }, [filteredFaqs]);

  const bgTheme = isDark ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900';
  const cardTheme = isDark
    ? 'bg-zinc-900/80 border-zinc-800 hover:border-sky-500/40 text-white'
    : 'bg-white border-zinc-200 hover:border-sky-400/60 text-zinc-900 shadow-sm';
  const headerBg = isDark
    ? 'bg-gradient-to-b from-zinc-900 via-black to-black'
    : 'bg-gradient-to-b from-sky-50 via-white to-zinc-50';

  return (
    <main className={`min-h-screen transition-colors duration-500 ${bgTheme}`}>
      
      {/* ── JSON-LD SCHEMA FOR GOOGLE RICH SNIPPETS ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── HERO HEADER SECTION ── */}
      <section className={`pt-32 pb-16 px-6 sm:px-10 lg:px-16 border-b border-white/10 relative overflow-hidden ${headerBg}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,180,216,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-400 text-xs font-black uppercase tracking-widest">
            <span>❓</span> Help &amp; Knowledge Center
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Find immediate answers regarding residential &amp; commercial construction costs, building materials, verified plots, franchise opportunities, and customer support.
          </p>

          {/* ── LIVE SEARCH BAR ── */}
          <div className="pt-6 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-400 text-base">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., cost per sqft, cement delivery, Bareilly office)..."
                className={`w-full pl-11 pr-10 py-3.5 rounded-2xl border text-sm outline-none transition-all shadow-lg ${
                  isDark
                    ? 'bg-zinc-900/90 border-zinc-700 text-white placeholder-zinc-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20'
                    : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 text-zinc-400 hover:text-white text-xs font-bold"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 space-y-8">
        
        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-sky-500 text-black shadow-md scale-105'
                : isDark
                ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 hover:text-black border border-zinc-200'
            }`}
          >
            All Questions ({faqs.length})
          </button>

          {faqPages.map((pageKey) => {
            const count = faqs.filter((f) => f.page === pageKey).length;
            const label = faqPageLabels[pageKey] || pageKey;
            const isActive = activeCategory === pageKey;

            return (
              <button
                key={pageKey}
                onClick={() => setActiveCategory(pageKey)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-sky-500 text-black shadow-md scale-105'
                    : isDark
                    ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 hover:text-black border border-zinc-200'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Results Counter & Controls */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-2">
          <div>
            Showing <strong className="text-sky-400">{filteredFaqs.length}</strong> questions
            {searchQuery && <span> matching &ldquo;{searchQuery}&rdquo;</span>}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAll}
              className="hover:text-sky-400 font-semibold transition-colors"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              onClick={handleCloseAll}
              className="hover:text-sky-400 font-semibold transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 mx-auto border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">
              Loading verified FAQs...
            </p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="py-20 text-center space-y-4 rounded-3xl border border-dashed border-zinc-700 p-8">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-black text-white">No Matching Questions Found</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              We couldn&apos;t find any FAQs matching your search query. You can ask our AI Project Advisor directly or contact our engineering helpline.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all text-white"
              >
                Clear Search
              </button>
              <a
                href="https://wa.me/919458410866"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
              >
                💬 Ask on WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndexes.includes(idx);
              const categoryLabel = faqPageLabels[faq.page] || faq.page;

              return (
                <div
                  key={faq.id || idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${cardTheme} ${
                    isOpen ? 'ring-1 ring-sky-500/40' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1.5 flex-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {categoryLabel}
                      </span>
                      <h3 className="text-sm sm:text-base font-black tracking-tight leading-snug">
                        {faq.q}
                      </h3>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all duration-300 ${
                        isOpen
                          ? 'bg-sky-500 text-black rotate-180'
                          : isDark
                          ? 'bg-zinc-800 text-zinc-400'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      ▼
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 animate-fadeIn">
                      <div className="pt-3 border-t border-white/10 text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2">
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── STILL HAVE QUESTIONS CTA BOX ── */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-900 via-sky-950/60 to-zinc-900 border border-sky-500/30 text-center space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.15),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Still Have Questions About Your Project?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Our senior civil engineers and project consultants are available 7 days a week for site visits, cost estimations, and architectural guidance.
            </p>
          </div>

          <div className="relative z-10 pt-2 flex flex-wrap gap-3 justify-center">
            <button
              onClick={triggerConsultation}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-[var(--brand-blue)] text-black font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              📅 Book Free Consultation
            </button>
            <a
              href="https://wa.me/919458410866"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-1.5"
            >
              <span>💬 WhatsApp +91 94584 10866</span>
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20"
            >
              Contact Office
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
