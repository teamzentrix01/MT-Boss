'use client';

import { useState, useEffect } from 'react';

export default function VendorManagementAdmin({ isDarkMode }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, verified, active, inactive
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch vendors
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch('/api/admin/vendors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setVendors(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

const handleApproveVendor = async (vendorId) => {
  try {
    const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
    
    const res = await fetch('/api/admin/vendors', {        // ← fixed URL
      method: 'PUT',                                       // ← already correct, keep it
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        vendor_id: vendorId,                               // ← changed
        action: 'approve'                                  // ← changed
      })
    });

    const data = await res.json();
    if (res.ok) {
      fetchVendors();
      setSelectedVendor(null);
    }
  } catch (err) {
    console.error('Error approving vendor:', err);
  }
};

  const handleRejectVendor = async (vendorId, reason) => {
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch(`/api/admin/vendors/${vendorId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();
      if (res.ok) {
        fetchVendors();
        setSelectedVendor(null);
      }
    } catch (err) {
      console.error('Error rejecting vendor:', err);
    }
  };

  const handleToggleStatus = async (vendorId, newStatus) => {
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      const res = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchVendors();
      }
    } catch (err) {
      console.error('Error updating vendor:', err);
    }
  };

  // Filter vendors
  const filteredVendors = vendors.filter(v => {
    const matchesFilter = 
      filter === 'all' ||
      filter === 'pending' && v.verification_status === 'pending' ||
      filter === 'verified' && v.verification_status === 'verified' ||
      filter === 'active' && v.status === 'active' ||
      filter === 'inactive' && v.status === 'inactive';
    
    const matchesSearch = 
      v.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const stats = [
    { label: 'Total Vendors', value: vendors.length, color: 'stat-a' },
    { label: 'Pending Verification', value: vendors.filter(v => v.verification_status === 'pending').length, color: 'stat-b' },
    { label: 'Verified', value: vendors.filter(v => v.verification_status === 'verified').length, color: 'stat-c' },
    { label: 'Active', value: vendors.filter(v => v.status === 'active').length, color: 'stat-d' },
  ];

  return (
    <div className="vendor-manager">
      <style>{`
        .vendor-manager {
          padding: 1.25rem 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          padding: 1rem 1.25rem;
          border-radius: 8px;
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-a { background: ${isDarkMode ? '#1a2035' : '#f0f4ff'}; color: ${isDarkMode ? '#93c5fd' : '#1e3a8a'}; }
        .stat-b { background: ${isDarkMode ? '#2a1a0e' : '#fff7ed'}; color: ${isDarkMode ? '#fb923c' : '#9a3412'}; }
        .stat-c { background: ${isDarkMode ? '#0f2a18' : '#f0fdf4'}; color: ${isDarkMode ? '#86efac' : '#14532d'}; }
        .stat-d { background: ${isDarkMode ? '#1a2035' : '#f0f4ff'}; color: ${isDarkMode ? '#93c5fd' : '#1e3a8a'}; }

        .stat-label {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.7;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .controls {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.4rem 0.875rem;
          border: 1px solid ${isDarkMode ? '#333' : '#e2e2e7'};
          border-radius: 6px;
          background: transparent;
          color: ${isDarkMode ? '#999' : '#666'};
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: #2563eb;
          color: #2563eb;
        }

        .filter-btn.active {
          background: #2563eb;
          color: #fff;
          border-color: #2563eb;
        }

        .search-input {
          padding: 0.4rem 0.875rem;
          border: 1px solid ${isDarkMode ? '#333' : '#e2e2e7'};
          border-radius: 6px;
          background: ${isDarkMode ? '#1a1a1a' : '#fff'};
          color: ${isDarkMode ? '#fff' : '#000'};
          font-size: 0.8125rem;
          outline: none;
          width: 200px;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #2563eb;
        }

        .vendors-table {
          width: 100%;
          border-collapse: collapse;
          background: ${isDarkMode ? '#111' : '#fff'};
          border: 1px solid ${isDarkMode ? '#333' : '#e2e2e7'};
          border-radius: 8px;
          overflow: hidden;
        }

        .vendors-table thead {
          background: ${isDarkMode ? '#0f0f11' : '#f9f9f9'};
          border-bottom: 1px solid ${isDarkMode ? '#333' : '#e2e2e7'};
        }

        .vendors-table th {
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${isDarkMode ? '#999' : '#666'};
        }

        .vendors-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid ${isDarkMode ? '#333' : '#e2e2e7'};
          font-size: 0.8125rem;
        }

        .vendors-table tr:hover {
          background: ${isDarkMode ? '#1a1a1a' : '#f9f9f9'};
        }

        .vendor-name {
          font-weight: 600;
          color: ${isDarkMode ? '#fff' : '#000'};
        }

        .vendor-meta {
          font-size: 0.75rem;
          color: ${isDarkMode ? '#999' : '#999'};
          margin-top: 0.25rem;
        }

        .badge {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge-pending { background: #fbbf24; color: #78350f; }
        .badge-verified { background: #10b981; color: #fff; }
        .badge-active { background: #3b82f6; color: #fff; }
        .badge-inactive { background: #6b7280; color: #fff; }
        .badge-rejected { background: #ef4444; color: #fff; }

        .action-btn {
          padding: 0.3rem 0.6rem;
          border: 1px solid ${isDarkMode ? '#333' : '#e2e2e7'};
          border-radius: 4px;
          background: transparent;
          color: #2563eb;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #2563eb;
          color: #fff;
        }

        .empty-state {
          text-align: center;
          padding: 2rem;
          color: ${isDarkMode ? '#999' : '#999'};
          font-size: 0.8125rem;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
        }

        .modal {
          background: ${isDarkMode ? '#18181c' : '#fff'};
          border: 1px solid ${isDarkMode ? '#333' : '#e2e2e7'};
          border-radius: 10px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid ${isDarkMode ? '#333' : '#e2e2e7'};
        }

        .modal-title {
          font-size: 1rem;
          font-weight: 700;
        }

        .modal-close {
          background: none;
          border: none;
          color: ${isDarkMode ? '#999' : '#999'};
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-section {
          margin-bottom: 1.5rem;
        }

        .modal-section-title {
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${isDarkMode ? '#999' : '#666'};
          margin-bottom: 0.75rem;
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .modal-field {
          margin-bottom: 0.75rem;
        }

        .modal-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${isDarkMode ? '#999' : '#666'};
          margin-bottom: 0.25rem;
        }

        .modal-value {
          font-size: 0.8125rem;
          color: ${isDarkMode ? '#fff' : '#000'};
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid ${isDarkMode ? '#333' : '#e2e2e7'};
        }

        .modal-btn {
          flex: 1;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn-approve {
          background: #10b981;
          color: #fff;
        }

        .modal-btn-approve:hover {
          background: #059669;
        }

        .modal-btn-reject {
          background: #ef4444;
          color: #fff;
        }

        .modal-btn-reject:hover {
          background: #dc2626;
        }

        .modal-btn-cancel {
          background: ${isDarkMode ? '#333' : '#f0f0f0'};
          color: ${isDarkMode ? '#fff' : '#000'};
        }

        .modal-btn-cancel:hover {
          background: ${isDarkMode ? '#444' : '#e0e0e0'};
        }

        .loading { text-align: center; padding: 2rem; color: ${isDarkMode ? '#999' : '#999'}; }
      `}</style>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card ${stat.color}`}>
            <div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="filter-tabs">
          {['all', 'pending', 'verified', 'active', 'inactive'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search vendors..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading">Loading vendors...</div>
      ) : filteredVendors.length === 0 ? (
        <div className="empty-state">No vendors found.</div>
      ) : (
        <table className="vendors-table">
          <thead>
            <tr>
              <th>Shop Name</th>
              <th>Email</th>
              <th>City</th>
              <th>Verification</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map(vendor => (
              <tr key={vendor.id}>
                <td>
                  <div className="vendor-name">{vendor.shop_name}</div>
                  <div className="vendor-meta">{vendor.business_name}</div>
                </td>
                <td className="vendor-meta">{vendor.email}</td>
                <td className="vendor-meta">{vendor.city}</td>
                <td>
                  <span className={`badge badge-${vendor.verification_status}`}>
                    {vendor.verification_status}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${vendor.status}`}>
                    {vendor.status}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {selectedVendor && (
        <div className="modal-backdrop" onClick={() => setSelectedVendor(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{selectedVendor.shop_name} - Verification</div>
              <button className="modal-close" onClick={() => setSelectedVendor(null)}>✕</button>
            </div>

            {/* Shop Info */}
            <div className="modal-section">
              <div className="modal-section-title">Shop Information</div>
              <div className="modal-grid">
                <div className="modal-field">
                  <div className="modal-label">Shop Name</div>
                  <div className="modal-value">{selectedVendor.shop_name}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Business Name</div>
                  <div className="modal-value">{selectedVendor.business_name}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Email</div>
                  <div className="modal-value">{selectedVendor.email}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Phone</div>
                  <div className="modal-value">{selectedVendor.phone}</div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="modal-section">
              <div className="modal-section-title">Address</div>
              <div className="modal-grid">
                <div className="modal-field">
                  <div className="modal-label">City</div>
                  <div className="modal-value">{selectedVendor.city}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">State</div>
                  <div className="modal-value">{selectedVendor.state}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Country</div>
                  <div className="modal-value">{selectedVendor.country || 'N/A'}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Postal Code</div>
                  <div className="modal-value">{selectedVendor.postal_code || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="modal-section">
              <div className="modal-section-title">Documents</div>
              <div className="modal-grid">
                <div className="modal-field">
                  <div className="modal-label">GST Number</div>
                  <div className="modal-value">{selectedVendor.gst_number || 'N/A'}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">PAN Number</div>
                  <div className="modal-value">{selectedVendor.pan_number || 'N/A'}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Business Reg.</div>
                  <div className="modal-value">{selectedVendor.business_registration_number || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="modal-section">
              <div className="modal-section-title">Bank Details</div>
              <div className="modal-grid">
                <div className="modal-field">
                  <div className="modal-label">Account Holder</div>
                  <div className="modal-value">{selectedVendor.bank_account_holder || 'N/A'}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Bank Name</div>
                  <div className="modal-value">{selectedVendor.bank_name || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="modal-section">
              <div className="modal-section-title">Current Status</div>
              <div style={{ marginBottom: '1rem' }}>
                <span className={`badge badge-${selectedVendor.verification_status}`}>
                  Verification: {selectedVendor.verification_status}
                </span>
                <span className={`badge badge-${selectedVendor.status}`} style={{ marginLeft: '0.5rem' }}>
                  Status: {selectedVendor.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            {selectedVendor.verification_status === 'pending' && (
              <div className="modal-actions">
                <button
                  className="modal-btn modal-btn-approve"
                  onClick={() => handleApproveVendor(selectedVendor.id)}
                >
                  ✓ Approve Vendor
                </button>
                <button
                  className="modal-btn modal-btn-reject"
                  onClick={() => {
                    const reason = prompt('Enter reason for rejection:');
                    if (reason) handleRejectVendor(selectedVendor.id, reason);
                  }}
                >
                  ✕ Reject
                </button>
              </div>
            )}

            {selectedVendor.verification_status === 'verified' && (
              <div className="modal-actions">
                <button
                  className={`modal-btn ${selectedVendor.status === 'active' ? 'modal-btn-reject' : 'modal-btn-approve'}`}
                  onClick={() => handleToggleStatus(selectedVendor.id, selectedVendor.status === 'active' ? 'inactive' : 'active')}
                >
                  {selectedVendor.status === 'active' ? '⚠ Deactivate' : '✓ Activate'}
                </button>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: '0.5rem' }}>
              <button
                className="modal-btn modal-btn-cancel"
                onClick={() => setSelectedVendor(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}