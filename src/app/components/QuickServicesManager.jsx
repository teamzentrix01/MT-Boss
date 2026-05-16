'use client';

import { useState, useEffect } from 'react';

export default function QuickServicesManager({ isDarkMode }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    icon: '',
    label: '',
    desc: '',
    basePrice: '',
    duration: '',
  });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/quick-services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch { setError('Error fetching services'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!formData.icon || !formData.label || !formData.desc || !formData.basePrice || !formData.duration) {
      setError('All fields are required');
      return;
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
        setSuccess(editingId ? 'Service updated successfully' : 'Service added successfully');
        setFormData({ icon: '', label: '', desc: '', basePrice: '', duration: '' });
        setEditingId(null);
        setShowForm(false);
        fetchServices();
      } else setError(data.error || 'Something went wrong');
    } catch { setError('Error saving service'); }
  };

  const handleEdit = (service) => {
    setFormData({
      icon: service.icon,
      label: service.label,
      desc: service.description,
      basePrice: service.base_price,
      duration: service.duration,
    });
    setEditingId(service.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/quick-services?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) { setSuccess('Service deleted successfully'); fetchServices(); }
      else setError(data.error || 'Delete failed');
    } catch { setError('Error deleting service'); }
  };

  const resetForm = () => {
    setFormData({ icon: '', label: '', desc: '', basePrice: '', duration: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div style={{ color: 'var(--qs-muted)', fontSize: '0.8125rem' }}>Loading…</div>;

  return (
    <>
      <style>{`
        .qs-root {
          --qs-bg:      ${isDarkMode ? '#0f0f11' : '#f5f5f7'};
          --qs-surface: ${isDarkMode ? '#18181c' : '#ffffff'};
          --qs-border:  ${isDarkMode ? '#2a2a30' : '#e2e2e7'};
          --qs-text:    ${isDarkMode ? '#f0f0f5' : '#111113'};
          --qs-muted:   ${isDarkMode ? '#7c7c8a' : '#6b6b76'};
          --qs-accent:  ${isDarkMode ? '#60a5fa' : '#2563eb'};
          --qs-row-hov: ${isDarkMode ? '#1e1e24' : '#f8f8fa'};
          --qs-input-bg:${isDarkMode ? '#111114' : '#ffffff'};
          --qs-err-bg:  ${isDarkMode ? '#2a0f0f' : '#fff1f2'};
          --qs-err-tx:  ${isDarkMode ? '#f87171' : '#9f1239'};
          --qs-err-br:  ${isDarkMode ? '#7f1d1d' : '#fca5a5'};
          --qs-ok-bg:   ${isDarkMode ? '#0f2a18' : '#f0fdf4'};
          --qs-ok-tx:   ${isDarkMode ? '#86efac' : '#14532d'};
          --qs-ok-br:   ${isDarkMode ? '#166534' : '#86efac'};
        }
        .qs-root { color: var(--qs-text); }

        /* Header */
        .qs-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.875rem; }
        .qs-title  { font-size:0.875rem; font-weight:700; }

        .qs-add-btn {
          display:inline-flex; align-items:center; gap:0.3rem;
          padding:0.35rem 0.875rem;
          font-size:0.8125rem; font-weight:600;
          background:var(--qs-accent); color:#fff;
          border:none; border-radius:6px; cursor:pointer;
          transition:opacity .15s;
        }
        .qs-add-btn.cancel {
          background:none;
          border:1px solid var(--qs-border);
          color:var(--qs-muted);
        }
        .qs-add-btn:hover { opacity:.85; }

        /* Alerts */
        .qs-alert { padding:0.5rem 0.875rem; border-radius:6px; border:1px solid; font-size:0.8125rem; margin-bottom:0.75rem; }
        .qs-alert-err { background:var(--qs-err-bg); color:var(--qs-err-tx); border-color:var(--qs-err-br); }
        .qs-alert-ok  { background:var(--qs-ok-bg);  color:var(--qs-ok-tx);  border-color:var(--qs-ok-br);  }

        /* Form panel */
        .qs-form-panel {
          background:var(--qs-surface);
          border:1px solid var(--qs-border);
          border-radius:8px; padding:1.25rem;
          margin-bottom:0.875rem;
        }
        .qs-form-title { font-size:0.8125rem; font-weight:700; margin-bottom:0.875rem; }
        .qs-form-grid  { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
        .qs-form-full  { grid-column:1/-1; }

        .qs-label {
          display:block; margin-bottom:0.3rem;
          font-size:0.65rem; font-weight:700;
          text-transform:uppercase; letter-spacing:.06em;
          color:var(--qs-muted);
        }
        .qs-input, .qs-textarea {
          width:100%; padding:0.4rem 0.75rem;
          background:var(--qs-input-bg);
          border:1px solid var(--qs-border);
          border-radius:6px; color:var(--qs-text);
          font-size:0.8125rem; outline:none;
          transition:border-color .15s;
          box-sizing:border-box;
        }
        .qs-input::placeholder, .qs-textarea::placeholder { color:var(--qs-muted); }
        .qs-input:focus, .qs-textarea:focus { border-color:var(--qs-accent); }
        .qs-textarea { resize:none; }

        .qs-form-actions { display:flex; gap:0.5rem; margin-top:0.875rem; }
        .qs-btn-primary {
          flex:1; padding:0.45rem 0.75rem;
          background:var(--qs-accent); color:#fff;
          border:none; border-radius:6px;
          font-size:0.8125rem; font-weight:600;
          cursor:pointer; transition:opacity .15s;
        }
        .qs-btn-primary:hover { opacity:.85; }
        .qs-btn-secondary {
          flex:1; padding:0.45rem 0.75rem;
          background:none; border:1px solid var(--qs-border);
          color:var(--qs-muted); border-radius:6px;
          font-size:0.8125rem; font-weight:600;
          cursor:pointer; transition:all .15s;
        }
        .qs-btn-secondary:hover { border-color:var(--qs-text); color:var(--qs-text); }

        /* Table panel */
        .qs-panel {
          background:var(--qs-surface);
          border:1px solid var(--qs-border);
          border-radius:8px; overflow:hidden;
          margin-bottom:0.75rem;
        }
        .qs-table { width:100%; border-collapse:collapse; font-size:0.8rem; }
        .qs-table th {
          padding:0.5rem 0.875rem;
          text-align:left; font-size:0.65rem; font-weight:700;
          text-transform:uppercase; letter-spacing:.06em;
          color:var(--qs-muted);
          background:var(--qs-bg);
          border-bottom:1px solid var(--qs-border);
        }
        .qs-table td {
          padding:0.6rem 0.875rem;
          border-bottom:1px solid var(--qs-border);
          color:var(--qs-text);
          vertical-align:middle;
        }
        .qs-table tr:last-child td { border-bottom:none; }
        .qs-table tbody tr { transition:background .12s; }
        .qs-table tbody tr:hover td { background:var(--qs-row-hov); }

        .qs-icon-cell { font-size:1.25rem; line-height:1; }
        .qs-name-cell { font-weight:600; }
        .qs-muted-cell { color:var(--qs-muted); max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .qs-price-cell { font-weight:600; }

        /* Row actions */
        .qs-row-actions { display:flex; gap:0.25rem; }
        .qs-act {
          padding:0.2rem 0.5rem;
          font-size:0.65rem; font-weight:700;
          border-radius:4px; border:none; cursor:pointer;
          transition:opacity .15s;
        }
        .qs-act:hover { opacity:.75; }
        .qs-act-edit   { background:var(--qs-bg); color:var(--qs-accent); border:1px solid var(--qs-border); }
        .qs-act-delete {
          background:${isDarkMode ? '#2a0f0f' : '#fff1f2'};
          color:${isDarkMode ? '#f87171' : '#9f1239'};
        }

        .qs-empty { text-align:center; padding:2.5rem; font-size:0.8125rem; color:var(--qs-muted); }
        .qs-footer { font-size:0.75rem; color:var(--qs-muted); }
        .qs-footer strong { color:var(--qs-text); }
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

        {/* Form */}
        {showForm && (
          <div className="qs-form-panel">
            <div className="qs-form-title">{editingId ? 'Edit Service' : 'Add New Quick Service'}</div>
            <form onSubmit={handleSubmit}>
              <div className="qs-form-grid">
                <div>
                  <label className="qs-label">Icon *</label>
                  <input className="qs-input" type="text" placeholder="e.g. 🔧"
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })} />
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
                  <label className="qs-label">Base Price (₹) *</label>
                  <input className="qs-input" type="number" placeholder="299"
                    value={formData.basePrice}
                    onChange={e => setFormData({ ...formData, basePrice: e.target.value })} />
                </div>
                <div>
                  <label className="qs-label">Duration *</label>
                  <input className="qs-input" type="text" placeholder="e.g. 1–2 hrs"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                </div>
              </div>
              <div className="qs-form-actions">
                <button type="submit" className="qs-btn-primary">
                  {editingId ? 'Update Service' : 'Add Service'}
                </button>
                <button type="button" className="qs-btn-secondary" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="qs-panel">
          <div style={{ overflowX: 'auto' }}>
            <table className="qs-table">
              <thead>
                <tr>
                  {['Icon','Service','Description','Price','Duration','Actions'].map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? services.map(service => (
                  <tr key={service.id}>
                    <td><span className="qs-icon-cell">{service.icon}</span></td>
                    <td><span className="qs-name-cell">{service.label}</span></td>
                    <td><span className="qs-muted-cell">{service.description}</span></td>
                    <td><span className="qs-price-cell">₹{service.base_price}</span></td>
                    <td style={{ color: 'var(--qs-muted)' }}>{service.duration}</td>
                    <td>
                      <div className="qs-row-actions">
                        <button className="qs-act qs-act-edit" onClick={() => handleEdit(service)}>✏ Edit</button>
                        <button className="qs-act qs-act-delete" onClick={() => handleDelete(service.id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6}><div className="qs-empty">No quick services yet. Add one to get started.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="qs-footer">Total Services: <strong>{services.length}</strong></p>
      </div>
    </>
  );
}