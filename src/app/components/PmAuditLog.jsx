'use client';
import { useCallback, useEffect, useState } from 'react';

const tok = () => (typeof localStorage !== 'undefined' ? localStorage.getItem('admin-token') || localStorage.getItem('token') || '' : '');
async function apiFetch(url) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${tok()}` } });
  return r.json();
}

const RECORD_TYPE_OPTIONS = ['', 'party', 'project', 'payment', 'vendor', 'attendance', 'vendor_payment', 'material', 'pm_party_payments', 'pm_vendor_payments', 'pm_attendance', 'pm_material_received', 'pm_material_used'];
const ACTION_OPTIONS = ['', 'created', 'updated', 'deleted', 'soft_deleted', 'restored'];

function JsonDiff({ oldData, newData }) {
  if (!oldData && !newData) return <p style={{ color: 'var(--pal-muted)', fontSize: '.8rem' }}>No change data stored.</p>;
  const keys = Array.from(new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]));
  const changed = keys.filter(k => JSON.stringify((oldData || {})[k]) !== JSON.stringify((newData || {})[k]));
  if (!changed.length) return <p style={{ color: 'var(--pal-muted)', fontSize: '.8rem' }}>Record unchanged (metadata only).</p>;
  return (
    <table style={{ width: '100%', fontSize: '.78rem', borderCollapse: 'collapse' }}>
      <thead><tr>
        <th style={{ textAlign: 'left', padding: '4px 8px', background: 'var(--pal-bg)', color: 'var(--pal-muted)', fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.05em' }}>Field</th>
        <th style={{ textAlign: 'left', padding: '4px 8px', background: '#fee2e2', color: '#991b1b', fontSize: '.68rem', fontWeight: 800 }}>Before</th>
        <th style={{ textAlign: 'left', padding: '4px 8px', background: '#dcfce7', color: '#166534', fontSize: '.68rem', fontWeight: 800 }}>After</th>
      </tr></thead>
      <tbody>
        {changed.map(k => (
          <tr key={k} style={{ borderBottom: '1px solid var(--pal-border)' }}>
            <td style={{ padding: '4px 8px', fontWeight: 700, color: 'var(--pal-text)' }}>{k}</td>
            <td style={{ padding: '4px 8px', color: '#991b1b', wordBreak: 'break-all' }}>{JSON.stringify((oldData || {})[k] ?? null)}</td>
            <td style={{ padding: '4px 8px', color: '#166534', wordBreak: 'break-all' }}>{JSON.stringify((newData || {})[k] ?? null)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Drawer({ row, onClose }) {
  if (!row) return null;
  const old_data = row.old_data || null;
  const new_data = row.new_data || null;
  return (
    <div className="pal-drawer-backdrop" onClick={onClose}>
      <div className="pal-drawer" onClick={e => e.stopPropagation()}>
        <div className="pal-drawer-head">
          <strong>Change Detail — {row.record_type} #{row.record_id}</strong>
          <button className="pal-close" onClick={onClose}>✕</button>
        </div>
        <div className="pal-drawer-meta">
          <span><b>Action:</b> {row.action}</span>
          <span><b>By:</b> {row.changed_by}</span>
          <span><b>At:</b> {new Date(row.created_at).toLocaleString('en-IN')}</span>
        </div>
        <JsonDiff oldData={old_data} newData={new_data} />
      </div>
    </div>
  );
}

export default function PmAuditLog() {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 25, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ user: '', recordType: '', action: '', dateFrom: '', dateTo: '' });
  const [drawer, setDrawer] = useState(null);

  const load = useCallback(async (page = 1) => {
    setLoading(true);
    const sp = new URLSearchParams({ page: String(page), pageSize: '25' });
    if (filters.user) sp.set('user', filters.user);
    if (filters.recordType) sp.set('recordType', filters.recordType);
    if (filters.action) sp.set('action', filters.action);
    if (filters.dateFrom) sp.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) sp.set('dateTo', filters.dateTo);
    const d = await apiFetch(`/api/admin/project-management/audit-log?${sp}`);
    if (d.success) { setRows(d.data || []); setPagination(d.pagination); }
    setLoading(false);
  }, [filters]);

  useEffect(() => { load(1); }, [filters]);

  const cols = ['Date & Time', 'Admin', 'Record Type', 'Record ID', 'Action', 'Source', 'View'];

  return (
    <>
      <style>{CSS}</style>
      <Drawer row={drawer} onClose={() => setDrawer(null)} />
      <div className="pal-root">
        <div className="pal-header">
          <h1 className="pal-title">🗂 Activity Log</h1>
          <p className="pal-sub">Immutable record of all admin changes across PM tables</p>
        </div>

        {/* Filters */}
        <div className="pal-filters">
          <input className="pal-input" placeholder="Filter by admin…" value={filters.user} onChange={e => setFilters(f => ({ ...f, user: e.target.value }))} />
          <select className="pal-select" value={filters.recordType} onChange={e => setFilters(f => ({ ...f, recordType: e.target.value }))}>
            <option value="">All Record Types</option>
            {RECORD_TYPE_OPTIONS.filter(Boolean).map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <select className="pal-select" value={filters.action} onChange={e => setFilters(f => ({ ...f, action: e.target.value }))}>
            <option value="">All Actions</option>
            {ACTION_OPTIONS.filter(Boolean).map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <input className="pal-input" type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} />
          <input className="pal-input" type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} />
          <button className="pal-primary" onClick={() => load(1)}>Apply</button>
        </div>

        <div className="pal-card">
          {loading ? <p className="pal-empty">Loading audit log…</p> : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="pal-table">
                  <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
                  <tbody>
                    {!rows.length && <tr><td colSpan={cols.length} className="pal-empty">No audit log entries found.</td></tr>}
                    {rows.map((row, i) => (
                      <tr key={`${row.src}-${row.id}`} style={{ background: i % 2 === 0 ? undefined : 'var(--pal-bg)' }}>
                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(row.created_at).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.changed_by}</td>
                        <td><span className="pal-badge">{row.record_type}</span></td>
                        <td className="pal-num">#{row.record_id}</td>
                        <td><span className={`pal-action pal-action-${row.action}`}>{row.action}</span></td>
                        <td style={{ color: 'var(--pal-muted)', fontSize: '.7rem' }}>{row.src}</td>
                        <td>
                          <button className="pal-view-btn" onClick={() => setDrawer(row)}>View Change</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="pal-pagination">
                <span style={{ fontSize: '.8rem', color: 'var(--pal-muted)' }}>
                  {pagination.total} records · Page {pagination.page} of {pagination.totalPages}
                </span>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button className="pal-ghost" disabled={pagination.page <= 1} onClick={() => load(pagination.page - 1)}>← Prev</button>
                  <button className="pal-ghost" disabled={pagination.page >= pagination.totalPages} onClick={() => load(pagination.page + 1)}>Next →</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const CSS = `
  .pal-root{--pal-bg:#f5f5f7;--pal-surface:#fff;--pal-border:#e2e2e7;--pal-text:#111113;--pal-muted:#6b6b76;--pal-accent:#2563eb;
    background:var(--pal-bg);min-height:100%;font-family:'DM Sans',system-ui,sans-serif;color:var(--pal-text);padding:1.25rem}
  .dark-mode .pal-root{--pal-bg:#0f0f11;--pal-surface:#18181c;--pal-border:#2a2a30;--pal-text:#f0f0f5;--pal-muted:#7c7c8a;--pal-accent:#60a5fa}
  .pal-header{margin-bottom:1rem}
  .pal-title{font-size:1.3rem;font-weight:800;margin:0}
  .pal-sub{font-size:.78rem;color:var(--pal-muted);margin:.2rem 0 0}
  .pal-filters{display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:.75rem}
  .pal-input,.pal-select{border:1px solid var(--pal-border);border-radius:6px;background:var(--pal-surface);color:var(--pal-text);padding:.45rem .75rem;font-size:.82rem;outline:none}
  .pal-primary{border:0;border-radius:6px;background:var(--pal-accent);color:#fff;padding:.45rem 1rem;font-size:.82rem;font-weight:700;cursor:pointer}
  .pal-ghost{border:1px solid var(--pal-border);background:var(--pal-surface);color:var(--pal-text);border-radius:6px;padding:.35rem .75rem;font-size:.8rem;font-weight:700;cursor:pointer}
  .pal-ghost:disabled{opacity:.45;cursor:not-allowed}
  .pal-card{background:var(--pal-surface);border:1px solid var(--pal-border);border-radius:10px;overflow:hidden}
  .pal-table{width:100%;border-collapse:collapse;font-size:.8rem}
  .pal-table th{background:var(--pal-bg);border-bottom:2px solid var(--pal-border);padding:.55rem .85rem;text-align:left;font-size:.67rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--pal-muted);white-space:nowrap}
  .pal-table td{padding:.55rem .85rem;border-bottom:1px solid var(--pal-border);vertical-align:middle}
  .pal-num{text-align:right;font-variant-numeric:tabular-nums}
  .pal-badge{display:inline-block;background:var(--pal-bg);border:1px solid var(--pal-border);border-radius:4px;padding:1px 7px;font-size:.72rem;font-weight:700}
  .pal-action{display:inline-block;border-radius:4px;padding:1px 7px;font-size:.68rem;font-weight:800;text-transform:uppercase}
  .pal-action-created{background:#dcfce7;color:#166534}
  .pal-action-updated{background:#dbeafe;color:#1e40af}
  .pal-action-deleted,.pal-action-soft_deleted{background:#fee2e2;color:#991b1b}
  .pal-action-restored{background:#fef3c7;color:#92400e}
  .pal-view-btn{border:1px solid var(--pal-border);background:var(--pal-surface);color:var(--pal-accent);border-radius:5px;padding:.25rem .65rem;font-size:.72rem;font-weight:700;cursor:pointer;white-space:nowrap}
  .pal-view-btn:hover{background:var(--pal-bg)}
  .pal-pagination{display:flex;justify-content:space-between;align-items:center;padding:.75rem 1rem;border-top:1px solid var(--pal-border)}
  .pal-empty{text-align:center;padding:2rem;color:var(--pal-muted);font-size:.83rem}
  .pal-drawer-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:300;display:flex;justify-content:flex-end}
  .pal-drawer{background:var(--pal-surface);width:min(560px,100vw);height:100%;overflow-y:auto;padding:1.5rem;box-shadow:-4px 0 30px rgba(0,0,0,.2)}
  .pal-drawer-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;gap:.5rem}
  .pal-drawer-head strong{font-size:.95rem;font-weight:800}
  .pal-close{background:none;border:none;font-size:1.1rem;cursor:pointer;color:var(--pal-muted);padding:.2rem}
  .pal-drawer-meta{display:flex;flex-wrap:wrap;gap:.5rem 1.25rem;margin-bottom:1rem;font-size:.78rem;color:var(--pal-muted);border-bottom:1px solid var(--pal-border);padding-bottom:.75rem}
  .pal-drawer-meta b{color:var(--pal-text)}
  @media(max-width:640px){.pal-filters{flex-direction:column}.pal-drawer{width:100vw}}
`;
