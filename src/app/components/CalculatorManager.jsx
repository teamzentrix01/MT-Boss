'use client';

import { useEffect, useState } from 'react';

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

export default function CalculatorManager({ isDarkMode }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/calculator-products?admin=true', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success) setProducts(data.data || []);
    } catch {
      setError('Unable to load calculator products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/calculator-products', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingId ? { id: editingId, ...formData } : formData),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Unable to save product');
        return;
      }
      setMessage(editingId ? 'Product updated' : 'Product added');
      resetForm();
      fetchProducts();
    } catch {
      setError('Unable to save product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      category: product.category || '',
      badge: product.badge || 'Recommended',
      name: product.name || '',
      description: product.description || '',
      image_url: product.image_url || '',
      unit: product.unit || 'unit',
      price: product.price || '',
      is_active: product.is_active ?? true,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this calculator product?')) return;
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch(`/api/calculator-products?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Product deleted');
        fetchProducts();
      } else {
        setError(data.error || 'Delete failed');
      }
    } catch {
      setError('Delete failed');
    }
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading calculator products...</p>;

  return (
    <>
      <style>{`
        .cm-root {
          --cm-surface: ${isDarkMode ? '#18181c' : '#ffffff'};
          --cm-bg: ${isDarkMode ? '#0f0f11' : '#f5f5f7'};
          --cm-border: ${isDarkMode ? '#2a2a30' : '#e2e2e7'};
          --cm-text: ${isDarkMode ? '#f0f0f5' : '#111113'};
          --cm-muted: ${isDarkMode ? '#8b8b98' : '#6b6b76'};
          --cm-accent: ${isDarkMode ? '#facc15' : '#f6b400'};
          color: var(--cm-text);
        }
        .cm-head { display:flex; justify-content:space-between; align-items:center; margin-bottom: .9rem; }
        .cm-title { font-weight: 800; font-size: .95rem; }
        .cm-btn { border:0; border-radius: 7px; padding:.48rem .9rem; font-weight:800; font-size:.78rem; cursor:pointer; background:var(--cm-accent); color:#111; }
        .cm-btn.secondary { background: transparent; color: var(--cm-muted); border:1px solid var(--cm-border); }
        .cm-alert { border-radius: 7px; padding:.55rem .85rem; margin-bottom:.75rem; font-size:.8rem; }
        .cm-ok { background:#ecfdf5; color:#166534; border:1px solid #86efac; }
        .cm-err { background:#fff1f2; color:#9f1239; border:1px solid #fca5a5; }
        .cm-panel { background:var(--cm-surface); border:1px solid var(--cm-border); border-radius:8px; padding:1rem; margin-bottom:.9rem; }
        .cm-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: rgba(0,0,0,.52);
        }
        .cm-modal {
          width: min(760px, 100%);
          max-height: 88vh;
          overflow: auto;
          background: var(--cm-surface);
          border: 1px solid var(--cm-border);
          border-radius: 10px;
          box-shadow: 0 24px 80px rgba(0,0,0,.32);
        }
        .cm-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid var(--cm-border);
        }
        .cm-modal-title {
          margin: 0;
          font-size: .95rem;
          font-weight: 900;
        }
        .cm-modal-close {
          width: 2rem;
          height: 2rem;
          border-radius: 999px;
          border: 1px solid var(--cm-border);
          background: var(--cm-bg);
          color: var(--cm-text);
          cursor: pointer;
          font-weight: 900;
        }
        .cm-form { border: 0; border-radius: 0; margin: 0; }
        .cm-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:.8rem; }
        .cm-full { grid-column: 1 / -1; }
        .cm-label { display:block; color:var(--cm-muted); font-size:.66rem; font-weight:800; text-transform:uppercase; letter-spacing:.06em; margin-bottom:.28rem; }
        .cm-input, .cm-textarea, .cm-select { width:100%; box-sizing:border-box; border:1px solid var(--cm-border); border-radius:7px; background:var(--cm-bg); color:var(--cm-text); padding:.48rem .65rem; font-size:.8rem; outline:none; }
        .cm-textarea { resize:vertical; min-height:70px; }
        .cm-actions { display:flex; gap:.55rem; margin-top:.85rem; }
        .cm-table { width:100%; border-collapse:collapse; font-size:.8rem; }
        .cm-table th { text-align:left; color:var(--cm-muted); background:var(--cm-bg); padding:.55rem .75rem; font-size:.66rem; text-transform:uppercase; letter-spacing:.06em; }
        .cm-table td { border-top:1px solid var(--cm-border); padding:.62rem .75rem; vertical-align:middle; }
        .cm-price { font-weight:900; color:var(--cm-text); }
        .cm-chip { display:inline-block; border-radius:999px; background:var(--cm-bg); border:1px solid var(--cm-border); padding:.15rem .5rem; font-size:.68rem; color:var(--cm-muted); }
        .cm-row-actions { display:flex; gap:.35rem; }
        .cm-act { border:1px solid var(--cm-border); background:var(--cm-bg); color:var(--cm-text); border-radius:5px; padding:.25rem .5rem; font-size:.7rem; font-weight:800; cursor:pointer; }
        .cm-act.delete { color:#dc2626; }
        @media(max-width:760px){ .cm-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="cm-root">
        <div className="cm-head">
          <div>
            <div className="cm-title">Calculator Products</div>
            <div style={{ color: 'var(--cm-muted)', fontSize: '.75rem', marginTop: 2 }}>Add products and control prices shown in the public quotation calculator.</div>
          </div>
          <button className={`cm-btn${showForm ? ' secondary' : ''}`} onClick={() => showForm ? resetForm() : setShowForm(true)}>
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {message && <div className="cm-alert cm-ok">{message}</div>}
        {error && <div className="cm-alert cm-err">{error}</div>}

        {showForm && (
          <div className="cm-modal-backdrop" onClick={resetForm}>
            <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="cm-modal-head">
                <h3 className="cm-modal-title">{editingId ? 'Edit Calculator Product' : 'Add Calculator Product'}</h3>
                <button className="cm-modal-close" type="button" onClick={resetForm} aria-label="Close form">×</button>
              </div>
              <form className="cm-panel cm-form" onSubmit={handleSubmit}>
                <div className="cm-grid">
                  <div>
                    <label className="cm-label">Category</label>
                    <input className="cm-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Steel, Bricks, Paints..." required />
                  </div>
                  <div>
                    <label className="cm-label">Badge</label>
                    <select className="cm-select" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })}>
                      {['Mandatory', 'Recommended', 'Putty', 'Paint', 'Window', 'Door'].map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="cm-label">Product Name</label>
                    <input className="cm-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="cm-label">Price</label>
                    <input className="cm-input" type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                  </div>
                  <div>
                    <label className="cm-label">Unit</label>
                    <input className="cm-input" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="bag, kg, piece" />
                  </div>
                  <div>
                    <label className="cm-label">Image URL</label>
                    <input className="cm-input" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="cm-full">
                    <label className="cm-label">Description</label>
                    <textarea className="cm-textarea" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--cm-muted)', fontSize: '.8rem', fontWeight: 700 }}>
                    <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                    Active on public calculator
                  </label>
                </div>
                <div className="cm-actions">
                  <button className="cm-btn" type="submit">{editingId ? 'Update Product' : 'Add Product'}</button>
                  <button className="cm-btn secondary" type="button" onClick={resetForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="cm-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="cm-table">
              <thead>
                <tr>
                  {['Category', 'Product', 'Price', 'Unit', 'Status', 'Actions'].map((col) => <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td><span className="cm-chip">{product.category}</span></td>
                    <td>
                      <strong>{product.name}</strong>
                      <div style={{ color: 'var(--cm-muted)', fontSize: '.72rem', marginTop: 2 }}>{product.description || '-'}</div>
                    </td>
                    <td className="cm-price">₹{Number(product.price).toLocaleString('en-IN')}</td>
                    <td>{product.unit}</td>
                    <td><span className="cm-chip">{product.is_active ? 'Active' : 'Hidden'}</span></td>
                    <td>
                      <div className="cm-row-actions">
                        <button className="cm-act" onClick={() => handleEdit(product)}>Edit</button>
                        <button className="cm-act delete" onClick={() => handleDelete(product.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--cm-muted)', padding: '2rem' }}>No calculator products yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
