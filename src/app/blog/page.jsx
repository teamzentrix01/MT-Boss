'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  'All',
  'Construction Guide',
  'Building Materials',
  'Real Estate',
  'Vastu & Architecture',
  'Home Services',
];

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark-mode'));
    };
    checkTheme();
    const obs = new MutationObserver(checkTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        const res = await fetch('/api/blogs');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBlogs(json.data);
        }
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat = selectedCategory === 'All' || b.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCat && matchSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const standardBlogs = filteredBlogs.length > 0 ? filteredBlogs.slice(1) : [];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* ── HERO HEADER ── */}
      <section className="relative overflow-hidden pt-28 pb-16 px-6 sm:px-10 lg:px-16 border-b border-zinc-200 dark:border-zinc-800/80 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-[var(--brand-blue)]/15 text-[var(--brand-blue)] border border-[var(--brand-blue)]/30 mb-4">
            <span>📰</span> Construction &amp; Real Estate Insights
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight max-w-4xl mx-auto">
            MTBOSS <span className="text-[var(--brand-blue)]">Knowledge Hub</span> &amp; Guides
          </h1>
          <p className="mt-4 text-sm sm:text-base max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Expert insights, construction cost estimations, raw material testing guides, legal property checklists, and modern architecture tips.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search topics: e.g. Cost per sqft, TMT steel, Vastu, Registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-3.5 pl-12 pr-4 rounded-xl text-xs sm:text-sm font-medium border outline-none shadow-lg transition-all ${
                isDark
                  ? 'bg-zinc-900/90 border-zinc-700 text-white placeholder-zinc-500 focus:border-[var(--brand-blue)]'
                  : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-[var(--brand-blue-deep)]'
              }`}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-400">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-zinc-200"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-[var(--brand-blue)] text-black shadow-md shadow-[var(--brand-blue)]/30 scale-105'
                      : isDark
                      ? 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                      : 'bg-white text-zinc-600 hover:text-black hover:bg-zinc-100 border border-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ARTICLES GRID ── */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[var(--brand-blue)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Loading Articles...
            </p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="text-4xl">📄</div>
            <h3 className="text-xl font-bold">No articles found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try searching with different keywords or switch back to the 'All' category.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-3 px-5 py-2.5 bg-[var(--brand-blue)] text-black rounded-lg text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* 🌟 FEATURED HERO ARTICLE */}
            {featuredBlog && !searchQuery && selectedCategory === 'All' && (
              <div className="group relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-xl transition-all hover:shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 h-64 sm:h-80 lg:h-[420px] relative overflow-hidden bg-zinc-800">
                    <img
                      src={featuredBlog.cover_image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200'}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-[var(--brand-blue)] text-black text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow">
                      ⭐ Featured Guide
                    </div>
                  </div>
                  
                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs font-bold text-[var(--brand-blue)] uppercase tracking-wider mb-3">
                        <span>{featuredBlog.category}</span>
                        <span>•</span>
                        <span className="text-zinc-400 font-medium">{featuredBlog.read_time}</span>
                      </div>
                      
                      <Link href={`/blog/${featuredBlog.slug}`}>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug hover:text-[var(--brand-blue)] transition-colors">
                          {featuredBlog.title}
                        </h2>
                      </Link>

                      <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                        {featuredBlog.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--brand-blue)]/20 text-[var(--brand-blue)] font-bold flex items-center justify-center text-xs">
                          ✍️
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{featuredBlog.author_name}</p>
                          <p className="text-[10px] text-zinc-400">{new Date(featuredBlog.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredBlog.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--brand-blue)] text-black rounded-xl text-xs font-black uppercase tracking-wider hover:brightness-110 transition-all"
                      >
                        <span>Read Article</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 📚 STANDARD ARTICLES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(searchQuery || selectedCategory !== 'All' ? filteredBlogs : standardBlogs).map((post) => (
                <article
                  key={post.id || post.slug}
                  className="group rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-lg hover:shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative bg-zinc-800">
                      <img
                        src={post.cover_image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=800'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                        {post.read_time || '5 min read'}
                      </span>
                    </div>

                    <div className="p-6">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-[var(--brand-blue)]/15 text-[var(--brand-blue)] mb-2.5">
                        {post.category}
                      </span>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-lg font-black tracking-tight leading-snug group-hover:text-[var(--brand-blue)] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-400">
                        {new Date(post.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {post.views_count || 0} views
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-bold text-[var(--brand-blue)] hover:underline flex items-center gap-1"
                    >
                      Read Guide →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

          </div>
        )}

        {/* 🚀 BOTTOM CTA: ESTIMATE / BUILD */}
        <section className="mt-20 rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-sky-950 via-zinc-900 to-black border border-[var(--brand-blue)]/40 shadow-2xl relative overflow-hidden text-white">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-black tracking-widest text-[var(--brand-blue)] uppercase">
              Start Your Project Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              Ready to Build or Buy Property with Confidence?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Use our live construction cost estimator or consult with certified project engineers across 50+ cities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/calculator"
                className="px-6 py-3 bg-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg transition-all"
              >
                📊 Try Cost Calculator
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border-2 border-white text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-white hover:text-black transition-all"
              >
                💬 Speak to Engineer
              </Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
