'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RefreshCw } from '@/app/components/ui/icons';

const statuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Lost'];
const stages = ['New', 'Meeting Done', 'Estimate Sent', 'Negotiation', 'Final', 'Lost'];
const priorities = ['Low', 'Normal', 'High', 'Urgent'];
const PM_SPECIALIZATIONS = [
  { key: 'payments', label: 'Payments', icon: '💰' },
  { key: 'labor', label: 'Labor', icon: '👷' },
  { key: 'vendor', label: 'Vendors', icon: '🏬' },
  { key: 'construction', label: 'Construction', icon: '🏗️' },
];

function formatDate(val) {
  if (!val) return '—';
  try {
    return new Date(val).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(val);
  }
}

function formatINR(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return '₹0';
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function computeDiff(before, after) {
  if (!before && !after) return [];
  const b = typeof before === 'string' ? JSON.parse(before || '{}') : (before || {});
  const a = typeof after === 'string' ? JSON.parse(after || '{}') : (after || {});
  const fields = [
    'status',
    'lead_stage',
    'agent_id',
    'assigned_franchise_id',
    'assigned_vendor_id',
    'priority',
    'final_amount',
    'follow_up_date',
    'notes',
    'client_requirement',
    'client_name',
    'client_phone',
    'client_email',
    'city',
  ];

  const diffs = [];
  for (const k of fields) {
    if (b[k] !== undefined && a[k] !== undefined && String(b[k] ?? '') !== String(a[k] ?? '')) {
      diffs.push({
        label: k.replaceAll('_', ' '),
        from: String(b[k] ?? 'None'),
        to: String(a[k] ?? 'None'),
      });
    }
  }
  return diffs;
}

export default function LeadDetailView({
  leadId,
  initialLead = null,
  isDarkMode = false,
  onBack,
  onUpdateLead,
  onConvertLead,
  agents = [],
  franchises = [],
  vendors = [],
}) {
  const [lead, setLead] = useState(initialLead);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(!initialLead);
  const [error, setError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updatingField, setUpdatingField] = useState(null);

  const isFinalized = Boolean(lead?.converted_project_id || lead?.project_id);

  const token = () =>
    (typeof window !== 'undefined'
      ? localStorage.getItem('token') || localStorage.getItem('admin-token')
      : '');

  const loadLead = useCallback(async () => {
    if (!leadId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/lead-management?leadId=${leadId}`, {
        headers: { Authorization: `Bearer ${token()}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success && data.data) {
        setLead(data.data);
        setHistory(data.history || []);
      } else {
        throw new Error(data.error || 'Lead not found');
      }
    } catch (err) {
      setError(err.message || 'Could not load lead details.');
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  const handleFieldUpdate = async (field, value) => {
    setUpdatingField(field);
    setUpdateError('');
    try {
      const patch = { [field]: value };
      if (field === 'status' && value === 'Converted' && lead?.lead_stage !== 'Final') {
        patch.lead_stage = 'Final';
      }
      if (field === 'lead_stage' && value === 'Final' && lead?.status !== 'Converted') {
        patch.status = 'Converted';
      }
      const res = await onUpdateLead(lead.id, patch);
      if (res && res.success === false) {
        setUpdateError(res.error || 'Update failed');
        return;
      }
      setLead((prev) => (prev ? { ...prev, ...patch } : prev));
      await loadLead();
    } catch (err) {
      console.warn('Field update error:', err);
      setUpdateError(err.message || 'Update failed');
    } finally {
      setUpdatingField(null);
    }
  };

  const currentAssignedAgents = useMemo(() => {
    if (Array.isArray(lead?.assigned_agents) && lead.assigned_agents.length > 0) {
      return lead.assigned_agents;
    }
    const ids = new Set();
    if (lead?.agent_id) ids.add(Number(lead.agent_id));
    if (Array.isArray(lead?.assigned_agent_ids)) {
      lead.assigned_agent_ids.forEach((id) => ids.add(Number(id)));
    } else if (typeof lead?.assigned_agent_ids === 'string') {
      try {
        const parsed = JSON.parse(lead.assigned_agent_ids);
        if (Array.isArray(parsed)) parsed.forEach((id) => ids.add(Number(id)));
      } catch {}
    }
    return Array.from(ids).map((id) => {
      const found = agents.find((a) => Number(a.id) === Number(id));
      return found || { id, name: `Agent #${id}`, city: '', specializations: [] };
    });
  }, [lead, agents]);

  const handleToggleSpecialization = async (agentId, specKey) => {
    const numId = Number(agentId);
    setUpdatingField(`spec-${numId}`);
    setUpdateError('');
    try {
      const targetAgent = currentAssignedAgents.find((a) => Number(a.id) === numId)
        || agents.find((a) => Number(a.id) === numId);
      const currentSpecs = Array.isArray(targetAgent?.specializations)
        ? targetAgent.specializations
        : (typeof targetAgent?.specializations === 'string'
            ? (() => { try { return JSON.parse(targetAgent.specializations); } catch { return []; } })()
            : []);
      const newSpecs = currentSpecs.includes(specKey)
        ? currentSpecs.filter((k) => k !== specKey)
        : [...currentSpecs, specKey];

      // Optimistically update
      setLead((prev) => {
        if (!prev) return prev;
        const currentList = prev.assigned_agents || currentAssignedAgents;
        const updatedList = currentList.map((a) => {
          if (Number(a.id) === numId) {
            return { ...a, specializations: newSpecs };
          }
          return a;
        });
        return { ...prev, assigned_agents: updatedList };
      });

      const res = await onUpdateLead(lead.id, {
        agent_specializations: { agent_id: numId, specializations: newSpecs },
      });
      if (res && res.success === false) {
        setUpdateError(res.error || 'Failed to update specialization');
        await loadLead();
      }
    } catch (err) {
      setUpdateError(err.message || 'Failed to update specialization');
      await loadLead();
    } finally {
      setUpdatingField(null);
    }
  };

  const handleAddAgent = async (agentId) => {
    if (!agentId) return;
    const numId = Number(agentId);
    const existingIds = currentAssignedAgents.map((a) => Number(a.id));
    if (existingIds.includes(numId)) return;
    const nextIds = [...existingIds, numId];
    setUpdatingField('add-agent');
    setUpdateError('');
    try {
      const res = await onUpdateLead(lead.id, { assigned_agent_ids: nextIds });
      if (res && res.success === false) {
        setUpdateError(res.error || 'Failed to assign agent');
        return;
      }
      await loadLead();
    } catch (err) {
      setUpdateError(err.message || 'Failed to assign agent');
    } finally {
      setUpdatingField(null);
    }
  };

  const handleRemoveAgent = async (agentId) => {
    const numId = Number(agentId);
    const nextIds = currentAssignedAgents
      .map((a) => Number(a.id))
      .filter((id) => id !== numId);
    setUpdatingField(`remove-${numId}`);
    setUpdateError('');
    try {
      const res = await onUpdateLead(lead.id, { assigned_agent_ids: nextIds });
      if (res && res.success === false) {
        setUpdateError(res.error || 'Failed to unassign agent');
        return;
      }
      await loadLead();
    } catch (err) {
      setUpdateError(err.message || 'Failed to unassign agent');
    } finally {
      setUpdatingField(null);
    }
  };

  const handleSetPrimaryAgent = async (agentId) => {
    const numId = Number(agentId);
    const otherIds = currentAssignedAgents
      .map((a) => Number(a.id))
      .filter((id) => id !== numId);
    const nextIds = [numId, ...otherIds];
    setUpdatingField(`primary-${numId}`);
    setUpdateError('');
    try {
      const res = await onUpdateLead(lead.id, { assigned_agent_ids: nextIds });
      if (res && res.success === false) {
        setUpdateError(res.error || 'Failed to update primary agent');
        return;
      }
      await loadLead();
    } catch (err) {
      setUpdateError(err.message || 'Failed to update primary agent');
    } finally {
      setUpdatingField(null);
    }
  };

  const bg = isDarkMode ? '#0f0f0f' : '#ffffff';
  const surface = isDarkMode ? '#171717' : '#f8fafc';
  const cardBg = isDarkMode ? '#1f1f23' : '#ffffff';
  const border = isDarkMode ? '#2b2b2b' : '#e5e7eb';
  const text = isDarkMode ? '#f3f4f6' : '#111827';
  const muted = isDarkMode ? '#9ca3af' : '#64748b';
  const inputStyle = {
    background: surface,
    border: `1px solid ${border}`,
    color: text,
    borderRadius: 6,
    padding: '0.45rem 0.65rem',
    fontSize: '0.78rem',
    fontWeight: 700,
    outline: 'none',
  };

  const cityFranchises = franchises.filter(
    (item) => !lead?.city || item.city?.trim().toLowerCase() === lead.city?.trim().toLowerCase()
  );
  const cityVendors = vendors.filter(
    (item) => !lead?.city || item.city?.trim().toLowerCase() === lead.city?.trim().toLowerCase()
  );

  return (
    <div className={`lead-detail-root${isDarkMode ? ' dark-mode' : ''}`} style={{ display: 'grid', gap: '1rem', color: text }}>
      <style>{`
        .ld-shimmer {
          background: linear-gradient(90deg, #f0f0f2 25%, #e6e6e9 50%, #f0f0f2 75%);
          background-size: 200% 100%;
          animation: ldShimmer 1.5s infinite;
          border-radius: 6px;
        }
        .dark-mode .ld-shimmer {
          background: linear-gradient(90deg, #24242a 25%, #2e2e36 50%, #24242a 75%);
          background-size: 200% 100%;
        }
        @keyframes ldShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .ld-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid ${border};
          background: ${surface};
          color: ${text};
          border-radius: 6px;
          padding: 0.5rem 0.85rem;
          font-weight: 800;
          font-size: 0.82rem;
          cursor: pointer;
          transition: background 0.15s;
        }
        .ld-back-btn:hover {
          background: ${isDarkMode ? '#28282e' : '#e2e8f0'};
        }
        .ld-card {
          background: ${cardBg};
          border: 1px solid ${border};
          border-radius: 8px;
          padding: 1rem 1.15rem;
        }
        .ld-kv-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.85rem;
        }
        .ld-kv small {
          display: block;
          color: ${muted};
          font-size: 0.68rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .05em;
          margin-bottom: 0.2rem;
        }
        .ld-kv strong, .ld-kv span {
          font-size: 0.86rem;
          word-break: break-word;
        }
        .ld-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          text-transform: capitalize;
        }
        .ld-badge-New { background: #e0f2fe; color: #0369a1; }
        .ld-badge-Contacted { background: #fef3c7; color: #92400e; }
        .ld-badge-Follow-up { background: #fef9c3; color: #854d0e; }
        .ld-badge-Converted { background: #dcfce7; color: #166534; }
        .ld-badge-Lost { background: #fee2e2; color: #991b1b; }
        .ld-badge-Urgent { background: #fee2e2; color: #b91c1c; font-weight: 900; }
        .ld-badge-High { background: #ffedd5; color: #c2410c; }
        .ld-badge-Normal { background: #f1f5f9; color: #475569; }
        .ld-badge-Low { background: #f8fafc; color: #64748b; }
        .ld-history-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.78rem;
        }
        .ld-history-table th {
          text-align: left;
          padding: 0.55rem 0.75rem;
          background: ${surface};
          color: ${muted};
          font-size: 0.68rem;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: .06em;
          border-bottom: 1px solid ${border};
        }
        .ld-history-table td {
          padding: 0.65rem 0.75rem;
          border-bottom: 1px solid ${border};
          vertical-align: top;
        }
        @media(max-width: 768px) {
          .ld-kv-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Navigation Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button type="button" className="ld-back-btn" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Back to leads
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            className="ld-back-btn"
            onClick={loadLead}
            disabled={loading}
            title="Refresh lead details"
          >
            <RefreshCw size={15} strokeWidth={1.75} aria-hidden="true" />
            Refresh
          </button>
          {lead?.status === 'Converted' && lead?.converted_project_id ? (
            <button
              type="button"
              onClick={() => {
                window.location.href = `/dashboard?tab=party-project-management&projectId=${lead.converted_project_id}`;
              }}
              style={{
                background: 'var(--accent, #2563eb)',
                color: '#fff',
                border: 0,
                borderRadius: 6,
                padding: '0.5rem 0.9rem',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              View Converted Project →
            </button>
          ) : lead?.status === 'Converted' ? (
            <button
              type="button"
              onClick={() => onConvertLead(lead)}
              style={{
                background: '#16a34a',
                color: '#fff',
                border: 0,
                borderRadius: 6,
                padding: '0.5rem 0.9rem',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Convert to Project
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="ld-card" style={{ borderColor: '#ef4444', background: isDarkMode ? '#2d1818' : '#fef2f2', color: '#dc2626' }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Failed to load lead</div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.82rem' }}>{error}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="ld-back-btn" onClick={loadLead}>Try Again</button>
            <button type="button" className="ld-back-btn" onClick={onBack}>Return to List</button>
          </div>
        </div>
      ) : loading && !lead ? (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="ld-card">
            <div className="ld-shimmer" style={{ height: '32px', width: '45%', marginBottom: '0.6rem' }} />
            <div className="ld-shimmer" style={{ height: '18px', width: '30%' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
            <div className="ld-card" style={{ height: '180px' }}>
              <div className="ld-shimmer" style={{ height: '100%' }} />
            </div>
            <div className="ld-card" style={{ height: '180px' }}>
              <div className="ld-shimmer" style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      ) : lead ? (
        <>
          {/* Main Lead Header Card */}
          <div className="ld-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ color: muted, fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '0.2rem' }}>
                  Lead #{lead.id} · Source: {lead.lead_source || 'Manual'}
                </div>
                <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 900 }}>{lead.client_name}</h2>
                <div style={{ color: muted, fontSize: '0.82rem', marginTop: '0.25rem' }}>
                  {lead.city ? <span>📍 {lead.city}</span> : null}
                  {lead.service_type ? <span style={{ marginLeft: '0.75rem' }}>💼 {lead.service_type}</span> : null}
                  {lead.final_amount ? <span style={{ marginLeft: '0.75rem', fontWeight: 800, color: 'var(--accent, #2563eb)' }}>💵 {formatINR(lead.final_amount)}</span> : null}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span className={`ld-badge ld-badge-${lead.status || 'New'}`}>{lead.status || 'New'}</span>
                <span className="ld-badge" style={{ background: '#f1f5f9', color: '#334155', border: `1px solid ${border}` }}>
                  Stage: {lead.lead_stage || 'New'}
                </span>
                <span className={`ld-badge ld-badge-${lead.priority || 'Normal'}`}>
                  Priority: {lead.priority || 'Normal'}
                </span>
              </div>
            </div>

            {/* Quick Controls Row */}
            <div
              style={{
                marginTop: '1.15rem',
                paddingTop: '1rem',
                borderTop: `1px solid ${border}`,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.65rem',
                alignItems: 'center',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', color: muted, marginBottom: '0.2rem' }}>Status</label>
                <select
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                  }}
                  value={lead.status || 'New'}
                  disabled={updatingField === 'status'}
                  onChange={(e) => handleFieldUpdate('status', e.target.value)}
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', color: muted, marginBottom: '0.2rem' }}>Stage</label>
                <select
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                  }}
                  value={lead.lead_stage || 'New'}
                  disabled={updatingField === 'lead_stage'}
                  onChange={(e) => handleFieldUpdate('lead_stage', e.target.value)}
                >
                  {stages.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', color: muted, marginBottom: '0.2rem' }}>Priority</label>
                <select
                  style={inputStyle}
                  value={lead.priority || 'Normal'}
                  disabled={updatingField === 'priority'}
                  onChange={(e) => handleFieldUpdate('priority', e.target.value)}
                >
                  {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', color: muted, marginBottom: '0.2rem' }}>
                  Assigned Agent {currentAssignedAgents.length > 1 ? `(${currentAssignedAgents.length})` : ''}
                </label>
                <select
                  style={inputStyle}
                  value={lead.agent_id || (currentAssignedAgents[0]?.id) || ''}
                  disabled={updatingField === 'agent_id' || updatingField === 'add-agent'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) {
                      handleFieldUpdate('assigned_agent_ids', []);
                    } else {
                      const numVal = Number(val);
                      const currentIds = currentAssignedAgents.map((a) => Number(a.id));
                      if (!currentIds.includes(numVal)) {
                        handleFieldUpdate('assigned_agent_ids', [numVal, ...currentIds]);
                      } else {
                        handleSetPrimaryAgent(numVal);
                      }
                    }
                  }}
                >
                  <option value="">Not assigned</option>
                  {agents.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.city || 'No city'})</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', color: muted, marginBottom: '0.2rem' }}>Assigned Franchise</label>
                <select
                  style={inputStyle}
                  value={lead.assigned_franchise_id || ''}
                  disabled={updatingField === 'assigned_franchise_id'}
                  onChange={(e) => handleFieldUpdate('assigned_franchise_id', e.target.value)}
                >
                  <option value="">Not assigned</option>
                  {cityFranchises.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', color: muted, marginBottom: '0.2rem' }}>Assigned Vendor</label>
                <select
                  style={inputStyle}
                  value={lead.assigned_vendor_id || ''}
                  disabled={updatingField === 'assigned_vendor_id'}
                  onChange={(e) => handleFieldUpdate('assigned_vendor_id', e.target.value)}
                >
                  <option value="">Not assigned</option>
                  {cityVendors.map((v) => <option key={v.id} value={v.id}>{v.shop_name}</option>)}
                </select>
              </div>
            </div>

            {updateError && (
              <div
                style={{
                  marginTop: '0.85rem',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 6,
                  background: isDarkMode ? '#2d1818' : '#fef2f2',
                  border: '1px solid #ef4444',
                  color: '#dc2626',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>⚠️ {updateError}</span>
                <button
                  type="button"
                  onClick={() => setUpdateError('')}
                  style={{ background: 'none', border: 0, color: '#dc2626', cursor: 'pointer', fontWeight: 900, fontSize: '0.9rem' }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Grid of Information Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {/* Contact Details Card */}
            <div className="ld-card">
              <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '.05em', color: muted }}>
                Contact & Client Details
              </div>
              <div className="ld-kv-grid">
                <div className="ld-kv">
                  <small>Client Name</small>
                  <strong>{lead.client_name}</strong>
                </div>
                <div className="ld-kv">
                  <small>Phone Number</small>
                  <span>
                    <a href={`tel:${lead.client_phone}`} style={{ color: 'var(--accent, #2563eb)', textDecoration: 'none', fontWeight: 800 }}>
                      {lead.client_phone || '—'}
                    </a>
                  </span>
                </div>
                <div className="ld-kv">
                  <small>Email Address</small>
                  <span>
                    {lead.client_email ? (
                      <a href={`mailto:${lead.client_email}`} style={{ color: 'var(--accent, #2563eb)', textDecoration: 'none' }}>
                        {lead.client_email}
                      </a>
                    ) : '—'}
                  </span>
                </div>
                <div className="ld-kv">
                  <small>City</small>
                  <strong>{lead.city || '—'}</strong>
                </div>
                <div className="ld-kv">
                  <small>Follow-up Date</small>
                  <span>{formatDate(lead.follow_up_date)}</span>
                </div>
                <div className="ld-kv">
                  <small>Created Date</small>
                  <span>{formatDate(lead.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Lead Classification Card */}
            <div className="ld-card">
              <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '.05em', color: muted }}>
                Service & Lead Overview
              </div>
              <div className="ld-kv-grid">
                <div className="ld-kv">
                  <small>Service Type</small>
                  <strong>{lead.service_type || '—'}</strong>
                </div>
                <div className="ld-kv">
                  <small>Lead Type</small>
                  <span>{lead.lead_type || '—'}</span>
                </div>
                <div className="ld-kv">
                  <small>Lead Source</small>
                  <span style={{ fontWeight: 700 }}>{lead.lead_source || '—'}</span>
                </div>
                <div className="ld-kv">
                  <small>Deal / Final Amount</small>
                  <strong style={{ color: '#16a34a' }}>{formatINR(lead.final_amount || 0)}</strong>
                </div>
                <div className="ld-kv">
                  <small>Meeting Done</small>
                  <span>{lead.meeting_done ? '✅ Yes' : 'No'}</span>
                </div>
                <div className="ld-kv">
                  <small>Estimate Sent</small>
                  <span>{lead.estimate_sent ? '✅ Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements & Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            <div className="ld-card">
              <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '.05em', color: muted }}>
                Client Requirement
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {lead.client_requirement || 'No specific requirement details recorded.'}
              </p>
            </div>

            <div className="ld-card">
              <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '.05em', color: muted }}>
                Notes & Visit Logs
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {lead.notes || 'No notes recorded.'}
              </p>
              {lead.daily_visit_notes && (
                <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: `1px dashed ${border}` }}>
                  <small style={{ display: 'block', color: muted, fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase' }}>Daily Visit Notes</small>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.84rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {lead.daily_visit_notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Agents & Specializations Card */}
          <div className="ld-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '.05em', color: muted }}>
                  Assigned Agents & Specializations ({currentAssignedAgents.length})
                </div>
                <div style={{ fontSize: '0.74rem', color: muted, marginTop: '2px' }}>
                  Assign multiple agents to this lead/project and configure their operational specializations directly.
                </div>
              </div>

              {/* Quick Add Agent Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <select
                  id="add-agent-select"
                  style={{ ...inputStyle, minWidth: '180px' }}
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddAgent(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  disabled={updatingField === 'add-agent'}
                >
                  <option value="">+ Assign Another Agent...</option>
                  {agents
                    .filter((a) => !currentAssignedAgents.some((ca) => Number(ca.id) === Number(a.id)))
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.city || 'No city'})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {currentAssignedAgents.length === 0 ? (
              <div style={{ padding: '1.25rem', textAlign: 'center', background: surface, borderRadius: 6, border: `1px dashed ${border}`, color: muted, fontSize: '0.82rem' }}>
                No agents currently assigned. Use the dropdown above to assign agents.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {currentAssignedAgents.map((agent, index) => {
                  const isPrimary = Number(lead.agent_id) === Number(agent.id) || index === 0;
                  const agentSpecs = Array.isArray(agent.specializations)
                    ? agent.specializations
                    : (typeof agent.specializations === 'string'
                        ? (() => { try { return JSON.parse(agent.specializations); } catch { return []; } })()
                        : []);

                  return (
                    <div
                      key={agent.id}
                      style={{
                        padding: '0.8rem 1rem',
                        borderRadius: 8,
                        background: surface,
                        border: `1px solid ${border}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      {/* Agent Info */}
                      <div style={{ minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{agent.name}</span>
                          {isPrimary ? (
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                background: '#dbeafe',
                                color: '#1e40af',
                                padding: '2px 7px',
                                borderRadius: 999,
                                textTransform: 'uppercase',
                              }}
                            >
                              Primary Agent
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryAgent(agent.id)}
                              style={{
                                background: 'transparent',
                                border: `1px solid ${border}`,
                                borderRadius: 4,
                                padding: '2px 6px',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                color: muted,
                                cursor: 'pointer',
                              }}
                              title="Set as Primary Agent for this lead"
                            >
                              Make Primary
                            </button>
                          )}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: muted, marginTop: '2px' }}>
                          {agent.city ? <span>📍 {agent.city}</span> : null}
                          {agent.phone ? <span style={{ marginLeft: '0.5rem' }}>📞 {agent.phone}</span> : null}
                          {agent.email ? <span style={{ marginLeft: '0.5rem' }}>✉️ {agent.email}</span> : null}
                        </div>
                      </div>

                      {/* Specializations inline toggles */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: muted, textTransform: 'uppercase', marginRight: '0.2rem' }}>
                          Specializations:
                        </span>
                        {PM_SPECIALIZATIONS.map((spec) => {
                          const isActive = agentSpecs.includes(spec.key);
                          const isBusy = updatingField === `spec-${agent.id}`;
                          return (
                            <button
                              key={spec.key}
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleToggleSpecialization(agent.id, spec.key)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '0.3rem 0.6rem',
                                borderRadius: 6,
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                cursor: isBusy ? 'wait' : 'pointer',
                                transition: 'all 0.15s ease',
                                border: isActive ? '1px solid #22c55e' : `1px solid ${border}`,
                                background: isActive
                                  ? (isDarkMode ? '#064e3b' : '#dcfce7')
                                  : (isDarkMode ? '#1e1e24' : '#ffffff'),
                                color: isActive
                                  ? (isDarkMode ? '#6ee7b7' : '#15803d')
                                  : muted,
                              }}
                              title={isActive ? `Click to remove ${spec.label} specialization` : `Click to add ${spec.label} specialization`}
                            >
                              <span>{spec.icon}</span>
                              <span>{spec.label}</span>
                              {isActive ? <span>✓</span> : null}
                            </button>
                          );
                        })}

                        {/* Remove Agent Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveAgent(agent.id)}
                          disabled={updatingField === `remove-${agent.id}`}
                          style={{
                            background: isDarkMode ? '#3b1818' : '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            borderRadius: 6,
                            padding: '0.3rem 0.6rem',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            marginLeft: '0.5rem',
                          }}
                          title="Remove agent from this lead"
                        >
                          ✕ Unassign
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Project Conversion Status Card */}
          <div className="ld-card">
            <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '.05em', color: muted }}>
              Project Conversion Status
            </div>
            {lead.status === 'Converted' && lead.converted_project_id ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>
                    Converted to Project: {lead.project_name || `Project #${lead.converted_project_id}`}
                  </div>
                  <div style={{ color: muted, fontSize: '0.78rem', marginTop: '0.2rem' }}>
                    {lead.project_site_address ? `Site: ${lead.project_site_address}` : ''}
                    {lead.project_status ? ` · Status: ${lead.project_status}` : ''}
                    {lead.project_contract_value ? ` · Contract: ${formatINR(lead.project_contract_value)}` : ''}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `/dashboard?tab=party-project-management&projectId=${lead.converted_project_id}`;
                  }}
                  style={{
                    background: 'var(--accent, #2563eb)',
                    color: '#fff',
                    border: 0,
                    borderRadius: 6,
                    padding: '0.5rem 1rem',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Open in Project Overview →
                </button>
              </div>
            ) : lead.status === 'Converted' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16a34a' }}>
                    Lead is marked as Converted and is ready to be converted into a project.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onConvertLead(lead)}
                  style={{
                    background: '#16a34a',
                    color: '#fff',
                    border: 0,
                    borderRadius: 6,
                    padding: '0.5rem 1rem',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Convert to Project
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: muted }}>
                    This lead has not yet been converted into an operational project (Status: <strong>{lead.status || 'New'}</strong>).
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* History & Audit Trail */}
          <div className="ld-card">
            <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '.05em', color: muted }}>
              History & Audit Trail
            </div>

            {history && history.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="ld-history-table">
                  <thead>
                    <tr>
                      <th style={{ width: '160px' }}>Date & Time</th>
                      <th style={{ width: '130px' }}>Changed By</th>
                      <th style={{ width: '100px' }}>Action</th>
                      <th>Changes / Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => {
                      const diffs = computeDiff(h.before_data, h.after_data);
                      return (
                        <tr key={h.id || i}>
                          <td style={{ color: muted, whiteSpace: 'nowrap' }}>
                            {formatDate(h.created_at)}
                          </td>
                          <td style={{ fontWeight: 700 }}>{h.changed_by || 'Admin'}</td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '1px 6px',
                                borderRadius: 4,
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                background: surface,
                                border: `1px solid ${border}`,
                              }}
                            >
                              {h.action || 'updated'}
                            </span>
                          </td>
                          <td>
                            {diffs.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                {diffs.map((d, di) => (
                                  <div key={di} style={{ fontSize: '0.78rem' }}>
                                    <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{d.label}:</span>{' '}
                                    <span style={{ color: muted, textDecoration: 'line-through' }}>{d.from}</span> →{' '}
                                    <strong style={{ color: 'var(--accent, #2563eb)' }}>{d.to}</strong>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: muted, fontStyle: 'italic' }}>Record updated</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '1.25rem', textAlign: 'center', color: muted, fontSize: '0.82rem', fontStyle: 'italic' }}>
                No history recorded
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
