'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, Eye, Ban, ShieldCheck, Trash2, X, RefreshCw, Search,
  Calendar, MapPin, ShoppingCart, CircleDollarSign, CheckCircle2,
  AlertCircle, ActionIconButton, User, Phone, Mail, Clock,
} from '@/app/components/ui/icons';

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

export default function UserManagementAdmin({ isDarkMode = false }) {
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
  const [cityFilter, setCityFilter] = useState('');
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'has_orders' | 'zero'
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 20, total: 0, totalPages: 1 });

  // Detail Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('orders'); // 'orders' | 'coupons' | 'addresses' | 'moderation'

  // Block Modal state
  const [blockModalTarget, setBlockModalTarget] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [blocking, setBlocking] = useState(false);

  // Delete Modal state
  const [deleteModalTarget, setDeleteModalTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

      if (search.trim()) params.set('search', search.trim());
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
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
      setCities(data.cities || []);
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
  }, [authHeaders, search, statusFilter, cityFilter, orderFilter, fromDate, toDate, pageSize]);

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
    setActiveDetailTab('orders');

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

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCityFilter('');
    setOrderFilter('all');
    setFromDate('');
    setToDate('');
  };

  const hasActiveFilters = Boolean(
    search.trim() || statusFilter !== 'all' || cityFilter || orderFilter !== 'all' || fromDate || toDate
  );

  return (
    <div style={{ padding: '0.5rem 0', color: 'var(--text, #111)' }}>
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
            Total Customers
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text, #111)' }}>
            {stats.total_users}
          </div>
          <small style={{ color: 'var(--muted, #64748b)', fontSize: '11px' }}>All registered signups</small>
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
            Active Accounts
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
            Blocked Accounts
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
            Users with Orders
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
            Lifetime Customer Spend
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
              <option value="all">All Signups</option>
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
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)' }}>Registered</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)' }}>Last Login</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', textAlign: 'center' }}>Orders</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', textAlign: 'right' }}>Lifetime Spent</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted, #64748b)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--muted, #64748b)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={16} className="animate-spin" />
                      Loading customer records...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--muted, #64748b)' }}>
                    No registered customers match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const initials = (u.name || u.email || 'U')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: '1px solid var(--border, #f1f5f9)',
                        transition: 'background 0.15s',
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
                              📍 {u.delivery_city}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--muted, #94a3b8)', fontSize: '11px' }}>No city set</span>
                          )}
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600 }}>{formatDateOnly(u.created_at)}</div>
                        <div style={{ fontSize: '10px', color: 'var(--muted, #94a3b8)' }}>
                          {new Date(u.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Last Login */}
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        {u.last_login_at ? (
                          <>
                            <div style={{ fontWeight: 600 }}>{formatDateOnly(u.last_login_at)}</div>
                            <div style={{ fontSize: '10px', color: 'var(--muted, #94a3b8)' }}>
                              {new Date(u.last_login_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </>
                        ) : (
                          <span style={{ color: 'var(--muted, #94a3b8)', fontStyle: 'italic', fontSize: '11px' }}>
                            Never logged in
                          </span>
                        )}
                      </td>

                      {/* Orders Count */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            fontWeight: 700,
                            fontSize: '11px',
                            background: Number(u.total_orders) > 0 ? '#e0f2fe' : '#f1f5f9',
                            color: Number(u.total_orders) > 0 ? '#0369a1' : '#64748b',
                          }}
                        >
                          {u.total_orders} {Number(u.total_orders) === 1 ? 'order' : 'orders'}
                        </span>
                      </td>

                      {/* Lifetime Spend */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, fontSize: '13px' }}>
                        <span style={{ color: Number(u.total_spent) > 0 ? '#059669' : 'var(--muted, #94a3b8)' }}>
                          {formatCurrency(u.total_spent)}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 9px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: u.is_blocked ? '#fee2e2' : '#dcfce7',
                            color: u.is_blocked ? '#dc2626' : '#15803d',
                          }}
                        >
                          {u.is_blocked ? '● Blocked' : '● Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => openUserDetails(u)}
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
                              onClick={() => handleUnblockUser(u)}
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
                              onClick={() => {
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
                            onClick={() => setDeleteModalTarget(u)}
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

      {/* ── User Details Modal ── */}
      {selectedUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => {
            setSelectedUser(null);
            setUserDetails(null);
          }}
        >
          <div
            style={{
              background: 'var(--bg, #fff)',
              color: 'var(--text, #111)',
              border: '1px solid var(--border, #e2e8f0)',
              borderRadius: '14px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid var(--border, #e2e8f0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '999px',
                    background: selectedUser.is_blocked ? '#fee2e2' : '#e0e7ff',
                    color: selectedUser.is_blocked ? '#dc2626' : '#4338ca',
                    fontWeight: 900,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {(selectedUser.name || selectedUser.email || 'U').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                    {selectedUser.name || 'Customer Profile'}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--muted, #64748b)' }}>
                    Customer ID #{selectedUser.id} · {selectedUser.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: selectedUser.is_blocked ? '#fee2e2' : '#dcfce7',
                    color: selectedUser.is_blocked ? '#dc2626' : '#15803d',
                  }}
                >
                  {selectedUser.is_blocked ? 'Blocked' : 'Active Account'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUser(null);
                    setUserDetails(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted, #64748b)',
                    padding: '4px',
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 22px', overflowY: 'auto', flex: 1 }}>
              {/* Profile Key Info Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '12px',
                  background: 'var(--table-head-bg, #f8fafc)',
                  border: '1px solid var(--border, #e2e8f0)',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '20px',
                  fontSize: '12px',
                }}
              >
                <div>
                  <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Phone Number
                  </span>
                  <strong style={{ fontSize: '13px' }}>{selectedUser.phone || '—'}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Delivery City
                  </span>
                  <strong style={{ fontSize: '13px' }}>{selectedUser.delivery_city || 'Not set'}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Registered On
                  </span>
                  <strong style={{ fontSize: '13px' }}>{formatDateTime(selectedUser.created_at)}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Last Login
                  </span>
                  <strong style={{ fontSize: '13px' }}>{formatDateTime(selectedUser.last_login_at)}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Total Orders Placed
                  </span>
                  <strong style={{ fontSize: '13px', color: 'var(--brand-blue, #2563eb)' }}>
                    {userDetails?.user?.total_orders ?? selectedUser.total_orders}
                  </strong>
                </div>

                <div>
                  <span style={{ color: 'var(--muted, #64748b)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
                    Lifetime Spent
                  </span>
                  <strong style={{ fontSize: '13px', color: '#059669' }}>
                    {formatCurrency(userDetails?.user?.total_spent ?? selectedUser.total_spent)}
                  </strong>
                </div>
              </div>

              {/* Block Alert Banner inside modal if blocked */}
              {selectedUser.is_blocked && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#991b1b',
                    fontSize: '12px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong>Account is Blocked:</strong> {selectedUser.blocked_reason || 'No specific reason given.'}
                    {selectedUser.blocked_at && ` (on ${formatDateOnly(selectedUser.blocked_at)})`}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnblockUser(selectedUser)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #86efac',
                      background: '#dcfce7',
                      color: '#15803d',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    Unblock Account
                  </button>
                </div>
              )}

              {/* Historical Moderation Notice inside modal if currently active but has audit trail */}
              {!selectedUser.is_blocked && userDetails?.moderationLog?.length > 0 && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid var(--border, #e2e8f0)',
                    color: '#334155',
                    fontSize: '12px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <strong style={{ color: '#0f172a' }}>🛡️ Audit Trail:</strong> This account has{' '}
                    <strong>{userDetails.moderationLog.length}</strong> previous moderation record(s).
                    {userDetails.moderationLog[0]?.created_at && (
                      <span style={{ color: 'var(--muted, #64748b)', marginLeft: '4px' }}>
                        (Last: {userDetails.moderationLog[0].action}
                        {userDetails.moderationLog[0].reason ? ` — "${userDetails.moderationLog[0].reason}"` : ''} on{' '}
                        {formatDateOnly(userDetails.moderationLog[0].created_at)})
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveDetailTab('moderation')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border, #cbd5e1)',
                      background: 'var(--bg, #fff)',
                      color: 'var(--brand-blue, #2563eb)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    View History
                  </button>
                </div>
              )}

              {/* Sub-Tabs: Orders, Coupons, Addresses, Moderation */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  borderBottom: '1px solid var(--border, #e2e8f0)',
                  marginBottom: '16px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('orders')}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    borderBottom: activeDetailTab === 'orders' ? '2px solid var(--brand-blue, #2563eb)' : '2px solid transparent',
                    background: 'none',
                    color: activeDetailTab === 'orders' ? 'var(--brand-blue, #2563eb)' : 'var(--muted, #64748b)',
                    cursor: 'pointer',
                  }}
                >
                  📦 Order History ({userDetails?.orders?.length || 0})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDetailTab('coupons')}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    borderBottom: activeDetailTab === 'coupons' ? '2px solid var(--brand-blue, #2563eb)' : '2px solid transparent',
                    background: 'none',
                    color: activeDetailTab === 'coupons' ? 'var(--brand-blue, #2563eb)' : 'var(--muted, #64748b)',
                    cursor: 'pointer',
                  }}
                >
                  🏷️ Coupons Used ({userDetails?.couponUsage?.length || 0})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDetailTab('addresses')}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    borderBottom: activeDetailTab === 'addresses' ? '2px solid var(--brand-blue, #2563eb)' : '2px solid transparent',
                    background: 'none',
                    color: activeDetailTab === 'addresses' ? 'var(--brand-blue, #2563eb)' : 'var(--muted, #64748b)',
                    cursor: 'pointer',
                  }}
                >
                  📍 Saved Addresses ({userDetails?.addresses?.length || 0})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDetailTab('moderation')}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    borderBottom: activeDetailTab === 'moderation' ? '2px solid var(--brand-blue, #2563eb)' : '2px solid transparent',
                    background: 'none',
                    color: activeDetailTab === 'moderation' ? 'var(--brand-blue, #2563eb)' : 'var(--muted, #64748b)',
                    cursor: 'pointer',
                  }}
                >
                  🛡️ Moderation Log ({userDetails?.moderationLog?.length || 0})
                </button>
              </div>

              {/* Tab Contents */}
              {detailsLoading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--muted, #64748b)', fontSize: '13px' }}>
                  <RefreshCw size={16} className="animate-spin inline mr-2" />
                  Loading details...
                </div>
              ) : (
                <>
                  {/* TAB 1: ORDERS */}
                  {activeDetailTab === 'orders' && (
                    <div>
                      {userDetails?.orders?.length > 0 ? (
                        <div style={{ border: '1px solid var(--border, #e2e8f0)', borderRadius: '8px', overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                              <tr style={{ background: 'var(--table-head-bg, #f8fafc)', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Order Reference</th>
                                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Description / Item</th>
                                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '9px 12px', textAlign: 'right' }}>Total</th>
                                <th style={{ padding: '9px 12px', textAlign: 'center' }}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetails.orders.map((o, idx) => (
                                <tr key={o.reference || idx} style={{ borderBottom: '1px solid var(--border, #f1f5f9)' }}>
                                  <td style={{ padding: '9px 12px', fontWeight: 700 }}>
                                    {o.reference || `#${o.id}`}
                                  </td>
                                  <td style={{ padding: '9px 12px' }}>
                                    {o.description || 'Order'}
                                  </td>
                                  <td style={{ padding: '9px 12px', color: 'var(--muted, #64748b)' }}>
                                    {formatDateTime(o.created_at)}
                                  </td>
                                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800 }}>
                                    {formatCurrency(o.total)}
                                  </td>
                                  <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                                    <span
                                      style={{
                                        display: 'inline-block',
                                        padding: '2px 7px',
                                        borderRadius: '999px',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        background: '#f1f5f9',
                                        color: '#334155',
                                      }}
                                    >
                                      {o.status || 'open'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted, #64748b)', fontSize: '13px' }}>
                          This customer has not placed any orders yet.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: COUPONS */}
                  {activeDetailTab === 'coupons' && (
                    <div>
                      {userDetails?.couponUsage?.length > 0 ? (
                        <div style={{ border: '1px solid var(--border, #e2e8f0)', borderRadius: '8px', overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                              <tr style={{ background: 'var(--table-head-bg, #f8fafc)', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Coupon Code</th>
                                <th style={{ padding: '9px 12px', textAlign: 'right' }}>Discount Applied</th>
                                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Order Reference</th>
                                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Used Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetails.couponUsage.map((c, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--border, #f1f5f9)' }}>
                                  <td style={{ padding: '9px 12px', fontWeight: 800, color: 'var(--brand-blue, #2563eb)' }}>
                                    🏷️ {c.coupon_code}
                                  </td>
                                  <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, color: '#16a34a' }}>
                                    {formatCurrency(c.coupon_discount)}
                                  </td>
                                  <td style={{ padding: '9px 12px' }}>
                                    {c.order_reference || '—'}
                                  </td>
                                  <td style={{ padding: '9px 12px', color: 'var(--muted, #64748b)' }}>
                                    {formatDateTime(c.created_at)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted, #64748b)', fontSize: '13px' }}>
                          No coupon codes used by this customer.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: SAVED ADDRESSES */}
                  {activeDetailTab === 'addresses' && (
                    <div>
                      {userDetails?.addresses?.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                          {userDetails.addresses.map((addr) => (
                            <div
                              key={addr.id}
                              style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border, #e2e8f0)',
                                background: 'var(--bg, #fff)',
                                fontSize: '12px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', color: 'var(--brand-blue, #2563eb)' }}>
                                  {addr.label || 'Address'}
                                </span>
                                {addr.is_default && (
                                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', background: '#dcfce7', color: '#15803d' }}>
                                    Default
                                  </span>
                                )}
                              </div>
                              <div style={{ color: 'var(--text, #111)', marginBottom: '4px' }}>
                                {addr.address_line}
                              </div>
                              <div style={{ color: 'var(--muted, #64748b)', fontSize: '11px' }}>
                                {addr.city} {addr.pincode ? `— ${addr.pincode}` : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted, #64748b)', fontSize: '13px' }}>
                          No saved delivery addresses in address book.
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: MODERATION HISTORY */}
                  {activeDetailTab === 'moderation' && (
                    <div>
                      {userDetails?.moderationLog?.length > 0 ? (
                        <div style={{ border: '1px solid var(--border, #e2e8f0)', borderRadius: '8px', overflow: 'hidden' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                              <tr style={{ background: 'var(--table-head-bg, #f8fafc)', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
                                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Action</th>
                                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Admin</th>
                                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Reason / Note</th>
                                <th style={{ padding: '9px 12px', textAlign: 'left' }}>Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetails.moderationLog.map((log, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--border, #f1f5f9)' }}>
                                  <td style={{ padding: '9px 12px' }}>
                                    <span
                                      style={{
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        fontSize: '11px',
                                        color: log.action === 'blocked' ? '#dc2626' : '#16a34a',
                                      }}
                                    >
                                      {log.action}
                                    </span>
                                  </td>
                                  <td style={{ padding: '9px 12px', fontWeight: 600 }}>
                                    {log.admin_name || 'Admin'}
                                  </td>
                                  <td style={{ padding: '9px 12px', color: 'var(--muted, #64748b)' }}>
                                    {log.reason || '—'}
                                  </td>
                                  <td style={{ padding: '9px 12px', color: 'var(--muted, #64748b)' }}>
                                    {formatDateTime(log.created_at)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted, #64748b)', fontSize: '13px' }}>
                          No moderation history recorded for this user.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 22px',
                borderTop: '1px solid var(--border, #e2e8f0)',
                background: 'var(--table-head-bg, #f8fafc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {!selectedUser.is_blocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setBlockModalTarget(selectedUser);
                      setBlockReason('');
                    }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '6px',
                      border: '1px solid #fecaca',
                      background: '#fee2e2',
                      color: '#dc2626',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Block User
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUnblockUser(selectedUser)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '6px',
                      border: '1px solid #86efac',
                      background: '#dcfce7',
                      color: '#15803d',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Unblock User
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setUserDetails(null);
                }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: '1px solid var(--border, #cbd5e1)',
                  background: 'var(--bg, #fff)',
                  color: 'var(--text, #111)',
                  fontWeight: 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Close Profile
              </button>
            </div>
          </div>
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
