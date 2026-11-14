'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  X,
  Phone,
  Mail,
  AlertCircle,
  Briefcase,
  MapPin,
  CheckCircle2,
} from '@/app/components/ui/icons';

const COMMON_ROLES = [
  'Site Supervisor',
  'Site Engineer',
  'Project Manager',
  'Store Keeper / Incharge',
  'Accountant',
  'HR',
  'Quality Surveyor',
  'Safety Officer',
  'Driver / Logistics',
  'Field Officer',
  'Designer',
  'Cleaning Staff',
  'Office Staff',
  'Forman',
  'Other',
];

const DEPARTMENTS = [
  'Operations',
  'Civil / Construction',
  'Engineering & Architecture',
  'Electrical & Plumbing',
  'Procurement & Store',
  'Accounts & Admin',
  'Quality & Safety',
  'Other',
];

const STATUS_LABELS = {
  working: { label: 'Currently Working', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
  on_leave: { label: 'On Leave', badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
  resigned: { label: 'Resigned / Left', badge: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700' },
  terminated: { label: 'Terminated', badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' },
  inactive: { label: 'Inactive', badge: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700' },
};

function formatTenure(joiningDateStr, relievingDateStr, status) {
  if (!joiningDateStr) return '—';
  const start = new Date(joiningDateStr);
  const end = (status !== 'working' && status !== 'on_leave' && relievingDateStr)
    ? new Date(relievingDateStr)
    : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return 'Just joined';
  }

  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30.4375);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  if (years > 0) {
    return remMonths > 0 ? `${years}y ${remMonths}m` : `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  if (months > 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  if (totalDays > 0) {
    return `${totalDays} ${totalDays === 1 ? 'day' : 'days'}`;
  }
  return 'Joined today';
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  role: 'Site Supervisor',
  custom_role: '',
  department: 'Operations',
  joining_date: new Date().toISOString().slice(0, 10),
  relieving_date: '',
  status: 'working',
  assigned_project_or_site: '',
  notes: '',
};

export default function FranchiseStaffManager({ permissions = {} }) {
  const canManage = permissions['staff.manage'] === true;

  const [staffList, setStaffList] = useState([]);
  const [summary, setSummary] = useState({
    total_staff: 0,
    currently_working: 0,
    on_leave: 0,
    resigned_or_left: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const getHeaders = useCallback(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('franchise-token') : '';
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchStaff = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/franchise/staff?${params.toString()}`, {
        headers: getHeaders(),
        cache: 'no-store',
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch staff records');
      }

      setStaffList(result.data || []);
      if (result.summary) setSummary(result.summary);
    } catch (err) {
      console.error('Error in fetchStaff:', err);
      setError(err.message || 'Unable to load staff records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getHeaders, search, roleFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStaff();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchStaff]);

  const openCreateModal = () => {
    setEditingStaffId(null);
    setFormData({
      ...emptyForm,
      joining_date: new Date().toISOString().slice(0, 10),
    });
    setModalOpen(true);
  };

  const openEditModal = (staff) => {
    setEditingStaffId(staff.id);
    const isCustomRole = !COMMON_ROLES.includes(staff.role);
    setFormData({
      name: staff.name || '',
      phone: staff.phone || '',
      email: staff.email || '',
      role: isCustomRole ? 'Other' : staff.role,
      custom_role: isCustomRole ? staff.role : '',
      department: staff.department || 'Operations',
      joining_date: staff.joining_date || new Date().toISOString().slice(0, 10),
      relieving_date: staff.relieving_date || '',
      status: staff.status || 'working',
      assigned_project_or_site: staff.assigned_project_or_site || '',
      notes: staff.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const finalRole = formData.role === 'Other' && formData.custom_role.trim()
        ? formData.custom_role.trim()
        : formData.role;

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        role: finalRole,
        department: formData.department,
        joining_date: formData.joining_date,
        relieving_date: formData.status !== 'working' && formData.status !== 'on_leave' ? (formData.relieving_date || null) : null,
        status: formData.status,
        assigned_project_or_site: formData.assigned_project_or_site.trim() || null,
        notes: formData.notes.trim() || null,
      };

      const url = editingStaffId
        ? `/api/franchise/staff/${editingStaffId}`
        : '/api/franchise/staff';
      const method = editingStaffId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to save staff record');
      }

      setSuccessMessage(editingStaffId ? 'Staff record updated successfully' : 'Staff member registered successfully');
      setModalOpen(false);
      fetchStaff(true);

      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err) {
      setError(err.message || 'Error saving staff record');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusChange = async (staffId, newStatus) => {
    try {
      const res = await fetch(`/api/franchise/staff/${staffId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to update status');
      }
      fetchStaff(true);
    } catch (err) {
      setError(err.message || 'Could not update status');
    }
  };

  const handleDelete = async (staffId) => {
    try {
      const res = await fetch(`/api/franchise/staff/${staffId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete record');
      }
      setDeleteConfirmId(null);
      setSuccessMessage('Staff record removed');
      fetchStaff(true);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Could not delete staff member');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── TOP KPI HEADCOUNT STRIP ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 md:p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Total Staff Registered
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {summary.total_staff || 0}
            </p>
            <span className="text-[11px] text-slate-500 dark:text-zinc-500">All-time staff roster</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 md:p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Currently Working
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {summary.currently_working || 0}
            </p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-500 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Active on field & office
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 md:p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              On Leave
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
              {summary.on_leave || 0}
            </p>
            <span className="text-[11px] text-slate-500 dark:text-zinc-500">Temporarily away</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>

        <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 md:p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Former Staff (Ex-Staff)
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-slate-600 dark:text-zinc-400 mt-1">
              {summary.resigned_or_left || 0}
            </p>
            <span className="text-[11px] text-slate-500 dark:text-zinc-500">Resigned or relieved</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-500/10 text-slate-600 dark:text-zinc-400 flex items-center justify-center">
            <UserX size={22} />
          </div>
        </div>
      </section>

      {/* ── ALERTS / NOTICES ── */}
      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
          <button type="button" onClick={() => setError('')} className="ml-auto text-rose-500 hover:text-rose-700">
            <X size={14} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage('')} className="ml-auto text-emerald-500 hover:text-emerald-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── MAIN STAFF DIRECTORY CARD ── */}
      <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 rounded-2xl overflow-hidden shadow-xs">
        {/* Header with Title and Add Button */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Franchise Staff Directory</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-semibold">
                {staffList.length} {staffList.length === 1 ? 'member' : 'members'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Complete record of all staff members who work or have worked in your franchise.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchStaff(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
              title="Refresh staff records"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            {canManage && (
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                <Plus size={14} />
                <span>+ Add Staff Member</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 bg-slate-50/70 dark:bg-zinc-900/50 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md relative">
            <Search size={15} className="absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, role, site..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-800 dark:text-zinc-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="">All Roles</option>
              {COMMON_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="working">Currently Working</option>
              <option value="on_leave">On Leave</option>
              <option value="former">Former Staff (Resigned / Left)</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-sm font-medium text-slate-500 dark:text-zinc-400">
              <RefreshCw size={20} className="animate-spin inline-block mb-2 text-blue-600" />
              <p>Loading franchise staff directory...</p>
            </div>
          ) : staffList.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mb-3">
                <Users size={24} />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">No staff records found</p>
              <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 max-w-sm mx-auto">
                {search || roleFilter || statusFilter
                  ? 'No staff member matches the selected filters.'
                  : 'Start adding the staff members who work or have worked in your franchise.'}
              </p>
              {canManage && !search && !roleFilter && !statusFilter && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  <span>Add First Staff Member</span>
                </button>
              )}
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-3.5 pl-4">Staff Member</th>
                  <th className="p-3.5">Role & Department</th>
                  <th className="p-3.5">Assigned Site / Project</th>
                  <th className="p-3.5">Joining Date</th>
                  <th className="p-3.5">Tenure Worked</th>
                  <th className="p-3.5">Working Status</th>
                  {canManage && <th className="p-3.5 pr-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {staffList.map((st) => {
                  const statusConfig = STATUS_LABELS[st.status] || STATUS_LABELS.working;
                  const tenure = formatTenure(st.joining_date, st.relieving_date, st.status);

                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* Name & Contact */}
                      <td className="p-3.5 pl-4">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {st.name}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                          {st.phone && (
                            <span className="flex items-center gap-1 font-mono">
                              <Phone size={11} className="text-slate-400" />
                              {st.phone}
                            </span>
                          )}
                          {st.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={11} className="text-slate-400" />
                              {st.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role & Department */}
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          {st.role}
                        </span>
                        {st.department && (
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                            {st.department}
                          </div>
                        )}
                      </td>

                      {/* Assigned Site */}
                      <td className="p-3.5">
                        {st.assigned_project_or_site ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                            <MapPin size={11} className="text-slate-400 shrink-0" />
                            {st.assigned_project_or_site}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-zinc-600 text-[11px] italic">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Joining Date */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800 dark:text-zinc-200">
                          {formatDate(st.joining_date)}
                        </div>
                        {st.relieving_date && st.status !== 'working' && (
                          <div className="text-[10px] text-slate-500 dark:text-zinc-500">
                            Left: {formatDate(st.relieving_date)}
                          </div>
                        )}
                      </td>

                      {/* Duration / Tenure */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1">
                          <Briefcase size={12} className="text-slate-400" />
                          <span>{tenure}</span>
                        </div>
                      </td>

                      {/* Working Status */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusConfig.badge}`}>
                          {st.status === 'working' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          )}
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Actions */}
                      {canManage && (
                        <td className="p-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(st)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                              title="Edit staff member"
                            >
                              <Pencil size={13} />
                            </button>

                            {deleteConfirmId === st.id ? (
                              <div className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 p-1 rounded-md border border-rose-200 dark:border-rose-900">
                                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300">Confirm?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(st.id)}
                                  className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded hover:bg-rose-700"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-zinc-300"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(st.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
                                title="Delete staff record"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── ADD / EDIT STAFF MODAL ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingStaffId ? 'Edit Staff Member' : 'Register New Staff Member'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Record staff details for your franchise team roster
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Role & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Role / Designation <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white font-semibold focus:outline-none"
                  >
                    {COMMON_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.role === 'Other' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Custom Designation Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom role title..."
                    value={formData.custom_role}
                    onChange={(e) => setFormData({ ...formData, custom_role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              )}

              {/* Working Status & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Working Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="working">🟢 Currently Working</option>
                    <option value="on_leave">🟡 On Leave</option>
                    <option value="resigned">⚪ Resigned / Left</option>
                    <option value="terminated">🔴 Terminated</option>
                    <option value="inactive">⚫ Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Joining Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.joining_date}
                    onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {formData.status !== 'working' && formData.status !== 'on_leave' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                    Relieving / Leaving Date
                  </label>
                  <input
                    type="date"
                    value={formData.relieving_date}
                    onChange={(e) => setFormData({ ...formData, relieving_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              )}

              {/* Assigned Site / Project */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Assigned Project / Site / Territory
                </label>
                <input
                  type="text"
                  placeholder="e.g. Green Valley Villa - Site #4"
                  value={formData.assigned_project_or_site}
                  onChange={(e) => setFormData({ ...formData, assigned_project_or_site: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Internal Notes / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Any additional remarks or records..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800/80 border border-slate-300 dark:border-zinc-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 border border-slate-300 dark:border-zinc-700 text-xs font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {saving && <RefreshCw size={13} className="animate-spin" />}
                  <span>{editingStaffId ? 'Update Record' : 'Save Staff Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

