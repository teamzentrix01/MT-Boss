'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useCities } from '@/hooks/useCities';

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
    accent:   'var(--brand-blue)',
    accentFg: '#ffffff',
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
            <Image src={value} alt="preview" width={64} height={64} unoptimized style={{ width: '64px', height: '64px', objectFit: 'cover', border: `1px solid ${t.border}`, borderRadius: '4px' }} />
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
      <input
        type="url"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        style={{
          width: '100%',
          marginTop: '8px',
          border: `1px solid ${t.border}`,
          borderRadius: '4px',
          padding: '8px 10px',
          background: t.inputBg,
          color: t.text,
          fontSize: '12px',
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      />
      {err && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0' }}>{err}</p>}
    </div>
  );
}

/* ── Emoji/Icon upload field ────────────────────────────────────────────── */
function EmojiUpload({ emojiText, emojiImage, onTextChange, onImageChange, t }) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); setErr('');
    try { onImageChange(await uploadToCloudinary(file)); }
    catch (e) { setErr(e.message); }
    finally { setUploading(false); }
  }

  return (
    <div>
      <label style={{ fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
        Emoji (Fallback Icon)
      </label>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
        <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
          <input 
            className="sc-inp" 
            style={{ flex: 1, border: `1px solid ${t.border}`, borderRadius: '4px', padding: '9px 12px', background: t.inputBg, color: t.text, fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
            value={emojiText}
            onChange={e => onTextChange(e.target.value)} 
            placeholder="🧱" 
            maxLength={4} 
          />
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', border: `1px solid ${t.border}`, borderRadius: '4px', background: t.inputBg, fontSize: '11px', fontWeight: 600, color: t.sub, whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '16px' }}>{uploading ? '⏳' : '🖼️'}</span>
            <span>{uploading ? 'Uploading…' : 'Upload Icon'}</span>
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>
        {emojiImage && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Image src={emojiImage} alt="emoji" width={40} height={40} unoptimized style={{ width: '40px', height: '40px', objectFit: 'cover', border: `1px solid ${t.border}`, borderRadius: '4px' }} />
            <button type="button" onClick={() => onImageChange('')}
              style={{ position: 'absolute', top: '-8px', right: '-8px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        )}
      </div>
      {err && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0' }}>{err}</p>}
      <p style={{ fontSize: '10px', color: t.muted, margin: '4px 0 0', fontStyle: 'italic' }}>
        💡 Upload a custom icon (PNG/SVG) or type an emoji. The uploaded icon takes priority if both are provided.
      </p>
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

/* ── Sub-category / Sub-product Editor (modal form on the same page) ───────── */
function SubcategoryListEditor({ label, helpText, items = [], onChange, t }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [subForm, setSubForm] = useState({ name: '', image: '', price: '' });
  const [uploading, setUploading] = useState(false);
  const [formErr, setFormErr] = useState('');

  const normalizeSub = (s) => {
    if (typeof s === 'string') return { name: s, image: '', price: '' };
    return {
      name: String(s?.name || '').trim(),
      image: String(s?.image || '').trim(),
      price: String(s?.price || '').trim(),
    };
  };

  const normalizedItems = (items || []).map(normalizeSub);

  const openAdd = () => {
    setEditingIdx(null);
    setSubForm({ name: '', image: '', price: '' });
    setFormErr('');
    setModalOpen(true);
  };

  const openEdit = (idx) => {
    setEditingIdx(idx);
    setSubForm(normalizeSub(items[idx]));
    setFormErr('');
    setModalOpen(true);
  };

  const handleRemove = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  async function handleSubFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setFormErr('');
    try {
      const url = await uploadToCloudinary(file);
      setSubForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setFormErr(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  const handleSave = (e) => {
    e.preventDefault();
    const name = subForm.name.trim();
    const image = subForm.image.trim();
    const price = subForm.price.trim();

    if (!name) {
      setFormErr('Product / Sub-category name is required.');
      return;
    }
    if (!image) {
      setFormErr('Product image is required. Please upload an image or provide an image URL.');
      return;
    }
    if (!price) {
      setFormErr('Product price is required.');
      return;
    }

    const itemData = {
      name,
      image,
      price,
    };

    if (editingIdx !== null) {
      const updated = items.map((it, idx) => (idx === editingIdx ? itemData : it));
      onChange(updated);
    } else {
      const exists = normalizedItems.some(
        (it) => it.name.toLowerCase() === name.toLowerCase()
      );
      if (exists) {
        setFormErr('A sub-category with this name already exists.');
        return;
      }
      onChange([...items, itemData]);
    }
    setModalOpen(false);
  };

  return (
    <div style={{ marginBottom: '4px' }}>
      <label style={{ fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '4px' }}>
        {label}
      </label>
      {helpText && <p style={{ fontSize: '11px', color: t.muted, marginBottom: '10px' }}>{helpText}</p>}

      {/* Existing Items Cards */}
      {normalizedItems.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px', marginBottom: '12px' }}>
          {normalizedItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: t.tagBg,
                border: `1px solid ${t.border}`,
                borderRadius: '6px',
                padding: '8px 10px',
                boxSizing: 'border-box',
              }}
            >
              {/* Thumbnail */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px', border: `1px solid ${t.border}`, flexShrink: 0 }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div style={{ width: '42px', height: '42px', borderRadius: '4px', background: t.inputBg, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  🏷️
                </div>
              )}

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '12px', color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.name}>
                  {item.name}
                </p>
                {item.price ? (
                  <span style={{ display: 'inline-block', marginTop: '3px', fontSize: '11px', fontWeight: 700, color: '#10b981', background: '#10b98115', border: '1px solid #10b98135', borderRadius: '3px', padding: '1px 6px' }}>
                    {item.price.startsWith('₹') ? item.price : `₹${item.price}`}
                  </span>
                ) : (
                  <span style={{ fontSize: '10px', color: t.muted, fontStyle: 'italic' }}>No price set</span>
                )}
              </div>

              {/* Edit and Delete buttons */}
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => openEdit(idx)}
                  title="Edit Sub-category"
                  style={{
                    background: t.inputBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: '4px',
                    padding: '4px 7px',
                    color: t.text,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Delete Sub-category"
                  style={{
                    background: '#ef444415',
                    border: '1px solid #ef444430',
                    borderRadius: '4px',
                    padding: '4px 7px',
                    color: '#ef4444',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '11px', color: t.muted, margin: '0 0 10px', fontStyle: 'italic' }}>
          No sub-categories added yet. Click &quot;+ Add Sub-category / Product&quot; to add one with name, image, and price.
        </p>
      )}

      {/* Button to open form on same page */}
      <button
        type="button"
        onClick={openAdd}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          background: t.accent,
          color: t.accentFg,
          border: 'none',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 800,
          cursor: 'pointer',
        }}
      >
        + Add Sub-category / Product
      </button>

      <p style={{ fontSize: '10px', color: t.muted, marginTop: '6px' }}>
        &quot;Others&quot; option is added automatically for customers.
      </p>

      {/* ── Modal Form on the Same Page ─────────────────────────────── */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={() => { if (!uploading) setModalOpen(false); }}
        >
          <div
            style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: '8px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: `1px solid ${t.border}`,
              background: t.inputBg,
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: t.text }}>
                  {editingIdx !== null ? '✏️ Edit Sub-category / Product' : '➕ Add Sub-category / Product'}
                </h3>
                <span style={{ fontSize: '10px', color: t.muted, fontWeight: 600, display: 'block', marginTop: '2px' }}>
                  * All fields (Name, Image &amp; Price) are required
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: t.sub, fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Product Name */}
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  Product / Sub-category Name *
                </label>
                <input
                  autoFocus
                  className="sc-inp"
                  style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${t.border}`, borderRadius: '4px', padding: '9px 12px', background: t.inputBg, color: t.text, fontSize: '13px', outline: 'none' }}
                  value={subForm.name}
                  onChange={(e) => setSubForm((prev) => ({ ...prev, name: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(e); } }}
                  placeholder='e.g. "OPC 43 & PPC", "White Cement", "Red Clay Bricks"'
                  required
                />
              </div>

              {/* Product Image */}
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  Product Image *
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  {subForm.image && (
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={subForm.image}
                        alt="preview"
                        style={{ width: '56px', height: '56px', objectFit: 'cover', border: `1px solid ${t.border}`, borderRadius: '4px' }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setSubForm((prev) => ({ ...prev, image: '' }))}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <label style={{ flex: 1, border: `1px dashed ${t.border}`, borderRadius: '4px', padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', background: t.inputBg }}>
                    <span style={{ fontSize: '16px' }}>{uploading ? '⏳' : '📁'}</span>
                    <span style={{ fontSize: '11px', color: t.sub, fontWeight: 600 }}>
                      {uploading ? 'Uploading…' : subForm.image ? 'Replace image' : 'Upload product image *'}
                    </span>
                    <input type="file" accept="image/*" onChange={handleSubFile} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                </div>
                <input
                  className="sc-inp"
                  style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${t.border}`, borderRadius: '4px', padding: '8px 10px', background: t.inputBg, color: t.text, fontSize: '12px', outline: 'none' }}
                  value={subForm.image}
                  onChange={(e) => setSubForm((prev) => ({ ...prev, image: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(e); } }}
                  placeholder="Or paste product image URL *"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: t.sub, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  Price / Price Range *
                </label>
                <input
                  className="sc-inp"
                  style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${t.border}`, borderRadius: '4px', padding: '9px 12px', background: t.inputBg, color: t.text, fontSize: '13px', outline: 'none' }}
                  value={subForm.price}
                  onChange={(e) => setSubForm((prev) => ({ ...prev, price: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSave(e); } }}
                  placeholder='e.g. ₹380 or ₹380–₹450 / bag'
                  required
                />
                <small style={{ fontSize: '10px', color: t.muted, marginTop: '4px', display: 'block' }}>
                  Price or price range displayed for this sub-category / product.
                </small>
              </div>

              {formErr && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: 0, padding: '6px 10px', background: '#ef444415', border: '1px solid #ef444430', borderRadius: '4px' }}>
                  {formErr}
                </p>
              )}

              {/* Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px', paddingTop: '12px', borderTop: `1px solid ${t.border}` }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '8px 16px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: '4px', color: t.sub, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={uploading}
                  style={{ padding: '8px 18px', background: t.accent, color: t.accentFg, border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {editingIdx !== null ? 'Save Changes' : '+ Add Sub-category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

const SKU_UNITS = ['bag', 'bags', 'pcs', 'kg', 'quintal', 'box', 'bundle', 'cft', 'ton', 'meter', 'set', 'bucket'];

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════ */
export default function ShopCategoriesManager({ isDarkMode }) {
  const t = th(isDarkMode);
  const { cities } = useCities();

  const [cats, setCats]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [view, setView]             = useState('list');   // 'list' | 'form'
  const [editCat, setEditCat]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [image, setImage]           = useState('');
  const [emojiImage, setEmojiImage] = useState('');
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
    setEmojiImage('');
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
    setEmojiImage(cat.emoji_image || '');
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
      const derivedTypes = (subcategories && subcategories.length > 0)
        ? subcategories.map(s => (typeof s === 'string' ? s : s?.name)).filter(Boolean)
        : (types || []);
      const payload = { ...form, image: image || null, emoji_image: emojiImage || null, types: derivedTypes, subcategories, city_prices: cityPrices };
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
        emoji_image: cat.emoji_image || null,
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
                <div style={{ gridColumn: 'span 2' }}>
                  <EmojiUpload 
                    emojiText={form.emoji}
                    emojiImage={emojiImage}
                    onTextChange={e => setForm(f => ({ ...f, emoji: e }))}
                    onImageChange={setEmojiImage}
                    t={t}
                  />
                </div>

                {/* Badge Label & Colour */}
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

                <div>
                  <label style={lbl}>Default Price Range</label>
                  <input
                    className="sc-inp"
                    style={inp}
                    value={form.price_range}
                    onChange={e => setForm(f => ({ ...f, price_range: e.target.value }))}
                    placeholder="e.g. Rs 380-450"
                  />
                </div>

                <div>
                  <label style={lbl}>SKU / Unit</label>
                  <select
                    className="sc-inp"
                    style={inp}
                    value={form.unit}
                    onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                  >
                    <option value="">Select unit</option>
                    {SKU_UNITS.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                {(form.label || form.emoji || emojiImage) && (
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: t.tagBg, border: `1px solid ${t.border}`, borderRadius: '4px' }}>
                    {emojiImage ? (
                      <Image src={emojiImage} alt="emoji" width={40} height={40} unoptimized style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: `1px solid ${t.border}` }} />
                    ) : (
                      <span style={{ fontSize: '32px' }}>{form.emoji}</span>
                    )}
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

                {/* ── Subcategories ──────────────────────────────────── */}
                <div style={{ gridColumn: 'span 2', borderTop: `1px solid ${t.border}`, paddingTop: '20px', marginTop: '4px' }}>
                  <SubcategoryListEditor
                    label="Sub-categories / Products"
                    helpText="Secondary classification with custom product name, image, and price."
                    items={subcategories}
                    onChange={setSubs}
                    t={t}
                  />
                </div>

                {/* ── City-wise Pricing ──────────────────────────────── */}
                <div style={{ gridColumn: 'span 2', borderTop: `1px solid ${t.border}`, paddingTop: '20px', marginTop: '4px' }}>
                  <label style={{ ...lbl, display: 'block', marginBottom: '4px' }}>City-wise Pricing</label>
                  <p style={{ fontSize: '11px', color: t.muted, marginBottom: '12px' }}>
                    Set separate prices per city. Users see their city&apos;s price when they request a quote. If no city price is set, users are told the price will be quoted by a verified supplier.
                  </p>

                  {/* Add city row */}
                  {(() => {
                    const available = cities.filter(c => !Object.prototype.hasOwnProperty.call(cityPrices, c));
                    return (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                        <select
                          value={pendingCity}
                          onChange={e => setPendingCity(e.target.value)}
                          style={{ ...inp, flex: 1 }}
                        >
                          <option value="">Select city</option>
                          {available.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const city = pendingCity.trim().replace(/\s+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
                            if (!city) return;
                            setCityPrices(prev => ({ ...prev, [city]: prev[city] || { price_range: '', unit: '' } }));
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
                            <select
                              className="sc-inp"
                              style={{ ...inp, fontSize: '12px', padding: '6px 8px' }}
                              value={vals.unit || ''}
                              onChange={e => setCityPrices(prev => ({ ...prev, [city]: { ...prev[city], unit: e.target.value } }))}
                            >
                              <option value="">Select unit</option>
                              {SKU_UNITS.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
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
                      🗂 Sub-cats ({subcategories.length}): {subcategories.map(s => typeof s === 'object' && s !== null ? s.name : s).join(', ')} + <em>Others</em>
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
                          ? <Image src={cat.image} alt={cat.name} width={48} height={48} unoptimized style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: `1px solid ${t.border}` }} />
                          : <div style={{ width: '48px', height: '48px', background: t.tagBg, border: `1px solid ${t.border}`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                              {cat.emoji_image 
                                ? <Image src={cat.emoji_image} alt="emoji" width={40} height={40} unoptimized style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '2px' }} />
                                : cat.emoji
                              }
                            </div>
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
