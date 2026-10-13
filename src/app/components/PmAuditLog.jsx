'use client';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

const tok = () => (typeof localStorage !== 'undefined' ? localStorage.getItem('admin-token') || localStorage.getItem('token') || '' : '');
async function apiFetch(url) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${tok()}` } });
  return r.json();
}

const RECORD_TYPE_OPTIONS = ['', 'party', 'project', 'payment', 'vendor', 'attendance', 'vendor_payment', 'material', 'pm_party_payments', 'pm_vendor_payments', 'pm_attendance', 'pm_material_received', 'pm_material_used'];
const ACTION_OPTIONS = ['', 'created', 'updated', 'deleted', 'soft_deleted', 'restored'];

function formatDiffValue(val) {
  if (val === undefined || val === null) return 'null';
  if (typeof val === 'string') return val === '' ? '""' : val;
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return JSON.stringify(val);
    }
  }
  return String(val);
}

function JsonDiff({ oldData, newData }) {
  if (!oldData && !newData) return <p style={{ color: 'var(--pal-muted)', fontSize: '.8rem' }}>No change data stored.</p>;
  const keys = Array.from(new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]));
  const changed = keys.filter(k => JSON.stringify((oldData || {})[k]) !== JSON.stringify((newData || {})[k]));
  if (!changed.length) return <p style={{ color: 'var(--pal-muted)', fontSize: '.8rem' }}>Record unchanged (metadata only).</p>;
  return (
    <div className="pal-diff-wrapper">
      <table className="pal-diff-table">
        <colgroup>
          <col style={{ width: '26%' }} />
          <col style={{ width: '37%' }} />
          <col style={{ width: '37%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="pal-diff-th pal-diff-th-field">Field</th>
            <th className="pal-diff-th pal-diff-th-before">Before</th>
            <th className="pal-diff-th pal-diff-th-after">After</th>
          </tr>
        </thead>
        <tbody>
          {changed.map(k => (
            <tr key={k}>
              <td className="pal-diff-td pal-diff-field">
                <code>{k}</code>
              </td>
              <td className="pal-diff-td pal-diff-cell pal-diff-before">
                <div className="pal-diff-val">
                  {formatDiffValue((oldData || {})[k])}
                </div>
              </td>
              <td className="pal-diff-td pal-diff-cell pal-diff-after">
                <div className="pal-diff-val">
                  {formatDiffValue((newData || {})[k])}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const emptySubscribe = () => () => {};

function Drawer({ row, onClose, isDarkMode }) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!row) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [row, onClose]);

  if (!mounted || !row || typeof document === 'undefined') return null;

  const old_data = row.old_data || null;
  const new_data = row.new_data || null;

  const drawerContent = (
    <div
      className={`pal-drawer-backdrop${isDarkMode ? ' dark-mode' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Change Detail — ${row.record_type} #${row.record_id}`}
    >
      <div className="pal-drawer" onClick={e => e.stopPropagation()}>
        <div className="pal-drawer-head">
          <strong>Change Detail — {row.record_type} #{row.record_id}</strong>
          <button
            type="button"
            className="pal-close"
            onClick={onClose}
            aria-label="Close"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>
        <div className="pal-drawer-body">
          <div className="pal-drawer-meta">
            <span><b>Action:</b> <span className={`pal-action pal-action-${row.action}`}>{row.action}</span></span>
            <span><b>By:</b> {row.changed_by || '—'}</span>
            <span><b>At:</b> {new Date(row.created_at).toLocaleString('en-IN')}</span>
          </div>
          <JsonDiff oldData={old_data} newData={new_data} />
        </div>
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
}

export default function PmAuditLog({ isDarkMode }) {
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

  useEffect(() => {
    let ignore = false;
    (async () => {
      await Promise.resolve();
      if (!ignore) {
        load(1);
      }
    })();
    return () => { ignore = true; };
  }, [load]);

  const cols = ['Date & Time', 'Admin', 'Record Type', 'Record ID', 'Action', 'Source', 'View'];

  return (
    <>
      <style>{CSS}</style>
      <Drawer row={drawer} onClose={() => setDrawer(null)} isDarkMode={isDarkMode} />
      <div className={`pal-root${isDarkMode ? ' dark-mode' : ''}`}>
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
    background:var(--pal-bg);min-height:100%;font-family:'DM Sans',system-ui,sans-serif;color:var(--pal-text);padding:1.25rem;flex:1;display:flex;flex-direction:column;box-sizing:border-box}
  .dark-mode.pal-root, .dark-mode .pal-root{--pal-bg:#0f0f11;--pal-surface:#18181c;--pal-border:#2a2a30;--pal-text:#f0f0f5;--pal-muted:#7c7c8a;--pal-accent:#60a5fa}
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

  /* Drawer portal backdrop and layout */
  .pal-drawer-backdrop{
    --pal-bg:var(--bg,#f5f5f7);
    --pal-surface:var(--surface,#ffffff);
    --pal-border:var(--border,#e2e2e7);
    --pal-text:var(--text,#111113);
    --pal-muted:var(--muted,#6b6b76);
    --pal-accent:var(--accent,#2563eb);
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.55);
    z-index:99999;
    display:flex;
    justify-content:flex-end;
    backdrop-filter:blur(2px);
    -webkit-backdrop-filter:blur(2px);
    box-sizing:border-box;
    font-family:'DM Sans',system-ui,sans-serif;
  }
  .pal-drawer-backdrop.dark-mode,
  :root.dark-mode .pal-drawer-backdrop,
  .dark-mode .pal-drawer-backdrop{
    --pal-bg:var(--bg,#0f0f11);
    --pal-surface:var(--surface,#18181c);
    --pal-border:var(--border,#2a2a30);
    --pal-text:var(--text,#f0f0f5);
    --pal-muted:var(--muted,#7c7c8a);
    --pal-accent:var(--accent,#60a5fa);
    background:rgba(0,0,0,.7);
  }
  .pal-drawer{
    position:fixed;
    top:0;
    right:0;
    height:100dvh;
    width:min(640px,100vw);
    background:var(--pal-surface);
    color:var(--pal-text);
    border-left:1px solid var(--pal-border);
    box-shadow:-4px 0 32px rgba(0,0,0,.28);
    overflow-y:auto;
    box-sizing:border-box;
    display:flex;
    flex-direction:column;
    z-index:100000;
  }
  .pal-drawer-head{
    position:sticky;
    top:0;
    z-index:20;
    background:var(--pal-surface);
    border-bottom:1px solid var(--pal-border);
    padding:max(1.25rem, env(safe-area-inset-top, 1.25rem)) 1.5rem 1rem 1.5rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:1rem;
    flex-shrink:0;
  }
  .pal-drawer-head strong{
    font-size:1rem;
    font-weight:800;
    color:var(--pal-text);
    word-break:break-word;
  }
  .pal-close{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    width:2rem;
    height:2rem;
    background:var(--pal-bg);
    border:1px solid var(--pal-border);
    border-radius:6px;
    font-size:1.1rem;
    line-height:1;
    color:var(--pal-muted);
    cursor:pointer;
    transition:all .15s ease;
    flex-shrink:0;
    padding:0;
  }
  .pal-close:hover{
    background:#fee2e2;
    color:#dc2626;
    border-color:#fca5a5;
  }
  .dark-mode .pal-close:hover,
  :root.dark-mode .pal-close:hover,
  .pal-drawer-backdrop.dark-mode .pal-close:hover{
    background:#451a1a;
    color:#fca5a5;
    border-color:#7f1d1d;
  }
  .pal-drawer-body{
    padding:1.25rem 1.5rem 2.5rem 1.5rem;
    flex:1;
    display:flex;
    flex-direction:column;
    gap:1rem;
    box-sizing:border-box;
  }
  .pal-drawer-meta{
    display:flex;
    flex-wrap:wrap;
    gap:.5rem 1.25rem;
    font-size:.78rem;
    color:var(--pal-muted);
    border-bottom:1px solid var(--pal-border);
    padding-bottom:.75rem;
  }
  .pal-drawer-meta b{
    color:var(--pal-text);
  }

  /* Diff table */
  .pal-diff-wrapper{width:100%;overflow-x:hidden}
  .pal-diff-table{width:100%;table-layout:fixed;border-collapse:collapse;font-size:.78rem;border:1px solid var(--pal-border);border-radius:6px;overflow:hidden;background:var(--pal-surface)}
  .pal-diff-th{padding:6px 10px;text-align:left;font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em;border-bottom:2px solid var(--pal-border);white-space:nowrap}
  .pal-diff-th-field{background:var(--pal-bg);color:var(--pal-muted)}
  .pal-diff-th-before{background:#fee2e2;color:#991b1b}
  .pal-diff-th-after{background:#dcfce7;color:#166534}
  .pal-diff-td{padding:6px 10px;border-bottom:1px solid var(--pal-border);vertical-align:top;box-sizing:border-box}
  .pal-diff-table tr:last-child .pal-diff-td{border-bottom:none}
  .pal-diff-field{background:var(--pal-bg);color:var(--pal-text);font-weight:700;word-break:break-word;overflow-wrap:anywhere}
  .pal-diff-field code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.74rem}
  .pal-diff-cell{word-break:break-word;overflow-wrap:anywhere}
  .pal-diff-before{color:#991b1b;background:#fef2f2}
  .pal-diff-after{color:#166534;background:#f0fdf4}
  .pal-diff-val{word-break:break-word;overflow-wrap:anywhere;white-space:pre-wrap;max-height:240px;overflow-y:auto;font-size:.76rem;line-height:1.45}
  .pal-diff-val::-webkit-scrollbar{width:4px}
  .pal-diff-val::-webkit-scrollbar-thumb{background:var(--pal-border);border-radius:2px}

  .dark-mode .pal-diff-th-before, :root.dark-mode .pal-diff-th-before, .pal-drawer-backdrop.dark-mode .pal-diff-th-before{background:#451a1a;color:#fca5a5}
  .dark-mode .pal-diff-th-after, :root.dark-mode .pal-diff-th-after, .pal-drawer-backdrop.dark-mode .pal-diff-th-after{background:#143d22;color:#86efac}
  .dark-mode .pal-diff-before, :root.dark-mode .pal-diff-before, .pal-drawer-backdrop.dark-mode .pal-diff-before{color:#fca5a5;background:rgba(239,68,68,.12)}
  .dark-mode .pal-diff-after, :root.dark-mode .pal-diff-after, .pal-drawer-backdrop.dark-mode .pal-diff-after{color:#86efac;background:rgba(34,197,94,.12)}

  @media(max-width:640px){
    .pal-filters{flex-direction:column}
    .pal-drawer{width:100vw;width:100dvw;border-left:none}
    .pal-drawer-head{padding:max(1rem, env(safe-area-inset-top, 1rem)) 1rem .85rem 1rem}
    .pal-drawer-body{padding:1rem 1rem 2rem 1rem}
  }
`;
