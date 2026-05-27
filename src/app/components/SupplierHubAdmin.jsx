'use client';

import { useState, useEffect, useCallback } from 'react';

/* ── tiny helpers ──────────────────────────────────────────────────────────── */
const fmt  = (n) => `₹${parseFloat(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtD = (d) => { try { return new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }); } catch { return d || '—'; } };
const fmtDT= (d) => { try { return new Date(d).toLocaleString('en-IN',   { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }); } catch { return d || '—'; } };

function StatCard({ label, value, sub, color = '#f59e0b', bg, border }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: '1.1rem 1.25rem' }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#888', marginBottom: '0.35rem' }}>{label}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '0.3rem' }}>{sub}</div>}
    </div>
  );
}

function StatusBadge({ s }) {
  if (s.status === 'pending') return <span style={{ background:'#fff7ed', color:'#c2410c', padding:'0.2rem 0.55rem', borderRadius:20, fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', whiteSpace:'nowrap' }}>Pending</span>;
  if (s.status === 'rejected') return <span style={{ background:'#fef2f2', color:'#b91c1c', padding:'0.2rem 0.55rem', borderRadius:20, fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', whiteSpace:'nowrap' }}>Rejected</span>;
  if (s.status === 'approved' && s.is_active) return <span style={{ background:'#f0fdf4', color:'#15803d', padding:'0.2rem 0.55rem', borderRadius:20, fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', whiteSpace:'nowrap' }}>Active</span>;
  if (s.status === 'approved' && !s.is_active) return <span style={{ background:'#fef2f2', color:'#b91c1c', padding:'0.2rem 0.55rem', borderRadius:20, fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', whiteSpace:'nowrap' }}>Inactive</span>;
  return null;
}

function EnqStatusBadge({ status }) {
  const map = {
    open:      { bg:'#fef9c3', color:'#92400e', label:'Open'      },
    accepted:  { bg:'#dbeafe', color:'#1e40af', label:'Accepted'  },
    fulfilled: { bg:'#dcfce7', color:'#15803d', label:'Fulfilled' },
    cancelled: { bg:'#fee2e2', color:'#991b1b', label:'Cancelled' },
  };
  const s = map[status] || { bg:'#f3f4f6', color:'#374151', label: status };
  return <span style={{ background:s.bg, color:s.color, padding:'0.2rem 0.55rem', borderRadius:20, fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', whiteSpace:'nowrap' }}>{s.label}</span>;
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function SupplierHubAdmin({ isDarkMode }) {
  /* ── theme ─────────────────────────────────────────────────────────────── */
  const surface  = isDarkMode ? '#18181c' : '#fff';
  const bg       = isDarkMode ? '#0f0f11' : '#f5f5f7';
  const border   = isDarkMode ? '#2a2a30' : '#e2e2e7';
  const text     = isDarkMode ? '#f0f0f5' : '#111113';
  const muted    = isDarkMode ? '#7c7c8a' : '#6b6b76';
  const inputBg  = isDarkMode ? '#0f0f11' : '#f5f5f7';
  const accent   = '#2563eb';

  /* ── sub-tabs ──────────────────────────────────────────────────────────── */
  const [tab, setTab] = useState('overview');   // overview | enquiries | suppliers | revenue

  /* ── data ──────────────────────────────────────────────────────────────── */
  const [suppliers,   setSuppliers]   = useState([]);
  const [enquiries,   setEnquiries]   = useState([]);
  const [commission,  setCommission]  = useState({ total: 0, today: 0, fulfilled: 0, open: 0 });
  const [loadingSup,  setLoadingSup]  = useState(true);
  const [loadingEnq,  setLoadingEnq]  = useState(true);
  const [error,       setError]       = useState(null);

  /* ── supplier modal state ──────────────────────────────────────────────── */
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [actionLoading,    setActionLoading]    = useState(null);
  const [rejectTarget,     setRejectTarget]     = useState(null);
  const [rejectReason,     setRejectReason]     = useState('');
  const [showRejectModal,  setShowRejectModal]  = useState(false);

  /* ── enquiry modal state ───────────────────────────────────────────────── */
  const [selectedEnq, setSelectedEnq] = useState(null);

  /* ── filters ───────────────────────────────────────────────────────────── */
  const [supFilter,  setSupFilter]  = useState('all');
  const [supSearch,  setSupSearch]  = useState('');
  const [enqStatus,  setEnqStatus]  = useState('all');
  const [enqSearch,  setEnqSearch]  = useState('');

  const token = () => localStorage.getItem('token');

  /* ── fetch suppliers ───────────────────────────────────────────────────── */
  const fetchSuppliers = useCallback(async () => {
    setLoadingSup(true);
    try {
      const res  = await fetch('/api/admin/suppliers', { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (data.success) setSuppliers(data.data || []);
      else setError(data.error || 'Failed to load suppliers');

      // commission summary
      const cr  = await fetch('/api/admin/suppliers', { method: 'PATCH', headers: { Authorization: `Bearer ${token()}` } });
      const cd  = await cr.json();
      if (cd.success) setCommission({
        total:     parseFloat(cd.data.total_commission || 0),
        today:     parseFloat(cd.data.today_commission || 0),
        fulfilled: parseInt(cd.data.total_fulfilled   || 0),
        open:      parseInt(cd.data.open_enquiries    || 0),
      });
    } catch (e) { setError(e.message); }
    finally { setLoadingSup(false); }
  }, []);

  /* ── fetch enquiries ───────────────────────────────────────────────────── */
  const fetchEnquiries = useCallback(async () => {
    setLoadingEnq(true);
    try {
      const res  = await fetch('/api/material-enquiries', { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (data.success) setEnquiries(data.data || []);
    } catch { /* silently ignore */ }
    finally { setLoadingEnq(false); }
  }, []);

  useEffect(() => { fetchSuppliers(); fetchEnquiries(); }, [fetchSuppliers, fetchEnquiries]);

  /* ── supplier actions ──────────────────────────────────────────────────── */
  const doAction = async (supplier_id, action, extra = {}) => {
    setActionLoading(supplier_id);
    try {
      const res  = await fetch('/api/admin/suppliers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ supplier_id, action, ...extra }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuppliers(prev => prev.map(s => s.id === supplier_id ? { ...s, ...data.data } : s));
        if (selectedSupplier?.id === supplier_id) setSelectedSupplier(prev => ({ ...prev, ...data.data }));
      } else { alert(`Error: ${data.error}`); }
    } catch (e) { alert(`Error: ${e.message}`); }
    finally { setActionLoading(null); }
  };

  const handleApprove    = (id) => doAction(id, 'approve');
  const handleActivate   = (id) => doAction(id, 'activate');
  const handleDeactivate = (id) => doAction(id, 'deactivate');
  const openRejectModal  = (s)  => { setRejectTarget(s); setRejectReason(''); setShowRejectModal(true); };
  const handleReject     = async () => {
    if (!rejectTarget) return;
    await doAction(rejectTarget.id, 'reject', { rejection_reason: rejectReason });
    setShowRejectModal(false);
    if (selectedSupplier?.id === rejectTarget.id) setSelectedSupplier(null);
  };

  /* ── derived data ──────────────────────────────────────────────────────── */
  const pendingCount = suppliers.filter(s => s.status === 'pending').length;
  const activeCount  = suppliers.filter(s => s.status === 'approved' && s.is_active).length;

  const filteredSups = suppliers.filter(s => {
    const mf = supFilter === 'all' ? true
      : supFilter === 'active'   ? s.status === 'approved' && s.is_active
      : supFilter === 'inactive' ? s.is_active === false
      : s.status === supFilter;
    const term = supSearch.toLowerCase();
    return mf && (!term || s.shop_name?.toLowerCase().includes(term) || s.email?.toLowerCase().includes(term) || s.phone?.includes(term));
  });

  const filteredEnqs = enquiries.filter(e => {
    const mf = enqStatus === 'all' ? true : e.status === enqStatus;
    const term = enqSearch.toLowerCase();
    return mf && (!term
      || e.user_name?.toLowerCase().includes(term)
      || e.user_phone?.includes(term)
      || e.category_name?.toLowerCase().includes(term)
      || e.material_type?.toLowerCase().includes(term)
      || e.brand_company?.toLowerCase().includes(term)
      || e.delivery_address?.toLowerCase().includes(term)
    );
  });

  /* ── shared style tokens ───────────────────────────────────────────────── */
  const th = { padding:'0.55rem 0.875rem', textAlign:'left', fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:muted, whiteSpace:'nowrap', background:bg, borderBottom:`1px solid ${border}` };
  const td = (extra={}) => ({ padding:'0.65rem 0.875rem', borderBottom:`1px solid ${border}`, ...extra });
  const inpStyle = { padding:'0.4rem 0.75rem', border:`1px solid ${border}`, borderRadius:6, background:inputBg, color:text, fontSize:'0.8125rem', outline:'none' };
  const tabBtn   = (id) => ({
    padding: '0.55rem 1.25rem',
    border: 'none',
    borderBottom: `2px solid ${tab === id ? accent : 'transparent'}`,
    background: 'none',
    color: tab === id ? accent : muted,
    fontWeight: 600,
    fontSize: '0.8125rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
    transition: 'color .15s',
  });

  /* ── render ─────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── Reject Modal ─────────────────────────────────────────────────── */}
      {showRejectModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:70, padding:'1rem' }}>
          <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:12, padding:'1.75rem', width:'100%', maxWidth:460 }}>
            <h3 style={{ margin:'0 0 0.5rem', fontSize:'1rem', fontWeight:700, color:text }}>Reject Supplier</h3>
            <p style={{ margin:'0 0 1rem', fontSize:'0.8125rem', color:muted }}>Rejecting <strong style={{ color:text }}>{rejectTarget?.shop_name}</strong>. Reason (optional):</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="e.g., Incomplete info, invalid documents…"
              style={{ width:'100%', padding:'0.7rem', border:`1px solid ${border}`, borderRadius:8, background:inputBg, color:text, fontFamily:'inherit', fontSize:'0.875rem', resize:'vertical', boxSizing:'border-box' }} />
            <div style={{ display:'flex', gap:'0.75rem', marginTop:'1rem' }}>
              <button onClick={handleReject} disabled={!!actionLoading}
                style={{ flex:1, padding:'0.65rem', background:'#dc2626', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity:actionLoading ? 0.6 : 1, fontFamily:'inherit' }}>
                {actionLoading ? 'Rejecting…' : 'Confirm Reject'}
              </button>
              <button onClick={() => setShowRejectModal(false)}
                style={{ flex:1, padding:'0.65rem', background:'transparent', color:muted, border:`1px solid ${border}`, borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Supplier Detail Modal ─────────────────────────────────────────── */}
      {selectedSupplier && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:65, padding:'1rem' }} onClick={() => setSelectedSupplier(null)}>
          <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:14, padding:'1.75rem', width:'100%', maxWidth:660, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
              <div>
                <h2 style={{ margin:0, fontSize:'1.15rem', fontWeight:700, color:text }}>{selectedSupplier.shop_name}</h2>
                <p style={{ margin:'0.25rem 0 0', fontSize:'0.8125rem', color:muted }}>{selectedSupplier.email}</p>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                <StatusBadge s={selectedSupplier} />
                <button onClick={() => setSelectedSupplier(null)} style={{ background:'none', border:'none', cursor:'pointer', color:muted, fontSize:'1.25rem', lineHeight:1 }}>✕</button>
              </div>
            </div>

            {/* Aadhaar */}
            <div style={{ background: selectedSupplier.aadhaar_number ? (isDarkMode?'#0a1f0a':'#f0fdf4') : (isDarkMode?'#2a1a0a':'#fff7ed'), border:`2px solid ${selectedSupplier.aadhaar_number ? '#16a34a' : '#f97316'}`, borderRadius:10, padding:'1rem 1.25rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'1rem' }}>
              <span style={{ fontSize:'2rem' }}>🪪</span>
              <div>
                <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:muted, marginBottom:'0.25rem' }}>Aadhaar — Verify before approving</div>
                <div style={{ fontSize:'1.35rem', fontWeight:800, letterSpacing:'0.18em', color: selectedSupplier.aadhaar_number ? text : '#f97316', fontFamily:'monospace' }}>
                  {selectedSupplier.aadhaar_number ? selectedSupplier.aadhaar_number.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : 'Not provided'}
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.25rem' }}>
              {[
                ['Phone',        selectedSupplier.phone],
                ['City',         selectedSupplier.city],
                ['State',        selectedSupplier.state],
                ['Postal Code',  selectedSupplier.postal_code],
                ['Country',      selectedSupplier.country],
                ['Registered',   fmtD(selectedSupplier.created_at)],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.2rem' }}>{label}</div>
                  <div style={{ fontSize:'0.875rem', fontWeight:600, color:text }}>{value || '—'}</div>
                </div>
              ))}
            </div>

            {/* Categories */}
            {selectedSupplier.product_categories?.length > 0 && (
              <div style={{ marginBottom:'1.25rem' }}>
                <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.5rem' }}>Products Sold</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                  {selectedSupplier.product_categories.map(cat => (
                    <span key={cat} style={{ background: isDarkMode?'#1a2a1a':'#f0fdf4', color:'#16a34a', border:'1px solid #16a34a44', padding:'0.25rem 0.75rem', borderRadius:20, fontSize:'0.78rem', fontWeight:700 }}>{cat}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Earnings */}
            <div style={{ background:bg, borderRadius:8, padding:'1rem', marginBottom:'1.25rem' }}>
              <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.75rem' }}>Earnings Summary</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem' }}>
                {[
                  ['Orders Fulfilled', selectedSupplier.total_fulfilled || 0, text],
                  ['Total Revenue',    fmt(selectedSupplier.total_earned),    '#16a34a'],
                  ['Commission (15%)', fmt(selectedSupplier.total_commission), '#f97316'],
                ].map(([l, v, c]) => (
                  <div key={l}><div style={{ fontSize:'0.65rem', color:muted }}>{l}</div><div style={{ fontSize:'1.05rem', fontWeight:800, color:c }}>{v}</div></div>
                ))}
              </div>
            </div>

            {/* Rejection reason */}
            {selectedSupplier.status === 'rejected' && selectedSupplier.rejection_reason && (
              <div style={{ marginBottom:'1.25rem', background:'#fef2f2', borderRadius:8, padding:'0.75rem', fontSize:'0.8125rem', color:'#b91c1c' }}>
                <strong>Rejection reason:</strong> {selectedSupplier.rejection_reason}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
              {selectedSupplier.status === 'pending' && (<>
                <button onClick={() => handleApprove(selectedSupplier.id)} disabled={!!actionLoading}
                  style={{ flex:1, minWidth:120, padding:'0.65rem', background:'#16a34a', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity:actionLoading ? 0.6 : 1, fontFamily:'inherit' }}>
                  ✓ Approve
                </button>
                <button onClick={() => { setSelectedSupplier(null); openRejectModal(selectedSupplier); }} disabled={!!actionLoading}
                  style={{ flex:1, minWidth:120, padding:'0.65rem', background:'#dc2626', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity:actionLoading ? 0.6 : 1, fontFamily:'inherit' }}>
                  ✕ Reject
                </button>
              </>)}
              {selectedSupplier.status === 'approved' && (
                selectedSupplier.is_active ? (
                  <button onClick={() => handleDeactivate(selectedSupplier.id)} disabled={!!actionLoading}
                    style={{ flex:1, padding:'0.65rem', background:'#f97316', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity:actionLoading ? 0.6 : 1, fontFamily:'inherit' }}>
                    ⏸ Deactivate
                  </button>
                ) : (
                  <button onClick={() => handleActivate(selectedSupplier.id)} disabled={!!actionLoading}
                    style={{ flex:1, padding:'0.65rem', background:'#16a34a', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity:actionLoading ? 0.6 : 1, fontFamily:'inherit' }}>
                    ▶ Reactivate
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Enquiry Detail Modal ──────────────────────────────────────────── */}
      {selectedEnq && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:65, padding:'1rem' }} onClick={() => setSelectedEnq(null)}>
          <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:14, padding:'1.75rem', width:'100%', maxWidth:640, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
              <div>
                <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:muted }}>Enquiry #{selectedEnq.id}</div>
                <h2 style={{ margin:'0.25rem 0 0', fontSize:'1.1rem', fontWeight:700, color:text }}>{selectedEnq.category_emoji} {selectedEnq.category_name}</h2>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                <EnqStatusBadge status={selectedEnq.status} />
                <button onClick={() => setSelectedEnq(null)} style={{ background:'none', border:'none', cursor:'pointer', color:muted, fontSize:'1.25rem', lineHeight:1 }}>✕</button>
              </div>
            </div>

            {/* Material details */}
            <div style={{ background:bg, borderRadius:8, padding:'1rem', marginBottom:'1rem' }}>
              <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.6rem' }}>Material Details</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                {[
                  ['Category',      selectedEnq.category_name],
                  ['Material Type', selectedEnq.material_type || '—'],
                  ['Sub-category',  selectedEnq.subcategory_name || '—'],
                  ['Brand/Company', selectedEnq.brand_company || '—'],
                  ['Quantity',      selectedEnq.quantity_text || '—'],
                  ['Delivery Date', fmtD(selectedEnq.delivery_date)],
                ].map(([l, v]) => (
                  <div key={l}><div style={{ fontSize:'0.65rem', color:muted, marginBottom:'0.2rem' }}>{l}</div><div style={{ fontSize:'0.875rem', fontWeight:600, color:text }}>{v}</div></div>
                ))}
              </div>
            </div>

            {/* Customer details */}
            <div style={{ background:bg, borderRadius:8, padding:'1rem', marginBottom:'1rem' }}>
              <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.6rem' }}>Customer Details</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                {[
                  ['Name',    selectedEnq.user_name],
                  ['Phone',   selectedEnq.user_phone],
                  ['Email',   selectedEnq.user_email || '—'],
                  ['Enquiry Placed', fmtDT(selectedEnq.created_at)],
                ].map(([l, v]) => (
                  <div key={l}><div style={{ fontSize:'0.65rem', color:muted, marginBottom:'0.2rem' }}>{l}</div><div style={{ fontSize:'0.875rem', fontWeight:600, color:text }}>{v}</div></div>
                ))}
              </div>
            </div>

            {/* Address + GPS */}
            {selectedEnq.delivery_address && (
              <div style={{ marginBottom:'0.75rem' }}>
                <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.35rem' }}>Delivery Address</div>
                <div style={{ fontSize:'0.875rem', color:text }}>{selectedEnq.delivery_address}</div>
              </div>
            )}
            {selectedEnq.latitude && selectedEnq.longitude && (
              <div style={{ marginBottom:'0.75rem' }}>
                <a href={`https://www.google.com/maps?q=${selectedEnq.latitude},${selectedEnq.longitude}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:'0.8125rem', color:'#3b82f6', fontWeight:700, textDecoration:'underline' }}>
                  🗺 Open GPS Location in Google Maps
                </a>
                <span style={{ fontSize:'0.72rem', color:muted, marginLeft:'0.5rem' }}>({parseFloat(selectedEnq.latitude).toFixed(5)}, {parseFloat(selectedEnq.longitude).toFixed(5)})</span>
              </div>
            )}

            {/* Notes */}
            {selectedEnq.message && (
              <div style={{ background:bg, borderRadius:8, padding:'0.875rem', marginBottom:'0.75rem' }}>
                <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.35rem' }}>Additional Requirements</div>
                <div style={{ fontSize:'0.875rem', color:text, lineHeight:1.6 }}>{selectedEnq.message}</div>
              </div>
            )}

            {/* Fulfilment info */}
            {selectedEnq.status === 'fulfilled' && (
              <div style={{ background: isDarkMode?'#0a2a14':'#f0fdf4', border:'1px solid #16a34a33', borderRadius:8, padding:'0.875rem', marginBottom:'0.75rem' }}>
                <div style={{ fontSize:'0.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'#16a34a', marginBottom:'0.35rem' }}>Fulfilment</div>
                <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                  <span style={{ fontSize:'0.875rem', color:text }}>Amount: <strong style={{ color:'#16a34a' }}>{fmt(selectedEnq.amount_received)}</strong></span>
                  <span style={{ fontSize:'0.875rem', color:text }}>Commission (15%): <strong style={{ color:'#f97316' }}>{fmt(selectedEnq.admin_commission)}</strong></span>
                </div>
                {selectedEnq.accepted_by_shop && <div style={{ fontSize:'0.8rem', color:muted, marginTop:'0.35rem' }}>Fulfilled by: {selectedEnq.accepted_by_shop}</div>}
                {selectedEnq.supplier_notes && <div style={{ fontSize:'0.8rem', color:muted, marginTop:'0.25rem' }}>Note: {selectedEnq.supplier_notes}</div>}
              </div>
            )}

            <button onClick={() => setSelectedEnq(null)}
              style={{ width:'100%', padding:'0.6rem', background:accent, color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', fontFamily:'inherit' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          PAGE SHELL
      ════════════════════════════════════════════════════════════════════ */}
      {/* Page Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <h2 style={{ margin:0, fontSize:'1.1rem', fontWeight:800, color:text }}>📦 Supplier Hub</h2>
          <p style={{ margin:'0.2rem 0 0', fontSize:'0.8125rem', color:muted }}>
            {pendingCount} pending · {activeCount} active · {suppliers.length} total suppliers · {enquiries.length} enquiries
          </p>
        </div>
        <button onClick={() => { fetchSuppliers(); fetchEnquiries(); }}
          style={{ padding:'0.4rem 0.875rem', background:'transparent', border:`1px solid ${border}`, borderRadius:6, color:muted, fontSize:'0.8125rem', cursor:'pointer' }}>
          ↺ Refresh All
        </button>
      </div>

      {/* Sub-tab bar */}
      <div style={{ display:'flex', borderBottom:`2px solid ${border}`, marginBottom:'1.5rem', overflowX:'auto', scrollbarWidth:'none' }}>
        {[
          { id:'overview',   label:'📊 Overview'   },
          { id:'enquiries',  label:'📋 Enquiries'  },
          { id:'suppliers',  label:'🏪 Suppliers'  },
          { id:'revenue',    label:'💰 Revenue'    },
        ].map(t => (
          <button key={t.id} style={tabBtn(t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <>
          {/* Stat cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(175px,1fr))', gap:'0.875rem', marginBottom:'1.5rem' }}>
            <StatCard label="Pending Approval"  value={pendingCount}                  sub="Awaiting review"           color="#f97316" bg={isDarkMode?'#2a1a0a':'#fff7ed'} border={isDarkMode?'#a3590033':'#fdba7433'} />
            <StatCard label="Active Suppliers"  value={activeCount}                   sub="Currently serving"         color="#16a34a" bg={isDarkMode?'#0a2a14':'#f0fdf4'} border={isDarkMode?'#16a34a33':'#bbf7d0'} />
            <StatCard label="Open Enquiries"    value={commission.open}               sub="Waiting for supplier"      color="#f59e0b" bg={isDarkMode?'#1a1a0a':'#fffbeb'} border={isDarkMode?'#92400e33':'#fde68a'} />
            <StatCard label="Orders Fulfilled"  value={commission.fulfilled}          sub="Completed deliveries"      color="#3b82f6" bg={isDarkMode?'#0a1a2a':'#eff6ff'} border={isDarkMode?'#1e40af33':'#bfdbfe'} />
            <StatCard label="Today's Commission" value={fmt(commission.today)}        sub="15% of today's fulfil."   color="#f59e0b" bg={isDarkMode?'#1a1a0a':'#fffbeb'} border={isDarkMode?'#92400e33':'#fde68a'} />
            <StatCard label="Total Commission"   value={fmt(commission.total)}        sub="All-time 15% earned"      color="#16a34a" bg={isDarkMode?'#0a2a14':'#f0fdf4'} border={isDarkMode?'#16a34a33':'#bbf7d0'} />
          </div>

          {/* Pending suppliers */}
          {pendingCount > 0 && (
            <div style={{ background:surface, border:`2px solid #f9731644`, borderRadius:10, marginBottom:'1.25rem', overflow:'hidden' }}>
              <div style={{ padding:'0.875rem 1.25rem', borderBottom:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:700, fontSize:'0.875rem', color:'#f97316' }}>⚠️ {pendingCount} Supplier{pendingCount > 1 ? 's' : ''} Awaiting Approval</span>
                <button onClick={() => setTab('suppliers')} style={{ background:'#f97316', border:'none', borderRadius:6, padding:'0.35rem 0.875rem', color:'#fff', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                  Review Now →
                </button>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8125rem' }}>
                  <thead>
                    <tr>
                      {['Shop Name', 'Phone', 'City', 'Registered', 'Action'].map(c => <th key={c} style={th}>{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.filter(s => s.status === 'pending').map(s => (
                      <tr key={s.id}>
                        <td style={td()}>
                          <div style={{ fontWeight:600, color:text }}>{s.shop_name}</div>
                          <div style={{ fontSize:'0.72rem', color:muted }}>{s.email}</div>
                        </td>
                        <td style={td({ color:muted })}>{s.phone}</td>
                        <td style={td({ color:muted })}>{s.city || '—'}</td>
                        <td style={td({ color:muted })}>{fmtD(s.created_at)}</td>
                        <td style={td()}>
                          <div style={{ display:'flex', gap:'0.4rem' }}>
                            <button onClick={() => setSelectedSupplier(s)}
                              style={{ padding:'0.28rem 0.6rem', border:`1px solid ${border}`, borderRadius:6, background:'transparent', color:muted, fontSize:'0.75rem', cursor:'pointer' }}>View</button>
                            <button onClick={() => handleApprove(s.id)} disabled={actionLoading === s.id}
                              style={{ padding:'0.28rem 0.6rem', background:'#16a34a', border:'none', borderRadius:6, color:'#fff', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', opacity:actionLoading===s.id?0.6:1 }}>✓ Approve</button>
                            <button onClick={() => openRejectModal(s)}
                              style={{ padding:'0.28rem 0.6rem', background:'#dc2626', border:'none', borderRadius:6, color:'#fff', fontSize:'0.75rem', fontWeight:700, cursor:'pointer' }}>✕</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent enquiries */}
          <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
            <div style={{ padding:'0.875rem 1.25rem', borderBottom:`1px solid ${border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:700, fontSize:'0.875rem', color:text }}>📋 Recent Enquiries</span>
              <button onClick={() => setTab('enquiries')} style={{ background:'transparent', border:`1px solid ${border}`, borderRadius:6, padding:'0.3rem 0.75rem', color:muted, fontSize:'0.78rem', cursor:'pointer' }}>View All →</button>
            </div>
            {loadingEnq ? <div style={{ padding:'1.5rem', textAlign:'center', color:muted, fontSize:'0.8125rem' }}>Loading…</div> : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8125rem' }}>
                  <thead><tr>{['Customer','Category','Type','Qty','Status','Date'].map(c=><th key={c} style={th}>{c}</th>)}</tr></thead>
                  <tbody>
                    {enquiries.slice(0, 8).map(e => (
                      <tr key={e.id} onClick={() => setSelectedEnq(e)} style={{ cursor:'pointer' }}>
                        <td style={td()}>
                          <div style={{ fontWeight:600, color:text }}>{e.user_name}</div>
                          <div style={{ fontSize:'0.72rem', color:muted }}>{e.user_phone}</div>
                        </td>
                        <td style={td({ color:text })}>{e.category_emoji} {e.category_name}</td>
                        <td style={td({ color:muted })}>{e.material_type || '—'}{e.brand_company ? ` · ${e.brand_company}` : ''}</td>
                        <td style={td({ color:muted })}>{e.quantity_text || '—'}</td>
                        <td style={td()}><EnqStatusBadge status={e.status} /></td>
                        <td style={td({ color:muted, whiteSpace:'nowrap' })}>{fmtD(e.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {enquiries.length === 0 && <div style={{ padding:'2rem', textAlign:'center', color:muted }}>No enquiries yet.</div>}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── ENQUIRIES ────────────────────────────────────────────────────── */}
      {tab === 'enquiries' && (
        <>
          {/* Filters */}
          <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem', flexWrap:'wrap', alignItems:'center' }}>
            <input value={enqSearch} onChange={e => setEnqSearch(e.target.value)} placeholder="Search customer, category, brand…"
              style={{ ...inpStyle, width:260 }} />
            <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
              {['all','open','accepted','fulfilled'].map(s => (
                <button key={s} onClick={() => setEnqStatus(s)}
                  style={{ padding:'0.35rem 0.875rem', border:`1px solid ${enqStatus===s ? accent : border}`, borderRadius:20, background: enqStatus===s ? accent : 'transparent', color: enqStatus===s ? '#fff' : muted, fontSize:'0.78rem', fontWeight:600, cursor:'pointer', textTransform:'capitalize', fontFamily:'inherit' }}>
                  {s==='all'?`All (${enquiries.length})`:s==='open'?`Open (${enquiries.filter(e=>e.status==='open').length})`:s==='accepted'?`Accepted (${enquiries.filter(e=>e.status==='accepted').length})`:`Fulfilled (${enquiries.filter(e=>e.status==='fulfilled').length})`}
                </button>
              ))}
            </div>
            {loadingEnq && <span style={{ fontSize:'0.78rem', color:muted }}>Loading…</span>}
          </div>

          {/* Table */}
          <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8125rem' }}>
                <thead>
                  <tr>{['#','Customer','Category','Type / Brand','Qty','Delivery Date','Address','Status','Supplier','Amount','Commission','Date',''].map(c=><th key={c} style={th}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredEnqs.map(e => (
                    <tr key={e.id} style={{ cursor:'pointer' }} onClick={() => setSelectedEnq(e)}>
                      <td style={td({ color:muted })}>{e.id}</td>
                      <td style={td()}>
                        <div style={{ fontWeight:600, color:text, whiteSpace:'nowrap' }}>{e.user_name}</div>
                        <div style={{ fontSize:'0.72rem', color:muted }}>{e.user_phone}</div>
                        {e.user_email && <div style={{ fontSize:'0.7rem', color:muted }}>{e.user_email}</div>}
                      </td>
                      <td style={td({ whiteSpace:'nowrap' })}>{e.category_emoji} {e.category_name}</td>
                      <td style={td({ color:muted })}>
                        {e.material_type && <div style={{ fontWeight:600, color:text }}>{e.material_type}{e.subcategory_name ? ` › ${e.subcategory_name}` : ''}</div>}
                        {e.brand_company && <div style={{ fontSize:'0.72rem' }}>{e.brand_company}</div>}
                        {!e.material_type && !e.brand_company && '—'}
                      </td>
                      <td style={td({ color:muted, whiteSpace:'nowrap' })}>{e.quantity_text || '—'}</td>
                      <td style={td({ whiteSpace:'nowrap', color: e.delivery_date ? '#f59e0b' : muted, fontWeight: e.delivery_date ? 700 : 400 })}>{fmtD(e.delivery_date)}</td>
                      <td style={td({ color:muted, maxWidth:160 })}>
                        {e.delivery_address ? <span title={e.delivery_address}>{e.delivery_address.slice(0,50)}{e.delivery_address.length>50?'…':''}</span> : '—'}
                        {e.latitude && e.longitude && (
                          <a href={`https://www.google.com/maps?q=${e.latitude},${e.longitude}`} target="_blank" rel="noopener noreferrer"
                            onClick={ev => ev.stopPropagation()}
                            style={{ display:'block', fontSize:'0.68rem', color:'#3b82f6', marginTop:'2px' }}>🗺 Map</a>
                        )}
                      </td>
                      <td style={td()}><EnqStatusBadge status={e.status} /></td>
                      <td style={td({ color:muted, whiteSpace:'nowrap' })}>{e.accepted_by_shop || '—'}</td>
                      <td style={td({ color:'#16a34a', fontWeight:700, whiteSpace:'nowrap' })}>{e.amount_received ? fmt(e.amount_received) : '—'}</td>
                      <td style={td({ color:'#f97316', fontWeight:700, whiteSpace:'nowrap' })}>{e.admin_commission ? fmt(e.admin_commission) : '—'}</td>
                      <td style={td({ color:muted, whiteSpace:'nowrap' })}>{fmtD(e.created_at)}</td>
                      <td style={td()}>
                        <button onClick={ev => { ev.stopPropagation(); setSelectedEnq(e); }}
                          style={{ padding:'0.25rem 0.6rem', border:`1px solid ${border}`, borderRadius:5, background:'transparent', color:muted, fontSize:'0.72rem', cursor:'pointer' }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEnqs.length === 0 && <div style={{ padding:'2.5rem', textAlign:'center', color:muted }}>No enquiries found.</div>}
            </div>
          </div>
        </>
      )}

      {/* ── SUPPLIERS ────────────────────────────────────────────────────── */}
      {tab === 'suppliers' && (
        <>
          {/* Filters */}
          <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
              {[
                { key:'all',      label:'All'      },
                { key:'pending',  label:'Pending'  },
                { key:'active',   label:'Active'   },
                { key:'inactive', label:'Inactive' },
                { key:'rejected', label:'Rejected' },
              ].map(f => (
                <button key={f.key} onClick={() => setSupFilter(f.key)}
                  style={{ padding:'0.35rem 0.875rem', border:`1px solid ${supFilter===f.key ? accent : border}`, borderRadius:20, background: supFilter===f.key ? accent : 'transparent', color: supFilter===f.key ? '#fff' : muted, fontSize:'0.78rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                  {f.label} ({suppliers.filter(s=>f.key==='all'?true:f.key==='active'?s.status==='approved'&&s.is_active:f.key==='inactive'?s.is_active===false:s.status===f.key).length})
                </button>
              ))}
            </div>
            <input value={supSearch} onChange={e => setSupSearch(e.target.value)} placeholder="Search…" style={{ ...inpStyle, width:200 }} />
          </div>

          <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
            {loadingSup ? <div style={{ padding:'2.5rem', textAlign:'center', color:muted }}>Loading suppliers…</div> : filteredSups.length === 0 ? (
              <div style={{ padding:'2.5rem', textAlign:'center', color:muted }}>No suppliers found.</div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8125rem' }}>
                  <thead>
                    <tr>{['Shop Name','Products','Phone','City','Status','Orders','Revenue','Commission','Joined','Actions'].map(c=><th key={c} style={th}>{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filteredSups.map(s => (
                      <tr key={s.id}>
                        <td style={td()}>
                          <div style={{ fontWeight:600, color:text, whiteSpace:'nowrap' }}>{s.shop_name}</div>
                          <div style={{ fontSize:'0.72rem', color:muted }}>{s.email}</div>
                        </td>
                        <td style={td({ maxWidth:180 })}>
                          {(s.product_categories||[]).length > 0 ? (
                            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.2rem' }}>
                              {(s.product_categories||[]).map(c => (
                                <span key={c} style={{ background: isDarkMode?'#1a2a1a':'#f0fdf4', color:'#16a34a', padding:'0.1rem 0.4rem', borderRadius:12, fontSize:'0.65rem', fontWeight:700, whiteSpace:'nowrap' }}>{c}</span>
                              ))}
                            </div>
                          ) : <span style={{ color:muted, fontSize:'0.75rem' }}>—</span>}
                        </td>
                        <td style={td({ color:muted })}>{s.phone}</td>
                        <td style={td({ color:muted })}>{s.city || '—'}</td>
                        <td style={td()}><StatusBadge s={s} /></td>
                        <td style={td({ color:muted, textAlign:'center' })}>{s.total_fulfilled || 0}</td>
                        <td style={td({ color:'#16a34a', fontWeight:700, whiteSpace:'nowrap' })}>{fmt(s.total_earned)}</td>
                        <td style={td({ color:'#f97316', fontWeight:700, whiteSpace:'nowrap' })}>{fmt(s.total_commission)}</td>
                        <td style={td({ color:muted, whiteSpace:'nowrap' })}>{fmtD(s.created_at)}</td>
                        <td style={td()}>
                          <div style={{ display:'flex', gap:'0.35rem', flexWrap:'nowrap' }}>
                            <button onClick={() => setSelectedSupplier(s)} style={{ padding:'0.28rem 0.6rem', border:`1px solid ${border}`, borderRadius:6, background:'transparent', color:muted, fontSize:'0.72rem', cursor:'pointer', whiteSpace:'nowrap' }}>View</button>
                            {s.status === 'pending' && <>
                              <button onClick={() => handleApprove(s.id)} disabled={actionLoading===s.id}
                                style={{ padding:'0.28rem 0.6rem', background:'#16a34a', border:'none', borderRadius:6, color:'#fff', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', opacity:actionLoading===s.id?0.6:1 }}>✓</button>
                              <button onClick={() => openRejectModal(s)}
                                style={{ padding:'0.28rem 0.6rem', background:'#dc2626', border:'none', borderRadius:6, color:'#fff', fontSize:'0.72rem', fontWeight:700, cursor:'pointer' }}>✕</button>
                            </>}
                            {s.status === 'approved' && s.is_active && (
                              <button onClick={() => handleDeactivate(s.id)} disabled={actionLoading===s.id}
                                style={{ padding:'0.28rem 0.6rem', background:'#f97316', border:'none', borderRadius:6, color:'#fff', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', opacity:actionLoading===s.id?0.6:1, whiteSpace:'nowrap' }}>⏸ Off</button>
                            )}
                            {s.status === 'approved' && !s.is_active && (
                              <button onClick={() => handleActivate(s.id)} disabled={actionLoading===s.id}
                                style={{ padding:'0.28rem 0.6rem', background:'#16a34a', border:'none', borderRadius:6, color:'#fff', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', opacity:actionLoading===s.id?0.6:1, whiteSpace:'nowrap' }}>▶ On</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── REVENUE ──────────────────────────────────────────────────────── */}
      {tab === 'revenue' && (
        <>
          {/* Top commission summary */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(175px,1fr))', gap:'0.875rem', marginBottom:'1.5rem' }}>
            <StatCard label="Total Commission Earned" value={fmt(commission.total)}     sub="15% of all fulfilled orders"   color="#16a34a" bg={isDarkMode?'#0a2a14':'#f0fdf4'} border={isDarkMode?'#16a34a33':'#bbf7d0'} />
            <StatCard label="Today's Commission"      value={fmt(commission.today)}     sub="Fulfilled orders today"         color="#f59e0b" bg={isDarkMode?'#1a1a0a':'#fffbeb'} border={isDarkMode?'#92400e33':'#fde68a'} />
            <StatCard label="Orders Fulfilled"        value={commission.fulfilled}      sub="All-time completed"             color="#3b82f6" bg={isDarkMode?'#0a1a2a':'#eff6ff'} border={isDarkMode?'#1e40af33':'#bfdbfe'} />
            <StatCard label="Open Enquiries"          value={commission.open}           sub="Pending supplier response"      color="#f97316" bg={isDarkMode?'#2a1a0a':'#fff7ed'} border={isDarkMode?'#a3590033':'#fdba7433'} />
          </div>

          {/* Per-supplier revenue table */}
          <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:10, overflow:'hidden', marginBottom:'1.5rem' }}>
            <div style={{ padding:'0.875rem 1.25rem', borderBottom:`1px solid ${border}` }}>
              <span style={{ fontWeight:700, fontSize:'0.875rem', color:text }}>Per-Supplier Revenue Breakdown</span>
            </div>
            {loadingSup ? <div style={{ padding:'1.5rem', textAlign:'center', color:muted }}>Loading…</div> : (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8125rem' }}>
                  <thead>
                    <tr>{['Supplier','City','Status','Orders Fulfilled','Total Revenue','Commission (15%)','Net to Supplier','Joined'].map(c=><th key={c} style={th}>{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[...suppliers]
                      .sort((a,b) => parseFloat(b.total_earned||0) - parseFloat(a.total_earned||0))
                      .map(s => {
                        const revenue    = parseFloat(s.total_earned    || 0);
                        const commission = parseFloat(s.total_commission || 0);
                        const net        = revenue - commission;
                        return (
                          <tr key={s.id}>
                            <td style={td()}>
                              <div style={{ fontWeight:600, color:text }}>{s.shop_name}</div>
                              <div style={{ fontSize:'0.72rem', color:muted }}>{s.email}</div>
                            </td>
                            <td style={td({ color:muted })}>{s.city || '—'}</td>
                            <td style={td()}><StatusBadge s={s} /></td>
                            <td style={td({ textAlign:'center', color:text, fontWeight:700 })}>{s.total_fulfilled || 0}</td>
                            <td style={td({ color:'#16a34a', fontWeight:700, whiteSpace:'nowrap' })}>{fmt(revenue)}</td>
                            <td style={td({ color:'#f97316', fontWeight:700, whiteSpace:'nowrap' })}>{fmt(commission)}</td>
                            <td style={td({ color:'#3b82f6', fontWeight:700, whiteSpace:'nowrap' })}>{fmt(net)}</td>
                            <td style={td({ color:muted, whiteSpace:'nowrap' })}>{fmtD(s.created_at)}</td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
                {suppliers.length === 0 && <div style={{ padding:'2.5rem', textAlign:'center', color:muted }}>No supplier data yet.</div>}
              </div>
            )}
          </div>

          {/* Fulfilled enquiries with amounts */}
          <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:10, overflow:'hidden' }}>
            <div style={{ padding:'0.875rem 1.25rem', borderBottom:`1px solid ${border}` }}>
              <span style={{ fontWeight:700, fontSize:'0.875rem', color:text }}>Fulfilled Orders — Commission Ledger</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8125rem' }}>
                <thead>
                  <tr>{['#','Customer','Category','Type','Qty','Fulfilled By','Amount','Commission','Fulfilled On'].map(c=><th key={c} style={th}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {enquiries
                    .filter(e => e.status === 'fulfilled')
                    .sort((a,b) => new Date(b.fulfilled_at||b.updated_at) - new Date(a.fulfilled_at||a.updated_at))
                    .map(e => (
                      <tr key={e.id} onClick={() => setSelectedEnq(e)} style={{ cursor:'pointer' }}>
                        <td style={td({ color:muted })}>{e.id}</td>
                        <td style={td()}>
                          <div style={{ fontWeight:600, color:text }}>{e.user_name}</div>
                          <div style={{ fontSize:'0.72rem', color:muted }}>{e.user_phone}</div>
                        </td>
                        <td style={td({ whiteSpace:'nowrap' })}>{e.category_emoji} {e.category_name}</td>
                        <td style={td({ color:muted })}>{e.material_type || '—'}</td>
                        <td style={td({ color:muted })}>{e.quantity_text || '—'}</td>
                        <td style={td({ color:text, fontWeight:600 })}>{e.accepted_by_shop || '—'}</td>
                        <td style={td({ color:'#16a34a', fontWeight:700, whiteSpace:'nowrap' })}>{fmt(e.amount_received)}</td>
                        <td style={td({ color:'#f97316', fontWeight:700, whiteSpace:'nowrap' })}>{fmt(e.admin_commission)}</td>
                        <td style={td({ color:muted, whiteSpace:'nowrap' })}>{fmtDT(e.fulfilled_at || e.updated_at)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              {enquiries.filter(e => e.status === 'fulfilled').length === 0 && (
                <div style={{ padding:'2.5rem', textAlign:'center', color:muted }}>No fulfilled orders yet.</div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
