'use client';

import { useState, useEffect } from 'react';

export default function SupplierManagementAdmin({ isDarkMode }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // holds supplier_id being acted on
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/suppliers', { headers: { 'Authorization': `Bearer ${token}` }, cache: 'no-store' });
      const data = await res.json();
      if (data.success) setSuppliers(data.data || []);
      else setError(data.error || 'Failed to load suppliers');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const doAction = async (supplier_id, action, extra = {}) => {
    setActionLoading(supplier_id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/suppliers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ supplier_id, action, ...extra }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuppliers(prev => prev.map(s => s.id === supplier_id ? { ...s, ...data.data } : s));
        if (selectedSupplier?.id === supplier_id) setSelectedSupplier(prev => ({ ...prev, ...data.data }));
      } else { alert(`Error: ${data.error}`); }
    } catch (err) { alert(`Error: ${err.message}`); }
    finally { setActionLoading(null); }
  };

  const handleApprove = (id) => doAction(id, 'approve');
  const handleActivate = (id) => doAction(id, 'activate');
  const handleDeactivate = (id) => doAction(id, 'deactivate');
  const openRejectModal = (s) => { setRejectTarget(s); setRejectReason(''); setShowRejectModal(true); };
  const handleReject = async () => {
    if (!rejectTarget) return;
    await doAction(rejectTarget.id, 'reject', { rejection_reason: rejectReason });
    setShowRejectModal(false);
    if (selectedSupplier?.id === rejectTarget.id) setSelectedSupplier(null);
  };

  const filtered = suppliers.filter(s => {
    const matchFilter = filter === 'all' ? true : filter === 'active' ? s.status === 'approved' && s.is_active : filter === 'inactive' ? s.is_active === false : s.status === filter;
    const term = searchTerm.toLowerCase();
    return matchFilter && (!term || s.shop_name?.toLowerCase().includes(term) || s.email?.toLowerCase().includes(term) || s.business_name?.toLowerCase().includes(term) || s.phone?.includes(term));
  });

  const surface = isDarkMode ? '#18181c' : '#fff';
  const bg = isDarkMode ? '#0f0f11' : '#f5f5f7';
  const border = isDarkMode ? '#2a2a30' : '#e2e2e7';
  const text = isDarkMode ? '#f0f0f5' : '#111113';
  const muted = isDarkMode ? '#7c7c8a' : '#6b6b76';
  const inputBg = isDarkMode ? '#0f0f11' : '#f5f5f7';

  const StatusBadge = ({ s }) => {
    if (s.status === 'pending') return <span style={{ background:'#fff7ed', color:'#c2410c', padding:'0.2rem 0.6rem', borderRadius:20, fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase' }}>Pending</span>;
    if (s.status === 'rejected') return <span style={{ background:'#fef2f2', color:'#b91c1c', padding:'0.2rem 0.6rem', borderRadius:20, fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase' }}>Rejected</span>;
    if (s.status === 'approved' && s.is_active) return <span style={{ background:'#f0fdf4', color:'#15803d', padding:'0.2rem 0.6rem', borderRadius:20, fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase' }}>Active</span>;
    if (s.status === 'approved' && !s.is_active) return <span style={{ background:'#fef2f2', color:'#b91c1c', padding:'0.2rem 0.6rem', borderRadius:20, fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase' }}>Inactive</span>;
    return null;
  };

  const fmt = (n) => `₹${parseFloat(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) return <div style={{ padding:'2rem', color:muted, textAlign:'center' }}>Loading suppliers…</div>;
  if (error) return <div style={{ padding:'2rem', color:'#dc2626', textAlign:'center' }}>Error: {error}</div>;

  return (
    <>
      {/* Reject Modal */}
      {showRejectModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60, padding:'1rem' }}>
          <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:12, padding:'1.5rem', width:'100%', maxWidth:460 }}>
            <h3 style={{ margin:'0 0 0.5rem', fontSize:'1rem', fontWeight:700, color:text }}>Reject Supplier</h3>
            <p style={{ margin:'0 0 1rem', fontSize:'0.8125rem', color:muted }}>Rejecting <strong>{rejectTarget?.shop_name}</strong>. Reason (optional):</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g., Incomplete info, invalid documents…" rows={3}
              style={{ width:'100%', padding:'0.7rem', border:`1px solid ${border}`, borderRadius:8, background:inputBg, color:text, fontFamily:'inherit', fontSize:'0.875rem', resize:'vertical', boxSizing:'border-box' }} />
            <div style={{ display:'flex', gap:'0.75rem', marginTop:'1rem' }}>
              <button onClick={handleReject} disabled={!!actionLoading}
                style={{ flex:1, padding:'0.6rem', background:'#dc2626', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity:actionLoading ? 0.6 : 1 }}>
                {actionLoading ? 'Rejecting…' : 'Confirm Reject'}
              </button>
              <button onClick={() => setShowRejectModal(false)}
                style={{ flex:1, padding:'0.6rem', background:'transparent', color:muted, border:`1px solid ${border}`, borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSupplier && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:55, padding:'1rem' }} onClick={() => setSelectedSupplier(null)}>
          <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:12, padding:'1.75rem', width:'100%', maxWidth:640, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.25rem' }}>
              <div>
                <h2 style={{ margin:0, fontSize:'1.125rem', fontWeight:700, color:text }}>{selectedSupplier.shop_name}</h2>
                <p style={{ margin:'0.25rem 0 0', fontSize:'0.8125rem', color:muted }}>{selectedSupplier.email}</p>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                <StatusBadge s={selectedSupplier} />
                <button onClick={() => setSelectedSupplier(null)} style={{ background:'none', border:'none', cursor:'pointer', color:muted, fontSize:'1.25rem' }}>✕</button>
              </div>
            </div>

            {/* Aadhaar — highlight for admin review */}
            <div style={{
              background: selectedSupplier.aadhaar_number ? (isDarkMode ? '#0a1f0a' : '#f0fdf4') : (isDarkMode ? '#2a1a0a' : '#fff7ed'),
              border: `2px solid ${selectedSupplier.aadhaar_number ? '#16a34a' : '#f97316'}`,
              borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}>
              <span style={{ fontSize: '2rem' }}>🪪</span>
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: muted, marginBottom: '0.25rem' }}>
                  Aadhaar Number — Verify before approving
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '0.18em', color: selectedSupplier.aadhaar_number ? text : '#f97316', fontFamily: 'monospace' }}>
                  {selectedSupplier.aadhaar_number
                    ? selectedSupplier.aadhaar_number.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
                    : 'Not provided'}
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.25rem' }}>
              {[
                ['Business Name', selectedSupplier.business_name],
                ['Phone', selectedSupplier.phone],
                ['City', selectedSupplier.city],
                ['State', selectedSupplier.state],
                ['Country', selectedSupplier.country],
                ['Postal Code', selectedSupplier.postal_code],
                ['Business Type', selectedSupplier.business_type],
                ['Registered', selectedSupplier.created_at ? new Date(selectedSupplier.created_at).toLocaleDateString() : '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize:'0.6875rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.2rem' }}>{label}</div>
                  <div style={{ fontSize:'0.875rem', fontWeight:600, color:text }}>{value || '—'}</div>
                </div>
              ))}
            </div>

            {/* Product Categories */}
            {selectedSupplier.product_categories?.length > 0 && (
              <div style={{ marginBottom:'1.25rem' }}>
                <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.6rem' }}>Products Sold</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                  {selectedSupplier.product_categories.map(cat => (
                    <span key={cat} style={{ background: isDarkMode?'#1a2a1a':'#f0fdf4', color:'#16a34a', border:'1px solid #16a34a44', padding:'0.25rem 0.7rem', borderRadius:20, fontSize:'0.75rem', fontWeight:700 }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Earnings Summary */}
            <div style={{ background:bg, borderRadius:8, padding:'1rem', marginBottom:'1.25rem' }}>
              <div style={{ fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.75rem' }}>Earnings Summary</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem' }}>
                {[
                  ['Orders Fulfilled', selectedSupplier.total_fulfilled || 0],
                  ['Total Revenue', fmt(selectedSupplier.total_earned)],
                  ['Commission Earned (15%)', fmt(selectedSupplier.total_commission)],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize:'0.65rem', color:muted }}>{l}</div>
                    <div style={{ fontSize:'1rem', fontWeight:800, color:text }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedSupplier.description && (
              <div style={{ marginBottom:'1.25rem' }}>
                <div style={{ fontSize:'0.6875rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:muted, marginBottom:'0.35rem' }}>Description</div>
                <div style={{ background:bg, borderRadius:8, padding:'0.75rem', fontSize:'0.8125rem', color:muted, lineHeight:1.6 }}>{selectedSupplier.description}</div>
              </div>
            )}

            {selectedSupplier.status === 'rejected' && selectedSupplier.rejection_reason && (
              <div style={{ marginBottom:'1.25rem', background:'#fef2f2', borderRadius:8, padding:'0.75rem', fontSize:'0.8125rem', color:'#b91c1c' }}>
                <strong>Rejection reason:</strong> {selectedSupplier.rejection_reason}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
              {selectedSupplier.status === 'pending' && (
                <>
                  <button onClick={() => handleApprove(selectedSupplier.id)} disabled={!!actionLoading}
                    style={{ flex:1, minWidth:120, padding:'0.65rem', background:'#16a34a', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity:actionLoading ? 0.6 : 1 }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => { setSelectedSupplier(null); openRejectModal(selectedSupplier); }} disabled={!!actionLoading}
                    style={{ flex:1, minWidth:120, padding:'0.65rem', background:'#dc2626', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity:actionLoading ? 0.6 : 1 }}>
                    ✕ Reject
                  </button>
                </>
              )}
              {selectedSupplier.status === 'approved' && (
                selectedSupplier.is_active ? (
                  <button onClick={() => handleDeactivate(selectedSupplier.id)} disabled={!!actionLoading}
                    style={{ flex:1, padding:'0.65rem', background:'#f97316', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity:actionLoading ? 0.6 : 1 }}>
                    ⏸ Deactivate (no notifications)
                  </button>
                ) : (
                  <button onClick={() => handleActivate(selectedSupplier.id)} disabled={!!actionLoading}
                    style={{ flex:1, padding:'0.65rem', background:'#16a34a', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'0.875rem', cursor:'pointer', opacity:actionLoading ? 0.6 : 1 }}>
                    ▶ Reactivate Supplier
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', gap:'0.75rem' }}>
        <div>
          <h2 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:text }}>Supplier Management</h2>
          <p style={{ margin:'0.2rem 0 0', fontSize:'0.8125rem', color:muted }}>
            {suppliers.filter(s => s.status === 'pending').length} pending · {suppliers.filter(s => s.status === 'approved' && s.is_active).length} active · {suppliers.length} total
          </p>
        </div>
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          <input type="text" placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ padding:'0.4rem 0.75rem', border:`1px solid ${border}`, borderRadius:6, background:inputBg, color:text, fontSize:'0.8125rem', outline:'none', width:180 }} />
          <button onClick={fetchSuppliers} style={{ padding:'0.4rem 0.875rem', background:'transparent', border:`1px solid ${border}`, borderRadius:6, color:muted, fontSize:'0.8125rem', cursor:'pointer' }}>↺ Refresh</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
        {[
          { key:'all', label:'All' },
          { key:'pending', label:'Pending' },
          { key:'active', label:'Active' },
          { key:'inactive', label:'Inactive' },
          { key:'rejected', label:'Rejected' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ padding:'0.35rem 0.875rem', border:`1px solid ${filter === f.key ? '#2563eb' : border}`, borderRadius:20, background: filter === f.key ? '#2563eb' : 'transparent', color: filter === f.key ? '#fff' : muted, fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>
            {f.label} ({suppliers.filter(s =>
              f.key === 'all' ? true :
              f.key === 'active' ? s.status === 'approved' && s.is_active :
              f.key === 'inactive' ? s.is_active === false :
              s.status === f.key
            ).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:surface, border:`1px solid ${border}`, borderRadius:8, overflow:'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding:'2.5rem', textAlign:'center', color:muted, fontSize:'0.875rem' }}>No suppliers found.</div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8125rem' }}>
              <thead>
                <tr style={{ background:bg, borderBottom:`1px solid ${border}` }}>
                  {['Shop Name', 'Products', 'Phone', 'City', 'Status', 'Orders', 'Revenue', 'Commission', 'Registered', 'Actions'].map(col => (
                    <th key={col} style={{ padding:'0.6rem 0.875rem', textAlign:'left', fontSize:'0.6875rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:muted, whiteSpace:'nowrap' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} style={{ borderBottom:`1px solid ${border}` }}>
                    <td style={{ padding:'0.7rem 0.875rem', fontWeight:600, color:text, whiteSpace:'nowrap' }}>
                      <div>{s.shop_name}</div>
                      <div style={{ fontSize:'0.72rem', color:muted }}>{s.email}</div>
                    </td>
                    <td style={{ padding:'0.7rem 0.875rem', maxWidth:180 }}>
                      {(s.product_categories || []).length > 0 ? (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.25rem' }}>
                          {(s.product_categories || []).map(cat => (
                            <span key={cat} style={{ background: isDarkMode?'#1a2a1a':'#f0fdf4', color:'#16a34a', padding:'0.1rem 0.45rem', borderRadius:12, fontSize:'0.65rem', fontWeight:700, whiteSpace:'nowrap' }}>
                              {cat}
                            </span>
                          ))}
                        </div>
                      ) : <span style={{ color:muted, fontSize:'0.75rem' }}>—</span>}
                    </td>
                    <td style={{ padding:'0.7rem 0.875rem', color:muted }}>{s.phone}</td>
                    <td style={{ padding:'0.7rem 0.875rem', color:muted }}>{s.city || '—'}</td>
                    <td style={{ padding:'0.7rem 0.875rem' }}><StatusBadge s={s} /></td>
                    <td style={{ padding:'0.7rem 0.875rem', color:muted, textAlign:'center' }}>{s.total_fulfilled || 0}</td>
                    <td style={{ padding:'0.7rem 0.875rem', color:'#16a34a', fontWeight:700, whiteSpace:'nowrap' }}>{fmt(s.total_earned)}</td>
                    <td style={{ padding:'0.7rem 0.875rem', color:'#f97316', fontWeight:700, whiteSpace:'nowrap' }}>{fmt(s.total_commission)}</td>
                    <td style={{ padding:'0.7rem 0.875rem', color:muted, whiteSpace:'nowrap' }}>{s.created_at ? new Date(s.created_at).toLocaleDateString() : '—'}</td>
                    <td style={{ padding:'0.7rem 0.875rem' }}>
                      <div style={{ display:'flex', gap:'0.4rem', flexWrap:'nowrap' }}>
                        <button onClick={() => setSelectedSupplier(s)}
                          style={{ padding:'0.3rem 0.65rem', background:'transparent', border:`1px solid ${border}`, borderRadius:6, color:muted, fontSize:'0.75rem', cursor:'pointer', whiteSpace:'nowrap' }}>
                          View
                        </button>
                        {s.status === 'pending' && (
                          <button onClick={() => handleApprove(s.id)} disabled={actionLoading === s.id}
                            style={{ padding:'0.3rem 0.65rem', background:'#16a34a', border:'none', borderRadius:6, color:'#fff', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', opacity: actionLoading === s.id ? 0.6 : 1 }}>
                            ✓ Approve
                          </button>
                        )}
                        {s.status === 'approved' && s.is_active && (
                          <button onClick={() => handleDeactivate(s.id)} disabled={actionLoading === s.id}
                            style={{ padding:'0.3rem 0.65rem', background:'#f97316', border:'none', borderRadius:6, color:'#fff', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', opacity: actionLoading === s.id ? 0.6 : 1 }}>
                            ⏸ Deactivate
                          </button>
                        )}
                        {s.status === 'approved' && !s.is_active && (
                          <button onClick={() => handleActivate(s.id)} disabled={actionLoading === s.id}
                            style={{ padding:'0.3rem 0.65rem', background:'#16a34a', border:'none', borderRadius:6, color:'#fff', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', opacity: actionLoading === s.id ? 0.6 : 1 }}>
                            ▶ Activate
                          </button>
                        )}
                        {s.status === 'pending' && (
                          <button onClick={() => openRejectModal(s)}
                            style={{ padding:'0.3rem 0.65rem', background:'#dc2626', border:'none', borderRadius:6, color:'#fff', fontSize:'0.75rem', fontWeight:700, cursor:'pointer' }}>
                            ✕
                          </button>
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
  );
}
