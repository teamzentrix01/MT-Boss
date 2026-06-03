'use client';
import { useEffect, useState, useCallback } from 'react';

function th(dark) {
  return {
    bg:      dark ? '#000000' : '#f8f9fa',
    card:    dark ? '#111111' : '#ffffff',
    text:    dark ? '#ffffff' : '#111827',
    sub:     dark ? '#71717a'  : '#6b7280',
    muted:   dark ? '#52525b'  : '#9ca3af',
    border:  dark ? '#27272a'  : '#e5e7eb',
    inputBg: dark ? '#0a0a0a'  : '#f9fafb',
    accent:  dark ? '#facc15'  : '#111827',
    accentFg:dark ? '#000000'  : '#ffffff',
    rowHov:  dark ? '#1a1a1a'  : '#f9fafb',
    tHead:   dark ? '#0a0a0a'  : '#f3f4f6',
    newBg:   dark ? '#1a1400'  : '#fefce8',
    newBorder:dark? '#854d0e'  : '#fde68a',
    newText: dark ? '#fbbf24'  : '#92400e',
  };
}

export default function ProfessionalEnquiriesManager({ isDarkMode }) {
  const t = th(isDarkMode);
  const [enquiries, setEnquiries]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null); // detail modal
  const [selectedApp, setSelectedApp] = useState(null); // application detail modal
  const [filterPro, setFilterPro]     = useState('all');
  const [search, setSearch]           = useState('');
  const [pros, setPros]               = useState([]);   // for filter dropdown

  // ── fetch ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const [eRes, pRes] = await Promise.all([
        fetch('/api/professional-enquiries', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/professional-services?admin=true', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [eData, pData] = await Promise.all([eRes.json(), pRes.json()]);
      if (eData.success) setEnquiries(eData.data);
      if (pData.success) setPros(pData.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── filter ─────────────────────────────────────────────────────────────────
  const displayed = enquiries.filter(e => {
    const matchPro  = filterPro === 'all' || String(e.professional_id) === filterPro;
    const q = search.toLowerCase();
    const matchSearch = !q
      || e.enquirer_name?.toLowerCase().includes(q)
      || e.enquirer_email?.toLowerCase().includes(q)
      || e.professional_name?.toLowerCase().includes(q)
      || e.message?.toLowerCase().includes(q);
    return matchPro && matchSearch;
  });

  const unread      = enquiries.filter(e => !e.is_read).length;
  const pendingApps = pros.filter(p => p.status === 'pending');

  function fmtDate(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
      + ' ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  }

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background:t.bg, minHeight:'100vh', padding:'24px' }}>
      <style>{`
        .pe-row { transition: background 0.1s; cursor: pointer; }
        .pe-row:hover td { background: ${t.rowHov} !important; }
        .pe-search::placeholder { color: ${t.muted}; }
        .pe-search:focus { outline: none; border-color: ${t.accent} !important; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <p style={{ color:t.accent, fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 4px' }}>Admin Panel</p>
          <h2 style={{ color:t.text, margin:'0 0 4px', fontSize:'20px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.02em', display:'flex', alignItems:'center', gap:'10px' }}>
            Professional Enquiries
            {unread > 0 && (
              <span style={{ background:t.accent, color:t.accentFg, fontSize:'10px', fontWeight:800, padding:'2px 8px', borderRadius:'20px' }}>
                {unread} new
              </span>
            )}
          </h2>
          <p style={{ color:t.sub, margin:0, fontSize:'12px' }}>Messages sent to professionals via the public enquiry form.</p>
        </div>
        <button onClick={load}
          style={{ background:'none', border:`1px solid ${t.border}`, borderRadius:'4px', padding:'8px 16px', color:t.sub, cursor:'pointer', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>
          ↺ Refresh
        </button>
      </div>

      {/* ── Pending Applications Banner ─────────────────────────────────── */}
      {pendingApps.length > 0 && (
        <div style={{ border:`1px solid #854d0e`, borderRadius:'6px', background: isDarkMode ? '#1a1000' : '#fffbeb', marginBottom:'24px', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', borderBottom:`1px solid #854d0e` }}>
            <span style={{ fontSize:'18px' }}>🔔</span>
            <div style={{ flex:1 }}>
              <span style={{ fontWeight:800, fontSize:'13px', color: isDarkMode ? '#fbbf24' : '#92400e' }}>
                {pendingApps.length} New Professional Application{pendingApps.length > 1 ? 's' : ''} Awaiting Review
              </span>
              <span style={{ fontSize:'11px', color: isDarkMode ? '#a16207' : '#b45309', marginLeft:'10px' }}>
                Go to Professional Services tab to approve or reject
              </span>
            </div>
            <a href="?tab=professionals"
              style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', color: isDarkMode ? '#fbbf24' : '#92400e', textDecoration:'none', border:`1px solid #854d0e`, borderRadius:'4px', padding:'5px 10px', whiteSpace:'nowrap' }}>
              Review →
            </a>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'0' }}>
            {pendingApps.map((p, i) => (
              <div key={p.id}
                style={{ padding:'12px 16px', borderBottom: i < pendingApps.length - 1 ? `1px solid ${isDarkMode ? '#2a1800' : '#fde68a'}` : 'none', cursor:'pointer', transition:'background 0.1s' }}
                onClick={() => setSelectedApp(p)}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  {p.profile_picture
                    ? <img src={p.profile_picture} alt="" style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover', border:`1px solid #854d0e`, flexShrink:0 }} />
                    : <div style={{ width:38, height:38, borderRadius:'50%', background: isDarkMode ? '#2a1800' : '#fde68a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>👤</div>
                  }
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:800, fontSize:'13px', color: isDarkMode ? '#f0f0f5' : '#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize:'11px', color: isDarkMode ? '#a16207' : '#b45309', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title} · {p.city}</div>
                    <div style={{ fontSize:'10px', color: isDarkMode ? '#6b7280' : '#9ca3af', marginTop:'1px' }}>{fmtDate(p.created_at)}</div>
                  </div>
                  <span style={{ fontSize:'11px', fontWeight:800, textTransform:'uppercase', color:'#f59e0b', background: isDarkMode ? '#2a1800' : '#fef3c7', padding:'2px 8px', borderRadius:'20px', whiteSpace:'nowrap' }}>Pending</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'12px', marginBottom:'24px' }}>
        {[
          { label:'Total',   val:enquiries.length,                    color:t.sub    },
          { label:'New',     val:unread,                              color:'#facc15' },
          { label:'Read',    val:enquiries.length - unread,           color:'#22c55e' },
          { label:'Professionals', val:new Set(enquiries.map(e=>e.professional_id)).size, color:t.accent },
          { label:'Pending Apps',  val:pendingApps.length,            color:'#f59e0b' },
        ].map(s=>(
          <div key={s.label} style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:'4px', padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:'22px', fontWeight:800, color:s.color, fontVariantNumeric:'tabular-nums' }}>{s.val}</div>
            <div style={{ fontSize:'10px', color:t.sub, marginTop:'3px', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'20px', flexWrap:'wrap' }}>
        {/* Search */}
        <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
          <span style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', color:t.muted, fontSize:'13px' }}>🔍</span>
          <input className="pe-search" value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search enquirer, professional, message…"
            style={{ width:'100%', boxSizing:'border-box', border:`1px solid ${t.border}`, borderRadius:'4px', padding:'8px 10px 8px 30px', background:t.inputBg, color:t.text, fontSize:'12px' }} />
        </div>
        {/* Filter by professional */}
        <select value={filterPro} onChange={e=>setFilterPro(e.target.value)}
          style={{ border:`1px solid ${t.border}`, borderRadius:'4px', padding:'8px 12px', background:t.inputBg, color:t.text, fontSize:'12px', outline:'none', minWidth:'180px' }}>
          <option value="all">All Professionals</option>
          {pros.map(p=>(
            <option key={p.id} value={String(p.id)}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'60px', color:t.sub, fontSize:'12px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Loading…</div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px', border:`1px solid ${t.border}`, borderRadius:'4px' }}>
          <div style={{ fontSize:'36px', marginBottom:'10px' }}>📭</div>
          <p style={{ color:t.text, fontSize:'13px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 4px' }}>No enquiries yet</p>
          <p style={{ color:t.sub, fontSize:'12px' }}>When someone contacts a professional, it will appear here.</p>
        </div>
      ) : (
        <div style={{ border:`1px solid ${t.border}`, borderRadius:'4px', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
            <thead>
              <tr>
                {['Status', 'From', 'To Professional', 'Message', 'Date'].map((h,i)=>(
                  <th key={i} style={{ padding:'10px 14px', textAlign:'left', color:t.sub, fontWeight:700, fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', background:t.tHead, whiteSpace:'nowrap', borderBottom:`1px solid ${t.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map(enq=>(
                <tr key={enq.id} className="pe-row" onClick={()=>setSelected(enq)}
                  style={{ borderBottom:`1px solid ${t.border}`, background:!enq.is_read?(isDarkMode?'#111100':'#fffdf0'):'transparent' }}>

                  {/* Status dot */}
                  <td style={{ padding:'10px 14px' }}>
                    {!enq.is_read
                      ? <span style={{ background:t.newBg, color:t.newText, border:`1px solid ${t.newBorder}`, padding:'2px 8px', fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em' }}>New</span>
                      : <span style={{ color:t.muted, fontSize:'10px', fontWeight:700 }}>Read</span>
                    }
                  </td>

                  {/* From */}
                  <td style={{ padding:'10px 14px' }}>
                    <div style={{ fontWeight:700, color:t.text }}>{enq.enquirer_name}</div>
                    <div style={{ color:t.sub, fontSize:'11px', marginTop:'1px' }}>{enq.enquirer_email}</div>
                    {enq.enquirer_phone && <div style={{ color:t.muted, fontSize:'11px' }}>{enq.enquirer_phone}</div>}
                  </td>

                  {/* Professional */}
                  <td style={{ padding:'10px 14px' }}>
                    <div style={{ color:t.accent, fontWeight:700 }}>{enq.professional_name || '—'}</div>
                    {enq.professional_email && <div style={{ color:t.sub, fontSize:'11px', marginTop:'1px' }}>{enq.professional_email}</div>}
                  </td>

                  {/* Message preview */}
                  <td style={{ padding:'10px 14px', maxWidth:'260px' }}>
                    <p style={{ color:t.sub, margin:0, fontSize:'12px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'260px' }}>
                      {enq.message}
                    </p>
                  </td>

                  {/* Date */}
                  <td style={{ padding:'10px 14px', color:t.muted, whiteSpace:'nowrap', fontSize:'11px' }}>
                    {fmtDate(enq.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Application Detail Modal ── */}
      {selectedApp && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}
          onClick={() => setSelectedApp(null)}>
          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:'6px', width:'100%', maxWidth:'540px', padding:'28px', position:'relative', maxHeight:'90vh', overflowY:'auto' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedApp(null)}
              style={{ position:'absolute', top:'12px', right:'12px', background:'none', border:`1px solid ${t.border}`, borderRadius:'2px', width:'28px', height:'28px', cursor:'pointer', color:t.sub, fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>

            <p style={{ color:'#f59e0b', fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 4px' }}>Professional Application</p>
            <h3 style={{ color:t.text, margin:'0 0 16px', fontSize:'18px', fontWeight:800 }}>{selectedApp.name}</h3>

            {selectedApp.profile_picture && (
              <img src={selectedApp.profile_picture} alt="" style={{ width:64, height:64, borderRadius:'50%', objectFit:'cover', border:`2px solid #f59e0b`, marginBottom:'16px' }} />
            )}

            <div style={{ background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'4px', padding:'16px', marginBottom:'16px' }}>
              {[
                ['Title',      selectedApp.title],
                ['Category',   selectedApp.category],
                ['City',       selectedApp.city || '—'],
                ['Phone',      selectedApp.phone || '—'],
                ['Email',      selectedApp.email],
                ['Experience', selectedApp.experience ? `${selectedApp.experience} yrs` : '—'],
                ['Applied',    fmtDate(selectedApp.created_at)],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', gap:'12px', padding:'5px 0', borderBottom:`1px solid ${t.border}` }}>
                  <span style={{ fontSize:'11px', fontWeight:700, color:t.sub, textTransform:'uppercase', letterSpacing:'0.06em', minWidth:'90px', flexShrink:0 }}>{k}</span>
                  <span style={{ fontSize:'12px', color:t.text, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>

            {selectedApp.description && (
              <>
                <p style={{ color:t.sub, fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 6px' }}>Bio / Description</p>
                <div style={{ background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'4px', padding:'12px', fontSize:'12px', color:t.text, lineHeight:'1.7', whiteSpace:'pre-wrap', marginBottom:'16px' }}>
                  {selectedApp.description}
                </div>
              </>
            )}

            <a href="?tab=professionals"
              style={{ display:'block', textAlign:'center', background:'#f59e0b', color:'#000', borderRadius:'4px', padding:'11px', textDecoration:'none', fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em' }}>
              Go to Professional Services to Approve / Reject →
            </a>
          </div>
        </div>
      )}

      {/* ── Enquiry Detail Modal ── */}
      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}
          onClick={()=>setSelected(null)}>
          <div style={{ background:t.card, border:`1px solid ${t.border}`, borderRadius:'4px', width:'100%', maxWidth:'520px', padding:'32px', position:'relative', maxHeight:'90vh', overflowY:'auto' }}
            onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setSelected(null)}
              style={{ position:'absolute', top:'12px', right:'12px', background:'none', border:`1px solid ${t.border}`, borderRadius:'2px', width:'28px', height:'28px', cursor:'pointer', color:t.sub, fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>

            <p style={{ color:t.accent, fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 4px' }}>Enquiry Detail</p>
            <h3 style={{ color:t.text, margin:'0 0 20px', fontSize:'18px', fontWeight:800 }}>From {selected.enquirer_name}</h3>

            {/* Info grid */}
            <div style={{ background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'4px', padding:'16px', marginBottom:'20px' }}>
              {[
                ['Enquirer',   selected.enquirer_name],
                ['Email',      selected.enquirer_email],
                ['Phone',      selected.enquirer_phone || '—'],
                ['To',         selected.professional_name || '—'],
                ['Pro Email',  selected.professional_email || '—'],
                ['Date',       fmtDate(selected.created_at)],
              ].map(([k,v])=>(
                <div key={k} style={{ display:'flex', gap:'12px', padding:'5px 0', borderBottom:`1px solid ${t.border}` }}>
                  <span style={{ fontSize:'11px', fontWeight:700, color:t.sub, textTransform:'uppercase', letterSpacing:'0.06em', minWidth:'80px', flexShrink:0 }}>{k}</span>
                  <span style={{ fontSize:'12px', color:t.text, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Message */}
            <p style={{ color:t.accent, fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 8px' }}>Message</p>
            <div style={{ background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:'4px', padding:'16px', fontSize:'13px', color:t.text, lineHeight:'1.7', whiteSpace:'pre-wrap', marginBottom:'20px' }}>
              {selected.message}
            </div>

            {/* Quick reply link */}
            <a href={`mailto:${selected.enquirer_email}?subject=Re: Your enquiry about ${selected.professional_name}&body=Hi ${selected.enquirer_name},%0A%0A`}
              style={{ display:'block', textAlign:'center', background:t.accent, color:t.accentFg, borderRadius:'2px', padding:'11px', textDecoration:'none', fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em' }}>
              ✉ Reply to {selected.enquirer_name}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
