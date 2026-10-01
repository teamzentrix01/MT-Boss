'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// ── helpers ──────────────────────────────────────────────────────────────────
const tok = () => (typeof localStorage !== 'undefined' ? localStorage.getItem('admin-token') || localStorage.getItem('token') || '' : '');
const h = () => ({ Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' });
async function apiFetch(url, opts = {}) {
  const r = await fetch(url, { ...opts, headers: { ...h(), ...(opts.headers || {}) } });
  return r.json();
}

function inr(v) {
  const n = Number(v || 0);
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}
function pct(part, total) {
  if (!total) return 0;
  return Math.round((Number(part) / Number(total)) * 100);
}

// ── inline SVG charts ─────────────────────────────────────────────────────────
function DonutChart({ labour, material, other }) {
  const total = labour + material + other;
  if (!total) return <p style={{ color: 'var(--pm-muted)', fontSize: '.78rem', textAlign: 'center', paddingTop: '2rem' }}>No expense data</p>;
  const slices = [
    { val: labour,   label: 'Labour',   color: '#3b82f6' },
    { val: material, label: 'Material', color: '#f59e0b' },
    { val: other,    label: 'Other',    color: '#10b981' },
  ];
  let startAngle = -90;
  const R = 60, cx = 80, cy = 80, ri = 36;
  const paths = slices.map(s => {
    const fraction = s.val / total;
    const angle = fraction * 360;
    const end = startAngle + angle;
    const a1 = (startAngle * Math.PI) / 180, a2 = (end * Math.PI) / 180;
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
    const xi1 = cx + ri * Math.cos(a1), yi1 = cy + ri * Math.sin(a1);
    const xi2 = cx + ri * Math.cos(a2), yi2 = cy + ri * Math.sin(a2);
    const large = angle > 180 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ri} ${ri} 0 ${large} 0 ${xi1} ${yi1} Z`;
    const node = { d, color: s.color, label: s.label, pct: Math.round(fraction * 100) };
    startAngle = end;
    return node;
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} stroke="#fff" strokeWidth="2" />)}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--pm-text)">Total</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="var(--pm-muted)">{inr(total)}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
        {paths.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.78rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--pm-muted)' }}>{p.label}</span>
            <strong style={{ marginLeft: 'auto' }}>{p.pct}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyBarChart({ monthly }) {
  if (!monthly?.length) return <p style={{ color: 'var(--pm-muted)', fontSize: '.78rem', textAlign: 'center', paddingTop: '2rem' }}>No monthly data</p>;
  const W = 320, H = 140, PAD = { t: 12, r: 8, b: 36, l: 52 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const n = monthly.length;
  const maxVal = Math.max(...monthly.flatMap(m => [Number(m.received), Number(m.expense)]), 1);
  const barW = Math.floor(innerW / n / 2.4);
  const gap = Math.floor(innerW / n);
  const scale = innerH / maxVal;
  const months = monthly.map(m => {
    const d = new Date(m.month_start);
    return d.toLocaleString('en-IN', { month: 'short' });
  });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {/* Y axis lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(f => {
        const y = PAD.t + innerH - f * innerH;
        return (
          <g key={f}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="var(--pm-border)" strokeDasharray="3 3" strokeWidth="0.5" />
            <text x={PAD.l - 4} y={y + 4} textAnchor="end" fontSize="7" fill="var(--pm-muted)">
              {(maxVal * f / 1e5).toFixed(0)}L
            </text>
          </g>
        );
      })}
      {monthly.map((m, i) => {
        const x = PAD.l + i * gap;
        const rcv = Number(m.received);
        const exp = Number(m.expense);
        const rH = Math.max(2, rcv * scale);
        const eH = Math.max(2, exp * scale);
        return (
          <g key={i}>
            <rect x={x + 2} y={PAD.t + innerH - rH} width={barW} height={rH} fill="#3b82f6" rx="2" opacity="0.85" />
            <rect x={x + barW + 5} y={PAD.t + innerH - eH} width={barW} height={eH} fill="#f59e0b" rx="2" opacity="0.85" />
            <text x={x + barW} y={H - 4} textAnchor="middle" fontSize="8" fill="var(--pm-muted)">{months[i]}</text>
          </g>
        );
      })}
      {/* Legend */}
      <rect x={PAD.l} y={H - 14} width={8} height={8} fill="#3b82f6" rx="1" />
      <text x={PAD.l + 11} y={H - 6} fontSize="8" fill="var(--pm-muted)">Received</text>
      <rect x={PAD.l + 65} y={H - 14} width={8} height={8} fill="#f59e0b" rx="1" />
      <text x={PAD.l + 78} y={H - 6} fontSize="8" fill="var(--pm-muted)">Expense</text>
    </svg>
  );
}

function TopProjectsChart({ projects }) {
  const top5 = [...(projects || [])].sort((a, b) => Number(b.total_expense) - Number(a.total_expense)).slice(0, 5);
  if (!top5.length) return <p style={{ color: 'var(--pm-muted)', fontSize: '.78rem', textAlign: 'center', paddingTop: '2rem' }}>No data</p>;
  const max = Math.max(...top5.map(p => Number(p.total_expense)), 1);
  const W = 300, BAR_H = 18, GAP = 10;
  const H = top5.length * (BAR_H + GAP) + 20;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {top5.map((p, i) => {
        const y = i * (BAR_H + GAP) + 10;
        const bW = Math.max(4, (Number(p.total_expense) / max) * 200);
        return (
          <g key={p.id}>
            <text x={0} y={y + BAR_H - 4} fontSize="8.5" fill="var(--pm-muted)" style={{ dominantBaseline: 'auto' }}>
              {p.name.length > 18 ? p.name.slice(0, 17) + '…' : p.name}
            </text>
            <rect x={105} y={y} width={bW} height={BAR_H} fill="#6366f1" rx="3" opacity="0.85" />
            <text x={105 + bW + 4} y={y + BAR_H - 4} fontSize="8" fill="var(--pm-text)">
              {inr(p.total_expense)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Alert badge ────────────────────────────────────────────────────────────────
function AlertBadge({ counts }) {
  const total = (counts?.high || 0) + (counts?.medium || 0) + (counts?.low || 0);
  if (!total) return null;
  const color = counts?.high > 0 ? '#dc2626' : counts?.medium > 0 ? '#f59e0b' : '#6b7280';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, borderRadius: 9, background: color, color: '#fff', fontSize: '.65rem', fontWeight: 900, padding: '0 5px' }}>
      {total}
    </span>
  );
}

function severityColor(s) {
  return s === 'high' ? '#fee2e2' : s === 'medium' ? '#fff7ed' : '#f0fdf4';
}
function severityText(s) {
  return s === 'high' ? '#991b1b' : s === 'medium' ? '#92400e' : '#166534';
}
const ALERT_TYPE_LABELS = {
  low_stock: 'Low Stock', negative_stock: 'Negative Stock',
  vendor_overpaid: 'Vendor Overpaid', contract_warning: 'Contract Warning',
  party_pending: 'Payment Overdue', project_late: 'Project Late',
  attendance_missing: 'Attendance Missing',
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PmDashboard({ isDarkMode }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [alertCounts, setAlertCounts] = useState({ high: 0, medium: 0, low: 0 });
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [filters, setFilters] = useState({ partyId: '', status: 'all', dateFrom: '', dateTo: '' });
  const [settings, setSettings] = useState({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsForm, setSettingsForm] = useState({});
  const [msg, setMsg] = useState('');
  const dismissing = useRef(new Set());

  const buildUrl = useCallback((bust = false) => {
    const sp = new URLSearchParams();
    if (filters.partyId) sp.set('partyId', filters.partyId);
    if (filters.status !== 'all') sp.set('status', filters.status);
    if (filters.dateFrom) sp.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) sp.set('dateTo', filters.dateTo);
    if (bust) sp.set('bust', '1');
    return `/api/admin/project-management/dashboard?${sp}`;
  }, [filters]);

  const loadDashboard = useCallback(async (bust = false) => {
    setLoading(true);
    const d = await apiFetch(buildUrl(bust));
    if (d.success) setData(d);
    setLoading(false);
  }, [buildUrl]);

  const loadAlerts = useCallback(async () => {
    setAlertsLoading(true);
    const d = await apiFetch('/api/admin/project-management/alerts');
    if (d.success) { setAlerts(d.alerts); setAlertCounts(d.counts); }
    setAlertsLoading(false);
  }, []);

  const loadParties = useCallback(async () => {
    const d = await apiFetch('/api/admin/project-management/parties?pageSize=200');
    if (d.success) setParties(d.data || []);
  }, []);

  const loadSettings = useCallback(async () => {
    const d = await apiFetch('/api/admin/project-management/settings');
    if (d.success) {
      const map = Object.fromEntries((d.data || []).map(r => [r.key, r.value]));
      setSettings(map);
      setSettingsForm(map);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      await Promise.resolve();
      if (!ignore) {
        loadDashboard();
        loadAlerts();
        loadParties();
        loadSettings();
      }
    })();
    return () => { ignore = true; };
  }, [loadDashboard, loadAlerts, loadParties, loadSettings]);

  const hasMounted = useRef(false);
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    let ignore = false;
    (async () => {
      await Promise.resolve();
      if (!ignore) {
        loadDashboard(false);
      }
    })();
    return () => { ignore = true; };
  }, [filters.partyId, filters.status, filters.dateFrom, filters.dateTo, loadDashboard]);

  async function dismissAlert(alertKey, snooze) {
    if (dismissing.current.has(alertKey)) return;
    dismissing.current.add(alertKey);
    await apiFetch('/api/admin/project-management/alerts', { method: 'POST', body: JSON.stringify({ alert_key: alertKey, snooze }) });
    dismissing.current.delete(alertKey);
    loadAlerts();
  }

  async function saveSettings(e) {
    e.preventDefault();
    setSettingsSaving(true);
    const d = await apiFetch('/api/admin/project-management/settings', { method: 'PATCH', body: JSON.stringify({ party_payment_gap_days: Number(settingsForm.party_payment_gap_days), contract_paid_warning_percent: Number(settingsForm.contract_paid_warning_percent) }) });
    setSettingsSaving(false);
    if (d.success) { setMsg('Settings saved.'); setSettingsOpen(false); loadSettings(); loadAlerts(); setTimeout(() => setMsg(''), 3000); }
    else setMsg(d.error || 'Save failed.');
  }

  const t = data?.totals || {};

  const statCards = [
    { label: 'Running Projects', value: t.running ?? '—', sub: `of ${t.total ?? '—'} total`, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Total Contract Value', value: inr(t.contract), sub: 'all projects', color: '#6366f1', bg: '#eef2ff' },
    { label: 'Received from Parties', value: inr(t.received), sub: 'total collected', color: '#10b981', bg: '#f0fdf4' },
    { label: 'Pending from Parties', value: inr(t.pending), sub: 'yet to collect', color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Total Expense', value: inr(t.expense), sub: `Labour ${inr(t.labour)} · Mat ${inr(t.material)} · Other ${inr(t.other)}`, color: '#ef4444', bg: '#fef2f2' },
    { label: Number(t.profit) >= 0 ? 'Net Profit' : 'Net Loss', value: inr(Math.abs(t.profit)), sub: 'received − expense', color: Number(t.profit) >= 0 ? '#16a34a' : '#dc2626', bg: Number(t.profit) >= 0 ? '#f0fdf4' : '#fef2f2' },
  ];

  const projectCols = ['Party', 'Project', 'Days', 'Status', 'Contract', 'Received', 'Pending', 'Expense', 'Profit', 'Actions'];

  const exportUrl = (type, id, fmt) => {
    const sp = new URLSearchParams({ format: fmt });
    if (type === 'party') sp.set('partyId', id);
    else if (type === 'project') sp.set('projectId', id);
    else sp.set('projectId', id);
    return `/api/admin/project-management/export/${type === 'party' ? 'party-statement' : type === 'project' ? 'project-report' : 'expense-summary'}?${sp}`;
  };

  return (
    <>
      <style>{CSS}</style>
      <div className={`pmd-root${isDarkMode ? ' dark-mode' : ''}`}>
        {/* Header */}
        <div className="pmd-header">
          <div>
            <h1 className="pmd-title">📊 Project Management Dashboard</h1>
            <p className="pmd-sub">Live overview of all PM projects, expenses and financials</p>
          </div>
          <div className="pmd-header-actions">
            {/* Bell */}
            <button className="pmd-bell" onClick={() => { setAlertsOpen(v => !v); if (!alertsOpen) loadAlerts(); }}>
              🔔 Alerts <AlertBadge counts={alertCounts} />
            </button>
            <button className="pmd-ghost" onClick={() => setSettingsOpen(v => !v)}>⚙ Alert Settings</button>
            <button className="pmd-primary" onClick={() => loadDashboard(true)}>↻ Refresh</button>
          </div>
        </div>

        {msg && <div className="pmd-msg">{msg}</div>}

        {/* Alert Settings panel */}
        {settingsOpen && (
          <form className="pmd-card pmd-settings-form" onSubmit={saveSettings}>
            <strong className="pmd-card-title">Alert Settings</strong>
            <div className="pmd-row-2">
              <label className="pmd-label">
                Party Payment Gap (days)
                <input className="pmd-input" type="number" min="1" value={settingsForm.party_payment_gap_days || ''} onChange={e => setSettingsForm(f => ({ ...f, party_payment_gap_days: e.target.value }))} />
              </label>
              <label className="pmd-label">
                Contract Warning Threshold (%)
                <input className="pmd-input" type="number" min="1" max="100" value={settingsForm.contract_paid_warning_percent || ''} onChange={e => setSettingsForm(f => ({ ...f, contract_paid_warning_percent: e.target.value }))} />
              </label>
            </div>
            <button className="pmd-primary" disabled={settingsSaving} style={{ width: 'max-content', marginTop: '.5rem' }}>{settingsSaving ? 'Saving…' : 'Save Settings'}</button>
          </form>
        )}

        {/* Alerts panel */}
        {alertsOpen && (
          <div className="pmd-card">
            <div className="pmd-card-head">
              <strong className="pmd-card-title">🔔 Active Alerts</strong>
              <div style={{ display: 'flex', gap: '.5rem', fontSize: '.75rem' }}>
                {[['high', '#dc2626'], ['medium', '#f59e0b'], ['low', '#16a34a']].map(([s, c]) => (
                  <span key={s} style={{ background: c + '22', color: c, borderRadius: 4, padding: '2px 8px', fontWeight: 700 }}>{s}: {alertCounts[s] || 0}</span>
                ))}
              </div>
            </div>
            {alertsLoading ? <p className="pmd-empty">Loading alerts…</p> : !alerts?.length ? (
              <p className="pmd-empty" style={{ color: '#16a34a' }}>✅ No active alerts</p>
            ) : (
              <div className="pmd-alert-list">
                {alerts.map(a => (
                  <div key={a.alert_key} className="pmd-alert-row" style={{ borderLeftColor: severityText(a.severity), background: severityColor(a.severity) }}>
                    <div>
                      <span className="pmd-alert-type" style={{ color: severityText(a.severity) }}>{ALERT_TYPE_LABELS[a.type] || a.type}</span>
                      <strong className="pmd-alert-title">{a.title}</strong>
                      <span className="pmd-alert-detail">{a.detail}</span>
                    </div>
                    <div className="pmd-alert-actions">
                      <button className="pmd-ghost-sm" onClick={() => dismissAlert(a.alert_key, '7d')}>Snooze 7d</button>
                      <button className="pmd-ghost-sm" onClick={() => dismissAlert(a.alert_key, 'permanent')}>Dismiss</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="pmd-filters">
          <select className="pmd-select" value={filters.partyId} onChange={e => setFilters(f => ({ ...f, partyId: e.target.value }))}>
            <option value="">All Parties</option>
            {parties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="pmd-select" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
          <input className="pmd-input pmd-input-sm" type="date" placeholder="From" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} />
          <input className="pmd-input pmd-input-sm" type="date" placeholder="To" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} />
        </div>

        {loading ? (
          <div className="pmd-empty" style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading dashboard…</div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="pmd-stat-grid">
              {statCards.map((c, i) => (
                <div key={i} className="pmd-stat" style={{ background: c.bg, borderColor: c.color + '40' }}>
                  <p className="pmd-stat-label">{c.label}</p>
                  <p className="pmd-stat-value" style={{ color: c.color }}>{c.value}</p>
                  <p className="pmd-stat-sub">{c.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="pmd-charts-row">
              <div className="pmd-card pmd-chart-card">
                <strong className="pmd-card-title">Expense Split</strong>
                <DonutChart labour={t.labour || 0} material={t.material || 0} other={t.other || 0} />
              </div>
              <div className="pmd-card pmd-chart-card">
                <strong className="pmd-card-title">Monthly: Received vs Expense</strong>
                <MonthlyBarChart monthly={data?.monthly} />
              </div>
              <div className="pmd-card pmd-chart-card">
                <strong className="pmd-card-title">Top 5 by Expense</strong>
                <TopProjectsChart projects={data?.projects} />
              </div>
            </div>

            {/* Global exports */}
            <div className="pmd-card" style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', padding: '.75rem 1rem' }}>
              <span style={{ fontSize: '.78rem', color: 'var(--pm-muted)', alignSelf: 'center', marginRight: '.5rem' }}>Export all data:</span>
              {[
                ['Material Stock XLSX', `/api/admin/project-management/export/material-stock?format=xlsx`],
                ['Material Stock PDF',  `/api/admin/project-management/export/material-stock?format=pdf`],
                ['Vendor Balance XLSX', `/api/admin/project-management/export/vendor-balance?format=xlsx`],
                ['Vendor Balance PDF',  `/api/admin/project-management/export/vendor-balance?format=pdf`],
                ['Expense Summary XLSX',`/api/admin/project-management/export/expense-summary?format=xlsx`],
                ['Expense Summary PDF', `/api/admin/project-management/export/expense-summary?format=pdf`],
              ].map(([label, url]) => (
                <a key={label} href={url} target="_blank" rel="noreferrer" className="pmd-export-btn">{label}</a>
              ))}
            </div>

            {/* Project table */}
            <div className="pmd-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="pmd-card-head" style={{ padding: '.75rem 1rem' }}>
                <strong className="pmd-card-title">Projects ({data?.projects?.length || 0})</strong>
                <span style={{ fontSize: '.75rem', color: 'var(--pm-muted)' }}>Click row to open overview</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="pmd-table">
                  <thead>
                    <tr>{projectCols.map(c => <th key={c}>{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {(data?.projects || []).length === 0 && (
                      <tr><td colSpan={projectCols.length} className="pmd-empty">No projects match the current filters.</td></tr>
                    )}
                    {(data?.projects || []).map(row => {
                      const profit = Number(row.profit);
                      return (
                        <tr key={row.id} className="pmd-tr-clickable" onClick={() => router.push(`/dashboard/projects/${row.id}`)}>
                          <td>{row.party_name}</td>
                          <td><strong>{row.name}</strong></td>
                          <td className="num">{row.days_running}</td>
                          <td><span className={`pmd-badge pmd-badge-${row.status}`}>{row.status}</span></td>
                          <td className="num">{inr(row.contract_value)}</td>
                          <td className="num">{inr(row.received)}</td>
                          <td className="num" style={{ color: Number(row.pending) > 0 ? '#f59e0b' : undefined }}>{inr(row.pending)}</td>
                          <td className="num">{inr(row.total_expense)}</td>
                          <td className="num" style={{ fontWeight: 700, color: profit >= 0 ? '#16a34a' : '#dc2626' }}>{inr(profit)}</td>
                          <td onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '.25rem' }}>
                              <a className="pmd-export-btn" style={{ fontSize: '.65rem', padding: '2px 6px' }} href={exportUrl('project', row.id, 'xlsx')} target="_blank" rel="noreferrer">XLS</a>
                              <a className="pmd-export-btn" style={{ fontSize: '.65rem', padding: '2px 6px' }} href={exportUrl('project', row.id, 'pdf')} target="_blank" rel="noreferrer">PDF</a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const CSS = `
  .pmd-root{--pm-bg:#f5f5f7;--pm-surface:#fff;--pm-border:#e2e2e7;--pm-text:#111113;--pm-muted:#6b6b76;--pm-accent:#2563eb;
    background:var(--pm-bg);min-height:100%;font-family:'DM Sans',system-ui,sans-serif;color:var(--pm-text);padding:1.25rem;flex:1;display:flex;flex-direction:column;box-sizing:border-box}
  .dark-mode.pmd-root, .dark-mode .pmd-root{--pm-bg:#0f0f11;--pm-surface:#18181c;--pm-border:#2a2a30;--pm-text:#f0f0f5;--pm-muted:#7c7c8a;--pm-accent:#60a5fa}
  .pmd-header{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:1rem;flex-wrap:wrap}
  .pmd-title{font-size:1.4rem;font-weight:800;margin:0}
  .pmd-sub{font-size:.78rem;color:var(--pm-muted);margin:.2rem 0 0}
  .pmd-header-actions{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}
  .pmd-primary{border:0;border-radius:7px;background:var(--pm-accent);color:#fff;padding:.5rem 1rem;font-size:.8rem;font-weight:700;cursor:pointer;transition:opacity .15s}
  .pmd-primary:hover{opacity:.85}.pmd-primary:disabled{opacity:.55;cursor:not-allowed}
  .pmd-ghost{border:1px solid var(--pm-border);background:var(--pm-surface);color:var(--pm-text);border-radius:7px;padding:.5rem 1rem;font-size:.8rem;font-weight:700;cursor:pointer;transition:background .15s}
  .pmd-ghost:hover{background:var(--pm-bg)}
  .pmd-ghost-sm{border:1px solid var(--pm-border);background:var(--pm-surface);color:var(--pm-text);border-radius:5px;padding:.25rem .6rem;font-size:.72rem;font-weight:700;cursor:pointer}
  .pmd-bell{display:flex;align-items:center;gap:.45rem;border:1px solid var(--pm-border);background:var(--pm-surface);color:var(--pm-text);border-radius:7px;padding:.5rem 1rem;font-size:.8rem;font-weight:700;cursor:pointer}
  .pmd-msg{border-left:3px solid var(--pm-accent);background:var(--pm-surface);border:1px solid var(--pm-border);border-radius:7px;padding:.65rem 1rem;margin-bottom:.75rem;font-size:.84rem;font-weight:700;color:var(--pm-accent)}
  .pmd-filters{display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1rem}
  .pmd-select,.pmd-input{border:1px solid var(--pm-border);border-radius:6px;background:var(--pm-surface);color:var(--pm-text);padding:.5rem .75rem;font-size:.82rem;outline:none}
  .pmd-input-sm{width:140px}
  .pmd-stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.75rem;margin-bottom:1rem}
  .pmd-stat{border:1px solid transparent;border-radius:10px;padding:1rem;transition:transform .15s}
  .pmd-stat:hover{transform:translateY(-1px)}
  .pmd-stat-label{font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--pm-muted);margin-bottom:.35rem}
  .pmd-stat-value{font-size:1.45rem;font-weight:900;margin-bottom:.2rem;line-height:1.1}
  .pmd-stat-sub{font-size:.7rem;color:var(--pm-muted)}
  .pmd-charts-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:.75rem;margin-bottom:1rem}
  .pmd-card{background:var(--pm-surface);border:1px solid var(--pm-border);border-radius:10px;padding:1rem;margin-bottom:.75rem}
  .pmd-card-head{display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin-bottom:.75rem}
  .pmd-card-title{font-size:.88rem;font-weight:800}
  .pmd-chart-card{min-height:200px}
  .pmd-settings-form{display:flex;flex-direction:column;gap:.75rem;margin-bottom:.75rem}
  .pmd-row-2{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
  .pmd-label{display:flex;flex-direction:column;gap:.3rem;font-size:.75rem;font-weight:700;color:var(--pm-muted)}
  .pmd-label .pmd-input{margin-top:.2rem;width:100%}
  .pmd-alert-list{display:flex;flex-direction:column;gap:.5rem;max-height:60vh;overflow-y:auto}
  .pmd-alert-row{display:flex;justify-content:space-between;align-items:flex-start;gap:.75rem;border-left:3px solid;border-radius:7px;padding:.65rem .85rem}
  .pmd-alert-type{display:block;font-size:.66rem;font-weight:900;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.2rem}
  .pmd-alert-title{display:block;font-size:.84rem;font-weight:700;margin-bottom:.15rem}
  .pmd-alert-detail{display:block;font-size:.76rem;color:var(--pm-muted)}
  .pmd-alert-actions{display:flex;gap:.35rem;flex-shrink:0;align-items:center}
  .pmd-table{width:100%;border-collapse:collapse;font-size:.8rem}
  .pmd-table th{background:var(--pm-bg);border-bottom:2px solid var(--pm-border);padding:.55rem .85rem;text-align:left;font-size:.67rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--pm-muted);white-space:nowrap}
  .pmd-table td{padding:.55rem .85rem;border-bottom:1px solid var(--pm-border);vertical-align:middle}
  .pmd-table td.num{text-align:right;font-variant-numeric:tabular-nums}
  .pmd-tr-clickable{cursor:pointer;transition:background .12s}
  .pmd-tr-clickable:hover td{background:var(--pm-bg)}
  .pmd-badge{display:inline-block;border-radius:4px;padding:2px 8px;font-size:.68rem;font-weight:800;text-transform:uppercase}
  .pmd-badge-running{background:#dbeafe;color:#1e40af}
  .pmd-badge-completed{background:#dcfce7;color:#166534}
  .pmd-badge-on_hold{background:#fef3c7;color:#92400e}
  .pmd-export-btn{display:inline-block;border:1px solid var(--pm-border);border-radius:5px;padding:3px 9px;font-size:.73rem;font-weight:700;color:var(--pm-accent);text-decoration:none;cursor:pointer;background:var(--pm-surface);transition:background .12s}
  .pmd-export-btn:hover{background:var(--pm-bg)}
  .pmd-empty{text-align:center;color:var(--pm-muted);font-size:.82rem;padding:2rem}
  @media(max-width:900px){.pmd-charts-row,.pmd-row-2{grid-template-columns:1fr}}
  @media(max-width:640px){.pmd-header{flex-direction:column}.pmd-stat-grid{grid-template-columns:repeat(2,1fr)}.pmd-filters{flex-direction:column}.pmd-input-sm{width:100%}}
`;
