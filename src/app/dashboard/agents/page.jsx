'use client';

import { useState, useEffect } from 'react';

const STATUS_OPTIONS = ['Pending', 'Reviewing', 'Approved', 'Rejected'];

const statusStyle = {
  Pending:   { bg: '#fff7ed', tx: '#9a3412' },
  Reviewing: { bg: '#eff4ff', tx: '#1e3a8a' },
  Approved:  { bg: '#f0fdf4', tx: '#14532d' },
  Rejected:  { bg: '#fff1f2', tx: '#9f1239' },
};

export default function AgentsPage() {
  const [agents, setAgents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');
  const [updating, setUpdating]   = useState(false);
  const [tempLogin, setTempLogin] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [showLeads, setShowLeads] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchAgents();
    const onAgentsUpdated = () => fetchAgents();
    window.addEventListener('agentsUpdated', onAgentsUpdated);
    const interval = setInterval(fetchAgents, 15000);
    return () => {
      window.removeEventListener('agentsUpdated', onAgentsUpdated);
      clearInterval(interval);
    };
  }, []);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/agents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAgents(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    setTempLogin(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/agents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id,
          status,
          createLogin: status === 'Approved' && !agents.find(a => a.id === id)?.login_enabled,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAgents(prev => prev.map(a => a.id === id ? { ...a, ...data.data } : a));
        if (selected?.id === id) setSelected({ ...selected, ...data.data });
        if (data.temporaryPassword) {
          setTempLogin({
            email: data.data.email,
            password: data.temporaryPassword,
            city: data.data.city,
          });
        }
      }
    } finally {
      setUpdating(false);
    }
  };

  const openAgent = async (agent) => {
    setSelected(agent);
    setWorkspace(null);
    setWorkspaceLoading(true);
    setShowLeads(false);
    setSelectedLead(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/agents/${agent.id}/workspace`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setWorkspace(data);
    } catch (err) {
      console.error(err);
    } finally {
      setWorkspaceLoading(false);
    }
  };

  const updateAdminLead = async (agentId, leadId, payload) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/admin/agents/${agentId}/leads/${leadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      setWorkspace(prev => prev ? {
        ...prev,
        leads: prev.leads.map(lead => lead.id === leadId ? data.data : lead),
      } : prev);
    }
  };

  const filtered = agents.filter(a => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.city?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    All:       agents.length,
    Pending:   agents.filter(a => a.status === 'Pending').length,
    Reviewing: agents.filter(a => a.status === 'Reviewing').length,
    Approved:  agents.filter(a => a.status === 'Approved').length,
    Rejected:  agents.filter(a => a.status === 'Rejected').length,
  };

  return (
    <>
      <style>{`
        .ag-wrap { padding: 1.25rem 0; }

        /* Toolbar */
        .ag-toolbar {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .ag-title { font-size: 0.875rem; font-weight: 700; color: var(--text); }

        .ag-search {
          padding: 0.35rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface);
          color: var(--text);
          font-size: 0.8125rem;
          outline: none; width: 200px;
          transition: border-color .15s;
        }
        .ag-search:focus { border-color: var(--accent); }
        .ag-search::placeholder { color: var(--muted); }

        /* Filter tabs */
        .ag-filters {
          display: flex; gap: 0.375rem;
          flex-wrap: wrap; margin-bottom: 1rem;
        }
        .ag-filter-btn {
          padding: 0.3rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: var(--surface);
          color: var(--muted);
          font-size: 0.75rem; font-weight: 600;
          cursor: pointer; transition: all .15s;
          display: flex; align-items: center; gap: 0.35rem;
        }
        .ag-filter-btn.active {
          background: var(--accent); color: #fff; border-color: var(--accent);
        }
        .ag-filter-btn:not(.active):hover {
          border-color: var(--accent); color: var(--accent);
        }
        .ag-count {
          display: inline-flex; align-items: center; justify-content: center;
          width: 18px; height: 18px;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          font-size: 0.625rem; font-weight: 700;
        }
        .ag-filter-btn:not(.active) .ag-count {
          background: var(--bg); color: var(--muted);
        }

        /* Stats row */
        .ag-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem; margin-bottom: 1rem;
        }
        @media(max-width:640px){ .ag-stats { grid-template-columns: 1fr 1fr; } }
        .ag-stat {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.875rem 1rem;
        }
        .ag-stat-label {
          font-size: 0.6875rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: .06em;
          color: var(--muted); margin-bottom: 0.25rem;
        }
        .ag-stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text); }

        /* Table panel */
        .ag-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px; overflow: hidden;
        }
        .ag-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
        .ag-table th {
          padding: 0.5rem 0.875rem;
          text-align: left;
          font-size: 0.6875rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: .06em;
          color: var(--muted);
          border-bottom: 1px solid var(--border);
          background: var(--bg);
        }
        .ag-table td {
          padding: 0.65rem 0.875rem;
          border-bottom: 1px solid var(--border);
          color: var(--text);
        }
        .ag-table tr:last-child td { border-bottom: none; }
        .ag-table tr:hover td { background: var(--bg); cursor: pointer; }
        .ag-name  { font-weight: 600; }
        .ag-muted { color: var(--muted); font-size: 0.75rem; }

        .ag-badge {
          display: inline-block;
          padding: 0.15rem 0.6rem;
          border-radius: 999px;
          font-size: 0.6875rem; font-weight: 700;
        }
        .ag-type-badge {
          display: inline-block;
          padding: 0.15rem 0.55rem;
          border-radius: 4px;
          font-size: 0.6875rem; font-weight: 600;
          background: var(--accent-lt); color: var(--accent);
        }

        .ag-view-btn {
          background: none; border: none;
          color: var(--accent); font-size: 0.8125rem; font-weight: 600;
          cursor: pointer; padding: 0;
        }
        .ag-view-btn:hover { text-decoration: underline; }

        .ag-empty {
          text-align: center; padding: 3rem;
          font-size: 0.8125rem; color: var(--muted);
        }
        .ag-loading { text-align: center; padding: 3rem; color: var(--muted); font-size: 0.8125rem; }

        /* Modal */
        .ag-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.45);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem; z-index: 50;
        }
        .ag-modal {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          max-width: 560px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          padding: 1.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,.2);
        }
        .ag-modal-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .ag-modal-title { font-size: 0.9375rem; font-weight: 700; color: var(--text); }
        .ag-modal-close {
          background: none; border: none; cursor: pointer;
          color: var(--muted); font-size: 1.25rem;
          padding: 0.125rem 0.25rem; border-radius: 4px;
        }
        .ag-modal-close:hover { background: var(--bg); }

        .ag-modal-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0.875rem; margin-bottom: 1rem;
        }
        .ag-field-label {
          font-size: 0.6875rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: .06em;
          color: var(--muted); margin-bottom: 0.2rem;
        }
        .ag-field-value { font-size: 0.8125rem; font-weight: 600; color: var(--text); }

        .ag-modal-msg {
          background: var(--bg); border-radius: 6px;
          padding: 0.75rem; font-size: 0.8125rem;
          color: var(--muted); line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        /* Status selector */
        .ag-status-row {
          display: flex; align-items: center; gap: 0.5rem;
          flex-wrap: wrap; margin-bottom: 1.25rem;
        }
        .ag-status-label { font-size: 0.75rem; font-weight: 600; color: var(--muted); }
        .ag-status-opt {
          padding: 0.3rem 0.75rem;
          border-radius: 20px; border: 1px solid var(--border);
          font-size: 0.75rem; font-weight: 600;
          cursor: pointer; transition: all .15s;
          background: var(--surface); color: var(--muted);
        }
        .ag-status-opt.sel {
          border-color: transparent; color: #fff;
        }
        .ag-status-opt:disabled { opacity: .5; cursor: not-allowed; }

        .ag-modal-footer {
          display: flex; gap: 0.5rem; justify-content: flex-end;
        }
        .ag-close-btn {
          padding: 0.45rem 1rem;
          background: var(--bg); color: var(--muted);
          border: 1px solid var(--border); border-radius: 6px;
          font-size: 0.8125rem; font-weight: 600; cursor: pointer;
        }
      `}</style>

      <div className="ag-wrap">

        {/* Toolbar */}
        <div className="ag-toolbar">
          <span className="ag-title">Agent Applications</span>
          <input
            className="ag-search"
            placeholder="Search name, email, city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="ag-stats">
          {[
            { label: 'Total',    value: counts.All },
            { label: 'Pending',  value: counts.Pending },
            { label: 'Approved', value: counts.Approved },
            { label: 'Rejected', value: counts.Rejected },
          ].map(s => (
            <div key={s.label} className="ag-stat">
              <div className="ag-stat-label">{s.label}</div>
              <div className="ag-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="ag-filters">
          {['All', ...STATUS_OPTIONS].map(f => (
            <button
              key={f}
              className={`ag-filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className="ag-count">{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="ag-panel">
          {loading ? (
            <div className="ag-loading">Loading agents…</div>
          ) : filtered.length === 0 ? (
            <div className="ag-empty">No agent applications found.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="ag-table">
                <thead>
                  <tr>
                    {['Name', 'Contact', 'Location', 'Type', 'Experience', 'Status', 'Date', 'Action'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(agent => {
                    const st = statusStyle[agent.status] || statusStyle.Pending;
                    return (
                      <tr key={agent.id} onClick={() => openAgent(agent)}>
                        <td>
                          <div className="ag-name">{agent.name}</div>
                          <div className="ag-muted">{agent.occupation}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8125rem' }}>{agent.email}</div>
                          <div className="ag-muted">{agent.phone}</div>
                        </td>
                        <td className="ag-muted">{agent.city}, {agent.state}</td>
                        <td><span className="ag-type-badge">{agent.agent_type}</span></td>
                        <td className="ag-muted">{agent.experience || '—'}</td>
                        <td>
                          <span
                            className="ag-badge"
                            style={{ background: st.bg, color: st.tx }}
                          >
                            {agent.status}
                          </span>
                        </td>
                        <td className="ag-muted">
                          {new Date(agent.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="ag-view-btn"
                            onClick={e => { e.stopPropagation(); openAgent(agent); }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="ag-backdrop" onClick={() => { setSelected(null); setTempLogin(null); setWorkspace(null); setShowLeads(false); setSelectedLead(null); }}>
          <div className="ag-modal" onClick={e => e.stopPropagation()}>
            <div className="ag-modal-head">
              <span className="ag-modal-title">Agent Application</span>
              <button className="ag-modal-close" onClick={() => { setSelected(null); setTempLogin(null); setWorkspace(null); setShowLeads(false); setSelectedLead(null); }}>x</button>
            </div>

            <div className="ag-modal-grid">
              {[
                ['Full Name',   selected.name],
                ['Email',       selected.email],
                ['Phone',       selected.phone],
                ['Occupation',  selected.occupation],
                ['City',        selected.city],
                ['State',       selected.state],
                ['Agent Type',  selected.agent_type],
                ['Login',       selected.login_enabled ? 'Enabled' : 'Not enabled'],
                ['Experience',  selected.experience || '—'],
                ['Network',     selected.network || '—'],
                ['Applied On',  new Date(selected.created_at).toLocaleDateString()],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="ag-field-label">{label}</div>
                  <div className="ag-field-value">{value}</div>
                </div>
              ))}
            </div>

            {selected.message && (
              <>
                <div className="ag-field-label" style={{ marginBottom: '0.375rem' }}>Message</div>
                <div className="ag-modal-msg">{selected.message}</div>
              </>
            )}

            {tempLogin && (
              <div style={{ marginBottom: '1rem', padding: '0.875rem', border: '1px solid var(--brand-blue)', borderRadius: 6, background: 'color-mix(in srgb, var(--brand-blue) 8%, transparent)' }}>
                <div className="ag-field-label" style={{ color: 'var(--brand-blue-deep)' }}>Agent Login Created</div>
                <div className="ag-field-value" style={{ marginTop: 4 }}>Email: {tempLogin.email}</div>
                <div className="ag-field-value">Temporary Password: {tempLogin.password}</div>
                <div className="ag-muted" style={{ marginTop: 6 }}>
                  City locked to {tempLogin.city}. Email is sent when SMTP is configured.
                </div>
              </div>
            )}

            {/* Status Changer */}
            <div className="ag-status-row">
              <span className="ag-status-label">Status:</span>
              {selected.status === 'Approved' && (
                <span className="ag-status-label" style={{ color: '#22c55e', fontWeight: 700 }}>
                  Approved agents are locked
                </span>
              )}
              {STATUS_OPTIONS.map(s => {
                const st = statusStyle[s];
                const isSelected = selected.status === s;
                const locked = selected.status === 'Approved' && s !== 'Approved';
                return (
                  <button
                    key={s}
                    disabled={updating || locked}
                    className={`ag-status-opt${isSelected ? ' sel' : ''}`}
                    style={isSelected ? { background: st.tx, borderColor: st.tx } : {}}
                    onClick={() => updateStatus(selected.id, s)}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {workspaceLoading ? (
              <div className="ag-modal-msg">Loading agent workspace...</div>
            ) : workspace && (
              <div style={{ marginTop: '1rem' }}>
                <div className="ag-field-label" style={{ marginBottom: '0.5rem' }}>Agent Workspace Preview</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <div className="ag-stat">
                    <div className="ag-stat-label">Leads</div>
                    <div className="ag-stat-value">{workspace.leads?.length || 0}</div>
                  </div>
                  <div className="ag-stat">
                    <div className="ag-stat-label">Schedule</div>
                    <div className="ag-stat-value">{workspace.schedule?.length || 0}</div>
                  </div>
                </div>

                {(workspace.leads?.length || 0) > 0 && (
                  <div className="ag-modal-msg">
                    <strong>Latest Leads:</strong>
                    {workspace.leads.slice(0, 4).map(lead => (
                      <div key={lead.id} style={{ marginTop: 6 }}>
                        {lead.client_name} - {lead.client_phone} - {lead.status} - {lead.city}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    className="ag-close-btn"
                    onClick={() => setShowLeads(v => !v)}
                  >
                    {showLeads ? 'Hide Leads' : 'View Leads'}
                  </button>
                </div>

                {showLeads && (
                  <div className="ag-modal-msg">
                    <strong>All Leads</strong>
                    <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                      {(workspace.leads || []).length === 0 ? (
                        <div>No leads yet.</div>
                      ) : workspace.leads.map((lead) => (
                      <div key={lead.id} style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'start' }}>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text)' }}>{lead.client_name}</div>
                              <div style={{ marginTop: 2 }}>{lead.client_phone}{lead.client_email ? ` · ${lead.client_email}` : ''}</div>
                              <div style={{ marginTop: 2 }}>{lead.service_type || 'Service not set'}{lead.lead_type ? ` · ${lead.lead_type}` : ''}</div>
                              <div style={{ marginTop: 2 }}>City: {lead.city}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <select
                                value={lead.status}
                                onChange={(e) => updateAdminLead(selected.id, lead.id, { status: e.target.value })}
                                className="ag-close-btn"
                                style={{ padding: '0.35rem 0.6rem', minWidth: 120 }}
                              >
                                {['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'].map((status) => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                className="ag-close-btn"
                                onClick={() => setSelectedLead(lead)}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                          {lead.follow_up_date && (
                            <div style={{ marginTop: 2 }}>Follow-up: {new Date(lead.follow_up_date).toLocaleDateString('en-IN')}</div>
                          )}
                          {lead.notes && (
                            <div style={{ marginTop: 4 }}>{lead.notes}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(workspace.schedule?.length || 0) > 0 && (
                  <div className="ag-modal-msg">
                    <strong>Upcoming Schedule:</strong>
                    {workspace.schedule.slice(0, 4).map(item => (
                      <div key={item.id} style={{ marginTop: 6 }}>
                        {item.title} - {new Date(item.schedule_date).toLocaleDateString()} {item.schedule_time || ''} - {item.status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="ag-modal-footer">
              <button className="ag-close-btn" onClick={() => { setSelected(null); setTempLogin(null); setWorkspace(null); setShowLeads(false); setSelectedLead(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {selectedLead && (
        <div className="ag-backdrop" style={{ zIndex: 60 }} onClick={() => setSelectedLead(null)}>
          <div className="ag-modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
            <div className="ag-modal-head">
              <span className="ag-modal-title">Lead Details</span>
              <button className="ag-modal-close" onClick={() => setSelectedLead(null)}>x</button>
            </div>

            <div className="ag-modal-grid">
              {[
                ['Name', selectedLead.client_name],
                ['Phone', selectedLead.client_phone],
                ['Email', selectedLead.client_email || '—'],
                ['Service', selectedLead.service_type || '—'],
                ['Lead Type', selectedLead.lead_type || '—'],
                ['Status', selectedLead.status],
                ['City', selectedLead.city],
                ['Follow Up', selectedLead.follow_up_date ? new Date(selectedLead.follow_up_date).toLocaleDateString('en-IN') : '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="ag-field-label">{label}</div>
                  <div className="ag-field-value">{value}</div>
                </div>
              ))}
            </div>

            {selectedLead.notes && (
              <>
                <div className="ag-field-label" style={{ marginBottom: '0.375rem' }}>Notes</div>
                <div className="ag-modal-msg" style={{ marginBottom: 0 }}>{selectedLead.notes}</div>
              </>
            )}

            <div className="ag-modal-footer" style={{ marginTop: '1rem' }}>
              <button className="ag-close-btn" onClick={() => setSelectedLead(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
