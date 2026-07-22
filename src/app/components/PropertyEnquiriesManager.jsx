'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const statuses = ['new', 'contacted', 'follow-up', 'converted', 'lost'];

export default function PropertyEnquiriesManager({ isDarkMode }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
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
    }
  };

  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter(item => [item.property_title, item.property_type, item.property_location, item.enquirer_name, item.enquirer_phone, item.enquirer_email, item.message]
      .some(value => String(value || '').toLowerCase().includes(query)));
  }, [items, search]);

  const cardClass = isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-gray-200 text-gray-900';
  const inputClass = isDarkMode ? 'bg-black border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900';

  return (
    <section className={`min-h-screen p-4 md:p-6 ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black uppercase">Property Enquiries</h2>
          <p className="text-xs opacity-60">Buy and plot enquiries submitted from property pages.</p>
        </div>
        <button onClick={load} className="rounded bg-[var(--brand-blue)] px-4 py-2 text-xs font-black text-black">Refresh</button>
      </div>
      <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search property, customer, phone or city" className={`mb-4 w-full rounded border px-4 py-3 text-sm ${inputClass}`} />
      {error && <p className="mb-4 rounded bg-red-100 p-3 text-sm font-bold text-red-700">{error}</p>}
      {loading ? (
        <p className="py-12 text-center text-sm opacity-60">Loading enquiries...</p>
      ) : shown.length === 0 ? (
        <p className={`rounded border p-12 text-center text-sm opacity-60 ${cardClass}`}>No property enquiries found.</p>
      ) : (
        <div className="grid gap-3">
          {shown.map(item => (
            <article key={item.id} className={`rounded border p-4 ${cardClass}`}>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-black">{item.property_title}</h3>
                  <p className="text-xs opacity-60">{item.property_type || 'Property'} · {item.property_location || 'Location not set'} · Property #{item.property_id}</p>
                  <p className="mt-3 text-sm font-bold">{item.enquirer_name} · <a href={`tel:${item.enquirer_phone}`}>{item.enquirer_phone}</a></p>
                  {item.enquirer_email && <p className="text-xs opacity-70">{item.enquirer_email}</p>}
                  {item.message && <p className="mt-3 whitespace-pre-wrap text-sm opacity-80">{item.message}</p>}
                  <p className="mt-3 text-[11px] opacity-50">{new Date(item.created_at).toLocaleString('en-IN')}</p>
                </div>
                <select value={item.status} onChange={event => updateStatus(item.id, event.target.value)} className={`h-10 rounded border px-3 text-sm capitalize ${inputClass}`}>
                  {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
