'use client';

import { useState, useEffect, useRef } from 'react';

function th(dark) {
  return {
    bg:       dark ? '#000000' : '#f8f9fa',
    card:     dark ? '#111111' : '#ffffff',
    text:     dark ? '#ffffff' : '#111827',
    sub:      dark ? '#71717a' : '#6b7280',
    muted:    dark ? '#52525b' : '#9ca3af',
    border:   dark ? '#27272a' : '#e5e7eb',
    inputBg:  dark ? '#0a0a0a' : '#f9fafb',
    accent:   dark ? '#facc15' : '#111827',
    accentFg: dark ? '#000000' : '#ffffff',
    rowHov:   dark ? '#1a1a1a' : '#f9fafb',
    tHead:    dark ? '#0a0a0a' : '#f3f4f6',
  };
}

const EMPTY = {
  label: 'Engineering Excellence',
  title: '',
  subtitle: '',
  description: '',
  image_url: '',
  cloudinary_public_id: '',
  sort_order: 0,
  is_active: true,
};

export default function HeroBannersManager({ isDarkMode }) {
  const t = th(isDarkMode);
  const [banners, setBanners]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [preview, setPreview]     = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [urlMode, setUrlMode]     = useState(false); // toggle between upload vs paste URL
  const fileRef = useRef(null);

  const token = () =>
    typeof window !== 'undefined'
      ? localStorage.getItem('admin-token') || localStorage.getItem('token') || ''
      : '';

  // ── fetch ──────────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hero-banners', {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) setBanners(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // ── open add / edit ────────────────────────────────────────────────────────
  const openAdd = () => {
    const nextOrder = banners.length > 0 ? Math.max(...banners.map(b => b.sort_order)) + 1 : 0;
    setForm({ ...EMPTY, sort_order: nextOrder });
    setPreview('');
    setEditing(null);
    setUrlMode(false);
    setShowForm(true);
  };

  const openEdit = (b) => {
    setForm({
      label:                b.label || 'Engineering Excellence',
      title:                b.title,
      subtitle:             b.subtitle || '',
      description:          b.description || '',
      image_url:            b.image_url,
      cloudinary_public_id: b.cloudinary_public_id || '',
      sort_order:           b.sort_order ?? 0,
      is_active:            b.is_active ?? true,
    });
    setPreview(b.image_url);
    setEditing(b);
    setUrlMode(false);
    setShowForm(true);
  };

  // ── Cloudinary upload ──────────────────────────────────────────────────────
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      fd.append('folder', 'mtboss/hero-banners');

      const res  = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: fd }
      );
      const data = await res.json();
      if (data.secure_url) {
        setForm(f => ({ ...f, image_url: data.secure_url, cloudinary_public_id: data.public_id }));
        setPreview(data.secure_url);
      } else {
        alert('Upload failed. Check Cloudinary config.');
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      alert('Upload failed. Check console.');
    } finally {
      setUploading(false);
    }
  };

  // ── save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) { alert('Title is required.'); return; }
    if (!form.image_url.trim()) { alert('Banner image is required.'); return; }
    setSaving(true);
    try {
      const method = editing ? 'PATCH' : 'POST';
      const body   = editing ? { ...form, id: editing.id } : form;
      const res    = await fetch('/api/hero-banners', {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        if (editing) {
          setBanners(prev => prev.map(b => b.id === editing.id ? data.data : b));
        } else {
          setBanners(prev => [...prev, data.data].sort((a, b) => a.sort_order - b.sort_order));
        }
        setShowForm(false);
      } else {
        alert(data.error || 'Save failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error.');
    } finally {
      setSaving(false);
    }
  };

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res  = await fetch('/api/hero-banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setBanners(prev => prev.filter(b => b.id !== id));
        setDeleteId(null);
      }
    } catch (err) { console.error(err); }
  };

  // ── toggle active ──────────────────────────────────────────────────────────
  const toggleActive = async (b) => {
    try {
      const res  = await fetch('/api/hero-banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ id: b.id, ...b, is_active: !b.is_active }),
      });
      const data = await res.json();
      if (data.success) setBanners(prev => prev.map(x => x.id === b.id ? data.data : x));
    } catch (err) { console.error(err); }
  };

  // ── move order ─────────────────────────────────────────────────────────────
  const moveOrder = async (b, dir) => {
    const sorted  = [...banners].sort((a, x) => a.sort_order - x.sort_order);
    const idx     = sorted.findIndex(x => x.id === b.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const s = sorted[swapIdx];
    const [newA, newS] = [s.sort_order, a.sort_order];

    await Promise.all([
      fetch('/api/hero-banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ id: a.id, ...a, sort_order: newA }),
      }),
      fetch('/api/hero-banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ id: s.id, ...s, sort_order: newS }),
      }),
    ]);
    load();
  };

  const inp = (field) => ({
    value: form[field],
    onChange: e => setForm(f => ({ ...f, [field]: e.target.value })),
    style: {
      width: '100%', boxSizing: 'border-box',
      background: t.inputBg, color: t.text,
      border: `1px solid ${t.border}`, borderRadius: '4px',
      padding: '9px 12px', fontSize: '13px', outline: 'none',
    },
  });

  const sorted = [...banners].sort((a, b) => a.sort_order - b.sort_order);

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: t.bg, minHeight: '100vh', padding: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ color: t.accent, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Admin Panel</p>
          <h2 style={{ color: t.text, margin: '0 0 4px', fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            Hero Banners
          </h2>
          <p style={{ color: t.sub, margin: 0, fontSize: '12px' }}>Manage the homepage hero slider — images, headings, and order.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={load}
            style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '4px', padding: '8px 14px', color: t.sub, cursor: 'pointer', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            ↺ Refresh
          </button>
          <button onClick={openAdd}
            style={{ background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', padding: '8px 18px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            + Add Banner
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total',    val: banners.length,                           color: t.sub     },
          { label: 'Active',   val: banners.filter(b => b.is_active).length,  color: '#22c55e' },
          { label: 'Inactive', val: banners.filter(b => !b.is_active).length, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '10px', color: t.sub, marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Banner list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: t.sub, fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Loading…</div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', border: `1px solid ${t.border}`, borderRadius: '4px' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>🖼️</div>
          <p style={{ color: t.text, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>No banners yet</p>
          <p style={{ color: t.sub, fontSize: '12px', margin: '0 0 16px' }}>Add your first hero banner to get started.</p>
          <button onClick={openAdd}
            style={{ background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            + Add Banner
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sorted.map((b, i) => (
            <div key={b.id}
              style={{ background: t.card, border: `1px solid ${b.is_active ? t.border : '#52525b'}`, borderRadius: '6px', display: 'flex', gap: '16px', alignItems: 'center', padding: '14px 16px', opacity: b.is_active ? 1 : 0.55 }}>

              {/* Thumbnail */}
              <div style={{ width: 90, height: 56, borderRadius: '4px', overflow: 'hidden', flexShrink: 0, background: t.inputBg, border: `1px solid ${t.border}` }}>
                <img src={b.image_url} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{b.label}</span>
                  <span style={{ fontSize: '10px', color: b.is_active ? '#22c55e' : '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>
                    {b.is_active ? '● Active' : '○ Inactive'}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                {b.subtitle && <div style={{ fontSize: '12px', color: t.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.subtitle}</div>}
                {b.description && <div style={{ fontSize: '11px', color: t.muted, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.description}</div>}
              </div>

              {/* Order + actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {/* Up/Down */}
                <button onClick={() => moveOrder(b, -1)} disabled={i === 0}
                  style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '3px', width: '26px', height: '26px', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? t.muted : t.sub, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i === 0 ? 0.4 : 1 }}>▲</button>
                <button onClick={() => moveOrder(b, 1)} disabled={i === sorted.length - 1}
                  style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '3px', width: '26px', height: '26px', cursor: i === sorted.length - 1 ? 'default' : 'pointer', color: i === sorted.length - 1 ? t.muted : t.sub, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i === sorted.length - 1 ? 0.4 : 1 }}>▼</button>

                <button onClick={() => toggleActive(b)}
                  style={{ background: b.is_active ? '#14532d22' : '#1e293b', border: `1px solid ${b.is_active ? '#22c55e' : t.border}`, borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', color: b.is_active ? '#22c55e' : t.muted, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {b.is_active ? 'Deactivate' : 'Activate'}
                </button>

                <button onClick={() => openEdit(b)}
                  style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '4px', padding: '4px 12px', cursor: 'pointer', color: t.sub, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Edit
                </button>

                <button onClick={() => setDeleteId(b.id)}
                  style={{ background: 'none', border: '1px solid #ef4444', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', color: '#ef4444', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowForm(false)}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '6px', width: '100%', maxWidth: '560px', padding: '28px', position: 'relative', maxHeight: '92vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>

            <button onClick={() => setShowForm(false)}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: `1px solid ${t.border}`, borderRadius: '2px', width: '28px', height: '28px', cursor: 'pointer', color: t.sub, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

            <p style={{ color: t.accent, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Hero Banners</p>
            <h3 style={{ color: t.text, margin: '0 0 24px', fontSize: '17px', fontWeight: 800 }}>{editing ? 'Edit Banner' : 'Add New Banner'}</h3>

            {/* Label */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Accent Label <span style={{ color: t.muted }}>(e.g. "Engineering Excellence")</span></label>
              <input {...inp('label')} placeholder="Engineering Excellence" />
            </div>

            {/* Title */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Title (Yellow Heading) <span style={{ color: '#ef4444' }}>*</span></label>
              <input {...inp('title')} placeholder="Sustainable Technology Led" />
            </div>

            {/* Subtitle */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Subtitle (White Heading)</label>
              <input {...inp('subtitle')} placeholder="Engineering, Procurement & Construction" />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Description</label>
              <textarea {...inp('description')} rows={3}
                placeholder="We provide simple and innovative solutions…"
                style={{ ...inp('description').style, resize: 'vertical', lineHeight: 1.6 }} />
            </div>

            {/* Image */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Banner Image <span style={{ color: '#ef4444' }}>*</span></label>

              {/* Toggle tabs */}
              <div style={{ display: 'flex', gap: '0', marginBottom: '10px', border: `1px solid ${t.border}`, borderRadius: '4px', overflow: 'hidden', width: 'fit-content' }}>
                {[{ v: false, l: '⬆ Upload' }, { v: true, l: '🔗 Paste URL' }].map(({ v, l }) => (
                  <button key={String(v)} onClick={() => setUrlMode(v)}
                    style={{ padding: '6px 16px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', border: 'none', cursor: 'pointer', background: urlMode === v ? t.accent : t.inputBg, color: urlMode === v ? t.accentFg : t.sub }}>
                    {l}
                  </button>
                ))}
              </div>

              {urlMode ? (
                <input
                  value={form.image_url}
                  onChange={e => { setForm(f => ({ ...f, image_url: e.target.value, cloudinary_public_id: '' })); setPreview(e.target.value); }}
                  placeholder="https://images.unsplash.com/…"
                  style={{ width: '100%', boxSizing: 'border-box', background: t.inputBg, color: t.text, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '9px 12px', fontSize: '13px', outline: 'none' }}
                />
              ) : (
                <div>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} style={{ display: 'none' }} />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    style={{ background: t.inputBg, border: `1px dashed ${t.border}`, borderRadius: '4px', padding: '12px 20px', cursor: 'pointer', color: t.sub, fontSize: '12px', fontWeight: 600, width: '100%' }}>
                    {uploading ? '⏳ Uploading to Cloudinary…' : '📁 Click to choose image (JPG / PNG / WEBP)'}
                  </button>
                </div>
              )}

              {/* Preview */}
              {preview && (
                <div style={{ marginTop: '10px', borderRadius: '4px', overflow: 'hidden', border: `1px solid ${t.border}`, maxHeight: '160px' }}>
                  <img src={preview} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </div>

            {/* Sort order + Active */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Sort Order</label>
                <input type="number" min="0"
                  value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: t.inputBg, color: t.text, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '9px 12px', fontSize: '13px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Status</label>
                <select value={form.is_active ? 'active' : 'inactive'}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.value === 'active' }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: t.inputBg, color: t.text, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '9px 12px', fontSize: '13px', outline: 'none' }}>
                  <option value="active">Active (visible)</option>
                  <option value="inactive">Inactive (hidden)</option>
                </select>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving || uploading}
              style={{ width: '100%', background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', padding: '13px', cursor: saving ? 'default' : 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : editing ? '✓ Update Banner' : '+ Add Banner'}
            </button>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setDeleteId(null)}>
          <div style={{ background: t.card, border: `1px solid #ef4444`, borderRadius: '6px', width: '100%', maxWidth: '360px', padding: '28px', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ color: t.text, margin: '0 0 8px', fontSize: '16px', fontWeight: 800 }}>Delete Banner?</h3>
            <p style={{ color: t.sub, fontSize: '13px', margin: '0 0 24px' }}>This will permanently remove the banner from the homepage slider.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)}
                style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '4px', padding: '9px 20px', cursor: 'pointer', color: t.sub, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                style={{ background: '#ef4444', border: 'none', borderRadius: '4px', padding: '9px 20px', cursor: 'pointer', color: '#fff', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
