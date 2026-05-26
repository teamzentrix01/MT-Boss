'use client';

import { useState, useEffect } from 'react';

const emptyProcess = { step: '', title: '', desc: '' };
const emptyBenefit = { icon: '', title: '', desc: '' };
const emptyProject = { name: '', type: '', area: '', status: 'Delivered', img: '' };

const defaultForm = {
  slug: '', title: '', description: '', image: '',
  hero_subtitle: '', about_heading: '', about_body: '',
  stat1_value: '', stat1_label: '',
  stat2_value: '', stat2_label: '',
  stat3_value: '', stat3_label: '',
  stat4_value: '', stat4_label: '',
  process: [], benefits: [], projects: [],
  cta_heading: '', contact_phone: '', contact_email: '',
};

export default function PrimaryServicesManager({ isDarkMode }) {
  const [services,  setServices]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm,  setShowForm]  = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [formData,  setFormData]  = useState(defaultForm);

  // ── Drag & Drop state ──────────────────────────────────────────────────────
  const [dragIndex,     setDragIndex]     = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [orderSaving,   setOrderSaving]   = useState(false);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('/api/primary-services', { headers: { 'Authorization': `Bearer ${token}` } });
      const data  = await res.json();
      if (data.success) setServices(data.data);
    } catch { setError('Error fetching services'); }
    finally  { setLoading(false); }
  };

  // ── Save reordered list to backend ─────────────────────────────────────────
  const saveOrder = async (ordered) => {
    setOrderSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const items = ordered.map((s, i) => ({ id: s.id, sort_order: i + 1 }));
      const res = await fetch('/api/primary-services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.success) setSuccess('Order saved — frontend updated!');
      else setError('Failed to save order');
    } catch { setError('Error saving order'); }
    finally { setOrderSaving(false); }
  };

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const onDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const el = e.currentTarget;
      if (el) el.style.opacity = '0.4';
    }, 0);
  };
  const onDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (index !== dragIndex) setDragOverIndex(index);
  };
  const onDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null); setDragOverIndex(null); return;
    }
    const arr = [...services];
    const [dragged] = arr.splice(dragIndex, 1);
    arr.splice(dropIndex, 0, dragged);
    setServices(arr);
    setDragIndex(null);
    setDragOverIndex(null);
    await saveOrder(arr);
  };
  const onDragEnd = (e) => {
    if (e.currentTarget) e.currentTarget.style.opacity = '';
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // ── Form helpers ───────────────────────────────────────────────────────────
  const set       = (key, val) => setFormData(f => ({ ...f, [key]: val }));
  const addRow    = (field, tpl) => setFormData(f => ({ ...f, [field]: [...f[field], { ...tpl }] }));
  const removeRow = (field, idx) => setFormData(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  const updateRow = (field, idx, key, val) =>
    setFormData(f => ({ ...f, [field]: f[field].map((r, i) => i === idx ? { ...r, [key]: val } : r) }));

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.slug || !formData.title || !formData.description || !formData.image) {
      setError('Slug, title, description and image are required'); return;
    }
    try {
      const token  = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const body   = editingId ? { id: editingId, ...formData } : formData;
      const res    = await fetch('/api/primary-services', {
        method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) { setSuccess(editingId ? 'Updated!' : 'Added!'); resetForm(); fetchServices(); }
      else setError(data.error || 'Something went wrong');
    } catch { setError('Error saving service'); }
  };

  const handleEdit = (s) => {
    setFormData({
      slug: s.slug, title: s.title, description: s.description, image: s.image,
      hero_subtitle: s.hero_subtitle || '', about_heading: s.about_heading || '', about_body: s.about_body || '',
      stat1_value: s.stat1_value || '', stat1_label: s.stat1_label || '',
      stat2_value: s.stat2_value || '', stat2_label: s.stat2_label || '',
      stat3_value: s.stat3_value || '', stat3_label: s.stat3_label || '',
      stat4_value: s.stat4_value || '', stat4_label: s.stat4_label || '',
      process:  Array.isArray(s.process)  ? s.process  : [],
      benefits: Array.isArray(s.benefits) ? s.benefits : [],
      projects: Array.isArray(s.projects) ? s.projects : [],
      cta_heading: s.cta_heading || '', contact_phone: s.contact_phone || '', contact_email: s.contact_email || '',
    });
    setEditingId(s.id); setShowForm(true); setActiveTab('basic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch(`/api/primary-services?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const data  = await res.json();
      if (data.success) { setSuccess('Deleted!'); fetchServices(); }
      else setError(data.error || 'Delete failed');
    } catch { setError('Error deleting'); }
  };

  const resetForm = () => { setFormData(defaultForm); setEditingId(null); setShowForm(false); setActiveTab('basic'); };

  if (loading) return <div style={{ color: 'var(--ps-muted)', fontSize: '0.8125rem' }}>Loading…</div>;

  const dm = isDarkMode;

  return (
    <>
      <style>{`
        .ps-root {
          --ps-bg:       ${dm ? '#0f0f11' : '#f5f5f7'};
          --ps-surface:  ${dm ? '#18181c' : '#ffffff'};
          --ps-border:   ${dm ? '#2a2a30' : '#e2e2e7'};
          --ps-text:     ${dm ? '#f0f0f5' : '#111113'};
          --ps-muted:    ${dm ? '#7c7c8a' : '#6b6b76'};
          --ps-accent:   ${dm ? '#60a5fa' : '#2563eb'};
          --ps-row-hov:  ${dm ? '#1e1e24' : '#f8f8fa'};
          --ps-input-bg: ${dm ? '#111114' : '#ffffff'};
          --ps-sub-bg:   ${dm ? '#111114' : '#f8f8fa'};
          --ps-err-bg:   ${dm ? '#2a0f0f' : '#fff1f2'};
          --ps-err-tx:   ${dm ? '#f87171' : '#9f1239'};
          --ps-err-br:   ${dm ? '#7f1d1d' : '#fca5a5'};
          --ps-ok-bg:    ${dm ? '#0f2a18' : '#f0fdf4'};
          --ps-ok-tx:    ${dm ? '#86efac' : '#14532d'};
          --ps-ok-br:    ${dm ? '#166534' : '#86efac'};
          --ps-tag-bg:   ${dm ? '#1a2035' : '#eff4ff'};
          --ps-tag-tx:   ${dm ? '#93c5fd' : '#1e40af'};
          --ps-del-bg:   ${dm ? '#2a0f0f' : '#fff1f2'};
          --ps-del-tx:   ${dm ? '#f87171' : '#9f1239'};
        }
        .ps-root { color: var(--ps-text); }

        .ps-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.875rem; }
        .ps-title  { font-size:0.875rem; font-weight:700; }
        .ps-add-btn {
          padding:0.35rem 0.875rem; background:var(--ps-accent); color:#fff;
          border:none; border-radius:6px; font-size:0.8125rem; font-weight:600;
          cursor:pointer; transition:opacity .15s;
        }
        .ps-add-btn.cancel { background:none; color:var(--ps-muted); border:1px solid var(--ps-border); }
        .ps-add-btn:hover { opacity:.85; }

        .ps-alert { padding:0.5rem 0.875rem; border-radius:6px; border:1px solid; font-size:0.8125rem; margin-bottom:0.75rem; }
        .ps-alert-err { background:var(--ps-err-bg); color:var(--ps-err-tx); border-color:var(--ps-err-br); }
        .ps-alert-ok  { background:var(--ps-ok-bg);  color:var(--ps-ok-tx);  border-color:var(--ps-ok-br); }

        .ps-form-panel {
          background:var(--ps-surface); border:1px solid var(--ps-border);
          border-radius:8px; overflow:hidden; margin-bottom:0.875rem;
        }
        .ps-form-head { padding:0.875rem 1.25rem; border-bottom:1px solid var(--ps-border); }
        .ps-form-title { font-size:0.8125rem; font-weight:700; margin-bottom:0.625rem; }
        .ps-tabs { display:flex; overflow-x:auto; gap:0; scrollbar-width:none; border-bottom:1px solid var(--ps-border); }
        .ps-tabs::-webkit-scrollbar { display:none; }
        .ps-tab {
          padding:0.5rem 0.875rem; font-size:0.75rem; font-weight:600;
          border:none; background:none; cursor:pointer; color:var(--ps-muted); white-space:nowrap;
          border-bottom:2px solid transparent; transition:color .15s, border-color .15s; margin-bottom:-1px;
        }
        .ps-tab:hover  { color:var(--ps-text); }
        .ps-tab.active { color:var(--ps-accent); border-bottom-color:var(--ps-accent); }

        .ps-form-body { padding:1.25rem; }
        .ps-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
        .ps-grid-4 { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:0.625rem; }
        @media(max-width:640px){ .ps-grid-2 { grid-template-columns:1fr; } .ps-grid-4 { grid-template-columns:1fr 1fr; } }

        .ps-field { margin-bottom:0.625rem; }
        .ps-field-label {
          display:block; margin-bottom:0.3rem; font-size:0.65rem; font-weight:700;
          text-transform:uppercase; letter-spacing:.06em; color:var(--ps-muted);
        }
        .ps-input, .ps-textarea, .ps-select {
          width:100%; padding:0.4rem 0.75rem; background:var(--ps-input-bg);
          border:1px solid var(--ps-border); border-radius:6px; color:var(--ps-text);
          font-size:0.8125rem; outline:none; transition:border-color .15s; box-sizing:border-box;
        }
        .ps-input::placeholder, .ps-textarea::placeholder { color:var(--ps-muted); }
        .ps-input:focus, .ps-textarea:focus, .ps-select:focus { border-color:var(--ps-accent); }
        .ps-textarea { resize:none; }

        .ps-sub-card {
          background:var(--ps-sub-bg); border:1px solid var(--ps-border);
          border-radius:6px; padding:0.875rem; margin-bottom:0.5rem;
        }
        .ps-sub-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; }
        .ps-sub-label { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--ps-muted); }
        .ps-remove-btn { font-size:0.7rem; font-weight:700; color:var(--ps-del-tx); background:none; border:none; cursor:pointer; }
        .ps-remove-btn:hover { opacity:.7; }

        .ps-add-row-btn {
          width:100%; padding:0.4rem; background:none;
          border:1px dashed var(--ps-border); border-radius:6px; color:var(--ps-muted);
          font-size:0.75rem; font-weight:600; cursor:pointer; transition:all .15s; margin-top:0.25rem;
        }
        .ps-add-row-btn:hover { border-color:var(--ps-accent); color:var(--ps-accent); }

        .ps-img-preview {
          width:100%; height:120px; border-radius:6px; overflow:hidden;
          border:1px solid var(--ps-border); margin-top:0.5rem;
        }
        .ps-img-preview img { width:100%; height:100%; object-fit:cover; }

        .ps-form-actions {
          display:flex; gap:0.5rem; padding:0.875rem 1.25rem;
          border-top:1px solid var(--ps-border); background:var(--ps-surface);
        }
        .ps-submit-btn {
          flex:1; padding:0.45rem 0.75rem; background:var(--ps-accent); color:#fff;
          border:none; border-radius:6px; font-size:0.8125rem; font-weight:600;
          cursor:pointer; transition:opacity .15s;
        }
        .ps-submit-btn:hover { opacity:.85; }
        .ps-cancel-btn {
          flex:1; padding:0.45rem 0.75rem; background:none; border:1px solid var(--ps-border);
          color:var(--ps-muted); border-radius:6px; font-size:0.8125rem; font-weight:600;
          cursor:pointer; transition:all .15s;
        }
        .ps-cancel-btn:hover { border-color:var(--ps-text); color:var(--ps-text); }

        .ps-stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
        .ps-stat-card {
          background:var(--ps-sub-bg); border:1px solid var(--ps-border); border-radius:6px; padding:0.625rem;
        }
        .ps-stat-n { font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--ps-muted); margin-bottom:0.375rem; }

        .ps-section-label {
          font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em;
          color:var(--ps-muted); margin:0.875rem 0 0.5rem; padding-top:0.875rem; border-top:1px solid var(--ps-border);
        }
        .ps-hint { font-size:0.75rem; color:var(--ps-muted); margin-bottom:0.625rem; }

        /* ── Cards grid ──────────────────────────────────────────────────────── */
        .ps-cards-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:0.75rem; }
        @media(max-width:640px){ .ps-cards-grid { grid-template-columns:1fr; } }

        .ps-card {
          background:var(--ps-surface); border:1px solid var(--ps-border);
          border-radius:8px; overflow:hidden; transition:box-shadow .2s, border-color .2s;
          cursor: grab;
        }
        .ps-card:active { cursor: grabbing; }
        .ps-card:hover  { box-shadow:0 4px 20px rgba(0,0,0,.1); }

        .ps-card-img      { width:100%; height:140px; object-fit:cover; display:block; transition:transform .3s; }
        .ps-card:hover .ps-card-img { transform:scale(1.03); }
        .ps-card-img-wrap { overflow:hidden; background:var(--ps-bg); position:relative; }

        /* Drag handle overlay on the image */
        .ps-card-drag-handle {
          position: absolute; top: 0.5rem; right: 0.5rem;
          width: 1.75rem; height: 1.75rem;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.55); border-radius: 4px;
          color: #fff; font-size: 1rem;
          opacity: 0; transition: opacity .2s;
          cursor: grab; user-select: none;
        }
        .ps-card:hover .ps-card-drag-handle { opacity: 1; }
        .ps-card-drag-handle:active { cursor: grabbing; }

        .ps-card-body   { padding:0.875rem 1rem; }
        .ps-card-slug   { font-size:0.65rem; font-weight:700; color:var(--ps-muted); margin-bottom:0.25rem; }
        .ps-card-title  { font-size:0.875rem; font-weight:700; margin-bottom:0.25rem; }
        .ps-card-desc   {
          font-size:0.75rem; color:var(--ps-muted); line-height:1.5; margin-bottom:0.5rem;
          display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
        }
        .ps-card-tags   { display:flex; flex-wrap:wrap; gap:0.25rem; margin-bottom:0.625rem; }
        .ps-tag {
          padding:0.1rem 0.4rem; border-radius:4px;
          font-size:0.65rem; font-weight:700;
          background:var(--ps-tag-bg); color:var(--ps-tag-tx);
        }
        .ps-card-actions {
          display:flex; gap:0.375rem; padding-top:0.625rem; border-top:1px solid var(--ps-border);
        }
        .ps-card-btn {
          flex:1; padding:0.3rem 0.5rem; font-size:0.7rem; font-weight:700;
          border-radius:5px; border:none; cursor:pointer; transition:opacity .15s;
        }
        .ps-card-btn:hover { opacity:.75; }
        .ps-card-btn-edit   { background:var(--ps-tag-bg); color:var(--ps-tag-tx); }
        .ps-card-btn-delete { background:var(--ps-del-bg); color:var(--ps-del-tx); }

        .ps-empty  { text-align:center; padding:2.5rem; font-size:0.8125rem; color:var(--ps-muted); grid-column:1/-1; }
        .ps-footer { font-size:0.75rem; color:var(--ps-muted); margin-top:0.5rem; }
        .ps-footer strong { color:var(--ps-text); }

        /* ── Drag & Drop states ─────────────────────────────────────────────── */
        .ps-order-hint {
          display:flex; align-items:center; gap:0.375rem;
          font-size:0.72rem; color:var(--ps-muted);
          margin-bottom:0.625rem; padding:0.3rem 0.5rem;
          border:1px dashed var(--ps-border); border-radius:6px;
          background:var(--ps-bg);
        }
        /* Card being dragged: handled via inline style in onDragStart */
        .ps-card-drag-over {
          outline: 2px solid var(--ps-accent);
          outline-offset: -2px;
        }
      `}</style>

      <div className="ps-root">
        {/* Header */}
        <div className="ps-header">
          <span className="ps-title">Primary Services</span>
          <button className={`ps-add-btn${showForm ? ' cancel' : ''}`}
            onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? '✕ Cancel' : '+ Add Service'}
          </button>
        </div>

        {error   && <div className="ps-alert ps-alert-err">{error}</div>}
        {success && <div className="ps-alert ps-alert-ok">{success}</div>}

        {/* Form */}
        {showForm && (
          <div className="ps-form-panel">
            <div className="ps-form-head">
              <div className="ps-form-title">{editingId ? 'Edit Service' : 'Add New Primary Service'}</div>
              <div className="ps-tabs">
                {[['basic','① Basic'],['details','② Details'],['process','③ Process'],['benefits','④ Benefits'],['projects','⑤ Projects']].map(([id, label]) => (
                  <button key={id} className={`ps-tab${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)}>{label}</button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ps-form-body">

                {/* BASIC */}
                {activeTab === 'basic' && (
                  <>
                    <div className="ps-grid-2" style={{ marginBottom: '0.625rem' }}>
                      <div className="ps-field">
                        <label className="ps-field-label">Slug *</label>
                        <input className="ps-input" type="text" placeholder="residential-construction"
                          value={formData.slug}
                          onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
                      </div>
                      <div className="ps-field">
                        <label className="ps-field-label">Title *</label>
                        <input className="ps-input" type="text" placeholder="Residential Construction"
                          value={formData.title} onChange={e => set('title', e.target.value)} />
                      </div>
                    </div>
                    <div className="ps-field">
                      <label className="ps-field-label">Short Description *</label>
                      <textarea className="ps-textarea" rows={2} placeholder="One-liner shown on service cards…"
                        value={formData.description} onChange={e => set('description', e.target.value)} />
                    </div>
                    <div className="ps-field">
                      <label className="ps-field-label">Hero Subtitle</label>
                      <textarea className="ps-textarea" rows={2} placeholder="Longer line below heading on detail page…"
                        value={formData.hero_subtitle} onChange={e => set('hero_subtitle', e.target.value)} />
                    </div>
                    <div className="ps-field">
                      <label className="ps-field-label">Hero Image URL *</label>
                      <input className="ps-input" type="url" placeholder="https://images.unsplash.com/…"
                        value={formData.image} onChange={e => set('image', e.target.value)} />
                      {formData.image && (
                        <div className="ps-img-preview"><img src={formData.image} alt="Preview" onError={e => { e.target.style.display = 'none'; }} /></div>
                      )}
                    </div>
                  </>
                )}

                {/* DETAILS */}
                {activeTab === 'details' && (
                  <>
                    <div className="ps-field">
                      <label className="ps-field-label">About Heading</label>
                      <input className="ps-input" type="text" placeholder="Homes Built to Last"
                        value={formData.about_heading} onChange={e => set('about_heading', e.target.value)} />
                    </div>
                    <div className="ps-field">
                      <label className="ps-field-label">About Body</label>
                      <textarea className="ps-textarea" rows={3} placeholder="Detailed paragraph shown in the About section…"
                        value={formData.about_body} onChange={e => set('about_body', e.target.value)} />
                    </div>
                    <div className="ps-section-label">4 Stat Cards</div>
                    <div className="ps-stat-grid">
                      {[1,2,3,4].map(n => (
                        <div key={n} className="ps-stat-card">
                          <div className="ps-stat-n">Stat {n}</div>
                          <input className="ps-input" style={{ marginBottom: '0.375rem' }} type="text" placeholder="500+"
                            value={formData[`stat${n}_value`]} onChange={e => set(`stat${n}_value`, e.target.value)} />
                          <input className="ps-input" type="text" placeholder="Units Delivered"
                            value={formData[`stat${n}_label`]} onChange={e => set(`stat${n}_label`, e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <div className="ps-section-label">CTA &amp; Contact</div>
                    <div className="ps-field">
                      <label className="ps-field-label">CTA Heading</label>
                      <input className="ps-input" type="text" placeholder="Start Your Dream Project Today"
                        value={formData.cta_heading} onChange={e => set('cta_heading', e.target.value)} />
                    </div>
                    <div className="ps-grid-2">
                      <div className="ps-field">
                        <label className="ps-field-label">Phone</label>
                        <input className="ps-input" type="text" placeholder="+91 98765 43210"
                          value={formData.contact_phone} onChange={e => set('contact_phone', e.target.value)} />
                      </div>
                      <div className="ps-field">
                        <label className="ps-field-label">Email</label>
                        <input className="ps-input" type="text" placeholder="hello@mtboss.in"
                          value={formData.contact_email} onChange={e => set('contact_email', e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                {/* PROCESS */}
                {activeTab === 'process' && (
                  <>
                    <p className="ps-hint">Up to 6 steps for the "How We Work" section.</p>
                    {formData.process.map((row, i) => (
                      <div key={i} className="ps-sub-card">
                        <div className="ps-sub-head">
                          <span className="ps-sub-label">Step {i + 1}</span>
                          <button type="button" className="ps-remove-btn" onClick={() => removeRow('process', i)}>✕ Remove</button>
                        </div>
                        <div className="ps-grid-2" style={{ marginBottom: '0.375rem' }}>
                          <input className="ps-input" type="text" placeholder="01"
                            value={row.step} onChange={e => updateRow('process', i, 'step', e.target.value)} />
                          <input className="ps-input" type="text" placeholder="Step Title"
                            value={row.title} onChange={e => updateRow('process', i, 'title', e.target.value)} />
                        </div>
                        <textarea className="ps-textarea" rows={2} placeholder="Step description…"
                          value={row.desc} onChange={e => updateRow('process', i, 'desc', e.target.value)} />
                      </div>
                    ))}
                    {formData.process.length < 6 && (
                      <button type="button" className="ps-add-row-btn" onClick={() => addRow('process', emptyProcess)}>+ Add Step</button>
                    )}
                  </>
                )}

                {/* BENEFITS */}
                {activeTab === 'benefits' && (
                  <>
                    <p className="ps-hint">Up to 6 cards for the "Why Choose Us" section.</p>
                    {formData.benefits.map((row, i) => (
                      <div key={i} className="ps-sub-card">
                        <div className="ps-sub-head">
                          <span className="ps-sub-label">Benefit {i + 1}</span>
                          <button type="button" className="ps-remove-btn" onClick={() => removeRow('benefits', i)}>✕ Remove</button>
                        </div>
                        <div className="ps-grid-2" style={{ marginBottom: '0.375rem' }}>
                          <input className="ps-input" type="text" placeholder="🏗️"
                            value={row.icon} onChange={e => updateRow('benefits', i, 'icon', e.target.value)} />
                          <input className="ps-input" type="text" placeholder="Benefit Title"
                            value={row.title} onChange={e => updateRow('benefits', i, 'title', e.target.value)} />
                        </div>
                        <textarea className="ps-textarea" rows={2} placeholder="Benefit description…"
                          value={row.desc} onChange={e => updateRow('benefits', i, 'desc', e.target.value)} />
                      </div>
                    ))}
                    {formData.benefits.length < 6 && (
                      <button type="button" className="ps-add-row-btn" onClick={() => addRow('benefits', emptyBenefit)}>+ Add Benefit</button>
                    )}
                  </>
                )}

                {/* PROJECTS */}
                {activeTab === 'projects' && (
                  <>
                    <p className="ps-hint">Up to 3 project reference cards.</p>
                    {formData.projects.map((row, i) => (
                      <div key={i} className="ps-sub-card">
                        <div className="ps-sub-head">
                          <span className="ps-sub-label">Project {i + 1}</span>
                          <button type="button" className="ps-remove-btn" onClick={() => removeRow('projects', i)}>✕ Remove</button>
                        </div>
                        <div className="ps-grid-2" style={{ marginBottom: '0.375rem' }}>
                          <input className="ps-input" type="text" placeholder="Project Name, City"
                            value={row.name} onChange={e => updateRow('projects', i, 'name', e.target.value)} />
                          <input className="ps-input" type="text" placeholder="Type (e.g. Luxury Villas)"
                            value={row.type} onChange={e => updateRow('projects', i, 'type', e.target.value)} />
                        </div>
                        <div className="ps-grid-2" style={{ marginBottom: '0.375rem' }}>
                          <input className="ps-input" type="text" placeholder="48 Units / 1.2L sq.ft"
                            value={row.area} onChange={e => updateRow('projects', i, 'area', e.target.value)} />
                          <select className="ps-select" value={row.status} onChange={e => updateRow('projects', i, 'status', e.target.value)}>
                            <option value="Delivered">Delivered</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Upcoming">Upcoming</option>
                          </select>
                        </div>
                        <input className="ps-input" type="url" placeholder="Image URL" style={{ marginBottom: '0.375rem' }}
                          value={row.img} onChange={e => updateRow('projects', i, 'img', e.target.value)} />
                        {row.img && (
                          <div className="ps-img-preview"><img src={row.img} alt="preview" onError={e => { e.target.style.display = 'none'; }} /></div>
                        )}
                      </div>
                    ))}
                    {formData.projects.length < 3 && (
                      <button type="button" className="ps-add-row-btn" onClick={() => addRow('projects', emptyProject)}>+ Add Project</button>
                    )}
                  </>
                )}
              </div>

              <div className="ps-form-actions">
                <button type="submit" className="ps-submit-btn">
                  {editingId ? '💾 Update Service' : '✅ Add Service'}
                </button>
                <button type="button" className="ps-cancel-btn" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Drag hint */}
        {services.length > 1 && !showForm && (
          <div className="ps-order-hint">
            <span style={{ fontSize: '1rem' }}>⠿</span>
            Drag cards to reorder • order is saved instantly and reflects on the frontend
            {orderSaving && (
              <span style={{ marginLeft: 'auto', color: 'var(--ps-accent)', fontStyle: 'italic' }}>
                saving…
              </span>
            )}
          </div>
        )}

        {/* Service cards — draggable */}
        <div className="ps-cards-grid">
          {services.length > 0 ? services.map((s, index) => (
            <div
              key={s.id}
              className={[
                'ps-card',
                dragOverIndex === index && dragIndex !== index ? 'ps-card-drag-over' : '',
              ].filter(Boolean).join(' ')}
              draggable
              onDragStart={e => onDragStart(e, index)}
              onDragOver={e => onDragOver(e, index)}
              onDrop={e => onDrop(e, index)}
              onDragEnd={onDragEnd}
            >
              <div className="ps-card-img-wrap">
                <img className="ps-card-img" src={s.image} alt={s.title} />
                {/* Drag handle visible on hover */}
                <div className="ps-card-drag-handle" title="Drag to reorder">⠿</div>
              </div>
              <div className="ps-card-body">
                <div className="ps-card-slug">/{s.slug}</div>
                <div className="ps-card-title">{s.title}</div>
                <div className="ps-card-desc">{s.description}</div>
                <div className="ps-card-tags">
                  {Array.isArray(s.process)  && s.process.length  > 0 && <span className="ps-tag">{s.process.length} Steps</span>}
                  {Array.isArray(s.benefits) && s.benefits.length > 0 && <span className="ps-tag">{s.benefits.length} Benefits</span>}
                  {Array.isArray(s.projects) && s.projects.length > 0 && <span className="ps-tag">{s.projects.length} Projects</span>}
                </div>
                <div className="ps-card-actions">
                  <button className="ps-card-btn ps-card-btn-edit"
                    onClick={e => { e.stopPropagation(); handleEdit(s); }}>✏ Edit</button>
                  <button className="ps-card-btn ps-card-btn-delete"
                    onClick={e => { e.stopPropagation(); handleDelete(s.id); }}>🗑 Delete</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="ps-empty">No primary services yet. Add one to get started.</div>
          )}
        </div>

        <p className="ps-footer">Total: <strong>{services.length}</strong></p>
      </div>
    </>
  );
}
