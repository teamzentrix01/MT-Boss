'use client';

import { useEffect, useRef, useState } from 'react';

/* ── Cloudinary upload helper ────────────────────────────────────────────── */
async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  fd.append('cloud_name',    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  fd.append('folder', 'mtboss/calculator');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd }
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
}

const emptyForm = {
  category: '',
  badge: 'Recommended',
  name: '',
  description: '',
  image_url: '',
  unit: 'unit',
  price: '',
  is_active: true,
};

const emptyCategoryForm = {
  name: '',
  badge: 'Recommended',
  image_url: '',
  is_active: true,
};

export default function CalculatorManager({ isDarkMode }) {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData,   setFormData]   = useState(emptyForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [showForm,   setShowForm]   = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingId,  setEditingId]  = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [message,    setMessage]    = useState('');
  const [error,      setError]      = useState('');

  /* image state */
  const [imageMode,    setImageMode]    = useState('url');   // 'url' | 'upload'
  const [uploading,    setUploading]    = useState(false);
  const [uploadErr,    setUploadErr]    = useState('');
  const fileRef = useRef(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const productRes = await fetch('/api/calculator-products?admin=true', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const categoryRes = await fetch('/api/calculator-categories', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const productData = await productRes.json();
      const categoryData = await categoryRes.json();
      const nextProducts = productData.success ? productData.data || [] : [];
      const nextCategories = categoryData.success ? categoryData.data || [] : [];
      setProducts(nextProducts);
      setCategories(nextCategories);
      setSelectedCategory((current) => {
        if (current && nextCategories.some(category => category.name === current)) return current;
        return nextCategories[0]?.name || '';
      });
    } catch {
      setError('Unable to load calculator products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setImageMode('url');
    setUploadErr('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const resetCategoryForm = () => {
    setCategoryForm(emptyCategoryForm);
    setEditingCategoryId(null);
    setShowCategoryForm(false);
  };

  /* ── file → Cloudinary ── */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr('');
    try {
      const url = await uploadToCloudinary(file);
      setFormData(f => ({ ...f, image_url: url }));
    } catch (err) {
      setUploadErr(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/calculator-products', {
        method:  editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(editingId ? { id: editingId, ...formData } : formData),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || 'Unable to save product'); return; }
      setMessage(editingId ? 'Product updated ✓' : 'Product added ✓');
      resetForm();
      fetchData();
    } catch {
      setError('Unable to save product');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/calculator-categories', {
        method: editingCategoryId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingCategoryId ? { id: editingCategoryId, ...categoryForm } : categoryForm),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || 'Unable to save category'); return; }
      setMessage(editingCategoryId ? 'Category updated' : 'Category added');
      setSelectedCategory(data.data?.name || categoryForm.name);
      resetCategoryForm();
      fetchData();
    } catch {
      setError('Unable to save category');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      category:    product.category    || '',
      badge:       product.badge       || 'Recommended',
      name:        product.name        || '',
      description: product.description || '',
      image_url:   product.image_url   || '',
      unit:        product.unit        || 'unit',
      price:       product.price       || '',
      is_active:   product.is_active   ?? true,
    });
    setEditingId(product.id);
    setImageMode('url');
    setUploadErr('');
    setShowForm(true);
  };

  const handleCategoryEdit = (category) => {
    setCategoryForm({
      name: category.name || '',
      badge: category.badge || 'Recommended',
      image_url: category.image_url || '',
      is_active: category.is_active ?? true,
    });
    setEditingCategoryId(category.id);
    setShowCategoryForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this calculator product?')) return;
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res  = await fetch(`/api/calculator-products?id=${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) { setMessage('Product deleted'); fetchData(); }
      else setError(data.error || 'Delete failed');
    } catch { setError('Delete failed'); }
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading calculator products…</p>;

  const handleCategoryDelete = async (category) => {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch(`/api/calculator-categories?id=${category.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) { setMessage('Category deleted'); fetchData(); }
      else setError(data.error || 'Delete failed');
    } catch { setError('Delete failed'); }
  };

  const openAddProduct = () => {
    const category = categories.find(item => item.name === selectedCategory);
    setFormData({
      ...emptyForm,
      category: selectedCategory || categories[0]?.name || '',
      badge: category?.badge || 'Recommended',
    });
    setEditingId(null);
    setImageMode('url');
    setUploadErr('');
    setShowForm(true);
  };

  const selectedCategoryMeta = categories.find(category => category.name === selectedCategory);
  const visibleProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <>
      <style>{`
        .cm-root {
          --cm-surface: ${isDarkMode ? '#18181c' : '#ffffff'};
          --cm-bg:      ${isDarkMode ? '#0f0f11' : '#f5f5f7'};
          --cm-border:  ${isDarkMode ? '#2a2a30' : '#e2e2e7'};
          --cm-text:    ${isDarkMode ? '#f0f0f5' : '#111113'};
          --cm-muted:   ${isDarkMode ? '#8b8b98' : '#6b6b76'};
          --cm-accent:  ${isDarkMode ? '#facc15' : '#f6b400'};
          color: var(--cm-text);
        }
        .cm-head    { display:flex; justify-content:space-between; align-items:center; margin-bottom:.9rem; }
        .cm-title   { font-weight:800; font-size:.95rem; }
        .cm-btn     { border:0; border-radius:7px; padding:.48rem .9rem; font-weight:800; font-size:.78rem; cursor:pointer; background:var(--cm-accent); color:#111; }
        .cm-btn.secondary { background:transparent; color:var(--cm-muted); border:1px solid var(--cm-border); }
        .cm-alert   { border-radius:7px; padding:.55rem .85rem; margin-bottom:.75rem; font-size:.8rem; }
        .cm-ok      { background:#ecfdf5; color:#166534; border:1px solid #86efac; }
        .cm-err     { background:#fff1f2; color:#9f1239; border:1px solid #fca5a5; }
        .cm-warn    { background:#fffbeb; color:#92400e; border:1px solid #fcd34d; }
        .cm-panel   { background:var(--cm-surface); border:1px solid var(--cm-border); border-radius:8px; padding:1rem; margin-bottom:.9rem; }
        .cm-modal-backdrop {
          position:fixed; inset:0; z-index:80;
          display:flex; align-items:center; justify-content:center;
          padding:1rem; background:rgba(0,0,0,.52);
        }
        .cm-modal {
          width:min(800px,100%); max-height:90vh; overflow:auto;
          background:var(--cm-surface); border:1px solid var(--cm-border);
          border-radius:10px; box-shadow:0 24px 80px rgba(0,0,0,.32);
        }
        .cm-modal-head {
          display:flex; align-items:center; justify-content:space-between;
          gap:1rem; padding:1rem 1.25rem; border-bottom:1px solid var(--cm-border);
        }
        .cm-modal-title  { margin:0; font-size:.95rem; font-weight:900; }
        .cm-modal-close  { width:2rem; height:2rem; border-radius:999px; border:1px solid var(--cm-border); background:var(--cm-bg); color:var(--cm-text); cursor:pointer; font-weight:900; }
        .cm-form  { border:0; border-radius:0; margin:0; }
        .cm-grid  { display:grid; grid-template-columns:repeat(3,1fr); gap:.8rem; }
        .cm-full  { grid-column:1/-1; }
        .cm-half  { grid-column:span 2; }
        .cm-label { display:block; color:var(--cm-muted); font-size:.66rem; font-weight:800; text-transform:uppercase; letter-spacing:.06em; margin-bottom:.28rem; }
        .cm-input,.cm-textarea,.cm-select { width:100%; box-sizing:border-box; border:1px solid var(--cm-border); border-radius:7px; background:var(--cm-bg); color:var(--cm-text); padding:.48rem .65rem; font-size:.8rem; outline:none; }
        .cm-textarea { resize:vertical; min-height:70px; }
        .cm-actions { display:flex; gap:.55rem; margin-top:.85rem; }
        .cm-section-head { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:.8rem; }
        .cm-category-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:.75rem; }
        .cm-category-card { width:100%; text-align:left; border:1px solid var(--cm-border); background:var(--cm-bg); color:var(--cm-text); border-radius:8px; padding:.8rem; cursor:pointer; transition:border-color .15s, transform .15s; }
        .cm-category-card:hover { transform:translateY(-1px); border-color:var(--cm-accent); }
        .cm-category-card.active { border-color:var(--cm-accent); box-shadow:0 0 0 1px var(--cm-accent) inset; }
        .cm-category-top { display:flex; align-items:center; justify-content:space-between; gap:.65rem; }
        .cm-category-name { font-weight:900; font-size:.85rem; }
        .cm-category-meta { color:var(--cm-muted); font-size:.7rem; margin-top:.35rem; }
        .cm-category-actions { display:flex; gap:.35rem; margin-top:.65rem; }
        .cm-table   { width:100%; border-collapse:collapse; font-size:.8rem; }
        .cm-table th { text-align:left; color:var(--cm-muted); background:var(--cm-bg); padding:.55rem .75rem; font-size:.66rem; text-transform:uppercase; letter-spacing:.06em; }
        .cm-table td { border-top:1px solid var(--cm-border); padding:.62rem .75rem; vertical-align:middle; }
        .cm-price    { font-weight:900; }
        .cm-chip     { display:inline-block; border-radius:999px; background:var(--cm-bg); border:1px solid var(--cm-border); padding:.15rem .5rem; font-size:.68rem; color:var(--cm-muted); }
        .cm-row-actions { display:flex; gap:.35rem; }
        .cm-act      { border:1px solid var(--cm-border); background:var(--cm-bg); color:var(--cm-text); border-radius:5px; padding:.25rem .5rem; font-size:.7rem; font-weight:800; cursor:pointer; }
        .cm-act.delete { color:#dc2626; }

        /* image section */
        .cm-img-tabs  { display:flex; gap:.5rem; margin-bottom:.6rem; }
        .cm-img-tab   { padding:.3rem .75rem; border-radius:20px; border:1px solid var(--cm-border); background:var(--cm-bg); color:var(--cm-muted); font-size:.73rem; font-weight:700; cursor:pointer; transition:all .15s; }
        .cm-img-tab.active { background:var(--cm-accent); color:#111; border-color:var(--cm-accent); }
        .cm-upload-zone {
          border:2px dashed var(--cm-border); border-radius:8px;
          padding:1.2rem; text-align:center; cursor:pointer;
          transition:border-color .2s;
        }
        .cm-upload-zone:hover { border-color:var(--cm-accent); }
        .cm-img-preview {
          width:64px; height:64px; object-fit:cover;
          border-radius:6px; border:1px solid var(--cm-border);
        }
        @media(max-width:760px){ .cm-grid { grid-template-columns:1fr; } .cm-half { grid-column:1/-1; } }
      `}</style>

      <div className="cm-root">
        {/* ── Header ── */}
        <div className="cm-head">
          <div>
            <div className="cm-title">Calculator Categories</div>
            <div style={{ color:'var(--cm-muted)', fontSize:'.75rem', marginTop:2 }}>
              Manage categories first, then select a category to manage its products.
            </div>
          </div>
          <button className={`cm-btn${showCategoryForm ? ' secondary' : ''}`}
            onClick={() => showCategoryForm ? resetCategoryForm() : setShowCategoryForm(true)}>
            {showCategoryForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>

        {message && <div className="cm-alert cm-ok">{message}</div>}
        {error   && <div className="cm-alert cm-err">{error}</div>}

        {/* ── Modal Form ── */}
        <div className="cm-panel">
          <div className="cm-category-grid">
            {categories.map(category => (
              <div key={category.id} className={`cm-category-card${selectedCategory === category.name ? ' active' : ''}`}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(category.name)}
                  style={{ all:'unset', display:'block', width:'100%', cursor:'pointer' }}
                >
                  <div className="cm-category-top">
                    <div>
                      <div className="cm-category-name">{category.name}</div>
                      <div className="cm-category-meta">{category.product_count || 0} products</div>
                    </div>
                    <span className="cm-chip">{category.is_active ? 'Active' : 'Hidden'}</span>
                  </div>
                  <div className="cm-category-meta">Badge: {category.badge || 'Recommended'}</div>
                </button>
                <div className="cm-category-actions">
                  <button className="cm-act" type="button" onClick={() => handleCategoryEdit(category)}>Edit</button>
                  <button className="cm-act delete" type="button" onClick={() => handleCategoryDelete(category)}>Delete</button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div style={{ color:'var(--cm-muted)', fontSize:'.8rem' }}>No categories yet.</div>
            )}
          </div>
        </div>

        {showCategoryForm && (
          <div className="cm-modal-backdrop" onClick={resetCategoryForm}>
            <div className="cm-modal" onClick={e => e.stopPropagation()}>
              <div className="cm-modal-head">
                <h3 className="cm-modal-title">
                  {editingCategoryId ? 'Edit Calculator Category' : 'Add Calculator Category'}
                </h3>
                <button className="cm-modal-close" type="button" onClick={resetCategoryForm} aria-label="Close">X</button>
              </div>
              <form className="cm-panel cm-form" onSubmit={handleCategorySubmit}>
                <div className="cm-grid">
                  <div>
                    <label className="cm-label">Category Name</label>
                    <input className="cm-input" value={categoryForm.name}
                      onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="Steel, Bricks, Cement" required />
                  </div>
                  <div>
                    <label className="cm-label">Badge</label>
                    <select className="cm-select" value={categoryForm.badge}
                      onChange={e => setCategoryForm({ ...categoryForm, badge: e.target.value })}>
                      {['Mandatory','Recommended','Putty','Paint','Window','Door'].map(b =>
                        <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', paddingTop:'1.2rem' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:8, color:'var(--cm-muted)', fontSize:'.8rem', fontWeight:700, cursor:'pointer' }}>
                      <input type="checkbox" checked={categoryForm.is_active}
                        onChange={e => setCategoryForm({ ...categoryForm, is_active: e.target.checked })} />
                      Active category
                    </label>
                  </div>
                  <div className="cm-full">
                    <label className="cm-label">Category Image URL</label>
                    <input className="cm-input" value={categoryForm.image_url}
                      onChange={e => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                      placeholder="Optional image URL for this category" />
                  </div>
                </div>
                <div className="cm-actions">
                  <button className="cm-btn" type="submit">
                    {editingCategoryId ? 'Update Category' : 'Add Category'}
                  </button>
                  <button className="cm-btn secondary" type="button" onClick={resetCategoryForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showForm && (
          <div className="cm-modal-backdrop" onClick={resetForm}>
            <div className="cm-modal" onClick={e => e.stopPropagation()}>
              <div className="cm-modal-head">
                <h3 className="cm-modal-title">
                  {editingId ? 'Edit Calculator Product' : 'Add Calculator Product'}
                </h3>
                <button className="cm-modal-close" type="button" onClick={resetForm} aria-label="Close">×</button>
              </div>

              <form className="cm-panel cm-form" onSubmit={handleSubmit}>
                <div className="cm-grid">

                  {/* Row 1 */}
                  <div>
                    <label className="cm-label">Category</label>
                    <select className="cm-select" value={formData.category}
                      onChange={e => {
                        const category = categories.find(item => item.name === e.target.value);
                        setFormData({ ...formData, category: e.target.value, badge: category?.badge || formData.badge });
                      }}
                      required>
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="cm-label">Badge</label>
                    <select className="cm-select" value={formData.badge}
                      onChange={e => setFormData({ ...formData, badge: e.target.value })}>
                      {['Mandatory','Recommended','Putty','Paint','Window','Door'].map(b =>
                        <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="cm-label">Product Name</label>
                    <input className="cm-input" value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  </div>

                  {/* Row 2 */}
                  <div>
                    <label className="cm-label">Price (₹)</label>
                    <input className="cm-input" type="number" min="0" step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                  </div>
                  <div>
                    <label className="cm-label">Unit</label>
                    <input className="cm-input" value={formData.unit}
                      onChange={e => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="bag, kg, piece" />
                  </div>
                  <div style={{ display:'flex', alignItems:'center', paddingTop:'1.2rem' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:8, color:'var(--cm-muted)', fontSize:'.8rem', fontWeight:700, cursor:'pointer' }}>
                      <input type="checkbox" checked={formData.is_active}
                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                      Active on public calculator
                    </label>
                  </div>

                  {/* Image — full width */}
                  <div className="cm-full">
                    <label className="cm-label">Product Image</label>

                    {/* Mode toggle */}
                    <div className="cm-img-tabs">
                      <button type="button"
                        className={`cm-img-tab${imageMode === 'url' ? ' active' : ''}`}
                        onClick={() => { setImageMode('url'); setUploadErr(''); }}>
                        🔗 Paste URL
                      </button>
                      <button type="button"
                        className={`cm-img-tab${imageMode === 'upload' ? ' active' : ''}`}
                        onClick={() => { setImageMode('upload'); setUploadErr(''); }}>
                        📁 Upload from Gallery
                      </button>
                    </div>

                    {/* URL input */}
                    {imageMode === 'url' && (
                      <input className="cm-input" value={formData.image_url}
                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://res.cloudinary.com/… or any image URL" />
                    )}

                    {/* Gallery upload */}
                    {imageMode === 'upload' && (
                      <div>
                        <div className="cm-upload-zone"
                          onClick={() => !uploading && fileRef.current?.click()}>
                          {uploading ? (
                            <span style={{ color:'var(--cm-muted)', fontSize:'.82rem' }}>
                              ⏳ Uploading to Cloudinary…
                            </span>
                          ) : (
                            <>
                              <div style={{ fontSize:'2rem', marginBottom:'.4rem' }}>🖼️</div>
                              <div style={{ color:'var(--cm-muted)', fontSize:'.8rem' }}>
                                Click to choose an image from your device
                              </div>
                              <div style={{ color:'var(--cm-muted)', fontSize:'.7rem', marginTop:'.2rem' }}>
                                JPG, PNG, WEBP — uploaded to Cloudinary automatically
                              </div>
                            </>
                          )}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*"
                          style={{ display:'none' }} onChange={handleFileChange} />
                        {uploadErr && (
                          <div className="cm-alert cm-warn" style={{ marginTop:'.5rem' }}>
                            ⚠ {uploadErr}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Preview — always shown when URL is set */}
                    {formData.image_url && (
                      <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginTop:'.6rem' }}>
                        <img src={formData.image_url} alt="preview" className="cm-img-preview"
                          onError={e => { e.target.style.display = 'none'; }} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:'.72rem', color:'var(--cm-muted)', wordBreak:'break-all' }}>
                            {formData.image_url}
                          </div>
                          <button type="button"
                            onClick={() => { setFormData(f => ({ ...f, image_url:'' })); if (fileRef.current) fileRef.current.value = ''; }}
                            style={{ marginTop:'.3rem', fontSize:'.72rem', color:'#dc2626', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                            ✕ Remove image
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description — full width */}
                  <div className="cm-full">
                    <label className="cm-label">Description</label>
                    <textarea className="cm-textarea" value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>

                <div className="cm-actions">
                  <button className="cm-btn" type="submit" disabled={uploading}>
                    {uploading ? 'Uploading…' : editingId ? 'Update Product' : 'Add Product'}
                  </button>
                  <button className="cm-btn secondary" type="button" onClick={resetForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Product Table ── */}
        <div className="cm-section-head">
          <div>
            <div className="cm-title">
              {selectedCategoryMeta ? `${selectedCategoryMeta.name} Products` : 'Calculator Products'}
            </div>
            <div style={{ color:'var(--cm-muted)', fontSize:'.75rem', marginTop:2 }}>
              Select a category above before adding or updating products.
            </div>
          </div>
          <button className="cm-btn" type="button" onClick={openAddProduct} disabled={categories.length === 0}>
            + Add Product
          </button>
        </div>

        <div className="cm-panel" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table className="cm-table">
              <thead>
                <tr>
                  {['Image','Category','Product','Price','Unit','Status','Actions'].map(col =>
                    <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.image_url
                        ? <img src={product.image_url} alt={product.name}
                            style={{ width:40, height:40, objectFit:'cover', borderRadius:6, border:'1px solid var(--cm-border)' }}
                            onError={e => { e.target.style.display='none'; }} />
                        : <span style={{ fontSize:'1.4rem' }}>📦</span>}
                    </td>
                    <td><span className="cm-chip">{product.category}</span></td>
                    <td>
                      <strong>{product.name}</strong>
                      {product.description && (
                        <div style={{ color:'var(--cm-muted)', fontSize:'.72rem', marginTop:2 }}>
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td className="cm-price">₹{Number(product.price).toLocaleString('en-IN')}</td>
                    <td>{product.unit}</td>
                    <td>
                      <span className="cm-chip" style={{
                        color:    product.is_active ? '#166534' : '#9f1239',
                        background: product.is_active ? '#ecfdf5' : '#fff1f2',
                        borderColor: product.is_active ? '#86efac' : '#fca5a5',
                      }}>
                        {product.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="cm-row-actions">
                        <button className="cm-act" onClick={() => handleEdit(product)}>Edit</button>
                        <button className="cm-act delete" onClick={() => handleDelete(product.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visibleProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign:'center', color:'var(--cm-muted)', padding:'2rem' }}>
                      No calculator products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
