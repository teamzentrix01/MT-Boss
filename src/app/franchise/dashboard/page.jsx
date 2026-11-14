'use client';

import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import RequiredAsterisk from '../../components/RequiredAsterisk';
import PanelLayout from '@/app/components/PanelLayout';
import {
  EMPTY_FRANCHISE_PERMISSIONS,
  normalizeFranchisePermissions,
} from '@/lib/franchise-permissions';
import {
  FolderKanban,
  Users,
  CalendarDays,
  Layers,
  ShoppingCart,
  Lock,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  ClipboardList,
  RefreshCw,
  ExternalLink,
  Eye,
  FileText,
  Building2,
  MapPin,
  CircleDollarSign,
  Phone,
  Mail,
  User,
} from '@/app/components/ui/icons';

const deferredPanelLoading = () => (
  <div className="p-8 text-center text-sm font-medium text-slate-500 dark:text-zinc-400">
    Loading workspace module...
  </div>
);

const FreeTimeSlotsManager = dynamic(
  () => import('@/app/components/FreeTimeSlotsManager'),
  { loading: deferredPanelLoading }
);
const FranchiseOperationsManager = dynamic(
  () => import('@/app/components/FranchiseOperationsManager'),
  { loading: deferredPanelLoading }
);
const FranchiseStaffManager = dynamic(
  () => import('@/app/components/FranchiseStaffManager'),
  { loading: deferredPanelLoading }
);
const MaterialOrdersPanel = dynamic(
  () => import('@/app/components/MaterialOrdersPanel'),
  { loading: deferredPanelLoading }
);

const CATEGORIES = [
  'Commercial',
  'Residential',
  'Hospitality',
  'Industrial',
  'IT Infrastructure',
  'Luxury Home',
];

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
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-[#0f0f11] text-slate-600 dark:text-zinc-400 font-medium">
          Loading Franchise Workspace...
        </div>
      }
    >
      <FranchiseDashboardContent />
    </Suspense>
  );
}

function FranchiseDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileRef = useRef(null);

  const [dark, setDark] = useState(false);
  const [franchise, setFranchise] = useState(null);
  const [permissions, setPermissions] = useState({ ...EMPTY_FRANCHISE_PERMISSIONS });
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Sync dark mode state with documentElement class
  useEffect(() => {
    const html = document.documentElement;
    const updateDarkMode = () => setDark(html.classList.contains('dark-mode'));
    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const token = useCallback(() => (typeof window !== 'undefined' ? localStorage.getItem('franchise-token') : ''), []);
  const can = useCallback((permission) => {
    if (permission === 'staff.view' || permission === 'staff.manage') {
      return permissions[permission] !== false;
    }
    return permissions[permission] === true;
  }, [permissions]);
  const canAny = useCallback((...keys) => keys.some((key) => can(key)), [can]);

  const canEditProject = canAny(
    'projects.edit',
    'projects.publish',
    'projects.manage_stage',
    'projects.manage_clients',
    'projects.manage_notes',
    'projects.manage_images',
    'financials.edit_deal',
    'agents.assign',
    'agents.assign_projects'
  );

  const hasOperationsPermission = canAny(
    'construction_services.view',
    'quick_services.view',
    'vendors.view',
    'agents.manage_directory'
  );

  // Tab navigation
  const [activeTab, setActiveTab] = useState(() => {
    const requestedTab = searchParams.get('tab');
    const validTabs = ['projects', 'leads', 'slots', 'staff', 'operations', 'orders', 'password'];
    return validTabs.includes(requestedTab) ? requestedTab : 'projects';
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/franchise/dashboard?tab=${tab}`, { scroll: false });
  };

  const handleLogout = () => {
    localStorage.removeItem('franchise-token');
    localStorage.removeItem('franchise');
    localStorage.removeItem('mtboss.activeRole');
    window.dispatchEvent(new Event('userLoggedIn'));
    router.push('/franchise/login');
  };

  const fetchProjects = useCallback(async (tok = token()) => {
    if (!tok) return;
    try {
      const res = await fetch('/api/franchise/projects', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      if (data.success) setProjects(data.data || []);
    } catch {
      // Ignore network errors in background
    }
  }, [token]);

  const fetchAgents = useCallback(async (tok = token()) => {
    if (!tok) return;
    try {
      const res = await fetch('/api/franchise/agents', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      if (data.success) setAgents(data.data || []);
    } catch {
      // Ignore
    }
  }, [token]);

  const fetchLeads = useCallback(async (tok = token()) => {
    if (!tok) return;
    try {
      const res = await fetch('/api/franchise/lead-management', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.data || []);
        if (data.agents?.length) setAgents(data.agents);
      }
    } catch {
      // Ignore
    }
  }, [token]);

  useEffect(() => {
    const tok = localStorage.getItem('franchise-token');
    if (!tok) {
      router.push('/franchise/login');
      return;
    }

    localStorage.setItem('mtboss.activeRole', 'franchise');
    if (localStorage.getItem('admin-token') || localStorage.getItem('admin')) {
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin');
    }
    window.dispatchEvent(new Event('userLoggedIn'));

    async function initialize() {
      try {
        const res = await fetch('/api/franchise/profile', {
          headers: { Authorization: `Bearer ${tok}` },
          cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          localStorage.removeItem('franchise-token');
          localStorage.removeItem('franchise');
          router.push('/franchise/login');
          return;
        }

        const franchiseData = { ...data.data, role: 'franchise' };
        const currentPermissions = normalizeFranchisePermissions(data.data.permissions);
        setFranchise(franchiseData);
        setPermissions(currentPermissions);
        localStorage.setItem('franchise', JSON.stringify(franchiseData));
        window.dispatchEvent(new Event('userLoggedIn'));

        const requests = [];
        if (currentPermissions['projects.view']) requests.push(fetchProjects(tok));
        if (currentPermissions['agents.view']) requests.push(fetchAgents(tok));
        if (currentPermissions['leads.view']) requests.push(fetchLeads(tok));
        await Promise.all(requests);
      } catch {
        setMessage({ type: 'error', text: 'Could not verify franchise access.' });
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [router, fetchProjects, fetchAgents, fetchLeads]);

  useEffect(() => {
    const refresh = async () => {
      const tok = localStorage.getItem('franchise-token');
      if (document.visibilityState !== 'visible' || !tok) return;

      try {
        const res = await fetch('/api/franchise/profile', {
          headers: { Authorization: `Bearer ${tok}` },
          cache: 'no-store',
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          localStorage.removeItem('franchise-token');
          localStorage.removeItem('franchise');
          router.push('/franchise/login');
          return;
        }

        const currentPermissions = normalizeFranchisePermissions(data.data.permissions);
        setFranchise(data.data);
        setPermissions(currentPermissions);
        localStorage.setItem('franchise', JSON.stringify(data.data));

        const refreshTasks = [];
        if (currentPermissions['projects.view']) refreshTasks.push(fetchProjects(tok));
        else setProjects([]);
        if (currentPermissions['agents.view']) refreshTasks.push(fetchAgents(tok));
        else setAgents([]);
        if (currentPermissions['leads.view']) refreshTasks.push(fetchLeads(tok));
        else setLeads([]);
        await Promise.all(refreshTasks);
      } catch {
        // Keep screen intact on intermittent offline
      }
    };

    const timer = setInterval(refresh, 20000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [router, fetchProjects, fetchAgents, fetchLeads]);

  const updateLead = async (id, patch) => {
    try {
      const res = await fetch('/api/franchise/lead-management', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, ...data.data } : lead)));
      } else {
        setMessage({ type: 'error', text: data.error || 'Could not update lead.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error updating lead.' });
    }
  };

  const stats = useMemo(() => ({
    total: projects.length,
    published: projects.filter((p) => p.status === 'published').length,
    draft: projects.filter((p) => p.status === 'draft').length,
    leads: leads.length,
  }), [projects, leads]);

  const openAdd = () => {
    setEditProject(null);
    setForm({
      ...emptyForm,
      location: franchise?.city || '',
      status: can('projects.publish') ? 'published' : 'draft',
    });
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
      body.append('folder', 'MTBOSS/franchise-projects');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (!data.secure_url) throw new Error('Upload failed');

      setForm((f) => ({ ...f, image_url: data.secure_url, cloudinary_public_id: data.public_id || '' }));
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
      setMessage({ type: 'success', text: editProject ? 'Project updated successfully.' : 'Project created successfully.' });
    } catch {
      setMessage({ type: 'error', text: 'Could not save project.' });
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (project) => {
    if (!confirm(`Delete project "${project.title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch('/api/franchise/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ id: project.id }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
        setMessage({ type: 'success', text: 'Project deleted.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Could not delete project.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete project.' });
    }
  };

  const changePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    setChangingPassword(true);
    setPasswordMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/franchise/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (!data.success) {
        setPasswordMsg({ type: 'error', text: data.error || 'Could not change password.' });
        return;
      }

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully. Use your new password on next sign-in.' });
    } catch {
      setPasswordMsg({ type: 'error', text: 'Could not change password. Please try again.' });
    } finally {
      setChangingPassword(false);
    }
  };

  // Styling helper classes matching PanelLayout / Admin theme
  const card = dark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900';
  const cardSubtle = dark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-slate-50 border-slate-200/80';
  const border = dark ? 'border-zinc-800' : 'border-slate-200';
  const muted = dark ? 'text-zinc-400' : 'text-slate-500';
  const input = dark
    ? 'bg-zinc-800/90 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-[#0f0f11] text-slate-600 dark:text-zinc-400 font-medium">
        Loading Franchise Workspace...
      </div>
    );
  }

  const menuItems = [
    {
      key: 'projects',
      label: 'Projects',
      icon: FolderKanban,
      badge: projects.length > 0 ? projects.length : null,
      hidden: !can('projects.view'),
    },
    {
      key: 'leads',
      label: 'Assigned Leads',
      icon: ClipboardList,
      badge: leads.length > 0 ? leads.length : null,
      hidden: !can('leads.view'),
    },
    {
      key: 'slots',
      label: 'Quick-Service Slots',
      icon: CalendarDays,
      hidden: !can('slots.view'),
    },
    {
      key: 'staff',
      label: 'Staff Records',
      icon: Users,
      hidden: !can('staff.view'),
    },
    {
      key: 'operations',
      label: 'Operations & Services',
      icon: Layers,
      hidden: !hasOperationsPermission,
    },
    {
      key: 'orders',
      label: 'Material Orders',
      icon: ShoppingCart,
    },
    {
      key: 'password',
      label: 'Change Password',
      icon: Lock,
      hidden: !can('profile.change_password'),
    },
  ];

  return (
    <PanelLayout
      title="Franchise Workspace"
      subtitle={`${franchise?.name || 'Franchise Partner'} · ${franchise?.city ? franchise.city + ', ' : ''}${franchise?.state || ''}`}
      user={{
        name: franchise?.name || 'Franchise Partner',
        email: franchise?.email || '',
        city: franchise?.city || '',
        role: 'Franchise Partner',
      }}
      roleBadge="Franchise"
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onLogout={handleLogout}
      actions={
        activeTab === 'projects' ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                setRefreshing(true);
                await fetchProjects();
                setRefreshing(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-zinc-300 cursor-pointer"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            {can('projects.create') && (
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--brand-blue)] text-black hover:opacity-90 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Project</span>
              </button>
            )}
          </div>
        ) : activeTab === 'leads' ? (
          <button
            type="button"
            onClick={async () => {
              setRefreshing(true);
              await fetchLeads();
              setRefreshing(false);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-zinc-300 cursor-pointer"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh Leads</span>
          </button>
        ) : activeTab === 'orders' ? (
          <button
            type="button"
            onClick={() => router.push('/material-orders?role=franchise')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-zinc-300 cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>Full Screen</span>
          </button>
        ) : null
      }
    >
      <div className="space-y-6">
        {/* Flash Message */}
        {message.text && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
              message.type === 'error'
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            }`}
          >
            <span>{message.text}</span>
            <button
              type="button"
              onClick={() => setMessage({ type: '', text: '' })}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* ── PROJECTS TAB ── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            {can('dashboard.view_statistics') && (
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className={`border ${card} p-4 md:p-5 rounded-xl flex items-center justify-between shadow-xs`}>
                  <div>
                    <p className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider ${muted}`}>
                      Total Projects
                    </p>
                    <p className="text-2xl md:text-3xl font-black mt-1">{stats.total}</p>
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <FolderKanban size={22} />
                  </div>
                </div>

                <div className={`border ${card} p-4 md:p-5 rounded-xl flex items-center justify-between shadow-xs`}>
                  <div>
                    <p className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400`}>
                      Published
                    </p>
                    <p className="text-2xl md:text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400">{stats.published}</p>
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={22} />
                  </div>
                </div>

                <div className={`border ${card} p-4 md:p-5 rounded-xl flex items-center justify-between shadow-xs`}>
                  <div>
                    <p className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400`}>
                      Draft
                    </p>
                    <p className="text-2xl md:text-3xl font-black mt-1 text-amber-600 dark:text-amber-400">{stats.draft}</p>
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <FileText size={22} />
                  </div>
                </div>

                <div className={`border ${card} p-4 md:p-5 rounded-xl flex items-center justify-between shadow-xs`}>
                  <div>
                    <p className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400`}>
                      Assigned Leads
                    </p>
                    <p className="text-2xl md:text-3xl font-black mt-1 text-indigo-600 dark:text-indigo-400">{stats.leads}</p>
                  </div>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Users size={22} />
                  </div>
                </div>
              </section>
            )}

            {/* Projects Grid */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Territory Projects</h2>
                  <p className={`text-xs ${muted}`}>
                    Manage showcase projects, client orders, and agent assignments for your franchise territory.
                  </p>
                </div>
              </div>

              {projects.length === 0 ? (
                <div className={`border ${card} rounded-2xl p-12 text-center`}>
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                    <FolderKanban size={28} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">No projects added yet</h3>
                  <p className={`text-xs ${muted} mt-1 max-w-sm mx-auto`}>
                    Add your first showcase or client project to begin tracking progress and assigned agents.
                  </p>
                  {can('projects.create') && (
                    <button
                      type="button"
                      onClick={openAdd}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--brand-blue)] text-black text-xs font-bold rounded-lg shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Plus size={15} />
                      <span>Add First Project</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className={`border ${card} rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                        {project.image_url ? (
                          <Image
                            src={project.image_url}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-zinc-600">
                            <FolderKanban size={32} />
                          </div>
                        )}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                              project.status === 'published'
                                ? 'bg-emerald-500/90 text-white'
                                : 'bg-amber-500/90 text-white'
                            }`}
                          >
                            {project.status}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                            {project.project_status || 'lead'}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 line-clamp-1">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-zinc-400">
                            <span className="font-semibold text-sky-600 dark:text-sky-400">{project.category}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} />
                              {project.location || franchise?.city}
                            </span>
                          </div>

                          {project.description && (
                            <p className={`text-xs ${muted} mt-2 line-clamp-2`}>
                              {project.description}
                            </p>
                          )}

                          {/* Client & Agent details */}
                          <div className="mt-3 space-y-1.5 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
                            {canAny('projects.view_client_details', 'projects.manage_clients') && (project.client_name || project.client_phone) && (
                              <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                                <User size={13} className="text-slate-400" />
                                <span className="font-medium">{project.client_name || 'Client'}</span>
                                {project.client_phone && (
                                  <span className={muted}>({project.client_phone})</span>
                                )}
                              </div>
                            )}

                            {canAny('projects.view_assigned_agent', 'agents.assign', 'agents.assign_projects') && project.assigned_agent_name && (
                              <div className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                                <Building2 size={13} className="text-slate-400" />
                                <span className={muted}>Agent:</span>
                                <span className="font-semibold text-slate-900 dark:text-zinc-100">
                                  {project.assigned_agent_name}
                                </span>
                              </div>
                            )}

                            {canAny('projects.view_notes', 'projects.manage_notes') && project.project_notes && (
                              <div className={`text-[11px] ${muted} line-clamp-1`}>
                                <em>Notes: {project.project_notes}</em>
                              </div>
                            )}
                          </div>

                          {/* Financials Breakdown */}
                          {canAny(
                            'financials.view',
                            'financials.view_deal',
                            'financials.view_payments',
                            'financials.view_costs',
                            'financials.view_commission',
                            'financials.view_profit_loss'
                          ) && (
                            <div className={`mt-3 p-2.5 rounded-xl border ${cardSubtle} grid grid-cols-2 gap-2 text-[11px]`}>
                              {canAny('financials.view', 'financials.view_deal') && (
                                <div>
                                  <span className={muted}>Deal Amount</span>
                                  <p className="font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
                                    ₹{Number(project.deal_amount || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>
                              )}
                              {canAny('financials.view', 'financials.view_payments') && (
                                <div>
                                  <span className={muted}>Received</span>
                                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                    ₹{Number(project.total_received || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>
                              )}
                              {canAny('financials.view', 'financials.view_commission') && (
                                <div>
                                  <span className={muted}>Agent (2%)</span>
                                  <p className="font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                                    ₹{Number(project.agent_commission || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>
                              )}
                              {canAny('financials.view', 'financials.view_profit_loss') && (
                                <div>
                                  <span className={muted}>Profit / Loss</span>
                                  <p
                                    className={`font-bold mt-0.5 ${
                                      Number(project.profit_loss || 0) >= 0
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-red-500'
                                    }`}
                                  >
                                    ₹{Number(project.profit_loss || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {(canEditProject || can('projects.delete')) && (
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800">
                            {canEditProject && (
                              <button
                                type="button"
                                onClick={() => openEdit(project)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-zinc-200 cursor-pointer"
                              >
                                <Pencil size={13} />
                                <span>Edit</span>
                              </button>
                            )}
                            {can('projects.delete') && (
                              <button
                                type="button"
                                onClick={() => deleteProject(project)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-red-200 dark:border-red-900/40 text-xs font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-red-600 dark:text-red-400 cursor-pointer"
                                title="Delete project"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ASSIGNED LEADS TAB ── */}
        {activeTab === 'leads' && can('leads.view') && (
          <div className="space-y-4">
            <div className={`border ${card} rounded-2xl overflow-hidden shadow-xs`}>
              <div className="p-4 md:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Assigned Leads</h2>
                  <p className={`text-xs ${muted}`}>
                    Leads assigned by admin to your franchise. Assign an approved agent and monitor progress.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setRefreshing(true);
                    await fetchLeads();
                    setRefreshing(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                  <span>Refresh Leads</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-zinc-950/60 text-slate-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-zinc-800">
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Source</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4">Assigned Agent</th>
                      <th className="py-3 px-4">Follow Up</th>
                      <th className="py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                          No leads assigned to this franchise territory yet.
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 px-4 align-top">
                            <span className="font-bold text-slate-900 dark:text-zinc-100 block">{lead.client_name}</span>
                            {can('leads.view_contact_details') && (
                              <div className={`mt-0.5 space-y-0.5 ${muted} text-[11px]`}>
                                {lead.client_phone && <div>{lead.client_phone}</div>}
                                {lead.client_email && <div className="truncate max-w-[160px]">{lead.client_email}</div>}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 align-top">
                            <span className="font-semibold text-slate-800 dark:text-zinc-200 block">
                              {can('leads.view_service_details') ? lead.service_type || '—' : 'Restricted'}
                            </span>
                            {can('leads.view_service_details') && lead.city && (
                              <span className={`text-[11px] ${muted}`}>{lead.city}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 align-top">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                              {can('leads.view_source') ? lead.lead_source || 'direct' : 'Restricted'}
                            </span>
                          </td>
                          <td className="py-3 px-4 align-top">
                            <select
                              disabled={!canAny('leads.manage', 'leads.update_status')}
                              className={`border rounded-lg px-2 py-1 text-xs font-semibold ${input} disabled:opacity-60`}
                              value={lead.status || 'New'}
                              onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                            >
                              {leadStatuses
                                .filter((s) => s !== 'Converted' || lead.status === s || canAny('leads.manage', 'leads.convert'))
                                .map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                          </td>
                          <td className="py-3 px-4 align-top">
                            <select
                              disabled={!canAny('leads.manage', 'leads.update_stage')}
                              className={`border rounded-lg px-2 py-1 text-xs font-semibold ${input} disabled:opacity-60`}
                              value={lead.lead_stage || 'New'}
                              onChange={(e) => updateLead(lead.id, { lead_stage: e.target.value })}
                            >
                              {leadStages
                                .filter((s) => s !== 'Final' || lead.lead_stage === s || canAny('leads.manage', 'leads.convert'))
                                .map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                          </td>
                          <td className="py-3 px-4 align-top min-w-[160px]">
                            <select
                              disabled={!canAny('agents.assign', 'agents.assign_leads')}
                              className={`border rounded-lg px-2 py-1 text-xs font-medium w-full ${input} disabled:opacity-60`}
                              value={lead.agent_id || ''}
                              onChange={(e) => updateLead(lead.id, { agent_id: e.target.value ? Number(e.target.value) : null })}
                            >
                              <option value="">Not assigned</option>
                              {lead.agent_id && lead.agent_name && !agents.some((a) => String(a.id) === String(lead.agent_id)) && (
                                <option value={lead.agent_id}>{lead.agent_name}</option>
                              )}
                              {agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                  {agent.name} {agent.city ? `(${agent.city})` : ''}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4 align-top">
                            <input
                              type="date"
                              disabled={!canAny('leads.manage', 'leads.update_follow_up')}
                              className={`border rounded-lg px-2 py-1 text-xs ${input} disabled:opacity-60`}
                              value={lead.follow_up_date ? String(lead.follow_up_date).slice(0, 10) : ''}
                              onChange={(e) => updateLead(lead.id, { follow_up_date: e.target.value })}
                            />
                          </td>
                          <td className="py-3 px-4 align-top min-w-[180px]">
                            {canAny('leads.view_notes', 'leads.edit_notes', 'leads.manage') ? (
                              <input
                                disabled={!canAny('leads.manage', 'leads.edit_notes')}
                                className={`border rounded-lg px-2 py-1 text-xs w-full ${input} disabled:opacity-60`}
                                placeholder="Add follow-up notes..."
                                value={lead.notes || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setLeads((prev) => prev.map((item) => (item.id === lead.id ? { ...item, notes: val } : item)));
                                }}
                                onBlur={(e) => updateLead(lead.id, { notes: e.target.value })}
                              />
                            ) : (
                              <span className={muted}>Restricted</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── QUICK-SERVICE SLOTS TAB ── */}
        {activeTab === 'slots' && can('slots.view') && (
          <div className="space-y-4">
            <div className={`border ${card} rounded-2xl p-5 shadow-xs`}>
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick-Service Slots</h2>
                <p className={`text-xs ${muted}`}>
                  Open or close free and paid quick-service slots for your franchise territory ({franchise?.city || 'All'}).
                </p>
              </div>
              <FreeTimeSlotsManager
                tokenKey="franchise-token"
                defaultCity={franchise?.city || ''}
                compact
                permissions={permissions}
              />
            </div>
          </div>
        )}

        {/* ── STAFF RECORDS TAB ── */}
        {activeTab === 'staff' && can('staff.view') && (
          <div className="space-y-4">
            <FranchiseStaffManager permissions={permissions} />
          </div>
        )}

        {/* ── OPERATIONS & SERVICES TAB ── */}
        {activeTab === 'operations' && hasOperationsPermission && (
          <div className="space-y-4">
            <FranchiseOperationsManager permissions={permissions} />
          </div>
        )}

        {/* ── MATERIAL ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className={`border ${card} rounded-2xl p-5 shadow-xs`}>
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Material Orders</h2>
                  <p className={`text-xs ${muted}`}>
                    Track material requests, check live dispatch statuses, and monitor order fulfillment.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/material-orders?role=franchise')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-zinc-200 cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Open Dedicated Page</span>
                </button>
              </div>
              <MaterialOrdersPanel role="franchise" embedded />
            </div>
          </div>
        )}

        {/* ── CHANGE PASSWORD TAB ── */}
        {activeTab === 'password' && can('profile.change_password') && (
          <div className="max-w-xl mx-auto">
            <div className={`border ${card} rounded-2xl p-6 shadow-xs`}>
              <div className="mb-5 pb-4 border-b border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h2>
                    <p className={`text-xs ${muted}`}>
                      Update your franchise login password. This password stays active for all future logins.
                    </p>
                  </div>
                </div>
              </div>

              {passwordMsg.text && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-semibold mb-5 ${
                    passwordMsg.type === 'error'
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {passwordMsg.text}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  changePassword();
                }}
                className="space-y-4"
              >
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 text-slate-700 dark:text-zinc-300`}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors ${input}`}
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 text-slate-700 dark:text-zinc-300`}>
                    New Password (min 8 characters)
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors ${input}`}
                    placeholder="Enter new strong password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1.5 text-slate-700 dark:text-zinc-300`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors ${input}`}
                    placeholder="Re-enter new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[var(--brand-blue)] text-black font-bold text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
                  >
                    {changingPassword ? 'Saving Password...' : 'Save New Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ── ADD / EDIT PROJECT MODAL ── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6"
          onClick={() => setShowForm(false)}
        >
          <div
            className={`w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border ${card} overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {editProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {message.text && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold ${
                    message.type === 'error'
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Image Preview & Upload */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                  Project Cover Image <RequiredAsterisk />
                </label>
                {form.image_url && (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 mb-2">
                    <Image
                      src={form.image_url}
                      alt="Project preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  disabled={uploading || (Boolean(editProject) && !can('projects.manage_images'))}
                  className={`w-full border rounded-xl p-2 text-xs ${input} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 dark:file:bg-sky-950/40 dark:file:text-sky-300 cursor-pointer`}
                />
                {uploading && <p className={`mt-1 text-[11px] text-sky-600`}>Uploading image to cloud...</p>}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                  Project Title <RequiredAsterisk />
                </label>
                <input
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                  placeholder="e.g. Modern Villa Interior & Construction"
                  disabled={Boolean(editProject) && !can('projects.edit')}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>

              {/* Client Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">Client Name</label>
                  <input
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                    placeholder="Client full name"
                    disabled={!can('projects.manage_clients')}
                    value={form.client_name}
                    onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">Client Phone</label>
                  <input
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                    placeholder="10-digit mobile number"
                    disabled={!can('projects.manage_clients')}
                    value={form.client_phone}
                    onChange={(e) => setForm((f) => ({ ...f, client_phone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Client Email & Deal Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">Client Email</label>
                  <input
                    type="email"
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                    placeholder="client@email.com"
                    disabled={!can('projects.manage_clients')}
                    value={form.client_email}
                    onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))}
                  />
                </div>
                {canAny('financials.view', 'financials.view_deal', 'financials.edit_deal') && (
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">Deal Amount (₹)</label>
                    <input
                      type="number"
                      className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                      placeholder="e.g. 500000"
                      disabled={!can('financials.edit_deal')}
                      value={form.deal_amount}
                      onChange={(e) => setForm((f) => ({ ...f, deal_amount: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Category <RequiredAsterisk />
                  </label>
                  <select
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                    disabled={Boolean(editProject) && !can('projects.edit')}
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">Location</label>
                  <input
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none bg-slate-50 dark:bg-zinc-800/50 ${input}`}
                    value={franchise?.city || form.location}
                    readOnly
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">Description</label>
                <textarea
                  rows={3}
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none resize-none ${input}`}
                  placeholder="Project overview, client requirements, or special details"
                  disabled={Boolean(editProject) && !can('projects.edit')}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              {/* Agent assignment & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {canAny('agents.assign', 'agents.assign_projects') && (
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                      Assign Approved Agent
                    </label>
                    <select
                      className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                      value={form.assigned_agent_id}
                      onChange={(e) => setForm((f) => ({ ...f, assigned_agent_id: e.target.value }))}
                    >
                      <option value="">No agent assigned</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} {agent.city ? `(${agent.city})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">Publish Status</label>
                  <select
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                    disabled={!can('projects.publish')}
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Gallery Size & Project Stage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">Gallery Size</label>
                  <select
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                    disabled={Boolean(editProject) && !can('projects.edit')}
                    value={form.size}
                    onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                  >
                    {SIZES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">Project Stage</label>
                  <select
                    className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                    disabled={!can('projects.manage_stage')}
                    value={form.project_status}
                    onChange={(e) => setForm((f) => ({ ...f, project_status: e.target.value }))}
                  >
                    {[
                      'lead',
                      'estimate_sent',
                      'final',
                      'started',
                      'ongoing',
                      'running',
                      'on_hold',
                      'completed',
                      'cancelled',
                      'lost',
                    ].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-zinc-300">Internal Notes</label>
                <input
                  className={`w-full border rounded-xl px-3 py-2 text-xs outline-none ${input}`}
                  placeholder="Private notes visible only to franchise & admin"
                  disabled={!can('projects.manage_notes')}
                  value={form.project_notes}
                  onChange={(e) => setForm((f) => ({ ...f, project_notes: e.target.value }))}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-zinc-700 text-xs font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || uploading}
                onClick={saveProject}
                className="px-5 py-2 bg-[var(--brand-blue)] text-black text-xs font-bold rounded-xl shadow-xs hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
              >
                {saving ? 'Saving...' : editProject ? 'Update Project' : 'Save Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
