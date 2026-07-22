// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/dashboard/components/BookingsManager.jsx
// ADMIN VIEW FOR SERVICE BOOKINGS - View all bookings, filter by status, track progress
// ════════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';

export default function BookingsManager({ isDarkMode }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/bookings${filterStatus !== 'all' ? `?status=${filterStatus}` : ''}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function runAdminAction(action) {
    setActionLoading(true);
    setActionError('');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: selectedBooking.id, action, vendor_id: selectedVendorId || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Action failed');
      setSelectedVendorId('');
      setSelectedBooking(null);
      await fetchBookings();
    } catch (error) {
      setActionError(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  const statusColors = {
    'WAITING_FOR_VENDOR_ACCEPTANCE': { bg: '#fff7ed', text: '#9a3412', label: 'Waiting' },
    'WAITING_FOR_ADMIN_ASSIGNMENT': { bg: '#fee2e2', text: '#991b1b', label: 'Admin Queue' },
    'ADMIN_ACCEPTED': { bg: '#fef3c7', text: '#92400e', label: 'Admin Accepted' },
    'VENDOR_ACCEPTED': { bg: '#dbeafe', text: '#1e40af', label: 'Accepted' },
    'VENDOR_ON_WAY': { bg: 'var(--brand-blue-soft)', text: '#92400e', label: 'On Way' },
    'IN_PROGRESS': { bg: '#ffe4e6', text: '#831843', label: 'In Progress' },
    'COMPLETED': { bg: '#dcfce7', text: '#166534', label: 'Completed' },
    'CANCELLED': { bg: '#f3f4f6', text: '#374151', label: 'Cancelled' },
  };

  const getStatusStyle = (status) => {
    return statusColors[status] || { bg: '#f3f4f6', text: '#374151', label: status };
  };

  return (
    <>
      <style>{`
        .booking-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
        .booking-filter {
          display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;
        }
        .filter-btn {
          padding: 0.4rem 0.875rem;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text);
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all .15s;
        }
        .filter-btn.active {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
        }
        .filter-btn:hover { border-color: var(--accent); }
        
        .booking-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
        }
        .booking-table th {
          background: var(--bg);
          padding: 0.6rem 0.875rem;
          text-align: left;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: var(--muted);
          border-bottom: 1px solid var(--border);
        }
        .booking-table td {
          padding: 0.6rem 0.875rem;
          border-bottom: 1px solid var(--border);
        }
        .booking-table tr:hover { background: var(--bg); }
        
        .status-badge {
          display: inline-block;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        .booking-detail {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.25rem;
          max-width: 100%;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .detail-field {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .detail-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: var(--muted);
        }
        .detail-value {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text);
        }
        
        .timeline {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .timeline-title {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: var(--muted);
          margin-bottom: 0.75rem;
        }
        .timeline-item {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }
        .timeline-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          margin-top: 0.375rem;
          flex-shrink: 0;
        }
        .timeline-content {
          flex: 1;
        }
        .timeline-time {
          font-size: 0.65rem;
          color: var(--muted);
          font-weight: 600;
        }
        .timeline-event {
          font-size: 0.8125rem;
          color: var(--text);
          font-weight: 500;
          margin-top: 0.125rem;
        }
      `}</style>

      {!selectedBooking ? (
        <>
          <div className="booking-section">
            <h3 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>Service Bookings</h3>
            
            <div className="booking-filter">
              {['all', 'WAITING_FOR_ADMIN_ASSIGNMENT', 'ADMIN_ACCEPTED', 'WAITING_FOR_VENDOR_ACCEPTANCE', 'VENDOR_ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                >
                  {getStatusStyle(status).label || status}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>No bookings found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="booking-table">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td style={{ fontWeight: '600' }}>{booking.booking_reference}</td>
                        <td>{booking.user_name}</td>
                        <td>{booking.service_label || booking.quick_service_id}</td>
                        <td>{booking.service_city}</td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              background: getStatusStyle(booking.status).bg,
                              color: getStatusStyle(booking.status).text,
                            }}
                          >
                            {getStatusStyle(booking.status).label}
                          </span>
                        </td>
                        <td style={{ fontWeight: '600' }}>₹{booking.total_amount}</td>
                        <td style={{ color: 'var(--muted)' }}>
                          {new Date(booking.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--accent)',
                              cursor: 'pointer',
                              fontSize: '0.8125rem',
                              fontWeight: '600',
                              padding: 0,
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="booking-detail">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '700' }}>Booking Details</h3>
            <button
              onClick={() => setSelectedBooking(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.25rem',
                color: 'var(--muted)',
              }}
            >
              ✕
            </button>
          </div>

          <div className="detail-grid">
            <div className="detail-field">
              <div className="detail-label">Booking Reference</div>
              <div className="detail-value">{selectedBooking.booking_reference}</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Status</div>
              <span
                className="status-badge"
                style={{
                  background: getStatusStyle(selectedBooking.status).bg,
                  color: getStatusStyle(selectedBooking.status).text,
                  width: 'fit-content',
                }}
              >
                {getStatusStyle(selectedBooking.status).label}
              </span>
            </div>
            <div className="detail-field">
              <div className="detail-label">Customer Name</div>
              <div className="detail-value">{selectedBooking.user_name}</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Customer Phone</div>
              <div className="detail-value">{selectedBooking.user_phone}</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Property Type</div>
              <div className="detail-value">{selectedBooking.property_type || 'Not Specified'}</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Address</div>
              <div className="detail-value">{selectedBooking.service_address}</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">City</div>
              <div className="detail-value">{selectedBooking.service_city}</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Booking Date</div>
              <div className="detail-value">{selectedBooking.booking_date}</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Total Amount</div>
              <div className="detail-value">₹{selectedBooking.total_amount}</div>
            </div>
          </div>

          {selectedBooking.vendor_id && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: '6px' }}>
              <div className="detail-label">Accepted Vendor</div>
              <div className="detail-value">
                {selectedBooking.vendor_name || `Vendor #${selectedBooking.vendor_id}`}
                {selectedBooking.vendor_phone ? ` - ${selectedBooking.vendor_phone}` : ''}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: '0.25rem' }}>
                {selectedBooking.vendor_email || 'No email'} · {selectedBooking.vendor_package_name || 'No package'} · {selectedBooking.vendor_package_status || 'unknown'}
              </div>
            </div>
          )}

          {Array.isArray(selectedBooking.notified_vendors) && selectedBooking.notified_vendors.length > 0 && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: '6px' }}>
              <div className="detail-label">Vendors Notified</div>
              <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                {selectedBooking.notified_vendors.map((vendor) => (
                  <div key={vendor.vendor_id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.78rem' }}>
                    <span className="detail-value">{vendor.shop_name || `Vendor #${vendor.vendor_id}`}</span>
                    <span style={{ color: 'var(--muted)' }}>
                      {vendor.city || '-'} · {vendor.package_status || 'none'} · {vendor.notification_status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {['WAITING_FOR_ADMIN_ASSIGNMENT', 'WAITING_FOR_VENDOR_ACCEPTANCE'].includes(selectedBooking.status) && !selectedBooking.vendor_id && (
            <div style={{ marginBottom: '1rem', padding: '0.9rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>
              <div className="detail-label">Admin Fallback</div>
              <p className="detail-value" style={{ margin: '0.4rem 0 0.75rem' }}>No paid vendor has accepted this booking. Accept it into the admin queue first.</p>
              <button className="filter-btn active" disabled={actionLoading} onClick={() => runAdminAction('admin_accept')}>
                {actionLoading ? 'Accepting...' : 'Accept by Admin'}
              </button>
            </div>
          )}

          {selectedBooking.status === 'ADMIN_ACCEPTED' && !selectedBooking.vendor_id && (
            <div style={{ marginBottom: '1rem', padding: '0.9rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>
              <div className="detail-label">Assign Vendor</div>
              <p className="detail-value" style={{ margin: '0.4rem 0 0.75rem' }}>Approved vendors matching this service and city are listed. The admin can manually assign either a paid or unpaid vendor.</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select value={selectedVendorId} onChange={event => setSelectedVendorId(event.target.value)}
                  style={{ flex: 1, minWidth: 180, padding: '0.55rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', borderRadius: 6 }}>
                  <option value="">Select matching vendor</option>
                  {(selectedBooking.eligible_vendors || []).map(vendor => (
                    <option key={vendor.vendor_id} value={vendor.vendor_id}>{vendor.shop_name} · {vendor.city} · {vendor.package_status === 'active' ? (vendor.package_name || 'Paid') : 'Unpaid'}</option>
                  ))}
                </select>
                <button className="filter-btn active" disabled={actionLoading || !selectedVendorId} onClick={() => runAdminAction('assign_vendor')}>
                  {actionLoading ? 'Assigning...' : 'Assign Vendor'}
                </button>
              </div>
              {(selectedBooking.eligible_vendors || []).length === 0 && <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.6rem' }}>No approved matching vendor is currently available. Add or approve a vendor, then refresh and assign the booking.</p>}
            </div>
          )}

          {actionError && <p style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, marginBottom: '1rem' }}>{actionError}</p>}

          {selectedBooking.user_notes && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: '6px' }}>
              <div className="detail-label">User Notes</div>
              <div className="detail-value" style={{ marginTop: '0.375rem' }}>{selectedBooking.user_notes}</div>
            </div>
          )}

          <div className="timeline">
            <div className="timeline-title">Timeline</div>
            
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-time">Created</div>
                <div className="timeline-event">
                  {new Date(selectedBooking.created_at).toLocaleString()}
                </div>
              </div>
            </div>

            {selectedBooking.accepted_at && (
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-time">Vendor Accepted</div>
                  <div className="timeline-event">
                    {new Date(selectedBooking.accepted_at).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {selectedBooking.started_at && (
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-time">Work Started</div>
                  <div className="timeline-event">
                    {new Date(selectedBooking.started_at).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {selectedBooking.completed_at && (
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-time">Completed</div>
                  <div className="timeline-event">
                    {new Date(selectedBooking.completed_at).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setSelectedBooking(null)}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '0.5rem',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
