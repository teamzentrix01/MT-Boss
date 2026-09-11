'use client';

import { useState, useEffect } from 'react';

const CATEGORIES = [
  'Construction Guide',
  'Building Materials',
  'Real Estate',
  'Vastu & Architecture',
  'Home Services',
  'Company News',
];

export default function BlogsManager({ isDarkMode }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: 'Construction Guide',
    tags: '',
    author_name: 'MTBOSS Editorial',
    read_time: '5 min read',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    is_published: true,
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blogs?all=1');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBlogs(json.data);
      }
    } catch (err) {
      console.error('Failed to load blogs for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingBlog(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=1200',
      category: 'Construction Guide',
      tags: '',
      author_name: 'MTBOSS Editorial',
      read_time: '5 min read',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      is_published: true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      cover_image: blog.cover_image || '',
      category: blog.category || 'Construction Guide',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      author_name: blog.author_name || 'MTBOSS Editorial',
      read_time: blog.read_time || '5 min read',
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      meta_keywords: blog.meta_keywords || '',
      is_published: blog.is_published ?? true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!form.content.trim()) {
      setError('Article content is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };

      const url = editingBlog ? `/api/blogs/${editingBlog.slug}` : '/api/blogs';
      const method = editingBlog ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        fetchBlogs();
      } else {
        setError(data.error || 'Failed to save blog post.');
      }
    } catch (err) {
      setError('Network error saving article.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchBlogs();
      } else {
        alert(data.error || 'Failed to delete blog.');
      }
    } catch (err) {
      alert('Network error deleting blog.');
    }
  };

  const togglePublish = async (blog) => {
    try {
      const res = await fetch(`/api/blogs/${blog.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !blog.is_published }),
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase())
  );

  const cardBg = isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const textPrimary = isDarkMode ? 'text-white' : 'text-zinc-900';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';
  const inputBg = isDarkMode ? 'bg-zinc-950 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-300 text-zinc-900';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-black uppercase tracking-tight ${textPrimary}`}>
            SEO Blog &amp; Articles Manager
          </h2>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Create, edit, and optimize SEO articles to drive organic search traffic for construction, materials, and properties.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`px-3.5 py-2 rounded-xl border text-xs outline-none ${inputBg}`}
          />
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <span>+</span>
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Blogs List */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-zinc-400">
          Loading Articles...
        </div>
      ) : filtered.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${cardBg} space-y-3`}>
          <div className="text-3xl">📰</div>
          <p className={`text-sm font-bold ${textPrimary}`}>No blog posts found</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[var(--brand-blue)] text-black text-xs font-bold rounded-lg"
          >
            Write Your First Article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((blog) => (
            <div
              key={blog.id || blog.slug}
              className={`p-5 rounded-2xl border ${cardBg} shadow-sm hover:shadow transition-all flex flex-col md:flex-row md:items-center justify-between gap-4`}
            >
              <div className="flex items-start gap-4">
                {blog.cover_image && (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="w-20 h-20 rounded-xl object-cover border border-zinc-700/50 flex-shrink-0"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--brand-blue)]/15 text-[var(--brand-blue)]">
                      {blog.category}
                    </span>
                    <button
                      onClick={() => togglePublish(blog)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        blog.is_published
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-700 text-zinc-300'
                      }`}
                    >
                      {blog.is_published ? '● Published' : '○ Draft'}
                    </button>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      👁️ {blog.views_count || 0} views
                    </span>
                  </div>

                  <h3 className={`text-base font-bold leading-snug ${textPrimary}`}>
                    {blog.title}
                  </h3>

                  <p className={`text-xs mt-1 line-clamp-1 ${textMuted}`}>
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-2">
                    <span>Slug: <code className="text-[var(--brand-blue)]">/blog/{blog.slug}</code></span>
                    <span>•</span>
                    <span>{new Date(blog.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                <a
                  href={`/blog/${blog.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border text-xs font-bold hover:border-[var(--brand-blue)] transition-colors"
                >
                  👁️ View
                </a>
                <button
                  onClick={() => openEditModal(blog)}
                  className="px-3 py-1.5 bg-blue-600/15 text-blue-400 border border-blue-600/30 rounded-lg text-xs font-bold hover:bg-blue-600/25"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(blog.slug, blog.title)}
                  className="px-3 py-1.5 bg-red-600/15 text-red-400 border border-red-600/30 rounded-lg text-xs font-bold hover:bg-red-600/25"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-3xl rounded-2xl border p-6 sm:p-8 shadow-2xl ${cardBg} my-8 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-700/50 mb-6">
              <h3 className={`text-xl font-black uppercase tracking-tight ${textPrimary}`}>
                {editingBlog ? 'Edit Blog Article' : 'Create New SEO Article'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-lg font-bold p-1 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold uppercase tracking-wider mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. House Construction Cost in India (2026)"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={`w-full p-3 rounded-xl border outline-none font-medium ${inputBg}`}
                  required
                />
              </div>

              {/* Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    URL Slug (auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    placeholder="house-construction-cost-estimation"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className={`w-full p-3 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={`w-full p-3 rounded-xl border outline-none ${inputBg}`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cover Image & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={form.cover_image}
                    onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                    className={`w-full p-3 rounded-xl border outline-none ${inputBg}`}
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider mb-1">
                    Author &amp; Read Time
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Author name"
                      value={form.author_name}
                      onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                      className={`w-full p-3 rounded-xl border outline-none ${inputBg}`}
                    />
                    <input
                      type="text"
                      placeholder="5 min read"
                      value={form.read_time}
                      onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                      className={`w-full p-3 rounded-xl border outline-none ${inputBg}`}
                    />
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-bold uppercase tracking-wider mb-1">
                  Excerpt (Short Summary for Google / Cards)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary appearing in search previews..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className={`w-full p-3 rounded-xl border outline-none resize-none ${inputBg}`}
                />
              </div>

              {/* Content (Markdown) */}
              <div>
                <label className="block font-bold uppercase tracking-wider mb-1">
                  Article Body (Supports Markdown: ## Headings, lists, tables) *
                </label>
                <textarea
                  rows={10}
                  placeholder="## Heading 2&#10;&#10;Write comprehensive article paragraphs here..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className={`w-full p-3 rounded-xl border outline-none font-mono text-xs ${inputBg}`}
                  required
                />
              </div>

              {/* SEO Meta Tags (Collapsible / Group) */}
              <div className="p-4 rounded-xl border border-zinc-700/60 bg-zinc-800/30 space-y-3">
                <span className="font-bold text-[var(--brand-blue)] uppercase tracking-wider block">
                  🔍 SEO Metadata &amp; Google Tags
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Meta Title (50-60 chars)</label>
                    <input
                      type="text"
                      placeholder="Custom Title Tag for Google"
                      value={form.meta_title}
                      onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border outline-none ${inputBg}`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Keywords (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="house construction, bareilly materials, cost estimation"
                      value={form.meta_keywords}
                      onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border outline-none ${inputBg}`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">Meta Description (140-160 chars)</label>
                  <input
                    type="text"
                    placeholder="Custom search snippet description for Google..."
                    value={form.meta_description}
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border outline-none ${inputBg}`}
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="w-4 h-4 rounded text-[var(--brand-blue)]"
                  />
                  <span>Publish Immediately</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-700/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border text-xs font-bold hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-wider rounded-xl hover:brightness-110 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingBlog ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
