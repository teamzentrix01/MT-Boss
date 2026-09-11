'use client';

import { useState, useEffect, useCallback } from 'react';

export default function ReviewsManager({ isDarkMode }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/reviews?mode=manager', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setReviews(data.data);
      } else {
        setError(data.error || 'Failed to load reviews');
      }
    } catch (err) {
      setError('Network error while loading reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`Review marked as ${status}`);
        setReviews((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      } else {
        setError(data.error || 'Failed to update review status');
      }
    } catch (err) {
      setError('Network error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Review deleted successfully');
        setReviews((prev) => prev.filter((item) => item.id !== id));
      } else {
        setError(data.error || 'Failed to delete review');
      }
    } catch (err) {
      setError('Network error while deleting review');
    }
  };

  const filteredReviews = reviews.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.service && item.service.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q))
    );
  });

  const totalCount = reviews.length;
  const avgRating = totalCount
    ? (reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalCount).toFixed(1)
    : '5.0';
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;

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
            Customer Reviews & Feedback
          </h2>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Monitor client satisfaction, verify feedback, and manage public testimonials.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-zinc-700 hover:bg-zinc-800 text-zinc-300"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Reviews', value: totalCount, color: 'text-[var(--brand-blue)]' },
          { label: 'Average Rating', value: `⭐ ${avgRating}`, color: 'text-amber-400' },
          { label: 'Pending Approval', value: pendingCount, color: 'text-amber-400' },
          { label: 'Approved & Public', value: approvedCount, color: 'text-emerald-400' },
        ].map((m) => (
          <div key={m.label} className={`p-4 rounded-xl border ${cardBg}`}>
            <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>{m.label}</p>
            <p className={`text-2xl font-black mt-1 ${m.color}`}>{m.value}</p>
          </div>
        ))}
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
          <span className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Status:</span>
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'approved', label: `Approved (${approvedCount})` },
            { id: 'rejected', label: `Rejected` },
          ].map((statusTab) => (
            <button
              key={statusTab.id}
              onClick={() => setFilterStatus(statusTab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                filterStatus === statusTab.id
                  ? 'bg-[var(--brand-blue)] text-black'
                  : `${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'} hover:opacity-80`
              }`}
            >
              {statusTab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${inputBg}`}
          />
        </div>
      </div>

      {/* Review List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--brand-blue)] border-t-transparent"></div>
          <p className={`text-xs font-bold uppercase tracking-widest mt-4 ${textMuted}`}>Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className={`p-12 text-center rounded-xl border ${cardBg}`}>
          <p className={`text-sm font-bold ${textPrimary}`}>No reviews found</p>
          <p className={`text-xs mt-1 ${textMuted}`}>
            {searchQuery ? 'Try different keywords.' : 'No customer reviews recorded yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((review) => {
            const stars = '★'.repeat(review.rating || 5) + '☆'.repeat(5 - (review.rating || 5));
            return (
              <div key={review.id} className={`p-5 rounded-xl border flex flex-col justify-between gap-4 ${cardBg}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-black ${textPrimary}`}>{review.name}</h3>
                        <span className="text-amber-400 text-sm font-bold tracking-wider">{stars}</span>
                      </div>
                      <p className={`text-xs ${textMuted}`}>{review.email}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                        review.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : review.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--brand-blue)]/20 text-[var(--brand-blue)]">
                      {review.service}
                    </span>
                    <span className={`text-[10px] ${textMuted}`}>
                      {new Date(review.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed whitespace-pre-wrap ${textPrimary}`}>
                    &ldquo;{review.message}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    {review.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(review.id, 'approved')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white hover:bg-emerald-500 transition-all"
                      >
                        Approve
                      </button>
                    )}
                    {review.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(review.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-600/40 hover:bg-red-600/40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
