// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/components/RevenueManager.jsx
// ADMIN — Revenue & Earnings Hub
// Shows full financial transparency: every booking's journey, per-vendor breakdown,
// admin commission, user payments, date & vendor filters, CSV export.
// ════════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useMemo } from 'react';
import { downloadXlsx } from '@/lib/xlsx';

// ── helpers ──────────────────────────────────────────────────────────────────
const fmt  = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const date = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—';
const dt   = (d) => d ? new Date(d).toLocaleString('en-IN')     : '—';
const pct  = (n) => `${Number(n || 0).toFixed(1)}%`;

const STATUS_META = {
  WAITING_FOR_VENDOR_ACCEPTANCE: { label: 'Waiting',     bg: '#fff7ed', tx: '#9a3412' },
  VENDOR_ACCEPTED:               { label: 'Accepted',    bg: '#dbeafe', tx: '#1e40af' },
  VENDOR_ON_WAY:                 { label: 'On Way',      bg: 'var(--brand-blue-soft)', tx: '#92400e' },
  IN_PROGRESS:                   { label: 'In Progress', bg: '#ffe4e6', tx: '#831843' },
  COMPLETED:                     { label: 'Completed',   bg: '#dcfce7', tx: '#166534' },
  CANCELLED:                     { label: 'Cancelled',   bg: '#f3f4f6', tx: '#374151' },
};
const smeta = (s) => STATUS_META[s] || { label: s, bg: '#f3f4f6', tx: '#374151' };

// ── quick preset date ranges ──────────────────────────────────────────────────
const PRESETS = [
  { label: 'Today',      days: 0  },
  { label: 'Last 7 days', days: 7  },
  { label: 'Last 30 days',days: 30 },
  { label: 'This Month',  days: -1 }, // special
  { label: 'All Time',    days: null },
];

function getPresetDates(days) {
  const today = new Date();
  const pad   = (n) => String(n).padStart(2, '0');
  const fmt   = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const todayStr = fmt(today);

  if (days === null) return { from: '', to: '' };
  if (days === 0)    return { from: todayStr, to: todayStr };
  if (days === -1) {
    // this month
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: fmt(first), to: todayStr };
  }
  const from = new Date(today);
  from.setDate(from.getDate() - days);
  return { from: fmt(from), to: todayStr };
}

// ── CSV export ────────────────────────────────────────────────────────────────
function exportExcel(rows, filename, sheetName) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  downloadXlsx([keys, ...rows.map((row) => keys.map((key) => row[key] ?? ''))], filename, sheetName);
}

// ═════════════════════════════════════════════════════════════════════════════
export default function RevenueManager({ isDarkMode }) {
  // ── state ──────────────────────────────────────────────────────────────────
  const [loading,    setLoading]    = useState(true);
  const [summary,    setSummary]    = useState(null);
  const [txns,       setTxns]       = useState([]);
  const [vendors,    setVendors]    = useState([]);   // per-vendor breakdown
  const [vendorList, setVendorList] = useState([]);   // dropdown options

  const [subTab,     setSubTab]     = useState('transactions'); // transactions | vendors | journey
  const [preset,     setPreset]     = useState('All Time');
  const [fromDate,   setFromDate]   = useState('');
  const [toDate,     setToDate]     = useState('');
  const [selVendor,  setSelVendor]  = useState('all');
  const [selStatus,  setSelStatus]  = useState('all');
  const [search,     setSearch]     = useState('');
  const [detail,     setDetail]     = useState(null); // selected booking for Journey modal

  // ── fetch ──────────────────────────────────────────────────────────────────
  async function fetchData() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const q = new URLSearchParams();
      if (fromDate)               q.set('from_date', fromDate);
      if (toDate)                 q.set('to_date',   toDate);
      if (selVendor !== 'all')    q.set('vendor_id', selVendor);
      if (selStatus !== 'all')    q.set('status',    selStatus);

      const res  = await fetch(`/api/admin/revenue?${q}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setTxns(data.transactions);
        setVendors(data.vendor_breakdown);
        setVendorList(data.vendor_list || []);
      }
    } catch (e) {
      console.error('Revenue fetch error', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [fromDate, toDate, selVendor, selStatus]);

  // ── search filter ──────────────────────────────────────────────────────────
  const filteredTxns = useMemo(() => {
    if (!search.trim()) return txns;
    const q = search.toLowerCase();
    return txns.filter(b =>
      (b.booking_reference || '').toLowerCase().includes(q) ||
      (b.user_name         || '').toLowerCase().includes(q) ||
      (b.vendor_name       || '').toLowerCase().includes(q) ||
      (b.service_label     || '').toLowerCase().includes(q) ||
      (b.service_city      || '').toLowerCase().includes(q)
    );
  }, [txns, search]);

  const filteredVendors = useMemo(() => {
    if (!search.trim()) return vendors;
    const q = search.toLowerCase();
    return vendors.filter(v =>
      (v.vendor_name  || '').toLowerCase().includes(q) ||
      (v.vendor_phone || '').toLowerCase().includes(q)
    );
  }, [vendors, search]);

  // ── preset handler ─────────────────────────────────────────────────────────
  function applyPreset(p) {
    setPreset(p.label);
    const { from, to } = getPresetDates(p.days);
    setFromDate(from);
    setToDate(to);
  }

  function resetFilters() {
    setPreset('All Time');
    setFromDate('');
    setToDate('');
    setSelVendor('all');
    setSelStatus('all');
    setSearch('');
  }

  // ── styles ──────────────────────────────────────────────────────────────────
  const S = {
    root:     { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'DM Sans', system-ui, sans-serif" },
    header:   { background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' },
    title:    { fontSize: '1rem', fontWeight: 800, letterSpacing: '-.02em' },
    subtitle: { fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' },
    body:     { maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem 2rem' },

    // Summary cards
    cardsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' },
    card:     (bg, tx) => ({ background: bg, border: `1px solid ${bg}`, borderRadius: '10px', padding: '1rem 1.25rem' }),
    cLabel:   (tx) => ({ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: tx, opacity: .75, marginBottom: '0.375rem' }),
    cValue:   (tx) => ({ fontSize: '1.6rem', fontWeight: 900, color: tx, lineHeight: 1 }),
    cSub:     { fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.25rem' },

    // Filters bar
    filters:  { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.875rem 1.25rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' },
    label:    { fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '2px' },
    select:   { padding: '0.35rem 0.625rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' },
    input:    { padding: '0.35rem 0.625rem', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.8rem', outline: 'none' },
    presetBtn:(active) => ({
      padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
      border: '1px solid var(--border)',
      background: active ? 'var(--accent)' : 'var(--surface)',
      color:      active ? '#111'          : 'var(--text)',
      transition: 'all .15s',
    }),

    // Sub-tabs
    subTabs:  { display: 'flex', gap: '0.25rem', marginBottom: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.25rem' },
    subTab:   (active) => ({
      flex: 1, padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600,
      cursor: 'pointer', border: 'none', textAlign: 'center',
      background: active ? 'var(--accent)' : 'transparent',
      color:      active ? '#111'          : 'var(--muted)',
      transition: 'all .15s',
    }),

    // Table
    panel:    { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' },
    th:       { padding: '0.5rem 0.875rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)', background: 'var(--bg)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' },
    td:       { padding: '0.55rem 0.875rem', borderBottom: '1px solid var(--border)', fontSize: '0.8rem', verticalAlign: 'middle' },

    // Export btn
    exportBtn: { padding: '0.4rem 0.875rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' },
    refreshBtn:{ padding: '0.4rem 0.875rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' },

    // Badge
    badge: (s) => ({
      display: 'inline-block', padding: '0.2rem 0.55rem', borderRadius: '999px',
      fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
      background: smeta(s).bg, color: smeta(s).tx,
    }),

    // Money cells
    green: { color: '#16a34a', fontWeight: 700 },
    blue:  { color: '#2563eb', fontWeight: 700 },
    amber: { color: 'var(--brand-blue-deep)', fontWeight: 700 },
    red:   { color: '#dc2626', fontWeight: 700 },

    // Journey step
    step:     (done) => ({
      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
      padding: '0.75rem', borderRadius: '8px',
      background: done ? '#dcfce7' : 'var(--bg)',
      border: `1px solid ${done ? '#86efac' : 'var(--border)'}`,
      marginBottom: '0.5rem',
    }),
    stepDot:  (done) => ({
      width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4,
      background: done ? '#16a34a' : 'var(--border)',
    }),
  };

  const CARD_DEFS = summary ? [
    { label: 'Total Revenue Collected', value: fmt(summary.total_collected),  sub: `${summary.completed_bookings} completed bookings`, bg: '#f0fdf4', tx: '#14532d' },
    { label: 'Admin Earned (15%)',       value: fmt(summary.total_admin_earn), sub: 'Platform commission',                              bg: 'var(--brand-blue-soft)', tx: 'var(--brand-blue-deepest)' },
    { label: 'Vendor Payouts (85%)',     value: fmt(summary.total_vendor_pay), sub: 'Total due to vendors',                            bg: '#dbeafe', tx: '#1e3a8a' },
    { label: 'GST Collected',            value: fmt(summary.total_gst),        sub: 'Tax component',                                   bg: '#fce7f3', tx: '#831843' },
    { label: 'Pipeline Value',           value: fmt(summary.pipeline_value),   sub: `${summary.active_bookings} active bookings`,      bg: '#fff7ed', tx: '#9a3412' },
  ] : [];

  // ── Journey Modal ──────────────────────────────────────────────────────────
  function JourneyModal({ b, onClose }) {
    const steps = [
      {
        title: '📋 Booking Created',
        done:  true,
        time:  dt(b.created_at),
        detail: `${b.user_name} booked "${b.service_label}" for ${date(b.booking_date)} (${b.slot_type})`,
        amount: null,
      },
      {
        title: '🏪 Vendor Accepted',
        done:  !!b.accepted_at,
        time:  b.accepted_at ? dt(b.accepted_at) : 'Pending',
        detail: b.vendor_name ? `Assigned to ${b.vendor_name} (${b.vendor_phone})` : 'No vendor assigned yet',
        amount: null,
      },
      {
        title: '💬 Vendor Quoted Final Amount',
        done:  parseFloat(b.final_amount) > 0,
        time:  parseFloat(b.final_amount) > 0 ? 'Done' : 'Awaiting',
        detail: parseFloat(b.final_amount) > 0
          ? `Vendor quoted ${fmt(b.final_amount)} (original estimate: ${fmt(b.total_amount)})`
          : `Estimate: ${fmt(b.total_amount)} — vendor has not yet quoted`,
        amount: parseFloat(b.final_amount) > 0 ? fmt(b.final_amount) : null,
        note: b.vendor_notes,
      },
      {
        title: '💳 User Confirmed Payment',
        done:  parseFloat(b.user_paid_amount) > 0,
        time:  b.completed_at ? dt(b.completed_at) : 'Awaiting',
        detail: parseFloat(b.user_paid_amount) > 0
          ? `User paid ${fmt(b.user_paid_amount)}`
          : 'User has not yet confirmed payment',
        amount: parseFloat(b.user_paid_amount) > 0 ? fmt(b.user_paid_amount) : null,
        note: b.user_notes,
      },
      {
        title: '✅ Booking Completed',
        done:  b.status === 'COMPLETED',
        time:  b.completed_at ? dt(b.completed_at) : 'Not completed',
        detail: b.status === 'COMPLETED'
          ? `Completed — Admin commission: ${fmt(b.admin_commission)} | Vendor payout: ${fmt(b.vendor_payout)}`
          : 'Booking not yet completed',
        amount: b.status === 'COMPLETED' ? fmt(b.effective_amount) : null,
      },
    ];

    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}
           onClick={onClose}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', maxWidth: 620, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 24px 64px rgba(0,0,0,.25)' }}
             onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>Booking Journey</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px' }}>{b.booking_reference} · {b.service_label}</div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--muted)', lineHeight: 1 }}>✕</button>
          </div>

          {/* Steps */}
          {steps.map((step, i) => (
            <div key={i} style={S.step(step.done)}>
              <div style={S.stepDot(step.done)} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: step.done ? '#166534' : 'var(--muted)' }}>{step.title}</span>
                  {step.amount && <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#16a34a' }}>{step.amount}</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{step.time}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text)', marginTop: '0.375rem' }}>{step.detail}</div>
                {step.note && <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem', fontStyle: 'italic' }}>Note: {step.note}</div>}
              </div>
            </div>
          ))}

          {/* Pricing table */}
          <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--muted)', marginBottom: '0.75rem' }}>Pricing Breakdown</div>
            {[
              ['Base Amount (estimated)',   fmt(b.base_amount),       '#2563eb'],
              ['Visit Fee',                 fmt(b.visit_fee),         '#2563eb'],
              ['GST / Tax',                 fmt(b.tax_amount),        '#7c3aed'],
              ['Total Estimate',            fmt(b.total_amount),      'var(--brand-blue-deep)'],
              ['Vendor Final Quote',        fmt(b.final_amount),      'var(--brand-blue-deep)'],
              ['User Actually Paid',        fmt(b.user_paid_amount),  '#16a34a'],
              ['Admin Commission (15%)',    fmt(b.admin_commission),  '#dc2626'],
              ['Vendor Payout (85%)',       fmt(b.vendor_payout),     '#16a34a'],
            ].map(([k, v, c]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px dashed var(--border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{k}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </div>

          <button onClick={onClose} style={{ width: '100%', marginTop: '1rem', padding: '0.55rem', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .rev-tr:hover { background: var(--bg) !important; cursor: default; }
        .rev-tr-click:hover { background: var(--bg) !important; cursor: pointer; }
        .rev-search::placeholder { color: var(--muted); }
        .rev-search:focus { border-color: var(--accent); outline: none; }
        @media(max-width: 900px){
          .rev-cards { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width: 580px){
          .rev-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={S.root}>
        {/* ── Header ── */}
        <div style={S.header}>
          <div>
            <div style={S.title}>💰 Revenue &amp; Earnings</div>
            <div style={S.subtitle}>Full financial transparency — every booking, every rupee</div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={S.refreshBtn} onClick={fetchData}>↻ Refresh</button>
            <button style={S.exportBtn} onClick={() => {
              if (subTab === 'transactions') exportExcel(filteredTxns.map(b => ({
                Ref: b.booking_reference, Customer: b.user_name, Service: b.service_label,
                City: b.service_city, Vendor: b.vendor_name, Status: b.status,
                'Base Amount': b.base_amount, 'Visit Fee': b.visit_fee, 'Tax': b.tax_amount,
                'Total Estimate': b.total_amount, 'Final Quote': b.final_amount,
                'User Paid': b.user_paid_amount, 'Admin Commission': b.admin_commission,
                'Vendor Payout': b.vendor_payout, 'Booking Date': date(b.booking_date), 'Completed At': dt(b.completed_at)
              })), 'revenue-transactions.xlsx', 'Transactions');
              else if (subTab === 'vendors') exportExcel(filteredVendors.map(v => ({
                Vendor: v.vendor_name, Phone: v.vendor_phone,
                'Total Bookings': v.total_bookings, 'Completed': v.completed_count,
                'Total Collected': v.total_collected, 'Admin Commission': v.admin_commission,
                'Vendor Payout': v.vendor_payout, 'GST': v.gst_collected,
              })), 'revenue-vendors.xlsx', 'Vendors');
            }}>Export Excel</button>
          </div>
        </div>

        <div style={S.body}>

          {/* ── Summary Cards ── */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>Loading revenue data…</div>
          ) : summary && (
            <div className="rev-cards" style={S.cardsRow}>
              {CARD_DEFS.map(({ label, value, sub, bg, tx }) => (
                <div key={label} style={S.card(bg, tx)}>
                  <div style={S.cLabel(tx)}>{label}</div>
                  <div style={S.cValue(tx)}>{value}</div>
                  <div style={S.cSub}>{sub}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Filters ── */}
          <div style={S.filters}>
            {/* Date presets */}
            <div>
              <div style={S.label}>Quick Range</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {PRESETS.map(p => (
                  <button key={p.label} style={S.presetBtn(preset === p.label)} onClick={() => applyPreset(p)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom date range */}
            <div>
              <div style={S.label}>From</div>
              <input type="date" style={S.input} value={fromDate} onChange={e => { setFromDate(e.target.value); setPreset(''); }} />
            </div>
            <div>
              <div style={S.label}>To</div>
              <input type="date" style={S.input} value={toDate} onChange={e => { setToDate(e.target.value); setPreset(''); }} />
            </div>

            {/* Vendor filter */}
            <div>
              <div style={S.label}>Vendor</div>
              <select style={S.select} value={selVendor} onChange={e => setSelVendor(e.target.value)}>
                <option value="all">All Vendors</option>
                {vendorList.map(v => <option key={v.id} value={v.id}>{v.shop_name}</option>)}
              </select>
            </div>

            {/* Status filter */}
            <div>
              <div style={S.label}>Status</div>
              <select style={S.select} value={selStatus} onChange={e => setSelStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            {/* Search */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={S.label}>Search</div>
              <input
                className="rev-search"
                style={{ ...S.input, width: '100%' }}
                placeholder="Ref, customer, vendor, service…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div>
              <div style={S.label}>Reset</div>
              <button type="button" style={S.refreshBtn} onClick={resetFilters}>Reset Filters</button>
            </div>
          </div>

          {/* ── Sub-tabs ── */}
          <div style={S.subTabs}>
            {[
              { id: 'transactions', label: '📄 All Transactions' },
              { id: 'vendors',      label: '🏪 Per Vendor Breakdown' },
              { id: 'journey',      label: '🛤️ Booking Journey View' },
            ].map(t => (
              <button key={t.id} style={S.subTab(subTab === t.id)} onClick={() => setSubTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              SUB-TAB 1 — ALL TRANSACTIONS
          ══════════════════════════════════════════════════════════════════ */}
          {subTab === 'transactions' && (
            <div style={S.panel}>
              <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>All Transactions ({filteredTxns.length})</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Click a row to see the full journey</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                {filteredTxns.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.8rem' }}>No transactions found for the selected filters.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Booking Ref','Customer','Service','Vendor','City','Status',
                          'Base Amt','Visit Fee','GST','Estimate','Vendor Quote','User Paid',
                          'Admin (15%)','Vendor (85%)','Date','Action'].map(h => (
                          <th key={h} style={S.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTxns.map(b => (
                        <tr key={b.id} className="rev-tr" style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ ...S.td, fontWeight: 700, whiteSpace: 'nowrap' }}>{b.booking_reference}</td>
                          <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                            <div style={{ fontWeight: 600 }}>{b.user_name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{b.user_phone}</div>
                          </td>
                          <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                            <span>{b.service_icon} {b.service_label}</span>
                          </td>
                          <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                            {b.vendor_name
                              ? <><div style={{ fontWeight: 600 }}>{b.vendor_name}</div><div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{b.vendor_phone}</div></>
                              : <span style={{ color: 'var(--muted)' }}>—</span>}
                          </td>
                          <td style={S.td}>{b.service_city}</td>
                          <td style={S.td}><span style={S.badge(b.status)}>{smeta(b.status).label}</span></td>
                          <td style={{ ...S.td, ...S.blue }}>{fmt(b.base_amount)}</td>
                          <td style={{ ...S.td, color: 'var(--muted)' }}>{fmt(b.visit_fee)}</td>
                          <td style={{ ...S.td, color: '#7c3aed', fontWeight: 600 }}>{fmt(b.tax_amount)}</td>
                          <td style={{ ...S.td, ...S.amber }}>{fmt(b.total_amount)}</td>
                          <td style={{ ...S.td, ...S.amber }}>
                            {parseFloat(b.final_amount) > 0 ? fmt(b.final_amount) : <span style={{ color: 'var(--muted)' }}>—</span>}
                          </td>
                          <td style={{ ...S.td, ...S.green }}>
                            {parseFloat(b.user_paid_amount) > 0 ? fmt(b.user_paid_amount) : <span style={{ color: 'var(--muted)' }}>—</span>}
                          </td>
                          <td style={{ ...S.td, ...S.red }}>
                            {b.status === 'COMPLETED' ? fmt(b.admin_commission) : <span style={{ color: 'var(--muted)' }}>—</span>}
                          </td>
                          <td style={{ ...S.td, ...S.green }}>
                            {b.status === 'COMPLETED' ? fmt(b.vendor_payout) : <span style={{ color: 'var(--muted)' }}>—</span>}
                          </td>
                          <td style={{ ...S.td, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{date(b.created_at)}</td>
                          <td style={S.td}>
                            <button
                              onClick={() => setDetail(b)}
                              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                            >
                              Journey →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {/* Totals row */}
                    {filteredTxns.length > 0 && (() => {
                      const comp = filteredTxns.filter(b => b.status === 'COMPLETED');
                      return (
                        <tfoot>
                          <tr style={{ background: 'var(--bg)', borderTop: '2px solid var(--border)' }}>
                            <td colSpan={6} style={{ ...S.td, fontWeight: 800, fontSize: '0.8rem' }}>TOTALS ({comp.length} completed / {filteredTxns.length} total)</td>
                            <td style={{ ...S.td, ...S.blue, fontWeight: 900 }}>{fmt(comp.reduce((s, b) => s + parseFloat(b.base_amount), 0))}</td>
                            <td style={{ ...S.td, color: 'var(--muted)', fontWeight: 700 }}>{fmt(comp.reduce((s, b) => s + parseFloat(b.visit_fee), 0))}</td>
                            <td style={{ ...S.td, color: '#7c3aed', fontWeight: 700 }}>{fmt(comp.reduce((s, b) => s + parseFloat(b.tax_amount), 0))}</td>
                            <td style={{ ...S.td, ...S.amber, fontWeight: 900 }}>{fmt(comp.reduce((s, b) => s + parseFloat(b.total_amount), 0))}</td>
                            <td style={{ ...S.td, ...S.amber, fontWeight: 900 }}>{fmt(comp.reduce((s, b) => s + parseFloat(b.final_amount), 0))}</td>
                            <td style={{ ...S.td, ...S.green, fontWeight: 900 }}>{fmt(comp.reduce((s, b) => s + parseFloat(b.user_paid_amount), 0))}</td>
                            <td style={{ ...S.td, ...S.red,   fontWeight: 900 }}>{fmt(comp.reduce((s, b) => s + b.admin_commission, 0))}</td>
                            <td style={{ ...S.td, ...S.green, fontWeight: 900 }}>{fmt(comp.reduce((s, b) => s + b.vendor_payout, 0))}</td>
                            <td colSpan={2} />
                          </tr>
                        </tfoot>
                      );
                    })()}
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              SUB-TAB 2 — PER VENDOR BREAKDOWN
          ══════════════════════════════════════════════════════════════════ */}
          {subTab === 'vendors' && (
            <div style={S.panel}>
              <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Per Vendor Earnings ({filteredVendors.length} vendors)</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                {filteredVendors.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.8rem' }}>No vendor data for selected filters.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Vendor','Phone','Total Bookings','Completed','Total Collected','Admin Commission (15%)','Vendor Payout (85%)','GST Collected','Completion Rate'].map(h => (
                          <th key={h} style={S.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVendors.map((v, i) => {
                        const rate = v.total_bookings > 0 ? (v.completed_count / v.total_bookings * 100).toFixed(1) : 0;
                        const rateColor = rate >= 80 ? '#16a34a' : rate >= 50 ? 'var(--brand-blue-deep)' : '#dc2626';
                        return (
                          <tr key={v.vendor_id} className="rev-tr" style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'var(--bg)' }}>
                            <td style={{ ...S.td, fontWeight: 700 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                                  {(v.vendor_name || '?').charAt(0).toUpperCase()}
                                </div>
                                {v.vendor_name}
                              </div>
                            </td>
                            <td style={{ ...S.td, color: 'var(--muted)' }}>{v.vendor_phone}</td>
                            <td style={{ ...S.td, textAlign: 'center', fontWeight: 700 }}>{v.total_bookings}</td>
                            <td style={{ ...S.td, textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>{v.completed_count}</td>
                            <td style={{ ...S.td, ...S.green }}>{fmt(v.total_collected)}</td>
                            <td style={{ ...S.td, ...S.red }}>{fmt(v.admin_commission)}</td>
                            <td style={{ ...S.td, ...S.blue }}>{fmt(v.vendor_payout)}</td>
                            <td style={{ ...S.td, color: '#7c3aed', fontWeight: 600 }}>{fmt(v.gst_collected)}</td>
                            <td style={{ ...S.td, fontWeight: 700, color: rateColor }}>{pct(rate)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {filteredVendors.length > 0 && (
                      <tfoot>
                        <tr style={{ background: 'var(--bg)', borderTop: '2px solid var(--border)' }}>
                          <td colSpan={2} style={{ ...S.td, fontWeight: 800 }}>PLATFORM TOTAL</td>
                          <td style={{ ...S.td, textAlign: 'center', fontWeight: 900 }}>{filteredVendors.reduce((s, v) => s + v.total_bookings, 0)}</td>
                          <td style={{ ...S.td, textAlign: 'center', color: '#16a34a', fontWeight: 900 }}>{filteredVendors.reduce((s, v) => s + v.completed_count, 0)}</td>
                          <td style={{ ...S.td, ...S.green, fontWeight: 900 }}>{fmt(filteredVendors.reduce((s, v) => s + v.total_collected, 0))}</td>
                          <td style={{ ...S.td, ...S.red,   fontWeight: 900 }}>{fmt(filteredVendors.reduce((s, v) => s + v.admin_commission, 0))}</td>
                          <td style={{ ...S.td, ...S.blue,  fontWeight: 900 }}>{fmt(filteredVendors.reduce((s, v) => s + v.vendor_payout, 0))}</td>
                          <td style={{ ...S.td, color: '#7c3aed', fontWeight: 900 }}>{fmt(filteredVendors.reduce((s, v) => s + v.gst_collected, 0))}</td>
                          <td style={S.td} />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              SUB-TAB 3 — BOOKING JOURNEY VIEW (card grid)
          ══════════════════════════════════════════════════════════════════ */}
          {subTab === 'journey' && (
            <div>
              <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                Showing {filteredTxns.length} bookings — click any card to expand the full process journey
              </div>
              {filteredTxns.length === 0 ? (
                <div style={{ ...S.panel, textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.8rem' }}>No bookings for selected filters.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '0.75rem' }}>
                  {filteredTxns.map(b => {
                    const stages = [
                      { label: 'Booked',         done: true },
                      { label: 'Vendor Accepted', done: !!b.accepted_at },
                      { label: 'Vendor Quoted',   done: parseFloat(b.final_amount) > 0 },
                      { label: 'User Paid',        done: parseFloat(b.user_paid_amount) > 0 },
                      { label: 'Completed',        done: b.status === 'COMPLETED' },
                    ];
                    const doneCount = stages.filter(s => s.done).length;

                    return (
                      <div
                        key={b.id}
                        className="rev-tr-click"
                        onClick={() => setDetail(b)}
                        style={{ ...S.panel, padding: '1rem', transition: 'box-shadow .15s', cursor: 'pointer' }}
                      >
                        {/* top row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{b.booking_reference}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '1px' }}>{b.service_icon} {b.service_label}</div>
                          </div>
                          <span style={S.badge(b.status)}>{smeta(b.status).label}</span>
                        </div>

                        {/* People */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <div style={{ padding: '0.5rem', background: 'var(--bg)', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '2px' }}>Customer</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{b.user_name}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{b.user_phone}</div>
                          </div>
                          <div style={{ padding: '0.5rem', background: 'var(--bg)', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '2px' }}>Vendor</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{b.vendor_name || '—'}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{b.vendor_phone || ''}</div>
                          </div>
                        </div>

                        {/* Progress steps */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '0.75rem' }}>
                          {stages.map((s, i) => (
                            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                              <div style={{ height: 4, borderRadius: '4px', background: s.done ? '#16a34a' : 'var(--border)', marginBottom: '3px' }} />
                              <div style={{ fontSize: '0.55rem', color: s.done ? '#16a34a' : 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {s.label}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>{doneCount} of {stages.length} stages done</div>

                        {/* Amounts */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.375rem' }}>
                          {[
                            { label: 'Estimate',  val: fmt(b.total_amount),     color: 'var(--brand-blue-deep)' },
                            { label: 'Quote',     val: parseFloat(b.final_amount) > 0 ? fmt(b.final_amount) : '—', color: '#2563eb' },
                            { label: 'Paid',      val: parseFloat(b.user_paid_amount) > 0 ? fmt(b.user_paid_amount) : '—', color: '#16a34a' },
                          ].map(({ label, val, color }) => (
                            <div key={label} style={{ textAlign: 'center', padding: '0.375rem', background: 'var(--bg)', borderRadius: '6px' }}>
                              <div style={{ fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color }}>{val}</div>
                            </div>
                          ))}
                        </div>

                        {b.status === 'COMPLETED' && (
                          <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
                            <div style={{ textAlign: 'center', padding: '0.375rem', background: '#fee2e2', borderRadius: '6px' }}>
                              <div style={{ fontSize: '0.6rem', color: '#9b1c1c', textTransform: 'uppercase', fontWeight: 700 }}>Admin (15%)</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#dc2626' }}>{fmt(b.admin_commission)}</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '0.375rem', background: '#dcfce7', borderRadius: '6px' }}>
                              <div style={{ fontSize: '0.6rem', color: '#14532d', textTransform: 'uppercase', fontWeight: 700 }}>Vendor (85%)</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a' }}>{fmt(b.vendor_payout)}</div>
                            </div>
                          </div>
                        )}

                        <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                          <span>📍 {b.service_city}</span>
                          <span>{date(b.created_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Journey Modal */}
      {detail && <JourneyModal b={detail} onClose={() => setDetail(null)} />}
    </>
  );
}
