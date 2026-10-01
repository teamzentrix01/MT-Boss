"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye, Download, RefreshCw, Plus, X, ActionIconButton } from '@/app/components/ui/icons';

const statuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];
const stages = ['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost'];
const priorities = ['Low', 'Normal', 'High', 'Urgent'];
const sourceOrder = ['primary-service', 'quick-service', 'calculator', 'contact', 'manual'];
const sourceLabels = {
  'primary-service': 'Primary Services',
  'quick-service': 'Quick Services',
  calculator: 'Calculator',
  contact: 'Contact Forms',
  manual: 'Manual',
};

const emptyForm = {
  client_name: '',
  client_phone: '',
  client_email: '',
  city: '',
  service_type: '',
  lead_type: '',
  assigned_franchise_id: '',
  assigned_vendor_id: '',
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
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [city, setCity] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);
  const [convertingLead, setConvertingLead] = useState(null);
  const [conversionData, setConversionData] = useState(null);
  const searchInputRef = useRef(null);
  const searchHostRef = useRef(null);

  const token = () => localStorage.getItem('token') || localStorage.getItem('admin-token');

  const loadLeads = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/admin/lead-management', {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.data || []);
        setAgents(data.agents || []);
        setFranchises(data.franchises || []);
        setVendors(data.vendors || []);
      } else {
        setMessage(data.error || 'Could not load leads.');
      }
    } catch {
      setMessage('Could not load leads.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { loadLeads(); }, [loadLeads]);

  useEffect(() => {
    const timer = setInterval(() => loadLeads({ silent: true }), 20000);
    return () => clearInterval(timer);
  }, [loadLeads]);

  const sources = useMemo(() => {
    const dynamicSources = [...new Set(leads.map((lead) => lead.lead_source?.trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));
    return [
      ...sourceOrder.filter((item) => dynamicSources.includes(item)),
      ...dynamicSources.filter((item) => !sourceOrder.includes(item)),
    ];
  }, [leads]);

  const sourceStats = useMemo(() => {
    const counts = Object.fromEntries(sources.map((item) => [item, 0]));
    leads.forEach((lead) => {
      const key = lead.lead_source?.trim();
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [leads, sources]);

  const cities = useMemo(() => {
    return [...new Set(leads.map((lead) => lead.city?.trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return leads.filter((lead) => {
      const matchesSearch = !query || [
        lead.client_name,
        lead.client_phone,
        lead.client_email,
        lead.city,
        lead.service_type,
        lead.lead_type,
        lead.lead_source,
        lead.agent_name,
        lead.franchise_name,
        lead.client_requirement,
      ].some((value) => String(value ?? '').toLocaleLowerCase().includes(query));

      return matchesSearch
        && (!status || lead.status === status)
        && (!source || lead.lead_source === source)
        && (!city || lead.city === city);
    });
  }, [leads, search, status, source, city]);

  const stats = useMemo(() => ({
    total: filteredLeads.length,
    new: filteredLeads.filter((lead) => lead.status === 'New').length,
    follow: filteredLeads.filter((lead) => lead.status === 'Follow-up').length,
    converted: filteredLeads.filter((lead) => lead.status === 'Converted').length,
  }), [filteredLeads]);

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

  async function openConvertModal(lead) {
    if (lead.converted_project_id) {
      window.location.href = `/dashboard?tab=party-project-management&projectId=${lead.converted_project_id}`;
      return;
    }
    setConvertingLead(lead);
    setConversionData({
      loading: true,
      partyId: null,
      partyName: '',
      newParty: { name: lead.client_name, phone: lead.client_phone, email: lead.client_email || '', address: lead.city || '' },
      project: { name: lead.service_type || lead.client_requirement || 'New Project', contract_value: lead.final_amount || 0, site_address: lead.city || '', status: 'running', agent_id: lead.agent_id || '', start_date: new Date().toISOString().slice(0, 10) },
    });

    try {
      const res = await fetch('/api/admin/project-management/parties', { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (data.success) {
        const found = data.data.find(p => p.phone === lead.client_phone || (lead.client_email && p.email === lead.client_email));
        if (found) {
          setConversionData(prev => ({ ...prev, loading: false, partyId: found.id, partyName: found.name }));
        } else {
          setConversionData(prev => ({ ...prev, loading: false }));
        }
      }
    } catch {
      setConversionData(prev => ({ ...prev, loading: false }));
    }
  }

  async function submitConversion(e) {
    e.preventDefault();
    const payload = {
      lead_id: convertingLead.id,
      party_id: conversionData.partyId,
      new_party: conversionData.partyId ? null : conversionData.newParty,
      project: conversionData.project,
    };
    
    const res = await fetch('/api/admin/lead-management/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      setConvertingLead(null);
      await loadLeads();
      window.location.href = `/dashboard?tab=party-project-management&projectId=${data.project_id}`;
    } else {
      alert(data.error || 'Conversion failed');
    }
  }

  function exportExcel() {
    const params = new URLSearchParams({ export: 'xlsx' });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (source) params.set('source', source);
    if (city) params.set('city', city);
    window.open(`/api/admin/lead-management?${params.toString()}`, '_blank');
  }

  function clearFilters() {
    setSearch('');
    setStatus('');
    setSource('');
    setCity('');
    if (searchInputRef.current) searchInputRef.current.value = '';
  }

  const bg = isDarkMode ? '#0f0f0f' : '#fff';
  const surface = isDarkMode ? '#171717' : '#f8fafc';
  const border = isDarkMode ? '#2b2b2b' : '#e5e7eb';
  const text = isDarkMode ? '#fff' : '#111827';
  const muted = isDarkMode ? '#9ca3af' : '#64748b';
  const inputStyle = { background: surface, border: `1px solid ${border}`, color: text, borderRadius: 6, padding: '0.55rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, width: '100%' };
  const labelStyle = { display: 'block', color: muted, fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 };

  useEffect(() => {
    const host = searchHostRef.current;
    if (!host) return undefined;

    const input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'search';
    input.autocomplete = 'off';
    input.setAttribute('aria-label', 'Search leads');
    input.placeholder = 'Search name, phone, email, city, service...';
    Object.assign(input.style, inputStyle);
    input.value = search;

    const handleSearchInput = () => setSearch(input.value);
    input.addEventListener('input', handleSearchInput);
    host.replaceChildren(input);
    searchInputRef.current = input;

    return () => {
      input.removeEventListener('input', handleSearchInput);
      if (searchInputRef.current === input) searchInputRef.current = null;
      input.remove();
    };
    // The native field is recreated only when the dashboard theme changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode]);

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div className="section-head">
        <span className="section-head-title">Lead Management</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={exportExcel} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, background: 'var(--accent)', color: '#111', borderRadius: 5, padding: '0.5rem 0.85rem', fontWeight: 900, cursor: 'pointer' }}>
            <Download size={15} strokeWidth={1.75} aria-hidden="true" />
            Export Excel
          </button>
          <button onClick={loadLeads} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: `1px solid ${border}`, background: surface, color: text, borderRadius: 5, padding: '0.5rem 0.85rem', fontWeight: 800, cursor: 'pointer' }}>
            <RefreshCw size={15} strokeWidth={1.75} aria-hidden="true" />
            Refresh
          </button>
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
              {franchises.filter((item) => !form.city || item.city?.trim().toLowerCase() === form.city.trim().toLowerCase()).map((item) => <option key={item.id} value={item.id}>{item.name} - {item.city}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Vendor</label>
            <select style={inputStyle} value={form.assigned_vendor_id} onChange={(e) => setForm((f) => ({ ...f, assigned_vendor_id: e.target.value }))}>
              <option value="">Not assigned</option>
              {vendors.filter((item) => !form.city || item.city?.trim().toLowerCase() === form.city.trim().toLowerCase()).map((item) => <option key={item.id} value={item.id}>{item.shop_name} - {item.city}</option>)}
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
        <button type="submit" style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, background: 'var(--accent)', color: '#111', borderRadius: 5, padding: '0.65rem 1rem', fontWeight: 900, cursor: 'pointer' }}>
          <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
          Add Lead
        </button>
      </form>

      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: '1rem' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => setSource('')}
            style={{
              border: `1px solid ${source ? border : 'var(--accent)'}`,
              background: source ? surface : 'var(--accent)',
              color: source ? text : '#111',
              borderRadius: 6,
              padding: '0.5rem 0.75rem',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            All Leads ({leads.length})
          </button>
          {sources.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSource(item)}
              style={{
                border: `1px solid ${source === item ? 'var(--accent)' : border}`,
                background: source === item ? 'var(--accent)' : surface,
                color: source === item ? '#111' : text,
                borderRadius: 6,
                padding: '0.5rem 0.75rem',
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              {sourceLabels[item] || item} ({sourceStats[item] || 0})
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,2fr) repeat(3,minmax(130px,1fr)) auto', gap: 10, marginBottom: 12 }}>
          <div ref={searchHostRef} />
          <select aria-label="Filter leads by city" style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All cities</option>
            {cities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All status</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select style={inputStyle} value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All source</option>
            {sources.map((item) => <option key={item} value={item}>{sourceLabels[item] || item}</option>)}
          </select>
          <button type="button" onClick={clearFilters} disabled={!search && !city && !status && !source} style={{ border: 0, background: surface, color: text, borderRadius: 6, padding: '0.55rem 1rem', fontWeight: 900, cursor: 'pointer' }}>Clear</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: surface }}>
                {['Client', 'Service', 'Source', 'Status', 'Stage', 'Franchise', 'Vendor', 'Agent', 'Follow Up', 'Action'].map((head) => (
                  <th key={head} style={{ padding: '0.6rem', textAlign: 'left', color: muted, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '.07em' }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ padding: '1rem', color: muted }}>Loading leads...</td></tr>
              ) : filteredLeads.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: '1rem', color: muted }}>No leads found.</td></tr>
              ) : filteredLeads.map((lead) => (
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
                      {franchises.filter((item) => item.city?.trim().toLowerCase() === lead.city?.trim().toLowerCase()).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '0.6rem' }}>
                    <select style={inputStyle} value={lead.assigned_vendor_id || ''} onChange={(e) => updateLead(lead.id, { assigned_vendor_id: e.target.value })}>
                      <option value="">Not assigned</option>
                      {vendors.filter((item) => item.city?.trim().toLowerCase() === lead.city?.trim().toLowerCase()).map((item) => <option key={item.id} value={item.id}>{item.shop_name}</option>)}
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
<div className={`mt-2 flex items-center justify-between border-t pt-2 ${isDarkMode ? "border-zinc-700" : "border-gray-200"}`}>
                      <span className={`text-xs font-bold ${headText}`}>Product total</span>
                      <strong className={`text-sm ${headText}`}>{cartProductTotal > 0 ? `₹${cartProductTotal.toLocaleString("en-IN")}` : 'On confirmation'}{cartProductTotal > 0 && cartHasUnpricedItems ? ' + quote items' : ''}</strong>
                    </div>
                    {couponCalculation.discount > 0 && (
                      <div className="mt-1 flex items-center justify-between text-xs font-bold text-green-600">
                        <span>Coupon discount</span>
                        <span>-₹{couponCalculation.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className={`mt-1 flex items-center justify-between text-xs ${subText}`}>
                      <span>Shipping</span>
                      <span>{hasShippingTotal ? `₹${shippingTotal.toLocaleString('en-IN')}` : 'Calculate shipping first'}</span>
                    </div>
                    <div className={`mt-3 flex items-center justify-between border-t-2 pt-3 ${isDarkMode ? "border-zinc-600" : "border-blue-300"}`}>
                      <span className={`text-base font-black ${headText}`}>Grand Total</span>
                      <strong className={`text-xl font-black ${headText}`}>{orderGrandTotal !== null ? `₹${orderGrandTotal.toLocaleString('en-IN')}` : 'On confirmation'}</strong>
                    </div>
                  </div>
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
              <button onClick={() => setSelected(null)} aria-label="Close modal" style={{ border: `1px solid ${border}`, background: surface, color: text, borderRadius: 6, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
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
                ['Vendor', selected.vendor_name || '-'],
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

      {convertingLead && conversionData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <form onSubmit={submitConversion} style={{ width: 'min(500px,100%)', background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: text }}>Convert to Project</div>
              <button type="button" onClick={() => setConvertingLead(null)} style={{ background: 'transparent', border: 0, color: text, fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
            </div>
            
            {conversionData.loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: muted }}>Checking for existing party...</div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {conversionData.partyId ? (
                  <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 6, fontSize: '0.85rem' }}>
                    <strong>Existing party found:</strong> {conversionData.partyName}<br/>
                    This project will be added under them.
                  </div>
                ) : (
                  <div style={{ border: `1px solid ${border}`, padding: '1rem', borderRadius: 6, background: surface }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: text, marginBottom: 8 }}>New Party Details</div>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <div>
                        <label style={labelStyle}>Client Name *</label>
                        <input style={inputStyle} value={conversionData.newParty.name} onChange={e => setConversionData(p => ({ ...p, newParty: { ...p.newParty, name: e.target.value } }))} required />
                      </div>
                      <div>
                        <label style={labelStyle}>Phone *</label>
                        <input style={inputStyle} value={conversionData.newParty.phone} onChange={e => setConversionData(p => ({ ...p, newParty: { ...p.newParty, phone: e.target.value } }))} required />
                      </div>
                      <div>
                        <label style={labelStyle}>Email</label>
                        <input style={inputStyle} type="email" value={conversionData.newParty.email} onChange={e => setConversionData(p => ({ ...p, newParty: { ...p.newParty, email: e.target.value } }))} />
                      </div>
                      <div>
                        <label style={labelStyle}>City</label>
                        <input style={inputStyle} value={conversionData.newParty.address} onChange={e => setConversionData(p => ({ ...p, newParty: { ...p.newParty, address: e.target.value } }))} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div style={{ border: `1px solid ${border}`, padding: '1rem', borderRadius: 6, background: surface }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: text, marginBottom: 8 }}>Project Details</div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    <div>
                      <label style={labelStyle}>Project Name *</label>
                      <input style={inputStyle} value={conversionData.project.name} onChange={e => setConversionData(p => ({ ...p, project: { ...p.project, name: e.target.value } }))} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Start Date *</label>
                      <input type="date" style={inputStyle} value={conversionData.project.start_date} onChange={e => setConversionData(p => ({ ...p, project: { ...p.project, start_date: e.target.value } }))} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Contract Value (Rs) *</label>
                      <input type="number" style={inputStyle} value={conversionData.project.contract_value} onChange={e => setConversionData(p => ({ ...p, project: { ...p.project, contract_value: e.target.value } }))} required />
                    </div>
                    <div>
                      <label style={labelStyle}>Site / City *</label>
                      <input style={inputStyle} value={conversionData.project.site_address} onChange={e => setConversionData(p => ({ ...p, project: { ...p.project, site_address: e.target.value } }))} required />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button type="submit" style={{ flex: 1, background: 'var(--accent)', color: '#111', border: 0, padding: '0.65rem', borderRadius: 6, fontWeight: 900, cursor: 'pointer' }}>Convert to Project</button>
                  <button type="button" onClick={() => setConvertingLead(null)} style={{ flex: 1, background: surface, color: text, border: `1px solid ${border}`, padding: '0.65rem', borderRadius: 6, fontWeight: 900, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
