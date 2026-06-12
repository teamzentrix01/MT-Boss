'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const leadStatuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];
const scheduleStatuses = ['Planned', 'Done', 'Cancelled'];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function AgentDashboardPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState(null);
  const [leads, setLeads] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [activeTab, setActiveTab] = useState('leads');
  const [message, setMessage] = useState('');
  const [leadForm, setLeadForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceType: '',
    leadType: '',
    status: 'New',
    followUpDate: '',
    notes: '',
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    scheduleDate: todayIso(),
    scheduleTime: '',
    type: 'Follow-up',
    status: 'Planned',
    notes: '',
  });
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
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('agent-token');
    localStorage.removeItem('agent');
    document.cookie = 'agent-auth-token=; path=/; max-age=0';
    router.push('/agent/login');
  }

  async function createLead(e) {
    e.preventDefault();
    setMessage('');
    const res = await authFetch('/api/agent/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadForm),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setLeads((prev) => [data.data, ...prev]);
      setLeadForm({ clientName: '', clientPhone: '', clientEmail: '', serviceType: '', leadType: '', status: 'New', followUpDate: '', notes: '' });
      setMessage('Lead added for your assigned city.');
    } else {
      setMessage(data.error || 'Lead could not be saved.');
    }
  }

  async function updateLead(id, status) {
    const res = await authFetch('/api/agent/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
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
    };
  }, [leads, schedule]);

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
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#facc15]">Agent Workspace</p>
            <h1 className="text-3xl font-black uppercase mt-1">{agent?.name || 'Agent Dashboard'}</h1>
            <p className={`text-sm ${muted} mt-1`}>
              {agent?.agent_type || 'Agent'} - assigned city: <span className="font-black text-[#facc15]">{agent?.city}</span>
              {agent?.state ? `, ${agent.state}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['leads', 'schedule', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 border text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'bg-[#facc15] border-[#facc15] text-black' : `${card} ${muted}`}`}
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
          <div className={`border border-[#facc15] ${dark ? 'bg-yellow-400/10' : 'bg-yellow-50'} p-4 mb-5 text-sm font-bold`}>
            Please change your temporary password from the Profile tab.
          </div>
        )}

        {message && (
          <div className={`border ${card} p-3 mb-5 text-sm font-bold text-[#facc15]`}>
            {message}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          {[
            ['Total Leads', stats.total],
            ['Today Follow-ups', stats.followUps],
            ['Converted', stats.converted],
            ['Today Schedule', stats.todayTasks],
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
              <p className="text-[10px] font-black uppercase tracking-widest text-[#facc15] mb-4">Add Lead in {agent?.city}</p>
              {[
                ['Client Name', 'clientName', 'text'],
                ['Client Phone', 'clientPhone', 'tel'],
                ['Client Email', 'clientEmail', 'email'],
                ['Service Type', 'serviceType', 'text'],
                ['Lead Type', 'leadType', 'text'],
              ].map(([label, key, type]) => (
                <div key={key} className="mb-3">
                  <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>{label}</label>
                  <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} type={type} value={leadForm[key]} onChange={(e) => setLeadForm((f) => ({ ...f, [key]: e.target.value }))} required={key === 'clientName' || key === 'clientPhone'} />
                </div>
              ))}
              <div className="mb-3">
                <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Follow-up Date</label>
                <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} type="date" value={leadForm.followUpDate} onChange={(e) => setLeadForm((f) => ({ ...f, followUpDate: e.target.value }))} />
              </div>
              <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none ${input}`} rows={3} placeholder="Notes" value={leadForm.notes} onChange={(e) => setLeadForm((f) => ({ ...f, notes: e.target.value }))} />
              <button className="w-full mt-4 py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest">Save Lead</button>
            </form>

            <div className="lg:col-span-2 space-y-3">
              {leads.length === 0 ? (
                <div className={`border ${card} p-8 text-center ${muted}`}>No leads yet for {agent?.city}.</div>
              ) : leads.map((lead) => (
                <div key={lead.id} className={`border ${card} p-4`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{lead.client_name}</p>
                      <p className={`text-xs ${muted}`}>{lead.client_phone} - {lead.city}</p>
                      <p className={`text-xs ${muted}`}>{lead.service_type || 'Service not set'} {lead.lead_type ? `- ${lead.lead_type}` : ''}</p>
                      {lead.notes && <p className="text-sm mt-2">{lead.notes}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <select className={`border px-3 py-2 text-xs font-bold ${input}`} value={lead.status} onChange={(e) => updateLead(lead.id, e.target.value)}>
                        {leadStatuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </div>
                  </div>
                  {lead.follow_up_date && <p className="text-xs text-[#facc15] font-black mt-3">Follow-up: {new Date(lead.follow_up_date).toLocaleDateString('en-IN')}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'schedule' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <form onSubmit={createTask} className={`border ${card} p-5 h-fit`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#facc15] mb-4">Plan Day in {agent?.city}</p>
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} placeholder="Title" value={taskForm.title} onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))} required />
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} type="date" value={taskForm.scheduleDate} onChange={(e) => setTaskForm((f) => ({ ...f, scheduleDate: e.target.value }))} required />
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} type="time" value={taskForm.scheduleTime} onChange={(e) => setTaskForm((f) => ({ ...f, scheduleTime: e.target.value }))} />
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} placeholder="Type" value={taskForm.type} onChange={(e) => setTaskForm((f) => ({ ...f, type: e.target.value }))} />
              <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none ${input}`} rows={3} placeholder="Notes" value={taskForm.notes} onChange={(e) => setTaskForm((f) => ({ ...f, notes: e.target.value }))} />
              <button className="w-full mt-4 py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest">Add Schedule</button>
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
            <p className="text-[10px] font-black uppercase tracking-widest text-[#facc15] mb-4">Profile</p>
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
              <p className="text-[10px] font-black uppercase tracking-widest text-[#facc15] mb-3">Change Password</p>
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} type="password" placeholder="Current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))} required />
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} type="password" placeholder="New password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))} required />
              <button className="px-6 py-3 bg-[#facc15] text-black text-[10px] font-black uppercase tracking-widest">Update Password</button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
