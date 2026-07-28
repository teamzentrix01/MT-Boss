'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const emptyForm = { name: '', state: '', is_active: true, sort_order: 0 };

export default function CitiesManager() {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  }), []);

  const loadCities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/cities?all=1', {
        headers: authHeaders(),
        cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not load cities');
      setCities(data.data || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => { loadCities(); }, [loadCities]);

  const filteredCities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return cities;
    return cities.filter((city) =>
      [city.name, city.state].some((value) => String(value || '').toLowerCase().includes(query))
    );
  }, [cities, search]);

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch('/api/cities', {
        method: editingId ? 'PATCH' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not save city');
      setMessage(editingId ? `${form.name} was updated successfully.` : `${form.name} was added successfully.`);
      reset();
      await loadCities();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (city) => {
    setEditingId(city.id);
    setForm({
      name: city.name,
      state: city.state || '',
      is_active: city.is_active !== false,
      sort_order: city.sort_order || 0,
    });
    setError('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (city) => {
    const confirmed = window.confirm(
      `Permanently delete ${city.name}?\n\nIt will be removed from every city list and cannot be restored.`
    );
    if (!confirmed) return;

    setDeletingId(city.id);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`/api/cities?id=${city.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not delete city');
      setCities((current) => current.filter((item) => item.id !== city.id));
      if (editingId === city.id) reset();
      setMessage(data.message || `${city.name} was permanently deleted.`);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="city-admin">
      <style>{`
        .city-admin { color: var(--text); width: 100%; }
        .city-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:18px; }
        .city-title { margin:0; font-size:1.25rem; line-height:1.3; font-weight:800; }
        .city-subtitle { margin:5px 0 0; color:var(--muted); font-size:.78rem; line-height:1.5; }
        .city-count { flex:none; padding:7px 12px; border:1px solid var(--border); border-radius:999px; color:var(--muted); font-size:.72rem; font-weight:700; }
        .city-alert { border:1px solid; border-radius:8px; padding:10px 13px; margin-bottom:12px; font-size:.78rem; font-weight:600; }
        .city-alert.error { color:#ef4444; border-color:#ef444466; background:#ef444412; }
        .city-alert.success { color:#22c55e; border-color:#22c55e55; background:#22c55e12; }
        .city-card { background:var(--surface); border:1px solid var(--border); border-radius:10px; overflow:hidden; }
        .city-form { padding:18px; margin-bottom:16px; }
        .city-form-title { margin:0 0 14px; font-size:.82rem; font-weight:800; }
        .city-grid { display:grid; grid-template-columns:minmax(180px,1.3fr) minmax(180px,1fr) minmax(120px,.55fr) auto; gap:12px; align-items:end; }
        .city-label { display:block; margin-bottom:6px; color:var(--muted); font-size:.66rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; }
        .city-input { width:100%; height:40px; box-sizing:border-box; border:1px solid var(--border); border-radius:7px; background:var(--bg); color:var(--text); padding:0 11px; font-size:.82rem; outline:none; }
        .city-input::placeholder { color:var(--muted); opacity:.8; }
        .city-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent); }
        .city-active { height:40px; display:flex; align-items:center; gap:8px; padding:0 11px; border:1px solid var(--border); border-radius:7px; background:var(--bg); font-size:.78rem; font-weight:700; white-space:nowrap; }
        .city-active input { width:16px; height:16px; accent-color:var(--accent); }
        .city-actions { display:flex; gap:8px; margin-top:14px; }
        .city-btn { border:0; border-radius:7px; padding:9px 15px; font-size:.75rem; font-weight:800; cursor:pointer; transition:opacity .15s, transform .15s; }
        .city-btn:hover { opacity:.88; }
        .city-btn:active { transform:translateY(1px); }
        .city-btn:disabled { opacity:.55; cursor:not-allowed; }
        .city-btn.primary { background:var(--accent); color:#fff; }
        .city-btn.secondary { background:var(--bg); color:var(--text); border:1px solid var(--border); }
        .city-toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:13px 15px; border-bottom:1px solid var(--border); }
        .city-toolbar-title { font-size:.82rem; font-weight:800; }
        .city-search { width:min(280px, 50%); }
        .city-table-wrap { overflow-x:auto; }
        .city-table { width:100%; border-collapse:collapse; font-size:.78rem; }
        .city-table th { background:var(--bg); color:var(--muted); padding:10px 15px; text-align:left; font-size:.65rem; text-transform:uppercase; letter-spacing:.07em; white-space:nowrap; }
        .city-table td { padding:12px 15px; border-top:1px solid var(--border); vertical-align:middle; }
        .city-table tbody tr:hover { background:color-mix(in srgb, var(--accent) 4%, transparent); }
        .city-name { font-weight:800; }
        .city-state { color:var(--muted); }
        .city-status { display:inline-flex; align-items:center; gap:6px; border-radius:999px; padding:4px 9px; font-size:.65rem; font-weight:800; }
        .city-status::before { content:''; width:6px; height:6px; border-radius:50%; background:currentColor; }
        .city-status.active { color:#22c55e; background:#22c55e17; }
        .city-status.inactive { color:#f59e0b; background:#f59e0b17; }
        .city-row-actions { display:flex; gap:7px; }
        .city-row-btn { border:1px solid var(--border); border-radius:6px; background:var(--bg); color:var(--text); padding:6px 10px; font-size:.69rem; font-weight:800; cursor:pointer; }
        .city-row-btn.edit:hover { color:var(--accent); border-color:var(--accent); }
        .city-row-btn.delete { color:#ef4444; border-color:#ef444455; background:#ef44440c; }
        .city-row-btn:disabled { opacity:.5; cursor:not-allowed; }
        .city-empty { padding:38px 16px; text-align:center; color:var(--muted); font-size:.8rem; }
        @media (max-width:900px) { .city-grid { grid-template-columns:1fr 1fr; } }
        @media (max-width:600px) {
          .city-head { flex-direction:column; }
          .city-grid { grid-template-columns:1fr; }
          .city-toolbar { align-items:stretch; flex-direction:column; }
          .city-search { width:100%; }
          .city-table th, .city-table td { padding:10px 12px; }
        }
      `}</style>

      <header className="city-head">
        <div>
          <h2 className="city-title">City Management</h2>
          <p className="city-subtitle">
            Manage the cities available across Quick Services, Properties, Vendors, Careers and other non-construction workflows.
          </p>
        </div>
        <span className="city-count">{cities.length} {cities.length === 1 ? 'city' : 'cities'}</span>
      </header>

      {error && <div className="city-alert error">{error}</div>}
      {message && <div className="city-alert success">{message}</div>}

      <form className="city-card city-form" onSubmit={submit}>
        <h3 className="city-form-title">{editingId ? 'Edit city' : 'Add a new city'}</h3>
        <div className="city-grid">
          <label>
            <span className="city-label">City name *</span>
            <input className="city-input" required maxLength={120} value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="e.g. Moradabad" />
          </label>
          <label>
            <span className="city-label">State</span>
            <input className="city-input" maxLength={120} value={form.state}
              onChange={(event) => setForm({ ...form, state: event.target.value })}
              placeholder="e.g. Uttar Pradesh" />
          </label>
          <label>
            <span className="city-label">Display order</span>
            <input className="city-input" type="number" min="0" value={form.sort_order}
              onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} />
          </label>
          <label className="city-active">
            <input type="checkbox" checked={form.is_active}
              onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
            Active
          </label>
        </div>
        <div className="city-actions">
          <button className="city-btn primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add city'}
          </button>
          {editingId && (
            <button className="city-btn secondary" type="button" onClick={reset} disabled={saving}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="city-card">
        <div className="city-toolbar">
          <span className="city-toolbar-title">All cities</span>
          <input className="city-input city-search" type="search" value={search}
            onChange={(event) => setSearch(event.target.value)} placeholder="Search city or state..." />
        </div>
        <div className="city-table-wrap">
          <table className="city-table">
            <thead>
              <tr>
                <th>City</th>
                <th>State</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCities.map((city) => (
                <tr key={city.id}>
                  <td className="city-name">{city.name}</td>
                  <td className="city-state">{city.state || '—'}</td>
                  <td>{city.sort_order}</td>
                  <td>
                    <span className={`city-status ${city.is_active ? 'active' : 'inactive'}`}>
                      {city.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="city-row-actions">
                      <button className="city-row-btn edit" type="button" onClick={() => startEdit(city)}>
                        Edit
                      </button>
                      <button className="city-row-btn delete" type="button" onClick={() => remove(city)}
                        disabled={deletingId === city.id}>
                        {deletingId === city.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="city-empty">Loading cities...</div>}
          {!loading && filteredCities.length === 0 && (
            <div className="city-empty">{search ? 'No cities match your search.' : 'No cities have been added yet.'}</div>
          )}
        </div>
      </div>
    </section>
  );
}
