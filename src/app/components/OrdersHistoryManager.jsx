'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { formatIndianPhone, toIndianPhoneTel } from '@/lib/phone-utils';
import { ActionIconButton } from '@/app/components/ui/icons';
import {
  ClipboardList,
  Receipt,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  LayoutList,
  ShoppingCart,
  Wrench,
  Filter,
  RotateCcw,
  Search,
  User,
  Phone,
  MapPin,
  Package,
  AlertCircle,
  Hourglass,
  Truck,
  Circle,
  Printer,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

// Indian Lakh grouping helper
function formatINR(val, fallback = 'N/A') {
  if (val === null || val === undefined || val === '' || isNaN(Number(val))) return fallback;
  const num = Number(val);
  return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// DD-MM-YYYY date helper
function formatDate(val, fallback = 'N/A') {
  if (!val) return fallback;
  const d = new Date(val);
  if (isNaN(d.getTime())) return fallback;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// DD-MM-YYYY HH:mm helper
function formatDateTime(val, fallback = 'N/A') {
  if (!val) return fallback;
  const d = new Date(val);
  if (isNaN(d.getTime())) return fallback;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

const STATUS_CONFIG = {
  open: { label: 'Open / Placed', color: '#d97706', bg: '#fef3c7', darkBg: '#78350f33', darkColor: '#fcd34d' },
  pending: { label: 'Pending', color: '#d97706', bg: '#fef3c7', darkBg: '#78350f33', darkColor: '#fcd34d' },
  accepted: { label: 'Accepted', color: '#0f172a', bg: '#f1f5f9', darkBg: '#334155', darkColor: '#f8fafc' },
  confirmed: { label: 'Confirmed', color: '#0f172a', bg: '#f1f5f9', darkBg: '#334155', darkColor: '#f8fafc' },
  processing: { label: 'Processing', color: '#475569', bg: '#f1f5f9', darkBg: '#334155', darkColor: '#e2e8f0' },
  packed: { label: 'Packed', color: '#475569', bg: '#f1f5f9', darkBg: '#334155', darkColor: '#e2e8f0' },
  dispatched: { label: 'Dispatched', color: '#475569', bg: '#f1f5f9', darkBg: '#334155', darkColor: '#e2e8f0' },
  out_for_delivery: { label: 'Out for Delivery', color: '#0f172a', bg: '#e2e8f0', darkBg: '#334155', darkColor: '#f8fafc' },
  delivered: { label: 'Delivered', color: '#16a34a', bg: '#dcfce7', darkBg: '#15803d33', darkColor: '#4ade80' },
  fulfilled: { label: 'Fulfilled', color: '#16a34a', bg: '#dcfce7', darkBg: '#15803d33', darkColor: '#4ade80' },
  completed: { label: 'Completed', color: '#16a34a', bg: '#dcfce7', darkBg: '#15803d33', darkColor: '#4ade80' },
  cancelled: { label: 'Cancelled', color: '#dc2626', bg: '#fee2e2', darkBg: '#991b1b33', darkColor: '#f87171' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: '#fee2e2', darkBg: '#991b1b33', darkColor: '#f87171' },
  payment_failed: { label: 'Payment Failed', color: '#e11d48', bg: '#ffe4e6', darkBg: '#9f123933', darkColor: '#fb7185' },
};

function getStatusIcon(status) {
  const norm = String(status || '').toLowerCase();
  switch (norm) {
    case 'confirmed':
    case 'accepted':
      return CheckCircle2;
    case 'open':
    case 'placed':
      return Clock;
    case 'pending':
    case 'processing':
    case 'payment_pending':
      return Hourglass;
    case 'payment_failed':
      return AlertCircle;
    case 'packed':
    case 'dispatched':
    case 'out_for_delivery':
      return Truck;
    case 'delivered':
    case 'fulfilled':
    case 'completed':
      return Truck;
    case 'cancelled':
    case 'rejected':
      return XCircle;
    default:
      return Circle;
  }
}

function getStatusBadge(status, isDark) {
  const norm = String(status || 'open').toLowerCase();
  const cfg = STATUS_CONFIG[norm] || {
    label: norm.replace(/_/g, ' '),
    color: '#64748b',
    bg: '#f1f5f9',
    darkBg: '#33415533',
    darkColor: '#94a3b8',
  };
  const StatusIcon = getStatusIcon(norm);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'capitalize',
        backgroundColor: isDark ? cfg.darkBg : cfg.bg,
        color: isDark ? cfg.darkColor : cfg.color,
        border: `1px solid ${isDark ? cfg.darkColor + '40' : cfg.color + '40'}`,
        whiteSpace: 'nowrap',
      }}
    >
      <StatusIcon size={13} strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0 }} />
      <span>{cfg.label}</span>
    </span>
  );
}

export default function OrdersHistoryManager({ isDarkMode = false }) {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    total_orders: 0,
    pending_orders: 0,
    delivered_orders: 0,
    cancelled_orders: 0,
    total_revenue: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    totalCount: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  // Filters State
  const [search, setSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [deliveryFrom, setDeliveryFrom] = useState('');
  const [deliveryTo, setDeliveryTo] = useState('');
  const [activePage, setActivePage] = useState(1);

  // Bill View Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingBill, setLoadingBill] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState('');

  // Customer Details Modal State
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerMetrics, setCustomerMetrics] = useState({ totalOrders: 0, lifetimeSpend: 0, couponsUsed: [] });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingCustomerOrders, setLoadingCustomerOrders] = useState(false);
  const [customerOrdersError, setCustomerOrdersError] = useState(null);

  // Distinct cities extracted for quick filter
  const [availableCities, setAvailableCities] = useState([]);

  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('admin-token') || '';
  };

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const params = new URLSearchParams({
        page: String(activePage),
        limit: '25',
        type: typeFilter,
      });

      if (search.trim()) params.set('order_id', search.trim());
      if (customerName.trim()) params.set('customer_name', customerName.trim());
      if (phone.trim()) params.set('phone', phone.trim());
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (cityFilter.trim()) params.set('city', cityFilter.trim());
      if (createdFrom) params.set('created_from', createdFrom);
      if (createdTo) params.set('created_to', createdTo);
      if (deliveryFrom) params.set('delivery_from', deliveryFrom);
      if (deliveryTo) params.set('delivery_to', deliveryTo);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load orders history');
      }

      setOrders(data.orders || []);
      setSummary(data.summary || {});
      setPagination(data.pagination || { page: 1, limit: 25, totalCount: 0, totalPages: 1 });

      // Gather distinct cities
      const cities = Array.from(new Set((data.orders || []).map((o) => o.delivery_city).filter(Boolean)));
      if (cities.length > 0) {
        setAvailableCities((prev) => Array.from(new Set([...prev, ...cities])));
      }
    } catch (err) {
      console.error('fetchOrders error:', err);
      setError(err.message || 'Error loading orders');
    } finally {
      setLoading(false);
    }
  }, [activePage, typeFilter, search, customerName, phone, statusFilter, cityFilter, createdFrom, createdTo, deliveryFrom, deliveryTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setCustomerName('');
    setPhone('');
    setStatusFilter('all');
    setCityFilter('');
    setTypeFilter('all');
    setCreatedFrom('');
    setCreatedTo('');
    setDeliveryFrom('');
    setDeliveryTo('');
    setActivePage(1);
  };

  // Export CSV
  const handleExportCSV = () => {
    const token = getAuthToken();
    const params = new URLSearchParams({
      export: 'csv',
      type: typeFilter,
    });
    if (search.trim()) params.set('order_id', search.trim());
    if (customerName.trim()) params.set('customer_name', customerName.trim());
    if (phone.trim()) params.set('phone', phone.trim());
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
    if (cityFilter.trim()) params.set('city', cityFilter.trim());
    if (createdFrom) params.set('created_from', createdFrom);
    if (createdTo) params.set('created_to', createdTo);
    if (deliveryFrom) params.set('delivery_from', deliveryFrom);
    if (deliveryTo) params.set('delivery_to', deliveryTo);

    window.open(`/api/admin/orders?${params.toString()}&token=${encodeURIComponent(token)}`, '_blank');
  };

  // Open Bill Modal
  const handleViewBill = async (orderId) => {
    setLoadingBill(true);
    setStatusSuccessMsg('');
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.order) {
        setSelectedOrder(data.order);
      } else {
        alert(data.error || 'Unable to fetch bill details');
      }
    } catch (err) {
      console.error('handleViewBill error:', err);
      alert('Error fetching bill');
    } finally {
      setLoadingBill(false);
    }
  };

  // Update Status from Dropdown inside Bill Modal
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setStatusUpdating(true);
    setStatusSuccessMsg('');
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          type: selectedOrder.type,
          notes: `Status changed to ${newStatus} by admin`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id && o.type === selectedOrder.type ? { ...o, status: newStatus } : o))
        );
        setStatusSuccessMsg(`Status updated to ${newStatus.toUpperCase()}`);
        setTimeout(() => setStatusSuccessMsg(''), 4000);
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error('handleUpdateStatus error:', err);
      alert('Error updating status');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Open Customer Drawer
  const handleOpenCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerDrawerOpen(true);
    setCustomerProfile(null);
    setCustomerOrders([]);
    setCustomerOrdersError(null);

    const customerKey = customer.customer_id || customer.customer_phone || customer.customer_email;
    if (!customerKey) return;

    // Load Profile independently
    setLoadingProfile(true);
    const token = getAuthToken();
    fetch(`/api/admin/customers/${customerKey}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setCustomerProfile(data.profile);
        } else {
          setCustomerProfile({
            name: customer.customer_name || 'Customer',
            phone: customer.customer_phone || 'N/A',
            email: customer.customer_email || 'N/A',
            delivery_city: customer.delivery_city || 'N/A',
            delivery_address: customer.delivery_address || 'N/A',
            is_blocked: false,
            created_at: null,
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching customer profile:', err);
        setCustomerProfile({
          name: customer.customer_name || 'Customer',
          phone: customer.customer_phone || 'N/A',
          email: customer.customer_email || 'N/A',
          delivery_city: customer.delivery_city || 'N/A',
          delivery_address: customer.delivery_address || 'N/A',
        });
      })
      .finally(() => setLoadingProfile(false));

    // Load Customer Orders independently (batched query)
    setLoadingCustomerOrders(true);
    const phoneParam = customer.customer_phone ? `?phone=${encodeURIComponent(customer.customer_phone)}` : '';
    fetch(`/api/admin/customers/${customerKey}/orders${phoneParam}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCustomerOrders(data.orders || []);
          setCustomerMetrics({
            totalOrders: data.total_orders || 0,
            lifetimeSpend: data.lifetime_spend || 0,
            couponsUsed: data.coupons_used || [],
          });
        } else {
          setCustomerOrdersError(data.error || 'Unable to load orders');
        }
      })
      .catch((err) => {
        console.error('Error fetching customer orders:', err);
        setCustomerOrdersError('Unable to load customer orders');
      })
      .finally(() => setLoadingCustomerOrders(false));
  };

  // Styling tokens
  const cardBg = isDarkMode ? '#1e293b' : '#ffffff';
  const cardBorder = isDarkMode ? '#334155' : '#e2e8f0';
  const textPrimary = isDarkMode ? '#f8fafc' : '#0f172a';
  const textMuted = isDarkMode ? '#94a3b8' : '#64748b';
  const headerBg = isDarkMode ? '#0f172a' : '#f8fafc';
  const rowHover = isDarkMode ? '#33415540' : '#f1f5f9';

  return (
    <div
      className={`orders-history-manager ${isDarkMode ? 'is-dark' : 'is-light'}`}
      style={{ padding: '1.25rem', minHeight: '100vh', color: textPrimary }}
    >
      {/* ── Top Header & Actions ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={26} strokeWidth={2} aria-hidden="true" /> Orders History
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: textMuted }}>
            Unified customer orders, service bookings, itemized bills, and customer analytics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
              color: textPrimary,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            <RefreshCw size={15} strokeWidth={2} className={loading ? 'animate-spin' : ''} aria-hidden="true" /> Refresh
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: isDarkMode ? '#334155' : '#0f172a',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Download size={15} strokeWidth={2} aria-hidden="true" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Summary Metric Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Total Orders */}
        <div
          style={{
            position: 'relative',
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '12px',
            padding: '1.15rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: `4px solid ${isDarkMode ? '#94a3b8' : '#0f172a'}`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
              color: isDarkMode ? '#f8fafc' : '#0f172a',
            }}
          >
            <ShoppingBag size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>
            Total Orders
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '4px 0 0', color: textPrimary }}>
            {summary.total_orders}
          </div>
          <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '4px' }}>Matching current filters</div>
        </div>

        {/* Pending Orders */}
        <div
          style={{
            position: 'relative',
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '12px',
            padding: '1.15rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #f59e0b',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDarkMode ? '#78350f33' : '#fef3c7',
              color: isDarkMode ? '#fcd34d' : '#f59e0b',
            }}
          >
            <Clock size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>
            Pending / Open
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '4px 0 0', color: '#f59e0b' }}>
            {summary.pending_orders}
          </div>
          <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '4px' }}>Requires fulfillment</div>
        </div>

        {/* Delivered Orders */}
        <div
          style={{
            position: 'relative',
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '12px',
            padding: '1.15rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #16a34a',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDarkMode ? '#15803d33' : '#dcfce7',
              color: isDarkMode ? '#4ade80' : '#16a34a',
            }}
          >
            <CheckCircle2 size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>
            Delivered / Fulfilled
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '4px 0 0', color: '#16a34a' }}>
            {summary.delivered_orders}
          </div>
          <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '4px' }}>Successfully completed</div>
        </div>

        {/* Cancelled Orders */}
        <div
          style={{
            position: 'relative',
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '12px',
            padding: '1.15rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #dc2626',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDarkMode ? '#991b1b33' : '#fee2e2',
              color: isDarkMode ? '#f87171' : '#dc2626',
            }}
          >
            <XCircle size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>
            Cancelled
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, margin: '4px 0 0', color: '#dc2626' }}>
            {summary.cancelled_orders}
          </div>
          <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '4px' }}>Rejected or aborted</div>
        </div>

        {/* Total Revenue */}
        <div
          style={{
            position: 'relative',
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '12px',
            padding: '1.15rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #8b5cf6',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDarkMode ? '#6d28d933' : '#ede9fe',
              color: isDarkMode ? '#a78bfa' : '#8b5cf6',
            }}
          >
            <IndianRupee size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>
            Total Revenue
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, margin: '4px 0 0', color: '#8b5cf6' }}>
            {formatINR(summary.total_revenue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: textMuted, marginTop: '4px' }}>Lakh formatted sum</div>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div
        style={{
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} strokeWidth={2} aria-hidden="true" /> Filters & Search
          </div>

          {/* Type Toggle */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9',
              borderRadius: '8px',
              padding: '3px',
              gap: '2px',
            }}
          >
            {[
              { id: 'all', label: 'All Orders', icon: LayoutList },
              { id: 'shop_order', label: 'Shop Orders', icon: ShoppingCart },
              { id: 'service_booking', label: 'Service Bookings', icon: Wrench },
            ].map((t) => {
              const TabIcon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTypeFilter(t.id);
                    setActivePage(1);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: typeFilter === t.id ? 700 : 500,
                    cursor: 'pointer',
                    backgroundColor: typeFilter === t.id ? (isDarkMode ? '#334155' : '#0f172a') : 'transparent',
                    color: typeFilter === t.id ? '#ffffff' : textMuted,
                    transition: 'all 0.15s ease',
                  }}
                >
                  <TabIcon size={14} strokeWidth={2} aria-hidden="true" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {/* Order ID */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textMuted, marginBottom: '4px' }}>
              Order / Booking ID
            </label>
            <div style={{ position: 'relative' }}>
              <Search
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: textMuted,
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="e.g. MO-1790..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: '6px',
                  border: `1px solid ${cardBorder}`,
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                  color: textPrimary,
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textMuted, marginBottom: '4px' }}>
              Customer Name
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: textMuted,
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Filter by name..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: '6px',
                  border: `1px solid ${cardBorder}`,
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                  color: textPrimary,
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textMuted, marginBottom: '4px' }}>
              Customer Phone
            </label>
            <div style={{ position: 'relative' }}>
              <Phone
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: textMuted,
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="e.g. 987654..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: '6px',
                  border: `1px solid ${cardBorder}`,
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                  color: textPrimary,
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textMuted, marginBottom: '4px' }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setActivePage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: `1px solid ${cardBorder}`,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: textPrimary,
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open / Placed</option>
              <option value="accepted">Accepted</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="packed">Packed</option>
              <option value="dispatched">Dispatched</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered / Fulfilled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Delivery City */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textMuted, marginBottom: '4px' }}>
              Delivery City
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: textMuted,
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="e.g. Moradabad"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: '6px',
                  border: `1px solid ${cardBorder}`,
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                  color: textPrimary,
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Created Date From */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textMuted, marginBottom: '4px' }}>
              Created From
            </label>
            <input
              type="date"
              value={createdFrom}
              onChange={(e) => setCreatedFrom(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: `1px solid ${cardBorder}`,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: textPrimary,
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Created Date To */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textMuted, marginBottom: '4px' }}>
              Created To
            </label>
            <input
              type="date"
              value={createdTo}
              onChange={(e) => setCreatedTo(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: `1px solid ${cardBorder}`,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: textPrimary,
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Delivery Date From */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textMuted, marginBottom: '4px' }}>
              Delivery From
            </label>
            <input
              type="date"
              value={deliveryFrom}
              onChange={(e) => setDeliveryFrom(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: `1px solid ${cardBorder}`,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: textPrimary,
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Delivery Date To */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: textMuted, marginBottom: '4px' }}>
              Delivery To
            </label>
            <input
              type="date"
              value={deliveryTo}
              onChange={(e) => setDeliveryTo(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '6px',
                border: `1px solid ${cardBorder}`,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                color: textPrimary,
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Reset Action */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
                border: `1px solid ${cardBorder}`,
                color: textPrimary,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* ── Error Message ── */}
      {error && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #f87171',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '1rem',
            color: '#b91c1c',
            fontSize: '0.9rem',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ── Orders Table Panel ── */}
      <div
        style={{
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
          <table style={{ width: '100%', minWidth: '1280px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: headerBg, borderBottom: `2px solid ${cardBorder}` }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: textMuted, minWidth: '220px', whiteSpace: 'nowrap' }}>ORDER / BOOKING ID</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: textMuted, minWidth: '130px', whiteSpace: 'nowrap' }}>TYPE</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: textMuted, minWidth: '160px', whiteSpace: 'nowrap' }}>CUSTOMER NAME</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: textMuted, minWidth: '140px', whiteSpace: 'nowrap' }}>MOBILE NUMBER</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: textMuted, minWidth: '180px' }}>PRODUCT SUMMARY</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: textMuted, minWidth: '100px', whiteSpace: 'nowrap' }}>QUANTITY</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: textMuted, minWidth: '120px', whiteSpace: 'nowrap' }}>GRAND TOTAL</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: textMuted, minWidth: '120px', whiteSpace: 'nowrap' }}>CREATED DATE</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: textMuted, minWidth: '120px', whiteSpace: 'nowrap' }}>DELIVERY DATE</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: textMuted, minWidth: '130px', whiteSpace: 'nowrap' }}>STATUS</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: textMuted, textAlign: 'center', minWidth: '110px', whiteSpace: 'nowrap' }}>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} style={{ padding: '40px', textAlign: 'center', color: textMuted }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 600 }}>
                      <span className="spinner-border animate-spin">⏳</span> Loading orders history...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ padding: '48px', textAlign: 'center', color: textMuted }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: textPrimary }}>No Orders Found</div>
                    <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                      Try adjusting your search criteria or resetting filters.
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={`${o.type}-${o.id}`}
                    style={{
                      borderBottom: `1px solid ${cardBorder}`,
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = rowHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Order ID */}
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, minWidth: '220px', whiteSpace: 'nowrap' }}>
                      <span style={{ color: textPrimary }}>{o.order_id}</span>
                    </td>

                    {/* Type */}
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: isDarkMode ? '#27272a' : '#f4f4f5',
                          color: textPrimary,
                          border: `1px solid ${cardBorder}`,
                        }}
                      >
                        {o.type === 'shop_order' ? (
                          <Package size={13} strokeWidth={2} aria-hidden="true" />
                        ) : (
                          <Wrench size={13} strokeWidth={2} aria-hidden="true" />
                        )}
                        {o.type_label || (o.type === 'shop_order' ? 'Shop Material' : 'Service Booking')}
                      </span>
                    </td>

                    {/* Customer Name (Clickable) */}
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenCustomer(o)}
                        className="orders-customer-name-btn"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          color: textPrimary,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          textAlign: 'left',
                          fontSize: '0.85rem',
                        }}
                        title="Click to view Customer details & full order history"
                      >
                        {o.customer_name || 'Customer'}
                      </button>
                    </td>

                    {/* Mobile Number */}
                    <td
                      style={{
                        padding: '12px 14px',
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace',
                        fontVariantNumeric: 'tabular-nums',
                        fontSize: '0.85rem',
                        color: o.customer_phone && o.customer_phone !== 'N/A' ? textPrimary : textMuted,
                      }}
                    >
                      {toIndianPhoneTel(o.customer_phone) ? (
                        <a
                          href={toIndianPhoneTel(o.customer_phone)}
                          style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                          title={`Call ${o.customer_name || 'Customer'}`}
                        >
                          <Phone size={13} strokeWidth={2} aria-hidden="true" style={{ opacity: 0.7 }} />
                          {formatIndianPhone(o.customer_phone)}
                        </a>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          {o.customer_phone && o.customer_phone !== 'N/A' && (
                            <Phone size={13} strokeWidth={2} aria-hidden="true" style={{ opacity: 0.5 }} />
                          )}
                          {formatIndianPhone(o.customer_phone)}
                        </span>
                      )}
                    </td>

                    {/* Product Summary */}
                    <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                      <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {o.product_name}
                      </div>
                      {o.category_name && (
                        <div style={{ fontSize: '0.72rem', color: textMuted }}>
                          {o.category_name} {o.brand_company ? `· ${o.brand_company}` : ''}
                        </div>
                      )}
                    </td>

                    {/* Quantity */}
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                      {o.quantity_text || '1 unit'}
                    </td>

                    {/* Grand Total */}
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: textPrimary }}>
                      {formatINR(o.grand_total)}
                    </td>

                    {/* Created Date */}
                    <td style={{ padding: '12px 14px', color: textMuted, whiteSpace: 'nowrap' }}>
                      {formatDate(o.created_at)}
                    </td>

                    {/* Delivery Date */}
                    <td style={{ padding: '12px 14px', color: textMuted, whiteSpace: 'nowrap' }}>
                      {formatDate(o.delivery_date)}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '12px 14px' }}>
                      {getStatusBadge(o.status, isDarkMode)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <ActionIconButton
                        icon={Receipt}
                        label="View Bill"
                        onClick={() => handleViewBill(o.order_id || o.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination Controls ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderTop: `1px solid ${cardBorder}`,
            backgroundColor: headerBg,
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ color: textMuted }}>
            Showing {orders.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount} orders
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: `1px solid ${cardBorder}`,
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                color: textPrimary,
                cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                opacity: pagination.page <= 1 ? 0.5 : 1,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
              Previous
            </button>

            <span style={{ padding: '0 8px', fontWeight: 700 }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setActivePage((p) => Math.min(pagination.totalPages, p + 1))}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: `1px solid ${cardBorder}`,
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                color: textPrimary,
                cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                opacity: pagination.page >= pagination.totalPages ? 0.5 : 1,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Next
              <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bill / Invoice Modal ── */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrder(null);
          }}
        >
          <div
            id="print-invoice-area"
            style={{
              backgroundColor: cardBg,
              color: textPrimary,
              width: '100%',
              maxWidth: '820px',
              maxHeight: '92vh',
              overflowY: 'auto',
              borderRadius: '16px',
              border: `1px solid ${cardBorder}`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: `1px solid ${cardBorder}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: headerBg,
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    Invoice / Bill #{selectedOrder.order_id}
                  </h2>
                  {getStatusBadge(selectedOrder.status, isDarkMode)}
                </div>
                <div style={{ fontSize: '0.8rem', color: textMuted, marginTop: '2px' }}>
                  Placed on {formatDateTime(selectedOrder.created_at)} · Delivery City: {selectedOrder.delivery_city}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
                    color: textPrimary,
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Printer size={15} strokeWidth={2} aria-hidden="true" /> Print
                </button>

                <a
                  href={`/api/admin/orders/${selectedOrder.id}/pdf?type=${encodeURIComponent(selectedOrder.type || 'shop_order')}`}
                  download={`invoice-${selectedOrder.order_id}.pdf`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: isDarkMode ? '#334155' : '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                  }}
                >
                  <Download size={15} strokeWidth={2} aria-hidden="true" /> Download PDF
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: textMuted,
                    padding: '6px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Close invoice modal"
                  title="Close"
                >
                  <X size={20} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Status Update Banner */}
              <div
                style={{
                  backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                  border: `1px solid ${cardBorder}`,
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Admin Status Controls:</span>
                  <span style={{ fontSize: '0.8rem', color: textMuted, marginLeft: '8px' }}>
                    Changes are recorded in the audit log (pm_audit_log).
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    value={selectedOrder.status || 'open'}
                    disabled={statusUpdating}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: `1px solid ${cardBorder}`,
                      backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                      color: textPrimary,
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    <option value="open">Open / Placed</option>
                    <option value="accepted">Accepted</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered / Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  {statusUpdating && <span style={{ fontSize: '0.8rem', color: textMuted }}>Saving...</span>}
                  {statusSuccessMsg && (
                    <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>
                      ✓ {statusSuccessMsg}
                    </span>
                  )}
                </div>
              </div>

              {/* Order Info & Customer Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                {/* Customer Block */}
                <div
                  style={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '10px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textPrimary, textTransform: 'uppercase', marginBottom: '8px' }}>
                    👤 Customer Details
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                    <button
                      type="button"
                      onClick={() => handleOpenCustomer(selectedOrder)}
                      className="orders-customer-name-btn"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: textPrimary,
                        fontWeight: 800,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '1.05rem',
                      }}
                      title="Open full customer profile"
                    >
                      {selectedOrder.customer_name || 'Customer'}
                    </button>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: textMuted, marginTop: '4px' }}>
                    <strong>Phone:</strong>{' '}
                    {toIndianPhoneTel(selectedOrder.customer_phone) ? (
                      <a
                        href={toIndianPhoneTel(selectedOrder.customer_phone)}
                        style={{ color: 'inherit', textDecoration: 'none', fontVariantNumeric: 'tabular-nums' }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                        title="Call customer"
                      >
                        {formatIndianPhone(selectedOrder.customer_phone)}
                      </a>
                    ) : (
                      formatIndianPhone(selectedOrder.customer_phone)
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: textMuted, marginTop: '2px' }}>
                    <strong>Email:</strong> {selectedOrder.customer_email || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: textMuted, marginTop: '4px' }}>
                    <strong>Delivery Address:</strong> {selectedOrder.delivery_address || 'N/A'}
                  </div>
                </div>

                {/* Fulfillment / Supplier Block */}
                <div
                  style={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '10px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textPrimary, textTransform: 'uppercase', marginBottom: '8px' }}>
                    🏪 Partner & Fulfillment
                  </div>
                  {selectedOrder.supplier ? (
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800 }}>{selectedOrder.supplier.shop_name}</div>
                      <div style={{ fontSize: '0.85rem', color: textMuted, marginTop: '2px' }}>
                        {selectedOrder.supplier.business_name}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: textMuted, marginTop: '2px' }}>
                        <strong>Phone:</strong>{' '}
                        {toIndianPhoneTel(selectedOrder.supplier.phone) ? (
                          <a
                            href={toIndianPhoneTel(selectedOrder.supplier.phone)}
                            style={{ color: 'inherit', textDecoration: 'none', fontVariantNumeric: 'tabular-nums' }}
                          >
                            {formatIndianPhone(selectedOrder.supplier.phone)}
                          </a>
                        ) : (
                          formatIndianPhone(selectedOrder.supplier.phone)
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: textMuted, marginTop: '2px' }}>
                        <strong>City:</strong> {selectedOrder.supplier.city || 'N/A'}
                      </div>
                    </div>
                  ) : selectedOrder.vendor ? (
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800 }}>{selectedOrder.vendor.vendor_name || selectedOrder.vendor.shop_name}</div>
                      <div style={{ fontSize: '0.85rem', color: textMuted, marginTop: '2px' }}>
                        <strong>Phone:</strong>{' '}
                        {toIndianPhoneTel(selectedOrder.vendor.phone) ? (
                          <a
                            href={toIndianPhoneTel(selectedOrder.vendor.phone)}
                            style={{ color: 'inherit', textDecoration: 'none', fontVariantNumeric: 'tabular-nums' }}
                          >
                            {formatIndianPhone(selectedOrder.vendor.phone)}
                          </a>
                        ) : (
                          formatIndianPhone(selectedOrder.vendor.phone)
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: textMuted, marginTop: '2px' }}>
                        <strong>City:</strong> {selectedOrder.vendor.city || 'N/A'}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700 }}>Direct Platform Operations</div>
                      <div style={{ fontSize: '0.85rem', color: textMuted, marginTop: '4px' }}>
                        Fulfilled via MT-Boss central logistics
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px dashed ${cardBorder}`, fontSize: '0.85rem' }}>
                    <strong>Payment Mode:</strong> {selectedOrder.payment_mode || 'Cash on Delivery / Standard'}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>Order Line Items</h3>
                <div style={{ border: `1px solid ${cardBorder}`, borderRadius: '10px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead style={{ backgroundColor: headerBg, borderBottom: `1px solid ${cardBorder}` }}>
                      <tr>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: textMuted }}>PRODUCT / SERVICE</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: textMuted }}>UNIT</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: textMuted }}>QUANTITY</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: textMuted, textAlign: 'right' }}>RATE</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: textMuted, textAlign: 'right' }}>AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.items || []).map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: idx < selectedOrder.items.length - 1 ? `1px solid ${cardBorder}` : 'none' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <div style={{ fontWeight: 700 }}>{item.name || 'N/A'}</div>
                            {item.category && item.category !== 'N/A' && (
                              <div style={{ fontSize: '0.72rem', color: textMuted }}>
                                {item.category} {item.brand && item.brand !== 'N/A' ? `· ${item.brand}` : ''}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px', color: textMuted }}>{item.unit || 'N/A'}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.quantity || '1'}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatINR(item.rate)}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                            {formatINR(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '340px',
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '10px',
                    padding: '1rem',
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: textMuted }}>
                    <span>Product Total:</span>
                    <strong style={{ color: textPrimary }}>{formatINR(selectedOrder.product_total)}</strong>
                  </div>

                  {Number(selectedOrder.coupon_discount || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                      <span>Coupon Discount {selectedOrder.coupon_code ? `(${selectedOrder.coupon_code})` : ''}:</span>
                      <strong>- {formatINR(selectedOrder.coupon_discount)}</strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: textMuted }}>
                    <span>Shipping Cost:</span>
                    <strong style={{ color: textPrimary }}>
                      {Number(selectedOrder.shipping_cost || 0) > 0 ? formatINR(selectedOrder.shipping_cost) : 'Free / N/A'}
                    </strong>
                  </div>

                  <div
                    style={{
                      borderTop: `1px solid ${cardBorder}`,
                      marginTop: '6px',
                      paddingTop: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                    }}
                  >
                    <span>Grand Total:</span>
                    <span style={{ color: textPrimary }}>{formatINR(selectedOrder.grand_total)}</span>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.notes && (
                <div
                  style={{
                    backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                  }}
                >
                  <strong>Notes / Remarks:</strong> {selectedOrder.notes}
                </div>
              )}

              {/* Event Timeline */}
              {selectedOrder.events && selectedOrder.events.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px', color: textMuted }}>
                    Order Timeline & Audit Events
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedOrder.events.map((ev, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '0.8rem',
                          borderLeft: `2px solid ${isDarkMode ? '#64748b' : '#0f172a'}`,
                          paddingLeft: '10px',
                        }}
                      >
                        <div style={{ minWidth: '130px', color: textMuted }}>
                          {formatDateTime(ev.created_at)}
                        </div>
                        <div>
                          <strong style={{ textTransform: 'capitalize' }}>{ev.title || ev.status}:</strong>{' '}
                          <span>{ev.note || 'Status updated'}</span>{' '}
                          <span style={{ color: textMuted, fontSize: '0.72rem' }}>
                            ({ev.actor_role} - {ev.actor_name || 'MT-Boss'})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: `1px solid ${cardBorder}`,
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: headerBg,
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: `1px solid ${cardBorder}`,
                  backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
                  color: textPrimary,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Close Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Customer Details Drawer / Modal ── */}
      {customerDrawerOpen && selectedCustomer && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 1100,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setCustomerDrawerOpen(false);
          }}
        >
          <div
            style={{
              backgroundColor: cardBg,
              color: textPrimary,
              width: '100%',
              maxWidth: '650px',
              height: '100%',
              overflowY: 'auto',
              boxShadow: '-10px 0 25px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: `1px solid ${cardBorder}`,
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: `1px solid ${cardBorder}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: headerBg,
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Customer Profile & Analytics
                </h2>
                <div style={{ fontSize: '0.8rem', color: textMuted, marginTop: '2px' }}>
                  Complete order history and lifetime spend
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCustomerDrawerOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: textMuted,
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Close customer drawer"
                title="Close"
              >
                <X size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {/* Drawer Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Profile Card */}
              {loadingProfile ? (
                <div style={{ padding: '20px', textAlign: 'center', color: textMuted }}>
                  ⏳ Loading customer profile...
                </div>
              ) : customerProfile ? (
                <div
                  style={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '12px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{customerProfile.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.85rem', color: textMuted }}>
                        📧 {customerProfile.email || 'N/A'} · 📞{' '}
                        {toIndianPhoneTel(customerProfile.phone) ? (
                          <a
                            href={toIndianPhoneTel(customerProfile.phone)}
                            style={{ color: 'inherit', textDecoration: 'none', fontVariantNumeric: 'tabular-nums' }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                            title="Call customer"
                          >
                            {formatIndianPhone(customerProfile.phone)}
                          </a>
                        ) : (
                          formatIndianPhone(customerProfile.phone)
                        )}
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: customerProfile.is_blocked ? '#fee2e2' : '#dcfce7',
                        color: customerProfile.is_blocked ? '#dc2626' : '#16a34a',
                      }}
                    >
                      {customerProfile.is_blocked ? '⛔ Blocked' : '✅ Active Customer'}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '0.75rem',
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: `1px solid ${cardBorder}`,
                      fontSize: '0.82rem',
                    }}
                  >
                    <div>
                      <span style={{ color: textMuted, display: 'block' }}>City:</span>
                      <strong>{customerProfile.delivery_city || 'N/A'}</strong>
                    </div>

                    <div>
                      <span style={{ color: textMuted, display: 'block' }}>Signed Up:</span>
                      <strong>{formatDate(customerProfile.created_at)}</strong>
                    </div>

                    <div>
                      <span style={{ color: textMuted, display: 'block' }}>Last Login:</span>
                      <strong>{formatDate(customerProfile.last_login_at)}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem', fontSize: '0.82rem' }}>
                    <span style={{ color: textMuted, display: 'block' }}>Delivery Address:</span>
                    <strong>{customerProfile.delivery_address || 'N/A'}</strong>
                  </div>
                </div>
              ) : null}

              {/* Lifetime Stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '10px',
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>
                    Total Orders
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: textPrimary, marginTop: '4px' }}>
                    {customerMetrics.totalOrders}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                    border: `1px solid ${cardBorder}`,
                    borderRadius: '10px',
                    padding: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: textMuted, textTransform: 'uppercase' }}>
                    Lifetime Spend
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
                    {formatINR(customerMetrics.lifetimeSpend)}
                  </div>
                </div>
              </div>

              {/* Coupons Used */}
              {customerMetrics.couponsUsed && customerMetrics.couponsUsed.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: textMuted }}>
                    Coupons Used:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {customerMetrics.couponsUsed.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
                          color: textPrimary,
                          border: `1px dashed ${cardBorder}`,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        🏷️ {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Orders Table (Independently Loaded) */}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '8px' }}>
                  All Customer Orders ({customerOrders.length})
                </h3>

                {loadingCustomerOrders ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: textMuted }}>
                    ⏳ Loading customer orders...
                  </div>
                ) : customerOrdersError ? (
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      borderRadius: '8px',
                      border: '1px solid #f87171',
                      fontSize: '0.85rem',
                    }}
                  >
                    ⚠️ {customerOrdersError}
                  </div>
                ) : customerOrders.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: textMuted }}>
                    No order history recorded for this customer yet.
                  </div>
                ) : (
                  <div style={{ border: `1px solid ${cardBorder}`, borderRadius: '10px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                      <thead style={{ backgroundColor: headerBg, borderBottom: `1px solid ${cardBorder}` }}>
                        <tr>
                          <th style={{ padding: '8px 10px', fontWeight: 700, color: textMuted }}>DATE</th>
                          <th style={{ padding: '8px 10px', fontWeight: 700, color: textMuted }}>ORDER ID</th>
                          <th style={{ padding: '8px 10px', fontWeight: 700, color: textMuted }}>ITEMS</th>
                          <th style={{ padding: '8px 10px', fontWeight: 700, color: textMuted }}>TOTAL</th>
                          <th style={{ padding: '8px 10px', fontWeight: 700, color: textMuted }}>STATUS</th>
                          <th style={{ padding: '8px 10px', fontWeight: 700, color: textMuted, textAlign: 'center' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerOrders.map((co) => (
                          <tr key={`${co.type}-${co.id}`} style={{ borderBottom: `1px solid ${cardBorder}` }}>
                            <td style={{ padding: '8px 10px', color: textMuted, whiteSpace: 'nowrap' }}>
                              {formatDate(co.created_at)}
                            </td>
                            <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 700 }}>
                              {co.order_id}
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              {co.product_name} ({co.quantity_text || '1'})
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 700 }}>
                              {formatINR(co.grand_total)}
                            </td>
                            <td style={{ padding: '8px 10px' }}>
                              {getStatusBadge(co.status, isDarkMode)}
                            </td>
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleViewBill(co.order_id || co.id)}
                                style={{
                                  backgroundColor: isDarkMode ? '#334155' : '#0f172a',
                                  color: '#ffffff',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                View Bill
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: `1px solid ${cardBorder}`,
                display: 'flex',
                justifyContent: 'flex-end',
                backgroundColor: headerBg,
                marginTop: 'auto',
              }}
            >
              <button
                type="button"
                onClick={() => setCustomerDrawerOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${cardBorder}`,
                  backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
                  color: textPrimary,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Global Stylesheet for Orders History & Print ── */}
      <style jsx global>{`
        /* Forcefully prevent global blue button overrides */
        .orders-history-manager button.orders-customer-name-btn,
        button.orders-customer-name-btn {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          border: none !important;
          box-shadow: none !important;
          transform: none !important;
          color: inherit !important;
          text-decoration: underline !important;
          padding: 0 !important;
          cursor: pointer !important;
          font-family: inherit !important;
        }

        .orders-history-manager button.orders-customer-name-btn:hover,
        .orders-history-manager button.orders-customer-name-btn:active,
        .orders-history-manager button.orders-customer-name-btn:focus,
        button.orders-customer-name-btn:hover {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
          box-shadow: none !important;
          transform: none !important;
          color: inherit !important;
          text-decoration: underline !important;
        }

        .orders-history-manager .action-icon-btn,
        button.action-icon-btn {
          background-color: #ffffff !important;
          background-image: none !important;
          border: 1px solid #e2e8f0 !important;
          color: #0f172a !important;
          box-shadow: none !important;
          transform: none !important;
          width: 32px !important;
          height: 32px !important;
          min-width: 32px !important;
          min-height: 32px !important;
          padding: 0 !important;
          border-radius: 6px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          transition: all 0.15s ease !important;
        }

        .orders-history-manager .action-icon-btn:hover:not(:disabled),
        button.action-icon-btn:hover:not(:disabled) {
          background-color: #f1f5f9 !important;
          background-image: none !important;
          border: 1px solid #94a3b8 !important;
          color: #000000 !important;
          box-shadow: none !important;
          transform: none !important;
        }

        .orders-history-manager.is-dark .action-icon-btn,
        .is-dark button.action-icon-btn {
          background-color: #1e293b !important;
          background-image: none !important;
          border: 1px solid #334155 !important;
          color: #f8fafc !important;
        }

        .orders-history-manager.is-dark .action-icon-btn:hover:not(:disabled),
        .is-dark button.action-icon-btn:hover:not(:disabled) {
          background-color: #334155 !important;
          background-image: none !important;
          border: 1px solid #64748b !important;
          color: #ffffff !important;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #print-invoice-area,
          #print-invoice-area * {
            visibility: visible;
          }
          #print-invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
