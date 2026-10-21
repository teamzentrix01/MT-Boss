'use client';

import { useCallback, useEffect, useMemo, useState, memo } from 'react';

const STATUS_LABELS = {
  requested: 'Requested',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

const PropertyBookingRow = memo(function PropertyBookingRow({
  booking: b,
  border,
  muted,
  bg,
  onView,
  onAct,
}) {
  const dateLabel = useMemo(() => {
    const start = String(b.start_date).slice(0, 10);
    if (b.end_date) return `${start} → ${String(b.end_date).slice(0, 10)}`;
    if (b.duration_months) return `${start} · ${b.duration_months} mo`;
    return `${start} · open-ended`;
  }, [b.start_date, b.end_date, b.duration_months]);

  return (
    <tr style={{ borderTop: `1px solid ${border}` }}>
      <td style={{ padding: '10px 12px' }}>#{b.id}</td>
      <td style={{ padding: '10px 12px' }}>
        <div style={{ fontWeight: 600 }}>{b.property_title}</div>
        <div style={{ color: muted, fontSize: 11 }}>{b.property_category} · {b.property_location}</div>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <div>{b.name}</div>
        <div style={{ color: muted, fontSize: 11 }}>{b.phone}{b.email ? ` · ${b.email}` : ''}</div>
      </td>
      <td style={{ padding: '10px 12px' }}>{dateLabel}</td>
      <td style={{ padding: '10px 12px', fontWeight: 700 }}>{STATUS_LABELS[b.status] || b.status}</td>
      <td style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => onView(b)} style={btnStyle(border, bg)}>View</button>
          {b.status === 'requested' && (
            <>
              <button type="button" onClick={() => onAct(b.id, 'approve')} style={{ ...btnStyle(border, '#16a34a'), color: '#fff' }}>Approve</button>
              <button type="button" onClick={() => onAct(b.id, 'reject')} style={{ ...btnStyle(border, '#ef4444'), color: '#fff' }}>Reject</button>
            </>
          )}
          {['requested', 'approved'].includes(b.status) && (
            <button type="button" onClick={() => onAct(b.id, 'cancel')} style={btnStyle(border, bg)}>Cancel</button>
          )}
        </div>
      </td>
    </tr>
  );
});

export default function PropertyBookingsManager({ isDarkMode }) {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState(null);

  const token = () => localStorage.getItem('token') || localStorage.getItem('admin-token');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [filter, debouncedQ]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '25',
        sort: 'created_at',
        order: 'desc',
      });
      if (filter !== 'all') params.set('status', filter);
      if (debouncedQ) params.set('q', debouncedQ);
      const res = await fetch(`/api/property-bookings?${params}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data || []);
        setPagination(data.pagination || { page: 1, limit: 25, total: 0, pages: 1 });
      } else {
        setError(data.error || 'Failed to load bookings');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [page, filter, debouncedQ]);

  useEffect(() => { load(); }, [load]);

  const act = useCallback(async (id, action) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/property-bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Action failed');
        return;
      }
      setSuccess(`Booking ${action}d`);
      setSelected(null);
      load();
    } catch {
      setError('Network error');
    }
  }, [load]);

  const onView = useCallback((b) => setSelected(b), []);

  const theme = useMemo(() => ({
    bg: isDarkMode ? '#18181c' : '#fff',
    border: isDarkMode ? '#2a2a30' : '#e4e4e7',
    text: isDarkMode ? '#f4f4f5' : '#18181b',
    muted: isDarkMode ? '#a1a1aa' : '#71717a',
  }), [isDarkMode]);
  const { bg, border, text, muted } = theme;

  return (
    <div style={{ color: text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
        <strong style={{ fontSize: 14 }}>Property Bookings</strong>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, property…"
            style={{
              padding: '6px 10px', borderRadius: 6, border: `1px solid ${border}`,
              background: bg, color: text, fontSize: 12, minWidth: 180,
            }}
          />
          {['all', 'requested', 'approved', 'rejected', 'cancelled', 'completed'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              style={{
                padding: '6px 10px', borderRadius: 6, border: `1px solid ${border}`,
                background: filter === s ? '#2563eb' : bg, color: filter === s ? '#fff' : muted,
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {error ? <div style={{ marginBottom: 8, color: '#ef4444', fontSize: 13 }}>{error}</div> : null}
      {success ? <div style={{ marginBottom: 8, color: '#16a34a', fontSize: 13 }}>{success}</div> : null}

      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: 28, textAlign: 'center', color: muted, fontSize: 13 }}>Loading bookings…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: isDarkMode ? '#0f0f11' : '#f4f4f5', color: muted, textAlign: 'left' }}>
                {['ID', 'Property', 'Requester', 'Dates', 'Status', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 12px', fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 28, textAlign: 'center', color: muted }}>No booking requests yet.</td></tr>
              ) : bookings.map((b) => (
                <PropertyBookingRow
                  key={b.id}
                  booking={b}
                  border={border}
                  muted={muted}
                  bg={bg}
                  onView={onView}
                  onAct={act}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: muted }}>
          Showing <strong>{bookings.length}</strong> of <strong>{pagination.total}</strong> (page {pagination.page}/{pagination.pages})
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))} style={btnStyle(border, bg)}>Prev</button>
          <button type="button" disabled={page >= pagination.pages || loading} onClick={() => setPage((p) => p + 1)} style={btnStyle(border, bg)}>Next</button>
        </div>
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }} onClick={() => setSelected(null)}>
          <div style={{ background: bg, borderRadius: 10, maxWidth: 520, width: '100%', padding: 16, border: `1px solid ${border}` }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <strong>Booking #{selected.id}</strong>
              <button type="button" onClick={() => setSelected(null)}>×</button>
            </div>
            <p style={{ fontSize: 13, color: muted, marginBottom: 8 }}>Requests are not confirmed until approved. Approval checks overlapping confirmed bookings.</p>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, background: isDarkMode ? '#0f0f11' : '#f4f4f5', padding: 12, borderRadius: 8 }}>
{JSON.stringify({
  property: selected.property_title,
  category: selected.property_category,
  requester: { name: selected.name, phone: selected.phone, email: selected.email },
  dates: { start: selected.start_date, end: selected.end_date, months: selected.duration_months },
  message: selected.message,
  status: selected.status,
  created_at: selected.created_at,
}, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function btnStyle(border, background) {
  return {
    padding: '4px 8px',
    borderRadius: 4,
    border: `1px solid ${border}`,
    background,
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
  };
}
