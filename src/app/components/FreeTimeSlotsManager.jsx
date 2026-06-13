// ════════════════════════════════════════════════════════════════════════════════
// FILE: app/dashboard/components/FreeTimeSlotsManager.jsx
// ADMIN CONTROLS FOR FREE TIME SLOTS - Create, edit, delete, and manage availability
// ════════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';

export default function FreeTimeSlotsManager({ isDarkMode }) {
  const [slots, setSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCity, setFilterCity] = useState('all');
  const [editingSlot, setEditingSlot] = useState(null);

  const [formData, setFormData] = useState({
    quick_service_id: '',
    slot_date: '',
    slot_start: '08:00',
    slot_end: '10:00',
    city: '',
    max_bookings: 1,
  });

  useEffect(() => {
    fetchData();
  }, [filterCity]);

  async function fetchData() {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      
      // Fetch free slots
      const slotsRes = await fetch(`/api/free-slots${filterCity !== 'all' ? `?city=${filterCity}` : ''}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const slotsData = await slotsRes.json();
      if (slotsData.success) {
        setSlots(slotsData.data || []);
      }

      // Fetch services
      const servicesRes = await fetch('/api/quick-services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const servicesData = await servicesRes.json();
      if (servicesData.success) {
        setServices(servicesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSlot() {
    if (!formData.quick_service_id || !formData.slot_date || !formData.city) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch(editingSlot ? `/api/free-slots/${editingSlot.id}` : '/api/free-slots', {
        method: editingSlot ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        alert(editingSlot ? 'Free slot updated successfully!' : 'Free slot created successfully!');
        setShowForm(false);
        setEditingSlot(null);
        setFormData({
          quick_service_id: '',
          slot_date: '',
          slot_start: '08:00',
          slot_end: '10:00',
          city: '',
          max_bookings: 1,
        });
        fetchData();
      } else {
        alert('Error creating slot: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating slot:', error);
      alert('Error creating slot');
    }
  }

  async function handleToggleAvailability(slotId, currentStatus) {
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch(`/api/free-slots/${slotId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          is_available: !currentStatus
        })
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating slot:', error);
    }
  }

  async function handleDeleteSlot(slotId) {
    if (!confirm('Are you sure you want to delete this slot?')) return;

    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch(`/api/free-slots/${slotId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
    }
  }

  function handleEditSlot(slot) {
    setEditingSlot(slot);
    setFormData({
      quick_service_id: String(slot.quick_service_id || ''),
      slot_date: slot.slot_date ? String(slot.slot_date).split('T')[0] : '',
      slot_start: String(slot.slot_start || '08:00').slice(0, 5),
      slot_end: String(slot.slot_end || '10:00').slice(0, 5),
      city: slot.city || '',
      max_bookings: slot.max_bookings || 1,
    });
    setShowForm(true);
  }

  function resetForm() {
    setEditingSlot(null);
    setShowForm(false);
    setFormData({
      quick_service_id: '',
      slot_date: '',
      slot_start: '08:00',
      slot_end: '10:00',
      city: '',
      max_bookings: 1,
    });
  }

  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const cityOptions = [...new Set(slots.map((slot) => slot.city).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <style>{`
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .btn-primary {
          padding: 0.5rem 1rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .15s;
        }
        .btn-primary:hover { opacity: .85; }
        
        .form-container {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .form-label {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: var(--muted);
        }
        .form-input, .form-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--surface);
          color: var(--text);
          font-size: 0.8125rem;
          outline: none;
          transition: border-color .15s;
        }
        .form-input:focus, .form-select:focus {
          border-color: var(--accent);
        }
        
        .slots-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
        }
        .slots-table th {
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
        .slots-table td {
          padding: 0.6rem 0.875rem;
          border-bottom: 1px solid var(--border);
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-available { background: #dcfce7; color: #166534; }
        .status-booked { background: #fee2e2; color: #991b1b; }
        .status-expired { background: var(--brand-blue-soft); color: #92400e; }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .btn-small {
          padding: 0.25rem 0.5rem;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity .15s;
        }
        .btn-toggle {
          background: #dbeafe;
          color: #1e40af;
        }
        .btn-toggle:hover { opacity: .8; }
        .btn-delete {
          background: #fee2e2;
          color: #991b1b;
        }
        .btn-delete:hover { opacity: .8; }
      `}</style>

      <div>
        <div className="section-header">
          <h3 style={{ fontSize: '0.875rem', fontWeight: '700' }}>Free Time Slots Management</h3>
          <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="btn-primary">
            {showForm ? '✕ Cancel' : '+ Create Slot'}
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', marginBottom: '1rem' }}>
              {editingSlot ? 'Edit Free Slot' : 'Create New Free Slot'}
            </h4>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Service *</label>
                <select
                  className="form-select"
                  value={formData.quick_service_id}
                  onChange={(e) => setFormData({ ...formData, quick_service_id: e.target.value })}
                >
                  <option value="">Select Service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Moradabad"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slot Date *</label>
                <input
                  type="date"
                  className="form-input"
                  min={getTodayStr()}
                  value={formData.slot_date}
                  onChange={(e) => setFormData({ ...formData, slot_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Bookings</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={formData.max_bookings}
                  onChange={(e) => setFormData({ ...formData, max_bookings: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.slot_start}
                  onChange={(e) => setFormData({ ...formData, slot_start: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={formData.slot_end}
                  onChange={(e) => setFormData({ ...formData, slot_end: e.target.value })}
                />
              </div>
            </div>

            <button onClick={handleCreateSlot} className="btn-primary" style={{ width: '100%' }}>
              {editingSlot ? 'Save Slot' : 'Create Slot'}
            </button>
          </div>
        )}

        <div className="form-container">
          <div style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ marginRight: '1rem' }}>Filter by City:</label>
            <select
              className="form-select"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="all">All Cities</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>Loading slots...</p>
          ) : slots.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '2rem' }}>No free slots created yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="slots-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>City</th>
                    <th>Max Bookings</th>
                    <th>Current Bookings</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => (
                    <tr key={slot.id}>
                      <td style={{ fontWeight: '600' }}>{slot.service_icon} {slot.service_label || `Service #${slot.quick_service_id}`}</td>
                      <td>{slot.slot_date ? String(slot.slot_date).split('T')[0] : '—'}</td>
                      <td>{slot.slot_start} - {slot.slot_end}</td>
                      <td>{slot.city}</td>
                      <td>{slot.max_bookings}</td>
                      <td>{slot.current_bookings || 0}</td>
                      <td>
                        {(() => {
                          const slotDay = slot.slot_date ? new Date(String(slot.slot_date).split('T')[0]) : null;
                          const today = new Date(); today.setHours(0,0,0,0);
                          const isExpired = slotDay && slotDay < today;
                          if (isExpired) {
                            return <span className="status-badge status-expired">⏰ Expired — not shown to users</span>;
                          }
                          return (
                            <span className={`status-badge ${slot.is_available ? 'status-available' : 'status-booked'}`}>
                              {slot.is_available ? 'Open' : 'Closed'}
                            </span>
                          );
                        })()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleToggleAvailability(slot.id, slot.is_available)}
                            className="btn-small btn-toggle"
                          >
                            {slot.is_available ? 'Close' : 'Open'}
                          </button>
                          <button
                            onClick={() => handleEditSlot(slot)}
                            className="btn-small btn-toggle"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="btn-small btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
