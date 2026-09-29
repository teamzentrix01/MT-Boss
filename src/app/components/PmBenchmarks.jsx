'use client';

import { useCallback, useEffect, useState } from 'react';

// Helpers
const INR = (v) => (v !== null && v !== undefined && !Number.isNaN(Number(v)) ? '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '—');
const tok = () => (typeof localStorage !== 'undefined' ? localStorage.getItem('admin-token') || localStorage.getItem('token') || '' : '');

async function apiFetch(url, opts = {}) {
  const token = tok();
  const res = await fetch(url, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.error || `HTTP ${res.status}`);
  }
  return json;
}

export default function PmBenchmarks({ isDarkMode }) {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'summary' | 'estimate' | 'calculator' | 'trends'
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Check role
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('admin-user') || localStorage.getItem('user') || '{}');
      if (user.role === 'site_supervisor') {
        setRole('site_supervisor');
      }
    } catch {}
  }, []);

  // ── Tab 1: Project Benchmarks State ──────────────────────────────────────────
  const [projects, setProjects] = useState([]);
  const [projPage, setProjPage] = useState(1);
  const [projTotalPages, setProjTotalPages] = useState(1);
  const [projSearch, setProjSearch] = useState('');
  const [projBenchmarkOnly, setProjBenchmarkOnly] = useState(false);
  const [recomputingId, setRecomputingId] = useState(null);
  const [recomputingAll, setRecomputingAll] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch(
        `/api/admin/project-management/benchmarks/projects?page=${projPage}&pageSize=20&search=${encodeURIComponent(projSearch)}&benchmarkOnly=${projBenchmarkOnly}`
      );
      setProjects(res.data || []);
      setProjTotalPages(res.pagination?.totalPages || 1);
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  }, [projPage, projSearch, projBenchmarkOnly]);

  useEffect(() => {
    if (activeTab === 'projects') loadProjects();
  }, [activeTab, loadProjects]);

  const toggleBenchmark = async (project, e) => {
    e.stopPropagation();
    const nextVal = !project.include_in_benchmark;
    try {
      await apiFetch(`/api/admin/project-management/benchmarks/projects/${project.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ include_in_benchmark: nextVal }),
      });
      setMessage({ type: 'success', text: `Project "${project.name}" ${nextVal ? 'included in' : 'excluded from'} benchmarks.` });
      loadProjects();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const recomputeProject = async (id) => {
    try {
      setRecomputingId(id);
      await apiFetch('/api/admin/project-management/benchmarks/projects', {
        method: 'POST',
        body: JSON.stringify({ projectId: id }),
      });
      setMessage({ type: 'success', text: 'Project benchmark metrics recomputed.' });
      loadProjects();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setRecomputingId(null);
    }
  };

  const recomputeAll = async () => {
    if (!confirm('Recompute benchmarks and summaries for all projects?')) return;
    try {
      setRecomputingAll(true);
      const res = await apiFetch('/api/admin/project-management/benchmarks/projects', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      setMessage({ type: 'success', text: `All project benchmarks & summaries recomputed (${res.data?.sampleCount || 0} sample projects).` });
      if (activeTab === 'projects') loadProjects();
      if (activeTab === 'summary') loadSummaries();
      if (activeTab === 'calculator') loadComparison();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setRecomputingAll(false);
    }
  };

  // ── Tab 2: Rate Summary State ───────────────────────────────────────────────
  const [summaries, setSummaries] = useState([]);
  const [summaryStats, setSummaryStats] = useState({});
  const [summaryFilterType, setSummaryFilterType] = useState('');
  const [summaryFilterQuality, setSummaryFilterQuality] = useState('');

  const loadSummaries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch(
        `/api/admin/project-management/benchmarks/rate-summary?type=${summaryFilterType}&quality=${summaryFilterQuality}`
      );
      setSummaries(res.data || []);
      setSummaryStats(res.stats || {});
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  }, [summaryFilterType, summaryFilterQuality]);

  useEffect(() => {
    if (activeTab === 'summary') loadSummaries();
  }, [activeTab, loadSummaries]);

  // ── Tab 3: Estimation Tool State ────────────────────────────────────────────
  const [estInput, setEstInput] = useState({
    built_up_area: 1200,
    project_type: 'house',
    quality_tier: 'standard',
    floors: 2,
    city: 'Moradabad',
  });
  const [estResult, setEstResult] = useState(null);
  const [estLoading, setEstLoading] = useState(false);

  const calculateEstimate = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setEstLoading(true);
      const res = await apiFetch('/api/admin/project-management/benchmarks/estimate', {
        method: 'POST',
        body: JSON.stringify(estInput),
      });
      setEstResult(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setEstLoading(false);
    }
  }, [estInput]);

  useEffect(() => {
    if (activeTab === 'estimate' && !estResult) {
      let ignore = false;
      (async () => {
        await Promise.resolve();
        if (!ignore) {
          calculateEstimate();
        }
      })();
      return () => { ignore = true; };
    }
  }, [activeTab, estResult, calculateEstimate]);

  const downloadEstimatePdf = () => {
    const sp = new URLSearchParams(estInput).toString();
    const token = tok();
    window.open(`/api/admin/project-management/benchmarks/estimate/export-pdf?${sp}&token=${token}`, '_blank');
  };

  // ── Tab 4: Calculator Comparison & Overrides State ──────────────────────────
  const [comparison, setComparison] = useState([]);
  const [useRealRates, setUseRealRates] = useState(false);
  const [applyModalItem, setApplyModalItem] = useState(null);
  const [modalNewValue, setModalNewValue] = useState('');
  const [modalNote, setModalNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [togglingFlag, setTogglingFlag] = useState(false);

  const loadComparison = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/admin/project-management/benchmarks/calculator-comparison');
      setComparison(res.data || []);
      setUseRealRates(Boolean(res.useRealRates));
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'calculator') loadComparison();
  }, [activeTab, loadComparison]);

  const toggleRealRatesFlag = async () => {
    const next = !useRealRates;
    if (next && !confirm('Enable "Use Real Rates" for the public Budget Calculator? Calculator will use active benchmark overrides where configured.')) {
      return;
    }
    try {
      setTogglingFlag(true);
      await apiFetch('/api/admin/project-management/settings', {
        method: 'PATCH',
        body: JSON.stringify({ use_real_rates: next }),
      });
      setUseRealRates(next);
      setMessage({
        type: 'success',
        text: `Budget Calculator real rates mode is now ${next ? 'ENABLED' : 'DISABLED'}.`,
      });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setTogglingFlag(false);
    }
  };

  const handleApplyOverride = async (e) => {
    e.preventDefault();
    if (!applyModalItem) return;
    try {
      setApplying(true);
      await apiFetch('/api/admin/project-management/benchmarks/calculator-overrides', {
        method: 'POST',
        body: JSON.stringify({
          metric_key: applyModalItem.metric_key,
          quality_tier: applyModalItem.quality_tier,
          old_value: applyModalItem.current_effective,
          new_value: Number(modalNewValue),
          note: modalNote,
        }),
      });
      setMessage({ type: 'success', text: `Override applied to ${applyModalItem.label}.` });
      setApplyModalItem(null);
      loadComparison();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setApplying(false);
    }
  };

  const handleRevertOverride = async (overrideId, label) => {
    if (!confirm(`Revert override for "${label}" back to calculator default?`)) return;
    try {
      await apiFetch(`/api/admin/project-management/benchmarks/calculator-overrides/${overrideId}/revert`, {
        method: 'POST',
      });
      setMessage({ type: 'success', text: `Override for ${label} reverted.` });
      loadComparison();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  // ── Tab 5: Material Price Trends State ───────────────────────────────────────
  const [trendMaterials, setTrendMaterials] = useState([]);
  const [trendCities, setTrendCities] = useState([]);
  const [trendSuppliers, setTrendSuppliers] = useState([]);
  const [selectedMatId, setSelectedMatId] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [trendData, setTrendData] = useState([]);

  const loadTrends = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch(
        `/api/admin/project-management/benchmarks/price-trends?materialId=${selectedMatId}&city=${encodeURIComponent(selectedCity)}&supplier=${encodeURIComponent(selectedSupplier)}`
      );
      setTrendMaterials(res.filters?.materials || []);
      setTrendCities(res.filters?.cities || []);
      setTrendSuppliers(res.filters?.suppliers || []);
      setTrendData(res.data || []);
      if (!selectedMatId && res.filters?.materials?.length) {
        setSelectedMatId(String(res.filters.materials[0].id));
      }
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  }, [selectedMatId, selectedCity, selectedSupplier]);

  useEffect(() => {
    if (activeTab === 'trends') loadTrends();
  }, [activeTab, loadTrends]);

  // If site supervisor, access denied
  if (role === 'site_supervisor') {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#b91c1c' }}>
        <h2>Access Restricted</h2>
        <p>Site supervisors do not have access to Cost Benchmarks and Rate Estimation.</p>
      </div>
    );
  }

  return (
    <div
      className={isDarkMode ? 'dark-mode' : ''}
      style={{
        padding: '20px',
        maxWidth: 1300,
        width: '100%',
        margin: '0 auto',
        minHeight: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#0f172a' }}>
            Cost Benchmarks &amp; Rate Estimation
          </h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Real-project cost snapshots, portfolio median metrics, estimation engine, and Budget Calculator link.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={recomputeAll}
            disabled={recomputingAll}
            style={{
              background: '#0284c7',
              color: '#fff',
              border: 0,
              padding: '8px 16px',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {recomputingAll ? 'Computing...' : '⚡ Recompute All Benchmarks'}
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {message && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: 16,
            borderRadius: 6,
            fontSize: 13,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: message.type === 'error' ? '#991b1b' : '#166534',
            border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
          }}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 14, color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '2px solid #e2e8f0', marginBottom: 20, overflowX: 'auto' }}>
        {[
          { key: 'projects', label: '🏗️ Project Benchmarks' },
          { key: 'summary', label: '📊 Rate Summary & Segments' },
          { key: 'estimate', label: '🧮 Cost Estimator Tool' },
          { key: 'calculator', label: '⚖️ Calculator Comparison & Overrides' },
          { key: 'trends', label: '📈 Material Price Trends' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'transparent',
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? '#2563eb' : '#64748b',
              borderBottom: activeTab === tab.key ? '2px solid #2563eb' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              marginBottom: -2,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: Project Benchmarks ────────────────────────────────────────── */}
      {activeTab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search project name or site address..."
              value={projSearch}
              onChange={(e) => {
                setProjSearch(e.target.value);
                setProjPage(1);
              }}
              style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 6, width: 280 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155' }}>
              <input
                type="checkbox"
                checked={projBenchmarkOnly}
                onChange={(e) => {
                  setProjBenchmarkOnly(e.target.checked);
                  setProjPage(1);
                }}
              />
              Show only benchmark-included projects
            </label>
          </div>

          <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px 12px' }}>Project</th>
                  <th style={{ padding: '10px 12px' }}>Type / Tier</th>
                  <th style={{ padding: '10px 12px' }}>Built-up Area</th>
                  <th style={{ padding: '10px 12px' }}>Total Cost</th>
                  <th style={{ padding: '10px 12px' }}>Cost / sq.ft</th>
                  <th style={{ padding: '10px 12px' }}>Labour</th>
                  <th style={{ padding: '10px 12px' }}>Material</th>
                  <th style={{ padding: '10px 12px' }}>Other</th>
                  <th style={{ padding: '10px 12px' }}>Quality Flags</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>In Benchmark</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                      {loading ? 'Loading projects...' : 'No projects found.'}
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => {
                    const flags = Array.isArray(p.data_quality_flags) ? p.data_quality_flags : [];
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {p.party_name} &bull; {p.status} ({p.progress_percent || 0}%)
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>
                          <div>{p.project_type || '—'}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {p.quality_tier || 'standard'} &bull; {p.floors || 1}F
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          {p.built_up_area ? Number(p.built_up_area).toLocaleString() + ' sqft' : <span style={{ color: '#ef4444' }}>Missing</span>}
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{INR(p.total_cost)}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#2563eb' }}>
                          {p.cost_per_sqft ? INR(p.cost_per_sqft) + '/sqft' : '—'}
                        </td>
                        <td style={{ padding: '10px 12px' }}>{INR(p.labour_cost)}</td>
                        <td style={{ padding: '10px 12px' }}>{INR(Number(p.vendor_material_cost || 0) + Number(p.direct_material_cost || 0))}</td>
                        <td style={{ padding: '10px 12px' }}>{INR(p.other_cost)}</td>
                        <td style={{ padding: '10px 12px' }}>
                          {flags.length === 0 ? (
                            <span style={{ fontSize: 11, color: '#16a34a' }}>✓ Clean</span>
                          ) : (
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {flags.map((f) => (
                                <span
                                  key={f}
                                  style={{
                                    fontSize: 10,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    background: f === 'outlier_cost' ? '#fee2e2' : '#fef3c7',
                                    color: f === 'outlier_cost' ? '#991b1b' : '#92400e',
                                    fontWeight: 600,
                                  }}
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(p.include_in_benchmark)}
                            onChange={(e) => toggleBenchmark(p, e)}
                            style={{ cursor: 'pointer', transform: 'scale(1.15)' }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          <button
                            onClick={() => recomputeProject(p.id)}
                            disabled={recomputingId === p.id}
                            style={{
                              padding: '4px 8px',
                              fontSize: 12,
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              borderRadius: 4,
                              cursor: 'pointer',
                            }}
                          >
                            {recomputingId === p.id ? '...' : '↻ Recompute'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              Page {projPage} of {projTotalPages}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                disabled={projPage <= 1}
                onClick={() => setProjPage((p) => p - 1)}
                style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #cbd5e1', cursor: 'pointer' }}
              >
                Previous
              </button>
              <button
                disabled={projPage >= projTotalPages}
                onClick={() => setProjPage((p) => p + 1)}
                style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #cbd5e1', cursor: 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: Rate Summary & Segments ────────────────────────────────────── */}
      {activeTab === 'summary' && (
        <div>
          {/* Top statistics summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
            <div style={{ padding: 14, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Projects</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
                {summaryStats.total_projects || 0}
              </div>
            </div>
            <div style={{ padding: 14, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#1d4ed8', textTransform: 'uppercase', fontWeight: 600 }}>Active Benchmark Pool</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1e40af', marginTop: 4 }}>
                {summaryStats.active_sample_pool || 0}
              </div>
              <div style={{ fontSize: 10, color: '#3b82f6' }}>Completed or &gt;=90% Progress</div>
            </div>
            <div style={{ padding: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#15803d', textTransform: 'uppercase', fontWeight: 600 }}>Completed Projects</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#166534', marginTop: 4 }}>
                {summaryStats.completed_projects || 0}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <select
              value={summaryFilterType}
              onChange={(e) => setSummaryFilterType(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            >
              <option value="">All Project Types</option>
              <option value="house">House</option>
              <option value="factory">Factory</option>
              <option value="school">School</option>
              <option value="commercial">Commercial</option>
            </select>
            <select
              value={summaryFilterQuality}
              onChange={(e) => setSummaryFilterQuality(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            >
              <option value="">All Quality Tiers</option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px 12px' }}>Segment</th>
                  <th style={{ padding: '10px 12px' }}>Metric</th>
                  <th style={{ padding: '10px 12px' }}>Median Value</th>
                  <th style={{ padding: '10px 12px' }}>Min</th>
                  <th style={{ padding: '10px 12px' }}>Max</th>
                  <th style={{ padding: '10px 12px' }}>Samples</th>
                  <th style={{ padding: '10px 12px' }}>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {summaries.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                      {loading ? 'Loading rate summaries...' : 'No rate summaries computed yet. Click "Recompute All Benchmarks".'}
                    </td>
                  </tr>
                ) : (
                  summaries.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                          {s.project_type || 'Portfolio Overall'}
                        </span>
                        <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>
                          ({s.quality_tier || 'all tiers'}, {s.floors_bucket || 'any'} floors)
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 500 }}>{s.metric}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>
                        {s.metric.startsWith('rate_') || s.metric.includes('cost') || s.metric.includes('labour') || s.metric.includes('other')
                          ? INR(s.median)
                          : s.median}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>
                        {s.metric.startsWith('rate_') || s.metric.includes('cost') ? INR(s.min) : s.min}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>
                        {s.metric.startsWith('rate_') || s.metric.includes('cost') ? INR(s.max) : s.max}
                      </td>
                      <td style={{ padding: '10px 12px' }}>{s.sample_count}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background:
                              s.confidence === 'high' ? '#dcfce7' : s.confidence === 'medium' ? '#fef3c7' : '#fee2e2',
                            color:
                              s.confidence === 'high' ? '#166534' : s.confidence === 'medium' ? '#854d0e' : '#991b1b',
                          }}
                        >
                          {s.confidence}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: Cost Estimator Tool ────────────────────────────────────────── */}
      {activeTab === 'estimate' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 360px) 1fr', gap: 24 }}>
          {/* Inputs Form */}
          <form
            onSubmit={calculateEstimate}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              padding: 20,
              borderRadius: 8,
              height: 'fit-content',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#0f172a' }}>Project Parameters</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Built-up Area (sq.ft)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={estInput.built_up_area}
                onChange={(e) => setEstInput({ ...estInput, built_up_area: Number(e.target.value) })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                required
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Project Type
              </label>
              <select
                value={estInput.project_type}
                onChange={(e) => setEstInput({ ...estInput, project_type: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              >
                <option value="house">House / Residential</option>
                <option value="factory">Factory / Industrial</option>
                <option value="school">School / Institutional</option>
                <option value="commercial">Commercial Building</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Quality Tier
              </label>
              <select
                value={estInput.quality_tier}
                onChange={(e) => setEstInput({ ...estInput, quality_tier: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              >
                <option value="basic">Basic (Rental / Budget)</option>
                <option value="standard">Standard (Balanced Package)</option>
                <option value="premium">Premium (Branded Materials)</option>
                <option value="luxury">Luxury (High-End Rich Fixtures)</option>
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                Floors
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={estInput.floors}
                onChange={(e) => setEstInput({ ...estInput, floors: Number(e.target.value) })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                City / Location
              </label>
              <input
                type="text"
                value={estInput.city}
                onChange={(e) => setEstInput({ ...estInput, city: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
              />
            </div>

            <button
              type="submit"
              disabled={estLoading}
              style={{
                width: '100%',
                background: '#2563eb',
                color: '#fff',
                padding: '10px',
                borderRadius: 6,
                fontWeight: 600,
                border: 0,
                cursor: 'pointer',
              }}
            >
              {estLoading ? 'Calculating...' : 'Recalculate Estimate'}
            </button>
          </form>

          {/* Results Output */}
          <div>
            {estResult && (
              <div>
                {/* Thin data warning if applicable */}
                {estResult.sampleCount < 3 && (
                  <div
                    style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      padding: '10px 14px',
                      borderRadius: 6,
                      color: '#92400e',
                      fontSize: 12,
                      marginBottom: 16,
                    }}
                  >
                    <strong>⚠️ Thin Sample Pool:</strong> Only {estResult.sampleCount} project(s) match this specific segment.
                    Estimation engine fell back to broader tier: <em>{estResult.fallbackLevel}</em>.
                  </div>
                )}

                {/* Estimate Range Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: 14, borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Minimum Expected</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>{INR(estResult.totalCost.min)}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{INR(estResult.costPerSqft.min)} / sqft</div>
                  </div>
                  <div style={{ background: '#eff6ff', border: '2px solid #2563eb', padding: 14, borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#1d4ed8', textTransform: 'uppercase', fontWeight: 700 }}>Median Estimate</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#1e40af', marginTop: 4 }}>{INR(estResult.totalCost.median)}</div>
                    <div style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600 }}>{INR(estResult.costPerSqft.median)} / sqft</div>
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: 14, borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Maximum Expected</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>{INR(estResult.totalCost.max)}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{INR(estResult.costPerSqft.max)} / sqft</div>
                  </div>
                </div>

                {/* Cost Split */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ margin: 0, fontSize: 14, color: '#0f172a' }}>Expected Cost Component Split</h4>
                    <button
                      onClick={downloadEstimatePdf}
                      style={{
                        background: '#059669',
                        color: '#fff',
                        border: 0,
                        padding: '6px 12px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      📄 Download PDF Report
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: 10 }}>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Labour Cost</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{INR(estResult.split.labour)}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{INR(estResult.split.labourPerSqft)} / sqft</div>
                    </div>
                    <div style={{ borderLeft: '3px solid #10b981', paddingLeft: 10 }}>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Material Cost</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{INR(estResult.split.material)}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{INR(estResult.split.materialPerSqft)} / sqft</div>
                    </div>
                    <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: 10 }}>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Other Expenses</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{INR(estResult.split.other)}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{INR(estResult.split.otherPerSqft)} / sqft</div>
                    </div>
                  </div>
                </div>

                {/* Major Material Quantities */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#0f172a' }}>Estimated Major Material Quantities</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>Material</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Qty / sqft</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Est. Total Quantity</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Avg Purchase Rate</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Est. Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estResult.materials.map((m) => (
                        <tr key={m.key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 10px', textTransform: 'capitalize', fontWeight: 600 }}>{m.key}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                            {m.qty_per_sqft !== null ? `${m.qty_per_sqft} ${m.unit}` : '—'}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                            {m.estimated_quantity !== null ? `${m.estimated_quantity.toLocaleString()} ${m.unit}` : '—'}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                            {m.avg_rate !== null ? INR(m.avg_rate) : '—'}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                            {m.estimated_cost !== null ? INR(m.estimated_cost) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: Calculator Comparison & Overrides ──────────────────────────── */}
      {activeTab === 'calculator' && (
        <div>
          {/* Master Flag Control */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              background: useRealRates ? '#ecfdf5' : '#f8fafc',
              border: `1px solid ${useRealRates ? '#a7f3d0' : '#e2e8f0'}`,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: useRealRates ? '#065f46' : '#1e293b' }}>
                Feature Flag: Use Real Rates in Budget Calculator
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {useRealRates
                  ? 'Active: Public Budget Calculator reads verified benchmark overrides where applied.'
                  : 'Disabled (Default): Budget Calculator runs standard hard-coded & config rates. Zero changes to user calculations.'}
              </div>
            </div>
            <button
              onClick={toggleRealRatesFlag}
              disabled={togglingFlag}
              style={{
                background: useRealRates ? '#dc2626' : '#16a34a',
                color: '#fff',
                border: 0,
                padding: '8px 18px',
                borderRadius: 6,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {togglingFlag ? 'Updating...' : useRealRates ? 'Turn OFF Real Rates' : 'Turn ON Real Rates'}
            </button>
          </div>

          <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '10px 12px' }}>Parameter / Metric</th>
                  <th style={{ padding: '10px 12px' }}>Unit</th>
                  <th style={{ padding: '10px 12px' }}>Default Calculator Rate</th>
                  <th style={{ padding: '10px 12px' }}>Real Project Median</th>
                  <th style={{ padding: '10px 12px' }}>Variance (% Diff)</th>
                  <th style={{ padding: '10px 12px' }}>Active Override</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => {
                  const hasOverride = Boolean(row.active_override);
                  const isPositive = row.diff_percent !== null && row.diff_percent > 0;
                  return (
                    <tr key={`${row.metric_key}_${row.quality_tier}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{row.label}</td>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>{row.unit}</td>
                      <td style={{ padding: '10px 12px' }}>{row.calculator_default}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0f172a' }}>
                        {row.benchmark_median !== null ? row.benchmark_median : '—'}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        {row.diff_percent !== null ? (
                          <span
                            style={{
                              fontSize: 11,
                              padding: '2px 6px',
                              borderRadius: 4,
                              fontWeight: 700,
                              background: Math.abs(row.diff_percent) > 15 ? (isPositive ? '#fee2e2' : '#fef3c7') : '#f1f5f9',
                              color: Math.abs(row.diff_percent) > 15 ? (isPositive ? '#991b1b' : '#92400e') : '#475569',
                            }}
                          >
                            {isPositive ? `+${row.diff_percent}%` : `${row.diff_percent}%`}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        {hasOverride ? (
                          <span style={{ fontSize: 11, background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                            {row.active_override.new_value} (Active)
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              setApplyModalItem(row);
                              setModalNewValue(String(row.benchmark_median || row.calculator_default));
                              setModalNote('');
                            }}
                            style={{
                              padding: '4px 10px',
                              fontSize: 12,
                              background: '#2563eb',
                              color: '#fff',
                              border: 0,
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            Apply to Calculator
                          </button>
                          {hasOverride && (
                            <button
                              onClick={() => handleRevertOverride(row.active_override.id, row.label)}
                              style={{
                                padding: '4px 8px',
                                fontSize: 12,
                                background: '#fee2e2',
                                color: '#991b1b',
                                border: '1px solid #fecaca',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontWeight: 600,
                              }}
                            >
                              Revert
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Modal for Confirmation */}
          {applyModalItem && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
              }}
            >
              <form
                onSubmit={handleApplyOverride}
                style={{
                  background: '#fff',
                  padding: 24,
                  borderRadius: 10,
                  width: '90%',
                  maxWidth: 460,
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                }}
              >
                <h3 style={{ margin: '0 0 12px', fontSize: 17, color: '#0f172a' }}>
                  Apply Benchmark Override
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
                  Updating rate for <strong>{applyModalItem.label}</strong> ({applyModalItem.unit}).
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div style={{ padding: 10, background: '#f8fafc', borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: '#64748b' }}>Current Effective</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{applyModalItem.current_effective}</div>
                  </div>
                  <div style={{ padding: 10, background: '#eff6ff', borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: '#1d4ed8' }}>Benchmark Median</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1e40af' }}>{applyModalItem.benchmark_median || '—'}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    New Value to Apply
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={modalNewValue}
                    onChange={(e) => setModalNewValue(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                  />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Audit Note / Reason
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Updated based on Q3 real procurement data"
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setApplyModalItem(null)}
                    style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    style={{ padding: '8px 16px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 0, fontWeight: 600, cursor: 'pointer' }}
                  >
                    {applying ? 'Applying...' : 'Confirm & Apply'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: Material Price Trends ─────────────────────────────────────── */}
      {activeTab === 'trends' && (
        <div>
          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <select
              value={selectedMatId}
              onChange={(e) => setSelectedMatId(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1', minWidth: 180 }}
            >
              <option value="">All Materials</option>
              {trendMaterials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.unit})
                </option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            >
              <option value="">All Cities</option>
              {trendCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
            >
              <option value="">All Suppliers</option>
              {trendSuppliers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* SVG Line Chart */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 20, marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#0f172a' }}>
              Monthly Average Purchase Rate Trend
            </h3>
            {trendData.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                {loading ? 'Loading trend data...' : 'No purchase records found for the selected filters in the last 12 months.'}
              </div>
            ) : (
              <div>
                {/* Inline SVG Chart */}
                <div style={{ width: '100%', height: 260 }}>
                  {(() => {
                    const rates = trendData.map((d) => Number(d.avg_rate) || 0);
                    const minR = Math.floor(Math.min(...rates) * 0.9);
                    const maxR = Math.ceil(Math.max(...rates) * 1.1) || 100;
                    const range = maxR - minR || 1;

                    const width = 800;
                    const height = 220;
                    const padX = 50;
                    const padY = 30;
                    const plotW = width - padX * 2;
                    const plotH = height - padY * 2;

                    const stepX = trendData.length > 1 ? plotW / (trendData.length - 1) : plotW / 2;

                    const points = trendData.map((d, i) => {
                      const x = padX + (trendData.length > 1 ? i * stepX : plotW / 2);
                      const y = height - padY - ((Number(d.avg_rate) - minR) / range) * plotH;
                      return { x, y, ...d };
                    });

                    const polylinePts = points.map((p) => `${p.x},${p.y}`).join(' ');

                    return (
                      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                          const y = height - padY - pct * plotH;
                          const val = Math.round(minR + pct * range);
                          return (
                            <g key={pct}>
                              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                              <text x={padX - 8} y={y + 4} fontSize="10" fill="#64748b" textAnchor="end">
                                ₹{val}
                              </text>
                            </g>
                          );
                        })}

                        {/* Line */}
                        <polyline fill="none" stroke="#2563eb" strokeWidth="3" points={polylinePts} />

                        {/* Points & Labels */}
                        {points.map((p, idx) => (
                          <g key={idx}>
                            <circle cx={p.x} cy={p.y} r="5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
                            <text x={p.x} y={p.y - 10} fontSize="10" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                              ₹{p.avg_rate}
                            </text>
                            <text x={p.x} y={height - 8} fontSize="9" fill="#64748b" textAnchor="middle">
                              {p.month_label}
                            </text>
                          </g>
                        ))}
                      </svg>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Historical Data Table */}
          <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '8px 12px' }}>Month</th>
                  <th style={{ padding: '8px 12px' }}>Material</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total Quantity</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total Amount</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Weighted Avg Rate</th>
                </tr>
              </thead>
              <tbody>
                {trendData.map((d, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{d.month_label}</td>
                    <td style={{ padding: '8px 12px' }}>{d.material_name}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      {Number(d.total_quantity).toLocaleString()} {d.unit}
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>{INR(d.total_amount)}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                      {INR(d.avg_rate)} / {d.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
