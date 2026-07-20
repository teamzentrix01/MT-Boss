'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const normalizeCity = (value) => String(value || '').trim().toLowerCase();
const prettyStatus = (value) => String(value || 'lead').replaceAll('_', ' ');

export default function OperationalProjectsManager() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/projects?kind=operational', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Unable to load projects');
      setProjects(data.data || []);
      setAgents(data.agents || []);
      setAssignments(Object.fromEntries((data.data || []).map((project) => [project.id, project.assigned_agent_id || ''])));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const visibleProjects = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesFilter = filter === 'all'
        || (filter === 'unassigned' && !project.assigned_agent_id)
        || (filter === 'assigned' && project.assigned_agent_id)
        || project.project_status === filter;
      const haystack = [project.title, project.client_name, project.client_phone, project.location, project.category]
        .filter(Boolean).join(' ').toLowerCase();
      return matchesFilter && (!needle || haystack.includes(needle));
    });
  }, [filter, projects, search]);

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
      setProjects((items) => items.map((item) => item.id === project.id ? data.data : item));
      setMessage(assignments[project.id] ? 'Project assigned successfully.' : 'Project is now unassigned.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSavingId(null);
    }
  };

  const stats = {
    total: projects.length,
    unassigned: projects.filter((project) => !project.assigned_agent_id).length,
    active: projects.filter((project) => ['started', 'ongoing', 'running'].includes(project.project_status)).length,
    completed: projects.filter((project) => project.project_status === 'completed').length,
  };

  return (
    <section className="op-wrap">
      <style>{`
        .op-wrap{padding:1.25rem 0;color:var(--text)}
        .op-head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;margin-bottom:1rem}
        .op-head h2{font-size:1rem;margin:0 0 .3rem}.op-head p{margin:0;color:var(--muted);font-size:.78rem}
        .op-refresh,.op-manage,.op-assign{border:0;border-radius:7px;padding:.55rem .8rem;font-weight:700;cursor:pointer}
        .op-refresh,.op-assign{background:var(--accent);color:#fff}.op-manage{background:#111827;color:#fff}
        .op-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1rem}
        .op-stat,.op-card{background:var(--surface);border:1px solid var(--border);border-radius:10px}
        .op-stat{padding:1rem}.op-stat small{display:block;color:var(--muted);font-weight:700;text-transform:uppercase}.op-stat strong{display:block;font-size:1.4rem;margin-top:.25rem}
        .op-tools{display:flex;gap:.6rem;margin-bottom:1rem}.op-tools input,.op-tools select,.op-select{background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:7px;padding:.58rem .7rem}
        .op-tools input{flex:1}.op-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem}
        .op-card{padding:1rem}.op-card-top{display:flex;justify-content:space-between;gap:.7rem}.op-card h3{margin:0;font-size:.95rem}.op-badge{font-size:.68rem;padding:.25rem .48rem;border-radius:999px;background:#eef2ff;color:#3730a3;text-transform:capitalize;height:max-content}
        .op-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.45rem;margin:.8rem 0;font-size:.76rem;color:var(--muted)}
        .op-assign-row{display:flex;gap:.5rem;padding-top:.75rem;border-top:1px solid var(--border)}.op-select{flex:1;min-width:0}.op-empty{padding:2rem;text-align:center;color:var(--muted);border:1px dashed var(--border);border-radius:10px}
        .op-message{margin:0 0 .8rem;padding:.65rem .8rem;border-radius:7px;background:#fffbeb;color:#92400e;font-size:.78rem}
        @media(max-width:760px){.op-stats{grid-template-columns:repeat(2,1fr)}.op-grid{grid-template-columns:1fr}.op-tools,.op-assign-row{flex-wrap:wrap}.op-tools input,.op-tools select,.op-select{width:100%}.op-meta{grid-template-columns:1fr}}
      `}</style>

      <div className="op-head">
        <div>
          <h2>Project Management</h2>
          <p>Finalized leads enter here. Assign them to an approved agent from the same city.</p>
        </div>
        <button className="op-refresh" onClick={loadProjects}>Refresh</button>
      </div>

      <div className="op-stats">
        {Object.entries(stats).map(([label, value]) => <div className="op-stat" key={label}><small>{label}</small><strong>{value}</strong></div>)}
      </div>

      <div className="op-tools">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search client, phone, service or city" />
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All projects</option><option value="unassigned">Unassigned</option><option value="assigned">Assigned</option>
          <option value="started">Started</option><option value="running">Running</option><option value="completed">Completed</option>
        </select>
      </div>

      {message && <p className="op-message">{message}</p>}
      {loading ? <div className="op-empty">Loading projects...</div> : visibleProjects.length === 0 ? <div className="op-empty">No matching operational projects.</div> : (
        <div className="op-grid">
          {visibleProjects.map((project) => {
            const cityAgents = agents.filter((agent) => !normalizeCity(project.location) || normalizeCity(agent.city) === normalizeCity(project.location));
            return <article className="op-card" key={project.id}>
              <div className="op-card-top"><h3>{project.title}</h3><span className="op-badge">{prettyStatus(project.project_status)}</span></div>
              <div className="op-meta">
                <span><b>Client:</b> {project.client_name || 'Not provided'}</span><span><b>Phone:</b> {project.client_phone || 'Not provided'}</span>
                <span><b>City:</b> {project.location || 'Not set'}</span><span><b>Service:</b> {project.category || 'Not set'}</span>
                <span><b>Deal:</b> ₹{Number(project.deal_amount || 0).toLocaleString('en-IN')}</span><span><b>Agent:</b> {project.assigned_agent_name || 'Unassigned'}</span>
              </div>
              <div className="op-assign-row">
                <select className="op-select" value={assignments[project.id] ?? ''} onChange={(event) => setAssignments((values) => ({ ...values, [project.id]: event.target.value }))}>
                  <option value="">Unassigned</option>
                  {cityAgents.map((agent) => <option value={agent.id} key={agent.id}>{agent.name} ({agent.city || 'No city'})</option>)}
                </select>
                <button className="op-assign" disabled={savingId === project.id} onClick={() => assignProject(project)}>{savingId === project.id ? 'Saving...' : 'Assign'}</button>
                <button className="op-manage" onClick={() => router.push(`/dashboard/projects/${project.id}`)}>Manage</button>
              </div>
            </article>;
          })}
        </div>
      )}
    </section>
  );
}
