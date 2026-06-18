'use client';

import { useEffect, useMemo, useState } from 'react';

const TIME_SLOTS = [
  '08:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

export default function PaidTimeSlotsManager({ tokenKey = 'token', defaultCity = '', compact = false }) {
  const [services, setServices] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    quick_service_id: '',
    city: defaultCity || '',
    slot_date: new Date().toISOString().split('T')[0],
    time_slot: TIME_SLOTS[0],
    is_available: false,
  });

  const authToken = () => localStorage.getItem(tokenKey) || localStorage.getItem('admin-token') || localStorage.getItem('token');

  async function load() {
    setLoading(true);
    try {
      const token = authToken();
      const [servicesRes, rulesRes] = await Promise.all([
        fetch('/api/quick-services', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/paid-slots?mode=manager', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const servicesData = await servicesRes.json();
      const rulesData = await rulesRes.json();
      if (servicesData.success) setServices(servicesData.data || []);
      if (rulesData.success) setRules(rulesData.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (defaultCity) setForm((current) => ({ ...current, city: defaultCity }));
  }, [defaultCity]);

  const cityOptions = useMemo(() => {
    const values = new Set(rules.map((rule) => rule.city).filter(Boolean));
    if (defaultCity) values.add(defaultCity);
    return [...values].sort((a, b) => a.localeCompare(b));
  }, [rules, defaultCity]);

  async function saveRule(event) {
    event?.preventDefault();
    if (!form.quick_service_id || !form.city.trim() || !form.slot_date || !form.time_slot) {
      setMessage('Service, city, date and time slot are required.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const token = authToken();
      const res = await fetch('/api/paid-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setMessage(data.error || 'Could not update paid slot.');
        return;
      }
      setMessage(form.is_available ? 'Paid slot opened and override removed.' : 'Paid slot closed.');
      await load();
    } catch {
      setMessage('Could not update paid slot.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleRule(rule) {
    setForm({
      quick_service_id: String(rule.quick_service_id),
      city: rule.city,
      slot_date: rule.slot_date,
      time_slot: rule.time_slot,
      is_available: !rule.is_available,
    });

    const token = authToken();
    const res = await fetch('/api/paid-slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        quick_service_id: rule.quick_service_id,
        city: rule.city,
        slot_date: rule.slot_date,
        time_slot: rule.time_slot,
        is_available: !rule.is_available,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage(rule.is_available ? 'Paid slot closed.' : 'Paid slot opened and override removed.');
      load();
    }
    else setMessage(data.error || 'Could not update paid slot.');
  }

  return (
    <section className="paid-slots-panel">
      <style>{`
        .paid-slots-panel {
          background: var(--surface, #fff);
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 8px;
          padding: ${compact ? '1rem' : '1.25rem'};
          margin-top: 1rem;
          color: var(--text, #111);
        }
        .psm-head { display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; margin-bottom:1rem; }
        .psm-title { font-size:0.9rem; font-weight:800; margin:0; }
        .psm-sub { font-size:0.75rem; color:var(--muted, #71717a); margin:0.2rem 0 0; }
        .psm-form { display:grid; grid-template-columns:repeat(5, minmax(0, 1fr)); gap:0.75rem; align-items:end; margin-bottom:1rem; }
        .psm-field label { display:block; font-size:0.68rem; font-weight:800; color:var(--muted, #71717a); text-transform:uppercase; letter-spacing:.06em; margin-bottom:0.35rem; }
        .psm-input { width:100%; box-sizing:border-box; border:1px solid var(--border, #d4d4d8); border-radius:6px; background:var(--bg, #fafafa); color:var(--text, #111); padding:0.55rem 0.7rem; font-size:0.8rem; outline:none; }
        .psm-btn { border:0; border-radius:6px; background:var(--accent, #0ea5e9); color:#fff; padding:0.6rem 0.8rem; font-size:0.78rem; font-weight:800; cursor:pointer; }
        .psm-btn.close { background:#ef4444; }
        .psm-btn.open { background:#16a34a; }
        .psm-btn.secondary { background:transparent; border:1px solid var(--border, #d4d4d8); color:var(--text, #111); }
        .psm-message { font-size:0.78rem; color:var(--muted, #71717a); margin-bottom:0.75rem; font-weight:700; }
        .psm-table-wrap { overflow-x:auto; }
        .psm-table { width:100%; border-collapse:collapse; font-size:0.78rem; }
        .psm-table th, .psm-table td { padding:0.6rem 0.7rem; border-top:1px solid var(--border, #e5e7eb); text-align:left; white-space:nowrap; }
        .psm-table th { color:var(--muted, #71717a); background:var(--bg, #fafafa); text-transform:uppercase; font-size:0.66rem; letter-spacing:.06em; }
        .psm-badge { display:inline-flex; border-radius:999px; padding:0.18rem 0.55rem; font-size:0.65rem; font-weight:900; text-transform:uppercase; }
        .psm-badge.open { background:#dcfce7; color:#166534; }
        .psm-badge.closed { background:#fee2e2; color:#991b1b; }
        @media(max-width:900px){ .psm-form { grid-template-columns:1fr 1fr; } }
        @media(max-width:560px){ .psm-head, .psm-form { grid-template-columns:1fr; display:grid; } }
      `}</style>

      <div className="psm-head">
        <div>
          <h3 className="psm-title">Paid Quick-Service Slot Availability</h3>
          <p className="psm-sub">By default paid slots are open. Add a close rule for a service, city, date and time when the slot should not be available.</p>
        </div>
        <button type="button" className="psm-btn secondary" onClick={load}>Refresh</button>
      </div>

      <form className="psm-form" onSubmit={saveRule}>
        <div className="psm-field">
          <label>Service</label>
          <select className="psm-input" value={form.quick_service_id} onChange={(e) => setForm(f => ({ ...f, quick_service_id: e.target.value }))}>
            <option value="">Select service</option>
            {services.map((service) => <option key={service.id} value={service.id}>{service.label}</option>)}
          </select>
        </div>
        <div className="psm-field">
          <label>City</label>
          <input className="psm-input" value={form.city} list="paid-slot-cities" onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Moradabad" />
          <datalist id="paid-slot-cities">{cityOptions.map((city) => <option key={city} value={city} />)}</datalist>
        </div>
        <div className="psm-field">
          <label>Date</label>
          <input className="psm-input" type="date" value={form.slot_date} onChange={(e) => setForm(f => ({ ...f, slot_date: e.target.value }))} />
        </div>
        <div className="psm-field">
          <label>Time Slot</label>
          <select className="psm-input" value={form.time_slot} onChange={(e) => setForm(f => ({ ...f, time_slot: e.target.value }))}>
            {TIME_SLOTS.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className={`psm-btn ${form.is_available ? 'open' : 'close'}`}
        >
          {saving ? 'Saving...' : form.is_available ? 'Mark Open' : 'Mark Closed'}
        </button>
      </form>

      {message && <div className="psm-message">{message}</div>}

      {loading ? (
        <div className="psm-message">Loading paid slot rules...</div>
      ) : (
        <div className="psm-table-wrap">
          <table className="psm-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>City</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Updated By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 ? (
                <tr><td colSpan={7}>No paid slot overrides yet. All paid slots are open by default.</td></tr>
              ) : rules.map((rule) => (
                <tr key={rule.id}>
                  <td>{rule.service_icon} {rule.service_label || `Service #${rule.quick_service_id}`}</td>
                  <td>{rule.city}</td>
                  <td>{rule.slot_date}</td>
                  <td>{rule.time_slot}</td>
                  <td><span className={`psm-badge ${rule.is_available ? 'open' : 'closed'}`}>{rule.is_available ? 'Open' : 'Closed'}</span></td>
                  <td>{rule.updated_by_role || '-'}</td>
                  <td>
                    <button type="button" className={`psm-btn ${rule.is_available ? 'close' : 'open'}`} onClick={() => toggleRule(rule)}>
                      {rule.is_available ? 'Close' : 'Open'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
