'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SupplierDashboard() {
  const router = useRouter();
  const [supplier, setSupplier] = useState(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🧱',
    label: '',
    labelColor: 'blue',
    priceRange: '',
    unit: '',
  });

  const labelColorOptions = ['blue', 'yellow', 'green', 'purple', 'pink', 'orange', 'amber', 'cyan'];
  const labelOptions = ['HIGH VOLUME', 'ALWAYS NEEDED', 'GROWING', 'STEADY DEMAND', 'SPECIALIZED', 'REGULAR SUPPLY', 'BULK SUPPLY', 'HIGH DEMAND'];

  // Dark mode detection
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Load supplier from localStorage
  useEffect(() => {
    const supplierData = localStorage.getItem('supplier');
    const token = localStorage.getItem('supplier-token');
    if (!token || !supplierData) {
      router.push('/supplier/login');
      return;
    }
    try {
      const parsed = JSON.parse(supplierData);
      setSupplier(parsed);
      setLoading(false);
      fetchCategories(token);
    } catch {
      router.push('/supplier/login');
    }
  }, [router]);

  // Fetch categories from API
  const fetchCategories = async (token) => {
    setLoadingCategories(true);
    try {
      const res = await fetch(`/api/supplier/categories?supplierId=1`, {
        headers: { 'Authorization': `Bearer ${token || localStorage.getItem('supplier-token')}` }
      });
      const data = await res.json();
      if (data.success) setCategories(data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Open modal for new/edit
  const openModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name,
        emoji: category.emoji,
        label: category.label,
        labelColor: category.labelColor,
        priceRange: category.priceRange,
        unit: category.unit,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        emoji: '🧱',
        label: '',
        labelColor: 'blue',
        priceRange: '',
        unit: '',
      });
    }
    setShowModal(true);
  };

  // Save category (create or update)
  const saveCategory = async () => {
    if (!formData.name || !formData.label || !formData.priceRange || !formData.unit) {
      alert('All fields are required!');
      return;
    }

    try {
      const token = localStorage.getItem('supplier-token');
      const payload = { ...formData, supplierId: 1 };

      if (editingId) {
        // Update
        const res = await fetch(`/api/supplier/categories/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setCategories(categories.map(c => c.id === editingId ? data.data : c));
          alert('Category updated!');
        }
      } else {
        // Create
        const res = await fetch(`/api/supplier/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setCategories([...categories, data.data]);
          alert('Category added!');
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Error saving category');
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      const token = localStorage.getItem('supplier-token');
      const res = await fetch(`/api/supplier/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter(c => c.id !== id));
        alert('Category deleted!');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Error deleting category');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('supplier-token');
    localStorage.removeItem('supplier');
    router.push('/supplier/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: dark ? '#000' : '#f5f5f7',
        color: dark ? '#fff' : '#111', fontFamily: 'DM Sans, sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <style>{`
        .sd-page {
          min-height: 100vh;
          background: ${dark ? '#0a0a0a' : '#f0ede8'};
          color: ${dark ? '#fff' : '#111'};
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .sd-topbar {
          background: ${dark ? '#111' : '#fff'};
          border-bottom: 1px solid ${dark ? '#222' : '#e5e0d8'};
          padding: 0 2rem;
          height: 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .sd-topbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sd-logo {
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          white-space: nowrap;
          color: ${dark ? '#fff' : '#111'};
        }
        .sd-logo span { color: #f59e0b; }

        .sd-divider {
          width: 1px;
          height: 20px;
          background: ${dark ? '#333' : '#ddd'};
        }

        .sd-supplier-name {
          font-size: 0.8rem;
          color: ${dark ? '#666' : '#999'};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sd-topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .sd-status-pill {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: ${dark ? '#1a2a0a' : '#dcfce7'};
          color: #22c55e;
          border: 1px solid #22c55e33;
        }

        .sd-logout-btn {
          padding: 0.5rem 1.1rem;
          background: transparent;
          color: ${dark ? '#888' : '#666'};
          border: 1px solid ${dark ? '#333' : '#ddd'};
          border-radius: 7px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.78rem;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .sd-logout-btn:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .sd-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem;
        }

        .sd-page-header {
          margin-bottom: 2rem;
        }
        .sd-page-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.3rem;
          letter-spacing: -0.02em;
        }
        .sd-page-sub {
          font-size: 0.85rem;
          color: ${dark ? '#555' : '#999'};
        }

        .sd-tabs {
          display: flex;
          border-bottom: 2px solid ${dark ? '#222' : '#e5e0d8'};
          margin-bottom: 2rem;
          gap: 0;
        }
        .sd-tab {
          padding: 0.875rem 1.5rem;
          background: none;
          border: none;
          color: ${dark ? '#555' : '#aaa'};
          cursor: pointer;
          font-weight: 600;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          position: relative;
          transition: color 0.2s;
          white-space: nowrap;
          font-family: inherit;
        }
        .sd-tab:hover { color: ${dark ? '#fff' : '#111'}; }
        .sd-tab.active { color: #f59e0b; }
        .sd-tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 2px;
          background: #f59e0b;
        }

        .sd-btn-add {
          padding: 0.6rem 1.2rem;
          background: #f59e0b;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: all 0.2s;
        }
        .sd-btn-add:hover {
          background: #d97706;
          transform: translateY(-2px);
        }

        .sd-categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .sd-cat-card {
          background: ${dark ? '#111' : '#fff'};
          border: 1px solid ${dark ? '#222' : '#e5e0d8'};
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sd-cat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .sd-cat-emoji {
          font-size: 2.5rem;
        }

        .sd-cat-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: ${dark ? '#ddd' : '#222'};
          flex: 1;
        }

        .sd-cat-actions {
          display: flex;
          gap: 0.5rem;
        }

        .sd-btn-icon {
          padding: 0.4rem 0.6rem;
          background: transparent;
          border: 1px solid ${dark ? '#333' : '#ddd'};
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.7rem;
          transition: all 0.2s;
        }
        .sd-btn-icon:hover {
          border-color: #f59e0b;
          background: ${dark ? '#1a1a1a' : '#fef9c3'};
        }
        .sd-btn-icon.delete:hover {
          border-color: #ef4444;
          background: ${dark ? '#2a1a1a' : '#fee2e2'};
        }

        .sd-cat-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: ${dark ? '#666' : '#999'};
        }

        .sd-cat-label {
          display: inline-block;
          background: ${dark ? '#222' : '#f0ede8'};
          padding: 0.3rem 0.7rem;
          border-radius: 6px;
          font-weight: 600;
          color: #f59e0b;
          width: fit-content;
        }

        .sd-empty {
          padding: 3rem;
          text-align: center;
          color: ${dark ? '#444' : '#bbb'};
          font-size: 0.875rem;
        }

        /* Modal */
        .sd-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(4px);
        }

        .sd-modal {
          background: ${dark ? '#111' : '#fff'};
          border: 1px solid ${dark ? '#222' : '#e5e0d8'};
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .sd-modal-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: ${dark ? '#fff' : '#111'};
        }

        .sd-form-group {
          margin-bottom: 1.2rem;
        }

        .sd-form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
          color: ${dark ? '#999' : '#666'};
        }

        .sd-form-input,
        .sd-form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid ${dark ? '#333' : '#ddd'};
          border-radius: 8px;
          background: ${dark ? '#1a1a1a' : '#f5f5f5'};
          color: ${dark ? '#fff' : '#111'};
          font-family: inherit;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .sd-form-input:focus,
        .sd-form-select:focus {
          outline: none;
          border-color: #f59e0b;
        }

        .sd-emoji-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .sd-emoji-btn {
          padding: 0.8rem;
          background: ${dark ? '#1a1a1a' : '#f5f5f5'};
          border: 2px solid ${dark ? '#333' : '#ddd'};
          border-radius: 8px;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sd-emoji-btn.selected {
          border-color: #f59e0b;
          background: ${dark ? '#2a1a0a' : '#fef9c3'};
        }
        .sd-emoji-btn:hover {
          transform: scale(1.1);
        }

        .sd-modal-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .sd-btn-primary {
          flex: 1;
          padding: 0.75rem;
          background: #f59e0b;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .sd-btn-primary:hover {
          background: #d97706;
        }

        .sd-btn-secondary {
          flex: 1;
          padding: 0.75rem;
          background: transparent;
          color: ${dark ? '#888' : '#666'};
          border: 1px solid ${dark ? '#333' : '#ddd'};
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .sd-btn-secondary:hover {
          border-color: ${dark ? '#666' : '#ccc'};
        }

        .sd-loading {
          padding: 2rem;
          text-align: center;
          color: ${dark ? '#555' : '#aaa'};
          font-size: 0.875rem;
        }

        @media (max-width: 640px) {
          .sd-topbar { padding: 0 1rem; }
          .sd-body { padding: 1rem; }
          .sd-page-title { font-size: 1.4rem; }
          .sd-categories-grid { grid-template-columns: 1fr; }
          .sd-supplier-name { display: none; }
          .sd-divider { display: none; }
          .sd-modal {
            width: 95%;
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="sd-page">

        {/* Top Bar */}
        <div className="sd-topbar">
          <div className="sd-topbar-left">
            <div className="sd-logo">SUPPLIER<span>HUB</span></div>
            <div className="sd-divider" />
            <div className="sd-supplier-name">{supplier?.name}</div>
          </div>
          <div className="sd-topbar-right">
            <span className="sd-status-pill">Active</span>
            <button className="sd-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="sd-body">

          {/* Page Header */}
          <div className="sd-page-header">
            <div className="sd-page-title">
              Manage Categories 📦
            </div>
            <div className="sd-page-sub">
              Add, edit, or remove product categories from your catalog
            </div>
          </div>

          {/* Tabs */}
          <div className="sd-tabs">
            <button
              className={`sd-tab ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              📋 Categories
            </button>
          </div>

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <button className="sd-btn-add" onClick={() => openModal()}>
                  + Add Category
                </button>
              </div>

              {loadingCategories ? (
                <div className="sd-loading">Loading categories...</div>
              ) : categories.length > 0 ? (
                <div className="sd-categories-grid">
                  {categories.map(cat => (
                    <div key={cat.id} className="sd-cat-card">
                      <div className="sd-cat-header">
                        <div className="sd-cat-emoji">{cat.emoji}</div>
                        <div className="sd-cat-actions">
                          <button
                            className="sd-btn-icon"
                            onClick={() => openModal(cat)}
                            title="Edit"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="sd-btn-icon delete"
                            onClick={() => deleteCategory(cat.id)}
                            title="Delete"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="sd-cat-name">{cat.name}</div>
                        <div className="sd-cat-label">{cat.label}</div>
                      </div>
                      <div className="sd-cat-details">
                        <div>Price: <strong>{cat.priceRange}</strong></div>
                        <div>Unit: <strong>{cat.unit}</strong></div>
                        <div>Color: <strong>{cat.labelColor}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="sd-empty">
                  No categories yet. Add your first category! 👇
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="sd-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sd-modal" onClick={e => e.stopPropagation()}>
            <h2 className="sd-modal-title">
              {editingId ? '✏️ Edit Category' : '➕ Add New Category'}
            </h2>

            {/* Emoji Selector */}
            <div className="sd-form-group">
              <label className="sd-form-label">Emoji</label>
              <div className="sd-emoji-grid">
                {['🧱', '⚙️', '🪵', '🔧', '🪟', '🎨', '🪨', '💡', '🔩', '🏗️', '⛏️', '🛠️'].map(emoji => (
                  <button
                    key={emoji}
                    className={`sd-emoji-btn ${formData.emoji === emoji ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, emoji })}
                    type="button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="sd-form-group">
              <label className="sd-form-label">Category Name *</label>
              <input
                type="text"
                className="sd-form-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., CEMENT & CONCRETE"
              />
            </div>

            {/* Label */}
            <div className="sd-form-group">
              <label className="sd-form-label">Label *</label>
              <select
                className="sd-form-select"
                value={formData.label}
                onChange={e => setFormData({ ...formData, label: e.target.value })}
              >
                <option value="">Select label</option>
                {labelOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Label Color */}
            <div className="sd-form-group">
              <label className="sd-form-label">Label Color *</label>
              <select
                className="sd-form-select"
                value={formData.labelColor}
                onChange={e => setFormData({ ...formData, labelColor: e.target.value })}
              >
                {labelColorOptions.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="sd-form-group">
              <label className="sd-form-label">Price Range *</label>
              <input
                type="text"
                className="sd-form-input"
                value={formData.priceRange}
                onChange={e => setFormData({ ...formData, priceRange: e.target.value })}
                placeholder="e.g., ₹380–450 / bag"
              />
            </div>

            {/* Unit */}
            <div className="sd-form-group">
              <label className="sd-form-label">Unit *</label>
              <input
                type="text"
                className="sd-form-input"
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g., per 50kg bag"
              />
            </div>

            <div className="sd-modal-buttons">
              <button className="sd-btn-primary" onClick={saveCategory}>
                {editingId ? '💾 Update' : '✅ Add'}
              </button>
              <button className="sd-btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}