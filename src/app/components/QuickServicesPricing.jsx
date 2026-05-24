// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/dashboard/components/QuickServicesPricing.jsx
// ADMIN PRICING CONTROL - Set base price for each quick service
// ════════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';

export default function QuickServicesPricing({ isDarkMode }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingPrice, setEditingPrice] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/quick-services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setServices(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePriceUpdate(serviceId, newPrice) {
    if (!newPrice || isNaN(newPrice) || parseInt(newPrice) < 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/quick-services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          admin_base_price: parseInt(newPrice)
        })
      });

      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        fetchServices();
        alert('Price updated successfully!');
      } else {
        alert('Error updating price: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Error updating price');
    }
  }

  async function handleToggleService(serviceId, currentStatus) {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/quick-services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          is_service_active: !currentStatus
        })
      });

      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error updating service:', error);
    }
  }

  return (
    <>
      <style>{`
        .pricing-container {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.25rem;
        }
        
        .pricing-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
        }
        
        .pricing-table th {
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
        
        .pricing-table td {
          padding: 0.75rem 0.875rem;
          border-bottom: 1px solid var(--border);
        }
        
        .pricing-table tr:hover { background: var(--bg); }
        
        .service-name {
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .service-icon { font-size: 1.125rem; }
        
        .price-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .price-display {
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--accent);
        }
        
        .price-input {
          padding: 0.35rem 0.5rem;
          border: 1px solid var(--accent);
          border-radius: 4px;
          background: var(--bg);
          color: var(--text);
          font-size: 0.8125rem;
          width: 100px;
          outline: none;
        }
        
        .btn-save {
          padding: 0.25rem 0.6rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .15s;
        }
        .btn-save:hover { opacity: .85; }
        
        .btn-cancel {
          padding: 0.25rem 0.6rem;
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all .15s;
        }
        .btn-cancel:hover { background: var(--bg); color: var(--text); }
        
        .btn-edit {
          padding: 0.25rem 0.6rem;
          background: #dbeafe;
          color: #1e40af;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .15s;
        }
        .btn-edit:hover { opacity: .8; }
        
        .btn-toggle {
          padding: 0.25rem 0.6rem;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .15s;
        }
        
        .btn-active {
          background: #dcfce7;
          color: #166534;
        }
        
        .btn-inactive {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .btn-toggle:hover { opacity: .8; }
        
        .status-badge {
          display: inline-block;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        .status-active { background: #dcfce7; color: #166534; }
        .status-inactive { background: #fee2e2; color: #991b1b; }
        
        .info-box {
          background: var(--bg);
          border-left: 3px solid var(--accent);
          border-radius: 4px;
          padding: 0.75rem;
          margin-bottom: 1rem;
          font-size: 0.8125rem;
          color: var(--muted);
        }
      `}</style>

      <div className="pricing-container">
        <h3 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>
          Quick Services - Price Management
        </h3>

        <div className="info-box">
          💡 <strong>Base Price:</strong> This is the minimum charge for 15 minutes of service. Users are charged additional taxes (18%).
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Loading services...</p>
        ) : services.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>No services found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Base Price (15 mins)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="service-name">
                        <span className="service-icon">{service.icon}</span>
                        <span>{service.label}</span>
                      </div>
                    </td>
                    <td>
                      <div className="price-cell">
                        {editingId === service.id ? (
                          <>
                            <span>₹</span>
                            <input
                              type="number"
                              className="price-input"
                              value={editingPrice}
                              onChange={(e) => setEditingPrice(e.target.value)}
                              autoFocus
                            />
                            <button
                              onClick={() => handlePriceUpdate(service.id, editingPrice)}
                              className="btn-save"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="btn-cancel"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="price-display">
                              ₹{service.admin_base_price || service.base_price || 199}
                            </span>
                            <button
                              onClick={() => {
                                setEditingId(service.id);
                                setEditingPrice(service.admin_base_price || service.base_price || 199);
                              }}
                              className="btn-edit"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${service.is_service_active ? 'status-active' : 'status-inactive'}`}
                      >
                        {service.is_service_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleService(service.id, service.is_service_active)}
                        className={`btn-toggle ${service.is_service_active ? 'btn-active' : 'btn-inactive'}`}
                      >
                        {service.is_service_active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: '6px', fontSize: '0.8125rem', color: 'var(--muted)' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Note:</strong> Default base price is ₹199 for 15 minutes. You can customize per service.
          </p>
          <p>
            <strong>Formula:</strong> Base Price + Tax (18%) = Total Charge
          </p>
        </div>
      </div>
    </>
  );
}
