'use client';

import { useState, useEffect, useCallback } from 'react';
import { faqPages, faqPageLabels } from '@/lib/faq-defaults.mjs';

export default function FaqsManager({ isDarkMode }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingFaq, setEditingFaq] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    page: 'contact',
    q: '',
    a: '',
    sort_order: 0,
    is_active: true,
  });

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch(`/api/faqs?mode=manager${selectedPage !== 'all' ? `&page=${selectedPage}` : ''}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setFaqs(data.data);
      } else {
        setError(data.error || 'Failed to load FAQs');
      }
    } catch (err) {
      setError('Network error while loading FAQs');
    } finally {
      setLoading(false);
    }
  }, [selectedPage]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleOpenAdd = () => {
    setForm({
      page: selectedPage !== 'all' ? selectedPage : 'contact',
      q: '',
      a: '',
      sort_order: faqs.length,
      is_active: true,
    });
    setEditingFaq('new');
    setError('');
  };

  const handleOpenEdit = (faq) => {
    setForm({
      id: faq.id,
      page: faq.page,
      q: faq.q,
      a: faq.a,
      sort_order: faq.sort_order ?? 0,
      is_active: faq.is_active ?? true,
    });
    setEditingFaq(faq.id);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.q.trim() || !form.a.trim()) {
      setError('Question and Answer are required');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const isUpdating = editingFaq !== 'new';
      const res = await fetch('/api/faqs', {
        method: isUpdating ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(isUpdating ? { ...form, id: editingFaq } : form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`FAQ ${isUpdating ? 'updated' : 'created'} successfully!`);
        setEditingFaq(null);
        fetchFaqs();
      } else {
        setError(data.error || 'Failed to save FAQ');
      }
    } catch (err) {
      setError('Network error saving FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (faq) => {
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/faqs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: faq.id,
          page: faq.page,
          q: faq.q,
          a: faq.a,
          sort_order: faq.sort_order,
          is_active: !faq.is_active,
        }),
      });
      if (res.ok) {
        setFaqs((prev) =>
          prev.map((item) => (item.id === faq.id ? { ...item, is_active: !item.is_active } : item))
        );
      }
    } catch (err) {
      console.error('Error toggling FAQ status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/faqs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('FAQ deleted successfully');
        setFaqs((prev) => prev.filter((item) => item.id !== id));
      } else {
        setError(data.error || 'Failed to delete FAQ');
      }
    } catch (err) {
      setError('Network error while deleting FAQ');
    }
  };

  const filteredFaqs = faqs.filter((faq) => {
    if (selectedPage !== 'all' && faq.page !== selectedPage) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (faq.q && faq.q.toLowerCase().includes(q)) ||
      (faq.a && faq.a.toLowerCase().includes(q)) ||
      (faqPageLabels[faq.page] && faqPageLabels[faq.page].toLowerCase().includes(q))
    );
  });

  const cardBg = isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const textPrimary = isDarkMode ? 'text-white' : 'text-zinc-900';
  const textMuted = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';
  const inputBg = isDarkMode
    ? 'bg-black border-zinc-700 text-white placeholder-zinc-500'
    : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-black uppercase tracking-tight ${textPrimary}`}>
            Frequently Asked Questions (FAQ) Manager
          </h2>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Manage questions, answers, and visibility for all public pages dynamically.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[var(--brand-blue)] text-black font-black uppercase tracking-wider text-xs rounded-lg hover:brightness-110 shadow-md transition-all flex items-center gap-2"
        >
          <span>+</span> Add New FAQ
        </button>
      </div>

      {/* Alert Notices */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-xs font-bold">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-xs font-bold">
          ✓ {success}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-xl border ${cardBg} flex flex-wrap gap-4 items-center justify-between`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Page:</span>
          <button
            onClick={() => setSelectedPage('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
              selectedPage === 'all'
                ? 'bg-[var(--brand-blue)] text-black'
                : `${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'} hover:opacity-80`
            }`}
          >
            All ({faqs.length})
          </button>
          {faqPages.map((pageKey) => {
            const count = faqs.filter((f) => f.page === pageKey).length;
            return (
              <button
                key={pageKey}
                onClick={() => setSelectedPage(pageKey)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedPage === pageKey
                    ? 'bg-[var(--brand-blue)] text-black'
                    : `${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'} hover:opacity-80`
                }`}
              >
                {faqPageLabels[pageKey] || pageKey} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${inputBg}`}
          />
        </div>
      </div>

      {/* FAQ List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--brand-blue)] border-t-transparent"></div>
          <p className={`text-xs font-bold uppercase tracking-widest mt-4 ${textMuted}`}>Loading FAQs...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className={`p-12 text-center rounded-xl border ${cardBg}`}>
          <p className={`text-sm font-bold ${textPrimary}`}>No FAQs found</p>
          <p className={`text-xs mt-1 ${textMuted}`}>
            {searchQuery ? 'Try adjusting your search keywords.' : 'Add your first FAQ for this page.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`p-5 rounded-xl border transition-all ${cardBg} ${
                !faq.is_active ? 'opacity-60 border-dashed' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[var(--brand-blue)]/20 text-[var(--brand-blue)] border border-[var(--brand-blue)]/30">
                      {faqPageLabels[faq.page] || faq.page}
                    </span>
                    <span className={`text-[10px] font-bold ${textMuted}`}>Order: {faq.sort_order}</span>
                    {!faq.is_active && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h3 className={`text-sm font-black tracking-tight ${textPrimary}`}>Q: {faq.q}</h3>
                  <p className={`text-xs leading-relaxed whitespace-pre-wrap ${textMuted}`}>A: {faq.a}</p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                  <button
                    onClick={() => handleToggleActive(faq)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                      faq.is_active
                        ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                        : 'border-emerald-600 text-emerald-400 hover:bg-emerald-600/10'
                    }`}
                  >
                    {faq.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(faq)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[var(--brand-blue)] text-black hover:brightness-110"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-600/40 hover:bg-red-600/40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className={`w-full max-w-2xl rounded-2xl border p-6 shadow-2xl ${cardBg} max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-zinc-800">
              <h3 className={`text-lg font-black uppercase tracking-tight ${textPrimary}`}>
                {editingFaq === 'new' ? 'Add New FAQ' : 'Edit FAQ'}
              </h3>
              <button
                onClick={() => setEditingFaq(null)}
                className={`text-xl font-bold p-1 hover:text-red-400 ${textMuted}`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${textMuted}`}>
                    Target Page / Section *
                  </label>
                  <select
                    value={form.page}
                    onChange={(e) => setForm({ ...form, page: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs outline-none ${inputBg}`}
                    required
                  >
                    {faqPages.map((pageKey) => (
                      <option key={pageKey} value={pageKey}>
                        {faqPageLabels[pageKey] || pageKey}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${textMuted}`}>
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs outline-none ${inputBg}`}
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${textMuted}`}>
                  Question *
                </label>
                <input
                  type="text"
                  placeholder="e.g. How do I get an estimate for my construction project?"
                  value={form.q}
                  onChange={(e) => setForm({ ...form, q: e.target.value })}
                  maxLength={300}
                  className={`w-full px-3 py-2.5 rounded-lg border text-xs outline-none ${inputBg}`}
                  required
                />
                <span className={`text-[10px] mt-1 block ${textMuted}`}>
                  {form.q.length}/300 characters
                </span>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${textMuted}`}>
                  Answer *
                </label>
                <textarea
                  placeholder="Detailed answer for users..."
                  value={form.a}
                  onChange={(e) => setForm({ ...form, a: e.target.value })}
                  maxLength={4000}
                  rows={5}
                  className={`w-full px-3 py-2.5 rounded-lg border text-xs outline-none resize-y ${inputBg}`}
                  required
                />
                <span className={`text-[10px] mt-1 block ${textMuted}`}>
                  {form.a.length}/4000 characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="faq_is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded border-zinc-700 text-[var(--brand-blue)] focus:ring-[var(--brand-blue)] w-4 h-4"
                />
                <label htmlFor="faq_is_active" className={`text-xs font-bold ${textPrimary}`}>
                  Visible / Active on public website
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-zinc-700 hover:bg-zinc-800 ${textMuted}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider bg-[var(--brand-blue)] text-black hover:brightness-110 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingFaq === 'new' ? 'Create FAQ' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
