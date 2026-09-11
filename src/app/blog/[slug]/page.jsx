import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DEFAULT_BLOGS } from '@/lib/blog-defaults.mjs';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  let blog = null;
  try {
    const res = await pool.query('SELECT * FROM blogs WHERE slug = $1 LIMIT 1', [slug]);
    if (res.rows.length > 0) blog = res.rows[0];
  } catch (e) {
    blog = DEFAULT_BLOGS.find((b) => b.slug === slug);
  }

  if (!blog) {
    return {
      title: 'Blog Article | MTBOSS Construction',
      description: 'Read the latest construction and real estate insights on MTBOSS.',
    };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mtboss.in';
  const url = `${appUrl}/blog/${blog.slug}`;
  const title = blog.meta_title || blog.title;
  const description = blog.meta_description || blog.excerpt;
  const image = blog.cover_image || `${appUrl}/images/banners/construction.jpg`;

  return {
    title: `${title} | MTBOSS`,
    description,
    keywords: blog.meta_keywords ? blog.meta_keywords.split(',').map((k) => k.trim()) : undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'MTBOSS Construction Private Limited',
      images: [{ url: image, width: 1200, height: 630, alt: blog.title }],
      type: 'article',
      publishedTime: blog.created_at,
      authors: [blog.author_name || 'MTBOSS Editorial'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

async function getBlog(slug) {
  try {
    const res = await pool.query('SELECT * FROM blogs WHERE slug = $1 LIMIT 1', [slug]);
    if (res.rows.length > 0) {
      // Async increment
      pool.query('UPDATE blogs SET views_count = views_count + 1 WHERE slug = $1', [slug]).catch(() => {});
      return res.rows[0];
    }
  } catch (e) {
    console.error('Error fetching blog from DB:', e);
  }
  return DEFAULT_BLOGS.find((b) => b.slug === slug) || null;
}

async function getRelatedBlogs(currentSlug, category) {
  try {
    const res = await pool.query(
      'SELECT id, slug, title, cover_image, category, read_time FROM blogs WHERE slug != $1 AND is_published = true ORDER BY (category = $2) DESC, created_at DESC LIMIT 3',
      [currentSlug, category]
    );
    return res.rows;
  } catch (e) {
    return DEFAULT_BLOGS.filter((b) => b.slug !== currentSlug).slice(0, 3);
  }
}

function renderSimpleMarkdown(content) {
  if (!content) return '';

  const lines = content.split('\n');
  const rendered = [];
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const isHeader = (idx) => idx === 0;
      rendered.push(
        `<div class="overflow-x-auto my-6 rounded-xl border border-zinc-200 dark:border-zinc-800"><table class="w-full text-xs sm:text-sm text-left border-collapse">${tableRows
          .map((row, idx) => {
            const isSep = row.every((c) => /^[:-]+$/.test(c.trim()));
            if (isSep) return '';
            const tag = isHeader(idx) ? 'th' : 'td';
            const cellClass = isHeader(idx)
              ? 'px-4 py-3 bg-[var(--brand-blue)]/15 font-black text-[var(--brand-blue-deep)] dark:text-[var(--brand-blue-light)] uppercase border-b border-zinc-200 dark:border-zinc-800'
              : 'px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60';
            return `<tr>${row.map((col) => `<${tag} class="${cellClass}">${col.trim()}</${tag}>`).join('')}</tr>`;
          })
          .filter(Boolean)
          .join('')}</table></div>`
      );
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      const cells = line.split('|').slice(1, -1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (line.startsWith('### ')) {
      rendered.push(`<h3 class="text-lg sm:text-xl font-black uppercase tracking-tight mt-8 mb-3 text-zinc-900 dark:text-white">${line.replace('### ', '')}</h3>`);
    } else if (line.startsWith('## ')) {
      rendered.push(`<h2 class="text-xl sm:text-2xl font-black uppercase tracking-tight mt-10 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800 text-[var(--brand-blue)]">${line.replace('## ', '')}</h2>`);
    } else if (line.startsWith('# ')) {
      rendered.push(`<h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-10 mb-4 text-zinc-900 dark:text-white">${line.replace('# ', '')}</h1>`);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const item = line.replace(/^[-*]\s+/, '');
      rendered.push(`<li class="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 ml-5 my-1 list-disc">${item}</li>`);
    } else if (/^\d+\.\s/.test(line)) {
      const item = line.replace(/^\d+\.\s+/, '');
      rendered.push(`<li class="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 ml-5 my-1 list-decimal">${item}</li>`);
    } else if (line.startsWith('> ')) {
      rendered.push(`<blockquote class="p-4 my-4 border-l-4 border-[var(--brand-blue)] bg-sky-50 dark:bg-zinc-900 text-sm italic rounded-r-xl">${line.replace('> ', '')}</blockquote>`);
    } else if (line.trim() === '---') {
      rendered.push(`<hr class="my-8 border-zinc-200 dark:border-zinc-800" />`);
    } else if (line.trim()) {
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[var(--brand-blue)] hover:underline font-bold">$1</a>');
      rendered.push(`<p class="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 my-4">${formatted}</p>`);
    }
  }

  if (inTable) flushTable();
  return rendered.join('');
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const related = await getRelatedBlogs(slug, blog.category);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mtboss.in';
  const postUrl = `${appUrl}/blog/${blog.slug}`;

  // JSON-LD for Google Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.meta_description || blog.excerpt,
    image: blog.cover_image,
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    author: {
      '@type': 'Person',
      name: blog.author_name || 'MTBOSS Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MTBOSS Construction Private Limited',
      logo: {
        '@type': 'ImageObject',
        url: `${appUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300">
      
      {/* JSON-LD Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── BREADCRUMBS & ARTICLE HERO ── */}
      <header className="pt-28 pb-12 px-6 sm:px-10 lg:px-16 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-sky-500/10 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-[var(--brand-blue)]">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--brand-blue)]">Blog Hub</Link>
            <span>/</span>
            <span className="text-[var(--brand-blue)] truncate max-w-xs">{blog.category}</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--brand-blue)]/15 text-[var(--brand-blue)] border border-[var(--brand-blue)]/30 mb-4">
            <span>🏷️</span> {blog.category}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight">
            {blog.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {blog.excerpt}
          </p>

          {/* Author & Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--brand-blue)]/20 text-[var(--brand-blue)] font-black flex items-center justify-center text-sm shadow">
                👷
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-white text-sm">{blog.author_name}</p>
                <p className="text-[11px]">
                  Published: {new Date(blog.created_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })} • {blog.read_time}
                </p>
              </div>
            </div>

            {/* Social Share Pills */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider">Share:</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${blog.title} - ${postUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-green-500 text-white font-bold text-xs hover:brightness-110"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:brightness-110"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ── COVER IMAGE ── */}
      {blog.cover_image && (
        <div className="max-w-5xl mx-auto px-6 sm:px-10 -mt-6 sm:-mt-10">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 h-64 sm:h-96 lg:h-[450px] relative bg-zinc-900">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ── ARTICLE CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
        <article
          className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 font-sans"
          dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(blog.content) }}
        />

        {/* Tags */}
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              Related Topics &amp; Keywords:
            </span>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-12 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-lg flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--brand-blue)] text-black font-black flex items-center justify-center text-xl flex-shrink-0">
            MT
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider">
              Written by {blog.author_name}
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Published by MTBOSS Construction editorial team. We specialize in precision engineering, turnkey architectural design, raw material supply, and verified real estate across India.
            </p>
          </div>
        </div>

        {/* Project CTA Callout */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-sky-950 via-zinc-900 to-black border border-[var(--brand-blue)]/40 text-white shadow-xl text-center space-y-3">
          <h3 className="text-2xl font-black uppercase tracking-tight">
            Planning a Construction Project?
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
            Calculate your exact residential, commercial, or villa budget in 30 seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/calculator"
              className="inline-block px-6 py-3 bg-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg"
            >
              📊 Instant Cost Calculator
            </Link>
          </div>
        </div>
      </div>

      {/* ── RELATED ARTICLES ── */}
      {related.length > 0 && (
        <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 py-16 px-6 sm:px-10 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--brand-blue)]">
                  Continue Reading
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1">
                  Related Guides &amp; Insights
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-bold text-[var(--brand-blue)] hover:underline uppercase tracking-wider"
              >
                View All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-40 overflow-hidden relative bg-zinc-800">
                    <img
                      src={post.cover_image || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=800'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--brand-blue)]">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-sm leading-snug group-hover:text-[var(--brand-blue)] transition-colors mt-1.5 line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
