'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PartyProjectManagement from '@/app/components/PartyProjectManagement';
import PanelLayout from '@/app/components/PanelLayout';
import {
  LayoutDashboard,
  ClipboardList,
  FolderKanban,
  Building2,
  CalendarDays,
  Clock,
  User,
  Plus,
  ArrowLeft,
} from '@/app/components/ui/icons';

const leadStatuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];
const leadStages = ['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost'];
const scheduleStatuses = ['Planned', 'Done', 'Cancelled'];
const projectStatuses = ['lead', 'estimate_sent', 'final', 'started', 'ongoing', 'running', 'on_hold', 'completed', 'cancelled', 'lost'];

function phoneInputValue(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length > 10 && digits.startsWith('91')
    ? digits.slice(2, 12)
    : digits.slice(0, 10);
}

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
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [unreadActivityCount, setUnreadActivityCount] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectOps, setProjectOps] = useState({ payments: [], labour: [], contractors: [], materials: [], expenses: [], transport: [] });
  const [activeTab, setActiveTab] = useState(() => {
    const requestedTab = searchParams.get('tab');
    return ['overview', 'leads', 'projects', 'schedule', 'activity', 'profile', 'project-management'].includes(requestedTab) ? requestedTab : 'overview';
  });
  const loadedTabsRef = useRef(new Set());
  const [message, setMessage] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [leadSaving, setLeadSaving] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState(null);
  const [convertingLead, setConvertingLead] = useState(null);
  const [conversionData, setConversionData] = useState(null);
  const [isSubmittingConvert, setIsSubmittingConvert] = useState(false);
  const isSubmittingConvertRef = useRef(false);
  const idempotencyKeyRef = useRef(null);
  const [leadForm, setLeadForm] = useState({
    clientName: '',
    city: '',
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
  const [editTask, setEditTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (['overview', 'leads', 'projects', 'schedule', 'activity', 'profile', 'project-management'].includes(tab)) {
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
    loadData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof window !== 'undefined' && localStorage.getItem('agent-token') && document.visibilityState === 'visible') {
        if (activeTab === 'leads') refreshLeads();
        if (activeTab === 'activity') loadActivities(true);
      }
    }, 20000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (loading || !agent || loadedTabsRef.current.has(activeTab)) return;
    if (activeTab === 'overview') {
      refreshLeads();
      loadSchedule();
      loadProjects();
    }
    if (activeTab === 'leads') refreshLeads();
    if (activeTab === 'projects') loadProjects();
    if (activeTab === 'schedule') loadSchedule();
    if (activeTab === 'activity') loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, agent, loading]);

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

  async function loadData(tab = 'overview') {
    if (loadedTabsRef.current.has(tab) && agent) return;
    loadedTabsRef.current.add(tab);
    setLoading(true);
    try {
      if (tab === 'overview') {
        const [profileRes, leadsRes, schedRes, projRes, actRes] = await Promise.all([
          authFetch('/api/agent/profile'),
          authFetch('/api/agent/leads'),
          authFetch('/api/agent/schedule'),
          authFetch('/api/agent/projects'),
          authFetch('/api/agent/activity'),
        ]);
        if (!profileRes) return;
        const profileData = await profileRes.json();
        if (profileData.success) {
          setAgent(profileData.agent);
          localStorage.setItem('agent', JSON.stringify(profileData.agent));
          if (profileData.agent.must_change_password) setActiveTab('profile');
        }
        if (leadsRes) { const d = await leadsRes.json(); if (d.success) setLeads(d.data || []); }
        if (schedRes) { const d = await schedRes.json(); if (d.success) setSchedule(d.data || []); }
        if (projRes) { const d = await projRes.json(); if (d.success) setProjects(d.data || []); }
        if (actRes) { const d = await actRes.json(); if (d.success) { setActivities(d.data || []); setUnreadActivityCount(d.unread_count || 0); } }
        loadedTabsRef.current.add('overview');
        loadedTabsRef.current.add('leads');
        loadedTabsRef.current.add('schedule');
        loadedTabsRef.current.add('projects');
        loadedTabsRef.current.add('activity');
        return;
      }

      const endpoint = {
        leads: '/api/agent/leads',
        schedule: '/api/agent/schedule',
        activity: '/api/agent/activity',
        projects: '/api/agent/projects',
      }[tab];
      const [profileRes, tabRes] = await Promise.all([
        authFetch('/api/agent/profile'),
        endpoint ? authFetch(endpoint) : Promise.resolve(null),
      ]);
      if (!profileRes) return;
      const profileData = await profileRes.json();
      const tabData = tabRes ? await tabRes.json() : null;

      if (profileData.success) {
        setAgent(profileData.agent);
        localStorage.setItem('agent', JSON.stringify(profileData.agent));
        if (profileData.agent.must_change_password) setActiveTab('profile');
      }
      if (tab === 'leads' && tabData?.success) setLeads(tabData.data || []);
      if (tab === 'schedule' && tabData?.success) setSchedule(tabData.data || []);
      if (tab === 'projects' && tabData?.success) setProjects(tabData.data || []);
      if (tab === 'activity' && tabData?.success) {
        setActivities(tabData.data || []);
        setUnreadActivityCount(tabData.unread_count || 0);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadProjects() {
    const res = await authFetch('/api/agent/projects');
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setProjects(data.data || []);
      loadedTabsRef.current.add('projects');
    }
  }

  async function loadSchedule() {
    const res = await authFetch('/api/agent/schedule');
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setSchedule(data.data || []);
      loadedTabsRef.current.add('schedule');
    }
  }

  async function refreshLeads() {
    const res = await authFetch('/api/agent/leads');
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setLeads(data.data || []);
      loadedTabsRef.current.add('leads');
    }
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
        contractors: data.contractors || [],
        materials: data.materials || [],
        expenses: data.expenses || [],
        transport: data.transport || [],
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
    clientName: '', city: agent?.city || '', clientPhone: '', clientEmail: '', serviceType: '', leadType: '',
    status: 'New', followUpDate: '', notes: '',
    lead_stage: 'New', meeting_done: false, estimate_sent: false, final_amount: '',
    daily_visit_notes: '', client_requirement: '', lead_source: 'offline',
  });

  async function createLead(e) {
    e.preventDefault();
    if (leadSaving) return;
    setLeadSaving(true);
    setMessage('');
    try {
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
          setShowLeadForm(false);
          setMessage(data.project ? 'Lead finalized and sent to admin for project assignment.' : 'Lead updated.');
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
        setLeads((prev) => data.duplicate
          ? prev.some((lead) => lead.id === data.data.id) ? prev : [data.data, ...prev]
          : [data.data, ...prev]
        );
        setLeadForm(resetLeadForm());
        setShowLeadForm(false);
        setMessage(data.duplicate
          ? 'This lead was already saved; duplicate entry was prevented.'
          : data.project ? 'Lead finalized and sent to admin for project assignment.' : 'Lead added for your assigned city.'
        );
      } else {
        setMessage(data.error || 'Lead could not be saved.');
      }
    } finally {
      setLeadSaving(false);
    }
  }

  async function loadActivities(silent = false) {
    if (!silent) setActivityLoading(true);
    try {
      const res = await authFetch('/api/agent/activity');
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        setActivities(data.data || []);
        setUnreadActivityCount(data.unread_count || 0);
        loadedTabsRef.current.add('activity');
      } else if (!silent) {
        setMessage(data.error || 'Activity could not be loaded.');
      }
    } finally {
      if (!silent) setActivityLoading(false);
    }
  }

  async function markActivityRead(id) {
    const item = activities.find((activity) => activity.id === id);
    if (!item || item.is_read) return;
    const res = await authFetch('/api/agent/activity', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setActivities((current) => current.map((activity) => (
        activity.id === id ? { ...activity, is_read: true, read_at: new Date().toISOString() } : activity
      )));
      setUnreadActivityCount(data.unread_count || 0);
    }
  }

  async function markAllActivitiesRead() {
    const res = await authFetch('/api/agent/activity', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mark_all_read: true }),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      const readAt = new Date().toISOString();
      setActivities((current) => current.map((activity) => (
        activity.is_read ? activity : { ...activity, is_read: true, read_at: readAt }
      )));
      setUnreadActivityCount(0);
    }
  }

  function startEditLead(lead) {
    setEditLead(lead);
    setShowLeadForm(true);
    setLeadForm({
      clientName: lead.client_name || '', clientPhone: lead.client_phone || '',
      city: lead.city || agent?.city || '',
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
    if (data.success) {
      setLeads((prev) => prev.map((lead) => (lead.id === id ? data.data : lead)));
      setMessage(status ? `Lead status changed to ${data.data.status}.` : `Lead stage changed to ${data.data.lead_stage}.`);
      if (data.project) {
        setMessage('Lead finalized and sent to admin for project assignment.');
      }
    } else {
      setMessage(data.error || 'Lead could not be updated.');
    }
  }

  async function deleteProjectEntry(entryTypeName, entry) {
    if (!selectedProject || !window.confirm(`Delete this ${entryTypeName} entry?`)) return;
    const singularType = entryTypeName === 'materials' ? 'material' : entryTypeName.replace(/s$/, '');
    const params = new URLSearchParams({
      project_id: String(selectedProject.id),
      entry_type: singularType,
      entry_id: String(entry.id),
    });
    const res = await authFetch(`/api/agent/projects?${params.toString()}`, { method: 'DELETE' });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setMessage('Project entry deleted.');
      await loadProjects();
      await openProject(selectedProject);
    } else {
      setMessage(data.error || 'Project entry could not be deleted.');
    }
  }

  async function openConvertModal(lead) {
    if (lead.converted_project_id) {
      if (agent?.has_project_management_access) {
        setActiveTab('project-management');
        router.push(`/agent/dashboard?tab=project-management&projectId=${lead.converted_project_id}`);
      } else {
        router.push(`/dashboard/projects/${lead.converted_project_id}`);
      }
      return;
    }
    isSubmittingConvertRef.current = false;
    setIsSubmittingConvert(false);
    idempotencyKeyRef.current = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `convert_${lead.id}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    setConvertingLead(lead);
    setConversionData({
      loading: true,
      partyId: null,
      partyName: '',
      newParty: { name: lead.client_name, phone: lead.client_phone, email: lead.client_email || '', address: lead.city || '' },
      project: {
        name: lead.service_type || lead.client_requirement || 'New Project',
        contract_value: lead.final_amount || 0,
        site_address: lead.city || '',
        status: 'running',
        agent_id: lead.agent_id || agent?.id || '',
        start_date: new Date().toISOString().slice(0, 10),
      },
    });

    try {
      const res = await authFetch('/api/admin/project-management/parties');
      if (res) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find((p) => p.phone === lead.client_phone || (lead.client_email && p.email === lead.client_email));
          if (found) {
            setConversionData((prev) => ({ ...prev, loading: false, partyId: found.id, partyName: found.name }));
            return;
          }
        }
      }
    } catch {}
    setConversionData((prev) => ({ ...prev, loading: false }));
  }

  async function submitConversion(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmittingConvertRef.current) return;
    isSubmittingConvertRef.current = true;
    setIsSubmittingConvert(true);

    const payload = {
      lead_id: convertingLead.id,
      party_id: conversionData.partyId,
      new_party: conversionData.partyId ? null : conversionData.newParty,
      project: conversionData.project,
    };

    try {
      const res = await authFetch('/api/admin/lead-management/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKeyRef.current || `convert_${convertingLead.id}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res) {
        isSubmittingConvertRef.current = false;
        setIsSubmittingConvert(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        const targetProjectId = data.project_id;
        setLeads((prev) => prev.map((l) => (l.id === convertingLead.id ? { ...l, converted_project_id: targetProjectId } : l)));
        setConvertingLead(null);
        isSubmittingConvertRef.current = false;
        setIsSubmittingConvert(false);
        setMessage('Lead converted to project successfully.');
        await refreshLeads();
        if (agent?.has_project_management_access) {
          setActiveTab('project-management');
          router.push(`/agent/dashboard?tab=project-management&projectId=${targetProjectId}`);
        }
      } else {
        alert(data.error || 'Conversion failed');
        isSubmittingConvertRef.current = false;
        setIsSubmittingConvert(false);
      }
    } catch (err) {
      alert(err.message || 'Conversion failed');
      isSubmittingConvertRef.current = false;
      setIsSubmittingConvert(false);
    }
  }

  async function deleteLead(lead) {
    if (!window.confirm(`Delete lead for ${lead.client_name}? This action cannot be undone.`)) return;
    setDeletingLeadId(lead.id);
    setMessage('');
    try {
      const res = await authFetch(`/api/agent/leads?id=${lead.id}`, { method: 'DELETE' });
      if (!res) return;
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((item) => item.id !== lead.id));
        if (editLead?.id === lead.id) {
          setEditLead(null);
          setLeadForm(resetLeadForm());
        }
        setMessage('Lead deleted.');
      } else {
        setMessage(data.error || 'Lead could not be deleted.');
      }
    } finally {
      setDeletingLeadId(null);
    }
  }

  async function createTask(e) {
    e.preventDefault();
    setMessage('');
    const res = await authFetch('/api/agent/schedule', {
      method: editTask ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editTask ? { id: editTask.id, ...taskForm } : taskForm),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setSchedule((prev) => {
        const rows = editTask
          ? prev.map((item) => item.id === editTask.id ? data.data : item)
          : [...prev, data.data];
        return rows.sort((a, b) => String(a.schedule_date).localeCompare(String(b.schedule_date)));
      });
      setTaskForm({ title: '', scheduleDate: todayIso(), scheduleTime: '', type: 'Follow-up', status: 'Planned', notes: '' });
      setEditTask(null);
      setShowTaskForm(false);
      setMessage(editTask ? 'Schedule item updated.' : 'Schedule item added.');
    } else {
      setMessage(data.error || 'Schedule item could not be saved.');
    }
  }

  function startEditTask(item) {
    setEditTask(item);
    setShowTaskForm(true);
    setTaskForm({
      title: item.title || '',
      scheduleDate: item.schedule_date ? String(item.schedule_date).slice(0, 10) : todayIso(),
      scheduleTime: item.schedule_time || '',
      type: item.type || '',
      status: item.status || 'Planned',
      notes: item.notes || '',
    });
  }

  async function deleteTask(item) {
    if (!window.confirm(`Delete schedule item "${item.title}"?`)) return;
    setDeletingTaskId(item.id);
    const res = await authFetch(`/api/agent/schedule?id=${item.id}`, { method: 'DELETE' });
    if (!res) {
      setDeletingTaskId(null);
      return;
    }
    const data = await res.json();
    if (data.success) {
      setSchedule((prev) => prev.filter((row) => row.id !== item.id));
      if (editTask?.id === item.id) {
        setEditTask(null);
        setTaskForm({ title: '', scheduleDate: todayIso(), scheduleTime: '', type: 'Follow-up', status: 'Planned', notes: '' });
      }
      setMessage('Schedule item deleted.');
    } else {
      setMessage(data.error || 'Schedule item could not be deleted.');
    }
    setDeletingTaskId(null);
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
      if (data.token) localStorage.setItem('agent-token', data.token);
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
  const visibleActivities = activityFilter === 'unread'
    ? activities.filter((activity) => !activity.is_read)
    : activities;

  if (loading) {
    return <main className={`min-h-screen flex items-center justify-center ${bg}`}>Loading agent dashboard...</main>;
  }

  const menuItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'leads', label: 'Leads', icon: ClipboardList },
    { key: 'projects', label: 'Projects', icon: FolderKanban },
    {
      key: 'project-management',
      label: 'Project Management',
      icon: Building2,
      hidden: !agent?.has_project_management_access,
    },
    { key: 'schedule', label: 'Schedule', icon: CalendarDays },
    {
      key: 'activity',
      label: 'Activity Track',
      icon: Clock,
      badge: unreadActivityCount > 0 ? (unreadActivityCount > 99 ? '99+' : unreadActivityCount) : null,
      badgeColor: 'bg-red-500 text-white',
    },
    { key: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <PanelLayout
      title="Agent Workspace"
      subtitle={`${agent?.name || 'Agent'} · ${agent?.city ? agent.city + ', ' : ''}${agent?.state || ''}`}
      user={agent || {}}
      roleBadge="Agent"
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={(tab) => {
        if (agent?.must_change_password && tab !== 'profile') return;
        setActiveTab(tab);
        router.push(`/agent/dashboard?tab=${tab}`);
      }}
      onLogout={logout}
      actions={
        activeTab === 'leads' ? (
          <button
            type="button"
            onClick={() => refreshLeads()}
            className="px-3 py-1.5 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Refresh Leads
          </button>
        ) : null
      }
    >
      {agent?.must_change_password && (
        <div className={`border border-[var(--brand-blue)] ${dark ? 'bg-[var(--brand-blue)]/10' : 'bg-sky-50'} p-4 mb-5 text-sm font-bold rounded-lg`}>
          Change your temporary password to unlock leads, projects, and schedule access.
        </div>
      )}

      {message && (
        <div className={`border ${card} p-3 mb-5 text-sm font-bold text-[var(--brand-blue)] rounded-lg`}>
          {message}
        </div>
      )}

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`border ${card} p-5 rounded-lg flex items-center justify-between`}>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>Total Leads</p>
                <p className="text-3xl font-black mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[rgba(33,150,243,0.12)] text-[#0284c7] flex items-center justify-center">
                <ClipboardList size={22} />
              </div>
            </div>
            <div className={`border ${card} p-5 rounded-lg flex items-center justify-between`}>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>Today Follow-ups</p>
                <p className="text-3xl font-black mt-1 text-amber-500">{stats.followUps}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <CalendarDays size={22} />
              </div>
            </div>
            <div className={`border ${card} p-5 rounded-lg flex items-center justify-between`}>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>Converted</p>
                <p className="text-3xl font-black mt-1 text-green-500">{stats.converted}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                <FolderKanban size={22} />
              </div>
            </div>
            <div className={`border ${card} p-5 rounded-lg flex items-center justify-between`}>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>Active Projects</p>
                <p className="text-3xl font-black mt-1 text-[var(--brand-blue)]">{stats.activeProjects}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[rgba(33,150,243,0.12)] text-[#0284c7] flex items-center justify-center">
                <Building2 size={22} />
              </div>
            </div>
          </section>

          {/* Quick overview panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Tasks */}
            <div className={`border ${card} p-5 rounded-lg`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-wider">Today&apos;s Schedule</h3>
                <button
                  type="button"
                  onClick={() => { setActiveTab('schedule'); router.push('/agent/dashboard?tab=schedule'); }}
                  className="text-xs text-[var(--brand-blue)] font-bold hover:underline"
                >
                  View All →
                </button>
              </div>
              {schedule.filter((item) => item.schedule_date && String(item.schedule_date).slice(0, 10) === todayIso()).length === 0 ? (
                <p className={`text-xs ${muted} py-6 text-center`}>No tasks or visits scheduled for today.</p>
              ) : (
                <div className="space-y-2">
                  {schedule
                    .filter((item) => item.schedule_date && String(item.schedule_date).slice(0, 10) === todayIso())
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className={`p-3 border ${card} rounded-md flex items-center justify-between`}>
                        <div>
                          <p className="text-xs font-bold">{item.title}</p>
                          <p className={`text-[10px] ${muted}`}>{item.schedule_time || 'No time specified'} · {item.type}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Recent Leads */}
            <div className={`border ${card} p-5 rounded-lg`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-wider">Recent Leads</h3>
                <button
                  type="button"
                  onClick={() => { setActiveTab('leads'); router.push('/agent/dashboard?tab=leads'); }}
                  className="text-xs text-[var(--brand-blue)] font-bold hover:underline"
                >
                  View All ({leads.length}) →
                </button>
              </div>
              {leads.length === 0 ? (
                <p className={`text-xs ${muted} py-6 text-center`}>No leads recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {leads.slice(0, 5).map((l) => (
                    <div key={l.id} className={`p-3 border ${card} rounded-md flex items-center justify-between`}>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{l.client_name}</p>
                        <p className={`text-[10px] ${muted} truncate`}>{l.client_phone} · {l.city || agent?.city || '—'}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(33,150,243,0.12)] text-[#0284c7] shrink-0 ml-2">
                        {l.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        {activeTab === 'leads' && (
          showLeadForm || editLead ? (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => { setShowLeadForm(false); setEditLead(null); setLeadForm(resetLeadForm()); }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded text-xs font-bold ${input}`}
                >
                  <ArrowLeft size={14} /> Back to Leads
                </button>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--brand-blue)]">
                  {editLead ? 'Edit Lead' : 'Create New Lead'}
                </p>
              </div>

              <form onSubmit={createLead} className={`border ${card} p-6 max-w-3xl mx-auto rounded-md shadow-sm`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[ 
                    ['Client Name *', 'clientName', 'text'],
                    ['Lead City *', 'city', 'text'],
                    ['Client Phone *', 'clientPhone', 'tel'],
                    ['Client Email', 'clientEmail', 'email'],
                    ['Service Type', 'serviceType', 'text'],
                    ['Lead Type', 'leadType', 'text'],
                  ].map(([label, key, type]) => (
                    <div key={key}>
                      <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>{label}</label>
                      <input
                        className={`w-full border px-3 py-2 text-sm outline-none ${input}`}
                        type={type}
                        name={key}
                        value={leadForm[key]}
                        onChange={(e) => {
                          const value = key === 'clientPhone' ? phoneInputValue(e.target.value) : e.target.value;
                          setLeadForm((f) => ({ ...f, [key]: value }));
                        }}
                        required={key === 'clientName' || key === 'clientPhone'}
                        {...(key === 'clientPhone' ? {
                          inputMode: 'numeric',
                          maxLength: 16,
                          pattern: '[6-9][0-9]{9}',
                          placeholder: '10-digit mobile number',
                        } : {})}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Lead Stage</label>
                    <select disabled={Boolean(editLead?.project_id)} className={`w-full border px-3 py-2 text-sm ${input}`} value={leadForm.lead_stage} onChange={(e) => setLeadForm((f) => ({ ...f, lead_stage: e.target.value }))}>
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

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <label className={`flex items-center gap-2 text-[10px] font-black uppercase ${muted}`}>
                    <input type="checkbox" checked={leadForm.meeting_done} onChange={(e) => setLeadForm((f) => ({ ...f, meeting_done: e.target.checked }))} className="accent-[var(--brand-blue)]" /> Meeting Done
                  </label>
                  <label className={`flex items-center gap-2 text-[10px] font-black uppercase ${muted}`}>
                    <input type="checkbox" checked={leadForm.estimate_sent} onChange={(e) => setLeadForm((f) => ({ ...f, estimate_sent: e.target.checked }))} className="accent-[var(--brand-blue)]" /> Estimate Sent
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Deal / Final Amount</label>
                    <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} type="number" placeholder="₹" value={leadForm.final_amount} onChange={(e) => setLeadForm((f) => ({ ...f, final_amount: e.target.value }))} />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Follow-up Date</label>
                    <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} type="date" value={leadForm.followUpDate} onChange={(e) => setLeadForm((f) => ({ ...f, followUpDate: e.target.value }))} />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Client Requirement</label>
                  <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none ${input}`} rows={2} placeholder="What client needs" value={leadForm.client_requirement} onChange={(e) => setLeadForm((f) => ({ ...f, client_requirement: e.target.value }))} />
                </div>

                <div className="mt-4">
                  <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Daily Visit Notes</label>
                  <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none ${input}`} rows={2} placeholder="Today's visit notes" value={leadForm.daily_visit_notes} onChange={(e) => setLeadForm((f) => ({ ...f, daily_visit_notes: e.target.value }))} />
                </div>

                <div className="mt-4">
                  <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>General Notes</label>
                  <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none ${input}`} rows={2} placeholder="General notes" value={leadForm.notes} onChange={(e) => setLeadForm((f) => ({ ...f, notes: e.target.value }))} />
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => { setShowLeadForm(false); setEditLead(null); setLeadForm(resetLeadForm()); }}
                    className={`px-4 py-2.5 border text-xs font-bold ${input}`}
                  >
                    Cancel
                  </button>
                  <button disabled={leadSaving} className="px-6 py-2.5 bg-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-60 rounded">
                    {leadSaving ? 'Saving...' : editLead ? 'Update Lead' : 'Save Lead'}
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">Leads Management</h3>
                  <p className={`text-xs ${muted}`}>Manage and track leads for {agent?.city || 'Agent'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowLeadForm(true); setEditLead(null); setLeadForm(resetLeadForm()); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-wider rounded shadow-sm hover:opacity-90"
                >
                  <Plus size={14} /> Add New Lead
                </button>
              </div>

              <div className="space-y-3">
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
                        <select aria-label="Lead status" className={`border px-3 py-2 text-xs font-bold ${input}`}
                          disabled={Boolean(lead.project_id)}
                          value={lead.status || 'New'} onChange={(e) => updateLead(lead.id, e.target.value, null)}>
                          {leadStatuses.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <select disabled={Boolean(lead.project_id)} className={`border px-3 py-2 text-xs font-bold ${input}`} value={lead.lead_stage || 'New'} onChange={(e) => updateLead(lead.id, null, e.target.value)}>
                          {leadStages.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        {lead.status === 'Converted' && (
                          <button
                            type="button"
                            onClick={() => openConvertModal(lead)}
                            className={`px-3 py-2 border text-xs font-bold ${
                              lead.converted_project_id
                                ? `${card} ${muted}`
                                : 'bg-[var(--brand-blue)] text-black'
                            }`}
                          >
                            {lead.converted_project_id ? 'Already converted → View Project' : 'Convert to Project'}
                          </button>
                        )}
                        <button type="button" onClick={() => startEditLead(lead)} className={`px-3 py-2 border text-xs font-bold ${input}`}>Edit</button>
                        <button
                          type="button"
                          onClick={() => deleteLead(lead)}
                          disabled={deletingLeadId === lead.id}
                          className="px-3 py-2 border border-red-500/50 text-xs font-bold text-red-500 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingLeadId === lead.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                    {lead.follow_up_date && <p className="text-xs text-[var(--brand-blue)] font-black mt-3">Follow-up: {new Date(lead.follow_up_date).toLocaleDateString('en-IN')}</p>}
                  </div>
                ))}
              </div>
            </section>
          )
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
                    <span>Costs: <strong>Rs {Number((Number(project.labour_cost || 0) + Number(project.contractor_cost || 0) + Number(project.material_cost || 0) + Number(project.extra_expense || 0) + Number(project.transport_cost || 0))).toLocaleString('en-IN')}</strong></span>
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
                        {['payment', 'labour', 'contractor', 'material', 'expense', 'transport'].map((type) => <option key={type} value={type}>{type}</option>)}
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

                    {entryType === 'contractor' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Contractor name" value={entryForm.contractor_name || ''} onChange={(e) => setEntryForm((f) => ({ ...f, contractor_name: e.target.value }))} required />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="tel" inputMode="numeric" maxLength={10} placeholder="Contractor mobile number" value={entryForm.contractor_phone || ''} onChange={(e) => setEntryForm((f) => ({ ...f, contractor_phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} required />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Company / firm" value={entryForm.company_name || ''} onChange={(e) => setEntryForm((f) => ({ ...f, company_name: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Work description" value={entryForm.work_description || ''} onChange={(e) => setEntryForm((f) => ({ ...f, work_description: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="number" placeholder="Contract value" value={entryForm.contract_amount || ''} onChange={(e) => setEntryForm((f) => ({ ...f, contract_amount: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="number" placeholder="Payment amount" value={entryForm.paid_amount || ''} onChange={(e) => setEntryForm((f) => ({ ...f, paid_amount: e.target.value }))} required />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="date" value={entryForm.payment_date || todayIso()} onChange={(e) => setEntryForm((f) => ({ ...f, payment_date: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Payment mode" value={entryForm.payment_mode || ''} onChange={(e) => setEntryForm((f) => ({ ...f, payment_mode: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Invoice / reference no." value={entryForm.invoice_number || ''} onChange={(e) => setEntryForm((f) => ({ ...f, invoice_number: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Notes" value={entryForm.notes || ''} onChange={(e) => setEntryForm((f) => ({ ...f, notes: e.target.value }))} />
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

                    {entryType === 'transport' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select className={`border px-3 py-2 text-sm ${input}`} value={entryForm.transport_type || ''} onChange={(e) => setEntryForm((f) => ({ ...f, transport_type: e.target.value }))} required>
                          <option value="">Transport type</option>
                          {['truck', 'tractor', 'tempo', 'loader', 'pickup', 'other'].map((type) => <option key={type}>{type}</option>)}
                        </select>
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Vehicle number" value={entryForm.vehicle_number || ''} onChange={(e) => setEntryForm((f) => ({ ...f, vehicle_number: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Driver name" value={entryForm.driver_name || ''} onChange={(e) => setEntryForm((f) => ({ ...f, driver_name: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Driver phone" value={entryForm.driver_phone || ''} onChange={(e) => setEntryForm((f) => ({ ...f, driver_phone: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="From location" value={entryForm.from_location || ''} onChange={(e) => setEntryForm((f) => ({ ...f, from_location: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="To location" value={entryForm.to_location || ''} onChange={(e) => setEntryForm((f) => ({ ...f, to_location: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="number" placeholder="Transport amount" value={entryForm.amount || ''} onChange={(e) => setEntryForm((f) => ({ ...f, amount: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} type="date" value={entryForm.transport_date || todayIso()} onChange={(e) => setEntryForm((f) => ({ ...f, transport_date: e.target.value }))} />
                        <input className={`border px-3 py-2 text-sm ${input}`} placeholder="Notes" value={entryForm.notes || ''} onChange={(e) => setEntryForm((f) => ({ ...f, notes: e.target.value }))} />
                      </div>
                    )}

                    <button className="mt-3 px-5 py-2.5 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest">Add Entry</button>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ['Payments', 'payments', projectOps.payments, (x) => `${x.payment_date?.slice?.(0, 10) || ''} - Rs ${x.amount}`],
                      ['Labour', 'labour', projectOps.labour, (x) => `${x.work_date?.slice?.(0, 10) || ''} - ${x.labour_name} - Rs ${x.wage_amount}`],
                      ['Contractor Payments', 'contractors', projectOps.contractors, (x) => `${x.payment_date?.slice?.(0, 10) || ''} - ${x.contractor_name} - Rs ${x.paid_amount || 0}`],
                      ['Materials', 'materials', projectOps.materials, (x) => `${x.entry_date?.slice?.(0, 10) || ''} - ${x.material_name} - ${x.quantity} ${x.unit || ''}`],
                      ['Expenses', 'expenses', projectOps.expenses, (x) => `${x.expense_date?.slice?.(0, 10) || ''} - ${x.expense_type} - Rs ${x.amount}`],
                      ['Transport', 'transport', projectOps.transport, (x) => `${x.transport_date?.slice?.(0, 10) || ''} - ${x.transport_type} - ${x.vehicle_number || ''} - Rs ${x.amount || 0}`],
                    ].map(([title, type, rows, render]) => (
                      <div key={title} className={`border ${card} p-4`}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)] mb-3">{title}</p>
                        {rows.length === 0 ? <p className={`text-xs ${muted}`}>No entries yet.</p> : rows.slice(0, 6).map((row) => (
                          <div key={row.id} className={`flex items-center justify-between gap-2 text-xs border-b py-2 ${dark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                            <span>{render(row)}</span>
                            {Number(row.agent_id) === Number(agent?.id) && (
                              <button type="button" className="text-red-500 font-bold" onClick={() => deleteProjectEntry(type, row)}>Delete</button>
                            )}
                          </div>
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
          showTaskForm || editTask ? (
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditTask(null);
                    setTaskForm({ title: '', scheduleDate: todayIso(), scheduleTime: '', type: 'Follow-up', status: 'Planned', notes: '' });
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 border rounded text-xs font-bold ${input}`}
                >
                  <ArrowLeft size={14} /> Back to Schedule
                </button>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--brand-blue)]">
                  {editTask ? 'Edit Schedule' : 'Plan Day'} in {agent?.city}
                </p>
              </div>

              <form onSubmit={createTask} className={`border ${card} p-6 max-w-2xl mx-auto rounded-md shadow-sm`}>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Title *</label>
                    <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} placeholder="Title" value={taskForm.title} onChange={(e) => setTaskForm((f) => ({ ...f, title: e.target.value }))} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Date *</label>
                      <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} type="date" value={taskForm.scheduleDate} onChange={(e) => setTaskForm((f) => ({ ...f, scheduleDate: e.target.value }))} required />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Time</label>
                      <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} type="time" value={taskForm.scheduleTime} onChange={(e) => setTaskForm((f) => ({ ...f, scheduleTime: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Task Type</label>
                    <input className={`w-full border px-3 py-2 text-sm outline-none ${input}`} placeholder="e.g. Follow-up, Site Visit" value={taskForm.type} onChange={(e) => setTaskForm((f) => ({ ...f, type: e.target.value }))} />
                  </div>
                  <div>
                    <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Notes</label>
                    <textarea className={`w-full border px-3 py-2 text-sm outline-none resize-none ${input}`} rows={3} placeholder="Notes" value={taskForm.notes} onChange={(e) => setTaskForm((f) => ({ ...f, notes: e.target.value }))} />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskForm(false);
                      setEditTask(null);
                      setTaskForm({ title: '', scheduleDate: todayIso(), scheduleTime: '', type: 'Follow-up', status: 'Planned', notes: '' });
                    }}
                    className={`px-4 py-2.5 border text-xs font-bold ${input}`}
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2.5 bg-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-wider rounded">
                    {editTask ? 'Update Schedule' : 'Add Schedule'}
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">Schedule & Daily Tasks</h3>
                  <p className={`text-xs ${muted}`}>Plan visits and follow-ups in {agent?.city || 'your city'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskForm(true);
                    setEditTask(null);
                    setTaskForm({ title: '', scheduleDate: todayIso(), scheduleTime: '', type: 'Follow-up', status: 'Planned', notes: '' });
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--brand-blue)] text-black text-xs font-black uppercase tracking-wider rounded shadow-sm hover:opacity-90"
                >
                  <Plus size={14} /> Add Schedule
                </button>
              </div>

              <div className="space-y-3">
                {schedule.length === 0 ? (
                  <div className={`border ${card} p-8 text-center ${muted}`}>No schedule items yet.</div>
                ) : schedule.map((item) => (
                  <div key={item.id} className={`border ${card} p-4 flex flex-col md:flex-row md:items-center justify-between gap-3`}>
                    <div>
                      <p className="font-black">{item.title}</p>
                      <p className={`text-xs ${muted}`}>{new Date(item.schedule_date).toLocaleDateString('en-IN')} {item.schedule_time || ''} - {item.city}</p>
                      {item.notes && <p className="text-sm mt-2">{item.notes}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <select className={`border px-3 py-2 text-xs font-bold ${input}`} value={item.status} onChange={(e) => updateTask(item.id, e.target.value)}>
                        {scheduleStatuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                      <button type="button" className={`border px-3 py-2 text-xs font-bold ${input}`} onClick={() => startEditTask(item)}>Edit</button>
                      <button
                        type="button"
                        disabled={deletingTaskId === item.id}
                        className="border border-red-500/50 px-3 py-2 text-xs font-bold text-red-500 disabled:opacity-50"
                        onClick={() => deleteTask(item)}
                      >
                        {deletingTaskId === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        )}

        {activeTab === 'activity' && (
          <section className={`border ${card}`}>
            <div className={`p-5 border-b ${dark ? 'border-zinc-800' : 'border-zinc-200'} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)]">Activity Track</p>
                <h2 className="text-xl font-black uppercase mt-1">Your Notifications</h2>
                <p className={`text-xs mt-1 ${muted}`}>
                  Account, lead, and project updates recorded for your agent profile.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'unread'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActivityFilter(filter)}
                    className={`px-3.5 py-1.5 border rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      activityFilter === filter
                        ? dark ? 'bg-white text-black border-white' : 'bg-slate-900 text-white border-slate-900'
                        : `${card} ${muted} hover:bg-slate-100 dark:hover:bg-zinc-800`
                    }`}
                  >
                    {filter}{filter === 'unread' ? ` (${unreadActivityCount})` : ''}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => loadActivities()}
                  disabled={activityLoading}
                  className={`px-3.5 py-1.5 border rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${card} ${muted} hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50`}
                >
                  {activityLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  type="button"
                  onClick={markAllActivitiesRead}
                  disabled={unreadActivityCount === 0}
                  className={`px-3.5 py-1.5 border rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${card} text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40`}
                >
                  Mark all read
                </button>
              </div>
            </div>

            <div className="p-5">
              {activityLoading && activities.length === 0 ? (
                <div className={`p-10 text-center ${muted}`}>Loading activity...</div>
              ) : visibleActivities.length === 0 ? (
                <div className={`p-10 text-center ${muted}`}>
                  {activityFilter === 'unread' ? 'No unread notifications.' : 'No activity has been recorded yet.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleActivities.map((activity) => {
                    const isLead = activity.entity_type === 'lead';
                    const isProject = activity.entity_type === 'project';
                    return (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() => markActivityRead(activity.id)}
                        className={`w-full text-left border rounded-lg p-4 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/80 ${
                          activity.is_read
                            ? `${card} opacity-75`
                            : dark
                              ? 'bg-zinc-900/90 border-zinc-700 border-l-4 border-l-sky-500'
                              : 'bg-white border-slate-200 border-l-4 border-l-sky-500 shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${activity.is_read ? 'bg-zinc-500' : 'bg-[var(--brand-blue)] animate-pulse'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <p className="font-black text-sm">{activity.title}</p>
                              <time className={`text-[10px] font-bold ${muted}`}>
                                {new Date(activity.created_at).toLocaleString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </time>
                            </div>
                            <p className={`text-sm mt-1 leading-relaxed ${muted}`}>{activity.message}</p>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--brand-blue)]">
                                {activity.type.replaceAll('_', ' ')}
                              </span>
                              {activity.entity_type && (
                                <span className={`text-[9px] font-bold uppercase ${muted}`}>
                                  {activity.entity_type}{activity.entity_id ? ` #${activity.entity_id}` : ''}
                                </span>
                              )}
                              {!activity.is_read && (
                                <span className="ml-auto text-[9px] font-black uppercase text-[var(--brand-blue)]">Click to mark read</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <section className={`border ${card} p-6 max-w-2xl`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)] mb-4">Application & Profile</p>
            {(() => {
              const statuses = ['Pending', 'Reviewing', 'Approved'];
              const current = statuses.indexOf(agent?.status);
              const rejected = agent?.status === 'Rejected';
              return (
                <div className={`mb-6 border p-4 ${dark ? 'border-zinc-700 bg-zinc-900' : 'border-sky-200 bg-sky-50'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div><p className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>Your agent application</p><p className="mt-1 text-lg font-black">{agent?.status || 'Pending'}</p></div>
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest ${rejected ? 'bg-red-600 text-white' : current === 2 ? 'bg-green-600 text-white' : 'bg-[var(--brand-blue)] text-black'}`}>{rejected ? 'Action required' : current === 2 ? 'Access active' : 'Under review'}</span>
                  </div>
                  {rejected ? <p className={`text-xs ${muted}`}>Your application was not approved. Please contact MTBOSS support for the next step.</p> : (
                    <div className="grid grid-cols-3 gap-2">{statuses.map((status, index) => <div key={status}><div className={`h-2 ${index <= current ? 'bg-[var(--brand-blue)]' : dark ? 'bg-zinc-700' : 'bg-zinc-300'}`} /><p className={`mt-1 text-[8px] font-black uppercase ${index <= current ? 'text-[var(--brand-blue)]' : muted}`}>{status}</p></div>)}</div>
                  )}
                  <p className={`mt-4 text-[10px] ${muted}`}>Applied on {agent?.created_at ? new Date(agent.created_at).toLocaleDateString('en-IN') : '—'} · City: {agent?.city || '—'}</p>
                </div>
              );
            })()}
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
              <input className={`w-full border px-3 py-2 text-sm outline-none mb-3 ${input}`} type="password" minLength={8} placeholder="New password (minimum 8 characters)" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))} required />
              <button className="px-6 py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest">Update Password</button>
            </form>
          </section>
        )}
        
        {activeTab === 'project-management' && agent?.has_project_management_access && (
          <section className="animate-fade-in">
            <PartyProjectManagement initialScreen="projects" isDarkMode={dark} isAgent={true} agent={agent} />
          </section>
        )}

        {convertingLead && conversionData && (
          <div
            onClick={() => { if (!isSubmittingConvertRef.current) setConvertingLead(null); }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <form
              onSubmit={submitConversion}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => { if (e.key === 'Enter' && isSubmittingConvertRef.current) e.preventDefault(); }}
              className={`w-full max-w-lg border ${card} p-6 max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black uppercase">Convert to Project</h3>
                <button
                  type="button"
                  disabled={isSubmittingConvert}
                  onClick={() => { if (!isSubmittingConvertRef.current) setConvertingLead(null); }}
                  className={`text-xl font-bold ${muted} ${isSubmittingConvert ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                >
                  ×
                </button>
              </div>

              {conversionData.loading ? (
                <div className={`p-8 text-center text-sm ${muted}`}>Checking for existing party...</div>
              ) : (
                <div className="space-y-4">
                  {conversionData.partyId ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded">
                      <strong>Existing party found:</strong> {conversionData.partyName}<br />
                      This project will be added under them.
                    </div>
                  ) : (
                    <div className={`border ${card} p-4 space-y-3`}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)]">New Party Details</p>
                      <div>
                        <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Client Name *</label>
                        <input className={`w-full border px-3 py-2 text-sm ${input}`} value={conversionData.newParty.name} onChange={(e) => setConversionData((p) => ({ ...p, newParty: { ...p.newParty, name: e.target.value } }))} required disabled={isSubmittingConvert} />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Phone *</label>
                        <input className={`w-full border px-3 py-2 text-sm ${input}`} value={conversionData.newParty.phone} onChange={(e) => setConversionData((p) => ({ ...p, newParty: { ...p.newParty, phone: e.target.value } }))} required disabled={isSubmittingConvert} />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Email</label>
                        <input className={`w-full border px-3 py-2 text-sm ${input}`} type="email" value={conversionData.newParty.email} onChange={(e) => setConversionData((p) => ({ ...p, newParty: { ...p.newParty, email: e.target.value } }))} disabled={isSubmittingConvert} />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>City</label>
                        <input className={`w-full border px-3 py-2 text-sm ${input}`} value={conversionData.newParty.address} onChange={(e) => setConversionData((p) => ({ ...p, newParty: { ...p.newParty, address: e.target.value } }))} disabled={isSubmittingConvert} />
                      </div>
                    </div>
                  )}

                  <div className={`border ${card} p-4 space-y-3`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-blue)]">Project Details</p>
                    <div>
                      <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Project Name *</label>
                      <input className={`w-full border px-3 py-2 text-sm ${input}`} value={conversionData.project.name} onChange={(e) => setConversionData((p) => ({ ...p, project: { ...p.project, name: e.target.value } }))} required disabled={isSubmittingConvert} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Start Date *</label>
                      <input className={`w-full border px-3 py-2 text-sm ${input}`} type="date" value={conversionData.project.start_date} onChange={(e) => setConversionData((p) => ({ ...p, project: { ...p.project, start_date: e.target.value } }))} required disabled={isSubmittingConvert} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Contract Value (₹) *</label>
                      <input className={`w-full border px-3 py-2 text-sm ${input}`} type="number" value={conversionData.project.contract_value} onChange={(e) => setConversionData((p) => ({ ...p, project: { ...p.project, contract_value: e.target.value } }))} required disabled={isSubmittingConvert} />
                    </div>
                    <div>
                      <label className={`block text-[10px] font-black uppercase mb-1 ${muted}`}>Site / City *</label>
                      <input className={`w-full border px-3 py-2 text-sm ${input}`} value={conversionData.project.site_address} onChange={(e) => setConversionData((p) => ({ ...p, project: { ...p.project, site_address: e.target.value } }))} required disabled={isSubmittingConvert} />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingConvert}
                      className="flex-1 py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmittingConvert ? 'Converting…' : 'Convert to Project'}
                    </button>
                    <button
                      type="button"
                      disabled={isSubmittingConvert}
                      onClick={() => { if (!isSubmittingConvertRef.current) setConvertingLead(null); }}
                      className={`flex-1 py-3 border ${card} ${muted} text-[10px] font-black uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </PanelLayout>
    );
  }
