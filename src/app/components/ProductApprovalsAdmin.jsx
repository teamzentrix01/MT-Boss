/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  PackageCheck,
  ActionIconButton,
  IndianRupee,
  ArrowLeft,
} from '@/app/components/ui/icons';

export default function ProductApprovalsAdmin({ isDarkMode }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [filter, setFilter] = useState('pending'); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });

  const getAdminHeaders = useCallback((contentType) => {
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      user = {};
    }
    const token =
      localStorage.getItem('admin-token') ||
      (user.role === 'admin' ? localStorage.getItem('token') : '');
    return {
      ...(contentType ? { 'Content-Type': contentType } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('/api/admin/product-approvals', window.location.origin);
      if (filter && filter !== 'all') {
        url.searchParams.set('status', filter);
      }
      if (searchTerm) {
        url.searchParams.set('search', searchTerm);
      }
      url.searchParams.set('limit', '50');

      const res = await fetch(url.toString(), {
        headers: getAdminHeaders(),
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        setError(data.error || 'Failed to load products');
      }
    } catch (err) {
      setError(err.message || 'Network error loading products');
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm, getAdminHeaders]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setActiveImageIdx(0);
    setRejecting(false);
    setRejectionReason('');
    setError(null);
  };

  const handleApprove = async (product) => {
    if (!product) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/product-approvals', {
        method: 'POST',
        headers: getAdminHeaders('application/json'),
        body: JSON.stringify({
          id: product.id,
          action: 'approve',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not approve product');
      }

      setNotice(`✓ "${product.name}" has been approved and is now live on Shop Now.`);
      setSelectedProduct(null);
      await fetchProducts();

      // Trigger cross-component sync event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('MTBOSSShopProductsUpdated'));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (product) => {
    if (!product) return;
    const trimmed = rejectionReason.trim();
    if (!trimmed || trimmed.length < 3) {
      setError('Please provide a specific rejection reason (at least 3 characters) so the supplier can fix it.');
      return;
    }

    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/product-approvals', {
        method: 'POST',
        headers: getAdminHeaders('application/json'),
        body: JSON.stringify({
          id: product.id,
          action: 'reject',
          reason: trimmed,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not reject product');
      }

      setNotice(`"${product.name}" has been rejected with reason: "${trimmed}".`);
      setSelectedProduct(null);
      setRejecting(false);
      setRejectionReason('');
      await fetchProducts();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('MTBOSSShopProductsUpdated'));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const statCards = [
    { label: 'Pending Approvals', value: stats.pending, color: 'pending', filterKey: 'pending' },
    { label: 'Approved Products', value: stats.approved, color: 'verified', filterKey: 'approved' },
    { label: 'Rejected Products', value: stats.rejected, color: 'inactive', filterKey: 'rejected' },
    { label: 'Total Products', value: stats.total, color: 'active', filterKey: 'all' },
  ];

  return (
    <div className={`approvals-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <style jsx>{`
        .approvals-container {
          padding: 1.5rem;
          background: ${isDarkMode ? '#0a0a0c' : '#f8fafc'};
          color: ${isDarkMode ? '#ededed' : '#111827'};
          min-height: 100vh;
          font-family: inherit;
        }

        .header-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-title-row h1 {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
        }

        .header-subtitle {
          font-size: 0.875rem;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          margin: 0.25rem 0 0 0;
        }

        .notice-banner {
          background: ${isDarkMode ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5'};
          border: 1px solid #10b981;
          color: ${isDarkMode ? '#6ee7b7' : '#065f46'};
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.25rem;
          font-size: 0.875rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-banner {
          background: ${isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2'};
          border: 1px solid #ef4444;
          color: ${isDarkMode ? '#fca5a5' : '#991b1b'};
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.25rem;
          font-size: 0.875rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          padding: 1.125rem;
          border-radius: 10px;
          border: 1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
          background: ${isDarkMode ? '#18181b' : '#ffffff'};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
        }

        .stat-card.active-filter {
          border-color: #0284c7;
          box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.25);
        }

        .stat-card.pending {
          border-left: 4px solid #f59e0b;
        }

        .stat-card.verified {
          border-left: 4px solid #10b981;
        }

        .stat-card.inactive {
          border-left: 4px solid #ef4444;
        }

        .stat-card.active {
          border-left: 4px solid #0284c7;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          margin-bottom: 0.35rem;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
        }

        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .filter-tabs {
          display: flex;
          gap: 0.35rem;
          background: ${isDarkMode ? '#18181b' : '#f1f5f9'};
          padding: 0.25rem;
          border-radius: 8px;
          border: 1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
        }

        .filter-btn {
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          border: none;
          background: transparent;
          font-size: 0.8125rem;
          font-weight: 600;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-btn.active {
          background: ${isDarkMode ? '#27272a' : '#ffffff'};
          color: ${isDarkMode ? '#ffffff' : '#0284c7'};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .search-input {
          padding: 0.5rem 0.85rem;
          border: 1px solid ${isDarkMode ? '#27272a' : '#cbd5e1'};
          border-radius: 8px;
          background: ${isDarkMode ? '#18181b' : '#ffffff'};
          color: ${isDarkMode ? '#ffffff' : '#0f172a'};
          font-size: 0.875rem;
          min-width: 260px;
          outline: none;
        }

        .search-input:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
        }

        .table-wrap {
          border: 1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
          border-radius: 10px;
          overflow: auto;
          background: ${isDarkMode ? '#18181b' : '#ffffff'};
        }

        .approvals-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          min-width: 850px;
        }

        .approvals-table th {
          background: ${isDarkMode ? '#202024' : '#f8fafc'};
          padding: 0.875rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          border-bottom: 1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
        }

        .approvals-table td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid ${isDarkMode ? '#27272a' : '#f1f5f9'};
          vertical-align: middle;
        }

        .approvals-table tr:last-child td {
          border-bottom: none;
        }

        .approvals-table tr:hover td {
          background: ${isDarkMode ? '#202024' : '#f8fafc'};
        }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .product-thumb {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          object-fit: cover;
          background: ${isDarkMode ? '#27272a' : '#e2e8f0'};
          border: 1px solid ${isDarkMode ? '#3f3f46' : '#cbd5e1'};
          flex-shrink: 0;
        }

        .product-info strong {
          display: block;
          font-weight: 700;
          color: ${isDarkMode ? '#ffffff' : '#0f172a'};
          line-height: 1.25;
        }

        .product-info small {
          display: block;
          font-size: 0.75rem;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          margin-top: 0.15rem;
        }

        .tier-tag {
          display: inline-block;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          background: ${isDarkMode ? '#312e81' : '#e0e7ff'};
          color: ${isDarkMode ? '#c7d2fe' : '#4338ca'};
          margin-top: 0.25rem;
        }

        .price-text {
          font-weight: 700;
          color: ${isDarkMode ? '#38bdf8' : '#0284c7'};
        }

        .price-meta {
          font-size: 0.75rem;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
        }

        .partner-cell strong {
          display: block;
          font-weight: 600;
          color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
        }

        .partner-cell small {
          display: block;
          font-size: 0.75rem;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .badge-pending {
          background: ${isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#fef3c7'};
          color: ${isDarkMode ? '#fbbf24' : '#b45309'};
          border: 1px solid #f59e0b;
        }

        .badge-approved {
          background: ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5'};
          color: ${isDarkMode ? '#34d399' : '#065f46'};
          border: 1px solid #10b981;
        }

        .badge-rejected {
          background: ${isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2'};
          color: ${isDarkMode ? '#f87171' : '#991b1b'};
          border: 1px solid #ef4444;
        }

        .badge-verified {
          background: ${isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#dcfce7'};
          color: ${isDarkMode ? '#4ade80' : '#15803d'};
        }

        .badge-unverified {
          background: ${isDarkMode ? 'rgba(245, 158, 11, 0.2)' : '#fef9c3'};
          color: ${isDarkMode ? '#facc15' : '#854d0e'};
        }

        .empty-state {
          padding: 3rem;
          text-align: center;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
        }

        .loading-state {
          padding: 3rem;
          text-align: center;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
        }

        /* Detail Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1.5rem;
        }

        .modal-card {
          background: ${isDarkMode ? '#18181b' : '#ffffff'};
          border: 1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
          border-radius: 14px;
          max-width: 760px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          background: ${isDarkMode ? '#18181b' : '#ffffff'};
          z-index: 10;
        }

        .modal-header h2 {
          font-size: 1.125rem;
          font-weight: 800;
          margin: 0;
          color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
        }

        .modal-close-btn:hover {
          color: ${isDarkMode ? '#ffffff' : '#000000'};
          background: ${isDarkMode ? '#27272a' : '#f1f5f9'};
        }

        .modal-body {
          padding: 1.5rem;
        }

        .warning-box {
          background: ${isDarkMode ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb'};
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 0.875rem 1rem;
          margin-bottom: 1.25rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          color: ${isDarkMode ? '#fde68a' : '#92400e'};
          font-size: 0.8125rem;
        }

        .warning-box strong {
          display: block;
          font-weight: 700;
          margin-bottom: 0.15rem;
        }

        .gallery-wrap {
          margin-bottom: 1.25rem;
        }

        .main-preview {
          width: 100%;
          height: 240px;
          object-fit: contain;
          background: ${isDarkMode ? '#09090b' : '#f8fafc'};
          border: 1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .thumbs-row {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .thumb-btn {
          width: 56px;
          height: 56px;
          border-radius: 6px;
          border: 2px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
          padding: 0;
          overflow: hidden;
          background: transparent;
          cursor: pointer;
          flex-shrink: 0;
        }

        .thumb-btn.active {
          border-color: #0284c7;
        }

        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.875rem 1.25rem;
          margin-bottom: 1.25rem;
        }

        .detail-item {
          font-size: 0.8125rem;
        }

        .detail-label {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${isDarkMode ? '#94a3b8' : '#64748b'};
          margin-bottom: 0.15rem;
        }

        .detail-val {
          color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
          font-weight: 600;
        }

        .partner-box {
          background: ${isDarkMode ? '#202024' : '#f8fafc'};
          border: 1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.25rem;
        }

        .partner-box-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .partner-box-head strong {
          font-size: 0.875rem;
          color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
        }

        .specs-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.35rem;
        }

        .spec-chip {
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          background: ${isDarkMode ? '#27272a' : '#f1f5f9'};
          color: ${isDarkMode ? '#e2e8f0' : '#334155'};
          border: 1px solid ${isDarkMode ? '#3f3f46' : '#cbd5e1'};
        }

        .rejection-box {
          background: ${isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2'};
          border: 1px solid #ef4444;
          border-radius: 8px;
          padding: 0.875rem 1rem;
          margin-bottom: 1.25rem;
          font-size: 0.8125rem;
          color: ${isDarkMode ? '#fca5a5' : '#991b1b'};
        }

        .rejection-box strong {
          display: block;
          margin-bottom: 0.25rem;
        }

        .reject-input-area {
          background: ${isDarkMode ? '#202024' : '#f8fafc'};
          border: 1px solid ${isDarkMode ? '#3f3f46' : '#cbd5e1'};
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .reject-input-area textarea {
          width: 100%;
          border: 1px solid ${isDarkMode ? '#3f3f46' : '#cbd5e1'};
          background: ${isDarkMode ? '#18181b' : '#ffffff'};
          color: ${isDarkMode ? '#ffffff' : '#0f172a'};
          padding: 0.65rem;
          border-radius: 6px;
          font-size: 0.8125rem;
          outline: none;
          margin-top: 0.5rem;
          resize: vertical;
        }

        .reject-input-area textarea:focus {
          border-color: #ef4444;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
          margin-top: 1.25rem;
        }

        .btn-approve {
          flex: 1;
          padding: 0.65rem 1rem;
          background: #10b981;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          transition: background 0.15s;
        }

        .btn-approve:hover:not(:disabled) {
          background: #059669;
        }

        .btn-reject {
          flex: 1;
          padding: 0.65rem 1rem;
          background: #ef4444;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          transition: background 0.15s;
        }

        .btn-reject:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn-cancel {
          padding: 0.65rem 1.25rem;
          background: ${isDarkMode ? '#27272a' : '#e2e8f0'};
          color: ${isDarkMode ? '#ffffff' : '#334155'};
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel:hover {
          background: ${isDarkMode ? '#3f3f46' : '#cbd5e1'};
        }

        .clickable-product-row {
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .clickable-product-row:hover {
          background-color: ${isDarkMode ? '#1e293b' : '#f1f5f9'} !important;
        }

        .detail-page-container {
          background: ${isDarkMode ? '#18181b' : '#ffffff'};
          border: 1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'};
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .back-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: ${isDarkMode ? '#27272a' : '#f8fafc'};
          color: ${isDarkMode ? '#f8fafc' : '#0f172a'};
          border: 1px solid ${isDarkMode ? '#3f3f46' : '#cbd5e1'};
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .back-nav-btn:hover {
          background: ${isDarkMode ? '#3f3f46' : '#e2e8f0'};
        }
      `}</style>

      {/* Header */}
      <div className="header-title-row">
        <div>
          <h1>
            <PackageCheck size={28} color="#0284c7" strokeWidth={2} />
            Product Approvals
          </h1>
          <p className="header-subtitle">
            Review, approve or reject products submitted by registered suppliers before they go live on Shop Now.
          </p>
        </div>
      </div>

      {/* Banners */}
      {notice && (
        <div className="notice-banner">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <span>❌ <strong>Error:</strong> {error}</span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* VIEW 1: PRODUCT DETAIL PAGE (WHEN A ROW IS CLICKED) */}
      {selectedProduct ? (
        <div className="product-detail-page-view">
          {/* Top Back Navigation Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              type="button"
              className="back-nav-btn"
              onClick={() => {
                setSelectedProduct(null);
                setRejecting(false);
                setRejectionReason('');
              }}
            >
              <ArrowLeft size={18} /> Back to service provider Product Approvals
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge" style={{ fontSize: '0.8125rem' }}>
                Product #{selectedProduct.id}
              </span>
              {selectedProduct.approval_status === 'pending' && <span className="badge badge-pending">⏳ Pending Review</span>}
              {selectedProduct.approval_status === 'approved' && <span className="badge badge-approved">✓ Approved</span>}
              {selectedProduct.approval_status === 'rejected' && <span className="badge badge-rejected">✕ Rejected</span>}
            </div>
          </div>

          {/* Detail Card Container */}
          <div className="detail-page-container">
            {/* service provider Unverified Warning */}
            {!(selectedProduct.vendor_is_approved === true || selectedProduct.vendor_verification_status === 'verified') && (
              <div className="warning-box">
                <AlertCircle size={22} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <strong>Caution: Unverified Partner</strong>
                  This product is submitted by <strong>{selectedProduct.shop_name || selectedProduct.vendor_name || 'an unverified partner'}</strong> who has not yet completed admin verification. Proceed with caution.
                </div>
              </div>
            )}

            {/* Existing Rejection Notice */}
            {selectedProduct.approval_status === 'rejected' && selectedProduct.rejection_reason && (
              <div className="rejection-box">
                <strong>Rejection Reason on Record:</strong>
                &quot;{selectedProduct.rejection_reason}&quot;
                {selectedProduct.rejected_by && (
                  <small style={{ display: 'block', marginTop: 4, opacity: 0.85 }}>
                    Rejected by {selectedProduct.rejected_by} on {selectedProduct.rejected_at ? new Date(selectedProduct.rejected_at).toLocaleString() : ''}
                  </small>
                )}
              </div>
            )}

            {/* Gallery Preview */}
            {(() => {
              const images = Array.isArray(selectedProduct.images) && selectedProduct.images.length
                ? selectedProduct.images
                : (selectedProduct.image_url ? [selectedProduct.image_url] : []);
              if (!images.length) return null;
              const activeImg = images[activeImageIdx] || images[0];

              return (
                <div className="gallery-wrap">
                  <img src={activeImg} alt={selectedProduct.name} className="main-preview" />
                  {images.length > 1 && (
                    <div className="thumbs-row">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`thumb-btn ${activeImageIdx === idx ? 'active' : ''}`}
                          onClick={() => setActiveImageIdx(idx)}
                        >
                          <img src={img} alt={`Thumb ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Product Specifications & Details Grid */}
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Product Name</div>
                <div className="detail-val">{selectedProduct.name}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Category / Subcategory</div>
                <div className="detail-val">
                  {selectedProduct.category || 'Unassigned'}
                  {selectedProduct.subcategory ? ` · ${selectedProduct.subcategory}` : ''}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Quality Tier</div>
                <div className="detail-val">
                  {selectedProduct.quality_tier ? selectedProduct.quality_tier.toUpperCase() : 'None'}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Brand</div>
                <div className="detail-val">{selectedProduct.brand || 'Unbranded / Generic'}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Buy Now Selling Price</div>
                <div className="detail-val" style={{ color: '#0284c7', fontSize: '1.05rem' }}>
                  ₹{Number(selectedProduct.price || 0).toLocaleString('en-IN')} / {selectedProduct.unit || 'unit'}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Original / Compare Price</div>
                <div className="detail-val">
                  {selectedProduct.compare_at_price ? `₹${Number(selectedProduct.compare_at_price).toLocaleString('en-IN')}` : 'None'}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Get Quote Price Range</div>
                <div className="detail-val">
                  {selectedProduct.quote_price_range ? `₹${selectedProduct.quote_price_range}` : 'None'}
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Available Stock / Quantity</div>
                <div className="detail-val">
                  {selectedProduct.quantity ?? 0} {selectedProduct.unit || 'units'}
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedProduct.description && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="detail-label">Description</div>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                  {selectedProduct.description}
                </p>
              </div>
            )}

            {/* Specifications List */}
            {selectedProduct.specifications && (() => {
              const specs = { ...selectedProduct.specifications };
              delete specs.__approval__;
              const entries = Object.entries(specs);
              if (!entries.length) return null;
              return (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div className="detail-label">Product Specifications ({entries.length})</div>
                  <div className="specs-chips">
                    {entries.map(([k, v]) => (
                      <span key={k} className="spec-chip">
                        <strong>{k}:</strong> {String(v)}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Service Provider Information Box */}
            <div className="partner-box">
              <div className="partner-box-head">
                <strong>{selectedProduct.supplier_id ? 'Supplier Information' : 'Service Provider Information'}</strong>
                <span className={`badge ${selectedProduct.vendor_is_approved === true || selectedProduct.vendor_verification_status === 'verified' ? 'badge-verified' : 'badge-unverified'}`}>
                  {selectedProduct.vendor_is_approved === true ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div className="detail-grid" style={{ marginBottom: 0 }}>
                <div className="detail-item">
                  <div className="detail-label">Shop / Business</div>
                  <div className="detail-val">{selectedProduct.shop_name || 'Not provided'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">{selectedProduct.supplier_id ? 'Supplier / Store' : 'Service Provider Name'}</div>
                  <div className="detail-val">{selectedProduct.vendor_name || 'Not provided'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Email</div>
                  <div className="detail-val">{selectedProduct.vendor_email || 'Not provided'}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Phone / Location</div>
                  <div className="detail-val">
                    {selectedProduct.vendor_phone || ''} · {selectedProduct.vendor_city || ''}, {selectedProduct.vendor_state || ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection Prompt Form */}
            {rejecting && (
              <div className="reject-input-area">
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ef4444' }}>
                  Specify Rejection Reason (Required)
                </div>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                  This reason will be visible to the supplier so they understand what corrections are needed before resubmitting.
                </p>
                <textarea
                  rows={3}
                  placeholder="e.g. Price is too high compared to market, image quality is insufficient, or category is inaccurate..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn-reject"
                    onClick={() => handleReject(selectedProduct)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setRejecting(false);
                      setRejectionReason('');
                    }}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!rejecting && (
              <div className="modal-actions" style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: `1px solid ${isDarkMode ? '#27272a' : '#e2e8f0'}` }}>
                <button
                  type="button"
                  className="btn-approve"
                  onClick={() => handleApprove(selectedProduct)}
                  disabled={actionLoading}
                >
                  <CheckCircle2 size={18} />
                  {actionLoading ? 'Processing...' : 'Approve & Publish to Shop Now'}
                </button>

                <button
                  type="button"
                  className="btn-reject"
                  onClick={() => setRejecting(true)}
                  disabled={actionLoading}
                >
                  <XCircle size={18} />
                  Reject Product
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* VIEW 2: STATS, CONTROLS & TABLE */
        <>
          {/* Stat Cards */}
          <div className="stats-grid">
            {statCards.map((sc) => (
              <div
                key={sc.label}
                className={`stat-card ${sc.color} ${filter === sc.filterKey ? 'active-filter' : ''}`}
                onClick={() => setFilter(sc.filterKey)}
              >
                <div className="stat-label">{sc.label}</div>
                <div className="stat-value">{sc.value}</div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="filter-tabs">
              {[
                { key: 'all', label: 'All Products' },
                { key: 'pending', label: `Pending (${stats.pending})` },
                { key: 'approved', label: `Approved (${stats.approved})` },
                { key: 'rejected', label: `Rejected (${stats.rejected})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`filter-btn ${filter === tab.key ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search by product, category, supplier, store..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table-wrap">
            {loading ? (
              <div className="loading-state">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                No products found matching filter &quot;{filter}&quot;{searchTerm ? ` and search "${searchTerm}"` : ''}.
              </div>
            ) : (
              <table className="approvals-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price / Quote</th>
                    <th>Supplier / Store</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const price = Number(p.price || 0);
                    const comparePrice = p.compare_at_price ? Number(p.compare_at_price) : null;
                    const images = Array.isArray(p.images) && p.images.length ? p.images : (p.image_url ? [p.image_url] : []);
                    const coverImg = images[0] || '';
                    const isVerified = p.vendor_is_approved === true || p.vendor_verification_status === 'verified';
                    const status = p.approval_status || 'approved';

                    return (
                      <tr
                        key={p.id}
                        onClick={() => openProduct(p)}
                        className="clickable-product-row"
                        title="Click to view full product details"
                      >
                        <td>
                          <div className="product-cell">
                            {coverImg ? (
                              <img src={coverImg} alt={p.name} className="product-thumb" />
                            ) : (
                              <div className="product-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                📦
                              </div>
                            )}
                            <div className="product-info">
                              <strong>{p.name}</strong>
                              {p.quality_tier && (
                                <span className="tier-tag">{p.quality_tier.toUpperCase()} TIER</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="product-info">
                            <strong>{p.category || 'Unassigned'}</strong>
                            {p.subcategory && <small>{p.subcategory}</small>}
                          </div>
                        </td>
                        <td>
                          <div>
                            <span className="price-text">₹{price.toLocaleString('en-IN')}</span>
                            {p.unit && <small className="price-meta"> / {p.unit}</small>}
                          </div>
                          {p.quote_price_range && (
                            <div className="price-meta">Quote: ₹{p.quote_price_range}</div>
                          )}
                        </td>
                        <td>
                          <div className="partner-cell">
                            <strong>{p.shop_name || p.vendor_name || p.supplier_id ? `Supplier #${p.supplier_id}` : `Service Provider #${p.vendor_id}`}</strong>
                            <small>{p.vendor_city || 'City not specified'}</small>
                            <span className={`badge ${isVerified ? 'badge-verified' : 'badge-unverified'}`} style={{ marginTop: 3 }}>
                              {isVerified ? '✓ Verified' : '⚠️ Unverified'}
                            </span>
                          </div>
                        </td>
                        <td>
                          {status === 'pending' && (
                            <span className="badge badge-pending">⏳ Pending</span>
                          )}
                          {status === 'approved' && (
                            <span className="badge badge-approved">✓ Approved</span>
                          )}
                          {status === 'rejected' && (
                            <span className="badge badge-rejected" title={p.rejection_reason || 'Rejected'}>
                              ✕ Rejected
                            </span>
                          )}
                        </td>
                        <td>
                          <small className="price-meta">
                            {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : '—'}
                          </small>
                        </td>
                        <td>
                          <ActionIconButton
                            icon={Eye}
                            label="Review product details and approval"
                            onClick={(e) => {
                              e.stopPropagation();
                              openProduct(p);
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
