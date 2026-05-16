'use client';

import { useState, useEffect } from 'react';

const STATUS_COLORS = {
  pending:  { bg: 'sp-pending',  label: '⏳ Pending' },
  verified: { bg: 'sp-verified', label: '✓ Verified' },
  rejected: { bg: 'sp-rejected', label: '✕ Rejected' },
};

export default function PropertiesManager({ isDarkMode }) {
  const [properties, setProperties] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('all');
  const [listFilter, setListFilter] = useState('all');
  const [selected,   setSelected]   = useState(null);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('/api/properties?status=all', { headers: { 'Authorization': `Bearer ${token}` } });
      const data  = await res.json();
      if (data.success) setProperties(data.data);
    } catch { setError('Error fetching properties'); }
    finally  { setLoading(false); }
  };

  const action = async (id, act) => {
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id, action: act }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(`Property ${act}d successfully`);
        setSelected(null);
        fetchProperties();
      } else setError(data.error || 'Action failed');
    } catch { setError('Network error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this property listing permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`/api/properties?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const data  = await res.json();
      if (data.success) { setSuccess('Deleted'); setSelected(null); fetchProperties(); }
      else setError(data.error || 'Delete failed');
    } catch { setError('Network error'); }
  };

  const displayed = properties.filter(p => {
    const statusMatch  = filter     === 'all' || p.status       === filter;
    const listingMatch = listFilter === 'all' || p.listing_type === listFilter;
    return statusMatch && listingMatch;
  });

  const counts = {
    all:      properties.length,
    pending:  properties.filter(p => p.status === 'pending').length,
    verified: properties.filter(p => p.status === 'verified').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
  };

  if (loading) return <div style={{ color: 'var(--pm-muted)', fontSize: '0.8125rem' }}>Loading…</div>;

  return (
    <>
      <style>{`
        /* ── Tokens ── */
        .pm-root {
          --pm-bg:       ${isDarkMode ? '#0f0f11' : '#f5f5f7'};
          --pm-surface:  ${isDarkMode ? '#18181c' : '#ffffff'};
          --pm-border:   ${isDarkMode ? '#2a2a30' : '#e2e2e7'};
          --pm-text:     ${isDarkMode ? '#f0f0f5' : '#111113'};
          --pm-muted:    ${isDarkMode ? '#7c7c8a' : '#6b6b76'};
          --pm-accent:   ${isDarkMode ? '#60a5fa' : '#2563eb'};
          --pm-row-hov:  ${isDarkMode ? '#1e1e24' : '#f8f8fa'};

          /* status */
          --sp-pending-bg:  ${isDarkMode ? '#2a220e' : '#fff7ed'};
          --sp-pending-tx:  ${isDarkMode ? '#fb923c' : '#9a3412'};
          --sp-verified-bg: ${isDarkMode ? '#0f2a18' : '#f0fdf4'};
          --sp-verified-tx: ${isDarkMode ? '#86efac' : '#14532d'};
          --sp-rejected-bg: ${isDarkMode ? '#2a0f0f' : '#fff1f2'};
          --sp-rejected-tx: ${isDarkMode ? '#f87171' : '#9f1239'};

          /* listing badges */
          --buy-bg:  ${isDarkMode ? '#1a2035' : '#eff4ff'};
          --buy-tx:  ${isDarkMode ? '#93c5fd' : '#1e40af'};
          --rent-bg: ${isDarkMode ? '#1a2a1a' : '#f0fdf4'};
          --rent-tx: ${isDarkMode ? '#86efac' : '#14532d'};
        }

        .pm-root { color: var(--pm-text); }

        /* ── Header row ── */
        .pm-header { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:0.75rem; margin-bottom:0.875rem; }
        .pm-title  { font-size:0.875rem; font-weight:700; }

        /* ── Toggle pills ── */
        .pm-toggles { display:flex; gap:0.375rem; }
        .pm-toggle  {
          padding: 0.3rem 0.75rem;
          font-size: 0.75rem; font-weight: 600;
          border-radius: 5px; border: 1px solid var(--pm-border);
          background: var(--pm-surface); color: var(--pm-muted);
          cursor: pointer; transition: all .15s;
        }
        .pm-toggle.active { background: var(--pm-accent); color: #fff; border-color: var(--pm-accent); }
        .pm-toggle:not(.active):hover { color: var(--pm-text); border-color: var(--pm-muted); }

        /* ── Alerts ── */
        .pm-alert {
          padding: 0.5rem 0.875rem;
          border-radius: 6px; border: 1px solid;
          font-size: 0.8125rem; margin-bottom: 0.75rem;
        }
        .pm-alert-err  { background:${isDarkMode?'#2a0f0f':'#fff1f2'}; border-color:${isDarkMode?'#7f1d1d':'#fca5a5'}; color:${isDarkMode?'#f87171':'#9f1239'}; }
        .pm-alert-ok   { background:${isDarkMode?'#0f2a18':'#f0fdf4'}; border-color:${isDarkMode?'#166534':'#86efac'}; color:${isDarkMode?'#86efac':'#14532d'}; }

        /* ── Panel ── */
        .pm-panel { background:var(--pm-surface); border:1px solid var(--pm-border); border-radius:8px; overflow:hidden; margin-bottom:0.75rem; }

        /* ── Status tabs ── */
        .pm-tabs  { display:flex; border-bottom:1px solid var(--pm-border); overflow-x:auto; scrollbar-width:none; }
        .pm-tabs::-webkit-scrollbar { display:none; }
        .pm-tab   {
          display:flex; align-items:center; gap:0.375rem;
          padding: 0.55rem 1rem;
          font-size:0.75rem; font-weight:600;
          border:none; background:none; cursor:pointer;
          border-bottom:2px solid transparent;
          color:var(--pm-muted); white-space:nowrap;
          transition: color .15s, border-color .15s;
          margin-bottom:-1px;
        }
        .pm-tab:hover  { color:var(--pm-text); }
        .pm-tab.active { color:var(--pm-accent); border-bottom-color:var(--pm-accent); }
        .pm-tab-count  {
          padding:0.1rem 0.4rem; border-radius:4px;
          font-size:0.65rem; font-weight:700;
          background:var(--pm-bg); color:var(--pm-muted);
        }
        .pm-tab.active .pm-tab-count { background:var(--pm-accent); color:#fff; }

        /* ── Table ── */
        .pm-table { width:100%; border-collapse:collapse; font-size:0.8rem; }
        .pm-table th {
          padding:0.5rem 0.875rem;
          text-align:left; font-size:0.65rem; font-weight:700;
          text-transform:uppercase; letter-spacing:.06em;
          color:var(--pm-muted);
          background:var(--pm-bg);
          border-bottom:1px solid var(--pm-border);
        }
        .pm-table td {
          padding:0.55rem 0.875rem;
          border-bottom:1px solid var(--pm-border);
          color:var(--pm-text);
          vertical-align:middle;
        }
        .pm-table tr:last-child td { border-bottom:none; }
        .pm-table tbody tr { cursor:pointer; transition:background .12s; }
        .pm-table tbody tr:hover td { background:var(--pm-row-hov); }

        /* ── Prop thumb ── */
        .pm-thumb { display:flex; align-items:center; gap:0.5rem; }
        .pm-thumb img { width:36px; height:36px; object-fit:cover; border-radius:5px; flex-shrink:0; }
        .pm-thumb-placeholder {
          width:36px; height:36px; border-radius:5px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          background:var(--pm-bg); font-size:1rem;
        }
        .pm-prop-name { font-size:0.8rem; font-weight:600; max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

        /* ── Badges ── */
        .badge-sm {
          display:inline-block;
          padding:0.15rem 0.45rem; border-radius:4px;
          font-size:0.65rem; font-weight:700;
          text-transform:uppercase; letter-spacing:.04em;
        }
        .badge-buy  { background:var(--buy-bg);  color:var(--buy-tx); }
        .badge-rent { background:var(--rent-bg); color:var(--rent-tx); }
        .sp-pending  { background:var(--sp-pending-bg);  color:var(--sp-pending-tx); }
        .sp-verified { background:var(--sp-verified-bg); color:var(--sp-verified-tx); }
        .sp-rejected { background:var(--sp-rejected-bg); color:var(--sp-rejected-tx); }

        /* ── Action buttons in table ── */
        .pm-actions { display:flex; gap:0.25rem; flex-wrap:nowrap; }
        .act-btn {
          padding:0.2rem 0.5rem;
          font-size:0.65rem; font-weight:700;
          border-radius:4px; border:none; cursor:pointer;
          transition:opacity .15s;
        }
        .act-btn:hover { opacity:.75; }
        .act-verify { background:var(--sp-verified-bg); color:var(--sp-verified-tx); }
        .act-reject { background:var(--sp-rejected-bg); color:var(--sp-rejected-tx); }
        .act-delete { background:var(--pm-bg); color:var(--pm-muted); border:1px solid var(--pm-border); }

        /* ── Footer line ── */
        .pm-footer { font-size:0.75rem; color:var(--pm-muted); padding:0.25rem 0; }
        .pm-footer strong { color:var(--pm-text); }

        /* ── Empty ── */
        .pm-empty { text-align:center; padding:2.5rem; font-size:0.8125rem; color:var(--pm-muted); }

        /* ── Modal ── */
        .pm-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,.5);
          display:flex; align-items:center; justify-content:center;
          padding:1rem; z-index:50;
        }
        .pm-modal {
          background:var(--pm-surface);
          border:1px solid var(--pm-border);
          border-radius:10px;
          width:100%; max-width:560px;
          max-height:90vh; overflow-y:auto;
          box-shadow:0 20px 60px rgba(0,0,0,.25);
        }
        .pm-modal-head {
          display:flex; align-items:center; justify-content:space-between;
          padding:0.875rem 1.25rem;
          border-bottom:1px solid var(--pm-border);
          position:sticky; top:0; background:var(--pm-surface); z-index:1;
        }
        .pm-modal-id    { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--pm-muted); }
        .pm-modal-title { font-size:0.9375rem; font-weight:700; margin-top:1px; }
        .pm-modal-close {
          background:none; border:1px solid var(--pm-border);
          color:var(--pm-muted); cursor:pointer;
          width:28px; height:28px; border-radius:5px;
          font-size:0.875rem; display:flex; align-items:center; justify-content:center;
          transition:all .15s;
        }
        .pm-modal-close:hover { border-color:var(--pm-text); color:var(--pm-text); }
        .pm-modal-body { padding:1.25rem; }

        /* Modal images */
        .pm-imgs { display:grid; grid-template-columns:repeat(3,1fr); gap:0.375rem; margin-bottom:1rem; }
        .pm-imgs img { width:100%; height:80px; object-fit:cover; border-radius:5px; }

        /* Modal detail grid */
        .pm-detail-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;
          background:var(--pm-bg); border-radius:6px;
          padding:0.875rem; margin-bottom:0.875rem;
        }
        .pm-detail-label { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--pm-muted); margin-bottom:0.2rem; }
        .pm-detail-value { font-size:0.8125rem; font-weight:600; }

        /* Modal section label */
        .pm-section-label { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--pm-muted); margin-bottom:0.375rem; }
        .pm-section-text  { font-size:0.8125rem; color:var(--pm-muted); line-height:1.6; margin-bottom:0.875rem; }

        /* Highlights */
        .pm-highlights { display:flex; flex-wrap:wrap; gap:0.3rem; margin-bottom:0.875rem; }
        .pm-tag { padding:0.2rem 0.5rem; border-radius:4px; font-size:0.75rem; background:var(--pm-bg); color:var(--pm-muted); border:1px solid var(--pm-border); }

        /* Seller panel */
        .pm-seller {
          background:var(--pm-bg); border:1px solid var(--pm-border);
          border-radius:6px; padding:0.875rem; margin-bottom:0.875rem;
        }
        .pm-seller-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin-top:0.5rem; }

        /* Modal actions */
        .pm-modal-actions { display:flex; gap:0.5rem; padding-top:0.5rem; }
        .pm-modal-btn {
          flex:1; padding:0.45rem 0.75rem;
          font-size:0.75rem; font-weight:700;
          text-transform:uppercase; letter-spacing:.04em;
          border:none; border-radius:6px; cursor:pointer;
          transition:opacity .15s;
        }
        .pm-modal-btn:hover { opacity:.85; }
        .pm-modal-btn-verify  { background:#22c55e; color:#fff; }
        .pm-modal-btn-reject  { background:#ef4444; color:#fff; }
        .pm-modal-btn-pending { background:none; border:1px solid var(--pm-border); color:var(--pm-text); }
        .pm-modal-btn-delete  { background:var(--sp-rejected-bg); color:var(--sp-rejected-tx); flex:0 0 auto; }

        .pm-submitted { font-size:0.7rem; color:var(--pm-muted); margin-bottom:0.75rem; }
      `}</style>

      <div className="pm-root">
        {/* Header */}
        <div className="pm-header">
          <span className="pm-title">Properties Management</span>
          <div className="pm-toggles">
            {['all','buy','rent'].map(t => (
              <button key={t} className={`pm-toggle${listFilter===t?' active':''}`} onClick={() => setListFilter(t)}>
                {t === 'all' ? 'All' : t === 'buy' ? '⌂ Buy' : '⌂ Rent'}
              </button>
            ))}
          </div>
        </div>

        {error   && <div className="pm-alert pm-alert-err">{error}</div>}
        {success && <div className="pm-alert pm-alert-ok">{success}</div>}

        <div className="pm-panel">
          {/* Status tabs */}
          <div className="pm-tabs">
            {[['all','All'],['pending','Pending'],['verified','Verified'],['rejected','Rejected']].map(([id,label]) => (
              <button key={id} className={`pm-tab${filter===id?' active':''}`} onClick={() => setFilter(id)}>
                {label}
                <span className="pm-tab-count">{counts[id]}</span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="pm-table">
              <thead>
                <tr>
                  {['Property','Type','Listing','Location','Price','Seller','Status','Actions'].map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.length > 0 ? displayed.map(p => {
                  const sc = STATUS_COLORS[p.status] || STATUS_COLORS.pending;
                  return (
                    <tr key={p.id} onClick={() => setSelected(p)}>
                      <td>
                        <div className="pm-thumb">
                          {Array.isArray(p.images) && p.images.length > 0
                            ? <img src={p.images[0]} alt="" onError={e => { e.target.style.display='none'; }} />
                            : <div className="pm-thumb-placeholder">⌂</div>}
                          <span className="pm-prop-name">{p.title}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--pm-muted)' }}>{p.type}</td>
                      <td>
                        <span className={`badge-sm badge-${p.listing_type}`}>{p.listing_type}</span>
                      </td>
                      <td style={{ color: 'var(--pm-muted)' }}>{p.location}</td>
                      <td style={{ fontWeight: 600 }}>₹{p.price}</td>
                      <td style={{ color: 'var(--pm-muted)' }}>
                        {p.seller_name || '—'}
                        {p.seller_type && <span style={{ display:'block', fontSize:'0.65rem' }}>{p.seller_type}</span>}
                      </td>
                      <td><span className={`badge-sm ${sc.bg}`}>{sc.label}</span></td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="pm-actions">
                          {p.status !== 'verified' && (
                            <button className="act-btn act-verify" onClick={() => action(p.id, 'verify')}>✓ Verify</button>
                          )}
                          {p.status !== 'rejected' && (
                            <button className="act-btn act-reject" onClick={() => action(p.id, 'reject')}>✕ Reject</button>
                          )}
                          <button className="act-btn act-delete" onClick={() => handleDelete(p.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={8}><div className="pm-empty">No properties in this category.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="pm-footer">Showing <strong>{displayed.length}</strong> of <strong>{properties.length}</strong> total listings</p>

        {/* Detail Modal */}
        {selected && (
          <div className="pm-backdrop" onClick={() => setSelected(null)}>
            <div className="pm-modal" onClick={e => e.stopPropagation()}>
              <div className="pm-modal-head">
                <div>
                  <div className="pm-modal-id">Property #{selected.id}</div>
                  <div className="pm-modal-title">{selected.title}</div>
                </div>
                <button className="pm-modal-close" onClick={() => setSelected(null)}>✕</button>
              </div>

              <div className="pm-modal-body">
                {/* Images */}
                {Array.isArray(selected.images) && selected.images.length > 0 && (
                  <div className="pm-imgs">
                    {selected.images.map((url, i) => (
                      <img key={i} src={url} alt="" onError={e => { e.target.src = '/images/property-placeholder.jpg'; }} />
                    ))}
                  </div>
                )}

                {/* Status + listing badges */}
                <div style={{ display:'flex', gap:'0.375rem', marginBottom:'0.875rem', flexWrap:'wrap' }}>
                  <span className={`badge-sm ${STATUS_COLORS[selected.status]?.bg}`}>{STATUS_COLORS[selected.status]?.label}</span>
                  <span className={`badge-sm badge-${selected.listing_type}`}>{selected.listing_type}</span>
                </div>

                {/* Details grid */}
                <div className="pm-detail-grid">
                  {[
                    ['Type',     selected.type],
                    ['Location', selected.location],
                    ['Price',    `₹${selected.price}`],
                    ['Area',     selected.area ? `${selected.area} sqft` : '—'],
                    ['Beds',     selected.beds  || '—'],
                    ['Baths',    selected.baths || '—'],
                  ].map(([k,v]) => (
                    <div key={k}>
                      <div className="pm-detail-label">{k}</div>
                      <div className="pm-detail-value">{v}</div>
                    </div>
                  ))}
                </div>

                {/* Address */}
                {selected.address && (
                  <><div className="pm-section-label">Address</div><p className="pm-section-text">{selected.address}</p></>
                )}

                {/* Description */}
                {selected.description && (
                  <><div className="pm-section-label">Description</div><p className="pm-section-text">{selected.description}</p></>
                )}

                {/* Highlights */}
                {Array.isArray(selected.highlights) && selected.highlights.length > 0 && (
                  <>
                    <div className="pm-section-label">Highlights</div>
                    <div className="pm-highlights">
                      {selected.highlights.map((h,i) => <span key={i} className="pm-tag">{h}</span>)}
                    </div>
                  </>
                )}

                {/* Seller */}
                <div className="pm-seller">
                  <div className="pm-section-label">Seller / Lister Info</div>
                  <div className="pm-seller-grid">
                    {[['Name', selected.seller_name||'—'],['Type', selected.seller_type||'—'],['Phone', selected.seller_phone||'—'],['Email', selected.seller_email||'—']].map(([k,v]) => (
                      <div key={k}>
                        <div className="pm-detail-label">{k}</div>
                        <div className="pm-detail-value" style={{ fontSize:'0.8rem' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="pm-submitted">
                  Submitted: {new Date(selected.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                </p>

                {/* Actions */}
                <div className="pm-modal-actions">
                  {selected.status !== 'verified' && (
                    <button className="pm-modal-btn pm-modal-btn-verify" onClick={() => action(selected.id, 'verify')}>✓ Verify &amp; Publish</button>
                  )}
                  {selected.status !== 'rejected' && (
                    <button className="pm-modal-btn pm-modal-btn-reject" onClick={() => action(selected.id, 'reject')}>✕ Reject</button>
                  )}
                  {selected.status === 'rejected' && (
                    <button className="pm-modal-btn pm-modal-btn-pending" onClick={() => action(selected.id, 'pending')}>↩ Move to Pending</button>
                  )}
                  <button className="pm-modal-btn pm-modal-btn-delete" onClick={() => handleDelete(selected.id)}>🗑 Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}