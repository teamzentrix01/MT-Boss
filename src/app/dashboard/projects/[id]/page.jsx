'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const projectStatuses = ['lead', 'estimate_sent', 'final', 'started', 'ongoing', 'on_hold', 'completed', 'cancelled', 'lost'];
const entryTypes = ['payment', 'labour', 'material', 'expense', 'media'];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function money(value) {
  return `Rs ${Number(value || 0).toLocaleString('en-IN')}`;
}

function dateOnly(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

export default function AdminProjectManagementPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [project, setProject] = useState(null);
  const [agents, setAgents] = useState([]);
  const [ops, setOps] = useState({ payments: [], labour: [], materials: [], expenses: [], media: [] });
  const [entryType, setEntryType] = useState('payment');
  const [entryForm, setEntryForm] = useState({});
  const [form, setForm] = useState({
    project_status: 'lead',
    deal_amount: '',
    client_name: '',
    client_phone: '',
    client_email: '',
    project_notes: '',
    assigned_agent_id: '',
  });
  const [message, setMessage] = useState('');

  const token = () => localStorage.getItem('admin-token') || localStorage.getItem('token');

  async function authFetch(url, options = {}) {
    const t = token();
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
    });

    if (res.status === 401 || res.status === 403) {
      router.push('/login');
      return null;
    }

    return res;
  }

  async function loadProject() {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await authFetch(`/api/projects/${projectId}?manage=1`);
      if (!res) return;
      const data = await res.json();
      if (!data.success) {
        setMessage(data.error || 'Project could not be loaded.');
        return;
      }

      setProject(data.project);
      setAgents(data.agents || []);
      setOps({
        payments: data.payments || [],
        labour: data.labour || [],
        materials: data.materials || [],
        expenses: data.expenses || [],
        media: data.media || [],
      });
      setForm({
        project_status: data.project.project_status || 'lead',
        deal_amount: data.project.deal_amount || '',
        client_name: data.project.client_name || '',
        client_phone: data.project.client_phone || '',
        client_email: data.project.client_email || '',
        project_notes: data.project.project_notes || '',
        assigned_agent_id: data.project.assigned_agent_id || '',
      });
    } catch (error) {
      console.error(error);
      setMessage('Project could not be loaded.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const totals = useMemo(() => {
    const received = Number(project?.total_received || 0);
    const labour = Number(project?.labour_cost || 0);
    const labourPaid = Number(project?.labour_paid || 0);
    const material = Number(project?.material_cost || 0);
    const other = Number(project?.extra_expense || 0);
    const spent = labour + material + other;
    const profit = received - spent;

    return { received, labour, labourPaid, material, other, spent, profit };
  }, [project]);

  async function saveProject(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res) return;
      const data = await res.json();
      if (!data.success) {
        setMessage(data.error || 'Project could not be saved.');
        return;
      }
      setProject(data.data);
      setMessage('Project updated.');
      await loadProject();
    } finally {
      setSaving(false);
    }
  }

  async function addEntry(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch(`/api/projects/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry_type: entryType, ...entryForm }),
      });
      if (!res) return;
      const data = await res.json();
      if (!data.success) {
        setMessage(data.error || 'Entry could not be added.');
        return;
      }
      setEntryForm({});
      setMessage('Entry added.');
      await loadProject();
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(type, id) {
    if (!confirm('Delete this entry?')) return;
    const res = await authFetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_type: type, id }),
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      setMessage('Entry deleted.');
      await loadProject();
    } else {
      setMessage(data.error || 'Entry could not be deleted.');
    }
  }

  const input = 'ap-input';

  if (loading) {
    return <main className="ap-page"><div className="ap-empty">Loading project...</div></main>;
  }

  if (!project) {
    return (
      <main className="ap-page">
        <style>{pageStyles}</style>
        <div className="ap-empty">Project not found.</div>
      </main>
    );
  }

  return (
    <main className="ap-page">
      <style>{pageStyles}</style>

      <div className="ap-wrap">
        <div className="ap-head">
          <button className="ap-ghost" onClick={() => router.push('/dashboard?tab=projects')}>Back to Projects</button>
          <div className="ap-title-row">
            <div>
              <p className="ap-kicker">Project Management</p>
              <h1>{project.title}</h1>
              <p className="ap-muted">{project.category} | {project.location || 'Location not set'}</p>
            </div>
            <span className="ap-status">{project.project_status || 'lead'}</span>
          </div>
        </div>

        {message && <div className="ap-message">{message}</div>}

        <section className="ap-stats">
          <div className="ap-stat"><span>Received From Client</span><strong>{money(totals.received)}</strong></div>
          <div className="ap-stat"><span>Material Expenses</span><strong>{money(totals.material)}</strong></div>
          <div className="ap-stat"><span>Labour Charge</span><strong>{money(totals.labour)}</strong></div>
          <div className="ap-stat"><span>Other Payments</span><strong>{money(totals.other)}</strong></div>
          <div className="ap-stat"><span>Total Spent</span><strong>{money(totals.spent)}</strong></div>
          <div className={`ap-stat ${totals.profit >= 0 ? 'good' : 'bad'}`}><span>Left Profit</span><strong>{money(totals.profit)}</strong></div>
        </section>

        <section className="ap-grid">
          <form className="ap-panel" onSubmit={saveProject}>
            <div className="ap-panel-head">
              <div>
                <h2>Project Control</h2>
                <p>Track status, client details, deal value, and admin notes.</p>
              </div>
            </div>

            <div className="ap-form-grid">
              <label>
                <span>Status</span>
                <select className={input} value={form.project_status} onChange={(e) => setForm((f) => ({ ...f, project_status: e.target.value }))}>
                  {projectStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
              <label>
                <span>Deal Amount</span>
                <input className={input} type="number" value={form.deal_amount} onChange={(e) => setForm((f) => ({ ...f, deal_amount: e.target.value }))} />
              </label>
              <label className="wide">
                <span>Assign Project To</span>
                <select className={input} value={form.assigned_agent_id} onChange={(e) => setForm((f) => ({ ...f, assigned_agent_id: e.target.value }))}>
                  <option value="">Unassigned</option>
                  {agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}{agent.city ? ` - ${agent.city}` : ''}</option>)}
                </select>
              </label>
              <label>
                <span>Client Name</span>
                <input className={input} value={form.client_name} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} />
              </label>
              <label>
                <span>Client Phone</span>
                <input className={input} value={form.client_phone} onChange={(e) => setForm((f) => ({ ...f, client_phone: e.target.value }))} />
              </label>
              <label className="wide">
                <span>Client Email</span>
                <input className={input} type="email" value={form.client_email} onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))} />
              </label>
              <label className="wide">
                <span>Labour Note / Admin Notes</span>
                <textarea className={input} rows={4} value={form.project_notes} onChange={(e) => setForm((f) => ({ ...f, project_notes: e.target.value }))} />
              </label>
            </div>

            <button className="ap-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Project'}</button>
          </form>

          <form className="ap-panel" onSubmit={addEntry}>
            <div className="ap-panel-head">
              <div>
                <h2>Add Entry</h2>
                <p>Record payments, purchase orders, labour, materials, and site media.</p>
              </div>
              <select className="ap-type" value={entryType} onChange={(e) => { setEntryType(e.target.value); setEntryForm({}); }}>
                {entryTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            {entryType === 'payment' && (
              <div className="ap-form-grid">
                <Field label="Amount Received" type="number" value={entryForm.amount} onChange={(value) => setEntryForm((f) => ({ ...f, amount: value }))} required />
                <Field label="Date" type="date" value={entryForm.payment_date || todayIso()} onChange={(value) => setEntryForm((f) => ({ ...f, payment_date: value }))} />
                <Field label="Mode" value={entryForm.payment_mode} onChange={(value) => setEntryForm((f) => ({ ...f, payment_mode: value }))} />
                <Field label="Note" className="wide" value={entryForm.notes} onChange={(value) => setEntryForm((f) => ({ ...f, notes: value }))} />
              </div>
            )}

            {entryType === 'labour' && (
              <div className="ap-form-grid">
                <Field label="Labour Name" value={entryForm.labour_name} onChange={(value) => setEntryForm((f) => ({ ...f, labour_name: value }))} required />
                <Field label="Role" value={entryForm.labour_role} onChange={(value) => setEntryForm((f) => ({ ...f, labour_role: value }))} />
                <Field label="Work Date" type="date" value={entryForm.work_date || todayIso()} onChange={(value) => setEntryForm((f) => ({ ...f, work_date: value }))} />
                <label>
                  <span>Attendance</span>
                  <select className={input} value={entryForm.attendance_status || 'present'} onChange={(e) => setEntryForm((f) => ({ ...f, attendance_status: e.target.value }))}>
                    {['present', 'half_day', 'absent'].map((status) => <option key={status}>{status}</option>)}
                  </select>
                </label>
                <Field label="Wage Amount" type="number" value={entryForm.wage_amount} onChange={(value) => setEntryForm((f) => ({ ...f, wage_amount: value }))} />
                <Field label="Paid Amount" type="number" value={entryForm.paid_amount} onChange={(value) => setEntryForm((f) => ({ ...f, paid_amount: value }))} />
                <Field label="Labour Note" className="wide" value={entryForm.notes} onChange={(value) => setEntryForm((f) => ({ ...f, notes: value }))} />
              </div>
            )}

            {entryType === 'material' && (
              <div className="ap-form-grid">
                <Field label="Material / PO Item" value={entryForm.material_name} onChange={(value) => setEntryForm((f) => ({ ...f, material_name: value }))} required />
                <Field label="Quantity" type="number" value={entryForm.quantity} onChange={(value) => setEntryForm((f) => ({ ...f, quantity: value }))} />
                <Field label="Unit" value={entryForm.unit} onChange={(value) => setEntryForm((f) => ({ ...f, unit: value }))} />
                <Field label="Rate" type="number" value={entryForm.rate} onChange={(value) => setEntryForm((f) => ({ ...f, rate: value }))} />
                <Field label="Total Amount" type="number" value={entryForm.total_amount} onChange={(value) => setEntryForm((f) => ({ ...f, total_amount: value }))} />
                <Field label="Supplier" value={entryForm.supplier_name} onChange={(value) => setEntryForm((f) => ({ ...f, supplier_name: value }))} />
                <Field label="Vehicle No." value={entryForm.vehicle_number} onChange={(value) => setEntryForm((f) => ({ ...f, vehicle_number: value }))} />
                <Field label="Bill URL" value={entryForm.bill_url} onChange={(value) => setEntryForm((f) => ({ ...f, bill_url: value }))} />
                <Field label="Entry Date" type="date" value={entryForm.entry_date || todayIso()} onChange={(value) => setEntryForm((f) => ({ ...f, entry_date: value }))} />
                <Field label="Note" className="wide" value={entryForm.notes} onChange={(value) => setEntryForm((f) => ({ ...f, notes: value }))} />
              </div>
            )}

            {entryType === 'expense' && (
              <div className="ap-form-grid">
                <Field label="Payment Type" value={entryForm.expense_type} onChange={(value) => setEntryForm((f) => ({ ...f, expense_type: value }))} required />
                <Field label="Amount" type="number" value={entryForm.amount} onChange={(value) => setEntryForm((f) => ({ ...f, amount: value }))} required />
                <Field label="Date" type="date" value={entryForm.expense_date || todayIso()} onChange={(value) => setEntryForm((f) => ({ ...f, expense_date: value }))} />
                <Field label="Note" className="wide" value={entryForm.notes} onChange={(value) => setEntryForm((f) => ({ ...f, notes: value }))} />
              </div>
            )}

            {entryType === 'media' && (
              <div className="ap-form-grid">
                <Field label="Media URL" value={entryForm.media_url} onChange={(value) => setEntryForm((f) => ({ ...f, media_url: value }))} required />
                <label>
                  <span>Type</span>
                  <select className={input} value={entryForm.media_type || 'photo'} onChange={(e) => setEntryForm((f) => ({ ...f, media_type: e.target.value }))}>
                    {['photo', 'video', 'bill'].map((type) => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <Field label="Date" type="date" value={entryForm.media_date || todayIso()} onChange={(value) => setEntryForm((f) => ({ ...f, media_date: value }))} />
                <Field label="Caption" className="wide" value={entryForm.caption} onChange={(value) => setEntryForm((f) => ({ ...f, caption: value }))} />
              </div>
            )}

            <button className="ap-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Entry'}</button>
          </form>
        </section>

        <section className="ap-history">
          <History title="Received Money" type="payment" rows={ops.payments} onDelete={deleteEntry} render={(row) => (
            <>
              <strong>{money(row.amount)}</strong>
              <span>{dateOnly(row.payment_date)} {row.payment_mode ? `| ${row.payment_mode}` : ''}</span>
              {row.notes && <p>{row.notes}</p>}
            </>
          )} />
          <History title="Labour Charges" type="labour" rows={ops.labour} onDelete={deleteEntry} render={(row) => (
            <>
              <strong>{row.labour_name} - {money(row.wage_amount)}</strong>
              <span>{dateOnly(row.work_date)} | paid {money(row.paid_amount)} | {row.attendance_status}</span>
              {row.notes && <p>{row.notes}</p>}
            </>
          )} />
          <History title="Material / Purchase Orders" type="material" rows={ops.materials} onDelete={deleteEntry} render={(row) => (
            <>
              <strong>{row.material_name} - {money(row.total_amount)}</strong>
              <span>{dateOnly(row.entry_date)} | {row.quantity} {row.unit || ''} x {money(row.rate)}</span>
              {(row.supplier_name || row.vehicle_number || row.notes) && <p>{[row.supplier_name, row.vehicle_number, row.notes].filter(Boolean).join(' | ')}</p>}
            </>
          )} />
          <History title="Other Payments" type="expense" rows={ops.expenses} onDelete={deleteEntry} render={(row) => (
            <>
              <strong>{row.expense_type} - {money(row.amount)}</strong>
              <span>{dateOnly(row.expense_date)}</span>
              {row.notes && <p>{row.notes}</p>}
            </>
          )} />
          <History title="Site Media / Bills" type="media" rows={ops.media} onDelete={deleteEntry} render={(row) => (
            <>
              <strong>{row.media_type} - {dateOnly(row.media_date)}</strong>
              <span>{row.caption || row.media_url}</span>
              {row.media_url && <a href={row.media_url} target="_blank" rel="noreferrer">Open file</a>}
            </>
          )} />
        </section>
      </div>
    </main>
  );
}

function Field({ label, value = '', onChange, type = 'text', required = false, className = '' }) {
  return (
    <label className={className}>
      <span>{label}</span>
      <input className="ap-input" type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </label>
  );
}

function History({ title, type, rows, render, onDelete }) {
  return (
    <div className="ap-panel">
      <div className="ap-panel-head">
        <div>
          <h2>{title}</h2>
          <p>{rows.length} entr{rows.length === 1 ? 'y' : 'ies'}</p>
        </div>
      </div>
      <div className="ap-list">
        {rows.length === 0 ? (
          <div className="ap-list-empty">No entries yet.</div>
        ) : rows.map((row) => (
          <div className="ap-row" key={row.id}>
            <div>{render(row)}</div>
            <button type="button" onClick={() => onDelete(type, row.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const pageStyles = `
  .ap-page{min-height:100%;background:var(--bg,#f5f5f7);color:var(--text,#111);font-family:'DM Sans',system-ui,sans-serif}
  .ap-wrap{max-width:1280px;margin:0 auto;padding:1.25rem}
  .ap-head{display:flex;flex-direction:column;gap:1rem;margin-bottom:1rem}
  .ap-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
  .ap-kicker{margin:0 0 .25rem;color:var(--accent,#2563eb);font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em}
  .ap-title-row h1{margin:0;font-size:1.65rem;line-height:1.15}
  .ap-muted{margin:.25rem 0 0;color:var(--muted,#6b7280);font-size:.85rem}
  .ap-ghost{width:max-content;border:1px solid var(--border,#e5e7eb);background:var(--surface,#fff);color:var(--text,#111);border-radius:6px;padding:.5rem .85rem;font-size:.78rem;font-weight:800;cursor:pointer}
  .ap-status{border-radius:999px;background:var(--accent-lt,#eff6ff);color:var(--accent,#2563eb);padding:.35rem .75rem;font-size:.72rem;font-weight:900;text-transform:uppercase;white-space:nowrap}
  .ap-message{border:1px solid var(--border,#e5e7eb);background:var(--surface,#fff);border-left:4px solid var(--accent,#2563eb);border-radius:7px;padding:.75rem 1rem;margin-bottom:1rem;font-size:.85rem;font-weight:700}
  .ap-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:.75rem;margin-bottom:1rem}
  .ap-stat{background:var(--surface,#fff);border:1px solid var(--border,#e5e7eb);border-radius:8px;padding:.9rem}
  .ap-stat span{display:block;color:var(--muted,#6b7280);font-size:.67rem;text-transform:uppercase;letter-spacing:.06em;font-weight:800}
  .ap-stat strong{display:block;margin-top:.3rem;font-size:1.1rem}
  .ap-stat.good strong{color:#15803d}.ap-stat.bad strong{color:#b91c1c}
  .ap-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:1rem;align-items:start}
  .ap-panel{background:var(--surface,#fff);border:1px solid var(--border,#e5e7eb);border-radius:8px;padding:1rem}
  .ap-panel-head{display:flex;justify-content:space-between;align-items:flex-start;gap:.75rem;margin-bottom:1rem}
  .ap-panel h2{margin:0;font-size:.95rem}.ap-panel p{margin:.25rem 0 0;color:var(--muted,#6b7280);font-size:.78rem}
  .ap-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem}
  .ap-form-grid label{display:flex;flex-direction:column;gap:.32rem}.ap-form-grid .wide{grid-column:1/-1}
  .ap-form-grid span{font-size:.68rem;font-weight:900;color:var(--muted,#6b7280);text-transform:uppercase;letter-spacing:.05em}
  .ap-input,.ap-type{width:100%;box-sizing:border-box;border:1px solid var(--border,#d4d4d8);border-radius:6px;background:var(--bg,#fafafa);color:var(--text,#111);padding:.65rem .75rem;font:inherit;font-size:.84rem;outline:none}
  textarea.ap-input{resize:vertical}.ap-input:focus,.ap-type:focus{border-color:var(--accent,#2563eb);background:var(--surface,#fff)}
  .ap-primary{margin-top:1rem;border:0;border-radius:6px;background:var(--accent,#2563eb);color:#fff;padding:.65rem 1rem;font-size:.78rem;font-weight:900;cursor:pointer}
  .ap-primary:disabled{opacity:.6;cursor:not-allowed}
  .ap-history{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-top:1rem}
  .ap-list{display:flex;flex-direction:column;gap:.55rem}
  .ap-list-empty{color:var(--muted,#6b7280);font-size:.8rem;padding:.8rem;background:var(--bg,#fafafa);border-radius:6px}
  .ap-row{display:flex;justify-content:space-between;gap:.75rem;border:1px solid var(--border,#e5e7eb);border-radius:7px;padding:.75rem;background:var(--bg,#fafafa)}
  .ap-row strong{display:block;font-size:.84rem}.ap-row span,.ap-row p,.ap-row a{display:block;margin-top:.2rem;color:var(--muted,#6b7280);font-size:.76rem;line-height:1.45}
  .ap-row a{color:var(--accent,#2563eb);font-weight:800;text-decoration:none}
  .ap-row button{align-self:flex-start;border:1px solid #fecaca;background:#fff1f2;color:#b91c1c;border-radius:5px;padding:.32rem .55rem;font-size:.7rem;font-weight:800;cursor:pointer}
  .ap-empty{min-height:45vh;display:flex;align-items:center;justify-content:center;color:var(--muted,#6b7280);font-weight:700}
  @media(max-width:1100px){.ap-stats{grid-template-columns:repeat(3,1fr)}.ap-grid,.ap-history{grid-template-columns:1fr}}
  @media(max-width:680px){.ap-wrap{padding:1rem}.ap-title-row{flex-direction:column}.ap-stats,.ap-form-grid{grid-template-columns:1fr}.ap-form-grid .wide{grid-column:auto}.ap-row{flex-direction:column}}
`;
