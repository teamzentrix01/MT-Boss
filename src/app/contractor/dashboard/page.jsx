'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PanelLayout from '@/app/components/PanelLayout';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  HardHat,
  CircleDollarSign,
  User,
  Plus,
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  CalendarDays,
  Phone,
  MapPin,
  RefreshCw,
} from '@/app/components/ui/icons';

const CONTRACTOR_TABS = ['overview', 'projects', 'work-orders', 'labour', 'payouts', 'profile'];

export default function ContractorDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-medium text-slate-500">Loading Contractor Portal...</div>}>
      <ContractorDashboardContent />
    </Suspense>
  );
}

function ContractorDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab');
    return CONTRACTOR_TABS.includes(tab) ? tab : 'overview';
  });

  // Data states
  const [stats, setStats] = useState({
    total_projects: 0,
    active_projects: 0,
    total_work_orders: 0,
    completed_work_orders: 0,
    total_contract_value: 0,
    total_paid_amount: 0,
    pending_balance: 0,
    total_labor_entries: 0,
    today_workers_count: 0,
  });
  const [projects, setProjects] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [labourEntries, setLabourEntries] = useState([]);

  // Detail view selections (In-page, no popups!)
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  // Forms
  const [showAddWorkOrder, setShowAddWorkOrder] = useState(false);
  const [newWorkOrder, setNewWorkOrder] = useState({
    project_id: '',
    work_description: '',
    contract_amount: '',
    paid_amount: '',
    payment_mode: 'Bank Transfer',
    invoice_number: '',
    notes: '',
  });
  const [savingWorkOrder, setSavingWorkOrder] = useState(false);

  const [showAddLabour, setShowAddLabour] = useState(false);
  const [newLabour, setNewLabour] = useState({
    project_id: '',
    labour_name: '',
    labour_role: 'Mason (Mistri)',
    work_date: new Date().toISOString().slice(0, 10),
    attendance_status: 'Present',
    wage_amount: '600',
    paid_amount: '600',
    notes: '',
  });
  const [savingLabour, setSavingLabour] = useState(false);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    vendor_name: '',
    shop_name: '',
    phone: '',
    city: '',
    state: '',
    business_type: '',
    description: '',
    gst_number: '',
    pan_number: '',
    bank_account_holder: '',
    bank_account_number: '',
    bank_name: '',
    bank_ifsc_code: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Filters
  const [projectSearch, setProjectSearch] = useState('');
  const [labourDateFilter, setLabourDateFilter] = useState('');

  // 1. Check Auth & Load Contractor
  useEffect(() => {
    const rawContractor = localStorage.getItem('contractor');
    const token = localStorage.getItem('contractor-token');
    if (!rawContractor || !token) {
      router.replace('/contractor/login');
      return;
    }
    try {
      const parsed = JSON.parse(rawContractor);
      setContractor(parsed);
      setProfileForm({
        vendor_name: parsed.vendor_name || parsed.name || '',
        shop_name: parsed.shop_name || parsed.business_name || '',
        phone: parsed.phone || '',
        city: parsed.city || '',
        state: parsed.state || '',
        business_type: parsed.business_type || 'Civil Contractor',
        description: parsed.description || '',
        gst_number: parsed.gst_number || '',
        pan_number: parsed.pan_number || '',
        bank_account_holder: parsed.bank_account_holder || '',
        bank_account_number: parsed.bank_account_number || '',
        bank_name: parsed.bank_name || '',
        bank_ifsc_code: parsed.bank_ifsc_code || '',
      });
    } catch {
      router.replace('/contractor/login');
    }
  }, [router]);

  // 2. Fetch Dashboard Data
  const fetchDashboardData = async () => {
    const token = localStorage.getItem('contractor-token');
    const rawContractor = localStorage.getItem('contractor');
    let email = '';
    let phone = '';
    let id = '';
    if (rawContractor) {
      try {
        const parsed = JSON.parse(rawContractor);
        email = parsed.email || '';
        phone = parsed.phone || '';
        id = parsed.id || '';
      } catch {}
    }

    try {
      const res = await fetch(`/api/contractor/dashboard?id=${id}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        if (data.stats) setStats(data.stats);
        if (Array.isArray(data.projects)) setProjects(data.projects);
        if (Array.isArray(data.workOrders)) setWorkOrders(data.workOrders);
        if (Array.isArray(data.labourEntries)) setLabourEntries(data.labourEntries);
        if (data.contractor) {
          setContractor(prev => ({ ...prev, ...data.contractor }));
          setProfileForm(prev => ({
            ...prev,
            vendor_name: data.contractor.vendor_name || data.contractor.name || prev.vendor_name,
            shop_name: data.contractor.shop_name || prev.shop_name,
            phone: data.contractor.phone || prev.phone,
            city: data.contractor.city || prev.city,
            state: data.contractor.state || prev.state,
            business_type: data.contractor.business_type || prev.business_type,
            description: data.contractor.description || prev.description,
            gst_number: data.contractor.gst_number || prev.gst_number,
            pan_number: data.contractor.pan_number || prev.pan_number,
            bank_account_holder: data.contractor.bank_account_holder || prev.bank_account_holder,
            bank_account_number: data.contractor.bank_account_number || prev.bank_account_number,
            bank_name: data.contractor.bank_name || prev.bank_name,
            bank_ifsc_code: data.contractor.bank_ifsc_code || prev.bank_ifsc_code,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load contractor data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (contractor) {
      fetchDashboardData();
    }
  }, [contractor?.id, contractor?.email]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('contractor-token');
    localStorage.removeItem('contractor');
    router.replace('/contractor/login');
  };

  // Submit new Work Order
  const handleCreateWorkOrder = async (e) => {
    e.preventDefault();
    setSavingWorkOrder(true);
    const token = localStorage.getItem('contractor-token');

    try {
      const res = await fetch('/api/contractor/work-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...newWorkOrder,
          contractor_name: contractor?.vendor_name || contractor?.name || 'Contractor',
          company_name: contractor?.shop_name || contractor?.business_name,
          contractor_phone: contractor?.phone || '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddWorkOrder(false);
        setNewWorkOrder({
          project_id: '',
          work_description: '',
          contract_amount: '',
          paid_amount: '',
          payment_mode: 'Bank Transfer',
          invoice_number: '',
          notes: '',
        });
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to log work order');
      }
    } catch {
      alert('Network error logging work order');
    } finally {
      setSavingWorkOrder(false);
    }
  };

  // Submit new Labour Attendance Entry
  const handleCreateLabour = async (e) => {
    e.preventDefault();
    setSavingLabour(true);

    try {
      const res = await fetch('/api/contractor/labour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLabour),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddLabour(false);
        setNewLabour({
          project_id: '',
          labour_name: '',
          labour_role: 'Mason (Mistri)',
          work_date: new Date().toISOString().slice(0, 10),
          attendance_status: 'Present',
          wage_amount: '600',
          paid_amount: '600',
          notes: '',
        });
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to record attendance');
      }
    } catch {
      alert('Network error logging attendance');
    } finally {
      setSavingLabour(false);
    }
  };

  // Save Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    const token = localStorage.getItem('contractor-token');

    try {
      const res = await fetch('/api/contractor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...profileForm,
          id: contractor?.id,
          email: contractor?.email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfileMsg({ type: 'success', text: 'Profile & company details updated successfully!' });
        localStorage.setItem('contractor', JSON.stringify({ ...contractor, ...profileForm }));
      } else {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Network error updating profile' });
    } finally {
      setSavingProfile(false);
    }
  };

  const menuItems = [
    { key: 'overview', tab: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'projects', tab: 'projects', label: 'Site Projects', icon: Building2 },
    { key: 'work-orders', tab: 'work-orders', label: 'Work Orders', icon: ClipboardList },
    { key: 'labour', tab: 'labour', label: 'Labor & Attendance', icon: HardHat },
    { key: 'payouts', tab: 'payouts', label: 'Earnings & Payouts', icon: CircleDollarSign },
    { key: 'profile', tab: 'profile', label: 'Company Profile', icon: User },
  ];

  const filteredProjects = projects.filter(p =>
    (p.title || '').toLowerCase().includes(projectSearch.toLowerCase()) ||
    (p.location || '').toLowerCase().includes(projectSearch.toLowerCase()) ||
    (p.client_name || '').toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredLabour = labourEntries.filter(l =>
    !labourDateFilter || String(l.work_date).slice(0, 10) === labourDateFilter
  );

  return (
    <PanelLayout
      title="Contractor Portal"
      subtitle={`${contractor?.vendor_name || contractor?.shop_name || 'Contractor'} · ${contractor?.city || 'HQ'}`}
      roleBadge="🏗️ Contractor"
      user={{
        name: contractor?.vendor_name || contractor?.shop_name || 'Contractor',
        email: contractor?.email || '',
        avatar: '',
      }}
      menuItems={menuItems}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        setSelectedProject(null);
        setSelectedWorkOrder(null);
      }}
      onLogout={handleLogout}
      actions={
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      }
    >
      <div className="space-y-6">

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: OVERVIEW */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Active Sites</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">{stats.active_projects}</div>
                <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Total {stats.total_projects} Projects</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Work Orders</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">{stats.total_work_orders}</div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">{stats.completed_work_orders} Completed</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Total Contract</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
                  ₹{Number(stats.total_contract_value).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Assigned value</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Received Payouts</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">
                  ₹{Number(stats.total_paid_amount).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Paid to date</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Pending Balance</div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1.5">
                  ₹{Number(stats.pending_balance).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Receivable</div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Workers On Site</div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1.5">{stats.today_workers_count}</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">Active labor</div>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <button
                onClick={() => { setActiveTab('labour'); setShowAddLabour(true); }}
                className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 text-left hover:border-blue-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                    <span>👷</span>
                    <span>Log Worker Attendance</span>
                  </div>
                  <div className="text-xs text-blue-800/80 dark:text-blue-300 mt-1">
                    Record daily masons, helpers & wage payouts.
                  </div>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">+</span>
              </button>

              <button
                onClick={() => { setActiveTab('work-orders'); setShowAddWorkOrder(true); }}
                className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-left hover:border-emerald-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
                    <span>📋</span>
                    <span>Add Work Order / Milestone</span>
                  </div>
                  <div className="text-xs text-emerald-800/80 dark:text-emerald-300 mt-1">
                    Create milestone work entries with invoice bills.
                  </div>
                </div>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 text-left hover:border-purple-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                    <span>🏗️</span>
                    <span>Assigned Site Projects</span>
                  </div>
                  <div className="text-xs text-purple-800/80 dark:text-purple-300 mt-1">
                    View active construction locations & client details.
                  </div>
                </div>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">→</span>
              </button>
            </div>

            {/* Recent Work Orders & Sites Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Work Orders */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>📋</span> Recent Work Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('work-orders')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All ({workOrders.length}) →
                  </button>
                </div>

                {workOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-zinc-400 text-xs">
                    No work orders logged yet. Click &quot;Add Work Order&quot; to log your first milestone.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workOrders.slice(0, 5).map(wo => (
                      <div
                        key={wo.id}
                        onClick={() => { setSelectedWorkOrder(wo); setActiveTab('work-orders'); }}
                        className="p-3.5 rounded-lg border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40 hover:border-slate-300 dark:hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {wo.work_description || 'General Civil Work'}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                            {wo.project_title} · Inv: {wo.invoice_number || 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            ₹{Number(wo.contract_amount || 0).toLocaleString('en-IN')}
                          </div>
                          <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                            Number(wo.paid_amount) >= Number(wo.contract_amount) && Number(wo.contract_amount) > 0
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {Number(wo.paid_amount) >= Number(wo.contract_amount) && Number(wo.contract_amount) > 0 ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Site Projects */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🏗️</span> Active Site Projects
                  </h3>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All ({projects.length}) →
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-zinc-400 text-xs">
                    No active sites found. New assigned sites from MT-BOSS will appear here.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.slice(0, 5).map(p => (
                      <div
                        key={p.id}
                        onClick={() => { setSelectedProject(p); setActiveTab('projects'); }}
                        className="p-3.5 rounded-lg border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/40 hover:border-slate-300 dark:hover:border-zinc-700 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {p.title || `Project #${p.id}`}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{p.location || 'Location specified on site'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                            {p.project_status || 'In Progress'}
                          </span>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                            {p.client_name ? `Client: ${p.client_name}` : 'Residential'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: PROJECTS & SITES */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'projects' && (
          <div className="space-y-5">
            {selectedProject ? (
              /* IN-PAGE FULL PROJECT DETAIL VIEW */
              <div className="p-6 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Projects List</span>
                  </button>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {selectedProject.project_status || 'In Progress'}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedProject.title || `Project #${selectedProject.id}`}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedProject.location || 'Location Not Specified'}
                    </span>
                    <span>Category: {selectedProject.category || 'Construction'}</span>
                    {selectedProject.deal_amount && (
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Deal Value: ₹{Number(selectedProject.deal_amount).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Client & Contact</h4>
                    <div className="text-xs text-slate-700 dark:text-zinc-300"><strong>Client:</strong> {selectedProject.client_name || 'MT-BOSS Partner'}</div>
                    <div className="text-xs text-slate-700 dark:text-zinc-300"><strong>Phone:</strong> {selectedProject.client_phone || 'Available via site manager'}</div>
                    <div className="text-xs text-slate-700 dark:text-zinc-300"><strong>Start Date:</strong> {selectedProject.started_at ? new Date(selectedProject.started_at).toLocaleDateString('en-IN') : 'Scheduled'}</div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Site Execution Details</h4>
                    <div className="text-xs text-slate-700 dark:text-zinc-300"><strong>Assigned Role:</strong> Contractor Execution Partner</div>
                    <div className="text-xs text-slate-700 dark:text-zinc-300"><strong>Description:</strong> {selectedProject.description || 'Turnkey civil and structural site execution under MT-BOSS management.'}</div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      setNewWorkOrder(prev => ({ ...prev, project_id: selectedProject.id }));
                      setSelectedProject(null);
                      setActiveTab('work-orders');
                      setShowAddWorkOrder(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    + Log Work Order for this Site
                  </button>
                  <button
                    onClick={() => {
                      setNewLabour(prev => ({ ...prev, project_id: selectedProject.id }));
                      setSelectedProject(null);
                      setActiveTab('labour');
                      setShowAddLabour(true);
                    }}
                    className="px-4 py-2 border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 rounded-lg transition-colors"
                  >
                    + Log Labor Attendance
                  </button>
                </div>
              </div>
            ) : (
              /* PROJECTS LIST VIEW */
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Construction Sites & Projects</h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">All projects assigned to your firm or active in your city.</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search sites or city..."
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="p-12 text-center rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] text-slate-500 dark:text-zinc-400 text-xs">
                    No site projects match your search query.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map(p => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                              {p.category || 'Civil Work'}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                              {p.project_status || 'In Progress'}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                            {p.title || `Site Project #${p.id}`}
                          </h3>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span className="truncate">{p.location || 'Location in City'}</span>
                          </div>

                          {p.description && (
                            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed">
                              {p.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-zinc-400">
                            {p.client_name ? `Client: ${p.client_name}` : 'Residential Site'}
                          </span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            View Site Details →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: WORK ORDERS & MILESTONES */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'work-orders' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Contractor Work Orders & Milestones</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Track contract amounts, milestone completions and bill receipts.</p>
              </div>
              <button
                onClick={() => setShowAddWorkOrder(prev => !prev)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddWorkOrder ? 'Close Form' : '+ New Work Order Entry'}</span>
              </button>
            </div>

            {/* In-Page Add Work Order Form */}
            {showAddWorkOrder && (
              <form onSubmit={handleCreateWorkOrder} className="p-5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm space-y-4">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                  Log New Work Order / Construction Milestone
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Select Project</label>
                    <select
                      value={newWorkOrder.project_id}
                      onChange={(e) => setNewWorkOrder(prev => ({ ...prev, project_id: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    >
                      <option value="">General Work / Independent Site</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title || `Project #${p.id}`} ({p.location || 'Site'})</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Work Description / Milestone *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. RCC Foundation Slab Casting (2500 sqft)"
                      value={newWorkOrder.work_description}
                      onChange={(e) => setNewWorkOrder(prev => ({ ...prev, work_description: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Contract Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 150000"
                      value={newWorkOrder.contract_amount}
                      onChange={(e) => setNewWorkOrder(prev => ({ ...prev, contract_amount: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Paid / Advance Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={newWorkOrder.paid_amount}
                      onChange={(e) => setNewWorkOrder(prev => ({ ...prev, paid_amount: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Payment Mode</label>
                    <select
                      value={newWorkOrder.payment_mode}
                      onChange={(e) => setNewWorkOrder(prev => ({ ...prev, payment_mode: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    >
                      <option value="Bank Transfer">Bank Transfer / NEFT</option>
                      <option value="UPI">UPI / Instant Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Invoice / Bill Number</label>
                    <input
                      type="text"
                      placeholder="INV-0045"
                      value={newWorkOrder.invoice_number}
                      onChange={(e) => setNewWorkOrder(prev => ({ ...prev, invoice_number: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Notes / Measurements</label>
                    <input
                      type="text"
                      placeholder="Cement grades used, team size, inspection notes..."
                      value={newWorkOrder.notes}
                      onChange={(e) => setNewWorkOrder(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddWorkOrder(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingWorkOrder}
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {savingWorkOrder ? 'Saving...' : 'Save Work Order'}
                  </button>
                </div>
              </form>
            )}

            {/* Work Orders Table */}
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-zinc-900/60 border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Order / Date</th>
                      <th className="p-3.5">Site Project</th>
                      <th className="p-3.5">Work Description</th>
                      <th className="p-3.5 text-right">Contract Value</th>
                      <th className="p-3.5 text-right">Paid Amount</th>
                      <th className="p-3.5 text-right">Balance Due</th>
                      <th className="p-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                    {workOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-zinc-400">
                          No work orders found. Use &quot;+ New Work Order Entry&quot; to log your site contracts.
                        </td>
                      </tr>
                    ) : (
                      workOrders.map(wo => {
                        const cVal = Number(wo.contract_amount || 0);
                        const pVal = Number(wo.paid_amount || 0);
                        const bal = Math.max(0, cVal - pVal);
                        const isDone = pVal >= cVal && cVal > 0;

                        return (
                          <tr key={wo.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900 dark:text-white">#{wo.id}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {wo.payment_date ? new Date(wo.payment_date).toLocaleDateString('en-IN') : new Date(wo.created_at).toLocaleDateString('en-IN')}
                              </div>
                            </td>
                            <td className="p-3.5 font-medium text-slate-800 dark:text-zinc-200">
                              {wo.project_title}
                            </td>
                            <td className="p-3.5 text-slate-700 dark:text-zinc-300">
                              <div className="font-semibold">{wo.work_description}</div>
                              {wo.invoice_number && (
                                <div className="text-[10px] text-slate-400">Invoice: {wo.invoice_number}</div>
                              )}
                            </td>
                            <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                              ₹{cVal.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                              ₹{pVal.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3.5 text-right font-bold text-amber-600 dark:text-amber-400">
                              ₹{bal.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3.5 text-center">
                              <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                isDone
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              }`}>
                                {isDone ? 'Completed' : 'Active'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: LABOR & DAILY ATTENDANCE */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'labour' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Daily Labor Attendance & Wages</h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Log masons, helpers, carpenters and daily site muster rolls.</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <input
                  type="date"
                  value={labourDateFilter}
                  onChange={(e) => setLabourDateFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] text-slate-900 dark:text-white"
                />
                {labourDateFilter && (
                  <button
                    onClick={() => setLabourDateFilter('')}
                    className="text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setShowAddLabour(prev => !prev)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddLabour ? 'Close Form' : '+ Log Worker Entry'}</span>
                </button>
              </div>
            </div>

            {/* In-Page Add Labor Form */}
            {showAddLabour && (
              <form onSubmit={handleCreateLabour} className="p-5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm space-y-4">
                <div className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                  Log Site Worker Attendance & Wage Record
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Worker Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Santosh Kumar"
                      value={newLabour.labour_name}
                      onChange={(e) => setNewLabour(prev => ({ ...prev, labour_name: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Trade / Role *</label>
                    <select
                      value={newLabour.labour_role}
                      onChange={(e) => setNewLabour(prev => ({ ...prev, labour_role: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    >
                      <option value="Head Mason (Mistri)">Head Mason (Mistri)</option>
                      <option value="Mason (Mistri)">Mason (Mistri)</option>
                      <option value="Helper (Beldar)">Helper (Beldar)</option>
                      <option value="Shuttering Carpenter">Shuttering Carpenter</option>
                      <option value="Bar Bender (Steel Fixer)">Bar Bender (Steel Fixer)</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Tile / Marble Mason">Tile / Marble Mason</option>
                      <option value="Painter">Painter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Work Date</label>
                    <input
                      type="date"
                      value={newLabour.work_date}
                      onChange={(e) => setNewLabour(prev => ({ ...prev, work_date: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Status</label>
                    <select
                      value={newLabour.attendance_status}
                      onChange={(e) => setNewLabour(prev => ({ ...prev, attendance_status: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    >
                      <option value="Present">Present (Full Day)</option>
                      <option value="Half Day">Half Day (4 Hours)</option>
                      <option value="Overtime">Overtime (1.5x)</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Daily Wage (₹)</label>
                    <input
                      type="number"
                      placeholder="600"
                      value={newLabour.wage_amount}
                      onChange={(e) => setNewLabour(prev => ({ ...prev, wage_amount: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Paid Wage (₹)</label>
                    <input
                      type="number"
                      placeholder="600"
                      value={newLabour.paid_amount}
                      onChange={(e) => setNewLabour(prev => ({ ...prev, paid_amount: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-1">Site / Work Note</label>
                    <input
                      type="text"
                      placeholder="e.g. Ground floor beam binding & casting"
                      value={newLabour.notes}
                      onChange={(e) => setNewLabour(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLabour(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingLabour}
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {savingLabour ? 'Logging...' : 'Save Attendance'}
                  </button>
                </div>
              </form>
            )}

            {/* Attendance Table */}
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-zinc-900/60 border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Worker Name</th>
                      <th className="p-3.5">Trade / Skill</th>
                      <th className="p-3.5">Work Date</th>
                      <th className="p-3.5 text-center">Attendance</th>
                      <th className="p-3.5 text-right">Wage (₹)</th>
                      <th className="p-3.5 text-right">Paid (₹)</th>
                      <th className="p-3.5">Site Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                    {filteredLabour.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-zinc-400">
                          No labor entries recorded yet. Click &quot;+ Log Worker Entry&quot; to track your site attendance.
                        </td>
                      </tr>
                    ) : (
                      filteredLabour.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            {l.labour_name}
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-zinc-300">
                            {l.labour_role}
                          </td>
                          <td className="p-3.5 text-slate-500 dark:text-zinc-400">
                            {l.work_date ? new Date(l.work_date).toLocaleDateString('en-IN') : 'Today'}
                          </td>
                          <td className="p-3.5 text-center">
                            <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              l.attendance_status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : l.attendance_status === 'Overtime'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}>
                              {l.attendance_status || 'Present'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                            ₹{Number(l.wage_amount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{Number(l.paid_amount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3.5 text-slate-500 dark:text-zinc-400 max-w-xs truncate">
                            {l.notes || '—'}
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

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 5: EARNINGS & PAYOUTS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'payouts' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Contractor Earnings & Milestone Payouts</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Verified payment ledger and bank account details for milestone releases.</p>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Total Contracted</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  ₹{Number(stats.total_contract_value).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Across all work orders</div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Paid / Received</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                  ₹{Number(stats.total_paid_amount).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">Direct Bank / NEFT / UPI</div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
                <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Outstanding Balance</div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
                  ₹{Number(stats.pending_balance).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-400 mt-1">Payable on milestone verification</div>
              </div>
            </div>

            {/* Bank Details Card */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🏦</span> Registered Bank Payout Account
                </h3>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit Bank Info →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 text-[11px]">Account Holder</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{profileForm.bank_account_holder || profileForm.vendor_name || 'Not Configured'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Bank Name</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{profileForm.bank_name || 'State Bank of India'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Account Number</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{profileForm.bank_account_number || '••••••••1234'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">IFSC Code</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{profileForm.bank_ifsc_code || 'SBIN0001234'}</div>
                </div>
              </div>
            </div>

            {/* Payout History Ledger */}
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Payment History & Milestone Receipts
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-zinc-900/60 border-b border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Invoice / Receipt</th>
                      <th className="p-3.5">Project / Site</th>
                      <th className="p-3.5">Payment Mode</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Amount Received</th>
                      <th className="p-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                    {workOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-zinc-400">
                          No payout transactions recorded.
                        </td>
                      </tr>
                    ) : (
                      workOrders.map(wo => (
                        <tr key={wo.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            {wo.invoice_number || `INV-${wo.id}`}
                          </td>
                          <td className="p-3.5 text-slate-700 dark:text-zinc-300">
                            {wo.project_title}
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-zinc-400">
                            {wo.payment_mode || 'Bank Transfer'}
                          </td>
                          <td className="p-3.5 text-slate-500 dark:text-zinc-400">
                            {wo.payment_date ? new Date(wo.payment_date).toLocaleDateString('en-IN') : new Date(wo.created_at).toLocaleDateString('en-IN')}
                          </td>
                          <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{Number(wo.paid_amount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                              Verified
                            </span>
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

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB 6: PROFILE & COMPANY SETTINGS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Contractor Profile & Business Details</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Update company credentials, trade specialization, GST, and bank settlement details.</p>
            </div>

            {profileMsg.text && (
              <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}>
                <span>{profileMsg.type === 'success' ? '✅' : '⚠️'}</span>
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="p-6 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121216] shadow-sm space-y-6">
              
              {/* Basic Details */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Company & Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Contractor Full Name *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.vendor_name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, vendor_name: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Firm / Company Name</label>
                    <input
                      type="text"
                      value={profileForm.shop_name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, shop_name: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Operating City</label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Contractor Category / Specialization</label>
                    <select
                      value={profileForm.business_type}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, business_type: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    >
                      <option value="Civil Contractor">Civil Contractor (RCC & Structural)</option>
                      <option value="MEP Contractor">MEP Contractor (Plumbing & Electrical)</option>
                      <option value="Interior Vendor">Interior & Finishing Contractor</option>
                      <option value="Painting Contractor">Painting & Waterproofing</option>
                      <option value="General Contractor">General Construction Contractor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">State</label>
                    <input
                      type="text"
                      value={profileForm.state}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Legal & Taxes */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Legal Documents & Registrations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">GST Number</label>
                    <input
                      type="text"
                      placeholder="09ABCDE1234F1Z5"
                      value={profileForm.gst_number}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, gst_number: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">PAN Card Number</label>
                    <input
                      type="text"
                      placeholder="ABCDE1234F"
                      value={profileForm.pan_number}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, pan_number: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Settlement Bank Details */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Settlement Bank Account (For Milestone Payouts)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      value={profileForm.bank_account_holder}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bank_account_holder: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={profileForm.bank_name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bank_name: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={profileForm.bank_account_number}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bank_account_number: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={profileForm.bank_ifsc_code}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, bank_ifsc_code: e.target.value }))}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">Firm Experience & Past Work</label>
                <textarea
                  rows={3}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-[#18181e] text-slate-900 dark:text-white resize-vertical"
                  placeholder="Describe team size, past residential or commercial projects completed..."
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                >
                  {savingProfile ? 'Updating Profile...' : 'Save Profile Changes'}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </PanelLayout>
  );
}
