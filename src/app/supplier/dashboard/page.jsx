'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SupplierDashboard() {
  const router = useRouter();
  const [supplier, setSupplier] = useState(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  // ── Product categories fetched from DB ────────────────────────────────────
  const [productCategories, setProductCategories] = useState([]);
  const [editingCategories, setEditingCategories] = useState(false);
  const [selectedCats, setSelectedCats] = useState([]);
  const [savingCats, setSavingCats] = useState(false);
  const [catsMsg, setCatsMsg] = useState({ type: '', text: '' });

  // Orders
  const [openEnquiries, setOpenEnquiries] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [takenEnquiries, setTakenEnquiries] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [fulfillModal, setFulfillModal] = useState(null);
  const [fulfillAmount, setFulfillAmount] = useState('');
  const [fulfillNotes, setFulfillNotes] = useState('');
  const [fulfilling, setFulfilling] = useState(false);

  // Earnings
  const [earnings, setEarnings] = useState(null);
  const [loadingEarnings, setLoadingEarnings] = useState(false);

  // Packages
  const [pkgList, setPkgList] = useState([]);
  const [pkgStatus, setPkgStatus] = useState(null);
  const [pkgLoading, setPkgLoading] = useState(false);
  const [pkgMsg, setPkgMsg] = useState('');

  // Expanded detail view for an order card
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    // Fetch shop categories from same DB table ShopNow uses
    fetch('/api/shop-categories')
      .then(r => r.json())
      .then(d => { if (d.success) setProductCategories(d.data); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const supplierData = localStorage.getItem('supplier');
    const tok = localStorage.getItem('supplier-token');
    if (!tok || !supplierData) { router.push('/supplier/login'); return; }
    try {
      const parsed = JSON.parse(supplierData);
      setSupplier(parsed);
      setSelectedCats(parsed.product_categories || []);
      setLoading(false);
      fetchOrders(tok);
      fetchEarnings(tok);
    } catch { router.push('/supplier/login'); }
  }, [router]);

  const token = () => localStorage.getItem('supplier-token');

  // ── Product Categories ────────────────────────────────────────────────────
  const saveCategories = async () => {
    if (selectedCats.length === 0) { setCatsMsg({ type: 'error', text: 'Select at least one category.' }); return; }
    setSavingCats(true); setCatsMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/supplier/profile/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
        body: JSON.stringify({ product_categories: selectedCats }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const stored = JSON.parse(localStorage.getItem('supplier') || '{}');
        const updated = { ...stored, product_categories: selectedCats };
        localStorage.setItem('supplier', JSON.stringify(updated));
        setSupplier(updated);
        setEditingCategories(false);
        setCatsMsg({ type: 'success', text: 'Categories updated! You will now receive matching enquiries.' });
        fetchOrders();
      } else {
        setCatsMsg({ type: 'error', text: data.error || 'Failed to save.' });
      }
    } catch { setCatsMsg({ type: 'error', text: 'An error occurred.' }); }
    finally { setSavingCats(false); }
  };

  // ── Orders ────────────────────────────────────────────────────────────────
  const fetchOrders = async (t) => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/supplier/enquiries', { headers: { 'Authorization': `Bearer ${t || token()}` } });
      const data = await res.json();
      if (data.success) {
        setOpenEnquiries(data.data.open || []);
        setMyOrders(data.data.mine || []);
        setTakenEnquiries(data.data.taken || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoadingOrders(false); }
  };

  const acceptEnquiry = async (id) => {
    setAcceptingId(id);
    try {
      const res = await fetch(`/api/supplier/enquiries/${id}/accept`, { method: 'POST', headers: { 'Authorization': `Bearer ${token()}` } });
      const data = await res.json();
      if (res.ok && data.success) { await fetchOrders(); }
      else if (data.already_taken) { alert('This enquiry was just accepted by another supplier.'); await fetchOrders(); }
      else { alert(data.error || 'Error accepting enquiry'); }
    } catch { alert('Error accepting enquiry'); }
    finally { setAcceptingId(null); }
  };

  const submitFulfill = async () => {
    if (!fulfillAmount || isNaN(parseFloat(fulfillAmount))) { alert('Please enter the amount received.'); return; }
    setFulfilling(true);
    try {
      const res = await fetch(`/api/supplier/enquiries/${fulfillModal.id}/fulfill`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
        body: JSON.stringify({ amount_received: parseFloat(fulfillAmount), supplier_notes: fulfillNotes }),
      });
      const data = await res.json();
      if (res.ok && data.success) { setFulfillModal(null); await fetchOrders(); await fetchEarnings(); }
      else { alert(data.error || 'Error updating order'); }
    } catch { alert('Error updating order'); }
    finally { setFulfilling(false); }
  };

  // ── Earnings ──────────────────────────────────────────────────────────────
  const fetchEarnings = async (t) => {
    setLoadingEarnings(true);
    try {
      const res = await fetch('/api/supplier/earnings', { headers: { 'Authorization': `Bearer ${t || token()}` } });
      const data = await res.json();
      if (data.success) setEarnings(data.data);
    } catch (err) { console.error(err); }
    finally { setLoadingEarnings(false); }
  };

  // ── Packages ─────────────────────────────────────────────────────────────
  const loadPackages = async () => {
    const tok = token();
    try {
      const [listRes, statusRes] = await Promise.all([
        fetch('/api/supplier/packages', { headers: { Authorization: `Bearer ${tok}` } }),
        fetch('/api/supplier/packages?action=status', { headers: { Authorization: `Bearer ${tok}` } }),
      ]);
      const listData = await listRes.json();
      const statusData = await statusRes.json();
      if (listData.success) setPkgList(listData.packages || []);
      if (statusData.success) setPkgStatus(statusData.package || null);
    } catch { /* ignore */ }
  };

  const selectPackage = async (pkgId) => {
    setPkgLoading(true);
    setPkgMsg('');
    const tok = token();
    try {
      const res = await fetch('/api/supplier/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
        body: JSON.stringify({ package_id: pkgId }),
      });
      const data = await res.json();
      if (data.success) {
        setPkgMsg(data.message || 'Package selected!');
        await loadPackages();
      } else {
        setPkgMsg(data.error || 'Failed to select package');
      }
    } catch { setPkgMsg('Network error'); } finally { setPkgLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('supplier-token');
    localStorage.removeItem('supplier');
    router.push('/supplier/login');
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: dark ? '#000' : '#f5f5f7', color: dark ? '#fff' : '#111', fontFamily: 'DM Sans, sans-serif' }}>
      Loading…
    </div>
  );

  const bg      = dark ? '#0a0a0a' : '#f0ede8';
  const surface = dark ? '#111'    : '#fff';
  const border  = dark ? '#222'    : '#e5e0d8';
  const text    = dark ? '#fff'    : '#111';
  const muted   = dark ? '#555'    : '#999';
  const inputBg = dark ? '#1a1a1a' : '#f5f5f5';

  const fmt = (n) => `₹${parseFloat(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const statusLabel = (s) => ({ open: 'Open', accepted: 'Accepted', fulfilled: 'Fulfilled', cancelled: 'Cancelled' }[s] || s);
  const noCats = (supplier?.product_categories || []).length === 0;

  // Format date nicely
  const fmtDate = (d) => {
    if (!d) return null;
    try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return d; }
  };

  // ── Full detail card for an enquiry ───────────────────────────────────────
  const EnquiryCard = ({ e, mode }) => {
    const isExpanded = expandedId === e.id;
    const isOpen     = mode === 'open';
    const isMine     = mode === 'mine';
    const isTaken    = mode === 'taken';

    const badgeStyle = isOpen
      ? { background: 'var(--brand-blue-soft)', color: '#92400e' }
      : isTaken
        ? { background: '#fee2e2', color: '#991b1b' }
        : e.status === 'fulfilled'
          ? { background: '#dcfce7', color: '#15803d' }
          : { background: '#dbeafe', color: '#1e40af' };

    const mapsUrl = e.latitude && e.longitude
      ? `https://www.google.com/maps?q=${e.latitude},${e.longitude}`
      : null;

    return (
      <div className="sd-order-card" style={{ opacity: isTaken ? 0.65 : 1 }}>
        {/* Card header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div className="sd-order-cat">
            {e.category_emoji} {e.category_name}
          </div>
          <span className="sd-badge" style={badgeStyle}>
            {isTaken ? 'Taken' : statusLabel(e.status)}
          </span>
        </div>

        {/* Material type + brand */}
        {(e.material_type || e.subcategory_name || e.brand_company) && (
          <div style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${border}` }}>
            {e.material_type && (
              <div className="sd-order-meta">
                <span style={{ color: 'var(--brand-blue-dark)', fontWeight: 700 }}>📋 Type:</span> {e.material_type}
                {e.subcategory_name ? ` › ${e.subcategory_name}` : ''}
              </div>
            )}
            {e.brand_company && (
              <div className="sd-order-meta">
                <span style={{ color: text, fontWeight: 700 }}>🏭 Brand:</span> {e.brand_company}
              </div>
            )}
          </div>
        )}

        {/* Quantity + delivery date */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
          {e.quantity_text && (
            <div className="sd-order-meta">📦 <strong>{e.quantity_text}</strong></div>
          )}
          {e.delivery_date && (
            <div className="sd-order-meta">📅 Needed by: <strong style={{ color: 'var(--brand-blue-dark)' }}>{fmtDate(e.delivery_date)}</strong></div>
          )}
        </div>

        {/* Customer (basic row always visible) */}
        <div className="sd-order-meta">👤 {e.user_name} · 📞 {e.user_phone}</div>

        {/* Address (truncated unless expanded) */}
        {e.delivery_address && !isExpanded && (
          <div className="sd-order-meta">📍 {e.delivery_address.slice(0, 70)}{e.delivery_address.length > 70 ? '…' : ''}</div>
        )}

        {/* Expanded details */}
        {isExpanded && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${border}`, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {e.user_email && <div className="sd-order-meta">✉️ {e.user_email}</div>}
            {e.delivery_address && <div className="sd-order-meta">📍 {e.delivery_address}</div>}
            {mapsUrl && (
              <div>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 700, textDecoration: 'underline' }}>
                  🗺 Open Location in Google Maps
                </a>
                <span style={{ fontSize: '0.68rem', color: muted, marginLeft: '0.5rem' }}>
                  ({parseFloat(e.latitude).toFixed(4)}, {parseFloat(e.longitude).toFixed(4)})
                </span>
              </div>
            )}
            {e.message && (
              <div style={{ marginTop: '0.25rem', padding: '0.625rem 0.75rem', background: dark ? '#1a1a1a' : '#f9f9f9', borderRadius: '6px', fontSize: '0.78rem', color: text, lineHeight: 1.6 }}>
                <span style={{ color: muted, fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Additional Requirements</span>
                <br />{e.message}
              </div>
            )}
            {isMine && e.status === 'fulfilled' && e.amount_received && (
              <div style={{ padding: '0.5rem 0.75rem', background: dark ? '#0a2a14' : '#f0fdf4', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: '#16a34a' }}>Received: ₹{parseFloat(e.amount_received).toLocaleString('en-IN')}</div>
                <div style={{ color: muted, fontSize: '0.72rem' }}>Commission (15%): ₹{parseFloat(e.admin_commission || 0).toLocaleString('en-IN')}</div>
                {e.supplier_notes && <div style={{ color: muted, fontSize: '0.72rem', marginTop: '0.25rem' }}>Note: {e.supplier_notes}</div>}
              </div>
            )}
            {isTaken && (
              <div style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 600 }}>
                Accepted by: {e.accepted_by_shop || 'Another supplier'}
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className="sd-order-meta" style={{ fontSize: '0.7rem', marginTop: '0.4rem' }}>
          🕒 {new Date(e.created_at).toLocaleString('en-IN')}
        </div>

        {/* Action buttons row */}
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Toggle detail */}
          <button
            onClick={() => setExpandedId(isExpanded ? null : e.id)}
            style={{ padding: '0.4rem 0.75rem', background: 'transparent', border: `1px solid ${border}`, borderRadius: '6px', color: muted, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            {isExpanded ? '▲ Less' : '▼ Full Details'}
          </button>

          {/* Accept (open only) */}
          {isOpen && (
            <button className="sd-accept-btn" disabled={acceptingId === e.id} onClick={() => acceptEnquiry(e.id)}>
              {acceptingId === e.id ? 'Accepting…' : '✓ Accept Order'}
            </button>
          )}

          {/* Fulfill (accepted mine only) */}
          {isMine && e.status === 'accepted' && (
            <button className="sd-fulfill-btn" onClick={() => { setFulfillModal(e); setFulfillAmount(''); setFulfillNotes(''); }}>
              📝 Mark Fulfilled
            </button>
          )}

          {/* GPS shortcut */}
          {mapsUrl && !isExpanded && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              style={{ padding: '0.4rem 0.75rem', background: 'transparent', border: `1px solid #3b82f6`, borderRadius: '6px', color: '#3b82f6', fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none' }}>
              🗺 Map
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .sd-page{min-height:100vh;background:${bg};color:${text};font-family:'DM Sans',system-ui,sans-serif;}
        .sd-topbar{background:${surface};border-bottom:1px solid ${border};padding:0 2rem;height:64px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:50;}
        .sd-logo{font-size:1rem;font-weight:800;letter-spacing:-0.02em;color:${text};}
        .sd-logo span{color:var(--brand-blue-dark);}
        .sd-status-active{background:${dark?'#1a2a0a':'#dcfce7'};color:#22c55e;border:1px solid #22c55e33;}
        .sd-status-inactive{background:${dark?'#2a0a0a':'#fee2e2'};color:#ef4444;border:1px solid #ef444433;}
        .sd-pill{padding:0.3rem 0.8rem;border-radius:20px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;}
        .sd-logout-btn{padding:0.5rem 1.1rem;background:transparent;color:${dark?'#888':'#666'};border:1px solid ${border};border-radius:7px;cursor:pointer;font-weight:600;font-size:0.78rem;transition:all 0.2s;}
        .sd-logout-btn:hover{border-color:#ef4444;color:#ef4444;}
        .sd-body{max-width:1100px;margin:0 auto;padding:2rem;}
        .sd-tabs{display:flex;border-bottom:2px solid ${border};margin-bottom:2rem;overflow-x:auto;scrollbar-width:none;}
        .sd-tabs::-webkit-scrollbar{display:none;}
        .sd-tab{padding:0.875rem 1.5rem;background:none;border:none;color:${dark?'#555':'#aaa'};cursor:pointer;font-weight:600;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.08em;position:relative;transition:color 0.2s;white-space:nowrap;font-family:inherit;}
        .sd-tab:hover{color:${text};}
        .sd-tab.active{color:var(--brand-blue-dark);}
        .sd-tab.active::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:2px;background:var(--brand-blue-dark);}
        .sd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem;}
        .sd-order-card{background:${surface};border:1px solid ${border};border-radius:12px;padding:1.25rem;}
        .sd-order-cat{font-size:1rem;font-weight:700;color:${text};}
        .sd-order-meta{font-size:0.78rem;color:${muted};margin-bottom:0.25rem;}
        .sd-badge{display:inline-block;padding:0.2rem 0.6rem;border-radius:20px;font-size:0.65rem;font-weight:700;text-transform:uppercase;}
        .sd-accept-btn{padding:0.5rem 1rem;background:#22c55e;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:0.78rem;cursor:pointer;font-family:inherit;}
        .sd-accept-btn:hover:not(:disabled){background:#16a34a;}
        .sd-accept-btn:disabled{opacity:0.5;cursor:not-allowed;}
        .sd-fulfill-btn{padding:0.5rem 1rem;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:0.78rem;cursor:pointer;font-family:inherit;}
        .sd-fulfill-btn:hover{background:#2563eb;}
        .sd-earn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:1rem;margin-bottom:2rem;}
        .sd-earn-card{background:${surface};border:1px solid ${border};border-radius:12px;padding:1.25rem;}
        .sd-earn-label{font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:${muted};margin-bottom:0.4rem;}
        .sd-earn-value{font-size:1.5rem;font-weight:800;}
        .sd-profile-card{background:${surface};border:1px solid ${border};border-radius:14px;padding:1.75rem;margin-bottom:1.25rem;}
        .sd-form-input{width:100%;padding:0.7rem 0.9rem;border:1px solid ${border};border-radius:8px;background:${inputBg};color:${text};font-family:inherit;font-size:0.875rem;transition:border-color 0.2s;box-sizing:border-box;}
        .sd-form-input:focus{outline:none;border-color:var(--brand-blue-dark);}
        .sd-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:100;backdrop-filter:blur(4px);}
        .sd-modal{background:${surface};border:1px solid ${border};border-radius:16px;padding:2rem;max-width:480px;width:90%;max-height:90vh;overflow-y:auto;}
        .sd-empty{padding:3rem;text-align:center;color:${dark?'#444':'#bbb'};font-size:0.875rem;}
        .sd-loading{padding:2rem;text-align:center;color:${dark?'#555':'#aaa'};font-size:0.875rem;}
        @media(max-width:640px){.sd-topbar{padding:0 1rem;}.sd-body{padding:1rem;}.sd-modal{width:95%;padding:1.5rem;}}
      `}</style>

      <div className="sd-page">
        {/* Topbar */}
        <div className="sd-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="sd-logo">SUPPLIER<span>HUB</span></div>
            <span style={{ width: 1, height: 20, background: border }} />
            <span style={{ fontSize: '0.8rem', color: muted }}>{supplier?.shop_name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className={`sd-pill ${supplier?.is_active === false ? 'sd-status-inactive' : 'sd-status-active'}`}>
              {supplier?.is_active === false ? 'Inactive' : 'Active'}
            </span>
            <button className="sd-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="sd-body">
          {/* Tabs */}
          <div className="sd-tabs">
            {[
              { id: 'orders',   label: '📋 Orders'   },
              { id: 'earnings', label: '💰 Earnings'  },
              { id: 'packages', label: '📦 Package'   },
              { id: 'profile',  label: '👤 Profile'   },
            ].map(t => (
              <button key={t.id} className={`sd-tab${activeTab === t.id ? ' active' : ''}`}
                onClick={() => {
                  setActiveTab(t.id);
                  if (t.id === 'earnings') fetchEarnings();
                  if (t.id === 'orders')   fetchOrders();
                  if (t.id === 'packages') loadPackages();
                }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ══════════════════════ ORDERS ══════════════════════ */}
          {activeTab === 'orders' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Customer Enquiries 📋</div>
                  <div style={{ fontSize: '0.85rem', color: muted }}>Accept open enquiries and manage your active orders</div>
                </div>
                <button onClick={() => fetchOrders()} style={{ padding: '0.5rem 1rem', background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, color: muted, cursor: 'pointer', fontSize: '0.78rem' }}>↺ Refresh</button>
              </div>

              {/* No categories warning */}
              {!loadingOrders && noCats && (
                <div style={{ background: dark ? '#2a1a0a' : '#fff7ed', border: '1px solid #f9731633', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f97316', fontSize: '0.9rem' }}>No product categories set</div>
                    <div style={{ fontSize: '0.82rem', color: muted, marginTop: '0.2rem' }}>
                      You won't receive any enquiries until you set your product categories.{' '}
                      <button onClick={() => setActiveTab('profile')} style={{ background: 'none', border: 'none', color: 'var(--brand-blue-dark)', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', padding: 0, textDecoration: 'underline' }}>
                        Set categories now →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {loadingOrders ? <div className="sd-loading">Loading orders…</div> : (
                <>
                  {/* Open enquiries */}
                  {openEnquiries.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: muted, marginBottom: '1rem' }}>
                        🟡 Open Enquiries ({openEnquiries.length}) 
                      </h3>
                      <div className="sd-grid">
                        {openEnquiries.map(e => <EnquiryCard key={e.id} e={e} mode="open" />)}
                      </div>
                    </div>
                  )}

                  {/* Taken by others */}
                  {takenEnquiries.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: muted, marginBottom: '1rem' }}>
                        🔴 Already Taken ({takenEnquiries.length})
                      </h3>
                      <div className="sd-grid">
                        {takenEnquiries.map(e => <EnquiryCard key={e.id} e={e} mode="taken" />)}
                      </div>
                    </div>
                  )}

                  {/* My accepted/fulfilled orders */}
                  {myOrders.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: muted, marginBottom: '1rem' }}>
                        🔵 My Orders ({myOrders.length})
                      </h3>
                      <div className="sd-grid">
                        {myOrders.map(e => <EnquiryCard key={e.id} e={e} mode="mine" />)}
                      </div>
                    </div>
                  )}

                  {openEnquiries.length === 0 && myOrders.length === 0 && takenEnquiries.length === 0 && !noCats && (
                    <div className="sd-empty">
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                      <div>No enquiries yet for your product categories.</div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Enquiries will appear here when customers request your materials.</div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ══════════════════════ EARNINGS ══════════════════════ */}
          {activeTab === 'earnings' && (
            <>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Earnings 💰</div>
                <div style={{ fontSize: '0.85rem', color: muted }}>Track your daily and total revenue</div>
              </div>
              {loadingEarnings ? <div className="sd-loading">Loading earnings…</div> : earnings ? (
                <>
                  <div className="sd-earn-grid">
                    {[
                      { label: "Today's Revenue",  value: fmt(earnings.today_earned),    color: 'var(--brand-blue-dark)', sub: 'Gross received today'    },
                      { label: "Today's Net",       value: fmt(earnings.today_net),       color: '#22c55e', sub: 'After 15% commission'    },
                      { label: 'Total Revenue',     value: fmt(earnings.total_earned),    color: '#3b82f6', sub: 'All-time gross'          },
                      { label: 'Total Net Earning', value: fmt(earnings.total_net),       color: '#10b981', sub: 'After all commissions'   },
                      { label: 'Commission Paid',   value: fmt(earnings.total_commission),color: '#f97316', sub: '15% to MTBoss'         },
                      { label: 'Orders Fulfilled',  value: earnings.total_fulfilled,      color: text,      sub: 'Total completed'        },
                      { label: 'Active Orders',     value: earnings.active_orders,        color: '#3b82f6', sub: 'In progress'            },
                    ].map(c => (
                      <div key={c.label} className="sd-earn-card">
                        <div className="sd-earn-label">{c.label}</div>
                        <div className="sd-earn-value" style={{ color: c.color }}>{c.value}</div>
                        <div style={{ fontSize: '0.72rem', color: muted, marginTop: '0.25rem' }}>{c.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: '1.25rem', fontSize: '0.85rem', color: muted, lineHeight: 1.7 }}>
                    <strong style={{ color: text }}>Commission:</strong> MTbossdeducts <strong style={{ color: 'var(--brand-blue-dark)' }}>15%</strong> of the amount received on every fulfilled order.
                  </div>
                </>
              ) : <div className="sd-empty">Could not load earnings.</div>}
            </>
          )}

          {/* ══════════════════════ PACKAGES ══════════════════════ */}
          {activeTab === 'packages' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Subscription Plan 📦</div>
                <div style={{ fontSize: '0.85rem', color: muted }}>Manage your vendor package and track validity</div>
              </div>

              {pkgMsg && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.82rem', marginBottom: '1rem', background: dark ? '#0a2a1a' : '#f0fdf4', color: '#10b981', border: '1px solid #10b98144' }}>
                  {pkgMsg}
                </div>
              )}

              {/* Current Plan Card */}
              {pkgStatus && (
                <div style={{ background: dark ? '#0f2a18' : '#ecfdf5', border: '1px solid #10b98133', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#10b981', marginBottom: '0.5rem' }}>Active Package</div>
                  <div style={{ display: 'flex', justifycontent: 'space-between', alignitems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1.2rem', color: text }}>{pkgStatus.package_name || 'No Plan Selected'}</strong>
                      <div style={{ fontSize: '0.82rem', color: muted, marginTop: '0.25rem' }}>
                        {pkgStatus.is_active
                          ? `Expires in ${pkgStatus.days_remaining} days (${new Date(pkgStatus.package_expires_at).toLocaleDateString('en-IN')})`
                          : pkgStatus.package_status === 'pending'
                            ? '⏳ Pending Admin Approval'
                            : 'No active plan'
                        }
                      </div>
                    </div>
                    <span className="sd-badge" style={{ background: pkgStatus.is_active ? '#dcfce7' : '#fee2e2', color: pkgStatus.is_active ? '#15803d' : '#991b1b' }}>
                      {pkgStatus.package_status}
                    </span>
                  </div>
                </div>
              )}

              {/* Package options list */}
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Available Plans</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {pkgList.map(pkg => (
                  <div
                    key={pkg.id}
                    style={{
                      background: surface,
                      border: `1px solid ${border}`,
                      borderRadius: 12,
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: text }}>{pkg.name} Plan</strong>
                      <div style={{ fontSize: '0.75rem', color: muted, marginTop: '0.25rem' }}>{pkg.label} · Complete lead/enquiry access</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ display: 'block', fontSize: '1rem', color: '#f59e0b', marginBottom: '0.5rem' }}>₹{pkg.price}</strong>
                      <button
                        onClick={() => selectPackage(pkg.id)}
                        disabled={pkgLoading || pkgStatus?.package_id === pkg.id}
                        style={{
                          padding: '0.4rem 0.875rem',
                          background: '#f59e0b',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          opacity: (pkgLoading || pkgStatus?.package_id === pkg.id) ? 0.6 : 1,
                          fontFamily: 'inherit',
                        }}
                      >
                        {pkgStatus?.package_id === pkg.id ? 'Current Plan' : 'Select Plan'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════ PROFILE ══════════════════════ */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Account 👤</div>
                <div style={{ fontSize: '0.85rem', color: muted }}>Manage your product categories and account info</div>
              </div>

              {catsMsg.text && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: catsMsg.type === 'success' ? (dark ? '#0a2a14' : '#f0fdf4') : (dark ? '#2a0a0a' : '#fff0f0'), color: catsMsg.type === 'success' ? '#16a34a' : '#dc2626', border: `1px solid ${catsMsg.type === 'success' ? '#16a34a44' : '#dc262644'}` }}>
                  {catsMsg.type === 'success' ? '✅' : '⚠️'} {catsMsg.text}
                </div>
              )}

              {/* Product Categories */}
              <div className="sd-profile-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: text, marginBottom: '0.2rem' }}>📦 Products I Sell</div>
                    <div style={{ fontSize: '0.75rem', color: muted }}>Enquiries are matched based on these categories</div>
                  </div>
                  {!editingCategories && (
                    <button
                      onClick={() => { setEditingCategories(true); setSelectedCats(supplier?.product_categories || []); setCatsMsg({ type: '', text: '' }); }}
                      style={{ padding: '0.4rem 0.875rem', background: 'transparent', border: `1px solid ${border}`, borderRadius: 7, color: text, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                      ✏️ Edit
                    </button>
                  )}
                </div>

                {!editingCategories ? (
                  (supplier?.product_categories || []).length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                      {supplier.product_categories.map(cat => {
                        const found = productCategories.find(c => c.name === cat);
                        return (
                          <span key={cat} style={{ background: dark ? '#1a2a1a' : '#f0fdf4', color: '#16a34a', border: '1px solid #16a34a33', padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
                            {found?.emoji} {cat}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ marginTop: '0.5rem', padding: '1rem', background: dark ? '#2a1a0a' : '#fff7ed', borderRadius: 8, fontSize: '0.85rem', color: '#f97316', fontWeight: 600 }}>
                      ⚠️ No categories set — click Edit to add your product categories and start receiving enquiries.
                    </div>
                  )
                ) : (
                  <>
                    {productCategories.length === 0 ? (
                      <div style={{ padding: '1rem', color: muted, fontSize: '0.82rem' }}>Loading categories…</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(175px,1fr))', gap: '0.6rem', marginTop: '0.75rem' }}>
                        {productCategories.map(cat => {
                          const on = selectedCats.includes(cat.name);
                          return (
                            <div key={cat.id}
                              onClick={() => setSelectedCats(prev => prev.includes(cat.name) ? prev.filter(c => c !== cat.name) : [...prev, cat.name])}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.875rem', border: `2px solid ${on ? '#10b981' : border}`, borderRadius: 9, cursor: 'pointer', background: on ? (dark ? '#0a2a1a' : '#f0fdf4') : (dark ? '#1a1a1a' : '#f8f8f8'), transition: 'all .15s' }}>
                              {cat.image
                                ? <img src={cat.image} alt={cat.name} style={{ width: '1.2rem', height: '1.2rem', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }} />
                                : <span style={{ fontSize: '1.2rem' }}>{cat.emoji || '🛒'}</span>
                              }
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: text, flex: 1, lineHeight: 1.3 }}>{cat.name}</span>
                              <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${on ? '#10b981' : border}`, background: on ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff', fontWeight: 800, flexShrink: 0 }}>
                                {on ? '✓' : ''}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {selectedCats.length > 0 && (
                      <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, marginTop: '0.5rem' }}>
                        {selectedCats.length} categor{selectedCats.length > 1 ? 'ies' : 'y'} selected
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                      <button onClick={saveCategories} disabled={savingCats}
                        style={{ flex: 1, padding: '0.65rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: savingCats ? 0.6 : 1, fontFamily: 'inherit' }}>
                        {savingCats ? 'Saving…' : '💾 Save Categories'}
                      </button>
                      <button onClick={() => { setEditingCategories(false); setCatsMsg({ type: '', text: '' }); }}
                        style={{ padding: '0.65rem 1.25rem', background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, color: muted, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Account Info */}
              <div className="sd-profile-card">
                <div style={{ fontSize: '1rem', fontWeight: 700, color: text, marginBottom: '0.75rem' }}>🏪 Account Info</div>
                {[
                  ['Shop Name', supplier?.shop_name],
                  ['Email',     supplier?.email],
                  ['Phone',     supplier?.phone],
                  ['City',      supplier?.city],
                  ['State',     supplier?.state],
                  ['Country',   supplier?.country],
                  ['Status',    supplier?.status === 'approved' ? '✅ Approved' : supplier?.status === 'pending' ? '⏳ Pending' : '❌ Rejected'],
                ].map(([label, value]) => value ? (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: `1px solid ${border}` }}>
                    <span style={{ fontSize: '0.78rem', color: muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: text }}>{value}</span>
                  </div>
                ) : null)}
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: dark ? '#1a1a1a' : '#f9f9f9', borderRadius: 8, fontSize: '0.78rem', color: muted, lineHeight: 1.6 }}>
                  🔒 To update contact details or Aadhaar, contact <strong>support@mtboss.in</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Fulfill Modal ──────────────────────────────────────────────────── */}
      {fulfillModal && (
        <div className="sd-modal-overlay" onClick={() => setFulfillModal(null)}>
          <div className="sd-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: text }}>📝 Mark Order as Fulfilled</h2>

            {/* Order summary */}
            <div style={{ background: dark ? '#1a1a1a' : '#f9f9f9', borderRadius: 8, padding: '0.875rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: text, marginBottom: '0.4rem' }}>
                {fulfillModal.category_emoji} {fulfillModal.category_name}
                {fulfillModal.material_type ? ` — ${fulfillModal.material_type}` : ''}
              </div>
              {fulfillModal.brand_company && <div style={{ color: muted, fontSize: '0.78rem' }}>Brand: {fulfillModal.brand_company}</div>}
              {fulfillModal.quantity_text && <div style={{ color: muted, fontSize: '0.78rem' }}>Qty: {fulfillModal.quantity_text}</div>}
              <div style={{ color: muted, marginTop: '0.25rem' }}>
                Customer: <strong style={{ color: text }}>{fulfillModal.user_name}</strong> · {fulfillModal.user_phone}
              </div>
              {fulfillModal.delivery_address && (
                <div style={{ color: muted, fontSize: '0.75rem', marginTop: '0.2rem' }}>📍 {fulfillModal.delivery_address}</div>
              )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: muted, marginBottom: '0.4rem' }}>
                Total Amount Received (₹) *
              </label>
              <input
                type="number" className="sd-form-input" value={fulfillAmount}
                onChange={e => setFulfillAmount(e.target.value)}
                placeholder="e.g., 15000" min="0" step="0.01" autoFocus
              />
              {fulfillAmount && !isNaN(parseFloat(fulfillAmount)) && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: muted }}>
                  Commission (15%): <strong style={{ color: '#f97316' }}>₹{(parseFloat(fulfillAmount) * 0.15).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                  {' '}· Your net: <strong style={{ color: '#22c55e' }}>₹{(parseFloat(fulfillAmount) * 0.85).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </div>
              )}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: muted, marginBottom: '0.4rem' }}>
                Delivery Notes (optional)
              </label>
              <textarea className="sd-form-input" rows={2} style={{ resize: 'vertical' }} value={fulfillNotes} onChange={e => setFulfillNotes(e.target.value)} placeholder="Any notes about delivery…" />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={submitFulfill} disabled={fulfilling}
                style={{ flex: 1, padding: '0.75rem', background: 'var(--brand-blue-dark)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', opacity: fulfilling ? 0.6 : 1, fontFamily: 'inherit' }}>
                {fulfilling ? 'Saving…' : '✅ Mark as Fulfilled'}
              </button>
              <button onClick={() => setFulfillModal(null)}
                style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: muted, border: `1px solid ${border}`, borderRadius: 8, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
