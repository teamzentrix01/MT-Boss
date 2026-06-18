"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';

const statuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];
const stages = ['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost'];
const priorities = ['Low', 'Normal', 'High', 'Urgent'];

const emptyForm = {
  client_name: '',
  client_phone: '',
  client_email: '',
  city: '',
  service_type: '',
  lead_type: '',
  assigned_franchise_id: '',
  agent_id: '',
  priority: 'Normal',
  follow_up_date: '',
  client_requirement: '',
  notes: '',
  lead_source: 'manual',
};

export default function LeadManagementAdmin({ isDarkMode }) {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);

  const token = () => localStorage.getItem('token') || localStorage.getItem('admin-token');

  const loadLeads = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (source) params.set('source', source);
      const res = await fetch(`/api/admin/lead-management?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.data || []);
        setAgents(data.agents || []);
        setFranchises(data.franchises || []);
      } else {
        setMessage(data.error || 'Could not load leads.');
      }
    } catch {
      setMessage('Could not load leads.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [search, status, source]);

  useEffect(() => { loadLeads(); }, [loadLeads]);

  useEffect(() => {
    const timer = setInterval(() => loadLeads({ silent: true }), 20000);
    return () => clearInterval(timer);
  }, [loadLeads]);

  const sources = useMemo(() => {
    return [...new Set(leads.map((lead) => lead.lead_source).filter(Boolean))];
  }, [leads]);

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter((lead) => lead.status === 'New').length,
    follow: leads.filter((lead) => lead.status === 'Follow-up').length,
    converted: leads.filter((lead) => lead.status === 'Converted').length,
  }), [leads]);

  async function createLead(event) {
    event.preventDefault();
    setMessage('');
    const res = await fetch('/api/admin/lead-management', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setForm(emptyForm);
      setMessage('Lead created.');
      await loadLeads();
    } else {
      setMessage(data.error || 'Could not create lead.');
    }
  }

  async function updateLead(id, patch) {
    const res = await fetch('/api/admin/lead-management', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ id, ...patch }),
    });
    const data = await res.json();
    if (data.success) {
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, ...data.data } : lead));
      setSelected((current) => current?.id === id ? { ...current, ...data.data } : current);
    } else {
      setMessage(data.error || 'Update failed.');
    }
  }

  function exportExcel() {
    const params = new URLSearchParams({ export: 'xlsx' });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (source) params.set('source', source);
    window.open(`/api/admin/lead-management?${params.toString()}`, '_blank');
  }

  const bg = isDarkMode ? '#0f0f0f' : '#fff';
  const surface = isDarkMode ? '#171717' : '#f8fafc';
  const border = isDarkMode ? '#2b2b2b' : '#e5e7eb';
  const text = isDarkMode ? '#fff' : '#111827';
  const muted = isDarkMode ? '#9ca3af' : '#64748b';
  const inputStyle = { background: surface, border: `1px solid ${border}`, color: text, borderRadius: 6, padding: '0.55rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, width: '100%' };
  const labelStyle = { display: 'block', color: muted, fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 };

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div className="section-head">
        <span className="section-head-title">Lead Management</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={exportExcel} style={{ border: 0, background: 'var(--accent)', color: '#111', borderRadius: 5, padding: '0.5rem 0.85rem', fontWeight: 900, cursor: 'pointer' }}>Export Excel</button>
          <button onClick={loadLeads} style={{ border: `1px solid ${border}`, background: surface, color: text, borderRadius: 5, padding: '0.5rem 0.85rem', fontWeight: 800, cursor: 'pointer' }}>Refresh</button>
        </div>
      </div>

      {message && <div style={{ padding: '0.75rem 1rem', border: `1px solid ${border}`, background: surface, color: text, borderRadius: 6, fontSize: '0.82rem', fontWeight: 700 }}>{message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 12 }}>
        {[
          ['Total Leads', stats.total],
          ['New', stats.new],
          ['Follow-up', stats.follow],
          ['Converted', stats.converted],
        ].map(([label, value]) => (
          <div key={label} style={{ background: bg, border: `1px solid ${border}`, padding: '1rem', borderRadius: 6 }}>
            <div style={{ color: muted, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 900 }}>{label}</div>
            <div style={{ color: text, fontSize: '1.5rem', fontWeight: 900, marginTop: 6 }}>{value}</div>
          </div>
        ))}
      </div>

      <form onSubmit={createLead} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: '1rem' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 900, color: text, marginBottom: '0.8rem' }}>Create Manual Lead</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10 }}>
          {[
            ['Client Name *', 'client_name'],
            ['Phone *', 'client_phone'],
            ['Email', 'client_email'],
            ['City *', 'city'],
            ['Service Type', 'service_type'],
            ['Lead Type', 'lead_type'],
            ['Follow Up', 'follow_up_date', 'date'],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input style={inputStyle} type={type || 'text'} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label style={labelStyle}>Priority</label>
            <select style={inputStyle} value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}>
              {priorities.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Franchise</label>
            <select style={inputStyle} value={form.assigned_franchise_id} onChange={(e) => setForm((f) => ({ ...f, assigned_franchise_id: e.target.value }))}>
              <option value="">Not assigned</option>
              {franchises.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.city}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Agent / Sub-agent</label>
            <select style={inputStyle} value={form.agent_id} onChange={(e) => setForm((f) => ({ ...f, agent_id: e.target.value }))}>
              <option value="">Not assigned</option>
              {agents.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.city}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Requirement</label>
            <input style={inputStyle} value={form.client_requirement} onChange={(e) => setForm((f) => ({ ...f, client_requirement: e.target.value }))} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Notes</label>
            <input style={inputStyle} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
        </div>
        <button type="submit" style={{ marginTop: 12, border: 0, background: 'var(--accent)', color: '#111', borderRadius: 5, padding: '0.65rem 1rem', fontWeight: 900, cursor: 'pointer' }}>Add Lead</button>
      </form>

      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, marginBottom: 12 }}>
          <input style={inputStyle} placeholder="Search name, phone, city, service..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All status</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select style={inputStyle} value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All source</option>
            {sources.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button onClick={loadLeads} style={{ border: 0, background: surface, color: text, borderRadius: 6, padding: '0.55rem 1rem', fontWeight: 900, cursor: 'pointer' }}>Apply</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: surface }}>
                {['Client', 'Service', 'Source', 'Status', 'Stage', 'Franchise', 'Agent', 'Follow Up', 'Action'].map((head) => (
                  <th key={head} style={{ padding: '0.6rem', textAlign: 'left', color: muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '.07em' }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ padding: '1rem', color: muted }}>Loading leads...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '1rem', color: muted }}>No leads found.</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead.id} style={{ borderTop: `1px solid ${border}` }}>
                  <td style={{ padding: '0.6rem', minWidth: 170 }}>
                    <div style={{ color: text, fontWeight: 800 }}>{lead.client_name}</div>
                    <div style={{ color: muted }}>{lead.client_phone}</div>
                    <div style={{ color: muted, fontSize: '0.7rem' }}>{lead.city}</div>
                  </td>
                  <td style={{ padding: '0.6rem', color: muted }}>{lead.service_type || '-'}<br />{lead.lead_type || ''}</td>
                  <td style={{ padding: '0.6rem', color: muted }}>{lead.lead_source || '-'}</td>
                  <td style={{ padding: '0.6rem' }}>
                    <select style={inputStyle} value={lead.status || 'New'} onChange={(e) => updateLead(lead.id, { status: e.target.value })}>
                      {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.6rem' }}>
                    <select style={inputStyle} value={lead.lead_stage || 'New'} onChange={(e) => updateLead(lead.id, { lead_stage: e.target.value })}>
                      {stages.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.6rem' }}>
                    <select style={inputStyle} value={lead.assigned_franchise_id || ''} onChange={(e) => updateLead(lead.id, { assigned_franchise_id: e.target.value })}>
                      <option value="">Not assigned</option>
                      {franchises.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.6rem' }}>
                    <select style={inputStyle} value={lead.agent_id || ''} onChange={(e) => updateLead(lead.id, { agent_id: e.target.value })}>
                      <option value="">Not assigned</option>
                      {agents.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.6rem', color: muted, whiteSpace: 'nowrap' }}>{lead.follow_up_date ? new Date(lead.follow_up_date).toLocaleDateString('en-IN') : '-'}</td>
                  <td style={{ padding: '0.6rem' }}>
                    <button onClick={() => setSelected(lead)} style={{ border: 0, background: 'none', color: 'var(--accent)', fontWeight: 900, cursor: 'pointer' }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 20 }} onClick={() => setSelected(null)}>
          <div style={{ width: 'min(760px,100%)', background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '1rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ color: muted, fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.08em' }}>Lead Details</div>
                <div style={{ color: text, fontSize: '1.2rem', fontWeight: 900 }}>{selected.client_name}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ border: `1px solid ${border}`, background: surface, color: text, borderRadius: 6, width: 36, height: 36, cursor: 'pointer' }}>x</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
              {[
                ['Phone', selected.client_phone],
                ['Email', selected.client_email || '-'],
                ['City', selected.city],
                ['Service', selected.service_type || '-'],
                ['Lead Type', selected.lead_type || '-'],
                ['Source', selected.lead_source || '-'],
                ['Status', selected.status],
                ['Stage', selected.lead_stage],
                ['Franchise', selected.franchise_name || '-'],
                ['Agent / Sub-agent', selected.agent_name || '-'],
                ['Priority', selected.priority || 'Normal'],
                ['Final Amount', `Rs ${Number(selected.final_amount || 0).toLocaleString('en-IN')}`],
              ].map(([label, value]) => (
                <div key={label} style={{ border: `1px solid ${border}`, background: surface, borderRadius: 6, padding: '0.75rem' }}>
                  <div style={{ color: muted, fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 900 }}>{label}</div>
                  <div style={{ color: text, fontWeight: 800, marginTop: 4 }}>{value}</div>
                </div>
              ))}
            </div>
            {selected.client_requirement && <div style={{ marginTop: 12, color: text, border: `1px solid ${border}`, background: surface, borderRadius: 6, padding: '0.75rem' }}><strong>Requirement:</strong><br />{selected.client_requirement}</div>}
            {selected.notes && <div style={{ marginTop: 12, color: text, border: `1px solid ${border}`, background: surface, borderRadius: 6, padding: '0.75rem' }}><strong>Notes:</strong><br />{selected.notes}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
