'use client';
import { useEffect, useState, useCallback, useRef } from 'react';

/* ── theme ──────────────────────────────────────────────────────────────────── */
function th(d) {
  return {
    bg:       d ? '#000000' : '#f8f9fa',
    card:     d ? '#111111' : '#ffffff',
    text:     d ? '#ffffff' : '#111827',
    sub:      d ? '#71717a' : '#6b7280',
    muted:    d ? '#52525b' : '#9ca3af',
    border:   d ? '#27272a' : '#e5e7eb',
    inputBg:  d ? '#0a0a0a' : '#f9fafb',
    accent:   d ? 'var(--brand-blue)' : '#111827',
    accentFg: d ? '#000000' : '#ffffff',
    tHead:    d ? '#0a0a0a' : '#f3f4f6',
    rowHov:   d ? '#1a1a1a' : '#f9fafb',
    tagBg:    d ? '#1c1c1c' : '#f3f4f6',
  };
}

/* ── Cloudinary uploader ─────────────────────────────────────────────────── */
async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  fd.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  );
  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error(data.error?.message || 'Upload failed');
}

/* ── Image upload field ──────────────────────────────────────────────────── */
function ImageUpload({ value, onChange, t }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setErr('');
    try { onChange(await uploadToCloudinary(file)); }
    catch (e) { setErr(e.message); }
    finally { setUploading(false); }
  }

  return (
    <div>
      <label style={{ fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
        Category Image
      </label>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {value && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={value} alt="preview" style={{ width: '64px', height: '64px', objectFit: 'cover', border: `1px solid ${t.border}`, borderRadius: '4px' }} />
            <button type="button" onClick={() => onChange('')}
              style={{ position: 'absolute', top: '-7px', right: '-7px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        )}
        <label style={{ flex: 1, border: `1px dashed ${t.border}`, borderRadius: '4px', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: t.inputBg }}>
          <span style={{ fontSize: '18px' }}>{uploading ? '⏳' : '📁'}</span>
          <span style={{ fontSize: '12px', color: t.sub, fontWeight: 600 }}>
            {uploading ? 'Uploading…' : value ? 'Replace image' : 'Click to upload image'}
          </span>
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>
      {err && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0' }}>{err}</p>}
    </div>
  );
}

/* ── Dynamic tag-list editor (for types / subcategories) ─────────────────── */
function TagListEditor({ label, helpText, items, onChange, placeholder, t }) {
  const [inputVal, setInputVal] = useState('');

  const addItem = () => {
    const val = inputVal.trim();
    if (!val) return;
    if (items.includes(val)) { setInputVal(''); return; }
    onChange([...items, val]);
    setInputVal('');
  };

  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));

  const inp = {
    border: `1px solid ${t.border}`, borderRadius: '4px', padding: '8px 10px',
    background: t.inputBg, color: t.text, fontSize: '12px', outline: 'none',
    fontFamily: 'inherit', flex: 1,
  };

  return (
    <div style={{ marginBottom: '4px' }}>
      <label style={{ fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '4px' }}>
        {label}
      </label>
      {helpText && <p style={{ fontSize: '11px', color: t.muted, marginBottom: '8px' }}>{helpText}</p>}

      {/* existing items */}
      {items.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          {items.map((item, idx) => (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: t.tagBg, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '3px 8px', fontSize: '11px', color: t.text, fontWeight: 600 }}>
              {item}
              <button type="button" onClick={() => removeItem(idx)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '11px', padding: 0, lineHeight: 1 }}>
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* add new */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <input
          style={inp}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
          placeholder={placeholder || 'Type and press Add or Enter'}
        />
        <button
          type="button"
          onClick={addItem}
          style={{ padding: '8px 14px', background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Add
        </button>
      </div>
      <p style={{ fontSize: '10px', color: t.muted, marginTop: '4px' }}>
        &quot;Others&quot; option is added automatically for customers.
      </p>
    </div>
  );
}

/* ── colour options ──────────────────────────────────────────────────────── */
const COLOR_OPTIONS = [
  { value: 'yellow', label: 'Blue',    dot: 'var(--brand-blue)' },
  { value: 'blue',   label: 'Blue',    dot: '#2563eb' },
  { value: 'green',  label: 'Green',   dot: '#16a34a' },
  { value: 'red',    label: 'Red',     dot: '#dc2626' },
  { value: 'purple', label: 'Purple',  dot: '#9333ea' },
  { value: 'pink',   label: 'Pink',    dot: '#db2777' },
  { value: 'orange', label: 'Orange',  dot: '#ea580c' },
  { value: 'amber',  label: 'Deep Blue', dot: 'var(--brand-blue-deep)' },
  { value: 'cyan',   label: 'Cyan',    dot: '#0891b2' },
  { value: 'gray',   label: 'Gray',    dot: '#6b7280' },
];

const EMPTY = { name: '', emoji: '🛒', label: '', label_color: 'yellow', price_range: '', unit: '' };

const INDIAN_CITIES = [
  'Agra','Ahmedabad','Ajmer','Aligarh','Allahabad','Amritsar','Aurangabad',
  'Bangalore','Bareilly','Bhopal','Bhubaneswar','Chandigarh','Chennai',
  'Coimbatore','Dehradun','Delhi','Dhanbad','Faridabad','Ghaziabad',
  'Guwahati','Gwalior','Howrah','Hubli-Dharwad','Hyderabad','Indore',
  'Jabalpur','Jaipur','Jalandhar','Jodhpur','Kanpur','Kochi','Kolkata',
  'Kota','Lucknow','Ludhiana','Madurai','Mangalore','Meerut','Moradabad',
  'Mumbai','Mysore','Nagpur','Nashik','Noida','Patna','Pune','Raipur',
  'Rajkot','Ranchi','Srinagar','Surat','Thane','Thiruvananthapuram',
  'Varanasi','Vijayawada','Visakhapatnam','Vadodara',
];

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════ */
export default function ShopCategoriesManager({ isDarkMode }) {
  const t = th(isDarkMode);

  const [cats, setCats]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [view, setView]             = useState('list');   // 'list' | 'form'
  const [editCat, setEditCat]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [image, setImage]           = useState('');
  const [types, setTypes]           = useState([]);           // array of strings
  const [subcategories, setSubs]    = useState([]);           // array of strings
  const [cityPrices, setCityPrices] = useState({});          // { "Delhi": { price_range, unit } }
  const [pendingCity, setPendingCity] = useState('');       // city selected in the "Add City" dropdown
  const [saving, setSaving]         = useState(false);
  const [msg, setMsg]               = useState({ text: '', type: '' });
  const [orderSaving, setOrderSaving] = useState(false);

  /* drag */
  const dragIdx  = useRef(null);
  const dragOver = useRef(null);

  const token = () => localStorage.getItem('admin-token') || localStorage.getItem('token');

  /* ── fetch ──────────────────────────────────────────────────────────── */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/shop-categories?admin=true', {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const d = await res.json();
      if (d.success) setCats(d.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function flash(text, type = 'success') {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  }

  function resetForm() {
    setEditCat(null);
    setForm(EMPTY);
    setImage('');
    setTypes([]);
    setSubs([]);
    setCityPrices({});
    setPendingCity('');
  }

  function openAdd() { resetForm(); setView('form'); }

  function openEdit(cat) {
    setEditCat(cat);
    setForm({
      name: cat.name || '', emoji: cat.emoji || '🛒',
      label: cat.label || '', label_color: cat.label_color || 'yellow',
      price_range: cat.price_range || '', unit: cat.unit || '',
    });
    setImage(cat.image || '');
    setTypes(Array.isArray(cat.types) ? cat.types : []);
    setSubs(Array.isArray(cat.subcategories) ? cat.subcategories : []);
    // city_prices may arrive as JSONB object, string, or null
    let cp = cat.city_prices;
    if (typeof cp === 'string') { try { cp = JSON.parse(cp); } catch { cp = {}; } }
    setCityPrices(cp && typeof cp === 'object' && !Array.isArray(cp) ? cp : {});
    setPendingCity('');
    setView('form');
  }

  /* ── save ───────────────────────────────────────────────────────────── */
  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) { flash('Name is required.', 'error'); return; }
    setSaving(true);
    try {
      const payload = { ...form, image: image || null, types, subcategories, city_prices: cityPrices };
      let res;
      if (editCat) {
        res = await fetch('/api/shop-categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
          body: JSON.stringify({ id: editCat.id, ...payload }),
        });
      } else {
        res = await fetch('/api/shop-categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      flash(editCat ? 'Category updated.' : 'Category added.');
      resetForm();
      setView('list');
      load();
    } catch (err) { flash(err.message, 'error'); }
    finally { setSaving(false); }
  }

  /* ── toggle active ──────────────────────────────────────────────────── */
  async function toggleActive(cat) {
    const res = await fetch('/api/shop-categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({
        ...cat, id: cat.id, is_active: !cat.is_active,
        types: cat.types || [], subcategories: cat.subcategories || [],
      }),
    });
    const d = await res.json();
    if (d.success) {
      setCats(prev => prev.map(c => c.id === cat.id ? { ...c, is_active: !c.is_active } : c));
      flash(`Category ${!cat.is_active ? 'shown' : 'hidden'} on ShopNow page.`);
    }
  }

  /* ── delete ─────────────────────────────────────────────────────────── */
  async function deleteCat(id) {
    if (!confirm('Delete this category permanently?')) return;
    const res = await fetch(`/api/shop-categories?id=${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token()}` },
    });
    if (res.ok) {
      setCats(prev => prev.filter(c => c.id !== id));
      flash('Category deleted.');
    }
  }

  /* ── drag & drop reorder ─────────────────────────────────────────────── */
  function onDragStart(i) { dragIdx.current = i; }
  function onDragEnter(i) { dragOver.current = i; }
  function onDragEnd() {
    const from = dragIdx.current;
    const to   = dragOver.current;
    if (from === null || to === null || from === to) { dragIdx.current = dragOver.current = null; return; }
    const reordered = [...cats];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setCats(reordered);
    dragIdx.current = dragOver.current = null;
    saveOrder(reordered);
  }

  async function saveOrder(ordered) {
    setOrderSaving(true);
    try {
      await fetch('/api/shop-categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ items: ordered.map((c, i) => ({ id: c.id, sort_order: i })) }),
      });
      flash('Order saved.');
    } catch { flash('Failed to save order.', 'error'); }
    finally { setOrderSaving(false); }
  }

  /* ── styles ─────────────────────────────────────────────────────────── */
  const inp = {
    border: `1px solid ${t.border}`, borderRadius: '4px', padding: '9px 12px',
    background: t.inputBg, color: t.text, fontSize: '13px', outline: 'none',
    width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
  };
  const lbl = {
    fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase',
    letterSpacing: '0.07em', display: 'block', marginBottom: '4px',
  };

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ background: t.bg, minHeight: '100vh', padding: '24px' }}>
      <style>{`
        .sc-row:hover td { background: ${t.rowHov} !important; }
        .sc-inp:focus { outline: none; border-color: ${t.accent} !important; }
        .sc-inp::placeholder { color: ${t.muted}; }
        .sc-drag-row { transition: opacity 0.15s; }
        .sc-drag-row:hover { cursor: grab; }
        .sc-drag-row:active { cursor: grabbing; }
      `}</style>

      {/* ── Flash ────────────────────────────────────────────────────── */}
      {msg.text && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, background: msg.type === 'error' ? '#ef4444' : '#22c55e', color: '#fff', padding: '10px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          {msg.type === 'error' ? '✕' : '✓'} {msg.text}
        </div>
      )}

      {/* ── FORM VIEW ────────────────────────────────────────────────── */}
      {view === 'form' && (
        <div>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <button onClick={() => { resetForm(); setView('list'); }}
              style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '4px', padding: '7px 14px', color: t.sub, cursor: 'pointer', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              ← Back
            </button>
            <div>
              <p style={{ color: t.accent, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>Shop Categories</p>
              <h2 style={{ color: t.text, margin: 0, fontSize: '18px', fontWeight: 800, textTransform: 'uppercase' }}>
                {editCat ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '32px', maxWidth: '700px' }}>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

                {/* Name */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={lbl}>Category Name *</label>
                  <input className="sc-inp" style={inp} value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Cement & Concrete" />
                </div>

                {/* Emoji */}
                <div>
                  <label style={lbl}>Emoji (fallback icon)</label>
                  <input className="sc-inp" style={inp} value={form.emoji}
                    onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🧱" maxLength={4} />
                </div>

                {/* Badge Label */}
                <div>
                  <label style={lbl}>Badge Label</label>
                  <input className="sc-inp" style={inp} value={form.label}
                    onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. HIGH VOLUME" />
                </div>

                {/* Badge Colour */}
                <div>
                  <label style={lbl}>Badge Colour</label>
                  <select className="sc-inp" style={inp} value={form.label_color}
                    onChange={e => setForm(f => ({ ...f, label_color: e.target.value }))}>
                    {COLOR_OPTIONS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                {(form.label || form.emoji) && (
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: t.tagBg, border: `1px solid ${t.border}`, borderRadius: '4px' }}>
                    <span style={{ fontSize: '32px' }}>{form.emoji}</span>
                    <div>
                      <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: 800, color: t.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</p>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: t.text }}>{form.name || '—'}</p>
                      {form.label && (
                        <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: COLOR_OPTIONS.find(c => c.value === form.label_color)?.dot || t.accent }}>
                          {form.label}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Image */}
                <div style={{ gridColumn: 'span 2' }}>
                  <ImageUpload value={image} onChange={setImage} t={t} />
                </div>

                {/* ── Types ─────────────────────────────────────────── */}
                <div style={{ gridColumn: 'span 2', borderTop: `1px solid ${t.border}`, paddingTop: '20px', marginTop: '4px' }}>
                  <TagListEditor
                    label="Product Types"
                    helpText="These appear as dropdown options when a customer requests a quote for this category."
                    items={types}
                    onChange={setTypes}
                    placeholder='e.g. "OPC 43 Grade", "PPC", "White Cement"'
                    t={t}
                  />
                </div>

                {/* ── Subcategories ──────────────────────────────────── */}
                <div style={{ gridColumn: 'span 2' }}>
                  <TagListEditor
                    label="Sub-categories (Optional)"
                    helpText="Optional secondary classification shown after the type selection."
                    items={subcategories}
                    onChange={setSubs}
                    placeholder='e.g. "Rapid Setting", "Sulphate Resistant"'
                    t={t}
                  />
                </div>

                {/* ── City-wise Pricing ──────────────────────────────── */}
                <div style={{ gridColumn: 'span 2', borderTop: `1px solid ${t.border}`, paddingTop: '20px', marginTop: '4px' }}>
                  <label style={{ ...lbl, display: 'block', marginBottom: '4px' }}>City-wise Pricing</label>
                  <p style={{ fontSize: '11px', color: t.muted, marginBottom: '12px' }}>
                    Set separate prices per city. Users see their city's price when they request a quote. If no city price is set, users are told the price will be quoted by a verified supplier.
                  </p>

                  {/* Add city row */}
                  {(() => {
                    const available = INDIAN_CITIES.filter(c => !Object.prototype.hasOwnProperty.call(cityPrices, c));
                    return (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                        <select
                          value={pendingCity}
                          onChange={e => setPendingCity(e.target.value)}
                          style={{ ...inp, flex: 1 }}
                        >
                          <option value="">— Select city to add —</option>
                          {available.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            if (!pendingCity) return;
                            setCityPrices(prev => ({ ...prev, [pendingCity]: { price_range: '', unit: '' } }));
                            setPendingCity('');
                          }}
                          style={{ padding: '9px 16px', background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          + Add City
                        </button>
                      </div>
                    );
                  })()}

                  {/* City price rows */}
                  {Object.keys(cityPrices).length === 0 ? (
                    <p style={{ fontSize: '11px', color: t.muted, fontStyle: 'italic' }}>No cities added yet. Add cities above to set location-specific prices.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.entries(cityPrices).map(([city, vals]) => (
                        <div key={city} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', alignItems: 'center', background: t.tagBg, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '10px 12px' }}>
                          <div style={{ fontWeight: 700, fontSize: '12px', color: t.text }}>
                            📍 {city}
                          </div>
                          <div>
                            <label style={{ ...lbl, marginBottom: '3px' }}>Price Range</label>
                            <input
                              className="sc-inp"
                              style={{ ...inp, fontSize: '12px', padding: '6px 8px' }}
                              placeholder="e.g. ₹380–450 / bag"
                              value={vals.price_range || ''}
                              onChange={e => setCityPrices(prev => ({ ...prev, [city]: { ...prev[city], price_range: e.target.value } }))}
                            />
                          </div>
                          <div>
                            <label style={{ ...lbl, marginBottom: '3px' }}>Unit</label>
                            <input
                              className="sc-inp"
                              style={{ ...inp, fontSize: '12px', padding: '6px 8px' }}
                              placeholder="e.g. per 50 kg bag"
                              value={vals.unit || ''}
                              onChange={e => setCityPrices(prev => ({ ...prev, [city]: { ...prev[city], unit: e.target.value } }))}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setCityPrices(prev => {
                              const next = { ...prev };
                              delete next[city];
                              return next;
                            })}
                            style={{ padding: '6px 10px', background: 'none', border: '1px solid #ef4444', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 700, alignSelf: 'flex-end' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {Object.keys(cityPrices).length > 0 && (
                    <p style={{ fontSize: '10px', color: t.muted, marginTop: '8px' }}>
                      {Object.keys(cityPrices).length} {Object.keys(cityPrices).length === 1 ? 'city' : 'cities'} configured with custom pricing.
                    </p>
                  )}
                </div>

              </div>

              {/* Summary of types entered */}
              {(types.length > 0 || subcategories.length > 0) && (
                <div style={{ background: t.tagBg, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '12px 16px', marginBottom: '16px', fontSize: '11px', color: t.sub }}>
                  <strong style={{ color: t.text }}>Quick summary</strong>
                  {types.length > 0 && (
                    <div style={{ marginTop: '6px' }}>
                      📋 Types ({types.length}): {types.join(', ')} + <em>Others</em>
                    </div>
                  )}
                  {subcategories.length > 0 && (
                    <div style={{ marginTop: '4px' }}>
                      🗂 Sub-cats ({subcategories.length}): {subcategories.join(', ')} + <em>Others</em>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={saving}
                  style={{ flex: 1, background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', padding: '12px', cursor: saving ? 'wait' : 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving…' : editCat ? 'Save Changes' : 'Add Category'}
                </button>
                <button type="button" onClick={() => { resetForm(); setView('list'); }}
                  style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '4px', padding: '12px 20px', color: t.sub, cursor: 'pointer', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── LIST VIEW ────────────────────────────────────────────────── */}
      {view === 'list' && (
        <div>
          {/* header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ color: t.accent, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Admin Panel</p>
              <h2 style={{ color: t.text, margin: '0 0 4px', fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Shop Categories
              </h2>
              <p style={{ color: t.sub, margin: 0, fontSize: '12px' }}>
                Manage categories shown on the ShopNow page. Set types &amp; sub-categories for each. Drag rows to reorder.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {orderSaving && <span style={{ color: t.muted, fontSize: '11px', fontWeight: 600 }}>Saving order…</span>}
              <button onClick={load}
                style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '4px', padding: '8px 16px', color: t.sub, cursor: 'pointer', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                ↺ Refresh
              </button>
              <button onClick={openAdd}
                style={{ background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', padding: '8px 18px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                + Add Category
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Total',           val: cats.length,                           color: t.sub     },
              { label: 'Active',          val: cats.filter(c => c.is_active).length,  color: '#22c55e' },
              { label: 'Hidden',          val: cats.filter(c => !c.is_active).length, color: '#ef4444' },
              { label: 'With Types',      val: cats.filter(c => (c.types||[]).length > 0).length, color: 'var(--brand-blue-dark)' },
            ].map(s => (
              <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '10px', color: t.sub, marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: t.sub, fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Loading…</div>
          ) : cats.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', border: `1px solid ${t.border}`, borderRadius: '4px' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>🛒</div>
              <p style={{ color: t.text, fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>No categories yet</p>
              <p style={{ color: t.sub, fontSize: '12px', margin: '0 0 20px' }}>Add your first shop category to get started.</p>
              <button onClick={openAdd}
                style={{ background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', padding: '10px 24px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                + Add Category
              </button>
            </div>
          ) : (
            <div style={{ border: `1px solid ${t.border}`, borderRadius: '4px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>
                    {['⠿', 'Image', 'Name', 'Types', 'Badge', 'Price Range', 'Status', 'Actions'].map((h, i) => (
                      <th key={i} style={{ padding: '10px 14px', textAlign: 'left', color: t.sub, fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', background: t.tHead, whiteSpace: 'nowrap', borderBottom: `1px solid ${t.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cats.map((cat, i) => (
                    <tr key={cat.id} className="sc-row sc-drag-row"
                      draggable
                      onDragStart={() => onDragStart(i)}
                      onDragEnter={() => onDragEnter(i)}
                      onDragEnd={onDragEnd}
                      onDragOver={e => e.preventDefault()}
                      style={{ borderBottom: `1px solid ${t.border}`, opacity: !cat.is_active ? 0.5 : 1 }}>

                      {/* drag handle */}
                      <td style={{ padding: '10px 8px 10px 14px', color: t.muted, fontSize: '16px', cursor: 'grab', width: '32px' }}>⠿</td>

                      {/* image */}
                      <td style={{ padding: '8px 14px', width: '60px' }}>
                        {cat.image
                          ? <img src={cat.image} alt={cat.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: `1px solid ${t.border}` }} />
                          : <div style={{ width: '48px', height: '48px', background: t.tagBg, border: `1px solid ${t.border}`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{cat.emoji}</div>
                        }
                      </td>

                      {/* name */}
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 700, color: t.text }}>{cat.name}</div>
                        <div style={{ color: t.muted, fontSize: '11px', marginTop: '2px' }}>{cat.unit}</div>
                      </td>

                      {/* types count */}
                      <td style={{ padding: '10px 14px' }}>
                        {(cat.types || []).length > 0 ? (
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-blue-dark)' }}>
                              {(cat.types || []).length} type{(cat.types || []).length !== 1 ? 's' : ''}
                            </span>
                            {(cat.subcategories || []).length > 0 && (
                              <div style={{ fontSize: '10px', color: t.muted, marginTop: '2px' }}>
                                +{(cat.subcategories || []).length} sub
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: '10px', color: t.muted }}>None</span>
                        )}
                      </td>

                      {/* badge */}
                      <td style={{ padding: '10px 14px' }}>
                        {cat.label && (
                          <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', border: '1px solid', borderRadius: '2px', color: COLOR_OPTIONS.find(c => c.value === cat.label_color)?.dot || t.accent, borderColor: COLOR_OPTIONS.find(c => c.value === cat.label_color)?.dot || t.accent, background: 'transparent' }}>
                            {cat.label}
                          </span>
                        )}
                      </td>

                      {/* price */}
                      <td style={{ padding: '10px 14px', color: t.sub, whiteSpace: 'nowrap' }}>{cat.price_range || '—'}</td>

                      {/* status toggle */}
                      <td style={{ padding: '10px 14px' }}>
                        <button onClick={() => toggleActive(cat)}
                          style={{ padding: '3px 10px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', border: '1px solid', borderRadius: '2px', cursor: 'pointer', background: 'none', color: cat.is_active ? '#22c55e' : '#ef4444', borderColor: cat.is_active ? '#22c55e' : '#ef4444' }}>
                          {cat.is_active ? 'Visible' : 'Hidden'}
                        </button>
                      </td>

                      {/* actions */}
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => openEdit(cat)}
                            style={{ padding: '4px 12px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', border: `1px solid ${t.border}`, borderRadius: '2px', background: 'none', color: t.sub, cursor: 'pointer' }}>
                            Edit
                          </button>
                          <button onClick={() => deleteCat(cat.id)}
                            style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', border: '1px solid #ef4444', borderRadius: '2px', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {cats.length > 0 && (
            <p style={{ color: t.muted, fontSize: '11px', marginTop: '10px', fontWeight: 600 }}>
              💡 Drag any row to reorder. Order is saved automatically and reflected live on the ShopNow page.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
