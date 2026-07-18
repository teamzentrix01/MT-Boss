'use client';

import { useState, useEffect } from 'react';
import QuickServiceIcon from './QuickServiceIcon';

const INDIAN_CITIES = [
  'Agra', 'Ahmedabad', 'Bengaluru', 'Bhopal', 'Chandigarh', 'Chennai',
  'Dehradun', 'Delhi', 'Faridabad', 'Ghaziabad', 'Greater Noida', 'Gurgaon',
  'Hyderabad', 'Jaipur', 'Kanpur', 'Kolkata', 'Lucknow', 'Meerut',
  'Moradabad', 'Mumbai', 'Noida', 'Patna', 'Pune', 'Surat', 'Varanasi',
];

async function uploadQuickServiceIcon(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) throw new Error('Cloudinary configuration is missing');
  if (!file.type.startsWith('image/')) throw new Error('Please select an image file');
  if (file.size > 2 * 1024 * 1024) throw new Error('Icon must be smaller than 2 MB');

  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', uploadPreset);
  body.append('folder', 'mtboss/quick-service-icons');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST', body,
  });
  const data = await response.json();
  if (!response.ok || !data.secure_url) throw new Error(data.error?.message || 'Icon upload failed');
  return data.secure_url;
}

export default function QuickServicesManager({ isDarkMode }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [iconUploading, setIconUploading] = useState(false);

  // ── Drag & Drop state ──────────────────────────────────────────────────────
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [orderSaving, setOrderSaving] = useState(false);

  const [formData, setFormData] = useState({
    icon: '', label: '', desc: '', basePrice: '150', duration: '', visiting_price: '150',
    main_category: '', sub_category: '', cities: [],
  });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/quick-services', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch { setError('Error fetching services'); }
    finally { setLoading(false); }
  };

  // ── Save reordered list to backend ─────────────────────────────────────────
  const saveOrder = async (ordered) => {
    setOrderSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const items = ordered.map((s, i) => ({ id: s.id, sort_order: i + 1 }));
      const res = await fetch('/api/quick-services', {
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
    // dim the ghost image a bit via a timeout trick
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

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.icon || !formData.label || !formData.desc || !formData.duration || formData.cities.length === 0) {
      setError('All fields are required'); return;
    }
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...formData } : formData;
      const res = await fetch('/api/quick-services', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(editingId ? 'Service updated!' : 'Service added!');
        setFormData({ icon: '', label: '', desc: '', basePrice: '150', duration: '', visiting_price: '150', main_category: '', sub_category: '', cities: [] });
        setEditingId(null); setShowForm(false);
        fetchServices();
      } else setError(data.error || 'Something went wrong');
    } catch { setError('Error saving service'); }
  };

  const handleIconUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIconUploading(true);
    setError('');
    try {
      const icon = await uploadQuickServiceIcon(file);
      setFormData(current => ({ ...current, icon }));
      setSuccess('Icon uploaded from gallery.');
    } catch (uploadError) {
      setError(uploadError.message || 'Icon upload failed');
    } finally {
      setIconUploading(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      icon: service.icon, label: service.label,
      desc: service.description, basePrice: '150', duration: service.duration,
      visiting_price: '150',
      main_category: service.main_category || '', sub_category: service.sub_category || '',
      cities: Array.isArray(service.cities) ? service.cities : [],
    });
    setEditingId(service.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/quick-services?id=${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) { setSuccess('Service deleted!'); fetchServices(); }
      else setError(data.error || 'Delete failed');
    } catch { setError('Error deleting service'); }
  };

  const resetForm = () => {
    setFormData({ icon: '', label: '', desc: '', basePrice: '150', duration: '', visiting_price: '150', main_category: '', sub_category: '', cities: [] });
    setEditingId(null); setShowForm(false);
  };

  if (loading) return <div style={{ color: 'var(--qs-muted)', fontSize: '0.8125rem' }}>Loading…</div>;

  return (
    <>
      <style>{`
        .qs-root {
          --qs-bg:       ${isDarkMode ? '#0f0f11' : '#f5f5f7'};
          --qs-surface:  ${isDarkMode ? '#18181c' : '#ffffff'};
          --qs-border:   ${isDarkMode ? '#2a2a30' : '#e2e2e7'};
          --qs-text:     ${isDarkMode ? '#f0f0f5' : '#111113'};
          --qs-muted:    ${isDarkMode ? '#7c7c8a' : '#6b6b76'};
          --qs-accent:   ${isDarkMode ? '#60a5fa' : '#2563eb'};
          --qs-row-hov:  ${isDarkMode ? '#1e1e24' : '#f8f8fa'};
          --qs-input-bg: ${isDarkMode ? '#111114' : '#ffffff'};
          --qs-err-bg:   ${isDarkMode ? '#2a0f0f' : '#fff1f2'};
          --qs-err-tx:   ${isDarkMode ? '#f87171' : '#9f1239'};
          --qs-err-br:   ${isDarkMode ? '#7f1d1d' : '#fca5a5'};
          --qs-ok-bg:    ${isDarkMode ? '#0f2a18' : '#f0fdf4'};
          --qs-ok-tx:    ${isDarkMode ? '#86efac' : '#14532d'};
          --qs-ok-br:    ${isDarkMode ? '#166534' : '#86efac'};
        }
        .qs-root { color: var(--qs-text); }

        .qs-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.875rem; }
        .qs-title  { font-size:0.875rem; font-weight:700; }

        .qs-add-btn {
          display:inline-flex; align-items:center; gap:0.3rem;
          padding:0.35rem 0.875rem;
          font-size:0.8125rem; font-weight:600;
          background:var(--qs-accent); color:#fff;
          border:none; border-radius:6px; cursor:pointer; transition:opacity .15s;
        }
        .qs-add-btn.cancel { background:none; border:1px solid var(--qs-border); color:var(--qs-muted); }
        .qs-add-btn:hover { opacity:.85; }

        .qs-alert { padding:0.5rem 0.875rem; border-radius:6px; border:1px solid; font-size:0.8125rem; margin-bottom:0.75rem; }
        .qs-alert-err { background:var(--qs-err-bg); color:var(--qs-err-tx); border-color:var(--qs-err-br); }
        .qs-alert-ok  { background:var(--qs-ok-bg);  color:var(--qs-ok-tx);  border-color:var(--qs-ok-br); }

        .qs-form-panel {
          background:var(--qs-surface); border:1px solid var(--qs-border);
          border-radius:8px; padding:1.25rem; margin-bottom:0.875rem;
        }
        .qs-form-title { font-size:0.8125rem; font-weight:700; margin-bottom:0.875rem; }
        .qs-form-grid  { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
        .qs-form-full  { grid-column:1/-1; }
        .qs-label {
          display:block; margin-bottom:0.3rem;
          font-size:0.65rem; font-weight:700;
          text-transform:uppercase; letter-spacing:.06em; color:var(--qs-muted);
        }
        .qs-input, .qs-textarea {
          width:100%; padding:0.4rem 0.75rem;
          background:var(--qs-input-bg); border:1px solid var(--qs-border);
          border-radius:6px; color:var(--qs-text); font-size:0.8125rem; outline:none;
          transition:border-color .15s; box-sizing:border-box;
        }
        .qs-input::placeholder, .qs-textarea::placeholder { color:var(--qs-muted); }
        .qs-input:focus, .qs-textarea:focus { border-color:var(--qs-accent); }
        .qs-icon-input-row { display:flex; align-items:stretch; gap:0.5rem; }
        .qs-icon-input-row .qs-input { flex:1; min-width:0; }
        .qs-upload-btn {
          display:inline-flex; align-items:center; justify-content:center; min-width:10rem;
          padding:0.4rem 0.75rem; border:1px solid var(--qs-border); border-radius:6px;
          background:var(--qs-bg); color:var(--qs-text); font-size:0.75rem; font-weight:700;
          cursor:pointer; white-space:nowrap;
        }
        .qs-upload-btn:hover { border-color:var(--qs-accent); color:var(--qs-accent); }
        .qs-upload-btn.disabled { opacity:.55; cursor:wait; }
        .qs-upload-btn input { display:none; }
        .qs-icon-preview { display:flex; align-items:center; gap:0.625rem; margin-top:0.5rem; color:var(--qs-muted); font-size:0.72rem; }
        .qs-icon-preview-box {
          display:inline-flex; align-items:center; justify-content:center; width:3rem; height:3rem;
          padding:0.35rem; border:1px solid var(--qs-border); border-radius:6px;
          background:var(--qs-input-bg); font-size:1.5rem; overflow:hidden;
        }
        @media (max-width: 640px) {
          .qs-form-grid { grid-template-columns:1fr; }
          .qs-form-full { grid-column:auto; }
          .qs-icon-input-row { flex-direction:column; }
          .qs-upload-btn { min-height:2.5rem; }
        }
        .qs-textarea { resize:none; }
        .qs-form-actions { display:flex; gap:0.5rem; margin-top:0.875rem; }
        .qs-btn-primary {
          flex:1; padding:0.45rem 0.75rem; background:var(--qs-accent); color:#fff;
          border:none; border-radius:6px; font-size:0.8125rem; font-weight:600;
          cursor:pointer; transition:opacity .15s;
        }
        .qs-btn-primary:hover { opacity:.85; }
        .qs-btn-secondary {
          flex:1; padding:0.45rem 0.75rem; background:none; border:1px solid var(--qs-border);
          color:var(--qs-muted); border-radius:6px; font-size:0.8125rem; font-weight:600;
          cursor:pointer; transition:all .15s;
        }
        .qs-btn-secondary:hover { border-color:var(--qs-text); color:var(--qs-text); }

        .qs-panel {
          background:var(--qs-surface); border:1px solid var(--qs-border);
          border-radius:8px; overflow:hidden; margin-bottom:0.75rem;
        }
        .qs-table { width:100%; border-collapse:collapse; font-size:0.8rem; }
        .qs-table th {
          padding:0.5rem 0.875rem; text-align:left;
          font-size:0.65rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em;
          color:var(--qs-muted); background:var(--qs-bg); border-bottom:1px solid var(--qs-border);
        }
        .qs-table td {
          padding:0.6rem 0.875rem; border-bottom:1px solid var(--qs-border);
          color:var(--qs-text); vertical-align:middle;
        }
        .qs-table tr:last-child td { border-bottom:none; }
        .qs-table tbody tr { transition:background .12s; }
        .qs-table tbody tr:hover td { background:var(--qs-row-hov); }

        .qs-icon-cell  { font-size:1.25rem; line-height:1; }
        .qs-name-cell  { font-weight:600; }
        .qs-muted-cell { color:var(--qs-muted); max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .qs-price-cell { font-weight:600; }

        .qs-row-actions { display:flex; gap:0.25rem; }
        .qs-act {
          padding:0.2rem 0.5rem; font-size:0.65rem; font-weight:700;
          border-radius:4px; border:none; cursor:pointer; transition:opacity .15s;
        }
        .qs-act:hover { opacity:.75; }
        .qs-act-edit   { background:var(--qs-bg); color:var(--qs-accent); border:1px solid var(--qs-border); }
        .qs-act-delete { background:${isDarkMode ? '#2a0f0f' : '#fff1f2'}; color:${isDarkMode ? '#f87171' : '#9f1239'}; }

        .qs-empty  { text-align:center; padding:2.5rem; font-size:0.8125rem; color:var(--qs-muted); }
        .qs-footer { font-size:0.75rem; color:var(--qs-muted); }
        .qs-footer strong { color:var(--qs-text); }

        /* ── Drag & Drop ────────────────────────────────────────────────────── */
        .qs-order-hint {
          display:flex; align-items:center; gap:0.375rem;
          font-size:0.72rem; color:var(--qs-muted);
          margin-bottom:0.5rem; padding:0.3rem 0.5rem;
          border:1px dashed var(--qs-border); border-radius:6px;
          background:var(--qs-bg);
        }
        .qs-drag-handle {
          display:inline-flex; align-items:center; justify-content:center;
          width:1.5rem; height:100%;
          cursor:grab; color:var(--qs-muted);
          font-size:1rem; user-select:none;
          opacity:0.5; transition:opacity .15s, color .15s;
        }
        .qs-table tbody tr:hover .qs-drag-handle { opacity:1; color:var(--qs-accent); }
        .qs-drag-handle:active { cursor:grabbing; }

        /* Row being dragged */
        .qs-row-dragging td { background:${isDarkMode ? '#1a1a22' : '#f0f4ff'} !important; }

        /* Drop target indicator — top border highlight */
        .qs-row-drag-over td { border-top:2px solid var(--qs-accent) !important; }
      `}</style>

      <div className="qs-root">
        {/* Header */}
        <div className="qs-header">
          <span className="qs-title">Quick Services Management</span>
          <button
            className={`qs-add-btn${showForm ? ' cancel' : ''}`}
            onClick={() => { resetForm(); setShowForm(!showForm); }}
          >
            {showForm ? '✕ Cancel' : '+ Add Service'}
          </button>
        </div>

        {error   && <div className="qs-alert qs-alert-err">{error}</div>}
        {success && <div className="qs-alert qs-alert-ok">{success}</div>}

        {/* Add / Edit form */}
        {showForm && (
          <div className="qs-form-panel">
            <div className="qs-form-title">{editingId ? 'Edit Service' : 'Add New Quick Service'}</div>
            <form onSubmit={handleSubmit}>
              <div className="qs-form-grid">
                <div>
                  <label className="qs-label">Icon *</label>
                  <div className="qs-icon-input-row">
                    <input className="qs-input" type="text" placeholder="Emoji or uploaded icon URL"
                      value={formData.icon}
                      onChange={e => setFormData({ ...formData, icon: e.target.value })} />
                    <label className={`qs-upload-btn${iconUploading ? ' disabled' : ''}`}>
                      {iconUploading ? 'Uploading...' : 'Upload from gallery'}
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        disabled={iconUploading} onChange={handleIconUpload} />
                    </label>
                  </div>
                  {formData.icon && (
                    <div className="qs-icon-preview">
                      <QuickServiceIcon value={formData.icon} label={formData.label}
                        className="qs-icon-preview-box" />
                      <span>Selected icon preview</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="qs-label">Service Name *</label>
                  <input className="qs-input" type="text" placeholder="e.g. Plumbing"
                    value={formData.label}
                    onChange={e => setFormData({ ...formData, label: e.target.value })} />
                </div>
                <div className="qs-form-full">
                  <label className="qs-label">Description *</label>
                  <textarea className="qs-textarea" rows={2} placeholder="Service description…"
                    value={formData.desc}
                    onChange={e => setFormData({ ...formData, desc: e.target.value })} />
                </div>

                <div>
                  <label className="qs-label">Duration *</label>
                  <input className="qs-input" type="text" placeholder="e.g. 1–2 hrs"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                </div>
                <div>
                  <label className="qs-label">Main Category</label>
                  <input className="qs-input" type="text" placeholder="e.g. Electrician"
                    value={formData.main_category}
                    onChange={e => setFormData({ ...formData, main_category: e.target.value })} />
                </div>
                <div>
                  <label className="qs-label">Sub Category</label>
                  <input className="qs-input" type="text" placeholder="e.g. Light, Fan"
                    value={formData.sub_category}
                    onChange={e => setFormData({ ...formData, sub_category: e.target.value })} />
                </div>
                <div className="qs-form-full">
                  <label className="qs-label">Available Cities *</label>
                  <select className="qs-input" value="" onChange={e => {
                    const city = e.target.value;
                    if (city && !formData.cities.includes(city)) {
                      setFormData({ ...formData, cities: [...formData.cities, city] });
                    }
                  }}>
                    <option value="">Select a city to add</option>
                    {INDIAN_CITIES.filter(city => !formData.cities.includes(city)).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                    {formData.cities.map(city => (
                      <button key={city} type="button" className="qs-act qs-act-edit"
                        onClick={() => setFormData({ ...formData, cities: formData.cities.filter(item => item !== city) })}
                        title={`Remove ${city}`}>
                        {city} ×
                      </button>
                    ))}
                    {formData.cities.length === 0 && <span style={{ color: 'var(--qs-muted)', fontSize: '0.72rem' }}>No city selected</span>}
                  </div>
                </div>
              </div>
              <div className="qs-form-actions">
                <button type="submit" className="qs-btn-primary" disabled={iconUploading}>
                  {iconUploading ? 'Uploading icon...' : editingId ? 'Update Service' : 'Add Service'}
                </button>
                <button type="button" className="qs-btn-secondary" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Drag hint */}
        {services.length > 1 && !showForm && (
          <div className="qs-order-hint">
            <span style={{ fontSize: '1rem' }}>⠿</span>
            Drag rows to reorder • order is saved instantly and reflects on the frontend
            {orderSaving && (
              <span style={{ marginLeft: 'auto', color: 'var(--qs-accent)', fontStyle: 'italic' }}>
                saving…
              </span>
            )}
          </div>
        )}

        {/* Table */}
        <div className="qs-panel">
          <div style={{ overflowX: 'auto' }}>
            <table className="qs-table">
              <thead>
                <tr>
                  <th style={{ width: '2rem' }} />
                  {['Icon', 'Service', 'Description', 'Cities', 'Main Category', 'Sub Category', 'Visiting Price', 'Duration', 'Actions'].map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? services.map((service, index) => (
                  <tr
                    key={service.id}
                    draggable
                    onDragStart={e => onDragStart(e, index)}
                    onDragOver={e => onDragOver(e, index)}
                    onDrop={e => onDrop(e, index)}
                    onDragEnd={onDragEnd}
                    className={[
                      dragIndex === index ? 'qs-row-dragging' : '',
                      dragOverIndex === index && dragIndex !== index ? 'qs-row-drag-over' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <td style={{ padding: '0 0.25rem 0 0.5rem', width: '2rem' }}>
                      <span className="qs-drag-handle" title="Drag to reorder">⠿</span>
                    </td>
                    <td><QuickServiceIcon value={service.icon} label={service.label}
                      className="qs-icon-cell" imageClassName="w-8 h-8 object-contain" /></td>
                    <td><span className="qs-name-cell">{service.label}</span></td>
                    <td><span className="qs-muted-cell">{service.description}</span></td>
                    <td><span className="qs-muted-cell">{service.cities?.length ? service.cities.join(', ') : 'Vendor-based'}</span></td>
                    <td><span className="qs-muted-cell">{service.main_category || '—'}</span></td>
                    <td><span className="qs-muted-cell">{service.sub_category || '—'}</span></td>
                    <td><span className="qs-price-cell">₹{service.visiting_price || 150}</span></td>
                    <td style={{ color: 'var(--qs-muted)' }}>{service.duration}</td>
                    <td>
                      <div className="qs-row-actions">
                        <button className="qs-act qs-act-edit" onClick={() => handleEdit(service)}>✏ Edit</button>
                        <button className="qs-act qs-act-delete" onClick={() => handleDelete(service.id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={11}>
                      <div className="qs-empty">No quick services yet. Add one to get started.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="qs-footer">
          Total Services: <strong>{services.length}</strong>
        </p>
      </div>
    </>
  );
}
