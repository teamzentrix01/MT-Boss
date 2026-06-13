'use client';

import { useState, useEffect } from 'react';

export default function VendorManagementAdmin({ isDarkMode }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // ← New: error tracking
  const [filter, setFilter] = useState('all'); // all, pending, verified, active, inactive
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch vendors
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      
      // ← NEW: Logging
      console.log('🔍 Fetching vendors with token:', token ? 'Present' : 'MISSING');
      
      const res = await fetch('/api/admin/vendors', {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'  // ← NEW: Prevent caching issues
      });

      // ← NEW: Log response status
      console.log('📡 API Response Status:', res.status);

      const data = await res.json();
      
      // ← NEW: Detailed logging
      console.log('📊 API Response Data:', data);
      console.log('📈 Total vendors returned:', data.data?.length || 0);

      if (data.success) {
        const vendorList = data.data || [];
        setVendors(vendorList);
        console.log('✅ Vendors loaded successfully:', vendorList.length);
      } else {
        const errorMsg = data.error || 'Unknown error';
        setError(errorMsg);
        console.error('❌ API Error:', errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch vendors';
      setError(errorMsg);
      console.error('❌ Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      
      console.log('✓ Approving vendor:', vendorId);

      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          action: 'approve'
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        console.log('✅ Vendor approved:', data);
        // ← NEW: Small delay before refresh to ensure DB update
        setTimeout(() => fetchVendors(), 500);
        setSelectedVendor(null);
      } else {
        console.error('❌ Approval failed:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('❌ Error approving vendor:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleRejectVendor = async (vendorId, reason) => {
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      
      console.log('✕ Rejecting vendor:', vendorId, 'Reason:', reason);

      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          action: 'reject',
          admin_notes: reason
        })
      });

      const data = await res.json();

      if (res.ok) {
        console.log('✅ Vendor rejected:', data);
        setTimeout(() => fetchVendors(), 500);
        setSelectedVendor(null);
      } else {
        console.error('❌ Rejection failed:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('❌ Error rejecting vendor:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleToggleStatus = async (vendorId, newStatus) => {
    try {
      const token = localStorage.getItem('admin-token') || localStorage.getItem('token');
      
      const action = newStatus === 'active' ? 'deactivate' : 'activate';
      console.log('⚙️ Toggling vendor status:', vendorId, '→', action);

      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          action: action
        })
      });

      const data = await res.json();

      if (res.ok) {
        console.log('✅ Vendor status toggled:', data);
        setTimeout(() => fetchVendors(), 500);
      } else {
        console.error('❌ Toggle failed:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('❌ Error updating vendor status:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // ← IMPROVED: Better filtering logic
  const filteredVendors = vendors.filter(v => {
    // Check filter
    let matchesFilter = true;
    
    if (filter === 'pending') {
      matchesFilter = v.verification_status === 'pending';
    } else if (filter === 'verified') {
      matchesFilter = v.verification_status === 'verified';
    } else if (filter === 'active') {
      matchesFilter = v.status === 'active';
    } else if (filter === 'inactive') {
      matchesFilter = v.status === 'inactive';
    }
    // 'all' matches everything

    // Check search
    const matchesSearch = !searchTerm || 
      v.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.business_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // ← NEW: Debug logging for filters
  useEffect(() => {
    console.log('📋 Filter changed:', filter);
    console.log('🔎 Search term:', searchTerm);
    console.log('📊 Filtered results:', filteredVendors.length, '/', vendors.length);
  }, [filter, searchTerm, filteredVendors]);

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

        .error-banner {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.8125rem;
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

        .badge-pending { background: var(--brand-blue-light); color: #78350f; }
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

        .loading { 
          text-align: center; 
          padding: 2rem; 
          color: ${isDarkMode ? '#999' : '#999'}; 
        }
      `}</style>

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          ❌ <strong>Error:</strong> {error}
          <button onClick={() => setError(null)} style={{ float: 'right', cursor: 'pointer' }}>✕</button>
        </div>
      )}

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
        <div className="empty-state">
          {vendors.length === 0 
            ? 'No vendors registered yet.' 
            : `No vendors match filter "${filter}" ${searchTerm ? `and search "${searchTerm}"` : ''}`}
        </div>
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
                  <div className="vendor-name">{vendor.shop_name || vendor.email}</div>
                  <div className="vendor-meta">{vendor.city}, {vendor.state}</div>
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

            {/* Header */}
            <div className="modal-header">
              <div style={{ display:'flex', alignItems:'center', gap:'0.875rem' }}>
                {/* Profile Photo */}
                {selectedVendor.profile_photo ? (
                  <img src={`/api/vendor/image/${selectedVendor.id}?type=profile`} alt="Profile"
                    style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:`2px solid ${isDarkMode?'#333':'#e2e2e7'}` }} />
                ) : (
                  <div style={{ width:52, height:52, borderRadius:'50%', background: isDarkMode?'#2a2a30':'#e5e7eb', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>
                    👤
                  </div>
                )}
                <div>
                  <div className="modal-title">{selectedVendor.shop_name || selectedVendor.email}</div>
                  <div style={{ fontSize:'0.8rem', color: isDarkMode?'#999':'#666', marginTop:'0.1rem' }}>{selectedVendor.email}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelectedVendor(null)}>✕</button>
            </div>

            {/* Basic Info */}
            <div className="modal-section">
              <div className="modal-section-title">Contact & Location</div>
              <div className="modal-grid">
                <div className="modal-field">
                  <div className="modal-label">Phone</div>
                  <div className="modal-value">{selectedVendor.phone || '—'}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">City</div>
                  <div className="modal-value">{selectedVendor.city || '—'}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">State</div>
                  <div className="modal-value">{selectedVendor.state || '—'}</div>
                </div>
                <div className="modal-field">
                  <div className="modal-label">Postal Code</div>
                  <div className="modal-value">{selectedVendor.postal_code || '—'}</div>
                </div>
              </div>
            </div>

            {/* Aadhaar */}
            <div className="modal-section">
              <div className="modal-section-title">Identity Verification</div>

              {/* Aadhaar Number */}
              <div style={{ background: isDarkMode?'#0a1f0a':'#f0fdf4', border:`1px solid ${isDarkMode?'#16a34a44':'#86efac'}`, borderRadius:10, padding:'0.875rem 1rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.875rem' }}>
                <span style={{ fontSize:'1.5rem' }}>🪪</span>
                <div>
                  <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color: isDarkMode?'#4ade80':'#15803d', marginBottom:'0.2rem' }}>
                    Aadhaar Number
                  </div>
                  <div style={{ fontSize:'1.1rem', fontWeight:800, letterSpacing:'0.15em', fontFamily:'monospace', color: isDarkMode?'#fff':'#111' }}>
                    {selectedVendor.aadhar_number
                      ? selectedVendor.aadhar_number.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
                      : 'Not provided'}
                  </div>
                </div>
              </div>

              {/* Aadhaar Card Image */}
              {selectedVendor.aadhar_image ? (
                <div>
                  <div className="modal-label" style={{ marginBottom:'0.5rem' }}>Aadhaar Card Image</div>
                  <a href={`/api/vendor/image/${selectedVendor.id}?type=aadhaar`} target="_blank" rel="noopener noreferrer">
                    <img src={`/api/vendor/image/${selectedVendor.id}?type=aadhaar`} alt="Aadhaar Card"
                      style={{ width:'100%', maxHeight:220, objectFit:'contain', borderRadius:8, border:`1px solid ${isDarkMode?'#333':'#e2e2e7'}`, cursor:'pointer', background: isDarkMode?'#1a1a1a':'#f5f5f5' }} />
                  </a>
                  <div style={{ fontSize:'0.72rem', color: isDarkMode?'#666':'#aaa', marginTop:'0.3rem' }}>
                    Click image to open in full size
                  </div>
                </div>
              ) : (
                <div style={{ padding:'0.75rem', background: isDarkMode?'#2a1a0a':'#fff7ed', borderRadius:8, fontSize:'0.8125rem', color:'#f97316' }}>
                  ⚠️ No Aadhaar image uploaded
                </div>
              )}
            </div>

            {/* Status */}
            <div className="modal-section">
              <div className="modal-section-title">Status</div>
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                <span className={`badge badge-${selectedVendor.verification_status}`}>
                  Verification: {selectedVendor.verification_status}
                </span>
                <span className={`badge badge-${selectedVendor.status}`}>
                  Status: {selectedVendor.status}
                </span>
                <span style={{ fontSize:'0.72rem', color: isDarkMode?'#666':'#aaa', alignSelf:'center', marginLeft:'auto' }}>
                  Registered: {selectedVendor.created_at ? new Date(selectedVendor.created_at).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>

            {/* Actions */}
            {selectedVendor.verification_status === 'pending' && (
              <div className="modal-actions">
                <button className="modal-btn modal-btn-approve" onClick={() => handleApproveVendor(selectedVendor.id)}>
                  ✓ Approve Vendor
                </button>
                <button className="modal-btn modal-btn-reject"
                  onClick={() => {
                    const reason = prompt('Enter reason for rejection:');
                    if (reason) handleRejectVendor(selectedVendor.id, reason);
                  }}>
                  ✕ Reject
                </button>
              </div>
            )}

            {selectedVendor.verification_status === 'verified' && (
              <div className="modal-actions">
                <button
                  className={`modal-btn ${selectedVendor.status === 'active' ? 'modal-btn-reject' : 'modal-btn-approve'}`}
                  onClick={() => handleToggleStatus(selectedVendor.id, selectedVendor.status === 'active' ? 'inactive' : 'active')}>
                  {selectedVendor.status === 'active' ? '⚠ Deactivate' : '✓ Activate'}
                </button>
              </div>
            )}

            <div className="modal-actions" style={{ marginTop:'0.5rem' }}>
              <button className="modal-btn modal-btn-cancel" onClick={() => setSelectedVendor(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}