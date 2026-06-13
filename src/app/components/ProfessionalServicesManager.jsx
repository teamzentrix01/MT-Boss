'use client';
import { useEffect, useState, useCallback } from 'react';

// ─── Cloudinary uploader ──────────────────────────────────────────────────────
async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  fd.append('cloud_name',    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  const res  = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  );
  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error(data.error?.message || 'Upload failed');
}

function SingleImageUpload({ label, value, onChange, border, inputBg, sub }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  async function handleFile(e) {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true); setErr('');
    try { onChange(await uploadToCloudinary(file)); }
    catch (e) { setErr(e.message); }
    finally { setUploading(false); }
  }
  return (
    <div>
      <label style={{ fontSize:'10px',fontWeight:700,color:sub,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:'5px' }}>{label}</label>
      <div style={{ display:'flex',gap:'10px',alignItems:'center' }}>
        {value && (
          <div style={{ position:'relative',flexShrink:0 }}>
            <img src={value} alt="" style={{ width:'52px',height:'52px',objectFit:'cover',border:`1px solid ${border}`,borderRadius:'2px' }} />
            <button type="button" onClick={()=>onChange('')}
              style={{ position:'absolute',top:'-6px',right:'-6px',width:'18px',height:'18px',borderRadius:'50%',background:'#ef4444',border:'none',color:'#fff',fontSize:'10px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
          </div>
        )}
        <label style={{ flex:1,border:`1px dashed ${border}`,borderRadius:'4px',padding:'9px 12px',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px',background:inputBg }}>
          <span style={{ fontSize:'16px' }}>{uploading?'⏳':'📁'}</span>
          <span style={{ fontSize:'12px',color:sub,fontWeight:600 }}>{uploading?'Uploading…':value?'Replace image':'Click to upload'}</span>
          <input type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} disabled={uploading} />
        </label>
      </div>
      {err && <p style={{ color:'#ef4444',fontSize:'11px',margin:'3px 0 0' }}>{err}</p>}
    </div>
  );
}

function MultiImageUpload({ label, value=[], onChange, border, inputBg, sub }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  async function handleFiles(e) {
    const files = Array.from(e.target.files).slice(0, 8 - value.length);
    if (!files.length) return;
    setUploading(true); setErr('');
    try { onChange([...value, ...await Promise.all(files.map(uploadToCloudinary))]); }
    catch (e) { setErr(e.message); }
    finally { setUploading(false); e.target.value=''; }
  }
  return (
    <div>
      <label style={{ fontSize:'10px',fontWeight:700,color:sub,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:'5px' }}>{label}</label>
      {value.length > 0 && (
        <div style={{ display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'7px' }}>
          {value.map((url,i)=>(
            <div key={i} style={{ position:'relative' }}>
              <img src={url} alt="" style={{ width:'48px',height:'48px',objectFit:'cover',border:`1px solid ${border}`,borderRadius:'2px' }} />
              <button type="button" onClick={()=>onChange(value.filter((_,j)=>j!==i))}
                style={{ position:'absolute',top:'-5px',right:'-5px',width:'16px',height:'16px',borderRadius:'50%',background:'#ef4444',border:'none',color:'#fff',fontSize:'9px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
            </div>
          ))}
        </div>
      )}
      <label style={{ display:'flex',alignItems:'center',gap:'8px',border:`1px dashed ${border}`,borderRadius:'4px',padding:'9px 12px',cursor:value.length>=8?'not-allowed':'pointer',background:inputBg }}>
        <span style={{ fontSize:'16px' }}>{uploading?'⏳':'🖼'}</span>
        <span style={{ fontSize:'12px',color:sub,fontWeight:600 }}>{uploading?'Uploading…':`Add images (${value.length}/8)`}</span>
        <input type="file" accept="image/*" multiple onChange={handleFiles} style={{ display:'none' }} disabled={uploading||value.length>=8} />
      </label>
      {err && <p style={{ color:'#ef4444',fontSize:'11px',margin:'3px 0 0' }}>{err}</p>}
    </div>
  );
}

const CATEGORIES = ['Interior Designer', 'Architect', 'Landscape Designer',
  'Civil Engineer', 'Vastu Consultant', 'Home Stager', 'Other'];

const STATUS_TABS = [
  { key: 'all',      label: 'All',      color: '#a1a1aa' },
  { key: 'pending',  label: 'Pending',  color: 'var(--brand-blue)' },
  { key: 'approved', label: 'Approved', color: '#22c55e' },
  { key: 'rejected', label: 'Rejected', color: '#ef4444' },
];

// ─── theme ───────────────────────────────────────────────────────────────────
function t(dark) {
  return {
    bg:       dark ? '#000000' : '#f8f9fa',
    card:     dark ? '#111111' : '#ffffff',
    text:     dark ? '#ffffff' : '#111827',
    sub:      dark ? '#71717a' : '#6b7280',
    border:   dark ? '#27272a' : '#e5e7eb',
    inputBg:  dark ? '#0a0a0a' : '#f9fafb',
    accent:   dark ? 'var(--brand-blue)' : '#111827',
    accentFg: dark ? '#000000' : '#ffffff',
    rowHov:   dark ? '#1a1a1a' : '#f9fafb',
    tHead:    dark ? '#0a0a0a' : '#f3f4f6',
  };
}

const EMPTY = {
  name:'', title:'', category:CATEGORIES[0], experience:'', city:'', phone:'', email:'',
  description:'', website:'', instagram:'', linkedin:'', certifications:'', specializations:'',
};

// Returns [formFields, profilePicUrl, portfolioUrls[]]
function toFormState(pro) {
  const imgs = Array.isArray(pro.portfolio_images)
    ? pro.portfolio_images
    : (typeof pro.portfolio_images === 'string' ? JSON.parse(pro.portfolio_images || '[]') : []);
  return {
    fields: {
      name: pro.name || '',
      title: pro.title || '',
      category: pro.category || CATEGORIES[0],
      experience: String(pro.experience || ''),
      city: pro.city || '',
      phone: pro.phone || '',
      email: pro.email || '',
      description: pro.description || '',
      website: pro.website || '',
      instagram: pro.instagram || '',
      linkedin: pro.linkedin || '',
      certifications: pro.certifications || '',
      specializations: Array.isArray(pro.specializations)
        ? pro.specializations.join(', ')
        : (typeof pro.specializations === 'string' ? JSON.parse(pro.specializations || '[]').join(', ') : ''),
    },
    profilePic: pro.profile_picture || '',
    portfolioImgs: imgs,
  };
}

export default function ProfessionalServicesManager({ isDarkMode }) {
  const th = t(isDarkMode);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('all');
  const [editPro, setEditPro] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [profilePic, setProfilePic] = useState('');        // Cloudinary URL
  const [portfolioImgs, setPortfolioImgs] = useState([]);  // Cloudinary URLs[]
  const [saving, setSaving] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchProfessionals = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/professional-services?admin=true', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProfessionals(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProfessionals(); }, [fetchProfessionals]);

  function flash(text, type = 'success') {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  }

  // ── status update ─────────────────────────────────────────────────────────
  async function updateStatus(id, newStatus) {
    const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
    const res = await fetch('/api/professional-services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      setProfessionals(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      flash(`Status updated to ${newStatus}.`);
    }
  }

  // ── delete ────────────────────────────────────────────────────────────────
  async function deletePro(id) {
    if (!confirm('Delete this professional permanently?')) return;
    const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
    const res = await fetch(`/api/professional-services?id=${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setProfessionals(prev => prev.filter(p => p.id !== id));
      flash('Deleted successfully.');
    }
  }

  function resetForm() {
    setEditPro(null);
    setForm(EMPTY);
    setProfilePic('');
    setPortfolioImgs([]);
  }

  // ── save ──────────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const payload = {
        ...form,
        profile_picture: profilePic || null,
        portfolio_images: portfolioImgs,
        experience: parseInt(form.experience) || 0,
        specializations: form.specializations ? form.specializations.split(',').map(s => s.trim()).filter(Boolean) : [],
        status: editPro?.id ? (editPro.status || 'pending') : 'approved',
      };
      const method = editPro?.id ? 'PUT' : 'POST';
      const body = editPro?.id ? JSON.stringify({ id: editPro.id, ...payload }) : JSON.stringify(payload);
      const res = await fetch('/api/professional-services', {
        method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      flash(editPro?.id ? 'Professional updated.' : 'Professional added and approved.');
      resetForm();
      fetchProfessionals();
    } catch (err) { flash(err.message, 'error'); }
    finally { setSaving(false); }
  }

  // ── drag & drop ───────────────────────────────────────────────────────────
  const approved = professionals.filter(p => p.status === 'approved');

  async function saveOrder(ordered) {
    setOrderSaving(true);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      await fetch('/api/professional-services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: ordered.map((p, i) => ({ id: p.id, sort_order: i })) }),
      });
      flash('Order saved.');
    } catch { flash('Failed to save order.', 'error'); }
    finally { setOrderSaving(false); }
  }

  function onDragStart(i) { setDragIndex(i); }
  function onDragOver(e, i) { e.preventDefault(); setDragOverIndex(i); }
  function onDrop(i) {
    if (dragIndex === null || dragIndex === i) { setDragIndex(null); setDragOverIndex(null); return; }
    const reordered = [...approved];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(i, 0, moved);
    const rest = professionals.filter(p => p.status !== 'approved');
    setProfessionals([...reordered, ...rest]);
    setDragIndex(null); setDragOverIndex(null);
    saveOrder(reordered);
  }
  function onDragEnd() { setDragIndex(null); setDragOverIndex(null); }

  // ── stats ─────────────────────────────────────────────────────────────────
  const counts = { all: professionals.length, pending: 0, approved: 0, rejected: 0 };
  professionals.forEach(p => { if (counts[p.status] !== undefined) counts[p.status]++; });

  const displayed = statusTab === 'all' ? professionals : professionals.filter(p => p.status === statusTab);

  // shared style helpers
  const inp  = { border:`1px solid ${th.border}`,borderRadius:'4px',padding:'9px 12px',background:th.inputBg,color:th.text,fontSize:'13px',outline:'none',width:'100%',boxSizing:'border-box',fontFamily:'inherit' };
  const lbl  = { fontSize:'10px',fontWeight:700,color:th.sub,textTransform:'uppercase',letterSpacing:'0.07em',display:'block',marginBottom:'4px' };
  const set  = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // ── FORM VIEW ─────────────────────────────────────────────────────────────
  if (editPro !== null) {
    return (
      <div style={{ background:th.bg, minHeight:'100vh', padding:'24px' }}>
        <div style={{ maxWidth:'700px', margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
            <button onClick={resetForm}
              style={{ background:'none', border:`1px solid ${th.border}`, borderRadius:'4px', padding:'7px 16px', color:th.text, cursor:'pointer', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>
              ← Back
            </button>
            <h2 style={{ color:th.text, margin:0, fontSize:'18px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.04em' }}>
              {editPro?.id ? 'Edit Professional' : 'Add Professional'}
            </h2>
          </div>

          <form onSubmit={handleSave} style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:'4px', padding:'28px' }}>
            {msg.text && (
              <div style={{ background:msg.type==='error'?(isDarkMode?'#2d1515':'#fee2e2'):(isDarkMode?'#052e16':'#dcfce7'), color:msg.type==='error'?'#ef4444':'#22c55e', padding:'9px 12px', borderRadius:'4px', marginBottom:'16px', fontSize:'12px' }}>{msg.text}</div>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div><label style={lbl}>Full Name *</label><input style={inp} value={form.name} onChange={set('name')} required /></div>
              <div><label style={lbl}>Professional Title *</label><input style={inp} value={form.title} onChange={set('title')} required /></div>
              <div>
                <label style={lbl}>Category *</label>
                <select style={inp} value={form.category} onChange={set('category')}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Experience (years)</label><input style={inp} type="number" min="0" value={form.experience} onChange={set('experience')} /></div>
              <div><label style={lbl}>City *</label><input style={inp} value={form.city} onChange={set('city')} required /></div>
              <div><label style={lbl}>Phone *</label><input style={inp} value={form.phone} onChange={set('phone')} required /></div>
              <div style={{ gridColumn:'span 2' }}><label style={lbl}>Email *</label><input style={inp} type="email" value={form.email} onChange={set('email')} required /></div>
              <div style={{ gridColumn:'span 2' }}>
                <label style={lbl}>Bio / Description *</label>
                <textarea style={{...inp,resize:'vertical'}} rows={4} value={form.description} onChange={set('description')} required />
              </div>
              <div style={{ gridColumn:'span 2' }}><label style={lbl}>Specializations (comma-separated)</label><input style={inp} value={form.specializations} onChange={set('specializations')} /></div>
              <div style={{ gridColumn:'span 2' }}><label style={lbl}>Certifications</label><input style={inp} value={form.certifications} onChange={set('certifications')} /></div>
              {/* ── Image uploads ── */}
              <div style={{ gridColumn:'span 2' }}>
                <SingleImageUpload label="Profile Photo" value={profilePic} onChange={setProfilePic} border={th.border} inputBg={th.inputBg} sub={th.sub} />
              </div>
              <div style={{ gridColumn:'span 2' }}>
                <MultiImageUpload label="Portfolio Images (up to 8)" value={portfolioImgs} onChange={setPortfolioImgs} border={th.border} inputBg={th.inputBg} sub={th.sub} />
              </div>
              {/* ── Social links ── */}
              <div style={{ gridColumn:'span 2', borderTop:`1px solid ${th.border}`, paddingTop:'12px', marginTop:'2px' }}>
                <p style={{ color:th.muted, fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 12px' }}>Social &amp; Web Links</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div><label style={lbl}>Website</label><input style={inp} value={form.website} onChange={set('website')} /></div>
                  <div><label style={lbl}>Instagram</label><input style={inp} value={form.instagram} onChange={set('instagram')} /></div>
                  <div style={{ gridColumn:'span 2' }}><label style={lbl}>LinkedIn</label><input style={inp} value={form.linkedin} onChange={set('linkedin')} /></div>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:'12px', marginTop:'22px' }}>
              <button type="submit" disabled={saving}
                style={{ flex:1, background:th.accent, color:th.accentFg, border:'none', borderRadius:'4px', padding:'11px', cursor:saving?'wait':'pointer', fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.09em', opacity:saving?0.7:1 }}>
                {saving ? 'Saving…' : (editPro?.id ? 'Update Professional' : 'Add & Approve')}
              </button>
              <button type="button" onClick={resetForm}
                style={{ padding:'11px 20px', border:`1px solid ${th.border}`, borderRadius:'4px', background:'none', color:th.text, cursor:'pointer', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  return (
    <div style={{ background:th.bg, minHeight:'100vh', padding:'24px' }}>
      <style>{`
        .psm-row { transition: background 0.1s; }
        .psm-row:hover td { background: ${th.rowHov} !important; }
        .psm-row-dragging td { background: ${isDarkMode ? '#1a1500' : '#fefce8'} !important; }
        .psm-row-drag-over td { border-top: 2px solid ${th.accent} !important; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px', flexWrap:'wrap', gap:'14px' }}>
        <div>
          <p style={{ color:th.accent, fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', margin:'0 0 4px' }}>Admin Panel</p>
          <h2 style={{ color:th.text, margin:'0 0 4px', fontSize:'20px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.02em' }}>Professional Services</h2>
          <p style={{ color:th.sub, margin:0, fontSize:'12px' }}>Manage professionals, approve/reject applications, drag to reorder approved listings.</p>
        </div>
        <button onClick={() => { setEditPro({}); setForm(EMPTY); setProfilePic(''); setPortfolioImgs([]); }}
          style={{ background:th.accent, color:th.accentFg, border:'none', borderRadius:'4px', padding:'10px 20px', cursor:'pointer', fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.09em', whiteSpace:'nowrap' }}>
          + Add Professional
        </button>
      </div>

      {/* Flash message */}
      {msg.text && (
        <div style={{ background:msg.type==='error'?(isDarkMode?'#2d1515':'#fee2e2'):(isDarkMode?'#052e16':'#dcfce7'), color:msg.type==='error'?'#ef4444':'#22c55e', padding:'9px 14px', borderRadius:'4px', marginBottom:'16px', fontSize:'12px', fontWeight:600, border:`1px solid ${msg.type==='error'?'#7f1d1d':'#14532d'}` }}>{msg.text}</div>
      )}

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'24px' }}>
        {STATUS_TABS.map(tab => (
          <div key={tab.key} onClick={() => setStatusTab(tab.key)}
            style={{ background:th.card, border:`1px solid ${statusTab===tab.key?th.accent:th.border}`, borderRadius:'4px', padding:'16px', textAlign:'center', cursor:'pointer', transition:'border-color 0.15s' }}>
            <div style={{ fontSize:'22px', fontWeight:800, color:tab.color, fontVariantNumeric:'tabular-nums' }}>{counts[tab.key]}</div>
            <div style={{ fontSize:'10px', color:th.sub, marginTop:'3px', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:700 }}>{tab.label}</div>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div style={{ display:'flex', gap:'0', marginBottom:'20px', borderBottom:`1px solid ${th.border}` }}>
        {STATUS_TABS.map(tab => (
          <button key={tab.key} onClick={() => setStatusTab(tab.key)}
            style={{ background:'none', border:'none', borderBottom:`2px solid ${statusTab===tab.key?tab.color:'transparent'}`, cursor:'pointer', padding:'8px 18px', fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:statusTab===tab.key?tab.color:th.sub, transition:'all 0.15s', marginBottom:'-1px' }}>
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      {/* Drag hint */}
      {(statusTab === 'approved' || statusTab === 'all') && approved.length > 1 && (
        <div style={{ background:isDarkMode?'#1a1500':'#fefce8', border:`1px solid ${isDarkMode?'var(--brand-blue-deeper)':'#fde68a'}`, borderRadius:'4px', padding:'8px 14px', marginBottom:'14px', fontSize:'12px', color:isDarkMode?'var(--brand-blue-light)':'#92400e', display:'flex', alignItems:'center', gap:'6px', fontWeight:600 }}>
          <span style={{ fontSize:'16px' }}>⠿</span> Drag approved rows to set the display order on the public page.
          {orderSaving && <span style={{ marginLeft:'auto', opacity:0.7, fontWeight:400 }}>Saving order…</span>}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'60px', color:th.sub, fontSize:'13px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Loading…</div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px', border:`1px solid ${th.border}`, borderRadius:'4px', color:th.sub }}>
          <div style={{ fontSize:'36px', marginBottom:'10px' }}>👔</div>
          <p style={{ fontSize:'13px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>No {statusTab !== 'all' ? statusTab : ''} professionals yet</p>
        </div>
      ) : (
        <div style={{ border:`1px solid ${th.border}`, borderRadius:'4px', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
            <thead>
              <tr>
                {['', 'Professional', 'Category', 'City', 'Exp', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} style={{ padding:'10px 14px', textAlign:'left', color:th.sub, fontWeight:700, fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', background:th.tHead, whiteSpace:'nowrap', borderBottom:`1px solid ${th.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((pro) => {
                const isApproved = pro.status === 'approved';
                const approvedIdx = approved.findIndex(p => p.id === pro.id);
                const isDragging = isApproved && dragIndex === approvedIdx;
                const isDragOver = isApproved && dragOverIndex === approvedIdx;

                const statusColor = pro.status==='approved'?'#22c55e':pro.status==='pending'?'var(--brand-blue)':'#ef4444';
                const statusBg = pro.status==='approved'?(isDarkMode?'#052e16':'#dcfce7'):pro.status==='pending'?(isDarkMode?'#1c1400':'var(--brand-blue-soft)'):(isDarkMode?'#2d1515':'#fee2e2');

                return (
                  <tr key={pro.id} className={`psm-row ${isDragging?'psm-row-dragging':''} ${isDragOver?'psm-row-drag-over':''}`}
                    draggable={isApproved}
                    onDragStart={isApproved ? () => onDragStart(approvedIdx) : undefined}
                    onDragOver={isApproved ? e => onDragOver(e, approvedIdx) : undefined}
                    onDrop={isApproved ? () => onDrop(approvedIdx) : undefined}
                    onDragEnd={isApproved ? onDragEnd : undefined}
                    style={{ borderBottom:`1px solid ${th.border}` }}>

                    {/* Drag handle */}
                    <td style={{ padding:'10px 8px 10px 12px', color:isApproved?th.accent:th.border, cursor:isApproved?'grab':'default', userSelect:'none', fontSize:'16px', lineHeight:1 }}>⠿</td>

                    {/* Info */}
                    <td style={{ padding:'10px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        {pro.profile_picture ? (
                          <img src={pro.profile_picture} alt={pro.name}
                            style={{ width:'34px',height:'34px',border:`1px solid ${th.border}`,objectFit:'cover',flexShrink:0 }}
                            onError={e=>{ e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                          />
                        ) : null}
                        <div style={{ width:'34px',height:'34px',background:th.accent,display:pro.profile_picture?'none':'flex',alignItems:'center',justifyContent:'center',color:th.accentFg,fontWeight:800,fontSize:'13px',flexShrink:0 }}>
                          {pro.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight:700, color:th.text }}>{pro.name}</div>
                          <div style={{ color:th.sub, fontSize:'11px', marginTop:'1px' }}>{pro.title}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding:'10px 14px', color:th.sub }}>{pro.category}</td>
                    <td style={{ padding:'10px 14px', color:th.sub }}>{pro.city || '—'}</td>
                    <td style={{ padding:'10px 14px', color:th.sub, whiteSpace:'nowrap' }}>{pro.experience} yr{pro.experience!==1?'s':''}</td>

                    {/* Status badge */}
                    <td style={{ padding:'10px 14px' }}>
                      <span style={{ padding:'2px 10px', fontSize:'10px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.07em', background:statusBg, color:statusColor, border:`1px solid ${statusColor}40` }}>
                        {pro.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding:'10px 14px' }}>
                      <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                        {pro.status === 'pending' && (
                          <>
                            <button onClick={()=>updateStatus(pro.id,'approved')}
                              style={{ background:'none',color:'#22c55e',border:'1px solid #22c55e',borderRadius:'3px',padding:'4px 9px',cursor:'pointer',fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em' }}>
                              ✓ Approve
                            </button>
                            <button onClick={()=>updateStatus(pro.id,'rejected')}
                              style={{ background:'none',color:'#ef4444',border:'1px solid #ef4444',borderRadius:'3px',padding:'4px 9px',cursor:'pointer',fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em' }}>
                              ✕ Reject
                            </button>
                          </>
                        )}
                        {pro.status === 'rejected' && (
                          <button onClick={()=>updateStatus(pro.id,'approved')}
                            style={{ background:'none',color:'#22c55e',border:'1px solid #22c55e',borderRadius:'3px',padding:'4px 9px',cursor:'pointer',fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em' }}>
                            ✓ Approve
                          </button>
                        )}
                        {pro.status === 'approved' && (
                          <button onClick={()=>updateStatus(pro.id,'rejected')}
                            style={{ background:'none',color:'#ef4444',border:'1px solid #ef4444',borderRadius:'3px',padding:'4px 9px',cursor:'pointer',fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.06em' }}>
                            Revoke
                          </button>
                        )}
                        <button onClick={e=>{ e.stopPropagation(); const s=toFormState(pro); setEditPro(pro); setForm(s.fields); setProfilePic(s.profilePic); setPortfolioImgs(s.portfolioImgs); }}
                          style={{ background:'none',color:th.sub,border:`1px solid ${th.border}`,borderRadius:'3px',padding:'4px 9px',cursor:'pointer',fontSize:'10px',fontWeight:700 }}>
                          ✏ Edit
                        </button>
                        <button onClick={e=>{ e.stopPropagation(); deletePro(pro.id); }}
                          style={{ background:'none',color:'#ef4444',border:'1px solid #ef4444',borderRadius:'3px',padding:'4px 9px',cursor:'pointer',fontSize:'10px',fontWeight:700 }}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
