'use client';

import { useCallback, useEffect, useState } from 'react';
import '@/app/material-orders/material-orders.css';

const TOKEN_KEYS = {
  admin: 'token',
  user: 'token',
  supplier: 'supplier-token',
  vendor: 'vendor-token',
  franchise: 'franchise-token',
};

const STATUS_LABELS = {
  open: 'Order Placed',
  accepted: 'Accepted',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  dispatched: 'Dispatched',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  fulfilled: 'Delivered',
  cancelled: 'Cancelled',
};

const UPDATE_STATUSES = [
  'accepted',
  'confirmed',
  'processing',
  'packed',
  'dispatched',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

function formatDate(value, withTime = false) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', withTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' });
}

function statusTone(status) {
  if (['delivered', 'fulfilled'].includes(status)) return '#15803d';
  if (status === 'cancelled') return '#b91c1c';
  if (['dispatched', 'out_for_delivery'].includes(status)) return '#6d28d9';
  return '#1d4ed8';
}

export default function MaterialOrdersPanel({ role = 'user', embedded = false }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState(null);

  const getToken = useCallback(() => (
    typeof window === 'undefined' ? '' : localStorage.getItem(TOKEN_KEYS[role]) || ''
  ), [role]);

  const loadOrders = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('Please sign in to view material orders.');
      const response = await fetch('/api/material-orders', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Orders could not be loaded');
      setOrders(data.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(() => loadOrders(true), 20000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const updateOrder = async (order) => {
    const draft = drafts[order.id] || {};
    const status = draft.status || order.status;
    if (status === order.status && !draft.note && !draft.estimated_delivery_date) {
      setError('Choose a new status or add an update note.');
      return;
    }
    setSaving(order.id);
    setError('');
    try {
      const response = await fetch('/api/material-orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          id: order.id,
          status,
          note: draft.note || '',
          estimated_delivery_date: draft.estimated_delivery_date || null,
          amount_received: draft.amount_received || null,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Order could not be updated');
      setOrders((current) => current.map((item) => item.id === order.id ? data.data : item));
      setDrafts((current) => ({ ...current, [order.id]: {} }));
      setExpanded(order.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <div className="material-orders-panel material-orders-surface rounded-xl border p-10 text-center text-sm">Loading material orders…</div>;
  }

  return (
    <section className={`material-orders-panel ${embedded ? '' : 'mx-auto max-w-5xl'}`}>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="material-orders-eyebrow text-[10px] font-black uppercase tracking-[0.3em]">
            {role === 'user' ? 'Purchase History' : 'Assigned Material Orders'}
          </p>
          <h1 className="material-orders-title mt-1 text-2xl font-black uppercase">
            {role === 'user' ? 'My Material Purchases' : 'Manage Material Orders'}
          </h1>
          <p className="material-orders-subtitle mt-1 text-sm">
            {role === 'user'
              ? 'Follow every update from order placement through delivery.'
              : 'Only orders assigned to this account are shown here.'}
          </p>
        </div>
        <button type="button" onClick={() => loadOrders()} className="material-orders-refresh rounded-lg border px-4 py-2 text-xs font-bold">
          Refresh
        </button>
      </div>

      {error && <div className="material-orders-error mb-4 rounded-lg border p-3 text-sm">{error}</div>}

      {orders.length === 0 ? (
        <div className="material-orders-surface rounded-xl border p-12 text-center">
          <div className="text-3xl">📦</div>
          <p className="mt-3 font-bold text-zinc-800">No material orders found</p>
          <p className="mt-1 text-sm text-zinc-500">
            {role === 'user' ? 'Orders placed while signed in will appear here.' : 'Assigned orders will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const draft = drafts[order.id] || {};
            const isExpanded = expanded === order.id;
            const availableStatuses = role === 'supplier'
              ? UPDATE_STATUSES.filter((status) => !['delivered'].includes(status))
              : UPDATE_STATUSES;
            return (
              <article
                key={order.id}
                className="material-order-card overflow-hidden rounded-xl border shadow-sm"
              >
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="material-order-reference text-[10px] font-black uppercase tracking-widest">
                        {order.order_intent && <span className="material-order-intent mr-2 rounded px-2 py-1">{order.order_intent === 'quote' ? 'Quote request' : 'Direct order'}</span>}
                        {order.order_reference || `Material Order #${order.id}`}
                      </div>
                      <h2 className="material-order-title mt-2 text-lg font-black">
                        {order.category_emoji} {order.category_name}
                      </h2>
                      <p className="material-order-description mt-1 text-sm">
                        {[order.material_type, order.subcategory_name, order.brand_company].filter(Boolean).join(' · ') || 'Material request'}
                      </p>
                    </div>
                    <span
                      className="material-order-status rounded-full px-3 py-1 text-xs font-black uppercase"
                      style={{ backgroundColor: statusTone(order.status) }}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>

                  <div className="material-order-meta-grid mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div><span className="material-order-meta-label block text-[10px] font-bold uppercase">Quantity</span>{order.quantity_text || '—'}</div>
                    <div><span className="material-order-meta-label block text-[10px] font-bold uppercase">Delivery City</span>{order.selected_city || '—'}</div>
                    <div><span className="material-order-meta-label block text-[10px] font-bold uppercase">Assigned To</span>{order.assigned_name || order.accepted_by_shop || 'Awaiting assignment'}</div>
                    <div><span className="material-order-meta-label block text-[10px] font-bold uppercase">Estimated Delivery</span>{formatDate(order.estimated_delivery_date)}</div>
                  </div>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setExpanded(isExpanded ? null : order.id);
                    }}
                    className="material-orders-toggle mt-4 text-xs font-black uppercase tracking-wider"
                    aria-expanded={isExpanded}
                    aria-controls={`material-order-details-${order.id}`}
                  >
                    {isExpanded ? 'Hide details' : 'View tracking history'}
                  </button>
                </div>

                {isExpanded && (
                  <div id={`material-order-details-${order.id}`} className="material-order-details border-t p-5">
                    <div className="material-order-overview mb-6 grid gap-4 rounded-lg border p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Purchased On</span>{formatDate(order.created_at, true)}</div>
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Requested Delivery</span>{formatDate(order.delivery_date)}</div>
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Brand / Company</span>{order.brand_company || '—'}</div>
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Order Amount</span>{order.amount_received ? `₹${Number(order.amount_received).toLocaleString('en-IN')}` : 'Final amount pending'}</div>
                      <div className="sm:col-span-2"><span className="block text-[9px] font-black uppercase text-zinc-400">Delivery Address</span>{order.delivery_address || '—'}</div>
                      <div><span className="block text-[9px] font-black uppercase text-zinc-400">Contact</span>{order.user_phone || '—'}</div>
                      {order.message && <div className="sm:col-span-2 lg:col-span-3"><span className="block text-[9px] font-black uppercase text-zinc-400">Order Requirements</span>{order.message}</div>}
                    </div>
                    <div className="space-y-0">
                      {(order.history || []).map((event, index) => (
                        <div key={event.id || `${event.status}-${index}`} className="relative flex gap-3 pb-5 last:pb-0">
                          {index < order.history.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-zinc-300" />}
                          <span className="relative mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-blue-100 bg-blue-600" />
                          <div>
                            <p className="text-sm font-bold text-zinc-900">{event.title}</p>
                            {event.note && <p className="mt-0.5 text-sm text-zinc-600">{event.note}</p>}
                            <p className="mt-0.5 text-[11px] text-zinc-400">
                              {formatDate(event.created_at, true)}{event.actor_name ? ` · ${event.actor_name}` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {role !== 'user' && !['delivered', 'fulfilled', 'cancelled'].includes(order.status) && (
                      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4">
                        <p className="mb-3 text-xs font-black uppercase tracking-wider text-zinc-700">Post order update</p>
                        <div className="grid gap-3 md:grid-cols-3">
                          <select
                            value={draft.status || order.status}
                            onChange={(event) => setDrafts((current) => ({
                              ...current,
                              [order.id]: { ...draft, status: event.target.value },
                            }))}
                            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
                          >
                            {availableStatuses.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
                          </select>
                          <input
                            type="date"
                            value={draft.estimated_delivery_date || ''}
                            onChange={(event) => setDrafts((current) => ({
                              ...current,
                              [order.id]: { ...draft, estimated_delivery_date: event.target.value },
                            }))}
                            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                            aria-label="Estimated delivery date"
                          />
                          <input
                            value={draft.note || ''}
                            onChange={(event) => setDrafts((current) => ({
                              ...current,
                              [order.id]: { ...draft, note: event.target.value },
                            }))}
                            placeholder="Update note for customer"
                            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                          />
                          {role === 'admin' && ['delivered', 'fulfilled'].includes(draft.status || order.status) && (
                            <input
                              type="number"
                              min="0"
                              value={draft.amount_received || ''}
                              onChange={(event) => setDrafts((current) => ({
                                ...current,
                                [order.id]: { ...draft, amount_received: event.target.value },
                              }))}
                              placeholder="Final order amount (₹)"
                              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                            />
                          )}
                        </div>
                        <button
                          type="button"
                          disabled={saving === order.id}
                          onClick={() => updateOrder(order)}
                          className="material-orders-update mt-3 rounded-lg px-5 py-2 text-xs font-black uppercase disabled:opacity-50"
                        >
                          {saving === order.id ? 'Saving…' : 'Update Order'}
                        </button>
                        {role === 'supplier' && (
                          <p className="mt-2 text-xs text-zinc-500">
                            Use the existing fulfil order action after delivery to record the received amount and commission.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
