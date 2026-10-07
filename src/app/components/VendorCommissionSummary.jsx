'use client';

import React, { useState, useEffect, useCallback } from 'react';

export default function VendorCommissionSummary({ isDarkMode = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = typeof window !== 'undefined'
        ? localStorage.getItem('vendor-token') || ''
        : '';

      const res = await fetch('/api/vendor/shop-commissions', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setError(json.error || 'Failed to load commission data');
      }
    } catch (err) {
      console.error('Error loading vendor commission summary:', err);
      setError('Network error loading commission summary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const pendingAmount = Number(data?.pending_commission || 0);
  const paidAmount = Number(data?.paid_commission || 0);
  const totalOrders = Number(data?.total_orders_count || 0);
  const pendingOrders = Number(data?.pending_orders_count || 0);
  const paidOrders = Number(data?.paid_orders_count || 0);
  const recentOrders = Array.isArray(data?.recent_orders) ? data.recent_orders : [];

  return (
    <div
      style={{
        background: 'var(--shop-admin-card-bg, var(--surface, #ffffff))',
        border: '1px solid var(--shop-admin-border, #e5e7eb)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        color: 'var(--shop-admin-text, #111827)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '1px solid var(--shop-admin-border, #e5e7eb)',
          paddingBottom: '0.875rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            🛒 Platform Commission Summary
          </h3>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--shop-admin-muted, #6b7280)',
              margin: '0.25rem 0 0 0',
            }}
          >
            Platform fee on your shop sales. Settle pending dues offline with admin.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCommissions}
          disabled={loading}
          style={{
            background: 'transparent',
            border: '1px solid var(--shop-admin-border, #d1d5db)',
            borderRadius: '6px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            color: 'var(--shop-admin-text, inherit)',
            opacity: loading ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>
      </div>

      {error ? (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '6px',
            fontSize: '0.8125rem',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      ) : null}

      {/* Summary Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        {/* Total Commission Owed (Pending) */}
        <div
          style={{
            background: 'var(--shop-admin-subtle, #f9fafb)',
            border: '1px solid var(--shop-admin-border, #e5e7eb)',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.06em',
              color: 'var(--shop-admin-muted, #6b7280)',
              marginBottom: '0.35rem',
            }}
          >
            Total Commission Owed
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#f97316',
              lineHeight: 1.1,
            }}
          >
            ₹{pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div
            style={{
              fontSize: '0.6875rem',
              color: '#ea580c',
              marginTop: '0.35rem',
              fontWeight: 600,
            }}
          >
            Pending offline payout ({pendingOrders} {pendingOrders === 1 ? 'order' : 'orders'})
          </div>
        </div>

        {/* Total Commission Already Paid */}
        <div
          style={{
            background: 'var(--shop-admin-subtle, #f9fafb)',
            border: '1px solid var(--shop-admin-border, #e5e7eb)',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.06em',
              color: 'var(--shop-admin-muted, #6b7280)',
              marginBottom: '0.35rem',
            }}
          >
            Total Commission Paid
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#10b981',
              lineHeight: 1.1,
            }}
          >
            ₹{paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div
            style={{
              fontSize: '0.6875rem',
              color: '#059669',
              marginTop: '0.35rem',
              fontWeight: 600,
            }}
          >
            Settled with platform ({paidOrders} {paidOrders === 1 ? 'order' : 'orders'})
          </div>
        </div>

        {/* Total Orders Record */}
        <div
          style={{
            background: 'var(--shop-admin-subtle, #f9fafb)',
            border: '1px solid var(--shop-admin-border, #e5e7eb)',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.06em',
              color: 'var(--shop-admin-muted, #6b7280)',
              marginBottom: '0.35rem',
            }}
          >
            Shop Sales Tracked
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: 'var(--brand-blue, #2563eb)',
              lineHeight: 1.1,
            }}
          >
            {totalOrders}
          </div>
          <div
            style={{
              fontSize: '0.6875rem',
              color: 'var(--shop-admin-muted, #6b7280)',
              marginTop: '0.35rem',
            }}
          >
            {pendingOrders} pending · {paidOrders} settled
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ marginTop: '1rem' }}>
        <h4
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            margin: '0 0 0.5rem 0',
            color: 'var(--shop-admin-text, inherit)',
          }}
        >
          Recent Order Commissions
        </h4>

        {loading && !data ? (
          <p style={{ fontSize: '0.8125rem', color: 'var(--shop-admin-muted, #6b7280)' }}>
            Loading commission history...
          </p>
        ) : recentOrders.length === 0 ? (
          <div
            style={{
              padding: '0.875rem 1rem',
              background: 'var(--shop-admin-subtle, #f9fafb)',
              border: '1px solid var(--shop-admin-border, #e5e7eb)',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: 'var(--shop-admin-muted, #6b7280)',
            }}
          >
            No commission orders recorded yet. When customers purchase your shop products, commission records will appear here.
          </div>
        ) : (
          <div
            style={{
              overflowX: 'auto',
              border: '1px solid var(--shop-admin-border, #e5e7eb)',
              borderRadius: '8px',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.8125rem',
                textAlign: 'left',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'var(--shop-admin-subtle, #f9fafb)',
                    borderBottom: '1px solid var(--shop-admin-border, #e5e7eb)',
                    color: 'var(--shop-admin-muted, #6b7280)',
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '.05em',
                  }}
                >
                  <th style={{ padding: '0.6rem 0.75rem' }}>Product Name</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Order Amount</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Commission %</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Commission Due</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const isPending = order.status === 'pending';
                  const dateStr = order.created_at
                    ? new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—';

                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: '1px solid var(--shop-admin-border, #e5e7eb)',
                      }}
                    >
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <div style={{ fontWeight: 600 }}>{order.product_name}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--shop-admin-muted, #6b7280)' }}>
                          Order #{order.order_id}
                        </div>
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right', fontWeight: 600 }}>
                        ₹{Number(order.order_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                        <span
                          style={{
                            background: 'var(--shop-admin-subtle, #f3f4f6)',
                            border: '1px solid var(--shop-admin-border, #e5e7eb)',
                            borderRadius: '999px',
                            padding: '0.15rem 0.5rem',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                          }}
                        >
                          {Number(order.commission_percent_applied)}%
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '0.65rem 0.75rem',
                          textAlign: 'right',
                          fontWeight: 700,
                          color: isPending ? '#ea580c' : '#059669',
                        }}
                      >
                        ₹{Number(order.commission_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '999px',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            background: isPending ? '#ffedd5' : '#d1fae5',
                            color: isPending ? '#9a3412' : '#065f46',
                          }}
                        >
                          {isPending ? 'Pending' : 'Paid'}
                        </span>
                        {order.paid_note && !isPending ? (
                          <div
                            style={{
                              fontSize: '0.625rem',
                              color: 'var(--shop-admin-muted, #6b7280)',
                              marginTop: '2px',
                            }}
                            title={order.paid_note}
                          >
                            {order.paid_note}
                          </div>
                        ) : null}
                      </td>
                      <td
                        style={{
                          padding: '0.65rem 0.75rem',
                          textAlign: 'right',
                          fontSize: '0.75rem',
                          color: 'var(--shop-admin-muted, #6b7280)',
                        }}
                      >
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
