'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import OperationalProjectViewModal from './OperationalProjectViewModal';

const normalizeCity = (value) => String(value || '').trim().toLowerCase();
const prettyStatus = (value) => {
  if (value === 'lead_not_converted') return 'Lead, not converted';
  return String(value || 'lead').replaceAll('_', ' ');
};

function formatINR(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return '₹0';
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export default function OperationalProjectsManager({ isDarkMode }) {
  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const isConvertingRef = useRef(false);
  const [convertingId, setConvertingId] = useState(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/projects?kind=operational', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to load projects');
      const loadedProjects = data.data || [];
      setProjects(loadedProjects);
      setAgents(data.agents || []);
      setAssignments(
        Object.fromEntries(loadedProjects.map((p) => [p.id, p.assigned_agent_id ? String(p.assigned_agent_id) : '']))
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const visibleProjects = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return projects.filter((project) => {
      const pStatus = project.project_status || project.status;
      const isUnassigned = !project.assigned_agent_id && (!project.assigned_agents || project.assigned_agents.length === 0);
      const isAssigned = !isUnassigned;

      const matchesFilter =
        filter === 'all' ||
        (filter === 'unassigned' && isUnassigned) ||
        (filter === 'assigned' && isAssigned) ||
        (filter === 'started' && ['started', 'ongoing', 'running'].includes(pStatus)) ||
        (filter === 'running' && ['started', 'ongoing', 'running'].includes(pStatus)) ||
        (filter === 'completed' && pStatus === 'completed') ||
        (filter === 'on_hold' && pStatus === 'on_hold') ||
        pStatus === filter;

      const haystack = [
        project.title,
        project.project_name,
        project.client_name,
        project.party_name,
        project.client_phone,
        project.party_phone,
        project.location,
        project.site_address,
        project.project_city,
        project.category,
        project.lead_service_type,
        project.source,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesFilter && (!needle || haystack.includes(needle));
    });
  }, [filter, projects, search]);

  const totalPages = Math.ceil(visibleProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * pageSize;
    return visibleProjects.slice(start, start + pageSize);
  }, [visibleProjects, page, pageSize]);

  const assignProject = async (project) => {
    setSavingId(project.id);
    setMessage('');
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_agent_id: assignments[project.id] ?? '' }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Assignment failed');
      
      const newAgentId = assignments[project.id] ? Number(assignments[project.id]) : null;
      const assignedAgent = agents.find((a) => String(a.id) === String(newAgentId));

      setProjects((items) =>
        items.map((item) =>
          item.id === project.id
            ? {
                ...item,
                assigned_agent_id: newAgentId,
                assigned_agent_name: assignedAgent ? assignedAgent.name : null,
                assigned_agents: assignedAgent
                  ? [{ id: assignedAgent.id, name: assignedAgent.name, city: assignedAgent.city }]
                  : [],
              }
            : item
        )
      );
      setMessage(assignments[project.id] ? 'Project assigned successfully.' : 'Project is now unassigned.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSavingId(null);
    }
  };

  const convertLeadToProject = async (lead) => {
    if (isConvertingRef.current) return;
    isConvertingRef.current = true;
    setConvertingId(lead.id);
    try {
      const leadId = lead.lead_id || String(lead.id).replace('lead_', '');
      const idempotencyKey =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `convert_${leadId}_${Date.now()}`;

      const payload = {
        lead_id: leadId,
        new_party: {
          name: lead.party_name || lead.client_name,
          phone: lead.party_phone || lead.client_phone,
          email: lead.party_email || lead.client_email || '',
          address: lead.site_address || lead.party_address || lead.project_city || '',
        },
        project: {
          name: lead.project_name || lead.title || 'New Project',
          contract_value: lead.contract_value || lead.deal_amount || 0,
          site_address: lead.site_address || '',
          status: 'running',
          start_date: new Date().toISOString().slice(0, 10),
        },
      };

      const res = await fetch('/api/admin/lead-management/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(payload),
      });
      const resData = await res.json();
      if (resData.success) {
        window.location.href = `/dashboard?tab=party-project-management&projectId=${resData.project_id}`;
      } else {
        alert(resData.error || 'Conversion failed');
      }
    } catch (err) {
      alert(err.message || 'Conversion error');
    } finally {
      isConvertingRef.current = false;
      setConvertingId(null);
    }
  };

  // Summary cards are computed from this same list so Total matches the Parties screen's project count (4 now)
  const projectItems = projects.filter((p) => !p.is_lead_only);
  const stats = {
    total: projectItems.length,
    unassigned: projectItems.filter(
      (p) => !p.assigned_agent_id && (!p.assigned_agents || p.assigned_agents.length === 0)
    ).length,
    active: projectItems.filter((p) => ['started', 'ongoing', 'running'].includes(p.project_status || p.status)).length,
    completed: projectItems.filter((p) => (p.project_status || p.status) === 'completed').length,
  };

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find((p) => String(p.id) === String(selectedProjectId)) || null;
  }, [projects, selectedProjectId]);

  return (
    <section className={`op-wrap${isDarkMode ? ' dark-mode' : ''}`}>
      <style>{`
        .op-wrap {
          --op-bg: #f9fafb;
          --op-surface: #ffffff;
          --op-border: #e5e7eb;
          --op-text: #111827;
          --op-muted: #6b7280;
          --op-accent: #2563eb;
          --op-header-bg: #f8fafc;
          padding: 1.25rem 0;
          color: var(--op-text);
          min-height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .dark-mode.op-wrap, .dark-mode .op-wrap {
          --op-bg: #0f0f11;
          --op-surface: #18181c;
          --op-border: #2e2e36;
          --op-text: #f3f4f6;
          --op-muted: #9ca3af;
          --op-accent: #3b82f6;
          --op-header-bg: #202026;
        }
        .op-head {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .op-head h2 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0 0 .3rem;
        }
        .op-head p {
          margin: 0;
          color: var(--op-muted);
          font-size: .8rem;
        }
        .op-refresh {
          border: 0;
          border-radius: 7px;
          padding: .5rem .9rem;
          font-weight: 700;
          font-size: .82rem;
          cursor: pointer;
          background: var(--op-accent);
          color: #fff;
          transition: opacity 0.15s;
        }
        .op-refresh:hover {
          opacity: 0.9;
        }
        .op-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: .75rem;
          margin-bottom: 1rem;
        }
        .op-stat {
          background: var(--op-surface);
          border: 1px solid var(--op-border);
          border-radius: 10px;
          padding: 0.9rem 1rem;
        }
        .op-stat small {
          display: block;
          color: var(--op-muted);
          font-weight: 700;
          text-transform: uppercase;
          font-size: .68rem;
          letter-spacing: .05em;
        }
        .op-stat strong {
          display: block;
          font-size: 1.35rem;
          margin-top: .25rem;
          font-weight: 800;
        }
        .op-tools {
          display: flex;
          gap: .6rem;
          margin-bottom: 1rem;
        }
        .op-tools input, .op-tools select {
          background: var(--op-surface);
          color: var(--op-text);
          border: 1px solid var(--op-border);
          border-radius: 7px;
          padding: .55rem .75rem;
          font-size: .82rem;
          outline: none;
        }
        .op-tools input {
          flex: 1;
        }
        .op-table-card {
          background: var(--op-surface);
          border: 1px solid var(--op-border);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .op-table-container {
          overflow-x: auto;
          width: 100%;
        }
        .op-table {
          width: 100%;
          border-collapse: collapse;
          font-size: .8rem;
          text-align: left;
          min-width: 1050px;
        }
        .op-table th {
          background: var(--op-header-bg);
          color: var(--op-muted);
          font-size: .68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .05em;
          padding: .7rem .85rem;
          border-bottom: 1px solid var(--op-border);
          white-space: nowrap;
        }
        .op-table td {
          padding: .7rem .85rem;
          border-bottom: 1px solid var(--op-border);
          vertical-align: middle;
        }
        .op-table tr:hover td {
          background: rgba(0, 0, 0, 0.015);
        }
        .dark-mode .op-table tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }
        .op-badge {
          display: inline-block;
          font-size: .68rem;
          font-weight: 700;
          padding: .2rem .5rem;
          border-radius: 999px;
          text-transform: capitalize;
          white-space: nowrap;
        }
        .op-badge-running, .op-badge-started {
          background: #dbeafe;
          color: #1e40af;
        }
        .op-badge-completed {
          background: #dcfce7;
          color: #166534;
        }
        .op-badge-on_hold {
          background: #fef3c7;
          color: #92400e;
        }
        .op-badge-lead_not_converted {
          background: #fee2e2;
          color: #991b1b;
        }
        .op-source-badge {
          display: inline-block;
          font-size: .66rem;
          font-weight: 800;
          padding: .15rem .45rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: .03em;
        }
        .op-source-lead {
          background: #f3e8ff;
          color: #6b21a8;
        }
        .op-source-manual {
          background: #e0f2fe;
          color: #0369a1;
        }
        .op-actions-cell {
          display: flex;
          align-items: center;
          gap: .45rem;
          white-space: nowrap;
        }
        .op-select {
          background: var(--op-surface);
          color: var(--op-text);
          border: 1px solid var(--op-border);
          border-radius: 6px;
          padding: .35rem .5rem;
          font-size: .75rem;
          max-width: 145px;
          outline: none;
        }
        .op-assign {
          border: 0;
          border-radius: 6px;
          padding: .38rem .65rem;
          font-size: .74rem;
          font-weight: 700;
          cursor: pointer;
          background: var(--op-accent);
          color: #fff;
          white-space: nowrap;
        }
        .op-assign:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .op-view-btn {
          border: 1px solid var(--op-border);
          background: var(--op-surface);
          color: var(--op-accent);
          border-radius: 6px;
          padding: .35rem .55rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .op-view-btn:hover {
          background: var(--op-header-bg);
          border-color: var(--op-accent);
        }
        .op-convert-btn {
          background: #16a34a;
          color: #fff;
          border: 0;
          border-radius: 6px;
          padding: .38rem .7rem;
          font-size: .74rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        .op-convert-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .op-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: .75rem 1rem;
          border-top: 1px solid var(--op-border);
          font-size: .78rem;
          color: var(--op-muted);
        }
        .op-page-btns {
          display: flex;
          gap: .4rem;
        }
        .op-page-btn {
          border: 1px solid var(--op-border);
          background: var(--op-surface);
          color: var(--op-text);
          border-radius: 6px;
          padding: .3rem .65rem;
          font-size: .75rem;
          font-weight: 600;
          cursor: pointer;
        }
        .op-page-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .op-page-btn:hover:not(:disabled) {
          background: var(--op-header-bg);
        }
        .op-message {
          margin: 0 0 .8rem;
          padding: .65rem .85rem;
          border-radius: 7px;
          background: #fffbeb;
          color: #92400e;
          font-size: .78rem;
          border: 1px solid #fde68a;
        }
        .dark-mode .op-message {
          background: #272115;
          border-color: #543e10;
          color: #fbbf24;
        }
        .op-empty {
          padding: 2.5rem;
          text-align: center;
          color: var(--op-muted);
          font-size: .83rem;
        }
        @media(max-width: 760px) {
          .op-stats { grid-template-columns: repeat(2, 1fr); }
          .op-tools { flex-wrap: wrap; }
          .op-tools input, .op-tools select { width: 100%; }
        }
      `}</style>

      <div className="op-head">
        <div>
          <h2>Project Management</h2>
          <p>Active and finalized operational projects. Assign approved agents from matching cities and track project status.</p>
        </div>
        <button className="op-refresh" onClick={loadProjects} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="op-stats">
        <div className="op-stat">
          <small>Total Projects</small>
          <strong>{stats.total}</strong>
        </div>
        <div className="op-stat">
          <small>Unassigned</small>
          <strong style={{ color: stats.unassigned > 0 ? '#ea580c' : 'inherit' }}>{stats.unassigned}</strong>
        </div>
        <div className="op-stat">
          <small>Active</small>
          <strong style={{ color: '#2563eb' }}>{stats.active}</strong>
        </div>
        <div className="op-stat">
          <small>Completed</small>
          <strong style={{ color: '#16a34a' }}>{stats.completed}</strong>
        </div>
      </div>

      <div className="op-tools">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search client, phone, service or city"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All projects</option>
          <option value="unassigned">Unassigned</option>
          <option value="assigned">Assigned</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On hold</option>
        </select>
      </div>

      {message && <div className="op-message">{message}</div>}

      <div className="op-table-card">
        {loading && projects.length === 0 ? (
          <div className="op-empty">Loading operational projects...</div>
        ) : visibleProjects.length === 0 ? (
          <div className="op-empty">No matching projects found.</div>
        ) : (
          <>
            <div className="op-table-container">
              <table className="op-table">
                <thead>
                  <tr>
                    <th>Client / Party</th>
                    <th>Phone</th>
                    <th>City / Site</th>
                    <th>Service / Project Name</th>
                    <th style={{ textAlign: 'right' }}>Deal Value</th>
                    <th style={{ textAlign: 'right' }}>Received</th>
                    <th style={{ textAlign: 'right' }}>Pending</th>
                    <th>Agent(s)</th>
                    <th>Status</th>
                    <th>Source</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProjects.map((project) => {
                    const projectCity = normalizeCity(project.location || project.project_city || project.site_address);
                    const cityAgents = agents.filter(
                      (agent) => !projectCity || normalizeCity(agent.city) === projectCity
                    );
                    const isSaving = savingId === project.id;
                    const isConverting = convertingId === project.id;
                    const pStatus = project.project_status || project.status;

                    return (
                      <tr key={project.id}>
                        <td>
                          <strong>{project.party_name || project.client_name || '—'}</strong>
                        </td>
                        <td>{project.party_phone || project.client_phone || '—'}</td>
                        <td>{project.project_city || project.location || project.site_address || '—'}</td>
                        <td>
                          <div>
                            <strong>{project.project_name || project.title || '—'}</strong>
                            {project.category && project.category !== 'General' && (
                              <div style={{ fontSize: '.7rem', color: 'var(--op-muted)' }}>{project.category}</div>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          {formatINR(project.contract_value || project.deal_amount || 0)}
                        </td>
                        <td style={{ textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>
                          {formatINR(project.received || 0)}
                        </td>
                        <td
                          style={{
                            textAlign: 'right',
                            color: Number(project.pending || 0) > 0 ? '#ea580c' : 'inherit',
                            fontWeight: 600,
                          }}
                        >
                          {formatINR(project.pending || 0)}
                        </td>
                        <td>
                          {project.assigned_agent_name ? (
                            <span style={{ fontWeight: 600 }}>{project.assigned_agent_name}</span>
                          ) : (
                            <span style={{ color: 'var(--op-muted)', fontStyle: 'italic' }}>Unassigned</span>
                          )}
                        </td>
                        <td>
                          <span className={`op-badge op-badge-${pStatus}`}>
                            {prettyStatus(pStatus)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`op-source-badge ${project.source === 'Lead' ? 'op-source-lead' : 'op-source-manual'}`}
                          >
                            {project.source || 'Manual'}
                          </span>
                        </td>
                        <td>
                          <div className="op-actions-cell">
                            {project.is_lead_only ? (
                              <button
                                className="op-convert-btn"
                                disabled={isConverting}
                                onClick={() => convertLeadToProject(project)}
                                title="Convert this lead into a PM Project"
                              >
                                {isConverting ? 'Converting...' : 'Convert to Project'}
                              </button>
                            ) : (
                              <>
                                <select
                                  className="op-select"
                                  value={assignments[project.id] ?? ''}
                                  onChange={(e) =>
                                    setAssignments((vals) => ({ ...vals, [project.id]: e.target.value }))
                                  }
                                >
                                  <option value="">Unassigned</option>
                                  {cityAgents.map((agent) => (
                                    <option value={String(agent.id)} key={agent.id}>
                                      {agent.name} {agent.city ? `(${agent.city})` : ''}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  className="op-assign"
                                  disabled={isSaving}
                                  onClick={() => assignProject(project)}
                                >
                                  {isSaving ? 'Saving...' : 'Assign'}
                                </button>
                              </>
                            )}
                            <button
                              className="op-view-btn"
                              onClick={() => setSelectedProjectId(project.id)}
                              title="View Project Details"
                              aria-label="View Project Details"
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="op-pagination">
              <div>
                Showing {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, visibleProjects.length)} of {visibleProjects.length} projects
              </div>
              <div className="op-page-btns">
                <button
                  className="op-page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <button
                  className="op-page-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedProjectId && (
        <OperationalProjectViewModal
          projectId={selectedProjectId}
          initialProject={selectedProject}
          isDarkMode={isDarkMode}
          onClose={() => setSelectedProjectId(null)}
          onConvertLead={(lead) => convertLeadToProject(lead)}
        />
      )}
    </section>
  );
}
