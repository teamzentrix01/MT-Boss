'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

function formatINR(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return '₹0';
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function formatDate(val) {
  if (!val) return '—';
  try {
    return new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(val);
  }
}

export default function OperationalProjectViewModal({
  projectId,
  initialProject = null,
  isDarkMode = false,
  onClose,
  onConvertLead,
}) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(initialProject);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const loadDetails = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError('');
    try {
      const t = localStorage.getItem('admin-token') || localStorage.getItem('agent-token') || localStorage.getItem('token');
      const res = await fetch(`/api/projects/${projectId}?details=1&operational=1`, {
        cache: 'no-store',
        headers: t ? { Authorization: `Bearer ${t}` } : {},
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to load project details');
      }
      setData(json.project || null);
      setAgents(json.agents || []);
    } catch (err) {
      setError(err.message || 'Unable to load project details');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!mounted) return null;

  const isLeadOnly = data?.is_lead_only || String(projectId).startsWith('lead_');
  const leadId = data?.lead_id || data?.source_lead_id || (isLeadOnly ? String(projectId).replace('lead_', '') : null);

  const statusLabel = isLeadOnly
    ? 'Lead, not converted'
    : String(data?.status || data?.project_status || 'running').replaceAll('_', ' ');

  const modalContent = (
    <div
      className={`opm-modal-backdrop${isDarkMode ? ' dark-mode' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        .opm-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          box-sizing: border-box;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .opm-modal-dialog {
          background: #ffffff;
          color: #111827;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          width: 100%;
          max-width: 780px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          animation: opmFadeIn 0.18s ease-out;
        }
        .dark-mode .opm-modal-dialog,
        .opm-modal-backdrop.dark-mode .opm-modal-dialog {
          background: #18181c;
          color: #f3f4f6;
          border-color: #2e2e36;
        }
        @keyframes opmFadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .opm-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.15rem 1.4rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .dark-mode .opm-modal-head {
          border-color: #2e2e36;
        }
        .opm-modal-head h3 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .opm-modal-head p {
          margin: 0.25rem 0 0;
          font-size: 0.78rem;
          color: #6b7280;
        }
        .dark-mode .opm-modal-head p {
          color: #9ca3af;
        }
        .opm-modal-close {
          background: transparent;
          border: 0;
          font-size: 1.5rem;
          line-height: 1;
          color: #9ca3af;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
          border-radius: 6px;
        }
        .opm-modal-close:hover {
          color: #111827;
          background: #f3f4f6;
        }
        .dark-mode .opm-modal-close:hover {
          color: #f3f4f6;
          background: #27272a;
        }
        .opm-modal-body {
          padding: 1.3rem 1.4rem;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }
        .opm-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: capitalize;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          background: #e0e7ff;
          color: #3730a3;
        }
        .opm-badge-lead {
          background: #fef3c7;
          color: #92400e;
        }
        .opm-badge-completed {
          background: #dcfce7;
          color: #166534;
        }
        .opm-badge-running {
          background: #dbeafe;
          color: #1e40af;
        }
        .opm-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
        }
        .opm-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .opm-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.65rem;
        }
        .opm-section-title {
          font-size: 0.76rem;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #6b7280;
          margin-bottom: 0.55rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .dark-mode .opm-section-title {
          color: #9ca3af;
        }
        .opm-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.85rem 1rem;
        }
        .dark-mode .opm-card {
          background: #202026;
          border-color: #2e2e36;
        }
        .opm-kv {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .opm-kv small {
          font-size: 0.7rem;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
        }
        .dark-mode .opm-kv small {
          color: #9ca3af;
        }
        .opm-kv span, .opm-kv strong {
          font-size: 0.85rem;
          word-break: break-word;
        }
        .opm-fin-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem;
          text-align: center;
        }
        .dark-mode .opm-fin-card {
          background: #202026;
          border-color: #2e2e36;
        }
        .opm-fin-card small {
          display: block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 0.25rem;
        }
        .dark-mode .opm-fin-card small {
          color: #94a3b8;
        }
        .opm-fin-card strong {
          display: block;
          font-size: 1.05rem;
          font-weight: 800;
        }
        .opm-modal-foot {
          padding: 0.85rem 1.4rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          background: #f9fafb;
        }
        .dark-mode .opm-modal-foot {
          background: #18181c;
          border-color: #2e2e36;
        }
        .opm-btn-primary {
          background: #2563eb;
          color: #ffffff;
          border: 0;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          text-decoration: none;
        }
        .opm-btn-primary:hover {
          background: #1d4ed8;
        }
        .opm-btn-secondary {
          background: #ffffff;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 0.5rem 0.9rem;
          font-weight: 600;
          font-size: 0.82rem;
          cursor: pointer;
        }
        .dark-mode .opm-btn-secondary {
          background: #27272a;
          color: #e5e7eb;
          border-color: #3f3f46;
        }
        .opm-btn-secondary:hover {
          background: #f3f4f6;
        }
        .dark-mode .opm-btn-secondary:hover {
          background: #3f3f46;
        }
        .opm-lead-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #2563eb;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.76rem;
        }
        .opm-lead-tag:hover {
          text-decoration: underline;
        }
        .opm-skeleton {
          background: linear-gradient(90deg, #f0f0f2 25%, #e6e6e9 50%, #f0f0f2 75%);
          background-size: 200% 100%;
          animation: opmShimmer 1.5s infinite;
          border-radius: 6px;
          height: 18px;
        }
        .dark-mode .opm-skeleton {
          background: linear-gradient(90deg, #24242a 25%, #2e2e36 50%, #24242a 75%);
          background-size: 200% 100%;
        }
        @keyframes opmShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .opm-error-box {
          padding: 1.5rem;
          text-align: center;
          color: #dc2626;
          background: #fef2f2;
          border-radius: 8px;
          border: 1px solid #fecaca;
        }
        .dark-mode .opm-error-box {
          background: #2d1818;
          border-color: #5c2424;
          color: #f87171;
        }
        @media(max-width: 640px) {
          .opm-grid-2, .opm-grid-3, .opm-grid-4 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="opm-modal-dialog">
        <div className="opm-modal-head">
          <div>
            <h3>
              {data?.name || data?.title || 'Project Details'}
              <span className={`opm-badge ${isLeadOnly ? 'opm-badge-lead' : data?.status === 'completed' ? 'opm-badge-completed' : 'opm-badge-running'}`}>
                {statusLabel}
              </span>
            </h3>
            <p>
              {isLeadOnly
                ? 'Lead has been finalized but not yet converted into a project'
                : `Project #${projectId} · Created on ${formatDate(data?.created_at)}`}
            </p>
          </div>
          <button className="opm-modal-close" onClick={onClose} title="Close (Esc)">×</button>
        </div>

        <div className="opm-modal-body">
          {error ? (
            <div className="opm-error-box">
              <p style={{ margin: '0 0 0.8rem', fontWeight: 600 }}>{error}</p>
              <button className="opm-btn-secondary" onClick={loadDetails}>Try Again</button>
            </div>
          ) : loading && !data ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="opm-skeleton" style={{ height: '36px', width: '60%' }} />
              <div className="opm-grid-2">
                <div className="opm-skeleton" style={{ height: '80px' }} />
                <div className="opm-skeleton" style={{ height: '80px' }} />
              </div>
              <div className="opm-grid-4">
                <div className="opm-skeleton" style={{ height: '65px' }} />
                <div className="opm-skeleton" style={{ height: '65px' }} />
                <div className="opm-skeleton" style={{ height: '65px' }} />
                <div className="opm-skeleton" style={{ height: '65px' }} />
              </div>
              <div className="opm-skeleton" style={{ height: '90px' }} />
            </div>
          ) : (
            <>
              {/* Financial Summary Grid */}
              <div>
                <div className="opm-section-title">Financial Summary</div>
                <div className="opm-grid-4">
                  <div className="opm-fin-card">
                    <small>Deal Value</small>
                    <strong style={{ color: '#2563eb' }}>
                      {formatINR(data?.contract_value || data?.deal_amount || 0)}
                    </strong>
                  </div>
                  <div className="opm-fin-card">
                    <small>Received</small>
                    <strong style={{ color: '#16a34a' }}>
                      {formatINR(data?.received || 0)}
                    </strong>
                  </div>
                  <div className="opm-fin-card">
                    <small>Pending</small>
                    <strong style={{ color: Number(data?.pending || 0) > 0 ? '#ea580c' : '#6b7280' }}>
                      {formatINR(data?.pending || 0)}
                    </strong>
                  </div>
                  <div className="opm-fin-card">
                    <small>{Number(data?.profit || 0) >= 0 ? 'Profit' : 'Loss'}</small>
                    <strong style={{ color: Number(data?.profit || 0) >= 0 ? '#16a34a' : '#dc2626' }}>
                      {formatINR(data?.profit || 0)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Client & Site Information */}
              <div>
                <div className="opm-section-title">Client & Location</div>
                <div className="opm-card opm-grid-2">
                  <div className="opm-kv">
                    <small>Client / Party</small>
                    <strong>{data?.party_name || data?.client_name || 'Not provided'}</strong>
                  </div>
                  <div className="opm-kv">
                    <small>Phone Number</small>
                    <span>{data?.party_phone || data?.client_phone || 'Not provided'}</span>
                  </div>
                  <div className="opm-kv">
                    <small>Email</small>
                    <span>{data?.party_email || data?.client_email || 'Not provided'}</span>
                  </div>
                  <div className="opm-kv">
                    <small>City</small>
                    <span>{data?.project_city || data?.lead_city || data?.site_address || 'Not set'}</span>
                  </div>
                  <div className="opm-kv" style={{ gridColumn: 'span 2' }}>
                    <small>Address / Site Location</small>
                    <span>{data?.site_address || data?.party_address || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Project Details & Timeline */}
              <div>
                <div className="opm-section-title">Project & Timeline</div>
                <div className="opm-card opm-grid-3">
                  <div className="opm-kv">
                    <small>Service / Category</small>
                    <span>{data?.lead_service_type || data?.category || data?.project_type || 'General'}</span>
                  </div>
                  <div className="opm-kv">
                    <small>Start Date</small>
                    <span>{formatDate(data?.start_date)}</span>
                  </div>
                  <div className="opm-kv">
                    <small>Expected End Date</small>
                    <span>{formatDate(data?.expected_end_date)}</span>
                  </div>
                </div>
              </div>

              {/* Operations Breakdown: Vendors, Labor, Materials, Expenses */}
              <div>
                <div className="opm-section-title">Operations Breakdown (Read-Only)</div>
                <div className="opm-grid-4">
                  <div className="opm-card" style={{ textAlign: 'center' }}>
                    <small style={{ display: 'block', fontSize: '0.68rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
                      Vendors
                    </small>
                    <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.2rem' }}>
                      {data?.vendor_count || 0}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                      Cost: {formatINR(data?.total_vendor_cost || 0)}
                    </span>
                  </div>
                  <div className="opm-card" style={{ textAlign: 'center' }}>
                    <small style={{ display: 'block', fontSize: '0.68rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
                      Labor
                    </small>
                    <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.2rem' }}>
                      {data?.labor_count || 0}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                      Cost: {formatINR(data?.total_labor_cost || 0)}
                    </span>
                  </div>
                  <div className="opm-card" style={{ textAlign: 'center' }}>
                    <small style={{ display: 'block', fontSize: '0.68rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
                      Materials
                    </small>
                    <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.2rem' }}>
                      {data?.material_received_count || 0}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                      Cost: {formatINR(data?.total_material_cost || 0)}
                    </span>
                  </div>
                  <div className="opm-card" style={{ textAlign: 'center' }}>
                    <small style={{ display: 'block', fontSize: '0.68rem', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
                      Other Expenses
                    </small>
                    <div style={{ fontSize: '1rem', fontWeight: 800, marginTop: '0.2rem' }}>
                      {formatINR(data?.total_other_expenses || 0)}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                      Total: {formatINR(data?.total_expense || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assigned Agents */}
              <div>
                <div className="opm-section-title">Assigned Agent(s)</div>
                <div className="opm-card">
                  {agents && agents.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {agents.map((ag) => (
                        <div
                          key={ag.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.82rem',
                            borderBottom: '1px dashed #e5e7eb',
                            paddingBottom: '0.35rem',
                          }}
                        >
                          <div>
                            <strong>{ag.name}</strong>
                            {ag.city ? <span style={{ color: '#6b7280', marginLeft: '0.4rem' }}>({ag.city})</span> : null}
                          </div>
                          <div style={{ color: '#6b7280', fontSize: '0.76rem' }}>
                            {ag.phone ? <span>{ag.phone}</span> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : data?.assigned_agent_name ? (
                    <div style={{ fontSize: '0.85rem' }}>
                      <strong>{data.assigned_agent_name}</strong>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.82rem', color: '#6b7280', fontStyle: 'italic' }}>
                      No agents currently assigned.
                    </div>
                  )}
                </div>
              </div>

              {/* Source Lead Details (if from a lead) */}
              {leadId ? (
                <div>
                  <div className="opm-section-title">
                    Source Lead Information
                    <a
                      href={`/dashboard?tab=leads&leadId=${leadId}`}
                      className="opm-lead-tag"
                      title="View lead in Lead Management"
                    >
                      (Lead #{leadId} →)
                    </a>
                  </div>
                  <div className="opm-card opm-grid-2">
                    {data?.lead_service_type && (
                      <div className="opm-kv">
                        <small>Service Type</small>
                        <span>{data.lead_service_type}</span>
                      </div>
                    )}
                    {data?.lead_stage && (
                      <div className="opm-kv">
                        <small>Lead Stage</small>
                        <span>{data.lead_stage}</span>
                      </div>
                    )}
                    {data?.lead_client_requirement && (
                      <div className="opm-kv" style={{ gridColumn: 'span 2' }}>
                        <small>Client Requirement</small>
                        <p style={{ margin: 0, fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                          {data.lead_client_requirement}
                        </p>
                      </div>
                    )}
                    {data?.lead_notes && (
                      <div className="opm-kv" style={{ gridColumn: 'span 2' }}>
                        <small>Lead Notes</small>
                        <p style={{ margin: 0, fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                          {data.lead_notes}
                        </p>
                      </div>
                    )}
                    {data?.lead_daily_visit_notes && (
                      <div className="opm-kv" style={{ gridColumn: 'span 2' }}>
                        <small>Daily Visit Notes</small>
                        <p style={{ margin: 0, fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                          {data.lead_daily_visit_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="opm-modal-foot">
          <button className="opm-btn-secondary" onClick={onClose}>
            Close
          </button>
          {isLeadOnly ? (
            <button
              className="opm-btn-primary"
              onClick={() => {
                onClose();
                if (onConvertLead) onConvertLead(data);
              }}
            >
              Convert to Project
            </button>
          ) : (
            <button
              className="opm-btn-primary"
              onClick={() => {
                onClose();
                window.location.href = `/dashboard?tab=party-project-management&projectId=${projectId}`;
              }}
            >
              Open Full Project Overview →
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
