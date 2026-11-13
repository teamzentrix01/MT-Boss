'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, CheckCircle2, ShieldCheck, ActionIconButton } from '@/app/components/ui/icons';

const EMPTY_MODEL = {
  name: '',
  investment: 'Details after consultation',
  returns: 'Revenue model shared on call',
  area: 'Single City',
  support: 'Basic',
  color: 'border-blue-500',
  badge: 'bg-blue-500',
  popular: false,
  registration_fee: 499999,
  features: [
    'Project referral rights',
    'Brand usage license',
    'Sales training provided',
    'Marketing materials',
  ],
  sort_order: 0,
  is_active: true,
};

const SUPPORT_TIERS = ['Basic', 'Premium', 'Elite'];
const COLOR_PRESETS = [
  { label: 'Blue Theme', color: 'border-blue-500', badge: 'bg-blue-500' },
  { label: 'Brand Blue Theme', color: 'border-[var(--brand-blue)]', badge: 'bg-[var(--brand-blue)]' },
  { label: 'Purple Theme', color: 'border-purple-500', badge: 'bg-purple-500' },
  { label: 'Emerald Green', color: 'border-emerald-500', badge: 'bg-emerald-500' },
  { label: 'Amber Gold', color: 'border-amber-500', badge: 'bg-amber-500' },
];

export default function FranchiseModelsManager() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingModel, setEditingModel] = useState(null);
  const [featuresText, setFeaturesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  const token = () => localStorage.getItem('token') || localStorage.getItem('admin-token');

  const fetchModels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/franchise/models', {
        headers: { Authorization: `Bearer ${token()}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setModels(data.data);
      } else {
        setNotice({ type: 'error', text: data.error || 'Could not load franchise models' });
      }
    } catch {
      setNotice({ type: 'error', text: 'Network error loading models' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const openCreateModal = () => {
    setEditingModel({ ...EMPTY_MODEL, isNew: true });
    setFeaturesText(EMPTY_MODEL.features.join('\n'));
    setNotice({ type: '', text: '' });
  };

  const openEditModal = (model) => {
    setEditingModel({ ...model, isNew: false });
    const feats = Array.isArray(model.features) ? model.features : [];
    setFeaturesText(feats.join('\n'));
    setNotice({ type: '', text: '' });
  };

  const closeModal = () => {
    setEditingModel(null);
    setFeaturesText('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingModel) return;

    if (!editingModel.name.trim()) {
      alert('Model name is required');
      return;
    }

    setSaving(true);
    setNotice({ type: '', text: '' });

    const featureArray = featuresText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      ...editingModel,
      registration_fee: Number(editingModel.registration_fee || 0),
      features: featureArray,
    };

    try {
      const method = editingModel.isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/franchise/models', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setNotice({ type: 'success', text: data.message || 'Model saved successfully' });
        closeModal();
        fetchModels();
      } else {
        alert(data.error || 'Failed to save franchise model');
      }
    } catch (err) {
      alert('Network error while saving franchise model');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete the franchise model "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/franchise/models?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotice({ type: 'success', text: `Model "${name}" deleted` });
        fetchModels();
      } else {
        alert(data.error || 'Could not delete model');
      }
    } catch {
      alert('Error deleting model');
    }
  };

  const handleToggleActive = async (model) => {
    const updated = { ...model, is_active: !model.is_active };
    try {
      const res = await fetch('/api/admin/franchise/models', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        fetchModels();
      }
    } catch {}
  };

  return (
    <div>
      <style>{`
        .fm-head {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;
        }
        .fm-title { font-size: 1rem; font-weight: 700; color: var(--text); }
        .fm-sub { font-size: 0.78rem; color: var(--muted); margin-top: 0.2rem; }
        .fm-add-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.5rem 1rem; border-radius: 6px; background: var(--accent);
          color: #fff; font-size: 0.8125rem; font-weight: 700; border: none;
          cursor: pointer; transition: opacity .15s;
        }
        .fm-add-btn:hover { opacity: 0.9; }
        .fm-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem; margin-bottom: 2rem;
        }
        .fm-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 1.25rem; display: flex; flex-direction: column;
          position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .fm-card-badge {
          display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px;
          font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .05em; margin-bottom: 0.5rem;
        }
        .fm-card-title { font-size: 1.05rem; font-weight: 800; color: var(--text); margin-bottom: 0.35rem; }
        .fm-card-fee {
          font-size: 1.15rem; font-weight: 900; color: var(--accent);
          margin-bottom: 0.75rem;
        }
        .fm-card-meta {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;
          font-size: 0.75rem; padding: 0.65rem 0; border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border); margin-bottom: 0.85rem;
        }
        .fm-meta-label { font-size: 0.65rem; text-transform: uppercase; color: var(--muted); font-weight: 600; }
        .fm-meta-val { font-weight: 600; color: var(--text); margin-top: 1px; }
        .fm-feats-title { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--muted); margin-bottom: 0.4rem; }
        .fm-feat-item { font-size: 0.72rem; color: var(--text); margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.35rem; }
        .fm-card-actions {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 1rem; border-top: 1px solid var(--border); margin-top: auto;
        }
        .fm-btn {
          padding: 0.35rem 0.75rem; border-radius: 4px; font-size: 0.75rem;
          font-weight: 600; cursor: pointer; border: 1px solid var(--border);
          background: var(--surface); color: var(--text);
        }
        .fm-btn-danger { color: #dc2626; border-color: #fecaca; }
        .fm-btn-danger:hover { background: #fee2e2; }
      `}</style>

      {notice.text && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
          marginBottom: '1rem',
          background: notice.type === 'error' ? '#fff1f2' : '#f0fdf4',
          color: notice.type === 'error' ? '#9f1239' : '#166534',
          border: `1px solid ${notice.type === 'error' ? '#fecdd3' : '#bbf7d0'}`,
        }}>
          {notice.text}
        </div>
      )}

      <div className="fm-head">
        <div>
          <div className="fm-title">Franchise Models & Registration Fees</div>
          <div className="fm-sub">
            Manage partner tiers, online registration fees, and territory offerings shown on the public site.
          </div>
        </div>
        <button className="fm-add-btn" onClick={openCreateModal}>
          <Plus size={15} /> Add New Model
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
          Loading franchise models...
        </div>
      ) : models.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
          No franchise models found. Click &quot;Add New Model&quot; to create one.
        </div>
      ) : (
        <div className="fm-grid">
          {models.map(m => (
            <div key={m.id} className="fm-card" style={{ opacity: m.is_active ? 1 : 0.65 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="fm-card-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                  {m.support} Support
                </span>
                {m.popular && (
                  <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                    ★ Most Popular
                  </span>
                )}
              </div>

              <div className="fm-card-title">{m.name}</div>
              <div className="fm-card-fee">
                ₹{Number(m.registration_fee || 0).toLocaleString('en-IN')}
                <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 600, marginLeft: '4px' }}>
                  registration fee
                </span>
              </div>

              <div className="fm-card-meta">
                <div>
                  <div className="fm-meta-label">Area / Territory</div>
                  <div className="fm-meta-val">{m.area || 'Single City'}</div>
                </div>
                <div>
                  <div className="fm-meta-label">Returns</div>
                  <div className="fm-meta-val">{m.returns || 'Shared on call'}</div>
                </div>
                <div>
                  <div className="fm-meta-label">Investment</div>
                  <div className="fm-meta-val">{m.investment || 'Consultation'}</div>
                </div>
                <div>
                  <div className="fm-meta-label">Status</div>
                  <div className="fm-meta-val" style={{ color: m.is_active ? '#16a34a' : '#9ca3af' }}>
                    {m.is_active ? '● Active on Site' : '○ Inactive'}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem', flex: 1 }}>
                <div className="fm-feats-title">Included Features ({m.features?.length || 0}):</div>
                {(m.features || []).slice(0, 4).map((f, i) => (
                  <div key={i} className="fm-feat-item">
                    <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✓</span> {f}
                  </div>
                ))}
                {(m.features?.length || 0) > 4 && (
                  <div style={{ fontSize: '0.68rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: '2px' }}>
                    +{m.features.length - 4} more features
                  </div>
                )}
              </div>

              <div className="fm-card-actions">
                <button
                  type="button"
                  className="fm-btn"
                  onClick={() => handleToggleActive(m)}
                  title="Toggle visibility on website"
                >
                  {m.is_active ? 'Disable' : 'Enable'}
                </button>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button type="button" className="fm-btn" onClick={() => openEditModal(m)}>
                    <Pencil size={12} style={{ display: 'inline', marginRight: '3px' }} /> Edit
                  </button>
                  <button
                    type="button"
                    className="fm-btn fm-btn-danger"
                    onClick={() => handleDelete(m.id, m.name)}
                    title="Delete model"
                  >
                    <Trash2 size={12} style={{ display: 'inline' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── EDIT / CREATE MODAL ── */}
      {editingModel && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '10px', width: 'min(640px, 100%)', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          }}>
            <div style={{
              padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                {editingModel.isNew ? 'Create New Franchise Model' : `Edit: ${editingModel.name}`}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                    Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingModel.name || ''}
                    onChange={e => setEditingModel({ ...editingModel, name: e.target.value })}
                    placeholder="e.g. Associate Partner"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                    Registration Fee (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={editingModel.registration_fee ?? ''}
                    onChange={e => setEditingModel({ ...editingModel, registration_fee: e.target.value })}
                    placeholder="e.g. 499999"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                    Territory / Area
                  </label>
                  <input
                    type="text"
                    value={editingModel.area || ''}
                    onChange={e => setEditingModel({ ...editingModel, area: e.target.value })}
                    placeholder="e.g. Single City, Multiple Districts"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                    Support Tier
                  </label>
                  <select
                    value={editingModel.support || 'Basic'}
                    onChange={e => setEditingModel({ ...editingModel, support: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  >
                    {SUPPORT_TIERS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                    Investment Proposal Text
                  </label>
                  <input
                    type="text"
                    value={editingModel.investment || ''}
                    onChange={e => setEditingModel({ ...editingModel, investment: e.target.value })}
                    placeholder="e.g. Details after consultation"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                    Returns / Revenue Text
                  </label>
                  <input
                    type="text"
                    value={editingModel.returns || ''}
                    onChange={e => setEditingModel({ ...editingModel, returns: e.target.value })}
                    placeholder="e.g. Revenue model shared on call"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                  Features & Offerings (one per line)
                </label>
                <textarea
                  rows={5}
                  value={featuresText}
                  onChange={e => setFeaturesText(e.target.value)}
                  placeholder="Brand usage license&#10;Lead generation support&#10;Dedicated relationship manager"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.82rem', fontFamily: 'monospace', lineHeight: 1.5 }}
                />
                <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>
                  Each line will appear as a feature bullet point with a checkmark on the website card.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text)' }}>
                  <input
                    type="checkbox"
                    checked={editingModel.popular === true}
                    onChange={e => setEditingModel({ ...editingModel, popular: e.target.checked })}
                  />
                  <span>Mark as <strong>&quot;Most Popular&quot;</strong> badge</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text)' }}>
                  <input
                    type="checkbox"
                    checked={editingModel.is_active !== false}
                    onChange={e => setEditingModel({ ...editingModel, is_active: e.target.checked })}
                  />
                  <span>Visible on Public Website</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: 'var(--accent)', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {saving ? 'Saving...' : 'Save Franchise Model'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

