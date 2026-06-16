'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const leadStatuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];
const leadStages = ['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost'];
const scheduleStatuses = ['Planned', 'Done', 'Cancelled'];
const projectStatuses = ['lead', 'estimate_sent', 'final', 'started', 'running', 'completed', 'cancelled', 'lost'];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function AgentDashboardPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center">Loading agent dashboard...</main>}>
      <AgentDashboardContent />
    </Suspense>
  );
}

function AgentDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState(null);
  const [leads, setLeads] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectOps, setProjectOps] = useState({ payments: [], labour: [], materials: [], expenses: [], media: [] });
  const [activeTab, setActiveTab] = useState('leads');
  const [message, setMessage] = useState('');
  const [editLead, setEditLead] = useState(null);
  const [leadForm, setLeadForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceType: '',
    leadType: '',
    status: 'New',
    followUpDate: '',
    notes: '',
    lead_stage: 'New',
    meeting_done: false,
    estimate_sent: false,
    final_amount: '',
    daily_visit_notes: '',
    client_requirement: '',
    lead_source: 'offline',
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    scheduleDate: todayIso(),
    scheduleTime: '',
    type: 'Follow-up',
    status: 'Planned',
    notes: '',
  });

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (['leads', 'projects', 'schedule', 'profile'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [projectForm, setProjectForm] = useState({
    project_status: 'lead',
    deal_amount: '',
    client_name: '',
    client_phone: '',
    client_email: '',
    project_notes: '',
  });
  const [entryType, setEntryType] = useState('payment');
  const [entryForm, setEntryForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.classList.contains('dark-mode'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (localStorage.getItem('agent-token')) refreshLeads();
    }, 20000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function token() {
    return localStorage.getItem('agent-token');
  }

  async function authFetch(url, options = {}) {
    const t = token();
    if (!t) {
      router.push('/agent/login');
      return null;
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${t}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      logout();
      return null;
    }

    return res;
  }

  async function loadData() {
    setLoading(true);
    try {
      const [profileRes, leadsRes, scheduleRes] = await Promise.all([
        authFetch('/api/agent/profile'),
        authFetch('/api/agent/leads'),
        authFetch('/api/agent/schedule'),
      ]);

      if (!profileRes || !leadsRes || !scheduleRes) return;

      const profileData = await profileRes.json();
      const leadsData = await leadsRes.json();
      const scheduleData = await scheduleRes.json();

      if (profileData.success) {
        setAgent(profileData.agent);
        localStorage.setItem('agent', JSON.stringify(profileData.agent));
      }
      if (leadsData.success) setLeads(leadsData.data || []);
      if (scheduleData.success) setSchedule(scheduleData.data || []);
      await loadProjects();
    } finally {
      setLoading(false);
    }
  }

  async function loadProjects() {
    const res = await authFetch('/api/agent/projects');
    if (!res) return;
    const data = await res.json();
    if (data.success) setProjects(data.data || []);
  }

  async function refreshLeads() {
    const res = await authFetch('/api/agent/leads');
    if (!res) return;
    const data = await res.json();
    if (data.success) setLeads(data.data || []);
  }

  async function openProject(project) {
    setSelectedProject(project);
    setProjectForm({
      project_status: project.project_status || 'lead',
      deal_amount: project.deal_amount || '',
      client_name: project.client_name || '',
      client_phone: project.client_phone || '',
      client_email: project.client_email || '',
      project_notes: project.project_notes || '',
    });
    setEntryForm({});
    const res = await authFetch(`/api/agent/projects?project_id=${project.id}`);
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setSelectedProject(data.project);
      setProjectOps({
        payments: data.payments || [],
        labour: data.labour || [],
        materials: data.materials || [],
        expenses: data.expenses || [],
        media: data.media || [],
      });
    }
  }

  async function updateProject(e) {
    e.preventDefault();
    if (!selectedProject) return;
    const res = await authFetch('/api/agent/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: selectedProject.id, ...projectForm }),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setMessage('Project updated.');
      await loadProjects();
      await openProject({ ...selectedProject, ...data.data });
    } else {
      setMessage(data.error || 'Project could not be updated.');
    }
  }

  async function addProjectEntry(e) {
    e.preventDefault();
    if (!selectedProject) return;
    const res = await authFetch('/api/agent/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: selectedProject.id, entry_type: entryType, ...entryForm }),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setEntryForm({});
      setMessage('Project entry added.');
      await loadProjects();
      await openProject(selectedProject);
    } else {
      setMessage(data.error || 'Entry could not be saved.');
    }
  }

  async function logout() {
    localStorage.removeItem('agent-token');
    localStorage.removeItem('agent');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/agent/login');
  }

  const resetLeadForm = () => ({
    clientName: '', clientPhone: '', clientEmail: '', serviceType: '', leadType: '',
    status: 'New', followUpDate: '', notes: '',
    lead_stage: 'New', meeting_done: false, estimate_sent: false, final_amount: '',
    daily_visit_notes: '', client_requirement: '', lead_source: 'offline',
  });

  async function createLead(e) {
    e.preventDefault();
    setMessage('');
    if (editLead) {
      const res = await authFetch('/api/agent/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editLead.id, ...leadForm }),
      });
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => l.id === editLead.id ? data.data : l));
        setLeadForm(resetLeadForm());
        setEditLead(null);
        setMessage('Lead updated.');
      } else {
        setMessage(data.error || 'Lead could not be updated.');
      }
      return;
    }
    const res = await authFetch('/api/agent/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadForm),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setLeads((prev) => [data.data, ...prev]);
      setLeadForm(resetLeadForm());
      setMessage('Lead added for your assigned city.');
    } else {
      setMessage(data.error || 'Lead could not be saved.');
    }
  }

  function startEditLead(lead) {
    setEditLead(lead);
    setLeadForm({
      clientName: lead.client_name || '', clientPhone: lead.client_phone || '',
      clientEmail: lead.client_email || '', serviceType: lead.service_type || '',
      leadType: lead.lead_type || '', status: lead.status || 'New',
      followUpDate: lead.follow_up_date ? String(lead.follow_up_date).slice(0, 10) : '',
      notes: lead.notes || '',
      lead_stage: lead.lead_stage || 'New',
      meeting_done: lead.meeting_done || false,
      estimate_sent: lead.estimate_sent || false,
      final_amount: lead.final_amount || '',
      daily_visit_notes: lead.daily_visit_notes || '',
      client_requirement: lead.client_requirement || '',
      lead_source: lead.lead_source || 'offline',
    });
  }

  async function updateLead(id, status, lead_stage) {
    const res = await authFetch('/api/agent/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...(status ? { status } : {}), ...(lead_stage ? { lead_stage } : {}) }),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) setLeads((prev) => prev.map((lead) => (lead.id === id ? data.data : lead)));
  }

  async function createTask(e) {
    e.preventDefault();
    setMessage('');
    const res = await authFetch('/api/agent/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskForm),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setSchedule((prev) => [...prev, data.data].sort((a, b) => String(a.schedule_date).localeCompare(String(b.schedule_date))));
      setTaskForm({ title: '', scheduleDate: todayIso(), scheduleTime: '', type: 'Follow-up', status: 'Planned', notes: '' });
      setMessage('Schedule item added.');
    } else {
      setMessage(data.error || 'Schedule item could not be saved.');
    }
  }

  async function updateTask(id, status) {
    const res = await authFetch('/api/agent/schedule', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) setSchedule((prev) => prev.map((item) => (item.id === id ? data.data : item)));
  }

  async function changePassword(e) {
    e.preventDefault();
    setMessage('');
    const res = await authFetch('/api/agent/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordForm),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setAgent(data.agent);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setMessage('Password updated.');
    } else {
      setMessage(data.error || 'Password could not be updated.');
    }
  }

  const stats = useMemo(() => {
    const today = todayIso();
    return {
      total: leads.length,
      followUps: leads.filter((lead) => lead.follow_up_date && String(lead.follow_up_date).slice(0, 10) === today).length,
      converted: leads.filter((lead) => lead.status === 'Converted').length,
      todayTasks: schedule.filter((item) => item.schedule_date && String(item.schedule_date).slice(0, 10) === today).length,
      activeProjects: projects.filter((project) => !['completed', 'cancelled', 'lost'].includes(project.project_status || '')).length,
    };
  }, [leads, schedule, projects]);

  const bg = dark ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-950';
  const card = dark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200';
  const muted = dark ? 'text-zinc-500' : 'text-zinc-500';
  const input = dark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-zinc-900';

  if (loading) {
    return <main className={`min-h-screen flex items-center justify-center ${bg}`}>Loading agent dashboard...</main>;
  }

  return (
    <main className={`min-h-screen ${bg} p-5`}>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--brand-blue)]">Agent Workspace</p>
            <h1 className="text-3xl font-black uppercase mt-1">{agent?.name || 'Agent Dashboard'}</h1>
            <p className={`text-sm ${muted} mt-1`}>
              {agent?.agent_type || 'Agent'} - assigned city: <span className="font-black text-[var(--brand-blue)]">{agent?.city}</span>
              {agent?.state ? `, ${agent.state}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['leads', 'projects', 'schedule', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 border text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'bg-[var(--brand-blue)] border-[var(--brand-blue)] text-black' : `${card} ${muted}`}`}
              >
                {tab}
              </button>
            ))}
            <button onClick={logout} className="px-5 py-2.5 border border-red-500 text-red-500 text-[10px] font-black uppercase tracking-widest">
              Logout
            </button>
          </div>
        </header>

        {agent?.must_change_password && (
          <div className={`border border-[var(--brand-blue)] ${dark ? 'bg-[var(--brand-blue)]/10' : 'bg-sky-50'} p-4 mb-5 text-sm font-bold`}>
            Please change your temporary password from the Profile tab.
          </div>
        )}

        {message && (
          <div className={`border ${card} p-3 mb-5 text-sm font-bold text-[var(--brand-blue)]`}>
            {message}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          {[
            ['Total Leads', stats.total],
            ['Today Follow-ups', stats.followUps],
            ['Converted', stats.converted],
            ['Active Projects', stats.activeProjects],
          ].map(([label, value]) => (
            <div key={label} className={`border ${card} p-5`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>{label}</p>
              <p className="text-3xl font-black mt-1">{value}</p>
            </div>
          ))}
        </section>

        {activeTab === 'leads' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <form onSubmit={createLead} className={`border ${card} p-5 h-fit`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)]">{editLead ? 'Edit Lead' : 'Add Lead'} in {agent?.city}</p>
                {editLead && <button type="button" onClick={() => { setEditLead(null); setLeadForm(resetLeadForm()); }} className={`text-[10px] font-black uppercase ${muted}`}>Cancel</button>}
              </div>
              {[
                ['Client Name *', 'clientName', 'text'],
                ['Client Phone *', 'clientPhone', 'tel'],
                ['Client Email', 'clientEmail', 'email'],
                ['Service Type', 'serviceType', 'text'],
                ['Lead Type', 'leadType', 'text'],
              ].map(([label, key, type]) => (
                <div key={key} className="mb-3">
                  <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>{label}</label>
                  <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} type={type} value={leadForm[key]} onChange={(e) => setLeadForm((f) => ({ ...f, [key]: e.target.value }))} required={key === 'clientName' || key === 'clientPhone'} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Lead Stage</label>
                  <select className={`w-full border px-3 py-2 text-sm ${input}`} value={leadForm.lead_stage} onChange={(e) => setLeadForm((f) => ({ ...f, lead_stage: e.target.value }))}>
                    {leadStages.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Source</label>
                  <select className={`w-full border px-3 py-2 text-sm ${input}`} value={leadForm.lead_source} onChange={(e) => setLeadForm((f) => ({ ...f, lead_source: e.target.value }))}>
                    {['offline', 'online', 'referral', 'walk-in', 'social-media', 'other'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <label className={`flex items-center gap-2 text-[10px] font-black uppercase ${muted}`}>
                  <input type="checkbox" checked={leadForm.meeting_done} onChange={(e) => setLeadForm((f) => ({ ...f, meeting_done: e.target.checked }))} className="accent-[var(--brand-blue)]" /> Meeting Done
                </label>
                <label className={`flex items-center gap-2 text-[10px] font-black uppercase ${muted}`}>
                  <input type="checkbox" checked={leadForm.estimate_sent} onChange={(e) => setLeadForm((f) => ({ ...f, estimate_sent: e.target.checked }))} className="accent-[var(--brand-blue)]" /> Estimate Sent
                </label>
              </div>
              <div className="mb-3">
                <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Deal / Final Amount</label>
                <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} type="number" placeholder="₹" value={leadForm.final_amount} onChange={(e) => setLeadForm((f) => ({ ...f, final_amount: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Client Requirement</label>
                <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none ${input}`} rows={2} placeholder="What client needs" value={leadForm.client_requirement} onChange={(e) => setLeadForm((f) => ({ ...f, client_requirement: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Follow-up Date</label>
                <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} type="date" value={leadForm.followUpDate} onChange={(e) => setLeadForm((f) => ({ ...f, followUpDate: e.target.value }))} />
              </div>
              <div className="mb-3">
                <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Daily Visit Notes</label>
                <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none ${input}`} rows={2} placeholder="Today's visit notes" value={leadForm.daily_visit_notes} onChange={(e) => setLeadForm((f) => ({ ...f, daily_visit_notes: e.target.value }))} />
              </div>
              <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none ${input}`} rows={2} placeholder="General notes" value={leadForm.notes} onChange={(e) => setLeadForm((f) => ({ ...f, notes: e.target.value }))} />
              <button className="w-full mt-4 py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest">{editLead ? 'Update Lead' : 'Save Lead'}</button>
            </form>

            <div className="lg:col-span-2 space-y-3">
              {leads.length === 0 ? (
                <div className={`border ${card} p-8 text-center ${muted}`}>No leads yet for {agent?.city}.</div>
              ) : leads.map((lead) => (
                <div key={lead.id} className={`border ${card} p-4`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black">{lead.client_name}</p>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-sm ${lead.lead_stage === 'Final' ? 'bg-green-500/20 text-green-400' : lead.lead_stage === 'Lost' ? 'bg-red-500/20 text-red-400' : 'bg-[var(--brand-blue)]/20 text-[var(--brand-blue)]'}`}>{lead.lead_stage || 'New'}</span>
                        {lead.meeting_done && <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-sm">Meeting ✓</span>}
                        {lead.estimate_sent && <span className="text-[9px] font-bold px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-sm">Estimate ✓</span>}
                      </div>
                      <p className={`text-xs ${muted} mt-1`}>{lead.client_phone} - {lead.city} {lead.lead_source ? `(${lead.lead_source})` : ''}</p>
                      <p className={`text-xs ${muted}`}>{lead.service_type || 'Service not set'} {lead.lead_type ? `- ${lead.lead_type}` : ''}</p>
                      {lead.client_requirement && <p className={`text-xs mt-1 ${muted}`}><strong>Need:</strong> {lead.client_requirement}</p>}
                      {Number(lead.final_amount || 0) > 0 && <p className="text-xs font-black text-[var(--brand-blue)] mt-1">Deal: ₹{Number(lead.final_amount).toLocaleString('en-IN')}</p>}
                      {lead.daily_visit_notes && <p className={`text-xs mt-1 ${muted}`}><strong>Visit:</strong> {lead.daily_visit_notes}</p>}
                      {lead.notes && <p className="text-sm mt-2">{lead.notes}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <select className={`border px-3 py-2 text-xs font-bold ${input}`} value={lead.lead_stage || 'New'} onChange={(e) => updateLead(lead.id, null, e.target.value)}>
                        {leadStages.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <button type="button" onClick={() => startEditLead(lead)} className={`px-3 py-2 border text-xs font-bold ${input}`}>Edit</button>
                    </div>
                  </div>
                  {lead.follow_up_date && <p className="text-xs text-[var(--brand-blue)] font-black mt-3">Follow-up: {new Date(lead.follow_up_date).toLocaleDateString('en-IN')}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'projects' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1 space-y-3">
              {projects.length === 0 ? (
                <div className={`border ${card} p-8 text-center ${muted}`}>No assigned projects yet.</div>
              ) : projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => openProject(project)}
                  className={`w-full text-left border ${card} p-4 ${selectedProject?.id === project.id ? 'border-[var(--brand-blue)]' : ''}`}
                >
                  <p className="font-black">{project.title}</p>
                  <p className={`text-xs ${muted}`}>{project.client_name || 'Client not set'} - {project.location || project.service_city || agent?.city}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <span>Received: <strong>Rs {Number(project.total_received || 0).toLocaleString('en-IN')}</strong></span>
                    <span>Commission: <strong>Rs {Number(project.agent_commission || 0).toLocaleString('en-IN')}</strong></span>
                    <span>Costs: <strong>Rs {Number((Number(project.labour_cost || 0) + Number(project.material_cost || 0) + Number(project.extra_expense || 0))).toLocaleString('en-IN')}</strong></span>
                    <span>P/L: <strong>Rs {Number(project.profit_loss || 0).toLocaleString('en-IN')}</strong></span>
                  </div>
                  <p className="text-[10px] text-[var(--brand-blue)] font-black uppercase mt-3">{project.project_status || 'lead'}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2">
              {!selectedProject ? (
                <div className={`border ${card} p-8 text-center ${muted}`}>Select a project to manage site work.</div>
              ) : (
                <div className="space-y-5">
                  <form onSubmit={updateProject} className={`border ${card} p-5`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)] mb-4">Project Control</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Status</label>
                        <select className={`w-full border px-3 py-2 text-sm ${input}`} value={projectForm.project_status} onChange={(e) => setProjectForm((f) => ({ ...f, project_status: e.target.value }))}>
                          {projectStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Deal Amount</label>
                        <input className={`w-full border px-3 py-2 text-sm ${input}`} type="number" value={projectForm.deal_amount} onChange={(e) => setProjectForm((f) => ({ ...f, deal_amount: e.target.value }))} />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Client Phone</label>
                        <input className={`w-full border px-3 py-2 text-sm ${input}`} value={projectForm.client_phone} onChange={(e) => setProjectForm((f) => ({ ...f, client_phone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Client name" value={projectForm.client_name} onChange={(e) => setProjectForm((f) => ({ ...f, client_name: e.target.value }))} />
                      <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Client email" value={projectForm.client_email} onChange={(e) => setProjectForm((f) => ({ ...f, client_email: e.target.value }))} />
                    </div>
                    <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none mt-3 ${input}`} rows={2} placeholder="Project notes" value={projectForm.project_notes} onChange={(e) => setProjectForm((f) => ({ ...f, project_notes: e.target.value }))} />
                    <button className="mt-3 px-5 py-2.5 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest">Save Project</button>
                  </form>

                  <form onSubmit={addProjectEntry} className={`border ${card} p-5`}>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)]">Daily Site Entry</p>
                      <select className={`border px-3 py-2 text-xs font-bold ${input}`} value={entryType} onChange={(e) => { setEntryType(e.target.value); setEntryForm({}); }}>
                        {['payment', 'labour', 'material', 'expense', 'media'].map((type) => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>

                    {entryType === 'payment' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input className={`border px-3 py-2 text-sm ${input}`} type="number" placeholder="Amount received" value={entryForm.amount || ''} onChange={(e) => setEntryForm((f) => ({ ...f, amount: e.target.value }))} required />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="date" value={entryForm.payment_date || todayIso()} onChange={(e) => setEntryForm((f) => ({ ...f, payment_date: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Mode / notes" value={entryForm.notes || ''} onChange={(e) => setEntryForm((f) => ({ ...f, notes: e.target.value }))} />
                      </div>
                    )}

                    {entryType === 'labour' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Labour name" value={entryForm.labour_name || ''} onChange={(e) => setEntryForm((f) => ({ ...f, labour_name: e.target.value }))} required />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Role" value={entryForm.labour_role || ''} onChange={(e) => setEntryForm((f) => ({ ...f, labour_role: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="date" value={entryForm.work_date || todayIso()} onChange={(e) => setEntryForm((f) => ({ ...f, work_date: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="number" placeholder="Wage" value={entryForm.wage_amount || ''} onChange={(e) => setEntryForm((f) => ({ ...f, wage_amount: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="number" placeholder="Paid" value={entryForm.paid_amount || ''} onChange={(e) => setEntryForm((f) => ({ ...f, paid_amount: e.target.value }))} />
                        <select className={`border px-3 py-2 text-sm ${input}`} value={entryForm.attendance_status || 'present'} onChange={(e) => setEntryForm((f) => ({ ...f, attendance_status: e.target.value }))}>
                          {['present', 'half_day', 'absent'].map((status) => <option key={status}>{status}</option>)}
                        </select>
                      </div>
                    )}

                    {entryType === 'material' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Material" value={entryForm.material_name || ''} onChange={(e) => setEntryForm((f) => ({ ...f, material_name: e.target.value }))} required />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="number" placeholder="Qty" value={entryForm.quantity || ''} onChange={(e) => setEntryForm((f) => ({ ...f, quantity: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Unit" value={entryForm.unit || ''} onChange={(e) => setEntryForm((f) => ({ ...f, unit: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="number" placeholder="Rate" value={entryForm.rate || ''} onChange={(e) => setEntryForm((f) => ({ ...f, rate: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Supplier" value={entryForm.supplier_name || ''} onChange={(e) => setEntryForm((f) => ({ ...f, supplier_name: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Vehicle / bill URL" value={entryForm.vehicle_number || ''} onChange={(e) => setEntryForm((f) => ({ ...f, vehicle_number: e.target.value }))} />
                      </div>
                    )}

                    {entryType === 'expense' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Expense type" value={entryForm.expense_type || ''} onChange={(e) => setEntryForm((f) => ({ ...f, expense_type: e.target.value }))} required />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="number" placeholder="Amount" value={entryForm.amount || ''} onChange={(e) => setEntryForm((f) => ({ ...f, amount: e.target.value }))} required />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="date" value={entryForm.expense_date || todayIso()} onChange={(e) => setEntryForm((f) => ({ ...f, expense_date: e.target.value }))} />
                      </div>
                    )}

                    {entryType === 'media' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Photo/video URL" value={entryForm.media_url || ''} onChange={(e) => setEntryForm((f) => ({ ...f, media_url: e.target.value }))} required />
                        <select className={`border px-3 py-2 text-sm ${input}`} value={entryForm.media_type || 'photo'} onChange={(e) => setEntryForm((f) => ({ ...f, media_type: e.target.value }))}>
                          {['photo', 'video', 'bill'].map((type) => <option key={type}>{type}</option>)}
                        </select>
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Caption" value={entryForm.caption || ''} onChange={(e) => setEntryForm((f) => ({ ...f, caption: e.target.value }))} />
                      </div>
                    )}

                    <button className="mt-3 px-5 py-2.5 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest">Add Entry</button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ['Payments', projectOps.payments, (x) => `${x.payment_date?.slice?.(0, 10) || ''} - Rs ${x.amount}`],
                      ['Labour', projectOps.labour, (x) => `${x.work_date?.slice?.(0, 10) || ''} - ${x.labour_name} - Rs ${x.wage_amount}`],
                      ['Materials', projectOps.materials, (x) => `${x.entry_date?.slice?.(0, 10) || ''} - ${x.material_name} - ${x.quantity} ${x.unit || ''}`],
                      ['Expenses', projectOps.expenses, (x) => `${x.expense_date?.slice?.(0, 10) || ''} - ${x.expense_type} - Rs ${x.amount}`],
                      ['Media', projectOps.media, (x) => `${x.media_date?.slice?.(0, 10) || ''} - ${x.media_type} - ${x.caption || x.media_url}`],
                    ].map(([title, rows, render]) => (
                      <div key={title} className={`border ${card} p-4`}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)] mb-3">{title}</p>
                        {rows.length === 0 ? <p className={`text-xs ${muted}`}>No entries yet.</p> : rows.slice(0, 6).map((row) => (
                          <p key={row.id} className={`text-xs border-b py-2 ${dark ? 'border-zinc-800' : 'border-zinc-200'}`}>{render(row)}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <form onSubmit={createTask} className={`border ${card} p-5 h-fit`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)] mb-4">Plan Day in {agent?.city}</p>
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} placeholder="Title" value={taskForm.title} onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))} required />
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} type="date" value={taskForm.scheduleDate} onChange={(e) => setTaskForm((f) => ({ ...f, scheduleDate: e.target.value }))} required />
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} type="time" value={taskForm.scheduleTime} onChange={(e) => setTaskForm((f) => ({ ...f, scheduleTime: e.target.value }))} />
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} placeholder="Type" value={taskForm.type} onChange={(e) => setTaskForm((f) => ({ ...f, type: e.target.value }))} />
              <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none ${input}`} rows={3} placeholder="Notes" value={taskForm.notes} onChange={(e) => setTaskForm((f) => ({ ...f, notes: e.target.value }))} />
              <button className="w-full mt-4 py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest">Add Schedule</button>
            </form>

            <div className="lg:col-span-2 space-y-3">
              {schedule.length === 0 ? (
                <div className={`border ${card} p-8 text-center ${muted}`}>No schedule items yet.</div>
              ) : schedule.map((item) => (
                <div key={item.id} className={`border ${card} p-4 flex flex-col md:flex-row md:items-center justify-between gap-3`}>
                  <div>
                    <p className="font-black">{item.title}</p>
                    <p className={`text-xs ${muted}`}>{new Date(item.schedule_date).toLocaleDateString('en-IN')} {item.schedule_time || ''} - {item.city}</p>
                    {item.notes && <p className="text-sm mt-2">{item.notes}</p>}
                  </div>
                  <select className={`border px-3 py-2 text-xs font-bold ${input}`} value={item.status} onChange={(e) => updateTask(item.id, e.target.value)}>
                    {scheduleStatuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <section className={`border ${card} p-6 max-w-2xl`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)] mb-4">Profile</p>
            {[
              ['Name', agent?.name],
              ['Email', agent?.email],
              ['Phone', agent?.phone],
              ['Agent Type', agent?.agent_type],
              ['Assigned City', `${agent?.city || ''}${agent?.state ? `, ${agent.state}` : ''}`],
              ['Status', agent?.status],
            ].map(([label, value]) => (
              <div key={label} className={`flex justify-between gap-4 py-3 border-b ${dark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>{label}</span>
                <span className="text-sm font-bold text-right">{value || '-'}</span>
              </div>
            ))}

            <form onSubmit={changePassword} className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)] mb-3">Change Password</p>
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} type="password" placeholder="Current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))} required />
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} type="password" placeholder="New password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))} required />
              <button className="px-6 py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest">Update Password</button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
