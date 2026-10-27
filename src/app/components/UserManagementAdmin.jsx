'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import QuickServiceIcon from './QuickServiceIcon';
import ServiceCheckboxCard from './ServiceCheckboxCard';
import {
  Users, Eye, Ban, ShieldCheck, Trash2, X, RefreshCw, Search,
  Calendar, MapPin, ShoppingCart, CircleDollarSign, CheckCircle2,
  AlertCircle, ActionIconButton, User, Phone, Mail, Clock, ChevronDown, Plus,
} from '@/app/components/ui/icons';

const SPECIALIZATION_OPTIONS = [
  { key: 'payments', label: 'Payments', desc: 'Party & Vendor Payments', bg: '#e0f2fe', tx: '#2563eb' },
  { key: 'labor', label: 'Labor', desc: 'Attendance & Labor Payments', bg: '#fef3c7', tx: '#ea580c' },
  { key: 'vendor', label: 'Vendor', desc: 'Vendors & Project Assignments', bg: '#f3e8ff', tx: '#9333ea' },
  { key: 'construction', label: 'Construction', desc: 'Materials, Stock & Expenses', bg: '#dcfce7', tx: '#16a34a' },
];

const AGENT_STATUS_OPTIONS = ['Pending', 'Reviewing', 'Approved', 'Rejected'];

const agentStatusStyle = {
  Pending:   { bg: '#fff7ed', tx: '#9a3412', activeBg: '#9a3412', activeTx: '#fff' },
  Reviewing: { bg: '#eff4ff', tx: '#1e3a8a', activeBg: '#1e3a8a', activeTx: '#fff' },
  Approved:  { bg: '#f0fdf4', tx: '#14532d', activeBg: '#16a34a', activeTx: '#fff' },
  Rejected:  { bg: '#fff1f2', tx: '#9f1239', activeBg: '#dc2626', activeTx: '#fff' },
};

const managerLoading = () => (
  <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--muted, #64748b)', fontSize: '0.875rem' }}>
    Loading section...
  </div>
);

const VendorManagementAdmin = dynamic(() => import('./VendorManagementAdmin'), { loading: managerLoading });
const SupplierHubAdmin = dynamic(() => import('./SupplierHubAdmin'), { loading: managerLoading });
const AgentsPage = dynamic(() => import('../dashboard/agents/page'), { loading: managerLoading });


const getRoleBadgeStyle = (role) => {
  switch (String(role || 'Customer').toLowerCase()) {
    case 'vendor':
      return { bg: '#ffedd5', text: '#c2410c', border: '#fdba74', icon: '🧑‍💼' };
    case 'contractor':
      return { bg: '#f3e8ff', text: '#7e22ce', border: '#d8b4fe', icon: '🏗️' };
    case 'agent':
      return { bg: '#fef3c7', text: '#b45309', border: '#fcd34d', icon: '🤝' };
    case 'supplier':
      return { bg: '#dcfce7', text: '#15803d', border: '#86efac', icon: '🏭' };
    case 'customer':
    default:
      return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', icon: '👤' };
  }
};

const formatDateTime = (value) => {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ', ' + d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

const formatDateOnly = (value) => {
  if (!value) return '—';
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

const formatCurrency = (amount) => {
  const num = Number(amount || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function UserManagementAdmin({ isDarkMode = false, initialRoleView = 'users' }) {
  // Data state
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    blocked_users: 0,
    with_orders_count: 0,
    zero_orders_count: 0,
    total_lifetime_spent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', message: '' }

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'blocked'
  const [roleFilter, setRoleFilter] = useState(
    initialRoleView === 'contractors' ? 'Contractor' :
    initialRoleView === 'vendors' ? 'Vendor' :
    initialRoleView === 'suppliers' ? 'Supplier' :
    initialRoleView === 'agents' ? 'Agent' :
    initialRoleView === 'users' ? 'Customer' : 'all'
  );
  const [cityFilter, setCityFilter] = useState('');
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'has_orders' | 'zero'
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Synchronize initialRoleView if changed from outside
  useEffect(() => {
    if (initialRoleView) {
      if (initialRoleView === 'vendors') setRoleFilter('Vendor');
      else if (initialRoleView === 'suppliers') setRoleFilter('Supplier');
      else if (initialRoleView === 'agents') setRoleFilter('Agent');
      else if (initialRoleView === 'contractors') setRoleFilter('Contractor');
      else if (initialRoleView === 'users') setRoleFilter('Customer');
      else setRoleFilter('all');
    }
  }, [initialRoleView]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 1 });

  // Detail Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('orders'); // 'orders' | 'coupons' | 'addresses' | 'moderation'

  // Interactive Agent states
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [updatingAgent, setUpdatingAgent] = useState(false);
  const [agentPendingStatus, setAgentPendingStatus] = useState('');
  const [tempLogin, setTempLogin] = useState(null);
  const [showAgentLeads, setShowAgentLeads] = useState(false);
  const [showAgentActivity, setShowAgentActivity] = useState(false);

  // Interactive Vendor states
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [contractorSaving, setContractorSaving] = useState(false);
  const [vendorActionLoading, setVendorActionLoading] = useState(false);

  // Interactive Supplier states
  const [supplierActionLoading, setSupplierActionLoading] = useState(false);

  // Block Modal state
  const [blockModalTarget, setBlockModalTarget] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [blocking, setBlocking] = useState(false);

  // Delete Modal state
  const [deleteModalTarget, setDeleteModalTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // In-Page Account Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [createRole, setCreateRole] = useState('Customer'); // Customer | Agent | Vendor | Supplier
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: 'Moradabad',
    state: 'Uttar Pradesh',
    postal_code: '',
    address: '',
    // Agent
    occupation: 'Civil Engineer',
    agent_type: 'contractor',
    experience: '1-2 Years',
    network: '100+',
    specializations: ['construction'],
    has_project_management_access: false,
    // Vendor
    shop_name: '',
    business_name: '',
    business_type: 'Vendor',
    services: [],
    is_contractor: false,
    // Supplier
    aadhaar_number: '',
    product_categories: ['Cement', 'Bricks', 'Steel'],
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      const payload = {
        role: createRole,
        ...createForm,
      };
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create account');
      }
      setNotice({
        type: 'success',
        message: `${createRole} account "${data.data?.name || data.data?.email}" created successfully!`,
      });
      setIsCreating(false);
      setCreateForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        city: 'Moradabad',
        state: 'Uttar Pradesh',
        postal_code: '',
        address: '',
        occupation: 'Civil Engineer',
        agent_type: 'contractor',
        experience: '1-2 Years',
        network: '100+',
        specializations: ['construction'],
        has_project_management_access: false,
        shop_name: '',
        business_name: '',
        business_type: 'Vendor',
        services: [],
        is_contractor: false,
        aadhaar_number: '',
        product_categories: ['Cement', 'Bricks', 'Steel'],
      });
      fetchUsers(1);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error creating account' });
    } finally {
      setCreateSubmitting(false);
    }
  };

  const authHeaders = useMemo(() => {
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('admin-token') || localStorage.getItem('token') || '')
      : '';
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  // Fetch Users List
  const fetchUsers = useCallback(async (targetPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        pageSize: String(pageSize),
      });

      if (targetPage > 1) params.set('skip_meta', '1');
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (roleFilter && roleFilter !== 'all') params.set('role', roleFilter);
      if (cityFilter) params.set('city', cityFilter);
      if (orderFilter && orderFilter !== 'all') params.set('orders', orderFilter);
      if (fromDate) params.set('from', fromDate);
      if (toDate) params.set('to', toDate);

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: authHeaders,
        cache: 'no-store',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load users');
      }

      setUsers(data.data || []);
      if (data.cities && data.cities.length) setCities(data.cities);
      if (data.stats) setStats(data.stats);
      if (data.pagination) {
        setPagination(data.pagination);
        setPage(data.pagination.page);
      }
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error loading users list' });
    } finally {
      setLoading(false);
    }
  }, [authHeaders, search, statusFilter, roleFilter, cityFilter, orderFilter, fromDate, toDate, pageSize]);

  // Initial and debounced search/filter load
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  // Open User Details Modal
  const openUserDetails = async (user) => {
    setSelectedUser(user);
    setUserDetails(null);
    setDetailsLoading(true);
    setAgentPendingStatus('');
    setTempLogin(null);
    setShowAgentLeads(false);
    setShowAgentActivity(false);

    const initialRole = user.role || 'Customer';
    if (initialRole === 'Agent') setActiveDetailTab('agent_profile');
    else if (initialRole === 'Supplier') setActiveDetailTab('supplier_info');
    else if (initialRole === 'Vendor' || initialRole === 'Contractor') setActiveDetailTab('vendor_info');
    else setActiveDetailTab('orders');

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        headers: authHeaders,
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load user details');
      }
      setUserDetails(data.data);

      const agentSpecs = data.data?.agent?.specializations;
      if (agentSpecs) {
        setSelectedSpecs(Array.isArray(agentSpecs) ? agentSpecs : (typeof agentSpecs === 'string' ? JSON.parse(agentSpecs || '[]') : []));
      } else {
        setSelectedSpecs([]);
      }

      if (data.data?.vendorAssignedServices) {
        setSelectedServiceIds((data.data.vendorAssignedServices || []).map((s) => Number(s.id)));
      } else {
        setSelectedServiceIds([]);
      }

      const serverRole = data.data?.role || initialRole;
      if (serverRole === 'Agent') setActiveDetailTab('agent_profile');
      else if (serverRole === 'Supplier') setActiveDetailTab('supplier_info');
      else if (serverRole === 'Vendor' || serverRole === 'Contractor') setActiveDetailTab('vendor_info');
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Failed to fetch user details' });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Block User
  const handleBlockUser = async () => {
    if (!blockModalTarget) return;
    setBlocking(true);
    try {
      const res = await fetch(`/api/admin/users/${blockModalTarget.id}/block`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ reason: blockReason.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to block user');
      }

      setNotice({
        type: 'success',
        message: `Account for "${blockModalTarget.name || blockModalTarget.email}" has been blocked.`,
      });

      // Update state locally
      setUsers((prev) =>
        prev.map((u) =>
          u.id === blockModalTarget.id
            ? { ...u, is_blocked: true, blocked_reason: blockReason.trim(), blocked_at: new Date().toISOString() }
            : u
        )
      );

      if (selectedUser?.id === blockModalTarget.id) {
        setSelectedUser((prev) => ({
          ...prev,
          is_blocked: true,
          blocked_reason: blockReason.trim() || null,
          blocked_at: new Date().toISOString(),
        }));
        setUserDetails((prev) => prev ? ({
          ...prev,
          user: {
            ...prev.user,
            is_blocked: true,
            blocked_reason: blockReason.trim() || null,
            blocked_at: new Date().toISOString(),
          },
          moderationLog: [
            {
              action: 'blocked',
              reason: blockReason.trim() || null,
              admin_name: 'Admin',
              created_at: new Date().toISOString(),
            },
            ...(prev.moderationLog || []),
          ],
        }) : prev);
      }

      setBlockModalTarget(null);
      setBlockReason('');
      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error blocking user' });
    } finally {
      setBlocking(false);
    }
  };

  // Unblock User
  const handleUnblockUser = async (user) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/unblock`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ reason: 'Unblocked by admin' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to unblock user');
      }

      setNotice({
        type: 'success',
        message: `Account for "${user.name || user.email}" has been unblocked.`,
      });

      // Update state locally
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, is_blocked: false, blocked_reason: null, blocked_at: null } : u
        )
      );

      if (selectedUser?.id === user.id) {
        setSelectedUser((prev) => ({ ...prev, is_blocked: false, blocked_reason: null, blocked_at: null }));
        setUserDetails((prev) => prev ? ({
          ...prev,
          user: { ...prev.user, is_blocked: false, blocked_reason: null, blocked_at: null },
          moderationLog: [
            {
              action: 'unblocked',
              reason: 'Unblocked by admin',
              admin_name: 'Admin',
              created_at: new Date().toISOString(),
            },
            ...(prev.moderationLog || []),
          ],
        }) : prev);
      }

      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error unblocking user' });
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    if (!deleteModalTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteModalTarget.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setNotice({
        type: 'success',
        message: `User account "${deleteModalTarget.name || deleteModalTarget.email}" deleted successfully.`,
      });

      if (selectedUser?.id === deleteModalTarget.id) {
        setSelectedUser(null);
        setUserDetails(null);
      }

      setDeleteModalTarget(null);
      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error deleting user' });
    } finally {
      setDeleting(false);
    }
  };

  // Update user role
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update user role');
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => ({ ...prev, role: newRole }));
        setUserDetails((prev) => (prev ? { ...prev, user: { ...prev.user, role: newRole } } : prev));
      }
      setNotice({
        type: 'success',
        message: `User role updated to "${newRole}" successfully.`,
      });
    } catch (err) {
      setNotice({
        type: 'error',
        message: err.message || 'Error updating user role',
      });
    }
  };

  // Toggle Agent Project Management Access
  const handleToggleAgentPm = async () => {
    if (!userDetails?.agent?.id) return;
    const realId = userDetails.agent.id;
    const nextAccess = !userDetails.agent.has_project_management_access;
    try {
      const res = await fetch(`/api/admin/agents/${realId}/pm-access`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ has_project_management_access: nextAccess }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update PM access');
      }
      setUserDetails((prev) => ({
        ...prev,
        agent: {
          ...prev.agent,
          has_project_management_access: nextAccess,
        },
      }));
      setNotice({
        type: 'success',
        message: `Project Management access ${nextAccess ? 'granted' : 'revoked'} for ${userDetails.agent.name}.`,
      });
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error updating PM access' });
    }
  };

  // Update Agent Status
  const handleUpdateAgentStatus = async (agentId, status, action = '') => {
    setUpdatingAgent(true);
    setTempLogin(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/agents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id: agentId,
          status,
          action,
          createLogin: status === 'Approved' && !userDetails?.agent?.login_enabled,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not update agent status');
      }
      setUserDetails((prev) => prev ? ({
        ...prev,
        agent: { ...prev.agent, ...data.data },
      }) : prev);
      setAgentPendingStatus('');
      if (data.temporaryPassword) {
        setTempLogin({
          email: data.data.email,
          password: data.temporaryPassword,
          city: data.data.city,
          emailSent: data.emailSent !== false,
          reset: action === 'reset_password',
        });
      }
      setNotice({ type: 'success', message: `Agent status updated to "${status}".` });
      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error updating agent status' });
    } finally {
      setUpdatingAgent(false);
    }
  };

  // Save Agent PM Specializations
  const handleSaveSpecializations = async (agentId, specs) => {
    setUpdatingAgent(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch(`/api/admin/agents/${agentId}/pm-access`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ specializations: specs, has_project_management_access: specs.length > 0 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not update specializations');
      }
      setUserDetails((prev) => prev ? ({
        ...prev,
        agent: { ...prev.agent, specializations: specs, has_project_management_access: specs.length > 0 ? true : prev.agent?.has_project_management_access },
      }) : prev);
      setNotice({ type: 'success', message: 'Project Management specializations saved successfully.' });
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error updating specializations' });
    } finally {
      setUpdatingAgent(false);
    }
  };

  // Save Vendor Assigned Services
  const handleSaveVendorServices = async (vendorId, serviceIds) => {
    setServiceSaving(true);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          vendor_id: vendorId,
          action: 'update_services',
          services: serviceIds,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update vendor services');
      }
      setNotice({ type: 'success', message: `Assigned services (${serviceIds.length}) updated successfully.` });
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error saving services' });
    } finally {
      setServiceSaving(false);
    }
  };

  const handleContractorChange = async (vendorId, isContractor, trade = null) => {
    setContractorSaving(true);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const finalTrade = isContractor ? (trade || userDetails?.vendor?.contractor_trade || 'CIVIL') : null;
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          vendor_id: vendorId,
          action: 'update_contractor',
          is_contractor: isContractor,
          contractor_trade: finalTrade,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not update contractor status');
      setUserDetails((current) => current ? { ...current, vendor: { ...current.vendor, ...data.data } } : current);
      setNotice({
        type: 'success',
        message: isContractor
          ? `Contractor registered successfully (${data.data?.contractor_trade || finalTrade}).`
          : 'Contractor role removed.',
      });
      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Could not update contractor status' });
    } finally {
      setContractorSaving(false);
    }
  };

  // Approve Vendor
  const handleApproveVendor = async (vendorId) => {
    setVendorActionLoading(true);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ vendor_id: vendorId, action: 'approve' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to approve vendor');
      setUserDetails((prev) => prev ? ({
        ...prev,
        vendor: { ...prev.vendor, verification_status: 'verified', status: 'active', is_approved: true },
      }) : prev);
      setNotice({ type: 'success', message: 'Vendor approved successfully!' });
      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error approving vendor' });
    } finally {
      setVendorActionLoading(false);
    }
  };

  // Reject Vendor
  const handleRejectVendor = async (vendorId, reason) => {
    setVendorActionLoading(true);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ vendor_id: vendorId, action: 'reject', admin_notes: reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to reject vendor');
      setUserDetails((prev) => prev ? ({
        ...prev,
        vendor: { ...prev.vendor, verification_status: 'rejected', status: 'inactive' },
      }) : prev);
      setNotice({ type: 'success', message: 'Vendor rejected.' });
      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error rejecting vendor' });
    } finally {
      setVendorActionLoading(false);
    }
  };

  // Toggle Vendor Status
  const handleToggleVendorStatus = async (vendorId, currentStatus) => {
    setVendorActionLoading(true);
    try {
      const action = currentStatus === 'active' ? 'deactivate' : 'activate';
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ vendor_id: vendorId, action }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update vendor status');
      setUserDetails((prev) => prev ? ({
        ...prev,
        vendor: { ...prev.vendor, status: currentStatus === 'active' ? 'inactive' : 'active' },
      }) : prev);
      setNotice({ type: 'success', message: `Vendor ${action}d successfully.` });
      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error updating vendor status' });
    } finally {
      setVendorActionLoading(false);
    }
  };

  // Approve Supplier
  const handleApproveSupplier = async (supplierId) => {
    setSupplierActionLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/suppliers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ supplier_id: supplierId, action: 'approve' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to approve supplier');
      setUserDetails((prev) => prev ? ({
        ...prev,
        supplier: { ...prev.supplier, status: 'approved', is_active: true },
      }) : prev);
      setNotice({ type: 'success', message: 'Supplier approved successfully!' });
      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error approving supplier' });
    } finally {
      setSupplierActionLoading(false);
    }
  };

  // Reject Supplier
  const handleRejectSupplier = async (supplierId, reason) => {
    setSupplierActionLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/suppliers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ supplier_id: supplierId, action: 'reject', rejection_reason: reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to reject supplier');
      setUserDetails((prev) => prev ? ({
        ...prev,
        supplier: { ...prev.supplier, status: 'rejected', is_active: false, rejection_reason: reason },
      }) : prev);
      setNotice({ type: 'success', message: 'Supplier rejected.' });
      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error rejecting supplier' });
    } finally {
      setSupplierActionLoading(false);
    }
  };

  // Toggle Supplier Status
  const handleToggleSupplierStatus = async (supplierId, isCurrentActive) => {
    setSupplierActionLoading(true);
    try {
      const action = isCurrentActive ? 'deactivate' : 'activate';
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/suppliers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ supplier_id: supplierId, action }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update supplier status');
      setUserDetails((prev) => prev ? ({
        ...prev,
        supplier: { ...prev.supplier, is_active: !isCurrentActive },
      }) : prev);
      setNotice({ type: 'success', message: `Supplier ${action}d successfully.` });
      fetchUsers(page);
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Error updating supplier status' });
    } finally {
      setSupplierActionLoading(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setRoleFilter('all');
    setCityFilter('');
    setOrderFilter('all');
    setFromDate('');
    setToDate('');
  };

  const hasActiveFilters = Boolean(
    search.trim() || statusFilter !== 'all' || (roleFilter && roleFilter !== 'all') || cityFilter || orderFilter !== 'all' || fromDate || toDate
  );

  const getRoleLabel = () => {
    switch (String(roleFilter || 'all').toLowerCase()) {
      case 'agent': return { singular: 'Agent', plural: 'Agents' };
      case 'vendor': return { singular: 'Vendor', plural: 'Vendors' };
      case 'supplier': return { singular: 'Supplier', plural: 'Suppliers' };
      case 'contractor': return { singular: 'Contractor', plural: 'Contractors' };
      case 'customer': return { singular: 'Customer', plural: 'Customers' };
      default: return { singular: 'User', plural: 'Users' };
    }
  };
  const roleLabel = getRoleLabel();

  return (
    <div style={{ padding: '0.5rem 0', color: 'var(--text, #111)' }}>
            {isCreating ? (
        <div style={{ width: '100%', padding: '0.25rem 0 2rem' }}>
          {/* Top Bar with Back Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNotice(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '8px',
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--bg, #fff)',
                color: 'var(--text, #1e293b)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <span>←</span>
              <span>Back to Directory</span>
            </button>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                border: `1px solid ${getRoleBadgeStyle(createRole).border}`,
                background: getRoleBadgeStyle(createRole).bg,
                color: getRoleBadgeStyle(createRole).text,
              }}
            >
              <span>{getRoleBadgeStyle(createRole).icon}</span>
              <span>Creating {createRole}</span>
            </span>
          </div>

          {/* Full Width Container */}
          <div
            style={{
              width: '100%',
              background: 'var(--bg, #fff)',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '12px',
              padding: '28px',
              marginBottom: '24px',
            }}
          >
            {/* Page Header */}
            <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text, #111)' }}>
                Create New Account
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--muted, #64748b)' }}>
                Select an account section below and fill out the form to register a new user, vendor, agent, or supplier.
              </p>
            </div>

            {/* Role Section Cards */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted, #64748b)', marginBottom: '12px' }}>
                Select Section / Account Type:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {[
                  { id: 'Customer', label: 'Customer / User', icon: '👤', desc: 'Place material orders, enquiry & book home services' },
                  { id: 'Agent', label: 'Agent', icon: '🤝', desc: 'Manage project leads, client schedule & site supervision' },
                  { id: 'Vendor', label: 'Vendor / Contractor', icon: '🧑‍💼', desc: 'Accept construction tasks, service orders & quick services' },
                  { id: 'Supplier', label: 'Supplier', icon: '🏭', desc: 'Fulfill material enquiries, supply orders & shop products' },
                ].map((sec) => {
                  const isSelected = createRole === sec.id;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => setCreateRole(sec.id)}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        border: `2px solid ${isSelected ? 'var(--brand-blue, #2563eb)' : 'var(--border, #e2e8f0)'}`,
                        background: isSelected ? 'color-mix(in srgb, var(--brand-blue, #2563eb) 6%, #fff)' : 'var(--bg, #fff)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.15)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{sec.icon}</span>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: isSelected ? 'var(--brand-blue, #2563eb)' : 'var(--text, #111)' }}>
                          {sec.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--muted, #64748b)', lineHeight: 1.4 }}>
                        {sec.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Creation Form */}
            <form onSubmit={handleCreateSubmit}>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand-blue, #2563eb)', marginBottom: '16px' }}>
                {createRole.toUpperCase()} DETAILS
              </div>

              {/* Core fields grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted, #475569)', marginBottom: '6px' }}>
                    {createRole === 'Supplier' || createRole === 'Vendor' ? 'Owner / Contact Full Name *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', fontSize: '13px', background: 'var(--bg, #fff)', color: 'var(--text, #111)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted, #475569)', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', fontSize: '13px', background: 'var(--bg, #fff)', color: 'var(--text, #111)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted, #475569)', marginBottom: '6px' }}>
                    Phone Number * (10 Digits)
                  </label>
                  <input
                    type="tel"
                    required
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', fontSize: '13px', background: 'var(--bg, #fff)', color: 'var(--text, #111)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted, #475569)', marginBottom: '6px' }}>
                    Password (leave empty for default)
                  </label>
                  <input
                    type="text"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder={`Default: ${createRole}@123`}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', fontSize: '13px', background: 'var(--bg, #fff)', color: 'var(--text, #111)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted, #475569)', marginBottom: '6px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.city}
                    onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                    placeholder="e.g. Moradabad"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', fontSize: '13px', background: 'var(--bg, #fff)', color: 'var(--text, #111)', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted, #475569)', marginBottom: '6px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={createForm.state}
                    onChange={(e) => setCreateForm({ ...createForm, state: e.target.value })}
                    placeholder="e.g. Uttar Pradesh"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', fontSize: '13px', background: 'var(--bg, #fff)', color: 'var(--text, #111)', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Vendor & Supplier Business Details */}
              {(createRole === 'Vendor' || createRole === 'Supplier') && (
                <div style={{ background: '#f8fafc', border: '1px solid var(--border, #e2e8f0)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '12px' }}>
                    Shop &amp; Business Information
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted, #475569)', marginBottom: '6px' }}>Shop / Store Name *</label>
                      <input
                        type="text"
                        required
                        value={createForm.shop_name}
                        onChange={(e) => setCreateForm({ ...createForm, shop_name: e.target.value })}
                        placeholder="e.g. Sharma Traders &amp; Supplies"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted, #475569)', marginBottom: '6px' }}>Business / Legal Name</label>
                      <input
                        type="text"
                        value={createForm.business_name}
                        onChange={(e) => setCreateForm({ ...createForm, business_name: e.target.value })}
                        placeholder="e.g. Sharma Enterprise Pvt Ltd"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    {createRole === 'Supplier' && (
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--muted, #475569)', marginBottom: '6px' }}>Aadhaar Number (12 Digits)</label>
                        <input
                          type="text"
                          value={createForm.aadhaar_number}
                          onChange={(e) => setCreateForm({ ...createForm, aadhaar_number: e.target.value })}
                          placeholder="e.g. 987654321012"
                          maxLength={14}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Agent Specific Fields */}
              {createRole === 'Agent' && (
                <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#854d0e', marginBottom: '12px' }}>
                    Agent Credentials &amp; Responsibilities
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#854d0e', marginBottom: '6px' }}>Occupation</label>
                      <input
                        type="text"
                        value={createForm.occupation}
                        onChange={(e) => setCreateForm({ ...createForm, occupation: e.target.value })}
                        placeholder="e.g. Civil Engineer, Consultant"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#854d0e', marginBottom: '6px' }}>Agent Type</label>
                      <select
                        value={createForm.agent_type}
                        onChange={(e) => setCreateForm({ ...createForm, agent_type: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                      >
                        <option value="contractor">Construction Contractor Agent</option>
                        <option value="consultant">Real Estate Consultant</option>
                        <option value="broker">Channel Partner / Broker</option>
                        <option value="franchise">Franchise Representative</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#854d0e', marginBottom: '6px' }}>Experience</label>
                      <select
                        value={createForm.experience}
                        onChange={(e) => setCreateForm({ ...createForm, experience: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                      >
                        <option value="Less than 1 Year">&lt; 1 Year</option>
                        <option value="1-2 Years">1-2 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#854d0e', marginBottom: '6px' }}>Network Reach</label>
                      <select
                        value={createForm.network}
                        onChange={(e) => setCreateForm({ ...createForm, network: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #fde047', fontSize: '13px', background: '#fff', boxSizing: 'border-box' }}
                      >
                        <option value="50+">50+ Clients</option>
                        <option value="100+">100+ Clients</option>
                        <option value="500+">500+ Clients</option>
                        <option value="1000+">1000+ Clients</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#854d0e', marginBottom: '8px' }}>Specializations</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {SPECIALIZATION_OPTIONS.map((spec) => {
                        const checked = createForm.specializations.includes(spec.key);
                        return (
                          <label
                            key={spec.key}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: `1px solid ${checked ? spec.tx : '#e2e8f0'}`,
                              background: checked ? spec.bg : '#fff',
                              color: checked ? spec.tx : '#475569',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...createForm.specializations, spec.key]
                                  : createForm.specializations.filter(k => k !== spec.key);
                                setCreateForm({ ...createForm, specializations: next });
                              }}
                            />
                            {spec.label} ({spec.desc})
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#854d0e', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={createForm.has_project_management_access}
                      onChange={(e) => setCreateForm({ ...createForm, has_project_management_access: e.target.checked })}
                    />
                    Enable Project Management (PM) Site Supervision Access
                  </label>
                </div>
              )}

              {/* Vendor Services */}
              {createRole === 'Vendor' && (
                <div style={{ background: '#f8fafc', border: '1px solid var(--border, #e2e8f0)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '8px' }}>
                    Assign Primary Quick Services
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                    {[
                      { id: 1, label: '2D/3D Design' },
                      { id: 2, label: 'Architecture Planning' },
                      { id: 3, label: 'Auto Leveling' },
                      { id: 4, label: 'CCTV Installation' },
                      { id: 5, label: 'Construction NOC' },
                      { id: 6, label: 'Construction Supervision' },
                      { id: 7, label: 'Dismantling' },
                      { id: 8, label: 'Elevation ACP/Lower' },
                      { id: 9, label: 'Excavation' },
                      { id: 10, label: 'Plumbing & Sanitary' },
                      { id: 11, label: 'Electrical Wiring' },
                      { id: 12, label: 'Waterproofing' },
                    ].map((serv) => {
                      const checked = createForm.services.includes(serv.id);
                      return (
                        <label
                          key={serv.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: `1px solid ${checked ? 'var(--brand-blue, #2563eb)' : '#cbd5e1'}`,
                            background: checked ? '#eff6ff' : '#fff',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...createForm.services, serv.id]
                                : createForm.services.filter(x => x !== serv.id);
                              setCreateForm({ ...createForm, services: next });
                            }}
                          />
                          {serv.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Register as Contractor checkbox — only shown for Vendor */}
              {createRole === 'Vendor' && (
                <div style={{ marginTop: '14px', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={createForm.is_contractor || false}
                      onChange={(e) => setCreateForm({ ...createForm, is_contractor: e.target.checked })}
                      style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#16a34a', flexShrink: 0 }}
                    />
                    <span>
                      <span style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#15803d' }}>Register as Contractor</span>
                      <span style={{ display: 'block', fontSize: '12px', color: '#166534', marginTop: '2px' }}>Show this vendor in Project Management contractor selection.</span>
                    </span>
                  </label>
                </div>
              )}

              {/* Supplier Product Categories */}
              {createRole === 'Supplier' && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#15803d', marginBottom: '8px' }}>
                    Select Material Categories Supplied
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {[
                      'Cement', 'Bricks & Blocks', 'TMT Steel & Rebar', 'Sand & Aggregates',
                      'Tiles & Marbles', 'Plumbing & Pipes', 'Electrical Supplies', 'Paints & Primer',
                      'Hardware & Tools'
                    ].map((cat) => {
                      const checked = createForm.product_categories.includes(cat);
                      return (
                        <label
                          key={cat}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: `1px solid ${checked ? '#16a34a' : '#cbd5e1'}`,
                            background: checked ? '#dcfce7' : '#fff',
                            color: checked ? '#15803d' : '#334155',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...createForm.product_categories, cat]
                                : createForm.product_categories.filter(x => x !== cat);
                              setCreateForm({ ...createForm, product_categories: next });
                            }}
                          />
                          {cat}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border, #e2e8f0)' }}>
                <button
                  type="submit"
                  disabled={createSubmitting}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--brand-blue, #2563eb)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: createSubmitting ? 'not-allowed' : 'pointer',
                    opacity: createSubmitting ? 0.7 : 1,
                    boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                  }}
                >
                  {createSubmitting ? 'Creating...' : `Create ${createRole} Account`}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid var(--border, #cbd5e1)',
                    background: '#f8fafc',
                    color: 'var(--text, #334155)',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : !selectedUser ? (
        <>
          {/* Page Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px',
            }}
          >
        <div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              margin: '0 0 6px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span>👥</span> Users &amp; Customers Management
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted, #64748b)' }}>
            Complete directory of all registered customer accounts, lifetime order history, delivery cities, and account moderation.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setIsCreating(true);
              const r = String(roleFilter || '').toLowerCase();
              if (r === 'agent') setCreateRole('Agent');
              else if (r === 'vendor' || r === 'contractor') setCreateRole('Vendor');
              else if (r === 'supplier') setCreateRole('Supplier');
              else setCreateRole('Customer');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              borderRadius: '8px',
              border: 'none',
              background: 'var(--brand-blue, #2563eb)',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <Plus size={16} />
            <span>Create Account</span>
          </button>

        <button
          type="button"
          onClick={() => fetchUsers(page)}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px',
            border: '1px solid var(--border, #e2e8f0)',
            background: 'var(--bg, #fff)',
            color: 'var(--text, #111)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div
          role="status"
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '13px',
            fontWeight: 600,
            background: notice.type === 'error' ? '#fee2e2' : '#dcfce7',
            color: notice.type === 'error' ? '#b91c1c' : '#15803d',
            border: `1px solid ${notice.type === 'error' ? '#fca5a5' : '#86efac'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notice.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{notice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '16px',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* KPI Stats Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'var(--bg, #fff)',
            border: '1px solid var(--border, #e2e8f0)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Total {roleLabel.plural}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text, #111)' }}>
            {stats.total_users}
          </div>
          <small style={{ color: 'var(--muted, #64748b)', fontSize: '11px' }}>
            {roleFilter !== 'all' ? `All registered ${roleLabel.plural.toLowerCase()}` : 'All registered accounts'}
          </small>
        </div>

        <div
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'var(--bg, #fff)',
            border: '1px solid var(--border, #e2e8f0)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Active {roleFilter !== 'all' ? roleLabel.plural : 'Accounts'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a' }}>
            {stats.active_users}
          </div>
          <small style={{ color: 'var(--muted, #64748b)', fontSize: '11px' }}>Can order &amp; login</small>
        </div>

        <div
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'var(--bg, #fff)',
            border: '1px solid var(--border, #e2e8f0)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Blocked {roleFilter !== 'all' ? roleLabel.plural : 'Accounts'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: stats.blocked_users > 0 ? '#dc2626' : 'var(--muted, #64748b)' }}>
            {stats.blocked_users}
          </div>
          <small style={{ color: 'var(--muted, #64748b)', fontSize: '11px' }}>Access restricted</small>
        </div>

        <div
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'var(--bg, #fff)',
            border: '1px solid var(--border, #e2e8f0)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', marginBottom: '6px' }}>
            {roleFilter !== 'all' ? `${roleLabel.plural} with Orders` : 'Users with Orders'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--brand-blue, #2563eb)' }}>
            {stats.with_orders_count}
          </div>
          <small style={{ color: 'var(--muted, #64748b)', fontSize: '11px' }}>{stats.zero_orders_count} inactive (0 orders)</small>
        </div>

        <div
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'var(--bg, #fff)',
            border: '1px solid var(--border, #e2e8f0)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Lifetime {roleFilter !== 'all' ? roleLabel.singular : 'Combined'} Spend
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669' }}>
            {formatCurrency(stats.total_lifetime_spent)}
          </div>
          <small style={{ color: 'var(--muted, #64748b)', fontSize: '11px' }}>Shop &amp; services combined</small>
        </div>
      </div>



      {/* Filter and Search Panel */}
      <div
        style={{
          background: 'var(--bg, #fff)',
          border: '1px solid var(--border, #e2e8f0)',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
            alignItems: 'end',
          }}
        >
          {/* Search */}
          <div style={{ minWidth: '190px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', display: 'block', marginBottom: '5px' }}>
              Search Customer
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '13px',
                  borderRadius: '6px',
                  border: '1px solid var(--border, #cbd5e1)',
                  background: 'var(--input-bg, #fff)',
                  color: 'var(--text, #111)',
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted, #94a3b8)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* User Role Filter */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', display: 'block', marginBottom: '5px' }}>
              User Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--input-bg, #fff)',
                color: 'var(--text, #111)',
              }}
            >
              <option value="all">All Roles</option>
              <option value="Customer">Customer</option>
              <option value="Vendor">Vendor</option>
              <option value="Contractor">Contractor</option>
              <option value="Agent">Agent</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>

          {/* Account Status Filter */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', display: 'block', marginBottom: '5px' }}>
              Account Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--input-bg, #fff)',
                color: 'var(--text, #111)',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>

          {/* Delivery City Filter */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', display: 'block', marginBottom: '5px' }}>
              Delivery City
            </label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--input-bg, #fff)',
                color: 'var(--text, #111)',
              }}
            >
              <option value="">All Cities ({cities.length})</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Order Count Filter */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', display: 'block', marginBottom: '5px' }}>
              Orders Filter
            </label>
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--input-bg, #fff)',
                color: 'var(--text, #111)',
              }}
            >
              <option value="all">All Signup</option>
              <option value="has_orders">With Orders (1+)</option>
              <option value="zero">Inactive (0 Orders)</option>
            </select>
          </div>

          {/* Signup Date From */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', display: 'block', marginBottom: '5px' }}>
              Signup From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--input-bg, #fff)',
                color: 'var(--text, #111)',
              }}
            />
          </div>

          {/* Signup Date To */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', display: 'block', marginBottom: '5px' }}>
              Signup To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                fontSize: '12px',
                borderRadius: '6px',
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--input-bg, #fff)',
                color: 'var(--text, #111)',
              }}
            />
          </div>

          {/* Reset Action */}
          {hasActiveFilters && (
            <div>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: '1px solid #fca5a5',
                  background: '#fee2e2',
                  color: '#b91c1c',
                  cursor: 'pointer',
                }}
              >
                ✕ Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* If Supplier is selected as role, render the Supplier Hub (Overview, Enquiries, Suppliers, Revenue) */}
      {String(roleFilter || '').toLowerCase() === 'supplier' ? (
        <SupplierHubAdmin isDarkMode={isDarkMode} />
      ) : (
        <>
          {/* Users Table */}
          <div
            style={{
              background: 'var(--bg, #fff)',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '20px',
            }}
          >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg, #f8fafc)', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)' }}>Customer</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)' }}>Phone / City</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', textAlign: 'center' }}>Role</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)' }}>Registered</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--muted, #64748b)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={16} className="animate-spin" />
                      Loading customer records...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--muted, #64748b)' }}>
                    No registered customers match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const initials = (u.name || u.email || u.phone || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr
                      key={u.id}
                      onClick={() => openUserDetails(u)}
                      title="Click row to open details"
                      style={{
                        borderBottom: '1px solid var(--border, #f1f5f9)',
                        transition: 'background 0.15s',
                        cursor: 'pointer',
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      {/* Customer Name & Email */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '999px',
                              background: u.is_blocked ? '#fee2e2' : '#e0e7ff',
                              color: u.is_blocked ? '#dc2626' : '#4338ca',
                              fontWeight: 800,
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text, #0f172a)' }}>
                              {u.name || 'Unnamed Customer'}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--muted, #64748b)' }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone & Delivery City */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600 }}>{u.phone || '—'}</div>
                        <div style={{ fontSize: '11px', marginTop: '2px' }}>
                          {u.delivery_city ? (
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 700,
                                background: '#f1f5f9',
                                color: '#475569',
                              }}
                            >
                              {u.delivery_city}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--muted, #94a3b8)', fontSize: '11px' }}>No city set</span>
                          )}
                        </div>
                      </td>

                      {/* User Role Chip */}
                      <td style={{ padding: '12px 14px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            border: `1px solid ${getRoleBadgeStyle(u.role).border}`,
                            background: getRoleBadgeStyle(u.role).bg,
                            color: getRoleBadgeStyle(u.role).text,
                          }}
                        >
                          <span>{getRoleBadgeStyle(u.role).icon}</span>
                          <span>{u.role || 'Customer'}</span>
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600 }}>{formatDateOnly(u.created_at)}</div>
                        <div style={{ fontSize: '10px', color: 'var(--muted, #94a3b8)' }}>
                          {new Date(u.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openUserDetails(u);
                            }}
                            title="View Full Profile & Order History"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 9px',
                              borderRadius: '6px',
                              border: '1px solid var(--border, #cbd5e1)',
                              background: 'var(--bg, #fff)',
                              color: 'var(--brand-blue, #2563eb)',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <Eye size={13} />
                            Details
                          </button>

                          {u.is_blocked ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnblockUser(u);
                              }}
                              title="Unblock user account"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 9px',
                                borderRadius: '6px',
                                border: '1px solid #86efac',
                                background: '#dcfce7',
                                color: '#15803d',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <ShieldCheck size={13} />
                              Unblock
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBlockModalTarget(u);
                                setBlockReason('');
                              }}
                              title="Block user from placing orders or logging in"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 9px',
                                borderRadius: '6px',
                                border: '1px solid #fecaca',
                                background: '#fee2e2',
                                color: '#dc2626',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <Ban size={13} />
                              Block
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModalTarget(u);
                            }}
                            title="Delete user account"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '5px 7px',
                              borderRadius: '6px',
                              border: '1px solid var(--border, #cbd5e1)',
                              background: 'var(--bg, #fff)',
                              color: '#94a3b8',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.total > 0 && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '12px',
              color: 'var(--muted, #64748b)',
            }}
          >
            <div>
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} customers
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border, #cbd5e1)',
                  background: 'var(--bg, #fff)',
                  color: 'var(--text, #111)',
                  fontSize: '12px',
                }}
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>

              <button
                type="button"
                disabled={pagination.page <= 1 || loading}
                onClick={() => fetchUsers(pagination.page - 1)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border, #cbd5e1)',
                  background: 'var(--bg, #fff)',
                  color: 'var(--text, #111)',
                  cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                  opacity: pagination.page <= 1 ? 0.5 : 1,
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                ← Prev
              </button>

              <span style={{ fontWeight: 700, color: 'var(--text, #111)' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => fetchUsers(pagination.page + 1)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border, #cbd5e1)',
                  background: 'var(--bg, #fff)',
                  color: 'var(--text, #111)',
                  cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                  opacity: pagination.page >= pagination.totalPages ? 0.5 : 1,
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

          </>
        )}
      </>
    ) : (
      /* ── Dedicated In-Page User Detail Page View (NOT A POPUP) ── */
      <div style={{ width: '100%', marginBottom: '32px' }}>
        {/* Top Bar with Back Navigation Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--border, #e2e8f0)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setSelectedUser(null);
              setUserDetails(null);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: '1px solid var(--border, #cbd5e1)',
              background: 'var(--bg, #fff)',
              color: 'var(--text, #1e293b)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <span>←</span>
            <span>Back to {roleLabel.plural || 'Directory'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 700,
                background: selectedUser.is_blocked ? '#fee2e2' : '#dcfce7',
                color: selectedUser.is_blocked ? '#dc2626' : '#15803d',
              }}
            >
              {selectedUser.is_blocked ? '● Blocked / Suspended' : '● Active Account'}
            </span>

            {!selectedUser.is_blocked ? (
              <button
                type="button"
                onClick={() => {
                  setBlockModalTarget(selectedUser);
                  setBlockReason('');
                }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  background: '#fee2e2',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Block Account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleUnblockUser(selectedUser)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: '1px solid #86efac',
                  background: '#dcfce7',
                  color: '#15803d',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Unblock Account
              </button>
            )}
          </div>
        </div>

        {detailsLoading ? (
          <div style={{ padding: '80px', textAlign: 'center', background: 'var(--bg, #fff)', borderRadius: '12px', border: '1px solid var(--border, #e2e8f0)', color: 'var(--muted, #64748b)' }}>
            <RefreshCw size={28} className="animate-spin inline mr-2" />
            <div style={{ marginTop: '14px', fontWeight: 700, fontSize: '15px' }}>Loading profile details...</div>
          </div>
        ) : (() => {
            const currentRole = userDetails?.role || selectedUser?.role || 'Customer';
            const isAgent = currentRole === 'Agent';
            const isVendor = currentRole === 'Vendor' || currentRole === 'Contractor';
            const isSupplier = currentRole === 'Supplier';
            const isCustomer = currentRole === 'Customer';

            const agentData = userDetails?.agent;
            const vendorData = userDetails?.vendor;
            const supplierData = userDetails?.supplier;
            const userData = userDetails?.user;

            /* ══════════════════════════════════════════════════════
               1. AGENT APPLICATION VIEW (Exact match to User's Uploaded Screenshot)
               ══════════════════════════════════════════════════════ */
            if (isAgent) {
              return (
                <div
                  style={{
                    width: '100%',
                    background: 'var(--bg, #fff)',
                    border: '1px solid var(--border, #e2e8f0)',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Modal Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text, #111)' }}>
                      Agent Application
                    </h3>
                    
                  </div>

                  {/* 2-Column Info Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 24px', marginBottom: '22px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>FULL NAME</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{agentData?.name || selectedUser.name || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>EMAIL</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{agentData?.email || selectedUser.email || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>PHONE</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{agentData?.phone || selectedUser.phone || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>OCCUPATION</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{agentData?.occupation || 'Civil engineer'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>CITY</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{agentData?.city || selectedUser.delivery_city || 'Moradabad'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>STATE</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{agentData?.state || 'Madhya Pradesh'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>AGENT TYPE</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{agentData?.agent_type || 'Construction Agent'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>LOGIN</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{agentData?.login_enabled ? 'Enabled' : 'Not enabled'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>EXPERIENCE</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{agentData?.experience || '5+ Years'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>NETWORK</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{agentData?.network || '50-200'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>APPLIED ON</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text, #111)' }}>{formatDateOnly(agentData?.created_at || selectedUser.created_at)}</div>
                    </div>
                  </div>

                  {/* MESSAGE Box */}
                  <div style={{ marginBottom: '22px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>MESSAGE</div>
                    <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'var(--table-head-bg, #f1f5f9)', color: 'var(--text, #334155)', fontSize: '13px' }}>
                      {agentData?.message || 'Freelance civil engineer'}
                    </div>
                  </div>

                  {/* Temporary login credential notification if reset/created */}
                  {tempLogin && (
                    <div style={{ marginBottom: '18px', padding: '14px', borderRadius: '8px', border: '1px solid #93c5fd', background: '#eff6ff', color: '#1e3a8a' }}>
                      <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '4px' }}>{tempLogin.reset ? 'Password Reset Successfully' : 'Agent Login Created'}</div>
                      <div style={{ fontSize: '13px' }}>Email: <strong>{tempLogin.email}</strong></div>
                      <div style={{ fontSize: '13px' }}>Temporary Password: <strong style={{ fontFamily: 'monospace' }}>{tempLogin.password}</strong></div>
                      <div style={{ fontSize: '11px', color: '#60a5fa', marginTop: '6px' }}>
                        City locked to {tempLogin.city}. {tempLogin.emailSent ? 'Credentials were emailed successfully.' : 'Email delivery failed; please share this password securely.'}
                      </div>
                    </div>
                  )}

                  {/* Status Row */}
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--muted, #64748b)', fontWeight: 600 }}>Status:</span>
                    <span style={{ fontSize: '13px', color: agentData?.login_enabled ? '#16a34a' : 'var(--muted, #64748b)', fontWeight: 700, marginRight: '6px' }}>
                      Access {agentData?.login_enabled ? 'enabled' : 'disabled'}
                    </span>
                    {AGENT_STATUS_OPTIONS.map((st) => {
                      const isCurrent = agentData?.status === st;
                      const isPending = agentPendingStatus === st;
                      const conf = agentStatusStyle[st];
                      return (
                        <button
                          key={st}
                          type="button"
                          disabled={updatingAgent}
                          onClick={() => setAgentPendingStatus(st)}
                          style={{
                            padding: '5px 14px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            border: isCurrent ? 'none' : isPending ? '2px solid #2563eb' : '1px solid var(--border, #cbd5e1)',
                            background: isCurrent ? conf.activeBg : 'var(--bg, #fff)',
                            color: isCurrent ? conf.activeTx : isPending ? '#2563eb' : 'var(--text, #475569)',
                            boxShadow: isCurrent ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          }}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>

                  {/* Confirmation Prompt if status changed */}
                  {agentPendingStatus && agentPendingStatus !== agentData?.status && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border, #cbd5e1)', marginBottom: '18px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>Change status to <strong>{agentPendingStatus}</strong>?</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          disabled={updatingAgent}
                          onClick={() => setAgentPendingStatus('')}
                          style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', background: 'var(--bg, #fff)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={updatingAgent}
                          onClick={() => handleUpdateAgentStatus(agentData?.id || selectedUser.real_id, agentPendingStatus)}
                          style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: '#16a34a', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                        >
                          {updatingAgent ? 'Saving...' : 'OK'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions for Approved Agents */}
                  {agentData?.status === 'Approved' && agentData?.login_enabled && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                      <button
                        type="button"
                        disabled={updatingAgent}
                        onClick={() => {
                          if (window.confirm('Reset this agent password and invalidate the old password?')) {
                            handleUpdateAgentStatus(agentData.id, 'Approved', 'reset_password');
                          }
                        }}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', background: 'var(--bg, #fff)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Reset Password
                      </button>
                      <button
                        type="button"
                        disabled={updatingAgent}
                        onClick={() => setAgentPendingStatus('Reviewing')}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Disable Access
                      </button>
                      <button
                        type="button"
                        disabled={updatingAgent}
                        onClick={() => handleToggleAgentPm()}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: agentData?.has_project_management_access ? '1px solid #fca5a5' : '1px solid #86efac',
                          background: agentData?.has_project_management_access ? '#fee2e2' : '#dcfce7',
                          color: agentData?.has_project_management_access ? '#dc2626' : '#15803d',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {agentData?.has_project_management_access ? 'Revoke PM Access' : 'Grant PM Access'}
                      </button>
                    </div>
                  )}

                  {/* Project Management Specializations Box */}
                  <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', marginBottom: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '3px' }}>
                          PROJECT MANAGEMENT SPECIALIZATIONS
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--muted, #64748b)' }}>
                          Select modules this agent can access in assigned projects
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={updatingAgent}
                        onClick={() => handleSaveSpecializations(agentData?.id || selectedUser.real_id, selectedSpecs)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#16a34a',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        }}
                      >
                        {updatingAgent ? 'Saving...' : 'Save Specializations'}
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {SPECIALIZATION_OPTIONS.map((spec) => {
                        const isChecked = selectedSpecs.includes(spec.key);
                        return (
                          <label
                            key={spec.key}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              padding: '12px 14px',
                              borderRadius: '8px',
                              border: `1px solid ${isChecked ? '#3b82f6' : '#e2e8f0'}`,
                              background: isChecked ? '#f0f9ff' : 'var(--bg, #fff)',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...selectedSpecs, spec.key]
                                  : selectedSpecs.filter((k) => k !== spec.key);
                                setSelectedSpecs(next);
                              }}
                              style={{ marginTop: '2px', cursor: 'pointer' }}
                            />
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text, #111)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: spec.tx, display: 'inline-block' }} />
                                {spec.label}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--muted, #64748b)', marginTop: '2px' }}>
                                {spec.desc}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Agent Workspace Preview */}
                  <div style={{ marginBottom: '22px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '10px' }}>
                      AGENT WORKSPACE PREVIEW
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg, #fff)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>LEADS</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text, #111)' }}>{userDetails?.agentWorkspace?.leadsCount ?? userDetails?.agentLeads?.length ?? 0}</div>
                      </div>
                      <div style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg, #fff)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>SCHEDULE</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text, #111)' }}>{userDetails?.agentWorkspace?.scheduleCount ?? 0}</div>
                      </div>
                      <div style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg, #fff)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>PROJECTS</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text, #111)' }}>{userDetails?.agentWorkspace?.projectsCount ?? 0}</div>
                      </div>
                      <div style={{ padding: '14px 16px', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg, #fff)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>UNREAD ACTIVITY</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text, #111)' }}>{userDetails?.agentWorkspace?.unreadActivityCount ?? 0}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setShowAgentLeads((v) => !v)}
                        style={{ padding: '7px 14px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', background: 'var(--bg, #fff)', color: 'var(--text, #334155)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        {showAgentLeads ? 'Hide Leads' : 'View Leads'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAgentActivity((v) => !v)}
                        style={{ padding: '7px 14px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', background: 'var(--bg, #fff)', color: 'var(--text, #334155)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        {showAgentActivity ? 'Hide Activity' : 'View Activity Track'}
                      </button>
                    </div>

                    {showAgentLeads && (
                      <div style={{ marginTop: '12px', border: '1px solid var(--border, #e2e8f0)', borderRadius: '8px', overflow: 'hidden' }}>
                        {(userDetails?.agentLeads || []).length === 0 ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted, #64748b)', fontSize: '12px' }}>
                            No leads assigned yet.
                          </div>
                        ) : (
                          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                            {userDetails.agentLeads.map((lead) => (
                              <div key={lead.id} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border, #f1f5f9)', fontSize: '12px' }}>
                                <div style={{ fontWeight: 700 }}>{lead.client_name} · {lead.client_phone}</div>
                                <div style={{ color: 'var(--muted, #64748b)', fontSize: '11px', marginTop: '2px' }}>
                                  {lead.service_type || 'General'} · {lead.city || 'No city'} · Status: {lead.status}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border, #e2e8f0)' }}>
                    <button
                      type="button"
                      onClick={() => { setSelectedUser(null); setUserDetails(null); }}
                      style={{ padding: '8px 20px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', background: '#f8fafc', color: 'var(--text, #334155)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                    >← Back to Directory</button>
                  </div>
                </div>
              );
            }

            /* ══════════════════════════════════════════════════════
               2. VENDOR / CONTRACTOR DETAILS VIEW (Exact match to User's Uploaded Screenshot)
               ══════════════════════════════════════════════════════ */
            if (isVendor) {
              return (
                <div
                  style={{
                    width: '100%',
                    background: 'var(--bg, #fff)',
                    border: '1px solid var(--border, #e2e8f0)',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', fontWeight: 800, fontSize: '16px', overflow: 'hidden' }}>
                        {vendorData?.profile_photo ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={`/api/vendor/image/${vendorData.id || selectedUser.real_id}?type=profile`} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          (vendorData?.vendor_name || selectedUser.name || 'V').slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text, #111)' }}>
                          {vendorData?.vendor_name || selectedUser.name || 'Vendor Details'}
                        </h3>
                        <div style={{ fontSize: '12px', color: 'var(--muted, #64748b)', marginTop: '2px' }}>
                          {vendorData?.email || selectedUser.email || '—'}
                        </div>
                      </div>
                    </div>
                    
                  </div>

                  {/* CONTACT & LOCATION */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '14px' }}>
                      CONTACT & LOCATION
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', fontSize: '13px' }}>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>VENDOR NAME</div>
                        <div style={{ fontWeight: 700 }}>{vendorData?.vendor_name || selectedUser.name || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>PHONE</div>
                        <div style={{ fontWeight: 700 }}>{vendorData?.phone || selectedUser.phone || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>CITY</div>
                        <div style={{ fontWeight: 700 }}>{vendorData?.city || selectedUser.delivery_city || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>STATE</div>
                        <div style={{ fontWeight: 700 }}>{vendorData?.state || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>POSTAL CODE</div>
                        <div style={{ fontWeight: 700 }}>{vendorData?.postal_code || '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* CONTRACTOR ROLE */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '12px' }}>
                      PROJECT MANAGEMENT ROLE
                    </div>
                    <div style={{ border: '1px solid #86efac', borderRadius: '8px', background: '#f0fdf4', padding: '14px', maxWidth: '480px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: contractorSaving ? 'wait' : 'pointer' }}>
                        <input
                          type="checkbox"
                          disabled={contractorSaving}
                          checked={Boolean(vendorData?.is_contractor || vendorData?.is_project_contractor || String(vendorData?.business_type || '').toLowerCase().includes('contractor'))}
                          onChange={(event) => {
                            const isChecked = event.target.checked;
                            const currentTrade = vendorData?.contractor_trade || 'CIVIL';
                            handleContractorChange(vendorData?.id || selectedUser.real_id, isChecked, currentTrade);
                          }}
                          style={{ width: '18px', height: '18px', cursor: contractorSaving ? 'wait' : 'pointer' }}
                        />
                        <span>
                          <strong style={{ display: 'block', fontSize: '13px', color: '#166534' }}>Register as Contractor</strong>
                          <small style={{ color: '#4b5563' }}>Show this vendor in Project Management contractor selection.</small>
                        </span>
                      </label>

                      {Boolean(vendorData?.is_contractor || vendorData?.is_project_contractor || String(vendorData?.business_type || '').toLowerCase().includes('contractor')) && (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #86efac' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '6px' }}>
                            Contractor Trade <span style={{ color: '#dc2626' }}>*</span>
                          </label>
                          <select
                            disabled={contractorSaving}
                            value={vendorData?.contractor_trade || 'CIVIL'}
                            onChange={(e) => handleContractorChange(vendorData?.id || selectedUser.real_id, true, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #86efac',
                              background: '#fff',
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#0f172a',
                              cursor: contractorSaving ? 'wait' : 'pointer',
                            }}
                          >
                            <option value="CIVIL">CIVIL — Civil Contractor</option>
                            <option value="GENERAL">GENERAL — General Contractor</option>
                            <option value="PLUMBING">PLUMBING — Plumber / Plumbing</option>
                            <option value="ELECTRICIAN">ELECTRICIAN — Electrician</option>
                            <option value="MASON">MASON — Mason</option>
                            <option value="CARPENTER">CARPENTER — Carpenter</option>
                            <option value="PAINTER">PAINTER — Painter</option>
                            <option value="FABRICATOR">FABRICATOR — Fabricator</option>
                            <option value="TILE_FLOORING">TILE_FLOORING — Tile / Flooring</option>
                            <option value="WATERPROOFING">WATERPROOFING — Waterproofing</option>
                            <option value="HVAC">HVAC — HVAC</option>
                            <option value="OTHER">OTHER — Other Trade</option>
                          </select>
                          <small style={{ display: 'block', marginTop: '4px', color: '#64748b', fontSize: '11px' }}>
                            Selected trade will be used for filtering in Project Management.
                          </small>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ASSIGNED SERVICES */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '14px' }}>
                      ASSIGNED SERVICES
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2.5" style={{ paddingRight: '4px', marginBottom: '12px' }}>
                      {(userDetails?.allServices || []).map((service) => {
                        const sId = Number(service.id);
                        const isChecked = selectedServiceIds.includes(sId);
                        return (
                          <ServiceCheckboxCard
                            key={service.id}
                            service={service}
                            checked={isChecked}
                            onChange={(id, nextChecked) => {
                              setSelectedServiceIds((prev) =>
                                nextChecked ? [...prev, id] : prev.filter((x) => x !== id)
                              );
                            }}
                          />
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      disabled={serviceSaving}
                      onClick={() => handleSaveVendorServices(vendorData?.id || selectedUser.real_id, selectedServiceIds)}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        borderRadius: '7px',
                        border: 'none',
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      {serviceSaving ? 'Saving Services...' : `Save Assigned Services (${selectedServiceIds.length})`}
                    </button>
                  </div>

                  {/* IDENTITY VERIFICATION */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '12px' }}>
                      IDENTITY VERIFICATION
                    </div>

                    <div
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <span style={{ fontSize: '1.75rem' }}>🪪</span>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#15803d', marginBottom: '3px' }}>
                          Aadhaar Number
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'monospace', color: '#111' }}>
                          {vendorData?.aadhar_number
                            ? String(vendorData.aadhar_number).replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
                            : 'Not provided'}
                        </div>
                      </div>
                    </div>

                    {vendorData?.has_aadhar_image || vendorData?.aadhar_image ? (
                      <div style={{ marginTop: '8px' }}>
                        <a href={`/api/vendor/image/${vendorData.id || selectedUser.real_id}?type=aadhaar`} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/vendor/image/${vendorData.id || selectedUser.real_id}?type=aadhaar`}
                            alt="Aadhaar Card"
                            style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                          />
                        </a>
                        <div style={{ fontSize: '11px', color: 'var(--muted, #64748b)', marginTop: '4px' }}>
                          Click image to open in full size
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '12px 14px', background: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa', color: '#c2410c', fontSize: '12px', fontWeight: 600 }}>
                        ⚠️ No Aadhaar image uploaded
                      </div>
                    )}
                  </div>

                  {/* VENDOR WORKSPACE & LEADS */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '12px' }}>
                      VENDOR WORKSPACE & LEADS
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '2px' }}>TOTAL BOOKINGS</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{userDetails?.vendorWorkspace?.counts?.total_bookings ?? 0}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '2px' }}>ACTIVE JOBS</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{userDetails?.vendorWorkspace?.counts?.active_bookings ?? 0}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '2px' }}>COMPLETED JOBS</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{userDetails?.vendorWorkspace?.counts?.completed_bookings ?? 0}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '2px' }}>CRM LEADS</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{userDetails?.vendorWorkspace?.counts?.crm_leads ?? 0}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '6px' }}>
                        RECENT ASSIGNED BOOKINGS
                      </div>
                      {(userDetails?.vendorWorkspace?.bookings || []).length === 0 ? (
                        <div style={{ padding: '10px', borderRadius: '6px', background: '#f8fafc', color: 'var(--muted, #64748b)', fontSize: '12px' }}>
                          No booking has been assigned yet.
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gap: '6px' }}>
                          {userDetails.vendorWorkspace.bookings.map((b) => (
                            <div key={b.id} style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg, #fff)', fontSize: '12px' }}>
                              <div style={{ fontWeight: 700 }}>{b.service_label || 'Booking'} - {b.user_name || 'Customer'}</div>
                              <div style={{ fontSize: '11px', color: 'var(--muted, #64748b)', textTransform: 'uppercase', marginTop: '2px' }}>
                                {b.status} - {b.service_city || 'City not set'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '6px' }}>
                        CRM LEADS AVAILABLE TO THIS VENDOR
                      </div>
                      {(userDetails?.vendorWorkspace?.crm_leads || []).length === 0 ? (
                        <div style={{ padding: '10px', borderRadius: '6px', background: '#f8fafc', color: 'var(--muted, #64748b)', fontSize: '12px' }}>
                          No CRM lead is available for this vendor&apos;s city.
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gap: '6px' }}>
                          {userDetails.vendorWorkspace.crm_leads.map((l) => (
                            <div key={l.id} style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg, #fff)', fontSize: '12px' }}>
                              <div style={{ fontWeight: 700 }}>{l.client_name} · {l.service_type}</div>
                              <div style={{ fontSize: '11px', color: 'var(--muted, #64748b)', marginTop: '2px' }}>
                                {l.lead_stage || l.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STATUS */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '10px' }}>
                      STATUS
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, background: '#0284c7', color: '#fff', textTransform: 'uppercase' }}>
                        VERIFICATION: {vendorData?.verification_status || 'PENDING'}
                      </span>
                      <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, background: '#64748b', color: '#fff', textTransform: 'uppercase' }}>
                        STATUS: {vendorData?.status || 'INACTIVE'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--muted, #64748b)', marginLeft: 'auto' }}>
                        Registered: {formatDateOnly(vendorData?.created_at || selectedUser.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    <button
                      type="button"
                      disabled={vendorActionLoading}
                      onClick={() => handleApproveVendor(vendorData?.id || selectedUser.real_id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <ShieldCheck size={16} />
                      Approve Vendor
                    </button>
                    <button
                      type="button"
                      disabled={vendorActionLoading}
                      onClick={() => {
                        const reason = prompt('Enter reason for rejection:');
                        if (reason) handleRejectVendor(vendorData?.id || selectedUser.real_id, reason);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Ban size={16} />
                      Reject
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setSelectedUser(null); setUserDetails(null); }}
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', background: '#f1f5f9', color: 'var(--text, #334155)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                  >← Back to Directory</button>
                </div>
              );
            }

            /* ══════════════════════════════════════════════════════
               3. SUPPLIER DETAILS VIEW
               ══════════════════════════════════════════════════════ */
            if (isSupplier) {
              return (
                <div
                  style={{
                    width: '100%',
                    background: 'var(--bg, #fff)',
                    border: '1px solid var(--border, #e2e8f0)',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d', fontWeight: 800, fontSize: '16px' }}>
                        {(supplierData?.shop_name || supplierData?.business_name || selectedUser.name || 'S').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text, #111)' }}>
                          {supplierData?.shop_name || supplierData?.business_name || selectedUser.name || 'Supplier Details'}
                        </h3>
                        <div style={{ fontSize: '12px', color: 'var(--muted, #64748b)', marginTop: '2px' }}>
                          {supplierData?.email || selectedUser.email || '—'}
                        </div>
                      </div>
                    </div>
                    
                  </div>

                  {/* CONTACT & LOCATION */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '14px' }}>
                      CONTACT & LOCATION
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', fontSize: '13px' }}>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>SHOP NAME</div>
                        <div style={{ fontWeight: 700 }}>{supplierData?.shop_name || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>CONTACT PERSON</div>
                        <div style={{ fontWeight: 700 }}>{supplierData?.contact_person || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>PHONE</div>
                        <div style={{ fontWeight: 700 }}>{supplierData?.phone || selectedUser.phone || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>CITY</div>
                        <div style={{ fontWeight: 700 }}>{supplierData?.city || selectedUser.delivery_city || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>STATE</div>
                        <div style={{ fontWeight: 700 }}>{supplierData?.state || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '4px' }}>POSTAL CODE</div>
                        <div style={{ fontWeight: 700 }}>{supplierData?.postal_code || '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* PRODUCT CATEGORIES */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '10px' }}>
                      PRODUCT CATEGORIES
                    </div>
                    {Array.isArray(supplierData?.product_categories) && supplierData.product_categories.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {supplierData.product_categories.map((cat, idx) => (
                          <span key={idx} style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                            🚚 {cat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '12px', color: 'var(--muted, #64748b)' }}>No product categories listed.</div>
                    )}
                  </div>

                  {/* IDENTITY VERIFICATION */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '12px' }}>
                      IDENTITY VERIFICATION
                    </div>
                    <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '1.75rem' }}>🪪</span>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#15803d', marginBottom: '3px' }}>
                          Aadhaar Number ({supplierData?.aadhaar_status || 'unverified'})
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'monospace', color: '#111' }}>
                          {supplierData?.aadhaar_number
                            ? String(supplierData.aadhaar_number).replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
                            : 'Not provided'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BANK DETAILS */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '12px' }}>
                      BANK ACCOUNT DETAILS
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', padding: '14px', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', background: '#f8fafc' }}>
                      <div><span style={{ color: 'var(--muted, #64748b)' }}>Bank Name:</span> <strong>{supplierData?.bank_name || '—'}</strong></div>
                      <div><span style={{ color: 'var(--muted, #64748b)' }}>Holder:</span> <strong>{supplierData?.bank_account_holder || '—'}</strong></div>
                      <div><span style={{ color: 'var(--muted, #64748b)' }}>Account No:</span> <strong>{supplierData?.bank_account_number || '—'}</strong></div>
                      <div><span style={{ color: 'var(--muted, #64748b)' }}>IFSC:</span> <strong>{supplierData?.bank_ifsc_code || '—'}</strong></div>
                    </div>
                  </div>

                  {/* SUPPLIER WORKSPACE & STATS */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '12px' }}>
                      SUPPLIER WORKSPACE & STATS
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg, #fff)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '2px' }}>TOTAL ENQUIRIES</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{userDetails?.supplierStats?.totalEnquiries ?? 0}</div>
                      </div>
                      <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg, #fff)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '2px' }}>FULFILLED</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#16a34a' }}>{userDetails?.supplierStats?.fulfilledOrders ?? 0}</div>
                      </div>
                      <div style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', background: 'var(--bg, #fff)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', marginBottom: '2px' }}>TOTAL EARNED</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>{formatCurrency(userDetails?.supplierStats?.totalEarned)}</div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS & ACTIONS */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '10px' }}>
                      STATUS
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, background: supplierData?.status === 'approved' ? '#16a34a' : '#d97706', color: '#fff', textTransform: 'uppercase' }}>
                        STATUS: {supplierData?.status || 'PENDING'}
                      </span>
                      <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, background: supplierData?.is_active ? '#3b82f6' : '#64748b', color: '#fff', textTransform: 'uppercase' }}>
                        OPERATIONAL: {supplierData?.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--muted, #64748b)', marginLeft: 'auto' }}>
                        Registered: {formatDateOnly(supplierData?.created_at || selectedUser.created_at)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    <button
                      type="button"
                      disabled={supplierActionLoading}
                      onClick={() => handleApproveSupplier(supplierData?.id || selectedUser.real_id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#10b981',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <ShieldCheck size={16} />
                      Approve Supplier
                    </button>
                    <button
                      type="button"
                      disabled={supplierActionLoading}
                      onClick={() => {
                        const reason = prompt('Enter reason for rejection:');
                        if (reason) handleRejectSupplier(supplierData?.id || selectedUser.real_id, reason);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Ban size={16} />
                      Reject
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setSelectedUser(null); setUserDetails(null); }}
                    style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', background: '#f1f5f9', color: 'var(--text, #334155)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                  >← Back to Directory</button>
                </div>
              );
            }

            /* ══════════════════════════════════════════════════════
               4. CUSTOMER PROFILE & ORDER HISTORY VIEW
               ══════════════════════════════════════════════════════ */
            return (
              <div
                style={{
                  width: '100%',
                  background: 'var(--bg, #fff)',
                  border: '1px solid var(--border, #e2e8f0)',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1', fontWeight: 800, fontSize: '16px' }}>
                      {(selectedUser.name || 'C').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text, #111)' }}>
                        {selectedUser.name || 'Customer Profile'}
                      </h3>
                      <div style={{ fontSize: '12px', color: 'var(--muted, #64748b)', marginTop: '2px' }}>
                        {selectedUser.email || 'No email registered'}
                      </div>
                    </div>
                  </div>
                  
                </div>

                {/* CONTACT & LIFETIME STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px', padding: '16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border, #e2e8f0)', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Status</span>
                    <strong style={{ fontSize: '13px', color: selectedUser.is_blocked ? '#dc2626' : '#15803d' }}>
                      {selectedUser.is_blocked ? 'Blocked' : 'Active'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Phone</span>
                    <strong style={{ fontSize: '13px' }}>{selectedUser.phone || '—'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Delivery City</span>
                    <strong style={{ fontSize: '13px' }}>{selectedUser.delivery_city || 'Not set'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Last Login</span>
                    <strong style={{ fontSize: '13px' }}>{selectedUser.last_login_at ? formatDateTime(selectedUser.last_login_at) : 'Never logged in'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Total Orders</span>
                    <strong style={{ fontSize: '13px', color: 'var(--brand-blue, #2563eb)' }}>{userDetails?.orders?.length || selectedUser.total_orders || 0}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Lifetime Spent</span>
                    <strong style={{ fontSize: '13px', color: '#059669' }}>{formatCurrency(selectedUser.total_spent)}</strong>
                  </div>
                </div>

                {/* ORDER HISTORY */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted, #475569)', marginBottom: '12px' }}>
                    ORDER HISTORY ({userDetails?.orders?.length || 0})
                  </div>
                  {(userDetails?.orders || []).length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border, #e2e8f0)', color: 'var(--muted, #64748b)', fontSize: '12px' }}>
                      No orders placed by this customer yet.
                    </div>
                  ) : (
                    <div style={{ border: '1px solid var(--border, #e2e8f0)', borderRadius: '8px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                            <th style={{ padding: '9px 12px', textAlign: 'left' }}>Order Ref</th>
                            <th style={{ padding: '9px 12px', textAlign: 'left' }}>Item / Description</th>
                            <th style={{ padding: '9px 12px', textAlign: 'right' }}>Amount</th>
                            <th style={{ padding: '9px 12px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '9px 12px', textAlign: 'left' }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userDetails.orders.map((o, idx) => (
                            <tr key={o.reference || idx} style={{ borderBottom: '1px solid var(--border, #f1f5f9)' }}>
                              <td style={{ padding: '9px 12px', fontWeight: 700 }}>{o.reference || `#${o.id}`}</td>
                              <td style={{ padding: '9px 12px' }}>{o.description || 'Order'}</td>
                              <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800 }}>{formatCurrency(o.total)}</td>
                              <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                                <span style={{ display: 'inline-block', padding: '2px 7px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', background: '#f1f5f9', color: '#334155' }}>
                                  {o.status || 'open'}
                                </span>
                              </td>
                              <td style={{ padding: '9px 12px', color: 'var(--muted, #64748b)' }}>{formatDateTime(o.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => { setSelectedUser(null); setUserDetails(null); }}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--border, #cbd5e1)', background: '#f1f5f9', color: 'var(--text, #334155)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >← Back to Directory</button>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Block User Confirmation Modal ── */}
      {blockModalTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: 'var(--bg, #fff)',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '12px',
              maxWidth: '460px',
              width: '100%',
              padding: '22px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>
              🚫 Block Customer Account
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--muted, #64748b)' }}>
              Are you sure you want to block <strong>{blockModalTarget.name || blockModalTarget.email}</strong>?
              They will not be able to log in, place shop orders, or redeem coupons.
            </p>

            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              Reason for Blocking (Optional):
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Repeated fraudulent enquiries, spam behavior..."
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid var(--border, #cbd5e1)',
                background: 'var(--input-bg, #fff)',
                color: 'var(--text, #111)',
                marginBottom: '18px',
                resize: 'vertical',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setBlockModalTarget(null);
                  setBlockReason('');
                }}
                disabled={blocking}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border, #cbd5e1)',
                  background: 'transparent',
                  color: 'var(--text, #111)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlockUser}
                disabled={blocking}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: blocking ? 'not-allowed' : 'pointer',
                  opacity: blocking ? 0.7 : 1,
                }}
              >
                {blocking ? 'Blocking...' : 'Confirm Block'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete User Confirmation Modal ── */}
      {deleteModalTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: 'var(--bg, #fff)',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '12px',
              maxWidth: '460px',
              width: '100%',
              padding: '22px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>
              ⚠️ Delete Customer Account
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--muted, #64748b)' }}>
              Are you sure you want to permanently delete the account for{' '}
              <strong>{deleteModalTarget.name || deleteModalTarget.email}</strong>?
              This will remove their profile and address book records. This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setDeleteModalTarget(null)}
                disabled={deleting}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border, #cbd5e1)',
                  background: 'transparent',
                  color: 'var(--text, #111)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={deleting}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
