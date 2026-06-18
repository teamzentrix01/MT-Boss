'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import FreeTimeSlotsManager from '@/app/components/FreeTimeSlotsManager';

const CATEGORIES = ['Commercial', 'Residential', 'Hospitality', 'Industrial', 'IT Infrastructure', 'Luxury Home'];
const leadStatuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];
const leadStages = ['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost'];
const SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const emptyForm = {
  title: '',
  category: '',
  location: '',
  description: '',
  image_url: '',
  cloudinary_public_id: '',
  size: 'small',
  status: 'published',
  assigned_agent_id: '',
  project_notes: '',
  client_name: '',
  client_phone: '',
  client_email: '',
  deal_amount: '',
  project_status: 'lead',
};

export default function FranchiseDashboardPage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [franchise, setFranchise] = useState(null);
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const token = () => localStorage.getItem('franchise-token');

  useEffect(() => {
    const stored = localStorage.getItem('franchise');
    const tok = localStorage.getItem('franchise-token');
    if (!stored || !tok) {
      router.push('/franchise/login');
      return;
    }

    try {
      setFranchise(JSON.parse(stored));
    } catch {
      router.push('/franchise/login');
      return;
    }

    Promise.all([fetchProjects(tok), fetchAgents(tok), fetchLeads(tok)]).finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (localStorage.getItem('franchise-token')) fetchLeads();
    }, 20000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async (tok = token()) => {
    const res = await fetch('/api/franchise/projects', {
      headers: { Authorization: `Bearer ${tok}` },
    });
    const data = await res.json();
    if (data.success) setProjects(data.data);
  };

  const fetchAgents = async (tok = token()) => {
    const res = await fetch('/api/franchise/agents', {
      headers: { Authorization: `Bearer ${tok}` },
    });
    const data = await res.json();
    if (data.success) setAgents(data.data);
  };

  const fetchLeads = async (tok = token()) => {
    const res = await fetch('/api/franchise/lead-management', {
      headers: { Authorization: `Bearer ${tok}` },
    });
    const data = await res.json();
    if (data.success) {
      setLeads(data.data || []);
      if (data.agents?.length) setAgents(data.agents);
    }
  };

  const updateLead = async (id, patch) => {
    const res = await fetch('/api/franchise/lead-management', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ id, ...patch }),
    });
    const data = await res.json();
    if (data.success) setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...data.data } : lead));
    else setMessage({ type: 'error', text: data.error || 'Could not update lead.' });
  };

  const stats = useMemo(() => ({
    total: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    draft: projects.filter(p => p.status === 'draft').length,
    leads: leads.length,
  }), [projects, leads]);

  const openAdd = () => {
    setEditProject(null);
    setForm({ ...emptyForm, location: franchise?.city || '' });
    setMessage({ type: '', text: '' });
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditProject(project);
    setForm({
      title: project.title || '',
      category: project.category || '',
      location: project.location || '',
      description: project.description || '',
      image_url: project.image_url || '',
      cloudinary_public_id: project.cloudinary_public_id || '',
      size: project.size || 'small',
      status: project.status || 'published',
      assigned_agent_id: project.assigned_agent_id || '',
      project_notes: project.project_notes || '',
      client_name: project.client_name || '',
      client_phone: project.client_phone || '',
      client_email: project.client_email || '',
      deal_amount: project.deal_amount || '',
      project_status: project.project_status || 'lead',
    });
    setMessage({ type: '', text: '' });
    setShowForm(true);
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) {
      setMessage({ type: 'error', text: 'Cloudinary upload is not configured.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('upload_preset', preset);
      body.append('folder', 'mtboss/franchise-projects');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (!data.secure_url) throw new Error('Upload failed');

      setForm(f => ({ ...f, image_url: data.secure_url, cloudinary_public_id: data.public_id || '' }));
    } catch {
      setMessage({ type: 'error', text: 'Image upload failed. Please try again.' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const saveProject = async () => {
    if (!form.title || !form.category || !form.image_url) {
      setMessage({ type: 'error', text: 'Title, category and project image are required.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        ...form,
        assigned_agent_id: form.assigned_agent_id ? Number(form.assigned_agent_id) : null,
      };
      const res = await fetch('/api/franchise/projects', {
        method: editProject ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(editProject ? { ...payload, id: editProject.id } : payload),
      });
      const data = await res.json();
      if (!data.success) {
        setMessage({ type: 'error', text: data.error || 'Could not save project.' });
        return;
      }

      await fetchProjects();
      setShowForm(false);
      setMessage({ type: 'success', text: editProject ? 'Project updated.' : 'Project created.' });
    } catch {
      setMessage({ type: 'error', text: 'Could not save project.' });
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (project) => {
    if (!confirm('Delete this project?')) return;

    const res = await fetch('/api/franchise/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ id: project.id }),
    });
    const data = await res.json();
    if (data.success) setProjects(prev => prev.filter(p => p.id !== project.id));
    else setMessage({ type: 'error', text: data.error || 'Could not delete project.' });
  };

  const openPasswordForm = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setMessage({ type: '', text: '' });
    setShowPasswordForm(true);
  };

  const changePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    setChangingPassword(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/franchise/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (!data.success) {
        setMessage({ type: 'error', text: data.error || 'Could not change password.' });
        return;
      }

      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password changed successfully. Use this password for future logins.' });
    } catch {
      setMessage({ type: 'error', text: 'Could not change password. Please try again.' });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <main className="fd-page"><div className="fd-empty">Loading...</div></main>;
  }

  return (
    <main className="fd-page">
      <style>{`
        .fd-page{min-height:100vh;background:#f5f5f7;color:#111;font-family:DM Sans,system-ui,sans-serif;}
        .fd-top{background:#fff;border-bottom:1px solid #e5e7eb;padding:1rem 2rem;}
        .fd-top-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:1rem}
        .fd-brand{font-weight:900;letter-spacing:-.03em;font-size:1rem}.fd-brand span{color:var(--brand-blue-deep)}
        .fd-top-actions{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap}
        .fd-user{display:flex;gap:.75rem;align-items:center;font-size:.82rem;color:#52525b;background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:.55rem .75rem}
        .fd-avatar{width:34px;height:34px;border-radius:9px;background:var(--brand-blue);color:#111;display:flex;align-items:center;justify-content:center;font-weight:900;flex-shrink:0}
        .fd-user-main{display:flex;flex-direction:column;line-height:1.25}
        .fd-user-meta{font-size:.74rem;color:#71717a;margin-top:.1rem}
        .fd-btn{border:0;border-radius:7px;background:var(--brand-blue);color:#111;padding:.58rem .95rem;font-weight:900;cursor:pointer}
        .fd-btn.secondary{background:#fff;border:1px solid #d4d4d8;color:#3f3f46}
        .fd-btn.danger{background:#fff1f2;border:1px solid #fecdd3;color:#be123c}
        .fd-btn:disabled{opacity:.6;cursor:not-allowed}
        .fd-body{max-width:1180px;margin:0 auto;padding:1.5rem}
        .fd-head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;margin-bottom:1rem}
        .fd-title{font-size:1.35rem;font-weight:900;margin:0}.fd-sub{font-size:.85rem;color:#71717a;margin:.25rem 0 0}
        .fd-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1rem}
        .fd-stat{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:1rem}
        .fd-stat-label{font-size:.68rem;color:#71717a;text-transform:uppercase;font-weight:800;letter-spacing:.06em}
        .fd-stat-value{font-size:1.6rem;font-weight:900;margin-top:.2rem}
        .fd-notice{padding:.75rem 1rem;border-radius:8px;font-size:.85rem;font-weight:700;margin-bottom:1rem}
        .fd-notice.success{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}.fd-notice.error{background:#fff1f2;color:#9f1239;border:1px solid #fecdd3}
        .fd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:.85rem}
        .fd-card{background:#fff;border:1px solid #e5e7eb;border-radius:9px;overflow:hidden}
        .fd-card img{width:100%;height:165px;object-fit:cover;display:block;background:#eee}
        .fd-card-body{padding:1rem}.fd-card-title{font-weight:900}.fd-muted{font-size:.78rem;color:#71717a;margin-top:.25rem;line-height:1.5}
        .fd-money{display:grid;grid-template-columns:repeat(2,1fr);gap:.45rem;margin-top:.75rem;font-size:.74rem}
        .fd-money div{background:#f8fafc;border:1px solid #eef2f7;border-radius:7px;padding:.45rem}.fd-money strong{display:block;color:#111;margin-top:.12rem}
        .fd-pill{display:inline-flex;padding:.18rem .55rem;border-radius:999px;background:#fef9c3;color:#854d0e;font-size:.68rem;font-weight:900;margin-top:.55rem}
        .fd-actions{display:flex;gap:.5rem;margin-top:.8rem;flex-wrap:wrap}
        .fd-section{margin-top:1.25rem;background:#fff;border:1px solid #e5e7eb;border-radius:9px;overflow:hidden}
        .fd-section-head{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:1rem;border-bottom:1px solid #e5e7eb}
        .fd-table{width:100%;border-collapse:collapse;font-size:.8rem}.fd-table th{padding:.65rem;text-align:left;color:#71717a;background:#f8fafc;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em}.fd-table td{padding:.65rem;border-top:1px solid #eef2f7;vertical-align:top}.fd-mini-select{border:1px solid #d4d4d8;border-radius:6px;background:#fafafa;color:#111;padding:.45rem;font-size:.76rem;font-weight:800;width:100%}
        .fd-empty{padding:3rem;text-align:center;color:#71717a}
        .fd-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.58);display:flex;align-items:center;justify-content:center;padding:1rem;z-index:200}
        .fd-modal{width:min(760px,100%);max-height:calc(100vh - 2rem);overflow:hidden;background:#fff;border-radius:10px;border:1px solid #e5e7eb;box-shadow:0 24px 80px rgba(0,0,0,.28);display:flex;flex-direction:column}
        .fd-modal-head{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.25rem;border-bottom:1px solid #e5e7eb;background:#fff;flex-shrink:0}
        .fd-modal-title{font-weight:900}.fd-x{border:0;background:transparent;font-size:1.4rem;cursor:pointer;color:#71717a}
        .fd-form{padding:1.25rem;display:grid;gap:.9rem;overflow-y:auto;min-height:0}.fd-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
        .fd-label{font-size:.72rem;font-weight:900;text-transform:uppercase;color:#71717a;letter-spacing:.05em;margin-bottom:.35rem;display:block}
        .fd-input{width:100%;box-sizing:border-box;border:1px solid #d4d4d8;border-radius:7px;padding:.7rem .8rem;background:#fafafa;color:#111;font:inherit;font-size:.85rem}
        .fd-file{padding:.85rem;background:#fff;cursor:pointer}
        .fd-textarea{min-height:104px;resize:vertical}.fd-preview{width:100%;height:180px;object-fit:cover;border-radius:7px;border:1px solid #e5e7eb;margin-bottom:.65rem}
        .fd-modal-foot{display:flex;justify-content:flex-end;gap:.6rem;padding:1rem 1.25rem;border-top:1px solid #e5e7eb;background:#fff;flex-shrink:0}
        .fd-password-modal{width:min(480px,100%)}
        @media(max-width:700px){.fd-top{padding:1rem}.fd-top-inner{align-items:flex-start;flex-direction:column}.fd-top-actions{width:100%;justify-content:space-between}.fd-user{flex:1;min-width:0}.fd-body{padding:1rem}.fd-head{flex-direction:column}.fd-stats,.fd-row{grid-template-columns:1fr}.fd-modal-bg{align-items:flex-end;padding:.75rem}.fd-modal{max-height:calc(100vh - 1.5rem)}}
      `}</style>

      <header className="fd-top">
        <div className="fd-top-inner">
          <div className="fd-brand">MT<span>BOSS</span> Franchise</div>
          <div className="fd-top-actions">
            <div className="fd-user">
              <div className="fd-avatar">{(franchise?.name || 'F').charAt(0).toUpperCase()}</div>
              <div className="fd-user-main">
                <strong>{franchise?.name}</strong>
                <span className="fd-user-meta">{franchise?.city}, {franchise?.state}</span>
              </div>
            </div>
            <button className="fd-btn secondary" onClick={openPasswordForm}>Change Password</button>
          </div>
        </div>
      </header>

      <section className="fd-body">
        <div className="fd-head">
          <div>
            <h1 className="fd-title">Projects</h1>
            <p className="fd-sub">Create projects for your approved franchise territory and assign an admin-approved agent.</p>
          </div>
          <button className="fd-btn" onClick={openAdd}>Add Project</button>
        </div>

        <div className="fd-stats">
          <div className="fd-stat"><div className="fd-stat-label">Total</div><div className="fd-stat-value">{stats.total}</div></div>
          <div className="fd-stat"><div className="fd-stat-label">Published</div><div className="fd-stat-value">{stats.published}</div></div>
          <div className="fd-stat"><div className="fd-stat-label">Draft</div><div className="fd-stat-value">{stats.draft}</div></div>
          <div className="fd-stat"><div className="fd-stat-label">Assigned Leads</div><div className="fd-stat-value">{stats.leads}</div></div>
        </div>

        {message.text && <div className={`fd-notice ${message.type}`}>{message.text}</div>}

        {projects.length === 0 ? (
          <div className="fd-empty">No projects yet. Add your first project to begin.</div>
        ) : (
          <div className="fd-grid">
            {projects.map(project => (
              <article className="fd-card" key={project.id}>
                {project.image_url && <img src={project.image_url} alt={project.title} />}
                <div className="fd-card-body">
                  <div className="fd-card-title">{project.title}</div>
                  <div className="fd-muted">{project.category} | {project.location || franchise?.city}</div>
                  {project.description && <div className="fd-muted">{project.description}</div>}
                  <span className="fd-pill">{project.status}</span>
                  <span className="fd-pill">{project.project_status || 'lead'}</span>
                  {(project.client_name || project.client_phone) && (
                    <div className="fd-muted">Client: <strong>{project.client_name || '-'}</strong> {project.client_phone ? `(${project.client_phone})` : ''}</div>
                  )}
                  {project.assigned_agent_name && <div className="fd-muted">Assigned agent: <strong>{project.assigned_agent_name}</strong></div>}
                  <div className="fd-money">
                    <div>Received<strong>Rs {Number(project.total_received || 0).toLocaleString('en-IN')}</strong></div>
                    <div>Agent 2%<strong>Rs {Number(project.agent_commission || 0).toLocaleString('en-IN')}</strong></div>
                    <div>Costs<strong>Rs {Number(Number(project.labour_cost || 0) + Number(project.material_cost || 0) + Number(project.extra_expense || 0)).toLocaleString('en-IN')}</strong></div>
                    <div>Profit/Loss<strong>Rs {Number(project.profit_loss || 0).toLocaleString('en-IN')}</strong></div>
                  </div>
                  <div className="fd-actions">
                    <button className="fd-btn secondary" onClick={() => openEdit(project)}>Edit</button>
                    <button className="fd-btn danger" onClick={() => deleteProject(project)}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="fd-section">
          <div className="fd-section-head">
            <div>
              <div className="fd-card-title">Assigned Leads</div>
              <div className="fd-muted">Leads assigned by admin to this franchise. Assign an approved agent/sub-agent and track progress.</div>
            </div>
            <button className="fd-btn secondary" onClick={() => fetchLeads()}>Refresh</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="fd-table">
              <thead>
                <tr>
                  {['Client', 'Service', 'Source', 'Status', 'Stage', 'Agent / Sub-agent', 'Follow Up'].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan={7} className="fd-muted">No assigned leads yet.</td></tr>
                ) : leads.map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <strong>{lead.client_name}</strong>
                      <div className="fd-muted">{lead.client_phone}</div>
                      {lead.client_email && <div className="fd-muted">{lead.client_email}</div>}
                    </td>
                    <td>
                      {lead.service_type || '-'}
                      <div className="fd-muted">{lead.city}</div>
                    </td>
                    <td>{lead.lead_source || '-'}</td>
                    <td>
                      <select className="fd-mini-select" value={lead.status || 'New'} onChange={e => updateLead(lead.id, { status: e.target.value })}>
                        {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="fd-mini-select" value={lead.lead_stage || 'New'} onChange={e => updateLead(lead.id, { lead_stage: e.target.value })}>
                        {leadStages.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <select className="fd-mini-select" value={lead.agent_id || ''} onChange={e => updateLead(lead.id, { agent_id: e.target.value })}>
                        <option value="">Not assigned</option>
                        {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name} - {agent.city || agent.email}</option>)}
                      </select>
                    </td>
                    <td>
                      <input className="fd-mini-select" type="date" value={lead.follow_up_date ? String(lead.follow_up_date).slice(0, 10) : ''} onChange={e => updateLead(lead.id, { follow_up_date: e.target.value })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="fd-section fd-slot-section">
          <div className="fd-section-head">
            <div>
              <div className="fd-card-title">Quick-Service Slots</div>
              <div className="fd-muted">Open or close free and paid quick-service slots for your franchise city.</div>
            </div>
          </div>
          <div style={{ padding: '1rem' }}>
            <FreeTimeSlotsManager tokenKey="franchise-token" defaultCity={franchise?.city || ''} compact />
          </div>
        </section>
      </section>

      {showForm && (
        <div className="fd-modal-bg" onClick={() => setShowForm(false)}>
          <div className="fd-modal" onClick={e => e.stopPropagation()}>
            <div className="fd-modal-head">
              <div className="fd-modal-title">{editProject ? 'Edit Project' : 'Add Project'}</div>
              <button className="fd-x" onClick={() => setShowForm(false)}>x</button>
            </div>

            <div className="fd-form">
              {message.text && <div className={`fd-notice ${message.type}`}>{message.text}</div>}

              <div>
                <label className="fd-label">Project image *</label>
                {form.image_url && <img className="fd-preview" src={form.image_url} alt="Project preview" />}
                <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} className="fd-input fd-file" disabled={uploading} />
                {uploading && <div className="fd-muted">Uploading image...</div>}
              </div>

              <div>
                <label className="fd-label">Title *</label>
                <input className="fd-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>

              <div className="fd-row">
                <div>
                  <label className="fd-label">Client name</label>
                  <input className="fd-input" value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} />
                </div>
                <div>
                  <label className="fd-label">Client phone</label>
                  <input className="fd-input" value={form.client_phone} onChange={e => setForm(f => ({ ...f, client_phone: e.target.value }))} />
                </div>
              </div>

              <div className="fd-row">
                <div>
                  <label className="fd-label">Client email</label>
                  <input className="fd-input" value={form.client_email} onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))} />
                </div>
                <div>
                  <label className="fd-label">Deal amount</label>
                  <input className="fd-input" type="number" value={form.deal_amount} onChange={e => setForm(f => ({ ...f, deal_amount: e.target.value }))} />
                </div>
              </div>

              <div className="fd-row">
                <div>
                  <label className="fd-label">Category *</label>
                  <select className="fd-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="fd-label">Location</label>
                  <input className="fd-input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="fd-label">Description</label>
                <textarea className="fd-input fd-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div className="fd-row">
                <div>
                  <label className="fd-label">Assign approved agent</label>
                  <select className="fd-input" value={form.assigned_agent_id} onChange={e => setForm(f => ({ ...f, assigned_agent_id: e.target.value }))}>
                    <option value="">No agent assigned</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} - {agent.city || agent.state || agent.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="fd-label">Status</label>
                  <select className="fd-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="fd-row">
                <div>
                  <label className="fd-label">Gallery size</label>
                  <select className="fd-input" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))}>
                    {SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="fd-label">Project stage</label>
                  <select className="fd-input" value={form.project_status} onChange={e => setForm(f => ({ ...f, project_status: e.target.value }))}>
                    {['lead', 'estimate_sent', 'final', 'started', 'running', 'completed', 'cancelled', 'lost'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="fd-label">Internal notes</label>
                <input className="fd-input" value={form.project_notes} onChange={e => setForm(f => ({ ...f, project_notes: e.target.value }))} />
              </div>
            </div>

            <div className="fd-modal-foot">
              <button className="fd-btn secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="fd-btn" disabled={saving || uploading} onClick={saveProject}>
                {saving ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordForm && (
        <div className="fd-modal-bg" onClick={() => setShowPasswordForm(false)}>
          <div className="fd-modal fd-password-modal" onClick={e => e.stopPropagation()}>
            <div className="fd-modal-head">
              <div>
                <div className="fd-modal-title">Change Password</div>
                <div className="fd-muted">This password stays active until you or an admin changes it.</div>
              </div>
              <button className="fd-x" onClick={() => setShowPasswordForm(false)}>x</button>
            </div>

            <div className="fd-form">
              {message.text && <div className={`fd-notice ${message.type}`}>{message.text}</div>}
              <div>
                <label className="fd-label">Current password</label>
                <input
                  className="fd-input"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                  autoComplete="current-password"
                />
              </div>
              <div>
                <label className="fd-label">New password</label>
                <input
                  className="fd-input"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="fd-label">Confirm new password</label>
                <input
                  className="fd-input"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="fd-modal-foot">
              <button className="fd-btn secondary" onClick={() => setShowPasswordForm(false)}>Cancel</button>
              <button className="fd-btn" disabled={changingPassword} onClick={changePassword}>
                {changingPassword ? 'Saving...' : 'Save Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
