'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const statuses = [
  { id: 'all', label: 'All Inquiries' },
  { id: 'new', label: 'New', color: 'bg-blue-500/15 text-blue-500 border-blue-500/30' },
  { id: 'contacted', label: 'Contacted', color: 'bg-amber-500/15 text-amber-500 border-amber-500/30' },
  { id: 'follow-up', label: 'Follow-up', color: 'bg-purple-500/15 text-purple-500 border-purple-500/30' },
  { id: 'converted', label: 'Converted', color: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500/15 text-red-500 border-red-500/30' },
];

export default function PropertyEnquiriesManager({ isDarkMode }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // all, buy, rent
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const token = () => localStorage.getItem('admin-token') || localStorage.getItem('token');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/property-enquiries', { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Unable to load enquiries');
      setItems(data.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    const previous = items;
    setItems(current => current.map(item => item.id === id ? { ...item, status } : item));
    try {
      const res = await fetch('/api/property-enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Update failed');
    } catch (e) {
      setItems(previous);
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = items.length;
    const newCount = items.filter(i => i.status === 'new').length;
    const contactedCount = items.filter(i => i.status === 'contacted').length;
    const convertedCount = items.filter(i => i.status === 'converted').length;
    const buyCount = items.filter(i => (i.listing_type || 'buy').toLowerCase() === 'buy').length;
    const rentCount = items.filter(i => (i.listing_type || '').toLowerCase() === 'rent').length;
    return { total, newCount, contactedCount, convertedCount, buyCount, rentCount };
  }, [items]);

  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter(item => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      // Listing Type filter
      if (typeFilter !== 'all') {
        const itemType = (item.listing_type || 'buy').toLowerCase();
        if (typeFilter === 'buy' && itemType !== 'buy') return false;
        if (typeFilter === 'rent' && itemType !== 'rent') return false;
      }

      // Search query
      if (!query) return true;
      return [
        item.property_title,
        item.property_type,
        item.property_location,
        item.enquirer_name,
        item.enquirer_phone,
        item.enquirer_email,
        item.owner_name,
        item.owner_phone,
        item.owner_email,
        item.message,
      ].some(value => String(value || '').toLowerCase().includes(query));
    });
  }, [items, search, statusFilter, typeFilter]);

  const cardClass = isDarkMode ? 'bg-zinc-900/90 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm';
  const subCardClass = isDarkMode ? 'bg-black/40 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200';
  const inputClass = isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400';

  return (
    <section className={`min-h-screen p-4 md:p-8 transition-colors ${isDarkMode ? 'bg-black text-white' : 'bg-zinc-100/60 text-zinc-900'}`}>
      
      {/* ── HEADER ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[var(--brand-blue)]/15 text-[var(--brand-blue)] border border-[var(--brand-blue)]/30 mb-2">
            <span>🏢</span> Property Lead Management
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Property Inquiries</h2>
          <p className="text-xs text-zinc-500 mt-1">Track and manage customer inquiries for both Sell/Buy and Rent listings with automatic owner notifications.</p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 bg-[var(--brand-blue)] text-black rounded-lg text-xs font-black uppercase tracking-wider hover:brightness-110 shadow transition-all flex items-center gap-2"
        >
          <span>🔄</span> Refresh
        </button>
      </div>

      {/* ── METRICS TILES ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className={`p-4 rounded-xl border ${cardClass}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Leads</span>
          <p className="text-2xl font-black mt-1">{metrics.total}</p>
        </div>
        <div className={`p-4 rounded-xl border ${cardClass}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">New Leads</span>
          <p className="text-2xl font-black mt-1 text-blue-500">{metrics.newCount}</p>
        </div>
        <div className={`p-4 rounded-xl border ${cardClass}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">In Follow-up</span>
          <p className="text-2xl font-black mt-1 text-amber-500">{metrics.contactedCount}</p>
        </div>
        <div className={`p-4 rounded-xl border ${cardClass}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Converted</span>
          <p className="text-2xl font-black mt-1 text-emerald-500">{metrics.convertedCount}</p>
        </div>
        <div className={`p-4 rounded-xl border ${cardClass}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Sell / Buy</span>
          <p className="text-2xl font-black mt-1">{metrics.buyCount}</p>
        </div>
        <div className={`p-4 rounded-xl border ${cardClass}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Rent</span>
          <p className="text-2xl font-black mt-1">{metrics.rentCount}</p>
        </div>
      </div>

      {/* ── FILTERS & SEARCH ROW ── */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by property, customer name, phone, email, owner, or city..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium outline-none ${inputClass}`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Listing Type Toggle */}
          <div className="flex rounded-xl border p-1 bg-zinc-500/10 shrink-0 gap-1">
            {[
              { id: 'all', label: 'All Listings' },
              { id: 'buy', label: '🏡 Sell / Buy' },
              { id: 'rent', label: '🔑 Rent' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  typeFilter === tab.id
                    ? 'bg-[var(--brand-blue)] text-black shadow'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {statuses.map(st => {
            const active = statusFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  active
                    ? 'bg-[var(--brand-blue)] text-black border-[var(--brand-blue)] shadow'
                    : isDarkMode
                    ? 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:text-black'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-bold text-red-500">{error}</p>}

      {/* ── LIST ── */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[var(--brand-blue)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading Property Inquiries...</p>
        </div>
      ) : shown.length === 0 ? (
        <div className={`p-16 rounded-2xl border text-center ${cardClass}`}>
          <div className="text-4xl mb-3">🏢</div>
          <h3 className="text-base font-bold">No Property Inquiries Found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">No inquiries match the selected status, category or search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map(item => {
            const isRent = (item.listing_type || '').toLowerCase() === 'rent';
            const cleanPhone = String(item.enquirer_phone || '').replace(/\D/g, '');
            const cleanOwnerPhone = String(item.owner_phone || '').replace(/\D/g, '');
            const customerWa = cleanPhone ? `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(`Hello ${item.enquirer_name}, regarding your inquiry for ${item.property_title}...`)}` : '';
            const ownerWa = cleanOwnerPhone ? `https://wa.me/91${cleanOwnerPhone.slice(-10)}?text=${encodeURIComponent(`Hello ${item.owner_name || 'Owner'}, regarding the inquiry on your property ${item.property_title}...`)}` : '';

            return (
              <article key={item.id} className={`rounded-2xl border p-5 sm:p-6 transition-all ${cardClass}`}>
                
                {/* Top Row: Property Title + Badges + Status Update */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="space-y-1.5 flex-1 min-w-[260px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isRent
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isRent ? '🔑 For Rent' : '🏡 For Sale / Buy'}
                      </span>
                      {item.property_type && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                          {item.property_type}
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-400">ID #{item.property_id}</span>
                    </div>

                    <h3 className="text-lg font-black tracking-tight leading-snug">
                      <Link
                        href={`/property/details/${item.property_id}`}
                        target="_blank"
                        className="hover:text-[var(--brand-blue)] transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>{item.property_title}</span>
                        <span className="text-xs text-zinc-400">↗</span>
                      </Link>
                    </h3>

                    <p className="text-xs text-zinc-500 flex flex-wrap items-center gap-2">
                      <span>📍 {item.property_location || 'Location not specified'}</span>
                      {item.property_price && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-[var(--brand-blue)]">₹{item.property_price}</span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-zinc-400">Status:</span>
                    <select
                      value={item.status}
                      disabled={updatingId === item.id}
                      onChange={e => updateStatus(item.id, e.target.value)}
                      className={`h-9 px-3 rounded-lg border text-xs font-bold outline-none capitalize cursor-pointer ${
                        item.status === 'new'
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/40'
                          : item.status === 'contacted'
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                          : item.status === 'converted'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                          : item.status === 'lost'
                          ? 'bg-red-500/15 text-red-400 border-red-500/40'
                          : 'bg-purple-500/15 text-purple-400 border-purple-500/40'
                      }`}
                    >
                      {statuses.filter(s => s.id !== 'all').map(s => (
                        <option key={s.id} value={s.id} className="bg-zinc-900 text-white capitalize">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Middle Grid: Customer Info vs Property Owner Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  
                  {/* Left Box: Customer Lead Details */}
                  <div className={`p-4 rounded-xl border ${subCardClass}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[var(--brand-blue)] flex items-center gap-1.5">
                        <span>👤</span> Customer / Enquirer
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(item.created_at).toLocaleString('en-IN', {
                          month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-sm font-black">{item.enquirer_name}</p>
                    
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="flex items-center gap-2">
                        <span className="text-zinc-400">Phone:</span>
                        <a href={`tel:${item.enquirer_phone}`} className="font-bold text-[var(--brand-blue)] hover:underline">
                          {item.enquirer_phone}
                        </a>
                      </p>
                      {item.enquirer_email && (
                        <p className="flex items-center gap-2 text-zinc-400">
                          <span>Email:</span>
                          <a href={`mailto:${item.enquirer_email}`} className="text-zinc-300 hover:underline">
                            {item.enquirer_email}
                          </a>
                        </p>
                      )}
                    </div>

                    {item.message && (
                      <div className="mt-3 p-2.5 rounded-lg bg-zinc-500/5 border border-zinc-500/10 text-xs text-zinc-300 leading-relaxed italic">
                        &ldquo;{item.message}&rdquo;
                      </div>
                    )}

                    {/* Action buttons for Customer */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                      {cleanPhone && (
                        <>
                          <a
                            href={`tel:${cleanPhone}`}
                            className="px-3 py-1.5 bg-[var(--brand-blue)] text-black rounded-lg text-[11px] font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1"
                          >
                            <span>📞</span> Call
                          </a>
                          <a
                            href={customerWa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1"
                          >
                            <span>💬</span> WhatsApp
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Box: Property Owner / Lister Details */}
                  <div className={`p-4 rounded-xl border ${subCardClass}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <span>🏠</span> Property Owner / Lister
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {item.owner_user_id ? `User #${item.owner_user_id}` : 'Direct Listing'}
                      </span>
                    </div>

                    <p className="text-sm font-black">{item.owner_name || 'Owner Name not provided'}</p>

                    <div className="mt-2 space-y-1 text-xs">
                      <p className="flex items-center gap-2">
                        <span className="text-zinc-400">Owner Phone:</span>
                        {item.owner_phone ? (
                          <a href={`tel:${item.owner_phone}`} className="font-bold text-amber-400 hover:underline">
                            {item.owner_phone}
                          </a>
                        ) : (
                          <span className="text-zinc-500">Not provided</span>
                        )}
                      </p>
                      <p className="flex items-center gap-2 text-zinc-400">
                        <span>Owner Email:</span>
                        {item.owner_email ? (
                          <a href={`mailto:${item.owner_email}`} className="text-zinc-300 hover:underline">
                            {item.owner_email}
                          </a>
                        ) : (
                          <span className="text-zinc-500">Not provided</span>
                        )}
                      </p>
                    </div>

                    <div className="mt-3 p-2.5 rounded-lg bg-zinc-500/5 border border-zinc-500/10 text-xs text-zinc-400">
                      ℹ️ When this inquiry was placed, automatic email notifications were delivered to both Admin and the Property Owner.
                    </div>

                    {/* Action buttons for Owner */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                      {cleanOwnerPhone && (
                        <>
                          <a
                            href={`tel:${cleanOwnerPhone}`}
                            className="px-3 py-1.5 bg-amber-500 text-black rounded-lg text-[11px] font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1"
                          >
                            <span>📞</span> Call Owner
                          </a>
                          <a
                            href={ownerWa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1"
                          >
                            <span>💬</span> WhatsApp Owner
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                </div>

              </article>
            );
          })}
        </div>
      )}

    </section>
  );
}

