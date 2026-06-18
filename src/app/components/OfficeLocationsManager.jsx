'use client';

import { useCallback, useEffect, useState } from 'react';

function theme(dark) {
  return {
    bg: dark ? '#000000' : '#f8f9fa',
    card: dark ? '#111111' : '#ffffff',
    text: dark ? '#ffffff' : '#111827',
    sub: dark ? '#a1a1aa' : '#6b7280',
    muted: dark ? '#71717a' : '#9ca3af',
    border: dark ? '#27272a' : '#e5e7eb',
    inputBg: dark ? '#0a0a0a' : '#f9fafb',
    accent: 'var(--brand-blue)',
  };
}

const EMPTY = {
  city: '',
  address: '',
  phone: '+91 94584 10866',
  email: '',
  hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
  map_url: '',
  sort_order: 0,
  is_active: true,
};

function authToken() {
  return typeof window !== 'undefined'
    ? localStorage.getItem('admin-token') || localStorage.getItem('token') || ''
    : '';
}

export default function OfficeLocationsManager({ isDarkMode }) {
  const t = theme(isDarkMode);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/office-locations?all=1', {
        headers: { Authorization: `Bearer ${authToken()}` },
      });
      const data = await res.json();
      if (data.success) setOffices(data.data);
      else setError(data.error || 'Could not load offices.');
    } catch (err) {
      console.error(err);
      setError('Could not load offices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (office) => {
    setEditing(office);
    setForm({
      city: office.city || '',
      address: office.address || '',
      phone: office.phone || '',
      email: office.email || '',
      hours: office.hours || '',
      map_url: office.map_url || '',
      sort_order: office.sort_order ?? 0,
      is_active: office.is_active ?? true,
    });
    setError('');
  };

  const save = async () => {
    if (!form.city.trim() || !form.address.trim()) {
      setError('City and address are required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const method = editing ? 'PATCH' : 'POST';
      const body = editing ? { ...form, id: editing.id } : form;
      const res = await fetch('/api/office-locations', {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken()}` },
        body: JSON.stringify({
          ...body,
          sort_order: Number(body.sort_order) || 0,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Save failed.');
        return;
      }

      if (editing) {
        setOffices((prev) => prev.map((o) => (o.id === editing.id ? data.data : o)));
      } else {
        setOffices((prev) => [...prev, data.data]);
      }
      setEditing(null);
      setForm(EMPTY);
    } catch (err) {
      console.error(err);
      setError('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this office location?')) return;

    try {
      const res = await fetch('/api/office-locations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken()}` },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) setOffices((prev) => prev.filter((o) => o.id !== id));
      else setError(data.error || 'Delete failed.');
    } catch (err) {
      console.error(err);
      setError('Delete failed.');
    }
  };

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    background: t.inputBg,
    color: t.text,
    border: `1px solid ${t.border}`,
    borderRadius: 4,
    padding: '9px 11px',
    fontSize: 13,
    outline: 'none',
  };

  const labelStyle = {
    color: t.sub,
    fontSize: 10,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
  };

  const sorted = [...offices].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.city.localeCompare(b.city));

  return (
    <div style={{ background: t.bg, minHeight: '100vh', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <p style={{ color: t.accent, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>Admin Panel</p>
          <h2 style={{ color: t.text, margin: 0, fontSize: 20, fontWeight: 800, textTransform: 'uppercase' }}>Office Locations</h2>
          <p style={{ color: t.sub, margin: '4px 0 0', fontSize: 12 }}>Manage the city-wise address, contact details, hours, and map used in Find Us.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={load} style={{ border: `1px solid ${t.border}`, background: t.card, color: t.text, borderRadius: 4, padding: '8px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Refresh</button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: 4, padding: '10px 12px', marginBottom: 16, fontSize: 13, fontWeight: 700 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) 1fr', gap: 16, alignItems: 'start' }}>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 4, padding: 16 }}>
          <h3 style={{ color: t.text, margin: '0 0 14px', fontSize: 14, fontWeight: 800, textTransform: 'uppercase' }}>{editing ? `Edit ${editing.city}` : 'Office Details'}</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              ['City *', 'city', 'text', true],
              ['Phone', 'phone', 'text'],
              ['Email', 'email', 'email'],
              ['Hours', 'hours', 'text'],
              ['Map Embed URL', 'map_url', 'text'],
              ['Sort Order', 'sort_order', 'number'],
            ].map(([label, field, type, required]) => (
              <label key={field}>
                <div style={labelStyle}>{label}</div>
                <input
                  type={type}
                  required={Boolean(required)}
                  value={form[field]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                  style={inputStyle}
                />
              </label>
            ))}

            <label>
              <div style={labelStyle}>Address *</div>
              <textarea
                required
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.text, fontSize: 13, fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
              />
              Show this office publicly
            </label>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={save} disabled={saving} style={{ border: 0, background: t.accent, color: '#111827', borderRadius: 4, padding: '9px 14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.65 : 1, fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Office'}
              </button>
              {editing && (
                <button onClick={() => { setEditing(null); setForm(EMPTY); }} style={{ border: `1px solid ${t.border}`, background: t.card, color: t.text, borderRadius: 4, padding: '9px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 4, overflow: 'hidden' }}>
          {loading ? (
            <p style={{ color: t.sub, margin: 0, padding: 18, fontSize: 13 }}>Loading offices...</p>
          ) : sorted.length === 0 ? (
            <p style={{ color: t.sub, margin: 0, padding: 18, fontSize: 13 }}>No office locations yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                <thead>
                  <tr style={{ background: isDarkMode ? '#0a0a0a' : '#f3f4f6' }}>
                    {['City', 'Address', 'Contact', 'Order', 'Status', 'Actions'].map((head) => (
                      <th key={head} style={{ textAlign: 'left', color: t.sub, padding: '11px 12px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((office) => (
                    <tr key={office.id} style={{ borderTop: `1px solid ${t.border}` }}>
                      <td style={{ color: t.text, padding: '12px', fontSize: 13, fontWeight: 800 }}>{office.city}</td>
                      <td style={{ color: t.sub, padding: '12px', fontSize: 12, maxWidth: 280, lineHeight: 1.45 }}>{office.address}</td>
                      <td style={{ color: t.sub, padding: '12px', fontSize: 12, lineHeight: 1.6 }}>
                        <div>{office.phone || '-'}</div>
                        <div>{office.email || '-'}</div>
                        <div>{office.hours || '-'}</div>
                      </td>
                      <td style={{ color: t.text, padding: '12px', fontSize: 12 }}>{office.sort_order}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 999, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', background: office.is_active ? '#dcfce7' : '#fee2e2', color: office.is_active ? '#166534' : '#991b1b' }}>
                          {office.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(office)} style={{ border: 0, background: 'transparent', color: t.accent, cursor: 'pointer', fontSize: 12, fontWeight: 800 }}>Edit</button>
                          <button onClick={() => remove(office.id)} style={{ border: 0, background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 800 }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
